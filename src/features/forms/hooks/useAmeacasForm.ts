
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ameacasSchema, AmeacasSchema } from "@/schemas/ameacasSchema";
import { toast } from "@/components/ui/use-toast";

export function useAmeacasForm(defaultValues?: any) {
  const form = useForm<AmeacasSchema>({
    resolver: zodResolver(ameacasSchema),
    defaultValues: {
      fator_preocupante: defaultValues?.fator_preocupante || "",
      concorrente_em_ascensao: defaultValues?.concorrente_em_ascensao || "",
      dependencia_parceiros: defaultValues?.dependencia_parceiros || "",
      ameaca_legislativa: defaultValues?.ameaca_legislativa || "",
      sazonalidade_negocio: defaultValues?.sazonalidade_negocio || "",
      detalheSazonalidade: defaultValues?.detalheSazonalidade || "",
      dependencia_plataformas: defaultValues?.dependencia_plataformas || [],
      mudanca_comportamental: defaultValues?.mudanca_comportamental || "",
      resiliencia_crise: defaultValues?.resiliencia_crise || "",
      perdas_externas: defaultValues?.perdas_externas || "",
      detalhePerda: defaultValues?.detalhePerda || "",
      impacto_ameacas: defaultValues?.impacto_ameacas ?? 0,
      estrategia_defesa: defaultValues?.estrategia_defesa || "",
    }
  });

  const handleFormSubmit = (data: AmeacasSchema, onComplete: (data: any) => void) => {
    // Collect and transform responses into an array format for the matrix view
    const responses = [
      data.fator_preocupante,
      `Concorrente em ascensão: ${data.concorrente_em_ascensao}`,
      `Dependência de parceiros: ${data.dependencia_parceiros}`,
      `Ameaça legislativa: ${data.ameaca_legislativa}`,
      data.sazonalidade_negocio === "Sim" ? `Sazonalidade: ${data.detalheSazonalidade}` : "Sem sazonalidade",
      `Dependência de plataformas: ${data.dependencia_plataformas.join(", ")}`,
      `Mudanças comportamentais: ${data.mudanca_comportamental}`,
      `Resiliência a crises: ${data.resiliencia_crise}`,
      data.perdas_externas === "Sim" ? `Perdas externas: ${data.detalhePerda}` : "Sem perdas externas significativas",
    ].filter(item => item && item.trim() !== '');

    const payload = {
      fator_preocupante: data.fator_preocupante,
      concorrente_em_ascensao: data.concorrente_em_ascensao,
      dependencia_parceiros: data.dependencia_parceiros,
      ameaca_legislativa: data.ameaca_legislativa,
      sazonalidade_negocio: data.sazonalidade_negocio,
      ...(data.sazonalidade_negocio === "Sim" && { detalhe_sazonalidade: data.detalheSazonalidade }),
      dependencia_plataformas: data.dependencia_plataformas,
      mudanca_comportamental: data.mudanca_comportamental,
      resiliencia_crise: data.resiliencia_crise,
      perdas_externas: data.perdas_externas,
      ...(data.perdas_externas === "Sim" && { detalhe_perda: data.detalhePerda }),
      impacto_ameacas: data.impacto_ameacas,
      ...(data.impacto_ameacas !== undefined && data.impacto_ameacas >= 7 && { estrategia_defesa: data.estrategia_defesa }),
      step_ameacas_ok: true,
      respostas: responses,
      validacao_ameacas_ok: true
    };
    
    onComplete(payload);
    toast({ title: "Etapa de ameaças salva com sucesso." });
  };

  return {
    ...form,
    handleFormSubmit
  };
}
