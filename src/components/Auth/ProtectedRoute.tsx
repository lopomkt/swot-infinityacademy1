
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/Auth/LoadingScreen";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, userData, subscriptionExpired } = useAuth();
  const location = useLocation();
  
  // Check if user is testing as an admin
  const modoAdminTeste = location.search.includes("modo_teste_admin=true");

  // Debug logs para acompanhar o estado
  useEffect(() => {
    console.log("[ProtectedRoute] Estado atual:", { 
      loading, 
      user: !!user, 
      userData: !!userData,
      subscriptionExpired,
      pathname: location.pathname 
    });
  }, [loading, user, userData, subscriptionExpired, location.pathname]);

  // Aguardar carregamento completo dos dados
  if (loading) {
    console.log("[ProtectedRoute] Aguardando carregamento inicial...");
    return <LoadingScreen />;
  }

  // Verificar se usuário não está autenticado
  if (!user) {
    console.log("[ProtectedRoute] Usuário não autenticado, redirecionando para /auth");
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/auth" replace />;
  }

  // Aguardar userData estar disponível (previne race condition)
  if (!userData) {
    console.log("[ProtectedRoute] Aguardando userData...");
    return <LoadingScreen />;
  }

  // Verificar se é um administrador (administradores nunca são bloqueados)
  if (userData.is_admin === true) {
    console.log("[ProtectedRoute] Usuário admin autenticado:", userData.email);
    localStorage.removeItem("subscription_expired");
    return <>{children}</>;
  }

  // Verificar se usuário está ativo
  if (!userData.ativo) {
    console.warn("[ProtectedRoute] Usuário inativo:", userData.email);
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/auth" replace />;
  }

  // Redirecionar para a tela de expiração se a assinatura estiver vencida e não for um teste de admin
  if (subscriptionExpired && !modoAdminTeste) {
    console.log("[ProtectedRoute] Subscription expired, redirecting to /expired");
    return <Navigate to="/expired" replace />;
  } else {
    localStorage.removeItem("subscription_expired");
  }

  // Se tudo estiver em ordem, renderizar o conteúdo protegido
  console.log("[ProtectedRoute] Acesso autorizado para:", userData.email);
  return <>{children}</>;
};

export default ProtectedRoute;
