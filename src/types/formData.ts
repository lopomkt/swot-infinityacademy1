
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
  nova_demanda_cliente: string;
  situacao_mercado: string;
  nichos_ocultos: string;
  concorrentes_enfraquecendo: string;
  tendencias_aproveitaveis: string[];
  tendencias_outro?: string;
  demanda_nao_atendida: string;
  parcerias_possiveis: string;
  recurso_ocioso: string;
  canais_potenciais: string[];
  canais_outro?: string;
  nivel_disposicao: number;
  acao_inicial_oportunidade?: string;
  step_oportunidades_ok: boolean;
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
  acoes_priorizadas: string[];
  scoreLabel?: string;  // Added for ScoreEstrategico component
  pontuacao?: number;   // Added for ScoreEstrategico component
  resultados_pdf_export_ready?: boolean;
  resultados_bloco5_e_4b_ok?: boolean;
  gpt_prompt_ok?: boolean;
  ai_block_pronto?: boolean;
}

// Flag interna para controlar a tipagem
// tipagem_resultado_final_ok = true
// tipagem_oportunidades_ok = true

export interface FormData {
  identificacao?: {
    nomeEmpresa: string;
    segmento: string;
    faturamentoMensal: string;
    tempoDeMercado: string;
  };
  forcas?: {
    respostas: string[];
  };
  fraquezas?: {
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
  };
  oportunidades?: {
    nova_demanda_cliente: string;
    situacao_mercado: string;
    nichos_ocultos: string;
    concorrentes_enfraquecendo: string;
    tendencias_aproveitaveis: string[];
    tendencias_outro?: string;
    demanda_nao_atendida: string;
    parcerias_possiveis: string;
    recurso_ocioso: string;
    canais_potenciais: string[];
    canais_outro?: string;
    nivel_disposicao: number;
    acao_inicial_oportunidade?: string;
    step_oportunidades_ok: boolean;
    respostas: string[];
  };
  ameacas?: {
    respostas: string[];
  };
  saudeFinanceira?: {
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
  };
  prioridades?: {
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
  };
  resultadoFinal?: ResultadoFinalData;
  // Control flags at root level
  step_prioridades_ok?: boolean;
  step_fraquezas_ok?: boolean;
  step_oportunidades_ok?: boolean;
  step_financeiro_ok?: boolean;
  step_ameacas_ok?: boolean;
  step_forcas_ok?: boolean;
  step_resultado_ok?: boolean;
  tipagem_index_ok?: boolean;
}
