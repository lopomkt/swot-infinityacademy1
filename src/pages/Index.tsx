import { useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import WelcomeStep from "@/components/WelcomeStep";
import FormStep1 from "@/components/FormStep1";
import FormStepForcas from "@/components/FormStepForcas";
import FormStepFraquezas from "@/components/FormStepFraquezas";
import FormStepOportunidades from "@/components/FormStepOportunidades";
import FormStepAmeacas from "@/components/FormStepAmeacas";
import FormStepSaudeFinanceira from "@/components/FormStepSaudeFinanceira";

const STEPS = [
  { label: "Boas-vindas" },
  { label: "Identificação & Contexto Empresarial" },
  { label: "Forças" },
  { label: "Fraquezas" },
  { label: "Oportunidades" },
  // futuras etapas...
];

const Index = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<{
    identificacao?: any,
    forcas?: any,
    fraquezas?: any,
    oportunidades?: any,
    ameacas?: any,
    saudeFinanceira?: any,
  }>({});

  return (
    <div className="min-h-screen bg-white text-black font-manrope flex flex-col items-center justify-start">
      <ProgressBar currentStep={step} stepsCount={STEPS.length + 2} />
      <main className="w-full max-w-xl p-4 flex-1 flex flex-col items-center justify-center animate-fade-in">
        {step === 0 && (
          <WelcomeStep
            onStart={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <FormStep1
            defaultValues={formData.identificacao}
            onComplete={(identificacao) => {
              setFormData((prev) => ({ ...prev, identificacao }));
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <FormStepForcas
            defaultValues={formData.forcas}
            onComplete={(forcas) => {
              setFormData((prev) => ({ ...prev, forcas }));
              setStep(3);
            }}
          />
        )}
        {step === 3 && (
          <FormStepFraquezas
            defaultValues={formData.fraquezas}
            onComplete={(fraquezas) => {
              setFormData((prev) => ({ ...prev, fraquezas }));
              setStep(4);
            }}
          />
        )}
        {step === 4 && (
          <FormStepOportunidades
            defaultValues={formData.oportunidades}
            onComplete={(oportunidades) => {
              setFormData((prev) => ({ ...prev, oportunidades }));
              setStep(5);
            }}
          />
        )}
        {step === 5 && (
          <FormStepAmeacas
            defaultValues={formData.ameacas}
            onComplete={(ameacas) => {
              setFormData((prev) => ({ ...prev, ameacas }));
              setStep(6);
            }}
          />
        )}
        {step === 6 && (
          <FormStepSaudeFinanceira
            defaultValues={formData.saudeFinanceira}
            onComplete={(saudeFinanceira) => {
              setFormData((prev) => ({ ...prev, saudeFinanceira }));
              // Futuro: setStep(7) para próximas etapas
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
