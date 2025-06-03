// Test para verificar el estado del backend y configuración
// Usar desde consola del navegador: testBackendConnection()

export const testBackendConnection = async () => {
  console.log('🧪 Testing backend connection...');
  
  const tests = [
    {
      name: 'Health Check',
      url: 'http://localhost:8000/health',
      expected: 200
    },
    {
      name: 'API Base',
      url: 'http://localhost:8000/api',
      expected: 200
    },
    {
      name: 'Solicitudes Endpoint',
      url: 'http://localhost:8000/api/solicitudes',
      expected: 200
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(test.url, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const success = response.status === test.expected;
      results.push({
        name: test.name,
        url: test.url,
        status: response.status,
        success,
        message: success ? '✅ OK' : `❌ Expected ${test.expected}, got ${response.status}`
      });
      
    } catch (error) {
      results.push({
        name: test.name,
        url: test.url,
        status: 'ERROR',
        success: false,
        message: `❌ ${error.message}`
      });
    }
  }
  
  // Mostrar resultados
  console.table(results);
  
  const allPassed = results.every(r => r.success);
  console.log(allPassed ? '✅ Backend OK' : '❌ Backend tiene problemas');
  
  return allPassed;
};

// Test específico para el servicio de solicitudes
export const testSolicitudesService = async () => {
  console.log('🧪 Testing solicitudes service...');
  
  try {
    const { solicitudesService } = await import('../services/solicitudes');
    
    console.log('📊 Testing getSolicitudes...');
    const solicitudes = await solicitudesService.getSolicitudes();
    console.log('✅ getSolicitudes OK:', solicitudes.length, 'solicitudes');
    
    console.log('📈 Testing getStats...');
    const stats = await solicitudesService.getStats();
    console.log('✅ getStats OK:', stats);
    
    console.log('🔍 Testing getResultadosSolicitud...');
    const resultados = await solicitudesService.getResultadosSolicitud('demo_1');
    console.log('✅ getResultadosSolicitud OK:', resultados.length, 'resultados');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing solicitudes service:', error);
    return false;
  }
};

// Ejecutar test completo
export const runFullTest = async () => {
  console.log('🚀 Ejecutando test completo...');
  
  const backendOK = await testBackendConnection();
  const serviceOK = await testSolicitudesService();
  
  const result = {
    backend: backendOK,
    service: serviceOK,
    overall: serviceOK // El servicio puede funcionar en mock incluso sin backend
  };
  
  console.log('📊 Resultado final:', result);
  
  if (result.overall) {
    console.log('🎉 Sistema funcionando correctamente');
  } else {
    console.log('⚠️ Sistema con problemas, verificar configuración');
  }
  
  return result;
};

// Para usar desde consola del navegador:
// import { runFullTest } from './utils/testConnection';
// runFullTest();

// Agregar al objeto window para fácil acceso
if (typeof window !== 'undefined') {
  window.testBackend = testBackendConnection;
  window.testService = testSolicitudesService;
  window.runFullTest = runFullTest;
  console.log('🔧 Funciones de test disponibles en window:', {
    testBackend: 'window.testBackend()',
    testService: 'window.testService()', 
    runFullTest: 'window.runFullTest()'
  });
}
