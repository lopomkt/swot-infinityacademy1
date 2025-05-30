
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function MobileProgressIndicator({ currentStep, totalSteps, className = '' }: MobileProgressIndicatorProps) {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;

  const progress = Math.min((currentStep / (totalSteps - 1)) * 100, 100);

  return (
    <div className={`w-full bg-gray-100 h-1 relative ${className}`}>
      <div 
        className="h-1 bg-[#ef0002] transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
      <div 
        className="absolute top-0 w-5 h-5 bg-[#ef0002] rounded-full transform -translate-y-2 transition-all duration-300 ease-in-out"
        style={{ left: `calc(${progress}% - 10px)` }}
      />
      <div className="text-[10px] text-neutral-600 mt-1 text-center">
        Etapa {currentStep + 1} de {totalSteps}
      </div>
    </div>
  );
}

export default MobileProgressIndicator;
