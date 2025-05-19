
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthScreen from "./components/Auth/AuthScreen";
import ExpiredSubscription from "./pages/ExpiredSubscription";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminRoute from "./components/Admin/AdminRoute";
import HistoricoRelatorios from "./components/Relatorios/HistoricoRelatorios";
import ResultsPage from "./pages/ResultsPage";
import AdminPage from "./pages/AdminPage";
import VisualizarRelatorio from "./pages/VisualizarRelatorio";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route path="/auth" element={<AuthScreen />} />
            <Route path="/expired" element={<ExpiredSubscription />} />
            <Route 
              path="/historico" 
              element={
                <ProtectedRoute>
                  <HistoricoRelatorios />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resultados" 
              element={
                <ProtectedRoute>
                  <ResultsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/visualizar" 
              element={
                <ProtectedRoute>
                  <VisualizarRelatorio />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
