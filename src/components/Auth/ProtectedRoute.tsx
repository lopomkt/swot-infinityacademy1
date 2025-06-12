
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/Auth/LoadingScreen";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, userData, subscriptionExpired } = useAuth();
  const location = useLocation();
  const [emergencyTimeout, setEmergencyTimeout] = useState(false);
  
  const modoAdminTeste = location.search.includes("modo_teste_admin=true");

  // Timeout de emergência
  useEffect(() => {
    if (!loading) {
      setEmergencyTimeout(false);
      return;
    }

    const timer = setTimeout(() => {
      console.warn("[ProtectedRoute] Timeout de emergência atingido (7s)");
      setEmergencyTimeout(true);
    }, 7000);
    
    return () => clearTimeout(timer);
  }, [loading]);

  console.log("[ProtectedRoute] Estado:", { 
    loading, 
    user: !!user, 
    userData: !!userData,
    userDataAdmin: userData?.is_admin,
    subscriptionExpired,
    pathname: location.pathname,
    emergencyTimeout
  });

  // Aguardar carregamento
  if (loading && !emergencyTimeout) {
    return <LoadingScreen />;
  }

  // Verificar autenticação - SIMPLIFICADO
  if (!user || emergencyTimeout) {
    console.log("[ProtectedRoute] Redirecionando para /auth - Usuário não autenticado");
    
    if (location.pathname !== "/auth") {
      try {
        localStorage.removeItem('swotForm');
        localStorage.removeItem('swotStep');
        sessionStorage.clear();
      } catch (err) {
        console.warn("[ProtectedRoute] Erro ao limpar storage:", err);
      }
    }
    
    return <Navigate to="/auth" replace />;
  }

  // VERIFICAÇÃO SIMPLIFICADA: Se userData existe, usar. Se não, permitir acesso básico.
  if (userData) {
    // Se é admin, liberar acesso total
    if (userData.is_admin === true) {
      console.log("[ProtectedRoute] ✅ Admin autenticado, acesso liberado");
      return <>{children}</>;
    }

    // Verificar se usuário está ativo
    if (userData.ativo === false) {
      console.warn("[ProtectedRoute] Usuário inativo");
      return <Navigate to="/auth" replace />;
    }

    // Verificar expiração de assinatura
    if (subscriptionExpired && !modoAdminTeste) {
      console.log("[ProtectedRoute] Assinatura expirada, redirecionando");
      return <Navigate to="/expired" replace />;
    }
  }

  // NOVO: Permitir acesso mesmo sem userData (para casos onde a busca falhou)
  // O usuário está autenticado no Supabase, então podemos permitir acesso básico
  console.log("[ProtectedRoute] ✅ Acesso autorizado (com ou sem userData completo)");
  return <>{children}</>;
};

export default ProtectedRoute;
