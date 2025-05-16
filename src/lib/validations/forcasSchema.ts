
import { z } from 'zod';

export const forcasSchema = z.object({
  cultura_forte: z.string().optional(),
  equipe_qualificada: z.string().optional(),
  marca_reconhecida: z.string().optional(),
  tecnologia_propria: z.string().optional(),
  carteira_fiel: z.string().optional(),
  diferencial_mercado: z.string().optional(),
  reputacao_regional: z.string().optional(),
  canais_distribuicao: z.string().optional(),
  estrutura_financeira: z.string().optional(),
  velocidade_entrega: z.string().optional(),
  processos_otimizados: z.string().optional(),
  lideranca_setorial: z.string().optional(),
  atendimento_diferenciado: z.string().optional(),
  outros: z.string().optional(),
});

export type ForcasFormData = z.infer<typeof forcasSchema>;
