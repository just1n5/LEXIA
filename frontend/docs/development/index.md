# 🔧 Development Guidelines - LEXIA

<div align="center">
  
  **Guías completas para desarrollo en LEXIA**
  
  *Estándares, patrones y mejores prácticas*

</div>

---

## 🎯 **Para Desarrolladores**

### **⚛️ Frontend Development**

| Guía | Descripción | Tiempo |
|------|-------------|---------|
| [🎨 Component Patterns](./component-patterns.md) | Patrones de componentes React | 20 min |
| [🎯 State Management](./state-management.md) | React Query + Context patterns | 15 min |
| [🎨 Styling Guidelines](./styling-guidelines.md) | TailwindCSS + Design System | 10 min |
| [🧪 Frontend Testing](./frontend-testing.md) | Vitest + Testing Library | 25 min |
| [⚡ Performance](./performance.md) | Optimización y mejores prácticas | 15 min |

### **🐍 Backend Development**

| Guía | Descripción | Tiempo |
|------|-------------|---------|
| [🏗️ API Architecture](./api-architecture.md) | FastAPI patterns y estructura | 30 min |
| [🗄️ Database Patterns](./database-patterns.md) | SQLAlchemy + Alembic | 20 min |
| [🔐 Security Guidelines](./security-guidelines.md) | Autenticación, autorización, validación | 25 min |
| [🧪 Backend Testing](./backend-testing.md) | Pytest + FastAPI testing | 20 min |
| [📊 Monitoring](./monitoring.md) | Logs, métricas, observabilidad | 15 min |

---

## 📋 **Estándares de Código**

### **✅ Code Quality Standards**

```typescript
// ✅ GOOD: Componente bien estructurado
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useSolicitudes } from '@/hooks/useSolicitudes'

interface SolicitudFormProps {
  onSubmit: (data: SolicitudData) => void
  isLoading?: boolean
}

export function SolicitudForm({ onSubmit, isLoading = false }: SolicitudFormProps) {
  const [radicado, setRadicado] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ radicado })
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-md">
      <input 
        value={radicado}
        onChange={(e) => setRadicado(e.target.value)}
        className="w-full p-sm border border-border-default rounded-md"
        placeholder="Número de radicado"
      />
      <Button 
        type="submit" 
        variant="primary"
        loading={isLoading}
        disabled={!radicado.trim()}
      >
        Crear Solicitud
      </Button>
    </form>
  )
}
```

### **🐍 Python Backend Standards**

```python
# ✅ GOOD: Servicio bien estructurado
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.models.solicitud import Solicitud
from app.schemas.solicitud import SolicitudCreate, SolicitudResponse
from app.repositories.solicitud_repository import SolicitudRepository

class SolicitudService:
    def __init__(self, repository: SolicitudRepository):
        self.repository = repository
    
    async def create_solicitud(
        self, 
        solicitud_data: SolicitudCreate, 
        user_id: int
    ) -> SolicitudResponse:
        """Create a new solicitud and queue RPA task."""
        # Validation
        if not self._is_valid_radicado(solicitud_data.radicado):
            raise ValueError("Invalid radicado format")
        
        # Business logic
        solicitud = await self.repository.create({
            **solicitud_data.dict(),
            "user_id": user_id,
            "status": "pending"
        })
        
        # Queue background task
        await self._queue_rpa_task(solicitud.id)
        
        return SolicitudResponse.from_orm(solicitud)
    
    def _is_valid_radicado(self, radicado: str) -> bool:
        """Validate radicado format (23 digits)."""
        return radicado.isdigit() and len(radicado) == 23
    
    async def _queue_rpa_task(self, solicitud_id: int) -> None:
        """Queue RPA task for processing."""
        # Implementation details...
        pass
```

---

## 🧪 **Testing Strategy**

### **📊 Testing Pyramid**

```
        🔺 E2E Tests (10%)
       🔺🔺 Integration Tests (20%)  
      🔺🔺🔺 Unit Tests (70%)
```

**Objetivos de Cobertura:**
- **Unit Tests**: >80%
- **Integration Tests**: >70% 
- **E2E Tests**: 100% critical paths

### **⚛️ Frontend Testing**

```typescript
// Ejemplo de test unitario
import { render, screen, fireEvent } from '@testing-library/react'
import { SolicitudForm } from './SolicitudForm'

describe('SolicitudForm', () => {
  it('should submit form with valid radicado', async () => {
    const onSubmit = vi.fn()
    render(<SolicitudForm onSubmit={onSubmit} />)
    
    const input = screen.getByPlaceholderText('Número de radicado')
    const button = screen.getByRole('button', { name: /crear solicitud/i })
    
    fireEvent.change(input, { target: { value: '11001310300120240001' } })
    fireEvent.click(button)
    
    expect(onSubmit).toHaveBeenCalledWith({
      radicado: '11001310300120240001'
    })
  })
})
```

### **🐍 Backend Testing**

```python
# Ejemplo de test de integración
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.mark.asyncio
async def test_create_solicitud():
    # Arrange
    user_token = await get_test_user_token()
    solicitud_data = {
        "radicado": "11001310300120240001",
        "tipo": "simple",
        "descripcion": "Test solicitud"
    }
    
    # Act
    response = client.post(
        "/api/solicitudes",
        json=solicitud_data,
        headers={"Authorization": f"Bearer {user_token}"}
    )
    
    # Assert
    assert response.status_code == 201
    data = response.json()
    assert data["radicado"] == solicitud_data["radicado"]
    assert data["status"] == "pending"
```

