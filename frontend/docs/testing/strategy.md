# 🧪 Testing Strategy - LEXIA

<div align="center">
  
  **Estrategia completa de testing para LEXIA**
  
  *Del unit testing al E2E - Garantizando calidad en cada release*

</div>

---

## 🎯 **Filosofía de Testing**

### **🏗️ Testing Pyramid**

```
           🔺 E2E Tests (10%)
          🔺🔺🔺 Integration Tests (20%)
         🔺🔺🔺🔺🔺 Unit Tests (70%)
```

**Distribución estratégica:**
- **📋 Unit Tests (70%)**: Rápidos, confiables, fáciles de mantener
- **🔗 Integration Tests (20%)**: Verifican interacciones entre componentes
- **🌐 E2E Tests (10%)**: Validan flujos críticos completos

### **🎯 Objetivos de Calidad**

| Métrica | Objetivo | Estado Actual | Herramienta |
|---------|----------|---------------|-------------|
| **Unit Test Coverage** | >80% | 75% | Vitest + Coverage |
| **Integration Coverage** | >70% | 65% | Pytest + TestClient |
| **E2E Critical Paths** | 100% | 90% | Playwright |
| **Build Success Rate** | >98% | 96% | GitHub Actions |
| **Time to Run All Tests** | <5 min | 3.2 min | CI Pipeline |

---

## 🛠️ **Stack de Testing**

### **⚛️ Frontend Testing**

#### **🔧 Herramientas Principales**

| Tool | Purpose | Version | Config File |
|------|---------|---------|-------------|
| **Vitest** | Test runner | 1.0+ | `vitest.config.ts` |
| **React Testing Library** | Component testing | 14.0+ | Setup automático |
| **MSW** | API mocking | 2.0+ | `src/mocks/` |
| **Playwright** | E2E testing | 1.40+ | `playwright.config.ts` |
| **@testing-library/jest-dom** | Custom matchers | 6.0+ | `src/test/setup.ts` |

#### **📁 Estructura de Tests Frontend**

```
📁 src/
├── 📁 components/
│   ├── Button.tsx
│   └── Button.test.tsx           # Co-located unit tests
├── 📁 hooks/
│   ├── useAuth.ts
│   └── useAuth.test.ts           # Hook testing
├── 📁 services/
│   ├── api.ts
│   └── api.test.ts               # Service layer tests
├── 📁 utils/
│   ├── formatters.ts
│   └── formatters.test.ts        # Pure function tests
├── 📁 __tests__/
│   ├── integration/              # Integration tests
│   └── setup.ts                  # Test setup
└── 📁 e2e/
    ├── auth.spec.ts              # E2E test specs
    ├── solicitudes.spec.ts
    └── dashboard.spec.ts
```

### **🐍 Backend Testing**

#### **🔧 Herramientas Principales**

| Tool | Purpose | Version | Config File |
|------|---------|---------|-------------|
| **Pytest** | Test runner | 7.0+ | `pytest.ini` |
| **FastAPI TestClient** | API testing | Built-in | En test files |
| **Factory Boy** | Test data generation | 3.3+ | `tests/factories/` |
| **SQLAlchemy TestDB** | Database testing | Built-in | `tests/conftest.py` |
| **Faker** | Fake data generation | 20.0+ | En factories |

#### **📁 Estructura de Tests Backend**

```
📁 tests/
├── 📁 unit/
│   ├── test_models.py            # Model unit tests
│   ├── test_services.py          # Service layer tests
│   └── test_utils.py             # Utility tests
├── 📁 integration/
│   ├── test_api_auth.py          # API integration tests
│   ├── test_api_solicitudes.py
│   └── test_database.py         # DB integration tests
├── 📁 e2e/
│   └── test_complete_flows.py    # End-to-end API tests
├── 📁 factories/
│   ├── user_factory.py          # Test data factories
│   └── solicitud_factory.py
├── conftest.py                   # Pytest configuration
└── requirements-test.txt         # Test dependencies
```

---

## 🧪 **Unit Testing**

### **⚛️ Frontend Unit Tests**

#### **🧩 Component Testing**

```typescript
// src/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Button } from './Button'

describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>)
    
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })
  
  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('should be disabled when loading', () => {
    render(<Button loading>Loading...</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })
  
  it('should apply variant styles correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-primary')
    
    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-destructive')
  })
  
  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    button.focus()
    
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledTimes(1)
    
    await user.keyboard(' ')
    expect(handleClick).toHaveBeenCalledTimes(2)
  })
})
```

#### **🪝 Hook Testing**

