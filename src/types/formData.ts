
// Tipagem central do projeto SWOT INSIGHTS – Infinity Academy
// Cada etapa do formulário possui sua interface específica
// Essa tipagem será usada progressivamente no projeto para substituir o uso de any

export interface IdentificacaoData {
  nomeEmpresa: string;
  segmento: string;
  faturamentoMensal: string;
  tempoDeMercado: string;
}

export interface ForcasData {
  respostas: string[]; // mínimo 8 respostas esperadas
}

export interface FraquezasData {
  respostas: string[]; // mínimo 8 respostas esperadas
}

export interface OportunidadesData {
  respostas: string[];
}

export interface AmeacasData {
  respostas: string[];
}

export interface SaudeFinanceiraData {
  temControleFinanceiro: string;
  margemLucroMedia: string;
  custoFixoMensal: string;
  possuiFluxoCaixa: string;
  nivelEndividamento: string;
  reservasEmergencia: string;
  ticketMedio: string;
  fonteReceitaPrincipal: string;
}

export interface PrioridadesData {
  grauEngajamento: string;
  tempoDisponivel: string;
  focoGestor: string;
  conhecimentoMarketing: string;
  clarezaIndicadores: string;
  focoVendas: string;
  focoFinanceiro: string;
  focoRetencao: string;
}

export interface ResultadoFinalData {
  matriz_swot: string;
  diagnostico_textual: string;
  planos_acao: string;
  acoes_priorizadas?: string[];
}

export interface FormData {
  identificacao: IdentificacaoData;
  forcas: ForcasData;
  fraquezas: FraquezasData;
  oportunidades: OportunidadesData;
  ameacas: AmeacasData;
  saudeFinanceira: SaudeFinanceiraData;
  prioridades: PrioridadesData;
  resultadoFinal?: ResultadoFinalData;
}
