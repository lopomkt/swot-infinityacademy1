
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase, isSubscriptionValid } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface UserData {
  id: string;
  email: string;
  nome_empresa: string;
  data_validade: string;
  ativo: boolean | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  subscriptionExpired: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signUp: (email: string, password: string, nome_empresa: string) => Promise<{ success: boolean; message: string }>;
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

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: "Login realizado com sucesso!" };
    } catch (error: any) {
      return { success: false, message: error.message || "Erro ao fazer login" };
    }
  };

  const signUp = async (email: string, password: string, nome_empresa: string) => {
    try {
      // Register the user with Supabase Auth
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

      if (data.user) {
        // Create entry in the users table
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          nome_empresa,
          data_validade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });

        if (insertError) {
          console.error("Error creating user profile:", insertError);
          return { success: false, message: "Erro ao criar perfil do usuário" };
        }
      }

      return { success: true, message: "Cadastro realizado com sucesso!" };
    } catch (error: any) {
      return { success: false, message: error.message || "Erro ao fazer cadastro" };
    }
  };

  const signOut = async () => {
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
