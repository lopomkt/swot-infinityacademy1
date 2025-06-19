
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

// Lista DEFINITIVA de emails admin
const ADMIN_EMAILS = [
  'infinitymkt00@gmail.com',
  'admin@swotinsights.com',
  'admin@infinityacademy.com'
];

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

  // Função para criar fallback ULTRA-INTELIGENTE
  const createUltraSmartFallback = useCallback((userId: string, authUser: User): UserData => {
    const email = authUser.email || '';
    const isAdminEmail = ADMIN_EMAILS.includes(email.toLowerCase());
    
    // Tentar recuperar dados do cache primeiro
    const cachedUserData = sessionStorage.getItem(`userData_${userId}`);
    if (cachedUserData) {
      try {
        const parsed = JSON.parse(cachedUserData);
        console.log("🧠 [useAuthState] Usando dados do cache:", parsed);
        return parsed;
      } catch (err) {
        console.warn("[useAuthState] Erro ao ler cache:", err);
      }
    }

    // Usar user_metadata se disponível
    const userMetadata = authUser.user_metadata || {};
    const nomeEmpresa = userMetadata.nome_empresa || 'Empresa';
    
    console.log("🧠 [useAuthState] Criando fallback ULTRA-INTELIGENTE:", {
      email,
      isAdminEmail,
      userMetadata,
      preservingAdminStatus: isAdminEmail
    });

    const fallbackData: UserData = {
      id: userId,
      email,
      nome_empresa: nomeEmpresa,
      is_admin: isAdminEmail, // ✅ PRESERVAR STATUS ADMIN
      ativo: true
    };

    // Salvar no cache
    try {
      sessionStorage.setItem(`userData_${userId}`, JSON.stringify(fallbackData));
    } catch (err) {
      console.warn("[useAuthState] Erro ao salvar cache:", err);
    }

    return fallbackData;
  }, []);

  // Função ROBUSTA para buscar userData com fallback inteligente
  const fetchUserData = useCallback(async (userId: string, retryCount: number = 0): Promise<void> => {
    if (!mounted.current || !user) return;
    
    console.log(`🔍 [useAuthState] Tentativa ${retryCount + 1}/8 de buscar userData:`, userId);
    
    try {
      // Timeout mais generoso - 15 segundos
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout na busca de userData')), 15000);
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
        
        // Retry mais agressivo - até 8 tentativas
        if (retryCount < 7) {
          const delay = Math.min(Math.pow(1.5, retryCount) * 1000, 5000); // Backoff limitado a 5s
          console.log(`🔄 [useAuthState] Retry em ${delay}ms...`);
          setTimeout(() => {
            fetchUserData(userId, retryCount + 1);
          }, delay);
          return;
        }
        
        // Fallback ULTRA-INTELIGENTE após todas as tentativas
        console.warn("⚠️ [useAuthState] Todas as tentativas falharam, usando fallback ULTRA-INTELIGENTE");
        const ultraSmartFallback = createUltraSmartFallback(userId, user);
        console.log("🧠 [useAuthState] Fallback ultra-inteligente criado:", ultraSmartFallback);
        setUserData(ultraSmartFallback);
        return;
      }
      
      if (data) {
        console.log("✅ [useAuthState] UserData obtido com sucesso:", { 
          email: data.email, 
          is_admin: data.is_admin,
          ativo: data.ativo 
        });
        
        // Salvar no cache para próximas sessões
        try {
          sessionStorage.setItem(`userData_${userId}`, JSON.stringify(data));
        } catch (err) {
          console.warn("[useAuthState] Erro ao salvar cache:", err);
        }
        
        setUserData(data);
      } else {
        console.warn("⚠️ [useAuthState] UserData não encontrado, usando fallback ultra-inteligente");
        const ultraSmartFallback = createUltraSmartFallback(userId, user);
        console.log("🧠 [useAuthState] Fallback para usuário não encontrado:", ultraSmartFallback);
        setUserData(ultraSmartFallback);
      }
      
    } catch (error: any) {
      console.error(`❌ [useAuthState] Erro inesperado na tentativa ${retryCount + 1}:`, error);
      
      // Retry em caso de erro de rede (até 8 tentativas)
      if (retryCount < 7) {
        const delay = Math.min(Math.pow(1.5, retryCount) * 1000, 5000);
        console.log(`🔄 [useAuthState] Retry por erro em ${delay}ms...`);
        setTimeout(() => {
          fetchUserData(userId, retryCount + 1);
        }, delay);
        return;
      }
      
      // Fallback FINAL ULTRA-INTELIGENTE
      if (user) {
        const ultraSmartFallback = createUltraSmartFallback(userId, user);
        console.log("🧠 [useAuthState] Fallback final ultra-inteligente:", ultraSmartFallback);
        setUserData(ultraSmartFallback);
      }
    }
  }, [user, createUltraSmartFallback]);

  // Login otimizado com melhor handling
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
      // Limpar cache
      if (user?.id) {
        sessionStorage.removeItem(`userData_${user.id}`);
      }
      
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserData(null);
      console.log("✅ [useAuthState] Logout completo");
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no signOut:", error);
    }
  }, [user]);

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

  // Timeout de segurança aumentado para 20 segundos
  useEffect(() => {
    if (!loading) return;
    
    const timeoutId = setTimeout(() => {
      if (loading && mounted.current) {
        console.warn("⏰ [useAuthState] Timeout de carregamento (20s)");
        setLoading(false);
      }
    }, 20000);

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
