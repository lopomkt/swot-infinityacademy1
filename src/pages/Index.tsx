import { useState, useEffect } from "react";
import ProgressBar from "@/components/ProgressBar";
import WelcomeStep from "@/components/WelcomeStep";
import FormStep1 from "@/components/FormStep1";
import FormStepForcas from "@/components/FormStepForcas";
import FormStepFraquezas from "@/components/FormStepFraquezas";
import FormStepOportunidades from "@/components/FormStepOportunidades";
import FormStepAmeacas from "@/components/FormStepAmeacas";
import FormStepSaudeFinanceira from "@/components/FormStepSaudeFinanceira";
import FormStepPrioridades from "@/components/FormStepPrioridades";
import FinalizacaoStep from "@/components/FinalizacaoStep";
import ResultsScreen from "@/pages/ResultsScreen";
import TransitionStep from "@/components/TransitionStep";
import { FormData } from "@/types/formData";
import { saveState, loadState } from "@/lib/persistence";

const STEPS = [
  { label: "Boas-vindas" },
  { label: "Identificação & Contexto Empresarial" },
  { label: "Transição" },
  { label: "Forças" },
  { label: "Transição" },
  { label: "Fraquezas" },
  { label: "Transição" },
  { label: "Oportunidades" },
  { label: "Transição" },
  { label: "Ameaças" },
  { label: "Transição" },
  { label: "Saúde Financeira" },
  { label: "Transição" },
  { label: "Prioridades e Maturidade" },
  { label: "Finalização" },
  { label: "Resultados" },
];

