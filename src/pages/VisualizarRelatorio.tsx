
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/types/formData";
import ResultsScreen from './ResultsScreen';
import LoadingScreen from "@/components/Auth/LoadingScreen";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

const VisualizarRelatorio = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();
  
  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Enhanced report ID retrieval
        const params = new URLSearchParams(location.search);
        const relatorioId = params.get('id') || sessionStorage.getItem('relatorio_id');
        
        if (!relatorioId) {
          setError("ID do relatório não fornecido. Verifique o link utilizado.");
          setLoading(false);
          return;
        }
        
        // Enhanced database query with better error handling
        const { data, error } = await supabase
          .from('relatorios')
          .select('*')
          .eq('id', relatorioId)
          .single();
          
        if (error) {
          console.error("Erro ao buscar relatório:", error);
          setError("Não foi possível carregar o relatório. Verifique se o link está correto.");
          setLoading(false);
          return;
        }
        
        if (!data) {
          setError("Relatório não encontrado ou foi removido.");
          setLoading(false);
          return;
        }
        
        // Enhanced permission check
        if (!userData?.is_admin && data.user_id !== userData?.id) {
          setError("Você não tem permissão para visualizar este relatório.");
          setLoading(false);
          return;
        }
        
        // Enhanced data validation and processing
        if (!data.dados || typeof data.dados !== "object") {
          setError("Relatório com dados inválidos ou corrompidos.");
          setLoading(false);
          return;
        }
        
        // Safe data processing with fallbacks
        const dadosForm = typeof data.dados === 'object' && data.dados !== null 
          ? data.dados as Record<string, unknown>
          : {};
          
        const resultadoFinal = typeof data.resultado_final === 'object' && data.resultado_final !== null 
          ? data.resultado_final as FormData['resultadoFinal']
          : undefined;
        
        // Construct final data structure
        const fullData: FormData = {
          ...dadosForm,
          resultadoFinal: resultadoFinal,
        } as FormData;
        
        setFormData(fullData);
        
      } catch (err) {
        console.error("Erro ao processar relatório:", err);
        setError("Ocorreu um erro inesperado ao carregar o relatório.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRelatorio();
  }, [location.search, userData]);
  
  const handleBack = () => {
    // Enhanced navigation logic
    if (userData?.is_admin) {
      navigate('/admin');
    } else {
      navigate('/historico');
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (error || !formData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center mb-4">
            <AlertCircle className="text-red-500 mr-2" />
            <h2 className="text-lg font-medium text-red-700">Erro ao carregar relatório</h2>
          </div>
          <p className="text-red-600 mb-6">{error || "Não foi possível carregar os dados do relatório."}</p>
          <div className="flex gap-2">
            <Button onClick={handleBack} className="flex-1">
              Voltar
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-white bg-opacity-90 backdrop-blur-sm shadow-md hover:bg-opacity-100 transition-all"
          onClick={handleBack}
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>
      </div>
      
      <ResultsScreen 
        formData={formData} 
        onRestart={() => {/* View mode - no action needed */}} 
        isViewMode={true} 
      />
    </div>
  );
};

export default VisualizarRelatorio;
