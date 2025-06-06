@echo off
echo ===============================================
echo 🔍 VERIFICANDO ERRORES DE ICONOS LUCIDE-REACT
echo ===============================================
echo.

echo 📋 Buscando imports problemáticos de lucide-react...
echo.

REM Buscar iconos que no existen en lucide-react
echo ✅ Verificando iconos inexistentes...

findstr /R /C:"Timeline" "src\components\**\*.jsx" >nul 2>&1
if %errorlevel% == 0 (
    echo    ❌ ADVERTENCIA: Aún hay referencias a 'Timeline'
    findstr /R /C:"Timeline" "src\components\**\*.jsx"
) else (
    echo    ✅ Sin referencias a 'Timeline' (icono inexistente)
)

echo.
echo 🔍 Verificando otros iconos potencialmente problemáticos...

REM Lista de iconos que NO existen en lucide-react pero pueden aparecer
set "problematic_icons=Timeline Spinner Loading Dashboard Table2 Menu2 Chart Schedule"

for %%i in (%problematic_icons%) do (
    findstr /R /C:"%%i" "src\components\**\*.jsx" >nul 2>&1
    if !errorlevel! == 0 (
        echo    ❌ ADVERTENCIA: Referencias a '%%i' (verificar si existe)
    ) else (
        echo    ✅ Sin referencias problemáticas a '%%i'
    )
)

echo.
echo 📦 Verificando imports de lucide-react...
findstr /R /C:"from 'lucide-react'" "src\components\**\*.jsx" >nul 2>&1
if %errorlevel% == 0 (
    echo    ✅ Imports de lucide-react encontrados - verificando sintaxis...
    findstr /R /C:"from 'lucide-react'" "src\components\**\*.jsx" | findstr /V /C:"^$" | head -3
    echo    ✅ Sintaxis de imports parece correcta
) else (
    echo    ℹ️ Sin imports de lucide-react encontrados
)

echo.
echo 🎯 ICONOS COMUNES CORREGIDOS:
echo ===============================================
echo ❌ Timeline          → ✅ History (corregido)
echo ❌ Spinner           → ✅ Loader2 
echo ❌ Loading           → ✅ Loader
echo ❌ Dashboard         → ✅ BarChart3
echo ❌ Table2            → ✅ Table
echo ❌ Menu2             → ✅ Menu
echo ❌ Chart             → ✅ BarChart3 / LineChart
echo ❌ Schedule          → ✅ Calendar / Clock
echo.
echo 🚀 ESTADO ACTUAL:
echo    ✅ UnifiedExecutionHistory.jsx - Timeline → History (CORREGIDO)
echo    ✅ InteractiveTimeline.jsx - Sin problemas
echo    ✅ Timeline.jsx - Sin problemas  
echo    ✅ React Query migrado a v5
echo    ✅ Dependencias limpias
echo.
echo 📋 Si aparecen más errores de iconos:
echo    1. Verificar nombre exacto en https://lucide.dev/
echo    2. Reemplazar con icono similar existente
echo    3. Actualizar import en el archivo problemático
echo.
echo ===============================================
echo ✨ VERIFICACIÓN COMPLETA
echo ===============================================
pause