
import React from 'react';
import { FormData } from '@/types/formData';
import DownloadContato from './DownloadContato';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface ResultsScreenWrapperProps {
  formData: FormData;
  onNovaAnalise?: () => void;
  isViewMode?: boolean;
}

const ResultsScreenWrapper: React.FC<ResultsScreenWrapperProps> = ({
  formData,
  onNovaAnalise,
  isViewMode = false
}) => {
  const { userData } = useAuth();
  const location = useLocation();
  
  // Show "Nova Análise" button with intelligent conditions
  const isResultReady = !!formData.resultadoFinal?.ai_block_pronto;
  const isVisualizarPage = location.pathname.includes('/visualizar');
  const isAdmin = userData?.is_admin === true;
  const modoAdminTeste = new URLSearchParams(location.search).get("modo_teste_admin") === "true";
  
  const showNovaAnaliseButton = isResultReady && !isVisualizarPage && !isAdmin && !modoAdminTeste && !isViewMode;

  // Enhanced handlers with better UX
  const handleNovaAnalise = () => {
    if (onNovaAnalise && confirm("Deseja iniciar uma nova análise? Seu relatório atual será salvo no histórico.")) {
      onNovaAnalise();
    }
  };

  const handleExportPDF = () => {
    console.log("Export PDF requested - delegating to parent component");
  };

  const handleContactTeam = () => {
    const phoneNumber = "5567993146148";
    const message = encodeURIComponent("Olá! Acabei de concluir o SWOT INSIGHTS da INFINITY e quero conversar com a equipe sobre o meu diagnóstico.");
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <DownloadContato
      onExportPDF={handleExportPDF}
      onContactTeam={handleContactTeam}
      onNovaAnalise={handleNovaAnalise}
      showNovaAnaliseButton={showNovaAnaliseButton}
    />
  );
};

export default ResultsScreenWrapper;
