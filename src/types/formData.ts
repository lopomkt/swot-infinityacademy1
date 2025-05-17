
export interface FormData {
  identificacao?: Identificacao;
  forcas?: Forcas;
  fraquezas?: Fraquezas;
  oportunidades?: Oportunidades;
  ameacas?: Ameacas;
  financeiro?: Financeiro;
  prioridades?: Prioridades;
  resultadoFinal?: ResultadoFinalData;
  saudeFinanceira?: SaudeFinanceira;
  tipagem_index_ok?: boolean;
  fase5_transicoes_ok?: boolean;
  fase5_voltar_ok?: boolean;
  fase5_gamificacao_ok?: boolean;
  fase5_finalizacao_ok?: boolean;
  fase5_resultado_final_ok?: boolean;
  fase6_1_welcome_transicoes_premium_ok?: boolean;
  fase6_2_resultado_premium_visual_ok?: boolean;
  fase6_3_design_final_pdf_ok?: boolean;
  fase7_1_ui_ux_gamificada_ok?: boolean;
  fase7_2_consultivo_avancado_ok?: boolean;
  fase7_3_polimento_final_ok?: boolean;
  fase7_5_1_correcao_total_ok?: boolean;
  step_forcas_ok?: boolean;
  step_prioridades_ok?: boolean;
}

export interface Identificacao {
  nomeEmpresa?: string;
  segmento?: string;
  tempoDeMercado?: string;
  faturamentoMensal?: string;
}

export interface Forcas {
  respostas?: string[];
  forca1?: string;
  forca2?: string;
  forca3?: string;
}

export interface Fraquezas {
  pontos_inconsistentes?: string[];
  fraqueza1?: string;
  fraqueza2?: string;
  fraqueza3?: string;
}

export interface Oportunidades {
  respostas?: string[];
  oportunidade1?: string;
  oportunidade2?: string;
  oportunidade3?: string;
}

export interface Ameacas {
  respostas?: string[];
  ameaca1?: string;
  ameaca2?: string;
  ameaca3?: string;
}

export interface Financeiro {
  custo_fixo_mensal?: string;
  receita_media_mensal?: string;
  margem_contribuicao?: string;
}

export interface SaudeFinanceira {
  custo_fixo_mensal?: string;
  receita_media_mensal?: string;
  margem_contribuicao?: string;
  maturidade_financeira?: string;
}

export interface Prioridades {
  foco_estrategico?: string;
  comprometimento_estrategico?: string;
  meta_90_dias?: string;
  top3_desafios?: string;
  areas_fraqueza?: string[];
  areas_potenciais?: string[];
  ajuda_externa_urgente?: string;
  acao_unica_desejada?: string;
  engajamento_equipe?: string;
  estilo_decisao?: string;
  maior_obstáculo?: string;
  maior_gargalo?: string;
}

export interface ResultadoFinalData {
  diagnostico_textual?: string;
  matriz_swot?: string;
  planos_acao?: string;
  conclusoes?: string;
  gargalos?: string[];
  alertasCascata?: string[];
  score_estrategico?: StrategicScoreItem[];
  planoA?: string[];
  planoB?: string[];
  planoC?: string[];
  acoes_priorizadas?: string[];
  ai_block_pronto?: boolean;
  gpt_prompt_ok?: boolean;
  resultados_pdf_export_ready?: boolean;
  resultados_bloco5_e_4b_ok?: boolean;
  fase7_2_consultivo_avancado_ok?: boolean;
  fase7_5_1_correcao_total_ok?: boolean;
  maturidade_setorial?: string;
  acoes_priorizadas_lista?: string[];
}

export interface StrategicScoreItem {
  subject: string;
  A: number;
  fullMark: number;
}
