
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface TransitionStepProps {
  title: string;
  description: string;
  onContinue: () => void;
}

export default function TransitionStep({ title, description, onContinue }: TransitionStepProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // We'll add a relative progress indicator
  // This is an estimate based on the current state
  const calculateProgress = () => {
    // Based on the title, we can roughly estimate where we are in the process
    if (title.includes("forças")) return 25;
    if (title.includes("fraquezas") || title.includes("melhoria")) return 40;
    if (title.includes("oportunidades")) return 55;
    if (title.includes("ameaças")) return 70;
    if (title.includes("saúde financeira") || title.includes("financeira")) return 85;
    if (title.includes("prioridades") || title.includes("estratégicas")) return 95;
    return 50; // Default value
  };

  const remainingProgress = 100 - calculateProgress();

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
