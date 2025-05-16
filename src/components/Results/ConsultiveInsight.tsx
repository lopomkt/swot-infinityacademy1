
import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface ConsultiveInsightProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
  borderColor?: string;
}

const ConsultiveInsight = React.memo(function ConsultiveInsight({
  title,
  children,
  icon = "📌",
  borderColor = "border-[#ef0002]"
}: ConsultiveInsightProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div 
      className={`bg-white p-6 rounded-xl shadow-md mt-10 border-l-4 ${borderColor}`}
      role="region"
      aria-labelledby={`insight-${title.replace(/\s+/g, '-').toLowerCase()}`}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h3 
        id={`insight-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className="text-lg font-medium text-[#560005] mb-2"
      >
        {icon} {title}
      </h3>
      <div className="text-sm text-[#1f1f1f] leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
});

export default ConsultiveInsight;
