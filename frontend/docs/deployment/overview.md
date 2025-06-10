# 🚢 Deployment Overview - LEXIA Infrastructure & DevOps

## 🎯 **Visión General**

Este documento cubre las estrategias de deployment para LEXIA, desde desarrollo local hasta producción en la nube. Incluye Docker, Google Cloud Platform, monitoreo, y mejores prácticas de DevOps para mantener la aplicación ejecutándose de manera confiable y escalable.

## 🏗️ **Arquitectura de Deployment**

### **Stack de Infraestructura**
```mermaid
graph TB
    subgraph "Production (GCP)"
        A[Cloud Load Balancer]
        B[App Engine Frontend]
        C[Cloud Run Backend]
        D[Cloud SQL PostgreSQL]
        E[Cloud Tasks/Pub-Sub]
        F[Cloud Storage]
    end
    
    subgraph "Development (Docker)"
        G[Nginx Proxy]
        H[React Frontend]
        I[FastAPI Backend]
        J[PostgreSQL]
        K[RabbitMQ]
        L[Redis]
        M[RPA Workers]
    end
    
    A --> B
    A --> C
    C --> D
    C --> E
    B --> F
    
    G --> H
    G --> I
    I --> J
    I --> K
    I --> L
    K --> M
```

### **Environments Matrix**
| Environment | Frontend | Backend | Database | Queue | Monitoring |
|-------------|----------|---------|----------|-------|------------|
| **Development** | Vite Dev Server | FastAPI + Uvicorn | PostgreSQL (Docker) | RabbitMQ + Redis | Console Logs |
| **Staging** | App Engine | Cloud Run | Cloud SQL | Cloud Tasks | Cloud Logging |
| **Production** | App Engine | Cloud Run | Cloud SQL | Cloud Tasks | Cloud Monitoring |

---

## 🐳 **Docker Development Setup**

### **📁 Docker Compose Architecture**

#### **Complete Stack:**
```yaml
# docker-compose.yml
services:
  # Database Layer
  postgres:
    image: postgres:15
    container_name: rpa_postgres
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-consulta_judicial}
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-password}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - rpa_network

  # Message Queue
  rabbitmq:
    image: rabbitmq:3-management
    container_name: rpa_rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER:-admin}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASS:-password}
    ports:
      - "5672:5672"      # AMQP
      - "15672:15672"    # Management UI
    networks:
      - rpa_network

  # Cache Layer
  redis:
    image: redis:7
    container_name: rpa_redis
    ports:
      - "6379:6379"
    networks:
      - rpa_network

  # Backend API
  backend:
    build: ./backend
    container_name: rpa_backend
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-password}@postgres:5432/${POSTGRES_DB:-consulta_judicial}
      - RABBITMQ_URL=amqp://${RABBITMQ_USER:-admin}:${RABBITMQ_PASS:-password}@rabbitmq:5672/
      - REDIS_URL=redis://redis:6379/0
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - rabbitmq
      - redis
    networks:
      - rpa_network
    volumes:
      - ./backend:/app

  # RPA Workers
  rpa-worker:
    build: ./rpa-bots
    container_name: rpa_worker
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-password}@postgres:5432/${POSTGRES_DB:-consulta_judicial}
      - RABBITMQ_URL=amqp://${RABBITMQ_USER:-admin}:${RABBITMQ_PASS:-password}@rabbitmq:5672/
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - rabbitmq
      - redis
    networks:
      - rpa_network
    volumes:
      - ./rpa-bots:/app
      - ./rpa-bots/logs:/app/logs

  # Frontend Development
  frontend:
    build: ./frontend
    container_name: rpa_frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:8000
    depends_on:
      - backend
    networks:
      - rpa_network
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:

networks:
  rpa_network:
    driver: bridge
```

#### **Quick Start Commands:**
```bash
# 🚀 Iniciar stack completo
docker-compose up -d

# 📊 Ver logs en tiempo real
docker-compose logs -f

# 🔍 Ver logs de servicio específico
docker-compose logs -f backend

# 🛑 Detener todos los servicios
docker-compose down

# 🧹 Limpiar volúmenes (CUIDADO: borra datos)
docker-compose down -v

# 🔄 Rebuild y restart
docker-compose up --build -d
```

