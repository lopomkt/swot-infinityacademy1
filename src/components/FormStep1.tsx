
import { useState } from "react";
import { Phone } from "lucide-react";

type FormType = {
  nome_responsavel: string;
  nome_empresa: string;
  email: string;
  whatsapp: string;
  segmento: string;
  segmento_outro?: string;
  tempo_operacao: string;
  colaboradores: string;
  faixa_faturamento: string;
  consultoria: string;
  consultoria_experiencia?: string;
  objetivos: string[];
};

const segmentosOptions = [
  "Alimentação",
  "Varejo",
  "Serviços",
  "Saúde",
  "Beleza",
  "Educação",
  "Tecnologia",
  "Construção",
  "Outro",
];
const faturamentoOptions = [
  "Até R$25 mil",
  "R$25 mil a R$100 mil",
  "R$100 mil a R$500 mil",
  "Acima de R$500 mil",
];
const tempoOperacaoOptions = [
  "Menos de 1 ano",
  "1 a 3 anos",
  "4 a 6 anos",
  "Mais de 6 anos",
];
const objetivosOptions = [
  "Aumentar vendas",
  "Reduzir custos",
  "Estruturar marketing",
  "Melhorar processos internos",
  "Escalar operação",
  "Profissionalizar gestão",
  "Expandir ou franquear",
];

interface Props {
  defaultValues?: Partial<FormType>;
  onComplete: (results: FormType) => void;
}

const initialState: FormType = {
  nome_responsavel: "",
  nome_empresa: "",
  email: "",
  whatsapp: "",
  segmento: "",
  segmento_outro: "",
  tempo_operacao: "",
  colaboradores: "",
  faixa_faturamento: "",
  consultoria: "",
  consultoria_experiencia: "",
  objetivos: [],
};

const validateEmail = (email: string) =>
  /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);

const validatePhone = (phone: string) =>
  /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(phone);

