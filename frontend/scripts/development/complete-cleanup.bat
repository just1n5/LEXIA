@echo off
REM 🎯 COMANDO FINAL DE LIMPIEZA LEXIA (Windows)
REM Ejecuta este comando para completar la limpieza automática

echo 🧹 Completando limpieza del proyecto LEXIA...
echo.

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ Error: Ejecuta este comando desde la carpeta frontend/
    pause
    exit /b 1
)

REM Verificar que existe la carpeta temporal
if not exist "TEMP_DELETE_THESE_FILES" (
    echo ❌ Error: No se encontró la carpeta TEMP_DELETE_THESE_FILES
    echo La limpieza ya fue completada o hubo un error.
    pause
    exit /b 1
)

REM Mostrar qué se va a eliminar
echo 📋 Archivos que serán eliminados permanentemente:
echo -----------------------------------------------
dir TEMP_DELETE_THESE_FILES
echo.

REM Confirmar eliminación
set /p confirm="¿Estás seguro de eliminar estos archivos? (y/N): "

if /i "%confirm%"=="y" (
    REM Eliminar archivos temporales
    echo 🗑️  Eliminando archivos temporales...
    rmdir /s /q TEMP_DELETE_THESE_FILES
    
    REM Verificar eliminación exitosa
    if not exist "TEMP_DELETE_THESE_FILES" (
        echo ✅ ¡Limpieza completada exitosamente!
        echo.
        echo 📊 Resumen final:
        echo   ✅ Archivos temporales eliminados
        echo   ✅ Scripts obsoletos removidos
        echo   ✅ Componentes obsoletos eliminados
        echo   ✅ Documentación organizada
        echo   ✅ Estructura profesional lista
        echo.
        echo 🚀 Tu proyecto LEXIA está ahora completamente limpio!
        echo.
        echo 📝 Próximos pasos recomendados:
        echo   1. npm run dev    # Verificar que todo funciona
        echo   2. git add .      # Añadir cambios al git
        echo   3. git commit -m "🧹 Clean project structure"
        echo.
    ) else (
        echo ❌ Error al eliminar archivos. Intenta manualmente:
        echo rmdir /s /q TEMP_DELETE_THESE_FILES
    )
) else (
    echo ❌ Limpieza cancelada.
    echo 💡 Para eliminar manualmente: rmdir /s /q TEMP_DELETE_THESE_FILES
)

pause
