import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase, isSubscriptionValid } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import LoadingScreen from "@/components/Auth/LoadingScreen";

// Configuração de dias para expiração do login persistente
const DIAS_EXPIRACAO_LOGIN = 7;

interface UserData {
  id: string;
  email: string;
  nome_empresa: string;
  data_validade: string;
  ativo: boolean | null;
  is_admin: boolean | null;
}

interface SignUpResult {
  success: boolean;
  message: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  subscriptionExpired: boolean;
  signIn: (email: string, password: string, manterLogado?: boolean) => Promise<{ success: boolean; message: string }>;
  signUp: (email: string, password: string, nome_empresa: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [jaRedirecionou, setJaRedirecionou] = useState(false);
  const navigate = useNavigate();

  // Função para carregar dados do usuário com retry automático
  const fetchUserData = async (userId: string, retries = 3): Promise<UserData | null> => {
    try {
      for (let i = 0; i < retries; i++) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.error(`Tentativa ${i + 1} - Erro na consulta do usuário:`, error);
          if (i === retries - 1) return null;
          await new Promise((res) => setTimeout(res, 300));
          continue;
        }

        if (data) {
          return data as UserData;
        }

        // Se não encontrou dados, aguarda antes da próxima tentativa
        if (i < retries - 1) {
          await new Promise((res) => setTimeout(res, 300));
        }
      }

      console.warn("Usuário não encontrado na tabela users após todas as tentativas:", userId);
      return null;
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
      return null;
    }
  };

  // Verificar expiração da sessão persistente
  useEffect(() => {
    const verificarExpiracaoSessao = () => {
      try {
        const lastLoginStr = localStorage.getItem('last_login_date');
        
        if (!lastLoginStr) return;
        
        const lastLogin = new Date(lastLoginStr);
        const diasDesdeUltimoAcesso = (Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);
        
        if (diasDesdeUltimoAcesso > DIAS_EXPIRACAO_LOGIN) {
          console.log(`Sessão expirada após ${diasDesdeUltimoAcesso.toFixed(1)} dias de inatividade`);
          
          signOut();
          
          setTimeout(() => {
            toast.info("Sua sessão expirou por inatividade. Faça login novamente.");
          }, 500);
        }
      } catch (error) {
        console.error("Erro ao verificar expiração da sessão:", error);
      }
    };

    // Verificar ao montar o componente
    verificarExpiracaoSessao();
    
    // Também verificar quando a janela ganha foco
    window.addEventListener('focus', verificarExpiracaoSessao);
    
    return () => {
      window.removeEventListener('focus', verificarExpiracaoSessao);
    };
  }, []);

  // Timeout de segurança para prevenir loading infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.error("Timeout de carregamento do perfil de usuário");
        toast.error("Tempo esgotado. Refaça o login.");
        
        sessionStorage.removeItem("relatorio_id");
        localStorage.clear();
        
        navigate("/auth");
        setLoading(false);
      }
    }, 15000);

    return () => clearTimeout(timeout);
  }, [loading, navigate]);

  // Limpeza dos dados locais sempre que uma nova sessão de usuário é iniciada
  useEffect(() => {
    if (session) {
      console.log("Nova sessão iniciada. Limpando dados residuais...");
      localStorage.clear();
      sessionStorage.clear();
    }
  }, [session]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setUserData(null);
          setJaRedirecionou(false);
          localStorage.clear();
          sessionStorage.clear();
          return;
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Efeito separado para carregar dados do usuário quando a sessão mudar
  useEffect(() => {
    const carregarDados = async () => {
      if (!session?.user) {
        setUserData(null);
        return;
      }

      setLoading(true);
      setJaRedirecionou(false);
      
      try {
        localStorage.clear();
        sessionStorage.clear();
        
        // Delay para evitar race condition com Supabase Auth
        await new Promise((res) => setTimeout(res, 300));
        
        const data = await fetchUserData(session.user.id);

        if (!data) {
          console.error("Não foi possível carregar dados do usuário");
          if (!loading) {
            toast.error("Erro: seu cadastro está incompleto. Contate a equipe.");
          }
          setUserData(null);
          navigate("/auth");
          return;
        }

        setUserData(data);
        
        // Toast de sucesso apenas após confirmar userData
        toast.success("Login realizado com sucesso!");
        
        // Verificar expiração da assinatura
        const hoje = new Date();
        const validade = new Date(data.data_validade);
        const expired = validade < hoje && !data.is_admin;
        
        setSubscriptionExpired(expired);
        
        // Redirecionar baseado no tipo de usuário - com controle de múltiplas chamadas
        if (!jaRedirecionou) {
          setJaRedirecionou(true);
          if (data.is_admin) {
            navigate("/admin");
          } else if (expired) {
            navigate("/expired");
          } else {
            const currentPath = window.location.pathname;
            if (currentPath === "/auth") {
              navigate("/");
            }
          }
        }
        
        sessionStorage.removeItem("relatorio_id");
        
      } catch (error) {
        console.error('Erro crítico ao processar dados do usuário:', error);
        if (!loading) {
          toast.error("Ocorreu um erro ao processar seus dados. Tente novamente.");
        }
        setUserData(null);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [session, navigate]);

  const signIn = async (email: string, password: string, manterLogado = false) => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (manterLogado) {
        localStorage.setItem('last_login_date', new Date().toISOString());
        
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      } else {
        localStorage.removeItem('last_login_date');
        sessionStorage.setItem('sb-auth-token', JSON.stringify(data.session));
      }

      // Removido toast.success daqui - será exibido após userData confirmado
      return { success: true, message: "Processando login..." };
    } catch (error: any) {
      return { success: false, message: error.message || "Erro ao fazer login" };
    }
  };

  const signUp = async (email: string, password: string, nome_empresa: string): Promise<SignUpResult> => {
    try {
      return { 
        success: true, 
        message: "Função de cadastro simplificada. Utilize o formulário na tela de autenticação." 
      };
    } catch (error: any) {
      return { success: false, message: error.message || "Erro ao fazer cadastro" };
    }
  };

  // Função global de logout, corrigida para limpar dados e redirecionar corretamente
  const signOut = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      
      await supabase.auth.signOut();
      
      window.location.href = "/auth";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, forçar redirecionamento
      window.location.href = "/auth";
    }
  };

  // Renderizar loading screen enquanto carrega dados do usuário
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userData,
        loading,
        subscriptionExpired,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
