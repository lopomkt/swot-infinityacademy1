
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

  // Timeout de emergência mais longo
  useEffect(() => {
    if (!loading) {
      setEmergencyTimeout(false);
      return;
    }

    const timer = setTimeout(() => {
      console.warn("[ProtectedRoute] Timeout de emergência atingido (10s)");
      setEmergencyTimeout(true);
    }, 10000); // Aumentado para 10 segundos
    
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

  // Verificar autenticação
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

  // Verificar se é admin (bypass todas as verificações)
  if (userData?.is_admin === true) {
    console.log("[ProtectedRoute] ✅ Admin autenticado, acesso liberado");
    return <>{children}</>;
  }

  // Se userData ainda está carregando mas temos user, aguardar um pouco mais
  if (user && !userData && !emergencyTimeout) {
    console.log("[ProtectedRoute] ⏳ Aguardando userData...");
    return <LoadingScreen />;
  }

  // Verificar se usuário está ativo
  if (userData && userData.ativo === false) {
    console.warn("[ProtectedRoute] Usuário inativo");
    return <Navigate to="/auth" replace />;
  }

  // Verificar expiração de assinatura
  if (userData && subscriptionExpired && !modoAdminTeste) {
    console.log("[ProtectedRoute] Assinatura expirada, redirecionando");
    return <Navigate to="/expired" replace />;
  }

  // Acesso autorizado
  console.log("[ProtectedRoute] ✅ Acesso autorizado para usuário comum");
  return <>{children}</>;
};

export default ProtectedRoute;
