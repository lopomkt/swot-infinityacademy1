
import { ResultadoFinalData } from "@/types/formData";

export const parseGROQOutput = (response: string): ResultadoFinalData => {
  try {
    // Verificar se contém todos os delimitadores obrigatórios
    const requiredDelimiters = [
      "### MATRIZ SWOT",
      "### DIAGNÓSTICO CONSULTIVO", 
      "### PLANO DE AÇÃO A/B/C"
    ];
    
    const missingDelimiters = requiredDelimiters.filter(delimiter => 
      !response.includes(delimiter)
    );
    
    if (missingDelimiters.length > 0) {
      console.error("❌ Parsing inválido - Delimitadores ausentes:", missingDelimiters);
      throw new Error("Erro na análise: resposta da IA incompleta. Tente novamente ou revise os dados.");
    }
    
    // Split the response based on the delimiters (case-sensitive)
    const sections = response.split(/### (MATRIZ SWOT|DIAGNÓSTICO CONSULTIVO|PLANO DE AÇÃO A\/B\/C)/g);
    
    let matriz_swot = "";
    let diagnostico_textual = "";
    let planos_acao = "";
    
    // Process sections in pairs (delimiter, content)
    for (let i = 1; i < sections.length; i += 2) {
      const delimiter = sections[i];
      const content = sections[i + 1]?.trim() || "";
      
      switch (delimiter) {
        case "MATRIZ SWOT":
          matriz_swot = content;
          break;
        case "DIAGNÓSTICO CONSULTIVO":
          diagnostico_textual = content;
          break;
        case "PLANO DE AÇÃO A/B/C":
          planos_acao = content;
          break;
      }
    }
    
    // Validar se todas as seções foram preenchidas
    if (!matriz_swot || !diagnostico_textual || !planos_acao) {
      console.error("❌ Parsing inválido - Seções vazias");
      throw new Error("Erro na análise: resposta da IA incompleta. Tente novamente ou revise os dados.");
    }
    
    console.log("✅ Parsing OK - Todas as seções extraídas com sucesso");
    
    return {
      matriz_swot,
      diagnostico_textual,
      planos_acao,
      acoes_priorizadas: [],
      gpt_prompt_ok: true,
      ai_block_pronto: true,
      tipo: "GROQ_PRODUCAO"
    };
    
  } catch (error) {
    console.error("❌ Parsing inválido - Erro ao processar resposta da IA:", error);
    throw new Error("Erro na análise: resposta da IA incompleta. Tente novamente ou revise os dados.");
  }
};

// Fallback function for development mode
export const generateMockResponse = (formData: any): ResultadoFinalData => {
  console.warn("⚠️ IA em modo simulação. Resultados não são reais.");
  
  const mockResponse = `### MATRIZ SWOT
## Forças
- ${formData.forcas?.forca1 || "Equipe competente e dedicada"}: Este ponto forte proporciona uma vantagem competitiva significativa ao garantir execução de qualidade e compromisso com os resultados.
- ${formData.forcas?.forca2 || "Produto/serviço de alta qualidade"}: Diferencial que fortalece sua posição no mercado e justifica um posicionamento premium.

## Fraquezas
- ${formData.fraquezas?.fraqueza1 || "Processos internos não otimizados"}: Impacta diretamente a escalabilidade e gera ineficiências operacionais que limitam o crescimento.
- ${formData.fraquezas?.fraqueza2 || "Limitações de orçamento para marketing"}: Restringe a capacidade de ampliar o alcance da marca e conquistar novos mercados.

## Oportunidades
- ${formData.oportunidades?.oportunidade1 || "Expansão para novos mercados"}: Potencial de crescimento substancial através da diversificação geográfica ou de segmentos.
- ${formData.oportunidades?.oportunidade2 || "Parcerias estratégicas potenciais"}: Possibilidade de ampliar capacidades e oferta através de colaborações complementares.

## Ameaças
- ${formData.ameacas?.ameaca1 || "Concorrência crescente"}: Pressiona margens e exige constante diferenciação estratégica.
- ${formData.ameacas?.ameaca2 || "Mudanças regulatórias"}: Podem impor custos adicionais de compliance ou alterações no modelo de negócio.

### DIAGNÓSTICO CONSULTIVO
Com base na análise SWOT realizada, identificamos que sua empresa está em um momento crucial de tomada de decisões estratégicas que determinarão sua trajetória de crescimento nos próximos anos.

As forças atuais evidenciam uma base sólida, especialmente em termos de qualidade de equipe e produto/serviço. No entanto, as fraquezas identificadas, particularmente processos não otimizados, estão limitando seu potencial de expansão e eficiência operacional.

### PLANO DE AÇÃO A/B/C
# 🎯 Rota A – Estratégia ideal com investimento pleno
1. Implementar sistema completo de gestão para otimização de processos internos
2. Aumentar investimento em marketing digital com foco em aquisição qualificada
3. Desenvolver programa estruturado de desenvolvimento da equipe

# ⚙️ Rota B – Estratégia viável com recursos limitados
1. Priorizar otimização dos processos mais críticos para eficiência operacional
2. Focar investimentos de marketing em canais de maior ROI comprovado
3. Implementar melhorias incrementais nos produtos/serviços existentes

# 💡 Rota C – Estratégia criativa com orçamento mínimo
1. Adotar metodologias ágeis para melhorias de processo sem investimento
2. Implementar estratégia de marketing de conteúdo e marketing orgânico
3. Focar em fidelização e aumento de ticket médio da base atual de clientes`;

  return parseGROQOutput(mockResponse);
};
