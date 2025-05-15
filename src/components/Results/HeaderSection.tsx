
import React from 'react';

interface HeaderSectionProps {
  nomeEmpresa: string;
  segmento: string;
  faturamentoMensal: string;
  tempoDeMercado: string;
}

export default function HeaderSection({
  nomeEmpresa,
  segmento,
  faturamentoMensal,
  tempoDeMercado,
}: HeaderSectionProps) {
  return (
    <div className="mb-6 border-b pb-4">
      <h1 className="text-3xl font-bold text-[#560005]">{nomeEmpresa}</h1>
      <p className="text-gray-700">
        Segmento: <strong>{segmento}</strong> • Faturamento mensal: <strong>{faturamentoMensal}</strong> • Tempo de mercado: <strong>{tempoDeMercado}</strong>
      </p>
    </div>
  );
}
