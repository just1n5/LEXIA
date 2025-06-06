@echo off
echo 🖼️ Copiando logo de LEXIA...
echo.

REM Crear directorio si no existe
if not exist "public\logos" mkdir "public\logos"

REM Copiar logo principal
copy "frontend\Images\Logotipo lexia.png" "public\logos\lexia-logo.png"

REM También crear versión en src/assets
if not exist "src\assets\logos" mkdir "src\assets\logos"
copy "frontend\Images\Logotipo lexia.png" "src\assets\logos\lexia-logo.png"

echo ✅ Logo copiado exitosamente!
echo 📁 Ubicaciones:
echo    - public/logos/lexia-logo.png
echo    - src/assets/logos/lexia-logo.png
echo.
pause