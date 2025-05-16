
import React from "react";
import { motion } from 'framer-motion';
import { cardBase, headingBase } from "@/styles/uiClasses";
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface ScoreEstrategicoProps {
  scoreLabel: string;
  pontuacao: number;
}

const ScoreEstrategico = React.memo(function ScoreEstrategico({ scoreLabel, pontuacao }: ScoreEstrategicoProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div 
      className={`${cardBase} bg-gray-50 mt-10 p-4 sm:p-6 md:p-8 scroll-mt-20 mb-8 sm:mb-10 md:mb-16`}
      role="region"
      aria-labelledby="score-strategic-title"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.h2 
        id="score-strategic-title" 
        className={`${headingBase} mb-4 text-xl sm:text-2xl`}
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Score Estratégico
      </motion.h2>
      <motion.p 
        className="text-gray-700 text-base sm:text-lg"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        Seu nível de maturidade estratégica é classificado como: 
        <span className="text-primary font-bold ml-1">{scoreLabel}</span>
      </motion.p>
      <motion.div 
        className="mt-4"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <p className="text-gray-600 text-sm sm:text-base">
          Pontuação geral: <strong aria-label={`${pontuacao} de 100 pontos`}>{pontuacao}/100</strong>
        </p>
        <div aria-hidden="true" className="sr-only">
          Este score representa o nível de maturidade estratégica da sua empresa, baseado nas respostas fornecidas na análise SWOT.
        </div>
      </motion.div>
    </motion.div>
  );
});

export default ScoreEstrategico;
