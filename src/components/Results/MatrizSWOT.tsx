
import React from "react";

interface MatrizSWOTProps {
  forcas: string[];
  fraquezas: string[];
  oportunidades: string[];
  ameacas: string[];
}

export default function MatrizSWOT({ forcas, fraquezas, oportunidades, ameacas }: MatrizSWOTProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      <div className="bg-white border-l-4 border-[#ef0002] p-4 rounded-xl shadow-sm">
        <h3 className="font-bold text-[#560005]">FORÇAS</h3>
        <ul className="list-disc pl-5 mt-2 text-gray-700">
          {forcas.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
      <div className="bg-white border-l-4 border-[#b70001] p-4 rounded-xl shadow-sm">
        <h3 className="font-bold text-[#560005]">FRAQUEZAS</h3>
        <ul className="list-disc pl-5 mt-2 text-gray-700">
          {fraquezas.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
      <div className="bg-white border-l-4 border-[#ef0002] p-4 rounded-xl shadow-sm">
        <h3 className="font-bold text-[#560005]">OPORTUNIDADES</h3>
        <ul className="list-disc pl-5 mt-2 text-gray-700">
          {oportunidades.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
      <div className="bg-white border-l-4 border-[#b70001] p-4 rounded-xl shadow-sm">
        <h3 className="font-bold text-[#560005]">AMEAÇAS</h3>
        <ul className="list-disc pl-5 mt-2 text-gray-700">
          {ameacas.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
    </div>
  );
}
