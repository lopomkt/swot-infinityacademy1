import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SaudeFinanceiraData } from "@/types/formData";

interface Props {
  defaultValues?: Partial<SaudeFinanceiraData>;
  onComplete: (data: SaudeFinanceiraData) => void;
}

const opcoesSelectCaixa = [
  "Sim, com folga",
  "Sim, mas limitado",
  "Não"
];

const opcoesAutonomia = [
  "Até 15 dias",
  "De 15 a 30 dias",
  "1 a 2 meses",
  "Mais de 2 meses"
];

const opcoesControle = [
  "Sim, atualizado",
  "Sim, mas desorganizado",
  "Não existe controle real"
];

const opcoesFluxo = [
  "Diário",
  "Semanal",
  "Mensal",
  "Sem rotina definida"
];

const opcoesEndividamento = [
  "Sem dívidas",
  "Dívidas sob controle",
  "Endividamento alto"
];

const opcoesInadimplencia = [
  "Sim",
  "Não",
  "Não aplicável"
];

const opcoesCAC = [
  "Sim",
  "Não",
  "Tenho uma estimativa"
];

const opcoesOrcamento = [
  "Sim, já definido",
  "Ainda não, mas consigo alocar",
  "Ainda não tenho recursos"
];

const opcoesIntencaoInvestimento = [
  "Sim",
  "Talvez",
  "Não"
];

const opcoesMaturidade = [
  "Iniciante (sem controle real)",
  "Intermediária (controle básico, visão parcial)",
  "Avançada (indicadores, metas, projeções)"
];

const getFieldsCount = (form: SaudeFinanceiraData) => {
  let count = 0;
  if (form.caixa_disponivel) count++;
  if (form.autonomia_caixa) count++;
  if (form.controle_financeiro) count++;
  if (form.fluxo_frequencia) count++;
  if (form.endividamento_nivel) count++;
  if (form.inadimplencia_clientes) count++;
  if (form.custos_fixos && form.custos_fixos.trim().length > 0) count++;
  if (form.cac_estimado_conhecimento) count++;
  if (
    (form.cac_estimado_conhecimento === "Sim" || form.cac_estimado_conhecimento === "Tenho uma estimativa") &&
    form.cac_estimado && form.cac_estimado.trim().length > 0
  ) count++;
  if (form.orcamento_planejado) count++;
  if (form.orcamento_planejado === "Ainda não tenho recursos" && form.intencao_investimento) count++;
  if (form.maturidade_financeira) count++;
  return count;
};

