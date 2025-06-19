
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/Auth/LoadingScreen";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Lista DEFINITIVA de emails admin para verificação alternativa
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

  // Timeout de emergência aumentado para 20 segundos
  useEffect(() => {
    if (!loading) {
      setEmergencyTimeout(false);
      return;
    }

    const timer = setTimeout(() => {
      console.warn("[ProtectedRoute] Timeout de emergência atingido (20s)");
      setEmergencyTimeout(true);
    }, 20000); // Aumentado para 20 segundos
    
    return () => clearTimeout(timer);
  }, [loading]);

  console.log("[ProtectedRoute] Estado:", { 
    loading, 
    user: !!user, 
    userData: !!userData,
    userDataAdmin: userData?.is_admin,
    subscriptionExpired,
    pathname: location.pathname,
    emergencyTimeout,
    userEmail: user?.email
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

  // VERIFICAÇÃO DUPLA: userData + email alternativo para garantir identificação correta
  const userEmail = (user.email || '').toLowerCase();
  const isAdminByEmail = ADMIN_EMAILS.includes(userEmail);
  const isAdminByUserData = userData?.is_admin === true;
  
  // Determinar se é admin por qualquer um dos métodos
  const isDefinitivelyAdmin = isAdminByUserData || isAdminByEmail;
  
  console.log("[ProtectedRoute] Análise de permissões:", {
    userEmail,
    isAdminByEmail,
    isAdminByUserData,
    isDefinitivelyAdmin,
    hasUserData: !!userData
  });

  // Se temos userData OU podemos determinar admin via email, proceder
  if (userData || isAdminByEmail) {
    // Verificar se usuário está ativo (apenas se temos userData)
    if (userData && userData.ativo === false) {
      console.warn("[ProtectedRoute] Usuário inativo");
      return <Navigate to="/auth" replace />;
    }

    // Se é admin, liberar acesso total
    if (isDefinitivelyAdmin) {
      console.log("[ProtectedRoute] ✅ Admin CONFIRMADO, acesso liberado");
      return <>{children}</>;
    }

    // Para usuários não-admin, verificar expiração de assinatura
    if (subscriptionExpired && !modoAdminTeste) {
      console.log("[ProtectedRoute] Assinatura expirada, redirecionando");
      return <Navigate to="/expired" replace />;
    }
    
    // Usuário padrão com acesso válido
    console.log("[ProtectedRoute] ✅ Usuário padrão autorizado");
    return <>{children}</>;
    
  } else {
    // Se não temos userData e não é admin por email, aguardar mais um pouco
    console.log("[ProtectedRoute] Aguardando userData...");
    return <LoadingScreen />;
  }
};

export default ProtectedRoute;
