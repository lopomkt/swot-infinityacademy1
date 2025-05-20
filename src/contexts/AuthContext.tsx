
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase, isSubscriptionValid } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

// Configuração de dias para expiração do login persistente
const DIAS_EXPIRACAO_LOGIN = 7;

interface UserData {
  id: string;
  email: string;
  nome_empresa: string;
  data_validade: string;
  ativo: boolean | null;
}

interface SignUpResult {
  success: boolean;
  message: string;
  emailConfirmed?: boolean;
  confirmationSent?: boolean;
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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserData(currentSession.user.id);
        } else {
          setUserData(null);
          setSubscriptionExpired(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await fetchUserData(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
        setSubscriptionExpired(false);
        return;
      }

      if (data) {
        setUserData(data as UserData);
        const expired = !isSubscriptionValid(data.data_validade);
        setSubscriptionExpired(expired);
        
        if (expired) {
          toast.error("Seu acesso expirou. Entre em contato para renovar.");
          navigate("/expired");
        }
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
    }
  };

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

  const signUp = async (email: string, password: string, nome_empresa: string): Promise<SignUpResult> => {
    try {
      // Register the user with Supabase Auth with improved handling
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome_empresa
          }
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (!data.user) {
        return { success: false, message: "Erro ao criar usuário." };
      }

      // Check if email is already confirmed
      if (data.user.email_confirmed_at) {
        // Create entry in the users table
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          nome_empresa,
          data_validade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });

        if (insertError) {
          console.error("Error creating user profile:", insertError);
          return { 
            success: false, 
            message: "Erro ao criar perfil do usuário" 
          };
        }

        return { 
          success: true, 
          message: "Cadastro realizado com sucesso!",
          emailConfirmed: true 
        };
      } 
      
      // Check if confirmation was sent
      else if (data.user.confirmation_sent_at) {
        return {
          success: true,
          message: "Cadastro iniciado! Verifique seu e-mail para confirmar o acesso.",
          confirmationSent: true,
          emailConfirmed: false
        };
      } 
      
      // Generic success but waiting for confirmation
      else {
        return {
          success: true,
          message: "Cadastro aguardando confirmação. Verifique sua caixa de entrada.",
          confirmationSent: false,
          emailConfirmed: false
        };
      }
    } catch (error: any) {
      return { success: false, message: error.message || "Erro ao fazer cadastro" };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('last_login_date');
    await supabase.auth.signOut();
    navigate("/auth");
  };

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
