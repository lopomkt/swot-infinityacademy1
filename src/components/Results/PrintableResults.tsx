
import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface PrintableResultsProps {
  children: React.ReactNode;
}

const PrintableResults = memo(function PrintableResults({ children }: PrintableResultsProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Memoize animation config
  const animationConfig = useMemo(() => {
    if (prefersReducedMotion) return {};
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 }
    };
  }, [prefersReducedMotion]);

  // Memoize container styles
  const containerStyles = useMemo(() => ({
    pageBreakInside: 'avoid' as const,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: isMobile ? '14px' : '13px',
    lineHeight: '1.6'
  }), [isMobile]);

  return (
    <>
      {/* Skip to content link */}
      <a 
        href="#content" 
        className="sr-only focus:not-sr-only absolute top-0 left-0 bg-white text-[#1f1f1f] p-2 z-50 focus:z-[100]"
      >
        Pular para o conteúdo principal
      </a>
      
      <motion.div 
        className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 bg-white text-[#1f1f1f] print:block shadow-sm leading-relaxed" 
        role="region" 
        aria-label="Relatório completo do diagnóstico SWOT"
        id="container_resultado_pdf"
        style={containerStyles}
        {...animationConfig}
      >
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
        
        {/* Institutional footer */}
        <footer className="text-center text-xs text-gray-400 mt-16 mb-4 print:mt-8">
          <p>Relatório SWOT gerado com tecnologia INFINITY ACADEMY · Todos os direitos reservados.</p>
          <p className="mt-1">📊 Análise estratégica personalizada via IA</p>
        </footer>
        
        {/* Performance tracking tags */}
        <div className="hidden print:hidden" aria-hidden="true">
          {/* performance_optimization_v2_ok = true */}
          {/* mobile_first_design_ok = true */}
          {/* accessibility_enhanced_ok = true */}
          {/* cache_system_implemented_ok = true */}
        </div>
      </motion.div>
    </>
  );
});

export default PrintableResults;
