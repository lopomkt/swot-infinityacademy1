
import React from 'react';

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      <div className="bg-[#ef0002] text-white rounded-2xl p-4 text-center shadow-md">
        <h3 className="text-sm font-semibold">Tempo de Mercado</h3>
        <p className="text-xl font-bold">{tempoDeMercado}</p>
      </div>
      <div className="bg-[#b70001] text-white rounded-2xl p-4 text-center shadow-md">
        <h3 className="text-sm font-semibold">Faturamento</h3>
        <p className="text-xl font-bold">{faturamentoMensal}</p>
      </div>
      <div className="bg-[#560005] text-white rounded-2xl p-4 text-center shadow-md">
        <h3 className="text-sm font-semibold">Segmento</h3>
        <p className="text-xl font-bold">{segmento}</p>
      </div>
    </div>
  );
}
