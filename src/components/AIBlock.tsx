
import React, { useState, useEffect } from "react";
import { Loader, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ResultadoFinalData } from "@/types/formData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useFetchGROQ } from "@/hooks/useFetchGROQ";
import { generateSWOTPrompt } from "@/utils/PromptBuilder";
import { parseGROQOutput, generateMockResponse } from "@/utils/GPTParser";
import AIResultRenderer from "@/components/AIResultRenderer";

interface AIBlockProps {
  formData: any;
  onRestart: () => void;
  onAIComplete?: (resultadoFinal: ResultadoFinalData) => void;
}

const AIBlock: React.FC<AIBlockProps> = ({ formData, onRestart, onAIComplete }) => {
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [resultadoFinal, setResultadoFinal] = useState<ResultadoFinalData>({
    matriz_swot: "",
    diagnostico_textual: "",
    planos_acao: "",
    acoes_priorizadas: []
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const [processingState, setProcessingState] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const { fetchGROQResult, isLoading, timeoutWarning } = useFetchGROQ();

  // Verificar se deve usar fallback (desenvolvimento/teste)
  const shouldUseFallback = () => {
    const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
    const isDevelopment = import.meta.env.DEV;
    const useMock = import.meta.env.VITE_USE_MOCK === 'true';
    
    return !groqApiKey || useMock || (isDevelopment && !groqApiKey);
  };

  // Salvar relatório no Supabase
  const saveReportToSupabase = async (resultados: ResultadoFinalData) => {
    if (!user) return;

    try {
      const reportData = {
        user_id: user.id,
        dados: formData,
        resultado_final: {
          ...resultados,
          created_at: new Date().toISOString(),
          tipo: "GROQ_PRODUCAO"
        }
      };

      const { error } = await supabase.from('relatorios').insert(reportData);
      
      if (error) {
        console.error("Erro ao salvar relatório no Supabase:", error);
        toast({
          title: "Relatório gerado com sucesso!",
          description: "Mas houve um erro ao salvar. Você pode tentar salvar manualmente.",
          variant: "destructive",
        });
      } else {
        console.log('✅ Relatório salvo com IA GROQ');
        toast({
          title: "Relatório gerado e salvo com sucesso!",
          description: "Seu relatório estratégico está pronto para análise.",
        });
      }
    } catch (dbError) {
      console.error("Erro ao salvar no banco de dados:", dbError);
    }
  };

  // Função principal para gerar o relatório
  const generateReport = async () => {
    setProcessingState('processing');
    setProcessingError(null);
    
    try {
      let updatedResultados: ResultadoFinalData;
      
      if (shouldUseFallback()) {
        console.warn("⚠️ Fallback acionado - IA em modo simulação");
        updatedResultados = generateMockResponse(formData);
      } else {
        console.log("🚀 Usando GROQ API em produção");
        
        const prompt = generateSWOTPrompt(formData);
        
        const response = await fetchGROQResult({
          prompt,
          onSuccess: (data) => {
            console.log("✅ Resposta OK - GROQ retornou dados válidos");
          },
          onError: (error) => {
            console.error("❌ Erro na API GROQ:", error);
          }
        });
        
        updatedResultados = parseGROQOutput(response);
      }
      
      setResultadoFinal(updatedResultados);
      setProcessingState('completed');
      
      // Salvar no Supabase
      await saveReportToSupabase(updatedResultados);
      
      // Enviar dados para o componente pai se necessário
      if (onAIComplete) {
        onAIComplete(updatedResultados);
      }
      
    } catch (error) {
      console.error("❌ Fallback acionado - Erro ao gerar relatório:", error);
      setProcessingError(error.message || "Ocorreu um erro ao processar os dados.");
      setProcessingState('failed');
      
      // Mostrar toast com mensagem de erro apropriada
      if (error.message.includes("demorou para responder")) {
        toast({
          title: "Tempo limite excedido",
          description: "A IA demorou para responder. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } else if (error.message.includes("incompleta")) {
        toast({
          title: "Resposta incompleta",
          description: "A análise retornada está incompleta. Tente novamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao gerar relatório",
          description: error.message || "Ocorreu um erro ao processar os dados. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    generateReport();
  };

  useEffect(() => {
    generateReport();
  }, [formData]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="mb-6">
            <Loader className="h-12 w-12 animate-spin text-[#ef0002]" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            ⏳ Processando sua análise com inteligência estratégica GROQ...
          </h3>
          <p className="text-gray-600 max-w-md text-center">
            {timeoutWarning 
              ? "Isso está demorando mais do que o esperado. Por favor, aguarde..." 
              : "Estamos analisando seus dados e gerando um relatório estratégico personalizado."}
          </p>
          <div className="w-full max-w-md mt-8">
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-1 bg-[#ef0002] animate-pulse w-full"></div>
            </div>
          </div>
          {shouldUseFallback() && (
            <div className="mt-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
              ⚠️ IA em modo simulação. Resultados não são reais.
            </div>
          )}
        </div>
      ) : processingError ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center mb-8">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-red-600 mb-4">
              Erro ao gerar relatório
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{processingError}</p>
            <Button 
              onClick={handleRetry} 
              className="bg-[#ef0002] hover:bg-[#c50000] text-white mr-2"
            >
              Tentar novamente
            </Button>
            <Button 
              variant="outline" 
              onClick={onRestart}
            >
              Voltar ao início
            </Button>
          </div>
        </div>
      ) : (
        <AIResultRenderer 
          data={resultadoFinal}
          onRestart={onRestart}
        />
      )}
    </div>
  );
};

export default AIBlock;
