
import React from "react";
import { motion } from 'framer-motion';
import { cardBase, headingBase } from "@/styles/uiClasses";
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Badge } from "@/components/ui/badge";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from "recharts";
import {
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent
} from "@/components/ui/chart";

interface ScoreDataPoint {
  subject: string;
  A: number;
  fullMark: number;
}

interface ScoreEstrategicoProps {
  scoreLabel: string;
  pontuacao: number;
  scoreData?: ScoreDataPoint[];
}

const ScoreEstrategico = React.memo(function ScoreEstrategico({ 
  scoreLabel, 
  pontuacao,
  scoreData = []
}: ScoreEstrategicoProps) {
  const prefersReducedMotion = useReducedMotion();
  
  // Default data if none provided
  const defaultScoreData = [
    { subject: "Marketing", A: 8, fullMark: 10 },
    { subject: "Vendas", A: 6, fullMark: 10 },
    { subject: "Gestão", A: 7, fullMark: 10 },
    { subject: "Finanças", A: 5, fullMark: 10 },
    { subject: "Operações", A: 9, fullMark: 10 }
  ];
  
  // Use provided scoreData or default
  const chartData = scoreData && scoreData.length > 0 ? scoreData : defaultScoreData;
  
  // Determine badge color based on score
  const getBadgeColor = () => {
    if (pontuacao >= 70) return "bg-green-100 text-green-800 border-green-200";
    if (pontuacao >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };
  
  return (
    <motion.div 
      className={`${cardBase} bg-gray-50 p-4 sm:p-6 scroll-mt-20 h-full`}
      role="region"
      aria-labelledby="score-strategic-title"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.h2 
        id="score-strategic-title" 
        className={`${headingBase} mb-4 text-xl sm:text-2xl font-bold text-[#560005] border-b pb-2 text-center`}
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Score Estratégico
      </motion.h2>
      
      <div className="flex flex-col items-center">
        {/* Radar Chart */}
        <div className="h-[250px] w-full mb-6">
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
              <RadarChart outerRadius={90} data={chartData}>
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
        
        <motion.div
          className="mb-4 w-full"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-gray-700 font-semibold">Nível Estratégico:</span>
            <Badge variant="outline" className={`font-medium ${getBadgeColor()}`}>
              {scoreLabel || "Sem classificação"}
            </Badge>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-4 w-full"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="mb-1 flex items-center justify-between">
            <p className="text-gray-700 text-sm sm:text-base">
              Pontuação geral: <strong aria-label={`${pontuacao} de 100 pontos`}>{pontuacao}/100</strong>
            </p>
            <span className="text-xs text-gray-500">100</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-[#ef0002] h-2.5 rounded-full" 
              style={{ width: `${pontuacao}%` }}
              role="progressbar"
              aria-valuenow={pontuacao}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});

export default ScoreEstrategico;
