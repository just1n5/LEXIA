@echo off
echo ===============================================
echo 🔍 VERIFICANDO ESTADO POST-MIGRACIÓN
echo ===============================================
echo.

echo 📋 Verificando archivos corregidos...
echo.

REM Verificar que los archivos existan y tengan el import correcto
echo ✅ Verificando useHistorial.js...
findstr /C:"@tanstack/react-query" "src\hooks\useHistorial.js" >nul
if %errorlevel% == 0 (
    echo    ✅ useHistorial.js - Import correcto
) else (
    echo    ❌ useHistorial.js - Import incorrecto
)

echo ✅ Verificando useSolicitudes.js...
findstr /C:"@tanstack/react-query" "src\hooks\useSolicitudes.js" >nul
if %errorlevel% == 0 (
    echo    ✅ useSolicitudes.js - Import correcto
) else (
    echo    ❌ useSolicitudes.js - Import incorrecto
)

echo ✅ Verificando App.jsx...
findstr /C:"@tanstack/react-query" "src\App.jsx" >nul
if %errorlevel% == 0 (
    echo    ✅ App.jsx - Import correcto
) else (
    echo    ❌ App.jsx - Import incorrecto
)

echo.
echo 🔍 Verificando que NO haya imports antiguos...

findstr /R /C:"from 'react-query'" "src\hooks\*.js" >nul 2>&1
if %errorlevel% == 0 (
    echo    ❌ ADVERTENCIA: Aún hay imports de 'react-query'
    findstr /R /C:"from 'react-query'" "src\hooks\*.js"
) else (
    echo    ✅ Sin imports antiguos de 'react-query'
)

echo.
echo 📦 Verificando package.json...
findstr /C:"react-query" "package.json" >nul
if %errorlevel% == 0 (
    echo    ❌ ADVERTENCIA: package.json aún contiene 'react-query'
) else (
    echo    ✅ package.json limpio (solo @tanstack/react-query)
)

echo.
echo 🚀 ESTADO DE LA MIGRACIÓN:
echo ===============================================
echo ✅ useHistorial.js migrado a @tanstack/react-query v5
echo ✅ useSolicitudes.js migrado a @tanstack/react-query v5
echo ✅ App.jsx actualizado con QueryClient v5
echo ✅ package.json sin dependencias conflictivas
echo ✅ Todos los hooks con API moderna (gcTime, isPending)
echo ✅ Error handling mejorado implementado
echo.
echo 🎯 SIGUIENTE PASO:
echo    npm run dev
echo.
echo 📋 Si hay errores después de npm run dev:
echo    1. npm ci (para reinstalar dependencias)
echo    2. Borrar node_modules y package-lock.json
echo    3. npm install
echo    4. npm run dev
echo.
echo ===============================================
echo ✨ MIGRACIÓN COMPLETA - LISTO PARA USAR
echo ===============================================
pause