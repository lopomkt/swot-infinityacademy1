
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forcasSchema, ForcasData } from "@/schemas/forcasSchema";

export function useForcasForm(defaultValues?: ForcasData) {
  const form = useForm<ForcasData>({
    resolver: zodResolver(forcasSchema),
    defaultValues: defaultValues || {
      cultura_forte: "",
      equipe_qualificada: "",
      marca_reconhecida: "",
      tecnologia_propria: "",
      carteira_fiel: "",
      diferencial_mercado: "",
      reputacao_regional: "",
      canais_distribuicao: "",
      estrutura_financeira: "",
      velocidade_entrega: "",
      processos_otimizados: "",
      lideranca_setorial: "",
      atendimento_diferenciado: "",
      outros: "",
    }
  });

  const handleFormSubmit = (data: ForcasData, onComplete?: (data: ForcasData) => void, onSubmit?: (data: ForcasData) => void) => {
    // For backward compatibility
    const respostas = [
      data.cultura_forte,
      data.equipe_qualificada,
      data.marca_reconhecida,
      data.tecnologia_propria,
      data.carteira_fiel
    ].filter(Boolean) as string[];
    
    const formattedData = {
      ...data,
      respostas: respostas.length > 0 ? respostas : undefined
    };
    
    if (onComplete) {
      onComplete(formattedData);
    } else if (onSubmit) {
      onSubmit(formattedData);
    }
  };

  return {
    ...form,
    handleFormSubmit
  };
}
