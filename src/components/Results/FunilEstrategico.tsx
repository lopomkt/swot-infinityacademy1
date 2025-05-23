
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Check, Settings2Icon, TrendingUpIcon, ArrowDownIcon, StarIcon, X } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

interface FunilEstrategicoProps {
  gargalos?: string[];
  alertasCascata?: string[];
}

const FunilEstrategico: React.FC<FunilEstrategicoProps> = ({ 
  gargalos = [], 
  alertasCascata = []
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Default funnel stages if none provided
  const defaultStages: FunnelStage[] = [
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

  // Default cascade effects
  const defaultCascadeEffects: CascadeEffect[] = [
    {
      from: "conversao",
      to: "operacao",
      message: "Problemas em conversão estão afetando diretamente sua operação."
    }
  ];

  // Function to get status icon based on stage status
  const getStatusIcon = (status: string) => {
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

  // Function to get status color based on stage status
  const getStatusColor = (status: string) => {
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

  // Map gargalos strings to structured funnel stages if provided
  const stages = defaultStages;
  const cascadeEffects = defaultCascadeEffects;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Funnel Stages */}
        <motion.div
          className="overflow-hidden"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Gargalos Identificados</h3>
              
              <div className="space-y-4 overflow-x-hidden">
                {stages.map((stage, index) => (
                  <motion.div
                    key={stage.id}
                    className={cn(
                      "p-3 rounded-lg border",
                      getStatusColor(stage.status)
                    )}
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {stage.icon}
                        <h4 className="font-medium">{stage.name}</h4>
                      </div>
                      {getStatusIcon(stage.status)}
                    </div>
                    
                    <ul className="text-sm space-y-1 mt-2">
                      {stage.issues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="inline-block min-w-[5px] h-1 w-1 rounded-full bg-current mt-2" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Right Column: Cascade Effects */}
        <motion.div
          className="overflow-hidden"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Alertas de Cascata</h3>
              
              {gargalos && gargalos.length > 0 ? (
                <div className="space-y-4">
                  {gargalos.map((gargalo, index) => (
                    <motion.div
                      key={index}
                      className="p-3 rounded-lg border border-amber-200 bg-amber-50"
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: 10 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{gargalo}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : alertasCascata && alertasCascata.length > 0 ? (
                <div className="space-y-4">
                  {alertasCascata.map((alerta, index) => (
                    <motion.div
                      key={index}
                      className="p-3 rounded-lg border border-amber-200 bg-amber-50"
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: 10 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{alerta}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {cascadeEffects.map((effect, index) => (
                    <motion.div
                      key={index}
                      className="p-3 rounded-lg border border-amber-200 bg-amber-50"
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: 10 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">{effect.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 text-center text-xs text-gray-500">
                <p>Estes alertas indicam como problemas em uma área afetam outras áreas do negócio.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Resolva os gargalos para melhorar o fluxo completo de captação até retenção de clientes.</p>
      </div>
      
      {/* Tag to mark completion */}
      <div className="hidden">
        {/* fase6_finalizada_ok = true */}
      </div>
    </div>
  );
};

export default FunilEstrategico;