### **🛠️ Environment Configuration**

#### **.env File Structure:**
```bash
# .env
# =============================================================================
# LEXIA Development Environment Configuration
# =============================================================================

# 🗄️ Database Configuration
POSTGRES_DB=consulta_judicial
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_password_123
DATABASE_URL=postgresql://postgres:secure_password_123@localhost:5432/consulta_judicial

# 🔐 Security
SECRET_KEY=your-256-bit-secret-key-here
JWT_SECRET_KEY=another-secret-key-for-jwt
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 📡 Message Queue
RABBITMQ_USER=admin
RABBITMQ_PASS=admin_password_123
RABBITMQ_URL=amqp://admin:admin_password_123@localhost:5672/

# 🚀 Redis Cache
REDIS_URL=redis://localhost:6379/0

# 🌐 API Configuration
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK=false
VITE_APP_NAME=ConsultaJudicial
VITE_APP_VERSION=1.0.0

# 📧 Email Configuration (Optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@consultajudicial.com

# 🔧 Development Settings
DEBUG=true
LOG_LEVEL=INFO
ENVIRONMENT=development

# 🤖 RPA Configuration
RAMA_JUDICIAL_URL=https://consultaprocesos.ramajudicial.gov.co/Procesos/NumeroRadicacion
HEADLESS_BROWSER=true
SELENIUM_TIMEOUT=30
```

#### **Environment Templates:**
```bash
# .env.example - Template para desarrollo
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK=true
VITE_APP_NAME=ConsultaJudicial
VITE_APP_VERSION=1.0.0

# .env.staging - Template para staging
VITE_API_URL=https://staging-api.consultajudicial.com
VITE_USE_MOCK=false
VITE_ENVIRONMENT=staging

# .env.production - Template para producción
VITE_API_URL=https://api.consultajudicial.com
VITE_USE_MOCK=false
VITE_ENVIRONMENT=production
VITE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### **🔧 Development Tools**

#### **Health Check Script:**
```bash
#!/bin/bash
# scripts/health-check.sh

echo "🏥 Verificando salud de servicios..."

# Backend API
echo "🔍 Verificando Backend API..."
curl -f http://localhost:8000/health && echo "✅ Backend OK" || echo "❌ Backend FAIL"

# Frontend
echo "🔍 Verificando Frontend..."
curl -f http://localhost:3000 && echo "✅ Frontend OK" || echo "❌ Frontend FAIL"

# PostgreSQL
echo "🔍 Verificando PostgreSQL..."
docker exec rpa_postgres pg_isready -U postgres && echo "✅ PostgreSQL OK" || echo "❌ PostgreSQL FAIL"

# RabbitMQ
echo "🔍 Verificando RabbitMQ..."
curl -f http://localhost:15672 && echo "✅ RabbitMQ OK" || echo "❌ RabbitMQ FAIL"

# Redis
echo "🔍 Verificando Redis..."
docker exec rpa_redis redis-cli ping && echo "✅ Redis OK" || echo "❌ Redis FAIL"

echo "🎉 Verificación completada!"
```

---

## ☁️ **Google Cloud Platform Deployment**

### **🎯 GCP Services Architecture**

#### **Frontend: App Engine**
```yaml
# app.yaml - Google App Engine Configuration
runtime: python39

# Static file serving for React SPA
handlers:
  # Static assets (CSS, JS, images)
  - url: /assets/(.*)
    static_files: dist/assets/\1
    upload: dist/assets/(.*)
    secure: always
    expiration: "7d"

  # Root files (favicon, manifest, etc.)
  - url: /(.*\.(ico|png|txt|xml|svg))$
    static_files: dist/\1
    upload: dist/(.*\.(ico|png|txt|xml|svg))$
    secure: always

  # SPA routing - serve index.html for all other routes
  - url: /.*
    static_files: dist/index.html
    upload: dist/index.html
    secure: always

# Auto-scaling configuration
automatic_scaling:
  min_instances: 0              # Auto-sleep when no traffic
  max_instances: 3              # Scale up to 3 instances
  target_cpu_utilization: 0.8
  target_throughput_utilization: 0.9

