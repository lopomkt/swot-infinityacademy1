
export interface StepSummaryItem {
  etapa: string;
  respostas: string[];
}

export function useStepSummaryData() {
  const getStepSummary = (allData?: any): StepSummaryItem[] => {
    if (!allData) return [];

    const summary: StepSummaryItem[] = [];

    // Forças
    if (allData.forcas) {
      const forcasRespostas = Object.entries(allData.forcas)
        .filter(([key, value]) => value && key !== 'step_forcas_ok' && key !== 'respostas')
        .map(([key, value]) => value as string);
      
      if (forcasRespostas.length > 0) {
        summary.push({
          etapa: "Forças",
          respostas: forcasRespostas
        });
      }
    }

    // Fraquezas
    if (allData.fraquezas) {
      const fraquezasRespostas = Object.entries(allData.fraquezas)
        .filter(([key, value]) => value && key !== 'step_fraquezas_ok' && key !== 'respostas')
        .map(([key, value]) => Array.isArray(value) ? value.join(', ') : value as string);
      
      if (fraquezasRespostas.length > 0) {
        summary.push({
          etapa: "Fraquezas",
          respostas: fraquezasRespostas
        });
      }
    }

    // Oportunidades
    if (allData.oportunidades) {
      const oportunidadesRespostas = Object.entries(allData.oportunidades)
        .filter(([key, value]) => value && key !== 'step_oportunidades_ok' && key !== 'respostas')
        .map(([key, value]) => Array.isArray(value) ? value.join(', ') : value as string);
      
      if (oportunidadesRespostas.length > 0) {
        summary.push({
          etapa: "Oportunidades",
          respostas: oportunidadesRespostas
        });
      }
    }

    // Ameaças
    if (allData.ameacas) {
      const ameacasRespostas = Object.entries(allData.ameacas)
        .filter(([key, value]) => value && key !== 'step_ameacas_ok' && key !== 'respostas')
        .map(([key, value]) => Array.isArray(value) ? value.join(', ') : value as string);
      
      if (ameacasRespostas.length > 0) {
        summary.push({
          etapa: "Ameaças",
          respostas: ameacasRespostas
        });
      }
    }

    return summary;
  };

  return { getStepSummary };
}
