
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  id: string;
  email: string;
  nome_empresa: string;
  data_validade: string;
  ativo: boolean | null;
  is_admin: boolean | null;
}

export const useUserPolling = () => {
  const pollUserData = async (userId: string): Promise<UserData | null> => {
    console.log("[Polling] Iniciando polling para user ID:", userId);
    
    for (let i = 0; i < 10; i++) {
      try {
        console.log(`[Polling] Tentativa ${i + 1}/10 para user ID: ${userId}`);
        
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.log(`[Polling] Erro na tentativa ${i + 1}:`, error.message);
        }

        if (data) {
          console.log("[Polling] Dados encontrados na tentativa", i + 1, ":", data);
          return data as UserData;
        }

        // Aguardar 500ms antes da próxima tentativa
        if (i < 9) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (err) {
        console.error(`[Polling] Erro crítico na tentativa ${i + 1}:`, err);
      }
    }

    console.log("[Polling] Resultado final para ID:", userId, "- não encontrado após 10 tentativas");
    return null;
  };

  const setupRealtimeListener = (userId: string, onUserFound: (userData: UserData) => void) => {
    console.log("[Realtime] Configurando listener para user ID:", userId);
    
    const channel = supabase
      .channel(`user-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          console.log("[Realtime] Novo usuário detectado:", payload.new);
          onUserFound(payload.new as UserData);
        }
      )
      .subscribe();

    return channel;
  };

  return { pollUserData, setupRealtimeListener };
};
