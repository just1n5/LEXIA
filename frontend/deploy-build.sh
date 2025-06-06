#!/bin/bash

# 🚀 Build Script para Google Cloud - ConsultaJudicial RPA
# Autor: Frontend Team
# Fecha: $(date)

echo "🔧 Iniciando build para Google Cloud..."

# Limpiar build anterior
echo "🧹 Limpiando builds anteriores..."
rm -rf dist/
rm -rf node_modules/.vite/

# Instalar dependencias (solo producción)
echo "📦 Instalando dependencias de producción..."
npm ci --only=production

# Variables de entorno para producción
export NODE_ENV=production
export VITE_USE_MOCK_DATA=false
export VITE_API_URL="https://your-backend-url.appspot.com"

# Build optimizado para producción
echo "⚡ Construyendo aplicación optimizada..."
npm run build:production

# Verificar que el build fue exitoso
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Build completado exitosamente!"
    echo "📁 Archivos generados en: ./dist/"
    ls -la dist/
else
    echo "❌ Error en el build!"
    exit 1
fi

# Optimizaciones adicionales
echo "🔧 Aplicando optimizaciones..."

# Comprimir archivos CSS y JS (si gzip no está habilitado en App Engine)
echo "📦 Comprimiendo archivos estáticos..."
find dist/ -name "*.js" -exec gzip -9 -c {} \; > {}.gz || true
find dist/ -name "*.css" -exec gzip -9 -c {} \; > {}.gz || true

# Verificar tamaño del bundle
echo "📊 Estadísticas del bundle:"
du -sh dist/
echo "📋 Archivos principales:"
ls -lah dist/assets/

echo "🎉 ¡Proyecto listo para Google Cloud!"
echo "📋 Siguiente paso: gcloud app deploy