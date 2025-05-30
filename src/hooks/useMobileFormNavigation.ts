
import { useState, useCallback } from 'react';

export interface MobileFormNavigationHook {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (n: number) => void;
}

export function useMobileFormNavigation(initialStep: number = 1): MobileFormNavigationHook {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const scrollToTop = useCallback(() => {
    const formHeader = document.getElementById('form-header');
    if (formHeader) {
      formHeader.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
    setTimeout(scrollToTop, 100);
  }, [scrollToTop]);

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
