
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
  
  // Only show "Nova Análise" button if:
  // 1. Result is ready AND
  // 2. User is not on /visualizar page AND
  // 3. User is not an admin AND
  // 4. Not in view mode
  const isResultReady = !!formData.resultadoFinal?.ai_block_pronto;
  const isVisualizarPage = location.pathname.includes('/visualizar');
  const isAdmin = userData?.is_admin === true;
  const modoAdminTeste = new URLSearchParams(location.search).get("modo_teste_admin") === "true";
  
  const showNovaAnaliseButton = isResultReady && !isVisualizarPage && !isAdmin && !modoAdminTeste && !isViewMode;

  // Handler with confirmation for Nova Análise
  const handleNovaAnalise = () => {
    if (onNovaAnalise && confirm("Deseja iniciar uma nova análise? Seu relatório atual será salvo.")) {
      onNovaAnalise();
    }
  };

  const handleExportPDF = () => {
    // PDF export functionality would be handled by parent component
    console.log("Export PDF requested");
  };

  const handleContactTeam = () => {
    // Contact team functionality would be handled by parent component
    console.log("Contact team requested");
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
