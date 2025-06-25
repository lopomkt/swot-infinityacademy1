
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainIcon } from "lucide-react";

interface DiagnosticoProntoProps {
  empresa?: string;
}

const DiagnosticoPronto: React.FC<DiagnosticoProntoProps> = ({ empresa = "Sua Empresa" }) => {
  return (
    <Card className="border-l-4 border-[#b70001] bg-gradient-to-r from-white to-red-50 shadow-lg mb-8 transform hover:scale-105 transition-transform duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-[#ef0002] p-2 rounded-full">
            <BrainIcon size={24} className="text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-[#560005]">
            ✅ Seu diagnóstico está pronto
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed">
          Baseado nas informações que você compartilhou, nossa tecnologia de IA analisou os pontos críticos 
          do seu negócio e preparou um <span className="font-semibold text-[#b70001]">diagnóstico estratégico completo</span>. 
          Veja abaixo os resultados e planos de ação sugeridos especificamente para <strong>{empresa}</strong>.
        </p>
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 flex items-center">
            <span className="mr-2">🎯</span>
            <strong>Próximos passos:</strong> Role para baixo para ver sua matriz SWOT, diagnóstico detalhado e planos estratégicos A/B/C.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosticoPronto;
