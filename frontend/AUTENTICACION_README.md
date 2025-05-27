# Páginas de Autenticación - Fase 2

Este documento describe las páginas de autenticación migradas desde el prototipo HTML a componentes React funcionales.

## 📁 Archivos Creados

### Componentes de Formularios
- `frontend/src/components/forms/AuthTabs.jsx` - Tabs para alternar entre login/registro
- `frontend/src/components/forms/AccountTypeSelector.jsx` - Selector de tipo de cuenta (Personal/Empresa)
- `frontend/src/components/forms/PersonalRegisterForm.jsx` - Formulario de registro para personas naturales
- `frontend/src/components/forms/BusinessRegisterForm.jsx` - Formulario de registro para empresas

### Páginas
- `frontend/src/pages/auth/LoginPage.jsx` - Página principal con login y registro
- `frontend/src/pages/auth/SelectAccountTypePage.jsx` - Página de selección de tipo de cuenta
- `frontend/src/pages/auth/RegisterPersonalPage.jsx` - Página de registro para personas naturales
- `frontend/src/pages/auth/RegisterBusinessPage.jsx` - Página de registro para empresas

## 🎨 Diseño Visual

Las páginas mantienen **exactamente** el mismo diseño del prototipo HTML original:

- **Colores**: Sistema de colores amarillo (#FACC15) con variantes
- **Tipografía**: Inter para texto, Poppins para encabezados
- **Espaciado**: Sistema de spacing consistente (xs, sm, md, lg, xl)
- **Iconos**: Iconos Lucide React idénticos al prototipo
- **Layout**: Estructura de cards, formularios y navegación exacta

## 🚀 Funcionalidades Implementadas

### 1. Página de Login (`LoginPage.jsx`)
- ✅ Tabs funcionales entre Login/Registro
- ✅ Formulario de login con validación
- ✅ Integración con AuthContext
- ✅ Enlace "Olvidaste tu contraseña"
- ✅ Botón para crear cuenta nueva
- ✅ Estados de loading y error

### 2. Selección de Tipo de Cuenta (`SelectAccountTypePage.jsx`)
- ✅ Cards interactivas para Personal/Empresa
- ✅ Efectos hover y selección visual
- ✅ Navegación automática a formularios específicos
- ✅ Lista de características por tipo de cuenta

### 3. Registro Persona Natural (`RegisterPersonalPage.jsx`)
- ✅ Formulario completo con validación en tiempo real
- ✅ Secciones: Información Personal + Información de Cuenta
- ✅ Validación de contraseñas coincidentes
- ✅ Checkbox términos y condiciones
- ✅ Integración con backend FastAPI

### 4. Registro Empresa (`RegisterBusinessPage.jsx`)
- ✅ Formulario empresarial con tres secciones
- ✅ Información de empresa, representante legal y cuenta
- ✅ Campos específicos: NIT/RUT, razón social, dirección
- ✅ Validación completa y registro automático

## 🔧 Integraciones

### React Hook Form
- Validación en tiempo real
- Manejo de errores específicos
- Estados de loading durante envío
- Validaciones personalizadas (passwords, emails, documentos)

### AuthContext
- Método `login()` para autenticación
- Método `register()` para registro de usuarios
- Estados globales de autenticación
- Manejo de errores y loading

### React Router
- Navegación entre páginas de autenticación
- Links funcionales "Volver" y "Ya tienes cuenta"
- Redirección automática después del registro/login

### Backend FastAPI
- Endpoint `/auth/login` para autenticación
- Endpoint `/auth/register` para registro
- Integración con tipos de cuenta (personal/empresa)
- Manejo de datos de representante legal para empresas

## 🎯 Rutas Configuradas

```
/auth/login                 → LoginPage (con tabs)
/auth/select-account-type   → SelectAccountTypePage
/auth/register/personal     → RegisterPersonalPage
/auth/register/business     → RegisterBusinessPage
```

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Grid Responsive**: Cards se adaptan a pantalla (1 col mobile, 2 cols desktop)
- **Formularios**: Campos y botones se ajustan correctamente
- **Navegación**: Enlaces y botones accesibles en todos los tamaños

## 🔒 Validaciones Implementadas

### Generales
- Campos requeridos
- Formato de email válido
- Longitud mínima de texto

### Contraseñas
- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos un número
- Confirmación de contraseña coincidente

### Documentos
- Solo números para cédulas
- Formato NIT/RUT para empresas
- Validación de longitud

### Teléfonos
- Exactamente 10 dígitos
- Solo números

## 🚀 Uso

1. **Iniciar en Login**: Navegar a `/auth/login`
2. **Crear cuenta**: Click en tab "Registrarse" → "Crear nueva cuenta"
3. **Seleccionar tipo**: Elegir Personal o Empresa
4. **Completar formulario**: Llenar datos según tipo seleccionado
5. **Registro automático**: Después del registro exitoso, login automático

## ✨ Características Especiales

- **Diseño idéntico** al prototipo HTML original
- **Animaciones suaves** en transiciones y hovers
- **Estados visuales** claros (loading, error, success)
- **Navegación intuitiva** con breadcrumbs y enlaces
- **Validación en vivo** que guía al usuario
- **Integración completa** con el sistema de autenticación

## 🎨 Variables CSS Utilizadas

El proyecto mantiene las mismas variables CSS del prototipo para consistencia:

```css
--color-interactive-default: #FACC15
--color-text-primary: #1F2937
--color-text-secondary: #6B7280
--color-bg-light: #F9FAFB
--color-bg-canvas: #FFFFFF
--transition-default: all 0.2s ease-in-out
```

## 📦 Dependencias Requeridas

- `react-hook-form` - Manejo de formularios
- `react-router-dom` - Navegación
- `lucide-react` - Iconos
- `tailwindcss` - Estilos

Todas las páginas están listas para usar y mantienen la funcionalidad y diseño exactos del prototipo HTML original.
