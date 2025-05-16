
import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface HeaderSectionProps {
  nomeEmpresa: string;
  segmento: string;
  faturamentoMensal: string;
  tempoDeMercado: string;
}

const HeaderSection = React.memo(function HeaderSection({
  nomeEmpresa,
  segmento,
  faturamentoMensal,
  tempoDeMercado,
}: HeaderSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div 
      className="mb-6 border-b pb-4 scroll-mt-20"
      role="banner" 
      aria-label="Cabeçalho com informações da empresa"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.h1 
        className="text-2xl sm:text-3xl font-bold text-[#560005]"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {nomeEmpresa}
      </motion.h1>
      <motion.p 
        className="text-gray-700 text-sm sm:text-base overflow-x-auto max-w-full"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        Segmento: <span aria-label="Segmento da empresa"><strong>{segmento}</strong></span> • 
        Faturamento mensal: <span aria-label="Faturamento mensal"><strong>{faturamentoMensal}</strong></span> • 
        Tempo de mercado: <span aria-label="Tempo de mercado"><strong>{tempoDeMercado}</strong></span>
      </motion.p>
    </motion.div>
  );
});

export default HeaderSection;
