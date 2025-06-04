
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
    mutations: {
      retry: 1,
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
                
                {/* Rotas protegidas para usuários */}
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
                
                {/* Rotas administrativas */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  } 
                />
                
                {/* Página 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Sistema de notificações global */}
              <Toaster 
                position="top-right"
                expand={true}
                richColors={true}
                closeButton={true}
              />
            </div>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
