
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import AdminRoute from "@/components/Admin/AdminRoute";
import Index from "@/pages/Index";
import AuthScreen from "@/components/Auth/AuthScreen";
import AdminPage from "@/pages/AdminPage";
import VisualizarRelatorio from "@/pages/VisualizarRelatorio";
import ExpiredSubscription from "@/pages/ExpiredSubscription";
import NotFound from "@/pages/NotFound";
import "./App.css";

// Configuração otimizada do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Reduzido de 2 para 1
      refetchOnWindowFocus: false,
      staleTime: 3 * 60 * 1000, // Reduzido para 3 minutos
    },
    mutations: {
      retry: 0, // Sem retry automático para mutations
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-white">
              <Routes>
                {/* Rota pública de autenticação */}
                <Route path="/auth" element={<AuthScreen />} />
                
                {/* Rota de assinatura expirada */}
                <Route path="/expired" element={<ExpiredSubscription />} />
                
                {/* Rotas protegidas para usuários comuns */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/relatorio" 
                  element={
                    <ProtectedRoute>
                      <VisualizarRelatorio />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Rotas administrativas protegidas */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  } 
                />
                
                {/* Página 404 - fallback para rotas inexistentes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Sistema de notificações global */}
              <Toaster 
                position="top-right"
                expand={true}
                richColors={true}
                closeButton={true}
                duration={4000}
              />
            </div>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
