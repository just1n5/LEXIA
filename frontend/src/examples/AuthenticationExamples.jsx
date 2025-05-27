// Ejemplo de uso de los componentes de autenticación creados

// 1. IMPORTAR PÁGINAS EN App.jsx
import LoginPage from './pages/auth/LoginPage'
import SelectAccountTypePage from './pages/auth/SelectAccountTypePage'
import RegisterPersonalPage from './pages/auth/RegisterPersonalPage'
import RegisterBusinessPage from './pages/auth/RegisterBusinessPage'

// 2. CONFIGURAR RUTAS
/*
<Routes>
  <Route path="/auth/login" element={<LoginPage />} />
  <Route path="/auth/select-account-type" element={<SelectAccountTypePage />} />
  <Route path="/auth/register/personal" element={<RegisterPersonalPage />} />
  <Route path="/auth/register/business" element={<RegisterBusinessPage />} />
</Routes>
*/

// 3. IMPORTAR COMPONENTES INDIVIDUALES (si se necesitan por separado)
import AuthTabs from './components/forms/AuthTabs'
import AccountTypeSelector from './components/forms/AccountTypeSelector'
import PersonalRegisterForm from './components/forms/PersonalRegisterForm'
import BusinessRegisterForm from './components/forms/BusinessRegisterForm'

// 4. EJEMPLO DE USO DE AuthTabs
function ExampleAuthTabs() {
  const [activeTab, setActiveTab] = useState('login')
  
  return (
    <div>
      <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'login' && <div>Contenido de Login</div>}
      {activeTab === 'register' && <div>Contenido de Registro</div>}
    </div>
  )
}

// 5. EJEMPLO DE USO DE AccountTypeSelector
function ExampleAccountSelector() {
  const [selectedType, setSelectedType] = useState('')
  
  return (
    <AccountTypeSelector 
      selectedType={selectedType}
      onTypeSelect={setSelectedType}
    />
  )
}

// 6. EJEMPLO DE VALIDACIÓN PERSONALIZADA CON REACT HOOK FORM
import { useForm } from 'react-hook-form'

function ExampleFormValidation() {
  const { register, watch, formState: { errors } } = useForm()
  const password = watch('password')
  
  return (
    <form>
      <input
        {...register('email', { 
          required: 'El correo es requerido',
          pattern: { 
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Correo electrónico inválido'
          }
        })}
      />
      
      <input
        type="password"
        {...register('password', { 
          required: 'La contraseña es requerida',
          minLength: { value: 8, message: 'Mínimo 8 caracteres' },
          pattern: { 
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
            message: 'Debe contener mayúscula, minúscula y número'
          }
        })}
      />
      
      <input
        type="password"
        {...register('confirmPassword', { 
          required: 'Confirma tu contraseña',
          validate: value => value === password || 'Las contraseñas no coinciden'
        })}
      />
    </form>
  )
}

// 7. NAVEGACIÓN PROGRAMÁTICA
import { useNavigate } from 'react-router-dom'

function ExampleNavigation() {
  const navigate = useNavigate()
  
  const handleCreateAccount = () => {
    navigate('/auth/select-account-type')
  }
  
  const handleLogin = () => {
    navigate('/dashboard')
  }
  
  return (
    <div>
      <button onClick={handleCreateAccount}>Crear Cuenta</button>
      <button onClick={handleLogin}>Ir al Dashboard</button>
    </div>
  )
}

// 8. INTEGRACIÓN CON AUTHCONTEXT
import { useAuth } from './contexts/AuthContext'

function ExampleAuthIntegration() {
  const { login, register, user, isLoading, error } = useAuth()
  
  const handleLogin = async (credentials) => {
    const result = await login(credentials)
    if (result.success) {
      // Redirigir al dashboard
    }
  }
  
  const handleRegister = async (userData) => {
    const result = await register(userData)
    if (result.success) {
      // Usuario registrado y logueado automáticamente
    }
  }
  
  return (
    <div>
      {isLoading && <div>Cargando...</div>}
      {error && <div>Error: {error}</div>}
      {user && <div>Bienvenido {user.nombre}</div>}
    </div>
  )
}

// 9. ESTILOS PERSONALIZADOS DISPONIBLES
/*
Clases CSS disponibles en globals.css:

// Contenedores
.auth-container
.auth-card

// Formularios
.form-input
.input-with-icon
.form-group

// Botones
.btn
.btn-primary
.btn-secondary
.btn-block
.btn-with-icon

// Validación
.error-text
.helper-text
.validation-message

// Estados
.loading-spinner
.skeleton
*/

// 10. ICONOS LUCIDE UTILIZADOS
/*
import { 
  Mail,           // Email input
  Lock,           // Password input
  User,           // Name input
  UserPlus,       // Create account button
  Briefcase,      // Business account
  Phone,          // Phone input
  MapPin,         // Address input
  ArrowLeft,      // Back navigation
  Check           // Feature checkmarks
} from 'lucide-react'
*/

export {
  LoginPage,
  SelectAccountTypePage,
  RegisterPersonalPage,
  RegisterBusinessPage,
  AuthTabs,
  AccountTypeSelector,
  PersonalRegisterForm,
  BusinessRegisterForm
}
