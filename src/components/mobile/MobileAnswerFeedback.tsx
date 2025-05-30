
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface MobileAnswerFeedbackProps {
  show: boolean;
}

export function MobileAnswerFeedback({ show }: MobileAnswerFeedbackProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-50 bg-green-500 rounded-full p-2 shadow-lg"
        >
          <Check className="w-6 h-6 text-white" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileAnswerFeedback;