```typescript
// src/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useAuth } from './useAuth'
import { AuthProvider } from '../contexts/AuthContext'

// Mock API calls
vi.mock('../services/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn()
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })
  
  it('should initialize with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
  })
  
  it('should handle successful login', async () => {
    const { login } = await import('../services/auth')
    login.mockResolvedValue({
      user: { id: '1', email: 'test@example.com' },
      token: 'fake-token'
    })
    
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })
    
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual({ id: '1', email: 'test@example.com' })
    expect(login).toHaveBeenCalledWith('test@example.com', 'password')
  })
  
  it('should handle login failure', async () => {
    const { login } = await import('../services/auth')
    login.mockRejectedValue(new Error('Invalid credentials'))
    
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      try {
        await result.current.login('test@example.com', 'wrong-password')
      } catch (error) {
        expect(error.message).toBe('Invalid credentials')
      }
    })
    
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })
  
  it('should persist auth state', () => {
    localStorage.setItem('auth_token', 'stored-token')
    localStorage.setItem('auth_user', JSON.stringify({ id: '1', email: 'stored@example.com' }))
    
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual({ id: '1', email: 'stored@example.com' })
  })
})
```

### **🐍 Backend Unit Tests**

#### **🏗️ Model Testing**

```python
# tests/unit/test_models.py
import pytest
from datetime import datetime, timedelta
from app.models.solicitud import Solicitud
from app.models.user import User
from tests.factories import SolicitudFactory, UserFactory

class TestSolicitudModel:
    def test_solicitud_creation(self, db_session):
        """Test basic solicitud creation"""
        user = UserFactory()
        solicitud = SolicitudFactory(
            user=user,
            radicado="11001310300120240001",
            tipo="simple"
        )
        
        db_session.add(solicitud)
        db_session.commit()
        
        assert solicitud.id is not None
        assert solicitud.radicado == "11001310300120240001"
        assert solicitud.tipo == "simple"
        assert solicitud.status == "pending"
        assert solicitud.user_id == user.id
    
    def test_solicitud_validation(self, db_session):
        """Test solicitud validation rules"""
        with pytest.raises(ValueError, match="Invalid radicado format"):
            SolicitudFactory(radicado="invalid")
            
        with pytest.raises(ValueError, match="Invalid tipo"):
            SolicitudFactory(tipo="invalid_type")
    
    def test_solicitud_relationships(self, db_session):
        """Test model relationships"""
        user = UserFactory()
        solicitud = SolicitudFactory(user=user)
        
        db_session.add(solicitud)
        db_session.commit()
        
        # Test user relationship
        assert solicitud.user == user
        assert solicitud in user.solicitudes
    
    def test_processing_time_calculation(self, db_session):
        """Test processing time calculation"""
        solicitud = SolicitudFactory()
        solicitud.created_at = datetime.utcnow() - timedelta(minutes=30)
        solicitud.completed_at = datetime.utcnow()
        
        processing_time = solicitud.processing_time_minutes
        assert 29 <= processing_time <= 31  # Allow for small timing differences
    
    def test_status_transitions(self, db_session):
        """Test valid status transitions"""
        solicitud = SolicitudFactory(status="pending")
        
        # Valid transitions
        solicitud.update_status("processing")
        assert solicitud.status == "processing"
        
        solicitud.update_status("completed")
        assert solicitud.status == "completed"
        assert solicitud.completed_at is not None
        
        # Invalid transition
        with pytest.raises(ValueError, match="Invalid status transition"):
            solicitud.update_status("pending")
```

#### **🔧 Service Layer Testing**

```python
# tests/unit/test_services.py
import pytest
from unittest.mock import Mock, patch
from app.services.solicitud_service import SolicitudService
from app.schemas.solicitud import SolicitudCreate
from tests.factories import UserFactory, SolicitudFactory

class TestSolicitudService:
    def setup_method(self):
        self.mock_repository = Mock()
        self.mock_rpa_service = Mock()
        self.service = SolicitudService(
            repository=self.mock_repository,
            rpa_service=self.mock_rpa_service
        )
    
    @pytest.mark.asyncio
    async def test_create_solicitud_success(self):
        """Test successful solicitud creation"""
        # Arrange
        user = UserFactory()
        solicitud_data = SolicitudCreate(
            radicado="11001310300120240001",
            tipo="simple",
            descripcion="Test solicitud"
        )
        
        created_solicitud = SolicitudFactory(
            radicado=solicitud_data.radicado,
            tipo=solicitud_data.tipo,
            user=user
        )
        
        self.mock_repository.create.return_value = created_solicitud
        self.mock_rpa_service.queue_task.return_value = None
        
        # Act
        result = await self.service.create_solicitud(solicitud_data, user.id)
        
        # Assert
        assert result.radicado == solicitud_data.radicado
        assert result.tipo == solicitud_data.tipo
        assert result.status == "pending"
        
        self.mock_repository.create.assert_called_once()
        self.mock_rpa_service.queue_task.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_create_solicitud_invalid_radicado(self):
        """Test solicitud creation with invalid radicado"""
        user = UserFactory()
        solicitud_data = SolicitudCreate(
            radicado="invalid_radicado",
            tipo="simple"
        )
        
        with pytest.raises(ValueError, match="Invalid radicado format"):
            await self.service.create_solicitud(solicitud_data, user.id)
        
        self.mock_repository.create.assert_not_called()
        self.mock_rpa_service.queue_task.assert_not_called()
    
    @pytest.mark.asyncio
    async def test_create_solicitud_user_quota_exceeded(self):
        """Test solicitud creation when user exceeds quota"""
        user = UserFactory()
        user.current_month_usage = 100  # Assume limit is 100
        
        solicitud_data = SolicitudCreate(
            radicado="11001310300120240001",
            tipo="simple"
        )
        
        with pytest.raises(ValueError, match="Monthly quota exceeded"):
            await self.service.create_solicitud(solicitud_data, user.id)
    
    @pytest.mark.asyncio
    async def test_get_user_solicitudes_with_pagination(self):
        """Test retrieving user solicitudes with pagination"""
        user = UserFactory()
        solicitudes = [SolicitudFactory(user=user) for _ in range(5)]
        
        self.mock_repository.get_by_user_paginated.return_value = {
            'items': solicitudes[:3],
            'total': 5,
            'page': 1,
            'per_page': 3
        }
        
        result = await self.service.get_user_solicitudes(
            user_id=user.id,
            page=1,
            per_page=3
        )
        
        assert len(result['items']) == 3
        assert result['total'] == 5
        assert result['page'] == 1
        
        self.mock_repository.get_by_user_paginated.assert_called_once_with(
            user_id=user.id,
            page=1,
            per_page=3
        )
```

