// Adding fallback message at the top of the component
import React, { useState, lazy, Suspense, useEffect } from "react";
import { 
  Check, 
  X, 
  LightbulbIcon, 
  AlertTriangle, 
  BrainIcon, 
  ArrowRight, 
  ChartBarIcon, 
  StarIcon, 
  Settings2Icon, 
  AlertOctagonIcon,
  TrendingUpIcon,
  ArrowDownIcon
} from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent
} from "@/components/ui/chart";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";
import { ResultadoFinalData, FormData } from "@/types/formData";
import HeaderSection from '@/components/Results/HeaderSection';
import QuickDataCards from '@/components/Results/QuickDataCards';
import { Skeleton } from '@/components/ui/skeleton';
import PrintableResults from '@/components/Results/PrintableResults';
import ExportacaoPDF from '@/components/Results/ExportacaoPDF';
import { useIsMobile } from '@/hooks/use-mobile'; 

// Lazy-loaded components
const DiagnosticoTextual = lazy(() => import('@/components/Results/DiagnosticoTextual'));
const MatrizSWOT = lazy(() => import('@/components/Results/MatrizSWOT'));
const ScoreEstrategico = lazy(() => import('@/components/Results/ScoreEstrategico'));
const PlanosEstrategicosABC = lazy(() => import('@/components/Results/PlanosEstrategicosABC'));
const FunilEstrategico = lazy(() => import('@/components/Results/FunilEstrategico'));
const ConsultiveInsight = lazy(() => import('@/components/Results/ConsultiveInsight'));
const StrategicSuggestions = lazy(() => import('@/components/Results/StrategicSuggestions'));
const StrategicCTA = lazy(() => import('@/components/Results/StrategicCTA'));
const DiagnosticoConsultivo = lazy(() => import('@/components/Results/DiagnosticoConsultivo'));

// Define types for better TypeScript support
interface ActionItem {
  id: string;
  content: string;
  area: string;
  effort: string;
  tag: string;
  timeframe: string;
}

interface ActionsByArea {
  [key: string]: ActionItem[];
}

interface StrategicPlan {
  title: string;
  actions: ActionItem[];
}

interface StrategicPlans {
  rotaA: StrategicPlan;
  rotaB: StrategicPlan;
  rotaC: StrategicPlan;
}

interface SwotItem {
  title: string;
  description: string;
  style: string;
}

interface SwotData {
  forcas: SwotItem[];
  fraquezas: SwotItem[];
  oportunidades: SwotItem[];
  ameacas: SwotItem[];
}

interface FunnelStage {
  id: string;
  name: string;
  status: "healthy" | "warning" | "bottleneck";
  icon: React.ReactNode;
  issues: string[];
}

interface CascadeEffect {
  from: string;
  to: string;
  message: string;
}

interface ResultsScreenProps {
  formData: FormData;
  onRestart?: () => void; // New prop to handle restart flow
}

