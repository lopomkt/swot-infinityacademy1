
import React from 'react';
import { FormData } from '@/types/formData';
import DownloadContato from './DownloadContato';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface ResultsScreenWrapperProps {
  formData: FormData;
  onExportPDF: () => void;
  onContactTeam: () => void;
  onNovaAnalise?: () => void;
}

const ResultsScreenWrapper: React.FC<ResultsScreenWrapperProps> = ({
  formData,
  onExportPDF,
  onContactTeam,
  onNovaAnalise
}) => {
  const { userData } = useAuth();
  const location = useLocation();
  
  // Only show "Nova Análise" button if:
  // 1. Result is ready AND
  // 2. User is not on /visualizar page AND
  // 3. User is not an admin
  const isResultReady = !!formData.resultadoFinal?.ai_block_pronto;
  const isVisualizarPage = location.pathname.includes('/visualizar');
  const isAdmin = userData?.is_admin === true;
  const adminTeste = new URLSearchParams(location.search).get("admin_teste") === "true";
  
  const showNovaAnaliseButton = isResultReady && !isVisualizarPage && !isAdmin && !adminTeste;

  // Handler with confirmation for Nova Análise
  const handleNovaAnalise = () => {
    if (onNovaAnalise && confirm("Deseja iniciar uma nova análise? Seu relatório atual será salvo.")) {
      onNovaAnalise();
    }
  };

  return (
    <DownloadContato
      onExportPDF={onExportPDF}
      onContactTeam={onContactTeam}
      onNovaAnalise={handleNovaAnalise}
      showNovaAnaliseButton={showNovaAnaliseButton}
    />
  );
};

export default ResultsScreenWrapper;
