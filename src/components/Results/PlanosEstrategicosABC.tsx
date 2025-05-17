
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

  // Fallback for empty plans
  const planoA = planos.planoA?.length > 0 ? planos.planoA : ["Sem dados nesta seção"];
  const planoB = planos.planoB?.length > 0 ? planos.planoB : ["Sem dados nesta seção"];
  const planoC = planos.planoC?.length > 0 ? planos.planoC : ["Sem dados nesta seção"];

  const tabVariants = {
    hover: { scale: 1.04, transition: { type: 'spring', stiffness: 300 } },
    tap: { scale: 0.96 },
    initial: { scale: 1 }
  };

  return (
    <motion.div 
      className="px-4 md:px-12 py-12 mt-10 scroll-mt-20 mb-8 sm:mb-10 md:mb-16" 
      role="region" 
      aria-labelledby="planos-estrategicos-title"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.h2 
        id="planos-estrategicos-title" 
        className="text-2xl font-bold text-[#560005] border-b pb-2 mb-6 text-center"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Planos Estratégicos
      </motion.h2>
      
      <Tabs defaultValue="A" className="w-full">
        <TabsList 
          className="bg-[#efefef] rounded-full p-1 mb-4 flex gap-2 overflow-x-auto max-w-full" 
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
              className="text-[#1f1f1f] data-[state=active]:bg-[#ef0002] data-[state=active]:text-white hover:bg-[#dfdfdf] focus:outline-none focus:ring-2 focus:ring-[#ef0002] focus:ring-offset-2 text-sm sm:text-base block w-full sm:w-auto rounded-full data-[state=active]:border-b-2 data-[state=active]:border-[#ef0002]"
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
              className="text-[#1f1f1f] data-[state=active]:bg-[#ef0002] data-[state=active]:text-white hover:bg-[#dfdfdf] focus:outline-none focus:ring-2 focus:ring-[#ef0002] focus:ring-offset-2 text-sm sm:text-base block w-full sm:w-auto rounded-full data-[state=active]:border-b-2 data-[state=active]:border-[#ef0002]"
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
              className="text-[#1f1f1f] data-[state=active]:bg-[#ef0002] data-[state=active]:text-white hover:bg-[#dfdfdf] focus:outline-none focus:ring-2 focus:ring-[#ef0002] focus:ring-offset-2 text-sm sm:text-base block w-full sm:w-auto rounded-full data-[state=active]:border-b-2 data-[state=active]:border-[#ef0002]"
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
            <Card className="bg-white rounded-xl shadow-sm border-l-4 border-[#00b894]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">📌</span>
                  <CardTitle className="text-[#00b894] text-sm sm:text-base lg:text-lg">Rota A – Estratégia ideal com investimento robusto</CardTitle>
                </div>
                <CardDescription>Investimento direcionado para crescimento acelerado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-w-full">
                  {planoA.length > 0 ? (
                    <ul className="space-y-2 text-sm sm:text-base">
                      {planoA.map((item, i) => (
                        <motion.li 
                          key={i}
                          initial={prefersReducedMotion ? {} : { opacity: 0, x: -5 }}
                          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.05 * i }}
                          className="flex gap-2 items-start text-sm text-[#1f1f1f]"
                        >
                          <span className="text-[#ef0002] text-lg mt-[2px]">✔</span> 
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm italic text-gray-500">Sem dados para o Plano A.</p>
                  )}
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
            <Card className="bg-white rounded-xl shadow-sm border-l-4 border-[#f39c12]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">🧩</span>
                  <CardTitle className="text-[#f39c12] text-sm sm:text-base lg:text-lg">Rota B – Estratégia viável com recursos limitados</CardTitle>
                </div>
                <CardDescription>Balanceamento entre investimento e resultados de curto prazo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-w-full">
                  {planoB.length > 0 ? (
                    <ul className="space-y-2 text-sm sm:text-base">
                      {planoB.map((item, i) => (
                        <motion.li 
                          key={i}
                          initial={prefersReducedMotion ? {} : { opacity: 0, x: -5 }}
                          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.05 * i }}
                          className="flex gap-2 items-start text-sm text-[#1f1f1f]"
                        >
                          <span className="text-[#ef0002] text-lg mt-[2px]">✔</span> 
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm italic text-gray-500">Sem dados para o Plano B.</p>
                  )}
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
            <Card className="bg-white rounded-xl shadow-sm border-l-4 border-[#d63031]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">🛠️</span>
                  <CardTitle className="text-[#d63031] text-sm sm:text-base lg:text-lg">Rota C – Estratégia criativa com orçamento mínimo</CardTitle>
                </div>
                <CardDescription>Abordagem criativa para maximizar resultados com recursos limitados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-w-full">
                  {planoC.length > 0 ? (
                    <ul className="space-y-2 text-sm sm:text-base">
                      {planoC.map((item, i) => (
                        <motion.li 
                          key={i}
                          initial={prefersReducedMotion ? {} : { opacity: 0, x: -5 }}
                          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.05 * i }}
                          className="flex gap-2 items-start text-sm text-[#1f1f1f]"
                        >
                          <span className="text-[#ef0002] text-lg mt-[2px]">✔</span> 
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm italic text-gray-500">Sem dados para o Plano C.</p>
                  )}
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
