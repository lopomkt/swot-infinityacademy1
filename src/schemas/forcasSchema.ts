
import { z } from 'zod';

// Define the array schema first with clear string type
const respostaArray = z.array(
  z.string().min(1, 'Preencha todas as forças listadas')
).min(5, 'Informe pelo menos 5 pontos fortes para prosseguir');

export const forcasSchema = z.object({
  respostas: respostaArray,
});

export type ForcasSchema = z.infer<typeof forcasSchema>;
