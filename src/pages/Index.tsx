
import { useState, useEffect } from "react";
import ProgressBar from "@/components/ProgressBar";
import WelcomeStep from "@/components/WelcomeStep";
import FormStep1 from "@/components/FormStep1";
import FormStepForcas from "@/components/FormStepForcas";
import FormStepFraquezas from "@/components/FormStepFraquezas";
import FormStepOportunidades from "@/components/FormStepOportunidades";
import FormStepAmeacas from "@/components/FormStepAmeacas";
import FormStepSaudeFinanceira from "@/components/FormStepSaudeFinanceira";
import FormStepPrioridades from "@/components/FormStepPrioridades";
import FinalizacaoStep from "@/components/FinalizacaoStep";
import ResultsScreen from "@/pages/ResultsScreen";
import TransitionStep from "@/components/TransitionStep";
import { FormData } from "@/types/formData";
import { saveState, loadState } from "@/lib/persistence";
import { Lightbulb, Star, Flag, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Estrutura inicial vazia para garantir reset correto dos dados
const estruturaInicialVazia: FormData = {
  tipagem_index_ok: true,
  fase5_transicoes_ok: true,
  fase5_voltar_ok: true,
  fase5_gamificacao_ok: true,
  fase5_finalizacao_ok: true,
  fase5_resultado_final_ok: true,
  fase6_1_welcome_transicoes_premium_ok: true,
  fase6_2_resultado_premium_visual_ok: true,
  fase6_3_design_final_pdf_ok: true,
  fase7_1_ui_ux_gamificada_ok: true,
  fase7_3_polimento_final_ok: true,
  fase7_5_1_correcao_total_ok: true,
};

const STEPS = [
  { label: "Boas-vindas" },
  { label: "Identificação & Contexto Empresarial" },
  { label: "Transição" },
  { label: "Forças" },
  { label: "Transição" },
  { label: "Fraquezas" },
  { label: "Transição" },
  { label: "Oportunidades" },
  { label: "Transição" },
  { label: "Ameaças" },
  { label: "Transição" },
  { label: "Saúde Financeira" },
  { label: "Transição" },
  { label: "Prioridades e Maturidade" },
  { label: "Finalização" },
  { label: "Resultados" },
];

const Index = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { session } = useAuth();
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>(estruturaInicialVazia);
  const [relatorioConcluido, setRelatorioConcluido] = useState(false);
  
  // Verificar se é um teste de admin
  const modoAdminTeste = new URLSearchParams(location.search).get("modo_teste_admin") === "true";
  
  // Limpar dados residuais ao iniciar uma nova sessão
  useEffect(() => {
    if (!modoAdminTeste) {
      console.log("Limpando dados para nova sessão normal");
      localStorage.clear();
      sessionStorage.clear();
      setFormData(estruturaInicialVazia);
    } else {
      console.log("Modo teste de admin ativado");
      // Se for teste de admin, carregar dados salvos ou usar estrutura inicial
      setFormData(loadState<FormData>('swotForm') || estruturaInicialVazia);
    }
  }, [modoAdminTeste]);
  
  // Limpar localStorage quando o usuário fizer login
  useEffect(() => {
    if (session) {
      console.log("Novo login detectado. Limpando armazenamento local.");
      localStorage.clear();
      sessionStorage.clear();
    }
  }, [session]);

  // Apenas carregar step do localStorage em dispositivos móveis
  useEffect(() => {
    if (isMobile) {
      const savedStep = loadState<number>('swotStep');
      if (savedStep !== null) {
        setStep(savedStep);
      }
    }
  }, [isMobile]);

  // Salvar form data para localStorage sempre que mudar
  useEffect(() => {
    saveState('swotForm', formData);
  }, [formData]);

  // Salvar step para localStorage sempre que mudar (apenas em mobile)
  useEffect(() => {
    if (isMobile) {
      saveState('swotStep', step);
    }
  }, [step, isMobile]);

  // Limpar formData quando um relatório for concluído
  useEffect(() => {
    if (relatorioConcluido) {
      localStorage.removeItem("swotForm");
      setRelatorioConcluido(false);
    }
  }, [relatorioConcluido]);

  // Scroll to top quando step mudar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleBackButtonClick = (previousStep: number) => {
    window.scrollTo(0, 0);
    setStep(previousStep);
  };

  const resetForm = () => {
    setFormData(estruturaInicialVazia);
    setStep(0);
  };

  // Function to completely reset app flow after report generation
  const resetAppFlow = () => {
    setFormData(estruturaInicialVazia);
    setStep(0);
    // Clear localStorage items related to the form
    localStorage.removeItem('swotStep');
    localStorage.removeItem('swotForm');
    sessionStorage.removeItem("relatorio_id");
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setRelatorioConcluido(true);
  };

  // Updated function to handle starting a new analysis
  const handleNovaAnalise = () => {
    try {
      if (formData && formData.resultadoFinal) {
        const historico = JSON.parse(localStorage.getItem('historico_relatorios') || '[]');
        historico.push({ ...formData, data: new Date().toISOString() });
        localStorage.setItem('historico_relatorios', JSON.stringify(historico));
      }

      // Reset do estado
      resetForm();
      resetAppFlow();

      // Reset da tela com pequeno timeout para evitar race conditions
      setTimeout(() => window.location.reload(), 100);

    } catch (error) {
      console.error('Erro ao resetar análise:', error);
    }
  };

  // Check if AI results are ready to show results screen
  const areResultsReady = () => {
    return formData.resultadoFinal?.ai_block_pronto === true && formData.resultadoFinal?.gpt_prompt_ok === true;
  };

  // Helper function to determine the current visual step for the progress bar
  const getCurrentProgressStep = () => {
    // Map decimal steps (transitions) to their integer counterparts for the progress bar
    if (step % 1 !== 0) {
      return Math.floor(step);
    }
    return step;
  };

  // Count actual visible steps for progress calculation (excluding transitions)
  const totalMainSteps = STEPS.filter(s => !s.label.includes('Transição')).length;
  const currentMainStep = Math.min(Math.ceil(getCurrentProgressStep() / 2), totalMainSteps);

  return (
    <div className="min-h-screen bg-white text-black font-manrope flex flex-col items-center justify-start">
      <ProgressBar currentStep={getCurrentProgressStep()} stepsCount={STEPS.length} />
      <main className="w-full max-w-5xl py-10 px-4 md:px-12 flex-1 flex flex-col items-center justify-center animate-fade-in">
        {step === 0 && (
          <WelcomeStep
            onStart={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <FormStep1
            defaultValues={formData.identificacao}
            onBack={step > 0 ? () => handleBackButtonClick(0) : undefined}
            onComplete={(identificacao) => {
              setFormData((prev) => ({ ...prev, identificacao }));
              setStep(1.5);
            }}
          />
        )}
        {step === 1.5 && (
          <TransitionStep
            title="Vamos identificar as forças do seu negócio"
            description="Agora vamos analisar os pontos fortes da sua empresa - aqueles diferenciais competitivos que você já possui e que podem ser potencializados."
            fraseMotivacional="Você está prestes a reconhecer seu diferencial no mercado!"
            iconeEtapa={<Star className="h-10 w-10" />}
            onContinue={() => setStep(2)}
            currentStep={currentMainStep}
            totalSteps={totalMainSteps}
          />
        )}
        {step === 2 && (
          <FormStepForcas
            defaultValues={formData.forcas}
            onBack={() => handleBackButtonClick(1)}
            onComplete={(forcas) => {
              setFormData((prev) => ({ 
                ...prev, 
                forcas: {
                  respostas: forcas.respostas || [],  // Ensure respostas is always defined
                },
                step_forcas_ok: true
              }));
              setStep(2.5);
            }}
          />
        )}
        {step === 2.5 && (
          <TransitionStep
            title="Vamos analisar os pontos de melhoria"
            description="Identificar fraquezas não é sinal de fracasso - é um passo essencial para fortalecer seu negócio e transformar vulnerabilidades em oportunidades de crescimento."
            fraseMotivacional="É com a verdade que a evolução começa!"
            iconeEtapa={<TrendingDown className="h-10 w-10" />}
            onContinue={() => setStep(3)}
            currentStep={currentMainStep}
            totalSteps={totalMainSteps}
          />
        )}
        {step === 3 && (
          <FormStepFraquezas
            defaultValues={formData.fraquezas}
            onBack={() => handleBackButtonClick(2)}
            onComplete={(fraquezas) => {
              setFormData((prev) => ({ ...prev, fraquezas }));
              setStep(3.5);
            }}
          />
        )}
        {step === 3.5 && (
          <TransitionStep
            title="Explorando oportunidades de mercado"
            description="Vamos identificar as oportunidades externas que podem impulsionar seu negócio - tendências, nichos inexplorados e demandas emergentes que podem ser aproveitadas."
            fraseMotivacional="Onde outros veem problemas, você verá oportunidades!"
            iconeEtapa={<Lightbulb className="h-10 w-10" />}
            onContinue={() => setStep(4)}
            currentStep={currentMainStep}
            totalSteps={totalMainSteps}
          />
        )}
        {step === 4 && (
          <FormStepOportunidades
            defaultValues={formData.oportunidades}
            onBack={() => handleBackButtonClick(3)}
            onComplete={(oportunidades) => {
              setFormData((prev) => ({ ...prev, oportunidades }));
              setStep(4.5);
            }}
          />
        )}
        {step === 4.5 && (
          <TransitionStep
            title="Identificando ameaças e desafios"
            description="Por último, vamos mapear as ameaças externas que podem impactar seu negócio, preparando estratégias defensivas e de mitigação de riscos."
            fraseMotivacional="Prevenir é melhor que remediar. Vamos preparar seu negócio!"
            iconeEtapa={<Flag className="h-10 w-10" />}
            onContinue={() => setStep(5)}
            currentStep={currentMainStep}
            totalSteps={totalMainSteps}
          />
        )}
        {step === 5 && (
          <FormStepAmeacas
            defaultValues={formData.ameacas}
            onBack={() => handleBackButtonClick(4)}
            onComplete={(ameacas) => {
              setFormData((prev) => ({ ...prev, ameacas }));
              setStep(5.5);
            }}
          />
        )}
        {step === 5.5 && (
          <TransitionStep
            title="Avaliando a saúde financeira"
            description="Agora vamos analisar a situação financeira da sua empresa para fundamentar recomendações alinhadas à sua realidade econômica."
            fraseMotivacional="Entender seus números é o primeiro passo para escalar!"
            iconeEtapa={<TrendingUp className="h-10 w-10" />}
            onContinue={() => setStep(6)}
            currentStep={currentMainStep}
            totalSteps={totalMainSteps}
          />
        )}
        {step === 6 && (
          <FormStepSaudeFinanceira
            defaultValues={formData.saudeFinanceira}
            onBack={() => handleBackButtonClick(5)}
            onComplete={(saudeFinanceira) => {
              setFormData((prev) => ({ ...prev, saudeFinanceira }));
              setStep(6.5);
            }}
          />
        )}
        {step === 6.5 && (
          <TransitionStep
            title="Definindo prioridades estratégicas"
            description="Para finalizar, vamos estabelecer prioridades claras e entender suas metas de curto e longo prazo para direcionar as recomendações estratégicas."
            fraseMotivacional="Foco e priorização são os pilares do sucesso!"
            iconeEtapa={<ArrowRight className="h-10 w-10" />}
            onContinue={() => setStep(7)}
            currentStep={currentMainStep}
            totalSteps={totalMainSteps}
          />
        )}
        {step === 7 && (
          <FormStepPrioridades
            defaultValues={formData.prioridades}
            onBack={() => handleBackButtonClick(6)}
            onComplete={(prioridades) => {
              // Ensure numeric fields are properly converted
              const processedPrioridades = {
                ...prioridades,
                engajamento_equipe: typeof prioridades.engajamento_equipe === 'string' 
                  ? Number(prioridades.engajamento_equipe) 
                  : prioridades.engajamento_equipe,
                comprometimento_estrategico: typeof prioridades.comprometimento_estrategico === 'string' 
                  ? Number(prioridades.comprometimento_estrategico) 
                  : prioridades.comprometimento_estrategico
              };
              
              setFormData((prev) => ({ 
                ...prev, 
                prioridades: processedPrioridades,
                step_prioridades_ok: true
              }));
              setStep(8);
            }}
          />
        )}
        {step === 8 && (
          <FinalizacaoStep 
            onRestart={resetForm} 
            formData={formData}
            onAIComplete={(resultadoFinal) => {
              setFormData(prev => ({
                ...prev,
                resultadoFinal,
                fase5_finalizacao_ok: true,
                fase6_3_design_final_pdf_ok: true,
                fase7_1_ui_ux_gamificada_ok: true,
                fase7_3_polimento_final_ok: true
              }));
              setStep(9);
            }}
          />
        )}
        {step === 9 && formData.resultadoFinal?.ai_block_pronto && formData.resultadoFinal?.gpt_prompt_ok && (
          <ResultsScreen 
            formData={formData}
            onRestart={resetAppFlow}
            onNovaAnalise={handleNovaAnalise}
          />
        )}
        
        {step === 9 && (!formData.resultadoFinal?.ai_block_pronto || !formData.resultadoFinal?.gpt_prompt_ok) && (
          <p className="text-center text-red-600 mt-10">⏳ Seu relatório ainda está sendo processado.</p>
        )}
      </main>

      {/* Tag de rastreamento - não remover */}
      <div className="hidden">
        {/* fase5_bugfixes_finais_ok = true */}
        {/* fase5_resultado_final_ok = true */}
        {/* fase6_1_welcome_transicoes_premium_ok = true */}
        {/* fase6_2_resultado_premium_visual_ok = true */}
        {/* fase6_3_design_final_pdf_ok = true */}
        {/* fase7_1_ui_ux_gamificada_ok = true */}
        {/* fase7_3_polimento_final_ok = true */}
        {/* fase7_5_1_correcao_total_ok = true */}
        {/* fase4_nova_analise_ok = true */}
        {/* fase5_supabase_tabelas_ok = true */}
        {/* fase5_supabase_auth_ok = true */}
        {/* correcao_total_autenticacao_redirecionamento_ok = true */}
      </div>
    </div>
  );
};

export default Index;
