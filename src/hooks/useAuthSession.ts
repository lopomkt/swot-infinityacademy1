
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UseAuthSessionReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  refreshToken: () => Promise<{success: boolean; message: string}>;
}

export function useAuthSession(): UseAuthSessionReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshToken = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("❌ [useAuthSession] Erro ao renovar sessão:", error);
        return { success: false, message: "Falha ao renovar sessão" };
      }

      if (data.user && data.session) {
        setUser(data.user);
        setSession(data.session);
      }
      
      return { success: true, message: "Token renovado" };
    } catch (error: any) {
      console.error("❌ [useAuthSession] Erro no refreshToken:", error);
      return { success: false, message: "Erro ao renovar token" };
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Setup listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log(`🔐 [useAuthSession] Auth event: ${event}`);
        
        if (event === 'SIGNED_OUT' || !session) {
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
        }
        
        setLoading(false);
      }
    );

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (session?.user) {
        setSession(session);
        setUser(session.user);
      }
      setLoading(false);
    });

    // Safety timeout
    const timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn("⏰ [useAuthSession] Timeout - finalizando");
        setLoading(false);
      }
    }, 8000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [loading]);

  return {
    user,
    session,
    loading,
    refreshToken,
  };
}
