
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const ExpiredSubscription = () => {
  // Set page title
  useEffect(() => {
    document.title = "Acesso Expirado | SWOT INSIGHTS";
    return () => {
      document.title = "SWOT INSIGHTS";
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Acesso Expirado</h1>
          
          <div className="mb-6">
            <img
              src="https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1350&q=80"
              alt="Dashboard estratégico"
              className="w-full h-auto object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/800x400?text=Estrategia+Empresarial";
              }}
            />
          </div>
          
          <p className="text-gray-800 font-medium mb-4">
            O período de acesso à ferramenta SWOT INSIGHTS chegou ao fim, conforme sua contratação com a consultoria INFINITY ACADEMY.
          </p>
          
          <p className="text-gray-600 mb-8">
            Para continuar usando esta solução estratégica e liberar acesso a ferramentas profissionais exclusivas que serão lançadas, entre em contato com nossa equipe.
          </p>
          
          <div className="space-y-3">
            <a
              href="https://wa.me/5511999999999" // Substituir pelo número oficial da Infinity
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              <span>Falar via WhatsApp</span>
              <ChevronRight className="ml-2 h-5 w-5" />
            </a>
            
            <a
              href="mailto:contato@infinityacademy.com.br"
              className="inline-flex w-full items-center justify-center px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
            >
              <span>Enviar email</span>
              <ChevronRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Equipe INFINITY ACADEMY - Consultoria Estratégica
          </p>
        </div>
      </div>
      
      {/* Tag de controle */}
      <div className="hidden">
        {/* correcao_geral_sessao_dados_ok = true */}
      </div>
    </div>
  );
};

export default ExpiredSubscription;
