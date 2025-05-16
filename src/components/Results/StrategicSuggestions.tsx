
import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface Suggestion {
  title: string;
  description: string;
  borderColor: string; 
  textColor: string;
}

interface StrategicSuggestionsProps {
  suggestions: Suggestion[];
}

const StrategicSuggestions = React.memo(function StrategicSuggestions({ suggestions }: StrategicSuggestionsProps) {
  const prefersReducedMotion = useReducedMotion();

  // Fallback for empty suggestions
  const displaySuggestions = suggestions.length > 0 ? suggestions : [
    {
      title: "Melhorar Fluxo de Caixa",
      description: "Avalie reduzir despesas fixas e aumentar ticket médio por cliente ativo.",
      borderColor: "border-[#00b894]",
      textColor: "text-[#00b894]"
    },
    {
      title: "Risco com concorrência",
      description: "Identifique diferenciais que possam te proteger de novos entrantes no seu nicho.",
      borderColor: "border-[#d63031]",
      textColor: "text-[#d63031]"
    }
  ];
  
  return (
    <motion.div 
      className="mt-12"
      role="region"
      aria-labelledby="strategic-suggestions-title"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h2 
        id="strategic-suggestions-title" 
        className="text-2xl font-bold text-[#000] border-b pb-2 mb-6"
      >
        🔍 Sugestões Estratégicas Imediatas
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displaySuggestions.map((suggestion, index) => (
          <motion.div 
            key={index}
            className={`bg-white p-4 shadow-sm rounded-xl border-l-4 ${suggestion.borderColor}`}
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -5 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.05 * index }}
          >
            <h5 className={`text-sm font-semibold ${suggestion.textColor} mb-1`}>
              {suggestion.title}
            </h5>
            <p className="text-xs text-gray-700">
              {suggestion.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

export default StrategicSuggestions;
