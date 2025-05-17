
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainIcon } from "lucide-react";

interface DiagnosticoProntoProps {
  empresa?: string;
}

const DiagnosticoPronto: React.FC<DiagnosticoProntoProps> = ({ empresa = "Sua Empresa" }) => {
  return (
    <Card className="border-l-4 border-[#b70001] bg-white shadow-md mb-8">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <BrainIcon size={24} className="text-[#ef0002]" />
          <CardTitle className="text-xl font-bold text-[#560005]">
            Seu diagnóstico está pronto
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Baseado nas informações que você compartilhou, nossa tecnologia analisou os pontos críticos 
          do seu negócio e preparou um diagnóstico estratégico completo. Veja abaixo os 
          resultados e planos de ação sugeridos para {empresa}.
        </p>
      </CardContent>
    </Card>
  );
};

export default DiagnosticoPronto;
