
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
    <div 
      className="mb-6 border-b pb-4"
      role="banner" 
      aria-label="Cabeçalho com informações da empresa"
    >
      <h1 className="text-3xl font-bold text-[#560005]">{nomeEmpresa}</h1>
      <p className="text-gray-700">
        Segmento: <span aria-label="Segmento da empresa"><strong>{segmento}</strong></span> • 
        Faturamento mensal: <span aria-label="Faturamento mensal"><strong>{faturamentoMensal}</strong></span> • 
        Tempo de mercado: <span aria-label="Tempo de mercado"><strong>{tempoDeMercado}</strong></span>
      </p>
    </div>
  );
}
