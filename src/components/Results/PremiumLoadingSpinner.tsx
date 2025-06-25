
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { BrainIcon, TrendingUp } from 'lucide-react';

interface PremiumLoadingSpinnerProps {
  message?: string;
  stage?: string;
}

const PremiumLoadingSpinner = memo(function PremiumLoadingSpinner({ 
  message = "Processando análise...",
  stage = "Inicializando"
}: PremiumLoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <motion.div
        className="relative mb-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#ef0002] rounded-full"></div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <BrainIcon className="w-6 h-6 text-[#ef0002]" />
        </motion.div>
      </motion.div>
      
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {message}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {stage}
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>INFINITY ACADEMY - SWOT INSIGHTS</span>
        </div>
      </motion.div>
      
      <motion.div
        className="mt-6 w-48 h-1 bg-gray-200 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-[#ef0002] to-[#ff6666] rounded-full"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
});

export default PremiumLoadingSpinner;
