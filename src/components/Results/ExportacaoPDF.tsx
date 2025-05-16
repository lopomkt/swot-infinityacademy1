
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, MessageCircle } from "lucide-react";
import { buttonBase } from "@/styles/uiClasses";
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface ExportacaoPDFProps {
  onExport: () => void;
}

export default function ExportacaoPDF({ onExport }: ExportacaoPDFProps) {
  const prefersReducedMotion = useReducedMotion();
  const [gerando, setGerando] = useState(false);
  
  const buttonVariants = {
    hover: { scale: 1.04 },
    tap: { scale: 0.95 },
    initial: { scale: 1 }
  };

  const handleExport = () => {
    // Scroll to top before generating PDF
    window.scrollTo(0, 0);
    setGerando(true);
    
    setTimeout(() => {
      onExport();
      setGerando(false);
    }, 100);
  };
  
  return (
    <motion.div 
      className="mb-8 sm:mb-10 md:mb-16 min-h-[300px]" 
      role="region" 
      aria-labelledby="export-section-title"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div 
        className="text-center mb-8"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.h2 
          id="export-section-title" 
          className="text-2xl font-bold text-secondary mb-2"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: -5 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          Seu Diagnóstico Está Pronto.
        </motion.h2>
        <motion.p 
          className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          Agora você tem um raio-X completo da sua empresa. Pode baixar esse relatório, 
          compartilhar ou aplicar com sua equipe. E, se quiser ir além, fale com nossos 
          especialistas para executar esse plano com apoio total.
        </motion.p>
      </motion.div>
      
      {/* CTA Buttons */}
      <motion.div 
        className="flex flex-col md:flex-row gap-4 justify-center mb-8"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <motion.button 
          onClick={handleExport}
          disabled={gerando}
          className={`${buttonBase} bg-primary text-white hover:bg-primaryDark flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 block w-full sm:w-auto text-center py-3 px-6 text-base ${gerando ? 'opacity-70 cursor-not-allowed' : ''}`}
          aria-label="Baixar diagnóstico SWOT em formato PDF"
          variants={prefersReducedMotion ? {} : buttonVariants}
          whileHover={prefersReducedMotion ? {} : "hover"}
          whileTap={prefersReducedMotion ? {} : "tap"}
          initial="initial"
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
          {gerando ? 'Gerando PDF...' : 'Baixar Diagnóstico em PDF'}
        </motion.button>
        
        <motion.a 
          href={`https://wa.me/5567993146148?text=${encodeURIComponent("Olá! Acabei de concluir o SWOT INSIGHTS da INFINITY e quero conversar com a equipe sobre o meu diagnóstico.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonBase} bg-[#ef0002] hover:bg-[#b70001] text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 block w-full sm:w-auto text-center py-3 px-6 text-base`}
          aria-label="Conversar com a equipe da INFINITY sobre o diagnóstico via WhatsApp"
          variants={prefersReducedMotion ? {} : buttonVariants}
          whileHover={prefersReducedMotion ? {} : "hover"}
          whileTap={prefersReducedMotion ? {} : "tap"}
          initial="initial"
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
          Falar com a Equipe da INFINITY
        </motion.a>
      </motion.div>
      
      {/* Reinforcement message */}
      <motion.p 
        className="text-center text-gray-700 max-w-2xl mx-auto text-sm sm:text-base"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        Esse relatório é o primeiro passo. A execução começa agora. Estamos prontos para caminhar com você.
      </motion.p>
      
      {/* Footer watermark */}
      <motion.div 
        className="text-xs text-center text-accent mt-10" 
        aria-hidden="true"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        SWOT INSIGHTS | Infinity Academy
      </motion.div>
      
      {/* Tag for tracking microanimations implementation */}
      <div className="hidden">
        {/* ux_micro_animacoes_ok = true */}
        {/* fase6_3_design_final_pdf_ok = true */}
      </div>
    </motion.div>
  );
}
