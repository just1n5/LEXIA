FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema para Selenium/Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    unzip \
    curl \
    xvfb \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Instalar Playwright browsers
RUN playwright install chromium

# Copiar código fuente
COPY . .

# Crear directorios para logs y temp
RUN mkdir -p /app/logs /app/temp

# Variables de entorno
ENV PYTHONPATH=/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Comando para ejecutar worker de Celery
CMD ["celery", "-A", "celery_worker", "worker", "--loglevel=info", "--concurrency=2"]
