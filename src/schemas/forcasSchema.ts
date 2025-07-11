
import { z } from "zod";

// Define a schema for a single strength response (string)
export const respostaString = z.string().min(1, {
  message: "Campo obrigatório",
}).optional();

// Define the schema for the forcas step
export const forcasSchema = z.object({
  cultura_forte: z.string().min(1, "Campo obrigatório"),
  equipe_qualificada: z.string().min(1, "Campo obrigatório"),
  marca_reconhecida: z.string().min(1, "Campo obrigatório"),
  tecnologia_propria: z.string().min(1, "Campo obrigatório"),
  carteira_fiel: z.string().min(1, "Campo obrigatório"),
  diferencial_mercado: z.string().min(1, "Campo obrigatório"),
  reputacao_regional: z.string().min(1, "Campo obrigatório"),
  canais_distribuicao: z.string().min(1, "Campo obrigatório"),
  estrutura_financeira: z.string().min(1, "Campo obrigatório"),
  velocidade_entrega: z.string().min(1, "Campo obrigatório"),
  processos_otimizados: z.string().optional(),
  lideranca_setorial: z.string().optional(),
  atendimento_diferenciado: z.string().optional(),
  outros: z.string().optional(),
  
  // Keep backward compatibility with the old format
  respostas: z.array(respostaString).optional(),
})
// Refine validation to ensure at least one strength is provided
.refine((data) => {
  const values = Object.values(data).filter(val => 
    val !== undefined && 
    val !== null && 
    (typeof val === 'string' ? val.trim() !== '' : true)
  );
  return values.length > 0;
}, {
  message: "Informe pelo menos uma força da empresa",
  path: ["cultura_forte"] // Point to the first field for error display
});

// Infer the type from the schema
export type ForcasData = z.infer<typeof forcasSchema>;
