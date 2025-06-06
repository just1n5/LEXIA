# 🚀 ConsultaJudicial RPA - Google Cloud Deployment

## ⚡ **Deploy Rápido (TL;DR)**

```bash
# 1. Instalar Google Cloud CLI
# 2. Configurar proyecto
gcloud init
gcloud app create --region=us-central1

# 3. Actualizar app.yaml con tu backend URL
# 4. Deploy
npm run deploy:full
```

---

## 📋 **Archivos Creados para Deploy**

```
✅ app.yaml                    # Configuración de App Engine
✅ .gcloudignore              # Archivos a ignorar en deploy
✅ deploy-build.bat           # Script de build optimizado
✅ test-deploy-readiness.bat  # Test pre-deploy
✅ vite.config.production.js  # Configuración optimizada
✅ .env.gcloud.example        # Variables de entorno ejemplo
✅ DEPLOY_GUIDE.md            # Guía completa
```

---

## 🛠️ **Setup Inicial (Una vez)**

### 1. **Instalar Google Cloud CLI**
- **Windows**: [Descargar instalador](https://cloud.google.com/sdk/docs/install)
- **Verificar**: `gcloud version`

### 2. **Configurar Google Cloud**
```bash
# Autenticarse
gcloud auth login

# Crear/seleccionar proyecto
gcloud projects create consulta-judicial-rpa
gcloud config set project consulta-judicial-rpa

# Inicializar App Engine
gcloud app create --region=us-central1
```

### 3. **Configurar Backend URL**
Editar `app.yaml` línea 6:
```yaml
env_variables:
  VITE_API_URL: "https://TU-BACKEND-URL.appspot.com"  # ← Cambiar aquí
```

---

## 🚀 **Deploy Process**

### **Opción A: Deploy Automático**
```bash
# Test + Build + Deploy en un comando
npm run deploy:full
```

### **Opción B: Paso a Paso**
```bash
# 1. Test previo (opcional pero recomendado)
./test-deploy-readiness.bat

# 2. Build para producción
npm run build:gcloud

# 3. Deploy a Google Cloud
npm run deploy:gcloud
```

### **Opción C: Manual**
```bash
npm run build:production
gcloud app deploy --quiet
```

---

## 🔍 **Post-Deploy**

```bash
# Abrir aplicación
gcloud app browse

# Ver logs
gcloud app logs tail

# URLs de tu app:
# https://consulta-judicial-rpa.appspot.com
```

---

## 🐛 **Troubleshooting**

| Problema | Solución |
|----------|----------|
| `gcloud: command not found` | Instalar Google Cloud CLI |
| `ERROR: No project set` | `gcloud config set project PROYECTO` |
| `Build failed` | Ejecutar `test-deploy-readiness.bat` |
| `Deploy failed` | Verificar `gcloud auth list` |
| `App no carga` | Verificar URL backend en `app.yaml` |

---

## 💰 **Costos**

- **Free Tier**: 28 horas/día gratis (suficiente para demos)
- **Producción**: ~$5-20/mes dependiendo del tráfico
- **Auto-scaling**: Solo pagas por uso real

---

## 📊 **Métricas**

Después del deploy, monitorear en:
- **Google Cloud Console** → App Engine → Dashboard
- **Logs**: `gcloud app logs tail`
- **Performance**: Cloud Console → Monitoring

---

## 🔄 **Updates**

```bash
# Deploy nueva versión
npm run deploy:full

# Rollback si hay problemas
gcloud app versions list
gcloud app versions migrate VERSION_ANTERIOR
```

---

## 📚 **Documentación Completa**

- **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)**: Guía detallada paso a paso
- **[app.yaml](./app.yaml)**: Configuración de App Engine
- **Google Cloud Docs**: [App Engine Documentation](https://cloud.google.com/appengine/docs)

---

**🎯 ¿Listo para empezar?** Ejecuta: `./test-deploy-readiness.bat`