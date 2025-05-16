
import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from "@/hooks/use-mobile";
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
      className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 md:gap-6 overflow-x-auto max-w-full"
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
        className="bg-white border-l-4 border-[#ef0002] p-4 sm:p-6 md:p-8 rounded-xl shadow-sm"
        variants={prefersReducedMotion ? {} : {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
        }}
      >
        <h3 id="forcas-title" className="font-bold text-[#560005] text-sm sm:text-base">FORÇAS</h3>
        <ul 
          className="list-disc pl-5 mt-2 text-gray-700 text-sm sm:text-base" 
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
        className="bg-white border-l-4 border-[#b70001] p-4 sm:p-6 md:p-8 rounded-xl shadow-sm"
        variants={prefersReducedMotion ? {} : {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.05 } }
        }}
      >
        <h3 id="fraquezas-title" className="font-bold text-[#560005] text-sm sm:text-base">FRAQUEZAS</h3>
        <ul 
          className="list-disc pl-5 mt-2 text-gray-700 text-sm sm:text-base"
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
        className="bg-white border-l-4 border-[#ef0002] p-4 sm:p-6 md:p-8 rounded-xl shadow-sm"
        variants={prefersReducedMotion ? {} : {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } }
        }}
      >
        <h3 id="oportunidades-title" className="font-bold text-[#560005] text-sm sm:text-base">OPORTUNIDADES</h3>
        <ul 
          className="list-disc pl-5 mt-2 text-gray-700 text-sm sm:text-base"
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
        className="bg-white border-l-4 border-[#b70001] p-4 sm:p-6 md:p-8 rounded-xl shadow-sm"
        variants={prefersReducedMotion ? {} : {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.15 } }
        }}
      >
        <h3 id="ameacas-title" className="font-bold text-[#560005] text-sm sm:text-base">AMEAÇAS</h3>
        <ul 
          className="list-disc pl-5 mt-2 text-gray-700 text-sm sm:text-base"
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
      className="scroll-mt-20" 
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
              <AccordionTrigger className="text-[#560005] font-bold">
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
