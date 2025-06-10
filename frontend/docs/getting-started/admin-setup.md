# ⚙️ Setup Administrativo - LEXIA

<div align="center">
  
  **Configuración empresarial de LEXIA**
  
  *De desarrollo a producción en un ambiente corporativo*

</div>

---

## 🎯 **Alcance de este Setup**

### **👥 ¿Para quién es esta guía?**

- **🏢 Administradores de sistemas** configurando LEXIA empresarial
- **☁️ DevOps engineers** desplegando en producción
- **👨‍💻 Technical leads** supervisando implementación
- **🔒 Security officers** validando configuración de seguridad

### **🎯 ¿Qué lograrás?**

Al finalizar tendrás:
- ✅ **LEXIA funcionando** en ambiente empresarial
- ✅ **Multi-tenancy** configurado para múltiples clientes/equipos
- ✅ **Seguridad enterprise** con SSL, autenticación y permisos
- ✅ **Monitoreo completo** con logs, métricas y alertas
- ✅ **Backup automático** y disaster recovery
- ✅ **Integración** con sistemas empresariales existentes

**⏱️ Tiempo estimado**: 2-3 horas para setup completo

---

## 📋 **Prerequisites Empresariales**

### **🏗️ Infraestructura Requerida**

#### **💻 Servidores de Producción**
```bash
# Configuración mínima recomendada
CPU: 8 cores (16 vCPUs)
RAM: 32 GB
Storage: 500 GB SSD (con backup)
Network: 1 Gbps
OS: Ubuntu 20.04 LTS / CentOS 8 / Amazon Linux 2
```

#### **☁️ Cloud Resources (GCP/AWS/Azure)**
```yaml
# Ejemplo configuración GCP
Compute Engine:
  - Instance type: n2-standard-8
  - Persistent disks: 500GB SSD
  - VPC network: Private subnet
  - Load balancer: HTTPS termination

Cloud SQL:
  - PostgreSQL 14
  - 4 vCPUs, 15 GB RAM
  - 500 GB storage
  - High availability enabled

Cloud Storage:
  - Bucket para archivos
  - Versioning enabled
  - Lifecycle rules configuradas
```

### **🔐 Certificados y Seguridad**

```bash
# SSL Certificates
- Certificado wildcard para *.tu-dominio.com
- Intermediate certificates
- Certificate chain completa

# DNS Setup
lexia.tu-empresa.com        → Load Balancer IP
api.lexia.tu-empresa.com    → Backend IP
admin.lexia.tu-empresa.com  → Admin panel IP
```

### **👥 Cuentas y Permisos**

- **🔑 Service accounts** con permisos mínimos necesarios
- **👤 Admin users** con 2FA habilitado
- **🗄️ Database users** con roles específicos
- **📧 SMTP credentials** para notificaciones
- **☁️ Cloud provider accounts** con billing configurado

---

## 🚀 **Fase 1: Setup Base de Infraestructura**

### **🐳 Opción A: Deployment con Docker (Recomendado)**

#### **1. Configuración de Producción**

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

  frontend:
    image: lexia/frontend:production
    environment:
      - VITE_API_URL=https://api.lexia.tu-empresa.com
      - VITE_ENVIRONMENT=production
      - VITE_SENTRY_DSN=${SENTRY_DSN}
    restart: unless-stopped
    deploy:
      replicas: 2

  backend:
    image: lexia/backend:production
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - SECRET_KEY=${SECRET_KEY}
      - CORS_ORIGINS=https://lexia.tu-empresa.com
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASSWORD=${SMTP_PASSWORD}
    restart: unless-stopped
    deploy:
      replicas: 3

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

  celery:
    image: lexia/backend:production
    command: celery -A app.worker worker --loglevel=info
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - CELERY_BROKER_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    deploy:
      replicas: 4

volumes:
  postgres_data:
  redis_data:
```

#### **2. Variables de Entorno de Producción**

```bash
# .env.production
# ===== DATABASE =====
DATABASE_URL=postgresql://lexia_prod:${DB_PASSWORD}@postgres:5432/lexia_production
POSTGRES_DB=lexia_production
POSTGRES_USER=lexia_prod
POSTGRES_PASSWORD=${DB_PASSWORD}

