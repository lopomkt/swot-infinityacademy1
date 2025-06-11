
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { FormData } from "@/types/formData";
import { useOpenRouterGeneration } from "@/hooks/useOpenRouterGeneration";
import { useAuth } from "@/contexts/AuthContext";

interface FinalizacaoStepProps {
  onRestart: () => void;
  formData: FormData;
  onAIComplete: (resultadoFinal: any) => void;
}

const FinalizacaoStep = ({ onRestart, formData, onAIComplete }: FinalizacaoStepProps) => {
  const { user } = useAuth();
  const { generateReport, loading, error, resultado } = useOpenRouterGeneration();
  const [hasStartedGeneration, setHasStartedGeneration] = useState(false);
  const [progress, setProgress] = useState(0);

  // Iniciar geração automaticamente quando componente carrega
  useEffect(() => {
    if (!hasStartedGeneration && user?.id && formData.identificacao?.nomeEmpresa) {
      console.log("🚀 [FinalizacaoStep] Iniciando geração automática do relatório...");
      setHasStartedGeneration(true);
      handleGenerateReport();
    }
  }, [user?.id, formData, hasStartedGeneration]);

  // Simular progresso durante geração
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [loading]);

  // Processar resultado quando disponível
  useEffect(() => {
    if (resultado && !loading && !error) {
      console.log("✅ [FinalizacaoStep] Resultado da IA recebido, processando...");
      setProgress(100);
      
      // Pequeno delay para melhor UX
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

  const handleRetry = () => {
    setHasStartedGeneration(false);
    setProgress(0);
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
            {!loading && !error && !resultado && (
              <p className="text-gray-600">
                Parabéns! Você completou todas as etapas da análise SWOT. 
                Seu relatório estratégico será gerado automaticamente usando GPT-4o-mini via OpenRouter.
              </p>
            )}

            {loading && (
              <div className="space-y-4">
                <p className="text-blue-600 font-medium">
                  🤖 Gerando seu relatório estratégico com Inteligência Artificial...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  {progress < 30 ? "Processando dados..." : 
                   progress < 60 ? "Analisando SWOT..." : 
                   progress < 90 ? "Gerando estratégias..." : "Finalizando..."}
                </p>
              </div>
            )}

            {error && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-medium">Erro na geração do relatório:</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
                <Button 
                  onClick={handleRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  🔄 Tentar Novamente
                </Button>
              </div>
            )}

            {!loading && !error && (
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
                    <li>✓ Prioridades estratégicas definidas</li>
                  </ul>
                </div>

                {/* Botão secundário */}
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

            {/* Aviso sobre o modelo */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-700 text-center">
                🤖 Análise gerada com GPT-4o-mini via OpenRouter<br />
                {loading ? "⏱️ Aguarde alguns segundos..." : "✅ Processamento completo"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalizacaoStep;
