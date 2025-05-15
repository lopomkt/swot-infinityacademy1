
import { z } from 'zod';

// Define the string schema for each response item
const respostaString = z.string().min(1, 'Preencha todas as forças listadas');

// Define the array schema with proper typing
const respostaArray = z.array(respostaString)
  .min(5, 'Informe pelo menos 5 pontos fortes para prosseguir');

export const forcasSchema = z.object({
  respostas: respostaArray,
});

export type ForcasSchema = z.infer<typeof forcasSchema>;