# Environment variables
env_variables:
  VITE_API_URL: "https://your-backend-url.run.app"
  VITE_ENVIRONMENT: "production"
```

#### **Backend: Cloud Run**
```yaml
# backend/cloudbuild.yaml
steps:
  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/lexia-backend:$SHORT_SHA'
      - './backend'

  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'gcr.io/$PROJECT_ID/lexia-backend:$SHORT_SHA'

  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'lexia-backend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/lexia-backend:$SHORT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--memory'
      - '2Gi'
      - '--cpu'
      - '2'
      - '--max-instances'
      - '10'
      - '--set-env-vars'
      - 'DATABASE_URL=$$DATABASE_URL,REDIS_URL=$$REDIS_URL'

substitutions:
  _SERVICE_NAME: lexia-backend

options:
  machineType: 'E2_HIGHCPU_8'
```

### **🚀 Deployment Scripts**

#### **Frontend Build & Deploy:**
```bash
#!/bin/bash
# scripts/deployment/deploy-frontend.sh

echo "🚀 Deploying Frontend to Google App Engine..."

# Environment setup
export NODE_ENV=production
export VITE_USE_MOCK_DATA=false
export VITE_API_URL="https://lexia-backend-xyz.run.app"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.vite/

# Install production dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build optimized bundle
echo "⚡ Building optimized bundle..."
npm run build:production

# Verify build success
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Build successful!"
    
    # Show bundle stats
    echo "📊 Bundle statistics:"
    du -sh dist/
    ls -lah dist/assets/ | head -10
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to App Engine
echo "☁️ Deploying to Google App Engine..."
gcloud app deploy app.yaml --quiet --promote

if [ $? -eq 0 ]; then
    echo "🎉 Frontend deployed successfully!"
    echo "🌐 URL: https://your-project-id.appspot.com"
else
    echo "❌ Deployment failed!"
    exit 1
fi
```

#### **Backend Deploy Script:**
```bash
#!/bin/bash
# scripts/deployment/deploy-backend.sh

echo "🚀 Deploying Backend to Cloud Run..."

PROJECT_ID="your-gcp-project-id"
SERVICE_NAME="lexia-backend"
REGION="us-central1"

# Build and push Docker image
echo "🐳 Building Docker image..."
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest ./backend

echo "📤 Pushing to Container Registry..."
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

# Deploy to Cloud Run
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --set-env-vars "DATABASE_URL=$DATABASE_URL,REDIS_URL=$REDIS_URL"

if [ $? -eq 0 ]; then
    echo "🎉 Backend deployed successfully!"
    # Get service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
    echo "🌐 Service URL: $SERVICE_URL"
else
    echo "❌ Deployment failed!"
    exit 1
fi
```

### **🗄️ Database Migration Strategy**

#### **Cloud SQL Setup:**
```bash
# scripts/deployment/setup-cloudsql.sh

echo "🗄️ Setting up Cloud SQL..."

# Create Cloud SQL instance
gcloud sql instances create lexia-postgres \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=02

# Create database
gcloud sql databases create consulta_judicial --instance=lexia-postgres

# Create user
gcloud sql users create lexia-user \
  --instance=lexia-postgres \
  --password=secure_production_password

echo "✅ Cloud SQL setup complete!"
```

#### **Migration Script:**
```bash
#!/bin/bash
# scripts/database/migrate-production.sh

echo "🔄 Running database migrations..."

# Connect to Cloud SQL via proxy
echo "🔌 Starting Cloud SQL Proxy..."
cloud_sql_proxy -instances=your-project:us-central1:lexia-postgres=tcp:5432 &
PROXY_PID=$!

# Wait for connection
sleep 5

# Run migrations
echo "📋 Executing migrations..."
cd backend
python -m alembic upgrade head

# Stop proxy
kill $PROXY_PID

echo "✅ Migrations completed!"
```

---

## 🔄 **CI/CD Pipeline**

### **🤖 GitHub Actions Workflow**

#### **Complete CI/CD Pipeline:**
```yaml
# .github/workflows/deploy.yml
name: 🚀 Deploy to GCP

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

