
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
  const navigate = useNavigate();

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
          
          // Realizar logout e limpar dados
          supabase.auth.signOut();
          localStorage.removeItem('last_login_date');
          
          // Notificar o usuário
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
        
        // Limpar dados de sessão
        sessionStorage.removeItem("relatorio_id");
        
        // Redirecionar para autenticação
        navigate("/auth");
        setLoading(false);
      }
    }, 15000); // 15 segundos

    return () => clearTimeout(timeout);
  }, [loading, navigate]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
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
      if (!session?.user) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error || !data) {
          console.error("Erro ao carregar dados do usuário:", error);
          toast.error("Não foi possível carregar seu perfil.");
          navigate("/auth");
          return;
        }

        setUserData(data as UserData);
        
        // Verificar expiração da assinatura
        const hoje = new Date();
        const validade = new Date(data.data_validade);
        const expired = validade < hoje;
        
        setSubscriptionExpired(expired);
        
        // Redirecionar baseado no tipo de usuário
        if (data.is_admin) {
          navigate("/admin");
        } else if (expired) {
          navigate("/expired");
        } else {
          navigate("/");
        }
        
        // Limpar qualquer armazenamento temporário de relatórios
        sessionStorage.removeItem("relatorio_id");
        
      } catch (error) {
        console.error('Erro crítico ao processar dados do usuário:', error);
        toast.error("Ocorreu um erro ao processar seus dados. Tente novamente.");
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [session, navigate]);

  const signIn = async (email: string, password: string, manterLogado = false) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, message: error.message };
      }

      // Configurar a persistência da sessão baseado na escolha do usuário
      if (manterLogado) {
        // Armazenar data do último login para verificação de expiração
        localStorage.setItem('last_login_date', new Date().toISOString());
        
        // Garantir que a sessão persista
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      } else {
        // Se não manter logado, garantir que a sessão seja removida ao fechar o navegador
        localStorage.removeItem('last_login_date');
        sessionStorage.setItem('sb-auth-token', JSON.stringify(data.session));
      }

      return { success: true, message: "Login realizado com sucesso!" };
    } catch (error: any) {
      return { success: false, message: error.message || "Erro ao fazer login" };
    }
  };

  // Simplificando a função signUp já que o cadastro agora é feito diretamente no AuthScreen
  const signUp = async (email: string, password: string, nome_empresa: string): Promise<SignUpResult> => {
    try {
      // Esta função agora é simplificada, pois a lógica real está no componente AuthScreen
      return { 
        success: true, 
        message: "Função de cadastro simplificada. Utilize o formulário na tela de autenticação." 
      };
    } catch (error: any) {
      return { success: false, message: error.message || "Erro ao fazer cadastro" };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('last_login_date');
    sessionStorage.removeItem("relatorio_id");
    await supabase.auth.signOut();
    navigate("/auth");
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
