
import { useState, useCallback } from 'react';
import { groqAPIService } from '@/services/groq-api.service';
import { reportService } from '@/services/report.service';
import { parseGROQResult, validateFormData } from '@/utils/report-parser';
import { FormData, ParsedReport, ReportGenerationResult } from '@/types/groq';

/**
 * Hook especializado para gerenciamento do estado de geração de relatórios
 * Integra com groq-api.service e report.service para fluxo completo
 * @returns Estado e funções para geração de relatórios
 */
export function useReportGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [resultado, setResultado] = useState<ParsedReport | undefined>(undefined);

  /**
   * Gera relatório usando IA e salva no banco de dados
   * @param formData Dados completos do formulário
   * @param userId ID do usuário para salvar o relatório
   * @returns Resultado da geração
   */
  const generateReport = useCallback(async (
    formData: FormData, 
    userId: string
  ): Promise<ReportGenerationResult> => {
    setLoading(true);
    setError(undefined);
    setResultado(undefined);

    try {
      console.log("🚀 Iniciando geração de relatório...");

      // Validar dados do formulário
      if (!validateFormData(formData)) {
        throw new Error("Dados do formulário incompletos ou inválidos");
      }

      if (!userId) {
        throw new Error("ID do usuário é obrigatório");
      }

      // Chamar API GROQ para gerar relatório
      console.log("🤖 Chamando API GROQ...");
      const groqResponse = await groqAPIService.fetchGROQResult(formData);

      // Fazer parsing da resposta
      console.log("📝 Fazendo parsing da resposta...");
      const parsedReport = parseGROQResult(groqResponse);

      // Preparar dados para salvar no banco
      const reportData = {
        user_id: userId,
        dados: formData,
        resultado_final: parsedReport,
      };

      // Salvar relatório no banco de dados
      console.log("💾 Salvando relatório no banco...");
      const reportId = await reportService.createReport(reportData);

      if (!reportId) {
        console.warn("⚠️ Relatório gerado mas não foi salvo no banco");
      } else {
        console.log("✅ Relatório salvo com ID:", reportId);
      }

      setResultado(parsedReport);
      setLoading(false);

      return {
        resultado: parsedReport,
        loading: false,
        error: undefined,
      };

    } catch (error: any) {
      console.error("❌ Erro na geração do relatório:", error);
      
      const errorMessage = error.message || "Erro inesperado na geração do relatório";
      setError(errorMessage);
      setLoading(false);

      return {
        resultado: undefined,
        loading: false,
        error: errorMessage,
      };
    }
  }, []);

  /**
   * Regenera um relatório existente
   * @param formData Dados atualizados do formulário
   * @param userId ID do usuário
   * @param reportId ID do relatório existente para atualizar
   * @returns Resultado da regeneração
   */
  const regenerateReport = useCallback(async (
    formData: FormData,
    userId: string,
    reportId: string
  ): Promise<ReportGenerationResult> => {
    setLoading(true);
    setError(undefined);

    try {
      console.log("🔄 Regenerando relatório...");

      // Gerar novo conteúdo
      const groqResponse = await groqAPIService.fetchGROQResult(formData);
      const parsedReport = parseGROQResult(groqResponse);

      // Atualizar relatório existente
      const updateData = {
        dados: formData,
        resultado_final: parsedReport,
      };

      const updateSuccess = await reportService.updateReport(reportId, updateData);

      if (!updateSuccess) {
        console.warn("⚠️ Relatório regenerado mas não foi atualizado no banco");
      }

      setResultado(parsedReport);
      setLoading(false);

      return {
        resultado: parsedReport,
        loading: false,
        error: undefined,
      };

    } catch (error: any) {
      console.error("❌ Erro na regeneração do relatório:", error);
      
      const errorMessage = error.message || "Erro inesperado na regeneração";
      setError(errorMessage);
      setLoading(false);

      return {
        resultado: undefined,
        loading: false,
        error: errorMessage,
      };
    }
  }, []);

  /**
   * Limpa o estado atual do hook
   */
  const clearReport = useCallback(() => {
    setLoading(false);
    setError(undefined);
    setResultado(undefined);
  }, []);

  /**
   * Verifica se há um relatório carregado
   */
  const hasReport = !!resultado;

  /**
   * Verifica se o último relatório foi gerado com sucesso
   */
  const isSuccess = !!resultado && !error && !loading;

  return {
    // Estado
    loading,
    error,
    resultado,
    hasReport,
    isSuccess,

    // Ações
    generateReport,
    regenerateReport,
    clearReport,
  };
}
