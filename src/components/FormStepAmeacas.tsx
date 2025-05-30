
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileFormWrapper from "@/components/mobile/MobileFormWrapper";
import MobileNavigation from "@/components/mobile/MobileNavigation";
import TouchOptimizedSlider from "@/components/mobile/TouchOptimizedSlider";
import MobileAnswerFeedback from "@/components/mobile/MobileAnswerFeedback";
import { useAmeacasForm } from "@/features/forms/hooks/useAmeacasForm";
import { FormHeader } from "@/features/forms/components/FormHeader";

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
  onBack,
}: {
  defaultValues?: any;
  onComplete: (data: any) => void;
  onBack?: () => void;
}) => {
  const isMobile = useIsMobile();
  const [showFeedback, setShowFeedback] = useState(false);
  
  const formMethods = useAmeacasForm(defaultValues);
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors, isValid },
    handleFormSubmit
  } = formMethods;
  
  const sazonalidade_negocio = watch("sazonalidade_negocio");
  const perdas_externas = watch("perdas_externas");
  const impacto_ameacas = watch("impacto_ameacas");
  const dependencia_plataformas = watch("dependencia_plataformas") || [];

  const togglePlataforma = (option: string) => {
    const currentValues = [...(dependencia_plataformas || [])];
    
    if (currentValues.includes(option)) {
      setValue(
        "dependencia_plataformas", 
        currentValues.filter((v) => v !== option)
      );
    } else {
      if (option === "Nenhuma") {
        setValue("dependencia_plataformas", ["Nenhuma"]);
      } else {
        setValue(
          "dependencia_plataformas", 
          [...currentValues.filter(v => v !== "Nenhuma"), option]
        );
      }
    }

    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1000);
  };

  const formContent = (
    <Form {...formMethods}>
      <form 
        className={`w-full ${isMobile ? '' : 'max-w-xl'} bg-white rounded-xl ${isMobile ? 'px-4 sm:px-6' : 'p-6'} shadow-md mx-auto animate-fade-in`} 
        onSubmit={handleSubmit((data) => handleFormSubmit(data, onComplete))}
        style={isMobile ? { scrollMargin: '120px 0 0 0' } : {}}
      >
        <MobileAnswerFeedback show={showFeedback} />
        
        <FormHeader 
          title="Quais ameaças externas podem comprometer seu crescimento?"
          subtitle="Agora vamos identificar riscos e fatores externos que você não controla, mas que afetam ou podem afetar sua empresa."
        />

        <div className={`space-y-${isMobile ? '4' : '6'} ${isMobile ? 'pb-28' : ''}`}>
          <div>
            <label className="font-semibold">1. Qual fator externo mais preocupa você atualmente?</label>
            <Input
              {...register("fator_preocupante")}
              placeholder="Ex: crise econômica, mudanças de comportamento, concorrência…"
              maxLength={140}
              className="mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">2. Algum concorrente direto vem ganhando espaço recentemente?</label>
            <RadioGroup
              value={watch("concorrente_em_ascensao")}
              onValueChange={(value) => setValue("concorrente_em_ascensao", value)}
              className="flex flex-col gap-2 mt-2"
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
          </div>

          <div>
            <label className="font-semibold">3. Você depende de poucos fornecedores ou parceiros estratégicos?</label>
            <RadioGroup
              value={watch("dependencia_parceiros")}
              onValueChange={(value) => setValue("dependencia_parceiros", value)}
              className="flex flex-col gap-2 mt-2"
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
          </div>

          <div>
            <label className="font-semibold">4. Alguma legislação, regulação ou imposto tem prejudicado seu setor?</label>
            <Select 
              value={watch("ameaca_legislativa")} 
              onValueChange={(value) => setValue("ameaca_legislativa", value)}
            >
              <SelectTrigger className="min-h-[44px] w-full rounded-md text-sm mt-2">
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

          <div>
            <label className="font-semibold">5. Seu negócio sofre com sazonalidade?</label>
            <RadioGroup
              value={watch("sazonalidade_negocio")}
              onValueChange={(value) => setValue("sazonalidade_negocio", value)}
              className="flex flex-col gap-2 mt-2"
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
          </div>

          <div>
            <label className="font-semibold">6. Há risco de dependência de plataformas (Meta, iFood, Google, etc)?</label>
            <div className="flex flex-wrap gap-2 mt-2">
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

          <div>
            <label className="font-semibold">7. Você sente que o comportamento dos consumidores está mudando?</label>
            <Select
              value={watch("mudanca_comportamental")}
              onValueChange={(value) => setValue("mudanca_comportamental", value)}
            >
              <SelectTrigger className="min-h-[44px] w-full rounded-md text-sm mt-2">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sim, bastante">Sim, bastante</SelectItem>
                <SelectItem value="Sim, mas pouco">Sim, mas pouco</SelectItem>
                <SelectItem value="Ainda não percebi">Ainda não percebi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="font-semibold">8. Sua empresa conseguiria operar normalmente por 30 dias em crise externa?</label>
            <RadioGroup
              value={watch("resiliencia_crise")}
              onValueChange={(value) => setValue("resiliencia_crise", value)}
              className="flex flex-col gap-2 mt-2"
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
          </div>

          <div>
            <label className="font-semibold">9. Já sofreu com perdas importantes por fatores externos?</label>
            <RadioGroup
              value={watch("perdas_externas")}
              onValueChange={(value) => setValue("perdas_externas", value)}
              className="flex flex-col gap-2 mt-2"
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
          </div>

          <div>
            <label className="font-semibold">10. Em uma escala de 0 a 10, qual o nível de impacto potencial das ameaças sobre sua empresa hoje?</label>
            <div className="flex items-center gap-3 mt-2">
              {isMobile ? (
                <TouchOptimizedSlider
                  min={0}
                  max={10}
                  step={1}
                  value={impacto_ameacas || 0}
                  onChange={(val) => {
                    setValue("impacto_ameacas", val);
                    setShowFeedback(true);
                    setTimeout(() => setShowFeedback(false), 1000);
                  }}
                  className="flex-1"
                />
              ) : (
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={impacto_ameacas || 0}
                  onChange={(e) => setValue("impacto_ameacas", Number(e.target.value))}
                  className="flex-1 accent-[#ef0002]"
                />
              )}
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
          </div>
        </div>

        {/* Desktop navigation - only show when not mobile */}
        {!isMobile && (
          <div className="hidden sm:flex justify-between pt-4 gap-4 flex-wrap-reverse sm:flex-nowrap">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mr-auto text-sm sm:text-base bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
              >
                ← Voltar
              </button>
            )}
            <Button type="submit" className="bg-[#ef0002] text-white" disabled={!isValid}>
              Avançar para Saúde Financeira
            </Button>
          </div>
        )}
      </form>
    </Form>
  );

  return (
    <>
      {isMobile ? (
        <MobileFormWrapper>
          {formContent}
        </MobileFormWrapper>
      ) : (
        formContent
      )}

      <MobileNavigation
        onNext={handleSubmit((data) => handleFormSubmit(data, onComplete))}
        onBack={onBack}
        nextLabel="Avançar para Saúde Financeira"
        isNextDisabled={!isValid}
      />
    </>
  );
};

export default FormStepAmeacas;
