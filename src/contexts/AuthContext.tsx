
import React, { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/useAuthState';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{success: boolean; message: string}>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<{success: boolean; message: string}>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider de autenticação usando hook customizado
 * Remove side-effects e navegação direta do contexto
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authState = useAuthState();

  const contextValue: AuthContextType = {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    isAuthenticated: authState.isAuthenticated,
    signIn: authState.signIn,
    signOut: authState.signOut,
    refreshToken: authState.refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para usar o contexto de autenticação
 * @returns Contexto de autenticação com tipagem rigorosa
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};
