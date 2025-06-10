import React from 'react';
import { Clock, Mail, CheckCircle, Info, RefreshCw, Lightbulb } from 'lucide-react';

const FrequencyInfo = ({ className = '' }) => {
  return (
    <div className={`${className}`}>
      {/* Card tipo "summary" con layout horizontal */}
      <div className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg overflow-hidden">
        
        {/* Header ultra-compacto */}
        <div className="bg-blue-500 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-white" />
            <span className="text-white font-medium text-sm">Frecuencia Estándar</span>
          </div>
          <div className="flex items-center gap-1 text-white text-xs">
            <Clock size={12} />
            <span className="font-medium">7:00 PM</span>
          </div>
        </div>
        
        {/* Content en layout de resumen */}
        <div className="p-3">
          
          {/* Información principal en una sola línea */}
          <div className="bg-white rounded-md border border-blue-200 p-2 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <RefreshCw size={12} className="text-white" />
                </div>
                <span className="font-medium text-gray-900 text-sm">
                  Monitoreo Diario Automático
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <CheckCircle size={12} className="text-green-500" />
                <span>Configurado</span>
              </div>
            </div>
          </div>

          {/* Grid de datos clave en formato compacto */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            
            {/* Horario compacto */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
              <div className="flex items-center gap-1 mb-1">
                <Clock size={12} className="text-yellow-600" />
                <span className="font-medium text-yellow-800 text-xs">Horario</span>
              </div>
              <p className="text-xs text-gray-700">Diario 7:00 PM</p>
            </div>

            {/* Notificaciones compacto */}
            <div className="bg-orange-50 border border-orange-200 rounded-md p-2">
              <div className="flex items-center gap-1 mb-1">
                <Mail size={12} className="text-orange-600" />
                <span className="font-medium text-orange-800 text-xs">Alertas</span>
              </div>
              <p className="text-xs text-gray-700">Solo cambios</p>
            </div>
            
          </div>

          {/* Tip en línea única */}
          <div className="bg-green-50 border border-green-200 rounded-md p-2">
            <div className="flex items-center gap-2">
              <Lightbulb size={12} className="text-green-600 flex-shrink-0" />
              <p className="text-xs text-green-700">
                <strong>Óptimo:</strong> Detecta cambios sin saturar tu email
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FrequencyInfo;