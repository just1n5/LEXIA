// 🧪 pages/test/SimpleRadicadoTestPage.jsx
// Página simple de prueba para validación de radicados

import React from 'react';
import RadicadoValidationTest from '../../components/test/RadicadoValidationTest';

/**
 * Página simple para probar la validación de radicados
 * Sin dependencias complejas de layout o routing
 */
export const SimpleRadicadoTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <RadicadoValidationTest />
    </div>
  );
};

export default SimpleRadicadoTestPage;