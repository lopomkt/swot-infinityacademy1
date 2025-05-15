
import React from "react";

interface ScoreEstrategicoProps {
  scoreLabel: string;
  pontuacao: number;
}

export default function ScoreEstrategico({ scoreLabel, pontuacao }: ScoreEstrategicoProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow-sm mt-10">
      <h2 className="text-2xl font-bold text-[#560005] mb-4">Score Estratégico</h2>
      <p className="text-gray-700 text-lg">
        Seu nível de maturidade estratégica é classificado como: 
        <span className="text-[#ef0002] font-bold ml-1">{scoreLabel}</span>
      </p>
      <div className="mt-4">
        <p className="text-gray-600">Pontuação geral: <strong>{pontuacao}/100</strong></p>
        {/* Aqui futuramente entra o gráfico radar ou circular */}
      </div>
    </div>
  );
}
