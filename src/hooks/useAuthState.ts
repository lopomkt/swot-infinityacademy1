
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
  const fetchingUserData = useRef(false);

  // Estados derivados
  const isAuthenticated = !!user && !!session;
  const subscriptionExpired = userData?.subscription_status === 'expired' || 
    (userData?.subscription_expires_at && new Date(userData.subscription_expires_at) < new Date()) || false;

  // Função otimizada para buscar userData
  const fetchUserData = useCallback(async (userId: string): Promise<void> => {
    if (fetchingUserData.current || !mounted.current) return;
    
    fetchingUserData.current = true;
    
    try {
      console.log(`🔍 [useAuthState] Buscando userData para:`, userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (!mounted.current) return;
      
      if (error) {
        console.error("❌ [useAuthState] Erro ao buscar userData:", error);
        return;
      }
      
      if (data) {
        console.log("✅ [useAuthState] UserData obtido:", { email: data.email, is_admin: data.is_admin });
        setUserData(data);
      } else {
        console.warn("⚠️ [useAuthState] UserData não encontrado para:", userId);
        setUserData(null);
      }
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro na consulta userData:", error);
    } finally {
      fetchingUserData.current = false;
    }
  }, []);

  // Login simplificado
  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    console.log("🔐 [useAuthState] Iniciando login...");
    setLoading(true);
    
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
        
        // Buscar userData imediatamente
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

  // Logout simples
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
          await fetchUserData(data.user.id);
        }
      }
      
      return { success: true, message: "Token renovado" };
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no refreshToken:", error);
      return { success: false, message: "Erro ao renovar token" };
    }
  }, [fetchUserData, userData]);

  // Inicialização única e otimizada
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
              
              // Buscar userData apenas se necessário
              if (!userData || userData.id !== session.user.id) {
                await fetchUserData(session.user.id);
              }
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
        }
        
        setLoading(false);
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
  }, []); // Removido fetchUserData e userData das dependências

  // Timeout de segurança mais longo
  useEffect(() => {
    if (!loading) return;
    
    const timeoutId = setTimeout(() => {
      if (loading && mounted.current) {
        console.warn("⏰ [useAuthState] Timeout de carregamento (10s)");
        setLoading(false);
      }
    }, 10000); // Aumentado para 10 segundos

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
