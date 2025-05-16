
import React from "react";
import { cardBase, headingBase } from "@/styles/uiClasses";

interface ScoreEstrategicoProps {
  scoreLabel: string;
  pontuacao: number;
}

export default function ScoreEstrategico({ scoreLabel, pontuacao }: ScoreEstrategicoProps) {
  return (
    <div 
      className={`${cardBase} bg-gray-50 mt-10 p-4 sm:p-6 md:p-8 scroll-mt-20 mb-8 sm:mb-10 md:mb-16`}
      role="region"
      aria-labelledby="score-strategic-title"
    >
      <h2 id="score-strategic-title" className={`${headingBase} mb-4 text-xl sm:text-2xl`}>Score Estratégico</h2>
      <p className="text-gray-700 text-base sm:text-lg">
        Seu nível de maturidade estratégica é classificado como: 
        <span className="text-primary font-bold ml-1">{scoreLabel}</span>
      </p>
      <div className="mt-4">
        <p className="text-gray-600 text-sm sm:text-base">
          Pontuação geral: <strong aria-label={`${pontuacao} de 100 pontos`}>{pontuacao}/100</strong>
        </p>
        {/* Aqui futuramente entra o gráfico radar ou circular */}
        <div aria-hidden="true" className="sr-only">
          Este score representa o nível de maturidade estratégica da sua empresa, baseado nas respostas fornecidas na análise SWOT.
        </div>
      </div>
    </div>
  );
}
