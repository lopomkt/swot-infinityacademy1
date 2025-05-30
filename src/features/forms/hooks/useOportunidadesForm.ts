
import { useState } from "react";
import { OportunidadesData } from "@/types/formData";

export function useOportunidadesForm(defaultValues?: Partial<OportunidadesData>) {
  const [form, setForm] = useState<OportunidadesData>({
    nova_demanda_cliente: "",
    situacao_mercado: "",
    nichos_ocultos: "",
    concorrentes_enfraquecendo: "",
    tendencias_aproveitaveis: [],
    tendencias_outro: "",
    demanda_nao_atendida: "",
    parcerias_possiveis: "",
    recurso_ocioso: "",
    canais_potenciais: [],
    canais_outro: "",
    nivel_disposicao: 0,
    acao_inicial_oportunidade: "",
    step_oportunidades_ok: false,
    respostas: [],
    ...defaultValues,
  });

  function handleChange<K extends keyof OportunidadesData>(key: K, value: OportunidadesData[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleCheckbox(key: "tendencias_aproveitaveis" | "canais_potenciais", value: string) {
    setForm((prev) => {
      const arr = prev[key].includes(value)
        ? prev[key].filter((v: string) => v !== value)
        : [...prev[key], value];
      return { ...prev, [key]: arr };
    });
  }

  function countFilledFields(data: OportunidadesData) {
    let c = 0;
    if (data.nova_demanda_cliente?.trim()) c++;
    if (data.situacao_mercado) c++;
    if (data.nichos_ocultos?.trim()) c++;
    if (data.concorrentes_enfraquecendo) c++;
    if (data.tendencias_aproveitaveis.length) c++;
    if (data.tendencias_aproveitaveis.includes("Outro") && data.tendencias_outro?.trim()) c++;
    if (data.demanda_nao_atendida?.trim()) c++;
    if (data.parcerias_possiveis) c++;
    if (data.recurso_ocioso?.trim()) c++;
    if (data.canais_potenciais.length) c++;
    if (data.canais_potenciais.includes("Outro") && data.canais_outro?.trim()) c++;
    if (typeof data.nivel_disposicao === "number" && data.nivel_disposicao !== 0) c++;
    if (data.nivel_disposicao >= 8 && data.acao_inicial_oportunidade?.trim()) c++;
    return c;
  }

  const isValid = countFilledFields(form) >= 7;

  const handleFormSubmit = (onComplete: (data: OportunidadesData) => void) => {
    if (isValid) {
      const finalData = { ...form, step_oportunidades_ok: true };
      onComplete(finalData);
    }
  };

  return {
    form,
    handleChange,
    handleCheckbox,
    isValid,
    handleFormSubmit
  };
}
