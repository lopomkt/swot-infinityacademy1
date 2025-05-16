import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ameacasSchema, AmeacasSchema } from "@/schemas/ameacasSchema";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

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
  // Inicializa o formulário com validação Zod
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

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors }
  } = form;
  
  // Watch values for conditional logic
  const sazonalidade_negocio = watch("sazonalidade_negocio");
  const perdas_externas = watch("perdas_externas");
  const impacto_ameacas = watch("impacto_ameacas");
  const dependencia_plataformas = watch("dependencia_plataformas") || [];

  // Toggle platform in array
  const togglePlataforma = (option: string) => {
    const currentValues = [...(dependencia_plataformas || [])];
    
    if (currentValues.includes(option)) {
      // Remove if already exists
      setValue(
        "dependencia_plataformas", 
        currentValues.filter((v) => v !== option)
      );
    } else {
      // Add if it doesn't exist, handling "Nenhuma" special case
      if (option === "Nenhuma") {
        setValue("dependencia_plataformas", ["Nenhuma"]);
      } else {
        setValue(
          "dependencia_plataformas", 
          [...currentValues.filter(v => v !== "Nenhuma"), option]
        );
      }
    }
  };

  // Verifica se há erros gerais no formulário para exibir ao usuário
  const hasGeneralErrors = errors.root?.message;
  
  // Submission handler
  const onSubmit = (data: AmeacasSchema) => {
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

    // Estrutura os dados para a próxima etapa
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
      // Add the responses array for the matrix view
      respostas: responses,
      // Tag técnica de conclusão
      validacao_ameacas_ok: true
    };
    
    // Pronto para integração com Supabase:
    // saveOnSupabase('etapa5_ameacas', payload)
    onComplete(payload);
    toast({ title: "Etapa de ameaças salva com sucesso." });
  };

  return (
    <Form {...form}>
      <form className="w-full max-w-xl space-y-6 animate-fade-in" onSubmit={handleSubmit(onSubmit)}>
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
            {...register("fator_preocupante")}
            placeholder="Ex: crise econômica, mudanças de comportamento, concorrência…"
            maxLength={140}
          />
          {errors.fator_preocupante && (
            <p className="text-red-600 text-xs mt-1">{errors.fator_preocupante.message}</p>
          )}
        </div>

        {/* 2 */}
        <div>
          <label className="font-semibold">2. Algum concorrente direto vem ganhando espaço recentemente?</label>
          <RadioGroup
            value={watch("concorrente_em_ascensao")}
            onValueChange={(value) => setValue("concorrente_em_ascensao", value)}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Sim" id="concorrenteSim" />
              <label htmlFor="concorrenteSim">Sim</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Não" id="concorrenteNao" />
              <label htmlFor="concorrenteNao">Não</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Não sei dizer" id="concorrenteIndefinido" />
              <label htmlFor="concorrenteIndefinido">Não sei dizer</label>
            </div>
          </RadioGroup>
          {errors.concorrente_em_ascensao && (
            <p className="text-red-600 text-xs mt-1">{errors.concorrente_em_ascensao.message}</p>
          )}
        </div>

        {/* 3 */}
        <div>
          <label className="font-semibold">3. Você depende de poucos fornecedores ou parceiros estratégicos?</label>
          <RadioGroup
            value={watch("dependencia_parceiros")}
            onValueChange={(value) => setValue("dependencia_parceiros", value)}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Sim, e isso é um risco" id="dpRisco" />
              <label htmlFor="dpRisco">Sim, e isso é um risco</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Sim, mas está sob controle" id="dpControle" />
              <label htmlFor="dpControle">Sim, mas está sob controle</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Não depende" id="dpNao" />
              <label htmlFor="dpNao">Não depende</label>
            </div>
          </RadioGroup>
          {errors.dependencia_parceiros && (
            <p className="text-red-600 text-xs mt-1">{errors.dependencia_parceiros.message}</p>
          )}
        </div>

        {/* 4 */}
        <div>
          <label className="font-semibold">4. Alguma legislação, regulação ou imposto tem prejudicado seu setor?</label>
          <Select 
            value={watch("ameaca_legislativa")} 
            onValueChange={(value) => setValue("ameaca_legislativa", value)}
          >
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
          {errors.ameaca_legislativa && (
            <p className="text-red-600 text-xs mt-1">{errors.ameaca_legislativa.message}</p>
          )}
        </div>

        {/* 5 */}
        <div>
          <label className="font-semibold">5. Seu negócio sofre com sazonalidade?</label>
          <RadioGroup
            value={watch("sazonalidade_negocio")}
            onValueChange={(value) => setValue("sazonalidade_negocio", value)}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Sim" id="sazSim" />
              <label htmlFor="sazSim">Sim</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Não" id="sazNao" />
              <label htmlFor="sazNao">Não</label>
            </div>
          </RadioGroup>
          {sazonalidade_negocio === "Sim" && (
            <Input
              {...register("detalheSazonalidade")}
              placeholder="Qual época e qual impacto?"
              maxLength={140}
              className="mt-2"
            />
          )}
          {errors.sazonalidade_negocio && (
            <p className="text-red-600 text-xs mt-1">{errors.sazonalidade_negocio.message}</p>
          )}
          {errors.detalheSazonalidade && (
            <p className="text-red-600 text-xs mt-1">{errors.detalheSazonalidade.message}</p>
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
          {errors.dependencia_plataformas && (
            <p className="text-red-600 text-xs mt-1">{errors.dependencia_plataformas.message}</p>
          )}
        </div>

        {/* 7 */}
        <div>
          <label className="font-semibold">7. Você sente que o comportamento dos consumidores está mudando?</label>
          <Select
            value={watch("mudanca_comportamental")}
            onValueChange={(value) => setValue("mudanca_comportamental", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sim, bastante">Sim, bastante</SelectItem>
              <SelectItem value="Sim, mas pouco">Sim, mas pouco</SelectItem>
              <SelectItem value="Ainda não percebi">Ainda não percebi</SelectItem>
            </SelectContent>
          </Select>
          {errors.mudanca_comportamental && (
            <p className="text-red-600 text-xs mt-1">{errors.mudanca_comportamental.message}</p>
          )}
        </div>

        {/* 8 */}
        <div>
          <label className="font-semibold">8. Sua empresa conseguiria operar normalmente por 30 dias em crise externa?</label>
          <RadioGroup
            value={watch("resiliencia_crise")}
            onValueChange={(value) => setValue("resiliencia_crise", value)}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Sim, totalmente" id="rcTotal" />
              <label htmlFor="rcTotal">Sim, totalmente</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Parcialmente" id="rcParcial" />
              <label htmlFor="rcParcial">Parcialmente</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Não conseguiria" id="rcNao" />
              <label htmlFor="rcNao">Não conseguiria</label>
            </div>
          </RadioGroup>
          {errors.resiliencia_crise && (
            <p className="text-red-600 text-xs mt-1">{errors.resiliencia_crise.message}</p>
          )}
        </div>

        {/* 9 */}
        <div>
          <label className="font-semibold">9. Já sofreu com perdas importantes por fatores externos?</label>
          <RadioGroup
            value={watch("perdas_externas")}
            onValueChange={(value) => setValue("perdas_externas", value)}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Sim" id="perdaSim" />
              <label htmlFor="perdaSim">Sim</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Não" id="perdaNao" />
              <label htmlFor="perdaNao">Não</label>
            </div>
          </RadioGroup>
          {perdas_externas === "Sim" && (
            <Textarea
              {...register("detalhePerda")}
              placeholder="Qual foi a situação e como reagiu?"
              maxLength={240}
              className="mt-2"
              rows={2}
            />
          )}
          {errors.perdas_externas && (
            <p className="text-red-600 text-xs mt-1">{errors.perdas_externas.message}</p>
          )}
          {errors.detalhePerda && (
            <p className="text-red-600 text-xs mt-1">{errors.detalhePerda.message}</p>
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
              value={[impacto_ameacas || 0]}
              onValueChange={([val]) => setValue("impacto_ameacas", val)}
              className="w-4/5"
              style={{ accentColor: "#ef0002" }}
            />
            <span className="w-[40px] text-center font-bold text-red-600">{impacto_ameacas || 0}</span>
          </div>
          {impacto_ameacas !== undefined && impacto_ameacas >= 7 && (
            <Textarea
              {...register("estrategia_defesa")}
              placeholder="Você já planejou alguma forma de defesa ou contingência?"
              maxLength={240}
              className="mt-2"
              rows={2}
            />
          )}
          {errors.impacto_ameacas && (
            <p className="text-red-600 text-xs mt-1">{errors.impacto_ameacas.message}</p>
          )}
          {errors.estrategia_defesa && (
            <p className="text-red-600 text-xs mt-1">{errors.estrategia_defesa.message}</p>
          )}
        </div>

        {/* Erro geral (não preencheu 8 campos mínimos) */}
        {hasGeneralErrors && (
          <p className="text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded-md">
            {hasGeneralErrors}
          </p>
        )}

        {/* Botão de avanço */}
        <div className="pt-2 flex justify-end">
          <Button type="submit" className="w-auto">
            Avançar para Saúde Financeira
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormStepAmeacas;
