FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Variables de entorno para desarrollo
ENV VITE_API_URL=http://localhost:8000

# Comando para desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
