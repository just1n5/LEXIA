# 📖 API Reference - LEXIA

<div align="center">
  
  **Documentación completa de la API de LEXIA**
  
  *Todo lo que necesitas para integrar con LEXIA*

</div>

---

## 🎯 **Información General**

### **🌐 Base URL**
- **Desarrollo**: `http://localhost:8000`
- **Staging**: `https://staging-api.lexia.co`
- **Producción**: `https://api.lexia.co`

### **📋 Características**
- ✅ **RESTful API** con endpoints consistentes
- ✅ **OpenAPI 3.0** specification automática
- ✅ **Autenticación JWT** con refresh tokens
- ✅ **Rate limiting** para prevenir abuso
- ✅ **CORS** configurado para integraciones web
- ✅ **Paginación** estándar en listados
- ✅ **WebSocket** para updates en tiempo real

### **📚 Documentación Interactiva**
- **Swagger UI**: [/docs](http://localhost:8000/docs)
- **ReDoc**: [/redoc](http://localhost:8000/redoc)
- **OpenAPI Spec**: [/openapi.json](http://localhost:8000/openapi.json)

---

## 🔐 **Autenticación**

### **🎫 JWT Authentication**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### **🔑 Usar Token en Requests**

```http
GET /api/solicitudes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **🔄 Refresh Token**

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📋 **Endpoints Principales**

### **👤 Usuarios**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Registrar nuevo usuario | ❌ |
| `POST` | `/auth/login` | Iniciar sesión | ❌ |
| `POST` | `/auth/refresh` | Renovar token | ❌ |
| `GET` | `/auth/me` | Obtener usuario actual | ✅ |
| `PUT` | `/auth/me` | Actualizar perfil | ✅ |

### **📋 Solicitudes**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/solicitudes` | Listar solicitudes del usuario | ✅ |
| `POST` | `/api/solicitudes` | Crear nueva solicitud | ✅ |
| `GET` | `/api/solicitudes/{id}` | Obtener solicitud específica | ✅ |
| `PUT` | `/api/solicitudes/{id}` | Actualizar solicitud | ✅ |
| `DELETE` | `/api/solicitudes/{id}` | Eliminar solicitud | ✅ |
| `POST` | `/api/solicitudes/{id}/pause` | Pausar solicitud | ✅ |
| `POST` | `/api/solicitudes/{id}/resume` | Reanudar solicitud | ✅ |

### **📊 Resultados**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/solicitudes/{id}/resultados` | Obtener resultados de solicitud | ✅ |
| `GET` | `/api/solicitudes/{id}/export` | Exportar resultados (PDF/Excel) | ✅ |
| `GET` | `/api/solicitudes/{id}/progress` | Obtener progreso en tiempo real | ✅ |

### **📈 Analytics**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/analytics/dashboard` | Métricas del dashboard | ✅ |
| `GET` | `/api/analytics/usage` | Estadísticas de uso | ✅ |
| `GET` | `/api/analytics/reports` | Reportes personalizados | ✅ |

---

## 📋 **Crear Solicitud - Ejemplo Detallado**

### **🔍 Solicitud Simple**

```http
POST /api/solicitudes
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo": "simple",
  "radicado": "11001310300120240001",
  "descripcion": "Consulta de estado procesal",
  "notificaciones": {
    "email": true,
    "webhook": "https://mi-app.com/webhook/lexia"
  }
}
```

**Response 201 Created:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "tipo": "simple",
  "radicado": "11001310300120240001",
  "descripcion": "Consulta de estado procesal",
  "status": "pending",
  "progress": 0,
  "created_at": "2025-01-15T10:30:00Z",
  "estimated_completion": "2025-01-15T10:35:00Z",
  "urls": {
    "self": "/api/solicitudes/550e8400-e29b-41d4-a716-446655440000",
    "results": "/api/solicitudes/550e8400-e29b-41d4-a716-446655440000/resultados",
    "progress": "/api/solicitudes/550e8400-e29b-41d4-a716-446655440000/progress"
  }
}
```

### **⚡ Solicitud Avanzada**

```http
POST /api/solicitudes
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo": "avanzada",
  "parametros": {
    "fecha_inicio": "2024-01-01",
    "fecha_fin": "2024-12-31",
    "juzgado": "Juzgado 1 Civil del Circuito",
    "tipo_proceso": "ejecutivo",
    "partes": {
      "demandante": "Juan Pérez",
      "demandado": "María García"
    }
  },
  "descripcion": "Búsqueda avanzada por múltiples criterios",
  "programacion": {
    "tipo": "recurrente",
    "frecuencia": "semanal",
    "dia_semana": "lunes",
    "hora": "09:00"
  },
  "notificaciones": {
    "email": true,
    "sms": "+573001234567",
    "webhook": "https://mi-app.com/webhook/lexia"
  }
}
```

### **📄 Procesamiento Masivo**

```http
POST /api/solicitudes/bulk
Authorization: Bearer {token}
Content-Type: multipart/form-data

archivo: [archivo.xlsx]
configuracion: {
  "columna_radicado": "A",
  "columna_descripcion": "B",
  "procesar_paralelo": true,
  "max_concurrencia": 5
}
```

---

## 📊 **Formatos de Respuesta**

### **✅ Respuesta Exitosa**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "resultados": {
      "proceso_encontrado": true,
      "numero_radicado": "11001310300120240001",
      "juzgado": "Juzgado 1 Civil del Circuito de Bogotá",
      "estado_actual": "EN TRÁMITE",
      "ultima_actuacion": {
        "fecha": "2025-01-10",
        "descripcion": "Auto admisorio demanda",
        "tipo": "AUTO"
      },
      "partes": [
        {
          "tipo": "DEMANDANTE",
          "nombre": "JUAN PÉREZ GARCÍA",
          "identificacion": "12345678"
        },
        {
          "tipo": "DEMANDADO", 
          "nombre": "MARÍA GARCÍA LÓPEZ",
          "identificacion": "87654321"
        }
      ],
      "actuaciones": [
        {
          "fecha": "2024-12-15",
          "descripcion": "Presentación de demanda",
          "tipo": "DEMANDA"
        },
        {
          "fecha": "2025-01-10",
          "descripcion": "Auto admisorio demanda",
          "tipo": "AUTO"
        }
      ]
    }
  },
  "meta": {
    "procesado_en": "2025-01-15T10:35:22Z",
    "duracion_segundos": 45,
    "fuente": "rama_judicial"
  }
}
```

### **❌ Respuesta de Error**

```json
{
  "success": false,
  "error": {
    "code": "RADICADO_INVALID",
    "message": "El formato del radicado no es válido",
    "details": {
      "radicado": "1100131030012024000",
      "formato_esperado": "23 dígitos numéricos",
      "formato_recibido": "19 dígitos"
    }
  },
  "meta": {
    "timestamp": "2025-01-15T10:30:00Z",
    "request_id": "req_550e8400e29b41d4"
  }
}
```

### **📋 Respuesta Paginada**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_items": 156,
    "total_pages": 8,
    "has_next": true,
    "has_previous": false,
    "next_url": "/api/solicitudes?page=2&per_page=20",
    "previous_url": null
  }
}
```

---

## 🔄 **WebSocket - Updates en Tiempo Real**

### **🔌 Conexión**

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

// Autenticación
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }));
};

// Recibir updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'solicitud_progress':
      updateProgress(data.solicitud_id, data.progress);
      break;
      
    case 'solicitud_completed':
      showNotification('Consulta completada', data.solicitud_id);
      break;
      
    case 'solicitud_error':
      showError('Error en consulta', data.error);
      break;
  }
};
```

