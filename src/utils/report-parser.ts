
import { GROQResponse, ParsedReport } from '@/types/groq';

export function parseGROQResult(response: GROQResponse): ParsedReport {
  try {
    const content = response?.choices?.[0]?.message?.content;
    
    if (!content || typeof content !== 'string') {
      throw new Error("Conteúdo da resposta inválido ou vazio");
    }

    // Verificação obrigatória dos delimitadores
    const requiredDelimiters = [
      "### MATRIZ SWOT",
      "### DIAGNÓSTICO CONSULTIVO", 
      "### PLANO DE AÇÃO A/B/C"
    ];

    const missingDelimiters = requiredDelimiters.filter(delimiter => 
      !content.includes(delimiter)
    );

    if (missingDelimiters.length > 0) {
      throw new Error(`Delimitadores obrigatórios ausentes: ${missingDelimiters.join(', ')}`);
    }

    // Split da resposta pelos delimitadores
    const sections = content.split(/### [A-ZÃÇÕÁÉÍÓÚÂÊÔÀÈÌÒÙ /]+/g);
    
    if (sections.length < 4) {
      throw new Error("Número insuficiente de seções na resposta da IA");
    }

    // Extrair e validar cada seção
    const matrizSwot = sections[1]?.trim() || "Dados insuficientes para matriz SWOT";
    const diagnosticoTextual = sections[2]?.trim() || "Dados insuficientes para diagnóstico";
    const planosAcao = sections[3]?.trim() || "Dados insuficientes para planos de ação";

    // Validar se as seções não estão vazias ou muito curtas
    if (matrizSwot.length < 50) {
      console.warn("⚠️ Matriz SWOT muito curta, usando fallback");
    }

    if (diagnosticoTextual.length < 100) {
      console.warn("⚠️ Diagnóstico muito curto, usando fallback");
    }

    if (planosAcao.length < 100) {
      console.warn("⚠️ Planos de ação muito curtos, usando fallback");
    }

    const parsedReport: ParsedReport = {
      matriz_swot: matrizSwot,
      diagnostico_textual: diagnosticoTextual,
      planos_acao: planosAcao,
      acoes_priorizadas: [],
      gpt_prompt_ok: true,
      ai_block_pronto: true,
      tipo: "GROQ_PRODUCAO",
      created_at: new Date().toISOString()
    };

    console.log("✅ Parsing concluído com sucesso");
    return parsedReport;

  } catch (error) {
    console.error("❌ Erro no parsing da resposta:", error);
    
    // Retornar estrutura padrão em caso de erro
    return {
      matriz_swot: "Erro no processamento da matriz SWOT. Dados insuficientes.",
      diagnostico_textual: "Erro no processamento do diagnóstico. Tente novamente.",
      planos_acao: "Erro no processamento dos planos de ação. Dados insuficientes.",
      acoes_priorizadas: [],
      gpt_prompt_ok: false,
      ai_block_pronto: false,
      tipo: "ERROR_FALLBACK",
      created_at: new Date().toISOString()
    };
  }
}

export function validateFormData(formData: any): boolean {
  if (!formData || typeof formData !== 'object') {
    return false;
  }

  // Verificações básicas de integridade
  const hasIdentificacao = formData.identificacao && 
    Object.keys(formData.identificacao).length > 0;
  
  const hasForcas = formData.forcas && 
    (formData.forcas.respostas?.length > 0 || formData.forcas.forca1);
  
  const hasFraquezas = formData.fraquezas && 
    (formData.fraquezas.pontos_inconsistentes?.length > 0 || formData.fraquezas.fraqueza1);

  return hasIdentificacao && hasForcas && hasFraquezas;
}
