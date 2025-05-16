
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface PrintableResultsProps {
  children: React.ReactNode;
}

const PrintableResults = React.memo(function PrintableResults({ children }: PrintableResultsProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {/* Skip to content link */}
      <a href="#container_resultado_pdf" className="sr-only focus:not-sr-only absolute top-0 left-0 bg-white text-black p-2 z-50">
        Pular para o conteúdo principal
      </a>
      
      <motion.div 
        id="container_resultado_pdf" 
        className="max-w-5xl mx-auto px-8 py-12 bg-white text-black print:block font-sans" 
        role="region" 
        aria-label="Relatório completo do diagnóstico SWOT"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
        
        {/* Final Call to Action Button (centered) */}
        <div className="flex justify-center mt-16 mb-8">
          <button 
            className="mt-10 bg-[#ef0002] hover:bg-[#b70001] text-white px-6 py-3 rounded-xl text-lg shadow-lg"
            onClick={() => window.open('https://wa.me/5567993146148?text=Olá!%20Acabei%20de%20concluir%20o%20SWOT%20INSIGHTS%20da%20INFINITY%20e%20quero%20conversar%20com%20a%20equipe%20sobre%20o%20meu%20diagnóstico.', '_blank')}
          >
            Falar com a Equipe da INFINITY
          </button>
        </div>
        
        {/* Tag for tracking implementation */}
        <div className="hidden">
          {/* fase6_3_design_final_pdf_ok = true */}
        </div>
      </motion.div>
    </>
  );
});

export default PrintableResults;