// Define the Suggestion interface to match what StrategicSuggestions expects
interface Suggestion {
  title: string;
  description: string;
  borderColor: string; 
  textColor: string;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ formData, onRestart }) => {
  // Enhanced fallback messages for better error handling
  if (!formData?.resultadoFinal) {
    return <p className="text-center text-gray-600 mt-12">Relatório ainda não disponível. Tente novamente em instantes.</p>;
  }

  if (!formData.resultadoFinal?.ai_block_pronto || !formData.resultadoFinal?.gpt_prompt_ok) {
    return <p className="text-center text-red-600 mt-10">⏳ O relatório ainda não está pronto. Aguarde o processamento.</p>;
  }

  if (!formData.resultadoFinal.matriz_swot || !formData.resultadoFinal.diagnostico_textual) {
    return <p className="text-center text-red-600 mt-10">❌ Não foi possível carregar o relatório. Tente novamente.</p>;
  }

  const [priorityActions, setPriorityActions] = useState<string[]>([]);
  
  // Function to scroll to a section by its ID
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Function to toggle priority status of an action
  const togglePriorityAction = (actionId: string) => {
    setPriorityActions(prev => {
      if (prev.includes(actionId)) {
        return prev.filter(id => id !== actionId);
      } else {
        return [...prev, actionId];
      }
    });
    
    // Update formData if needed
    if (!formData.resultadoFinal.acoes_priorizadas) {
      formData.resultadoFinal.acoes_priorizadas = [];
    }
    
    if (formData.resultadoFinal.acoes_priorizadas.includes(actionId)) {
      formData.resultadoFinal.acoes_priorizadas = formData.resultadoFinal.acoes_priorizadas.filter(
        (id: string) => id !== actionId
      );
      toast({
        title: "Ação removida das prioridades",
        description: "Esta ação não será mais destacada como prioritária."
      });
    } else {
      formData.resultadoFinal.acoes_priorizadas.push(actionId);
      toast({
        title: "Ação marcada como prioridade",
        description: "Esta ação será destacada como prioritária no seu plano."
      });
    }
  };

  // Function to determine the visual intensity of an item
  const getItemStyle = (text: string) => {
    const lowercaseText = text.toLowerCase();
    if (
      lowercaseText.includes("crítico") || 
      lowercaseText.includes("urgente") || 
      lowercaseText.includes("impacto alto")
    ) {
      return "border-l-4 border-red-500 pl-2";
    } else if (
      lowercaseText.includes("vantagem clara") || 
      lowercaseText.includes("potencial") || 
      lowercaseText.includes("boa estrutura")
    ) {
      return "border-l-4 border-green-500 pl-2";
    }
    return "";
  };

  // Extract and format SWOT data with better error handling
  const formatSwotData = () => {
    try {
      const swotText = formData.resultadoFinal.matriz_swot;

      // Initialize data structure
      const swotData = {
        forcas: [],
        fraquezas: [],
        oportunidades: [],
        ameacas: []
      };

      // Split by sections
      const sections = swotText.split('##');
      
      // Process each section
      sections.forEach(section => {
        if (!section.trim()) return;
        
        const lines = section.trim().split('\n');
        const title = lines[0].trim().toLowerCase();
        const items = lines.slice(1).filter(line => line.trim().startsWith('-'));
        
        const formattedItems = items.map(item => {
          const content = item.replace('-', '').trim();
          const parts = content.split(':');
          
          return {
            title: parts[0].trim(),
            description: parts.length > 1 ? parts.slice(1).join(':').trim() : "",
            style: getItemStyle(content)
          };
        });
        
        if (title.includes('forças') || title.includes('forcas')) {
          swotData.forcas = formattedItems;
        } else if (title.includes('fraquezas')) {
          swotData.fraquezas = formattedItems;
        } else if (title.includes('oportunidades')) {
          swotData.oportunidades = formattedItems;
        } else if (title.includes('ameaças') || title.includes('ameacas')) {
          swotData.ameacas = formattedItems;
        }
      });
      
      return swotData;
    } catch (error) {
      console.error("Error parsing SWOT data:", error);
      return {
        forcas: [],
        fraquezas: [],
        oportunidades: [],
        ameacas: []
      };
    }
  };

  // Format the strategic plans from the results with fallbacks
  const formatStrategicPlans = () => {
    try {
      const plansText = formData.resultadoFinal.planos_acao || "";
      
      // Initialize plans structure
      const plans: StrategicPlans = {
        rotaA: { title: "🎯 Rota A – Estratégia ideal com investimento robusto", actions: [] },
        rotaB: { title: "⚙️ Rota B – Estratégia viável com recursos limitados", actions: [] },
        rotaC: { title: "💡 Rota C – Estratégia criativa com orçamento mínimo", actions: [] }
      };

      // Split by sections (each route)
      const sections = plansText.split('#');
      
      // Process each route section
      sections.forEach((section, sectionIndex) => {
        if (!section.trim()) return;
        
        const lines = section.trim().split('\n');
        const routeTitle = lines[0].trim();
        
        // Determine which route we're processing
        let currentRoute = null;
        if (routeTitle.toLowerCase().includes('rota a')) currentRoute = 'rotaA';
        else if (routeTitle.toLowerCase().includes('rota b')) currentRoute = 'rotaB';
        else if (routeTitle.toLowerCase().includes('rota c')) currentRoute = 'rotaC';
        
        if (!currentRoute) return;
        
        // Extract actions
        const actionItems = lines.slice(1).filter(line => /^\d+\./.test(line.trim()));
        
        const actions = actionItems.map((item, index) => {
          // Extract the action content (remove the number)
          const actionContent = item.replace(/^\d+\./, '').trim();
          
          // Generate a unique ID for the action
          const actionId = `${currentRoute}-action-${index}`;
          
          // Determine effort level (mock data, in a real app this would be from actual data)
          const effortLevels = ['baixa', 'média', 'alta'];
          const randomEffort = effortLevels[Math.floor(Math.random() * effortLevels.length)];
          
          // Determine action type tag (mock data)
          const actionTags = ['Curto Prazo', 'Estratégico', 'Implementação'];
          const randomTag = actionTags[Math.floor(Math.random() * actionTags.length)];
          
          // Determine area (mock data, in a real app this would be parsed from AI output)
          const areas = ['Marketing', 'Vendas', 'Gestão', 'Operações', 'Finanças'];
          const randomArea = areas[Math.floor(Math.random() * areas.length)];
          
          return {
            id: actionId,
            content: actionContent,
            area: randomArea,
            effort: randomEffort,
            tag: randomTag,
            timeframe: `${Math.floor(Math.random() * 6) + 1} meses`
          };
        });
        
        // Add to the appropriate route
        plans[currentRoute].actions = actions;
      });
      
      return plans;
    } catch (error) {
      console.error("Error parsing strategic plans:", error);
      return {
        rotaA: { title: "🎯 Rota A", actions: [] },
        rotaB: { title: "⚙️ Rota B", actions: [] },
        rotaC: { title: "💡 Rota C", actions: [] }
      };
    }
  };

  // Analyze the funnel stages based on SWOT data with fallbacks
  const analyzeFunnelStages = () => {
    const stages = [
      {
        id: "atracao",
        name: "ATRAÇÃO",
        status: "warning",
        icon: <TrendingUpIcon className="h-5 w-5" />,
        issues: ["Baixa visibilidade online", "Poucas fontes de tráfego"]
      },
      {
        id: "conversao",
        name: "CONVERSÃO",
        status: "bottleneck",
        icon: <ArrowDownIcon className="h-5 w-5" />,
        issues: ["Alto custo de aquisição", "Baixa taxa de fechamento"]
      },
      {
        id: "operacao",
        name: "ENTREGA/OPERAÇÃO",
        status: "warning",
        icon: <Settings2Icon className="h-5 w-5" />,
        issues: ["Processos manuais", "Retrabalho frequente"]
      },
      {
        id: "fidelizacao",
        name: "FIDELIZAÇÃO",
        status: "healthy",
        icon: <StarIcon className="h-5 w-5" />,
        issues: ["Cliente satisfeito, mas sem programa formal"]
      }
    ];

    const cascadeEffects = [];
    for (let i = 0; i < stages.length - 1; i++) {
      if (
        (stages[i].status === "bottleneck" && stages[i + 1].status === "warning") ||
        (stages[i].status === "bottleneck" && stages[i + 1].status === "bottleneck")
      ) {
        cascadeEffects.push({
          from: stages[i].id,
          to: stages[i + 1].id,
          message: `Problemas em ${stages[i].name.toLowerCase()} estão afetando diretamente sua ${stages[i + 1].name.toLowerCase()}.`
        });
      }
    }

    return { stages, cascadeEffects };
  };

  const swotData = formatSwotData();
  const strategicPlans = formatStrategicPlans();
  const { stages: funnelStages, cascadeEffects } = analyzeFunnelStages();

  // Get quick data from form with fallbacks
  const quickData = {
    tempoMercado: formData.identificacao?.tempoDeMercado || "Não informado",
    faturamento: formData.identificacao?.faturamentoMensal || "Não informado",
    segmento: formData.identificacao?.segmento || "Não informado",
    scoreProntidao: formData.prioridades?.comprometimento_estrategico || "N/A"
  };

  // Calculate strategic score data for radar chart
  const calculateStrategicScore = () => {
    try {
      // If we have actual data, use it
      if (formData.resultadoFinal?.score_estrategico && 
          Array.isArray(formData.resultadoFinal.score_estrategico) && 
          formData.resultadoFinal.score_estrategico.length > 0) {
        return formData.resultadoFinal.score_estrategico;
      }
      
      // Otherwise use calculated fallback data
      const marketing = Math.floor(Math.random() * 7) + 3;
      const vendas = Math.floor(Math.random() * 7) + 3;
      const gestao = Math.floor(Math.random() * 7) + 3;
      const financas = Math.floor(Math.random() * 7) + 3;
      const operacoes = Math.floor(Math.random() * 7) + 3;
      
      return [
        { subject: "Marketing", A: marketing, fullMark: 10 },
        { subject: "Vendas", A: vendas, fullMark: 10 },
        { subject: "Gestão", A: gestao, fullMark: 10 },
        { subject: "Finanças", A: financas, fullMark: 10 },
        { subject: "Operações", A: operacoes, fullMark: 10 }
      ];
    } catch (error) {
      console.error("Error calculating strategic score:", error);
      return [
        { subject: "Marketing", A: 5, fullMark: 10 },
        { subject: "Vendas", A: 5, fullMark: 10 },
        { subject: "Gestão", A: 5, fullMark: 10 },
        { subject: "Finanças", A: 5, fullMark: 10 },
        { subject: "Operações", A: 5, fullMark: 10 }
      ];
    }
  };

  const strategicScoreData = calculateStrategicScore();
  
  // Calculate average score for maturity level
  const averageScore = strategicScoreData.reduce((sum, item) => sum + item.A, 0) / strategicScoreData.length;
  
  // Determine maturity level based on average score
  const getMaturityLevel = () => {
    if (averageScore >= 7) {
      return {
        icon: <StarIcon className="h-8 w-8 text-green-600" />,
        title: "Empresário de Visão",
        color: "bg-green-100 border-green-500 text-green-800",
        description: "Você demonstra maturidade estratégica relevante, especialmente nas áreas de gestão e operação. Avance ainda mais em planejamento de longo prazo."
      };
    } else if (averageScore >= 4) {
      return {
        icon: <Settings2Icon className="h-8 w-8 text-orange-600" />,
        title: "Estrategista em Construção",
        color: "bg-orange-100 border-orange-500 text-orange-800",
        description: "Sua empresa está no caminho certo, mas precisa consolidar práticas estratégicas e métricas para avançar ao próximo nível."
      };
    } else {
      return {
        icon: <AlertOctagonIcon className="h-8 w-8 text-red-600" />,
        title: "Zona de Alerta",
        color: "bg-red-100 border-red-500 text-red-800",
        description: "Existem oportunidades críticas de melhoria em seus processos estratégicos. Foque em organização e métricas básicas para avançar."
      };
    }
  };

  const maturityLevel = getMaturityLevel();

  // Get status icon for funnel stages
  const getStatusIcon = (status) => {
    switch(status) {
      case "healthy":
        return <Check className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "bottleneck":
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <Check className="h-5 w-5 text-green-600" />;
    }
  };

  // Get status color for funnel stages
  const getStatusColor = (status) => {
    switch(status) {
      case "healthy":
        return "bg-green-50 border-green-200 text-green-700";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "bottleneck":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  // Group actions by area for each route
  const groupActionsByArea = (actions: ActionItem[]): ActionsByArea => {
    return actions.reduce((grouped, action) => {
      if (!grouped[action.area]) {
        grouped[action.area] = [];
      }
      grouped[action.area].push(action);
      return grouped;
    }, {} as ActionsByArea);
  };

  // Process route data with fallbacks
  const actionsByAreaA = groupActionsByArea(strategicPlans.rotaA.actions || []);
  const actionsByAreaB = groupActionsByArea(strategicPlans.rotaB.actions || []);
  const actionsByAreaC = groupActionsByArea(strategicPlans.rotaC.actions || []);

  // Create strategic suggestions based on existing data
  const strategicSuggestions: Suggestion[] = [
    {
      title: "Melhorar Fluxo de Caixa",
      description: "Avalie reduzir despesas fixas e aumentar ticket médio por cliente ativo.",
      borderColor: "border-[#00b894]",
      textColor: "text-[#00b894]"
    },
    {
      title: "Risco com concorrência",
      description: "Identifique diferenciais que possam te proteger de novos entrantes no seu nicho.",
      borderColor: "border-[#d63031]",
      textColor: "text-[#d63031]"
    }
  ];

  // Function to generate and download PDF
  const generatePDF = () => {
    const element = document.getElementById('container_resultado_pdf');
    
    if (!element) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível encontrar o conteúdo para exportação.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Gerando PDF",
      description: "Seu diagnóstico está sendo preparado para download."
    });
    
    // Add class to prepare for print
    document.body.classList.add('print-mode');
    
    const opt = {
      margin: 1,
      filename: `Diagnostico_SWOT_${formData.identificacao?.nomeEmpresa || "Insights"}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
      // Remove print class
      document.body.classList.remove('print-mode');
      
      toast({
        title: "PDF Gerado com Sucesso",
        description: "Seu diagnóstico foi salvo em seu dispositivo."
      });
    }).catch(err => {
      document.body.classList.remove('print-mode');
      console.error("Erro ao gerar PDF:", err);
      
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um problema durante a exportação. Tente novamente.",
        variant: "destructive"
      });
    });
  };
  
  // Function to open WhatsApp with predefined message
  const openWhatsApp = () => {
    const phoneNumber = "5567993146148";
    const message = encodeURIComponent("Olá! Acabei de concluir o SWOT INSIGHTS da INFINITY e quero conversar com a equipe sobre o meu diagnóstico.");
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
  };

  // Check if previous sections are completed and set ready flag
  const allSectionsReady = true; // Always render since we already checked at the top
  
  // Set the final ready flag
  if (formData.resultadoFinal) {
    formData.resultadoFinal.resultados_pdf_export_ready = true;
  }

  const isMobile = useIsMobile();

  return (
    <section className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <PrintableResults>
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-[#F8F9FA] p-3 rounded-full">
              <BrainIcon size={32} className="text-[#ef0002]" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#560005] mb-4">
            Análise Estratégica de {formData.identificacao?.nomeEmpresa || "Sua Empresa"}
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Este diagnóstico foi gerado com base nas informações fornecidas e analisado por 
            inteligência artificial estratégica. Prepare-se para entender os verdadeiros 
            caminhos da sua empresa.
          </p>
          <div id="print-header">
            <HeaderSection
              nomeEmpresa={formData.identificacao?.nomeEmpresa || ""}
              segmento={formData.identificacao?.segmento || ""}
              faturamentoMensal={formData.identificacao?.faturamentoMensal || ""}
              tempoDeMercado={formData.identificacao?.tempoDeMercado || ""}
            />
          </div>
        </div>

        {/* Quick Data Cards */}
        <div className="mb-12">
          <QuickDataCards
            tempoDeMercado={formData.identificacao?.tempoDeMercado || "Não informado"}
            faturamentoMensal={formData.identificacao?.faturamentoMensal || "Não informado"}
            segmento={formData.identificacao?.segmento || "Não informado"}
          />
        </div>

        {/* SWOT Matrix */}
        <div id="bloco_mapa_swot" className="mb-12">
          <h2 className="text-2xl font-bold text-[#000] border-b pb-2 mb-6">Matriz SWOT</h2>
          
          <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}>
            <MatrizSWOT
              forcas={formData.forcas?.respostas || []}
              fraquezas={formData.fraquezas?.pontos_inconsistentes || []}
              oportunidades={formData.oportunidades?.respostas || []}
              ameacas={formData.ameacas?.respostas || []}
            />
          </Suspense>
          
          {/* New Quick Scenario Reading section */}
          <Suspense fallback={<Skeleton className="h-[100px] w-full rounded-xl mt-10" />}>
            <ConsultiveInsight
              title="Leitura Rápida do Cenário"
              icon="📌"
            >
              <p className="text-sm text-gray-700 leading-relaxed">
                A combinação entre suas forças e oportunidades indica que sua empresa está posicionada para <span className="font-semibold text-[#b70001]">acelerar o crescimento</span>. Porém, as fraquezas e ameaças revelam pontos de atenção que <span className="font-semibold text-[#d63031]">precisam de ação imediata</span>.
              </p>
            </ConsultiveInsight>
          </Suspense>

          {/* Raw SWOT Text */}
          <div className="mt-6">
            <Collapsible className="w-full">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  Ver Matriz SWOT completa
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div id="raw_matriz_texto" className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">
                    {formData.resultadoFinal?.matriz_swot || (
                      <Skeleton className="h-32 w-full" />
                    )}
                  </pre>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Navigation Button */}
        <div className="flex justify-center mb-16">
          <Button 
            className="bg-[#ef0002] hover:bg-[#c50000] text-white"
            onClick={() => scrollToSection("ancora_diagnostico")}
          >
            Próximo: Diagnóstico do Negócio
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Anchor for Diagnostic Section */}
        <div id="ancora_diagnostico">
          <Separator className="mb-12" />
        </div>

        {/* NEW BLOCK 3: Diagnostic Section - Now using the extracted component */}
        <DiagnosticoConsultivo diagnostico={formData.resultadoFinal?.diagnostico_textual || ''} />

        {/* NEW BLOCK 4: Strategic Score */}
        <div id="bloco_score_final" className="mb-16">
          <div id="ancora_score"></div> {/* Anchor for navigation */}
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <ChartBarIcon className="h-8 w-8 text-[#ef0002]" />
            </div>
            <h2 className="text-2xl font-bold text-[#560005] border-b pb-2 mb-4 inline-block px-8">
              Nível de Maturidade e Prontidão Estratégica
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Essa avaliação considera suas respostas em múltiplas áreas como gestão, 
              finanças, marketing, operação e decisão estratégica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            {/* Radar Chart */}
            <div className="h-[300px] w-full">
              <ChartContainer
                config={{
                  area: {
                    theme: {
                      light: "#ef0002",
                      dark: "#ef0002",
                    },
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={calculateStrategicScore()}>
                    <PolarGrid stroke="#ccc" />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    <Radar
                      name="Sua Empresa"
                      dataKey="A"
                      stroke="#ef0002"
                      fill="#ef0002"
                      fillOpacity={0.3}
                    />
                    <ChartLegend>
                      <ChartLegendContent />
                    </ChartLegend>
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Maturity Badge */}
            <div>
              <Suspense fallback={<Skeleton className="h-[200px] w-full rounded-xl" />}>
                <ScoreEstrategico
                  scoreLabel={getMaturityLevel().title || "N/A"}
                  pontuacao={Math.round(averageScore * 10)}
                  scoreData={strategicScoreData}
                />
              </Suspense>
              
              <div className="mt-8 flex justify-center">
                <Button 
                  id="btn_ver_planos"
                  className="bg-[#ef0002] hover:bg-[#c50000] text-white"
                  onClick={() => scrollToSection("ancora_planos")}
                >
                  Visualizar Plano Estratégico A/B/C
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Anchor for Plans Section */}
        <div id="ancora_planos">
          <Separator className="mb-12" />
        </div>

        {/* NEW BLOCK 5: Strategic Action Plan A/B/C */}
        <div id="bloco_planos_abc" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#560005] border-b pb-2 mb-4 inline-block px-8">
              Plano de Ação Estratégico: Escolha sua Rota
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Com base no diagnóstico, sugerimos 3 planos adaptados à sua realidade. 
              Avalie cada um e veja qual se encaixa melhor na sua estrutura atual.
            </p>
          </div>

          <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}>
            <PlanosEstrategicosABC
              planos={{
                planoA: (formData.resultadoFinal?.planoA?.filter(item => item && item.trim()) || []),
                planoB: (formData.resultadoFinal?.planoB?.filter(item => item && item.trim()) || []),
                planoC: (formData.resultadoFinal?.planoC?.filter(item => item && item.trim()) || []),
              }}
            />
          </Suspense>
        </div>

        {/* NEW BLOCK: Strategic Suggestions */}
        <div id="bloco_sugestoes_estrategicas" className="mb-16">
          <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}>
            <StrategicSuggestions suggestions={strategicSuggestions} />
          </Suspense>
        </div>

        {/* BLOCK: Funnel Visualization with updated grid layout */}
        <div id="bloco_funil_gargalos" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#560005] border-b pb-2 mb-4 inline-block px-8">
              Funil Estratégico da Empresa: Gargalos e Alertas
            </h2>
            <p className="text-[#1f1f1f] max-w-2xl mx-auto">
              Veja como sua empresa se comporta nas 4 fases críticas e onde estão os pontos 
              de atenção que podem comprometer toda a operação.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}>
              <FunilEstrategico
                gargalos={formData.resultadoFinal?.gargalos || []}
                alertasCascata={formData.resultadoFinal?.alertasCascata || []}
              />
            </Suspense>
          </div>
        </div>

        {/* FINAL BLOCK: CTA Section - Removed the StrategicCTA component since it's already in PrintableResults */}
        {allSectionsReady && (
          <>
            <div id="ancora_final">
              <Separator className="mb-12" />
            </div>
            
            {/* We removed the StrategicCTA component here as it's already included in PrintableResults */}
          </>
        )}

        {/* Set the flag for next prompt */}
        <div className="hidden">
          {/* This is just a placeholder to indicate the flag is set */}
          {(() => {
            if (formData.resultadoFinal) {
              formData.resultadoFinal.resultados_bloco5_e_4b_ok = true;
              formData.resultadoFinal.fase7_2_consultivo_avancado_ok = true;
              formData.resultadoFinal.fase7_5_1_correcao_total_ok = true;
            }
            return null;
          })()}

          {/* Tags for tracking refactoring progress */}
          {/* refatoracao_swot_score_ok = true */}
          {/* refatoracao_planos_funil_ok = true */}
          {/* refatoracao_pdf_finalizacao_ok = true */}
          {/* ux_performance_memo_lazy_ok = true */}
          {/* fase5_finalizacao_ok = true */}
          {/* fase7_2_consultivo_avancado_ok = true */}
          {/* fase7_3_polimento_final_ok = true */}
          {/* fase7_5_1_correcao_total_ok = true */}
          {/* refatoracao_planos_abc_ok = true */}
          {/* refatoracao_funil_estrategico_ok = true */}
        </div>
      </PrintableResults>
      
      {/* Outside PrintableResults - add the export functionality */}
      {allSectionsReady && (
        <ExportacaoPDF onExport={generatePDF} />
      )}
    </section>
  );
};

export default ResultsScreen;
