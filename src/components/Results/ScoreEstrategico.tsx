
import React from "react";
import { cardBase, headingBase } from "@/styles/uiClasses";

interface ScoreEstrategicoProps {
  scoreLabel: string;
  pontuacao: number;
}

export default function ScoreEstrategico({ scoreLabel, pontuacao }: ScoreEstrategicoProps) {
  return (
    <div className={`${cardBase} bg-gray-50 mt-10`}>
      <h2 className={`${headingBase} mb-4`}>Score Estratégico</h2>
      <p className="text-gray-700 text-lg">
        Seu nível de maturidade estratégica é classificado como: 
        <span className="text-primary font-bold ml-1">{scoreLabel}</span>
      </p>
      <div className="mt-4">
        <p className="text-gray-600">Pontuação geral: <strong>{pontuacao}/100</strong></p>
        {/* Aqui futuramente entra o gráfico radar ou circular */}
      </div>
    </div>
  );
}
