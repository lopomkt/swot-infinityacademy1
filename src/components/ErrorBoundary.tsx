
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Componente Error Boundary melhorado
 * Captura erros JavaScript em qualquer lugar da árvore de componentes
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 Error Boundary capturou um erro:", error);
    console.error("📍 Stack trace:", errorInfo.componentStack);
    
    // Log adicional para debug
    this.setState({ 
      hasError: true, 
      error, 
      errorInfo 
    });

    // Aqui poderia integrar com serviço de monitoramento como Sentry
    // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Interface customizada de erro se fornecida
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Interface padrão de erro
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="max-w-lg w-full border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Ops! Algo deu errado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada 
                e está trabalhando para resolver o problema.
              </p>

              {/* Detalhes técnicos em desenvolvimento */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-gray-100 p-3 rounded text-xs">
                  <summary className="cursor-pointer font-medium">
                    Detalhes técnicos (desenvolvimento)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap break-words">
                    {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={this.handleReload}
                  className="bg-[#ef0002] hover:bg-[#b70001]"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Recarregar Página
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Ir para Início
                </Button>
              </div>

              <p className="text-sm text-gray-500">
                Se o problema persistir, entre em contato com o suporte.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
