
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
  
  const authSubscription = useRef<any>(null);
  const initializationComplete = useRef(false);

  // Estados derivados
  const isAuthenticated = !!user && !!session;
  const subscriptionExpired = userData?.subscription_status === 'expired' || 
    (userData?.subscription_expires_at && new Date(userData.subscription_expires_at) < new Date()) || false;

  // Função para criar fallback IMEDIATO para admins
  const createAdminFallback = useCallback((authUser: User): UserData => {
    const email = authUser.email || '';
    const isAdminEmail = ADMIN_EMAILS.includes(email.toLowerCase());
    
    console.log("🔥 [useAuthState] Criando fallback IMEDIATO para admin:", email);

    const fallbackData: UserData = {
      id: authUser.id,
      email,
      nome_empresa: 'Admin',
      is_admin: isAdminEmail,
      ativo: true
    };

    // Cache imediato
    try {
      sessionStorage.setItem(`userData_${authUser.id}`, JSON.stringify(fallbackData));
    } catch (err) {
      console.warn("[useAuthState] Erro ao salvar cache:", err);
    }

    return fallbackData;
  }, []);

  // Função SIMPLIFICADA para buscar userData
  const fetchUserData = useCallback(async (userId: string): Promise<void> => {
    if (!user) return;
    
    console.log("🔍 [useAuthState] Buscando userData para:", userId);
    
    try {
      const { data, error } = await Promise.race([
        supabase.from('users').select('*').eq('id', userId).maybeSingle(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 8000))
      ]) as any;
      
      if (error || !data) {
        console.warn("⚠️ [useAuthState] Erro ou dados não encontrados, usando fallback");
        
        // Se é admin por email, usar fallback imediato
        const userEmail = (user.email || '').toLowerCase();
        if (ADMIN_EMAILS.includes(userEmail)) {
          const adminFallback = createAdminFallback(user);
          setUserData(adminFallback);
          return;
        }
        
        // Para não-admins, criar fallback básico
        const fallback: UserData = {
          id: userId,
          email: user.email || '',
          nome_empresa: 'Empresa',
          is_admin: false,
          ativo: true
        };
        setUserData(fallback);
        return;
      }
      
      console.log("✅ [useAuthState] UserData obtido:", data.email);
      setUserData(data);
      
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro ao buscar userData:", error);
      
      // Fallback final sempre funciona
      if (user) {
        const userEmail = (user.email || '').toLowerCase();
        const fallback = ADMIN_EMAILS.includes(userEmail) 
          ? createAdminFallback(user)
          : {
              id: userId,
              email: user.email || '',
              nome_empresa: 'Empresa',
              is_admin: false,
              ativo: true
            };
        setUserData(fallback);
      }
    }
  }, [user, createAdminFallback]);

  // Login OTIMIZADO
  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    console.log("🔐 [useAuthState] Iniciando login para:", email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.error("❌ [useAuthState] Erro no login:", error);
        setLoading(false);
        return { success: false, message: error.message };
      }
      
      if (data.user && data.session) {
        console.log("✅ [useAuthState] Login bem-sucedido");
        setUser(data.user);
        setSession(data.session);
        
        // Para admins, criar userData imediatamente
        const userEmail = (data.user.email || '').toLowerCase();
        if (ADMIN_EMAILS.includes(userEmail)) {
          const adminData = createAdminFallback(data.user);
          setUserData(adminData);
        } else {
          // Para usuários normais, buscar em background
          fetchUserData(data.user.id);
        }
        
        setLoading(false);
        return { success: true, message: "Login realizado com sucesso" };
      }
      
      setLoading(false);
      return { success: false, message: "Falha na autenticação" };
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no signIn:", error);
      setLoading(false);
      return { success: false, message: "Erro interno no login" };
    }
  }, [fetchUserData, createAdminFallback]);

  // Logout SIMPLIFICADO
  const signOut = useCallback(async () => {
    console.log("🚪 [useAuthState] Executando logout...");
    
    try {
      if (user?.id) {
        sessionStorage.removeItem(`userData_${user.id}`);
      }
      
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserData(null);
      console.log("✅ [useAuthState] Logout completo");
    } catch (error: any) {
      console.error("❌ [useAuthState] Erro no logout:", error);
    }
  }, [user]);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
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

  // Inicialização CORRIGIDA - sem race condition
  useEffect(() => {
    if (initializationComplete.current) return;
    
    const initAuth = async () => {
      try {
        console.log("🔧 [useAuthState] Inicializando autenticação...");
        
        // Setup listener PRIMEIRO
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
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
              
              // Para admins, userData imediato
              const userEmail = (session.user.email || '').toLowerCase();
              if (ADMIN_EMAILS.includes(userEmail)) {
                const adminData = createAdminFallback(session.user);
                setUserData(adminData);
              } else {
                await fetchUserData(session.user.id);
              }
            }
            
            setLoading(false);
          }
        );

        authSubscription.current = subscription;

        // Verificar sessão existente DEPOIS
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession?.user) {
          console.log("🔍 [useAuthState] Sessão existente encontrada");
          setSession(existingSession);
          setUser(existingSession.user);
          
          // Para admins, userData imediato
          const userEmail = (existingSession.user.email || '').toLowerCase();
          if (ADMIN_EMAILS.includes(userEmail)) {
            const adminData = createAdminFallback(existingSession.user);
            setUserData(adminData);
          } else {
            await fetchUserData(existingSession.user.id);
          }
        } else {
          console.log("🔍 [useAuthState] Nenhuma sessão existente");
        }
        
        setLoading(false);
        initializationComplete.current = true;

      } catch (error) {
        console.error("❌ [useAuthState] Erro na inicialização:", error);
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (authSubscription.current) {
        authSubscription.current.unsubscribe();
      }
    };
  }, [fetchUserData, createAdminFallback]);

  // Timeout de segurança REDUZIDO para 10 segundos
  useEffect(() => {
    if (!loading) return;
    
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("⏰ [useAuthState] Timeout de carregamento (10s) - finalizando");
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
