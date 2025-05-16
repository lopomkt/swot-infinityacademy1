
import React from 'react';
import { cardBase } from "@/styles/uiClasses";

interface PrintableResultsProps {
  children: React.ReactNode;
}

export default function PrintableResults({ children }: PrintableResultsProps) {
  return (
    <>
      {/* Skip to content link */}
      <a href="#container_resultado_pdf" className="sr-only focus:not-sr-only absolute top-0 left-0 bg-white text-black p-2 z-50">
        Pular para o conteúdo principal
      </a>
      
      <div 
        id="container_resultado_pdf" 
        className="max-w-5xl mx-auto" 
        role="region" 
        aria-label="Relatório completo do diagnóstico SWOT"
      >
        {children}
      </div>
    </>
  );
}
