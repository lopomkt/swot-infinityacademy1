
import React from 'react';
import { statCardBase } from "@/styles/uiClasses";

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
      <div className={`${statCardBase} bg-primary`}>
        <h3 className="text-sm font-semibold">Tempo de Mercado</h3>
        <p className="text-xl font-bold">{tempoDeMercado}</p>
      </div>
      <div className={`${statCardBase} bg-accent`}>
        <h3 className="text-sm font-semibold">Faturamento</h3>
        <p className="text-xl font-bold">{faturamentoMensal}</p>
      </div>
      <div className={`${statCardBase} bg-secondary`}>
        <h3 className="text-sm font-semibold">Segmento</h3>
        <p className="text-xl font-bold">{segmento}</p>
      </div>
    </div>
  );
}
