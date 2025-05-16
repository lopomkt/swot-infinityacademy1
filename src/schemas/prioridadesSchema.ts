
import { z } from 'zod';

export const prioridadesSchema = z.object({
  meta_90_dias: z.string().min(1, {
    message: "Por favor, informe sua meta principal para os próximos 90 dias.",
  }),
  top3_desafios: z.string().min(1, {
    message: "Por favor, informe seus principais desafios.",
  }),
  areas_fraqueza: z.array(z.string()).min(1, {
    message: "Selecione pelo menos uma área frágil.",
  }),
  areas_potenciais: z.array(z.string()).min(1, {
    message: "Selecione pelo menos uma área promissora.",
  }),
  ajuda_externa_urgente: z.string().min(1, {
    message: "Por favor, informe onde precisa de ajuda externa.",
  }),
  acao_unica_desejada: z.string().min(1, {
    message: "Por favor, informe qual problema único gostaria de resolver.",
  }),
  engajamento_equipe: z.number().min(0).max(10),
  distribuicao_tempo: z.enum(["Sim", "Parcialmente", "Estou sobrecarregado"], {
    required_error: "Por favor, selecione uma opção.",
  }),
  comprometimento_estrategico: z.number().min(0).max(10),
  estilo_decisao: z.enum([
    "Analítico",
    "Rápido e objetivo",
    "Intuitivo",
    "Compartilhado com sócios / equipe"
  ], {
    required_error: "Por favor, selecione seu estilo de decisão.",
  }),
  prontidao_execucao: z.enum(["Sim", "Com adaptações", "Ainda não"]).optional(),
  // New fields
  meta_crescimento_6_meses: z.string().optional(),
  meta_crescimento_12_meses: z.string().optional(),
  tipo_investimento: z.string().optional(),
  maior_gargalo: z.string().optional(),
});

export type PrioridadesSchema = z.infer<typeof prioridadesSchema>;
