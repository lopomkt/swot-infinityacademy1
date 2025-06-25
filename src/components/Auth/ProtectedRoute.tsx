
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/Auth/LoadingScreen";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Lista DEFINITIVA de emails admin
const ADMIN_EMAILS = [
  'infinitymkt00@gmail.com',
  'admin@swotinsights.com',
  'admin@infinityacademy.com'
];

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, userData, subscriptionExpired } = useAuth();
  const location = useLocation();
  const [emergencyTimeout, setEmergencyTimeout] = useState(false);
  
  const modoAdminTeste = location.search.includes("modo_teste_admin=true");

  // Timeout de emergência AUMENTADO para 15 segundos
  useEffect(() => {
    if (!loading) {
      setEmergencyTimeout(false);
      return;
    }

    const timer = setTimeout(() => {
      console.warn("[ProtectedRoute] Timeout de emergência atingido (15s)");
      setEmergencyTimeout(true);
    }, 15000); // Aumentado de 10s para 15s
    
    return () => clearTimeout(timer);
  }, [loading]);

  console.log("[ProtectedRoute] Estado:", { 
    loading, 
    hasUser: !!user, 
    hasUserData: !!userData,
    subscriptionExpired,
    pathname: location.pathname,
    emergencyTimeout,
    userEmail: user?.email
  });

  // Aguardar carregamento (com timeout estendido)
  if (loading && !emergencyTimeout) {
    return <LoadingScreen />;
  }

  // Verificar autenticação
  if (!user || emergencyTimeout) {
    console.log("[ProtectedRoute] Redirecionando para /auth - Usuário não autenticado");
    
    // Limpar dados apenas se não estiver na página de auth
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

  // VERIFICAÇÃO IMEDIATA POR EMAIL para admins
  const userEmail = (user.email || '').toLowerCase();
  const isAdminByEmail = ADMIN_EMAILS.includes(userEmail);
  
  if (isAdminByEmail) {
    console.log("[ProtectedRoute] ✅ Admin por EMAIL - acesso liberado");
    return <>{children}</>;
  }

  // Se temos userData, proceder com verificações
  if (userData) {
    // Verificar se usuário está ativo
    if (userData.ativo === false) {
      console.warn("[ProtectedRoute] Usuário inativo");
      return <Navigate to="/auth" replace />;
    }

    // Se é admin por userData, liberar
    if (userData.is_admin === true) {
      console.log("[ProtectedRoute] ✅ Admin por USERDATA - acesso liberado");
      return <>{children}</>;
    }

    // Para usuários não-admin, verificar expiração
    if (subscriptionExpired && !modoAdminTeste) {
      console.log("[ProtectedRoute] Assinatura expirada, redirecionando");
      return <Navigate to="/expired" replace />;
    }
    
    // Usuário padrão autorizado
    console.log("[ProtectedRoute] ✅ Usuário padrão autorizado");
    return <>{children}</>;
    
  } else {
    // Se não temos userData E não é admin por email, aguardar mais tempo
    console.log("[ProtectedRoute] Aguardando userData...");
    return <LoadingScreen />;
  }
};

export default ProtectedRoute;