# ===== REDIS =====
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
REDIS_PASSWORD=${REDIS_PASSWORD}

# ===== SECURITY =====
SECRET_KEY=${SECRET_KEY}  # 64+ caracteres aleatorios
CORS_ORIGINS=https://lexia.tu-empresa.com,https://admin.lexia.tu-empresa.com
ALLOWED_HOSTS=api.lexia.tu-empresa.com,backend

# ===== EMAIL =====
SMTP_HOST=smtp.tu-empresa.com
SMTP_PORT=587
SMTP_USER=noreply@tu-empresa.com
SMTP_PASSWORD=${SMTP_PASSWORD}
SMTP_FROM=LEXIA <noreply@tu-empresa.com>

# ===== EXTERNAL APIS =====
OPENAI_API_KEY=${OPENAI_API_KEY}
CAPTCHA_SOLVER_API_KEY=${CAPTCHA_API_KEY}

# ===== MONITORING =====
SENTRY_DSN=${SENTRY_DSN}
LOG_LEVEL=INFO
ENABLE_METRICS=true

# ===== UPLOADS =====
UPLOAD_PATH=/app/uploads
MAX_UPLOAD_SIZE=50MB
ALLOWED_EXTENSIONS=xlsx,csv,pdf

# ===== RATE LIMITING =====
RATE_LIMIT_PER_MINUTE=300
RATE_LIMIT_BURST=50

# ===== BACKUP =====
BACKUP_SCHEDULE=0 2 * * *  # Daily at 2 AM
BACKUP_RETENTION_DAYS=30
BACKUP_STORAGE_PATH=/backups
```

#### **3. Nginx Configuration**

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }
    
    upstream backend {
        server backend:8000;
    }
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Frontend
    server {
        listen 443 ssl http2;
        server_name lexia.tu-empresa.com;
        
        ssl_certificate /etc/nginx/ssl/lexia.crt;
        ssl_certificate_key /etc/nginx/ssl/lexia.key;
        
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    
    # Backend API
    server {
        listen 443 ssl http2;
        server_name api.lexia.tu-empresa.com;
        
        ssl_certificate /etc/nginx/ssl/lexia.crt;
        ssl_certificate_key /etc/nginx/ssl/lexia.key;
        
        # API Rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Auth endpoints - stricter rate limiting
        location /auth/login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        
        # Health check (no rate limit)
        location /health {
            proxy_pass http://backend;
            access_log off;
        }
    }
    
    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name lexia.tu-empresa.com api.lexia.tu-empresa.com;
        return 301 https://$server_name$request_uri;
    }
}
```

---

## 👥 **Fase 2: Multi-Tenancy y Gestión de Usuarios**

### **🏢 Configuración Multi-Tenant**

#### **1. Database Schema para Multi-Tenancy**

```sql
-- migrations/add_multi_tenancy.sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(50) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'free',
    max_users INTEGER DEFAULT 5,
    max_queries_per_month INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE organization_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'user',
    permissions JSONB DEFAULT '[]',
    joined_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(organization_id, user_id)
);

-- Add organization_id to existing tables
ALTER TABLE users ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE solicitudes ADD COLUMN organization_id UUID REFERENCES organizations(id);

-- Indexes for performance
CREATE INDEX idx_organizations_subdomain ON organizations(subdomain);
CREATE INDEX idx_organization_users_org_id ON organization_users(organization_id);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_solicitudes_organization_id ON solicitudes(organization_id);
```

#### **2. Backend Multi-Tenant Logic**

