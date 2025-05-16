
import React from "react";

interface MatrizSWOTProps {
  forcas: string[];
  fraquezas: string[];
  oportunidades: string[];
  ameacas: string[];
}

export default function MatrizSWOT({ forcas, fraquezas, oportunidades, ameacas }: MatrizSWOTProps) {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10" 
      role="region" 
      aria-labelledby="swot-matrix-title"
    >
      <h2 id="swot-matrix-title" className="sr-only">Matriz SWOT completa</h2>
      
      <div className="bg-white border-l-4 border-[#ef0002] p-4 rounded-xl shadow-sm">
        <h3 id="forcas-title" className="font-bold text-[#560005]">FORÇAS</h3>
        <ul 
          className="list-disc pl-5 mt-2 text-gray-700" 
          aria-labelledby="forcas-title"
        >
          {forcas.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
      <div className="bg-white border-l-4 border-[#b70001] p-4 rounded-xl shadow-sm">
        <h3 id="fraquezas-title" className="font-bold text-[#560005]">FRAQUEZAS</h3>
        <ul 
          className="list-disc pl-5 mt-2 text-gray-700"
          aria-labelledby="fraquezas-title"
        >
          {fraquezas.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
      <div className="bg-white border-l-4 border-[#ef0002] p-4 rounded-xl shadow-sm">
        <h3 id="oportunidades-title" className="font-bold text-[#560005]">OPORTUNIDADES</h3>
        <ul 
          className="list-disc pl-5 mt-2 text-gray-700"
          aria-labelledby="oportunidades-title"
        >
          {oportunidades.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
      <div className="bg-white border-l-4 border-[#b70001] p-4 rounded-xl shadow-sm">
        <h3 id="ameacas-title" className="font-bold text-[#560005]">AMEAÇAS</h3>
        <ul 
          className="list-disc pl-5 mt-2 text-gray-700"
          aria-labelledby="ameacas-title"
        >
          {ameacas.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
    </div>
  );
}
