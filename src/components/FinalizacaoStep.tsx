
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { FormData } from "@/types/formData";
import { openRouterService } from "@/services/openrouter.service";
import { reportService } from "@/services/report.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface FinalizacaoStepProps {
  onRestart: () => void;
  formData: FormData;
  onAIComplete: (resultadoFinal: any) => void;
}

const FinalizacaoStep = ({ onRestart, formData, onAIComplete }: FinalizacaoStepProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { userData } = useAuth();

  const handleGenerateReport = async () => {
    if (!userData?.id) {
      toast.error("Usuário não autenticado");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress(0);

    try {
      // Etapa 1: Validação dos dados
      setCurrentTask('Validando dados do formulário...');
      setProgress(20);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!reportService.validateReportData(formData)) {
        throw new Error('Dados do formulário incompletos ou inválidos');
      }

      // Etapa 2: Salvar dados no banco
      setCurrentTask('Salvando dados no banco...');
      setProgress(40);

      const reportId = await reportService.createReport({
        user_id: userData.id,
        dados: formData,
      });

      if (!reportId) {
        throw new Error('Falha ao salvar dados no banco');
      }

      // Armazenar ID do relatório para uso posterior
      sessionStorage.setItem('relatorio_id', reportId);

      // Etapa 3: Gerar análise com IA OpenRouter + GPT-4o-mini
      setCurrentTask('Gerando análise estratégica com GPT-4o-mini...');
      setProgress(60);

      const analysis = await openRouterService.generateAnalysis(formData);

      if (!openRouterService.validateAnalysis(analysis)) {
        throw new Error('Análise gerada é inválida ou incompleta');
      }

      // Etapa 4: Processar e formatar resultado
      setCurrentTask('Formatando resultado final...');
      setProgress(80);

      const formattedResult = openRouterService.formatAnalysisForResults(analysis);

      // Criar estrutura compatível com o sistema
      const resultadoFinal = {
        diagnostico_textual: formattedResult.diagnostico_consultivo || formattedResult.analise_completa?.diagnostico_textual || 'Diagnóstico gerado com sucesso',
        matriz_swot: formattedResult.analise_completa?.matriz_swot || 'Matriz SWOT gerada',
        planos_acao: formattedResult.analise_completa?.planos_acao || 'Planos de ação gerados',
        ai_block_pronto: true,
        groq_prompt_ok: true,
        tipo: "OPENROUTER_GPT4O_MINI",
        created_at: new Date().toISOString(),
        score_estrategico: formattedResult.score_estrategico || 75,
        model_used: 'openai/gpt-4o-mini'
      };

      // Etapa 5: Atualizar relatório com resultado
      setCurrentTask('Salvando análise completa...');
      setProgress(90);

      const updateSuccess = await reportService.updateReport(reportId, {
        resultado_final: resultadoFinal,
      });

      if (!updateSuccess) {
        console.warn('⚠️ Falha ao atualizar relatório, mas análise foi gerada');
      }

      // Finalização
      setCurrentTask('Análise concluída com GPT-4o-mini!');
      setProgress(100);

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Relatório gerado com sucesso usando GPT-4o-mini!");
      
      // Passar resultado para o componente pai
      onAIComplete(resultadoFinal);

    } catch (error: any) {
      console.error('❌ Erro na geração do relatório OpenRouter:', error);
      setError(error.message || 'Erro inesperado na geração do relatório');
      toast.error("Falha na geração do relatório");
    } finally {
      setIsGenerating(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <AlertCircle className="mr-2 h-5 w-5" />
              Erro na Geração do Relatório
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-3">
              <Button
                onClick={handleGenerateReport}
                className="bg-[#ef0002] hover:bg-[#b70001]"
              >
                Tentar Novamente
              </Button>
              <Button
                onClick={() => {
                  setError(null);
                  setProgress(0);
                  setCurrentTask('');
                }}
                variant="outline"
              >
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-[#ef0002]" />
              Gerando Seu Relatório Estratégico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Barra de progresso visual */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#ef0002] h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {/* Status atual */}
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#ef0002]" />
                <span className="text-sm text-gray-600">{currentTask}</span>
              </div>

              {/* Progresso percentual */}
              <p className="text-center text-lg font-semibold text-[#ef0002]">
                {progress}% concluído
              </p>

              {/* Mensagem motivacional */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>🤖 GPT-4o-mini está trabalhando para você!</strong><br />
                  Estamos analisando seus dados via OpenRouter e gerando estratégias personalizadas 
                  para impulsionar seu negócio. Isso pode levar alguns minutos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            Formulário Concluído
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Parabéns! Você completou todas as etapas da análise SWOT. 
              Agora vamos gerar seu relatório estratégico personalizado com 
              insights e recomendações específicas usando GPT-4o-mini via OpenRouter.
            </p>

            {/* Resumo dos dados coletados */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Dados Coletados:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Identificação da empresa</li>
                <li>✓ {formData.forcas?.respostas?.length || 0} forças identificadas</li>
                <li>✓ {formData.fraquezas?.pontos_inconsistentes?.length || 0} fraquezas mapeadas</li>
                <li>✓ {formData.oportunidades?.respostas?.length || 0} oportunidades detectadas</li>
                <li>✓ {formData.ameacas?.respostas?.length || 0} ameaças analisadas</li>
                <li>✓ Situação financeira avaliada</li>
                <li>✓ Prioridades estratégicas definidas</li>
              </ul>
            </div>

            {/* Botão principal */}
            <Button
              onClick={handleGenerateReport}
              className="w-full bg-[#ef0002] hover:bg-[#b70001] text-white text-lg py-3"
              size="lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Gerar Relatório com GPT-4o-mini
            </Button>

            {/* Botão secundário */}
            <Button
              onClick={onRestart}
              variant="outline"
              className="w-full"
            >
              Recomeçar Análise
            </Button>

            {/* Aviso sobre tempo e modelo */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-700 text-center">
                🤖 Análise gerada com GPT-4o-mini via OpenRouter<br />
                ⏱️ Tempo estimado: 30 segundos a 2 minutos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalizacaoStep;