```python
# app/core/multi_tenant.py
from typing import Optional
from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

class TenantContext:
    def __init__(self, organization_id: str, organization: dict):
        self.organization_id = organization_id
        self.organization = organization

async def get_tenant_from_request(
    request: Request,
    db: Session = Depends(get_db)
) -> TenantContext:
    """Extract tenant info from request (subdomain or header)"""
    
    # Option 1: From subdomain
    host = request.headers.get("host", "")
    if "." in host:
        subdomain = host.split(".")[0]
        organization = db.query(Organization).filter(
            Organization.subdomain == subdomain,
            Organization.is_active == True
        ).first()
        
        if organization:
            return TenantContext(str(organization.id), organization)
    
    # Option 2: From header (for API clients)
    org_id = request.headers.get("X-Organization-ID")
    if org_id:
        organization = db.query(Organization).filter(
            Organization.id == org_id,
            Organization.is_active == True
        ).first()
        
        if organization:
            return TenantContext(org_id, organization)
    
    raise HTTPException(
        status_code=400,
        detail="Organization not found or inactive"
    )

# Usage in endpoints
@router.get("/solicitudes/")
async def get_solicitudes(
    tenant: TenantContext = Depends(get_tenant_from_request),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify user belongs to organization
    if current_user.organization_id != tenant.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Query with tenant isolation
    solicitudes = db.query(Solicitud).filter(
        Solicitud.organization_id == tenant.organization_id,
        Solicitud.user_id == current_user.id
    ).all()
    
    return solicitudes
```

#### **3. Frontend Multi-Tenant Support**

```typescript
// src/contexts/TenantContext.tsx
interface TenantContextType {
  organization: Organization | null
  currentPlan: PlanLimits
  isWithinLimits: (resource: string) => boolean
  upgradeUrl: string
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const [organization, setOrganization] = useState<Organization | null>(null)
  
  useEffect(() => {
    // Extract organization from subdomain or API
    const host = window.location.hostname
    const subdomain = host.split('.')[0]
    
    if (subdomain && subdomain !== 'www') {
      fetchOrganization(subdomain)
    }
  }, [])
  
  const isWithinLimits = (resource: string) => {
    if (!organization) return false
    
    const limits = PLAN_LIMITS[organization.plan]
    const usage = organization.current_usage
    
    switch (resource) {
      case 'users':
        return usage.users < limits.max_users
      case 'queries':
        return usage.queries_this_month < limits.max_queries_per_month
      default:
        return true
    }
  }
  
  return (
    <TenantContext.Provider value={{
      organization,
      currentPlan: PLAN_LIMITS[organization?.plan || 'free'],
      isWithinLimits,
      upgradeUrl: `/billing/upgrade`
    }}>
      {children}
    </TenantContext.Provider>
  )
}
```

### **👤 Sistema de Roles y Permisos**

#### **1. Definición de Roles**

```python
# app/models/permissions.py
from enum import Enum

class Role(str, Enum):
    SUPER_ADMIN = "super_admin"        # Acceso completo al sistema
    ORG_ADMIN = "org_admin"            # Admin de la organización
    MANAGER = "manager"                # Manager de equipo
    USER = "user"                      # Usuario estándar
    VIEWER = "viewer"                  # Solo lectura

class Permission(str, Enum):
    # User management
    CREATE_USERS = "create_users"
    READ_USERS = "read_users"
    UPDATE_USERS = "update_users"
    DELETE_USERS = "delete_users"
    
    # Solicitudes
    CREATE_SOLICITUDES = "create_solicitudes"
    READ_OWN_SOLICITUDES = "read_own_solicitudes"
    READ_ALL_SOLICITUDES = "read_all_solicitudes"
    UPDATE_SOLICITUDES = "update_solicitudes"
    DELETE_SOLICITUDES = "delete_solicitudes"
    
    # Organization
    UPDATE_ORG_SETTINGS = "update_org_settings"
    VIEW_ORG_ANALYTICS = "view_org_analytics"
    MANAGE_BILLING = "manage_billing"
    
    # Advanced features
    BULK_OPERATIONS = "bulk_operations"
    API_ACCESS = "api_access"
    WEBHOOK_MANAGEMENT = "webhook_management"

ROLE_PERMISSIONS = {
    Role.SUPER_ADMIN: list(Permission),  # All permissions
    Role.ORG_ADMIN: [
        Permission.CREATE_USERS,
        Permission.READ_USERS,
        Permission.UPDATE_USERS,
        Permission.DELETE_USERS,
        Permission.READ_ALL_SOLICITUDES,
        Permission.UPDATE_ORG_SETTINGS,
        Permission.VIEW_ORG_ANALYTICS,
        Permission.MANAGE_BILLING,
        Permission.BULK_OPERATIONS,
        Permission.API_ACCESS,
        Permission.WEBHOOK_MANAGEMENT,
    ],
    Role.MANAGER: [
        Permission.READ_USERS,
        Permission.READ_ALL_SOLICITUDES,
        Permission.CREATE_SOLICITUDES,
        Permission.UPDATE_SOLICITUDES,
        Permission.VIEW_ORG_ANALYTICS,
        Permission.BULK_OPERATIONS,
    ],
    Role.USER: [
        Permission.CREATE_SOLICITUDES,
        Permission.READ_OWN_SOLICITUDES,
        Permission.UPDATE_SOLICITUDES,
    ],
    Role.VIEWER: [
        Permission.READ_OWN_SOLICITUDES,
    ]
}
```

