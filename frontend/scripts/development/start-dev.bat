@echo off
echo 🚀 Iniciando ConsultaJudicial RPA Frontend...
echo.

REM Verificar si el backend está corriendo
echo 🔍 Verificando backend...
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Backend disponible en puerto 8000
    set VITE_USE_MOCK_DATA=false
) else (
    echo ⚠️  Backend no disponible - Usando modo mock
    set VITE_USE_MOCK_DATA=true
)

echo.
echo 🔧 Configuración:
if defined VITE_USE_MOCK_DATA (
    echo - Modo: MOCK
) else (
    echo - Modo: API
)
echo - Puerto frontend: 3000
echo - Puerto backend: 8000
echo.

REM Verificar dependencias
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
)

echo 🎯 Iniciando servidor de desarrollo...
echo 📱 La aplicación estará disponible en: http://localhost:3000
echo.
echo 💡 Funciones de testing disponibles en consola del navegador:
echo    - window.testBackend() - Test de conexión backend
echo    - window.testService() - Test de servicio de solicitudes  
echo    - window.runFullTest() - Test completo
echo.

REM Iniciar el servidor
npm run dev
