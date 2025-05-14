
interface ProgressBarProps {
  currentStep: number;
  stepsCount: number;
}
const ProgressBar = ({ currentStep, stepsCount }: ProgressBarProps) => {
  // Progresso: step 0 = 0%, step 1 = 50% (só futuramente 7 steps → 14,28% cada)
  const percent =
    stepsCount <= 1 ? 100 : Math.floor((currentStep / (stepsCount - 1)) * 100);

  return (
    <div className="w-full sticky top-0 left-0 z-30 bg-white h-3">
      <div className="w-full h-1 rounded bg-gray-200 relative overflow-hidden">
        <div
          className="h-1 bg-[#ef0002] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1 text-gray-500 select-none px-1 font-medium tracking-wide">
        <span className={currentStep === 0 ? "text-[#ef0002]" : ""}>1. Boas-vindas</span>
        <span className={currentStep === 1 ? "text-[#ef0002]" : ""}>2. Identificação</span>
        {/* futuras etapas numeradas */}
      </div>
    </div>
  );
};

export default ProgressBar;