env:
  GCP_PROJECT: ${{ secrets.GCP_PROJECT }}
  GCP_SA_KEY: ${{ secrets.GCP_SA_KEY }}

jobs:
  test:
    name: 🧪 Run Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🏗️ Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm ci

      - name: 🧪 Run frontend tests
        run: npm run test:coverage

      - name: 🐍 Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: 🧪 Run backend tests
        run: |
          cd backend
          pip install -r requirements-dev.txt
          pytest --cov=app --cov-report=xml

      - name: 📊 Upload coverage
        uses: codecov/codecov-action@v3

  build-frontend:
    name: 🎨 Build Frontend
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🏗️ Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm ci --only=production

      - name: ⚡ Build frontend
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL_PROD }}
          VITE_ENVIRONMENT: production
        run: npm run build:production

      - name: 📤 Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: frontend-dist
          path: dist/

  deploy-backend:
    name: 🚀 Deploy Backend
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔐 Setup GCP Auth
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: 🛠️ Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v1

      - name: 🐳 Configure Docker
        run: gcloud auth configure-docker

      - name: 🏗️ Build and push Docker image
        run: |
          docker build -t gcr.io/$GCP_PROJECT/lexia-backend:$GITHUB_SHA ./backend
          docker push gcr.io/$GCP_PROJECT/lexia-backend:$GITHUB_SHA

      - name: 🚀 Deploy to Cloud Run
        run: |
          gcloud run deploy lexia-backend \
            --image gcr.io/$GCP_PROJECT/lexia-backend:$GITHUB_SHA \
            --region us-central1 \
            --platform managed \
            --allow-unauthenticated \
            --memory 2Gi \
            --cpu 2 \
            --max-instances 10 \
            --set-env-vars DATABASE_URL=${{ secrets.DATABASE_URL }},REDIS_URL=${{ secrets.REDIS_URL }}

  deploy-frontend:
    name: 🎨 Deploy Frontend
    runs-on: ubuntu-latest
    needs: [test, build-frontend]
    if: github.ref == 'refs/heads/main'

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 📤 Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: frontend-dist
          path: dist/

      - name: 🔐 Setup GCP Auth
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: 🛠️ Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v1

      - name: 🚀 Deploy to App Engine
        run: gcloud app deploy app.yaml --quiet --promote

  notify:
    name: 📢 Notify Deployment
    runs-on: ubuntu-latest
    needs: [deploy-backend, deploy-frontend]
    if: always()

    steps:
      - name: 📧 Send Slack notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: |
            🚀 Deployment to production completed!
            📊 Status: ${{ job.status }}
            🌐 Frontend: https://${{ env.GCP_PROJECT }}.appspot.com
            🔗 Backend: https://lexia-backend-xyz.run.app
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### **🔍 Quality Gates**

#### **Pre-deployment Checks:**
```yaml
# .github/workflows/quality-gates.yml
name: 🔍 Quality Gates

on: [push, pull_request]

jobs:
  code-quality:
    name: 📊 Code Quality
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🏗️ Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: 📦 Install dependencies
        run: npm ci

      # ESLint
      - name: 🔍 Run ESLint
        run: npm run lint

      # Prettier
      - name: 💅 Check Prettier
        run: npm run format:check

      # Type checking
      - name: 🔧 Type check
        run: npm run type-check

      # Bundle size analysis
      - name: 📦 Analyze bundle
        run: |
          npm run build:analyze
          npx bundlesize

      # Security audit
      - name: 🔒 Security audit
        run: npm audit --audit-level high

  performance:
    name: ⚡ Performance Tests
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🏗️ Build application
        run: |
          npm ci
          npm run build:production

      - name: 🔍 Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true
```

---

## 📊 **Monitoring & Observability**

### **🔍 Health Checks**

