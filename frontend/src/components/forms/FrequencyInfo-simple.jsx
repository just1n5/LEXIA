import React from 'react';
import { Clock, Mail, CheckCircle, Info, RefreshCw, Heart, User } from 'lucide-react';

const FrequencyInfoSimple = ({ className = '' }) => {
  return (
    <div className={`${className}`}>
      {/* Card con diseño amigable para consulta individual */}
      <div className="border-2 border-blue-300 bg-blue-50 rounded-lg overflow-hidden">
        
        {/* Header personal y cercano */}
        <div className="bg-blue-500 px-4 py-2 flex items-center gap-2">
          <User size={16} className="text-white" />
          <h4 className="text-white font-medium text-base">
            Tu Consulta Personal
          </h4>
        </div>
        
        {/* Content con enfoque personal */}
        <div className="p-4 space-y-2">
          
          {/* Mensaje principal - tono personal */}
          <div className="bg-white rounded-lg border border-blue-200 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 text-base mb-1">
                  Seguimiento Automático Diario
                </h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Nosotros nos encargamos de revisar tu proceso <strong>todos los días</strong> para que tú no tengas que preocuparte.
                </p>
              </div>
            </div>
          </div>

          {/* Layout simple - información esencial */}
          <div className="space-y-2">
            
            {/* Horario */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={14} className="text-gray-900" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-base mb-1">
                    ¿Cuándo revisamos tu caso?
                  </p>
                  <p className="text-sm text-gray-700">
                    Cada día a las <strong>7:00 PM</strong> verificamos si hay novedades en tu proceso
                  </p>
                </div>
              </div>
            </div>

            {/* Notificaciones */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-base mb-1">
                    ¿Cuándo te avisamos?
                  </p>
                  <p className="text-sm text-gray-700">
                    Solo cuando <strong>encontremos algo nuevo</strong> en tu caso. Sin spam, solo lo importante.
                  </p>
                </div>
              </div>
            </div>
            
          </div>

          {/* Explicación amigable */}
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle size={12} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-green-700 leading-relaxed">
                  <strong className="text-green-800">¿Por qué una vez al día?</strong> 
                  Los procesos judiciales no cambian cada hora. Revisarlo diariamente es perfecto para 
                  estar informado sin saturarte con notificaciones innecesarias.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FrequencyInfoSimple;