
import React, { useState, useEffect, useRef } from "react";
import { Loader, AlertCircle, CheckCircle, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ResultadoFinalData } from "@/types/formData";
import { useAuth } from "@/contexts/AuthContext";
import { useOpenRouterGeneration } from "@/hooks/useOpenRouterGeneration";
import ErrorMessageBlock from "@/components/ErrorMessageBlock";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Progress } from "@/components/ui/progress";

interface AIBlockProps {
  formData: any;
  onRestart: () => void;
  onAIComplete?: (resultadoFinal: ResultadoFinalData) => void;
}

const AIBlock: React.FC<AIBlockProps> = ({ formData, onRestart, onAIComplete }) => {
  const [processingState, setProcessingState] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const debounceRef = useRef<NodeJS.Timeout>();
  
  // Hook para geração com OpenRouter + GPT-4o-mini (com retry e timeout)
  const { 
    loading, 
    error, 
    resultado, 
    generateReport, 
    retryGeneration,
    clearReport, 
    regenerateReport,
    attempt,
    timeoutReached
  } = useOpenRouterGeneration();

  // Função para processar o resultado da IA
  const processarResultado = async (resultados: any) => {
    setProcessingState('completed');
    setProgress(100);
    setCurrentTask('Análise concluída com OpenRouter + GPT-4o-mini!');
    
    console.log("✅ Resultado processado com OpenRouter + GPT-4o-mini:", resultados);
    
    // Enviar para o componente pai
    if (onAIComplete) {
      const resultadoFinal: ResultadoFinalData = {
        diagnostico_textual: resultados.diagnostico_textual,
        matriz_swot: resultados.matriz_swot,
        planos_acao: resultados.planos_acao,
        acoes_priorizadas: [],
        ai_block_pronto: resultados.ai_block_pronto,
        openrouter_prompt_ok: resultados.openrouter_prompt_ok,
        tipo: resultados.tipo,
        created_at: resultados.created_at
      };
      
      onAIComplete(resultadoFinal);
    }

    toast({
      title: "Relatório gerado com sucesso!",
      description: "Análise estratégica criada com OpenRouter + GPT-4o-mini.",
    });
  };

  // Função para tentar novamente (com sistema robusto)
  const handleRetry = async () => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    setProcessingState('processing');
    setProgress(0);
    setCurrentTask('Reiniciando geração...');
    
    try {
      const result = await retryGeneration(formData, user.id);
      if (result) {
        processarResultado(result);
      }
    } catch (error: any) {
      console.error('❌ Erro no retry:', error);
      setProcessingState('failed');
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

    try {
      const result = await generateReport(formData, user.id);
      
      if (result) {
        processarResultado(result);
      }
    } catch (error: any) {
      console.error('❌ Erro na geração:', error);
      setProcessingState('failed');
    }
  };

  // Controlar progresso visual
  useEffect(() => {
    if (loading) {
      // Progresso baseado na tentativa atual
      const baseProgress = (attempt - 1) * 25; // 0%, 25%, 50%
      
      const interval = setInterval(() => {
        setProgress(prev => {
          const maxForAttempt = baseProgress + 20; // Deixar espaço
          if (prev < maxForAttempt) {
            return prev + 3;
          }
          return prev;
        });
      }, 800);

      // Atualizar mensagem baseada na tentativa
      if (attempt > 0) {
        if (timeoutReached) {
          setCurrentTask(`⏰ Timeout na tentativa ${attempt}, continuando...`);
        } else {
          setCurrentTask(`🔄 Tentativa ${attempt}/3 - Gerando análise...`);
        }
      }

      return () => clearInterval(interval);
    }
  }, [loading, attempt, timeoutReached]);

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

  return (
    <ErrorBoundary>
      <div className="w-full max-w-4xl mx-auto py-8 px-4 animate-fade-in">
        {(loading || processingState === 'processing') && !error ? (
          <div className="flex flex-col items-center justify-center min-h-[30vh] sm:min-h-[400px]">
            <div className="text-center py-10 w-full max-w-2xl">
              <Sparkles className="h-12 w-12 text-[#ef0002] mx-auto mb-6 animate-pulse" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                🤖 Gerando análise estratégica com OpenRouter + GPT-4o-mini...
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-center mb-4">
                {currentTask || "Nossa IA está analisando seus dados via OpenRouter e criando um relatório estratégico personalizado."}
              </p>

              {/* Barra de progresso aprimorada */}
              <div className="w-full max-w-md mt-8 mx-auto">
                <Progress value={progress} className="h-3 mb-2" />
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Progresso</span>
                  <span>{progress}%</span>
                </div>
                
                {attempt > 0 && (
                  <div className="text-sm text-blue-600 mb-4">
                    Tentativa {attempt}/3 {timeoutReached ? "(timeout detectado)" : ""}
                  </div>
                )}
              </div>

              {/* Status cards */}
              <div className="space-y-3 mt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>🤖 Sistema Robusto Ativo!</strong><br />
                    Até 3 tentativas automáticas • Timeout de 60s por tentativa • Retry inteligente
                  </p>
                </div>
                
                {attempt > 1 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-700">
                      ⚡ <strong>Auto-recovery ativo:</strong> Detectamos demora e estamos usando estratégias alternativas
                    </p>
                  </div>
                )}
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
            
            {attempt > 0 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Tentativas realizadas: {attempt}/3
                </p>
                {timeoutReached && (
                  <p className="text-xs text-orange-600">
                    ⏰ Timeout detectado - o sistema tentará com diferentes abordagens
                  </p>
                )}
              </div>
            )}
            
            <div className="mt-6 flex gap-4">
              <Button 
                onClick={handleRetry}
                className="bg-[#ef0002] hover:bg-[#c50000]"
                disabled={loading || processingState === 'processing'}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Tentando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Tentar Novamente
                  </>
                )}
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
                Análise personalizada gerada por OpenRouter + GPT-4o-mini com base nos dados fornecidos sobre seu negócio. 
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
