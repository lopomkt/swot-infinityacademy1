
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
  return (
    <>
      <TransitionMessage message={MESSAGE} />
      <ForcasForm {...props} />
    </>
  );
}
