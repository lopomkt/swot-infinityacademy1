
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/Auth/LoadingScreen";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, userData, subscriptionExpired } = useAuth();

  // Mostrar tela de carregamento durante a verificação
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirecionar para autenticação se não estiver logado
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Verificar se é um administrador (administradores nunca são bloqueados)
  if (userData?.is_admin === true) {
    // Limpar qualquer flag de expiração para admins
    localStorage.removeItem("subscription_expired");
    return <>{children}</>;
  }

  // Redirecionar para a tela de expiração se a assinatura estiver vencida
  if (subscriptionExpired) {
    // Armazenar o estado de expiração localmente para referência futura
    localStorage.setItem("subscription_expired", "true");
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
