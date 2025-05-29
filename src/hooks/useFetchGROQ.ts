
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface FetchGROQOptions {
  prompt: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useFetchGROQ = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutWarning, setTimeoutWarning] = useState(false);

  const fetchGROQResult = async ({ prompt, onSuccess, onError }: FetchGROQOptions) => {
    setIsLoading(true);
    setTimeoutWarning(false);
    
    // Set timeout warning if processing takes too long
    const timeoutId = setTimeout(() => {
      setTimeoutWarning(true);
      console.warn("⚠️ GROQ API está demorando mais que o esperado");
    }, 15000);
    
    // Create AbortController for timeout handling
    const controller = new AbortController();
    const requestTimeoutId = setTimeout(() => {
      controller.abort();
      console.warn("❌ Timeout - Requisição cancelada após 30 segundos");
    }, 30000);
    
    try {
      const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      if (!groqApiKey) {
        throw new Error("VITE_GROQ_API_KEY não configurada");
      }

      console.log("🚀 Iniciando chamada GROQ API...");
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "llama-3-1-70b-versatile",
          messages: [
            { 
              role: "system", 
              content: "Você é um consultor empresarial sênior especializado em análise SWOT e planejamento estratégico para pequenas e médias empresas." 
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          stream: false,
        }),
      });
      
      clearTimeout(requestTimeoutId);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 401) {
          console.error("❌ Unauthorized - Chave GROQ inválida");
          throw new Error("Chave de API GROQ inválida ou expirada");
        }
        
        console.error("❌ Erro na API GROQ:", errorData);
        throw new Error(errorData.error?.message || "Erro ao conectar com a API da GROQ");
      }
      
      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        console.error("❌ Parsing inválido - Resposta malformada");
        throw new Error("Resposta inválida da IA.");
      }
      
      console.log("✅ Resposta OK - GROQ retornou dados válidos");
      const resultText = data.choices[0].message.content;
      
      if (onSuccess) {
        onSuccess(resultText);
      }
      
      return resultText;
      
    } catch (error) {
      clearTimeout(requestTimeoutId);
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error("❌ Timeout - A IA demorou para responder");
        const errorMessage = "A IA demorou para responder. Tente novamente mais tarde.";
        if (onError) onError(errorMessage);
        throw new Error(errorMessage);
      }
      
      console.error("❌ Fallback acionado:", error);
      if (onError) onError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
      setTimeoutWarning(false);
    }
  };

  return {
    fetchGROQResult,
    isLoading,
    timeoutWarning
  };
};
