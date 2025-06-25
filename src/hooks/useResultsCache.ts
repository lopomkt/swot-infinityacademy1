
import { useState, useEffect, useCallback } from 'react';
import { FormData } from '@/types/formData';

interface CacheEntry {
  data: FormData;
  timestamp: number;
  hash: string;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos
const CACHE_KEY = 'swot_results_cache';

export function useResultsCache() {
  const [cache, setCache] = useState<Map<string, CacheEntry>>(new Map());

  // Generate hash for form data
  const generateHash = useCallback((data: FormData): string => {
    const str = JSON.stringify({
      nomeEmpresa: data.nomeEmpresa,
      segmento: data.segmento,
      forcas: data.forcas,
      fraquezas: data.fraquezas,
      oportunidades: data.oportunidades,
      ameacas: data.ameacas
    });
    return btoa(str).slice(0, 16);
  }, []);

  // Load cache from localStorage
  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        const validEntries = new Map();
        
        Object.entries(parsed).forEach(([key, entry]: [string, any]) => {
          if (now - entry.timestamp < CACHE_DURATION) {
            validEntries.set(key, entry);
          }
        });
        
        setCache(validEntries);
      }
    } catch (error) {
      console.warn('Erro ao carregar cache:', error);
    }
  }, []);

  // Save cache to localStorage
  const saveCache = useCallback((newCache: Map<string, CacheEntry>) => {
    try {
      const obj = Object.fromEntries(newCache);
      localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
    } catch (error) {
      console.warn('Erro ao salvar cache:', error);
    }
  }, []);

  // Get cached result
  const getCached = useCallback((formData: FormData): FormData | null => {
    const hash = generateHash(formData);
    const entry = cache.get(hash);
    
    if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
      console.log('📋 Cache hit para:', hash);
      return entry.data;
    }
    
    return null;
  }, [cache, generateHash]);

  // Set cache entry
  const setCached = useCallback((formData: FormData) => {
    const hash = generateHash(formData);
    const entry: CacheEntry = {
      data: formData,
      timestamp: Date.now(),
      hash
    };
    
    const newCache = new Map(cache);
    newCache.set(hash, entry);
    
    // Limit cache size
    if (newCache.size > 10) {
      const oldestKey = Array.from(newCache.keys())[0];
      newCache.delete(oldestKey);
    }
    
    setCache(newCache);
    saveCache(newCache);
    console.log('💾 Cache salvo para:', hash);
  }, [cache, generateHash, saveCache]);

  // Clear cache
  const clearCache = useCallback(() => {
    setCache(new Map());
    localStorage.removeItem(CACHE_KEY);
    console.log('🗑️ Cache limpo');
  }, []);

  return {
    getCached,
    setCached,
    clearCache,
    cacheSize: cache.size
  };
}
