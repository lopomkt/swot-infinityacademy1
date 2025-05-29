
import { useState, useRef, useCallback } from 'react';
import { FormData, ParsedReport, ReportGenerationResult } from '@/types/groq';
import { groqAPIService } from '@/services/groq-api.service';
import { parseGROQResult, validateFormData } from '@/utils/report-parser';

export function useReportGeneration() {
  const [resultado, setResultado] = useState<ParsedReport | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const isFetchingRef = useRef(false);

  const gerarRelatorio = useCallback(async (formData: FormData): Promise<void> => {
    // Prevenir múltiplas chamadas simultâneas
    if (isFetchingRef.current) {
      console.warn("⚠️ Geração já em andamento, ignorando nova solicitação");
      return;
    }

    // Validar dados de entrada
    if (!validateFormData(formData)) {
      setError("Dados do formulário incompletos ou inválidos");
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(undefined);

    try {
      console.log("🚀 Iniciando geração do relatório...");
      
      // Chamar o serviço GROQ
      const groqResponse = await groqAPIService.fetchGROQResponse(formData);
      
      // Fazer parsing da resposta
      const parsedReport = parseGROQResult(groqResponse);
      
      setResultado(parsedReport);
      
      console.log("✅ Relatório gerado com sucesso");
      
      // Placeholder para integração futura com Sentry
      // Sentry.addBreadcrumb({ message: "Report generated successfully", level: "info" });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      
      console.error("❌ Erro na geração do relatório:", err);
      setError(errorMessage);
      
      // Placeholder para log customizado/Sentry
      // Sentry.captureException(err, { tags: { component: "useReportGeneration" } });
      
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const resetar = useCallback(() => {
    setResultado(undefined);
    setError(undefined);
    setLoading(false);
    isFetchingRef.current = false;
  }, []);

  return {
    gerarRelatorio,
    resetar,
    resultado,
    loading,
    error
  };
}
