@echo off
echo ===============================================
echo 🔍 DIAGNÓSTICO DE ERROR 500 VITE
echo ===============================================
echo.

echo 📋 Verificando archivos de componentes...
echo.

REM Verificar que UnifiedExecutionHistory existe y es accesible
if exist "src\components\solicitudes\enhanced\UnifiedExecutionHistory.jsx" (
    echo ✅ UnifiedExecutionHistory.jsx existe
    
    REM Verificar import básico
    findstr /C:"import React" "src\components\solicitudes\enhanced\UnifiedExecutionHistory.jsx" >nul
    if !errorlevel! == 0 (
        echo ✅ Import de React correcto
    ) else (
        echo ❌ Problema con import de React
    )
    
    REM Verificar export
    findstr /C:"export default" "src\components\solicitudes\enhanced\UnifiedExecutionHistory.jsx" >nul
    if !errorlevel! == 0 (
        echo ✅ Export default presente
    ) else (
        echo ❌ Falta export default
    )
) else (
    echo ❌ UnifiedExecutionHistory.jsx no encontrado
)

echo.
echo 🔍 Verificando imports de lucide-react...

findstr /C:"from 'lucide-react'" "src\components\solicitudes\enhanced\UnifiedExecutionHistory.jsx" >nul
if %errorlevel% == 0 (
    echo ✅ Imports de lucide-react encontrados
    
    REM Verificar que no haya iconos problemáticos
    findstr /C:"Timeline" "src\components\solicitudes\enhanced\UnifiedExecutionHistory.jsx" >nul
    if %errorlevel% == 0 (
        echo ❌ ADVERTENCIA: Aún hay referencias a Timeline
    ) else (
        echo ✅ Sin iconos problemáticos
    )
) else (
    echo ❌ Sin imports de lucide-react
)

echo.
echo 🔍 Verificando utilidades...

if exist "src\utils\cn.js" (
    echo ✅ cn.js utility existe
) else (
    echo ❌ cn.js utility no encontrada
)

echo.
echo 📋 POSIBLES CAUSAS DEL ERROR 500:
echo    1. Componente UI que no existe o tiene errores
echo    2. Dependencia circular entre componentes
echo    3. Import de archivo que no existe
echo    4. Error de sintaxis sutil
echo    5. Problema con bundler/cache de Vite
echo.
echo 🔧 SOLUCIONES APLICADAS:
echo    ✅ Versión simplificada sin dependencias complejas
echo    ✅ Solo HTML/CSS básico + Tailwind
echo    ✅ Eliminados imports problemáticos
echo    ✅ Componentes inline sin dependencias externas
echo.
echo 🚀 SIGUIENTE PASO:
echo    npm run dev
echo.
echo 📋 SI PERSISTE EL ERROR:
echo    1. Verificar consola del navegador
echo    2. Verificar terminal de Vite
echo    3. Revisar rutas de import
echo    4. Limpiar cache: rm -rf node_modules/.vite
echo.
echo ===============================================
echo ✨ DIAGNÓSTICO COMPLETO
echo ===============================================
pause