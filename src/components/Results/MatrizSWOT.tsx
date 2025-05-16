
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface MatrizSWOTProps {
  forcas: string[];
  fraquezas: string[];
  oportunidades: string[];
  ameacas: string[];
}

const MatrizSWOT = React.memo(function MatrizSWOT({ forcas, fraquezas, oportunidades, ameacas }: MatrizSWOTProps) {
  const isMobile = useIsMobile();
  
  const renderMatrizContent = () => (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 md:gap-6 overflow-x-auto max-w-full" 
    >      
      <div className="bg-white border-l-4 border-[#ef0002] p-4 sm:p-6 md:p-8 rounded-xl shadow-sm">
        <h3 id="forcas-title" className="font-bold text-[#560005] text-sm sm:text-base">FORÇAS</h3>
        <ul 
          className="list-disc pl-5 mt-2 text-gray-700 text-sm sm:text-base" 
          aria-labelledby="forcas-title"
        >
          {forcas.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
      <div className="bg-white border-l-4 border-[#b70001] p-4 sm:p-6 md:p-8 rounded-xl shadow-sm">
        <h3 id="fraquezas-title" className="font-bold text-[#560005] text-sm sm:text-base">FRAQUEZAS</h3>
        <ul 
          className="list-disc pl-5 mt-2 text-gray-700 text-sm sm:text-base"
          aria-labelledby="fraquezas-title"
        >
          {fraquezas.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
      <div className="bg-white border-l-4 border-[#ef0002] p-4 sm:p-6 md:p-8 rounded-xl shadow-sm">
        <h3 id="oportunidades-title" className="font-bold text-[#560005] text-sm sm:text-base">OPORTUNIDADES</h3>
        <ul 
          className="list-disc pl-5 mt-2 text-gray-700 text-sm sm:text-base"
          aria-labelledby="oportunidades-title"
        >
          {oportunidades.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
      <div className="bg-white border-l-4 border-[#b70001] p-4 sm:p-6 md:p-8 rounded-xl shadow-sm">
        <h3 id="ameacas-title" className="font-bold text-[#560005] text-sm sm:text-base">AMEAÇAS</h3>
        <ul 
          className="list-disc pl-5 mt-2 text-gray-700 text-sm sm:text-base"
          aria-labelledby="ameacas-title"
        >
          {ameacas.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
    </div>
  );

  return (
    <div 
      className="scroll-mt-20" 
      role="region" 
      aria-labelledby="swot-matrix-title"
    >
      <h2 id="swot-matrix-title" className="sr-only">Matriz SWOT completa</h2>
      
      {isMobile ? (
        <Accordion type="single" collapsible className="mb-8 sm:mb-10 md:mb-16">
          <AccordionItem value="matriz-swot">
            <AccordionTrigger className="text-[#560005] font-bold">
              Ver Matriz SWOT completa
            </AccordionTrigger>
            <AccordionContent>
              {renderMatrizContent()}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        renderMatrizContent()
      )}
    </div>
  );
});

export default MatrizSWOT;
