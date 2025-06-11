# 🚀 Advanced Query Components - Sistema Mejorado

Este módulo contiene una suite completa de componentes React para crear una experiencia excepcional en la configuración de consultas judiciales avanzadas. Implementa las mejores prácticas de UX/UI siguiendo el design system de ConsultaJudicial RPA.

## 📦 Componentes Principales

### 🎯 FinalImprovedAdvancedQueryForm
**Componente principal recomendado** que integra todas las mejoras de UX.

```jsx
import { FinalImprovedAdvancedQueryForm } from './components/advanced-query'

<FinalImprovedAdvancedQueryForm
  onBack={() => navigate('/dashboard')}
  onComplete={(result) => {
    if (result.action === 'dashboard') {
      navigate('/dashboard')
    }
  }}
/>
```

**Características principales:**
- ✅ Formulario de múltiples pasos con navegación fluida
- ✅ Validaciones en tiempo real con feedback inteligente
- ✅ Layout completamente responsivo (móvil first)
- ✅ Progreso visual detallado
- ✅ Ayuda contextual inteligente
- ✅ Estados de carga cinematográficos
- ✅ Feedback de éxito motivacional

## 🧩 Componentes Individuales

### 🗺️ LocationSelector
Selector avanzado de departamento y ciudad con autocompletado.

```jsx
import { LocationSelector } from './components/advanced-query'

<LocationSelector
  value={{ departamento: 'Bogotá D.C.', ciudad: 'Bogotá' }}
  onChange={(location) => setLocation(location)}
/>
```

**Características:**
- 🔍 Búsqueda en tiempo real
- 🇨🇴 Base de datos completa de Colombia
- ✅ Validación de correspondencia departamento-ciudad
- 📱 Optimizado para móvil
- 💡 Sugerencias populares primero

### 🔍 AdvancedFormValidation
Sistema de validación en tiempo real con feedback constructivo.

```jsx
import { AdvancedFormValidation } from './components/advanced-query'

<AdvancedFormValidation
  value={numeroRadicado}
  fieldType="numeroRadicado"
  showStrength={true}
  onValidation={(result) => setValidation(result)}
/>
```

**Tipos de campo soportados:**
- `numeroRadicado` - Números de radicado judicial
- `numeroRadicacion` - Números de radicación
- `nombrePersona` - Nombres de personas
- `email` - Direcciones de correo

### 💡 ContextualHelp
Ayuda contextual inteligente basada en el campo activo.

```jsx
import { ContextualHelp } from './components/advanced-query'

<ContextualHelp
  activeField="numeroRadicado"
  formData={formData}
  compact={true}
/>
```

**Incluye:**
- 📚 Documentación por campo
- 💡 Tips y mejores prácticas
- 📝 Ejemplos prácticos
- ⚠️ Advertencias importantes
- 🏗️ Estructura detallada (para radicados)

### 🔄 LoadingStates
Estados de carga cinematográficos con progreso detallado.

```jsx
import { LoadingStates } from './components/advanced-query'

<LoadingStates
  isLoading={true}
  onComplete={() => setStep('success')}
/>
```

**Características:**
- 🎬 Animaciones fluidas
- 📊 Progreso paso a paso
- ⏱️ Tiempos estimados realistas
- 💡 Tips durante la carga

### 🔍 QueryPreview
Vista previa inteligente antes de crear la consulta.

```jsx
import { QueryPreview } from './components/advanced-query'

<QueryPreview
  data={formData}
  onEdit={() => setStep('form')}
  onConfirm={() => createQuery()}
/>
```

### 🎉 FormSuccess
Feedback de éxito completo con próximos pasos.

```jsx
import { FormSuccess } from './components/advanced-query'

<FormSuccess
  solicitudData={formData}
  onViewDashboard={() => navigate('/dashboard')}
  onCreateAnother={() => resetForm()}
/>
```

## 🎨 Componentes de Layout

### 📱 ResponsiveLayout
Layout adaptativo que optimiza la experiencia en diferentes pantallas.

```jsx
import { ResponsiveLayout } from './components/advanced-query'

<ResponsiveLayout
  mainContent={<FormComponent />}
  sideContent={<HelpComponent />}
  sideContentTitle="Ayuda"
  collapsibleSide={true}
/>
```

### 📊 ProgressTracker
Seguimiento visual del progreso del formulario.

```jsx
import { ProgressTracker } from './components/advanced-query'

<ProgressTracker
  formData={formData}
  validations={validations}
  compact={false}
/>
```

### 🔧 FormFieldGroup
Agrupador de campos con numeración y estados.

```jsx
import { FormFieldGroup } from './components/advanced-query'

<FormFieldGroup
  number={1}
  title="Ubicación"
  description="Selecciona departamento y ciudad"
  required={true}
  completed={isLocationComplete}
>
  <LocationSelector />
</FormFieldGroup>
```

## 🎯 Uso Recomendado

### Implementación Básica
```jsx
import React from 'react'
import { FinalImprovedAdvancedQueryForm } from './components/advanced-query'

const NewAdvancedQueryPage = () => {
  const handleBack = () => {
    // Navegar de vuelta al dashboard
    navigate('/dashboard')
  }

  const handleComplete = (result) => {
    if (result.action === 'dashboard') {
      navigate('/dashboard')
    }
    // result.data contiene todos los datos del formulario
  }

  return (
    <div className="min-h-screen bg-bg-light py-lg">
      <FinalImprovedAdvancedQueryForm
        onBack={handleBack}
        onComplete={handleComplete}
      />
    </div>
  )
}

export default NewAdvancedQueryPage
```

