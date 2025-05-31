
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, Users } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header com imagem */}
      <div className="text-center mb-8">
        <div className="mb-6">
          <img 
            src="https://pkbomgocnpvxylwqlksb.supabase.co/storage/v1/object/public/public-assets/swotimg.jpg"
            alt="SWOT Insights - Análise Estratégica"
            className="mx-auto max-w-md w-full h-auto rounded-lg shadow-lg"
            onError={(e) => {
              // Fallback para caso a imagem não carregue
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        
        <h1 className="text-3xl font-bold text-[#560005] mb-3">
          Bem-vindo ao SWOT INSIGHTS
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          A ferramenta mais completa para análise estratégica do seu negócio. 
          Em poucos minutos, você terá um relatório detalhado com insights práticos 
          para impulsionar sua empresa.
        </p>
      </div>

      {/* Cards de benefícios */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-[#ef0002]">
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <Target className="h-8 w-8 text-[#ef0002] mr-3" />
              <h3 className="font-semibold text-lg">Diagnóstico Preciso</h3>
            </div>
            <p className="text-gray-600">
              Análise SWOT completa com identificação de Forças, Fraquezas, 
              Oportunidades e Ameaças do seu negócio.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <TrendingUp className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="font-semibold text-lg">Estratégias Práticas</h3>
            </div>
            <p className="text-gray-600">
              Planos de ação personalizados com base na sua situação financeira 
              e realidade do mercado.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <Users className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="font-semibold text-lg">Consultoria Inteligente</h3>
            </div>
            <p className="text-gray-600">
              Relatório com múltiplas alternativas estratégicas geradas por 
              inteligência artificial especializada.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informações do processo */}
      <Card className="bg-blue-50 border-blue-200 mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-3 text-blue-800">
            Como funciona a análise?
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <strong>1. Identificação:</strong> Dados da empresa e situação financeira
            </div>
            <div>
              <strong>2. Forças:</strong> Seus principais diferenciais competitivos
            </div>
            <div>
              <strong>3. Fraquezas:</strong> Pontos que precisam de melhoria
            </div>
            <div>
              <strong>4. Oportunidades:</strong> Mercado e tendências favoráveis
            </div>
            <div>
              <strong>5. Ameaças:</strong> Riscos e desafios externos
            </div>
            <div>
              <strong>6. Relatório:</strong> Estratégias personalizadas com IA
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão de iniciar */}
      <div className="text-center">
        <Button 
          onClick={onNext}
          size="lg"
          className="bg-[#ef0002] hover:bg-[#b70001] text-white px-8 py-3 text-lg font-semibold"
        >
          Iniciar Análise SWOT
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-sm text-gray-500 mt-3">
          ⏱️ Tempo estimado: 15-25 minutos
        </p>
      </div>
    </div>
  );
};

export default WelcomeStep;
