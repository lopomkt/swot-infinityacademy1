
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
  pontos_inconsistentes: string[];
  fraqueza_critica: string;
  bloqueio_estrategico: string;
  centralizacao_gestao: string;
  retrabalho_frequente: string;
  clareza_funcoes: number;
  documentacao_processos: string;
  indicadores_ativos: string;
  ferramentas_utilizadas: string;
  tentativas_resolucao: string;
  tentativa_falha_motivo?: string;
  step_fraquezas_ok: boolean;
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
  meta_90_dias: string;
  top3_desafios: string;
  areas_fraqueza: string[];
  areas_potenciais: string[];
  ajuda_externa_urgente: string;
  acao_unica_desejada: string;
  engajamento_equipe: number;
  distribuicao_tempo: "Sim" | "Parcialmente" | "Estou sobrecarregado";
  comprometimento_estrategico: number;
  estilo_decisao: "Analítico" | "Rápido e objetivo" | "Intuitivo" | "Compartilhado com sócios / equipe";
  prontidao_execucao?: "Sim" | "Com adaptações" | "Ainda não";
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
