
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OportunidadesData } from "@/types/formData";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileFormWrapper from "@/components/mobile/MobileFormWrapper";
import MobileNavigation from "@/components/mobile/MobileNavigation";
import KeyboardAvoidingWrapper from "@/components/mobile/KeyboardAvoidingWrapper";
import { useOportunidadesForm } from "@/features/forms/hooks/useOportunidadesForm";
import { TransitionMessage } from '@/components/shared/TransitionMessage';

const MESSAGE = "Vamos identificar as oportunidades externas que sua empresa pode aproveitar.";

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

interface Props {
  defaultValues?: Partial<OportunidadesData>;
  onComplete: (data: OportunidadesData) => void;
  onBack?: () => void;
}

export default function FormStepOportunidades({ defaultValues, onComplete, onBack }: Props) {
  const isMobile = useIsMobile();
  const {
    form,
    handleChange,
    handleCheckbox,
    isValid,
    handleFormSubmit
  } = useOportunidadesForm(defaultValues);

  const mostrarOutroTendencias = form.tendencias_aproveitaveis.includes("Outro");
  const mostrarOutroCanais = form.canais_potenciais.includes("Outro");
  const mostrarCampoAcaoInicial = form.nivel_disposicao >= 8;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleFormSubmit(onComplete);
  }

  const handleMobileNext = () => {
    handleFormSubmit(onComplete);
  };

  const formContent = (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <TransitionMessage message={MESSAGE} />
      
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-[#560005]">
            Etapa 4 – OPORTUNIDADES
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <KeyboardAvoidingWrapper>
            <form onSubmit={handleSubmit} autoComplete="off">
              <p className="text-sm text-gray-500 mb-6">
                Vamos identificar aberturas de mercado, tendências ou vantagens que você pode explorar para crescer com mais inteligência.
              </p>

              <div className={`space-y-${isMobile ? '4' : '6'} ${isMobile ? 'pb-[88px]' : ''}`}>
                {/* 1. Novas demandas */}
                <div>
                  <label className="block mb-2 font-medium text-base">
                    Existem novas demandas ou comportamentos de clientes que você percebeu recentemente?
                  </label>
                  <input
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 mb-4 font-medium focus:border-[#ef0002] focus:outline-none focus:ring-2 focus:ring-[#ef0002]"
                    placeholder="Ex: Pedidos por delivery, interesse por serviços online…"
                    value={form.nova_demanda_cliente}
                    onChange={e => handleChange("nova_demanda_cliente", e.target.value)}
                  />
                </div>

                {/* 2. Situação do mercado */}
                <div>
                  <label className="block mb-2 font-medium text-base">
                    Seu mercado está em crescimento, estabilidade ou retração?
                  </label>
                  <div className="flex gap-3 mb-4">
                    {["Em crescimento", "Estável", "Em retração"].map(opt => (
                      <label
                        key={opt}
                        className={`px-4 py-2 rounded cursor-pointer border transition min-h-[44px] flex items-center ${
                          form.situacao_mercado === opt
                            ? "bg-[#ef0002] text-white font-semibold border-[#ef0002]"
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
                </div>

                {/* 3. Nichos ocultos */}
                <div>
                  <label className="block mb-2 font-medium text-base">
                    Há nichos pouco explorados no seu setor que você poderia atacar?
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 font-medium focus:border-[#ef0002] focus:outline-none focus:ring-2 focus:ring-[#ef0002]"
                    placeholder="Descreva possíveis nichos, públicos ou regiões."
                    rows={2}
                    value={form.nichos_ocultos}
                    onChange={e => handleChange("nichos_ocultos", e.target.value)}
                  />
                </div>

                {/* 4. Concorrentes enfraquecendo */}
                <div>
                  <label className="block mb-2 font-medium text-base">
                    Você já identificou concorrentes que estão saindo do mercado ou perdendo força?
                  </label>
                  <div className="flex gap-3 mb-4">
                    {["Sim", "Não", "Não sei"].map(opt => (
                      <label
                        key={opt}
                        className={`px-4 py-2 rounded cursor-pointer border transition min-h-[44px] flex items-center ${
                          form.concorrentes_enfraquecendo === opt
                            ? "bg-[#ef0002] text-white font-semibold border-[#ef0002]"
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
                </div>

                {/* 5. Tendências aproveitáveis */}
                <div>
                  <label className="block mb-2 font-medium text-base">
                    Quais tendências recentes você acredita que podem beneficiar sua empresa?
                  </label>
                  <div className="flex flex-col gap-2 mb-4">
                    {tendenciasOpcoes.map(opt => (
                      <label
                        key={opt}
                        className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer border font-medium min-h-[44px] ${
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
                      className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 mb-4 font-medium focus:border-[#ef0002] focus:outline-none focus:ring-2 focus:ring-[#ef0002]"
                      placeholder="Descreva a tendência"
                      value={form.tendencias_outro}
                      onChange={e => handleChange("tendencias_outro", e.target.value)}
                    />
                  )}
                </div>

                {/* 6. Demanda não atendida */}
                <div>
                  <label className="block mb-2 font-medium text-base">
                    Existe algum produto/serviço que seus clientes pedem e você ainda não oferece?
                  </label>
                  <input
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 mb-4 font-medium focus:border-[#ef0002] focus:outline-none focus:ring-2 focus:ring-[#ef0002]"
                    value={form.demanda_nao_atendida}
                    onChange={e => handleChange("demanda_nao_atendida", e.target.value)}
                  />
                </div>

                {/* 7. Pronto para parcerias */}
                <div>
                  <label className="block mb-2 font-medium text-base">
                    Sua empresa está pronta para explorar novas parcerias estratégicas?
                  </label>
                  <div className="flex gap-3 mb-4">
                    {["Sim", "Em análise", "Ainda não"].map(opt => (
                      <label
                        key={opt}
                        className={`px-4 py-2 rounded cursor-pointer border transition min-h-[44px] flex items-center ${
                          form.parcerias_possiveis === opt
                            ? "bg-[#ef0002] text-white font-semibold border-[#ef0002]"
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
                </div>

                {/* 8. Recurso ocioso */}
                <div>
                  <label className="block mb-2 font-medium text-base">
                    Qual recurso atual você sente que está subutilizado?
                  </label>
                  <input
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 mb-4 font-medium focus:border-[#ef0002] focus:outline-none focus:ring-2 focus:ring-[#ef0002]"
                    placeholder="Ex: Espaço físico, mailing, rede de contatos…"
                    value={form.recurso_ocioso}
                    onChange={e => handleChange("recurso_ocioso", e.target.value)}
                  />
                </div>

                {/* 9. Canais potenciais */}
                <div>
                  <label className="block mb-2 font-medium text-base">
                    Quais canais ou estratégias você ainda não explora, mas gostaria?
                  </label>
                  <div className="flex flex-col gap-2 mb-4">
                    {canaisOpcoes.map(opt => (
                      <label
                        key={opt}
                        className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer border font-medium min-h-[44px] ${
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
                      className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 mb-4 font-medium focus:border-[#ef0002] focus:outline-none focus:ring-2 focus:ring-[#ef0002]"
                      placeholder="Descreva o canal ou estratégia"
                      value={form.canais_outro}
                      onChange={e => handleChange("canais_outro", e.target.value)}
                    />
                  )}
                </div>

                {/* 10. Disposição para explorar oportunidades */}
                <div>
                  <label className="block mb-2 font-medium text-base">
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
                </div>

                {/* Condicional: se disposição >=8, campo aberto */}
                {mostrarCampoAcaoInicial && (
                  <div>
                    <label className="block mb-2 font-medium text-base">
                      Qual seria sua primeira ação para isso?
                    </label>
                    <input
                      type="text"
                      className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 mb-4 font-medium focus:border-[#ef0002] focus:outline-none focus:ring-2 focus:ring-[#ef0002]"
                      value={form.acao_inicial_oportunidade}
                      onChange={e => handleChange("acao_inicial_oportunidade", e.target.value)}
                    />
                  </div>
                )}
              </div>

              {!isMobile && (
                <div className="flex justify-between pt-4 gap-4 flex-wrap-reverse sm:flex-nowrap">
                  {onBack && (
                    <Button type="button" variant="outline" onClick={onBack}>
                      ← Voltar
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="bg-[#ef0002] text-white"
                    disabled={!isValid}
                  >
                    Avançar para Ameaças
                  </Button>
                </div>
              )}
            </form>
          </KeyboardAvoidingWrapper>
        </CardContent>
      </Card>
    </div>
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
        onNext={handleMobileNext}
        onBack={onBack}
        nextLabel="Avançar para Ameaças"
        isNextDisabled={!isValid}
      />
    </>
  );
}
