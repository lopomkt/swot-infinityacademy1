
import React, { useEffect } from 'react';
import { FormData } from "@/types/formData";

interface ResultsScreenWrapperProps {
  formData: FormData;
  onRestart: () => void;
  isViewMode?: boolean;
}

const ResultsScreenWrapper = ({ formData, onRestart, isViewMode = false }: ResultsScreenWrapperProps) => {
  // FALLBACK: Verificar se dados são válidos
  if (!formData || typeof formData !== "object") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <p className="text-red-600">Relatório inválido ou dados malformados.</p>
        </div>
      </div>
    );
  }

  // Limpar dados locais ao carregar componente de resultados
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Conteúdo do relatório será renderizado aqui */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Relatório SWOT - {formData.nomeEmpresa || 'Empresa'}
          </h1>
          
          {/* Verificar se há resultado final */}
          {formData.resultadoFinal ? (
            <div className="space-y-6">
              <p className="text-gray-700">
                Relatório gerado com sucesso e dados válidos.
              </p>
              {!isViewMode && (
                <button
                  onClick={onRestart}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Nova Análise
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Este relatório ainda não possui análise finalizada.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsScreenWrapper;