export default function FormStepSaudeFinanceira({ defaultValues, onComplete }: Props) {
  const [form, setForm] = useState<SaudeFinanceiraData>({
    caixa_disponivel: "",
    autonomia_caixa: "",
    controle_financeiro: "",
    fluxo_frequencia: "",
    endividamento_nivel: "",
    inadimplencia_clientes: "",
    custos_fixos: "",
    cac_estimado_conhecimento: "",
    cac_estimado: "",
    orcamento_planejado: "",
    intencao_investimento: "",
    maturidade_financeira: "",
    step_financas_ok: false,
    ...defaultValues
  });

  const handleChange = <K extends keyof SaudeFinanceiraData>(key: K, value: SaudeFinanceiraData[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filled = getFieldsCount(form);
  const isValid = filled >= 9;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) {
      const finalData: SaudeFinanceiraData = {
        ...form,
        step_financas_ok: true,
        cac_estimado: (form.cac_estimado_conhecimento === "Sim" || form.cac_estimado_conhecimento === "Tenho uma estimativa") ? form.cac_estimado : "",
        intencao_investimento: form.orcamento_planejado === "Ainda não tenho recursos" ? form.intencao_investimento : undefined,
      };
      // TODO: Auto-save para Supabase aqui.
      onComplete(finalData);
    }
  }

  return (
    <form
      className="w-full bg-white rounded-xl p-1 sm:p-6 shadow-sm border border-[#f1eaea] max-w-lg animate-fade-in"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <h2 className="font-bold text-2xl text-[#560005] mb-3">Etapa 6 – SAÚDE FINANCEIRA</h2>
      <p className="text-base text-black mb-5">
        Vamos entender a realidade financeira da sua empresa
      </p>
      <p className="text-sm text-gray-500 mb-8">
        Essas informações não precisam ser exatas, mas ajudam a calibrar as ações possíveis dentro do seu diagnóstico final.
      </p>

      {/* caixa_disponivel */}
      <label className="block mb-2 font-medium">
        Sua empresa possui caixa hoje para investir em melhorias?
      </label>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        value={form.caixa_disponivel}
        onChange={e => handleChange("caixa_disponivel", e.target.value)}
      >
        <option value="">Selecione...</option>
        {opcoesSelectCaixa.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      {/* autonomia_caixa */}
      <label className="block mb-2 font-medium">
        Quanto tempo esse caixa cobre a operação sem novas receitas?
      </label>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        value={form.autonomia_caixa}
        onChange={e => handleChange("autonomia_caixa", e.target.value)}
      >
        <option value="">Selecione...</option>
        {opcoesAutonomia.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      {/* controle_financeiro */}
      <label className="block mb-2 font-medium">
        Existe controle financeiro estruturado na empresa?
      </label>
      <div className="flex gap-3 mb-4">
        {opcoesControle.map(opt => (
          <label key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              form.controle_financeiro === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="controle_financeiro"
              className="hidden"
              value={opt}
              checked={form.controle_financeiro === opt}
              onChange={() => handleChange("controle_financeiro", opt)}
            />
            {opt}
          </label>
        ))}
      </div>

      {/* fluxo_frequencia */}
      <label className="block mb-2 font-medium">
        Como o fluxo de caixa é acompanhado?
      </label>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        value={form.fluxo_frequencia}
        onChange={e => handleChange("fluxo_frequencia", e.target.value)}
      >
        <option value="">Selecione...</option>
        {opcoesFluxo.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      {/* endividamento_nivel */}
      <label className="block mb-2 font-medium">
        Qual seu nível atual de endividamento?
      </label>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        value={form.endividamento_nivel}
        onChange={e => handleChange("endividamento_nivel", e.target.value)}
      >
        <option value="">Selecione...</option>
        {opcoesEndividamento.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      {/* inadimplencia_clientes */}
      <label className="block mb-2 font-medium">
        Sua empresa possui inadimplência alta de clientes?
      </label>
      <div className="flex gap-3 mb-4">
        {opcoesInadimplencia.map(opt => (
          <label key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              form.inadimplencia_clientes === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="inadimplencia_clientes"
              className="hidden"
              value={opt}
              checked={form.inadimplencia_clientes === opt}
              onChange={() => handleChange("inadimplencia_clientes", opt)}
            />
            {opt}
          </label>
        ))}
      </div>

      {/* custos_fixos */}
      <label className="block mb-2 font-medium">
        Quais são os maiores custos fixos mensais da empresa?
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        placeholder="Ex: folha de pagamento, aluguel, fornecedores…"
        value={form.custos_fixos}
        onChange={e => handleChange("custos_fixos", e.target.value)}
      />

      {/* cac_estimado_conhecimento */}
      <label className="block mb-2 font-medium">
        Você conhece o custo de aquisição de cliente (CAC) médio?
      </label>
      <div className="flex gap-3 mb-4">
        {opcoesCAC.map(opt => (
          <label key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              form.cac_estimado_conhecimento === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="cac_estimado_conhecimento"
              className="hidden"
              value={opt}
              checked={form.cac_estimado_conhecimento === opt}
              onChange={() => handleChange("cac_estimado_conhecimento", opt)}
            />
            {opt}
          </label>
        ))}
      </div>

      {/* cac_estimado - conditional */}
      {(form.cac_estimado_conhecimento === "Sim" || form.cac_estimado_conhecimento === "Tenho uma estimativa") && (
        <>
          <label className="block mb-2 font-medium">
            Qual valor estimado?
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
            value={form.cac_estimado}
            onChange={e => handleChange("cac_estimado", e.target.value)}
          />
        </>
      )}

      {/* orcamento_planejado */}
      <label className="block mb-2 font-medium">
        Existe orçamento reservado para implementar ações estratégicas?
      </label>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        value={form.orcamento_planejado}
        onChange={e => handleChange("orcamento_planejado", e.target.value)}
      >
        <option value="">Selecione...</option>
        {opcoesOrcamento.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      {/* intencao_investimento - condicional */}
      {form.orcamento_planejado === "Ainda não tenho recursos" && (
        <>
          <label className="block mb-2 font-medium">
            Caso surja uma solução viável e de alto impacto, você consideraria investimento?
          </label>
          <div className="flex gap-3 mb-4">
            {opcoesIntencaoInvestimento.map(opt => (
              <label key={opt}
                className={`px-4 py-2 rounded cursor-pointer border transition ${
                  form.intencao_investimento === opt
                    ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="intencao_investimento"
                  className="hidden"
                  value={opt}
                  checked={form.intencao_investimento === opt}
                  onChange={() => handleChange("intencao_investimento", opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </>
      )}

      {/* maturidade_financeira */}
      <label className="block mb-2 font-medium">
        Como você classificaria a maturidade financeira da empresa?
      </label>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        value={form.maturidade_financeira}
        onChange={e => handleChange("maturidade_financeira", e.target.value)}
      >
        <option value="">Selecione...</option>
        {opcoesMaturidade.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-[#ef0002] text-white font-bold px-8 py-2 mt-6 rounded"
          disabled={!isValid}
        >
          Avançar para Prioridades
        </Button>
      </div>
    </form>
  );
}
