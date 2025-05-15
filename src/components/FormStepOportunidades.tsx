import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OportunidadesData } from "@/types/formData";

const tendenciasOpcoes = [
  "Digitalização",
  "Sustentabilidade",
  "Consumo local",
  "Personalização",
  "Automação / IA",
  "Empreendedorismo feminino",
  "Economia colaborativa",
  "Outro"
];
const canaisOpcoes = [
  "Tráfego pago",
  "SEO / Conteúdo",
  "Parcerias locais",
  "Franquias",
  "Infoproduto",
  "Licenciamento",
  "Eventos / Feiras",
  "Outro"
];

interface OportunidadesData {
  nova_demanda_cliente: string;
  situacao_mercado: string;
  nichos_ocultos: string;
  concorrentes_enfraquecendo: string;
  tendencias_aproveitaveis: string[];
  tendencias_outro?: string;
  demanda_nao_atendida: string;
  parcerias_possiveis: string;
  recurso_ocioso: string;
  canais_potenciais: string[];
  canais_outro?: string;
  nivel_disposicao: number;
  acao_inicial_oportunidade?: string;
  step_oportunidades_ok: boolean;
  respostas: []; // Adding the required respostas field from the interface
}

interface Props {
  defaultValues?: Partial<OportunidadesData>;
  onComplete: (data: OportunidadesData) => void;
}

