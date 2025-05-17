
// Props para as etapas do formulário
export interface FormStepProps {
  etapa_atual: number;
  id: number;
  pergunta: string;
  tipo: string;
  opcoes?: string[];
  valor?: string;
  componente?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  aoConfirmar?: () => void;
  aoAvancar?: () => void;
  aoRetroceder?: () => void;
  aoFinalizar?: () => void;
  respostas?: string[];
  subetapas?: FormStepProps[];
  current_subetapa?: number;
  qtd_subetapas?: number;
  aoConfirmarSubetapa?: () => void;
  aoAvancarSubetapa?: () => void;
  aoRetrocederSubetapa?: () => void;
  aoFinalizarSubetapa?: () => void;
  aoPreencherSubetapa?: (resposta: string) => void;
  aoRemoverSubetapa?: (id: number) => void;
  aoRemoverResposta?: (id: number) => void;
  aoAdicionarResposta?: (resposta: string) => void;
  aoRemoverOpcao?: (opcao: string) => void;
  aoAdicionarOpcao?: (opcao: string) => void;
  aoRemoverValor?: () => void;
  aoAdicionarValor?: (valor: string) => void;
  aoRemoverRespostaSubetapa?: (id: number, resposta: string) => void;
  aoAdicionarRespostaSubetapa?: (id: number, resposta: string) => void;
  aoRemoverOpcaoSubetapa?: (id: number, opcao: string) => void;
  aoAdicionarOpcaoSubetapa?: (id: number, opcao: string) => void;
  aoRemoverValorSubetapa?: (id: number) => void;
  aoAdicionarValorSubetapa?: (id: number, valor: string) => void;
  aoRemoverRespostaSubetapaGeral?: (resposta: string) => void;
  aoAdicionarRespostaSubetapaGeral?: (resposta: string) => void;
  aoRemoverOpcaoSubetapaGeral?: (opcao: string) => void;
  aoAdicionarOpcaoSubetapaGeral?: (opcao: string) => void;
  aoRemoverValorSubetapaGeral?: () => void;
  aoAdicionarValorSubetapaGeral?: (valor: string) => void;
  aoRemoverRespostaGeral?: (resposta: string) => void;
  aoAdicionarRespostaGeral?: (resposta: string) => void;
  aoRemoverOpcaoGeral?: (opcao: string) => void;
  aoAdicionarOpcaoGeral?: (opcao: string) => void;
  aoRemoverValorGeral?: () => void;
  aoAdicionarValorGeral?: (valor: string) => void;
  aoRemoverRespostaSubetapaGeralPorId?: (id: number, resposta: string) => void;
  aoAdicionarRespostaSubetapaGeralPorId?: (id: number, resposta: string) => void;
  aoRemoverOpcaoSubetapaGeralPorId?: (id: number, opcao: string) => void;
  aoAdicionarOpcaoSubetapaGeralPorId?: (id: number, opcao: string) => void;
  aoRemoverValorSubetapaGeralPorId?: (id: number) => void;
  aoAdicionarValorSubetapaGeralPorId?: (id: number, valor: string) => void;
  aoRemoverRespostaGeralPorId?: (id: number, resposta: string) => void;
  aoAdicionarRespostaGeralPorId?: (id: number, resposta: string) => void;
  aoRemoverOpcaoGeralPorId?: (id: number, opcao: string) => void;
  aoAdicionarOpcaoGeralPorId?: (id: number, opcao: string) => void;
  aoRemoverValorGeralPorId?: (id: number) => void;
  aoAdicionarValorGeralPorId?: (id: number, valor: string) => void;
  aoRemoverRespostaSubetapaPorId?: (id: number, resposta: string) => void;
  aoAdicionarRespostaSubetapaPorId?: (id: number, resposta: string) => void;
  aoRemoverOpcaoSubetapaPorId?: (id: number, opcao: string) => void;
  aoAdicionarOpcaoSubetapaPorId?: (id: number, opcao: string) => void;
  aoRemoverValorSubetapaPorId?: (id: number) => void;
  aoAdicionarValorSubetapaPorId?: (id: number, valor: string) => void;
  aoRemoverRespostaPorId?: (id: number, resposta: string) => void;
  aoAdicionarRespostaPorId?: (id: number, resposta: string) => void;
  aoRemoverOpcaoPorId?: (id: number, opcao: string) => void;
  aoAdicionarOpcaoPorId?: (id: number, opcao: string) => void;
  aoRemoverValorPorId?: (id: number) => void;
  aoAdicionarValorPorId?: (id: number, valor: string) => void;
}

// Props para a barra de progresso
export interface ProgressProps {
  current: number;
  total: number;
  label?: string;
}

// Interface para os dados do formulário
export interface FormData {
  identificacao?: IdentificacaoData;
  forcas?: ForcasData;
  fraquezas?: FraquezasData;
  oportunidades?: OportunidadesData;
  ameacas?: AmeacasData;
  saudeFinanceira?: SaudeFinanceiraData;
  prioridades?: PrioridadesData;
  resultadoFinal?: ResultadoFinalData;
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
  fase7_5_2_ui_premium_ok?: boolean;
  step_forcas_ok?: boolean;
  step_prioridades_ok?: boolean;
}

