
import { z } from 'zod';

// Define the string schema for each response item with proper validation
const respostaString = z.string().min(1, 'Preencha todas as forças listadas');

// Define the array schema with explicit typing as string[]
export const forcasSchema = z.object({
  respostas: z.array(respostaString)
    .min(5, 'Informe pelo menos 5 pontos fortes para prosseguir'),
});

export type ForcasSchema = z.infer<typeof forcasSchema>;
