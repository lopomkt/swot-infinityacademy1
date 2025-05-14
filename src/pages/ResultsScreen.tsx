
import React from "react";
import { Check, X, LightbulbIcon, AlertTriangle, BrainIcon, ArrowRight, ChartBarIcon, StarIcon, Settings2Icon, AlertOctagonIcon } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface ResultsScreenProps {
  formData: any;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ formData }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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

  const swotData = formatSwotData();

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
      </div>
    </div>
  );
};

export default ResultsScreen;
