
import { useState, useEffect, useCallback, useRef } from 'react';
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

// Estados do sistema de auth
type AuthSystemState = 'initializing' | 'unauthenticated' | 'authenticated' | 'loading_user_data' | 'ready' | 'error';

export function useAuthState(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [systemState, setSystemState] = useState<AuthSystemState>('initializing');
  
  // Refs para controle de estado
  const mounted = useRef(true);
  const initializationDone = useRef(false);
  const authSubscription = useRef<any>(null);

  // Estados derivados
  const loading = systemState === 'initializing' || systemState === 'loading_user_data';
  const isAuthenticated = !!user && !!session;
  const subscriptionExpired = userData?.subscription_status === 'expired' || 
    (userData?.subscription_expires_at && new Date(userData.subscription_expires_at) < new Date()) || false;

  // Busca userData com controle de estado
  const fetchUserDataSafely = useCallback(async (userId: string): Promise<UserData | null> => {
    if (!mounted.current) return null;
    
    try {
      console.log(`🔍 [useAuthState] Buscando userData para:`, userId);
      setSystemState('loading_user_data');
      
      const result = await authService.fetchUserData(userId);
      
      if (!mounted.current) return null;
      
      if (result) {
        console.log("✅ [useAuthState] UserData obtido:", result.email);
        setUserData(result);
        setSystemState('ready');
        return result;
      } else {
        console.warn("⚠️ [useAuthState] Falha ao obter userData");
        setSystemState('error');
        return null;
      }
    } catch (error) {
      console.error("❌ [useAuthState] Erro ao buscar userData:", error);
      if (mounted.current) {
        setSystemState('error');
      }
      return null;
    }
  }, []);

  // Login com estado controlado
  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    console.log("🔐 [useAuthState] Iniciando login...");
    setSystemState('initializing');
    
    try {
      const result = await authService.signIn(email, password, rememberMe);
      
      if (!mounted.current) return { success: false, message: "Componente desmontado" };
      
      if (result.success && result.user && result.session) {
        console.log("✅ [useAuthState] Login bem-sucedido");
        
        // Atualizar estado básico imediatamente
        setUser(result.user);
        setSession(result.session);
        
        // Buscar userData
        const fetchedUserData = await fetchUserDataSafely(result.user.id);
        
        if (!mounted.current) return { success: false, message: "Componente desmontado" };
        
        if (fetchedUserData && !fetchedUserData.ativo) {
          console.warn("⚠️ [useAuthState] Usuário inativo detectado");
          await signOut();
          return { success: false, message: "Usuário inativo" };
        }
        
        return { success: true, message: "Login realizado com sucesso" };
      }
      
      setSystemState('unauthenticated');
      return { success: result.success, message: result.message };
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no signIn:", error);
      if (mounted.current) {
        setSystemState('error');
      }
      return { success: false, message: "Erro interno no login" };
    }
  }, [fetchUserDataSafely]);

  // Logout limpo
  const signOut = useCallback(async () => {
    console.log("🚪 [useAuthState] Iniciando logout...");
    
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
      setUserData(null);
      setSystemState('unauthenticated');
      console.log("✅ [useAuthState] Logout completo");
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no signOut:", error);
      setSystemState('error');
    }
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const result = await authService.refreshSession();
      
      if (!mounted.current) return { success: false, message: "Componente desmontado" };
      
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

  // Inicialização única e controlada
  useEffect(() => {
    // Evitar inicialização múltipla
    if (initializationDone.current) return;
    
    const initializeAuth = async () => {
      try {
        console.log("🔧 [useAuthState] Inicializando autenticação...");
        
        // Setup do listener PRIMEIRO
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted.current) return;

            console.log(`🔐 [useAuthState] Auth event: ${event}`);
            
            // Atualizar estado básico sempre
            setSession(session);
            setUser(session?.user ?? null);
            
            if (event === 'SIGNED_OUT' || !session) {
              console.log("👋 [useAuthState] Usuário deslogado");
              setUserData(null);
              setSystemState('unauthenticated');
              return;
            }
            
            if (session?.user) {
              console.log("👤 [useAuthState] Usuário logado, buscando dados...");
              await fetchUserDataSafely(session.user.id);
            }
          }
        );

        authSubscription.current = subscription;

        // Verificar sessão existente DEPOIS
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (!mounted.current) return;

        if (existingSession?.user) {
          console.log("🔍 [useAuthState] Sessão existente encontrada");
          setSession(existingSession);
          setUser(existingSession.user);
          await fetchUserDataSafely(existingSession.user.id);
        } else {
          console.log("📭 [useAuthState] Nenhuma sessão existente");
          setSystemState('unauthenticated');
        }

        initializationDone.current = true;

      } catch (error) {
        console.error("❌ [useAuthState] Erro na inicialização:", error);
        if (mounted.current) {
          setSystemState('error');
        }
      }
    };

    initializeAuth();

    return () => {
      mounted.current = false;
      if (authSubscription.current) {
        authSubscription.current.unsubscribe();
      }
    };
  }, []); // Dependências vazias para inicialização única

  // Timeout de segurança reduzido
  useEffect(() => {
    if (systemState !== 'initializing' && systemState !== 'loading_user_data') return;
    
    const timeoutId = setTimeout(() => {
      if (systemState === 'initializing' || systemState === 'loading_user_data') {
        console.warn("⏰ [useAuthState] Timeout de carregamento - forçando estado de erro");
        setSystemState('error');
      }
    }, 3000); // Reduzido para 3 segundos

    return () => clearTimeout(timeoutId);
  }, [systemState]);

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
