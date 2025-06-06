@echo off
REM 🧪 Script de Testing Pre-Deploy - ConsultaJudicial RPA
REM Verifica que todo esté listo para el deployment a Google Cloud

echo.
echo ===================================================================
echo 🧪 TESTING PRE-DEPLOY - ConsultaJudicial RPA
echo ===================================================================
echo.

set ERROR_COUNT=0

REM ===== VERIFICACIÓN DE ARCHIVOS ESENCIALES =====
echo 📁 Verificando archivos esenciales...

if not exist "package.json" (
    echo ❌ package.json no encontrado
    set /a ERROR_COUNT+=1
) else (
    echo ✅ package.json encontrado
)

if not exist "app.yaml" (
    echo ❌ app.yaml no encontrado
    set /a ERROR_COUNT+=1
) else (
    echo ✅ app.yaml encontrado
)

if not exist ".gcloudignore" (
    echo ⚠️  .gcloudignore no encontrado (opcional pero recomendado)
) else (
    echo ✅ .gcloudignore encontrado
)

echo.

REM ===== VERIFICACIÓN DE DEPENDENCIAS =====
echo 📦 Verificando dependencias...

where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ npm no está instalado
    set /a ERROR_COUNT+=1
) else (
    echo ✅ npm está disponible
)

where gcloud >nul 2>nul
if errorlevel 1 (
    echo ❌ Google Cloud CLI no está instalado
    echo 💡 Instalar desde: https://cloud.google.com/sdk/docs/install
    set /a ERROR_COUNT+=1
) else (
    echo ✅ Google Cloud CLI está disponible
    gcloud version --quiet
)

echo.

REM ===== VERIFICACIÓN DE CONFIGURACIÓN =====
echo ⚙️ Verificando configuración...

REM Verificar que gcloud esté autenticado
gcloud auth list --filter=status:ACTIVE --format="value(account)" >nul 2>nul
if errorlevel 1 (
    echo ⚠️  No hay sesión activa en gcloud
    echo 💡 Ejecutar: gcloud auth login
) else (
    echo ✅ Sesión de gcloud activa
    for /f %%i in ('gcloud auth list --filter=status:ACTIVE --format="value(account)"') do echo    Cuenta: %%i
)

REM Verificar proyecto configurado
for /f %%i in ('gcloud config get-value project 2^>nul') do set CURRENT_PROJECT=%%i
if "%CURRENT_PROJECT%"=="" (
    echo ⚠️  No hay proyecto de gcloud configurado
    echo 💡 Ejecutar: gcloud config set project TU-PROYECTO
) else (
    echo ✅ Proyecto configurado: %CURRENT_PROJECT%
)

echo.

REM ===== TEST DE BUILD =====
echo 🔨 Probando build de producción...

REM Verificar que node_modules existe
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    call npm ci
    if errorlevel 1 (
        echo ❌ Error instalando dependencias
        set /a ERROR_COUNT+=1
        goto :test_summary
    )
)

REM Ejecutar build de prueba
echo 🔧 Ejecutando build de prueba...
set NODE_ENV=production
set VITE_USE_MOCK_DATA=false

call npm run build:production >build-test.log 2>&1
if errorlevel 1 (
    echo ❌ Error en el build de producción
    echo 📋 Últimas líneas del log:
    powershell -command "Get-Content build-test.log | Select-Object -Last 10"
    set /a ERROR_COUNT+=1
) else (
    echo ✅ Build de producción exitoso
    
    REM Verificar que dist/ se creó correctamente
    if exist "dist\index.html" (
        echo ✅ Archivo index.html generado
    ) else (
        echo ❌ index.html no generado en dist/
        set /a ERROR_COUNT+=1
    )
    
    REM Verificar tamaño del bundle
    for /f %%i in ('powershell -command "(Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB"') do (
        echo 📊 Tamaño total del bundle: %%i MB
        if %%i GTR 10 (
            echo ⚠️  Bundle muy grande ^(^>10MB^), considera optimizar
        )
    )
)

REM Limpiar build de prueba
if exist dist rmdir /s /q dist >nul 2>nul

echo.

REM ===== VERIFICACIÓN DE VARIABLES DE ENTORNO =====
echo 🌍 Verificando variables de entorno en app.yaml...

findstr "VITE_API_URL" app.yaml >nul
if errorlevel 1 (
    echo ⚠️  VITE_API_URL no configurada en app.yaml
    echo 💡 Configurar la URL de tu backend
) else (
    for /f "tokens=2 delims=:" %%i in ('findstr "VITE_API_URL" app.yaml') do (
        echo ✅ VITE_API_URL configurada: %%i
        echo %%i | findstr "your-backend-url" >nul
        if not errorlevel 1 (
            echo ⚠️  Parece ser una URL de ejemplo, verificar configuración
        )
    )
)

echo.

REM ===== VERIFICACIÓN DE APP ENGINE =====
echo 🚀 Verificando configuración de App Engine...

gcloud app describe >nul 2>nul
if errorlevel 1 (
    echo ⚠️  App Engine no está inicializado en el proyecto actual
    echo 💡 Ejecutar: gcloud app create --region=us-central1
) else (
    echo ✅ App Engine configurado
    for /f "tokens=2" %%i in ('gcloud app describe --format="value(locationId)"') do echo    Región: %%i
)

echo.

REM ===== RESUMEN =====
:test_summary
echo ===================================================================
echo 📋 RESUMEN DEL TEST PRE-DEPLOY
echo ===================================================================

if %ERROR_COUNT% EQU 0 (
    echo ✅ ¡TODOS LOS TESTS PASARON!
    echo 🚀 Tu proyecto está listo para deployment
    echo.
    echo 🎯 Comandos para deploy:
    echo    npm run deploy:full
    echo    - o -
    echo    npm run build:gcloud
    echo    gcloud app deploy
    echo.
    echo 📱 Después del deploy:
    echo    gcloud app browse
) else (
    echo ❌ SE ENCONTRARON %ERROR_COUNT% ERRORES
    echo 🔧 Corrige los errores antes del deployment
    echo.
    echo 💡 ACCIONES SUGERIDAS:
    if not exist "app.yaml" echo    - Crear app.yaml con configuración de App Engine
    where gcloud >nul 2>nul || echo    - Instalar Google Cloud CLI
    gcloud auth list --filter=status:ACTIVE --format="value(account)" >nul 2>nul || echo    - Ejecutar: gcloud auth login
    echo    - Verificar configuración en app.yaml
    echo    - Revisar logs de errores arriba
)

echo.
echo ===================================================================

REM Limpiar archivos temporales
if exist build-test.log del build-test.log >nul 2>nul

echo 🏁 Test completado. Presiona cualquier tecla para continuar...
pause >nul

exit /b %ERROR_COUNT%