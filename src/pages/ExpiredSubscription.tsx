
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarX, Mail, RefreshCw } from "lucide-react";

const ExpiredSubscription = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="flex justify-center mb-6">
            <CalendarX size={64} className="text-[#ef0002]" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acesso Expirado</h1>
          
          <p className="text-gray-600 mb-6">
            Seu período de acesso à plataforma SWOT INSIGHTS chegou ao fim. 
            Entre em contato conosco para renovar sua licença e continuar 
            utilizando todas as funcionalidades.
          </p>
          
          <div className="space-y-4">
            <a 
              href="mailto:contato@infinityacademy.com.br"
              className="flex items-center justify-center gap-2 w-full p-3 bg-[#ef0002] hover:bg-[#b70001] text-white rounded-lg transition-colors"
            >
              <Mail size={18} />
              Solicitar Renovação
            </a>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => window.location.reload()}
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
