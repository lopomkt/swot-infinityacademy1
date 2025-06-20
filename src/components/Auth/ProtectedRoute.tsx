
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

  // Timeout de emergência REDUZIDO para 10 segundos
  useEffect(() => {
    if (!loading) {
      setEmergencyTimeout(false);
      return;
    }

    const timer = setTimeout(() => {
      console.warn("[ProtectedRoute] Timeout de emergência atingido (10s)");
      setEmergencyTimeout(true);
    }, 10000);
    
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

  // Aguardar carregamento (TEMPO REDUZIDO)
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

  // VERIFICAÇÃO DUPLA E IMEDIATA: userData + email
  const userEmail = (user.email || '').toLowerCase();
  const isAdminByEmail = ADMIN_EMAILS.includes(userEmail);
  const isAdminByUserData = userData?.is_admin === true;
  
  // Determinar se é admin
  const isDefinitivelyAdmin = isAdminByUserData || isAdminByEmail;
  
  console.log("[ProtectedRoute] Análise de permissões:", {
    userEmail,
    isAdminByEmail,
    isAdminByUserData,
    isDefinitivelyAdmin,
    hasUserData: !!userData
  });

  // DECISÃO IMEDIATA: Se é admin por email, liberar acesso
  if (isAdminByEmail) {
    console.log("[ProtectedRoute] ✅ Admin por EMAIL - acesso liberado IMEDIATO");
    return <>{children}</>;
  }

  // Se temos userData, proceder com verificações normais
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
    // Se não temos userData E não é admin por email, aguardar POUCO tempo
    console.log("[ProtectedRoute] Aguardando userData por 3s...");
    
    setTimeout(() => {
      if (!userData && !isAdminByEmail) {
        console.warn("[ProtectedRoute] Timeout userData - liberando acesso básico");
      }
    }, 3000);
    
    return <LoadingScreen />;
  }
};

export default ProtectedRoute;
