
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileFormWrapper from '@/components/mobile/MobileFormWrapper';

interface FormFinalSuccessScreenProps {
  onRefazer: () => void;
  onVoltar: () => void;
}

export default function FormFinalSuccessScreen({ onRefazer, onVoltar }: FormFinalSuccessScreenProps) {
  const isMobile = useIsMobile();

  const content = (
    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center min-h-[60vh]">
      <CheckCircle className="text-green-500 text-5xl mb-4" />
      
      <h2 className="text-2xl font-bold text-[#560005] mb-2">
        Diagnóstico Finalizado com Sucesso!
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md">
        Você pode revisar as etapas ou gerar um novo relatório
      </p>
      
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Button 
          onClick={onRefazer}
          className="bg-[#ef0002] text-white hover:bg-[#c50000]"
        >
          Refazer Diagnóstico
        </Button>
        
        <Button 
          onClick={onVoltar}
          variant="outline"
          className="border-gray-300"
        >
          Voltar ao Início
        </Button>
      </div>
    </div>
  );

  return isMobile ? (
    <MobileFormWrapper>
      {content}
    </MobileFormWrapper>
  ) : (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-md">
      {content}
    </div>
  );
}
