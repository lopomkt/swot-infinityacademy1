
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '@/services/auth.service';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
      refreshSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(),
        })),
      })),
    })),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signIn', () => {
    it('deve fazer login com sucesso', async () => {
      // Arrange
      const mockUser = { id: '123', email: 'test@test.com' };
      const mockSession = { access_token: 'token123', user: mockUser };
      const mockUserData = {
        id: '123',
        email: 'test@test.com',
        nome_empresa: 'Teste Ltda',
        ativo: true,
        data_validade: new Date(Date.now() + 86400000).toISOString(), // 1 dia no futuro
      };

      const { supabase } = await import('@/integrations/supabase/client');
      
      (supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      vi.spyOn(authService, 'fetchUserData').mockResolvedValue(mockUserData as any);

      // Act
      const result = await authService.signIn('test@test.com', 'password123');

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('Login realizado com sucesso');
      expect(result.user).toEqual(mockUser);
    });

    it('deve falhar com credenciais inválidas', async () => {
      // Arrange
      const { supabase } = await import('@/integrations/supabase/client');
      
      (supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      });

      // Act
      const result = await authService.signIn('wrong@test.com', 'wrongpass');

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Email ou senha incorretos');
    });

    it('deve falhar para usuário inativo', async () => {
      // Arrange
      const mockUser = { id: '123', email: 'test@test.com' };
      const mockSession = { access_token: 'token123', user: mockUser };
      const mockUserData = {
        id: '123',
        email: 'test@test.com',
        nome_empresa: 'Teste Ltda',
        ativo: false, // Usuário inativo
        data_validade: new Date(Date.now() + 86400000).toISOString(),
      };

      const { supabase } = await import('@/integrations/supabase/client');
      
      (supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      vi.spyOn(authService, 'fetchUserData').mockResolvedValue(mockUserData as any);
      vi.spyOn(authService, 'signOut').mockResolvedValue();

      // Act
      const result = await authService.signIn('test@test.com', 'password123');

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Usuário inativo ou não encontrado');
      expect(authService.signOut).toHaveBeenCalled();
    });
  });

  describe('fetchUserData', () => {
    it('deve buscar dados do usuário com sucesso', async () => {
      // Arrange
      const mockUserData = {
        id: '123',
        email: 'test@test.com',
        nome_empresa: 'Teste Ltda',
        ativo: true,
      };

      const { supabase } = await import('@/integrations/supabase/client');
      
      const mockFrom = {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({
              data: mockUserData,
              error: null,
            }),
          })),
        })),
      };

      (supabase.from as any).mockReturnValue(mockFrom);

      // Act
      const result = await authService.fetchUserData('123');

      // Assert
      expect(result).toEqual(mockUserData);
      expect(supabase.from).toHaveBeenCalledWith('users');
    });

    it('deve retornar null em caso de erro', async () => {
      // Arrange
      const { supabase } = await import('@/integrations/supabase/client');
      
      const mockFrom = {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'User not found' },
            }),
          })),
        })),
      };

      (supabase.from as any).mockReturnValue(mockFrom);

      // Act
      const result = await authService.fetchUserData('invalid-id');

      // Assert
      expect(result).toBeNull();
    });
  });
});
