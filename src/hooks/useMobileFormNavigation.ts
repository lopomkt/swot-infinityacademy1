
import { useState, useCallback } from 'react';
import { useStepValidation } from './useStepValidation';

export interface MobileFormNavigationHook {
  currentStep: number;
  nextStep: (stepData?: any) => void;
  prevStep: () => void;
  setStep: (n: number) => void;
}

export function useMobileFormNavigation(initialStep: number = 1): MobileFormNavigationHook {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const { canProceed } = useStepValidation();

  const scrollToTop = useCallback(() => {
    const formHeader = document.getElementById('form-header');
    if (formHeader) {
      formHeader.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const nextStep = useCallback((stepData?: any) => {
    if (!canProceed(currentStep, stepData)) {
      return;
    }
    
    setCurrentStep(prev => prev + 1);
    setTimeout(scrollToTop, 100);
  }, [currentStep, canProceed, scrollToTop]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    setTimeout(scrollToTop, 100);
  }, [scrollToTop]);

  const setStep = useCallback((n: number) => {
    setCurrentStep(n);
    setTimeout(scrollToTop, 100);
  }, [scrollToTop]);

  return {
    currentStep,
    nextStep,
    prevStep,
    setStep
  };
}
