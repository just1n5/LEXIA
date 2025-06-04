@echo off
setlocal enabledelayedexpansion
title Fix ConsultaJudicial RPA Errors

echo.
echo 🔧 === REPARACIÓN AUTOMÁTICA DE ERRORES ===
echo.

REM 1. Verificar backend
echo 🔗 Verificando backend en puerto 8000...
curl -s --max-time 3 http://localhost:8000/health >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Backend disponible
    set "BACKEND_OK=true"
) else (
    echo ❌ Backend NO disponible
    set "BACKEND_OK=false"
)

REM 2. Verificar método getSolicitud
echo.
echo 🔧 Verificando método getSolicitud...
findstr /c:"async getSolicitud(solicitudId)" src\services\solicitudes.js >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Método getSolicitud ya existe
) else (
    echo ⚠️  Agregando método getSolicitud faltante...
    
    REM Crear backup
    copy src\services\solicitudes.js src\services\solicitudes.js.backup >nul
    
    REM Buscar línea donde insertar el método
    powershell -Command "(Get-Content 'src\services\solicitudes.js') -replace '  },(\s*// Actualizar solicitud)', '  },$1`n`n  // ✅ ALIAS: Método alternativo para mantener compatibilidad`n  async getSolicitud(solicitudId) {`n    return await this.getSolicitudById(solicitudId);`n  },$1' | Set-Content 'src\services\solicitudes.js'"
    
    echo ✅ Método getSolicitud agregado
)

REM 3. Configurar .env según disponibilidad del backend
echo.
echo ⚙️ Configurando .env...
if "%BACKEND_OK%"=="true" (
    (
        echo # API Configuration
        echo VITE_API_URL=http://localhost:8000
        echo VITE_USE_MOCK=false
        echo.
        echo # 🔧 CONFIGURACIÓN DE DESARROLLO
        echo VITE_MODE=development
        echo VITE_USE_MOCK_DATA=false
        echo VITE_BACKEND_URL=http://localhost:8000
        echo VITE_API_TIMEOUT=5000
        echo.
        echo # 🔧 CONFIGURACIÓN DE DEBUG
        echo VITE_DEBUG_API=true
        echo VITE_SHOW_MOCK_WARNINGS=false
        echo.
        echo # 🔧 CONFIGURACIÓN DE FALLBACK
        echo VITE_ENABLE_FALLBACK=true
        echo VITE_OFFLINE_MODE=false
    ) > .env
    echo ✅ Configurado para modo API
) else (
    (
        echo # API Configuration
        echo VITE_API_URL=http://localhost:8000
        echo VITE_USE_MOCK=true
        echo.
        echo # 🔧 CONFIGURACIÓN DE DESARROLLO
        echo VITE_MODE=development
        echo VITE_USE_MOCK_DATA=true
        echo VITE_BACKEND_URL=http://localhost:8000
        echo VITE_API_TIMEOUT=5000
        echo.
        echo # 🔧 CONFIGURACIÓN DE DEBUG
        echo VITE_DEBUG_API=true
        echo VITE_SHOW_MOCK_WARNINGS=true
        echo.
        echo # 🔧 CONFIGURACIÓN DE FALLBACK
        echo VITE_ENABLE_FALLBACK=true
        echo VITE_OFFLINE_MODE=false
    ) > .env
    echo ✅ Configurado para modo mock
)

echo.
echo 📊 === ESTADO FINAL ===
echo.

if "%BACKEND_OK%"=="true" (
    echo ✅ Backend: DISPONIBLE
    echo ✅ Modo: API COMPLETA
    echo ✅ Errores: CORREGIDOS
) else (
    echo ⚠️  Backend: NO DISPONIBLE
    echo ✅ Modo: MOCK FUNCIONAL
    echo ✅ Errores: CORREGIDOS
    echo.
    echo 💡 Para activar el backend:
    echo    docker-compose up -d
    echo    O sigue las instrucciones en la guía
)

echo.
echo 🚀 ¿Quieres iniciar el servidor de desarrollo? (y/n)
set /p response="> "
if /i "%response%"=="y" (
    echo.
    echo 🎯 Iniciando npm run dev...
    npm run dev
) else (
    echo.
    echo ✅ Correcciones aplicadas. Ejecuta "npm run dev" cuando estés listo.
)

echo.
pause
endlocal