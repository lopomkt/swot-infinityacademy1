
import React, { useState, useEffect, useRef } from "react";
import { Loader, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
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
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const debounceRef = useRef<NodeJS.Timeout>();
  
  // Hook para geração com OpenRouter + GPT-4o-mini
  const { loading, error, resultado, generateReport, clearReport, regenerateReport } = useOpenRouterGeneration();

  // Função para processar o resultado da IA
  const processarResultado = async (resultados: any) => {
    setProcessingState('completed');
    setProgress(100);
    setCurrentTask('Análise concluída com GPT-4o-mini!');
    
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
    setProgress(0);
    setCurrentTask('');
    
    if (user) {
      handleGenerateReport();
    }
  };

  // Função principal de geração
  const handleGenerateReport = async () => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    setProcessingState('processing');
    setProgress(10);
    setCurrentTask('Validando dados do formulário...');

    // Simular progresso visual
    const progressSteps = [
      { step: 20, task: 'Conectando com OpenRouter...' },
      { step: 40, task: 'Enviando dados para GPT-4o-mini...' },
      { step: 60, task: 'Processando análise estratégica...' },
      { step: 80, task: 'Formatando resultado final...' },
      { step: 90, task: 'Salvando relatório...' }
    ];

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < progressSteps.length && !loading) {
        const { step, task } = progressSteps[currentStep];
        setProgress(step);
        setCurrentTask(task);
        currentStep++;
      } else {
        clearInterval(progressInterval);
      }
    }, 1000);

    try {
      const result = await generateReport(formData, user.id);
      clearInterval(progressInterval);
      
      if (result) {
        processarResultado(result);
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('❌ Erro na geração:', error);
      setProcessingState('failed');
    }
  };

  // Effect com debounce para iniciar geração automaticamente
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (formData && processingState === 'idle' && user) {
        handleGenerateReport();
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
    if (loading || processingState === 'processing') {
      const timeoutId = setTimeout(() => {
        setTimeoutWarning(true);
      }, 20000);

      return () => clearTimeout(timeoutId);
    } else {
      setTimeoutWarning(false);
    }
  }, [loading, processingState]);

  return (
    <ErrorBoundary>
      <div className="w-full max-w-4xl mx-auto py-8 px-4 animate-fade-in">
        {(loading || processingState === 'processing') && !error ? (
          <div className="flex flex-col items-center justify-center min-h-[30vh] sm:min-h-[400px]">
            <div className="text-center py-10 w-full max-w-2xl">
              <Sparkles className="h-12 w-12 text-[#ef0002] mx-auto mb-6 animate-pulse" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                🤖 Gerando análise estratégica com GPT-4o-mini...
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-center mb-4">
                {timeoutWarning 
                  ? "Isso está demorando mais do que o esperado. Por favor, aguarde..." 
                  : currentTask || "Nossa IA está analisando seus dados via OpenRouter e criando um relatório estratégico personalizado."}
              </p>

              {/* Barra de progresso visual */}
              <div className="w-full max-w-md mt-8 mx-auto">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-[#ef0002] transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-sm font-semibold text-[#ef0002] mt-2">
                  {progress}% concluído
                </p>
              </div>

              {/* Mensagem motivacional */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800">
                  <strong>🤖 GPT-4o-mini está trabalhando para você!</strong><br />
                  Estamos analisando seus dados via OpenRouter e gerando estratégias personalizadas 
                  para impulsionar seu negócio.
                </p>
              </div>
            </div>
          </div>
        ) : error || processingState === 'failed' ? (
          <div className="flex flex-col items-center justify-center min-h-[30vh] sm:min-h-[400px]">
            <ErrorMessageBlock
              error={error || "Erro desconhecido"}
              onRetry={handleRetry}
              isRetrying={loading || processingState === 'processing'}
            />
            <div className="mt-6 flex gap-4">
              <Button 
                onClick={handleRetry}
                className="bg-[#ef0002] hover:bg-[#c50000]"
                disabled={loading || processingState === 'processing'}
              >
                Tentar Novamente
              </Button>
              <Button 
                variant="outline" 
                onClick={onRestart}
              >
                Voltar ao Início
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
                  📊 Matriz SWOT Detalhada
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
                  🎯 Análise Estratégica Consultiva
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
                  🚀 Planos de Ação Estratégicos
                </h3>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: resultado.planos_acao.replace(/\n/g, '<br>') }} />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <Button 
                className="bg-[#ef0002] hover:bg-[#c50000] text-white px-8 py-3"
                onClick={() => {
                  toast({
                    title: "Relatório salvo automaticamente",
                    description: "Seu relatório estratégico foi salvo com sucesso.",
                  });
                }}
              >
                ✓ Relatório Salvo
              </Button>
              <Button 
                variant="outline"
                className="border-[#ef0002] text-[#ef0002] hover:bg-[#ffeeee] px-8 py-3"
                onClick={onRestart}
              >
                🔄 Nova Análise
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[30vh] sm:min-h-[400px]">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-gray-400 mb-4 mx-auto" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Pronto para gerar seu relatório
              </h3>
              <p className="text-gray-500 mb-6">
                Aguardando dados do formulário para iniciar a análise...
              </p>
              {formData && (
                <Button 
                  onClick={handleGenerateReport}
                  className="bg-[#ef0002] hover:bg-[#c50000] text-white px-8 py-3"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Gerar Análise Agora
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AIBlock;
