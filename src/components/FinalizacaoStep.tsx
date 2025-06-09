
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Sparkles } from "lucide-react";
import { FormData } from "@/types/formData";

interface FinalizacaoStepProps {
  onRestart: () => void;
  formData: FormData;
  onAIComplete: (resultadoFinal: any) => void;
}

const FinalizacaoStep = ({ onRestart, formData, onAIComplete }: FinalizacaoStepProps) => {
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
              Seu relatório estratégico será gerado automaticamente usando GPT-4o-mini via OpenRouter.
            </p>

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
            >
              🔄 Recomeçar Análise
            </Button>

            {/* Aviso sobre o modelo */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-700 text-center">
                🤖 A análise será gerada automaticamente com GPT-4o-mini via OpenRouter<br />
                ⏱️ Aguarde alguns segundos...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalizacaoStep;
