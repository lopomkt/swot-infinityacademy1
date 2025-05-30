
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileProgressIndicator from "@/components/mobile/MobileProgressIndicator";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function ProgressTracker({ currentStep, totalSteps, labels }: ProgressTrackerProps) {
  const isMobile = useIsMobile();
  
  // Calculate overall percentage for visual feedback
  const progressPercentage = Math.floor((currentStep / (totalSteps - 1)) * 100);
  
  if (isMobile) {
    return <MobileProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />;
  }
  
  return (
    <div className="w-full px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="relative mb-1">
        <div className="h-1 bg-gray-200 rounded-full">
          <div 
            className="h-1 bg-[#b70001] rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="overflow-x-hidden max-w-full">
        <div className="flex flex-nowrap justify-between gap-x-4 w-full max-w-5xl mx-auto mt-6">
          {labels.map((label, index) => {
            // Determine if this step is completed, current, or future
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isFuture = index > currentStep;
            
            return (
              <div 
                key={index} 
                className={`flex flex-col items-center ${isFuture ? 'opacity-70' : ''}`}
              >
                <div className="relative">
                  <div
                    className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-xs sm:text-sm font-bold 
                      ${isCompleted ? 'bg-[#b70001] text-white' : isCurrent ? 'border-2 border-[#b70001] text-[#b70001]' : 'bg-gray-200 text-gray-600'} 
                      transition-all duration-300`}
                  >
                    {isCompleted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  {isCompleted && (
                    <span className="absolute -top-2 right-0 text-green-600 text-xs">✓</span>
                  )}
                </div>
                <span className="mt-1 hidden sm:block text-xs sm:text-sm text-gray-600">Etapa {index + 1}</span>
                <span className="mt-1 block sm:hidden text-xs text-gray-600">{index + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProgressTracker;
