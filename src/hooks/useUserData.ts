
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
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

const ADMIN_EMAILS = [
  'infinitymkt00@gmail.com',
  'admin@swotinsights.com',
  'admin@infinityacademy.com'
];

export function useUserData(user: User | null) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const createAdminFallback = useCallback((authUser: User): UserData => {
    const email = authUser.email || '';
    const isAdminEmail = ADMIN_EMAILS.includes(email.toLowerCase());
    
    return {
      id: authUser.id,
      email,
      nome_empresa: 'Admin',
      is_admin: isAdminEmail,
      ativo: true
    };
  }, []);

  const fetchUserData = useCallback(async (userId: string): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await Promise.race([
        supabase.from('users').select('*').eq('id', userId).maybeSingle(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 6000))
      ]) as any;
      
      if (error || !data) {
        // Fallback logic
        const userEmail = (user.email || '').toLowerCase();
        if (ADMIN_EMAILS.includes(userEmail)) {
          const adminFallback = createAdminFallback(user);
          setUserData(adminFallback);
          return;
        }
        
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
      
      setUserData(data);
      
    } catch (error: any) {
      console.error("❌ [useUserData] Erro:", error);
      
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
    } finally {
      setLoading(false);
    }
  }, [user, createAdminFallback]);

  useEffect(() => {
    if (user?.id) {
      const userEmail = (user.email || '').toLowerCase();
      if (ADMIN_EMAILS.includes(userEmail)) {
        const adminData = createAdminFallback(user);
        setUserData(adminData);
      } else {
        fetchUserData(user.id);
      }
    } else {
      setUserData(null);
    }
  }, [user, fetchUserData, createAdminFallback]);

  return { userData, loading };
}
