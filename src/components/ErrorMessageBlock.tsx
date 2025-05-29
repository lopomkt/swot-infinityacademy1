
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ErrorMessageBlockProps {
  error: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

const ErrorMessageBlock: React.FC<ErrorMessageBlockProps> = ({ 
  error, 
  onRetry, 
  isRetrying = false 
}) => {
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
          Deseja tentar novamente?
        </p>
        
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
            "Tentar novamente"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorMessageBlock;
