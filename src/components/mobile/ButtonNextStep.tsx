
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ButtonNextStepProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  isProcessing?: boolean;
}

export default function ButtonNextStep({ 
  onClick, 
  children, 
  disabled = false, 
  className = "",
  isProcessing = false 
}: ButtonNextStepProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled) return;
    
    setIsLoading(true);
    
    if (isProcessing) {
      toast.loading("Processando...", { id: 'step-processing' });
    }
    
    try {
      await onClick();
    } finally {
      setIsLoading(false);
      if (isProcessing) {
        toast.dismiss('step-processing');
      }
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`${className} ${isLoading ? 'cursor-not-allowed' : ''}`}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
