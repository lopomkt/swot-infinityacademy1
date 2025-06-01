
import ProgressTracker from "@/components/ui/ProgressTracker";

interface ProgressBarProps {
  currentStep: number;
  stepsCount: number;
}

const ProgressBar = ({ currentStep, stepsCount }: ProgressBarProps) => {
  // Define the labels for each step in the process
  const stepLabels = [
    "Boas-vindas",
    "Identificação",
    "Forças",
    "Fraquezas",
    "Oportunidades",
    "Ameaças",
    "Financeiro",
    "Prioridades",
    "Finalização",
    "Resultados"
  ];
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between overflow-hidden">
      <ProgressTracker
        currentStep={currentStep}
        totalSteps={stepLabels.length}
        labels={stepLabels}
      />
    </div>
  );
};

export default ProgressBar;
