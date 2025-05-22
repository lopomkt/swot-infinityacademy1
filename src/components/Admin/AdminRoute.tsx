
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/Auth/LoadingScreen";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Query to check if the user is an admin
  const { data: adminStatus, isLoading } = useQuery({
    queryKey: ['adminStatus', user?.id],
    queryFn: async () => {
      if (!user) return { isAdmin: false };
      
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return { isAdmin: false };
      }
      
      return { isAdmin: data?.is_admin || false };
    },
    enabled: !!user,
  });

  if (loading || isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Admin users can access their specific routes or client routes
  // This allows them to test the client experience while logged in as admin
  if (!adminStatus?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
