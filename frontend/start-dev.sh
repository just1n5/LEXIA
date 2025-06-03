#!/bin/bash

echo "🚀 Iniciando ConsultaJudicial RPA Frontend..."
echo ""

# Verificar si el backend está corriendo
echo "🔍 Verificando backend..."
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend disponible en puerto 8000"
    export VITE_USE_MOCK_DATA=false
else
    echo "⚠️  Backend no disponible - Usando modo mock"
    export VITE_USE_MOCK_DATA=true
fi

echo ""
echo "🔧 Configuración:"
echo "- Modo: ${VITE_USE_MOCK_DATA:+MOCK} ${VITE_USE_MOCK_DATA:-API}"
echo "- Puerto frontend: 3000"
echo "- Puerto backend: 8000"
echo ""

# Verificar dependencias
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

echo "🎯 Iniciando servidor de desarrollo..."
echo "📱 La aplicación estará disponible en: http://localhost:3000"
echo ""
echo "💡 Funciones de testing disponibles en consola del navegador:"
echo "   - window.testBackend() - Test de conexión backend"
echo "   - window.testService() - Test de servicio de solicitudes"
echo "   - window.runFullTest() - Test completo"
echo ""

# Iniciar el servidor
npm run dev