---

## 📁 **Project Structure**

### **⚛️ Frontend Structure**

```
📁 src/
├── 📁 components/          # Reusable components
│   ├── 📁 ui/             # Base UI components
│   │   ├── Button.tsx     # Design system components
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   └── 📁 forms/          # Form components
│       ├── SolicitudForm.tsx
│       └── UserForm.tsx
├── 📁 pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Solicitudes.tsx
│   └── Settings.tsx
├── 📁 hooks/              # Custom hooks
│   ├── useSolicitudes.ts
│   ├── useAuth.ts
│   └── useWebSocket.ts
├── 📁 services/           # API services
│   ├── api.ts
│   ├── solicitudes.ts
│   └── auth.ts
├── 📁 contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── 📁 utils/              # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
└── 📁 types/              # TypeScript types
    ├── api.ts
    ├── solicitud.ts
    └── user.ts
```

### **🐍 Backend Structure**

```
📁 app/
├── 📁 api/                # HTTP endpoints
│   ├── 📁 endpoints/
│   │   ├── auth.py
│   │   ├── solicitudes.py
│   │   └── users.py
│   └── api.py
├── 📁 core/               # Core functionality
│   ├── config.py
│   ├── security.py
│   └── dependencies.py
├── 📁 models/             # SQLAlchemy models
│   ├── user.py
│   ├── solicitud.py
│   └── resultado.py
├── 📁 schemas/            # Pydantic schemas
│   ├── user.py
│   ├── solicitud.py
│   └── resultado.py
├── 📁 services/           # Business logic
│   ├── auth_service.py
│   ├── solicitud_service.py
│   └── rpa_service.py
├── 📁 repositories/       # Data access
│   ├── user_repository.py
│   └── solicitud_repository.py
└── 📁 utils/              # Utilities
    ├── email.py
    ├── validators.py
    └── helpers.py
```

---

## 🚀 **Development Workflow**

### **🔄 Git Workflow**

```bash
# 1. Feature Development
git checkout main
git pull origin main
git checkout -b feature/descripcion-corta

# 2. Development
# - Follow coding standards
# - Write tests
# - Update documentation

# 3. Pre-commit
npm run lint              # Frontend linting
npm run test             # Frontend tests
pytest                   # Backend tests
npm run type-check       # TypeScript checking

# 4. Commit
git add .
git commit -m "feat: descripción clara del cambio"

# 5. Push and PR
git push origin feature/descripcion-corta
# Create PR via GitHub interface
```

### **✅ Pull Request Checklist**

```markdown
## 📋 PR Checklist

### ✅ Code Quality
- [ ] Code follows style guidelines
- [ ] No linting errors
- [ ] TypeScript types are correct
- [ ] No console.log/print statements

### ✅ Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Edge cases covered

### ✅ Documentation
- [ ] Code comments added where needed
- [ ] API documentation updated
- [ ] README updated if needed
- [ ] Component documentation updated

### ✅ Performance
- [ ] No performance regressions
- [ ] Bundle size checked (frontend)
- [ ] Database queries optimized (backend)
- [ ] Memory leaks avoided
```

---

## ⚙️ **Tools and Configuration**

### **🔧 Development Tools**

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **ESLint** | JavaScript/TypeScript linting | `.eslintrc.js` |
| **Prettier** | Code formatting | `.prettierrc` |
| **Vitest** | Frontend testing | `vitest.config.ts` |
| **Pytest** | Backend testing | `pytest.ini` |
| **TypeScript** | Type checking | `tsconfig.json` |
| **Black** | Python formatting | `pyproject.toml` |

### **📦 VS Code Setup**

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll.eslint": true
  },
  "python.defaultInterpreterPath": "./backend/venv/bin/python",
  "python.formatting.provider": "black",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

---

## 📚 **Next Steps**

### **🎯 For New Developers**
1. [🔧 Development Setup](../getting-started/development-setup.md)
2. [🏃‍♂️ First Contribution](../getting-started/first-contribution.md)
3. [🎨 Component Patterns](./component-patterns.md)
4. [🧪 Testing Guidelines](./testing-guidelines.md)

### **📖 Deep Dive Topics**
- [🏗️ Architecture Overview](../architecture/overview.md)
- [📖 API Reference](../api/overview.md)
- [🎨 Design System](../design-system/overview.md)
- [🚢 Deployment Guide](../deployment/overview.md)

---

<div align="center">

**🔧 Ready to contribute to LEXIA?**

[![Setup Guide](https://img.shields.io/badge/🔧-Development_Setup-blue?style=for-the-badge)](../getting-started/development-setup.md)
[![First PR](https://img.shields.io/badge/🏃‍♂️-First_Contribution-green?style=for-the-badge)](../getting-started/first-contribution.md)

---

<sub>📝 **¿Mejoras a estas guías?** [Editar en GitHub](https://github.com/lexia/lexia/edit/main/docs/development/overview.md)</sub><br/>
<sub>🔄 **Última actualización:** Enero 2025 | **Mantenido por:** Engineering Team</sub>

</div>