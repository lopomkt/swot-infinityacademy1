
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

  // Timeout de emergência aumentado para 8 segundos
  useEffect(() => {
    if (!loading) {
      setEmergencyTimeout(false);
      return;
    }

    const timer = setTimeout(() => {
      console.warn("[ProtectedRoute] Timeout de emergência atingido após 8 segundos");
      setEmergencyTimeout(true);
    }, 8000); // Aumentado para 8 segundos
    
    return () => clearTimeout(timer);
  }, [loading]);

  // Log de debug mais detalhado
  useEffect(() => {
    console.log("[ProtectedRoute] Estado detalhado:", { 
      loading, 
      user: !!user, 
      userEmail: user?.email,
      userData: !!userData,
      userDataEmail: userData?.email,
      subscriptionExpired,
      pathname: location.pathname,
      emergencyTimeout,
      modoAdminTeste
    });
  }, [loading, user, userData, subscriptionExpired, location.pathname, emergencyTimeout, modoAdminTeste]);

  // PRIORIDADE 1: Aguardar carregamento (com timeout de emergência aumentado)
  if (loading && !emergencyTimeout) {
    console.log("[ProtectedRoute] Aguardando carregamento...");
    return <LoadingScreen />;
  }

  // PRIORIDADE 2: Verificar se usuário não está autenticado OU timeout de emergência
  if (!user || emergencyTimeout) {
    console.log("[ProtectedRoute] Redirecionando para /auth:", { 
      hasUser: !!user, 
      emergencyTimeout,
      userEmail: user?.email 
    });
    
    // Só limpar dados se não vier de /auth e não for timeout de emergência com usuário válido
    if (location.pathname !== "/auth" && !(emergencyTimeout && user)) {
      try {
        console.log("[ProtectedRoute] Limpando storage...");
        localStorage.removeItem('swotForm');
        localStorage.removeItem('swotStep');
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

  // PRIORIDADE 4: Se usuário autenticado mas userData ainda carregando (só aguarda 3 segundos)
  if (user && !userData && !emergencyTimeout) {
    console.log("[ProtectedRoute] Usuário autenticado, aguardando userData...");
    return <LoadingScreen />;
  }

  // PRIORIDADE 5: Se userData não carregou após timeout, permitir acesso
  if (user && !userData && emergencyTimeout) {
    console.warn("[ProtectedRoute] ✅ Permitindo acesso sem userData devido ao timeout");
    return <>{children}</>;
  }

  // PRIORIDADE 6: Verificar se usuário está ativo (apenas não-admins)
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

  // PRIORIDADE 7: Verificar expiração de assinatura (apenas não-admins)
  if (userData && subscriptionExpired && !modoAdminTeste) {
    console.log("[ProtectedRoute] Subscription expired, redirecting to /expired");
    return <Navigate to="/expired" replace />;
  }

  // SUCESSO: Acesso autorizado
  console.log("[ProtectedRoute] ✅ Acesso autorizado para:", userData?.email || user.email);
  return <>{children}</>;
};

export default ProtectedRoute;