#### **Application Health Endpoints:**
```python
# backend/app/routers/health.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
import redis
import asyncio
from datetime import datetime

router = APIRouter()

@router.get("/health")
async def health_check():
    """Basic health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

@router.get("/health/detailed")
async def detailed_health_check(db: Session = Depends(get_db)):
    """Detailed health check with dependencies"""
    checks = {
        "api": "healthy",
        "database": "unknown",
        "redis": "unknown",
        "rabbitmq": "unknown"
    }
    
    # Database check
    try:
        db.execute("SELECT 1")
        checks["database"] = "healthy"
    except Exception as e:
        checks["database"] = f"unhealthy: {str(e)}"
    
    # Redis check
    try:
        r = redis.Redis.from_url(REDIS_URL)
        r.ping()
        checks["redis"] = "healthy"
    except Exception as e:
        checks["redis"] = f"unhealthy: {str(e)}"
    
    # Overall status
    overall_status = "healthy" if all(
        status == "healthy" for status in checks.values()
    ) else "degraded"
    
    return {
        "status": overall_status,
        "checks": checks,
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/health/readiness")
async def readiness_check(db: Session = Depends(get_db)):
    """Kubernetes readiness probe"""
    try:
        # Check database connection
        db.execute("SELECT 1")
        return {"status": "ready"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Not ready: {str(e)}")

@router.get("/health/liveness")
async def liveness_check():
    """Kubernetes liveness probe"""
    return {"status": "alive"}
```

### **📈 Monitoring Configuration**

#### **Cloud Monitoring Setup:**
```yaml
# monitoring/alerting.yaml
displayName: "LEXIA Application Monitoring"

conditions:
  - displayName: "High Error Rate"
    conditionThreshold:
      filter: 'resource.type="cloud_run_revision" AND resource.label.service_name="lexia-backend"'
      comparison: COMPARISON_GREATER_THAN
      thresholdValue: 0.05
      duration: "300s"
    
  - displayName: "High Response Latency"
    conditionThreshold:
      filter: 'resource.type="cloud_run_revision" AND metric.type="run.googleapis.com/request_latencies"'
      comparison: COMPARISON_GREATER_THAN
      thresholdValue: 2000
      duration: "180s"

  - displayName: "Low Memory Available"
    conditionThreshold:
      filter: 'resource.type="cloud_run_revision" AND metric.type="run.googleapis.com/container/memory/utilizations"'
      comparison: COMPARISON_GREATER_THAN
      thresholdValue: 0.9
      duration: "120s"

notificationChannels:
  - "projects/your-project/notificationChannels/slack-alerts"
  - "projects/your-project/notificationChannels/email-alerts"
```

#### **Custom Metrics Collection:**
```javascript
// src/utils/monitoring.js
class ApplicationMonitoring {
  constructor() {
    this.isProduction = import.meta.env.PROD
    this.startTime = Date.now()
  }

  // User interaction tracking
  trackUserAction(action, metadata = {}) {
    if (!this.isProduction) return

    // Send to Google Analytics
    gtag('event', action, {
      event_category: 'user_interaction',
      event_label: action,
      custom_parameter_1: metadata.component,
      custom_parameter_2: metadata.feature
    })

    // Send to Cloud Monitoring
    this.sendCustomMetric('user_actions_total', 1, {
      action,
      component: metadata.component || 'unknown'
    })
  }

  // Performance monitoring
  trackPageLoad(route, loadTime) {
    if (!this.isProduction) return

    this.sendCustomMetric('page_load_duration', loadTime, {
      route,
      browser: navigator.userAgent.split(' ')[0]
    })
  }

  // Error tracking
  trackError(error, context = {}) {
    console.error('Application Error:', error, context)

    if (!this.isProduction) return

    // Send to error tracking service
    this.sendErrorToMonitoring({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }

  // Custom metrics
  sendCustomMetric(metricName, value, labels = {}) {
    if (!this.isProduction) return

    // Implementation depends on monitoring service
    // Example for Google Cloud Monitoring
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: metricName,
        value,
        labels,
        timestamp: Date.now()
      })
    }).catch(err => console.error('Failed to send metric:', err))
  }

  // Application vitals
  reportVitals() {
    // Web Vitals tracking
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(this.sendVital.bind(this))
      getFID(this.sendVital.bind(this))
      getFCP(this.sendVital.bind(this))
      getLCP(this.sendVital.bind(this))
      getTTFB(this.sendVital.bind(this))
    })
  }

  sendVital(vital) {
    this.sendCustomMetric(`web_vital_${vital.name}`, vital.value, {
      rating: vital.rating,
      route: window.location.pathname
    })
  }
}

// Global instance
export const monitoring = new ApplicationMonitoring()

// Auto-start monitoring
if (typeof window !== 'undefined') {
  monitoring.reportVitals()
}
```

