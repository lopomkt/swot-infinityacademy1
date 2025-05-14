
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, CheckCircle } from "lucide-react";

interface Props {
  onRestart: () => void;
}

const FinalizacaoStep: React.FC<Props> = ({ onRestart }) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-6 text-center animate-fade-in">
      <div className="mb-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-[#560005] mb-2">
          Seu diagnóstico foi concluído com sucesso!
        </h2>
      </div>

      <div className="p-6 mb-8 bg-gray-50 rounded-lg shadow-sm">
        <p className="text-gray-700 mb-4">
          Agora vamos gerar seu relatório estratégico personalizado com análise de SWOT e recomendações específicas para o seu negócio.
        </p>
        
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="animate-bounce">
            <ArrowDown className="h-8 w-8 text-[#ef0002]" />
          </div>
          <p className="font-semibold">Processando sua análise...</p>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <div className="border-l-4 border-[#ef0002] pl-4 text-left">
          <h3 className="font-semibold text-lg">O que acontece agora?</h3>
          <p className="text-gray-600">
            Nossa inteligência artificial está processando todas as suas respostas para criar um relatório estratégico completo. Você receberá uma notificação assim que estiver pronto.
          </p>
        </div>

        <div className="border-l-4 border-[#ef0002] pl-4 text-left">
          <h3 className="font-semibold text-lg">Próximos passos</h3>
          <p className="text-gray-600">
            Revise seu relatório, implemente as sugestões prioritárias e considere agendar uma consultoria para aprofundar os pontos críticos identificados.
          </p>
        </div>
      </div>

      <Button
        onClick={onRestart}
        variant="outline"
        className="mt-4"
      >
        Voltar ao início
      </Button>
    </div>
  );
};

export default FinalizacaoStep;
