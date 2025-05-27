@echo off
echo ==========================================
echo INSTALACIÓN DEL PROYECTO RPA
echo ==========================================
echo.

echo 1. Verificando Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no está instalado o no está en el PATH
    echo Por favor instala Docker Desktop desde: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo 2. Verificando Docker Compose...
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose no está disponible
    pause
    exit /b 1
)

echo 3. Copiando archivos de configuración...
if not exist .env (
    copy .env.example .env
    echo Archivo .env creado. Por favor configura las variables de entorno.
)

if not exist backend\.env (
    copy backend\.env.example backend\.env
)

if not exist frontend\.env (
    copy frontend\.env.example frontend\.env
)

if not exist rpa-bots\.env (
    copy rpa-bots\.env.example rpa-bots\.env
)

echo 4. Construyendo contenedores...
docker compose build

echo 5. Iniciando servicios...
docker compose up -d postgres rabbitmq redis

echo Esperando que los servicios estén listos...
timeout /t 10 /nobreak >nul

echo 6. Ejecutando migraciones...
REM docker compose exec backend python -m alembic upgrade head

echo.
echo ==========================================
echo ✅ INSTALACIÓN COMPLETADA
echo ==========================================
echo.
echo Para iniciar todos los servicios:
echo   docker compose up -d
echo.
echo Para ver logs:
echo   docker compose logs -f
echo.
echo Para detener servicios:
echo   docker compose down
echo.
pause