#### **2. Middleware de Autorización**

```python
# app/core/auth.py
from functools import wraps

def require_permission(permission: Permission):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            if not current_user:
                raise HTTPException(status_code=401, detail="Authentication required")
            
            # Check if user has permission
            user_permissions = get_user_permissions(current_user)
            if permission not in user_permissions:
                raise HTTPException(
                    status_code=403, 
                    detail=f"Permission {permission} required"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# Usage in endpoints
@router.delete("/users/{user_id}")
@require_permission(Permission.DELETE_USERS)
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # User has permission, proceed with deletion
    pass
```

---

## 🔒 **Fase 3: Seguridad Enterprise**

### **🛡️ SSL/TLS Configuration**

#### **1. Certificate Management**

```bash
# Using Let's Encrypt with Certbot
# Install certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Generate certificates
sudo certbot --nginx -d lexia.tu-empresa.com -d api.lexia.tu-empresa.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet

# Verify certificate
sudo certbot certificates
```

#### **2. Security Headers**

```nginx
# nginx/security.conf
# Include in main nginx.conf

# Security headers
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';" always;

# HSTS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Hide nginx version
server_tokens off;
```

### **🔐 Database Security**

#### **1. PostgreSQL Hardening**

```bash
# postgresql.conf
listen_addresses = 'localhost'
ssl = on
ssl_cert_file = '/etc/postgresql/14/main/server.crt'
ssl_key_file = '/etc/postgresql/14/main/server.key'
ssl_ca_file = '/etc/postgresql/14/main/ca.crt'

# Connection limits
max_connections = 200
shared_buffers = 256MB
work_mem = 4MB

# Logging for security
log_connections = on
log_disconnections = on
log_statement = 'all'
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

#### **2. Database User Permissions**

```sql
-- Create specific users with minimal permissions
CREATE USER lexia_app WITH PASSWORD 'strong_password_here';
CREATE USER lexia_readonly WITH PASSWORD 'readonly_password_here';
CREATE USER lexia_backup WITH PASSWORD 'backup_password_here';

-- Grant specific permissions
GRANT CONNECT ON DATABASE lexia_production TO lexia_app;
GRANT USAGE ON SCHEMA public TO lexia_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO lexia_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO lexia_app;

-- Readonly user for reports
GRANT CONNECT ON DATABASE lexia_production TO lexia_readonly;
GRANT USAGE ON SCHEMA public TO lexia_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO lexia_readonly;

-- Backup user
GRANT CONNECT ON DATABASE lexia_production TO lexia_backup;
GRANT USAGE ON SCHEMA public TO lexia_backup;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO lexia_backup;
```

### **🔑 Environment Secrets Management**

#### **1. Using Docker Secrets**

```yaml
# docker-compose.prod.yml
version: '3.8'

secrets:
  db_password:
    external: true
  jwt_secret:
    external: true
  smtp_password:
    external: true

services:
  backend:
    image: lexia/backend:production
    secrets:
      - db_password
      - jwt_secret
      - smtp_password
    environment:
      - DATABASE_URL=postgresql://lexia_app:$(cat /run/secrets/db_password)@postgres:5432/lexia_production
      - SECRET_KEY_FILE=/run/secrets/jwt_secret
```

#### **2. Creating Secrets**

```bash
# Create Docker secrets
echo "super_secure_db_password" | docker secret create db_password -
echo "jwt_secret_key_64_chars_minimum" | docker secret create jwt_secret -
echo "smtp_password_here" | docker secret create smtp_password -

