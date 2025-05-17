
import { z } from 'zod';

export const oportunidadesSchema = z.object({
  nova_demanda_cliente: z.string().min(1, { message: "Por favor, informe as novas demandas" }).optional(),
  situacao_mercado: z.string().min(1, { message: "Selecione a situação do mercado" }).optional(),
  nichos_ocultos: z.string().min(1, { message: "Informe possíveis nichos ocultos" }).optional(),
  concorrentes_enfraquecendo: z.string().min(1, { message: "Selecione uma opção" }).optional(),
  tendencias_aproveitaveis: z.array(z.string()).min(1, { message: "Selecione pelo menos uma tendência" }).optional(),
  tendencias_outro: z.string().optional(),
  demanda_nao_atendida: z.string().optional(),
  parcerias_possiveis: z.string().optional(),
  recurso_ocioso: z.string().optional(),
  canais_potenciais: z.array(z.string()).min(1, { message: "Selecione pelo menos um canal potencial" }).optional(),
  canais_outro: z.string().optional(),
  nivel_disposicao: z.number().optional(),
  acao_inicial_oportunidade: z.string().optional(),
  step_oportunidades_ok: z.boolean().optional(),
  respostas: z.array(z.string()).optional(),
});

export type OportunidadesSchema = z.infer<typeof oportunidadesSchema>;