---

## 🔗 **Integration Testing**

### **⚛️ Frontend Integration Tests**

#### **🌐 API Integration with MSW**

```typescript
// src/__tests__/integration/solicitudes-api.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SolicitudForm } from '../../components/SolicitudForm'

const server = setupServer(
  rest.post('/api/solicitudes', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '123',
        radicado: '11001310300120240001',
        tipo: 'simple',
        status: 'pending',
        created_at: new Date().toISOString()
      })
    )
  }),
  
  rest.get('/api/solicitudes', (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            id: '123',
            radicado: '11001310300120240001',
            tipo: 'simple',
            status: 'completed'
          }
        ],
        pagination: {
          total: 1,
          page: 1,
          per_page: 20
        }
      })
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('Solicitudes API Integration', () => {
  it('should create solicitud via API', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    
    render(
      <SolicitudForm onSuccess={onSuccess} />,
      { wrapper: Wrapper }
    )
    
    // Fill form
    await user.type(
      screen.getByLabelText(/número de radicado/i),
      '11001310300120240001'
    )
    
    await user.selectOptions(
      screen.getByLabelText(/tipo/i),
      'simple'
    )
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /crear/i }))
    
    // Wait for API call to complete
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({
        id: '123',
        radicado: '11001310300120240001',
        tipo: 'simple',
        status: 'pending'
      })
    })
  })
  
  it('should handle API errors gracefully', async () => {
    server.use(
      rest.post('/api/solicitudes', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            detail: 'Invalid radicado format'
          })
        )
      })
    )
    
    const user = userEvent.setup()
    
    render(<SolicitudForm />, { wrapper: Wrapper })
    
    await user.type(
      screen.getByLabelText(/número de radicado/i),
      'invalid-radicado'
    )
    
    await user.click(screen.getByRole('button', { name: /crear/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/invalid radicado format/i)).toBeInTheDocument()
    })
  })
})
```

### **🐍 Backend Integration Tests**

#### **🌐 API Integration Tests**

