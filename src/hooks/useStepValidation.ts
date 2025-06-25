
import { toast } from 'sonner';

export interface StepValidationResult {
  isValid: boolean;
  message?: string;
}

export function useStepValidation() {
  const canProceed = (currentStep: number, stepData?: any): boolean => {
    console.log(`🔍 Validando etapa ${currentStep}:`, stepData);
    
    switch (currentStep) {
      case 1: // Forças - Validação mais flexível
        if (!stepData || Object.keys(stepData).length === 0) {
          toast.error("Preencha pelo menos um campo antes de avançar");
          return false;
        }
        
        // Verificar se há pelo menos uma força preenchida
        const forcasKeys = Object.keys(stepData);
        const hasValidEntry = forcasKeys.some(key => 
          stepData[key] && typeof stepData[key] === 'string' && stepData[key].trim().length > 0
        );
        
        if (!hasValidEntry) {
          toast.error("Identifique pelo menos uma força da sua empresa");
          return false;
        }
        
        console.log("✅ Etapa 1 (Forças) validada com sucesso");
        return true;
      
      case 2: // Fraquezas - Validação simplificada
        if (!stepData) {
          toast.error("Complete os campos obrigatórios antes de avançar");
          return false;
        }
        
        // Verificar pontos_inconsistentes OU campos de fraqueza individuais
        const hasInconsistencies = stepData.pontos_inconsistentes && stepData.pontos_inconsistentes.length > 0;
        const hasIndividualWeakness = stepData.fraqueza1 || stepData.fraqueza2 || stepData.fraqueza3;
        
        if (!hasInconsistencies && !hasIndividualWeakness) {
          toast.error("Identifique pelo menos uma área de dificuldade ou fraqueza");
          return false;
        }
        
        console.log("✅ Etapa 2 (Fraquezas) validada com sucesso");
        return true;
      
      case 3: // Oportunidades - Validação básica
        if (!stepData || Object.keys(stepData).length === 0) {
          toast.error("Identifique pelo menos uma oportunidade");
          return false;
        }
        
        console.log("✅ Etapa 3 (Oportunidades) validada com sucesso");
        return true;
      
      case 4: // Ameaças - Validação básica
        if (!stepData || Object.keys(stepData).length === 0) {
          toast.error("Identifique pelo menos uma ameaça ou risco");
          return false;
        }
        
        console.log("✅ Etapa 4 (Ameaças) validada com sucesso");
        return true;
      
      case 5: // Resumo - Sempre válido
        console.log("✅ Etapa 5 (Resumo) - Sem validação específica");
        return true;
      
      default:
        console.log("✅ Etapa desconhecida - Permitindo prosseguir");
        return true;
    }
  };

  return { canProceed };
}
