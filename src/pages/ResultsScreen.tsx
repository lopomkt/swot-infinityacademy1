import React, { useState } from "react";
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

interface ResultsScreenProps {
  formData: any;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ formData }) => {
  const [priorityActions, setPriorityActions] = useState<string[]>([]);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  // Extract and format SWOT data
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

  // Format the strategic plans from the results
  const formatStrategicPlans = () => {
    try {
      const plansText = formData.resultadoFinal.planos_acao || "";
      
      // Initialize plans structure
      const plans = {
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

  // Analyze the funnel stages based on SWOT data
  const analyzeFunnelStages = () => {
    // In a real application, this would use a more sophisticated algorithm
    // based on AI analysis or heuristics from formData
    const stages = [
      {
        id: "atracao",
        name: "ATRAÇÃO",
        status: "warning", // "healthy", "warning", "bottleneck"
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

    // Find cascade effects based on the statuses
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

  // Get quick data from form
  const quickData = {
    tempoMercado: formData.identificacao?.tempo_mercado || "Não informado",
    faturamento: formData.saudeFinanceira?.faixa_faturamento || "Não informado",
    segmento: formData.identificacao?.segmento || "Não informado",
    scoreProntidao: formData.prioridades?.comprometimento_estrategico || "N/A"
  };

  // Calculate strategic score data for radar chart
  const calculateStrategicScore = () => {
    // This is a simple mock calculation - in a real scenario, this would use actual formulas
    const marketing = parseInt(formData.prioridades?.foco_marketing || "0") || Math.floor(Math.random() * 7) + 3;
    const vendas = parseInt(formData.prioridades?.foco_vendas || "0") || Math.floor(Math.random() * 7) + 3;
    const gestao = parseInt(formData.prioridades?.foco_gestao || "0") || Math.floor(Math.random() * 7) + 3;
    const financas = parseInt(formData.saudeFinanceira?.saude_score || "0") || Math.floor(Math.random() * 7) + 3;
    const operacoes = parseInt(formData.prioridades?.foco_operacoes || "0") || Math.floor(Math.random() * 7) + 3;
    
    return [
      { subject: "Marketing", A: marketing, fullMark: 10 },
      { subject: "Vendas", A: vendas, fullMark: 10 },
      { subject: "Gestão", A: gestao, fullMark: 10 },
      { subject: "Finanças", A: financas, fullMark: 10 },
      { subject: "Operações", A: operacoes, fullMark: 10 }
    ];
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
  const groupActionsByArea = (actions) => {
    return actions.reduce((grouped, action) => {
      if (!grouped[action.area]) {
        grouped[action.area] = [];
      }
      grouped[action.area].push(action);
      return grouped;
    }, {});
  };

  const actionsByAreaA = groupActionsByArea(strategicPlans.rotaA.actions);
  const actionsByAreaB = groupActionsByArea(strategicPlans.rotaB.actions);
  const actionsByAreaC = groupActionsByArea(strategicPlans.rotaC.actions);

  return (
    <div className="bg-white min-h-screen py-8 px-4 md:px-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-[#F8F9FA] p-3 rounded-full">
              <BrainIcon size={32} className="text-[#ef0002]" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#560005] mb-4">
            Análise Estratégica de {formData.identificacao?.nome_empresa || "Sua Empresa"}
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Este diagnóstico foi gerado com base nas informações fornecidas e analisado por 
            inteligência artificial estratégica. Prepare-se para entender os verdadeiros 
            caminhos da sua empresa.
          </p>
        </div>

        {/* Quick Data Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Tempo de mercado</p>
              <p className="text-lg font-medium">{quickData.tempoMercado}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Faturamento</p>
              <p className="text-lg font-medium">{quickData.faturamento}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Segmento</p>
              <p className="text-lg font-medium">{quickData.segmento}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">Score de prontidão</p>
              <p className="text-lg font-medium">{quickData.scoreProntidao}/10</p>
            </CardContent>
          </Card>
        </div>

        {/* SWOT Matrix */}
        <div id="bloco_mapa_swot" className="mb-12">
          <h2 className="text-2xl font-bold text-[#560005] mb-6">Matriz SWOT</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl text-green-800">
                  <Check className="mr-2 h-5 w-5" />
                  Forças
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {swotData.forcas.map((item, index) => (
                    <li key={index}>
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-start w-full text-left">
                          <div className={`w-full py-2 ${item.style}`}>
                            {item.title}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-4 text-sm text-gray-600 pt-1 pb-2">
                          {item.description}
                        </CollapsibleContent>
                      </Collapsible>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl text-red-800">
                  <X className="mr-2 h-5 w-5" />
                  Fraquezas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {swotData.fraquezas.map((item, index) => (
                    <li key={index}>
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-start w-full text-left">
                          <div className={`w-full py-2 ${item.style}`}>
                            {item.title}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-4 text-sm text-gray-600 pt-1 pb-2">
                          {item.description}
                        </CollapsibleContent>
                      </Collapsible>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl text-blue-800">
                  <LightbulbIcon className="mr-2 h-5 w-5" />
                  Oportunidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {swotData.oportunidades.map((item, index) => (
                    <li key={index}>
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-start w-full text-left">
                          <div className={`w-full py-2 ${item.style}`}>
                            {item.title}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-4 text-sm text-gray-600 pt-1 pb-2">
                          {item.description}
                        </CollapsibleContent>
                      </Collapsible>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Threats */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl text-yellow-800">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Ameaças
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {swotData.ameacas.map((item, index) => (
                    <li key={index}>
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-start w-full text-left">
                          <div className={`w-full py-2 ${item.style}`}>
                            {item.title}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-4 text-sm text-gray-600 pt-1 pb-2">
                          {item.description}
                        </CollapsibleContent>
                      </Collapsible>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

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
                    {formData.resultadoFinal.matriz_swot}
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

        {/* NEW BLOCK 3: Diagnostic Section */}
        <div id="bloco_diagnostico_ia" className="mb-16">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <BrainIcon className="h-8 w-8 text-[#ef0002]" />
            </div>
            <h2 className="text-2xl font-bold text-[#560005] mb-2">
              Análise Profunda do Seu Negócio
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Abaixo está a interpretação completa da situação atual da sua empresa, 
              com base nos dados fornecidos, feita por inteligência artificial estratégica.
            </p>
          </div>

          <Card className="max-w-3xl mx-auto border border-[#ef0002]">
            <CardContent className="p-6">
              <ScrollArea className="max-h-[400px]">
                <div className="text-base leading-relaxed text-gray-800 whitespace-pre-line">
                  {formData.resultadoFinal.diagnostico_textual}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* NEW BLOCK 4: Strategic Score */}
        <div id="bloco_score_final" className="mb-16">
          <div id="ancora_score"></div> {/* Anchor for navigation */}
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <ChartBarIcon className="h-8 w-8 text-[#ef0002]" />
            </div>
            <h2 className="text-2xl font-bold text-[#560005] mb-2">
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
                <RadarChart outerRadius={90} data={strategicScoreData}>
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
              </ChartContainer>
            </div>

            {/* Maturity Badge */}
            <div>
              <Card className={`border ${maturityLevel.color} p-6 text-center`}>
                <div className="flex justify-center mb-4">
                  {maturityLevel.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{maturityLevel.title}</h3>
                <p className="text-sm">{maturityLevel.description}</p>
              </Card>
              
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
            <h2 className="text-2xl font-bold text-[#560005] mb-2">
              Plano de Ação Estratégico: Escolha sua Rota
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Com base no diagnóstico, sugerimos 3 planos adaptados à sua realidade. 
              Avalie cada um e veja qual se encaixa melhor na sua estrutura atual.
            </p>
          </div>

          <Tabs defaultValue="rotaA" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="rotaA" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
                🎯 Rota A – Investimento Robusto
              </TabsTrigger>
              <TabsTrigger value="rotaB" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                ⚙️ Rota B – Recursos Limitados
              </TabsTrigger>
              <TabsTrigger value="rotaC" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
                💡 Rota C – Orçamento Mínimo
              </TabsTrigger>
            </TabsList>

            {/* Rota A Content */}
            <TabsContent value="rotaA">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">{strategicPlans.rotaA.title}</CardTitle>
                  <CardDescription>Investimento direcionado para crescimento acelerado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {Object.entries(actionsByAreaA).map(([area, actions]) => (
                      <div key={area} className="border-b pb-6 last:border-0">
                        <h4 className="text-lg font-medium text-green-800 mb-4">{area}</h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          {actions.map((action) => (
                            <Card key={action.id} className={`overflow-hidden ${
                              priorityActions.includes(action.id) 
                                ? 'border-2 border-[#ef0002] ring-1 ring-[#ef0002]'
                                : ''
                            }`}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <Badge variant="outline" className="bg-green-50">
                                    {action.tag}
                                  </Badge>
                                  <Badge variant="outline" className="bg-gray-50">
                                    {action.timeframe}
                                  </Badge>
                                </div>
                                <h5 className="font-medium mb-2">{action.content}</h5>
                                <div className="flex items-center text-sm text-gray-500 mt-4">
                                  <span>Esforço: {action.effort}</span>
                                </div>
                              </CardContent>
                              <CardFooter className="bg-gray-50 p-2 flex justify-end">
                                <Button 
                                  variant={priorityActions.includes(action.id) ? "secondary" : "outline"} 
                                  size="sm"
                                  onClick={() => togglePriorityAction(action.id)}
                                  className={priorityActions.includes(action.id) ? "bg-[#ef0002] text-white" : ""}
                                >
                                  {priorityActions.includes(action.id) 
                                    ? "Remover Prioridade" 
                                    : "Marcar como Prioridade"}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rota B Content */}
            <TabsContent value="rotaB">
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-700">{strategicPlans.rotaB.title}</CardTitle>
                  <CardDescription>Balanceamento entre investimento e resultados de curto prazo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {Object.entries(actionsByAreaB).map(([area, actions]) => (
                      <div key={area} className="border-b pb-6 last:border-0">
                        <h4 className="text-lg font-medium text-blue-800 mb-4">{area}</h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          {actions.map((action) => (
                            <Card key={action.id} className={`overflow-hidden ${
                              priorityActions.includes(action.id) 
                                ? 'border-2 border-[#ef0002] ring-1 ring-[#ef0002]'
                                : ''
                            }`}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <Badge variant="outline" className="bg-blue-50">
                                    {action.tag}
                                  </Badge>
                                  <Badge variant="outline" className="bg-gray-50">
                                    {action.timeframe}
                                  </Badge>
                                </div>
                                <h5 className="font-medium mb-2">{action.content}</h5>
                                <div className="flex items-center text-sm text-gray-500 mt-4">
                                  <span>Esforço: {action.effort}</span>
                                </div>
                              </CardContent>
                              <CardFooter className="bg-gray-50 p-2 flex justify-end">
                                <Button 
                                  variant={priorityActions.includes(action.id) ? "secondary" : "outline"} 
                                  size="sm"
                                  onClick={() => togglePriorityAction(action.id)}
                                  className={priorityActions.includes(action.id) ? "bg-[#ef0002] text-white" : ""}
                                >
                                  {priorityActions.includes(action.id) 
                                    ? "Remover Prioridade" 
                                    : "Marcar como Prioridade"}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rota C Content */}
            <TabsContent value="rotaC">
              <Card>
                <CardHeader>
                  <CardTitle className="text-amber-700">{strategicPlans.rotaC.title}</CardTitle>
                  <CardDescription>Abordagem criativa para maximizar resultados com recursos limitados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {Object.entries(actionsByAreaC).map(([area, actions]) => (
                      <div key={area} className="border-b pb-6 last:border-0">
                        <h4 className="text-lg font-medium text-amber-800 mb-4">{area}</h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          {actions.map((action) => (
                            <Card key={action.id} className={`overflow-hidden ${
                              priorityActions.includes(action.id) 
                                ? 'border-2 border-[#ef0002] ring-1 ring-[#ef0002]'
                                : ''
                            }`}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <Badge variant="outline" className="bg-amber-50">
                                    {action.tag}
                                  </Badge>
                                  <Badge variant="outline" className="bg-gray-50">
                                    {action.timeframe}
                                  </Badge>
                                </div>
                                <h5 className="font-medium mb-2">{action.content}</h5>
                                <div className="flex items-center text-sm text-gray-500 mt-4">
                                  <span>Esforço: {action.effort}</span>
                                </div>
                              </CardContent>
                              <CardFooter className="bg-gray-50 p-2 flex justify-end">
                                <Button 
                                  variant={priorityActions.includes(action.id) ? "secondary" : "outline"} 
                                  size="sm"
                                  onClick={() => togglePriorityAction(action.id)}
                                  className={priorityActions.includes(action.id) ? "bg-[#ef0002] text-white" : ""}
                                >
                                  {priorityActions.includes(action.id) 
                                    ? "Remover Prioridade" 
                                    : "Marcar como Prioridade"}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* NEW BLOCK 4B: Funnel Visualization */}
        <div id="bloco_funil_gargalos" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#560005] mb-2">
              Funil Estratégico da Empresa: Gargalos e Alertas
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Veja como sua empresa se comporta nas 4 fases críticas e onde estão os pontos 
              de atenção que podem comprometer toda a operação.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Funnel Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 relative animate-fade-in">
              {funnelStages.map((stage, index) => (
                <div key={stage.id} className="relative">
                  <Card className={`h-full ${getStatusColor(stage.status)}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {stage.icon}
                          <CardTitle className="text-base ml-2">{stage.name}</CardTitle>
                        </div>
                        {getStatusIcon(stage.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        {stage.issues.map((issue, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-1">•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  {/* Add arrows between stages */}
                  {index < funnelStages.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <div className="w-4 h-4 rotate-45 border-t-2 border-r-2 border-gray-300"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Cascade Effects */}
            {cascadeEffects.length > 0 && (
              <div className="mb-8">
                {cascadeEffects.map((effect, index) => {
                  const fromStage = funnelStages.find(s => s.id === effect.from);
                  const toStage = funnelStages.find(s => s.id === effect.to);
                  
                  return (
                    <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-2 flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">
                        <strong>{fromStage?.name}:</strong> {effect.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Alert Warning */}
            <div className="bg-[#ffebeb] border border-[#ef0002] rounded-md p-4 text-red-800 flex items-start">
              <AlertTriangle className="h-5 w-5 text-[#ef0002] mr-2 flex-shrink-0 mt-1" />
              <p>
                <strong>Atenção:</strong> gargalos não resolvidos nessa etapa tendem a causar efeito 
                cascata e impactar toda a empresa. Inicie sua correção pela etapa mais crítica.
              </p>
            </div>
          </div>
        </div>

        {/* Set the flag for next prompt */}
        <div className="hidden">
          {/* This is just a placeholder to indicate the flag is set */}
          {(() => {
            if (formData.resultadoFinal) {
              formData.resultadoFinal.resultados_bloco5_e_4b_ok = true;
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
