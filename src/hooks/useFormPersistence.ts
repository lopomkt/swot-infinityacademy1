
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
 * Utiliza localStorage com debounce para otimizar performance
 * @param config Configuração do comportamento de persistência
 * @returns Estado e funções para persistência de dados
 */
export function useFormPersistence(config: Partial<PersistenceConfig> = {}) {
  const {
    storageKey = 'swot-form-data',
    debounceMs = 1000,
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
   * Salva dados no localStorage
   * @param data Dados a serem salvos
   * @param immediate Se true, salva imediatamente sem debounce
   */
  const saveData = useCallback((data: FormData, immediate: boolean = false) => {
    const performSave = () => {
      try {
        console.log("💾 Salvando dados do formulário...");
        
        const dataToSave = {
          formData: data,
          timestamp: new Date().toISOString(),
          version: '1.0',
        };

        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        
        setPersistenceState(prev => ({
          ...prev,
          lastSaved: new Date(),
          hasChanges: false,
        }));

        console.log("✅ Dados salvos com sucesso");
      } catch (error: any) {
        console.error("❌ Erro ao salvar dados:", error);
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
   * Carrega dados do localStorage
   * @returns Dados carregados ou objeto vazio se não existir
   */
  const loadData = useCallback((): FormData => {
    try {
      console.log("📂 Carregando dados salvos...");
      
      const savedData = localStorage.getItem(storageKey);
      
      if (!savedData) {
        console.log("ℹ️ Nenhum dado salvo encontrado");
        return {};
      }

      const parsed = JSON.parse(savedData);
      
      // Verificar estrutura dos dados salvos
      if (!parsed.formData || !parsed.timestamp) {
        console.warn("⚠️ Estrutura de dados inválida, ignorando");
        return {};
      }

      // Verificar se os dados não são muito antigos (7 dias)
      const savedDate = new Date(parsed.timestamp);
      const daysDiff = (Date.now() - savedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 7) {
        console.warn("⚠️ Dados muito antigos, removendo do localStorage");
        localStorage.removeItem(storageKey);
        return {};
      }

      console.log("✅ Dados carregados com sucesso");
      
      setPersistenceState(prev => ({
        ...prev,
        lastSaved: savedDate,
        hasChanges: false,
      }));

      return parsed.formData;
    } catch (error: any) {
      console.error("❌ Erro ao carregar dados:", error);
      return {};
    }
  }, [storageKey]);

  /**
   * Atualiza dados do formulário e marca como alterado
   * @param newData Novos dados ou função que recebe dados atuais
   */
  const updateFormData = useCallback((
    newData: FormData | ((prev: FormData) => FormData)
  ) => {
    setFormData(prev => {
      const updated = typeof newData === 'function' ? newData(prev) : newData;
      
      // Marcar como alterado se há diferenças
      const hasChanges = JSON.stringify(updated) !== JSON.stringify(prev);
      
      if (hasChanges) {
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
   * Limpa todos os dados salvos
   */
  const clearData = useCallback(() => {
    try {
      console.log("🗑️ Limpando dados salvos...");
      
      localStorage.removeItem(storageKey);
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

      console.log("✅ Dados limpos com sucesso");
    } catch (error: any) {
      console.error("❌ Erro ao limpar dados:", error);
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
      return !!savedData;
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
