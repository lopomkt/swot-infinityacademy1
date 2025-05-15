
import { z } from 'zod';

export const ameacasSchema = z.object({
  fator_preocupante: z.string().optional(),
  concorrente_em_ascensao: z.string().optional(),
  dependencia_parceiros: z.string().optional(),
  ameaca_legislativa: z.string().optional(),
  sazonalidade_negocio: z.string().optional(),
  detalheSazonalidade: z.string().optional(),
  dependencia_plataformas: z.array(z.string()).optional(),
  mudanca_comportamental: z.string().optional(),
  resiliencia_crise: z.string().optional(),
  perdas_externas: z.string().optional(),
  detalhePerda: z.string().optional(),
  impacto_ameacas: z.number().optional(),
  estrategia_defesa: z.string().optional(),
}).superRefine((data, ctx) => {
  // Condicional para detalheSazonalidade
  if (data.sazonalidade_negocio === "Sim" && (!data.detalheSazonalidade || data.detalheSazonalidade.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Detalhe a sazonalidade do seu negócio",
      path: ["detalheSazonalidade"]
    });
  }
  
  // Condicional para detalhePerda
  if (data.perdas_externas === "Sim" && (!data.detalhePerda || data.detalhePerda.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Detalhe a perda sofrida",
      path: ["detalhePerda"]
    });
  }
  
  // Condicional para estrategia_defesa
  if (data.impacto_ameacas !== undefined && data.impacto_ameacas >= 7 && 
      (!data.estrategia_defesa || data.estrategia_defesa.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Informe sua estratégia de defesa",
      path: ["estrategia_defesa"]
    });
  }
  
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
    data.impacto_ameacas !== undefined && data.impacto_ameacas >= 7 ? data.estrategia_defesa : undefined
  ];
  
  const preenchidas = respostas.filter(
    (val) => val !== undefined && val !== ""
  ).length;
  
  if (preenchidas < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Você deve preencher pelo menos 8 campos para avançar",
      path: []
    });
  }
});

export type AmeacasSchema = z.infer<typeof ameacasSchema>;
