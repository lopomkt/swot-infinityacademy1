
import { Button } from "@/components/ui/button";
import RedBullet from "./RedBullet";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface WelcomeStepProps {
  onStart: () => void;
}

const WelcomeStep = ({ onStart }: WelcomeStepProps) => {
  const { userData, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar se é um admin testando a ferramenta
  const modoAdminTeste = location.search.includes("modo_teste_admin=true");
  const isAdmin = userData?.is_admin === true;

  const abrirHistorico = () => {
    navigate("/historico");
  };

  const voltarPainelAdmin = () => {
    navigate("/admin");
  };

  return (
    <section className="w-full max-w-5xl bg-white py-20 px-6 mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-medium text-gray-700">
          Empresa: <span className="font-bold text-[#ef0002]">{userData?.nome_empresa || "Carregando..."}</span>
        </h2>
        <div className="flex items-center gap-2">
          {/* Botão de voltar ao painel admin - APENAS para admins */}
          {isAdmin && modoAdminTeste && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={voltarPainelAdmin}
            >
              <ArrowLeft size={16} />
              Voltar ao Painel
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-gray-600"
            onClick={signOut}
          >
            <LogOut size={16} />
            Sair
          </Button>
        </div>
      </div>
      
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
          
          <div className="mt-6 flex flex-col">
            <Button
              onClick={onStart}
              className="text-lg py-3 px-6 bg-[#ef0002] hover:bg-[#b70001] text-white rounded-xl shadow-md"
              aria-label="Começar diagnóstico"
            >
              Iniciar Diagnóstico
            </Button>
            
            <button 
              className="text-sm text-gray-400 underline mt-4 self-center"
              onClick={abrirHistorico}
            >
              Ver Histórico
            </button>
          </div>
        </div>
        
        {/* Right Column - Image - Updated with correct Supabase image */}
        <div className="hidden md:flex items-center justify-center">
          <img 
            src="https://pkbomgocnpvxylwqlksb.supabase.co/storage/v1/object/public/public-assets/swotimg.jpg" 
            alt="Dashboard estratégico SWOT" 
            className="w-full h-auto object-cover rounded-xl shadow-md aspect-square" 
          />
        </div>
      </div>
      
      {/* fase6_1_welcome_transicoes_premium_ok = true */}
    </section>
  );
};

export default WelcomeStep;
