
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fraquezasSchema, FraquezasSchema } from "@/schemas/fraquezasSchema";
import { FraquezasData } from "@/types/formData";
import { toast } from "@/hooks/use-toast";

export function useFraquezasForm(defaultValues?: Partial<FraquezasData>) {
  const form = useForm<FraquezasSchema>({
    resolver: zodResolver(fraquezasSchema),
    defaultValues: {
      pontos_inconsistentes: [],
      fraqueza_critica: "",
      bloqueio_estrategico: "",
      centralizacao_gestao: "",
      retrabalho_frequente: "",
      clareza_funcoes: 0,
      documentacao_processos: "",
      indicadores_ativos: "",
      ferramentas_utilizadas: "",
      tentativas_resolucao: "",
      tentativa_falha_motivo: "",
      capacidade_inovacao: "",
      ausencia_dados_decisao: "",
      falta_treinamento: "",
      problemas_cultura: "",
      step_fraquezas_ok: false,
      ...defaultValues,
    },
    mode: "onChange"
  });

  const handleFormSubmit = (data: FraquezasSchema, onComplete: (data: FraquezasData) => void) => {
    toast({
      title: "Fraquezas salvas",
      description: "Vamos para a próxima etapa: Oportunidades",
    });
    
    onComplete({
      ...data,
      step_fraquezas_ok: true
    } as FraquezasData);
  };

  return {
    ...form,
    handleFormSubmit
  };
}
