
import React from 'react';
import { FormData } from '@/types/formData';
import DownloadContato from './DownloadContato';

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
  // Show the Nova Análise button only if a result is available
  const showNovaAnaliseButton = !!formData.resultadoFinal?.ai_block_pronto;

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
