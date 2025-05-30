
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgressBar({ currentStep, totalSteps }: StepProgressBarProps) {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const progress = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className="fixed top-14 left-0 right-0 z-40 px-4 md:hidden">
      <div className="relative">
        {/* Base line */}
        <div className="h-2 bg-neutral-200 rounded-full">
          <div 
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Step markers */}
        <div className="flex justify-between absolute -top-2 left-0 right-0">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber <= currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div
                key={stepNumber}
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-primary text-white border-2 border-primary' 
                    : 'bg-white border-2 border-neutral-200 text-neutral-400 opacity-50'
                  }
                  ${isCurrent ? 'scale-110' : ''}
                `}
              >
                {stepNumber}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
