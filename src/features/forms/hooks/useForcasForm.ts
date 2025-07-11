
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forcasSchema, ForcasData } from "@/schemas/forcasSchema";

export function useForcasForm(defaultValues?: ForcasData) {
  const form = useForm<ForcasData>({
    resolver: zodResolver(forcasSchema),
    defaultValues: {
      cultura_forte: defaultValues?.cultura_forte || "",
      equipe_qualificada: defaultValues?.equipe_qualificada || "",
      marca_reconhecida: defaultValues?.marca_reconhecida || "",
      tecnologia_propria: defaultValues?.tecnologia_propria || "",
      carteira_fiel: defaultValues?.carteira_fiel || "",
      diferencial_mercado: defaultValues?.diferencial_mercado || "",
      reputacao_regional: defaultValues?.reputacao_regional || "",
      canais_distribuicao: defaultValues?.canais_distribuicao || "",
      estrutura_financeira: defaultValues?.estrutura_financeira || "",
      velocidade_entrega: defaultValues?.velocidade_entrega || "",
      processos_otimizados: defaultValues?.processos_otimizados || "",
      lideranca_setorial: defaultValues?.lideranca_setorial || "",
      atendimento_diferenciado: defaultValues?.atendimento_diferenciado || "",
      outros: defaultValues?.outros || "",
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