### **📨 Tipos de Mensajes**

```typescript
// Progress update
{
  "type": "solicitud_progress",
  "solicitud_id": "550e8400-e29b-41d4-a716-446655440000",
  "progress": 75,
  "status": "processing",
  "current_step": "Extrayendo actuaciones",
  "estimated_completion": "2025-01-15T10:35:00Z"
}

// Completion notification
{
  "type": "solicitud_completed",
  "solicitud_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "results_available": true,
  "processing_time": 45
}

// Error notification
{
  "type": "solicitud_error",
  "solicitud_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "error",
  "error": {
    "code": "WEBSITE_UNAVAILABLE",
    "message": "Sitio web judicial no disponible"
  }
}
```

---

## 🔧 **Códigos de Estado**

### **✅ Success Codes**
- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `202 Accepted` - Solicitud aceptada (procesamiento asíncrono)
- `204 No Content` - Operación exitosa sin contenido

### **❌ Error Codes**
- `400 Bad Request` - Datos de entrada inválidos
- `401 Unauthorized` - Token inválido o ausente
- `403 Forbidden` - Sin permisos para la operación
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto con estado actual
- `422 Unprocessable Entity` - Errores de validación
- `429 Too Many Requests` - Rate limit excedido
- `500 Internal Server Error` - Error interno del servidor

### **🔍 Business Error Codes**

