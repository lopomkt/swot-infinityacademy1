import React from "react";
import { Button } from "@/components/ui/button";
import { SaudeFinanceiraData } from "@/types/formData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saudeFinanceiraSchema, SaudeFinanceiraSchema } from "@/schemas/saudeFinanceiraSchema";

interface Props {
  defaultValues?: Partial<SaudeFinanceiraData>;
  onComplete: (data: SaudeFinanceiraData) => void;
  onBack?: () => void;
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

export default function FormStepSaudeFinanceira({ defaultValues, onComplete, onBack }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<SaudeFinanceiraSchema>({
    resolver: zodResolver(saudeFinanceiraSchema),
    defaultValues: {
      caixa_disponivel: defaultValues?.caixa_disponivel || "",
      autonomia_caixa: defaultValues?.autonomia_caixa || "",
      controle_financeiro: defaultValues?.controle_financeiro || "",
      fluxo_frequencia: defaultValues?.fluxo_frequencia || "",
      endividamento_nivel: defaultValues?.endividamento_nivel || "",
      inadimplencia_clientes: defaultValues?.inadimplencia_clientes || "",
      custos_fixos: defaultValues?.custos_fixos || "",
      cac_estimado_conhecimento: defaultValues?.cac_estimado_conhecimento || "",
      cac_estimado: defaultValues?.cac_estimado || "",
      orcamento_planejado: defaultValues?.orcamento_planejado || "",
      intencao_investimento: defaultValues?.intencao_investimento || "",
      maturidade_financeira: defaultValues?.maturidade_financeira || "",
      step_financas_ok: defaultValues?.step_financas_ok || false,
    },
    mode: "onChange"
  });

  const cac_conhecimento = watch("cac_estimado_conhecimento");
  const orcamento_planejado = watch("orcamento_planejado");
  
  const onSubmit = (data: SaudeFinanceiraSchema) => {
    // Fix: Ensure all required properties from SaudeFinanceiraData are explicitly set
    const finalData: SaudeFinanceiraData = {
      caixa_disponivel: data.caixa_disponivel,
      autonomia_caixa: data.autonomia_caixa,
      controle_financeiro: data.controle_financeiro,
      fluxo_frequencia: data.fluxo_frequencia, 
      endividamento_nivel: data.endividamento_nivel,
      inadimplencia_clientes: data.inadimplencia_clientes,
      custos_fixos: data.custos_fixos,
      cac_estimado_conhecimento: data.cac_estimado_conhecimento,
      orcamento_planejado: data.orcamento_planejado,
      maturidade_financeira: data.maturidade_financeira,
      step_financas_ok: true,
      // Handle conditionally required fields
      cac_estimado: (data.cac_estimado_conhecimento === "Sim" || data.cac_estimado_conhecimento === "Tenho uma estimativa") 
        ? data.cac_estimado || "" 
        : "",
      intencao_investimento: data.orcamento_planejado === "Ainda não tenho recursos" 
        ? data.intencao_investimento 
        : undefined,
    };
    
    // Auto-save para Supabase poderia ser implementado aqui
    onComplete(finalData);
  };

  const ErrorMessage = ({ message }: { message?: string }) => {
    return message ? <p className="text-red-600 text-xs mt-1">{message}</p> : null;
  };

  return (
    <form
      className="w-full bg-white rounded-xl p-1 sm:p-6 shadow-sm border border-[#f1eaea] max-w-lg animate-fade-in"
      onSubmit={handleSubmit(onSubmit)}
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
        className={`w-full border ${errors.caixa_disponivel ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none`}
        {...register("caixa_disponivel")}
      >
        <option value="">Selecione...</option>
        {opcoesSelectCaixa.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ErrorMessage message={errors.caixa_disponivel?.message} />

      {/* autonomia_caixa */}
      <label className="block mb-2 mt-3 font-medium">
        Quanto tempo esse caixa cobre a operação sem novas receitas?
      </label>
      <select
        className={`w-full border ${errors.autonomia_caixa ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none`}
        {...register("autonomia_caixa")}
      >
        <option value="">Selecione...</option>
        {opcoesAutonomia.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ErrorMessage message={errors.autonomia_caixa?.message} />

      {/* controle_financeiro */}
      <label className="block mb-2 mt-3 font-medium">
        Existe controle financeiro estruturado na empresa?
      </label>
      <div className="flex gap-3 mb-1">
        {opcoesControle.map(opt => (
          <label key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              watch("controle_financeiro") === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              className="hidden"
              value={opt}
              {...register("controle_financeiro")}
            />
            {opt}
          </label>
        ))}
      </div>
      <ErrorMessage message={errors.controle_financeiro?.message} />

      {/* fluxo_frequencia */}
      <label className="block mb-2 mt-3 font-medium">
        Como o fluxo de caixa é acompanhado?
      </label>
      <select
        className={`w-full border ${errors.fluxo_frequencia ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none`}
        {...register("fluxo_frequencia")}
      >
        <option value="">Selecione...</option>
        {opcoesFluxo.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ErrorMessage message={errors.fluxo_frequencia?.message} />

      {/* endividamento_nivel */}
      <label className="block mb-2 mt-3 font-medium">
        Qual seu nível atual de endividamento?
      </label>
      <select
        className={`w-full border ${errors.endividamento_nivel ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none`}
        {...register("endividamento_nivel")}
      >
        <option value="">Selecione...</option>
        {opcoesEndividamento.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ErrorMessage message={errors.endividamento_nivel?.message} />

      {/* inadimplencia_clientes */}
      <label className="block mb-2 mt-3 font-medium">
        Sua empresa possui inadimplência alta de clientes?
      </label>
      <div className="flex gap-3 mb-1">
        {opcoesInadimplencia.map(opt => (
          <label key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              watch("inadimplencia_clientes") === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              className="hidden"
              value={opt}
              {...register("inadimplencia_clientes")}
            />
            {opt}
          </label>
        ))}
      </div>
      <ErrorMessage message={errors.inadimplencia_clientes?.message} />

      {/* custos_fixos */}
      <label className="block mb-2 mt-3 font-medium">
        Quais são os maiores custos fixos mensais da empresa?
      </label>
      <input
        type="text"
        className={`w-full border ${errors.custos_fixos ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none`}
        placeholder="Ex: folha de pagamento, aluguel, fornecedores…"
        {...register("custos_fixos")}
      />
      <ErrorMessage message={errors.custos_fixos?.message} />

      {/* cac_estimado_conhecimento */}
      <label className="block mb-2 mt-3 font-medium">
        Você conhece o custo de aquisição de cliente (CAC) médio?
      </label>
      <div className="flex gap-3 mb-1">
        {opcoesCAC.map(opt => (
          <label key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              watch("cac_estimado_conhecimento") === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              className="hidden"
              value={opt}
              {...register("cac_estimado_conhecimento")}
            />
            {opt}
          </label>
        ))}
      </div>
      <ErrorMessage message={errors.cac_estimado_conhecimento?.message} />

      {/* cac_estimado - conditional */}
      {(cac_conhecimento === "Sim" || cac_conhecimento === "Tenho uma estimativa") && (
        <>
          <label className="block mb-2 mt-3 font-medium">
            Qual valor estimado?
          </label>
          <input
            type="text"
            className={`w-full border ${errors.cac_estimado ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none`}
            {...register("cac_estimado")}
          />
          <ErrorMessage message={errors.cac_estimado?.message} />
        </>
      )}

      {/* orcamento_planejado */}
      <label className="block mb-2 mt-3 font-medium">
        Existe orçamento reservado para implementar ações estratégicas?
      </label>
      <select
        className={`w-full border ${errors.orcamento_planejado ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none`}
        {...register("orcamento_planejado")}
      >
        <option value="">Selecione...</option>
        {opcoesOrcamento.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ErrorMessage message={errors.orcamento_planejado?.message} />

      {/* intencao_investimento - condicional */}
      {orcamento_planejado === "Ainda não tenho recursos" && (
        <>
          <label className="block mb-2 mt-3 font-medium">
            Caso surja uma solução viável e de alto impacto, você consideraria investimento?
          </label>
          <div className="flex gap-3 mb-1">
            {opcoesIntencaoInvestimento.map(opt => (
              <label key={opt}
                className={`px-4 py-2 rounded cursor-pointer border transition ${
                  watch("intencao_investimento") === opt
                    ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  className="hidden"
                  value={opt}
                  {...register("intencao_investimento")}
                />
                {opt}
              </label>
            ))}
          </div>
          <ErrorMessage message={errors.intencao_investimento?.message} />
        </>
      )}

      {/* maturidade_financeira */}
      <label className="block mb-2 mt-3 font-medium">
        Como você classificaria a maturidade financeira da empresa?
      </label>
      <select
        className={`w-full border ${errors.maturidade_financeira ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 mb-1 font-medium focus:border-[#b70001] focus:outline-none`}
        {...register("maturidade_financeira")}
      >
        <option value="">Selecione...</option>
        {opcoesMaturidade.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ErrorMessage message={errors.maturidade_financeira?.message} />

      <div className="flex justify-between pt-4 gap-4 flex-wrap-reverse sm:flex-nowrap">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mr-auto text-sm sm:text-base bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
          >
            ← Voltar
          </button>
        )}
        <Button
          type="submit"
          className="bg-[#ef0002] text-white font-bold px-8 py-2 mt-6 rounded"
        >
          Avançar para Prioridades
        </Button>
      </div>

      {/* Flag de validação */}
      {isValid && <input type="hidden" name="validacao_financeira_ok" value="true" />}
    </form>
  );
}

const ErrorMessage = ({ message }: { message?: string }) => {
  return message ? <p className="text-red-600 text-xs mt-1">{message}</p> : null;
};
