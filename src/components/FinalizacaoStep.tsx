
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AIBlock from "@/components/AIBlock";

interface FinalizacaoStepProps {
  onRestart: () => void;
  formData?: any;
}

const FinalizacaoStep: React.FC<FinalizacaoStepProps> = ({ onRestart, formData }) => {
  const [showAiBlock, setShowAiBlock] = React.useState(false);

  if (showAiBlock) {
    return <AIBlock formData={formData} onRestart={onRestart} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8 flex flex-col items-center animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#560005] mb-4">
          Diagnóstico SWOT concluído com sucesso!
        </h2>
        
        <p className="text-gray-700 mb-8 max-w-md mx-auto">
          Parabéns! Você completou todos os passos do diagnóstico estratégico.
          Agora você pode gerar seu relatório personalizado.
        </p>
        
        <div className="bg-white rounded-lg p-6 shadow-md mb-8 w-full max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-[#ef0002] mb-4">
            Relatório Estratégico SWOT
          </h3>
          <p className="text-gray-600 mb-6">
            Ao clicar no botão abaixo, nossa inteligência artificial analisará seus dados e criará:
          </p>
          <ul className="text-left space-y-3 mb-6">
            <li className="flex items-start">
              <span className="text-[#ef0002] font-bold mr-2">✓</span>
              <span>Matriz SWOT detalhada</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#ef0002] font-bold mr-2">✓</span>
              <span>Diagnóstico estratégico personalizado</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#ef0002] font-bold mr-2">✓</span>
              <span>Planos de ação com múltiplas rotas estratégicas</span>
            </li>
          </ul>
          
          <Button 
            onClick={() => setShowAiBlock(true)}
            className="bg-[#ef0002] hover:bg-[#c50000] text-white w-full gap-2"
          >
            Gerar Relatório Estratégico
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          onClick={onRestart}
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Iniciar Novo Diagnóstico
        </Button>
      </div>
    </div>
  );
};

export default FinalizacaoStep;
