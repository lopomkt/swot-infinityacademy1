
import { toast } from 'sonner';

export interface StepValidationResult {
  isValid: boolean;
  message?: string;
}

export function useStepValidation() {
  const canProceed = (currentStep: number, stepData?: any): boolean => {
    switch (currentStep) {
      case 1: // Forças
        if (!stepData || Object.keys(stepData).length === 0) {
          toast.error("Complete pelo menos um campo antes de avançar");
          return false;
        }
        return true;
      
      case 2: // Fraquezas
        if (!stepData || !stepData.pontos_inconsistentes || stepData.pontos_inconsistentes.length === 0) {
          toast.error("Selecione pelo menos uma área de dificuldade");
          return false;
        }
        return true;
      
      case 3: // Oportunidades
        // Validação básica baseada na lógica existente
        return true;
      
      case 4: // Ameaças
        return true;
      
      case 5: // Resumo
        return true;
      
      default:
        return true;
    }
  };

  return { canProceed };
}