```python
# tests/integration/test_api_solicitudes.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.deps import get_current_user, get_db
from tests.factories import UserFactory, SolicitudFactory

class TestSolicitudesAPI:
    def setup_method(self):
        self.client = TestClient(app)
        self.user = UserFactory()
        
        # Override dependencies
        app.dependency_overrides[get_current_user] = lambda: self.user
        app.dependency_overrides[get_db] = lambda: self.db_session
    
    def teardown_method(self):
        app.dependency_overrides.clear()
    
    def test_create_solicitud_success(self, db_session):
        """Test POST /api/solicitudes - success case"""
        solicitud_data = {
            "radicado": "11001310300120240001",
            "tipo": "simple",
            "descripcion": "Test solicitud"
        }
        
        response = self.client.post("/api/solicitudes", json=solicitud_data)
        
        assert response.status_code == 201
        data = response.json()
        
        assert data["radicado"] == solicitud_data["radicado"]
        assert data["tipo"] == solicitud_data["tipo"]
        assert data["status"] == "pending"
        assert data["user_id"] == str(self.user.id)
        assert "id" in data
        assert "created_at" in data
    
    def test_create_solicitud_invalid_radicado(self, db_session):
        """Test POST /api/solicitudes - invalid radicado"""
        solicitud_data = {
            "radicado": "invalid",
            "tipo": "simple"
        }
        
        response = self.client.post("/api/solicitudes", json=solicitud_data)
        
        assert response.status_code == 400
        assert "Invalid radicado format" in response.json()["detail"]
    
    def test_get_solicitudes_with_pagination(self, db_session):
        """Test GET /api/solicitudes - with pagination"""
        # Create test data
        solicitudes = [
            SolicitudFactory(user=self.user) for _ in range(5)
        ]
        for s in solicitudes:
            db_session.add(s)
        db_session.commit()
        
        # Test first page
        response = self.client.get("/api/solicitudes?page=1&per_page=3")
        
        assert response.status_code == 200
        data = response.json()
        
        assert len(data["data"]) == 3
        assert data["pagination"]["total"] == 5
        assert data["pagination"]["page"] == 1
        assert data["pagination"]["per_page"] == 3
        assert data["pagination"]["has_next"] is True
        assert data["pagination"]["has_previous"] is False
    
    def test_get_solicitud_by_id(self, db_session):
        """Test GET /api/solicitudes/{id}"""
        solicitud = SolicitudFactory(user=self.user)
        db_session.add(solicitud)
        db_session.commit()
        
        response = self.client.get(f"/api/solicitudes/{solicitud.id}")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["id"] == str(solicitud.id)
        assert data["radicado"] == solicitud.radicado
        assert data["user_id"] == str(self.user.id)
    
    def test_get_solicitud_not_found(self, db_session):
        """Test GET /api/solicitudes/{id} - not found"""
        response = self.client.get("/api/solicitudes/nonexistent-id")
        
        assert response.status_code == 404
        assert "Solicitud not found" in response.json()["detail"]
    
    def test_update_solicitud_status(self, db_session):
        """Test PUT /api/solicitudes/{id}/status"""
        solicitud = SolicitudFactory(user=self.user, status="pending")
        db_session.add(solicitud)
        db_session.commit()
        
        response = self.client.put(
            f"/api/solicitudes/{solicitud.id}/status",
            json={"status": "processing"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["status"] == "processing"
        assert data["updated_at"] != data["created_at"]
    
    @pytest.mark.asyncio
    async def test_delete_solicitud(self, db_session):
        """Test DELETE /api/solicitudes/{id}"""
        solicitud = SolicitudFactory(user=self.user)
        db_session.add(solicitud)
        db_session.commit()
        solicitud_id = solicitud.id
        
        response = self.client.delete(f"/api/solicitudes/{solicitud_id}")
        
        assert response.status_code == 204
        
        # Verify deletion
        get_response = self.client.get(f"/api/solicitudes/{solicitud_id}")
        assert get_response.status_code == 404
```

#### **🗄️ Database Integration Tests**

```python
# tests/integration/test_database.py
import pytest
from sqlalchemy import text
from app.models.user import User
from app.models.solicitud import Solicitud
from tests.factories import UserFactory, SolicitudFactory

class TestDatabaseIntegration:
    def test_database_connection(self, db_session):
        """Test basic database connectivity"""
        result = db_session.execute(text("SELECT 1")).scalar()
        assert result == 1
    
    def test_user_solicitudes_relationship(self, db_session):
        """Test user-solicitudes relationship"""
        user = UserFactory()
        solicitudes = [SolicitudFactory(user=user) for _ in range(3)]
        
        db_session.add(user)
        for s in solicitudes:
            db_session.add(s)
        db_session.commit()
        
        # Test relationship loading
        db_user = db_session.query(User).filter(User.id == user.id).first()
        assert len(db_user.solicitudes) == 3
        
        for solicitud in db_user.solicitudes:
            assert solicitud.user_id == user.id
    
    def test_cascade_deletion(self, db_session):
        """Test cascade deletion behavior"""
        user = UserFactory()
        solicitud = SolicitudFactory(user=user)
        
        db_session.add(user)
        db_session.add(solicitud)
        db_session.commit()
        
        solicitud_id = solicitud.id
        
        # Delete user
        db_session.delete(user)
        db_session.commit()
        
        # Verify solicitud still exists (no cascade)
        remaining_solicitud = db_session.query(Solicitud).filter(
            Solicitud.id == solicitud_id
        ).first()
        assert remaining_solicitud is not None
        assert remaining_solicitud.user_id == user.id  # Foreign key preserved
    
    def test_database_constraints(self, db_session):
        """Test database constraints"""
        user1 = UserFactory(email="test@example.com")
        user2 = UserFactory(email="test@example.com")  # Duplicate email
        
        db_session.add(user1)
        db_session.commit()
        
        # Should raise integrity error for duplicate email
        with pytest.raises(Exception):  # SQLAlchemy integrity error
            db_session.add(user2)
            db_session.commit()
    
    def test_query_performance(self, db_session):
        """Test query performance with larger datasets"""
        import time
        
        # Create test data
        users = [UserFactory() for _ in range(100)]
        solicitudes = []
        
        for user in users:
            db_session.add(user)
            solicitudes.extend([SolicitudFactory(user=user) for _ in range(10)])
        
        for solicitud in solicitudes:
            db_session.add(solicitud)
        
        db_session.commit()
        
        # Test query performance
        start_time = time.time()
        
        result = db_session.query(Solicitud).join(User).filter(
            User.email.like('%@example.com')
        ).limit(50).all()
        
        end_time = time.time()
        query_time = end_time - start_time
        
        assert len(result) <= 50
        assert query_time < 1.0  # Should complete in less than 1 second
```

