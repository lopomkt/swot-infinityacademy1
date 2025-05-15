import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FraquezasData } from "@/types/formData";

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
  const [form, setForm] = useState<FraquezasData>({
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
  });

  function handleChange<K extends keyof FraquezasData>(key: K, value: FraquezasData[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleCheckbox(value: string) {
    setForm((prev) => {
      const arr = prev.pontos_inconsistentes.includes(value)
        ? prev.pontos_inconsistentes.filter((v) => v !== value)
        : [...prev.pontos_inconsistentes, value];
      // If current fraqueza_critica isn't among selected anymore, reset it
      let fc = prev.fraqueza_critica;
      if (fc && !arr.includes(fc)) fc = "";
      return { ...prev, pontos_inconsistentes: arr, fraqueza_critica: fc };
    });
  }

  // For dynamic count, only count if field is not empty or default
  function countFilledFields(f: FraquezasData) {
    let count = 0;
    if (f.pontos_inconsistentes.length) count++;
    if (f.fraqueza_critica) count++;
    if (f.bloqueio_estrategico?.trim()) count++;
    if (f.centralizacao_gestao) count++;
    if (f.retrabalho_frequente?.trim()) count++;
    if (
      typeof f.clareza_funcoes === "number" &&
      f.clareza_funcoes !== 0
    ) count++;
    if (f.documentacao_processos) count++;
    if (f.indicadores_ativos) count++;
    if (f.ferramentas_utilizadas?.trim()) count++;
    if (f.tentativas_resolucao) count++;
    if (
      f.tentativas_resolucao === "Sim, mas sem sucesso" &&
      f.tentativa_falha_motivo?.trim()
    ) count++;
    return count;
  }

  const isValid = countFilledFields(form) >= 8;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) {
      const finalData = { ...form, step_fraquezas_ok: true };
      // TODO: Auto-save to Supabase here
      onComplete(finalData);
    }
  }

  return (
    <form
      className="w-full bg-white rounded-xl p-1 sm:p-6 shadow-sm border border-[#f1eaea] max-w-lg animate-fade-in"
      onSubmit={handleSubmit}
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
      <div className="flex flex-col gap-2 mb-4">
        {inconsistenciaOpcoes.map(opt => (
          <label
            key={opt}
            className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer border font-medium ${
              form.pontos_inconsistentes.includes(opt)
                ? "bg-[#ef0002] text-white border-[#ef0002]"
                : "bg-gray-100 border-gray-300"
            } transition`}
          >
            <input
              type="checkbox"
              className="accent-[#ef0002] h-4 w-4"
              checked={form.pontos_inconsistentes.includes(opt)}
              onChange={() => handleCheckbox(opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>

      {/* 2. Qual desses pontos é mais crítico hoje? */}
      <label className="block mb-2 font-medium">
        Qual desses pontos é mais crítico hoje?
      </label>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        value={form.fraqueza_critica}
        onChange={e => handleChange("fraqueza_critica", e.target.value)}
        disabled={form.pontos_inconsistentes.length === 0}
      >
        <option value="">Selecione uma opção marcada acima...</option>
        {form.pontos_inconsistentes.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      {/* 3. O que mais trava seu crescimento */}
      <label className="block mb-2 font-medium">
        O que mais trava seu crescimento atualmente?
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        placeholder="Ex: Falta de equipe, baixa conversão de vendas…"
        value={form.bloqueio_estrategico}
        onChange={e => handleChange("bloqueio_estrategico", e.target.value)}
      />

      {/* 4. Depende demais da atuação */}
      <label className="block mb-2 font-medium">
        Você depende demais da sua própria atuação no dia a dia?
      </label>
      <div className="flex gap-3 mb-4">
        {["Sim, totalmente", "Parcialmente", "Não"].map(opt => (
          <label key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              form.centralizacao_gestao === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="centralizacao_gestao"
              className="hidden"
              value={opt}
              checked={form.centralizacao_gestao === opt}
              onChange={() => handleChange("centralizacao_gestao", opt)}
            />
            {opt}
          </label>
        ))}
      </div>

      {/* 5. Retrabalho frequente */}
      <label className="block mb-2 font-medium">
        Qual ponto interno mais gera retrabalho ou perda de tempo?
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        value={form.retrabalho_frequente}
        onChange={e => handleChange("retrabalho_frequente", e.target.value)}
      />

      {/* 6. Equipe sabe o que fazer? */}
      <label className="block mb-2 font-medium">
        Sua equipe sabe exatamente o que deve fazer?
      </label>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={form.clareza_funcoes}
          onChange={e => handleChange("clareza_funcoes", Number(e.target.value))}
          className="flex-grow accent-[#b70001]"
        />
        <span className="w-8 text-right text-[#b70001] font-bold">{form.clareza_funcoes}</span>
      </div>

      {/* 7. Processos documentados */}
      <label className="block mb-2 font-medium">
        Seus processos estão documentados e padronizados?
      </label>
      <div className="flex gap-3 mb-4">
        {["Sim", "Parcialmente", "Não"].map(opt => (
          <label key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              form.documentacao_processos === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="documentacao_processos"
              className="hidden"
              value={opt}
              checked={form.documentacao_processos === opt}
              onChange={() => handleChange("documentacao_processos", opt)}
            />
            {opt}
          </label>
        ))}
      </div>

      {/* 8. Possui indicadores */}
      <label className="block mb-2 font-medium">
        Você possui indicadores ou métricas para acompanhar resultados?
      </label>
      <div className="flex gap-3 mb-4">
        {["Sim", "Em construção", "Não"].map(opt => (
          <label key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              form.indicadores_ativos === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="indicadores_ativos"
              className="hidden"
              value={opt}
              checked={form.indicadores_ativos === opt}
              onChange={() => handleChange("indicadores_ativos", opt)}
            />
            {opt}
          </label>
        ))}
      </div>

      {/* 9. Ferramentas utilizadas */}
      <label className="block mb-2 font-medium">
        Quais ferramentas você usa hoje para gerenciar sua empresa?
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        placeholder="ERP, Planilhas, WhatsApp, CRM…"
        value={form.ferramentas_utilizadas}
        onChange={e => handleChange("ferramentas_utilizadas", e.target.value)}
      />

      {/* 10. Tentou resolver essas fraquezas? */}
      <label className="block mb-2 font-medium">
        Você já tentou resolver alguma dessas fraquezas?
      </label>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 font-medium focus:border-[#b70001] focus:outline-none"
        value={form.tentativas_resolucao}
        onChange={e => handleChange("tentativas_resolucao", e.target.value)}
      >
        <option value="">Selecione...</option>
        {tentativasResolucaoOpcoes.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {/* Condicional campo motivo */}
      {form.tentativas_resolucao === "Sim, mas sem sucesso" && (
        <>
          <label className="block mb-2 font-medium">
            O que foi tentado e por que não funcionou?
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
            value={form.tentativa_falha_motivo ?? ""}
            onChange={e => handleChange("tentativa_falha_motivo", e.target.value)}
          />
        </>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-[#ef0002] text-white font-bold px-8 py-2 mt-6 rounded"
          disabled={!isValid}
        >
          Próxima etapa: Oportunidades
        </Button>
      </div>
    </form>
  );
}
