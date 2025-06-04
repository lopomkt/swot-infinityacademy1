
import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/types/formData';

/**
 * Resultado da análise OpenRouter
 */
interface OpenRouterAnalysis {
  ai_block_pronto: boolean;
  openrouter_prompt_ok: boolean;
  groq_prompt_ok: boolean;
  analise_completa: any;
  timestamp: string;
  model_used: string;
}

/**
 * Resposta da edge function
 */
interface OpenRouterResponse {
  success: boolean;
  resultado?: OpenRouterAnalysis;
  error?: string;
}

/**
 * Serviço para integração com OpenRouter via Supabase Edge Function
 */
class OpenRouterService {
  /**
   * Gera análise SWOT usando OpenRouter
   * @param formData Dados completos do formulário
   * @returns Análise estruturada ou erro
   */
  async generateAnalysis(formData: FormData): Promise<OpenRouterAnalysis> {
    try {
      console.log('🤖 Iniciando análise com OpenRouter...');

      // Validar dados essenciais
      if (!formData.identificacao?.nomeEmpresa) {
        throw new Error('Nome da empresa é obrigatório para análise');
      }

      // Obter token de autenticação
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Usuário não autenticado');
      }

      // Chamar edge function
      const { data, error } = await supabase.functions.invoke('openrouter-analysis', {
        body: { formData },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('❌ Erro na edge function:', error);
        throw new Error(`Falha na chamada da API: ${error.message}`);
      }

      const response = data as OpenRouterResponse;

      if (!response.success || !response.resultado) {
        console.error('❌ Resposta inválida:', response);
        throw new Error(response.error || 'Falha na geração da análise');
      }

      console.log('✅ Análise gerada com sucesso!');
      return response.resultado;

    } catch (error: any) {
      console.error('❌ Erro no OpenRouterService:', error);
      
      // Retornar estrutura de erro compatível
      throw new Error(
        error.message || 'Erro interno na geração da análise'
      );
    }
  }

  /**
   * Verifica se uma análise está válida e completa
   * @param analysis Análise para validar
   * @returns true se válida
   */
  validateAnalysis(analysis: any): boolean {
    if (!analysis || typeof analysis !== 'object') {
      return false;
    }

    // Verificar estrutura mínima
    return (
      analysis.ai_block_pronto === true &&
      analysis.openrouter_prompt_ok === true &&
      analysis.analise_completa &&
      typeof analysis.analise_completa === 'object'
    );
  }

  /**
   * Transforma dados do OpenRouter para formato compatível com o sistema
   * @param analysis Análise do OpenRouter
   * @returns Dados formatados para o ResultadoFinal
   */
  formatAnalysisForResults(analysis: OpenRouterAnalysis): any {
    try {
      const { analise_completa } = analysis;

      // Se for resposta bruta (fallback), criar estrutura básica
      if (analise_completa.raw_response) {
        return {
          ...analysis,
          diagnostico_consultivo: analise_completa.diagnostico || 'Análise gerada com sucesso',
          score_estrategico: 75, // Score padrão
        };
      }

      // Estrutura completa
      return {
        ...analysis,
        diagnostico_consultivo: analise_completa.diagnostico || '',
        matriz_swot: analise_completa.matriz_swot || {},
        estrategias_cruzadas: analise_completa.estrategias_cruzadas || {},
        plano_acao: analise_completa.plano_acao || {},
        score_estrategico: analise_completa.score_estrategico?.score_geral || 75,
        detalhes_score: analise_completa.score_estrategico || {},
      };

    } catch (error) {
      console.error('❌ Erro ao formatar análise:', error);
      
      // Fallback básico
      return {
        ...analysis,
        diagnostico_consultivo: 'Análise gerada. Verifique os dados detalhados.',
        score_estrategico: 70,
      };
    }
  }
}

export const openRouterService = new OpenRouterService();
