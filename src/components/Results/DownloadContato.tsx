
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowDown } from "lucide-react";

interface DownloadContatoProps {
  onExportPDF: () => void;
  onContactTeam: () => void;
}

const DownloadContato: React.FC<DownloadContatoProps> = ({ onExportPDF, onContactTeam }) => {
  return (
    <Card className="border-t-4 border-[#b70001] bg-[#fafafa] shadow-md mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-[#560005]">
          Download e Contato INFINITY
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Salve seu diagnóstico completo ou converse com nossos especialistas para dar o próximo passo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onExportPDF}
            className="bg-[#ef0002] hover:bg-[#b70001] text-white flex items-center gap-2"
          >
            <FileText size={18} />
            Baixar PDF
          </Button>
          <Button 
            onClick={onContactTeam}
            className="bg-[#560005] hover:bg-[#3d0003] text-white flex items-center gap-2"
          >
            <ArrowDown size={18} />
            Falar com a Equipe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadContato;