### Implementación Personalizada
Si necesitas mayor control, puedes usar los componentes individuales:

```jsx
import React, { useState } from 'react'
import {
  LocationSelector,
  AdvancedFormValidation,
  ContextualHelp,
  ProgressTracker,
  ResponsiveLayout
} from './components/advanced-query'

const CustomAdvancedForm = () => {
  const [formData, setFormData] = useState({})
  const [activeField, setActiveField] = useState(null)
  const [validations, setValidations] = useState({})

  const mainContent = (
    <div className="space-y-lg">
      <LocationSelector
        value={formData.location}
        onChange={(location) => setFormData(prev => ({ ...prev, location }))}
      />
      
      <div>
        <input
          onFocus={() => setActiveField('numeroRadicado')}
          onChange={(e) => setFormData(prev => ({ ...prev, numeroRadicado: e.target.value }))}
        />
        <AdvancedFormValidation
          value={formData.numeroRadicado}
          fieldType="numeroRadicado"
          onValidation={(validation) => setValidations(prev => ({ ...prev, numeroRadicado: validation }))}
        />
      </div>
    </div>
  )

  const sideContent = (
    <div>
      <ProgressTracker formData={formData} validations={validations} />
      <ContextualHelp activeField={activeField} formData={formData} />
    </div>
  )

  return (
    <ResponsiveLayout
      mainContent={mainContent}
      sideContent={sideContent}
    />
  )
}
```

## 🎨 Personalización

### Temas y Estilos
Todos los componentes siguen el design system establecido y usan tokens CSS. Para personalizar:

```css
:root {
  --color-interactive-default: #FACC15; /* Tu color primario */
  --color-feedback-success: #10B981;    /* Color de éxito */
  /* ... otros tokens */
}
```

### Comportamiento
Cada componente acepta props de configuración:

```jsx
<ContextualHelp
  compact={true}                    // Versión compacta
  activeField="numeroRadicado"      // Campo activo
  formData={formData}              // Datos para sugerencias dinámicas
/>
```

## 🚀 Características Destacadas

### Accesibilidad
- ♿ **WCAG AA compliant** - Contraste y navegación por teclado
- 🎯 **Focus management** - Navegación lógica entre campos
- 📱 **Touch-friendly** - Tamaños mínimos de 48px en móvil
- 🔊 **Screen reader support** - Etiquetas y descripciones apropiadas

### Performance
- ⚡ **Lazy validation** - Solo valida cuando es necesario
- 🎨 **Optimized re-renders** - Memoización inteligente
- 📦 **Code splitting ready** - Componentes independientes
- 🔄 **Debounced inputs** - Evita validaciones excesivas

### UX/UI
- 🎬 **Micro-interactions** - Animaciones sutiles y efectivas
- 📱 **Mobile-first** - Diseñado primero para móvil
- 🎯 **Progressive disclosure** - Información cuando se necesita
- 💫 **Smooth transitions** - Navegación fluida entre pasos

## 📚 Dependencias

### Requeridas
- `react` (>= 16.8)
- `lucide-react` (iconos)
- Componentes UI base (`Button`, `Card`, `Badge`)
- Utilidad `cn` para clases CSS

### Opcionales
- `react-router` (para navegación)
- Animation library (para transiciones avanzadas)

## 🔧 Desarrollo

### Estructura de Archivos
```
src/components/advanced-query/
├── FinalImprovedAdvancedQueryForm.jsx  # Componente principal
├── QueryPreview.jsx                    # Vista previa
├── LoadingStates.jsx                   # Estados de carga
├── AdvancedFormValidation.jsx          # Validaciones
├── ContextualHelp.jsx                  # Ayuda contextual
├── LocationSelector.jsx                # Selector de ubicación
├── FormSuccess.jsx                     # Feedback de éxito
├── ResponsiveLayout.jsx                # Layout responsivo
├── ProgressTracker.jsx                 # Seguimiento de progreso
├── FormFieldGroup.jsx                  # Agrupador de campos
└── index.js                           # Exportaciones
```

### Testing
Cada componente está diseñado para ser testeable:

```jsx
import { render, screen } from '@testing-library/react'
import { LocationSelector } from './components/advanced-query'

test('LocationSelector shows departments', () => {
  render(<LocationSelector />)
  // ... tests
})
```

---

## 🎉 Resultado Final

Con esta implementación, has obtenido:

✅ **Experiencia de usuario excepcional** - Flujo intuitivo y sin fricciones  
✅ **Diseño responsivo completo** - Funciona perfectamente en todos los dispositivos  
✅ **Validaciones inteligentes** - Feedback en tiempo real con sugerencias constructivas  
✅ **Accesibilidad total** - Cumple estándares WCAG AA  
✅ **Performance optimizada** - Carga rápida y animaciones fluidas  
✅ **Mantenibilidad alta** - Código modular y bien documentado  
✅ **Escalabilidad garantizada** - Fácil de extender y personalizar  

**¡Tu formulario de consulta avanzada ahora ofrece una experiencia de clase mundial! 🚀**