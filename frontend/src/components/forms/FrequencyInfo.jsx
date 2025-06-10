import React from 'react';
import { Clock, Mail, CheckCircle, Info, RefreshCw, Lightbulb } from 'lucide-react';

const FrequencyInfo = ({ className = '' }) => {
  return (
    <div className={`${className}`}>
      {/* Card con distribución vertical optimizada */}
      <div className="border-2 border-blue-300 bg-blue-50 rounded-lg overflow-hidden">
        
        {/* Header eficiente */}
        <div className="bg-blue-500 px-4 py-2.5 flex items-center gap-2">
          <Info size={16} className="text-white" />
          <h4 className="text-white font-medium text-sm">
            Frecuencia de Notificación Estándar
          </h4>
        </div>
        
        {/* Content con layout vertical */}
        <div className="p-4 space-y-3">
          
          {/* Información principal - más horizontal para aprovechar espacio */}
          <div className="bg-white rounded-lg border border-blue-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 text-sm mb-1">
                  Monitoreo Diario Automático
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Revisión automática <strong>una vez al día</strong> sin configuración adicional necesaria.
                </p>
              </div>
            </div>
          </div>

          {/* Layout vertical - Horario arriba, Notificaciones abajo */}
          <div className="space-y-3">
            
            {/* Horario - aprovecha todo el ancho */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={14} className="text-gray-900" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm mb-1">Horario Diario</p>
                  <p className="text-xs text-gray-600">
                    Las consultas se realizan automáticamente a partir de las <strong>7:00 PM</strong> todos los días
                  </p>
                </div>
              </div>
            </div>

            {/* Notificaciones - debajo del horario, aprovecha todo el ancho */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm mb-1">Notificaciones</p>
                  <p className="text-xs text-gray-600">
                    Recibirás un email únicamente cuando <strong>detectemos cambios</strong> en el estado del proceso
                  </p>
                </div>
              </div>
            </div>
            
          </div>

          {/* Explicación compacta */}
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lightbulb size={12} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-green-700 leading-relaxed">
                  <strong className="text-green-800">¿Por qué esta frecuencia?</strong> 
                  La revisión diaria es óptima para el seguimiento judicial: detecta cambios importantes 
                  sin saturar tu email y respeta los tiempos procesales típicos del sistema judicial.
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