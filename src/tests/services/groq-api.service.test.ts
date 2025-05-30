
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { groqAPIService } from '@/services/groq-api.service';
import { FormData } from '@/types/groq';

// Mock fetch globally
global.fetch = vi.fn();

describe('GROQAPIService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockFormData: FormData = {
    identificacao: {
      nomeEmpresa: 'Teste Ltda',
      segmento: 'Tecnologia',
    },
    forcas: {
      respostas: ['Equipe qualificada', 'Produto inovador'],
    },
    fraquezas: {
      pontos_inconsistentes: ['Processos manuais'],
    },
  };

  describe('fetchGROQResult', () => {
    it('deve retornar dados mock em modo desenvolvimento', async () => {
      // Arrange
      Object.defineProperty(import.meta.env, 'DEV', { value: true });

      // Act
      const result = await groqAPIService.fetchGROQResult(mockFormData);

      // Assert
      expect(result).toBeDefined();
      expect(result.choices).toBeDefined();
      expect(result.choices[0].message.content).toContain('### MATRIZ SWOT');
    });

    it('deve fazer chamada real para API em produção', async () => {
      // Arrange
      Object.defineProperty(import.meta.env, 'DEV', { value: false });
      Object.defineProperty(import.meta.env, 'VITE_GROQ_API_KEY', { 
        value: 'valid-api-key' 
      });

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{
            message: {
              content: '### MATRIZ SWOT\nForças: Teste\n### DIAGNÓSTICO CONSULTIVO\nAnálise\n### PLANO DE AÇÃO A/B/C\nAções'
            }
          }]
        })
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      // Act
      const result = await groqAPIService.fetchGROQResult(mockFormData);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'https://api.groq.com/openai/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer valid-api-key',
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.choices[0].message.content).toBeDefined();
    });

    it('deve lançar erro quando API key não está configurada', async () => {
      // Arrange
      Object.defineProperty(import.meta.env, 'DEV', { value: false });
      Object.defineProperty(import.meta.env, 'VITE_GROQ_API_KEY', { value: '' });

      // Act & Assert
      await expect(groqAPIService.fetchGROQResult(mockFormData))
        .rejects.toThrow('GROQ API Key não configurada');
    });

    it('deve implementar retry com exponential backoff', async () => {
      // Arrange
      Object.defineProperty(import.meta.env, 'DEV', { value: false });
      Object.defineProperty(import.meta.env, 'VITE_GROQ_API_KEY', { 
        value: 'valid-api-key' 
      });

      // Mock falha nas primeiras 2 tentativas
      (global.fetch as any)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{
              message: { content: 'Success after retries' }
            }]
          })
        });

      // Act
      const result = await groqAPIService.fetchGROQResult(mockFormData);

      // Assert
      expect(fetch).toHaveBeenCalledTimes(3);
      expect(result.choices[0].message.content).toBe('Success after retries');
    });

    it('deve falhar após máximo de tentativas', async () => {
      // Arrange
      Object.defineProperty(import.meta.env, 'DEV', { value: false });
      Object.defineProperty(import.meta.env, 'VITE_GROQ_API_KEY', { 
        value: 'valid-api-key' 
      });

      (global.fetch as any).mockRejectedValue(new Error('Persistent error'));

      // Act & Assert
      await expect(groqAPIService.fetchGROQResult(mockFormData))
        .rejects.toThrow('Falha na geração do relatório após 5 tentativas');
    });
  });
});
