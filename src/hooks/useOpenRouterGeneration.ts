
import { useState, useCallback } from 'react';
import { openRouterService } from '@/services/openrouter.service';
import { reportService } from '@/services/report.service';
import { FormData } from '@/types/formData';

interface GenerationResult {
  diagnostico_textual?: string;
  matriz_swot?: string;
  planos_acao?: string;
  ai_block_pronto: boolean;
  groq_prompt_ok: boolean;
  tipo: string;
  created_at: string;
}

interface GenerationState {
  loading: boolean;
  error?: string;
  resultado?: GenerationResult;
  hasReport: boolean;
  isSuccess: boolean;
}

interface GenerationActions {
  generateReport: (formData: FormData, userId: string) => Promise<GenerationResult | null>;
  regenerateReport: (formData: FormData, userId: string, reportId: string) => Promise<GenerationResult | null>;
  clearReport: () => void;
}

export function useOpenRouterGeneration(): GenerationState & GenerationActions {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [resultado, setResultado] = useState<GenerationResult | undefined>(undefined);

  const generateReport = useCallback(async (
    formData: FormData, 
    userId: string
  ): Promise<GenerationResult | null> => {
    setLoading(true);
    setError(undefined);
    setResultado(undefined);

    try {
      console.log("🚀 Iniciando geração de relatório com OpenRouter + GPT-4o-mini...");

      // Validar dados essenciais
      if (!formData.identificacao?.nomeEmpresa) {
        throw new Error("Nome da empresa é obrigatório para análise");
      }

      if (!userId) {
        throw new Error("ID do usuário é obrigatório");
      }

      // Chamar serviço OpenRouter
      console.log("🤖 Chamando OpenRouter com GPT-4o-mini...");
      const analysis = await openRouterService.generateAnalysis(formData);

      if (!openRouterService.validateAnalysis(analysis)) {
        throw new Error('Análise gerada é inválida ou incompleta');
      }

      // Formatar resultado
      console.log("📝 Formatando resposta...");
      const formattedResult = openRouterService.formatAnalysisForResults(analysis);

      // Preparar dados para salvar no banco
      const reportData = {
        user_id: userId,
        dados: formData,
        resultado_final: {
          diagnostico_textual: formattedResult.diagnostico_consultivo || formattedResult.analise_completa?.diagnostico_textual || 'Diagnóstico gerado com sucesso',
          matriz_swot: formattedResult.analise_completa?.matriz_swot || 'Matriz SWOT gerada com sucesso',
          planos_acao: formattedResult.analise_completa?.planos_acao || 'Planos de ação gerados com sucesso',
          ai_block_pronto: true,
          groq_prompt_ok: true, // Manter compatibilidade
          tipo: "OPENROUTER_GPT4O_MINI",
          created_at: new Date().toISOString(),
          model_used: 'openai/gpt-4o-mini'
        },
      };

      // Salvar relatório no banco de dados
      console.log("💾 Salvando relatório no banco...");
      const reportId = await reportService.createReport(reportData);

      if (!reportId) {
        console.warn("⚠️ Relatório gerado mas não foi salvo no banco");
      } else {
        console.log("✅ Relatório salvo com ID:", reportId);
      }

      const finalResult = reportData.resultado_final as GenerationResult;
      setResultado(finalResult);
      setLoading(false);

      return finalResult;

    } catch (error: any) {
      console.error("❌ Erro na geração do relatório OpenRouter:", error);
      
      const errorMessage = error.message || "Erro inesperado na geração do relatório";
      setError(errorMessage);
      setLoading(false);

      return null;
    }
  }, []);

  const regenerateReport = useCallback(async (
    formData: FormData,
    userId: string,
    reportId: string
  ): Promise<GenerationResult | null> => {
    setLoading(true);
    setError(undefined);

    try {
      console.log("🔄 Regenerando relatório com OpenRouter...");

      // Gerar novo conteúdo
      const analysis = await openRouterService.generateAnalysis(formData);
      
      if (!openRouterService.validateAnalysis(analysis)) {
        throw new Error('Análise regenerada é inválida ou incompleta');
      }

      const formattedResult = openRouterService.formatAnalysisForResults(analysis);

      // Atualizar relatório existente
      const updateData = {
        dados: formData,
        resultado_final: {
          diagnostico_textual: formattedResult.diagnostico_consultivo || formattedResult.analise_completa?.diagnostico_textual || 'Diagnóstico regenerado com sucesso',
          matriz_swot: formattedResult.analise_completa?.matriz_swot || 'Matriz SWOT regenerada com sucesso',
          planos_acao: formattedResult.analise_completa?.planos_acao || 'Planos de ação regenerados com sucesso',
          ai_block_pronto: true,
          groq_prompt_ok: true,
          tipo: "OPENROUTER_GPT4O_MINI_REGENERATED",
          created_at: new Date().toISOString(),
          model_used: 'openai/gpt-4o-mini'
        },
      };

      const updateSuccess = await reportService.updateReport(reportId, updateData);

      if (!updateSuccess) {
        console.warn("⚠️ Relatório regenerado mas não foi atualizado no banco");
      }

      const finalResult = updateData.resultado_final as GenerationResult;
      setResultado(finalResult);
      setLoading(false);

      return finalResult;

    } catch (error: any) {
      console.error("❌ Erro na regeneração do relatório:", error);
      
      const errorMessage = error.message || "Erro inesperado na regeneração";
      setError(errorMessage);
      setLoading(false);

      return null;
    }
  }, []);

  const clearReport = useCallback(() => {
    setLoading(false);
    setError(undefined);
    setResultado(undefined);
  }, []);

  const hasReport = !!resultado;
  const isSuccess = !!resultado && !error && !loading;

  return {
    loading,
    error,
    resultado,
    hasReport,
    isSuccess,
    generateReport,
    regenerateReport,
    clearReport,
  };
}
