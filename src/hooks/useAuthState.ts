
import { useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuthSession } from './useAuthSession';
import { useUserData } from './useUserData';

interface UserData {
  id: string;
  email: string;
  nome_empresa: string;
  is_admin?: boolean;
  ativo?: boolean;
  subscription_status?: string;
  subscription_expires_at?: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  userData: UserData | null;
  subscriptionExpired: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{success: boolean; message: string}>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<{success: boolean; message: string}>;
}

export function useAuthState(): AuthState & AuthActions {
  const { user, session, loading: sessionLoading, refreshToken } = useAuthSession();
  const { userData, loading: userDataLoading } = useUserData(user);

  const loading = sessionLoading || userDataLoading;
  const isAuthenticated = !!user && !!session;
  const subscriptionExpired = userData?.subscription_status === 'expired' || 
    (userData?.subscription_expires_at && new Date(userData.subscription_expires_at) < new Date()) || false;

  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    console.log("🔐 [useAuthState] Iniciando login para:", email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.error("❌ [useAuthState] Erro no login:", error);
        return { success: false, message: error.message };
      }
      
      if (data.user && data.session) {
        console.log("✅ [useAuthState] Login bem-sucedido");
        return { success: true, message: "Login realizado com sucesso" };
      }
      
      return { success: false, message: "Falha na autenticação" };
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no signIn:", error);
      return { success: false, message: "Erro interno no login" };
    }
  }, []);

  const signOut = useCallback(async () => {
    console.log("🚪 [useAuthState] Executando logout...");
    
    try {
      if (user?.id) {
        sessionStorage.removeItem(`userData_${user.id}`);
      }
      
      await supabase.auth.signOut();
      console.log("✅ [useAuthState] Logout completo");
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no logout:", error);
    }
  }, [user]);

  return {
    user,
    session,
    loading,
    isAuthenticated,
    userData,
    subscriptionExpired,
    signIn,
    signOut,
    refreshToken,
  };
}
