
import { z } from "zod";

// Define a schema for a single strength response (string)
export const respostaString = z.string().min(1, {
  message: "Campo obrigatório",
});

// Define the schema for the forcas step
export const forcasSchema = z.object({
  respostas: z.array(respostaString).min(1, {
    message: "É necessário informar pelo menos uma força",
  }),
});

// Infer the type from the schema
export type ForcasData = z.infer<typeof forcasSchema>;
