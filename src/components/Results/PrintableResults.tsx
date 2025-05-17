
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

  const handleContactTeam = () => {
    window.open('https://wa.me/5567993146148?text=Olá!%20Acabei%20de%20concluir%20o%20SWOT%20INSIGHTS%20da%20INFINITY%20e%20quero%20conversar%20com%20a%20equipe%20sobre%20o%20meu%20diagnóstico.', '_blank');
  };

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
        
        {/* Closing card with updated styling */}
        <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-xl shadow-md text-center mt-12">
          <h2 className="text-xl font-bold text-[#1f1f1f] mb-2">Seu Diagnóstico Está Pronto.</h2>
          <p className="text-sm text-gray-600 mb-4">Agora você tem um raio-X completo da sua empresa. Você pode baixar esse relatório, compartilhar ou aplicar com sua equipe.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button 
              variant="outline" 
              className="text-[#ef0002] border-[#ef0002] hover:bg-[#ef0002]/10"
              onClick={() => document.dispatchEvent(new Event('export-pdf'))}
            >
              📄 Baixar PDF
            </Button>
            <Button 
              variant="default" 
              className="bg-[#ef0002] hover:bg-[#b70001] text-white"
              onClick={handleContactTeam}
            >
              💬 Falar com a INFINITY
            </Button>
          </div>
        </div>
        
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
          {/* fase7_5_2_ui_premium_ok = true */}
        </div>
      </motion.div>
    </>
  );
});

export default PrintableResults;
