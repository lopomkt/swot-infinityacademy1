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
import { FormData } from "@/types/formData";
import { EnumSteps, STEPS } from "@/types/steps";
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

const Index = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { session } = useAuth();
  const [step, setStep] = useState<number>(EnumSteps.BOAS_VINDAS);
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
    setStep(EnumSteps.BOAS_VINDAS);
  };

  // Function to completely reset app flow after report generation
  const resetAppFlow = () => {
    setFormData(estruturaInicialVazia);
    setStep(EnumSteps.BOAS_VINDAS);
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

  // Check if AI results are ready to show results screen (OpenRouter only)
  const areResultsReady = () => {
    return formData.resultadoFinal?.ai_block_pronto === true && formData.resultadoFinal?.openrouter_prompt_ok === true;
  };

  return (
    <div className="min-h-screen bg-white text-black font-manrope flex flex-col items-center justify-start">
      <ProgressBar currentStep={step} stepsCount={STEPS.length} />
      <main className="w-full max-w-5xl py-10 px-4 md:px-12 flex-1 flex flex-col items-center justify-center animate-fade-in">
        {step === EnumSteps.BOAS_VINDAS && (
          <WelcomeStep
            onNext={() => setStep(EnumSteps.IDENTIFICACAO)}
          />
        )}
        {step === EnumSteps.IDENTIFICACAO && (
          <FormStep1
            defaultValues={formData.identificacao}
            onBack={() => handleBackButtonClick(EnumSteps.BOAS_VINDAS)}
            onComplete={(identificacao) => {
              setFormData((prev) => ({ ...prev, identificacao }));
              setStep(EnumSteps.FORCAS);
            }}
          />
        )}
        {step === EnumSteps.FORCAS && (
          <FormStepForcas
            defaultValues={formData.forcas}
            onBack={() => handleBackButtonClick(EnumSteps.IDENTIFICACAO)}
            onComplete={(forcas) => {
              setFormData((prev) => ({ 
                ...prev, 
                forcas: {
                  respostas: forcas.respostas || [],
                },
                step_forcas_ok: true
              }));
              setStep(EnumSteps.FRAQUEZAS);
            }}
          />
        )}
        {step === EnumSteps.FRAQUEZAS && (
          <FormStepFraquezas
            defaultValues={formData.fraquezas}
            onBack={() => handleBackButtonClick(EnumSteps.FORCAS)}
            onComplete={(fraquezas) => {
              setFormData((prev) => ({ ...prev, fraquezas }));
              setStep(EnumSteps.OPORTUNIDADES);
            }}
          />
        )}
        {step === EnumSteps.OPORTUNIDADES && (
          <FormStepOportunidades
            defaultValues={formData.oportunidades}
            onBack={() => handleBackButtonClick(EnumSteps.FRAQUEZAS)}
            onComplete={(oportunidades) => {
              setFormData((prev) => ({ ...prev, oportunidades }));
              setStep(EnumSteps.AMEACAS);
            }}
          />
        )}
        {step === EnumSteps.AMEACAS && (
          <FormStepAmeacas
            defaultValues={formData.ameacas}
            onBack={() => handleBackButtonClick(EnumSteps.OPORTUNIDADES)}
            onComplete={(ameacas) => {
              setFormData((prev) => ({ ...prev, ameacas }));
              setStep(EnumSteps.FINANCEIRO);
            }}
          />
        )}
        {step === EnumSteps.FINANCEIRO && (
          <FormStepSaudeFinanceira
            defaultValues={formData.saudeFinanceira}
            onBack={() => handleBackButtonClick(EnumSteps.AMEACAS)}
            onComplete={(saudeFinanceira) => {
              setFormData((prev) => ({ ...prev, saudeFinanceira }));
              setStep(EnumSteps.PRIORIDADES);
            }}
          />
        )}
        {step === EnumSteps.PRIORIDADES && (
          <FormStepPrioridades
            defaultValues={formData.prioridades}
            onBack={() => handleBackButtonClick(EnumSteps.FINANCEIRO)}
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
              setStep(EnumSteps.FINALIZACAO);
            }}
          />
        )}
        {step === EnumSteps.FINALIZACAO && (
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
              setStep(EnumSteps.RESULTADOS);
            }}
          />
        )}
        {step === EnumSteps.RESULTADOS && formData.resultadoFinal?.ai_block_pronto && formData.resultadoFinal?.openrouter_prompt_ok && (
          <ResultsScreen 
            formData={formData}
            onRestart={resetAppFlow}
            onNovaAnalise={handleNovaAnalise}
          />
        )}
        
        {step === EnumSteps.RESULTADOS && (!formData.resultadoFinal?.ai_block_pronto || !formData.resultadoFinal?.openrouter_prompt_ok) && (
          <p className="text-center text-red-600 mt-10">⏳ Seu relatório ainda está sendo processado via OpenRouter.</p>
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
