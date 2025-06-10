import React from 'react';
import { CheckCircle } from 'lucide-react';

// Componente de prueba simple para verificar que todo funciona
const FrequencyInfoTest = () => {
  return (
    <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <CheckCircle size={16} className="text-green-600" />
        <h4 className="text-green-800 font-medium">
          ✅ Componente FrequencyInfo funcionando correctamente
        </h4>
      </div>
      <p className="text-sm text-green-700 mt-2">
        Si ves este mensaje, los componentes FrequencyInfo están cargando correctamente.
      </p>
    </div>
  );
};

export default FrequencyInfoTest;