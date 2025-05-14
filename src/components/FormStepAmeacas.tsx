
import React, { useState, useEffect, Fragment } from "react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const dependenciaPlataformasOpcoes = [
  "Instagram / Meta",
  "WhatsApp",
  "Google",
  "iFood / App de delivery",
  "Marketplaces (Shopee, Mercado Livre etc.)",
  "Nenhuma"
];

const FormStepAmeacas = ({
  defaultValues,
  onComplete,
}: {
  defaultValues?: any;
  onComplete: (data: any) => void;
}) => {
  // Estados centrais de cada campo
  const [fator_preocupante, setFatorPreocupante] = useState(defaultValues?.fator_preocupante || "");
  const [concorrente_em_ascensao, setConcorrenteEmAscensao] = useState(defaultValues?.concorrente_em_ascensao || "");
  const [dependencia_parceiros, setDependenciaParceiros] = useState(defaultValues?.dependencia_parceiros || "");
  const [ameaca_legislativa, setAmeacaLegislativa] = useState(defaultValues?.ameaca_legislativa || "");
  const [sazonalidade_negocio, setSazonalidadeNegocio] = useState(defaultValues?.sazonalidade_negocio || "");
  const [detalheSazonalidade, setDetalheSazonalidade] = useState(defaultValues?.detalheSazonalidade || "");
  const [dependencia_plataformas, setDependenciaPlataformas] = useState<string[]>(defaultValues?.dependencia_plataformas || []);
  const [mudanca_comportamental, setMudancaComportamental] = useState(defaultValues?.mudanca_comportamental || "");
  const [resiliencia_crise, setResilienciaCrise] = useState(defaultValues?.resiliencia_crise || "");
  const [perdas_externas, setPerdasExternas] = useState(defaultValues?.perdas_externas || "");
  const [detalhePerda, setDetalhePerda] = useState(defaultValues?.detalhePerda || "");
  const [impacto_ameacas, setImpactoAmeacas] = useState(defaultValues?.impacto_ameacas ?? 0);
  const [estrategia_defesa, setEstrategiaDefesa] = useState(defaultValues?.estrategia_defesa || "");

  // Validação de campos obrigatórios (mínimo 8 respostas)
  const respostaSazonalidade = sazonalidade_negocio === "Sim" ? detalheSazonalidade : undefined;
  const respostaPerda = perdas_externas === "Sim" ? detalhePerda : undefined;
  const respostaEstrategia = impacto_ameacas >= 7 ? estrategia_defesa : undefined;

  const respostas = [
    fator_preocupante,
    concorrente_em_ascensao,
    dependencia_parceiros,
    ameaca_legislativa,
    sazonalidade_negocio,
    ...(sazonalidade_negocio === "Sim" ? [detalheSazonalidade] : []),
    dependencia_plataformas && dependencia_plataformas.length > 0 ? dependencia_plataformas.join(",") : "",
    mudanca_comportamental,
    resiliencia_crise,
    perdas_externas,
    ...(perdas_externas === "Sim" ? [detalhePerda] : []),
    impacto_ameacas !== undefined ? impacto_ameacas : "",
    ...(impacto_ameacas >= 7 ? [estrategia_defesa] : [])
  ];
  const preenchidas = respostas.filter(
    (val) => typeof val === "number" ? true : (val && val !== "" && val !== undefined)
  ).length;

  // Submissão
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (preenchidas < 8) {
      toast({
        title: "Preencha pelo menos 8 campos para avançar.",
        variant: "destructive"
      });
      return;
    }
    // Estrutura do objeto conforme instrução
    const payload = {
      fator_preocupante,
      concorrente_em_ascensao,
      dependencia_parceiros,
      ameaca_legislativa,
      sazonalidade_negocio,
      ...(sazonalidade_negocio === "Sim" && { detalhe_sazonalidade: detalheSazonalidade }),
      dependencia_plataformas,
      mudanca_comportamental,
      resiliencia_crise,
      perdas_externas,
      ...(perdas_externas === "Sim" && { detalhe_perda: detalhePerda }),
      impacto_ameacas,
      ...(impacto_ameacas >= 7 && { estrategia_defesa }),
      step_ameacas_ok: true
    };
    // Pronto para integração com Supabase:
    // saveOnSupabase('etapa5_ameacas', payload)
    onComplete(payload);
    toast({ title: "Etapa de ameaças salva com sucesso." });
  }

  // Checkbox handler para múltiplas seleções
  const togglePlataforma = (option: string) => {
    setDependenciaPlataformas((prev) =>
      prev.includes(option) ? prev.filter((v) => v !== option) : [...prev.filter(v => v !== "Nenhuma"), option]
    );
    // Se selecionar "Nenhuma", desmarca todas as outras
    if (option === "Nenhuma") setDependenciaPlataformas(["Nenhuma"]);
  };

  // Se selecionar outra opção e "Nenhuma" estiver marcada, desmarca "Nenhuma"
  useEffect(() => {
    if (dependencia_plataformas.some((item) => item !== "Nenhuma") && dependencia_plataformas.includes("Nenhuma")) {
      setDependenciaPlataformas(dependencia_plataformas.filter((v) => v !== "Nenhuma"));
    }
  }, [dependencia_plataformas]);

  return (
    <form className="w-full max-w-xl space-y-6 animate-fade-in" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-2xl font-bold mb-1">Quais ameaças externas podem comprometer seu crescimento?</h2>
        <p className="text-base text-muted-foreground">
          Agora vamos identificar riscos e fatores externos que você não controla, mas que afetam ou podem afetar sua empresa.
        </p>
      </div>

      {/* 1 */}
      <div>
        <label className="font-semibold">1. Qual fator externo mais preocupa você atualmente?</label>
        <Input
          placeholder="Ex: crise econômica, mudanças de comportamento, concorrência…"
          value={fator_preocupante}
          onChange={(e) => setFatorPreocupante(e.target.value)}
          maxLength={140}
        />
      </div>

      {/* 2 */}
      <div>
        <label className="font-semibold">2. Algum concorrente direto vem ganhando espaço recentemente?</label>
        <RadioGroup
          value={concorrente_em_ascensao}
          onValueChange={setConcorrenteEmAscensao}
          className="flex flex-col gap-2"
        >
          <RadioGroupItem value="Sim" id="concorrenteSim" />
          <label htmlFor="concorrenteSim">Sim</label>
          <RadioGroupItem value="Não" id="concorrenteNao" />
          <label htmlFor="concorrenteNao">Não</label>
          <RadioGroupItem value="Não sei dizer" id="concorrenteIndefinido" />
          <label htmlFor="concorrenteIndefinido">Não sei dizer</label>
        </RadioGroup>
      </div>

      {/* 3 */}
      <div>
        <label className="font-semibold">3. Você depende de poucos fornecedores ou parceiros estratégicos?</label>
        <RadioGroup
          value={dependencia_parceiros}
          onValueChange={setDependenciaParceiros}
          className="flex flex-col gap-2"
        >
          <RadioGroupItem value="Sim, e isso é um risco" id="dpRisco" />
          <label htmlFor="dpRisco">Sim, e isso é um risco</label>
          <RadioGroupItem value="Sim, mas está sob controle" id="dpControle" />
          <label htmlFor="dpControle">Sim, mas está sob controle</label>
          <RadioGroupItem value="Não depende" id="dpNao" />
          <label htmlFor="dpNao">Não depende</label>
        </RadioGroup>
      </div>

      {/* 4 */}
      <div>
        <label className="font-semibold">4. Alguma legislação, regulação ou imposto tem prejudicado seu setor?</label>
        <Select value={ameaca_legislativa} onValueChange={setAmeacaLegislativa}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sim, diretamente">Sim, diretamente</SelectItem>
            <SelectItem value="Sim, de forma leve">Sim, de forma leve</SelectItem>
            <SelectItem value="Ainda não, mas temo mudanças">Ainda não, mas temo mudanças</SelectItem>
            <SelectItem value="Não">Não</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 5 */}
      <div>
        <label className="font-semibold">5. Seu negócio sofre com sazonalidade?</label>
        <RadioGroup
          value={sazonalidade_negocio}
          onValueChange={setSazonalidadeNegocio}
          className="flex flex-col gap-2"
        >
          <RadioGroupItem value="Sim" id="sazSim" />
          <label htmlFor="sazSim">Sim</label>
          <RadioGroupItem value="Não" id="sazNao" />
          <label htmlFor="sazNao">Não</label>
        </RadioGroup>
        {sazonalidade_negocio === "Sim" && (
          <Input
            placeholder="Qual época e qual impacto?"
            value={detalheSazonalidade}
            onChange={(e) => setDetalheSazonalidade(e.target.value)}
            maxLength={140}
            className="mt-2"
          />
        )}
      </div>

      {/* 6 */}
      <div>
        <label className="font-semibold">6. Há risco de dependência de plataformas (Meta, iFood, Google, etc)?</label>
        <div className="flex flex-wrap gap-2">
          {dependenciaPlataformasOpcoes.map((option) => (
            <div className="flex items-center gap-1" key={option}>
              <Checkbox
                checked={dependencia_plataformas.includes(option)}
                onCheckedChange={() => togglePlataforma(option)}
                id={option}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
      </div>

      {/* 7 */}
      <div>
        <label className="font-semibold">7. Você sente que o comportamento dos consumidores está mudando?</label>
        <Select value={mudanca_comportamental} onValueChange={setMudancaComportamental}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sim, bastante">Sim, bastante</SelectItem>
            <SelectItem value="Sim, mas pouco">Sim, mas pouco</SelectItem>
            <SelectItem value="Ainda não percebi">Ainda não percebi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 8 */}
      <div>
        <label className="font-semibold">8. Sua empresa conseguiria operar normalmente por 30 dias em crise externa?</label>
        <RadioGroup
          value={resiliencia_crise}
          onValueChange={setResilienciaCrise}
          className="flex flex-col gap-2"
        >
          <RadioGroupItem value="Sim, totalmente" id="rcTotal" />
          <label htmlFor="rcTotal">Sim, totalmente</label>
          <RadioGroupItem value="Parcialmente" id="rcParcial" />
          <label htmlFor="rcParcial">Parcialmente</label>
          <RadioGroupItem value="Não conseguiria" id="rcNao" />
          <label htmlFor="rcNao">Não conseguiria</label>
        </RadioGroup>
      </div>

      {/* 9 */}
      <div>
        <label className="font-semibold">9. Já sofreu com perdas importantes por fatores externos?</label>
        <RadioGroup
          value={perdas_externas}
          onValueChange={setPerdasExternas}
          className="flex flex-col gap-2"
        >
          <RadioGroupItem value="Sim" id="perdaSim" />
          <label htmlFor="perdaSim">Sim</label>
          <RadioGroupItem value="Não" id="perdaNao" />
          <label htmlFor="perdaNao">Não</label>
        </RadioGroup>
        {perdas_externas === "Sim" && (
          <Textarea
            placeholder="Qual foi a situação e como reagiu?"
            value={detalhePerda}
            onChange={(e) => setDetalhePerda(e.target.value)}
            maxLength={240}
            className="mt-2"
            rows={2}
          />
        )}
      </div>

      {/* 10 */}
      <div>
        <label className="font-semibold">10. Em uma escala de 0 a 10, qual o nível de impacto potencial das ameaças sobre sua empresa hoje?</label>
        <div className="flex items-center gap-3 mt-1">
          <Slider
            min={0}
            max={10}
            step={1}
            value={[impacto_ameacas]}
            onValueChange={([val]) => setImpactoAmeacas(val)}
            className="w-4/5"
            style={{ accentColor: "#ef0002" }}
          />
          <span className="w-[40px] text-center font-bold text-red-600">{impacto_ameacas}</span>
        </div>
        {impacto_ameacas >= 7 && (
          <Textarea
            placeholder="Você já planejou alguma forma de defesa ou contingência?"
            value={estrategia_defesa}
            onChange={(e) => setEstrategiaDefesa(e.target.value)}
            maxLength={240}
            className="mt-2"
            rows={2}
          />
        )}
      </div>

      {/* Botão de avanço */}
      <div className="pt-2 flex justify-end">
        <Button type="submit" disabled={preenchidas < 8} className="w-auto">
          Avançar para Saúde Financeira
        </Button>
      </div>
    </form>
  );
};

export default FormStepAmeacas;
