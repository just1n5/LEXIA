@echo off
echo 🖼️ Copiando logo de LEXIA...
echo.

REM Verificar si existe el archivo fuente
if not exist "frontend\Images\Logotipo lexia.png" (
    echo ❌ Error: No se encontró el archivo fuente "frontend\Images\Logotipo lexia.png"
    echo 📁 Verifica la ruta del archivo
    pause
    exit /b 1
)

REM Copiar logo principal
copy "frontend\Images\Logotipo lexia.png" "public\logos\lexia-logo.png"

if %errorlevel% equ 0 (
    echo ✅ Logo copiado exitosamente!
    echo 📁 Ubicación: public/logos/lexia-logo.png
    echo.
    echo 🎉 Ya puedes ejecutar: npm run dev
) else (
    echo ❌ Error al copiar el archivo
    echo 💡 Intenta copiar manualmente:
    echo    Desde: frontend\Images\Logotipo lexia.png
    echo    Hacia: public\logos\lexia-logo.png
)

echo.
pause