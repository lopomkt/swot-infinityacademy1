
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
  
  // Check if user is testing as an admin
  const modoAdminTeste = location.search.includes("modo_teste_admin=true");

  // Timeout de emergência reduzido
  useEffect(() => {
    if (!loading) {
      setEmergencyTimeout(false);
      return;
    }

    const timer = setTimeout(() => {
      console.warn("[ProtectedRoute] Timeout de emergência atingido");
      setEmergencyTimeout(true);
    }, 3000); // Reduzido para 3 segundos
    
    return () => clearTimeout(timer);
  }, [loading]);

  // Log de debug simplificado
  useEffect(() => {
    console.log("[ProtectedRoute] Estado:", { 
      loading, 
      user: !!user, 
      userData: !!userData,
      subscriptionExpired,
      pathname: location.pathname,
      emergencyTimeout
    });
  }, [loading, user, userData, subscriptionExpired, location.pathname, emergencyTimeout]);

  // PRIORIDADE 1: Aguardar carregamento (com timeout de emergência)
  if (loading && !emergencyTimeout) {
    console.log("[ProtectedRoute] Aguardando carregamento...");
    return <LoadingScreen />;
  }

  // PRIORIDADE 2: Verificar se usuário não está autenticado ou timeout de emergência
  if (!user || emergencyTimeout) {
    console.log("[ProtectedRoute] Usuário não autenticado ou timeout de emergência");
    
    // Limpar dados apenas se não vier de /auth
    if (location.pathname !== "/auth") {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (err) {
        console.warn("[ProtectedRoute] Erro ao limpar storage:", err);
      }
    }
    
    return <Navigate to="/auth" replace />;
  }

  // PRIORIDADE 3: Verificar se é administrador (bypass todas as verificações)
  if (userData?.is_admin === true) {
    console.log("[ProtectedRoute] ✅ Usuário admin autenticado:", userData.email);
    return <>{children}</>;
  }

  // PRIORIDADE 4: Se usuário autenticado mas userData ainda carregando
  if (user && !userData) {
    console.log("[ProtectedRoute] Usuário autenticado, aguardando userData...");
    return <LoadingScreen />;
  }

  // PRIORIDADE 5: Verificar se usuário está ativo (apenas não-admins)
  if (userData && userData.ativo === false) {
    console.warn("[ProtectedRoute] Usuário inativo:", userData.email);
    
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (err) {
      console.warn("[ProtectedRoute] Erro ao limpar storage:", err);
    }
    
    return <Navigate to="/auth" replace />;
  }

  // PRIORIDADE 6: Verificar expiração de assinatura (apenas não-admins)
  if (userData && subscriptionExpired && !modoAdminTeste) {
    console.log("[ProtectedRoute] Subscription expired, redirecting to /expired");
    return <Navigate to="/expired" replace />;
  }

  // SUCESSO: Acesso autorizado
  console.log("[ProtectedRoute] ✅ Acesso autorizado para:", userData?.email || user.email);
  return <>{children}</>;
};

export default ProtectedRoute;
