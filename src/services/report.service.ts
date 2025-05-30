
import { supabase } from '@/integrations/supabase/client';
import { ResultadoFinalData } from '@/types/formData';

interface ReportData {
  id?: string;
  user_id: string;
  dados: any;
  resultado_final?: ResultadoFinalData;
  criado_em?: string;
}

interface ReportListItem {
  id: string;
  criado_em: string;
  resultado_final: ResultadoFinalData;
  dados: {
    identificacao?: {
      nomeEmpresa?: string;
    };
  };
}

class ReportService {
  /**
   * Cria um novo relatório
   * @param reportData Dados do relatório
   * @returns ID do relatório criado ou null em caso de erro
   */
  async createReport(reportData: Omit<ReportData, 'id' | 'criado_em'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('relatorios')
        .insert({
          user_id: reportData.user_id,
          dados: reportData.dados,
          resultado_final: reportData.resultado_final,
        })
        .select('id')
        .single();

      if (error) {
        console.error("Erro ao criar relatório:", error);
        throw new Error(`Falha ao salvar relatório: ${error.message}`);
      }

      console.log("✅ Relatório salvo com sucesso:", data.id);
      return data.id;
    } catch (error) {
      console.error("Erro na criação do relatório:", error);
      return null;
    }
  }

  /**
   * Atualiza um relatório existente
   * @param reportId ID do relatório
   * @param updateData Dados para atualização
   * @returns Sucesso da operação
   */
  async updateReport(reportId: string, updateData: Partial<ReportData>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('relatorios')
        .update(updateData)
        .eq('id', reportId);

      if (error) {
        console.error("Erro ao atualizar relatório:", error);
        throw new Error(`Falha ao atualizar relatório: ${error.message}`);
      }

      console.log("✅ Relatório atualizado com sucesso");
      return true;
    } catch (error) {
      console.error("Erro na atualização do relatório:", error);
      return false;
    }
  }

  /**
   * Busca relatórios do usuário
   * @param userId ID do usuário
   * @param limit Limite de resultados
   * @returns Lista de relatórios
   */
  async getUserReports(userId: string, limit: number = 10): Promise<ReportListItem[]> {
    try {
      const { data, error } = await supabase
        .from('relatorios')
        .select('id, criado_em, resultado_final, dados')
        .eq('user_id', userId)
        .order('criado_em', { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Erro ao buscar relatórios:", error);
        throw new Error(`Falha ao carregar relatórios: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Erro na consulta de relatórios:", error);
      return [];
    }
  }

  /**
   * Busca um relatório específico
   * @param reportId ID do relatório
   * @param userId ID do usuário (para validação RLS)
   * @returns Dados do relatório ou null
   */
  async getReportById(reportId: string, userId: string): Promise<ReportData | null> {
    try {
      const { data, error } = await supabase
        .from('relatorios')
        .select('*')
        .eq('id', reportId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar relatório:", error);
        throw new Error(`Falha ao carregar relatório: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Erro na consulta do relatório:", error);
      return null;
    }
  }

  /**
   * Deleta um relatório
   * @param reportId ID do relatório
   * @param userId ID do usuário (para validação RLS)
   * @returns Sucesso da operação
   */
  async deleteReport(reportId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('relatorios')
        .delete()
        .eq('id', reportId)
        .eq('user_id', userId);

      if (error) {
        console.error("Erro ao deletar relatório:", error);
        throw new Error(`Falha ao deletar relatório: ${error.message}`);
      }

      console.log("✅ Relatório deletado com sucesso");
      return true;
    } catch (error) {
      console.error("Erro na deleção do relatório:", error);
      return false;
    }
  }

  /**
   * Conta total de relatórios do usuário
   * @param userId ID do usuário
   * @returns Número total de relatórios
   */
  async getTotalReportsCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('relatorios')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        console.error("Erro ao contar relatórios:", error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error("Erro na contagem de relatórios:", error);
      return 0;
    }
  }
}

export const reportService = new ReportService();
