
import React from 'react';
import { ForcasForm } from '@/features/forms/components/ForcasForm';
import { ForcasData } from "@/schemas/forcasSchema";

interface FormStepForcasProps {
  onSubmit?: (data: ForcasData) => void;
  onComplete?: (data: ForcasData) => void;
  defaultValues?: ForcasData;
  onBack?: () => void;
}

export default function FormStepForcas(props: FormStepForcasProps) {
  return <ForcasForm {...props} />;
}
