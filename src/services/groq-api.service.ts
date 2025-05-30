
import { FormData, GROQResponse, ParsedReport } from '@/types/groq';

const GROQ_API_KEY = process.env.GROQ_API_KEY || "gsk_Gh2hKfW07TK1bjkKOHxRWGdyb3FYFZEYQss9Tp";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MAX_TIMEOUT = 25000; // 25 segundos
const MAX_RETRIES = 5;

class GROQAPIService {
  private generateAIPrompt(formData: FormData): string {
    return `Você é um analista empresarial sênior, especialista em diagnóstico consultivo com foco em micro, pequenas e médias empresas. Com base nas informações coletadas no formulário abaixo, sua tarefa é gerar um relatório estratégico dividido em 3 partes:

1. **Matriz SWOT Completa**  
Apresente os itens de Forças, Fraquezas, Oportunidades e Ameaças com clareza, separando-os por seções com subtítulos. Para cada item, adicione uma breve explicação do impacto estratégico.

2. **Diagnóstico Textual Consultivo**  
Crie um texto de análise com linguagem acessível, tom direto, claro e profissional, explicando o cenário geral da empresa com base nos dados. Faça conexões estratégicas entre os pontos de destaque (positivos e negativos), nível de maturidade, prioridades e estilo de gestão. Essa análise deve soar como algo que um consultor de alto nível diria em uma reunião.

3. **Plano de Ação com Rotas A/B/C**  
Com base nos dados financeiros, prioridades e perfil de comprometimento, proponha 3 rotas estratégicas:
- 🎯 Rota A: Estratégia ideal com investimento robusto
- ⚙️ Rota B: Estratégia viável com recursos limitados
- 💡 Rota C: Estratégia criativa com orçamento mínimo

Cada rota deve conter de 3 a 5 ações divididas por área (Marketing, Vendas, Operações, Gestão etc.), com justificativas claras, e adaptadas à realidade da empresa. Sempre use uma linguagem de incentivo e objetividade.

IMPORTANTE: Não repita os dados brutos. Use-os para interpretar, gerar estratégia e traduzir o que precisa ser feito.

Abaixo estão os dados da empresa:
---

Identificação: ${JSON.stringify(formData.identificacao)}

Forças: ${JSON.stringify(formData.forcas)}

Fraquezas: ${JSON.stringify(formData.fraquezas)}

Oportunidades: ${JSON.stringify(formData.oportunidades)}

Ameaças: ${JSON.stringify(formData.ameacas)}

Saúde Financeira: ${JSON.stringify(formData.saudeFinanceira)}

Prioridades e Maturidade: ${JSON.stringify(formData.prioridades)}

---

Gere as três seções na ordem, bem formatadas. Responda com inteligência máxima e profissionalismo absoluto.

Use os seguintes delimitadores para separar cada seção da sua resposta:
### MATRIZ SWOT
### DIAGNÓSTICO CONSULTIVO
### PLANO DE AÇÃO A/B/C`;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeGROQRequest(formData: FormData, attempt: number = 1): Promise<GROQResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), MAX_TIMEOUT);

    try {
      const prompt = this.generateAIPrompt(formData);
      const intervalMs = Math.pow(2, attempt - 1) * 500; // Exponential backoff: 500ms, 1s, 2s, 4s, 8s

      console.log(`🚀 Tentativa ${attempt}/${MAX_RETRIES} - Iniciando chamada GROQ API...`);

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "llama-3.1-70b-versatile",
          messages: [
            { 
              role: "system", 
              content: "Você é um consultor empresarial sênior especializado em análise SWOT e planejamento estratégico para pequenas e médias empresas." 
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          stream: false,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}: Erro na API GROQ`);
      }

      const data: GROQResponse = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error("Resposta inválida da IA - estrutura de dados malformada");
      }

      console.log("✅ Resposta OK - GROQ API respondeu com sucesso");
      return data;

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error("Timeout: A IA demorou para responder");
      }

      // Se não é a última tentativa, fazer retry com exponential backoff
      if (attempt < MAX_RETRIES) {
        const backoffTime = Math.pow(2, attempt) * 500;
        console.warn(`❌ Tentativa ${attempt} falhou. Retry em ${backoffTime}ms...`);
        await this.sleep(backoffTime);
        return this.makeGROQRequest(formData, attempt + 1);
      }

      console.error("❌ Todas as tentativas falharam:", error);
      throw new Error(`Falha na geração do relatório: ${error.message}`);
    }
  }

  /**
   * Executa chamada para API GROQ com retry automático e tratamento de erro
   * @param formData Dados completos do formulário SWOT
   * @returns Promise com resposta estruturada da IA
   */
  public async fetchGROQResult(formData: FormData): Promise<GROQResponse> {
    // Verificar se a API key está presente
    if (!GROQ_API_KEY) {
      throw new Error("GROQ API Key não configurada");
    }

    // Em desenvolvimento, usar mock
    if (process.env.NODE_ENV === 'development') {
      console.warn("⚠️ Modo desenvolvimento - usando mock data");
      return this.mockReport();
    }

    return this.makeGROQRequest(formData);
  }

  private mockReport(): Promise<GROQResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          choices: [{
            message: {
              content: `### MATRIZ SWOT
## Forças
- Equipe competente e dedicada: Este ponto forte proporciona uma vantagem competitiva significativa ao garantir execução de qualidade e compromisso com os resultados.
- Produto/serviço de alta qualidade: Diferencial que fortalece sua posição no mercado e justifica um posicionamento premium.
- Boa reputação no mercado: Ativo intangível valioso que reduz custos de aquisição de clientes e aumenta a credibilidade.

## Fraquezas
- Processos internos não otimizados: Impacta diretamente a escalabilidade e gera ineficiências operacionais que limitam o crescimento.
- Limitações de orçamento para marketing: Restringe a capacidade de ampliar o alcance da marca e conquistar novos mercados.
- Dependência de poucos clientes principais: Vulnerabilidade estratégica que expõe a empresa a riscos financeiros significativos.

## Oportunidades
- Expansão para novos mercados: Potencial de crescimento substancial através da diversificação geográfica ou de segmentos.
- Parcerias estratégicas potenciais: Possibilidade de ampliar capacidades e oferta através de colaborações complementares.
- Tendências favoráveis no setor: Mudanças no mercado que podem ser capitalizadas para impulsionar o crescimento.

## Ameaças
- Concorrência crescente: Pressiona margens e exige constante diferenciação estratégica.
- Mudanças regulatórias: Podem impor custos adicionais de compliance ou alterações no modelo de negócio.
- Instabilidade econômica: Afeta decisões de compra dos clientes e pode impactar a liquidez financeira.

### DIAGNÓSTICO CONSULTIVO
Com base na análise SWOT realizada, identificamos que sua empresa está em um momento crucial de tomada de decisões estratégicas que determinarão sua trajetória de crescimento nos próximos anos.

As forças atuais evidenciam uma base sólida, especialmente em termos de qualidade de equipe e produto/serviço. No entanto, as fraquezas identificadas, particularmente processos não otimizados, estão limitando seu potencial de expansão e eficiência operacional.

### PLANO DE AÇÃO A/B/C
# 🎯 Rota A – Estratégia ideal com investimento pleno

1. Implementar sistema completo de gestão para otimização de processos internos
2. Aumentar investimento em marketing digital com foco em aquisição qualificada
3. Desenvolver programa estruturado de desenvolvimento da equipe
4. Expandir portfólio de produtos/serviços para mercados adjacentes
5. Estabelecer parcerias estratégicas com players complementares

# ⚙️ Rota B – Estratégia viável com recursos limitados

1. Priorizar otimização dos processos mais críticos para eficiência operacional
2. Focar investimentos de marketing em canais de maior ROI comprovado
3. Implementar melhorias incrementais nos produtos/serviços existentes
4. Desenvolver programa básico de capacitação interna nas áreas prioritárias
5. Explorar modelo de parceria com compartilhamento de custos/riscos

# 💡 Rota C – Estratégia criativa com orçamento mínimo

1. Adotar metodologias ágeis para melhorias de processo sem investimento
2. Implementar estratégia de marketing de conteúdo e marketing orgânico
3. Focar em fidelização e aumento de ticket médio da base atual de clientes
4. Utilizar ferramentas gratuitas para automação de processos básicos
5. Explorar modelos alternativos de remuneração baseados em performance`
            }
          }]
        });
      }, 2000); // Simular delay de 2 segundos
    });
  }
}

export const groqAPIService = new GROQAPIService();
