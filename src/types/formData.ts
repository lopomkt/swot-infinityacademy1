export interface FormData {
  identificacao?: Identificacao;
  forcas?: Forcas;
  fraquezas?: Fraquezas;
  oportunidades?: Oportunidades;
  ameacas?: Ameacas;
  financeiro?: Financeiro;
  prioridades?: Prioridades;
  resultadoFinal?: ResultadoFinalData;
}

export interface Identificacao {
  nomeEmpresa?: string;
  segmento?: string;
  tempoDeMercado?: string;
  faturamentoMensal?: string;
}

export interface Forcas {
  respostas?: string[];
}

export interface Fraquezas {
  pontos_inconsistentes?: string[];
}

export interface Oportunidades {
  respostas?: string[];
}

export interface Ameacas {
  respostas?: string[];
}

export interface Financeiro {
  custo_fixo_mensal?: string;
  receita_media_mensal?: string;
  margem_contribuicao?: string;
}

export interface Prioridades {
  foco_estrategico?: string;
  comprometimento_estrategico?: string;
}

export interface ResultadoFinalData {
  diagnostico_textual?: string;
  matriz_swot?: string;
  planos_acao?: string;
  conclusoes?: string;
  gargalos?: string[];
  alertasCascata?: string[];
  score_estrategico?: any[];
  planoA?: string[];
  planoB?: string[];
  planoC?: string[];
  ai_block_pronto?: boolean;
  gpt_prompt_ok?: boolean;
  resultados_pdf_export_ready?: boolean;
  resultados_bloco5_e_4b_ok?: boolean;
  fase7_2_consultivo_avancado_ok?: boolean;
  fase7_5_1_correcao_total_ok?: boolean;
  maturidade_setorial?: string;
}
