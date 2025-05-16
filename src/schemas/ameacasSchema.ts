
import { z } from 'zod';

export const ameacasSchema = z.object({
  fator_preocupante: z.string().min(1, { message: "Por favor, informe o fator externo que mais preocupa" }),
  concorrente_em_ascensao: z.string().min(1, { message: "Por favor, selecione uma opção" }),
  dependencia_parceiros: z.string().min(1, { message: "Por favor, selecione uma opção" }),
  ameaca_legislativa: z.string().min(1, { message: "Por favor, selecione uma opção" }),
  sazonalidade_negocio: z.string().min(1, { message: "Por favor, selecione uma opção" }),
  detalheSazonalidade: z.string().optional()
    .refine(val => val !== undefined || true, { message: "Por favor, forneça detalhes sobre a sazonalidade" }),
  dependencia_plataformas: z.array(z.string()).min(1, { message: "Selecione pelo menos uma opção" }),
  mudanca_comportamental: z.string().min(1, { message: "Por favor, selecione uma opção" }),
  resiliencia_crise: z.string().min(1, { message: "Por favor, selecione uma opção" }),
  perdas_externas: z.string().min(1, { message: "Por favor, selecione uma opção" }),
  detalhePerda: z.string().optional()
    .refine(val => val !== undefined || true, { message: "Por favor, forneça detalhes sobre as perdas" }),
  impacto_ameacas: z.number().min(0, { message: "Por favor, selecione um valor" }),
  estrategia_defesa: z.string().optional(),
  // Note: We don't need to add respostas to the schema as it's derived from other fields
});

export type AmeacasSchema = z.infer<typeof ameacasSchema>;
