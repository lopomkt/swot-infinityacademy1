
import { z } from 'zod';

export const saudeFinanceiraSchema = z.object({
  caixa_disponivel: z.string().min(1, 'Selecione uma opção'),
  autonomia_caixa: z.string().min(1, 'Selecione uma opção'),
  controle_financeiro: z.string().min(1, 'Selecione uma opção'),
  fluxo_frequencia: z.string().min(1, 'Selecione uma opção'),
  endividamento_nivel: z.string().min(1, 'Selecione uma opção'),
  inadimplencia_clientes: z.string().min(1, 'Selecione uma opção'),
  custos_fixos: z.string().min(1, 'Informe os custos fixos'),
  cac_estimado_conhecimento: z.string().min(1, 'Selecione uma opção'),
  cac_estimado: z.string().optional(),
  orcamento_planejado: z.string().min(1, 'Selecione uma opção'),
  intencao_investimento: z.string().optional(),
  maturidade_financeira: z.string().min(1, 'Selecione uma opção'),
  step_financas_ok: z.boolean().optional(),
});

export type SaudeFinanceiraSchema = z.infer<typeof saudeFinanceiraSchema>;
