
import React from 'react';
import { motion } from 'framer-motion';
import { statCardBase } from "@/styles/uiClasses";
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface QuickDataCardsProps {
  tempoDeMercado: string;
  faturamentoMensal: string;
  segmento: string;
}

export default function QuickDataCards({
  tempoDeMercado,
  faturamentoMensal,
  segmento,
}: QuickDataCardsProps) {
  const prefersReducedMotion = useReducedMotion();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4"
      role="region"
      aria-label="Informações rápidas sobre a empresa"
      initial={prefersReducedMotion ? {} : "hidden"}
      animate={prefersReducedMotion ? {} : "visible"}
      transition={{ staggerChildren: 0.1 }}
    >
      <motion.div 
        className={`${statCardBase} bg-primary min-h-[120px] sm:min-h-[150px]`}
        role="group"
        aria-labelledby="tempo-mercado-label"
        variants={prefersReducedMotion ? {} : cardVariants}
        transition={{ duration: 0.3 }}
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      >
        <h3 id="tempo-mercado-label" className="text-sm font-semibold">Tempo de Mercado</h3>
        <p className="text-xl font-bold">{tempoDeMercado}</p>
      </motion.div>
      <motion.div 
        className={`${statCardBase} bg-accent min-h-[120px] sm:min-h-[150px]`}
        role="group"
        aria-labelledby="faturamento-label"
        variants={prefersReducedMotion ? {} : cardVariants}
        transition={{ duration: 0.3 }}
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      >
        <h3 id="faturamento-label" className="text-sm font-semibold">Faturamento</h3>
        <p className="text-xl font-bold">{faturamentoMensal}</p>
      </motion.div>
      <motion.div 
        className={`${statCardBase} bg-secondary min-h-[120px] sm:min-h-[150px]`}
        role="group"
        aria-labelledby="segmento-label"
        variants={prefersReducedMotion ? {} : cardVariants}
        transition={{ duration: 0.3 }}
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      >
        <h3 id="segmento-label" className="text-sm font-semibold">Segmento</h3>
        <p className="text-xl font-bold">{segmento}</p>
      </motion.div>
    </motion.div>
  );
}
