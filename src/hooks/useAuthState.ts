
import { useState, useEffect, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const mounted = useRef(true);
  const initialized = useRef(false);
  const authSubscription = useRef<any>(null);
  const fetchAttempts = useRef(0);

  // Estados derivados
  const isAuthenticated = !!user && !!session;
  const subscriptionExpired = userData?.subscription_status === 'expired' || 
    (userData?.subscription_expires_at && new Date(userData.subscription_expires_at) < new Date()) || false;

  // Função robusta para buscar userData com fallback
  const fetchUserData = useCallback(async (userId: string, retryCount: number = 0): Promise<void> => {
    if (!mounted.current) return;
    
    console.log(`🔍 [useAuthState] Tentativa ${retryCount + 1} de buscar userData:`, userId);
    
    try {
      // Timeout de 8 segundos para a consulta
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout na busca de userData')), 8000);
      });
      
      const queryPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
      
      if (!mounted.current) return;
      
      if (error) {
        console.error(`❌ [useAuthState] Erro na tentativa ${retryCount + 1}:`, error);
        
        // Retry com backoff exponencial
        if (retryCount < 2) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          console.log(`🔄 [useAuthState] Retry em ${delay}ms...`);
          setTimeout(() => {
            fetchUserData(userId, retryCount + 1);
          }, delay);
          return;
        }
        
        // Fallback: criar userData básico com is_admin = false
        console.warn("⚠️ [useAuthState] Falha em todas as tentativas, usando fallback");
        const fallbackUserData = {
          id: userId,
          email: user?.email || '',
          nome_empresa: user?.user_metadata?.nome_empresa || 'Empresa',
          is_admin: false,
          ativo: true
        };
        console.log("🔄 [useAuthState] UserData fallback:", fallbackUserData);
        setUserData(fallbackUserData);
        return;
      }
      
      if (data) {
        console.log("✅ [useAuthState] UserData obtido:", { 
          email: data.email, 
          is_admin: data.is_admin,
          ativo: data.ativo 
        });
        setUserData(data);
      } else {
        console.warn("⚠️ [useAuthState] UserData não encontrado, usando fallback");
        // Fallback para dados básicos se não existir na tabela
        const fallbackUserData = {
          id: userId,
          email: user?.email || '',
          nome_empresa: user?.user_metadata?.nome_empresa || 'Empresa',
          is_admin: false,
          ativo: true
        };
        console.log("🔄 [useAuthState] UserData fallback para usuário não encontrado:", fallbackUserData);
        setUserData(fallbackUserData);
      }
      
    } catch (error: any) {
      console.error(`❌ [useAuthState] Erro inesperado na tentativa ${retryCount + 1}:`, error);
      
      // Retry em caso de erro de rede
      if (retryCount < 2) {
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`🔄 [useAuthState] Retry por erro em ${delay}ms...`);
        setTimeout(() => {
          fetchUserData(userId, retryCount + 1);
        }, delay);
        return;
      }
      
      // Fallback final: criar userData básico
      if (user) {
        const fallbackUserData = {
          id: userId,
          email: user.email || '',
          nome_empresa: user.user_metadata?.nome_empresa || 'Empresa',
          is_admin: false,
          ativo: true
        };
        console.log("🔄 [useAuthState] UserData fallback final:", fallbackUserData);
        setUserData(fallbackUserData);
      }
    }
  }, [user]);

  // Login otimizado com melhor handling
  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    console.log("🔐 [useAuthState] Iniciando login...");
    setLoading(true);
    fetchAttempts.current = 0;
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (!mounted.current) return { success: false, message: "Componente desmontado" };
      
      if (error) {
        console.error("❌ [useAuthState] Erro no login:", error);
        setLoading(false);
        return { success: false, message: error.message };
      }
      
      if (data.user && data.session) {
        console.log("✅ [useAuthState] Login bem-sucedido");
        setUser(data.user);
        setSession(data.session);
        
        // Buscar userData em foreground para garantir que esteja disponível
        await fetchUserData(data.user.id);
        setLoading(false);
        
        return { success: true, message: "Login realizado com sucesso" };
      }
      
      setLoading(false);
      return { success: false, message: "Falha na autenticação" };
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no signIn:", error);
      if (mounted.current) {
        setLoading(false);
      }
      return { success: false, message: "Erro interno no login" };
    }
  }, [fetchUserData]);

  // Logout otimizado
  const signOut = useCallback(async () => {
    console.log("🚪 [useAuthState] Iniciando logout...");
    
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserData(null);
      console.log("✅ [useAuthState] Logout completo");
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no signOut:", error);
    }
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (!mounted.current) return { success: false, message: "Componente desmontado" };
      
      if (error) {
        console.error("❌ [useAuthState] Erro ao renovar sessão:", error);
        return { success: false, message: "Falha ao renovar sessão" };
      }

      if (data.user && data.session) {
        setUser(data.user);
        setSession(data.session);
        
        if (!userData) {
          fetchUserData(data.user.id);
        }
      }
      
      return { success: true, message: "Token renovado" };
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no refreshToken:", error);
      return { success: false, message: "Erro ao renovar token" };
    }
  }, [fetchUserData, userData]);

  // Inicialização otimizada
  useEffect(() => {
    if (initialized.current) return;
    
    const initAuth = async () => {
      try {
        console.log("🔧 [useAuthState] Inicializando autenticação...");
        
        // Setup listener primeiro
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted.current) return;

            console.log(`🔐 [useAuthState] Auth event: ${event}`);
            
            if (event === 'SIGNED_OUT' || !session) {
              console.log("👋 [useAuthState] Usuário deslogado");
              setSession(null);
              setUser(null);
              setUserData(null);
              setLoading(false);
              return;
            }
            
            if (session?.user) {
              console.log("👤 [useAuthState] Sessão ativa detectada");
              setSession(session);
              setUser(session.user);
              
              // Buscar userData de forma síncrona para redirecionamento
              await fetchUserData(session.user.id);
            }
            
            setLoading(false);
          }
        );

        authSubscription.current = subscription;

        // Verificar sessão existente
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (!mounted.current) return;

        if (existingSession?.user) {
          console.log("🔍 [useAuthState] Sessão existente encontrada");
          setSession(existingSession);
          setUser(existingSession.user);
          await fetchUserData(existingSession.user.id);
        } else {
          console.log("🔍 [useAuthState] Nenhuma sessão existente");
          setLoading(false);
        }
        
        initialized.current = true;

      } catch (error) {
        console.error("❌ [useAuthState] Erro na inicialização:", error);
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted.current = false;
      if (authSubscription.current) {
        authSubscription.current.unsubscribe();
      }
    };
  }, [fetchUserData]);

  // Timeout de segurança
  useEffect(() => {
    if (!loading) return;
    
    const timeoutId = setTimeout(() => {
      if (loading && mounted.current) {
        console.warn("⏰ [useAuthState] Timeout de carregamento (10s)");
        setLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [loading]);

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
