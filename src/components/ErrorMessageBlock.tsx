
import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ErrorMessageBlockProps {
  error: string;
  onRetry: () => void;
  isRetrying?: boolean;
  showHomeButton?: boolean;
}

const ErrorMessageBlock: React.FC<ErrorMessageBlockProps> = ({ 
  error, 
  onRetry, 
  isRetrying = false,
  showHomeButton = true
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Card className="w-full max-w-md mx-auto border-red-200 bg-red-50">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>
        <CardTitle className="text-red-700 text-lg">
          Erro ao gerar relatório
        </CardTitle>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        <p className="text-red-600 text-sm leading-relaxed">
          {error}
        </p>
        
        <p className="text-gray-600 text-sm">
          Você pode tentar novamente ou voltar ao início.
        </p>
        
        <div className="flex flex-col gap-2">
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Tentando novamente...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar novamente
              </>
            )}
          </Button>
          
          {showHomeButton && (
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full"
              disabled={isRetrying}
            >
              <Home className="mr-2 h-4 w-4" />
              Voltar ao início
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorMessageBlock;
