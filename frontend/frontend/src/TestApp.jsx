// Versión de prueba simple para diagnosticar errores
import React from 'react';

// Test básico - solo verificar si React funciona
const TestApp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Test de Solicitudes</h1>
      <p>Si ves esto, React está funcionando correctamente.</p>
      
      {/* Test de importaciones básicas */}
      <div style={{ marginTop: '20px' }}>
        <h2>Tests de Componentes:</h2>
        <TestImports />
      </div>
    </div>
  );
};

const TestImports = () => {
  try {
    // Test de importaciones una por una
    const validationMessage = require('../components/forms/ValidationMessage.jsx');
    const frequencySelector = require('../components/forms/FrequencySelector.jsx');
    
    return (
      <div>
        <p>✅ Componentes básicos se cargan correctamente</p>
        <button onClick={() => alert('React está funcionando!')}>
          Test Click
        </button>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ color: 'red' }}>
        <p>❌ Error en importaciones:</p>
        <pre>{error.message}</pre>
      </div>
    );
  }
};

export default TestApp;
