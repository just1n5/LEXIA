-- Inicialización de base de datos para Consulta Judicial RPA
-- Este script se ejecuta automáticamente al crear el contenedor de PostgreSQL

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear esquemas
CREATE SCHEMA IF NOT EXISTS public;

-- Nota: Las tablas se crearán a través de las migraciones de SQLAlchemy
-- Este archivo solo contiene la configuración inicial básica
