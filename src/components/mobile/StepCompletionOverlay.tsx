
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepCompletionOverlayProps {
  show: boolean;
  onComplete?: () => void;
}

export function StepCompletionOverlay({ show, onComplete }: StepCompletionOverlayProps) {
  React.useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-60 bg-white/80 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="bg-green-500 rounded-full p-4 shadow-xl"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StepCompletionOverlay;