| Código | Descripción | Acción Recomendada |
|--------|-------------|-------------------|
| `RADICADO_INVALID` | Formato de radicado inválido | Verificar formato (23 dígitos) |
| `RADICADO_NOT_FOUND` | Radicado no existe en sistema judicial | Verificar número o contactar juzgado |
| `WEBSITE_UNAVAILABLE` | Sitio judicial no disponible | Reintentar más tarde |
| `CAPTCHA_REQUIRED` | Se requiere resolver captcha | Implementar solver automático |
| `QUOTA_EXCEEDED` | Cuota de consultas excedida | Esperar renovación o contactar soporte |
| `PERMISSION_DENIED` | Sin permisos para este radicado | Verificar autorizaciones |

---

## 🚀 **SDKs y Librerías**

### **📦 JavaScript/TypeScript SDK**

```bash
npm install @lexia/sdk
```

```typescript
import { LexiaSDK } from '@lexia/sdk';

const lexia = new LexiaSDK({
  apiKey: 'your-api-key',
  environment: 'production' // 'sandbox' | 'production'
});

// Crear solicitud
const solicitud = await lexia.solicitudes.create({
  tipo: 'simple',
  radicado: '11001310300120240001'
});

// Obtener resultados
const resultados = await lexia.solicitudes.getResults(solicitud.id);

// Webhook listener
lexia.webhooks.on('solicitud_completed', (data) => {
  console.log('Solicitud completada:', data.solicitud_id);
});
```

### **🐍 Python SDK**

```bash
pip install lexia-sdk
```

```python
from lexia import LexiaSDK

lexia = LexiaSDK(
    api_key='your-api-key',
    environment='production'
)

# Crear solicitud
solicitud = lexia.solicitudes.create(
    tipo='simple',
    radicado='11001310300120240001'
)

# Obtener resultados
resultados = lexia.solicitudes.get_results(solicitud.id)

# Webhook handler
@lexia.webhook('solicitud_completed')
def handle_completion(data):
    print(f"Solicitud completada: {data['solicitud_id']}")
```

---

## 📊 **Rate Limiting**

### **🚦 Límites por Plan**

| Plan | Requests/minuto | Concurrent Requests | Webhook Calls/día |
|------|-----------------|-------------------|------------------|
| **Free** | 60 | 2 | 100 |
| **Pro** | 300 | 10 | 1,000 |
| **Enterprise** | 1,000 | 50 | 10,000 |

### **📋 Headers de Rate Limit**

```http
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-RateLimit-Reset: 1642694400
X-RateLimit-Retry-After: 60
```

### **⚠️ Rate Limit Exceeded**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Límite de requests excedido",
    "details": {
      "limit": 300,
      "window": "1 minute",
      "retry_after": 60
    }
  }
}
```

---

## 🔗 **Webhooks**

### **🎯 Configurar Webhook**

```http
POST /api/webhooks
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "https://mi-app.com/webhook/lexia",
  "events": [
    "solicitud_completed",
    "solicitud_error",
    "solicitud_progress"
  ],
  "secret": "webhook_secret_key"
}
```

### **📨 Payload de Webhook**

```json
{
  "event": "solicitud_completed",
  "timestamp": "2025-01-15T10:35:00Z",
  "data": {
    "solicitud_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "results": {
      "proceso_encontrado": true,
      "numero_radicado": "11001310300120240001"
    }
  },
  "signature": "sha256=1234567890abcdef..."
}
```

### **🔐 Verificar Signature**

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const calculatedSignature = `sha256=${hmac.digest('hex')}`;
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  );
}
```

---

## 📚 **Próximos Pasos**

### **🔍 Documentación Detallada:**
- [📋 Endpoints Completos](./endpoints/) - Documentación detallada de cada endpoint
- [🔌 SDK Reference](./sdks/) - Guías completas de SDKs
- [🎯 Examples](./examples/) - Ejemplos de integración
- [🚨 Error Handling](./errors/) - Manejo de errores avanzado

### **🛠️ Herramientas:**
- [📊 Postman Collection](./postman/) - Colección completa de requests
- [🔍 API Testing](./testing/) - Cómo testear integraciones
- [📈 Monitoring](./monitoring/) - Monitorear uso de API

---

<div align="center">

**🔌 ¿Necesitas ayuda con la API?**

[![Discord](https://img.shields.io/badge/Discord-api_support-blue?style=for-the-badge)](https://discord.gg/lexia-api)
[![Email](https://img.shields.io/badge/Email-api@lexia.co-green?style=for-the-badge)](mailto:api@lexia.co)
[![Docs](https://img.shields.io/badge/Interactive-API_Docs-orange?style=for-the-badge)](http://localhost:8000/docs)

---

<sub>📝 **¿Mejoras a esta documentación?** [Editar en GitHub](https://github.com/lexia/lexia/edit/main/docs/api/overview.md)</sub><br/>
<sub>🔄 **Última actualización:** Enero 2025 | **API Version:** v1.0</sub>

</div>