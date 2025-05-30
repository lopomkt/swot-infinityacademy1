
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t shadow-md">
      <div className="flex gap-4 w-full p-4">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full h-full text-center py-3 min-h-[56px] text-base font-medium"
          >
            ← {backLabel}
          </Button>
        )}
        {onNext && (
          <Button
            onClick={onNext}
            disabled={isNextDisabled}
            className={`w-full h-full text-center py-3 min-h-[56px] text-base font-medium ${
              isNextDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ef0002] hover:bg-[#c50000]'
            } text-white`}
          >
            {nextLabel} →
          </Button>
        )}
      </div>
    </div>
  );
}

export default MobileNavigation;
