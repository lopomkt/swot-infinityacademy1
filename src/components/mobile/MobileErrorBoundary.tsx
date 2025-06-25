
import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface MobileErrorBoundaryProps {
  error?: string;
  onRetry?: () => void;
  className?: string;
  showHomeButton?: boolean;
}

export function MobileErrorBoundary({ 
  error = "Ocorreu um erro inesperado", 
  onRetry, 
  className = '',
  showHomeButton = true
}: MobileErrorBoundaryProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  if (!isMobile) return null;

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={`text-center p-6 bg-white rounded-lg border border-red-200 ${className}`}>
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Oops! Algo deu errado
      </h3>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        {error}
      </p>
      <div className="flex flex-col gap-3">
        {onRetry && (
          <Button
            onClick={onRetry}
            className="min-w-full min-h-[44px] bg-[#ef0002] hover:bg-[#c50000] text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        )}
        {showHomeButton && (
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="min-w-full min-h-[44px]"
          >
            <Home className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
        )}
      </div>
    </div>
  );
}

export default MobileErrorBoundary;
