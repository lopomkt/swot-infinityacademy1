
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

  // Mostrar tela de carregamento durante a verificação
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirecionar para autenticação se não estiver logado
  if (!user) {
    // Clear any leftover data from previous sessions
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/auth" replace />;
  }

  // CRÍTICO: Bloquear se userData for null (usuário sem cadastro completo)
  if (!userData) {
    console.warn("Usuário logado mas sem dados na tabela users");
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/auth" replace />;
  }

  // Verificar se é um administrador (administradores nunca são bloqueados)
  if (userData?.is_admin === true) {
    // Limpar qualquer flag de expiração para admins
    localStorage.removeItem("subscription_expired");
    return <>{children}</>;
  }

  // Redirecionar para a tela de expiração se a assinatura estiver vencida e não for um teste de admin
  if (subscriptionExpired && !modoAdminTeste) {
    console.log("Subscription expired, redirecting to /expired");
    return <Navigate to="/expired" replace />;
  } else {
    // Se não está expirado, remover a flag de expirado se existir
    localStorage.removeItem("subscription_expired");
  }

  // Se tudo estiver em ordem, renderizar o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
