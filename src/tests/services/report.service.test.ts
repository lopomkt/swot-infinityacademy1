
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reportService } from '@/services/report.service';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(),
          })),
          maybeSingle: vi.fn(),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(),
      })),
    })),
  },
}));

describe('ReportService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createReport', () => {
    it('deve criar relatório com sucesso', async () => {
      // Arrange
      const mockReportData = {
        user_id: '123',
        dados: { identificacao: { nomeEmpresa: 'Teste' } },
        resultado_final: { matriz_swot: 'Dados de teste' },
      };

      const { supabase } = await import('@/integrations/supabase/client');
      
      const mockInsert = vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: { id: 'report-123' },
            error: null,
          }),
        })),
      }));

      (supabase.from as any).mockReturnValue({
        insert: mockInsert,
      });

      // Act
      const result = await reportService.createReport(mockReportData);

      // Assert
      expect(result).toBe('report-123');
      expect(supabase.from).toHaveBeenCalledWith('relatorios');
    });

    it('deve retornar null em caso de erro', async () => {
      // Arrange
      const mockReportData = {
        user_id: '123',
        dados: { identificacao: { nomeEmpresa: 'Teste' } },
      };

      const { supabase } = await import('@/integrations/supabase/client');
      
      const mockInsert = vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Insert failed' },
          }),
        })),
      }));

      (supabase.from as any).mockReturnValue({
        insert: mockInsert,
      });

      // Act
      const result = await reportService.createReport(mockReportData);

      // Assert
      expect(result).toBeNull();
    });

    it('deve validar dados obrigatórios', async () => {
      // Arrange
      const invalidData = {
        user_id: '', // ID inválido
        dados: null,
      };

      // Act
      const result = await reportService.createReport(invalidData as any);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('getReportsByUser', () => {
    it('deve buscar relatórios do usuário', async () => {
      // Arrange
      const mockReports = [
        {
          id: 'report-1',
          criado_em: '2024-01-01',
          resultado_final: { matriz_swot: 'Dados 1' },
          dados: { identificacao: { nomeEmpresa: 'Empresa 1' } },
        },
      ];

      const { supabase } = await import('@/integrations/supabase/client');
      
      const mockChain = {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn().mockResolvedValue({
                data: mockReports,
                error: null,
              }),
            })),
          })),
        })),
      };

      (supabase.from as any).mockReturnValue(mockChain);

      // Act
      const result = await reportService.getReportsByUser('123');

      // Assert
      expect(result).toEqual(mockReports);
      expect(supabase.from).toHaveBeenCalledWith('relatorios');
    });

    it('deve retornar array vazio em caso de erro', async () => {
      // Arrange
      const { supabase } = await import('@/integrations/supabase/client');
      
      const mockChain = {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Query failed' },
              }),
            })),
          })),
        })),
      };

      (supabase.from as any).mockReturnValue(mockChain);

      // Act
      const result = await reportService.getReportsByUser('123');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('validateReportData', () => {
    it('deve validar dados válidos', () => {
      // Arrange
      const validData = {
        identificacao: { nomeEmpresa: 'Teste' },
        forcas: { respostas: ['Força 1'] },
        fraquezas: { pontos_inconsistentes: ['Fraqueza 1'] },
      };

      // Act
      const result = reportService.validateReportData(validData);

      // Assert
      expect(result).toBe(true);
    });

    it('deve rejeitar dados inválidos', () => {
      // Arrange
      const invalidData = {
        identificacao: {},
        forcas: {},
        fraquezas: {},
      };

      // Act
      const result = reportService.validateReportData(invalidData);

      // Assert
      expect(result).toBe(false);
    });

    it('deve rejeitar dados nulos', () => {
      // Act
      const result = reportService.validateReportData(null);

      // Assert
      expect(result).toBe(false);
    });
  });
});
