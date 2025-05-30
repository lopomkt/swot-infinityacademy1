
import { useEffect } from 'react';

interface AutoScrollToTopProps {
  currentStep: number;
}

export default function AutoScrollToTop({ currentStep }: AutoScrollToTopProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  return null;
}
