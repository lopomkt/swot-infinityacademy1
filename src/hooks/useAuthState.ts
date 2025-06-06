
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

  // Calcula se a assinatura está expirada
  const subscriptionExpired = userData?.subscription_status === 'expired' || 
    (userData?.subscription_expires_at && new Date(userData.subscription_expires_at) < new Date()) || false;

  // CORREÇÃO CRÍTICA 3: Busca userData com retry otimizado
  const fetchUserDataSafely = useCallback(async (userId: string) => {
    try {
      console.log(`🔍 [useAuthState] Buscando userData para:`, userId);
      
      const result = await authService.fetchUserData(userId);
      
      if (result) {
        console.log("✅ [useAuthState] UserData obtido:", result.email);
        return result;
      } else {
        console.warn("⚠️ [useAuthState] Falha ao obter userData");
        return null;
      }
    } catch (error) {
      console.error("❌ [useAuthState] Erro ao buscar userData:", error);
      return null;
    }
  }, []);

  // Login com fluxo otimizado
  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    console.log("🔐 [useAuthState] Iniciando login...");
    setLoading(true);
    
    try {
      const result = await authService.signIn(email, password, rememberMe);
      
      if (result.success && result.user && result.session) {
        console.log("✅ [useAuthState] Login bem-sucedido");
        
        // Atualizar estado básico IMEDIATAMENTE
        setUser(result.user);
        setSession(result.session);
        
        // Buscar userData em background
        const fetchedUserData = await fetchUserDataSafely(result.user.id);
        
        if (fetchedUserData) {
          if (!fetchedUserData.ativo) {
            console.warn("⚠️ [useAuthState] Usuário inativo detectado");
            await signOut();
            return { success: false, message: "Usuário inativo" };
          }
          setUserData(fetchedUserData);
        }
        
        setLoading(false);
        return { success: true, message: "Login realizado com sucesso" };
      }
      
      setLoading(false);
      return { success: result.success, message: result.message };
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no signIn:", error);
      setLoading(false);
      return { success: false, message: "Erro interno no login" };
    }
  }, [fetchUserDataSafely]);

  // Logout
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

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const result = await authService.refreshSession();
      
      if (result.success && result.user && result.session) {
        setUser(result.user);
        setSession(result.session);
        
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

  // Inicialização do estado de autenticação
  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      try {
        console.log("🔧 [useAuthState] Inicializando autenticação...");

        // Configurar listener PRIMEIRO
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            console.log(`🔐 [useAuthState] Auth event: ${event}`);
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (event === 'SIGNED_OUT') {
              console.log("👋 [useAuthState] Usuário deslogado");
              setUserData(null);
              setLoading(false);
            } else if (event === 'SIGNED_IN' && session?.user) {
              console.log("👤 [useAuthState] Usuário logado");
              
              // Buscar userData de forma não-bloqueante
              fetchUserDataSafely(session.user.id).then((userData) => {
                if (mounted) {
                  if (userData) {
                    setUserData(userData);
                    if (!userData.ativo) {
                      console.warn("⚠️ [useAuthState] Usuário inativo");
                    }
                  }
                  setLoading(false);
                }
              });
            } else {
              setLoading(false);
            }
          }
        );

        authSubscription = subscription;

        // Verificar sessão existente DEPOIS
        const existingSession = await authService.getUserSession();
        
        if (!mounted) return;
        
        if (existingSession?.user) {
          console.log("🔍 [useAuthState] Sessão existente:", existingSession.user.email);
          
          setSession(existingSession);
          setUser(existingSession.user);
          
          const fetchedUserData = await fetchUserDataSafely(existingSession.user.id);
          
          if (mounted) {
            if (fetchedUserData) {
              setUserData(fetchedUserData);
            }
            setLoading(false);
          }
        } else {
          console.log("📭 [useAuthState] Nenhuma sessão existente");
          setLoading(false);
        }

      } catch (error) {
        console.error("❌ [useAuthState] Erro na inicialização:", error);
        if (mounted) {
          setLoading(false);
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

  // Debug logs
  useEffect(() => {
    console.log("📊 [useAuthState] Estado:", {
      user: !!user,
      userData: !!userData,
      loading,
      isAuthenticated: !!user,
      subscriptionExpired
    });
  }, [user, userData, loading, subscriptionExpired]);

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
