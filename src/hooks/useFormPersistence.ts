
import { useState, useEffect, useCallback } from 'react';
import { FormData } from '@/types/formData';

const STORAGE_KEY = 'swot_form_data';
const DEBOUNCE_DELAY = 1000; // 1 segundo

export function useFormPersistence(initialData?: Partial<FormData>) {
  const [formData, setFormData] = useState<FormData>(() => {
    // Carregar dados do localStorage na inicialização
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...parsed, ...initialData };
      }
    } catch (error) {
      console.warn("Erro ao carregar dados do localStorage:", error);
    }
    return initialData || {};
  });

  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Função para salvar no localStorage com debounce
  const saveToStorage = useCallback((data: FormData) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = setTimeout(() => {
      try {
        setIsSaving(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setLastSaved(new Date());
        console.log("💾 Dados salvos no localStorage");
      } catch (error) {
        console.error("❌ Erro ao salvar no localStorage:", error);
      } finally {
        setIsSaving(false);
      }
    }, DEBOUNCE_DELAY);

    setSaveTimeout(timeout);
  }, [saveTimeout]);

  // Atualizar dados e salvar automaticamente
  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(current => {
      const newData = { ...current, ...updates };
      saveToStorage(newData);
      return newData;
    });
  }, [saveToStorage]);

  // Atualizar uma etapa específica
  const updateStep = useCallback((stepName: keyof FormData, stepData: any) => {
    updateFormData({ [stepName]: stepData });
  }, [updateFormData]);

  // Limpar dados salvos
  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setFormData({});
      setLastSaved(null);
      console.log("🗑️ Dados do formulário limpos");
    } catch (error) {
      console.error("❌ Erro ao limpar dados:", error);
    }
  }, []);

  // Verificar se há dados salvos
  const hasSavedData = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return !!stored && Object.keys(JSON.parse(stored)).length > 0;
    } catch {
      return false;
    }
  }, []);

  // Obter progresso do formulário (0-100%)
  const getFormProgress = useCallback(() => {
    const totalSteps = 8; // Identificação, Forças, Fraquezas, Oportunidades, Ameaças, Saúde Financeira, Prioridades, Resultado Final
    const completedSteps = Object.keys(formData).filter(key => {
      const stepData = formData[key as keyof FormData];
      return stepData && Object.keys(stepData).length > 0;
    }).length;

    return Math.round((completedSteps / totalSteps) * 100);
  }, [formData]);

  // Cleanup do timeout ao desmontar
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  return {
    formData,
    updateFormData,
    updateStep,
    clearFormData,
    hasSavedData,
    getFormProgress,
    lastSaved,
    isSaving,
  };
}
