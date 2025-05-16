
import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PlanosEstrategicosABCProps {
  planos: {
    planoA: string[];
    planoB: string[];
    planoC: string[];
  };
}

const PlanosEstrategicosABC = React.memo(function PlanosEstrategicosABC({ planos }: PlanosEstrategicosABCProps) {
  const prefersReducedMotion = useReducedMotion();

  const tabVariants = {
    hover: { scale: 1.04, transition: { type: 'spring', stiffness: 300 } },
    tap: { scale: 0.96 },
    initial: { scale: 1 }
  };

  return (
    <motion.div 
      className="mt-10 scroll-mt-20 mb-8 sm:mb-10 md:mb-16" 
      role="region" 
      aria-labelledby="planos-estrategicos-title"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.h2 
        id="planos-estrategicos-title" 
        className="text-2xl font-bold text-[#560005] mb-4"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Planos Estratégicos
      </motion.h2>
      
      <Tabs defaultValue="A" className="w-full">
        <TabsList 
          className="bg-[#ef0002] rounded-xl p-1 mb-4 flex gap-2 overflow-x-auto max-w-full" 
          role="tablist" 
          aria-label="Escolha entre os planos estratégicos A, B e C"
        >
          <motion.div
            variants={prefersReducedMotion ? {} : tabVariants}
            whileHover={prefersReducedMotion ? {} : "hover"}
            whileTap={prefersReducedMotion ? {} : "tap"}
            initial="initial"
          >
            <TabsTrigger 
              value="A" 
              className="text-white data-[state=active]:bg-white data-[state=active]:text-[#ef0002] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-sm sm:text-base block w-full sm:w-auto"
              role="tab"
              aria-selected="true"
              aria-controls="plano-a-content"
              id="plano-a-tab"
            >
              Plano A
            </TabsTrigger>
          </motion.div>
          
          <motion.div
            variants={prefersReducedMotion ? {} : tabVariants}
            whileHover={prefersReducedMotion ? {} : "hover"}
            whileTap={prefersReducedMotion ? {} : "tap"}
            initial="initial"
          >
            <TabsTrigger 
              value="B" 
              className="text-white data-[state=active]:bg-white data-[state=active]:text-[#ef0002] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-sm sm:text-base block w-full sm:w-auto"
              role="tab"
              aria-selected="false"
              aria-controls="plano-b-content"
              id="plano-b-tab"
            >
              Plano B
            </TabsTrigger>
          </motion.div>
          
          <motion.div
            variants={prefersReducedMotion ? {} : tabVariants}
            whileHover={prefersReducedMotion ? {} : "hover"}
            whileTap={prefersReducedMotion ? {} : "tap"}
            initial="initial"
          >
            <TabsTrigger 
              value="C" 
              className="text-white data-[state=active]:bg-white data-[state=active]:text-[#ef0002] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-sm sm:text-base block w-full sm:w-auto"
              role="tab"
              aria-selected="false"
              aria-controls="plano-c-content"
              id="plano-c-tab"
            >
              Plano C
            </TabsTrigger>
          </motion.div>
        </TabsList>

        <TabsContent value="A" id="plano-a-content" role="tabpanel" aria-labelledby="plano-a-tab">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700 text-sm sm:text-base lg:text-lg">🎯 Rota A – Estratégia ideal com investimento robusto</CardTitle>
                <CardDescription>Investimento direcionado para crescimento acelerado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-w-full">
                  <ul className="list-disc pl-6 text-gray-700 space-y-2 text-sm sm:text-base">
                    {planos.planoA.map((item, i) => (
                      <motion.li 
                        key={i}
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -5 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.05 * i }}
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="B" id="plano-b-content" role="tabpanel" aria-labelledby="plano-b-tab">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700 text-sm sm:text-base lg:text-lg">⚙️ Rota B – Estratégia viável com recursos limitados</CardTitle>
                <CardDescription>Balanceamento entre investimento e resultados de curto prazo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-w-full">
                  <ul className="list-disc pl-6 text-gray-700 space-y-2 text-sm sm:text-base">
                    {planos.planoB.map((item, i) => (
                      <motion.li 
                        key={i}
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -5 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.05 * i }}
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="C" id="plano-c-content" role="tabpanel" aria-labelledby="plano-c-tab">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-amber-700 text-sm sm:text-base lg:text-lg">💡 Rota C – Estratégia criativa com orçamento mínimo</CardTitle>
                <CardDescription>Abordagem criativa para maximizar resultados com recursos limitados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-w-full">
                  <ul className="list-disc pl-6 text-gray-700 space-y-2 text-sm sm:text-base">
                    {planos.planoC.map((item, i) => (
                      <motion.li 
                        key={i}
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -5 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.05 * i }}
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
});

export default PlanosEstrategicosABC;