### **📊 Logging Strategy**

#### **Structured Logging:**
```python
# backend/app/utils/logging.py
import logging
import json
import sys
from datetime import datetime
from typing import Dict, Any

class StructuredLogger:
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        
        # Console handler for Cloud Logging
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(self.JSONFormatter())
        self.logger.addHandler(handler)
    
    class JSONFormatter(logging.Formatter):
        def format(self, record):
            log_entry = {
                "timestamp": datetime.utcnow().isoformat(),
                "level": record.levelname,
                "logger": record.name,
                "message": record.getMessage(),
                "module": record.module,
                "function": record.funcName,
                "line": record.lineno
            }
            
            # Add exception info if present
            if record.exc_info:
                log_entry["exception"] = self.formatException(record.exc_info)
            
            # Add extra fields
            if hasattr(record, 'extra'):
                log_entry.update(record.extra)
            
            return json.dumps(log_entry)
    
    def info(self, message: str, **kwargs):
        self.logger.info(message, extra=kwargs)
    
    def error(self, message: str, **kwargs):
        self.logger.error(message, extra=kwargs)
    
    def warning(self, message: str, **kwargs):
        self.logger.warning(message, extra=kwargs)

# Usage example
logger = StructuredLogger("lexia.api")

# In API endpoints
@router.post("/solicitudes")
async def create_solicitud(solicitud_data: SolicitudCreate):
    logger.info(
        "Creating new solicitud",
        user_id=current_user.id,
        solicitud_type=solicitud_data.tipo_busqueda,
        timestamp=datetime.utcnow().isoformat()
    )
```

---

## 🔐 **Security & Configuration**

### **🛡️ Production Security**

#### **Environment Secrets Management:**
```bash
# Using Google Secret Manager

# Store secrets
gcloud secrets create database-url --data-file=database_url.txt
gcloud secrets create jwt-secret-key --data-file=jwt_secret.txt
gcloud secrets create smtp-password --data-file=smtp_password.txt

# Grant access to Cloud Run service
gcloud secrets add-iam-policy-binding database-url \
  --member="serviceAccount:lexia-backend@your-project.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

#### **Cloud Run Security Configuration:**
```yaml
# backend/deploy/cloud-run-config.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: lexia-backend
  annotations:
    run.googleapis.com/ingress: all
    run.googleapis.com/execution-environment: gen2
spec:
  template:
    metadata:
      annotations:
        # Security configurations
        run.googleapis.com/vpc-access-connector: projects/your-project/locations/us-central1/connectors/default-connector
        run.googleapis.com/vpc-access-egress: private-ranges-only
        
        # Performance configurations
        run.googleapis.com/cpu-throttling: "true"
        run.googleapis.com/memory: "2Gi"
        run.googleapis.com/cpu: "2"
        run.googleapis.com/max-instances: "10"
        run.googleapis.com/min-instances: "1"
    spec:
      serviceAccountName: lexia-backend@your-project.iam.gserviceaccount.com
      containers:
      - image: gcr.io/your-project/lexia-backend:latest
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-url
              key: latest
        - name: JWT_SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: jwt-secret-key
              key: latest
        resources:
          limits:
            memory: "2Gi"
            cpu: "2"
        ports:
        - containerPort: 8000
```

### **🔧 Configuration Management**

#### **Multi-Environment Configuration:**
```python
# backend/app/core/config.py
from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Environment detection
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    
    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 0
    
    # Security
    SECRET_KEY: str
    JWT_SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # External services
    REDIS_URL: str
    RABBITMQ_URL: str
    
    # Email configuration
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAIL_FROM: str = "noreply@consultajudicial.com"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # RPA settings
    RAMA_JUDICIAL_URL: str = "https://consultaprocesos.ramajudicial.gov.co"
    SELENIUM_TIMEOUT: int = 30
    HEADLESS_BROWSER: bool = True
    
    # Cloud specific settings
    GCP_PROJECT_ID: Optional[str] = None
    GCP_LOCATION: str = "us-central1"
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    ENABLE_METRICS: bool = True
    
    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"
    
    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Environment-specific configurations
