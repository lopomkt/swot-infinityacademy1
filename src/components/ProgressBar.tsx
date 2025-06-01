
import ProgressTracker from "@/components/ui/ProgressTracker";

interface ProgressBarProps {
  currentStep: number;
  stepsCount: number;
}

// Define the visible steps in the journey (excludes Results step)
const VISIBLE_STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// Updated step labels to reflect the real journey without transitions
const stepLabels = [
  "Boas-vindas",      // 0
  "Identificação",    // 1
  "Forças",          // 2
  "Fraquezas",       // 3
  "Oportunidades",   // 4
  "Ameaças",         // 5
  "Financeiro",      // 6
  "Prioridades",     // 7
  "Finalização"      // 8
];

// Pure function to get the correct progress index
const getProgressIndex = (currentStep: number): number => {
  return VISIBLE_STEPS.indexOf(currentStep);
};

const ProgressBar = ({ currentStep, stepsCount }: ProgressBarProps) => {
  // Only show progress bar for visible steps
  if (!VISIBLE_STEPS.includes(currentStep)) {
    return null;
  }

  const progressIndex = getProgressIndex(currentStep);
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between overflow-hidden">
      <ProgressTracker
        currentStep={progressIndex}
        totalSteps={stepLabels.length}
        labels={stepLabels}
      />
    </div>
  );
};

export default ProgressBar;
