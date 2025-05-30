
import React from 'react';
import { Button } from '@/components/ui/button';

interface MobileNavigationProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isNextDisabled?: boolean;
}

export function MobileNavigation({
  onNext,
  onBack,
  nextLabel = "Avançar",
  backLabel = "Voltar",
  isNextDisabled = false
}: MobileNavigationProps) {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl p-4">
      <div className="flex gap-4 w-full">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            ← {backLabel}
          </Button>
        )}
        {onNext && (
          <Button
            onClick={onNext}
            disabled={isNextDisabled}
            className={`flex-1 ${isNextDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ef0002] hover:bg-[#c50000]'} text-white`}
          >
            {nextLabel} →
          </Button>
        )}
      </div>
    </div>
  );
}

export default MobileNavigation;
