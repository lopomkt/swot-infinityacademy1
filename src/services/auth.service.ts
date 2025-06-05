
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
 * VERSÃO SIMPLIFICADA - Foco na estabilidade do login
 */
class AuthService {
  private pollingInterval: NodeJS.Timeout | null = null;
  private readonly POLLING_INTERVAL_MS = 30000; // 30 segundos
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 segundo

  /**
   * Realiza login do usuário - FLUXO SIMPLIFICADO
   * @param email Email do usuário
   * @param password Senha do usuário
   * @param rememberMe Se true, mantém sessão ativa por mais tempo
   * @returns Resultado da autenticação
   */
  async signIn(email: string, password: string, rememberMe: boolean = false): Promise<AuthResult> {
    try {
      console.log("🔐 [AuthService] Iniciando login para:", email);

      // ETAPA 1: Autenticação básica no Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error("❌ [AuthService] Erro na autenticação Supabase:", error.message);
        return {
          success: false,
          message: this.getErrorMessage(error.message),
        };
      }

      if (!data.user || !data.session) {
        console.error("❌ [AuthService] Dados de autenticação inválidos");
        return {
          success: false,
          message: "Falha na autenticação - dados inválidos",
        };
      }

      console.log("✅ [AuthService] Autenticação Supabase bem-sucedida para:", data.user.email);

      // ETAPA 2: Configurar persistência se solicitado
      if (rememberMe) {
        try {
          localStorage.setItem('supabase.auth.token', data.session.access_token);
          localStorage.setItem('remember_me', 'true');
          console.log("💾 [AuthService] Sessão configurada para persistir");
        } catch (err) {
          console.warn("⚠️ [AuthService] Falha ao configurar persistência:", err);
        }
      }

      // ETAPA 3: Retornar sucesso IMEDIATAMENTE
      // A validação de userData será feita em background pelo useAuthState
      return {
        success: true,
        message: "Login realizado com sucesso",
        user: data.user,
        session: data.session,
      };

    } catch (error: any) {
      console.error("❌ [AuthService] Erro interno no login:", error);
      return {
        success: false,
        message: "Erro interno do servidor",
      };
    }
  }

  /**
   * Busca dados do usuário com retry automático
   * @param userId ID do usuário
   * @param retryCount Contador de tentativas
   * @returns Dados do usuário ou null
   */
  async fetchUserData(userId: string, retryCount: number = 0): Promise<UserData | null> {
    try {
      console.log(`🔍 [AuthService] Buscando dados do usuário (tentativa ${retryCount + 1}):`, userId);

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("❌ [AuthService] Erro ao buscar dados do usuário:", error);
        
        // Retry automático em caso de erro
        if (retryCount < this.MAX_RETRIES) {
          console.log(`🔄 [AuthService] Tentando novamente em ${this.RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          return this.fetchUserData(userId, retryCount + 1);
        }
        
        return null;
      }

      if (!data) {
        console.warn("⚠️ [AuthService] Usuário não encontrado na tabela users:", userId);
        
        // Retry para casos de eventual inconsistência
        if (retryCount < this.MAX_RETRIES) {
          console.log(`🔄 [AuthService] Retry para usuário não encontrado em ${this.RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          return this.fetchUserData(userId, retryCount + 1);
        }
        
        return null;
      }

      console.log("✅ [AuthService] Dados do usuário obtidos:", {
        email: data.email,
        nome_empresa: data.nome_empresa,
        is_admin: data.is_admin,
        ativo: data.ativo
      });

      return data;
    } catch (error: any) {
      console.error("❌ [AuthService] Erro na consulta de usuário:", error);
      
      // Retry em caso de erro de rede
      if (retryCount < this.MAX_RETRIES) {
        console.log(`🔄 [AuthService] Retry por erro de rede em ${this.RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        return this.fetchUserData(userId, retryCount + 1);
      }
      
      return null;
    }
  }

  /**
   * Realiza logout do usuário e limpa dados armazenados
   */
  async signOut(): Promise<void> {
    try {
      console.log("🚪 [AuthService] Executando logout...");
      
      this.stopPolling();
      
      // Limpar dados locais
      try {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('remember_me');
        sessionStorage.clear();
      } catch (err) {
        console.warn("⚠️ [AuthService] Erro ao limpar storage local:", err);
      }
      
      await supabase.auth.signOut();
      
      console.log("✅ [AuthService] Logout realizado com sucesso");
    } catch (error: any) {
      console.error("❌ [AuthService] Erro no logout:", error);
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
      console.error("❌ [AuthService] Erro ao obter sessão:", error);
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
      console.error("❌ [AuthService] Erro ao obter usuário:", error);
      return null;
    }
  }

  /**
   * Atualiza o token de acesso da sessão
   * @returns Resultado da renovação com novos dados
   */
  async refreshSession(): Promise<AuthResult> {
    try {
      console.log("🔄 [AuthService] Renovando sessão...");
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("❌ [AuthService] Erro ao renovar sessão:", error);
        return {
          success: false,
          message: "Falha ao renovar sessão",
        };
      }

      console.log("✅ [AuthService] Sessão renovada com sucesso");
      return {
        success: true,
        message: "Token renovado",
        user: data.user,
        session: data.session,
      };
    } catch (error: any) {
      console.error("❌ [AuthService] Erro interno ao renovar token:", error);
      return {
        success: false,
        message: "Erro interno",
      };
    }
  }

  /**
   * Verifica se a assinatura do usuário está válida
   * @param dataValidade Data de validade da assinatura
   * @returns true se válida, false se expirada
   */
  isSubscriptionValid(dataValidade: string): boolean {
    try {
      return new Date(dataValidade) > new Date();
    } catch {
      return false;
    }
  }

  /**
   * Inicia polling para monitorar status do usuário em background
   * @param callback Função chamada a cada verificação
   */
  startPolling(callback: (user: User | null) => void): void {
    this.stopPolling();
    
    console.log("🔄 [AuthService] Iniciando polling de usuário");
    
    this.pollingInterval = setInterval(async () => {
      try {
        const user = await this.getCurrentUser();
        callback(user);
      } catch (error) {
        console.error("❌ [AuthService] Erro no polling:", error);
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
      console.log("⏹️ [AuthService] Polling parado");
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
      'signup_disabled': 'Cadastro temporariamente desabilitado',
      'email_address_invalid': 'Endereço de email inválido',
      'weak_password': 'Senha muito fraca',
    };

    return errorMap[error] || `Erro na autenticação: ${error}`;
  }
}

export const authService = new AuthService();
