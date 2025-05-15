
import { z } from 'zod';

export const ameacasSchema = z.object({
  fator_preocupante: z.string().optional(),
  concorrente_em_ascensao: z.string().optional(),
  dependencia_parceiros: z.string().optional(),
  ameaca_legislativa: z.string().optional(),
  sazonalidade_negocio: z.string().optional(),
  detalheSazonalidade: z.string().when('sazonalidade_negocio', {
    is: 'Sim',
    then: z.string().min(1, 'Detalhe a sazonalidade do seu negócio'),
    otherwise: z.string().optional(),
  }),
  dependencia_plataformas: z.array(z.string()).optional(),
  mudanca_comportamental: z.string().optional(),
  resiliencia_crise: z.string().optional(),
  perdas_externas: z.string().optional(),
  detalhePerda: z.string().when('perdas_externas', {
    is: 'Sim',
    then: z.string().min(1, 'Detalhe a perda sofrida'),
    otherwise: z.string().optional(),
  }),
  impacto_ameacas: z.number().optional(),
  estrategia_defesa: z.string().when('impacto_ameacas', {
    is: (val: number) => val >= 7,
    then: z.string().min(1, 'Informe sua estratégia de defesa'),
    otherwise: z.string().optional(),
  }),
}).refine((data) => {
  // Filtra valores preenchidos para validar mínimo de 8 respostas
  const respostas = [
    data.fator_preocupante,
    data.concorrente_em_ascensao,
    data.dependencia_parceiros,
    data.ameaca_legislativa,
    data.sazonalidade_negocio,
    data.sazonalidade_negocio === "Sim" ? data.detalheSazonalidade : undefined,
    data.dependencia_plataformas && data.dependencia_plataformas.length > 0 ? "preenchido" : undefined,
    data.mudanca_comportamental,
    data.resiliencia_crise,
    data.perdas_externas,
    data.perdas_externas === "Sim" ? data.detalhePerda : undefined,
    data.impacto_ameacas !== undefined ? "preenchido" : undefined,
    data.impacto_ameacas && data.impacto_ameacas >= 7 ? data.estrategia_defesa : undefined
  ];
  
  const preenchidas = respostas.filter(
    (val) => val !== undefined && val !== ""
  ).length;
  
  return preenchidas >= 8;
}, {
  message: "Você deve preencher pelo menos 8 campos para avançar",
  path: ["_errors"]
});

export type AmeacasSchema = z.infer<typeof ameacasSchema>;
