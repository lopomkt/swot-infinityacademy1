import React, { useState, useEffect, useRef } from "react";
import { Loader, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ResultadoFinalData } from "@/types/formData";
import { FormData as GROQFormData } from "@/types/groq";
import { useAuth } from "@/contexts/AuthContext";
import { useReportGeneration } from "@/hooks/useReportGeneration";
import { reportService } from "@/services/report.service";
import ErrorMessageBlock from "@/components/ErrorMessageBlock";
import ErrorBoundary from "@/components/ErrorBoundary";

interface AIBlockProps {
  formData: any;
  onRestart: () => void;
  onAIComplete?: (resultadoFinal: ResultadoFinalData) => void;
}

const AIBlock: React.FC<AIBlockProps> = ({ formData, onRestart, onAIComplete }) => {
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  const [processingState, setProcessingState] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const { toast } = useToast();
  const { user } = useAuth();
  const debounceRef = useRef<NodeJS.Timeout>();
  
  // Hook personalizado para geração do relatório
  const { gerarRelatorio, resultado, loading, error, resetar } = useReportGeneration();

  // Função para converter formData para o formato esperado pelo GROQ
  const convertToGROQFormData = (data: any): GROQFormData => {
    return {
      identificacao: data.identificacao,
      forcas: data.forcas,
      fraquezas: data.fraquezas,
      oportunidades: data.oportunidades,
      ameacas: data.ameacas,
      saudeFinanceira: data.saudeFinanceira,
      prioridades: data.prioridades,
      resultadoFinal: data.resultadoFinal
    };
  };

  // Função para salvar no Supabase usando o service
  const salvarNoSupabase = async (resultados: any) => {
    if (!user) return;

    try {
      const reportId = await reportService.createReport({
        user_id: user.id,
        dados: formData,
        resultado_final: {
          ...resultados,
          created_at: new Date().toISOString(),
          tipo: "GROQ_PRODUCAO"
        }
      });
      
      if (reportId) {
        console.log('✅ Relatório salvo com IA GROQ - ID:', reportId);
        toast({
          title: "Relatório gerado e salvo com sucesso!",
          description: "Seu relatório estratégico está pronto para análise.",
        });
      } else {
        toast({
          title: "Relatório gerado com sucesso!",
          description: "Mas houve um erro ao salvar. Você pode tentar salvar manualmente.",
          variant: "destructive",
        });
      }
    } catch (dbError) {
      console.error("Erro ao salvar no banco de dados:", dbError);
      toast({
        title: "Relatório gerado",
        description: "Erro ao salvar automaticamente. Tente salvar manualmente.",
        variant: "destructive",
      });
    }
  };

  // Função para processar o resultado da IA
  const processarResultado = async (resultados: any) => {
    setProcessingState('completed');
    
    // Salvar no Supabase
    await salvarNoSupabase(resultados);
    
    // Enviar para o componente pai
    if (onAIComplete) {
      const resultadoFinal: ResultadoFinalData = {
        diagnostico_textual: resultados.diagnostico_textual,
        matriz_swot: resultados.matriz_swot,
        planos_acao: resultados.planos_acao,
        acoes_priorizadas: resultados.acoes_priorizadas || [],
        ai_block_pronto: resultados.ai_block_pronto,
        gpt_prompt_ok: resultados.gpt_prompt_ok,
        tipo: resultados.tipo,
        created_at: resultados.created_at
      };
      
      onAIComplete(resultadoFinal);
    }
  };

  // Função para tentar novamente
  const handleRetry = () => {
    resetar();
    setProcessingState('idle');
    setTimeoutWarning(false);
    
    const groqFormData = convertToGROQFormData(formData);
    gerarRelatorio(groqFormData);
  };

  // Effect com debounce para iniciar geração automaticamente
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (formData && processingState === 'idle') {
        setProcessingState('processing');
        const groqFormData = convertToGROQFormData(formData);
        gerarRelatorio(groqFormData);
      }
    }, 1500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [formData]);

  // Effect para monitorar mudanças no resultado
  useEffect(() => {
    if (resultado && resultado.ai_block_pronto) {
      processarResultado(resultado);
    }
  }, [resultado]);

  // Effect para monitorar erros
  useEffect(() => {
    if (error) {
      setProcessingState('failed');
    }
  }, [error]);

  // Effect para timeout warning
  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        setTimeoutWarning(true);
      }, 15000);

      return () => clearTimeout(timeoutId);
    } else {
      setTimeoutWarning(false);
    }
  }, [loading]);

  return (
    <ErrorBoundary onReset={resetar}>
      <div className="w-full max-w-4xl mx-auto py-8 px-4 animate-fade-in">
        {loading || processingState === 'processing' ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="mb-6">
              <Loader className="h-12 w-12 animate-spin text-[#ef0002]" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              ⏳ Processando sua análise com inteligência estratégica GROQ...
            </h3>
            <p className="text-gray-600 max-w-md text-center">
              {timeoutWarning 
                ? "Isso está demorando mais do que o esperado. Por favor, aguarde..." 
                : "Estamos analisando seus dados e gerando um relatório estratégico personalizado."}
            </p>
            <div className="w-full max-w-md mt-8">
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-1 bg-[#ef0002] animate-pulse w-full"></div>
              </div>
            </div>
          </div>
        ) : error || processingState === 'failed' ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <ErrorMessageBlock
              error={error || "Erro desconhecido"}
              onRetry={handleRetry}
              isRetrying={loading}
            />
            <div className="mt-6">
              <Button 
                variant="outline" 
                onClick={onRestart}
              >
                Voltar ao início
              </Button>
            </div>
          </div>
        ) : resultado && processingState === 'completed' ? (
          <div className="space-y-12">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
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
                {resultado.matriz_swot?.split('\n\n').map((section, index) => {
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
                {resultado.diagnostico_textual?.split('\n\n').map((paragraph, index) => (
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
                {resultado.planos_acao?.split('\n\n').map((section, index) => {
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
                  toast({
                    title: "Relatório salvo automaticamente",
                    description: "Seu relatório estratégico foi salvo com sucesso.",
                  });
                }}
              >
                Relatório Salvo ✓
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
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Aguardando dados para processar...</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AIBlock;