---

## 🌐 **End-to-End Testing**

### **🎭 Playwright E2E Tests**

#### **🔐 Authentication Flow**

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login')
    
    // Fill login form
    await page.fill('[data-testid="email-input"]', 'admin@lexia.co')
    await page.fill('[data-testid="password-input"]', 'admin123')
    
    // Submit form
    await page.click('[data-testid="login-button"]')
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard')
    
    // Verify successful login
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
    await expect(page.locator('text=admin@lexia.co')).toBeVisible()
  })
  
  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[data-testid="email-input"]', 'admin@lexia.co')
    await page.fill('[data-testid="password-input"]', 'wrongpassword')
    
    await page.click('[data-testid="login-button"]')
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'Invalid credentials'
    )
    
    // Should remain on login page
    await expect(page).toHaveURL('/login')
  })
  
  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'admin@lexia.co')
    await page.fill('[data-testid="password-input"]', 'admin123')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
    
    // Logout
    await page.click('[data-testid="user-menu"]')
    await page.click('[data-testid="logout-button"]')
    
    // Should redirect to login
    await page.waitForURL('/login')
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible()
  })
  
  test('should persist login state after page refresh', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'admin@lexia.co')
    await page.fill('[data-testid="password-input"]', 'admin123')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
    
    // Refresh page
    await page.reload()
    
    // Should still be logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
    await expect(page).toHaveURL('/dashboard')
  })
})
```

#### **📋 Solicitud Creation Flow**

```typescript
// e2e/solicitudes.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Solicitud Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'admin@lexia.co')
    await page.fill('[data-testid="password-input"]', 'admin123')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
  })
  
  test('should create simple solicitud successfully', async ({ page }) => {
    // Navigate to create solicitud
    await page.click('[data-testid="nueva-consulta-button"]')
    await page.waitForURL('/solicitudes/create')
    
    // Fill form
    await page.selectOption('[data-testid="tipo-select"]', 'simple')
    await page.fill('[data-testid="radicado-input"]', '11001310300120240001')
    await page.fill('[data-testid="descripcion-input"]', 'Test E2E solicitud')
    
    // Submit form
    await page.click('[data-testid="crear-solicitud-button"]')
    
    // Wait for success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      'Solicitud creada exitosamente'
    )
    
    // Should redirect to solicitudes list
    await page.waitForURL('/solicitudes')
    
    // Verify solicitud appears in list
    await expect(page.locator('[data-testid="solicitud-item"]').first()).toContainText(
      '11001310300120240001'
    )
  })
  
  test('should validate radicado format', async ({ page }) => {
    await page.click('[data-testid="nueva-consulta-button"]')
    await page.waitForURL('/solicitudes/create')
    
    // Try invalid radicado
    await page.selectOption('[data-testid="tipo-select"]', 'simple')
    await page.fill('[data-testid="radicado-input"]', 'invalid-radicado')
    
    // Submit form
    await page.click('[data-testid="crear-solicitud-button"]')
    
    // Should show validation error
    await expect(page.locator('[data-testid="radicado-error"]')).toContainText(
      'Debe tener exactamente 23 dígitos'
    )
    
    // Should not submit form
    await expect(page).toHaveURL('/solicitudes/create')
  })
  
  test('should handle solicitud processing workflow', async ({ page }) => {
    // Create solicitud
    await page.click('[data-testid="nueva-consulta-button"]')
    await page.fill('[data-testid="radicado-input"]', '11001310300120240002')
    await page.selectOption('[data-testid="tipo-select"]', 'simple')
    await page.click('[data-testid="crear-solicitud-button"]')
    
    await page.waitForURL('/solicitudes')
    
    // Click on solicitud to view details
    await page.click('[data-testid="solicitud-item"]').first()
    
    // Should show processing status
    await expect(page.locator('[data-testid="status-badge"]')).toContainText('Pendiente')
    
    // Should show progress indicator
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible()
    
    // Mock status update (in real test, this would be updated by backend)
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('solicitud-update', {
        detail: { status: 'processing', progress: 50 }
      }))
    })
    
    // Should update status
    await expect(page.locator('[data-testid="status-badge"]')).toContainText('En Proceso')
    await expect(page.locator('[data-testid="progress-bar"]')).toHaveAttribute('value', '50')
  })
  
  test('should allow solicitud deletion', async ({ page }) => {
    // Navigate to solicitudes list
    await page.goto('/solicitudes')
    
    // Ensure we have at least one solicitud
    const solicitudCount = await page.locator('[data-testid="solicitud-item"]').count()
    if (solicitudCount === 0) {
      // Create one first
      await page.click('[data-testid="nueva-consulta-button"]')
      await page.fill('[data-testid="radicado-input"]', '11001310300120240003')
      await page.selectOption('[data-testid="tipo-select"]', 'simple')
      await page.click('[data-testid="crear-solicitud-button"]')
      await page.waitForURL('/solicitudes')
    }
    
    // Click delete button
    await page.click('[data-testid="delete-solicitud-button"]').first()
    
    // Confirm deletion in modal
    await expect(page.locator('[data-testid="confirm-modal"]')).toBeVisible()
    await page.click('[data-testid="confirm-delete-button"]')
    
    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      'Solicitud eliminada'
    )
    
    // Solicitud should be removed from list
    const newCount = await page.locator('[data-testid="solicitud-item"]').count()
    expect(newCount).toBe(solicitudCount - 1)
  })
})
```

#### **📊 Dashboard Functionality**

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'admin@lexia.co')
    await page.fill('[data-testid="password-input"]', 'admin123')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
  })
  
  test('should display key metrics', async ({ page }) => {
    // Verify metrics cards are visible
    await expect(page.locator('[data-testid="total-solicitudes"]')).toBeVisible()
    await expect(page.locator('[data-testid="exitosas-count"]')).toBeVisible()
    await expect(page.locator('[data-testid="en-proceso-count"]')).toBeVisible()
    await expect(page.locator('[data-testid="errores-count"]')).toBeVisible()
    
    // Verify metrics have numeric values
    const totalText = await page.locator('[data-testid="total-solicitudes"]').textContent()
    expect(totalText).toMatch(/\d+/)
  })
  
  test('should show recent solicitudes', async ({ page }) => {
    // Verify recent solicitudes section
    await expect(page.locator('[data-testid="recent-solicitudes"]')).toBeVisible()
    
    // Should have section title
    await expect(page.locator('text=Solicitudes Recientes')).toBeVisible()
    
    // If there are solicitudes, verify they're displayed
    const solicitudItems = page.locator('[data-testid="recent-solicitud-item"]')
    const count = await solicitudItems.count()
    
    if (count > 0) {
      // Verify first item has required info
      const firstItem = solicitudItems.first()
      await expect(firstItem.locator('[data-testid="radicado"]')).toBeVisible()
      await expect(firstItem.locator('[data-testid="status"]')).toBeVisible()
      await expect(firstItem.locator('[data-testid="fecha"]')).toBeVisible()
    }
  })
  
  test('should navigate to create solicitud from quick actions', async ({ page }) => {
    await page.click('[data-testid="quick-nueva-consulta"]')
    await page.waitForURL('/solicitudes/create')
    
    await expect(page.locator('[data-testid="solicitud-form"]')).toBeVisible()
  })
  
  test('should navigate to solicitudes list', async ({ page }) => {
    await page.click('[data-testid="ver-todas-solicitudes"]')
    await page.waitForURL('/solicitudes')
    
    await expect(page.locator('[data-testid="solicitudes-list"]')).toBeVisible()
  })
  
  test('should handle real-time updates', async ({ page }) => {
    // Get initial metrics
    const initialTotal = await page.locator('[data-testid="total-solicitudes"]').textContent()
    
    // Create new solicitud in another tab/window to simulate real-time update
    const context = page.context()
    const newPage = await context.newPage()
    
    await newPage.goto('/login')
    await newPage.fill('[data-testid="email-input"]', 'admin@lexia.co')
    await newPage.fill('[data-testid="password-input"]', 'admin123')
    await newPage.click('[data-testid="login-button"]')
    await newPage.waitForURL('/dashboard')
    
    await newPage.click('[data-testid="nueva-consulta-button"]')
    await newPage.fill('[data-testid="radicado-input"]', '11001310300120240004')
    await newPage.selectOption('[data-testid="tipo-select"]', 'simple')
    await newPage.click('[data-testid="crear-solicitud-button"]')
    
    // Wait for WebSocket update on original page
    await page.waitForTimeout(2000)  // Give time for real-time update
    
    // Verify metrics updated
    const updatedTotal = await page.locator('[data-testid="total-solicitudes"]').textContent()
    expect(updatedTotal).not.toBe(initialTotal)
    
    await newPage.close()
  })
})
```

