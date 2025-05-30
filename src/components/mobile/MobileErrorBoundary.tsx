
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileErrorBoundaryProps {
  error?: string;
  onRetry?: () => void;
  className?: string;
}

export function MobileErrorBoundary({ 
  error = "Ocorreu um erro inesperado", 
  onRetry, 
  className = '' 
}: MobileErrorBoundaryProps) {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;

  return (
    <div className={`text-center p-6 ${className}`}>
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Oops! Algo deu errado
      </h3>
      <p className="text-gray-600 mb-6 text-sm">
        {error}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="min-w-[200px] min-h-[44px] bg-[#ef0002] hover:bg-[#c50000] text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar Novamente
        </Button>
      )}
    </div>
  );
}

export default MobileErrorBoundary;
