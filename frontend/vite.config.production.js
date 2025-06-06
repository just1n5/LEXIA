import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 🚀 Configuración optimizada para Google Cloud App Engine
export default defineConfig({
  plugins: [react()],
  
  // 🔧 Configuración de desarrollo (no afecta producción)
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.warn('⚠️ Proxy error - Backend no disponible:', err.message);
            if (res.writable) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                error: 'Backend no disponible',
                mock: true,
                data: []
              }));
            }
          });
        }
      },
    },
  },
  
  // 🚀 Configuración de build optimizada para Google Cloud
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production', // Solo en desarrollo
    minify: 'terser', // Minificación agresiva
    
    // ⚡ Optimizaciones de bundle
    rollupOptions: {
      output: {
        // 📦 Separar dependencias en chunks para mejor caché
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-http': ['axios'],
          'vendor-ui': ['lucide-react'],
          'vendor-forms': ['react-hook-form'],
          'vendor-utils': ['clsx']
        },
        
        // 🎯 Nombres consistentes para caché
        chunkFileNames: 'assets/chunks/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          
          // Organizar assets por tipo
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${extType}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${extType}`;
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return `assets/styles/[name]-[hash].${extType}`;
          }
          
          return `assets/[name]-[hash].${extType}`;
        }
      }
    },
    
    // 🔧 Configuración de Terser para minificación
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production', // Eliminar console.log en producción
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug', 'console.warn']
      },
      mangle: {
        safari10: true
      }
    },
    
    // 📏 Límites de chunk size
    chunkSizeWarningLimit: 1000, // 1MB warning
    
    // 🎯 Optimizaciones adicionales
    reportCompressedSize: false, // Más rápido en CI/CD
    
    // 🔒 Target para compatibilidad
    target: ['es2015', 'chrome79', 'firefox67', 'safari12']
  },
  
  // 🌍 Variables de entorno para diferentes ambientes
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    
    // 🔧 Configuración específica del app
    __USE_MOCK_DATA__: JSON.stringify(process.env.VITE_USE_MOCK_DATA === 'true'),
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8000'),
    __APP_NAME__: JSON.stringify('ConsultaJudicial RPA'),
  },
  
  // 🔄 Configuración de CSS
  css: {
    postcss: './postcss.config.js',
    
    // 🎨 Configuración para desarrollo
    devSourcemap: true,
    
    // ⚡ Optimizaciones de CSS para producción
    ...(process.env.NODE_ENV === 'production' && {
      minify: true,
    })
  },
  
  // 🔧 Optimización de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'lucide-react',
      'react-hook-form',
      'clsx'
    ],
    exclude: []
  },
  
  // 📱 PWA-ready (futuro)
  // Configuración base para convertir a PWA si es necesario
  ...(process.env.VITE_PWA === 'true' && {
    plugins: [
      react(),
      // VitePWA plugin se agregaría aquí
    ]
  })
})