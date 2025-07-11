
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Sparkles, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { FormData } from "@/types/formData";
import { useOpenRouterGeneration } from "@/hooks/useOpenRouterGeneration";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";

interface FinalizacaoStepProps {
  onRestart: () => void;
  formData: FormData;
  onAIComplete: (resultadoFinal: any) => void;
}

const FinalizacaoStep = ({ onRestart, formData, onAIComplete }: FinalizacaoStepProps) => {
  const { user } = useAuth();
  const { 
    generateReport, 
    retryGeneration,
    loading, 
    error, 
    resultado, 
    attempt, 
    timeoutReached 
  } = useOpenRouterGeneration();
  
  const [hasStartedGeneration, setHasStartedGeneration] = useState(false);
  const [progress, setProgress] = useState(0);
  const [manualMode, setManualMode] = useState(false);

  // Iniciar geração automaticamente quando componente carrega
  useEffect(() => {
    if (!hasStartedGeneration && user?.id && formData.identificacao?.nomeEmpresa && !manualMode) {
      console.log("🚀 [FinalizacaoStep] Iniciando geração automática do relatório...");
      setHasStartedGeneration(true);
      handleGenerateReport();
    }
  }, [user?.id, formData, hasStartedGeneration, manualMode]);

  // Controlar progresso visual baseado no estado
  useEffect(() => {
    if (loading) {
      // Progresso baseado na tentativa atual
      const baseProgress = (attempt - 1) * 30; // 0%, 30%, 60%
      let currentProgress = baseProgress;
      
      const interval = setInterval(() => {
        setProgress(prev => {
          // Incrementar até o limite da tentativa atual
          const maxForAttempt = baseProgress + 25; // Deixar espaço para próxima tentativa
          if (prev < maxForAttempt) {
            return prev + 2;
          }
          return prev;
        });
      }, 500);

      return () => clearInterval(interval);
    } else if (resultado && !error) {
      setProgress(100);
    } else if (error) {
      // Manter progresso atual em caso de erro
    }
  }, [loading, attempt, resultado, error]);

  // Processar resultado quando disponível
  useEffect(() => {
    if (resultado && !loading && !error) {
      console.log("✅ [FinalizacaoStep] Resultado da IA recebido, processando...");
      setProgress(100);
      
      // Delay para melhor UX
      setTimeout(() => {
        onAIComplete(resultado);
      }, 1000);
    }
  }, [resultado, loading, error, onAIComplete]);

  const handleGenerateReport = async () => {
    if (!user?.id) {
      console.error("❌ [FinalizacaoStep] Usuário não autenticado");
      return;
    }

    try {
      console.log("🤖 [FinalizacaoStep] Gerando relatório com OpenRouter...");
      console.log("📋 [FinalizacaoStep] Dados do formulário:", {
        empresa: formData.identificacao?.nomeEmpresa,
        forcas: Object.keys(formData.forcas || {}).length,
        fraquezas: Object.keys(formData.fraquezas || {}).length,
        oportunidades: Object.keys(formData.oportunidades || {}).length,
        ameacas: Object.keys(formData.ameacas || {}).length,
        userId: user.id
      });
      
      setProgress(0);
      
      const result = await generateReport(formData, user.id);
      
      if (result) {
        console.log("✅ [FinalizacaoStep] Relatório gerado com sucesso!");
      } else {
        console.error("❌ [FinalizacaoStep] Falha na geração do relatório");
      }
    } catch (error) {
      console.error("❌ [FinalizacaoStep] Erro na geração:", error);
    }
  };

  const handleRetry = async () => {
    if (!user?.id) return;
    
    console.log("🔄 [FinalizacaoStep] Tentando novamente...");
    setProgress(0);
    
    const result = await retryGeneration(formData, user.id);
    
    if (result) {
      console.log("✅ [FinalizacaoStep] Retry bem-sucedido!");
    }
  };

  const handleManualGeneration = () => {
    setManualMode(true);
    setHasStartedGeneration(true);
    handleGenerateReport();
  };

  const getProgressMessage = () => {
    if (timeoutReached) {
      return "⏰ Timeout detectado, tentando novamente...";
    }
    
    if (attempt > 0) {
      return `🔄 Tentativa ${attempt}/3 - Processando...`;
    }
    
    if (progress < 30) return "🔍 Analisando dados do formulário...";
    if (progress < 60) return "🤖 Conectando com OpenRouter + GPT-4o-mini...";
    if (progress < 90) return "📊 Gerando análise estratégica...";
    return "✨ Finalizando relatório...";
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-blue-500" />
            ) : error ? (
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
            ) : (
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            )}
            {loading ? "Gerando Relatório..." : error ? "Erro na Geração" : "Formulário Concluído"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!loading && !error && !resultado && !manualMode && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Parabéns! Você completou todas as etapas da análise SWOT. 
                  Seu relatório estratégico será gerado automaticamente.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700 font-medium mb-2">
                    🤖 Geração Automática Iniciada
                  </p>
                  <p className="text-xs text-blue-600">
                    O sistema iniciará automaticamente em alguns segundos...
                  </p>
                </div>
                
                <Button
                  onClick={handleManualGeneration}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Relatório Agora
                </Button>
              </div>
            )}

            {loading && (
              <div className="space-y-4">
                <p className="text-blue-600 font-medium">
                  🤖 Gerando seu relatório estratégico com Inteligência Artificial...
                </p>
                
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{getProgressMessage()}</span>
                    <span>{progress}%</span>
                  </div>
                </div>
                
                {attempt > 1 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-xs text-orange-700">
                      ⚡ Sistema inteligente: Detectamos demora e estamos tentando uma abordagem alternativa...
                    </p>
                  </div>
                )}
                
                {timeoutReached && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-700">
                      ⏰ O processo está demorando mais que o esperado. Continuamos tentando com diferentes estratégias...
                    </p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-medium">Erro na geração do relatório:</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  
                  {attempt > 0 && (
                    <p className="text-red-500 text-xs mt-2">
                      Tentativas realizadas: {attempt}/3
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleRetry}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                    onClick={onRestart}
                    variant="outline"
                    className="flex-1"
                  >
                    🔄 Recomeçar
                  </Button>
                </div>
              </div>
            )}

            {!loading && !error && (resultado || manualMode) && (
              <>
                {/* Resumo dos dados coletados */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Dados Coletados:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Identificação da empresa: {formData.identificacao?.nomeEmpresa}</li>
                    <li>✓ {formData.forcas?.respostas?.length || 0} forças identificadas</li>
                    <li>✓ {formData.fraquezas?.pontos_inconsistentes?.length || 0} fraquezas mapeadas</li>
                    <li>✓ {formData.oportunidades?.respostas?.length || 0} oportunidades detectadas</li>
                    <li>✓ {formData.ameacas?.respostas?.length || 0} ameaças analisadas</li>
                    <li>✓ Situação financeira: {formData.saudeFinanceira?.maturidade_financeira}</li>
                  </ul>
                </div>

                <Button
                  onClick={onRestart}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  🔄 Recomeçar Análise
                </Button>
              </>
            )}

            {/* Status do sistema */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-700 text-center">
                🤖 Sistema robusto com 3 tentativas automáticas<br />
                ⏱️ Timeout inteligente de 60 segundos por tentativa<br />
                🔄 Retry automático em caso de falhas temporárias
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalizacaoStep;
