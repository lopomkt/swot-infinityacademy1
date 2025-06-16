
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

  // Timeout de emergência aumentado para 15 segundos
  useEffect(() => {
    if (!loading) {
      setEmergencyTimeout(false);
      return;
    }

    const timer = setTimeout(() => {
      console.warn("[ProtectedRoute] Timeout de emergência atingido (15s)");
      setEmergencyTimeout(true);
    }, 15000); // Aumentado para 15 segundos
    
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

  // Verificação DEFINITIVA com userData
  if (userData) {
    // Se temos userData, usar dados completos para verificação
    console.log("[ProtectedRoute] Verificando permissões com userData:", {
      email: userData.email,
      is_admin: userData.is_admin,
      ativo: userData.ativo
    });

    if (userData.is_admin === true) {
      console.log("[ProtectedRoute] ✅ Admin CONFIRMADO, acesso liberado");
      return <>{children}</>;
    }

    // Verificar se usuário está ativo
    if (userData.ativo === false) {
      console.warn("[ProtectedRoute] Usuário inativo");
      return <Navigate to="/auth" replace />;
    }

    // Verificar expiração de assinatura para usuários não-admin
    if (subscriptionExpired && !modoAdminTeste) {
      console.log("[ProtectedRoute] Assinatura expirada, redirecionando");
      return <Navigate to="/expired" replace />;
    }
  } else {
    // Se não temos userData ainda, aguardar um pouco mais
    console.log("[ProtectedRoute] Aguardando userData...");
    return <LoadingScreen />;
  }

  // Permitir acesso: usuário está autenticado e verificado
  console.log("[ProtectedRoute] ✅ Acesso autorizado");
  return <>{children}</>;
};

export default ProtectedRoute;
