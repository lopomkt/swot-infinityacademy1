
import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Button } from "@/components/ui/button";

const StrategicCTA = React.memo(function StrategicCTA() {
  const prefersReducedMotion = useReducedMotion();
  
  const handleContactTeam = () => {
    window.open('https://wa.me/5567993146148?text=Olá!%20Acabei%20de%20concluir%20o%20SWOT%20INSIGHTS%20da%20INFINITY%20e%20quero%20conversar%20com%20a%20equipe%20sobre%20o%20meu%20diagnóstico.', '_blank');
  };
  
  return (
    <motion.div 
      className="bg-[#fff8f0] p-6 rounded-xl text-center shadow-sm mt-12 border-l-4 border-[#f39c12]"
      role="region"
      aria-labelledby="strategic-cta-title"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <p id="strategic-cta-title" className="text-sm text-gray-800 font-medium mb-2">
        💡 Está com dificuldades para executar esses planos?
      </p>
      <p className="text-xs text-gray-600 mb-4">
        A equipe da INFINITY pode te ajudar a tirar esses pontos do papel com estratégia.
      </p>
      <Button 
        className="bg-[#ef0002] hover:bg-[#b70001] text-white px-5 py-2 rounded-xl"
        onClick={handleContactTeam}
      >
        Falar com a Equipe da INFINITY
      </Button>
    </motion.div>
  );
});

export default StrategicCTA;
