
import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from "@/hooks/use-mobile";
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, TrendingDown, Lightbulb, AlertTriangle } from "lucide-react";

interface MatrizSWOTProps {
  forcas: string[];
  fraquezas: string[];
  oportunidades: string[];
  ameacas: string[];
}

const MatrizSWOT = React.memo(function MatrizSWOT({ forcas, fraquezas, oportunidades, ameacas }: MatrizSWOTProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  
  const renderMatrizContent = () => (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-x-auto max-w-full"
      initial={prefersReducedMotion ? {} : "hidden"}
      animate={prefersReducedMotion ? {} : "visible"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >      
      <motion.div 
        className="bg-white border-2 border-[#ef0002] p-6 md:p-8 lg:p-10 rounded-xl shadow-sm"
        variants={prefersReducedMotion ? {} : {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
        }}
      >
        <div className="flex items-center justify-center mb-2">
          <Star className="h-5 w-5 text-[#b70001] mr-2" />
          <h3 id="forcas-title" className="font-semibold text-[#b70001] text-lg text-center">FORÇAS</h3>
        </div>
        <ul 
          className="list-disc pl-5 text-[#1f1f1f] text-sm sm:text-base" 
          aria-labelledby="forcas-title"
        >
          {forcas.map((item, idx) => (
            <motion.li 
              key={idx}
              variants={prefersReducedMotion ? {} : {
                hidden: { opacity: 0, x: -5 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.05 * idx } }
              }}
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
      <motion.div 
        className="bg-white border-2 border-[#ef0002] p-6 md:p-8 lg:p-10 rounded-xl shadow-sm"
        variants={prefersReducedMotion ? {} : {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.05 } }
        }}
      >
        <div className="flex items-center justify-center mb-2">
          <TrendingDown className="h-5 w-5 text-[#b70001] mr-2" />
          <h3 id="fraquezas-title" className="font-semibold text-[#b70001] text-lg text-center">FRAQUEZAS</h3>
        </div>
        <ul 
          className="list-disc pl-5 text-[#1f1f1f] text-sm sm:text-base"
          aria-labelledby="fraquezas-title"
        >
          {fraquezas.map((item, idx) => (
            <motion.li 
              key={idx}
              variants={prefersReducedMotion ? {} : {
                hidden: { opacity: 0, x: -5 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.05 * idx } }
              }}
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
      <motion.div 
        className="bg-white border-2 border-[#ef0002] p-6 md:p-8 lg:p-10 rounded-xl shadow-sm"
        variants={prefersReducedMotion ? {} : {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } }
        }}
      >
        <div className="flex items-center justify-center mb-2">
          <Lightbulb className="h-5 w-5 text-[#b70001] mr-2" />
          <h3 id="oportunidades-title" className="font-semibold text-[#b70001] text-lg text-center">OPORTUNIDADES</h3>
        </div>
        <ul 
          className="list-disc pl-5 text-[#1f1f1f] text-sm sm:text-base"
          aria-labelledby="oportunidades-title"
        >
          {oportunidades.map((item, idx) => (
            <motion.li 
              key={idx}
              variants={prefersReducedMotion ? {} : {
                hidden: { opacity: 0, x: -5 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.05 * idx } }
              }}
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
      <motion.div 
        className="bg-white border-2 border-[#ef0002] p-6 md:p-8 lg:p-10 rounded-xl shadow-sm"
        variants={prefersReducedMotion ? {} : {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.15 } }
        }}
      >
        <div className="flex items-center justify-center mb-2">
          <AlertTriangle className="h-5 w-5 text-[#b70001] mr-2" />
          <h3 id="ameacas-title" className="font-semibold text-[#b70001] text-lg text-center">AMEAÇAS</h3>
        </div>
        <ul 
          className="list-disc pl-5 text-[#1f1f1f] text-sm sm:text-base"
          aria-labelledby="ameacas-title"
        >
          {ameacas.map((item, idx) => (
            <motion.li 
              key={idx}
              variants={prefersReducedMotion ? {} : {
                hidden: { opacity: 0, x: -5 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.05 * idx } }
              }}
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div 
      className="px-4 md:px-12 py-12 scroll-mt-20" 
      role="region" 
      aria-labelledby="swot-matrix-title"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h2 id="swot-matrix-title" className="sr-only">Matriz SWOT completa</h2>
      
      {isMobile ? (
        <Accordion type="single" collapsible className="mb-8 sm:mb-10 md:mb-16">
          <AccordionItem value="matriz-swot">
            <motion.div whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}>
              <AccordionTrigger className="text-[#560005] font-medium">
                Ver Matriz SWOT completa
              </AccordionTrigger>
            </motion.div>
            <AccordionContent>
              {renderMatrizContent()}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        renderMatrizContent()
      )}
    </motion.div>
  );
});

export default MatrizSWOT;
