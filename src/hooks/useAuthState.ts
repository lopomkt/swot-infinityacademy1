
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

export function useAuthState(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const mounted = useRef(true);
  const initialized = useRef(false);
  const authSubscription = useRef<any>(null);

  // Estados derivados
  const isAuthenticated = !!user && !!session;
  const subscriptionExpired = userData?.subscription_status === 'expired' || 
    (userData?.subscription_expires_at && new Date(userData.subscription_expires_at) < new Date()) || false;

  // Busca userData de forma simples
  const fetchUserData = useCallback(async (userId: string): Promise<void> => {
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
        console.log("✅ [useAuthState] UserData obtido:", data.email);
        setUserData(data);
      } else {
        console.warn("⚠️ [useAuthState] UserData não encontrado para:", userId);
      }
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro na consulta userData:", error);
    }
  }, []);

  // Login simplificado
  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    console.log("🔐 [useAuthState] Iniciando login...");
    setLoading(true);
    
    try {
      const result = await authService.signIn(email, password, rememberMe);
      
      if (!mounted.current) return { success: false, message: "Componente desmontado" };
      
      if (result.success && result.user && result.session) {
        console.log("✅ [useAuthState] Login bem-sucedido, atualizando estado");
        
        setUser(result.user);
        setSession(result.session);
        
        // Buscar userData imediatamente
        await fetchUserData(result.user.id);
        
        setLoading(false);
        return { success: true, message: "Login realizado com sucesso" };
      }
      
      setLoading(false);
      return { success: result.success, message: result.message };
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
      await authService.signOut();
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
      const result = await authService.refreshSession();
      
      if (!mounted.current) return { success: false, message: "Componente desmontado" };
      
      if (result.success && result.user && result.session) {
        setUser(result.user);
        setSession(result.session);
        
        if (!userData) {
          await fetchUserData(result.user.id);
        }
      }
      
      return { success: result.success, message: result.message };
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no refreshToken:", error);
      return { success: false, message: "Erro ao renovar token" };
    }
  }, [fetchUserData, userData]);

  // Inicialização única e simplificada
  useEffect(() => {
    if (initialized.current) return;
    
    const initAuth = async () => {
      try {
        console.log("🔧 [useAuthState] Inicializando autenticação...");
        
        // Setup listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted.current) return;

            console.log(`🔐 [useAuthState] Auth event: ${event}`);
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (event === 'SIGNED_OUT' || !session) {
              console.log("👋 [useAuthState] Usuário deslogado");
              setUserData(null);
              setLoading(false);
              return;
            }
            
            if (session?.user) {
              console.log("👤 [useAuthState] Usuário logado, buscando dados...");
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
  }, [fetchUserData]);

  // Timeout de segurança
  useEffect(() => {
    if (!loading) return;
    
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("⏰ [useAuthState] Timeout de carregamento");
        setLoading(false);
      }
    }, 5000);

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
