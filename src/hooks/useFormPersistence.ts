import { useState, useEffect, useCallback } from 'react';
import { FormData } from '@/types/formData';

/**
 * Configuração do hook de persistência
 */
interface PersistenceConfig {
  storageKey: string;
  debounceMs: number;
  autoSave: boolean;
}

/**
 * Estado da persistência
 */
interface PersistenceState {
  lastSaved: Date | null;
  hasChanges: boolean;
  isLoading: boolean;
}

/**
 * Hook para salvamento e recuperação automática do progresso do formulário
 * ETAPA 3: Melhorado com salvamento mais inteligente e recuperação robusta
 */
export function useFormPersistence(config: Partial<PersistenceConfig> = {}) {
  const {
    storageKey = 'swot-form-data',
    debounceMs = 2000, // Aumentado para 2s
    autoSave = true,
  } = config;

  const [formData, setFormData] = useState<FormData>({});
  const [persistenceState, setPersistenceState] = useState<PersistenceState>({
    lastSaved: null,
    hasChanges: false,
    isLoading: false,
  });

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  /**
   * Salva dados no localStorage de forma mais robusta
   */
  const saveData = useCallback((data: FormData, immediate: boolean = false) => {
    const performSave = () => {
      try {
        console.log("💾 [useFormPersistence] Salvando dados do formulário...");
        
        // Validar se os dados não estão vazios
        if (!data || Object.keys(data).length === 0) {
          console.log("⚠️ [useFormPersistence] Dados vazios, pulando salvamento");
          return;
        }
        
        const dataToSave = {
          formData: data,
          timestamp: new Date().toISOString(),
          version: '1.1', // Incrementada para ETAPA 3
          steps_completed: {
            identificacao: !!data.identificacao?.tipagem_identificacao_ok,
            forcas: !!data.step_forcas_ok,
            fraquezas: !!data.fraquezas,
            oportunidades: !!data.oportunidades,
            ameacas: !!data.ameacas,
            financeiro: !!data.saudeFinanceira?.step_financas_ok,
            prioridades: !!data.step_prioridades_ok,
          }
        };

        // Tentar salvar com fallback
        try {
          localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        } catch (quotaError: any) {
          console.warn("⚠️ [useFormPersistence] Quota excedida, limpando dados antigos...");
          // Limpar dados antigos se quota for excedida
          const oldKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('swot-') && key !== storageKey
          );
          oldKeys.forEach(key => localStorage.removeItem(key));
          
          // Tentar novamente
          localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        }
        
        setPersistenceState(prev => ({
          ...prev,
          lastSaved: new Date(),
          hasChanges: false,
        }));

        console.log("✅ [useFormPersistence] Dados salvos com sucesso");
      } catch (error: any) {
        console.error("❌ [useFormPersistence] Erro ao salvar dados:", error);
        
        // Fallback: tentar salvar dados mínimos
        try {
          const minimalData = {
            identificacao: data.identificacao,
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem(`${storageKey}_minimal`, JSON.stringify(minimalData));
          console.log("💾 [useFormPersistence] Dados mínimos salvos como fallback");
        } catch (fallbackError: any) {
          console.error("❌ [useFormPersistence] Falha no fallback:", fallbackError);
        }
      }
    };

    if (immediate) {
      // Limpar timer existente e salvar imediatamente
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        setDebounceTimer(null);
      }
      performSave();
    } else if (autoSave) {
      // Implementar debounce para salvamento automático
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const newTimer = setTimeout(() => {
        performSave();
        setDebounceTimer(null);
      }, debounceMs);

      setDebounceTimer(newTimer);
    }
  }, [storageKey, debounceMs, autoSave, debounceTimer]);

  /**
   * Carrega dados do localStorage com recuperação robusta
   */
  const loadData = useCallback((): FormData => {
    try {
      console.log("📂 [useFormPersistence] Carregando dados salvos...");
      
      const savedData = localStorage.getItem(storageKey);
      
      if (!savedData) {
        // Tentar carregar dados mínimos como fallback
        const minimalData = localStorage.getItem(`${storageKey}_minimal`);
        if (minimalData) {
          console.log("📂 [useFormPersistence] Carregando dados mínimos de fallback");
          const parsed = JSON.parse(minimalData);
          return parsed.identificacao ? { identificacao: parsed.identificacao } : {};
        }
        
        console.log("ℹ️ [useFormPersistence] Nenhum dado salvo encontrado");
        return {};
      }

      const parsed = JSON.parse(savedData);
      
      // Verificar estrutura dos dados salvos
      if (!parsed.formData || !parsed.timestamp) {
        console.warn("⚠️ [useFormPersistence] Estrutura de dados inválida, tentando recuperar...");
        
        // Tentar interpretar dados antigos
        if (parsed.identificacao || parsed.forcas || parsed.fraquezas) {
          console.log("🔄 [useFormPersistence] Convertendo formato de dados antigo");
          return parsed as FormData;
        }
        
        return {};
      }

      // Verificar se os dados não são muito antigos (14 dias - aumentado)
      const savedDate = new Date(parsed.timestamp);
      const daysDiff = (Date.now() - savedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 14) {
        console.warn("⚠️ [useFormPersistence] Dados muito antigos, mas mantendo para usuário decidir");
        // Não remover automaticamente - deixar usuário decidir
      }

      console.log("✅ [useFormPersistence] Dados carregados com sucesso");
      console.log("📊 [useFormPersistence] Etapas completadas:", parsed.steps_completed);
      
      setPersistenceState(prev => ({
        ...prev,
        lastSaved: savedDate,
        hasChanges: false,
      }));

      return parsed.formData;
    } catch (error: any) {
      console.error("❌ [useFormPersistence] Erro ao carregar dados:", error);
      
      // Tentar recuperação de emergência
      try {
        const emergencyKeys = ['swot-form-identificacao', 'swot-form-forcas', 'swot-form-fraquezas'];
        const recoveredData: FormData = {};
        
        emergencyKeys.forEach(key => {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              if (key.includes('identificacao')) recoveredData.identificacao = parsed;
              if (key.includes('forcas')) recoveredData.forcas = parsed;
              if (key.includes('fraquezas')) recoveredData.fraquezas = parsed;
            } catch {}
          }
        });
        
        if (Object.keys(recoveredData).length > 0) {
          console.log("🔄 [useFormPersistence] Dados parciais recuperados de chaves individuais");
          return recoveredData;
        }
      } catch {}
      
      return {};
    }
  }, [storageKey]);

  /**
   * Atualiza dados do formulário de forma mais inteligente
   */
  const updateFormData = useCallback((
    newData: FormData | ((prev: FormData) => FormData)
  ) => {
    setFormData(prev => {
      const updated = typeof newData === 'function' ? newData(prev) : newData;
      
      // Verificar se realmente há mudanças significativas
      const hasSignificantChanges = JSON.stringify(updated) !== JSON.stringify(prev);
      
      if (hasSignificantChanges) {
        console.log("📝 [useFormPersistence] Detectadas mudanças significativas");
        
        setPersistenceState(prevState => ({
          ...prevState,
          hasChanges: true,
        }));

        // Salvar automaticamente se configurado
        if (autoSave) {
          saveData(updated, false);
        }
      }

      return updated;
    });
  }, [autoSave, saveData]);

  /**
   * Limpa dados de forma mais seletiva
   */
  const clearData = useCallback((clearAll: boolean = false) => {
    try {
      console.log("🗑️ [useFormPersistence] Limpando dados salvos...");
      
      if (clearAll) {
        // Limpar tudo relacionado ao formulário
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.startsWith('swot-')
        );
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } else {
        // Limpar apenas chave principal
        localStorage.removeItem(storageKey);
        localStorage.removeItem(`${storageKey}_minimal`);
      }
      
      setFormData({});
      setPersistenceState({
        lastSaved: null,
        hasChanges: false,
        isLoading: false,
      });

      // Limpar timer de debounce se existir
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        setDebounceTimer(null);
      }

      console.log("✅ [useFormPersistence] Dados limpos com sucesso");
    } catch (error: any) {
      console.error("❌ [useFormPersistence] Erro ao limpar dados:", error);
    }
  }, [storageKey, debounceTimer]);

  /**
   * Força salvamento imediato dos dados atuais
   */
  const forceSave = useCallback(() => {
    saveData(formData, true);
  }, [formData, saveData]);

  /**
   * Verifica se existem dados salvos no localStorage
   */
  const hasSavedData = useCallback((): boolean => {
    try {
      const savedData = localStorage.getItem(storageKey);
      const minimalData = localStorage.getItem(`${storageKey}_minimal`);
      return !!(savedData || minimalData);
    } catch {
      return false;
    }
  }, [storageKey]);

  // Carregar dados na inicialização
  useEffect(() => {
    setPersistenceState(prev => ({ ...prev, isLoading: true }));
    
    const loadedData = loadData();
    setFormData(loadedData);
    
    setPersistenceState(prev => ({ ...prev, isLoading: false }));
  }, [loadData]);

  // Cleanup na desmontagem do componente
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return {
    // Estado
    formData,
    persistenceState,

    // Ações
    updateFormData,
    loadData,
    saveData: forceSave,
    clearData,
    hasSavedData,
  };
}
