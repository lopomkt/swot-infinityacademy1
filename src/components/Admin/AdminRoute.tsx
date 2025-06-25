
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/Auth/LoadingScreen";

interface AdminRouteProps {
  children: ReactNode;
}

// Lista DEFINITIVA de emails admin
const ADMIN_EMAILS = [
  'infinitymkt00@gmail.com',
  'admin@swotinsights.com',
  'admin@infinityacademy.com'
];

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading, userData } = useAuth();

  console.log("[AdminRoute] Estado:", { 
    loading, 
    hasUser: !!user, 
    hasUserData: !!userData,
    userEmail: user?.email,
    isAdminByData: userData?.is_admin 
  });

  // Aguardar carregamento inicial
  if (loading) {
    return <LoadingScreen />;
  }

  // Verificar autenticação básica
  if (!user) {
    console.log("[AdminRoute] Usuário não autenticado → /auth");
    return <Navigate to="/auth" replace />;
  }

  // VERIFICAÇÃO IMEDIATA POR EMAIL (sem esperar userData)
  const userEmail = (user.email || '').toLowerCase();
  const isAdminByEmail = ADMIN_EMAILS.includes(userEmail);
  
  if (isAdminByEmail) {
    console.log("[AdminRoute] ✅ Admin por EMAIL autorizado:", userEmail);
    return <>{children}</>;
  }

  // VERIFICAÇÃO POR USERDATA (se disponível)
  if (userData?.is_admin === true) {
    console.log("[AdminRoute] ✅ Admin por USERDATA autorizado");
    return <>{children}</>;
  }

  // Se não é admin por email E userData indica não-admin, bloquear
  if (userData && userData.is_admin === false) {
    console.log("[AdminRoute] ❌ Usuário não é admin → /");
    return <Navigate to="/" replace />;
  }

  // Se userData ainda não carregou, aguardar um pouco mais
  if (!userData) {
    console.log("[AdminRoute] Aguardando userData...");
    return <LoadingScreen />;
  }

  // Fallback: negar acesso
  console.log("[AdminRoute] ❌ Acesso negado → /");
  return <Navigate to="/" replace />;
};

export default AdminRoute;
