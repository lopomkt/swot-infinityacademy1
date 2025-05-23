
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarX, Mail, RefreshCw, Phone } from "lucide-react";

const ExpiredSubscription = () => {
  const { signOut } = useAuth();

  // Função para verificar novamente o status da assinatura
  const checkAgain = () => {
    localStorage.removeItem("subscription_expired");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="flex justify-center mb-6">
            <CalendarX size={64} className="text-[#ef0002]" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acesso Expirado</h1>
          
          <p className="text-gray-700 mb-4">
            O período de acesso à ferramenta SWOT INSIGHTS chegou ao fim, conforme sua 
            contratação com a consultoria INFINITY ACADEMY.
          </p>
          
          <p className="text-gray-600 mb-6">
            Para continuar usando esta solução estratégica e liberar acesso a ferramentas 
            profissionais exclusivas que serão lançadas, entre em contato com nossa equipe.
          </p>
          
          <div className="space-y-4">
            <a 
              href="https://wa.me/5511999999999" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full p-3 bg-[#25D366] hover:bg-[#20BD5C] text-white rounded-lg transition-colors"
            >
              <Phone size={18} />
              Falar com a Equipe da INFINITY
            </a>
            
            <a 
              href="mailto:contato@infinityacademy.com.br"
              className="flex items-center justify-center gap-2 w-full p-3 bg-[#ef0002] hover:bg-[#b70001] text-white rounded-lg transition-colors"
            >
              <Mail size={18} />
              Solicitar Renovação por E-mail
            </a>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={checkAgain}
            >
              <RefreshCw size={18} />
              Verificar Novamente
            </Button>
            
            <Button 
              variant="link" 
              className="w-full text-gray-500"
              onClick={() => signOut()}
            >
              Voltar para a tela de login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiredSubscription;
