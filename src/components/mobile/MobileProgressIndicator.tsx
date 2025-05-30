
import React from 'react';
import { motion } from 'framer-motion';

interface MobileProgressIndicatorProps {
  progress: number;
  className?: string;
}

export function MobileProgressIndicator({ progress, className = '' }: MobileProgressIndicatorProps) {
  return (
    <div className={`sm:hidden fixed top-0 w-full h-1 bg-gray-100 z-50 ${className}`}>
      <motion.div
        className="h-1 bg-[#ef0002]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
}

export default MobileProgressIndicator;
