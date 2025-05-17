
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
        
        {/* Strategic CTA */}
        <div className="bg-[#fff8f0] p-6 md:p-8 lg:p-10 rounded-xl text-center shadow-sm mt-12 border-l-4 border-[#f39c12]">
          <p className="text-sm text-[#1f1f1f] font-medium mb-2">💡 Está com dificuldades para executar esses planos?</p>
          <p className="text-xs text-[#1f1f1f] mb-4">A equipe da INFINITY pode te ajudar a tirar esses pontos do papel com estratégia.</p>
          <Button 
            className="bg-[#ef0002] hover:bg-[#b70001] text-white px-5 py-2 rounded-xl"
            onClick={handleContactTeam}
          >
            Falar com a Equipe da INFINITY
          </Button>
        </div>
        
        {/* Congrats message */}
        <div className="bg-white text-[#560005] text-center py-6 px-4 rounded-xl shadow-sm mt-10">
          <p className="text-lg font-semibold mb-2">🎉 Parabéns por concluir sua Análise SWOT Premium!</p>
          <p className="text-sm">Sua jornada de transformação empresarial começa agora. Conte com a INFINITY para os próximos passos.</p>
        </div>
        
        {/* Removed the "Iniciar nova análise" button entirely */}
        
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
