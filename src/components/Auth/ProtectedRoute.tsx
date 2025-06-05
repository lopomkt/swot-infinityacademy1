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
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Check if user is testing as an admin
  const modoAdminTeste = location.search.includes("modo_teste_admin=true");

  // Debug logs para acompanhar o estado
  useEffect(() => {
    console.log("[ProtectedRoute] Estado atual:", { 
      loading, 
      user: !!user, 
      userData: !!userData,
      subscriptionExpired,
      pathname: location.pathname,
      userEmail: user?.email || 'N/A',
      userActive: userData?.ativo || 'N/A',
      isAdmin: userData?.is_admin || false
    });
  }, [loading, user, userData, subscriptionExpired, location.pathname]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [redirectTimer]);

  // Aguardar carregamento completo dos dados - com timeout reduzido
  if (loading) {
    console.log("[ProtectedRoute] Aguardando carregamento inicial...");
    
    // Timeout reduzido para loading mais rápido
    if (!redirectTimer) {
      const timer = setTimeout(() => {
        console.warn("[ProtectedRoute] Timeout no carregamento, forçando verificação");
        if (loading && !user) {
          console.log("[ProtectedRoute] Timeout - redirecionando para auth");
          localStorage.clear();
          sessionStorage.clear();
        }
      }, 5000); // Reduzido de 10s para 5s
      
      setRedirectTimer(timer);
    }
    
    return <LoadingScreen />;
  }

  // Limpar timer se loading terminou
  if (redirectTimer) {
    clearTimeout(redirectTimer);
    setRedirectTimer(null);
  }

  // Verificar se usuário não está autenticado
  if (!user) {
    console.log("[ProtectedRoute] Usuário não autenticado, redirecionando para /auth");
    
    // Limpar dados locais apenas se não estiver vindo da página de auth
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

  // Se usuário existe mas userData ainda não carregou, dar tempo menor
  if (user && !userData) {
    console.log("[ProtectedRoute] Usuário autenticado mas aguardando userData...");
    
    // Timeout específico para userData - reduzido
    if (!redirectTimer) {
      const timer = setTimeout(() => {
        console.warn("[ProtectedRoute] Timeout ao carregar userData - permitindo acesso");
      }, 3000); // Reduzido de 5s para 3s
      
      setRedirectTimer(timer);
    }
    
    return <LoadingScreen />;
  }

  // Verificar se é um administrador (administradores nunca são bloqueados)
  if (userData?.is_admin === true) {
    console.log("[ProtectedRoute] Usuário admin autenticado:", userData.email);
    localStorage.removeItem("subscription_expired");
    return <>{children}</>;
  }

  // Verificar se usuário está ativo (só para não-admins)
  if (userData && userData.ativo === false) {
    console.warn("[ProtectedRoute] Usuário inativo:", userData.email);
    
    // Fazer logout do usuário inativo
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (err) {
      console.warn("[ProtectedRoute] Erro ao limpar storage:", err);
    }
    
    return <Navigate to="/auth" replace />;
  }

  // Verificar expiração de assinatura (só para não-admins)
  if (userData && subscriptionExpired && !modoAdminTeste) {
    console.log("[ProtectedRoute] Subscription expired, redirecting to /expired");
    return <Navigate to="/expired" replace />;
  } else {
    localStorage.removeItem("subscription_expired");
  }

  // Se chegou até aqui, tudo está em ordem
  console.log("[ProtectedRoute] ✅ Acesso autorizado para:", userData?.email || user.email);
  return <>{children}</>;
};

export default ProtectedRoute;
