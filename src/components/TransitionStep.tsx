
import { useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface TransitionStepProps {
  title: string;
  description: string;
  onContinue: () => void;
  currentStep?: number;
  totalSteps?: number;
  fraseMotivacional?: string;
  iconeEtapa?: ReactNode;
}

export default function TransitionStep({ 
  title, 
  description, 
  onContinue,
  currentStep = 1,
  totalSteps = 8,
  fraseMotivacional,
  iconeEtapa
}: TransitionStepProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate progress based on current step and total steps
  const percentual = Math.floor((currentStep / totalSteps) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="p-6 md:p-12 bg-white rounded-xl shadow-md max-w-3xl mx-auto text-center animate-fade-in"
    >
      {iconeEtapa && (
        <div className="flex justify-center mb-4 text-4xl text-[#ef0002]">
          {iconeEtapa}
        </div>
      )}
      
      <h2 className="text-2xl font-bold text-[#560005] mb-4">{title}</h2>
      
      {fraseMotivacional && (
        <p className="mt-2 text-sm italic text-[#560005]">{fraseMotivacional}</p>
      )}
      
      <p className="text-gray-700 mb-8 font-sans leading-snug">{description}</p>
      
      {/* Progress indicator */}
      <p className="text-sm text-gray-600 italic mt-2 mb-6">
        ✅ Você está a {percentual}% de concluir sua análise SWOT.
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
