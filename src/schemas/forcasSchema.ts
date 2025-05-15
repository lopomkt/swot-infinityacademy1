
import { z } from 'zod';

export const forcasSchema = z.object({
  respostas: z
    .array(z.string().min(1, 'Preencha todas as forças listadas'))
    .min(8, 'Informe pelo menos 8 pontos fortes para prosseguir'),
});

export type ForcasSchema = z.infer<typeof forcasSchema>;
