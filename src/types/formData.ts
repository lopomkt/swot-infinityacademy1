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
    respostas: string[];
    problemas_identificados: string[];
    inconsistencias?: string[];
    pontos_inconsistentes: string[];
  };
  oportunidades?: {
    respostas: string[];
  };
  ameacas?: {
    respostas: string[];
  };
  prioridades?: {
    comprometimento_estrategico: string;
    prioridades_principais: string[];
  };
  resultadoFinal?: ResultadoFinalData;
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
