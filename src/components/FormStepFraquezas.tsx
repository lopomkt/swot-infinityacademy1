
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FraquezasData } from "@/types/formData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fraquezasSchema, FraquezasSchema } from "@/schemas/fraquezasSchema";
import { toast } from "@/hooks/use-toast";

const inconsistenciaOpcoes = [
  "Marketing",
  "Vendas",
  "Atendimento",
  "Precificação",
  "Gestão de pessoas",
  "Processos internos",
  "Finanças",
  "Operação diária",
  "Pós-venda",
  "Tomada de decisão"
];
const tentativasResolucaoOpcoes = [
  "Sim, com bons resultados",
  "Sim, mas sem sucesso",
  "Não ainda"
];

interface Props {
  defaultValues?: Partial<FraquezasData>;
  onComplete: (data: FraquezasData) => void;
}

export default function FormStepFraquezas({
  defaultValues,
  onComplete
}: Props) {
  // Initialize form with React Hook Form + Zod
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors, isValid } 
  } = useForm<FraquezasSchema>({
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
      step_fraquezas_ok: false,
      ...defaultValues,
    },
    mode: "onChange"
  });

  // For checkbox handling (special case)
  const [selectedInconsistencias, setSelectedInconsistencias] = useState<string[]>(
    defaultValues?.pontos_inconsistentes || []
  );

  // Watch fields for conditional rendering
  const tentativasResolucao = watch("tentativas_resolucao");
  const pontos_inconsistentes = watch("pontos_inconsistentes");

  function handleCheckbox(value: string) {
    setSelectedInconsistencias(prev => {
      const newSelection = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      
      // Update the form value
      setValue("pontos_inconsistentes", newSelection, { shouldValidate: true });
      
      // If current fraqueza_critica isn't among selected anymore, reset it
      const fc = watch("fraqueza_critica");
      if (fc && !newSelection.includes(fc)) {
        setValue("fraqueza_critica", "", { shouldValidate: true });
      }
      
      return newSelection;
    });
  }

  function onSubmit(data: FraquezasSchema) {
    // Validation is successful, flag for validation status
    const validacao_fraquezas_ok = true;
    
    // Show success toast
    toast({
      title: "Fraquezas salvas",
      description: "Vamos para a próxima etapa: Oportunidades",
    });
    
    // Complete this step with valid data
    onComplete({
      ...data,
      step_fraquezas_ok: true
    } as FraquezasData);
  }

  return (
    <form
      className="w-full bg-white rounded-xl p-1 sm:p-6 shadow-sm border border-[#f1eaea] max-w-lg animate-fade-in"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <h2 className="font-bold text-2xl text-[#560005] mb-3">Etapa 3 – FRAQUEZAS</h2>
      <p className="text-base text-black mb-5">
        Quais são os principais desafios internos da sua empresa?
      </p>
      <p className="text-sm text-gray-500 mb-8">
        Agora vamos identificar pontos de atenção que podem estar impedindo sua empresa de crescer.
      </p>

      {/* 1. Em quais áreas sente mais dificuldade... */}
      <label className="block mb-2 font-medium">
        Em quais áreas você sente mais dificuldade de manter consistência?
      </label>
      <div className="flex flex-col gap-2 mb-1">
        {inconsistenciaOpcoes.map(opt => (
          <label
            key={opt}
            className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer border font-medium ${
              selectedInconsistencias.includes(opt)
                ? "bg-[#ef0002] text-white border-[#ef0002]"
                : "bg-gray-100 border-gray-300"
            } transition`}
          >
            <input
              type="checkbox"
              className="accent-[#ef0002] h-4 w-4"
              checked={selectedInconsistencias.includes(opt)}
              onChange={() => handleCheckbox(opt)}
              value={opt}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
      {errors.pontos_inconsistentes && (
        <p className="text-red-500 text-xs mt-1 mb-4">{errors.pontos_inconsistentes.message}</p>
      )}

      {/* 2. Qual desses pontos é mais crítico hoje? */}
      <label className="block mb-2 font-medium">
        Qual desses pontos é mais crítico hoje?
      </label>
      <select
        className={`w-full border ${errors.fraqueza_critica ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none`}
        disabled={selectedInconsistencias.length === 0}
        {...register("fraqueza_critica")}
      >
        <option value="">Selecione uma opção marcada acima...</option>
        {selectedInconsistencias.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {errors.fraqueza_critica && (
        <p className="text-red-500 text-xs mb-4">{errors.fraqueza_critica.message}</p>
      )}

      {/* 3. O que mais trava seu crescimento */}
      <label className="block mb-2 font-medium">
        O que mais trava seu crescimento atualmente?
      </label>
      <input
        type="text"
        className={`w-full border ${errors.bloqueio_estrategico ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none`}
        placeholder="Ex: Falta de equipe, baixa conversão de vendas…"
        {...register("bloqueio_estrategico")}
      />
      {errors.bloqueio_estrategico && (
        <p className="text-red-500 text-xs mb-4">{errors.bloqueio_estrategico.message}</p>
      )}

      {/* 4. Depende demais da atuação */}
      <label className="block mb-2 font-medium">
        Você depende demais da sua própria atuação no dia a dia?
      </label>
      <div className="flex gap-3 mb-1">
        {["Sim, totalmente", "Parcialmente", "Não"].map(opt => (
          <label key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              watch("centralizacao_gestao") === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              className="hidden"
              value={opt}
              {...register("centralizacao_gestao")}
            />
            {opt}
          </label>
        ))}
      </div>
      {errors.centralizacao_gestao && (
        <p className="text-red-500 text-xs mb-4">{errors.centralizacao_gestao.message}</p>
      )}

      {/* 5. Retrabalho frequente */}
      <label className="block mb-2 font-medium">
        Qual ponto interno mais gera retrabalho ou perda de tempo?
      </label>
      <input
        type="text"
        className={`w-full border ${errors.retrabalho_frequente ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none`}
        {...register("retrabalho_frequente")}
      />
      {errors.retrabalho_frequente && (
        <p className="text-red-500 text-xs mb-4">{errors.retrabalho_frequente.message}</p>
      )}

      {/* 6. Equipe sabe o que fazer? */}
      <label className="block mb-2 font-medium">
        Sua equipe sabe exatamente o que deve fazer?
      </label>
      <div className="flex items-center gap-2 mb-1">
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          className="flex-grow accent-[#b70001]"
          {...register("clareza_funcoes", { valueAsNumber: true })}
        />
        <span className="w-8 text-right text-[#b70001] font-bold">{watch("clareza_funcoes")}</span>
      </div>
      {errors.clareza_funcoes && (
        <p className="text-red-500 text-xs mb-4">{errors.clareza_funcoes.message}</p>
      )}

      {/* 7. Processos documentados */}
      <label className="block mb-2 font-medium">
        Seus processos estão documentados e padronizados?
      </label>
      <div className="flex gap-3 mb-1">
        {["Sim", "Parcialmente", "Não"].map(opt => (
          <label key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              watch("documentacao_processos") === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              className="hidden"
              value={opt}
              {...register("documentacao_processos")}
            />
            {opt}
          </label>
        ))}
      </div>
      {errors.documentacao_processos && (
        <p className="text-red-500 text-xs mb-4">{errors.documentacao_processos.message}</p>
      )}

      {/* 8. Possui indicadores */}
      <label className="block mb-2 font-medium">
        Você possui indicadores ou métricas para acompanhar resultados?
      </label>
      <div className="flex gap-3 mb-1">
        {["Sim", "Em construção", "Não"].map(opt => (
          <label key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              watch("indicadores_ativos") === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              className="hidden"
              value={opt}
              {...register("indicadores_ativos")}
            />
            {opt}
          </label>
        ))}
      </div>
      {errors.indicadores_ativos && (
        <p className="text-red-500 text-xs mb-4">{errors.indicadores_ativos.message}</p>
      )}

      {/* 9. Ferramentas utilizadas */}
      <label className="block mb-2 font-medium">
        Quais ferramentas você usa hoje para gerenciar sua empresa?
      </label>
      <input
        type="text"
        className={`w-full border ${errors.ferramentas_utilizadas ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none`}
        placeholder="ERP, Planilhas, WhatsApp, CRM…"
        {...register("ferramentas_utilizadas")}
      />
      {errors.ferramentas_utilizadas && (
        <p className="text-red-500 text-xs mb-4">{errors.ferramentas_utilizadas.message}</p>
      )}

      {/* 10. Tentou resolver essas fraquezas? */}
      <label className="block mb-2 font-medium">
        Você já tentou resolver alguma dessas fraquezas?
      </label>
      <select
        className={`w-full border ${errors.tentativas_resolucao ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none`}
        {...register("tentativas_resolucao")}
      >
        <option value="">Selecione...</option>
        {tentativasResolucaoOpcoes.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {errors.tentativas_resolucao && (
        <p className="text-red-500 text-xs mb-2">{errors.tentativas_resolucao.message}</p>
      )}
      
      {/* Condicional campo motivo */}
      {tentativasResolucao === "Sim, mas sem sucesso" && (
        <>
          <label className="block mb-2 font-medium">
            O que foi tentado e por que não funcionou?
          </label>
          <input
            type="text"
            className={`w-full border ${errors.tentativa_falha_motivo ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none`}
            {...register("tentativa_falha_motivo")}
          />
          {errors.tentativa_falha_motivo && (
            <p className="text-red-500 text-xs mb-4">{errors.tentativa_falha_motivo.message}</p>
          )}
        </>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-[#ef0002] text-white font-bold px-8 py-2 mt-6 rounded"
        >
          Próxima etapa: Oportunidades
        </Button>
      </div>
    </form>
  );
}