const Index = () => {
  const [step, setStep] = useState<number>(loadState<number>('swotStep') || 0);
  const [formData, setFormData] = useState<FormData>(loadState<FormData>('swotForm') || {
    tipagem_index_ok: true,
    fase5_transicoes_ok: true,
    fase5_voltar_ok: true,
    fase5_gamificacao_ok: true,
    fase5_finalizacao_ok: true,
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    saveState('swotForm', formData);
  }, [formData]);

  // Save step to localStorage whenever it changes
  useEffect(() => {
    saveState('swotStep', step);
  }, [step]);

  const handleBackButtonClick = (previousStep: number) => {
    window.scrollTo(0, 0);
    setStep(previousStep);
  };

  const resetForm = () => {
    setFormData({ 
      tipagem_index_ok: true,
      fase5_transicoes_ok: true,
      fase5_voltar_ok: true,
      fase5_gamificacao_ok: true,
      fase5_finalizacao_ok: true,
    });
    setStep(0);
  };

  // Check if AI results are ready to show results screen
  const areResultsReady = () => {
    return formData.resultadoFinal?.ai_block_pronto === true && formData.resultadoFinal?.gpt_prompt_ok === true;
  };

  // Helper function to determine the current visual step for the progress bar
  const getCurrentProgressStep = () => {
    // Map decimal steps (transitions) to their integer counterparts for the progress bar
    if (step % 1 !== 0) {
      return Math.floor(step);
    }
    return step;
  };

  // Count actual visible steps for progress calculation (excluding transitions)
  const totalMainSteps = STEPS.filter(s => !s.label.includes('Transição')).length;
  const currentMainStep = Math.min(Math.ceil(getCurrentProgressStep() / 2), totalMainSteps);

  return (
    <div className="min-h-screen bg-white text-black font-manrope flex flex-col items-center justify-start">
      <ProgressBar currentStep={getCurrentProgressStep()} stepsCount={STEPS.length} />
      <main className="w-full max-w-5xl p-4 flex-1 flex flex-col items-center justify-center animate-fade-in">
        {step === 0 && (
          <WelcomeStep
            onStart={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <FormStep1
            defaultValues={formData.identificacao}
            onBack={step > 0 ? () => handleBackButtonClick(0) : undefined}
            onComplete={(identificacao) => {
              setFormData((prev) => ({ ...prev, identificacao }));
              setStep(1.5);
            }}
          />
        )}
        {step === 1.5 && (
          <TransitionStep
            title="Vamos identificar as forças do seu negócio"
            description="Agora vamos analisar os pontos fortes da sua empresa - aqueles diferenciais competitivos que você já possui e que podem ser potencializados."
            onContinue={() => setStep(2)}
            currentStep={currentMainStep}
            totalSteps={totalMainSteps}
          />
        )}
        {step === 2 && (
          <FormStepForcas
            defaultValues={formData.forcas}
            onBack={() => handleBackButtonClick(1)}
            onComplete={(forcas) => {
              setFormData((prev) => ({ 
                ...prev, 
                forcas: {
                  respostas: forcas.respostas || [],  // Ensure respostas is always defined
                },
                step_forcas_ok: true
              }));
              setStep(2.5);
            }}
          />
        )}
        {step === 2.5 && (
          <TransitionStep
            title="Vamos analisar os pontos de melhoria"
            description="Identificar fraquezas não é sinal de fracasso - é um passo essencial para fortalecer seu negócio e transformar vulnerabilidades em oportunidades de crescimento."
            onContinue={() => setStep(3)}
            currentStep={currentMainStep}
            totalSteps={totalMainSteps}
          />
        )}
        {step === 3 && (
          <FormStepFraquezas
            defaultValues={formData.fraquezas}
            onBack={() => handleBackButtonClick(2)}
            onComplete={(fraquezas) => {
              setFormData((prev) => ({ ...prev, fraquezas }));
              setStep(3.5);
            }}
          />
        )}
        {step === 3.5 && (
          <TransitionStep
            title="Explorando oportunidades de mercado"
            description="Vamos identificar as oportunidades externas que podem impulsionar seu negócio - tendências, nichos inexplorados e demandas emergentes que podem ser aproveitadas."
            onContinue={() => setStep(4)}
            currentStep={currentMainStep}
            totalSteps={totalMainSteps}
          />
        )}
        {step === 4 && (
          <FormStepOportunidades
            defaultValues={formData.oportunidades}
            onBack={() => handleBackButtonClick(3)}
            onComplete={(oportunidades) => {
              setFormData((prev) => ({ ...prev, oportunidades }));
              setStep(4.5);
            }}
          />
        )}
        {step === 4.5 && (
          <TransitionStep
            title="Identificando ameaças e desafios"
            description="Por último, vamos mapear as ameaças externas que podem impactar seu negócio, preparando estratégias defensivas e de mitigação de riscos."
            onContinue={() => setStep(5)}
            currentStep={currentMainStep}
            totalSteps={totalMainSteps}
          />
        )}
        {step === 5 && (
          <FormStepAmeacas
            defaultValues={formData.ameacas}
            onBack={() => handleBackButtonClick(4)}
            onComplete={(ameacas) => {
              setFormData((prev) => ({ ...prev, ameacas }));
              setStep(5.5);
            }}
          />
        )}
        {step === 5.5 && (
          <TransitionStep
            title="Avaliando a saúde financeira"
            description="Agora vamos analisar a situação financeira da sua empresa para fundamentar recomendações alinhadas à sua realidade econômica."
            onContinue={() => setStep(6)}
            currentStep={currentMainStep}
            totalSteps={totalMainSteps}
          />
        )}
        {step === 6 && (
          <FormStepSaudeFinanceira
            defaultValues={formData.saudeFinanceira}
            onBack={() => handleBackButtonClick(5)}
            onComplete={(saudeFinanceira) => {
              setFormData((prev) => ({ ...prev, saudeFinanceira }));
              setStep(6.5);
            }}
          />
        )}
        {step === 6.5 && (
          <TransitionStep
            title="Definindo prioridades estratégicas"
            description="Para finalizar, vamos estabelecer prioridades claras e entender suas metas de curto e longo prazo para direcionar as recomendações estratégicas."
            onContinue={() => setStep(7)}
            currentStep={currentMainStep}
            totalSteps={totalMainSteps}
          />
        )}
        {step === 7 && (
          <FormStepPrioridades
            defaultValues={formData.prioridades}
            onBack={() => handleBackButtonClick(6)}
            onComplete={(prioridades) => {
              setFormData((prev) => ({ 
                ...prev, 
                prioridades,
                step_prioridades_ok: true
              }));
              setStep(7.5);
            }}
          />
        )}
        {step === 7.5 && (
          <TransitionStep
            title="Finalizando sua análise SWOT"
            description="Parabéns! Você completou todas as etapas do diagnóstico. Agora vamos processar suas informações e gerar seu relatório estratégico personalizado."
            onContinue={() => setStep(8)}
            currentStep={currentMainStep}
            totalSteps={totalMainSteps}
          />
        )}
        {step === 8 && (
          <FinalizacaoStep 
            onRestart={resetForm} 
            formData={formData}
            onAIComplete={(resultadoFinal) => {
              setFormData(prev => ({
                ...prev,
                resultadoFinal,
                fase5_finalizacao_ok: true
              }));
              setStep(9);
            }}
          />
        )}
        {step === 9 && formData.resultadoFinal?.ai_block_pronto && formData.resultadoFinal?.gpt_prompt_ok && (
          <ResultsScreen 
            formData={formData}
          />
        )}
        
        {step === 9 && !formData.resultadoFinal?.gpt_prompt_ok && (
          <p className="text-center text-red-600 mt-10">⏳ Seu relatório ainda está sendo processado.</p>
        )}
      </main>

      {/* Tag de rastreamento - não remover */}
      {/* fase5_bugfixes_finais_ok = true */}
    </div>
  );
};

export default Index;
