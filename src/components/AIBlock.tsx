
import React, { useState, useEffect, useRef } from "react";
import { Loader, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ResultadoFinalData } from "@/types/formData";
import { useAuth } from "@/contexts/AuthContext";
import { useOpenRouterGeneration } from "@/hooks/useOpenRouterGeneration";
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
  
  // Hook para geração com OpenRouter + GPT-4o-mini
  const { loading, error, resultado, generateReport, clearReport } = useOpenRouterGeneration();

  // Função para processar o resultado da IA
  const processarResultado = async (resultados: any) => {
    setProcessingState('completed');
    
    console.log("✅ Resultado processado com OpenRouter + GPT-4o-mini:", resultados);
    
    // Enviar para o componente pai
    if (onAIComplete) {
      const resultadoFinal: ResultadoFinalData = {
        diagnostico_textual: resultados.diagnostico_textual,
        matriz_swot: resultados.matriz_swot,
        planos_acao: resultados.planos_acao,
        acoes_priorizadas: [],
        ai_block_pronto: resultados.ai_block_pronto,
        groq_prompt_ok: resultados.groq_prompt_ok,
        tipo: resultados.tipo,
        created_at: resultados.created_at
      };
      
      onAIComplete(resultadoFinal);
    }

    toast({
      title: "Relatório gerado com sucesso!",
      description: "Análise estratégica criada com GPT-4o-mini via OpenRouter.",
    });
  };

  // Função para tentar novamente
  const handleRetry = () => {
    clearReport();
    setProcessingState('idle');
    setTimeoutWarning(false);
    
    if (user) {
      generateReport(formData, user.id);
    }
  };

  // Effect com debounce para iniciar geração automaticamente
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (formData && processingState === 'idle' && user) {
        setProcessingState('processing');
        generateReport(formData, user.id);
      }
    }, 1500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [formData, user]);

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
    <ErrorBoundary>
      <div className="w-full max-w-4xl mx-auto py-8 px-4 animate-fade-in">
        {loading || processingState === 'processing' ? (
          <div className="flex flex-col items-center justify-center min-h-[30vh] sm:min-h-[400px]">
            <div className="text-center py-10">
              <Loader className="h-12 w-12 animate-spin text-[#ef0002] mx-auto mb-6" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                🤖 Gerando análise estratégica com GPT-4o-mini...
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-center">
                {timeoutWarning 
                  ? "Isso está demorando mais do que o esperado. Por favor, aguarde..." 
                  : "Nossa IA está analisando seus dados via OpenRouter e criando um relatório estratégico personalizado."}
              </p>
              <div className="w-full max-w-md mt-8 mx-auto">
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-1 bg-[#ef0002] animate-pulse w-full"></div>
                </div>
              </div>
            </div>
          </div>
        ) : error || processingState === 'failed' ? (
          <div className="flex flex-col items-center justify-center min-h-[30vh] sm:min-h-[400px]">
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
                Análise personalizada gerada por GPT-4o-mini via OpenRouter com base nos dados fornecidos sobre seu negócio. 
                Use este relatório como guia para suas decisões estratégicas.
              </p>
            </div>

            {/* Matriz SWOT */}
            {resultado.matriz_swot && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-2xl font-bold text-[#ef0002] mb-4">
                  Matriz SWOT detalhada da sua empresa
                </h3>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: resultado.matriz_swot.replace(/\n/g, '<br>') }} />
                </div>
              </div>
            )}

            {/* Diagnóstico Textual */}
            {resultado.diagnostico_textual && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-2xl font-bold text-[#ef0002] mb-4">
                  Análise estratégica gerada por inteligência artificial
                </h3>
                <div className="prose max-w-none text-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: resultado.diagnostico_textual.replace(/\n/g, '<br>') }} />
                </div>
              </div>
            )}

            {/* Planos de Ação */}
            {resultado.planos_acao && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-2xl font-bold text-[#ef0002] mb-4">
                  Plano de ação com rotas estratégicas sugeridas
                </h3>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: resultado.planos_acao.replace(/\n/g, '<br>') }} />
                </div>
              </div>
            )}

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
          <div className="flex flex-col items-center justify-center min-h-[30vh] sm:min-h-[400px]">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Aguardando dados para processar...</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AIBlock;
