
import { AlertTriangle } from "lucide-react";

interface FunilEstrategicoProps {
  gargalos: string[];
  alertasCascata: string[];
}

export default function FunilEstrategico({ gargalos, alertasCascata }: FunilEstrategicoProps) {
  return (
    <div className="mt-10" role="region" aria-labelledby="funil-estrategico-title">
      <h2 id="funil-estrategico-title" className="text-2xl font-bold text-[#560005] mb-4">Funil Estratégico</h2>

      <div className="bg-white p-4 rounded-xl border-l-4 border-[#ef0002] shadow-sm mb-6">
        <h3 id="gargalos-title" className="font-semibold text-[#b70001] mb-2">Gargalos Atuais</h3>
        <ul 
          className="list-disc pl-5 text-gray-700 space-y-1"
          aria-labelledby="gargalos-title"
        >
          {gargalos.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>

      <div className="bg-white p-4 rounded-xl border-l-4 border-[#560005] shadow-sm mb-6">
        <h3 id="alertas-title" className="font-semibold text-[#ef0002] mb-2">Alertas em Efeito Cascata</h3>
        <ul 
          className="list-disc pl-5 text-gray-700 space-y-1"
          aria-labelledby="alertas-title"
        >
          {alertasCascata.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      
      {/* Alert Warning */}
      <div 
        className="bg-[#ffebeb] border border-[#ef0002] rounded-md p-4 text-red-800 flex items-start" 
        role="alert"
      >
        <AlertTriangle className="h-5 w-5 text-[#ef0002] mr-2 flex-shrink-0 mt-1" aria-hidden="true" />
        <p>
          <strong>Atenção:</strong> gargalos não resolvidos nessa etapa tendem a causar efeito 
          cascata e impactar toda a empresa. Inicie sua correção pela etapa mais crítica.
        </p>
      </div>
    </div>
  );
}
