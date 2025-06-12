
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/Auth/LoadingScreen";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading, userData } = useAuth();

  console.log("[AdminRoute] Estado:", { 
    loading, 
    user: !!user, 
    userData: !!userData,
    isAdmin: userData?.is_admin 
  });

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    console.log("[AdminRoute] Usuário não autenticado, redirecionando para /auth");
    return <Navigate to="/auth" replace />;
  }

  // Verificar se o usuário tem permissão de admin
  if (!userData?.is_admin) {
    console.log("[AdminRoute] Usuário não é admin, redirecionando para /");
    return <Navigate to="/" replace />;
  }

  console.log("[AdminRoute] ✅ Admin autorizado, carregando painel");
  return <>{children}</>;
};

export default AdminRoute;