# List secrets
docker secret ls
```

---

## 📊 **Fase 4: Monitoreo y Observabilidad**

### **📈 Metrics and Monitoring**

#### **1. Prometheus + Grafana Setup**

```yaml
# monitoring/docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin_password_here
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro

volumes:
  prometheus_data:
  grafana_data:
```

#### **2. Application Metrics**

```python
# app/core/metrics.py
from prometheus_client import Counter, Histogram, Gauge, generate_latest

# Define metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration'
)

ACTIVE_USERS = Gauge(
    'active_users_total',
    'Currently active users'
)

SOLICITUDES_CREATED = Counter(
    'solicitudes_created_total',
    'Total solicitudes created',
    ['organization_id', 'type']
)

RPA_TASKS_COMPLETED = Counter(
    'rpa_tasks_completed_total',
    'RPA tasks completed',
    ['status', 'organization_id']
)

DATABASE_CONNECTIONS = Gauge(
    'database_connections_active',
    'Active database connections'
)

# Middleware to collect metrics
@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    REQUEST_DURATION.observe(duration)
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()
    
    return response

# Metrics endpoint
@app.get("/metrics")
async def get_metrics():
    return Response(generate_latest(), media_type="text/plain")
```

### **📋 Logging Configuration**

#### **1. Structured Logging Setup**

```python
# app/core/logging.py
import structlog
import logging.config

# Configure structured logging
structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.PositionalArgumentsFormatter(),
        structlog.dev.set_exc_info,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    logger_factory=structlog.WriteLoggerFactory(),
    cache_logger_on_first_use=True,
)

# Usage throughout application
logger = structlog.get_logger()

# In request handlers
@router.post("/solicitudes/")
async def create_solicitud(
    solicitud_data: SolicitudCreate,
    current_user: User = Depends(get_current_user)
):
    logger.info(
        "Creating solicitud",
        user_id=current_user.id,
        organization_id=current_user.organization_id,
        radicado=solicitud_data.radicado,
        tipo=solicitud_data.tipo
    )
    
    try:
        solicitud = await create_solicitud_service(solicitud_data, current_user)
        
        logger.info(
            "Solicitud created successfully",
            solicitud_id=solicitud.id,
            user_id=current_user.id,
            duration_ms=processing_time
        )
        
        return solicitud
    except Exception as e:
        logger.error(
            "Failed to create solicitud",
            user_id=current_user.id,
            error=str(e),
            exc_info=True
        )
        raise
```

#### **2. Log Aggregation with ELK Stack**

```yaml
# monitoring/docker-compose.elk.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.5.0
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    ports:
      - "5044:5044"
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.5.0
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:
```

---

## 💾 **Fase 5: Backup y Disaster Recovery**

### **🔄 Automated Backups**

#### **1. Database Backup Script**

```bash
#!/bin/bash
# scripts/backup_database.sh

set -e

# Configuration
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="lexia_production"
DB_USER="lexia_backup"
BACKUP_DIR="/backups"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="lexia_backup_${DATE}.sql.gz"
S3_BUCKET="lexia-backups-tu-empresa"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Create database backup
echo "Starting database backup..."
PGPASSWORD=${DB_PASSWORD} pg_dump \
    -h ${DB_HOST} \
    -p ${DB_PORT} \
    -U ${DB_USER} \
    -d ${DB_NAME} \
    --no-password \
    --verbose \
    --format=custom \
    --blobs \
    --no-owner \
    --no-privileges | gzip > ${BACKUP_DIR}/${BACKUP_FILE}

# Verify backup was created
if [ -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    echo "Database backup created: ${BACKUP_FILE}"
    BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)
    echo "Backup size: ${BACKUP_SIZE}"
else
    echo "ERROR: Backup failed!"
    exit 1
fi

# Upload to S3 (optional)
if [ ! -z "${S3_BUCKET}" ]; then
    echo "Uploading backup to S3..."
    aws s3 cp "${BACKUP_DIR}/${BACKUP_FILE}" "s3://${S3_BUCKET}/database/${BACKUP_FILE}"
    echo "Backup uploaded to S3"
fi

