# 🚀 Guía de Deployment - Google Cloud App Engine

## 📋 **Requisitos Previos**

### 1. **Instalar Google Cloud CLI**
```bash
# Windows (PowerShell como Administrador)
# Descargar e instalar desde: https://cloud.google.com/sdk/docs/install

# O usando Chocolatey
choco install gcloudsdk

# Verificar instalación
gcloud version
```

### 2. **Configurar Proyecto en Google Cloud**
```bash
# Inicializar gcloud
gcloud init

# Crear nuevo proyecto (opcional)
gcloud projects create consulta-judicial-rpa --name="ConsultaJudicial RPA"

# Seleccionar proyecto
gcloud config set project consulta-judicial-rpa

# Habilitar App Engine
gcloud app create --region=us-central1
```

---

## 🛠️ **Paso a Paso - Deployment**

### **Paso 1: Preparar el Proyecto**

1. **Actualizar configuración de backend en `app.yaml`:**
```yaml
env_variables:
  VITE_API_URL: "https://TU-BACKEND-URL.appspot.com"
  # 🔧 Reemplaza con tu URL real de backend
```

2. **Verificar que tienes todos los archivos:**
```
✅ app.yaml
✅ .gcloudignore  
✅ package.json (actualizado)
✅ deploy-build.bat
```

### **Paso 2: Build para Producción**

```bash
# Ejecutar el script de build
./deploy-build.bat

# O manualmente:
npm run build:production
```

### **Paso 3: Deploy a Google Cloud**

```bash
# Deploy completo (build + deploy)
npm run deploy:full

# O paso a paso:
npm run deploy:prepare  # Solo build
npm run deploy:gcloud   # Solo deploy
```

### **Paso 4: Verificar Deployment**

```bash
# Ver logs en tiempo real
npm run gcloud:logs

# Abrir la aplicación en el navegador
npm run gcloud:browse

# O manualmente:
gcloud app browse
```

---

## 🔍 **URLs de tu Aplicación**

Después del deployment, tendrás:

- **URL Principal**: `https://consulta-judicial-rpa.appspot.com`
- **URL con Versión**: `https://VERSION-dot-consulta-judicial-rpa.appspot.com`
- **Logs**: Console de Google Cloud o comando `gcloud app logs tail`

---

## 🛠️ **Comandos Útiles**

### **Gestión de Versiones**
```bash
# Listar versiones
gcloud app versions list

# Deploy a una versión específica
gcloud app deploy --version=v1

# Promover una versión a tráfico 100%
gcloud app versions migrate v1

# Eliminar versión antigua
gcloud app versions delete v1
```

### **Monitoreo**
```bash
# Ver logs de error
gcloud app logs read --level=error

# Ver logs recientes
gcloud app logs tail

# Estado de la aplicación
gcloud app describe
```

### **Scaling**
```bash
# Ver instancias activas
gcloud app instances list

# Configurar scaling (en app.yaml)
automatic_scaling:
  min_instances: 1
  max_instances: 5
```

---

## 🐛 **Troubleshooting**

### **Error: "No module named..."**
```bash
# Limpiar caché y reinstalar
rm -rf node_modules
rm package-lock.json
npm install
```

### **Error: "Build failed"**
```bash
# Verificar variables de entorno
echo $NODE_ENV
echo $VITE_API_URL

# Build en modo debug
npm run build -- --debug
```

### **Error: "Deploy failed"**
```bash
# Verificar que App Engine está habilitado
gcloud app describe

# Verificar permisos
gcloud auth list
gcloud auth application-default login
```

### **App no carga correctamente**
```bash
# Verificar logs
gcloud app logs tail

# Verificar que dist/ tiene archivos
ls -la dist/

# Verificar variables de entorno en Cloud Console
```

---

## 🚀 **Scripts Automatizados**

### **Deploy Rápido (Windows)**
```batch
@echo off
echo 🚀 Deploy rápido a Google Cloud...
call npm run build:production
if errorlevel 1 (
    echo ❌ Error en build
    pause
    exit /b 1
)
call gcloud app deploy --quiet
if errorlevel 1 (
    echo ❌ Error en deploy
    pause
    exit /b 1
)
echo ✅ Deploy exitoso!
call gcloud app browse
```

### **Rollback Rápido**
```bash
# Volver a versión anterior
gcloud app versions list
gcloud app versions migrate [VERSION-ANTERIOR]
```

---

## 💰 **Costos Estimados**

### **Free Tier (Siempre Gratis)**
- ✅ **28 horas instancia/día** (suficiente para demos)
- ✅ **1 GB tráfico saliente/día**
- ✅ **Shared CPU** con auto-sleep

### **Uso Típico para Demo**
- 🏷️ **$0-5/mes** para tráfico bajo-medio
- 🏷️ **Scaling automático** según demanda
- 🏷️ **Sin costo en standby** (con auto-sleep)

---

## 📊 **Optimizaciones de Performance**

### **Build Optimizado**
```json
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react'],
          utils: ['axios', '@tanstack/react-query']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### **Caché Headers**
```yaml
# app.yaml
handlers:
- url: /assets
  static_dir: dist/assets
  secure: always
  expiration: "7d"  # Caché por 7 días
```

---

## 🔐 **Configuración de Seguridad**

### **HTTPS Forzado**
```yaml
# app.yaml
handlers:
- url: /.*
  static_files: dist/index.html
  secure: always  # ✅ Fuerza HTTPS
```

### **Variables de Entorno Seguras**
```bash
# Usar Secret Manager para datos sensibles
gcloud secrets create api-key --data-file=api-key.txt
```

---

## 📈 **Monitoreo y Analytics**

1. **Google Cloud Console**: Metrics automáticos
2. **Error Reporting**: Errores de JavaScript automáticos  
3. **Logs**: Agregación automática de logs
4. **Uptime Monitoring**: Configurar health checks

---

¿Quieres que procedamos con el deployment? Solo necesitas:
1. Tener una cuenta de Google Cloud
2. Instalar gcloud CLI
3. Ejecutar los comandos que te indique