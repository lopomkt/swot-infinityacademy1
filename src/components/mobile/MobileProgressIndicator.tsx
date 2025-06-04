import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export default function MobileProgressIndicator({ currentStep, totalSteps }: MobileProgressIndicatorProps) {
  const progressPercentage = Math.round(((currentStep + 1) / totalSteps) * 100);
  
  return (
    <div className="w-full px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Etapa {currentStep + 1} de {totalSteps}
        </span>
        <span className="text-sm font-bold text-[#ef0002]">
          {progressPercentage}%
        </span>
      </div>
      
      {/* Barra de progresso melhorada */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#ef0002] to-[#b70001] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Indicator de etapas */}
        <div className="flex justify-between mt-2">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  isCompleted 
                    ? 'bg-[#ef0002]' 
                    : isCurrent 
                    ? 'bg-[#ef0002] ring-2 ring-[#ef0002] ring-opacity-30' 
                    : 'bg-gray-300'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
