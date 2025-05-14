
import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIBlockProps {
  formData: any;
  onRestart: () => void;
}

const AIBlock: React.FC<AIBlockProps> = ({ formData, onRestart }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [resultadoFinal, setResultadoFinal] = useState<{
    matriz_swot: string;
    diagnostico_textual: string;
    planos_acao: string;
  }>({
    matriz_swot: "",
    diagnostico_textual: "",
    planos_acao: "",
  });

  // Mock function to simulate AI processing
  const gerarRelatorioMock = () => {
    // Mock data for demonstration purposes
    return {
      matriz_swot: `## Forças
- ${formData.forcas?.forca1 || "Equipe competente e dedicada"}
- ${formData.forcas?.forca2 || "Produto/serviço de alta qualidade"}
- ${formData.forcas?.forca3 || "Boa reputação no mercado"}

## Fraquezas
- ${formData.fraquezas?.fraqueza1 || "Processos internos não otimizados"}
- ${formData.fraquezas?.fraqueza2 || "Limitações de orçamento para marketing"}
- ${formData.fraquezas?.fraqueza3 || "Dependência de poucos clientes principais"}

## Oportunidades
- ${formData.oportunidades?.oportunidade1 || "Expansão para novos mercados"}
- ${formData.oportunidades?.oportunidade2 || "Parcerias estratégicas potenciais"}
- ${formData.oportunidades?.oportunidade3 || "Tendências favoráveis no setor"}

## Ameaças
- ${formData.ameacas?.ameaca1 || "Concorrência crescente"}
- ${formData.ameacas?.ameaca2 || "Mudanças regulatórias"}
- ${formData.ameacas?.ameaca3 || "Instabilidade econômica"}`,

      diagnostico_textual: `Com base na análise SWOT realizada, identificamos que sua empresa está em um momento crucial de tomada de decisões estratégicas. 

As forças atuais mostram um negócio com bases sólidas, especialmente em termos de ${formData.forcas?.forca1 || "qualidade de equipe"} e ${formData.forcas?.forca2 || "produto/serviço"}. No entanto, as fraquezas identificadas, particularmente ${formData.fraquezas?.fraqueza1 || "processos não otimizados"}, estão limitando o potencial de crescimento.

O cenário externo apresenta oportunidades significativas, como ${formData.oportunidades?.oportunidade1 || "expansão de mercado"}, que se alinham bem com suas capacidades internas. Contudo, ameaças como ${formData.ameacas?.ameaca1 || "concorrência crescente"} exigem atenção imediata e planejamento estratégico.

Considerando sua situação financeira ${formData.saudeFinanceira?.situacao_atual || "atual"} e a meta de ${formData.prioridades?.meta_90_dias || "crescimento nos próximos 90 dias"}, recomendamos fortemente uma abordagem que capitalize suas forças para explorar as oportunidades de mercado, enquanto trabalha para mitigar fraquezas internas.`,

      planos_acao: `# 🎯 Rota A – Estratégia ideal com investimento pleno

1. Implementar reestruturação completa dos processos internos para otimização
2. Investir em marketing estratégico para novos mercados
3. Desenvolver programa de capacitação para fortalecer ainda mais a equipe
4. Estabelecer parcerias estratégicas com players complementares
5. Desenvolver plano de contingência para as principais ameaças identificadas

# ⚙️ Rota B – Estratégia viável com recursos limitados

1. Priorizar a otimização dos processos mais críticos
2. Focar marketing em segmentos específicos de maior potencial
3. Implementar melhorias incrementais nos produtos/serviços existentes
4. Buscar parcerias que não exijam grandes investimentos iniciais
5. Monitorar ameaças principais com planos de resposta rápida

# 💡 Rota C – Estratégia criativa com orçamento mínimo

1. Implementar melhorias de baixo custo via reorganização interna
2. Utilizar marketing orgânico e redes sociais de forma intensiva
3. Focar em melhorias incrementais baseadas no feedback de clientes
4. Explorar modelos alternativos de negócio com menor investimento
5. Criar comunidade engajada para fortalecer posição de mercado`,
    };
  };

  useEffect(() => {
    // Simulate AI processing time
    const timer = setTimeout(() => {
      const mockResponse = gerarRelatorioMock();
      setResultadoFinal(mockResponse);
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
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
          <p className="text-gray-600">Isso pode levar alguns segundos.</p>
          <div className="w-full max-w-md mt-8">
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-1 bg-[#ef0002] animate-pulse w-full"></div>
            </div>
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

          <div className="flex justify-center space-x-4 pt-8">
            <Button 
              className="bg-[#ef0002] hover:bg-[#c50000] text-white px-8 py-2"
              onClick={() => {
                console.log("Salvando relatório:", resultadoFinal);
                // Em implementação real, aqui seria o código para salvar no Supabase
              }}
            >
              Salvar Relatório
            </Button>
            <Button 
              variant="outline"
              className="border-[#ef0002] text-[#ef0002] hover:bg-[#ffeeee] px-8 py-2"
              onClick={onRestart}
            >
              Iniciar Novo Diagnóstico
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBlock;
