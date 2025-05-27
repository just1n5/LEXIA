#!/bin/bash

echo "=========================================="
echo "INSTALACIÓN DEL PROYECTO RPA"
echo "=========================================="
echo

echo "1. Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker no está instalado"
    echo "Por favor instala Docker desde: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "2. Verificando Docker Compose..."
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "ERROR: Docker Compose no está disponible"
    exit 1
fi

echo "3. Copiando archivos de configuración..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Archivo .env creado. Por favor configura las variables de entorno."
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
fi

if [ ! -f rpa-bots/.env ]; then
    cp rpa-bots/.env.example rpa-bots/.env
fi

echo "4. Construyendo contenedores..."
docker compose build

echo "5. Iniciando servicios base..."
docker compose up -d postgres rabbitmq redis

echo "Esperando que los servicios estén listos..."
sleep 10

echo "6. Ejecutando migraciones..."
# docker compose exec backend python -m alembic upgrade head

echo
echo "=========================================="
echo "✅ INSTALACIÓN COMPLETADA"
echo "=========================================="
echo
echo "Para iniciar todos los servicios:"
echo "  docker compose up -d"
echo
echo "Para ver logs:"
echo "  docker compose logs -f"
echo
echo "Para detener servicios:"
echo "  docker compose down"
echo
