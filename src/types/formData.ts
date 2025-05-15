
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
  caixa_disponivel: string;
  autonomia_caixa: string;
  controle_financeiro: string;
  fluxo_frequencia: string;
  endividamento_nivel: string;
  inadimplencia_clientes: string;
  custos_fixos: string;
  cac_estimado_conhecimento: string;
  cac_estimado: string;
  orcamento_planejado: string;
  intencao_investimento?: string;
  maturidade_financeira: string;
  step_financas_ok: boolean;
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
