
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
      <Button 
        onClick={onContinue} 
        className="bg-[#ef0002] text-white px-6 py-3 rounded hover:bg-[#b70001] transition"
      >
        Continuar
      </Button>
    </motion.div>
  );
}
