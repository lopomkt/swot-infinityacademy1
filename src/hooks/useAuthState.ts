
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/auth.service';

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  const subscriptionExpired = userData?.subscription_status === 'expired' || 
    (userData?.subscription_expires_at && new Date(userData.subscription_expires_at) < new Date()) || false;

  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    const result = await authService.signIn(email, password, rememberMe);
    
    if (result.success && result.user && result.session) {
      setUser(result.user);
      setSession(result.session);
      
      // Fetch user data
      const fetchedUserData = await authService.fetchUserData(result.user.id);
      setUserData(fetchedUserData);
    }
    
    setLoading(false);
    return { success: result.success, message: result.message };
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    await authService.signOut();
    setUser(null);
    setSession(null);
    setUserData(null);
    setLoading(false);
  }, []);

  const refreshToken = useCallback(async () => {
    const result = await authService.refreshToken();
    
    if (result.success && result.user && result.session) {
      setUser(result.user);
      setSession(result.session);
      
      // Refresh user data
      const fetchedUserData = await authService.fetchUserData(result.user.id);
      setUserData(fetchedUserData);
    }
    
    return { success: result.success, message: result.message };
  }, []);

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setUserData(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Validar dados do usuário
          setTimeout(async () => {
            const fetchedUserData = await authService.fetchUserData(session.user.id);
            setUserData(fetchedUserData);
            
            if (!fetchedUserData?.ativo) {
              await signOut();
            }
            setLoading(false);
          }, 0);
        } else {
          setLoading(false);
        }
      }
    );

    // Verificar sessão existente
    authService.getCurrentSession().then((session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        authService.fetchUserData(session.user.id).then(setUserData);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      authService.stopPolling();
    };
  }, [signOut]);

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    userData,
    subscriptionExpired,
    signIn,
    signOut,
    refreshToken,
  };
}
