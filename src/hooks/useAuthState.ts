
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/auth.service';

/**
 * Interface para dados do usuário
 */
interface UserData {
  id: string;
  email: string;
  nome_empresa: string;
  is_admin?: boolean;
  ativo?: boolean;
  subscription_status?: string;
  subscription_expires_at?: string;
}

/**
 * Estado de autenticação
 */
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  userData: UserData | null;
  subscriptionExpired: boolean;
}

/**
 * Ações de autenticação
 */
interface AuthActions {
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{success: boolean; message: string}>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<{success: boolean; message: string}>;
}

/**
 * Hook personalizado para controle de estado de autenticação
 * Integra com auth.service.ts para operações de login/logout
 * @returns Estado e ações de autenticação
 */
export function useAuthState(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Calcula se a assinatura está expirada
  const subscriptionExpired = userData?.subscription_status === 'expired' || 
    (userData?.subscription_expires_at && new Date(userData.subscription_expires_at) < new Date()) || false;

  /**
   * Executa login através do auth.service
   */
  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    
    try {
      const result = await authService.signIn(email, password, rememberMe);
      
      if (result.success && result.user && result.session) {
        setUser(result.user);
        setSession(result.session);
        
        // Buscar dados do usuário
        const fetchedUserData = await authService.fetchUserData(result.user.id);
        setUserData(fetchedUserData);
      }
      
      setLoading(false);
      return { success: result.success, message: result.message };
    } catch (error: any) {
      console.error("❌ Erro no signIn do hook:", error);
      setLoading(false);
      return { success: false, message: "Erro interno no login" };
    }
  }, []);

  /**
   * Executa logout através do auth.service
   */
  const signOut = useCallback(async () => {
    setLoading(true);
    
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
      setUserData(null);
    } catch (error: any) {
      console.error("❌ Erro no signOut do hook:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Renova token através do auth.service
   */
  const refreshToken = useCallback(async () => {
    try {
      const result = await authService.refreshSession();
      
      if (result.success && result.user && result.session) {
        setUser(result.user);
        setSession(result.session);
        
        // Atualizar dados do usuário
        const fetchedUserData = await authService.fetchUserData(result.user.id);
        setUserData(fetchedUserData);
      }
      
      return { success: result.success, message: result.message };
    } catch (error: any) {
      console.error("❌ Erro no refreshToken do hook:", error);
      return { success: false, message: "Erro ao renovar token" };
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔐 Auth state changed:', event);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setUserData(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Buscar dados do usuário após login
          try {
            const fetchedUserData = await authService.fetchUserData(session.user.id);
            if (mounted) {
              setUserData(fetchedUserData);
              
              // Verificar se usuário está ativo
              if (!fetchedUserData?.ativo) {
                console.warn("⚠️ Usuário inativo, fazendo logout");
                await signOut();
              }
            }
          } catch (error) {
            console.error("❌ Erro ao buscar dados do usuário:", error);
          } finally {
            if (mounted) setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
    );

    // Verificar sessão existente na inicialização
    authService.getUserSession().then((session) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        authService.fetchUserData(session.user.id).then((userData) => {
          if (mounted) {
            setUserData(userData);
            setLoading(false);
          }
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
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
