
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
      
      <p className="text-gray-700 mb-8 font-sans leading-snug">{description}</p>
      
      {fraseMotivacional && (
        <p className="text-sm italic text-[#560005] mt-2 mb-6">{fraseMotivacional}</p>
      )}
      
      <Button 
        onClick={onContinue} 
        className="mt-8 px-6 py-3 text-base bg-[#ef0002] hover:bg-[#b70001] text-white rounded-xl shadow-sm transition-all duration-300"
      >
        Avançar
      </Button>
    </motion.div>
  );
}
