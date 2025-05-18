
import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ResultadoFinalData } from "@/types/formData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface AIBlockProps {
  formData: any;
  onRestart: () => void;
  onAIComplete?: (resultadoFinal: ResultadoFinalData) => void;
}

const AIBlock: React.FC<AIBlockProps> = ({ formData, onRestart, onAIComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [resultadoFinal, setResultadoFinal] = useState<ResultadoFinalData>({
    matriz_swot: "",
    diagnostico_textual: "",
    planos_acao: "",
    acoes_priorizadas: []
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const [timeoutWarning, setTimeoutWarning] = useState(false);

  // GPT-4o prompt that will be used when API is connected
  const generateAIPrompt = (formData) => {
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
  };

  // Function to process the AI response
  const parseGPTOutput = (response: string) => {
    // Split the response based on the delimiters
    const sections = response.split(/### [A-ZÃÇÕÁÉÍÓÚÂÊÔÀÈÌÒÙ /]+/g);
    
    // If we have valid sections (there should be 4 - the first one is empty)
    if (sections.length >= 4) {
      return {
        matriz_swot: sections[1].trim(),
        diagnostico_textual: sections[2].trim(),
        planos_acao: sections[3].trim(),
        acoes_priorizadas: [],
        gpt_prompt_ok: true,
        ai_block_pronto: true
      };
    }
    
    // Fallback if parsing fails
    throw new Error("Não foi possível processar a resposta da IA corretamente.");
  };

  // Function to fetch results from OpenAI GPT-4o
  const fetchGPTResult = async (formData) => {
    const prompt = generateAIPrompt(formData);
    
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { 
              role: "system", 
              content: "Você é um consultor empresarial sênior especializado em análise SWOT e planejamento estratégico para pequenas e médias empresas." 
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1800,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Erro ao conectar com a API da OpenAI");
      }
      
      const data = await response.json();
      const resultText = data.choices[0].message.content;
      
      return parseGPTOutput(resultText);
    } catch (error) {
      console.error("Erro ao processar resposta da OpenAI:", error);
      throw error;
    }
  };

  // For development/testing purposes
  const gerarRelatorioMock = () => {
    console.log("Usando modo mock para desenvolvimento");
    
    // This is where we'd normally make the API call to GPT-4o
    // For now, we'll use mock data
    const mockResponse = `### MATRIZ SWOT
## Forças
- ${formData.forcas?.forca1 || "Equipe competente e dedicada"}: Este ponto forte proporciona uma vantagem competitiva significativa ao garantir execução de qualidade e compromisso com os resultados.
- ${formData.forcas?.forca2 || "Produto/serviço de alta qualidade"}: Diferencial que fortalece sua posição no mercado e justifica um posicionamento premium.
- ${formData.forcas?.forca3 || "Boa reputação no mercado"}: Ativo intangível valioso que reduz custos de aquisição de clientes e aumenta a credibilidade.

## Fraquezas
- ${formData.fraquezas?.fraqueza1 || "Processos internos não otimizados"}: Impacta diretamente a escalabilidade e gera ineficiências operacionais que limitam o crescimento.
- ${formData.fraquezas?.fraqueza2 || "Limitações de orçamento para marketing"}: Restringe a capacidade de ampliar o alcance da marca e conquistar novos mercados.
- ${formData.fraquezas?.fraqueza3 || "Dependência de poucos clientes principais"}: Vulnerabilidade estratégica que expõe a empresa a riscos financeiros significativos.

## Oportunidades
- ${formData.oportunidades?.oportunidade1 || "Expansão para novos mercados"}: Potencial de crescimento substancial através da diversificação geográfica ou de segmentos.
- ${formData.oportunidades?.oportunidade2 || "Parcerias estratégicas potenciais"}: Possibilidade de ampliar capacidades e oferta através de colaborações complementares.
- ${formData.oportunidades?.oportunidade3 || "Tendências favoráveis no setor"}: Mudanças no mercado que podem ser capitalizadas para impulsionar o crescimento.

## Ameaças
- ${formData.ameacas?.ameaca1 || "Concorrência crescente"}: Pressiona margens e exige constante diferenciação estratégica.
- ${formData.ameacas?.ameaca2 || "Mudanças regulatórias"}: Podem impor custos adicionais de compliance ou alterações no modelo de negócio.
- ${formData.ameacas?.ameaca3 || "Instabilidade econômica"}: Afeta decisões de compra dos clientes e pode impactar a liquidez financeira.

### DIAGNÓSTICO CONSULTIVO
Com base na análise SWOT realizada, identificamos que sua empresa está em um momento crucial de tomada de decisões estratégicas que determinarão sua trajetória de crescimento nos próximos anos.

As forças atuais evidenciam uma base sólida, especialmente em termos de ${formData.forcas?.forca1 || "qualidade de equipe"} e ${formData.forcas?.forca2 || "produto/serviço"}. No entanto, as fraquezas identificadas, particularmente ${formData.fraquezas?.fraqueza1 || "processos não otimizados"}, estão limitando seu potencial de expansão e eficiência operacional.

O cenário externo apresenta oportunidades significativas, como ${formData.oportunidades?.oportunidade1 || "expansão de mercado"}, que se alinham bem com suas capacidades internas. Contudo, ameaças como ${formData.ameacas?.ameaca1 || "concorrência crescente"} exigem atenção imediata e planejamento estratégico.

Considerando sua situação financeira ${formData.saudeFinanceira?.maturidade_financeira || "atual"} e a meta de ${formData.prioridades?.meta_90_dias || "crescimento nos próximos 90 dias"}, é evidente que a empresa precisa equilibrar iniciativas de curto prazo para resultados imediatos com investimentos estruturantes para sustentabilidade.

Seu estilo de decisão ${formData.prioridades?.estilo_decisao || "atual"} combinado com o nível de engajamento da equipe (${formData.prioridades?.engajamento_equipe || "5"}/10) sugere a necessidade de melhorar a comunicação interna e alinhar incentivos para mobilizar recursos humanos em direção às metas estratégicas.

As áreas mais frágeis (${formData.prioridades?.areas_fraqueza?.join(", ") || "identificadas"}) requerem atenção prioritária, enquanto as áreas promissoras (${formData.prioridades?.areas_potenciais?.join(", ") || "potenciais"}) devem ser exploradas para maximizar retornos no curto prazo.

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
5. Explorar modelos alternativos de remuneração baseados em performance`;

    return parseGPTOutput(mockResponse);
  };

  const generateReport = async () => {
    setIsLoading(true);
    setProcessingError(null);
    
    // Set a timeout warning if processing takes too long
    const timeoutId = setTimeout(() => {
      setTimeoutWarning(true);
    }, 15000);
    
    try {
      // In production, use fetchGPTResult, but for development you can use gerarRelatorioMock
      // Toggle between these two based on environment or configuration
      const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.OPENAI_API_KEY;
      
      // Use mock if in development or if OpenAI key is not available
      const updatedResultados = isDevelopment 
        ? gerarRelatorioMock() 
        : await fetchGPTResult(formData);
      
      setResultadoFinal(updatedResultados);
      
      // Save the report to Supabase if user is authenticated
      if (user) {
        try {
          const { error } = await supabase.from('relatorios').insert({
            user_id: user.id,
            dados: formData,
            resultado_final: updatedResultados
          });
          
          if (error) {
            console.error("Erro ao salvar relatório no Supabase:", error);
            toast({
              title: "Relatório gerado com sucesso!",
              description: "Mas houve um erro ao salvar. Você pode tentar salvar manualmente.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Relatório gerado e salvo com sucesso!",
              description: "Seu relatório estratégico está pronto para análise.",
            });
          }
        } catch (dbError) {
          console.error("Erro ao salvar no banco de dados:", dbError);
        }
      } else {
        toast({
          title: "Relatório gerado com sucesso!",
          description: "Seu relatório estratégico está pronto para análise.",
        });
      }
      
      // Send results back to parent component if callback exists
      if (onAIComplete) {
        onAIComplete(updatedResultados);
      }
      
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      setProcessingError(error.message || "Ocorreu um erro ao processar os dados.");
      toast({
        title: "Erro ao gerar relatório",
        description: error.message || "Ocorreu um erro ao processar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
      setTimeoutWarning(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, [formData]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="mb-6">
            <Loader className="h-12 w-12 animate-spin text-[#ef0002]" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Estamos gerando seu relatório estratégico...
          </h3>
          <p className="text-gray-600">{timeoutWarning ? "Isso está demorando mais do que o esperado. Por favor, aguarde..." : "Isso pode levar alguns segundos."}</p>
          <div className="w-full max-w-md mt-8">
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-1 bg-[#ef0002] animate-pulse w-full"></div>
            </div>
          </div>
          
          {/* Emergency button to force reset */}
          <button
            onClick={() => window.location.reload()}
            className="text-xs mt-8 underline text-gray-500 hover:text-gray-700"
          >
            Forçar retorno ao início
          </button>
        </div>
      ) : processingError ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center mb-8">
            <h3 className="text-xl font-medium text-red-600 mb-4">
              Erro ao gerar relatório
            </h3>
            <p className="text-gray-600 mb-6">{processingError}</p>
            <Button 
              onClick={generateReport} 
              className="bg-[#ef0002] hover:bg-[#c50000] text-white mr-2"
            >
              Tentar novamente
            </Button>
            <Button 
              variant="outline" 
              onClick={onRestart}
            >
              Voltar ao início
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#560005] mb-4">
              Relatório Estratégico SWOT Insights
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Análise personalizada com base nos dados fornecidos sobre seu negócio. 
              Use este relatório como guia para suas decisões estratégicas.
            </p>
          </div>

          {/* Matriz SWOT */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-2xl font-bold text-[#ef0002] mb-4">
              Matriz SWOT detalhada da sua empresa
            </h3>
            <div className="prose max-w-none">
              {resultadoFinal.matriz_swot.split('\n\n').map((section, index) => {
                const lines = section.split('\n');
                const title = lines[0];
                const items = lines.slice(1);
                
                return (
                  <div key={index} className="mb-6">
                    {title.startsWith('##') && (
                      <h4 className="text-xl font-semibold mb-3">
                        {title.replace('##', '').trim()}
                      </h4>
                    )}
                    <ul className="list-disc pl-6 space-y-2">
                      {items.map((item, i) => (
                        <li key={i}>{item.replace('-', '').trim()}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagnóstico Textual */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-2xl font-bold text-[#ef0002] mb-4">
              Análise estratégica gerada por inteligência artificial
            </h3>
            <div className="prose max-w-none text-gray-700">
              {resultadoFinal.diagnostico_textual.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Planos de Ação */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-2xl font-bold text-[#ef0002] mb-4">
              Plano de ação com rotas estratégicas sugeridas
            </h3>
            <div className="prose max-w-none">
              {resultadoFinal.planos_acao.split('\n\n').map((section, index) => {
                const lines = section.split('\n');
                const title = lines[0];
                const items = lines.slice(1);
                
                return (
                  <div key={index} className="mb-8">
                    {title.startsWith('#') && (
                      <h4 className="text-xl font-semibold mb-3">
                        {title.replace('#', '').trim()}
                      </h4>
                    )}
                    <ol className="list-decimal pl-6 space-y-2">
                      {items.map((item, i) => {
                        const parts = item.trim().split('.');
                        if (parts.length > 1) {
                          return <li key={i}>{parts.slice(1).join('.').trim()}</li>;
                        }
                        return <li key={i}>{item}</li>;
                      })}
                    </ol>
                  </div>
                );
              })}
            </div>
          </div>

          {resultadoFinal.ai_block_pronto === true && resultadoFinal.gpt_prompt_ok === true && (
            <div className="flex justify-center space-x-4 pt-8">
              <Button 
                className="bg-[#ef0002] hover:bg-[#c50000] text-white px-8 py-2"
                onClick={() => {
                  if (user) {
                    console.log("Relatório já salvo automaticamente");
                    toast({
                      title: "Relatório já salvo",
                      description: "Seu relatório estratégico já foi salvo automaticamente.",
                    });
                  } else {
                    console.log("Usuário não autenticado, não é possível salvar");
                    toast({
                      title: "Login necessário para salvar",
                      description: "Faça login para salvar seus relatórios.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                {user ? "Relatório Salvo" : "Salvar Relatório (Login Necessário)"}
              </Button>
              <Button 
                variant="outline"
                className="border-[#ef0002] text-[#ef0002] hover:bg-[#ffeeee] px-8 py-2"
                onClick={onRestart}
              >
                Iniciar Novo Diagnóstico
              </Button>
            </div>
          )}
          
          {/* Tag técnica de encerramento */}
          <div className="hidden">
            fase5_openai_gpt4o_ok = true
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBlock;
