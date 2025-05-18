
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResultsScreen from "@/pages/ResultsScreen";
import LoadingScreen from "@/components/Auth/LoadingScreen";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
    <div>
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
