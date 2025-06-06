import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🔧 BASE RELATIVA para App Engine
  base: './',
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        // 🔧 MEJORAR: Manejar errores de conexión
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.warn('⚠️ Proxy error - Backend no disponible:', err.message);
            // En lugar de devolver error 500, devolver respuesta mock
            if (res.writable) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                error: 'Backend no disponible',
                mock: true,
                data: []
              }));
            }
          });
          
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🌐 Proxy request a:', proxyReq.path);
          });
        }
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // 🔧 BASE RELATIVA para App Engine
    base: './',
  },
  // 🔧 AGREGAR: Variables de entorno para modo mock
  define: {
    __MOCK_MODE__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __BACKEND_URL__: JSON.stringify(process.env.BACKEND_URL || 'http://localhost:8000'),
  }
})
