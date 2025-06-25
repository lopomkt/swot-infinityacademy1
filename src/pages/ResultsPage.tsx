
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResultsScreen from "@/pages/ResultsScreen";
import LoadingScreen from "@/components/Auth/LoadingScreen";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ResultsPage = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Enhanced data loading with better error handling
    const relatorioCarregado = sessionStorage.getItem("relatorioCarregado");
    
    if (relatorioCarregado) {
      try {
        const parsedData = JSON.parse(relatorioCarregado);
        
        // Validate essential data structure
        if (parsedData && typeof parsedData === 'object') {
          setFormData(parsedData);
        } else {
          throw new Error('Dados do relatório inválidos');
        }
      } catch (error) {
        console.error("Erro ao processar dados do relatório:", error);
        toast({
          title: "Erro no carregamento",
          description: "Não foi possível processar os dados do relatório.",
          variant: "destructive"
        });
      }
    }
    
    setLoading(false);
  }, []);

  const handleBackToHistory = () => {
    navigate("/historico");
  };

  const handleNewAnalysis = () => {
    // Enhanced new analysis flow
    sessionStorage.removeItem("relatorioCarregado");
    toast({
      title: "Nova análise iniciada",
      description: "Você será direcionado para iniciar uma nova análise SWOT.",
      duration: 3000
    });
    navigate("/");
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!formData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-center mb-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Relatório não encontrado</h2>
          <p className="text-gray-600 mb-6">
            Não foi possível carregar os dados do relatório solicitado. 
            Isso pode acontecer se o relatório expirou ou há problemas de conectividade.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/historico")} variant="outline">
              Ver histórico
            </Button>
            <Button onClick={() => navigate("/")} className="bg-[#ef0002] hover:bg-[#c50000]">
              Nova análise
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <div className="fixed top-4 left-4 z-50">
        <Button 
          onClick={handleBackToHistory}
          variant="outline"
          className="flex items-center gap-1 bg-white bg-opacity-90 backdrop-blur-sm shadow-md hover:bg-opacity-100 transition-all"
        >
          <ArrowLeft size={16} />
          Voltar ao histórico
        </Button>
      </div>
      
      <ResultsScreen 
        formData={formData} 
        onNovaAnalise={handleNewAnalysis}
        isViewMode={false}
      />
    </div>
  );
};

export default ResultsPage;