# Clean up old backups (local)
echo "Cleaning up old backups..."
find ${BACKUP_DIR} -name "lexia_backup_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

# Clean up old backups (S3)
if [ ! -z "${S3_BUCKET}" ]; then
    aws s3 ls "s3://${S3_BUCKET}/database/" | while read -r line; do
        createDate=$(echo $line | awk '{print $1" "$2}')
        createDate=$(date -d "$createDate" +%s)
        olderThan=$(date -d "${RETENTION_DAYS} days ago" +%s)
        if [[ $createDate -lt $olderThan ]]; then
            fileName=$(echo $line | awk '{print $4}')
            if [[ $fileName != "" ]]; then
                aws s3 rm "s3://${S3_BUCKET}/database/$fileName"
                echo "Deleted old backup: $fileName"
            fi
        fi
    done
fi

echo "Database backup completed successfully"
```

#### **2. Cron Job Setup**

```bash
# Setup automated backups
sudo crontab -e

# Add backup jobs
# Daily database backup at 2 AM
0 2 * * * /opt/lexia/scripts/backup_database.sh >> /var/log/lexia/backup.log 2>&1

# Weekly full system backup at 3 AM on Sundays
0 3 * * 0 /opt/lexia/scripts/backup_full_system.sh >> /var/log/lexia/backup.log 2>&1

# Monthly backup verification at 4 AM on 1st
0 4 1 * * /opt/lexia/scripts/verify_backups.sh >> /var/log/lexia/backup.log 2>&1
```

### **🚨 Disaster Recovery Plan**

#### **1. Recovery Procedures**

```bash
#!/bin/bash
# scripts/restore_database.sh

set -e

# Configuration
BACKUP_FILE=$1
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="lexia_production"
DB_USER="postgres"
TEMP_DB="lexia_restore_temp"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -la /backups/lexia_backup_*.sql.gz
    exit 1
fi

# Verify backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "Starting database restore from: $BACKUP_FILE"

# Create temporary database for testing restore
echo "Creating temporary database for verification..."
PGPASSWORD=${DB_PASSWORD} createdb -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${TEMP_DB}

# Restore to temporary database first
echo "Restoring to temporary database..."
gunzip -c ${BACKUP_FILE} | PGPASSWORD=${DB_PASSWORD} pg_restore \
    -h ${DB_HOST} \
    -p ${DB_PORT} \
    -U ${DB_USER} \
    -d ${TEMP_DB} \
    --verbose \
    --no-owner \
    --no-privileges

