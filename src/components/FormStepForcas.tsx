
import React from 'react';
import { ForcasForm } from '@/features/forms/components/ForcasForm';
import { ForcasData } from "@/schemas/forcasSchema";
import { TransitionMessage } from '@/components/shared/TransitionMessage';

const MESSAGE = "Agora vamos explorar os pontos fortes da sua empresa.";

interface FormStepForcasProps {
  onSubmit?: (data: ForcasData) => void;
  onComplete?: (data: ForcasData) => void;
  defaultValues?: ForcasData;
  onBack?: () => void;
}

export default function FormStepForcas(props: FormStepForcasProps) {
  // Log para debug
  console.log("🎯 [FormStepForcas] Renderizando com props:", {
    hasOnSubmit: !!props.onSubmit,
    hasOnComplete: !!props.onComplete,
    hasDefaultValues: !!props.defaultValues,
    hasOnBack: !!props.onBack,
  });

  // Wrapper simplificado sem lógica adicional
  return (
    <div className="w-full">
      <TransitionMessage message={MESSAGE} />
      <ForcasForm {...props} />
    </div>
  );
}
