
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DiagnosticoTextualProps {
  texto: string;
}

export default function DiagnosticoTextual({ texto }: DiagnosticoTextualProps) {
  const isMobile = useIsMobile();

  const renderDiagnosticoContent = () => (
    <div className="text-sm sm:text-base">
      <p className="text-gray-800 leading-relaxed whitespace-pre-line overflow-x-auto max-w-full">{texto}</p>
    </div>
  );

  return (
    <div 
      className="mt-10 mb-6 scroll-mt-20"
      role="region"
      aria-labelledby="diagnostico-title"
    >
      <h2 id="diagnostico-title" className="text-2xl font-bold text-[#560005] mb-2">Diagnóstico Consultivo</h2>
      
      {isMobile ? (
        <Accordion type="single" collapsible>
          <AccordionItem value="diagnostico">
            <AccordionTrigger className="text-[#560005] font-bold">
              Ver diagnóstico completo
            </AccordionTrigger>
            <AccordionContent>
              {renderDiagnosticoContent()}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        renderDiagnosticoContent()
      )}
    </div>
  );
}
