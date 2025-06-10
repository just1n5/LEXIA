import React from 'react';
import { Clock, Mail, CheckCircle, Info, RefreshCw, Layers, BarChart3, Package } from 'lucide-react';

const FrequencyInfoBulk = ({ className = '', totalRecords = 0 }) => {
  return (
    <div className={`${className}`}>
      {/* Card optimizada para procesamiento masivo */}
      <div className="border-2 border-purple-300 bg-purple-50 rounded-lg overflow-hidden">
        
        {/* Header profesional para volumen */}
        <div className="bg-purple-600 px-4 py-2 flex items-center gap-2">
          <Package size={16} className="text-white" />
          <h4 className="text-white font-medium text-base">
            Procesamiento Masivo
          </h4>
          {totalRecords > 0 && (
            <span className="ml-auto bg-purple-800 text-white px-2 py-1 rounded text-sm">
              {totalRecords} procesos
            </span>
          )}
        </div>
        
        {/* Content enfocado en eficiencia y volumen */}
        <div className="p-4 space-y-2">
          
          {/* Información principal - enfoque en eficiencia */}
          <div className="bg-white rounded-lg border border-purple-200 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Layers size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 text-base mb-1">
                  Monitoreo Consolidado Diario
                </h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Procesamiento automático de <strong>todos sus radicados</strong> en una sola operación diaria optimizada.
                </p>
              </div>
            </div>
          </div>

          {/* Layout profesional - información técnica */}
          <div className="space-y-2">
            
            {/* Horario y eficiencia */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-base mb-1">
                    Procesamiento Nocturno Optimizado
                  </p>
                  <p className="text-sm text-gray-700">
                    Inicio a las <strong>7:00 PM</strong> - procesamiento secuencial eficiente de toda su cartera de casos
                  </p>
                </div>
              </div>
            </div>

            {/* Consolidación de reportes */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-base mb-1">
                    Reporte Consolidado Inteligente
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Un solo email</strong> con resumen ejecutivo de todos los cambios detectados en su cartera
                  </p>
                </div>
              </div>
            </div>

            {/* Optimización de recursos */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <RefreshCw size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-base mb-1">
                    Eficiencia de Recursos
                  </p>
                  <p className="text-sm text-gray-700">
                    Procesamiento por lotes que <strong>optimiza el uso del sistema</strong> y reduce tiempos de consulta
                  </p>
                </div>
              </div>
            </div>
            
          </div>

          {/* Explicación técnica para volumen */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Info size={12} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-indigo-700 leading-relaxed">
                  <strong className="text-indigo-800">Ventajas del procesamiento masivo:</strong> 
                  La frecuencia diaria permite consolidar múltiples consultas en una sola operación, 
                  optimizando recursos del sistema y proporcionando reportes organizados por prioridad y estado.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FrequencyInfoBulk;