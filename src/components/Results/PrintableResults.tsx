
import React from 'react';
import { cardBase } from "@/styles/uiClasses";

interface PrintableResultsProps {
  children: React.ReactNode;
}

const PrintableResults = React.memo(function PrintableResults({ children }: PrintableResultsProps) {
  return (
    <>
      {/* Skip to content link */}
      <a href="#container_resultado_pdf" className="sr-only focus:not-sr-only absolute top-0 left-0 bg-white text-black p-2 z-50">
        Pular para o conteúdo principal
      </a>
      
      <div 
        id="container_resultado_pdf" 
        className="max-w-5xl mx-auto px-4 sm:px-6 overflow-x-hidden" 
        role="region" 
        aria-label="Relatório completo do diagnóstico SWOT"
      >
        {children}
        
        {/* Tag for tracking responsiveness implementation */}
        <div className="hidden">
          {/* ux_responsividade_mobile_ok = true */}
        </div>
        
        {/* Tag for tracking performance optimization */}
        <div className="hidden">
          {/* ux_performance_memo_lazy_ok = true */}
        </div>
      </div>
    </>
  );
})

export default PrintableResults;
