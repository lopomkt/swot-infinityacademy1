
import React from "react";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from "@/hooks/use-mobile";
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FunilEstrategicoProps {
  gargalos: string[];
  alertasCascata: string[];
}

const FunilEstrategico = React.memo(function FunilEstrategico({ gargalos = [], alertasCascata = [] }: FunilEstrategicoProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  
  // Default data when none is available
  const gargalosData = gargalos && gargalos.length > 0 ? gargalos : ["Processos não otimizados", "Dependência de poucos clientes", "Comunicação interna limitada"];
  const alertasData = alertasCascata && alertasCascata.length > 0 ? alertasCascata : ["Problemas na captação impactam conversão", "Falta de processos compromete retenção"];
  
  const renderFunilContent = () => (
    <>
      <motion.div 
        className="bg-white p-4 sm:p-6 md:p-8 rounded-xl border-l-4 border-[#ef0002] shadow-sm mb-6 overflow-x-auto max-w-full"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 id="gargalos-title" className="font-semibold text-[#b70001] mb-2 text-sm sm:text-base">Gargalos Atuais</h3>
        <ul 
          className="list-disc pl-5 text-gray-700 space-y-1 text-sm sm:text-base"
          aria-labelledby="gargalos-title"
        >
          {gargalosData.map((item, i) => (
            <motion.li 
              key={i}
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={prefersReducedMotion ? {} : { opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 * i }}
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div 
        className="bg-white p-4 sm:p-6 md:p-8 rounded-xl border-l-4 border-[#560005] shadow-sm mb-6 overflow-x-auto max-w-full"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h3 id="alertas-title" className="font-semibold text-[#ef0002] mb-2 text-sm sm:text-base">Alertas em Efeito Cascata</h3>
        <ul 
          className="list-disc pl-5 text-gray-700 space-y-1 text-sm sm:text-base"
          aria-labelledby="alertas-title"
        >
          {alertasData.map((item, i) => (
            <motion.li 
              key={i}
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={prefersReducedMotion ? {} : { opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 * i }}
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
      
      <motion.div 
        className="bg-[#ffebeb] border border-[#ef0002] rounded-md p-4 text-red-800 flex items-start text-sm sm:text-base" 
        role="alert"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <AlertTriangle className="h-5 w-5 text-[#ef0002] mr-2 flex-shrink-0 mt-1" aria-hidden="true" />
        <p>
          <strong>Atenção:</strong> gargalos não resolvidos nessa etapa tendem a causar efeito 
          cascata e impactar toda a empresa. Inicie sua correção pela etapa mais crítica.
        </p>
      </motion.div>
    </>
  );

  return (
    <motion.div 
      className="mt-10 scroll-mt-20 mb-8 sm:mb-10 md:mb-16" 
      role="region" 
      aria-labelledby="funil-estrategico-title"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.h2 
        id="funil-estrategico-title" 
        className="text-2xl font-bold text-[#560005] mb-4"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Funil Estratégico
      </motion.h2>

      {isMobile ? (
        <Accordion type="single" collapsible>
          <AccordionItem value="funil-estrategico">
            <motion.div whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}>
              <AccordionTrigger className="text-[#560005] font-bold">
                Ver detalhes do Funil Estratégico
              </AccordionTrigger>
            </motion.div>
            <AccordionContent>
              {renderFunilContent()}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <AnimatePresence>
          {renderFunilContent()}
        </AnimatePresence>
      )}
    </motion.div>
  );
});

export default FunilEstrategico;
