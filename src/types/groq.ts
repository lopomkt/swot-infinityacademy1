
export interface FormData {
  identificacao?: Identificacao;
  forcas?: Forcas;
  fraquezas?: Fraquezas;
  oportunidades?: Oportunidades;
  ameacas?: Ameacas;
  saudeFinanceira?: SaudeFinanceira;
  prioridades?: Prioridades;
  resultadoFinal?: ResultadoFinalData;
}

export interface Identificacao {
  nomeEmpresa?: string;
  segmento?: string;
  tempoDeMercado?: string;
  faturamentoMensal?: string;
  tipo_produto_servico?: string;
  tempo_retencao_clientes?: string;
  perfil_cliente_ideal?: string;
  fonte_trafego_principal?: string;
  nivel_automacao?: string;
  canais_venda_atuais?: string;
  numero_colaboradores?: string;
  modelo_precificacao?: string;
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
  nova_demanda_cliente?: string;
  situacao_mercado?: string;
  nichos_ocultos?: string;
  concorrentes_enfraquecendo?: string;
  tendencias_aproveitaveis?: string[];
  tendencias_outro?: string;
  demanda_nao_atendida?: string;
  parcerias_possiveis?: string;
  recurso_ocioso?: string;
  canais_potenciais?: string[];
  canais_outro?: string;
  nivel_disposicao?: number;
  acao_inicial_oportunidade?: string;
}

export interface Ameacas {
  respostas?: string[];
  ameaca1?: string;
  ameaca2?: string;
  ameaca3?: string;
  fator_preocupante?: string;
  concorrente_em_ascensao?: string;
  dependencia_parceiros?: string;
  ameaca_legislativa?: string;
  sazonalidade_negocio?: string;
  detalheSazonalidade?: string;
  dependencia_plataformas?: string[];
  mudanca_comportamental?: string;
  resiliencia_crise?: string;
  perdas_externas?: string;
  detalhePerda?: string;
  impacto_ameacas?: number;
  estrategia_defesa?: string;
}

export interface SaudeFinanceira {
  custo_fixo_mensal?: string;
  receita_media_mensal?: string;
  margem_contribuicao?: string;
  maturidade_financeira?: string;
  caixa_disponivel?: string;
  autonomia_caixa?: string;
  controle_financeiro?: string;
  fluxo_frequencia?: string;
  endividamento_nivel?: string;
  inadimplencia_clientes?: string;
  custos_fixos?: string;
  cac_estimado_conhecimento?: string;
  cac_estimado?: string;
  orcamento_planejado?: string;
  intencao_investimento?: string;
  margem_lucro_liquida?: string;
  previsao_orcamentaria?: string;
  grau_endividamento?: string;
}

export interface Prioridades {
  foco_estrategico?: string;
  comprometimento_estrategico?: number;
  meta_90_dias?: string;
  top3_desafios?: string;
  areas_fraqueza?: string[];
  areas_potenciais?: string[];
  ajuda_externa_urgente?: string;
  acao_unica_desejada?: string;
  engajamento_equipe?: number;
  estilo_decisao?: "Analítico" | "Rápido e objetivo" | "Intuitivo" | "Compartilhado com sócios / equipe" | string;
  distribuicao_tempo?: "Sim" | "Parcialmente" | "Estou sobrecarregado" | string;
  maior_obstáculo?: string;
  maior_gargalo?: string;
  distribuicao_tempo_atual?: string;
  prontidao_execucao?: "Sim" | "Com adaptações" | "Ainda não" | string;
  meta_crescimento_6_meses?: string;
  meta_crescimento_12_meses?: string;
  tipo_investimento?: string;
}

export interface ResultadoFinalData {
  diagnostico_textual?: string;
  matriz_swot?: string;
  planos_acao?: string;
  conclusoes?: string;
  gargalos?: string[];
  alertasCascata?: string[];
  acoes_priorizadas?: string[];
  ai_block_pronto?: boolean;
  gpt_prompt_ok?: boolean;
  resultados_pdf_export_ready?: boolean;
  tipo?: string;
  created_at?: string;
}

export interface GROQResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface ParsedReport {
  matriz_swot: string;
  diagnostico_textual: string;
  planos_acao: string;
  acoes_priorizadas: string[];
  gpt_prompt_ok: boolean;
  ai_block_pronto: boolean;
  tipo: string;
  created_at: string;
}

export interface ReportGenerationResult {
  resultado?: ParsedReport;
  loading: boolean;
  error?: string;
}