export default function FormStepOportunidades({ defaultValues, onComplete }: Props) {
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
    respostas: [], // Adding the required respostas field from the interface
    ...defaultValues,
  });

  const mostrarOutroTendencias = form.tendencias_aproveitaveis.includes("Outro");
  const mostrarOutroCanais = form.canais_potenciais.includes("Outro");
  const mostrarCampoAcaoInicial = form.nivel_disposicao >= 8;

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
    if (mostrarOutroTendencias && data.tendencias_outro?.trim()) c++;
    if (data.demanda_nao_atendida?.trim()) c++;
    if (data.parcerias_possiveis) c++;
    if (data.recurso_ocioso?.trim()) c++;
    if (data.canais_potenciais.length) c++;
    if (mostrarOutroCanais && data.canais_outro?.trim()) c++;
    if (typeof data.nivel_disposicao === "number" && data.nivel_disposicao !== 0) c++;
    if (mostrarCampoAcaoInicial && data.acao_inicial_oportunidade?.trim()) c++;
    return c;
  }

  const isValid = countFilledFields(form) >= 7;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) {
      const finalData = { ...form, step_oportunidades_ok: true };
      // TODO: Auto-save to Supabase as etapa 4
      onComplete(finalData);
    }
  }

  return (
    <form
      className="w-full bg-white rounded-xl p-1 sm:p-6 shadow-sm border border-[#f1eaea] max-w-lg animate-fade-in"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <h2 className="font-bold text-2xl text-[#560005] mb-3">Etapa 4 – OPORTUNIDADES</h2>
      <p className="text-base text-black mb-5">
        Quais oportunidades externas sua empresa pode aproveitar?
      </p>
      <p className="text-sm text-gray-500 mb-8">
        Vamos identificar aberturas de mercado, tendências ou vantagens que você pode explorar para crescer com mais inteligência.
      </p>

      {/* 1. Novas demandas */}
      <label className="block mb-2 font-medium">
        Existem novas demandas ou comportamentos de clientes que você percebeu recentemente?
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        placeholder="Ex: Pedidos por delivery, interesse por serviços online…"
        value={form.nova_demanda_cliente}
        onChange={e => handleChange("nova_demanda_cliente", e.target.value)}
      />

      {/* 2. Situação do mercado */}
      <label className="block mb-2 font-medium">
        Seu mercado está em crescimento, estabilidade ou retração?
      </label>
      <div className="flex gap-3 mb-4">
        {["Em crescimento", "Estável", "Em retração"].map(opt => (
          <label
            key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              form.situacao_mercado === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="situacao_mercado"
              className="hidden"
              value={opt}
              checked={form.situacao_mercado === opt}
              onChange={() => handleChange("situacao_mercado", opt)}
            />
            {opt}
          </label>
        ))}
      </div>

      {/* 3. Nichos ocultos */}
      <label className="block mb-2 font-medium">
        Há nichos pouco explorados no seu setor que você poderia atacar?
      </label>
      <textarea
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        placeholder="Descreva possíveis nichos, públicos ou regiões."
        rows={2}
        value={form.nichos_ocultos}
        onChange={e => handleChange("nichos_ocultos", e.target.value)}
      />

      {/* 4. Concorrentes enfraquecendo */}
      <label className="block mb-2 font-medium">
        Você já identificou concorrentes que estão saindo do mercado ou perdendo força?
      </label>
      <div className="flex gap-3 mb-4">
        {["Sim", "Não", "Não sei"].map(opt => (
          <label
            key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              form.concorrentes_enfraquecendo === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="concorrentes_enfraquecendo"
              className="hidden"
              value={opt}
              checked={form.concorrentes_enfraquecendo === opt}
              onChange={() => handleChange("concorrentes_enfraquecendo", opt)}
            />
            {opt}
          </label>
        ))}
      </div>

      {/* 5. Tendências aproveitáveis */}
      <label className="block mb-2 font-medium">
        Quais tendências recentes você acredita que podem beneficiar sua empresa?
      </label>
      <div className="flex flex-col gap-2 mb-4">
        {tendenciasOpcoes.map(opt => (
          <label
            key={opt}
            className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer border font-medium ${
              form.tendencias_aproveitaveis.includes(opt)
                ? "bg-[#ef0002] text-white border-[#ef0002]"
                : "bg-gray-100 border-gray-300"
            } transition`}
          >
            <input
              type="checkbox"
              className="accent-[#ef0002] h-4 w-4"
              checked={form.tendencias_aproveitaveis.includes(opt)}
              onChange={() => handleCheckbox("tendencias_aproveitaveis", opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
      {mostrarOutroTendencias && (
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
          placeholder="Descreva a tendência"
          value={form.tendencias_outro}
          onChange={e => handleChange("tendencias_outro", e.target.value)}
        />
      )}

      {/* 6. Demanda não atendida */}
      <label className="block mb-2 font-medium">
        Existe algum produto/serviço que seus clientes pedem e você ainda não oferece?
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        value={form.demanda_nao_atendida}
        onChange={e => handleChange("demanda_nao_atendida", e.target.value)}
      />

      {/* 7. Pronto para parcerias */}
      <label className="block mb-2 font-medium">
        Sua empresa está pronta para explorar novas parcerias estratégicas?
      </label>
      <div className="flex gap-3 mb-4">
        {["Sim", "Em análise", "Ainda não"].map(opt => (
          <label
            key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              form.parcerias_possiveis === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="parcerias_possiveis"
              className="hidden"
              value={opt}
              checked={form.parcerias_possiveis === opt}
              onChange={() => handleChange("parcerias_possiveis", opt)}
            />
            {opt}
          </label>
        ))}
      </div>

      {/* 8. Recurso ocioso */}
      <label className="block mb-2 font-medium">
        Qual recurso atual você sente que está subutilizado?
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        placeholder="Ex: Espaço físico, mailing, rede de contatos…"
        value={form.recurso_ocioso}
        onChange={e => handleChange("recurso_ocioso", e.target.value)}
      />

      {/* 9. Canais potenciais */}
      <label className="block mb-2 font-medium">
        Quais canais ou estratégias você ainda não explora, mas gostaria?
      </label>
      <div className="flex flex-col gap-2 mb-4">
        {canaisOpcoes.map(opt => (
          <label
            key={opt}
            className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer border font-medium ${
              form.canais_potenciais.includes(opt)
                ? "bg-[#ef0002] text-white border-[#ef0002]"
                : "bg-gray-100 border-gray-300"
            } transition`}
          >
            <input
              type="checkbox"
              className="accent-[#ef0002] h-4 w-4"
              checked={form.canais_potenciais.includes(opt)}
              onChange={() => handleCheckbox("canais_potenciais", opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
      {mostrarOutroCanais && (
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
          placeholder="Descreva o canal ou estratégia"
          value={form.canais_outro}
          onChange={e => handleChange("canais_outro", e.target.value)}
        />
      )}

      {/* 10. Disposição para explorar oportunidades */}
      <label className="block mb-2 font-medium">
        De 0 a 10, qual a sua disposição em explorar novas oportunidades?
      </label>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={form.nivel_disposicao}
          onChange={e => handleChange("nivel_disposicao", Number(e.target.value))}
          className="flex-grow accent-[#ef0002]"
        />
        <span className="w-8 text-right text-[#ef0002] font-bold">{form.nivel_disposicao}</span>
      </div>

      {/* Condicional: se disposição >=8, campo aberto */}
      {mostrarCampoAcaoInicial && (
        <>
          <label className="block mb-2 font-medium">
            Qual seria sua primeira ação para isso?
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
            value={form.acao_inicial_oportunidade}
            onChange={e => handleChange("acao_inicial_oportunidade", e.target.value)}
          />
        </>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-[#ef0002] text-white font-bold px-8 py-2 mt-6 rounded"
          disabled={!isValid}
        >
          Avançar para Ameaças
        </Button>
      </div>
    </form>
  );
}
