
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PlanosEstrategicosABCProps {
  planos: {
    planoA: string[];
    planoB: string[];
    planoC: string[];
  };
}

const PlanosEstrategicosABC = React.memo(function PlanosEstrategicosABC({ planos }: PlanosEstrategicosABCProps) {
  return (
    <div className="mt-10 scroll-mt-20 mb-8 sm:mb-10 md:mb-16" role="region" aria-labelledby="planos-estrategicos-title">
      <h2 id="planos-estrategicos-title" className="text-2xl font-bold text-[#560005] mb-4">Planos Estratégicos</h2>
      <Tabs defaultValue="A" className="w-full">
        <TabsList 
          className="bg-[#ef0002] rounded-xl p-1 mb-4 flex gap-2 overflow-x-auto max-w-full" 
          role="tablist" 
          aria-label="Escolha entre os planos estratégicos A, B e C"
        >
          <TabsTrigger 
            value="A" 
            className="text-white data-[state=active]:bg-white data-[state=active]:text-[#ef0002] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-sm sm:text-base block w-full sm:w-auto"
            role="tab"
            aria-selected="true"
            aria-controls="plano-a-content"
            id="plano-a-tab"
          >
            Plano A
          </TabsTrigger>
          <TabsTrigger 
            value="B" 
            className="text-white data-[state=active]:bg-white data-[state=active]:text-[#ef0002] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-sm sm:text-base block w-full sm:w-auto"
            role="tab"
            aria-selected="false"
            aria-controls="plano-b-content"
            id="plano-b-tab"
          >
            Plano B
          </TabsTrigger>
          <TabsTrigger 
            value="C" 
            className="text-white data-[state=active]:bg-white data-[state=active]:text-[#ef0002] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-sm sm:text-base block w-full sm:w-auto"
            role="tab"
            aria-selected="false"
            aria-controls="plano-c-content"
            id="plano-c-tab"
          >
            Plano C
          </TabsTrigger>
        </TabsList>

        <TabsContent value="A" id="plano-a-content" role="tabpanel" aria-labelledby="plano-a-tab">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700 text-sm sm:text-base lg:text-lg">🎯 Rota A – Estratégia ideal com investimento robusto</CardTitle>
              <CardDescription>Investimento direcionado para crescimento acelerado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-w-full">
                <ul className="list-disc pl-6 text-gray-700 space-y-2 text-sm sm:text-base">
                  {planos.planoA.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="B" id="plano-b-content" role="tabpanel" aria-labelledby="plano-b-tab">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700 text-sm sm:text-base lg:text-lg">⚙️ Rota B – Estratégia viável com recursos limitados</CardTitle>
              <CardDescription>Balanceamento entre investimento e resultados de curto prazo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-w-full">
                <ul className="list-disc pl-6 text-gray-700 space-y-2 text-sm sm:text-base">
                  {planos.planoB.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="C" id="plano-c-content" role="tabpanel" aria-labelledby="plano-c-tab">
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-700 text-sm sm:text-base lg:text-lg">💡 Rota C – Estratégia criativa com orçamento mínimo</CardTitle>
              <CardDescription>Abordagem criativa para maximizar resultados com recursos limitados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-w-full">
                <ul className="list-disc pl-6 text-gray-700 space-y-2 text-sm sm:text-base">
                  {planos.planoC.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default PlanosEstrategicosABC;
