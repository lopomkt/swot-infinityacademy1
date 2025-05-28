import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase, isSubscriptionValid } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import LoadingScreen from "@/components/Auth/LoadingScreen";
import { useUserPolling } from "@/hooks/useUserPolling";

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
  const [userLoadFailed, setUserLoadFailed] = useState(false);
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const navigate = useNavigate();
  const { pollUserData, setupRealtimeListener } = useUserPolling();

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
    }, 20000);

    return () => clearTimeout(timeout);
  }, [loading, navigate]);

  // Limpeza dos dados locais sempre que uma nova sessão de usuário é iniciada
  useEffect(() => {
    if (session) {
      console.log("Nova sessão iniciada. Limpando dados residuais...");
      localStorage.removeItem("relatorio_id");
      sessionStorage.removeItem("relatorio_id");
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
          setUserLoadFailed(false);
          setIsProcessingAuth(false);
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
      if (!session?.user || isProcessingAuth) {
        if (!session?.user) {
          setUserData(null);
          setLoading(false);
        }
        return;
      }

      setIsProcessingAuth(true);
      setLoading(true);
      setJaRedirecionou(false);
      setUserLoadFailed(false);
      
      try {
        console.log("[AuthContext] Iniciando carregamento de dados para:", session.user.id);
        console.log("[AuthContext] Email do usuário:", session.user.email);
        
        // Primeiro, verificar se o usuário existe diretamente
        const { data: directData, error: directError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        console.log("[AuthContext] Consulta direta resultado:", { directData, directError });

        if (directData) {
          setUserData(directData);
          console.log("[AuthContext] UserData carregado com sucesso:", directData);
          
          toast.success("Login realizado com sucesso!");
          
          // Verificar expiração da assinatura
          const hoje = new Date();
          const validade = new Date(directData.data_validade);
          const expired = validade < hoje && !directData.is_admin;
          
          setSubscriptionExpired(expired);
          
          // Redirecionar baseado no tipo de usuário
          if (!jaRedirecionou) {
            setJaRedirecionou(true);
            if (directData.is_admin) {
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
          setLoading(false);
          setIsProcessingAuth(false);
          return;
        }

        // Se não encontrou, usar o polling como fallback
        console.log("[AuthContext] Dados não encontrados diretamente, iniciando polling...");
        const result = await pollUserData(session.user.id);
        
        if (!result) {
          console.error("[AuthContext] Polling falhou - usuário não encontrado");
          setUserLoadFailed(true);
          toast.error("Erro: seu cadastro está incompleto. Contate a equipe.");
          setUserData(null);
          navigate("/auth");
          setIsProcessingAuth(false);
          return;
        }

        setUserData(result);
        console.log("[AuthContext] UserData carregado via polling:", result);
        
        toast.success("Login realizado com sucesso!");
        
        // Verificar expiração da assinatura
        const hoje = new Date();
        const validade = new Date(result.data_validade);
        const expired = validade < hoje && !result.is_admin;
        
        setSubscriptionExpired(expired);
        
        // Redirecionar baseado no tipo de usuário
        if (!jaRedirecionou) {
          setJaRedirecionou(true);
          if (result.is_admin) {
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
        console.error('[AuthContext] Erro crítico ao processar dados do usuário:', error);
        setUserLoadFailed(true);
        toast.error("Ocorreu um erro ao processar seus dados. Tente novamente.");
        setUserData(null);
        navigate("/auth");
      } finally {
        setLoading(false);
        setIsProcessingAuth(false);
      }
    };

    carregarDados();
  }, [session?.user?.id, navigate, pollUserData]);

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