// Interface for IdentificacaoData
export interface IdentificacaoData {
  nomeEmpresa: string;
  segmento: string;
  faturamentoMensal: string;
  tempoDeMercado: string;
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

// Interface for ForcasData
export interface ForcasData {
  respostas?: string[];
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
}

// Interface for FraquezasData
export interface FraquezasData {
  respostas?: string[];
  problemas_identificados?: string[];
  inconsistencias?: string[];
  pontos_inconsistentes?: string[];
  fraqueza_critica?: string;
  bloqueio_estrategico?: string;
  centralizacao_gestao?: string;
  retrabalho_frequente?: string;
  clareza_funcoes?: number;
  documentacao_processos?: string;
  indicadores_ativos?: string;
  ferramentas_utilizadas?: string;
  tentativas_resolucao?: string;
  tentativa_falha_motivo?: string;
  capacidade_inovacao?: string;
  ausencia_dados_decisao?: string;
  falta_treinamento?: string;
  problemas_cultura?: string;
  step_fraquezas_ok?: boolean;
}

// Interface for OportunidadesData
export interface OportunidadesData {
  respostas?: string[];
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
  step_oportunidades_ok?: boolean;
}

// Interface for AmeacasData
export interface AmeacasData {
  respostas?: string[];
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
  step_ameacas_ok?: boolean;
  validacao_ameacas_ok?: boolean;
}

// Interface for SaudeFinanceiraData
export interface SaudeFinanceiraData {
  margem_lucro?: string;
  fluxo_caixa?: string;
  investimento_disponivel?: string;
  nivel_dividas?: string;
  saude_financeira_geral?: number;
  custo_aquisicao?: string;
  ciclo_vendas?: string;
  valor_medio_cliente?: string;
  rentabilidade_produtos?: string;
  meta_financeira?: string;
  maturidade_financeira?: string;
  confianca_financeira?: string;
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
  step_financas_ok?: boolean;
  grau_endividamento?: string;
  previsao_orcamentaria?: string;
  margem_lucro_liquida?: string;
}

// Interface for PrioridadesData
export interface PrioridadesData {
  meta_90_dias?: string;
  top3_desafios?: string;
  areas_fraqueza?: string[];
  areas_potenciais?: string[];
  ajuda_externa_urgente?: string;
  acao_unica_desejada?: string;
  engajamento_equipe?: number;
  // Fix: Changed string to union type to match the schema
  distribuicao_tempo?: "Sim" | "Parcialmente" | "Estou sobrecarregado";
  comprometimento_estrategico?: number;
  prioridades_principais?: string[];
  // Fix: Changed string to union type to match the schema
  estilo_decisao?: "Analítico" | "Rápido e objetivo" | "Intuitivo" | "Compartilhado com sócios / equipe";
  // Fix: Changed string to union type to match the schema
  prontidao_execucao?: "Sim" | "Com adaptações" | "Ainda não";
  tempo_resposta?: string;
  nivel_adaptacao?: string;
  maior_sonho?: string;
  maior_gargalo?: string;
  distribuicao_tempo_alternativo?: string;
  meta_crescimento_6_meses?: string;
  meta_crescimento_12_meses?: string;
  tipo_investimento?: string;
}

// Props para as etapas de incosistência
export interface PropsFraquezas {
  fraquezas: string[];
  problemas_identificados: string[];
  inconsistencias?: string[];
  pontos_inconsistentes: string[];
}

// Flags para controle do fluxo
export interface ResultadoFinalData {
  forcas_convertidas: string[];
  fraquezas_convertidas: string[];
  oportunidades_convertidas: string[];
  ameacas_convertidas: string[];
  ai_block_completo?: boolean;
  ai_block_pronto?: boolean;
  matriz_swot?: string;
  diagnostico_textual?: string;
  planos_acao?: string;
  acoes_priorizadas?: string[];
  planoB?: string[];
  planoC?: string[];
  acoes_sugeridas?: string[];
  niveis_implementacao?: any;
  sugestoes_focadas?: string[];
  gargalos?: string[];
  alertasCascata?: string[];
  gpt_prompt_ok?: boolean;
  resultados_pdf_export_ready?: boolean;
  resultados_bloco5_e_4b_ok?: boolean;
  fase5_transicoes_ok?: boolean;
  fase6_2_resultado_premium_visual_ok?: boolean;
  fase6_3_design_final_pdf_ok?: boolean;
  fase7_1_ui_ux_gamificada_ok?: boolean;
  fase7_2_consultivo_avancado_ok?: boolean;
  fase7_3_polimento_final_ok?: boolean;
  fase7_5_1_correcao_total_ok?: boolean;
  fase7_5_2_ui_premium_ok?: boolean;
}

// Flag interna para controlar a tipagem
export interface IDataNode {
  id: number;
  qtd_subetapas: number;
  current_subetapa: number;
  filled_forcas?: string[];
  filled_fraquezas?: string[];
  filled_opportunities?: string[];
  filled_ameacas?: string[];
  results?: {
    forcas_main?: string[];
    forcas_secondary?: string[];
    forcas_combinadas?: string;
    fraquezas_main?: string[];
    fraquezas_secondary?: string[];
    fraquezas_combinadas?: string;
    oportunidades_main?: string[];
    oportunidades_secondary?: string[];
    oportunidades_combinadas?: string;
    ameacas_main?: string[];
    ameacas_secondary?: string[];
    ameacas_combinadas?: string;
  },
  supabase_ok?: boolean;
  etapa_atual?: number;
  forcas_convertidas?: string[];
  fraquezas_convertidas?: string[];
  prioridades_enviadas?: boolean;
  ai_in_use?: boolean;
  etapa_fraquezas_concluida?: boolean;
  fase5_transicoes_ok?: boolean;
  fase6_2_resultado_premium_visual_ok?: boolean;
  fase6_3_design_final_pdf_ok?: boolean;
  fase7_1_ui_ux_gamificada_ok?: boolean;
  fase7_2_consultivo_avancado_ok?: boolean;
  fase7_3_polimento_final_ok?: boolean;
  fase7_5_1_correcao_total_ok?: boolean;
  fase7_5_2_ui_premium_ok?: boolean;
}
