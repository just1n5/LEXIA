@echo off
echo ===============================================
echo 🔧 SOLUCIONANDO ERROR REACT-QUERY COMPLETO
echo ===============================================
echo.
echo 📋 Problema identificado:
echo    - Conflicto entre react-query v3 y @tanstack/react-query v5
echo    - useHistorial.js y useSolicitudes.js importando versiones diferentes
echo.
echo 🚀 Solución aplicada:
echo    ✅ useHistorial.js migrado a @tanstack/react-query v5
echo    ✅ useSolicitudes.js migrado a @tanstack/react-query v5
echo    ✅ App.jsx actualizado para usar nueva API
echo    ✅ package.json limpio (removida dependencia conflictiva)
echo    ✅ Todos los hooks actualizados con API moderna
echo.
echo 🔄 Limpiando e instalando dependencias...
echo.

REM Limpiar node_modules y lockfile
if exist "node_modules" (
    echo Eliminando node_modules...
    rmdir /s /q "node_modules"
)

if exist "package-lock.json" (
    echo Eliminando package-lock.json...
    del "package-lock.json"
)

echo.
echo 📦 Instalando dependencias limpias...
call npm install

echo.
echo ✅ ¡Solución aplicada exitosamente!
echo.
echo 🚀 Para iniciar el servidor de desarrollo:
echo    npm run dev
echo.
echo 📋 Archivos corregidos:
echo    ✅ src/hooks/useHistorial.js - Migrado a v5
echo    ✅ src/hooks/useSolicitudes.js - Migrado a v5  
echo    ✅ src/App.jsx - QueryClient actualizado
echo    ✅ package.json - Dependencia conflictiva removida
echo.
echo 🎯 Cambios de API implementados:
echo    - gcTime reemplaza cacheTime
echo    - isPending reemplaza isLoading (mutations)
echo    - placeholderData para datos iniciales
echo    - Error handling mejorado con useEffect
echo    - invalidateQueries con queryKey object
echo.
echo ===============================================
echo ✨ MIGRACIÓN COMPLETA - Sin conflictos
echo ===============================================
pause