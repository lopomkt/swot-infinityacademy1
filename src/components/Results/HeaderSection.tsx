
import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Building2, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface HeaderSectionProps {
  nomeEmpresa: string;
  segmento: string;
  faturamentoMensal: string;
  tempoDeMercado: string;
}

const HeaderSection = React.memo(function HeaderSection({
  nomeEmpresa,
  segmento,
  faturamentoMensal,
  tempoDeMercado,
}: HeaderSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div 
      className="mb-8 border-b pb-6 scroll-mt-20 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg"
      role="banner" 
      aria-label="Cabeçalho com informações da empresa"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.h1 
        className="text-2xl sm:text-3xl font-bold text-[#560005] mb-4 flex items-center"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Building2 className="h-8 w-8 mr-3 text-[#ef0002]" />
        {nomeEmpresa}
      </motion.h1>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
          <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Segmento</p>
            <p className="font-semibold text-gray-800">{segmento}</p>
          </div>
        </div>
        
        <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
          <DollarSign className="h-5 w-5 text-green-500 mr-2" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Faturamento</p>
            <p className="font-semibold text-gray-800">{faturamentoMensal}</p>
          </div>
        </div>
        
        <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
          <Calendar className="h-5 w-5 text-purple-500 mr-2" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Mercado</p>
            <p className="font-semibold text-gray-800">{tempoDeMercado}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default HeaderSection;