class DevelopmentSettings(Settings):
    DEBUG: bool = True
    LOG_LEVEL: str = "DEBUG"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

class ProductionSettings(Settings):
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 0
    HEADLESS_BROWSER: bool = True

class StagingSettings(Settings):
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    ALLOWED_ORIGINS: List[str] = ["https://staging.consultajudicial.com"]

def get_settings() -> Settings:
    environment = os.getenv("ENVIRONMENT", "development")
    
    if environment == "production":
        return ProductionSettings()
    elif environment == "staging":
        return StagingSettings()
    else:
        return DevelopmentSettings()

settings = get_settings()
```

---

## 📊 **Performance & Optimization**

### **⚡ Frontend Optimizations**

#### **Build Optimization Configuration:**
```javascript
// vite.config.production.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { splitVendorChunkPlugin } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true
    })
  ],
  build: {
    // Production optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    // Chunk splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['lucide-react'],
          
          // Feature chunks
          'dashboard': [
            'src/pages/Dashboard.jsx',
            'src/components/dashboard/index.js'
          ],
          'solicitudes': [
            'src/pages/Solicitudes.jsx',
            'src/components/solicitudes/index.js'
          ],
          'historial': [
            'src/pages/Historial.jsx',
            'src/components/historial/index.js'
          ]
        }
      }
    },
    
    // Asset optimization
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 500,
    
    // Source maps for production debugging
    sourcemap: true
  },
  
  // Define replacements for production
  define: {
    __DEV__: false,
    __VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})
```

#### **PWA Configuration:**
```javascript
// vite-pwa.config.js
import { VitePWA } from 'vite-plugin-pwa'

export const pwaConfig = VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
  manifest: {
    name: 'LEXIA - Consulta Judicial',
    short_name: 'LEXIA',
    description: 'Automatización inteligente para consultas judiciales',
    theme_color: '#FACC15',
    background_color: '#FFFFFF',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\.consultajudicial\.com\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 // 24 hours
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  }
})
```

### **🚀 Backend Optimizations**

#### **Database Connection Pooling:**
```python
# backend/app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from app.core.config import settings

# Optimized engine configuration for production
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_pre_ping=True,  # Validate connections before use
    pool_recycle=3600,   # Recycle connections every hour
    echo=settings.DEBUG  # SQL logging in development only
)
```

#### **Async Background Tasks:**
```python
# backend/app/utils/background_tasks.py
from celery import Celery
from app.core.config import settings

# Celery configuration
celery_app = Celery(
    "lexia",
    broker=settings.RABBITMQ_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.rpa_tasks", "app.tasks.email_tasks"]
)

# Optimized settings
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    
    # Performance settings
    task_compression="gzip",
    result_compression="gzip",
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    
    # Retry settings
    task_default_retry_delay=60,
    task_max_retries=3,
    
    # Queue routing
    task_routes={
        "app.tasks.rpa_tasks.execute_consulta": {"queue": "rpa"},
        "app.tasks.email_tasks.send_email": {"queue": "email"},
    }
)
```

---

## 🎯 **Troubleshooting Guide**

### **🔍 Common Issues**

#### **Docker Issues:**
```bash
# Issue: Port already in use
# Solution: Find and kill process
sudo lsof -i :8000
sudo kill -9 <PID>

# Issue: Docker build fails
# Solution: Clear build cache
docker system prune -a

# Issue: Database connection failed
# Solution: Reset database container
docker-compose down postgres
docker volume rm frontend_postgres_data
docker-compose up -d postgres

# Issue: Frontend not updating
# Solution: Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

