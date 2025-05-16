
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
  
  // Mock data for funnel visualization
  const funnelStages = [
    { name: "AQUISIÇÃO", status: "warning", width: "90%" },
    { name: "CONVERSÃO", status: "bottleneck", width: "75%" },
    { name: "ENTREGA", status: "healthy", width: "60%" },
    { name: "FIDELIZAÇÃO", status: "warning", width: "45%" }
  ];
  
  const getStatusColor = (status) => {
    switch(status) {
      case "healthy": return "bg-[#00b894]";
      case "warning": return "bg-[#f1c40f]";
      case "bottleneck": return "bg-[#d63031]";
      default: return "bg-gray-400";
    }
  };

  const renderFunilContent = () => (
    <>
      {/* Vertical Funnel Visualization */}
      <motion.div 
        className="mx-auto mb-8 max-w-md"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-3">
          {funnelStages.map((stage, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div 
                  className={`h-12 ${getStatusColor(stage.status)} rounded-lg shadow-sm`}
                  style={{ width: stage.width }}
                >
                  <div className="flex items-center justify-center h-full text-white font-semibold">
                    {stage.name}
                  </div>
                </div>
              </div>
              {stage.status === "bottleneck" && (
                <div className="flex items-center justify-center text-xs text-[#d63031]">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span>Gargalo crítico detectado</span>
                </div>
              )}
              {stage.status === "warning" && (
                <div className="flex items-center justify-center text-xs text-[#f1c40f]">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span>Área de atenção</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Color legend */}
        <div className="flex items-center justify-center gap-4 text-xs mt-4 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-[#00b894] rounded"></div>
            <span>Saudável</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-[#f1c40f] rounded"></div>
            <span>Atenção</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-[#d63031] rounded"></div>
            <span>Gargalo</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white p-4 sm:p-6 md:p-8 rounded-xl border-l-4 border-[#d63031] shadow-sm mb-6 overflow-x-auto max-w-full"
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
        <h3 id="alertas-title" className="font-semibold text-[#b70001] mb-2 text-sm sm:text-base">Alertas em Efeito Cascata</h3>
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
          <strong>Atenção:</strong> Risco de efeito cascata se estas áreas não forem tratadas. Gargalos não resolvidos tendem a comprometer toda a operação.
        </p>
      </motion.div>
    </>
  );

  return (
    <motion.div 
      className="px-4 md:px-12 py-12 mt-10 scroll-mt-20 mb-8 sm:mb-10 md:mb-16" 
      role="region" 
      aria-labelledby="funil-estrategico-title"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.h2 
        id="funil-estrategico-title" 
        className="text-2xl font-bold text-[#000] border-b pb-2 mb-6"
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
