
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
    // Get the loaded report data from sessionStorage
    const relatorioCarregado = sessionStorage.getItem("relatorioCarregado");
    
    if (relatorioCarregado) {
      try {
        const parsedData = JSON.parse(relatorioCarregado);
        setFormData(parsedData);
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
    // Clear loaded report and go to home
    sessionStorage.removeItem("relatorioCarregado");
    toast({
      title: "Nova análise iniciada",
      description: "Seu relatório anterior foi salvo no histórico."
    });
    navigate("/");
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!formData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Relatório não encontrado</h2>
          <p className="text-gray-600 mb-6">Não foi possível carregar os dados do relatório solicitado.</p>
          <Button onClick={() => navigate("/historico")}>Voltar para o histórico</Button>
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
          className="flex items-center gap-1 bg-white bg-opacity-80 backdrop-blur-sm"
        >
          <ArrowLeft size={16} />
          Voltar ao histórico
        </Button>
      </div>
      
      <ResultsScreen 
        formData={formData} 
        onNovaAnalise={handleNewAnalysis}
      />
    </div>
  );
};

export default ResultsPage;
