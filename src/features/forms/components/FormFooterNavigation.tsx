
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface FormFooterNavigationProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  isNextDisabled?: boolean;
  passoAtual?: number;
  totalPassos?: number;
  className?: string;
}

export function FormFooterNavigation({
  onBack,
  onNext,
  nextLabel = "Avançar",
  isNextDisabled = false,
  className = ""
}: FormFooterNavigationProps) {
  const isMobile = useIsMobile();

  // No mobile, a navegação é feita pelo MobileNavigation
  if (isMobile) {
    return null;
  }

  return (
    <div className={`flex justify-between pt-4 gap-4 flex-wrap-reverse sm:flex-nowrap ${className}`}>
      {onBack && (
        <Button type="button" variant="outline" onClick={onBack}>
          ← Voltar
        </Button>
      )}
      <Button
        type="submit"
        className="bg-[#ef0002] text-white"
        disabled={isNextDisabled}
        onClick={onNext}
      >
        {nextLabel}
      </Button>
    </div>
  );
}
