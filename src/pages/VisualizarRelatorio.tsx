
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
        
        // Obter ID do relatório da URL
        const params = new URLSearchParams(location.search);
        const relatorioId = params.get('id') || sessionStorage.getItem('relatorio_id');
        
        if (!relatorioId) {
          setError("ID do relatório não fornecido.");
          setLoading(false);
          return;
        }
        
        // Buscar dados do relatório
        const { data, error } = await supabase
          .from('relatorios')
          .select('*')
          .eq('id', relatorioId)
          .single();
          
        if (error) {
          console.error("Erro ao buscar relatório:", error);
          setError("Não foi possível carregar o relatório.");
          setLoading(false);
          return;
        }
        
        if (!data) {
          setError("Relatório não encontrado.");
          setLoading(false);
          return;
        }
        
        // Verificar acesso se não for admin
        if (!userData?.is_admin && data.user_id !== userData?.id) {
          setError("Você não tem permissão para visualizar este relatório.");
          setLoading(false);
          return;
        }
        
        // Verificar se dados é um objeto antes de usar spread operator
        const dadosForm = typeof data.dados === 'object' && data.dados !== null 
          ? data.dados 
          : {};
          
        // Verificar se resultado_final é um objeto antes de atribuir
        const resultadoFinal = typeof data.resultado_final === 'object' && data.resultado_final !== null 
          ? data.resultado_final 
          : {};
        
        // Combinar dados do formulário com resultado final
        const fullData: FormData = {
          ...dadosForm as Record<string, unknown>,
          resultadoFinal: resultadoFinal as FormData['resultadoFinal'],
        };
        
        setFormData(fullData);
      } catch (err) {
        console.error("Erro ao processar relatório:", err);
        setError("Ocorreu um erro ao processar o relatório.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRelatorio();
  }, [location.search]);
  
  const handleBack = () => {
    // Se for admin, voltar para o painel administrativo
    if (userData?.is_admin) {
      navigate('/admin');
    } else {
      // Se for usuário comum, voltar para histórico ou home
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
          <Button onClick={handleBack} className="w-full">
            Voltar
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleBack}
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>
      </div>
      
      <ResultsScreen 
        formData={formData} 
        onRestart={() => {/* Em modo visualização, não fazer nada */}} 
        isViewMode={true} 
      />
    </div>
  );
};

export default VisualizarRelatorio;
