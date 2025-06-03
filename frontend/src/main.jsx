import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

// 🔧 IMPORTAR utilidades de testing para desarrollo
if (import.meta.env.DEV) {
  import('./utils/testConnection.js').then(({ runFullTest }) => {
    // Hacer test automático en desarrollo
    setTimeout(() => {
      console.log('🔧 Ejecutando test inicial del sistema...');
      runFullTest();
    }, 2000);
  }).catch(err => {
    console.warn('⚠️ No se pudo cargar el test de conexión:', err);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
