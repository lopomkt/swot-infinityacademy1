
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";

interface PrintableResultsProps {
  children: React.ReactNode;
}

const PrintableResults = React.memo(function PrintableResults({ children }: PrintableResultsProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  return (
    <>
      {/* Skip to content link */}
      <a href="#content" className="sr-only focus:not-sr-only absolute top-0 left-0 bg-white text-[#1f1f1f] p-2 z-50">
        Pular para o conteúdo principal
      </a>
      
      <motion.div 
        className="max-w-5xl mx-auto px-8 py-12 bg-white text-[#1f1f1f] print:block font-['Inter',system-ui,sans-serif] shadow-md text-[13px] leading-relaxed" 
        role="region" 
        aria-label="Relatório completo do diagnóstico SWOT"
        id="container_resultado_pdf"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ pageBreakInside: 'avoid' }}
      >
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
        
        {/* Removed the Strategic CTA - "Está com dificuldades para executar esses planos?" section */}
        
        {/* Institutional footer */}
        <p className="text-center text-xs text-gray-400 mt-16 mb-4">
          Relatório SWOT gerado com tecnologia INFINITY ACADEMY · Todos os direitos reservados.
        </p>
        
        {/* Tag for tracking implementation */}
        <div className="hidden">
          {/* fase6_3_design_final_pdf_ok = true */}
          {/* fase7_1_ui_ux_gamificada_ok = true */}
          {/* fase7_2_consultivo_avancado_ok = true */}
          {/* fase7_3_polimento_final_ok = true */}
          {/* fase7_5_1_correcao_total_ok = true */}
        </div>
      </motion.div>
    </>
  );
});

export default PrintableResults;
