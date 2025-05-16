
import React from "react";
import { motion } from 'framer-motion';
import { cardBase, headingBase } from "@/styles/uiClasses";
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Badge } from "@/components/ui/badge";

interface ScoreEstrategicoProps {
  scoreLabel: string;
  pontuacao: number;
}

const ScoreEstrategico = React.memo(function ScoreEstrategico({ scoreLabel, pontuacao }: ScoreEstrategicoProps) {
  const prefersReducedMotion = useReducedMotion();
  
  // Determine badge color based on score
  const getBadgeColor = () => {
    if (pontuacao >= 70) return "bg-green-100 text-green-800 border-green-200";
    if (pontuacao >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };
  
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
        className={`${headingBase} mb-4 text-xl sm:text-2xl font-bold text-black border-b pb-2`}
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Score Estratégico
      </motion.h2>
      
      <motion.div
        className="mb-4"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-gray-700 font-semibold">Nível Estratégico:</span>
          <Badge variant="outline" className={`font-medium ${getBadgeColor()}`}>
            {scoreLabel || "Sem classificação"}
          </Badge>
        </div>
      </motion.div>
      
      <motion.div 
        className="mt-4"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="mb-1 flex items-center justify-between">
          <p className="text-gray-700 text-sm sm:text-base">
            Pontuação geral: <strong aria-label={`${pontuacao} de 100 pontos`}>{pontuacao}/100</strong>
          </p>
          <span className="text-xs text-gray-500">100</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-[#ef0002] h-2.5 rounded-full" 
            style={{ width: `${pontuacao}%` }}
            role="progressbar"
            aria-valuenow={pontuacao}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          Empresas com pontuação acima de 70 estão prontas para escalar crescimento com consistência.
        </p>
      </motion.div>
      
      {/* Maturity level indicator */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-1">Nível de Maturidade Estratégica:</p>
        <span className="text-xl font-bold text-[#ef0002]">{scoreLabel || "Não Avaliado"}</span>
      </div>
      
      <div aria-hidden="true" className="sr-only">
        Este score representa o nível de maturidade estratégica da sua empresa, baseado nas respostas fornecidas na análise SWOT.
      </div>
    </motion.div>
  );
});

export default ScoreEstrategico;
