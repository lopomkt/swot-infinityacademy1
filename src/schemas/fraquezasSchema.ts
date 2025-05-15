
import { z } from 'zod';

export const fraquezasSchema = z.object({
  pontos_inconsistentes: z.array(z.string())
    .min(1, 'Selecione ao menos uma área com dificuldade de consistência'),
  fraqueza_critica: z.string()
    .min(1, 'Selecione qual ponto é mais crítico'),
  bloqueio_estrategico: z.string()
    .min(1, 'Informe o que mais trava seu crescimento'),
  centralizacao_gestao: z.string()
    .min(1, 'Informe se depende da sua atuação no dia a dia'),
  retrabalho_frequente: z.string()
    .min(1, 'Informe o ponto interno que mais gera retrabalho'),
  clareza_funcoes: z.number()
    .min(1, 'Indique o nível de clareza das funções da sua equipe'),
  documentacao_processos: z.string()
    .min(1, 'Indique se seus processos estão documentados'),
  indicadores_ativos: z.string()
    .min(1, 'Indique se possui indicadores de resultados'),
  ferramentas_utilizadas: z.string()
    .min(1, 'Informe as ferramentas utilizadas para gestão'),
  tentativas_resolucao: z.string()
    .min(1, 'Indique se já tentou resolver alguma dessas fraquezas'),
  tentativa_falha_motivo: z.string()
    .optional()
    .refine(val => val !== "" || true, { 
      message: "Informe o motivo da falha na tentativa de resolução" 
    }),
  step_fraquezas_ok: z.boolean().optional(),
})
.refine((data) => {
  // Se tentativas_resolucao é "Sim, mas sem sucesso", tentativa_falha_motivo é obrigatório
  return data.tentativas_resolucao !== "Sim, mas sem sucesso" || 
         (data.tentativas_resolucao === "Sim, mas sem sucesso" && 
          data.tentativa_falha_motivo && 
          data.tentativa_falha_motivo.trim().length > 0);
}, {
  message: "É necessário informar o motivo pelo qual a tentativa não funcionou",
  path: ["tentativa_falha_motivo"]
});

export type FraquezasSchema = z.infer<typeof fraquezasSchema>;
