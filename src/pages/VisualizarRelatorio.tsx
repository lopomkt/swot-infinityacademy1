
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FormData } from "@/types/formData";
import ResultsScreen from "./ResultsScreen";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const VisualizarRelatorio = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
        return;
      }
      
      carregarRelatorio();
    }
  }, [user, authLoading]);

  const carregarRelatorio = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obter o ID do relatório da sessionStorage
      const relatorioId = sessionStorage.getItem('relatorio_id');
      
      if (!relatorioId) {
        setError("ID do relatório não encontrado");
        toast.error("ID do relatório não encontrado");
        return;
      }

      // Buscar o relatório no Supabase
      const { data, error } = await supabase
        .from("relatorios")
        .select("*")
        .eq("id", relatorioId)
        .single();

      if (error) {
        console.error("Erro ao carregar relatório:", error);
        setError("Não foi possível carregar o relatório");
        toast.error("Não foi possível carregar o relatório");
        return;
      }

      if (!data) {
        setError("Relatório não encontrado");
        toast.error("Relatório não encontrado");
        return;
      }

      // Verificar se o usuário tem permissão para visualizar este relatório
      // Permite se for o dono do relatório ou se for um administrador
      const { data: userInfo } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", user?.id)
        .single();

      const isAdmin = userInfo?.is_admin === true;
      const isOwner = data.user_id === user?.id;

      if (!isAdmin && !isOwner) {
        setError("Você não tem permissão para visualizar este relatório");
        toast.error("Você não tem permissão para visualizar este relatório");
        return;
      }

      // Verificar se os dados e o resultado_final existem
      if (!data.dados || !data.resultado_final) {
        setError("Relatório incompleto ou corrompido");
        toast.error("Relatório incompleto ou corrompido");
        return;
      }

      // Typecast the JSON data from Supabase to the expected structure
      const dadosObj = data.dados as Record<string, any>;
      const resultadoFinalObj = data.resultado_final as Record<string, any>;

      // Create formData object with proper typings
      const formDataRestaurado: FormData = {
        identificacao: dadosObj.identificacao || {},
        saudeFinanceira: dadosObj.saudeFinanceira || {},
        forcas: dadosObj.forcas || [],
        fraquezas: dadosObj.fraquezas || [],
        oportunidades: dadosObj.oportunidades || [],
        ameacas: dadosObj.ameacas || [],
        prioridades: dadosObj.prioridades || {},
        resultadoFinal: resultadoFinalObj
      };

      // Guardar o formData restaurado na sessionStorage (opcional, para manter consistência)
      sessionStorage.setItem("relatorioCarregado", JSON.stringify(formDataRestaurado));
      
      setFormData(formDataRestaurado);
    } catch (error) {
      console.error("Erro ao processar relatório:", error);
      setError("Ocorreu um erro ao processar o relatório");
      toast.error("Ocorreu um erro ao processar o relatório");
    } finally {
      setLoading(false);
    }
  };

  // Função para voltar ao histórico de relatórios
  const voltarParaHistorico = () => {
    navigate("/historico");
  };

  // Se estiver carregando, mostrar indicador
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-[#ef0002] mb-4" />
        <p className="text-lg text-gray-600">Carregando relatório...</p>
      </div>
    );
  }

  // Se ocorreu um erro, mostrar mensagem de erro
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Button onClick={voltarParaHistorico}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o histórico
          </Button>
        </div>
      </div>
    );
  }

  // Se o formData foi carregado com sucesso, renderizar o ResultsScreen
  if (formData) {
    return (
      <>
        <div className="bg-white py-4 px-6 border-b shadow-sm">
          <Button variant="outline" onClick={voltarParaHistorico} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o histórico
          </Button>
        </div>
        <ResultsScreen formData={formData} />
      </>
    );
  }

  // Fallback caso nenhuma condição acima seja verdadeira
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-red-500 text-center">Relatório não encontrado ou inválido.</p>
      <Button onClick={voltarParaHistorico} className="mt-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para o histórico
      </Button>
    </div>
  );
};

export default VisualizarRelatorio;
