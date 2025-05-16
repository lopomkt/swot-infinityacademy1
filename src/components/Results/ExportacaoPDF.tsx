
import React from 'react';
import { Download, MessageCircle } from "lucide-react";
import { buttonBase } from "@/styles/uiClasses";

interface ExportacaoPDFProps {
  onExport: () => void;
}

export default function ExportacaoPDF({ onExport }: ExportacaoPDFProps) {
  // Function to open WhatsApp with predefined message
  const openWhatsApp = () => {
    const phoneNumber = "5567993146148"; // Using the existing phone number from ResultsScreen
    const message = encodeURIComponent("Olá! Acabei de concluir o SWOT INSIGHTS da INFINITY e quero conversar com a equipe sobre o meu diagnóstico.");
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
  };
  
  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary mb-2">
          Seu Diagnóstico Está Pronto.
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Agora você tem um raio-X completo da sua empresa. Pode baixar esse relatório, 
          compartilhar ou aplicar com sua equipe. E, se quiser ir além, fale com nossos 
          especialistas para executar esse plano com apoio total.
        </p>
      </div>
      
      {/* CTA Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        <button 
          onClick={onExport}
          className={`${buttonBase} bg-primary text-white hover:bg-primaryDark flex items-center justify-center`}
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar Diagnóstico em PDF
        </button>
        
        <button 
          onClick={openWhatsApp}
          className={`${buttonBase} bg-secondary hover:bg-opacity-80 text-white flex items-center justify-center`}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Falar com a Equipe da INFINITY
        </button>
      </div>
      
      {/* Reinforcement message */}
      <p className="text-center text-gray-700 max-w-2xl mx-auto">
        Esse relatório é o primeiro passo. A execução começa agora. Estamos prontos para caminhar com você.
      </p>
      
      {/* Footer watermark */}
      <div className="text-xs text-center text-accent mt-10">
        SWOT INSIGHTS | Infinity Academy
      </div>
    </div>
  );
}