# Verify restore integrity
echo "Verifying restore integrity..."
TABLE_COUNT=$(PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${TEMP_DB} -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';")
echo "Tables restored: ${TABLE_COUNT}"

if [ "$TABLE_COUNT" -lt 5 ]; then
    echo "ERROR: Restore verification failed - too few tables"
    PGPASSWORD=${DB_PASSWORD} dropdb -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${TEMP_DB}
    exit 1
fi

echo "Restore verification successful"

# Ask for confirmation before proceeding
read -p "Restore verified. Continue with production restore? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    PGPASSWORD=${DB_PASSWORD} dropdb -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${TEMP_DB}
    exit 1
fi

# Stop application services
echo "Stopping application services..."
docker-compose -f docker-compose.prod.yml stop backend frontend celery

# Backup current database (just in case)
echo "Creating backup of current database..."
CURRENT_BACKUP="/backups/pre_restore_backup_$(date +%Y%m%d_%H%M%S).sql.gz"
PGPASSWORD=${DB_PASSWORD} pg_dump \
    -h ${DB_HOST} \
    -p ${DB_PORT} \
    -U ${DB_USER} \
    -d ${DB_NAME} \
    --format=custom | gzip > ${CURRENT_BACKUP}

echo "Current database backed up to: ${CURRENT_BACKUP}"

# Drop and recreate production database
echo "Recreating production database..."
PGPASSWORD=${DB_PASSWORD} dropdb -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${DB_NAME}
PGPASSWORD=${DB_PASSWORD} createdb -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${DB_NAME}

# Restore production database
echo "Restoring production database..."
gunzip -c ${BACKUP_FILE} | PGPASSWORD=${DB_PASSWORD} pg_restore \
    -h ${DB_HOST} \
    -p ${DB_PORT} \
    -U ${DB_USER} \
    -d ${DB_NAME} \
    --verbose \
    --no-owner \
    --no-privileges

# Clean up temporary database
PGPASSWORD=${DB_PASSWORD} dropdb -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${TEMP_DB}

# Restart application services
echo "Starting application services..."
docker-compose -f docker-compose.prod.yml up -d

echo "Database restore completed successfully"
echo "Pre-restore backup saved at: ${CURRENT_BACKUP}"
```

---

## 🔗 **Fase 6: Integración con Sistemas Empresariales**

### **🔐 SSO Integration (SAML/OAuth)**

#### **1. Active Directory Integration**

```python
# app/auth/ldap.py
import ldap
from ldap import SCOPE_SUBTREE

class LDAPAuthenticator:
    def __init__(self, ldap_server: str, base_dn: str):
        self.ldap_server = ldap_server
        self.base_dn = base_dn
    
    def authenticate_user(self, username: str, password: str) -> dict:
        """Authenticate user against Active Directory"""
        try:
            # Connect to LDAP server
            conn = ldap.initialize(f"ldap://{self.ldap_server}")
            conn.protocol_version = ldap.VERSION3
            conn.set_option(ldap.OPT_REFERRALS, 0)
            
            # Bind with user credentials
            user_dn = f"cn={username},{self.base_dn}"
            conn.simple_bind_s(user_dn, password)
            
            # Search for user attributes
            search_filter = f"(cn={username})"
            attributes = ['cn', 'mail', 'memberOf', 'department']
            
            result = conn.search_s(
                self.base_dn,
                SCOPE_SUBTREE,
                search_filter,
                attributes
            )
            
            if result:
                user_data = result[0][1]
                return {
                    'username': username,
                    'email': user_data.get('mail', [b''])[0].decode('utf-8'),
                    'groups': [g.decode('utf-8') for g in user_data.get('memberOf', [])],
                    'department': user_data.get('department', [b''])[0].decode('utf-8')
                }
            
            return None
            
        except ldap.INVALID_CREDENTIALS:
            return None
        except Exception as e:
            logger.error(f"LDAP authentication error: {e}")
            return None
        finally:
            if conn:
                conn.unbind()

# Integration in auth endpoints
@router.post("/auth/ldap-login")
async def ldap_login(
    credentials: LDAPCredentials,
    db: Session = Depends(get_db)
):
    ldap_auth = LDAPAuthenticator(
        ldap_server=settings.LDAP_SERVER,
        base_dn=settings.LDAP_BASE_DN
    )
    
    user_data = ldap_auth.authenticate_user(
        credentials.username,
        credentials.password
    )
    
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create or update user in local database
    user = await get_or_create_user_from_ldap(user_data, db)
    
    # Generate JWT token
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
```

### **📊 BI Integration**

#### **1. Data Warehouse Integration**

```python
# app/integrations/data_warehouse.py
from sqlalchemy import create_engine
import pandas as pd

class DataWarehouseSync:
    def __init__(self, warehouse_url: str):
        self.warehouse_engine = create_engine(warehouse_url)
    
    async def sync_solicitudes_data(self):
        """Sync solicitudes data to data warehouse"""
        
        # Extract data from main database
        query = """
        SELECT 
            s.id,
            s.radicado,
            s.tipo,
            s.status,
            s.created_at,
            s.completed_at,
            s.organization_id,
            o.name as organization_name,
            u.email as user_email,
            u.department
        FROM solicitudes s
        JOIN users u ON s.user_id = u.id
        JOIN organizations o ON s.organization_id = o.id
        WHERE s.updated_at >= %s
        """
        
        # Get data from last sync
        df = pd.read_sql(query, self.main_engine, params=[self.last_sync_time])
        
        # Transform data for warehouse
        df['processing_time_minutes'] = (
            df['completed_at'] - df['created_at']
        ).dt.total_seconds() / 60
        
        df['success_rate'] = df['status'].apply(
            lambda x: 1 if x == 'completed' else 0
        )
        
        # Load to warehouse
        df.to_sql(
            'fact_solicitudes',
            self.warehouse_engine,
            if_exists='append',
            index=False
        )
        
        logger.info(f"Synced {len(df)} solicitudes to data warehouse")

# Scheduled task
@celery_app.task
def sync_to_data_warehouse():
    dw_sync = DataWarehouseSync(settings.DATA_WAREHOUSE_URL)
    await dw_sync.sync_solicitudes_data()
```

---

## ✅ **Checklist de Go-Live**

### **🚀 Pre-Launch Checklist**

#### **🔒 Security**
- [ ] ✅ SSL certificates installed and verified
- [ ] ✅ Security headers configured
- [ ] ✅ Database users with minimal permissions
- [ ] ✅ Secrets management in place
- [ ] ✅ Rate limiting configured
- [ ] ✅ CORS properly configured
- [ ] ✅ Input validation on all endpoints
- [ ] ✅ SQL injection protection verified
- [ ] ✅ XSS protection enabled

#### **📊 Monitoring**
- [ ] ✅ Application metrics collecting
- [ ] ✅ Database metrics collecting
- [ ] ✅ System metrics collecting
- [ ] ✅ Logs aggregating properly
- [ ] ✅ Alerting rules configured
- [ ] ✅ Dashboard created and tested
- [ ] ✅ Uptime monitoring active
- [ ] ✅ Error tracking enabled

#### **💾 Backup & Recovery**
- [ ] ✅ Automated backups configured
- [ ] ✅ Backup verification script running
- [ ] ✅ Restoration procedure tested
- [ ] ✅ Disaster recovery plan documented
- [ ] ✅ RTO/RPO targets defined
- [ ] ✅ Backup storage secured
- [ ] ✅ Backup retention policy set

#### **⚡ Performance**
- [ ] ✅ Load testing completed
- [ ] ✅ Database queries optimized
- [ ] ✅ Caching strategy implemented
- [ ] ✅ CDN configured (if applicable)
- [ ] ✅ Connection pooling configured
- [ ] ✅ Resource limits set
- [ ] ✅ Scaling strategy defined

#### **👥 Operations**
- [ ] ✅ Multi-tenancy working
- [ ] ✅ User roles and permissions tested
- [ ] ✅ Admin panel functional
- [ ] ✅ Billing integration tested (if applicable)
- [ ] ✅ Support procedures documented
- [ ] ✅ Incident response plan ready
- [ ] ✅ Team training completed

### **🎯 Post-Launch Monitoring**

#### **First 24 Hours**
- [ ] Monitor error rates (should be <1%)
- [ ] Check response times (should be <500ms p95)
- [ ] Verify backup jobs running
- [ ] Monitor resource usage
- [ ] Check logs for anomalies
- [ ] Verify user authentication working
- [ ] Test critical user journeys

#### **First Week**
- [ ] Analyze user behavior patterns
- [ ] Review performance metrics
- [ ] Check backup integrity
- [ ] Monitor resource consumption trends
- [ ] Gather user feedback
- [ ] Review security logs
- [ ] Optimize based on real usage

#### **First Month**
- [ ] Capacity planning review
- [ ] Security audit
- [ ] Performance optimization
- [ ] User satisfaction survey
- [ ] Disaster recovery drill
- [ ] Documentation updates
- [ ] Team retrospective

---

<div align="center">

**⚙️ ¿Listo para el setup empresarial?**

[![Infrastructure Setup](https://img.shields.io/badge/🏗️-Infrastructure_Setup-blue?style=for-the-badge)](../deployment/infrastructure.md)
[![Security Guide](https://img.shields.io/badge/🔒-Security_Guide-red?style=for-the-badge)](../deployment/security.md)
[![Monitoring Setup](https://img.shields.io/badge/📊-Monitoring_Setup-green?style=for-the-badge)](../deployment/monitoring.md)

---

<sub>📝 **¿Problemas con el setup?** [Contactar Soporte Enterprise](mailto:enterprise@lexia.co)</sub><br/>
<sub>📞 **Soporte urgente**: +57 (1) 234-5678 ext. 500</sub><br/>
<sub>🔄 **Última actualización:** Enero 2025 | **Mantenido por:** DevOps Team</sub>

</div>