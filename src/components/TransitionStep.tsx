
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface TransitionStepProps {
  title: string;
  description: string;
  onContinue: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export default function TransitionStep({ 
  title, 
  description, 
  onContinue,
  currentStep = 1,
  totalSteps = 8
}: TransitionStepProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate progress based on current step and total steps
  const percentComplete = Math.floor((currentStep / totalSteps) * 100);
  const remainingProgress = 100 - percentComplete;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-white rounded-xl shadow-md max-w-3xl mx-auto text-center animate-fade-in"
    >
      <h2 className="text-2xl font-bold text-[#560005] mb-4">{title}</h2>
      <p className="text-gray-700 mb-8">{description}</p>
      
      {/* Progress indicator */}
      <p className="text-sm text-gray-600 italic mt-2 mb-6">
        🏁 Você está a {remainingProgress}% de concluir sua análise SWOT.
      </p>
      
      <Button 
        onClick={onContinue} 
        className="bg-[#ef0002] text-white px-6 py-3 rounded hover:bg-[#b70001] transition"
      >
        Continuar
      </Button>
    </motion.div>
  );
}
