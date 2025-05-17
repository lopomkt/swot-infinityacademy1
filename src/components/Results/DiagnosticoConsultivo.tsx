
import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { BrainIcon } from "lucide-react";

interface DiagnosticoConsultivoProps {
  diagnostico: string;
}

const DiagnosticoConsultivo: React.FC<DiagnosticoConsultivoProps> = ({ diagnostico }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div id="bloco_diagnostico_ia" className="mb-16">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3">
          <BrainIcon className="h-8 w-8 text-[#ef0002]" />
        </div>
        <h2 className="text-2xl font-bold text-[#560005] border-b pb-2 mb-4 inline-block px-8">
          Análise Profunda do Seu Negócio
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Abaixo está a interpretação completa da situação atual da sua empresa, 
          com base nos dados fornecidos, feita por inteligência artificial estratégica.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto border border-[#ef0002]">
        <CardContent className="p-6">
          <ScrollArea className="max-h-fit">
            {diagnostico ? (
              <div 
                dangerouslySetInnerHTML={{ __html: diagnostico }} 
                className="text-sm text-gray-700 leading-relaxed"
              />
            ) : (
              <p className="text-center text-gray-500 italic py-4">
                Diagnóstico não disponível. Por favor, aguarde o processamento ou tente novamente.
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Tag for tracking refactoring progress */}
      <div className="hidden">
        {/* refatoracao_diagnostico_ok = true */}
      </div>
    </div>
  );
};

export default DiagnosticoConsultivo;
