
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
    "Finalização"
  ];
  
  // Map decimal steps (transitions) to their integer counterparts
  const normalizedStep = Math.floor(currentStep);
  
  return (
    <ProgressTracker
      currentStep={normalizedStep}
      totalSteps={stepLabels.length}
      labels={stepLabels}
    />
  );
};

export default ProgressBar;
