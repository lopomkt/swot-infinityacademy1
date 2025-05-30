
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/auth.service';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
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

  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    const result = await authService.signIn(email, password, rememberMe);
    
    if (result.success && result.user && result.session) {
      setUser(result.user);
      setSession(result.session);
    }
    
    setLoading(false);
    return { success: result.success, message: result.message };
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    await authService.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
  }, []);

  const refreshToken = useCallback(async () => {
    const result = await authService.refreshToken();
    
    if (result.success && result.user && result.session) {
      setUser(result.user);
      setSession(result.session);
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
          setLoading(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Validar dados do usuário
          setTimeout(async () => {
            const userData = await authService.fetchUserData(session.user.id);
            if (!userData?.ativo) {
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
    signIn,
    signOut,
    refreshToken,
  };
}