---

## 🚀 **CI/CD Integration**

### **⚙️ GitHub Actions Workflow**

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install dependencies
      working-directory: frontend
      run: npm ci
    
    - name: Run linting
      working-directory: frontend
      run: npm run lint
    
    - name: Run type check
      working-directory: frontend
      run: npm run type-check
    
    - name: Run unit tests
      working-directory: frontend
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        files: frontend/coverage/lcov.info
        flags: frontend

  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: lexia_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
    
    - name: Install dependencies
      working-directory: backend
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install -r requirements-test.txt
    
    - name: Run linting
      working-directory: backend
      run: |
        flake8 app/ tests/
        black --check app/ tests/
    
    - name: Run tests
      working-directory: backend
      env:
        DATABASE_URL: postgresql://postgres:test@localhost:5432/lexia_test
        REDIS_URL: redis://localhost:6379
        SECRET_KEY: test-secret-key
      run: pytest --cov=app --cov-report=xml
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        files: backend/coverage.xml
        flags: backend

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [frontend-tests, backend-tests]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
    
    - name: Start services
      run: |
        docker-compose -f docker-compose.test.yml up -d
        sleep 30  # Wait for services to start
    
    - name: Install Playwright
      working-directory: frontend
      run: |
        npm ci
        npx playwright install
    
    - name: Run E2E tests
      working-directory: frontend
      run: npx playwright test
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-report
        path: frontend/playwright-report/
        retention-days: 30

  security-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy scan results to GitHub Security
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'
    
    - name: Run Semgrep
      uses: returntocorp/semgrep-action@v1
      with:
        config: >-
          p/security-audit
          p/secrets
          p/owasp-top-ten

  quality-gate:
    runs-on: ubuntu-latest
    needs: [frontend-tests, backend-tests, e2e-tests, security-tests]
    
    steps:
    - name: Quality Gate Check
      run: |
        echo "All tests passed successfully!"
        echo "✅ Frontend tests: Passed"
        echo "✅ Backend tests: Passed"
        echo "✅ E2E tests: Passed"
        echo "✅ Security tests: Passed"
