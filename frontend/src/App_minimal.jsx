import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#16a34a' }}>✅ React Funciona Correctamente</h1>
      
      <div style={{ 
        backgroundColor: '#f0fdf4', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #bbf7d0',
        marginTop: '20px'
      }}>
        <h2>🧪 Test Básico de Solicitudes</h2>
        <p>Si ves esta página, React está funcionando. El problema estaba en las dependencias complejas.</p>
        
        <div style={{ marginTop: '20px' }}>
          <a 
            href="/test/solicitudes" 
            style={{
              backgroundColor: '#facc15',
              color: '#111827',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500'
            }}
          >
            🚀 Ir a Test de Solicitudes
          </a>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#fef3c7', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #fed7aa',
        marginTop: '20px'
      }}>
        <h3>📋 Próximos Pasos:</h3>
        <ol>
          <li>Verificar que este página se ve correctamente</li>
          <li>Instalar dependencias: <code>npm install react-hook-form lucide-react</code></li>
          <li>Probar la página de test de solicitudes</li>
          <li>Gradualmente agregar funcionalidades complejas</li>
        </ol>
      </div>

      <div style={{ 
        backgroundColor: '#eff6ff', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #bfdbfe',
        marginTop: '20px'
      }}>
        <h3>🔧 Troubleshooting:</h3>
        <p>Si esta página no se carga:</p>
        <ul>
          <li>Abrir DevTools (F12) → Consola</li>
          <li>Buscar errores en rojo</li>
          <li>Verificar que el servidor está corriendo: <code>npm start</code></li>
          <li>Verificar puerto: <code>http://localhost:3000</code></li>
        </ul>
      </div>
    </div>
  );
}

export default App;
