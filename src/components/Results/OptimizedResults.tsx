
import React, { memo, useMemo } from 'react';
import { FormData } from '@/types/formData';
import { useIsMobile } from '@/hooks/use-mobile';

interface OptimizedResultsProps {
  formData: FormData;
  children: React.ReactNode;
}

const OptimizedResults = memo(function OptimizedResults({ 
  formData, 
  children 
}: OptimizedResultsProps) {
  const isMobile = useIsMobile();
  
  // Memoize processed data to avoid recalculations
  const processedData = useMemo(() => {
    if (!formData) return null;
    
    return {
      empresa: formData.identificacao?.nomeEmpresa || 'Empresa',
      segmento: formData.identificacao?.segmento || 'Não informado',
      faturamento: formData.identificacao?.faturamentoMensal || 'Não informado',
      tempo: formData.identificacao?.tempoDeMercado || 'Não informado',
      hasResults: !!formData.resultadoFinal?.ai_block_pronto
    };
  }, [formData]);

  if (!processedData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ef0002] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        min-h-screen bg-gradient-to-br from-gray-50 to-white
        ${isMobile ? 'px-4 py-6' : 'px-8 py-12'}
      `}
      role="main"
      aria-label="Resultados da análise SWOT"
    >
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
});

export default OptimizedResults;
