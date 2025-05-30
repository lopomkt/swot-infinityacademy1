
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileFormWrapper from '@/components/mobile/MobileFormWrapper';
import MobileNavigation from '@/components/mobile/MobileNavigation';

interface FormStepResumoProps {
  data: any;
  onComplete: () => void;
  onBack?: () => void;
  onRefazer?: () => void;
}

export function FormStepResumo({ data, onComplete, onBack, onRefazer }: FormStepResumoProps) {
  const isMobile = useIsMobile();

  const formContent = (
    <div className={`w-full bg-white rounded-xl ${isMobile ? 'px-4 sm:px-6' : 'p-6'} shadow-md mx-auto animate-fade-in ${isMobile ? 'overflow-y-auto max-h-[calc(100vh-120px)]' : ''}`}>
      <h2 className="text-2xl font-bold text-[#560005] mb-4">
        Resumo das Respostas
      </h2>
      <p className="text-gray-600 mb-6">
        Revise suas respostas antes de gerar o relatório estratégico.
      </p>

      {onRefazer && (
        <button
          onClick={onRefazer}
          className="text-primary underline text-sm mb-4 hover:text-primary/80 transition-colors"
        >
          Refazer Etapas
        </button>
      )}

      <div className="space-y-4 mb-6">
        {/* Resumo das respostas */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Suas respostas foram registradas</h3>
          <p className="text-sm text-gray-600">
            Todas as informações foram salvas e estão prontas para gerar seu relatório estratégico personalizado.
          </p>
        </div>
      </div>

      {/* Desktop navigation - only show when not mobile */}
      {!isMobile && (
        <div className="flex justify-between pt-4 gap-4">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack}>
              ← Voltar
            </Button>
          )}
          <Button onClick={onComplete} className="bg-[#ef0002] text-white">
            Gerar Relatório Estratégico
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {isMobile ? (
        <MobileFormWrapper>
          {formContent}
        </MobileFormWrapper>
      ) : (
        formContent
      )}

      <MobileNavigation
        onNext={onComplete}
        onBack={onBack}
        nextLabel="Gerar Relatório Estratégico"
        isNextDisabled={false}
      />
    </>
  );
}

export default FormStepResumo;
