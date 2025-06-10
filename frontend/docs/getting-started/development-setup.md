# 🔧 Development Setup - LEXIA

<div align="center">
  
  **Setup completo de desarrollo en 5 minutos**
  
  *Todo lo que necesitas para contribuir a LEXIA*

</div>

---

## 🎯 **Antes de Empezar**

### **✅ Prerequisites Obligatorios**
- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **Python** 3.9+ ([Descargar](https://python.org/))
- **Git** ([Descargar](https://git-scm.com/))
- **Docker** & Docker Compose ([Descargar](https://docker.com/))

### **💻 Sistemas Operativos Soportados**
- ✅ Windows 10/11 (WSL2 recomendado)
- ✅ macOS 12+ (Intel & Apple Silicon)
- ✅ Linux (Ubuntu 20.04+, CentOS 8+)

### **🔧 Herramientas Recomendadas**
- **IDE**: VSCode con extensiones de React/Python
- **Terminal**: Windows Terminal, iTerm2, o similar
- **Database Client**: DBeaver, pgAdmin, o TablePlus

---

## 🚀 **Opción 1: Setup con Docker (Recomendado)**

### **📦 Setup Completo en 3 Comandos**

```bash
# 1. Clonar y navegar
git clone https://github.com/tu-org/lexia.git
cd lexia

# 2. Configurar environment
cp .env.example .env

# 3. Levantar todo el stack
docker-compose up -d
```

### **⚙️ Configurar Variables de Entorno**

Edita el archivo `.env`:

```bash
# Database
POSTGRES_DB=lexia_dev
POSTGRES_USER=lexia_user
POSTGRES_PASSWORD=lexia_pass_dev
DATABASE_URL=postgresql://lexia_user:lexia_pass_dev@localhost:5432/lexia_dev

# Redis
REDIS_URL=redis://localhost:6379

# API Configuration
API_SECRET_KEY=your_super_secret_key_for_development
ENVIRONMENT=development
DEBUG=true

# Frontend
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK_DATA=false
VITE_ENABLE_DEBUG=true

# External APIs (opcional para desarrollo)
OPENAI_API_KEY=sk-your_openai_key_here
CAPTCHA_API_KEY=your_captcha_key
```

### **✅ Verificar Instalación**

```bash
# Verificar que todos los servicios están corriendo
docker-compose ps

# Expected output:
# NAME                COMMAND             STATUS              PORTS
# lexia-frontend      npm run dev         Up                  3000->3000
# lexia-backend       uvicorn app...      Up                  8000->8000
# lexia-db           postgres            Up                  5432->5432
# lexia-redis        redis-server        Up                  6379->6379

# Test de conectividad
curl http://localhost:8000/health
# ✅ Expected: {"status": "healthy", "database": "connected"}

# Test frontend
curl http://localhost:3000
# ✅ Expected: HTML response
```

---

## 🛠️ **Opción 2: Setup Manual (Desarrollo Avanzado)**

### **🐍 Backend Setup**

```bash
# Navegar al backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Instalar dependencias de desarrollo
pip install -r requirements-dev.txt

# Configurar base de datos
# (Asegúrate de que PostgreSQL esté corriendo)
createdb lexia_dev

# Ejecutar migraciones
alembic upgrade head

# Poblar datos de desarrollo
python scripts/seed_dev_data.py

# Ejecutar servidor de desarrollo
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **⚛️ Frontend Setup**

```bash
# Nueva terminal, navegar al frontend
cd frontend

# Instalar dependencias
npm install

# Verificar que Node.js versión es correcta
node --version  # Should be 18+

# Ejecutar servidor de desarrollo
npm run dev

# El frontend estará disponible en http://localhost:3000
```

### **🗄️ Database Setup Manual**

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear usuario y database
CREATE USER lexia_user WITH PASSWORD 'lexia_pass_dev';
CREATE DATABASE lexia_dev OWNER lexia_user;
GRANT ALL PRIVILEGES ON DATABASE lexia_dev TO lexia_user;

# Salir de psql
\q

# Ejecutar migraciones desde backend/
cd backend
alembic upgrade head

# Poblar datos de prueba
python scripts/seed_dev_data.py
```

---

## 🧪 **Verificación Completa del Setup**

### **📋 Checklist de Verificación**

#### **✅ Backend Funcionando**
```bash
# Test de health endpoint
curl http://localhost:8000/health
# Expected: {"status": "healthy", "database": "connected", "redis": "connected"}

# Test de API docs
open http://localhost:8000/docs  # macOS
# start http://localhost:8000/docs  # Windows

# Test de autenticación
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@lexia.co", "password": "admin123"}'
# Expected: Token JWT response
```

#### **✅ Frontend Funcionando**
```bash
# Verificar que la app carga
open http://localhost:3000  # macOS
# start http://localhost:3000  # Windows

# En DevTools Console (F12), verificar:
console.log(window.VITE_API_URL);  // Should show: http://localhost:8000
```

#### **✅ Database Funcionando**
```bash
# Conectar y verificar tablas
psql -U lexia_user -d lexia_dev -h localhost

# Verificar tablas creadas
\dt
# Expected: Lista de tablas (users, solicitudes, etc.)

# Verificar datos de prueba
SELECT COUNT(*) FROM users;
# Expected: > 0 usuarios
```

#### **✅ Integration Test**
1. 🌐 **Abrir** http://localhost:3000
2. 📧 **Login** con email: `admin@lexia.co`, password: `admin123`
3. 🔍 **Crear** una nueva consulta con radicado de prueba
4. ✅ **Verificar** que la consulta se procesa correctamente

---

## 🎨 **Configuración de IDE (VSCode)**

### **📦 Extensiones Recomendadas**

Crea `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-python.python",
    "ms-python.flake8",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml"
  ]
}
```

### **⚙️ Configuración de Workspace**

Crea `.vscode/settings.json`:

```json
{
  "python.defaultInterpreterPath": "./backend/venv/bin/python",
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "typescript": "typescript",
    "javascriptreact": "javascriptreact",
    "typescriptreact": "typescriptreact"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### **🚀 Launch Configuration**

Crea `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/backend/venv/bin/uvicorn",
      "args": ["app.main:app", "--reload"],
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}/backend"
    },
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/frontend/src"
    }
  ]
}
```

---

## 🧪 **Configuración de Testing**

### **🔬 Backend Testing**

```bash
cd backend

# Instalar dependencias de testing (si no están)
pip install pytest pytest-asyncio pytest-cov

# Ejecutar tests
pytest

# Con coverage
pytest --cov=app --cov-report=html

# Solo tests rápidos
pytest -m "not slow"

# Ver reporte de coverage
open htmlcov/index.html
```

### **⚛️ Frontend Testing**

```bash
cd frontend

# Instalar dependencias de testing (si no están)
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Ejecutar tests
npm run test

# En modo watch
npm run test:watch

# Con coverage
npm run test:coverage

# E2E tests (requiere app corriendo)
npm run test:e2e
```

---

## 🎯 **Workflows de Desarrollo**

### **🔄 Flujo Diario Recomendado**

```bash
# 1. Actualizar código
git pull origin main

# 2. Instalar nuevas dependencias (si las hay)
cd backend && pip install -r requirements.txt
cd frontend && npm install

# 3. Ejecutar migraciones (si las hay)
cd backend && alembic upgrade head

# 4. Levantar servicios
docker-compose up -d
# O manualmente si prefieres:
# Backend: uvicorn app.main:app --reload
# Frontend: npm run dev

# 5. Verificar que todo funciona
npm run test  # Frontend tests
pytest        # Backend tests
```

### **🌟 Crear Nueva Feature**

```bash
# 1. Crear branch desde main
git checkout main
git pull origin main
git checkout -b feature/nombre-descriptivo

# 2. Desarrollar feature siguiendo:
# - [Style Guide](../development/style-guide.md)
# - [Component Patterns](../development/component-patterns.md)
# - [API Conventions](../development/api-conventions.md)

# 3. Testing
npm run test           # Frontend
pytest                 # Backend
npm run test:e2e       # E2E

# 4. Commit y push
git add .
git commit -m "feat: descripción clara de la feature"
git push origin feature/nombre-descriptivo

# 5. Crear Pull Request
# Ir a GitHub y crear PR siguiendo template
```

---

## 🚨 **Troubleshooting Común**

### **🐛 Problemas Frecuentes**

#### **❌ "Port already in use"**
```bash
# Verificar qué proceso usa el puerto
lsof -i :3000  # Frontend
lsof -i :8000  # Backend

# Matar proceso
kill -9 <PID>

# O usar puertos diferentes
npm run dev -- --port 3001
uvicorn app.main:app --reload --port 8001
```

#### **❌ "Database connection failed"**
```bash
# Verificar que PostgreSQL está corriendo
brew services start postgresql  # macOS
sudo service postgresql start   # Linux
net start postgresql-x64-13    # Windows

# Verificar configuración
psql -U lexia_user -d lexia_dev -h localhost
```

#### **❌ "Module not found"**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### **❌ "Permission denied" en Docker**
```bash
# En Linux, agregar usuario a grupo docker
sudo usermod -aG docker $USER
# Luego logout/login

# O usar sudo temporalmente
sudo docker-compose up -d
```

### **🔍 Debug Avanzado**

```bash
# Logs de desarrollo
docker-compose logs -f backend
docker-compose logs -f frontend

# Database queries (en desarrollo)
# Agregar en backend/app/database.py:
# engine = create_engine(DATABASE_URL, echo=True)

# Frontend debug
# En .env: VITE_ENABLE_DEBUG=true
# En DevTools: localStorage.debug = '*'
```

---

## 🆘 **¿Necesitas Ayuda?**

### **🚀 Canales de Soporte**
- **💬 Discord**: #development-help
- **📧 Email**: dev-help@lexia.co
- **📞 Urgente**: +57 (1) 234-5678
- **🎥 Screen share**: [Calendly](https://calendly.com/lexia-dev-help)

### **📚 Recursos Adicionales**
- [🎨 Design System](../design-system/overview.md)
- [🏗️ Architecture](../architecture/overview.md)
- [🧪 Testing Guide](../testing/strategy.md)
- [🔧 Development Guidelines](../development/overview.md)

---

<div align="center">

**🎉 ¡Setup Completado!**

[![Next: Primera Contribución](https://img.shields.io/badge/→_Siguiente-Primera_Contribución-green?style=for-the-badge)](./first-contribution.md)

---

<sub>📝 **¿Problemas con esta guía?** [Reportar Issue](https://github.com/lexia/lexia/issues/new?template=docs-issue)</sub><br/>
<sub>⭐ **¿Te ayudó?** ¡Comparte con tu equipo!</sub>

</div>