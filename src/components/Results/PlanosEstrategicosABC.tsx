
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PlanosEstrategicosABCProps {
  planos: {
    planoA: string[];
    planoB: string[];
    planoC: string[];
  };
}

export default function PlanosEstrategicosABC({ planos }: PlanosEstrategicosABCProps) {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-[#560005] mb-4">Planos Estratégicos</h2>
      <Tabs defaultValue="A" className="w-full">
        <TabsList className="bg-[#ef0002] rounded-xl p-1 mb-4 flex gap-2">
          <TabsTrigger 
            value="A" 
            className="text-white data-[state=active]:bg-white data-[state=active]:text-[#ef0002]"
          >
            Plano A
          </TabsTrigger>
          <TabsTrigger 
            value="B" 
            className="text-white data-[state=active]:bg-white data-[state=active]:text-[#ef0002]"
          >
            Plano B
          </TabsTrigger>
          <TabsTrigger 
            value="C" 
            className="text-white data-[state=active]:bg-white data-[state=active]:text-[#ef0002]"
          >
            Plano C
          </TabsTrigger>
        </TabsList>

        <TabsContent value="A">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">🎯 Rota A – Estratégia ideal com investimento robusto</CardTitle>
              <CardDescription>Investimento direcionado para crescimento acelerado</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                {planos.planoA.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="B">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700">⚙️ Rota B – Estratégia viável com recursos limitados</CardTitle>
              <CardDescription>Balanceamento entre investimento e resultados de curto prazo</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                {planos.planoB.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="C">
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-700">💡 Rota C – Estratégia criativa com orçamento mínimo</CardTitle>
              <CardDescription>Abordagem criativa para maximizar resultados com recursos limitados</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                {planos.planoC.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
