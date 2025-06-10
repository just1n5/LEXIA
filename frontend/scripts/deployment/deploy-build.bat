@echo off
REM 🚀 Build Script para Google Cloud - ConsultaJudicial RPA (Windows)
REM Autor: Frontend Team

echo 🔧 Iniciando build para Google Cloud...

REM Limpiar build anterior
echo 🧹 Limpiando builds anteriores...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm ci

REM Variables de entorno para producción
set NODE_ENV=production
set VITE_USE_MOCK_DATA=false
set VITE_API_URL=https://your-backend-url.appspot.com

REM Build optimizado para producción
echo ⚡ Construyendo aplicación optimizada...
call npm run build:production

REM Verificar que el build fue exitoso
if not exist "dist\index.html" (
    echo ❌ Error en el build!
    exit /b 1
)

echo ✅ Build completado exitosamente!
echo 📁 Archivos generados en: .\dist\
dir dist

echo 📊 Estadísticas del bundle:
for /f %%i in ('powershell -command "(Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB"') do echo Tamaño total: %%i MB

echo 🎉 ¡Proyecto listo para Google Cloud!
echo 📋 Siguiente paso: gcloud app deploy

pause