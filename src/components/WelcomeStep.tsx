
import { Button } from "@/components/ui/button";
import RedBullet from "./RedBullet";

interface WelcomeStepProps {
  onStart: () => void;
}

const WelcomeStep = ({ onStart }: WelcomeStepProps) => (
  <section className="w-full max-w-5xl bg-white py-20 px-6 mx-auto animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column - Content */}
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-black leading-snug">
          Bem-vindo ao SWOT INSIGHTS
        </h1>
        <p className="mt-4 text-base text-gray-700">
          Aqui começa o diagnóstico estratégico mais completo da sua empresa. Em poucos minutos, você terá um relatório poderoso com insights reais para vender mais, organizar processos e crescer de forma consistente.
        </p>
        
        <div className="mt-8 space-y-4">
          <div className="flex items-start space-x-3">
            <RedBullet />
            <p className="text-sm text-gray-700">
              <strong>+ Estrutura:</strong> Veja o que precisa ser corrigido internamente.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <RedBullet />
            <p className="text-sm text-gray-700">
              <strong>+ Vendas:</strong> Identifique oportunidades ocultas de receita.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <RedBullet />
            <p className="text-sm text-gray-700">
              <strong>+ Expansão:</strong> Descubra novos caminhos estratégicos de crescimento.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-[#b70001] mt-6 font-semibold">
          <span role="img" aria-label="timer">⏱️</span>
          Duração média: <span className="ml-1">35 a 40 minutos</span>
        </div>
        
        <Button
          onClick={onStart}
          className="mt-6 text-lg py-3 px-6 bg-[#ef0002] hover:bg-[#b70001] text-white rounded-xl shadow-md"
          aria-label="Começar diagnóstico"
        >
          Iniciar Diagnóstico
        </Button>
      </div>
      
      {/* Right Column - Image */}
      <div className="hidden md:flex items-center justify-center">
        <img 
          src="/placeholder.svg" 
          alt="Diagnóstico estratégico SWOT" 
          className="w-full h-auto object-contain" 
        />
      </div>
    </div>
    
    {/* fase6_1_welcome_transicoes_premium_ok = true */}
  </section>
);

export default WelcomeStep;
