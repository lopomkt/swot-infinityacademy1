
import React from "react";
import { ResultadoFinalData } from "@/types/formData";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface AIResultRendererProps {
  data: ResultadoFinalData;
  onRestart: () => void;
}

const AIResultRenderer: React.FC<AIResultRendererProps> = ({ data, onRestart }) => {
  const { user } = useAuth();

  const handleSaveReport = () => {
    if (user) {
      console.log("Relatório já salvo automaticamente");
      toast({
        title: "Relatório já salvo",
        description: "Seu relatório estratégico já foi salvo automaticamente.",
      });
    } else {
      console.log("Usuário não autenticado, não é possível salvar");
      toast({
        title: "Login necessário para salvar",
        description: "Faça login para salvar seus relatórios.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#560005] mb-4">
          Relatório Estratégico SWOT Insights
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Análise personalizada com base nos dados fornecidos sobre seu negócio. 
          Use este relatório como guia para suas decisões estratégicas.
        </p>
        {data.tipo === "GROQ_PRODUCAO" && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Powered by GROQ AI
            </span>
          </div>
        )}
      </div>

      {/* Matriz SWOT */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-2xl font-bold text-[#ef0002] mb-4">
          Matriz SWOT detalhada da sua empresa
        </h3>
        <div className="prose max-w-none">
          {data.matriz_swot.split('\n\n').map((section, index) => {
            const lines = section.split('\n');
            const title = lines[0];
            const items = lines.slice(1);
            
            return (
              <div key={index} className="mb-6">
                {title.startsWith('##') && (
                  <h4 className="text-xl font-semibold mb-3">
                    {title.replace('##', '').trim()}
                  </h4>
                )}
                <ul className="list-disc pl-6 space-y-2">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace('-', '').trim()}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnóstico Textual */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-2xl font-bold text-[#ef0002] mb-4">
          Análise estratégica gerada por inteligência artificial
        </h3>
        <div className="prose max-w-none text-gray-700">
          {data.diagnostico_textual.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Planos de Ação */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-2xl font-bold text-[#ef0002] mb-4">
          Plano de ação com rotas estratégicas sugeridas
        </h3>
        <div className="prose max-w-none">
          {data.planos_acao.split('\n\n').map((section, index) => {
            const lines = section.split('\n');
            const title = lines[0];
            const items = lines.slice(1);
            
            return (
              <div key={index} className="mb-8">
                {title.startsWith('#') && (
                  <h4 className="text-xl font-semibold mb-3">
                    {title.replace('#', '').trim()}
                  </h4>
                )}
                <ol className="list-decimal pl-6 space-y-2">
                  {items.map((item, i) => {
                    const parts = item.trim().split('.');
                    if (parts.length > 1) {
                      return <li key={i}>{parts.slice(1).join('.').trim()}</li>;
                    }
                    return <li key={i}>{item}</li>;
                  })}
                </ol>
              </div>
            );
          })}
        </div>
      </div>

      {data.ai_block_pronto === true && data.gpt_prompt_ok === true && (
        <div className="flex justify-center space-x-4 pt-8">
          <Button 
            className="bg-[#ef0002] hover:bg-[#c50000] text-white px-8 py-2"
            onClick={handleSaveReport}
          >
            {user ? "Relatório Salvo" : "Salvar Relatório (Login Necessário)"}
          </Button>
          <Button 
            variant="outline"
            className="border-[#ef0002] text-[#ef0002] hover:bg-[#ffeeee] px-8 py-2"
            onClick={onRestart}
            disabled={!data.ai_block_pronto}
          >
            Iniciar Novo Diagnóstico
          </Button>
        </div>
      )}
      
      {/* Tag técnica de encerramento */}
      <div className="hidden">
        fase5_groq_api_ok = true
        fase5_groq_reforco_ok = true
        groq_migration_complete = true
        timestamp = {new Date().toISOString()}
      </div>
    </div>
  );
};

export default AIResultRenderer;
