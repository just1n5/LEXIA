import React from 'react';
import FrequencyInfo from '../components/forms/FrequencyInfo';

// Página de prueba simple para verificar FrequencyInfo
const TestFrequencyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Prueba del Componente FrequencyInfo
        </h1>
        
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Componente FrequencyInfo:</h2>
          <FrequencyInfo />
        </div>
        
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Estado:</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Componente cargado correctamente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Usando clases Tailwind estándar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Preparado para producción</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/solicitudes/select-type" 
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ir a Selección de Consulta
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestFrequencyPage;