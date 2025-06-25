
import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { LightbulbIcon, CheckCircle2 } from 'lucide-react';
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
      <Card className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-[#00b894] p-6 md:p-8 lg:p-10 text-[#1f1f1f]">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-[#00b894] p-3 rounded-full">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 id="conclusao-final-title" className="text-2xl md:text-3xl font-bold text-[#560005] mb-6">
            🎉 Análise SWOT Concluída com Sucesso
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <LightbulbIcon className="h-6 w-6 text-[#00b894] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Diagnóstico Inteligente</h3>
              <p className="text-sm text-gray-600">
                Sua empresa foi analisada por IA avançada, identificando pontos críticos e oportunidades estratégicas.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">Planos Acionáveis</h3>
              <p className="text-sm text-gray-600">
                Receba 3 rotas estratégicas (A/B/C) adaptadas à sua realidade financeira e operacional.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">📋 O que você recebeu:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                Matriz SWOT completa e personalizada
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                Diagnóstico consultivo detalhado
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                Score de maturidade estratégica
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                3 planos de ação estratégicos (A/B/C)
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            Use estes resultados para tomar <strong>decisões inteligentes</strong> sobre seu negócio. 
            Este relatório foi elaborado para oferecer insights práticos e acionáveis.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>💡 Dica:</strong> Para dúvidas ou assistência na implementação das estratégias, 
              entre em contato com nossa equipe especializada através do WhatsApp.
            </p>
          </div>
        </div>
        
        {/* Hidden tag for refactoring tracking */}
        <div className="hidden">
          {/* refatoracao_encerramento_ok = true */}
        </div>
      </Card>
    </motion.div>
  );
});

export default ConclusaoFinal;