```

### **📊 Coverage Configuration**

```javascript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'src/main.tsx',
        'src/vite-env.d.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
```

```ini
# backend/pytest.ini
[tool:pytest]
minversion = 6.0
addopts = 
    -ra -q 
    --strict-markers 
    --strict-config 
    --cov=app 
    --cov-report=term-missing 
    --cov-report=html 
    --cov-report=xml
    --cov-fail-under=80
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
markers =
    slow: marks tests as slow (deselect with '-m "not slow"')
    integration: marks tests as integration tests
    e2e: marks tests as end-to-end tests
filterwarnings =
    error
    ignore::UserWarning
    ignore::DeprecationWarning
```

---

## 📈 **Performance Testing**

### **⚡ Load Testing con Artillery**

```yaml
# performance/load-test.yml
config:
  target: 'https://api.lexia.tu-empresa.com'
  phases:
    - duration: 60
      arrivalRate: 5
      name: Warm up
    - duration: 120
      arrivalRate: 20
      name: Normal load
    - duration: 60
      arrivalRate: 50
      name: Peak load
  payload:
    path: "./users.csv"
    fields:
      - "email"
      - "password"

scenarios:
  - name: "User journey - Create solicitud"
    weight: 70
    flow:
      - post:
          url: "/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
          capture:
            - json: "$.access_token"
              as: "token"
      
      - post:
          url: "/api/solicitudes"
          headers:
            Authorization: "Bearer {{ token }}"
          json:
            radicado: "{{ $randomString() }}"
            tipo: "simple"
            descripcion: "Load test solicitud"
      
      - get:
          url: "/api/solicitudes"
          headers:
            Authorization: "Bearer {{ token }}"

  - name: "Read-only operations"
    weight: 30
    flow:
      - post:
          url: "/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
          capture:
            - json: "$.access_token"
              as: "token"
      
      - get:
          url: "/api/solicitudes"
          headers:
            Authorization: "Bearer {{ token }}"
      
      - get:
          url: "/api/analytics/dashboard"
          headers:
            Authorization: "Bearer {{ token }}"
```

### **📊 Performance Benchmarks**

```typescript
// performance/benchmarks.test.ts
import { test, expect } from '@playwright/test'

test.describe('Performance Benchmarks', () => {
  test('should load dashboard within performance budget', async ({ page }) => {
    // Start performance measurement
    await page.goto('/login')
    
    // Login
    await page.fill('[data-testid="email-input"]', 'admin@lexia.co')
    await page.fill('[data-testid="password-input"]', 'admin123')
    
    const startTime = Date.now()
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
    
    // Wait for all content to load
    await page.waitForLoadState('networkidle')
    const endTime = Date.now()
    
    const loadTime = endTime - startTime
    
    // Performance assertions
    expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
    
    // Check Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const vitals = {}
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime
            }
            if (entry.entryType === 'first-input') {
              vitals.fid = entry.processingStart - entry.startTime
            }
            if (entry.entryType === 'layout-shift') {
              vitals.cls = entry.value
            }
          })
          
          resolve(vitals)
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
      })
    })
    
    // Core Web Vitals thresholds
    expect(metrics.lcp).toBeLessThan(2500) // LCP should be < 2.5s
    expect(metrics.fid).toBeLessThan(100)  // FID should be < 100ms
    expect(metrics.cls).toBeLessThan(0.1)  // CLS should be < 0.1
  })
  
  test('should handle large datasets efficiently', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'admin@lexia.co')
    await page.fill('[data-testid="password-input"]', 'admin123')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
    
    // Navigate to solicitudes with large dataset
    await page.goto('/solicitudes?per_page=100')
    
    const startTime = Date.now()
    await page.waitForSelector('[data-testid="solicitudes-list"]')
    await page.waitForLoadState('networkidle')
    const endTime = Date.now()
    
    const loadTime = endTime - startTime
    
    // Should handle 100 items efficiently
    expect(loadTime).toBeLessThan(2000)
    
    // Verify all items loaded
    const itemCount = await page.locator('[data-testid="solicitud-item"]').count()
    expect(itemCount).toBeGreaterThan(0)
    expect(itemCount).toBeLessThanOrEqual(100)
  })
})
```

---

## 📚 **Best Practices y Guidelines**

### **✅ Testing Best Practices**

#### **🧪 Unit Tests**
```typescript
// ✅ DO - Good unit test
describe('formatCurrency', () => {
  it('should format positive numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })
  
  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })
  
  it('should handle negative numbers', () => {
    expect(formatCurrency(-123.45)).toBe('-$123.45')
  })
})