function maskPhone(raw: string) {
  const cleaned = raw.replace(/\D/g, "");
  if (cleaned.length <= 2)
    return `(${cleaned}`;
  if (cleaned.length <= 7)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 11)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned
    .slice(7, 11)}`;
}

const FormStep1 = ({ defaultValues, onComplete }: Props) => {
  const [form, setForm] = useState<FormType>({ ...initialState, ...defaultValues });
  const [touched, setTouched] = useState<{ [K in keyof FormType]?: boolean }>({});

  const isValid =
    form.nome_responsavel.trim() &&
    form.nome_empresa.trim() &&
    validateEmail(form.email) &&
    validatePhone(form.whatsapp) &&
    form.segmento &&
    (form.segmento !== "Outro" || form.segmento_outro?.trim()) &&
    form.tempo_operacao &&
    form.colaboradores &&
    form.faixa_faturamento &&
    form.consultoria &&
    (form.consultoria !== "Sim" || form.consultoria_experiencia?.trim()) &&
    form.objetivos.length > 0;

  function handleChange(
    key: keyof FormType,
    value: string | string[]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setTouched((prev) => ({
      ...prev,
      [key]: true,
    }));
    // Limpar campos condicionais
    if (key === "segmento" && value !== "Outro") setForm(f => ({ ...f, segmento_outro: "" }));
    if (key === "consultoria" && value !== "Sim") setForm(f => ({ ...f, consultoria_experiencia: "" }));
  }

  function handleCheckbox(obj: string) {
    setForm((prev) => {
      const selected = prev.objetivos.includes(obj)
        ? prev.objetivos.filter((x) => x !== obj)
        : [...prev.objetivos, obj];
      return { ...prev, objetivos: selected };
    });
    setTouched((prev) => ({
      ...prev,
      objetivos: true,
    }));
  }

  function handlePhone(e: React.ChangeEvent<HTMLInputElement>) {
    let val = e.target.value.replace(/\D/g, "");
    val = val.slice(0, 11);
    setForm((prev) => ({
      ...prev,
      whatsapp: val,
    }));
    setTouched((prev) => ({ ...prev, whatsapp: true }));
  }

  return (
    <form
      className="w-full bg-white rounded-xl p-1 sm:p-6 shadow-sm border border-[#f1eaea] max-w-lg animate-fade-in"
      onSubmit={e => {
        e.preventDefault();
        if (isValid) onComplete(form);
      }}
      autoComplete="off"
    >
      <h2 className="font-bold text-2xl text-[#560005] mb-3">Etapa 1 – Identificação & Contexto Empresarial</h2>
      <p className="text-base text-black mb-5">
        Vamos começar entendendo o básico da sua empresa. Isso nos ajuda a gerar um diagnóstico mais preciso no final.
      </p>

      {/* Nome responsável */}
      <label className="block mb-2 font-medium">Nome completo do responsável *</label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        placeholder="Ex: Camila Rodrigues"
        value={form.nome_responsavel}
        onChange={e => handleChange("nome_responsavel", e.target.value)}
        required
      />

      {/* Nome empresa */}
      <label className="block mb-2 font-medium">Nome da empresa *</label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        placeholder="Ex: Camila Estética Avançada"
        value={form.nome_empresa}
        onChange={e => handleChange("nome_empresa", e.target.value)}
        required
      />

      {/* Email */}
      <label className="block mb-2 font-medium">E-mail para envio do relatório *</label>
      <input
        type="email"
        className={`w-full border rounded px-3 py-2 mb-4 font-medium ${
          !form.email || validateEmail(form.email)
            ? "border-gray-300 focus:border-[#b70001]"
            : "border-red-400"
        } focus:outline-none`}
        placeholder="Ex: contato@empresa.com.br"
        value={form.email}
        onChange={e => handleChange("email", e.target.value)}
        required
      />
      {touched.email && form.email && !validateEmail(form.email) && (
        <span className="text-red-500 text-xs mb-4 block">
          E-mail inválido
        </span>
      )}

      {/* WhatsApp */}
      <label className="block mb-2 font-medium">WhatsApp de contato *</label>
      <div className="flex items-center mb-4">
        <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#560005] mr-2">
          <Phone size={20} color="#fff" />
        </span>
        <input
          type="text"
          className={`w-full border rounded px-3 py-2 font-medium ${
            !form.whatsapp || validatePhone(maskPhone(form.whatsapp))
              ? "border-gray-300 focus:border-[#b70001]"
              : "border-red-400"
          } focus:outline-none`}
          placeholder="(00) 00000-0000"
          maxLength={15}
          value={maskPhone(form.whatsapp)}
          onChange={handlePhone}
          required
        />
      </div>
      {touched.whatsapp && form.whatsapp && !validatePhone(maskPhone(form.whatsapp)) && (
        <span className="text-red-500 text-xs mb-4 block">
          Número inválido. Ex: (99) 98765-4321
        </span>
      )}

      {/* Segmento */}
      <label className="block mb-2 font-medium">Qual o principal segmento da empresa? *</label>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        value={form.segmento}
        onChange={e => handleChange("segmento", e.target.value)}
        required
      >
        <option value="">Selecione...</option>
        {segmentosOptions.map(seg => <option key={seg} value={seg}>{seg}</option>)}
      </select>
      {/* Outro segmento */}
      {form.segmento === "Outro" && (
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 mt-1 font-medium focus:border-[#b70001] focus:outline-none"
          placeholder="Descreva o segmento"
          value={form.segmento_outro ?? ""}
          onChange={e => handleChange("segmento_outro", e.target.value)}
          required
        />
      )}

      {/* Tempo de operação */}
      <label className="block mb-2 font-medium">Tempo de operação da empresa *</label>
      <div className="flex flex-wrap gap-2 mb-4">
        {tempoOperacaoOptions.map(opt => (
          <label
            key={opt}
            className={`px-4 py-2 rounded cursor-pointer border transition ${
              form.tempo_operacao === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              className="hidden"
              name="tempo_operacao"
              value={opt}
              checked={form.tempo_operacao === opt}
              onChange={() => handleChange("tempo_operacao", opt)}
              required
            />
            {opt}
          </label>
        ))}
      </div>

      {/* Colaboradores */}
      <label className="block mb-2 font-medium">Quantos colaboradores diretos? *</label>
      <input
        type="number"
        min={1}
        step={1}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none appearance-none"
        placeholder="Ex: 5"
        value={form.colaboradores}
        onChange={e => handleChange("colaboradores", e.target.value.replace(/\D/g, ""))}
        required
      />

      {/* Faturamento mensal */}
      <label className="block mb-2 font-medium">Faixa de faturamento mensal atual *</label>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
        value={form.faixa_faturamento}
        onChange={e => handleChange("faixa_faturamento", e.target.value)}
        required
      >
        <option value="">Selecione...</option>
        {faturamentoOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      {/* Consultoria anterior */}
      <label className="block mb-2 font-medium">Já participou de alguma consultoria empresarial? *</label>
      <div className="flex gap-4 mb-4">
        {["Sim", "Não"].map(opt => (
          <label
            key={opt}
            className={`px-6 py-2 rounded cursor-pointer border transition ${
              form.consultoria === opt
                ? "bg-[#b70001] text-white font-semibold border-[#b70001]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <input
              type="radio"
              className="hidden"
              name="consultoria"
              value={opt}
              checked={form.consultoria === opt}
              onChange={() => handleChange("consultoria", opt)}
              required
            />
            {opt}
          </label>
        ))}
      </div>
      {/* Detalhe da consultoria se sim */}
      {form.consultoria === "Sim" && (
        <>
          <label className="block mb-2 font-medium">Qual foi e como foi a experiência?</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 font-medium focus:border-[#b70001] focus:outline-none"
            placeholder="Descreva brevemente sua experiência"
            value={form.consultoria_experiencia ?? ""}
            onChange={e => handleChange("consultoria_experiencia", e.target.value)}
            rows={2}
            required
          />
        </>
      )}

      {/* Objetivos */}
      <label className="block mb-2 font-medium">Quais são os principais objetivos da sua empresa hoje? *</label>
      <div className="flex flex-col gap-2 mb-6">
        {objetivosOptions.map(opt => (
          <label
            key={opt}
            className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer border font-medium ${
              form.objetivos.includes(opt)
                ? "bg-[#ef0002] text-white border-[#ef0002]"
                : "bg-gray-100 border-gray-300"
            } transition`}
          >
            <input
              type="checkbox"
              className="accent-[#ef0002] h-4 w-4"
              checked={form.objetivos.includes(opt)}
              onChange={() => handleCheckbox(opt)}
            />
            {opt}
          </label>
        ))}
      </div>

      <button
        type="submit"
        className={`w-full py-3 rounded-lg font-bold text-lg transition ${
          isValid
            ? "bg-[#ef0002] text-white hover:bg-[#b70001] cursor-pointer"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
        disabled={!isValid}
        aria-disabled={!isValid}
      >
        Próxima etapa
      </button>
    </form>
  );
};

export default FormStep1;
