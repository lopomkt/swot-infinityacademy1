
import React from "react";
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface NivelMaturidadeProps {
  maturidade?: Array<{
    area: string;
    nivel: number;
    descricao: string;
  }>;
}

const NivelMaturidade = ({ maturidade }: NivelMaturidadeProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Fallback data if none is provided
  const fallbackData = [
    {
      area: "Operações",
      nivel: 6,
      descricao: "Seus processos operacionais apresentam boa estruturação, mas ainda existem oportunidades para automação e ganho de escala. Considere documentar e padronizar processos críticos."
    },
    {
      area: "Marketing",
      nivel: 4,
      descricao: "Sua presença de marca tem potencial, mas precisa de maior consistência e estratégia para atingir o público-alvo de maneira eficiente. Recomendamos definir métricas claras."
    },
    {
      area: "Vendas",
      nivel: 7,
      descricao: "Seu processo comercial possui uma base sólida com bons resultados, mas pode melhorar na previsibilidade e escalabilidade do funil de conversão."
    },
    {
      area: "Gestão",
      nivel: 5,
      descricao: "A estrutura administrativa atual atende às necessidades básicas, mas carece de indicadores avançados e sistemas para tomada de decisão estratégica."
    },
    {
      area: "Financeiro",
      nivel: 3,
      descricao: "A gestão financeira apresenta pontos de melhoria importantes, especialmente em controle de fluxo de caixa e planejamento orçamentário de médio prazo."
    }
  ];
  
  // Use provided data or fallback
  const maturityData = maturidade && maturidade.length > 0 ? maturidade : fallbackData;
  
  // Function to get color based on maturity level
  const getMaturidadeColor = (nivel: number) => {
    if (nivel >= 7) return "bg-green-100 text-green-800 border-green-300";
    if (nivel >= 4) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h2 className="text-xl font-bold mb-4 text-center text-[#560005]">Nível de Maturidade e Prontidão Estratégica</h2>
      
      <div className="space-y-4 mt-6">
        {maturityData.map((item, index) => (
          <motion.div 
            key={index}
            className={`p-3 rounded-md border ${getMaturidadeColor(item.nivel)}`}
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold">{item.area}</h3>
              <span className="text-sm font-medium px-2 py-1 rounded-full bg-white border">
                Nível {item.nivel}/10
              </span>
            </div>
            <p className="text-sm">{item.descricao}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Esta análise considera suas respostas em múltiplas áreas estratégicas do negócio.</p>
      </div>
      
      <div aria-hidden="true" className="sr-only">
        Análise de maturidade organizacional e nível de prontidão estratégica
      </div>
    </motion.div>
  );
};

export default NivelMaturidade;
