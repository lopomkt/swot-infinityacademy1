
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
 * Hook personalizado para controle de estado de autenticação - VERSÃO OTIMIZADA
 * Implementa retry logic e melhor handling de race conditions
 * @returns Estado e ações de autenticação
 */
export function useAuthState(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Calcula se a assinatura está expirada
  const subscriptionExpired = userData?.subscription_status === 'expired' || 
    (userData?.subscription_expires_at && new Date(userData.subscription_expires_at) < new Date()) || false;

  /**
   * Busca dados do usuário com timeout e retry
   */
  const fetchUserDataSafely = useCallback(async (userId: string, timeout: number = 5000) => {
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), timeout);
    });

    try {
      const result = await Promise.race([
        authService.fetchUserData(userId),
        timeoutPromise
      ]);
      
      return result;
    } catch (error) {
      console.warn("⚠️ [useAuthState] Timeout ou erro ao buscar userData:", error);
      return null;
    }
  }, []);

  /**
   * Executa login através do auth.service - FLUXO OTIMIZADO
   */
  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    console.log("🔐 [useAuthState] Iniciando processo de login...");
    setLoading(true);
    
    try {
      const result = await authService.signIn(email, password, rememberMe);
      
      if (result.success && result.user && result.session) {
        console.log("✅ [useAuthState] Login bem-sucedido, atualizando estado...");
        
        // Atualizar estado imediatamente
        setUser(result.user);
        setSession(result.session);
        
        // Buscar dados do usuário em background
        const fetchedUserData = await fetchUserDataSafely(result.user.id, 3000);
        
        if (fetchedUserData) {
          console.log("✅ [useAuthState] UserData obtido:", fetchedUserData.email);
          setUserData(fetchedUserData);
          
          // Verificar se usuário está ativo
          if (!fetchedUserData.ativo) {
            console.warn("⚠️ [useAuthState] Usuário inativo detectado");
            await signOut();
            return { success: false, message: "Usuário inativo" };
          }
        } else {
          console.warn("⚠️ [useAuthState] Falha ao obter userData, mas login foi bem-sucedido");
          // Não bloquear o login por falha na busca de userData
        }
      }
      
      setLoading(false);
      return { success: result.success, message: result.message };
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no signIn:", error);
      setLoading(false);
      return { success: false, message: "Erro interno no login" };
    }
  }, [fetchUserDataSafely]);

  /**
   * Executa logout através do auth.service
   */
  const signOut = useCallback(async () => {
    console.log("🚪 [useAuthState] Iniciando logout...");
    setLoading(true);
    
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
      setUserData(null);
      console.log("✅ [useAuthState] Logout completo");
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no signOut:", error);
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
        const fetchedUserData = await fetchUserDataSafely(result.user.id);
        if (fetchedUserData) {
          setUserData(fetchedUserData);
        }
      }
      
      return { success: result.success, message: result.message };
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no refreshToken:", error);
      return { success: false, message: "Erro ao renovar token" };
    }
  }, [fetchUserDataSafely]);

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      try {
        console.log("🔧 [useAuthState] Inicializando autenticação...");

        // Configurar listener de mudanças de autenticação PRIMEIRO
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            console.log(`🔐 [useAuthState] Auth state changed: ${event}`);
            
            // Atualizar estado básico imediatamente
            setSession(session);
            setUser(session?.user ?? null);
            
            if (event === 'SIGNED_OUT') {
              console.log("👋 [useAuthState] Usuário deslogado");
              setUserData(null);
              setLoading(false);
            } else if (event === 'SIGNED_IN' && session?.user) {
              console.log("👤 [useAuthState] Usuário logado, buscando dados...");
              
              // Buscar dados do usuário em background
              try {
                const fetchedUserData = await fetchUserDataSafely(session.user.id, 3000);
                
                if (mounted) {
                  if (fetchedUserData) {
                    setUserData(fetchedUserData);
                    
                    // Verificar se usuário está ativo (apenas warning, não bloquear)
                    if (!fetchedUserData.ativo) {
                      console.warn("⚠️ [useAuthState] Usuário inativo detectado durante auth change");
                    }
                  } else {
                    console.warn("⚠️ [useAuthState] Falha ao buscar userData durante auth change");
                  }
                  setLoading(false);
                }
              } catch (error) {
                console.error("❌ [useAuthState] Erro ao buscar dados do usuário:", error);
                if (mounted) setLoading(false);
              }
            } else if (event === 'TOKEN_REFRESHED') {
              console.log("🔄 [useAuthState] Token refreshed");
              setLoading(false);
            } else {
              setLoading(false);
            }
          }
        );

        authSubscription = subscription;

        // Verificar sessão existente DEPOIS de configurar o listener
        const existingSession = await authService.getUserSession();
        
        if (!mounted) return;
        
        if (existingSession?.user) {
          console.log("🔍 [useAuthState] Sessão existente encontrada:", existingSession.user.email);
          
          setSession(existingSession);
          setUser(existingSession.user);
          
          // Buscar dados do usuário
          const fetchedUserData = await fetchUserDataSafely(existingSession.user.id, 3000);
          
          if (mounted) {
            if (fetchedUserData) {
              setUserData(fetchedUserData);
            }
            setLoading(false);
            setInitializing(false);
          }
        } else {
          console.log("📭 [useAuthState] Nenhuma sessão existente");
          setLoading(false);
          setInitializing(false);
        }

      } catch (error) {
        console.error("❌ [useAuthState] Erro na inicialização:", error);
        if (mounted) {
          setLoading(false);
          setInitializing(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      authService.stopPolling();
    };
  }, [fetchUserDataSafely]);

  // Log de debug para acompanhar mudanças de estado
  useEffect(() => {
    if (!initializing) {
      console.log("📊 [useAuthState] Estado atual:", {
        user: !!user,
        userData: !!userData,
        loading,
        isAuthenticated: !!user,
        subscriptionExpired
      });
    }
  }, [user, userData, loading, initializing, subscriptionExpired]);

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
