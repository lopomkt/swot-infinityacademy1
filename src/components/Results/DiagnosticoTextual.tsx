
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DiagnosticoTextualProps {
  texto: string;
}

const DiagnosticoTextual = React.memo(function DiagnosticoTextual({ texto }: DiagnosticoTextualProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  if (!texto) {
    return <p className="text-sm italic text-gray-500 p-4">Diagnóstico não disponível no momento.</p>;
  }

  const renderDiagnosticoContent = () => (
    <motion.div 
      className="text-sm sm:text-base"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-gray-800 leading-relaxed whitespace-pre-line overflow-x-auto max-w-full">{texto}</p>
    </motion.div>
  );

  return (
    <motion.div 
      className="mt-10 mb-6 scroll-mt-20"
      role="region"
      aria-labelledby="diagnostico-title"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.h2 
        id="diagnostico-title" 
        className="text-2xl font-bold text-[#560005] mb-2"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Diagnóstico Consultivo
      </motion.h2>
      
      {isMobile ? (
        <Accordion type="single" collapsible>
          <AccordionItem value="diagnostico">
            <motion.div whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}>
              <AccordionTrigger className="text-[#560005] font-bold">
                Ver diagnóstico completo
              </AccordionTrigger>
            </motion.div>
            <AccordionContent>
              {renderDiagnosticoContent()}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <AnimatePresence>
          {renderDiagnosticoContent()}
        </AnimatePresence>
      )}
    </motion.div>
  );
});

export default DiagnosticoTextual;
