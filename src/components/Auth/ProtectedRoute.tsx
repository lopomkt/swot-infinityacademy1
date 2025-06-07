
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
  const [timeoutReached, setTimeoutReached] = useState(false);
  
  // Check if user is testing as an admin
  const modoAdminTeste = location.search.includes("modo_teste_admin=true");

  // Timeout de segurança para evitar loading infinito
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.warn("[ProtectedRoute] Timeout de carregamento atingido - forçando navegação");
        setTimeoutReached(true);
      }, 10000); // 10 segundos - tempo mais generoso
      
      return () => clearTimeout(timer);
    } else {
      setTimeoutReached(false);
    }
  }, [loading]);

  // Debug logs simplificados
  useEffect(() => {
    console.log("[ProtectedRoute] Estado atual:", { 
      loading, 
      user: !!user, 
      userData: !!userData,
      subscriptionExpired,
      pathname: location.pathname,
      timeoutReached,
      userEmail: user?.email || 'N/A',
      userActive: userData?.ativo || 'N/A',
      isAdmin: userData?.is_admin || false
    });
  }, [loading, user, userData, subscriptionExpired, location.pathname, timeoutReached]);

  // PRIORIDADE 1: Aguardar carregamento (com timeout de segurança)
  if (loading && !timeoutReached) {
    console.log("[ProtectedRoute] Aguardando carregamento...");
    return <LoadingScreen />;
  }

  // PRIORIDADE 2: Verificar se usuário não está autenticado
  if (!user || timeoutReached) {
    console.log("[ProtectedRoute] Usuário não autenticado ou timeout, redirecionando para /auth");
    
    // Limpar dados apenas se não vier de /auth (evitar loops)
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
    localStorage.removeItem("subscription_expired");
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
  } else {
    localStorage.removeItem("subscription_expired");
  }

  // SUCESSO: Acesso autorizado
  console.log("[ProtectedRoute] ✅ Acesso autorizado para:", userData?.email || user.email);
  return <>{children}</>;
};

export default ProtectedRoute;