#### **Deployment Issues:**
```bash
# Issue: GCP authentication failed
# Solution: Re-authenticate
gcloud auth login
gcloud config set project your-project-id

# Issue: Cloud Run deployment timeout
# Solution: Increase build timeout
gcloud config set builds/timeout 1200

# Issue: App Engine deployment failed
# Solution: Check service account permissions
gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:your-project@appspot.gserviceaccount.com" \
  --role="roles/appengine.deployer"

# Issue: Environment variables not loaded
# Solution: Verify secret manager access
gcloud secrets versions access latest --secret="database-url"
```

#### **Performance Issues:**
```bash
# Issue: High memory usage in Cloud Run
# Solution: Optimize memory configuration
gcloud run services update lexia-backend \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 5

# Issue: Slow database queries
# Solution: Enable query logging and analyze
gcloud sql instances patch lexia-postgres \
  --database-flags log_statement=all

# Issue: Frontend bundle too large
# Solution: Analyze and optimize
npm run build:analyze
npx webpack-bundle-analyzer dist/stats.json
```

---

## 📚 **Best Practices Summary**

### **✅ DO - Mejores Prácticas**

#### **🔐 Security**
✅ **Usar secrets management** para credentials sensibles
✅ **Implementar HTTPS** en todas las comunicaciones
✅ **Configurar CORS** apropiadamente para cada environment
✅ **Usar service accounts** con permisos mínimos necesarios
✅ **Implementar health checks** para todos los servicios
✅ **Rotar secrets** regularmente en producción

#### **🚀 Deployment**
✅ **Usar CI/CD pipelines** para deployments automatizados
✅ **Implementar blue-green deployments** para zero downtime
✅ **Configurar auto-scaling** basado en métricas reales
✅ **Usar infrastructure as code** para reproducibilidad
✅ **Implementar rollback automático** en caso de fallos
✅ **Configurar monitoring** antes del deployment

#### **⚡ Performance**
✅ **Optimizar Docker images** con multi-stage builds
✅ **Configurar database connection pooling** apropiadamente
✅ **Implementar caching strategies** en múltiples niveles
✅ **Usar CDN** para assets estáticos
✅ **Configurar gzip compression** en el servidor
✅ **Monitorear métricas** de performance continuamente

### **❌ DON'T - Evitar**

❌ **No hardcodear secrets** en código o configuración
```yaml
# ❌ Incorrecto
env_variables:
  DATABASE_PASSWORD: "hardcoded_password"

# ✅ Correcto
env_variables:
  DATABASE_PASSWORD_SECRET: "projects/123/secrets/db-password/versions/latest"
```

❌ **No deployar sin testing**
```bash
# ❌ Incorrecto: deploy directo
gcloud app deploy

# ✅ Correcto: test antes de deploy
npm run test
npm run e2e
gcloud app deploy
```

❌ **No usar latest tags** en producción
```dockerfile
# ❌ Incorrecto
FROM node:latest

# ✅ Correcto
FROM node:18.17.0-alpine
```

❌ **No ignorar límites de recursos**
```yaml
# ❌ Incorrecto: sin límites
resources:
  requests:
    memory: "128Mi"

# ✅ Correcto: con límites
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

❌ **No deployar sin backups**
```bash
# ❌ Incorrecto: deploy sin backup
gcloud app deploy

# ✅ Correcto: backup antes de deploy
gcloud sql backups create --instance=lexia-postgres
gcloud app deploy
```

---

## 📚 **Recursos Adicionales**

- [🧩 Component Patterns](./component-patterns.md) - Arquitectura de componentes
- [🔌 API Architecture](./api-architecture.md) - Integración backend-frontend  
- [🧪 Testing Strategy](../testing/strategy.md) - Estrategias de testing
- [Docker Documentation](https://docs.docker.com/) - Documentación oficial de Docker
- [Google Cloud Documentation](https://cloud.google.com/docs) - GCP docs
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/) - Deployment con FastAPI
- [Vite Build Guide](https://vitejs.dev/guide/build.html) - Optimización de builds

**Scripts de deployment**: `scripts/deployment/`  
**Configuración**: `docker-compose.yml`, `app.yaml`, `Dockerfile`  
**Última actualización**: Enero 2025  
**Versión**: 1.0.0  
**Mantenido por**: Equipo DevOps & Frontend