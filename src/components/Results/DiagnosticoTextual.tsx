
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

  // Function to highlight key phrases in the text
  const highlightKeyPhrases = (text: string) => {
    if (!text) return <p className="text-sm italic text-gray-500">Diagnóstico não disponível no momento.</p>;
    
    // List of keywords to highlight
    const keywords = [
      "crítico", "urgente", "prioritário", "essencial", "fundamental",
      "oportunidade clara", "vantagem competitiva", "diferencial", 
      "recomendação", "sugestão", "estratégia", "ação imediata",
      "potencial", "crescimento", "expansão", "consolidação"
    ];
    
    // Split text into paragraphs
    return text.split('\n').map((paragraph, idx) => {
      if (!paragraph.trim()) return null;
      
      // Check for keywords and wrap them in highlight span
      let highlightedText = paragraph;
      keywords.forEach(keyword => {
        const regex = new RegExp(`(${keyword})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<span class="font-semibold text-[#560005]">$1</span>');
      });
      
      return (
        <p 
          key={idx} 
          className="text-base text-gray-800 leading-relaxed font-sans mb-6"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
      );
    });
  };

  const renderDiagnosticoContent = () => (
    <motion.div 
      className="px-4 md:px-8"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-base overflow-x-auto max-w-full">
        {highlightKeyPhrases(texto)}
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="mt-10 mb-6 px-4 md:px-12 py-8 scroll-mt-20"
      role="region"
      aria-labelledby="diagnostico-title"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.h2 
        id="diagnostico-title" 
        className="text-2xl font-bold text-black mb-4"
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
