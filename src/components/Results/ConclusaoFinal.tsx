
import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { LightbulbIcon } from 'lucide-react';
import { Card } from "@/components/ui/card";

const ConclusaoFinal = React.memo(function ConclusaoFinal() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div 
      className="mt-12 mb-16 px-4 md:px-12"
      role="region"
      aria-labelledby="conclusao-final-title"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="max-w-3xl mx-auto bg-white border-l-4 border-[#00b894] p-6 md:p-8 lg:p-10 text-[#1f1f1f] flex flex-col items-center text-center">
        <div className="bg-[#e3fff5] p-3 rounded-full mb-4">
          <LightbulbIcon className="h-6 w-6 text-[#00b894]" />
        </div>
        <h2 id="conclusao-final-title" className="text-xl md:text-2xl font-bold text-[#560005] mb-4">
          Seu diagnóstico está pronto
        </h2>
        <p className="text-gray-700 mb-6">
          Use estes resultados para tomar decisões inteligentes sobre seu negócio. 
          Este relatório foi elaborado para oferecer insights práticos e acionáveis.
        </p>
        <p className="text-sm text-gray-500">
          Para dúvidas ou assistência na implementação das estratégias, 
          entre em contato com nossa equipe especializada.
        </p>
        
        {/* Hidden tag for refactoring tracking */}
        <div className="hidden">
          {/* refatoracao_encerramento_ok = true */}
        </div>
      </Card>
    </motion.div>
  );
});

export default ConclusaoFinal;
