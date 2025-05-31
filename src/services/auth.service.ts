
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

/**
 * Resultado de operações de autenticação
 */
interface AuthResult {
  success: boolean;
  message: string;
  user?: User | null;
  session?: Session | null;
}

/**
 * Dados do usuário na tabela users
 */
interface UserData {
  id: string;
  email: string;
  nome_empresa: string;
  is_admin: boolean;
  data_validade: string;
  data_entrada: string;
  ativo: boolean;
  subscription_status?: string;
  subscription_expires_at?: string;
}

/**
 * Serviço de autenticação integrado com Supabase
 * Gerencia login, logout, sessões e polling de status do usuário
 */
class AuthService {
  private pollingInterval: NodeJS.Timeout | null = null;
  private readonly POLLING_INTERVAL_MS = 30000; // 30 segundos

  /**
   * Realiza login do usuário com validação de dados
   * @param email Email do usuário
   * @param password Senha do usuário
   * @param rememberMe Se true, mantém sessão ativa por mais tempo
   * @returns Resultado da autenticação com dados do usuário
   */
  async signIn(email: string, password: string, rememberMe: boolean = false): Promise<AuthResult> {
    try {
      console.log("🔐 Iniciando processo de login...");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Erro na autenticação:", error);
        return {
          success: false,
          message: this.getErrorMessage(error.message),
        };
      }

      if (data.user && data.session) {
        console.log("✅ Autenticação bem-sucedida");

        // Verificar dados do usuário na tabela users
        const userData = await this.fetchUserData(data.user.id);
        
        if (!userData || !userData.ativo) {
          console.warn("⚠️ Usuário inativo ou não encontrado");
          await this.signOut();
          return {
            success: false,
            message: "Usuário inativo ou não encontrado",
          };
        }

        // Verificar validade da assinatura
        if (!this.isSubscriptionValid(userData.data_validade)) {
          console.warn("⚠️ Assinatura expirada");
          return {
            success: false,
            message: "Assinatura expirada",
            user: data.user,
            session: data.session,
          };
        }

        // Configurar persistência da sessão
        if (rememberMe) {
          localStorage.setItem('supabase.auth.token', data.session.access_token);
          console.log("💾 Sessão configurada para lembrar");
        }

        return {
          success: true,
          message: "Login realizado com sucesso",
          user: data.user,
          session: data.session,
        };
      }

      return {
        success: false,
        message: "Falha na autenticação",
      };
    } catch (error: any) {
      console.error("❌ Erro interno no login:", error);
      return {
        success: false,
        message: "Erro interno do servidor",
      };
    }
  }

  /**
   * Realiza logout do usuário e limpa dados armazenados
   */
  async signOut(): Promise<void> {
    try {
      console.log("🚪 Executando logout...");
      
      this.stopPolling();
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      await supabase.auth.signOut();
      
      console.log("✅ Logout realizado com sucesso");
    } catch (error: any) {
      console.error("❌ Erro no logout:", error);
    }
  }

  /**
   * Obtém a sessão atual do usuário
   * @returns Sessão ativa ou null
   */
  async getUserSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error: any) {
      console.error("❌ Erro ao obter sessão:", error);
      return null;
    }
  }

  /**
   * Obtém o usuário atual
   * @returns Usuário ativo ou null
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error: any) {
      console.error("❌ Erro ao obter usuário:", error);
      return null;
    }
  }

  /**
   * Atualiza o token de acesso da sessão
   * @returns Resultado da renovação com novos dados
   */
  async refreshSession(): Promise<AuthResult> {
    try {
      console.log("🔄 Renovando sessão...");
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("❌ Erro ao renovar sessão:", error);
        return {
          success: false,
          message: "Falha ao renovar sessão",
        };
      }

      console.log("✅ Sessão renovada com sucesso");
      return {
        success: true,
        message: "Token renovado",
        user: data.user,
        session: data.session,
      };
    } catch (error: any) {
      console.error("❌ Erro interno ao renovar token:", error);
      return {
        success: false,
        message: "Erro interno",
      };
    }
  }

  /**
   * Busca dados completos do usuário na tabela users
   * @param userId ID do usuário
   * @returns Dados do usuário ou null se não encontrado
   */
  async fetchUserData(userId: string): Promise<UserData | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("❌ Erro ao buscar dados do usuário:", error);
        return null;
      }

      return data;
    } catch (error: any) {
      console.error("❌ Erro na consulta de usuário:", error);
      return null;
    }
  }

  /**
   * Verifica se a assinatura do usuário está válida
   * @param dataValidade Data de validade da assinatura
   * @returns true se válida, false se expirada
   */
  private isSubscriptionValid(dataValidade: string): boolean {
    return new Date(dataValidade) > new Date();
  }

  /**
   * Inicia polling para monitorar status do usuário em background
   * @param callback Função chamada a cada verificação
   */
  startPolling(callback: (user: User | null) => void): void {
    this.stopPolling();
    
    console.log("🔄 Iniciando polling de usuário");
    
    this.pollingInterval = setInterval(async () => {
      try {
        const user = await this.getCurrentUser();
        callback(user);
      } catch (error) {
        console.error("❌ Erro no polling:", error);
      }
    }, this.POLLING_INTERVAL_MS);
  }

  /**
   * Para o polling ativo para evitar memory leaks
   */
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log("⏹️ Polling parado");
    }
  }

  /**
   * Traduz mensagens de erro do Supabase para português
   * @param error Mensagem de erro original
   * @returns Mensagem traduzida e amigável
   */
  private getErrorMessage(error: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Email ou senha incorretos',
      'Email not confirmed': 'Email não confirmado',
      'Too many requests': 'Muitas tentativas. Tente novamente mais tarde',
      'User not found': 'Usuário não encontrado',
      'Invalid email': 'Email inválido',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'User already registered': 'Este email já está cadastrado',
    };

    return errorMap[error] || 'Erro na autenticação';
  }
}

export const authService = new AuthService();
