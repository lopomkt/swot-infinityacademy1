// Tipagem central do projeto SWOT INSIGHTS – Infinity Academy
// Cada etapa do formulário possui sua interface específica
// Essa tipagem será usada progressivamente no projeto para substituir o uso de any

export interface IdentificacaoData {
  nomeEmpresa: string;
  segmento: string;
  faturamentoMensal: string;
  tempoDeMercado: string;
  // New fields
  tipo_produto_servico?: string;
  tempo_retencao_clientes?: string;
  perfil_cliente_ideal?: string;
  fonte_trafego_principal?: string;
  nivel_automacao?: string;
  canais_venda_atuais?: string;
  numero_colaboradores?: string;
  modelo_precificacao?: string;
  tipagem_identificacao_ok?: boolean;
}

export interface ForcasData {
  cultura_forte?: string;
  equipe_qualificada?: string;
  marca_reconhecida?: string;
  tecnologia_propria?: string;
  carteira_fiel?: string;
  diferencial_mercado?: string;
  reputacao_regional?: string;
  canais_distribuicao?: string;
  estrutura_financeira?: string;
  velocidade_entrega?: string;
  processos_otimizados?: string;
  lideranca_setorial?: string;
  atendimento_diferenciado?: string;
  outros?: string;
  respostas?: string[]; // For backward compatibility
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
  // New fields
  capacidade_inovacao?: string;
  ausencia_dados_decisao?: string;
  falta_treinamento?: string;
  problemas_cultura?: string;
  step_fraquezas_ok: boolean;
}

export interface OportunidadesData {
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
  respostas: string[]; // Required field from the OportunidadesData interface
  // New fields
  inovacao_tecnologica?: string;
  tendencias_mercado?: string;
  canais_digitais_novos?: string;
}

export interface AmeacasData {
  // Properly mapped from schema
  fator_preocupante: string;
  concorrente_em_ascensao: string;
  dependencia_parceiros: string;
  ameaca_legislativa: string;
  sazonalidade_negocio: string;
  detalheSazonalidade?: string;
  dependencia_plataformas: string[];
  mudanca_comportamental: string;
  resiliencia_crise: string;
  perdas_externas: string;
  detalhePerda?: string;
  impacto_ameacas: number;
  estrategia_defesa?: string;
  step_ameacas_ok?: boolean;
  validacao_ameacas_ok?: boolean;
  // Add the respostas field that's being used in ResultsScreen.tsx
  respostas?: string[];
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
  // New fields
  margem_lucro_liquida?: string;
  previsao_orcamentaria?: string;
  grau_endividamento?: string;
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
  // New fields
  meta_crescimento_6_meses?: string;
  meta_crescimento_12_meses?: string;
  tipo_investimento?: string;
  maior_gargalo?: string;
}

export interface ResultadoFinalData {
  ai_block_pronto?: boolean;
  gpt_prompt_ok?: boolean;
  diagnostico_textual?: string;
  matriz_swot?: string;
  planos_acao?: string;
  planoA?: string[];
  planoB?: string[];
  planoC?: string[];
  scoreLabel?: string;
  pontuacao?: number;
  resultados_pdf_export_ready?: boolean;
  resultados_bloco5_e_4b_ok?: boolean;
  gargalos?: string[];
  alertasCascata?: string[];
  acoes_priorizadas?: string[];
  fase6_3_design_final_pdf_ok?: boolean;
  fase7_1_ui_ux_gamificada_ok?: boolean;
  fase7_2_consultivo_avancado_ok?: boolean;
  fase7_3_polimento_final_ok?: boolean;
  fase7_5_1_correcao_total_ok?: boolean;
  // Add the missing property for the strategic score data
  score_estrategico?: Array<{
    subject: string;
    A: number;
    fullMark: number;
  }>;
}

// Flag interna para controlar a tipagem
// tipagem_resultado_final_ok = true
// tipagem_oportunidades_ok = true

export interface FormData {
  identificacao?: IdentificacaoData;
  forcas?: ForcasData;
  fraquezas?: FraquezasData;
  oportunidades?: OportunidadesData;
  ameacas?: AmeacasData;
  saudeFinanceira?: SaudeFinanceiraData;
  prioridades?: PrioridadesData;
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
  // New tracking tag
  fase5_perguntas_expandidas_ok?: boolean;
  // Add back button tracking tag
  fase5_voltar_ok?: boolean;
  // Add gamification tracking tag
  fase5_gamificacao_ok?: boolean;
  // Add finalization tracking tag
  fase5_finalizacao_ok?: boolean;
  // Add resultado final tracking tag
  fase5_resultado_final_ok?: boolean;
  // Add welcome and transitions premium tag
  fase6_1_welcome_transicoes_premium_ok?: boolean;
  // Add premium visual result tag
  fase6_2_resultado_premium_visual_ok?: boolean;
  // Add the final design PDF tag
  fase6_3_design_final_pdf_ok?: boolean;
  // Add UI UX gamification tag
  fase7_1_ui_ux_gamificada_ok?: boolean;
  // Add the missing property
  fase5_transicoes_ok?: boolean;
  fase7_3_polimento_final_ok?: boolean;
  fase7_5_1_correcao_total_ok?: boolean;
}