// ❌ DON'T - Testing implementation details
describe('Button', () => {
  it('should call setState when clicked', () => {
    // ❌ Testing internal state, not behavior
    const component = render(<Button />)
    // Test behavior instead
  })
})
```

#### **🔗 Integration Tests**
```python
# ✅ DO - Test the happy path and error cases
def test_create_solicitud_api():
    # Test successful creation
    response = client.post("/api/solicitudes", json=valid_data)
    assert response.status_code == 201
    
    # Test validation error
    response = client.post("/api/solicitudes", json=invalid_data)
    assert response.status_code == 400
    
    # Test authorization
    response = client.post("/api/solicitudes", json=valid_data)  # No auth
    assert response.status_code == 401

# ❌ DON'T - Test only happy path
def test_create_solicitud_api():
    response = client.post("/api/solicitudes", json=valid_data)
    assert response.status_code == 201
    # Missing error cases
```

#### **🌐 E2E Tests**
```typescript
// ✅ DO - Test critical user journeys
test('should complete solicitud creation flow', async ({ page }) => {
  // Test the complete flow from login to success
  await login(page)
  await createSolicitud(page, '11001310300120240001')
  await verifySuccess(page)
})

// ❌ DON'T - Test every tiny interaction
test('should change button color on hover', async ({ page }) => {
  // Too granular for E2E, should be unit test
})
```

### **🎯 Test Organization**

#### **📁 File Naming Conventions**
```
✅ GOOD:
Button.test.tsx          # Component test
useAuth.test.ts          # Hook test
api.integration.test.ts  # Integration test
auth.e2e.spec.ts        # E2E test

❌ BAD:
ButtonTests.tsx         # Inconsistent naming
test-button.tsx         # Wrong convention
button.spec.tsx         # For unit tests, use .test.tsx
```

#### **🔍 Test Data Management**

```typescript
// ✅ DO - Use factories for consistent test data
const createTestUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  ...overrides
})

const createTestSolicitud = (overrides = {}) => ({
  id: '1',
  radicado: '11001310300120240001',
  tipo: 'simple',
  status: 'pending',
  ...overrides
})

// ❌ DON'T - Hardcode test data in every test
test('should display user name', () => {
  const user = { id: '1', email: 'test@example.com', name: 'Test User' }
  // Duplicated data across tests
})
```

---

## 🎯 **Próximos Pasos**

### **📈 Implementación Gradual**

#### **Semana 1: Foundation**
- [ ] ✅ Setup testing tools y configuración
- [ ] ✅ Escribir tests para componentes críticos
- [ ] ✅ Configurar CI/CD básico
- [ ] ✅ Establecer métricas de coverage

#### **Semana 2: Expansion**
- [ ] 🔄 Tests de integración para APIs principales
- [ ] 🔄 E2E tests para flujos críticos
- [ ] 🔄 Performance testing setup
- [ ] 🔄 Security testing integration

#### **Semana 3: Optimization**
- [ ] 📋 Optimizar tiempos de ejecución
- [ ] 📋 Parallel test execution
- [ ] 📋 Flaky test detection y fix
- [ ] 📋 Advanced reporting

### **📊 Métricas de Éxito**

| Métrica | Estado Actual | Objetivo | Plazo |
|---------|---------------|----------|-------|
| **Unit Test Coverage** | 75% | >80% | 2 semanas |
| **Integration Coverage** | 65% | >70% | 3 semanas |
| **E2E Critical Paths** | 90% | 100% | 2 semanas |
| **CI/CD Success Rate** | 96% | >98% | 1 semana |
| **Test Execution Time** | 3.2 min | <3 min | 4 semanas |

---

<div align="center">

**🧪 ¿Listo para implementar testing de calidad?**

[![Setup Testing](https://img.shields.io/badge/🔧-Setup_Testing-blue?style=for-the-badge)](../development/testing-setup.md)
[![Write Tests](https://img.shields.io/badge/✍️-Write_Tests-green?style=for-the-badge)](../development/testing-examples.md)
[![CI/CD Integration](https://img.shields.io/badge/🚀-CI/CD_Integration-orange?style=for-the-badge)](../deployment/ci-cd.md)

---

<sub>📝 **¿Mejoras a esta estrategia?** [Editar en GitHub](https://github.com/lexia/lexia/edit/main/docs/testing/strategy.md)</sub><br/>
<sub>⭐ **¿Te ayudó?** ¡Comparte con el equipo de QA!</sub><br/>
<sub>🔄 **Última actualización:** Enero 2025 | **Mantenido por:** QA & Engineering Team</sub>

</div>