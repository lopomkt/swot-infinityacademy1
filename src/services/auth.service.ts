
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthResult {
  success: boolean;
  message: string;
  user?: User | null;
  session?: Session | null;
}

interface UserData {
  id: string;
  email: string;
  nome_empresa: string;
  is_admin: boolean;
  data_validade: string;
  data_entrada: string;
  ativo: boolean;
}

class AuthService {
  private pollingInterval: NodeJS.Timeout | null = null;
  private readonly POLLING_INTERVAL_MS = 30000; // 30 segundos

  /**
   * Realiza login do usuário
   * @param email Email do usuário
   * @param password Senha do usuário
   * @param rememberMe Se true, mantém sessão ativa
   * @returns Resultado da autenticação
   */
  async signIn(email: string, password: string, rememberMe: boolean = false): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          message: this.getErrorMessage(error.message),
        };
      }

      if (data.user && data.session) {
        // Verificar dados do usuário na tabela users
        const userData = await this.fetchUserData(data.user.id);
        
        if (!userData || !userData.ativo) {
          await this.signOut();
          return {
            success: false,
            message: "Usuário inativo ou não encontrado",
          };
        }

        // Verificar validade da assinatura
        if (!this.isSubscriptionValid(userData.data_validade)) {
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
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        message: "Erro interno do servidor",
      };
    }
  }

  /**
   * Realiza logout do usuário
   */
  async signOut(): Promise<void> {
    try {
      this.stopPolling();
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  }

  /**
   * Obtém a sessão atual do usuário
   */
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error("Erro ao obter sessão:", error);
      return null;
    }
  }

  /**
   * Obtém o usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error("Erro ao obter usuário:", error);
      return null;
    }
  }

  /**
   * Atualiza o token de acesso
   */
  async refreshToken(): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        return {
          success: false,
          message: "Falha ao renovar sessão",
        };
      }

      return {
        success: true,
        message: "Token renovado",
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      return {
        success: false,
        message: "Erro interno",
      };
    }
  }

  /**
   * Busca dados do usuário na tabela users
   */
  async fetchUserData(userId: string): Promise<UserData | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Erro na consulta de usuário:", error);
      return null;
    }
  }

  /**
   * Verifica se a assinatura está válida
   */
  private isSubscriptionValid(dataValidade: string): boolean {
    return new Date(dataValidade) > new Date();
  }

  /**
   * Inicia polling para monitorar status do usuário
   */
  startPolling(callback: (user: User | null) => void): void {
    this.stopPolling();
    
    this.pollingInterval = setInterval(async () => {
      const user = await this.getCurrentUser();
      callback(user);
    }, this.POLLING_INTERVAL_MS);
  }

  /**
   * Para o polling
   */
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /**
   * Traduz mensagens de erro para português
   */
  private getErrorMessage(error: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Email ou senha incorretos',
      'Email not confirmed': 'Email não confirmado',
      'Too many requests': 'Muitas tentativas. Tente novamente mais tarde',
      'User not found': 'Usuário não encontrado',
      'Invalid email': 'Email inválido',
    };

    return errorMap[error] || 'Erro na autenticação';
  }
}

export const authService = new AuthService();
