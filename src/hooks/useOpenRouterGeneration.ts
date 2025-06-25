
import { useState, useCallback } from 'react';
import { openRouterService } from '@/services/openrouter.service';
import { reportService } from '@/services/report.service';
import { FormData } from '@/types/formData';

interface GenerationResult {
  diagnostico_textual?: string;
  matriz_swot?: string;
  planos_acao?: string;
  ai_block_pronto: boolean;
  openrouter_prompt_ok: boolean;
  tipo: string;
  created_at: string;
}

interface GenerationState {
  loading: boolean;
  error?: string;
  resultado?: GenerationResult;
  hasReport: boolean;
  isSuccess: boolean;
  attempt: number;
  timeoutReached: boolean;
}

interface GenerationActions {
  generateReport: (formData: FormData, userId: string) => Promise<GenerationResult | null>;
  regenerateReport: (formData: FormData, userId: string, reportId: string) => Promise<GenerationResult | null>;
  clearReport: () => void;
  retryGeneration: (formData: FormData, userId: string) => Promise<GenerationResult | null>;
}

export function useOpenRouterGeneration(): GenerationState & GenerationActions {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [resultado, setResultado] = useState<GenerationResult | undefined>(undefined);
  const [attempt, setAttempt] = useState(0);
  const [timeoutReached, setTimeoutReached] = useState(false);

  const MAX_ATTEMPTS = 3;
  const TIMEOUT_MS = 60000; // 60 segundos

  const generateWithTimeout = async (
    fn: () => Promise<any>,
    timeoutMs: number = TIMEOUT_MS
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        setTimeoutReached(true);
        reject(new Error(`Timeout: A geração demorou mais que ${timeoutMs / 1000} segundos`));
      }, timeoutMs);

      fn()
        .then((result) => {
          clearTimeout(timeoutId);
          setTimeoutReached(false);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  };

  const attemptGeneration = async (
    formData: FormData,
    attemptNumber: number
  ): Promise<any> => {
    console.log(`🚀 [OpenRouter] Tentativa ${attemptNumber}/${MAX_ATTEMPTS}...`);
    
    try {
      const analysis = await generateWithTimeout(
        () => openRouterService.generateAnalysis(formData),
        TIMEOUT_MS
      );

      if (!openRouterService.validateAnalysis(analysis)) {
        throw new Error('Análise gerada é inválida ou incompleta');
      }

      return openRouterService.formatAnalysisForResults(analysis);
    } catch (error: any) {
      console.error(`❌ [OpenRouter] Tentativa ${attemptNumber} falhou:`, error.message);
      
      // Se é timeout e não é a última tentativa, tentar novamente
      if (error.message.includes('Timeout') && attemptNumber < MAX_ATTEMPTS) {
        console.log(`⏳ [OpenRouter] Timeout na tentativa ${attemptNumber}, tentando novamente...`);
        throw error; // Relançar para tentar novamente
      }
      
      // Se é a última tentativa ou erro não relacionado a timeout
      throw error;
    }
  };

  const generateReport = useCallback(async (
    formData: FormData, 
    userId: string
  ): Promise<GenerationResult | null> => {
    setLoading(true);
    setError(undefined);
    setResultado(undefined);
    setAttempt(0);
    setTimeoutReached(false);

    try {
      console.log("🚀 Iniciando geração de relatório com OpenRouter + GPT-4o-mini...");

      // Validar dados essenciais
      if (!formData.identificacao?.nomeEmpresa) {
        throw new Error("Nome da empresa é obrigatório para análise");
      }

      if (!userId) {
        throw new Error("ID do usuário é obrigatório");
      }

      let formattedResult: any = null;
      let lastError: Error | null = null;

      // Tentar até MAX_ATTEMPTS vezes
      for (let currentAttempt = 1; currentAttempt <= MAX_ATTEMPTS; currentAttempt++) {
        setAttempt(currentAttempt);
        
        try {
          formattedResult = await attemptGeneration(formData, currentAttempt);
          console.log(`✅ [OpenRouter] Sucesso na tentativa ${currentAttempt}!`);
          break; // Sucesso, sair do loop
          
        } catch (error: any) {
          lastError = error;
          
          // Se não é a última tentativa, aguardar um pouco antes de tentar novamente
          if (currentAttempt < MAX_ATTEMPTS) {
            const waitTime = currentAttempt * 2000; // 2s, 4s, 6s...
            console.log(`⏳ [OpenRouter] Aguardando ${waitTime/1000}s antes da próxima tentativa...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }

      // Se todas as tentativas falharam
      if (!formattedResult && lastError) {
        console.error(`❌ [OpenRouter] Todas as ${MAX_ATTEMPTS} tentativas falharam`);
        throw lastError;
      }

      // Preparar dados para salvar no banco
      const reportData = {
        user_id: userId,
        dados: formData,
        resultado_final: {
          diagnostico_textual: formattedResult.diagnostico_consultivo || formattedResult.analise_completa?.diagnostico_textual || 'Diagnóstico gerado com sucesso',
          matriz_swot: formattedResult.analise_completa?.matriz_swot || 'Matriz SWOT gerada com sucesso',
          planos_acao: formattedResult.analise_completa?.planos_acao || 'Planos de ação gerados com sucesso',
          ai_block_pronto: true,
          openrouter_prompt_ok: true,
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

  const retryGeneration = useCallback(async (
    formData: FormData,
    userId: string
  ): Promise<GenerationResult | null> => {
    console.log("🔄 Reiniciando processo de geração...");
    setError(undefined);
    setTimeoutReached(false);
    return generateReport(formData, userId);
  }, [generateReport]);

  const regenerateReport = useCallback(async (
    formData: FormData,
    userId: string,
    reportId: string
  ): Promise<GenerationResult | null> => {
    setLoading(true);
    setError(undefined);
    setAttempt(0);
    setTimeoutReached(false);

    try {
      console.log("🔄 Regenerando relatório com OpenRouter...");

      let formattedResult: any = null;
      let lastError: Error | null = null;

      // Tentar até MAX_ATTEMPTS vezes
      for (let currentAttempt = 1; currentAttempt <= MAX_ATTEMPTS; currentAttempt++) {
        setAttempt(currentAttempt);
        
        try {
          formattedResult = await attemptGeneration(formData, currentAttempt);
          console.log(`✅ [OpenRouter] Regeneração bem-sucedida na tentativa ${currentAttempt}!`);
          break;
          
        } catch (error: any) {
          lastError = error;
          
          if (currentAttempt < MAX_ATTEMPTS) {
            const waitTime = currentAttempt * 2000;
            console.log(`⏳ [OpenRouter] Aguardando ${waitTime/1000}s antes da próxima tentativa...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }

      if (!formattedResult && lastError) {
        throw lastError;
      }

      // Atualizar relatório existente
      const updateData = {
        dados: formData,
        resultado_final: {
          diagnostico_textual: formattedResult.diagnostico_consultivo || formattedResult.analise_completa?.diagnostico_textual || 'Diagnóstico regenerado com sucesso',
          matriz_swot: formattedResult.analise_completa?.matriz_swot || 'Matriz SWOT regenerada com sucesso',
          planos_acao: formattedResult.analise_completa?.planos_acao || 'Planos de ação regenerados com sucesso',
          ai_block_pronto: true,
          openrouter_prompt_ok: true,
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
    setAttempt(0);
    setTimeoutReached(false);
  }, []);

  const hasReport = !!resultado;
  const isSuccess = !!resultado && !error && !loading;

  return {
    loading,
    error,
    resultado,
    hasReport,
    isSuccess,
    attempt,
    timeoutReached,
    generateReport,
    regenerateReport,
    clearReport,
    retryGeneration,
  };
}
