
import React from 'react';

interface DiagnosticoTextualProps {
  texto: string;
}

export default function DiagnosticoTextual({ texto }: DiagnosticoTextualProps) {
  return (
    <div className="mt-10 mb-6">
      <h2 className="text-2xl font-bold text-[#560005] mb-2">Diagnóstico Consultivo</h2>
      <p className="text-gray-800 leading-relaxed whitespace-pre-line">{texto}</p>
    </div>
  );
}
