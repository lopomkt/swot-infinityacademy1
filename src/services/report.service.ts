
import { supabase } from '@/integrations/supabase/client';
import { ResultadoFinalData } from '@/types/formData';

/**
 * Dados de entrada para criação de relatório
 */
interface ReportData {
  id?: string;
  user_id: string;
  dados: any;
  resultado_final?: any;
  criado_em?: string;
}

/**
 * Item de lista de relatórios
 */
interface ReportListItem {
  id: string;
  criado_em: string;
  resultado_final: any;
  dados: {
    identificacao?: {
      nomeEmpresa?: string;
    };
  };
}

/**
 * Serviço para gestão de relatórios e histórico
 * Implementa CRUD completo com validação RLS para segurança
 */
class ReportService {
  /**
   * Cria um novo relatório no banco de dados
   * @param reportData Dados do relatório a ser criado
   * @returns ID do relatório criado ou null em caso de erro
   */
  async createReport(reportData: Omit<ReportData, 'id' | 'criado_em'>): Promise<string | null> {
    try {
      console.log("📄 Criando novo relatório...");

      // Validar dados obrigatórios
      if (!reportData.user_id || !reportData.dados) {
        console.error("❌ Dados obrigatórios ausentes");
        throw new Error("user_id e dados são obrigatórios");
      }

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
        console.error("❌ Erro ao criar relatório:", error);
        throw new Error(`Falha ao salvar relatório: ${error.message}`);
      }

      console.log("✅ Relatório criado com sucesso:", data.id);
      return data.id;
    } catch (error: any) {
      console.error("❌ Erro na criação do relatório:", error);
      return null;
    }
  }

  /**
   * Busca relatórios do usuário com paginação
   * @param userId ID do usuário (RLS garante acesso apenas aos próprios dados)
   * @param limit Limite de resultados por página
   * @returns Lista de relatórios do usuário
   */
  async getReportsByUser(userId: string, limit: number = 10): Promise<ReportListItem[]> {
    try {
      console.log(`📋 Buscando relatórios do usuário ${userId}...`);

      if (!userId) {
        console.error("❌ userId é obrigatório");
        return [];
      }

      const { data, error } = await supabase
        .from('relatorios')
        .select('id, criado_em, resultado_final, dados')
        .eq('user_id', userId)
        .order('criado_em', { ascending: false })
        .limit(limit);

      if (error) {
        console.error("❌ Erro ao buscar relatórios:", error);
        throw new Error(`Falha ao carregar relatórios: ${error.message}`);
      }

      console.log(`✅ ${data?.length || 0} relatórios encontrados`);
      return (data || []) as ReportListItem[];
    } catch (error: any) {
      console.error("❌ Erro na consulta de relatórios:", error);
      return [];
    }
  }

  /**
   * Busca um relatório específico por ID
   * @param reportId ID do relatório
   * @param userId ID do usuário (para validação RLS)
   * @returns Dados completos do relatório ou null
   */
  async getReportById(reportId: string, userId: string): Promise<ReportData | null> {
    try {
      console.log(`🔍 Buscando relatório ${reportId}...`);

      if (!reportId || !userId) {
        console.error("❌ reportId e userId são obrigatórios");
        return null;
      }

      const { data, error } = await supabase
        .from('relatorios')
        .select('*')
        .eq('id', reportId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error("❌ Erro ao buscar relatório:", error);
        throw new Error(`Falha ao carregar relatório: ${error.message}`);
      }

      if (!data) {
        console.warn("⚠️ Relatório não encontrado ou acesso negado");
        return null;
      }

      console.log("✅ Relatório encontrado");
      return data as ReportData;
    } catch (error: any) {
      console.error("❌ Erro na consulta do relatório:", error);
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
      console.log(`✏️ Atualizando relatório ${reportId}...`);

      if (!reportId) {
        console.error("❌ reportId é obrigatório");
        return false;
      }

      // Remover campos que não devem ser atualizados
      const { id, criado_em, ...safeUpdateData } = updateData;

      const { error } = await supabase
        .from('relatorios')
        .update(safeUpdateData)
        .eq('id', reportId);

      if (error) {
        console.error("❌ Erro ao atualizar relatório:", error);
        throw new Error(`Falha ao atualizar relatório: ${error.message}`);
      }

      console.log("✅ Relatório atualizado com sucesso");
      return true;
    } catch (error: any) {
      console.error("❌ Erro na atualização do relatório:", error);
      return false;
    }
  }

  /**
   * Remove um relatório permanentemente
   * @param reportId ID do relatório
   * @param userId ID do usuário (para validação RLS)
   * @returns Sucesso da operação
   */
  async deleteReport(reportId: string, userId: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deletando relatório ${reportId}...`);

      if (!reportId || !userId) {
        console.error("❌ reportId e userId são obrigatórios");
        return false;
      }

      const { error } = await supabase
        .from('relatorios')
        .delete()
        .eq('id', reportId)
        .eq('user_id', userId);

      if (error) {
        console.error("❌ Erro ao deletar relatório:", error);
        throw new Error(`Falha ao deletar relatório: ${error.message}`);
      }

      console.log("✅ Relatório deletado com sucesso");
      return true;
    } catch (error: any) {
      console.error("❌ Erro na deleção do relatório:", error);
      return false;
    }
  }

  /**
   * Conta o total de relatórios do usuário
   * @param userId ID do usuário
   * @returns Número total de relatórios
   */
  async getTotalReportsCount(userId: string): Promise<number> {
    try {
      console.log(`📊 Contando relatórios do usuário ${userId}...`);

      if (!userId) {
        console.error("❌ userId é obrigatório");
        return 0;
      }

      const { count, error } = await supabase
        .from('relatorios')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        console.error("❌ Erro ao contar relatórios:", error);
        return 0;
      }

      const totalCount = count || 0;
      console.log(`✅ Total de ${totalCount} relatórios encontrados`);
      return totalCount;
    } catch (error: any) {
      console.error("❌ Erro na contagem de relatórios:", error);
      return 0;
    }
  }

  /**
   * Valida se os dados do relatório estão estruturados corretamente
   * @param reportData Dados a serem validados
   * @returns true se válidos, false caso contrário
   */
  validateReportData(reportData: any): boolean {
    if (!reportData || typeof reportData !== 'object') {
      console.error("❌ Dados do relatório inválidos");
      return false;
    }

    // Verificações básicas de estrutura
    const hasIdentificacao = reportData.identificacao && 
      Object.keys(reportData.identificacao).length > 0;
    
    const hasForcas = reportData.forcas && 
      (reportData.forcas.respostas?.length > 0 || reportData.forcas.forca1);
    
    const hasFraquezas = reportData.fraquezas && 
      (reportData.fraquezas.pontos_inconsistentes?.length > 0 || reportData.fraquezas.fraqueza1);

    const isValid = hasIdentificacao && hasForcas && hasFraquezas;
    
    if (!isValid) {
      console.warn("⚠️ Dados do relatório incompletos");
    }

    return isValid;
  }
}

export const reportService = new ReportService();
