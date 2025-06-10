import React from 'react';
import { Clock, Mail, CheckCircle, Info, RefreshCw, Lightbulb } from 'lucide-react';

const FrequencyInfo = ({ className = '' }) => {
  return (
    <div className={`${className}`}>
      {/* Card principal con header compacto */}
      <div className="border-2 border-blue-300 bg-blue-50 rounded-lg overflow-hidden">
        
        {/* Header compacto */}
        <div className="bg-blue-500 px-4 py-3">
          <div className="flex items-center gap-2">
            <Info size={18} className="text-white flex-shrink-0" />
            <h4 className="text-white font-semibold text-base">
              Frecuencia de Notificación Estándar
            </h4>
          </div>
        </div>
        
        {/* Content organizado en grid eficiente */}
        <div className="p-4 space-y-4">
          
          {/* Información principal - layout horizontal compacto */}
          <div className="bg-white rounded-lg border border-blue-200 p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-gray-900 text-sm mb-1">
                  Monitoreo Diario Automático
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Tu consulta será revisada <strong>una vez al día</strong> de forma completamente automática.
                </p>
              </div>
            </div>
          </div>

          {/* Grid de información clave - 2x2 compacto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Horario */}
            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center flex-shrink-0">
                <Clock size={12} className="text-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-xs mb-0.5">Horario</p>
                <p className="text-xs text-gray-600">
                  Diariamente <strong>7:00 PM</strong>
                </p>
              </div>
            </div>

            {/* Notificaciones */}
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="w-6 h-6 bg-orange-400 rounded flex items-center justify-center flex-shrink-0">
                <Mail size={12} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-xs mb-0.5">Notificaciones</p>
                <p className="text-xs text-gray-600">
                  Solo si hay <strong>cambios</strong>
                </p>
              </div>
            </div>
            
          </div>

          {/* Información adicional - inline compacta */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lightbulb size={10} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-green-700 leading-relaxed">
                  <strong className="text-green-800">¿Por qué diario?</strong> 
                  Detecta cambios importantes sin saturar tu email y respeta los tiempos procesales del sistema judicial.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FrequencyInfo;