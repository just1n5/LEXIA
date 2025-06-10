# 🧩 Patrones de Componentes - LEXIA Frontend

## 🎯 **Visión General**

Este documento establece los patrones arquitectónicos y mejores prácticas para el desarrollo de componentes React en LEXIA. Estos patrones garantizan consistencia, reutilización y mantenibilidad en toda la aplicación.

## 🏗️ **Arquitectura de Componentes**

### **Estructura de Carpetas**
```
src/components/
├── ui/                 # Componentes básicos del Design System
├── forms/              # Componentes específicos de formularios
├── layout/             # Componentes de estructura de página
├── dashboard/          # Componentes específicos del dashboard
├── solicitudes/        # Componentes del dominio de solicitudes
├── historial/          # Componentes del dominio de historial
├── auth/               # Componentes de autenticación
├── common/             # Componentes comunes reutilizables
└── enhanced/           # Versiones mejoradas de componentes
```

### **Jerarquía de Componentes**
Seguimos la metodología **Atomic Design** adaptada:

1. **🔹 Átomos**: Componentes UI básicos (`Button`, `Input`, `Badge`)
2. **🔸 Moléculas**: Combinaciones simples (`SearchInput`, `FormField`)
3. **🔷 Organismos**: Secciones complejas (`Header`, `SolicitudesTable`)
4. **📄 Templates**: Layouts de página (`Layout`, `AuthLayout`)

---

## 🎨 **Patrones de Implementación**

### **1. 📝 Patrón Base de Componente**

Todos los componentes deben seguir esta estructura base:

```jsx
import React from 'react'
import { cn } from '../../utils/cn'

/**
 * Descripción del componente y su propósito
 * 
 * @param {Object} props - Props del componente
 * @param {string} props.variant - Variante visual del componente
 * @param {string} props.size - Tamaño del componente
 * @param {string} props.className - Clases CSS adicionales
 */
const ComponentName = React.forwardRef(({ 
  // Props con valores por defecto
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
  children,
  ...props 
}, ref) => {
  
  // 1. Clases base
  const baseClasses = cn(
    'clase-base-1 clase-base-2',
    'transicion-default focus-ring'
  )
  
  // 2. Variantes
  const variantClasses = {
    default: 'variante-default',
    primary: 'variante-primary',
    secondary: 'variante-secondary'
  }
  
  // 3. Tamaños
  const sizeClasses = {
    sm: 'tamaño-small',
    md: 'tamaño-medium',
    lg: 'tamaño-large'
  }
  
  // 4. Estados
  const stateClasses = cn(
    disabled && 'estado-disabled',
    // otros estados...
  )
  
  // 5. Combinar clases
  const componentClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    stateClasses,
    className
  )
  
  return (
    <div 
      ref={ref}
      className={componentClasses}
      {...props}
    >
      {children}
    </div>
  )
})

ComponentName.displayName = 'ComponentName'

export default ComponentName
```

### **2. 🔧 Patrón de Subcomponentes**

Para componentes complejos, usa el patrón de subcomponentes:

```jsx
// Componente principal
const Card = React.forwardRef((props, ref) => {
  // Implementación del Card
})

// Subcomponentes
const CardHeader = React.forwardRef((props, ref) => {
  // Implementación del header
})

const CardTitle = React.forwardRef((props, ref) => {
  // Implementación del título
})

const CardContent = React.forwardRef((props, ref) => {
  // Implementación del contenido
})

const CardFooter = React.forwardRef((props, ref) => {
  // Implementación del footer
})

// Asignación de subcomponentes
Card.Header = CardHeader
Card.Title = CardTitle
Card.Content = CardContent
Card.Footer = CardFooter

export default Card
```

**Uso del patrón:**
```jsx
<Card>
  <Card.Header>
    <Card.Title>Título del Card</Card.Title>
  </Card.Header>
  <Card.Content>
    Contenido principal
  </Card.Content>
  <Card.Footer>
    Acciones del card
  </Card.Footer>
</Card>
```

### **3. ⚡ Patrón de Componentes de Conveniencia**

Crea shortcuts para casos de uso comunes:

```jsx
// Componente base
const Button = React.forwardRef((props, ref) => {
  // Implementación base
})

// Componentes de conveniencia
Button.Primary = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="primary" {...props} />
))

Button.Secondary = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="secondary" {...props} />
))

Button.Icon = React.forwardRef(({ icon, ...props }, ref) => (
  <Button ref={ref} variant="ghost" className="p-2" {...props}>
    {icon}
  </Button>
))
```

**Beneficios:**
- ✅ Código más limpio y legible
- ✅ Menos props repetitivas
- ✅ IntelliSense mejorado
- ✅ Patrones de uso claros

---

## 🎯 **Patrones por Tipo de Componente**

### **🔹 Componentes UI (Átomos)**

#### **Características Clave:**
```jsx
const Button = React.forwardRef(({ 
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  block = false,
  as: Component = 'button',
  className = '',
  ...props 
}, ref) => {
  // Implementación siguiendo Design System
  
  // Manejo de estados de loading
  const LoadingIcon = () => (
    <svg className="animate-spin w-4 h-4" ...>
      {/* SVG del spinner */}
    </svg>
  )
  
  // Props de accesibilidad
  const componentProps = {
    ref,
    className: buttonClasses,
    disabled: disabled || loading,
    'aria-disabled': disabled || loading,
    'aria-busy': loading,
    ...props
  }
  
  return (
    <Component {...componentProps}>
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </Component>
  )
})
```

#### **Checklist UI Component:**
- ✅ **React.forwardRef** para compatibilidad con refs
- ✅ **Design System compliance** usando tokens CSS
- ✅ **Múltiples variantes** (primary, secondary, ghost, etc.)
- ✅ **Múltiples tamaños** (sm, md, lg)
- ✅ **Estados manejados** (disabled, loading, focus, hover)
- ✅ **Accesibilidad** (ARIA labels, keyboard navigation)
- ✅ **Polimorfismo** (prop `as` para diferentes elementos)

### **🔸 Componentes de Formulario (Moléculas)**

#### **Patrón de Field Wrapper:**
```jsx
const FormField = ({ 
  label,
  required = false,
  error = null,
  helpText = null,
  children,
  className = ''
}) => (
  <div className={cn('space-y-xs', className)}>
    {/* Label */}
    {label && (
      <label className="text-body-paragraph font-medium text-text-primary">
        {label}
        {required && <span className="text-feedback-error ml-1">*</span>}
      </label>
    )}
    
    {/* Input */}
    {children}
    
    {/* Help text o error */}
    {(helpText || error) && (
      <p className={cn(
        'text-body-auxiliary',
        error ? 'text-feedback-error' : 'text-text-secondary'
      )}>
        {error || helpText}
      </p>
    )}
  </div>
)
```

#### **Patrón de Validación en Tiempo Real:**
```jsx
const ValidatedInput = ({ 
  validation,
  onValidation,
  ...props 
}) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState(null)
  const [isValid, setIsValid] = useState(false)
  
  const handleChange = (e) => {
    const newValue = e.target.value
    setValue(newValue)
    
    // Validación en tiempo real
    if (validation) {
      const validationResult = validation(newValue)
      setError(validationResult.error)
      setIsValid(validationResult.valid)
      onValidation?.(validationResult)
    }
  }
  
  return (
    <FormField error={error}>
      <Input 
        value={value}
        onChange={handleChange}
        className={cn(
          isValid && 'border-feedback-success',
          error && 'border-feedback-error'
        )}
        {...props}
      />
    </FormField>
  )
}
```

### **🔷 Componentes de Dominio (Organismos)**

#### **Patrón de Tabla con Estado:**
```jsx
const SolicitudesTable = ({ 
  data = [],
  loading = false,
  error = null,
  onSort,
  onFilter,
  onAction
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [selectedItems, setSelectedItems] = useState([])
  
  // Estados de carga
  if (loading) return <TableSkeleton />
  if (error) return <ErrorState error={error} />
  if (!data.length) return <EmptyState />
  
  return (
    <div className="space-y-md">
      {/* Controles de tabla */}
      <TableControls 
        selectedCount={selectedItems.length}
        onBulkAction={handleBulkAction}
      />
      
      {/* Tabla principal */}
      <div className="border border-border-default rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-light">
            {/* Headers con ordenamiento */}
          </thead>
          <tbody>
            {data.map(item => (
              <SolicitudRow 
                key={item.id}
                data={item}
                selected={selectedItems.includes(item.id)}
                onSelect={handleSelect}
                onAction={onAction}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      <TablePagination {...paginationProps} />
    </div>
  )
}
```

---

## 🔄 **Patrones de Estado**

### **1. 🔄 Loading States**

#### **Skeleton Loading:**
```jsx
const ComponentSkeleton = () => (
  <div className="animate-pulse space-y-md">
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
  </div>
)

const MyComponent = ({ loading, data }) => {
  if (loading) return <ComponentSkeleton />
  return <ActualComponent data={data} />
}
```

#### **Progressive Loading:**
```jsx
const ProgressiveComponent = ({ data }) => {
  const [loadingStates, setLoadingStates] = useState({
    initial: true,
    processing: false,
    complete: false
  })
  
  return (
    <div>
      {loadingStates.initial && <InitialLoader />}
      {loadingStates.processing && <ProcessingSpinner />}
      {loadingStates.complete && <SuccessIndicator />}
      <ComponentContent data={data} />
    </div>
  )
}
```

### **2. ❌ Error States**

#### **Error Boundary Pattern:**
```jsx
const ComponentErrorBoundary = ({ children, fallback }) => (
  <ErrorBoundary
    fallback={fallback || <DefaultErrorFallback />}
    onError={(error, errorInfo) => {
      console.error('Component Error:', error, errorInfo)
      // Log to monitoring service
    }}
  >
    {children}
  </ErrorBoundary>
)
```

#### **Error Recovery Pattern:**
```jsx
const ResilientComponent = ({ data, onRetry }) => {
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  
  if (error) {
    return (
      <ErrorState 
        error={error}
        onRetry={() => {
          setError(null)
          setRetryCount(prev => prev + 1)
          onRetry?.()
        }}
        canRetry={retryCount < 3}
      />
    )
  }
  
  return <ComponentContent data={data} />
}
```

### **3. 📭 Empty States**

```jsx
const EmptyState = ({ 
  icon: Icon = FileX,
  title = "No hay datos",
  description = "No se encontraron elementos para mostrar",
  action = null,
  className = ''
}) => (
  <div className={cn(
    'flex flex-col items-center justify-center py-2xl text-center',
    className
  )}>
    <div className="w-16 h-16 bg-bg-light rounded-full flex items-center justify-center mb-lg">
      <Icon size={32} className="text-text-secondary" />
    </div>
    <h3 className="text-heading-h3 font-heading text-text-primary mb-sm">
      {title}
    </h3>
    <p className="text-body-paragraph text-text-secondary mb-lg max-w-md">
      {description}
    </p>
    {action}
  </div>
)
```

---

## 📱 **Patrones Responsive**

### **1. 📐 Mobile-First Approach**

```jsx
const ResponsiveComponent = ({ data }) => (
  <div className="space-y-md">
    {/* Mobile: Stack vertical */}
    <div className="block lg:hidden">
      <MobileStackedView data={data} />
    </div>
    
    {/* Desktop: Layout horizontal */}
    <div className="hidden lg:block">
      <DesktopGridView data={data} />
    </div>
  </div>
)
```

### **2. 🔧 Breakpoint Utilities**

```jsx
import { useMediaQuery } from '../hooks/useMediaQuery'

const AdaptiveComponent = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')
  
  if (isMobile) return <MobileLayout />
  if (isTablet) return <TabletLayout />
  return <DesktopLayout />
}
```

---

## 🧪 **Patrones de Testing**

### **1. 🧩 Component Testing**

```jsx
// ComponentName.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ComponentName from './ComponentName'

describe('ComponentName', () => {
  it('renders correctly with default props', () => {
    render(<ComponentName />)
    expect(screen.getByRole('...')).toBeInTheDocument()
  })
  
  it('handles variant prop correctly', () => {
    render(<ComponentName variant="primary" />)
    expect(screen.getByRole('...')).toHaveClass('variant-primary')
  })
  
  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<ComponentName onClick={handleClick} />)
    fireEvent.click(screen.getByRole('...'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
  
  it('is accessible', () => {
    render(<ComponentName aria-label="Test component" />)
    expect(screen.getByLabelText('Test component')).toBeInTheDocument()
  })
})
```

### **2. 🎭 Visual Testing**

```jsx
// ComponentName.stories.jsx
export default {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    docs: {
      description: {
        component: 'Descripción del componente para Storybook'
      }
    }
  }
}

export const Default = {
  args: {}
}

export const Variants = () => (
  <div className="space-y-md">
    <ComponentName variant="primary">Primary</ComponentName>
    <ComponentName variant="secondary">Secondary</ComponentName>
    <ComponentName variant="ghost">Ghost</ComponentName>
  </div>
)

export const States = () => (
  <div className="space-y-md">
    <ComponentName>Normal</ComponentName>
    <ComponentName disabled>Disabled</ComponentName>
    <ComponentName loading>Loading</ComponentName>
  </div>
)
```

---

## ♿ **Patrones de Accesibilidad**

### **1. 🔍 ARIA y Semantics**

```jsx
const AccessibleComponent = ({ 
  ariaLabel,
  ariaDescribedBy,
  role = 'button',
  ...props 
}) => {
  const componentId = useId()
  
  return (
    <div>
      <button
        id={componentId}
        role={role}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        Content
      </button>
      
      {ariaDescribedBy && (
        <div id={ariaDescribedBy} className="sr-only">
          Additional description for screen readers
        </div>
      )}
    </div>
  )
}
```

### **2. ⌨️ Keyboard Navigation**

```jsx
const KeyboardNavigableComponent = ({ items, onSelect }) => {
  const [focusedIndex, setFocusedIndex] = useState(0)
  
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => Math.min(prev + 1, items.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        onSelect(items[focusedIndex])
        break
    }
  }
  
  return (
    <div onKeyDown={handleKeyDown} role="listbox" tabIndex={0}>
      {items.map((item, index) => (
        <div
          key={item.id}
          role="option"
          aria-selected={index === focusedIndex}
          className={cn(
            'p-md cursor-pointer',
            index === focusedIndex && 'bg-interactive-hover'
          )}
        >
          {item.content}
        </div>
      ))}
    </div>
  )
}
```

---

## 🚀 **Patrones de Optimización**

### **1. ⚡ React.memo y useMemo**

```jsx
// Memorizar componente para evitar re-renders innecesarios
const OptimizedComponent = React.memo(({ 
  data, 
  onAction 
}) => {
  // Memorizar cálculos costosos
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computedValue: expensiveComputation(item)
    }))
  }, [data])
  
  // Memorizar callbacks
  const handleAction = useCallback((id) => {
    onAction(id)
  }, [onAction])
  
  return (
    <div>
      {processedData.map(item => (
        <ItemComponent 
          key={item.id}
          data={item}
          onAction={handleAction}
        />
      ))}
    </div>
  )
})
```

### **2. 🔄 Lazy Loading**

```jsx
// Lazy loading de componentes pesados
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

const ComponentWithLazyLoading = () => (
  <Suspense fallback={<ComponentSkeleton />}>
    <HeavyComponent />
  </Suspense>
)

// Lazy loading de imágenes
const LazyImage = ({ src, alt, ...props }) => {
  const [imageRef, inView] = useInView({ threshold: 0.1 })
  const [loaded, setLoaded] = useState(false)
  
  return (
    <div ref={imageRef} {...props}>
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={cn(
            'transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  )
}
```

---

## 🎯 **Do's and Don'ts**

### **✅ DO - Mejores Prácticas**

✅ **Usar React.forwardRef para componentes UI**
```jsx
// ✅ Correcto
const Button = React.forwardRef((props, ref) => (
  <button ref={ref} {...props} />
))
```

✅ **Seguir el Design System**
```jsx
// ✅ Correcto: Usar tokens del design system
<div className="bg-bg-canvas text-text-primary p-md" />
```

✅ **Implementar todos los estados requeridos**
```jsx
// ✅ Correcto: Manejar loading, error, empty
{loading && <Skeleton />}
{error && <ErrorState />}
{!data.length && <EmptyState />}
{data.length > 0 && <DataView />}
```

✅ **Documentar componentes con JSDoc**
```jsx
/**
 * Botón reutilizable que sigue el design system
 * @param {string} variant - Variante visual del botón
 * @param {boolean} loading - Si el botón está en estado de carga
 */
const Button = ({ variant, loading, ...props }) => {
  // Implementación
}
```

✅ **Usar subcomponentes para APIs limpias**
```jsx
// ✅ Correcto: API limpia y semántica
<Card>
  <Card.Header>
    <Card.Title>Título</Card.Title>
  </Card.Header>
  <Card.Content>Contenido</Card.Content>
</Card>
```

### **❌ DON'T - Evitar**

❌ **No hardcodear estilos**
```jsx
// ❌ Incorrecto: Estilos hardcoded
<div style={{padding: '16px', color: '#374151'}} />

// ✅ Correcto: Usar tokens
<div className="p-md text-text-base" />
```

❌ **No crear componentes monolíticos**
```jsx
// ❌ Incorrecto: Componente que hace demasiado
const MegaComponent = () => {
  // 500 líneas de código
  // Múltiples responsabilidades
  // Difícil de mantener y testear
}

// ✅ Correcto: Dividir en componentes más pequeños
const ComponentePrincipal = () => (
  <div>
    <Header />
    <Content />
    <Footer />
  </div>
)
```

❌ **No ignorar la accesibilidad**
```jsx
// ❌ Incorrecto: Sin ARIA labels
<button onClick={handleClick}>
  <Icon />
</button>

// ✅ Correcto: Con accesibilidad
<button 
  onClick={handleClick}
  aria-label="Eliminar elemento"
  role="button"
>
  <Icon aria-hidden="true" />
</button>
```

❌ **No mezclar lógica de negocio con presentación**
```jsx
// ❌ Incorrecto: Lógica de negocio en componente UI
const Button = ({ onSaveSolicitud }) => {
  const handleClick = async () => {
    try {
      await api.saveSolicitud()  // ❌ Lógica de negocio
      showSuccessMessage()
    } catch (error) {
      handleApiError(error)
    }
  }
  
  return <button onClick={handleClick}>Guardar</button>
}

// ✅ Correcto: Separar responsabilidades
const SaveButton = ({ onSave, loading }) => (
  <Button 
    variant="primary"
    loading={loading}
    onClick={onSave}
  >
    Guardar
  </Button>
)
```

---

## 🔧 **Herramientas y Utilities**

### **1. 🎨 Class Name Utility**

```javascript
// utils/cn.js - Utility para combinar clases
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Uso en componentes
const Button = ({ variant, className, ...props }) => (
  <button 
    className={cn(
      'base-classes',
      variant === 'primary' && 'primary-classes',
      variant === 'secondary' && 'secondary-classes',
      className  // Permite override de clases
    )}
    {...props}
  />
)
```

### **2. 🔍 Props Interface Utility**

```typescript
// types/component-props.ts
interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

interface VariantProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
}

interface SizeProps {
  size?: 'sm' | 'md' | 'lg'
}

// Composición de interfaces
interface ButtonProps extends 
  BaseComponentProps, 
  VariantProps, 
  SizeProps {
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}
```

### **3. 🪝 Custom Hooks**

```jsx
// hooks/useComponentState.js
export const useComponentState = (initialState = {}) => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
    ...initialState
  })
  
  const setLoading = (loading) => setState(prev => ({ ...prev, loading }))
  const setError = (error) => setState(prev => ({ ...prev, error, loading: false }))
  const setData = (data) => setState(prev => ({ ...prev, data, loading: false, error: null }))
  
  return { state, setLoading, setError, setData }
}
```

---

## 📚 **Ejemplos Completos**

### **📄 Ejemplo: Card Component Completo**

```jsx
import React from 'react'
import { cn } from '../../utils/cn'

const Card = React.forwardRef(({ 
  children,
  variant = 'default',
  size = 'md',
  hoverable = false,
  selected = false,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = cn(
    'bg-bg-canvas rounded-lg border transition-default',
    'focus-within:ring-2 focus-within:ring-interactive-default focus-within:ring-opacity-20'
  )
  
  const variantClasses = {
    default: 'border-border-default',
    elevated: 'border-border-default shadow-md',
    outlined: 'border-2 border-border-default',
    interactive: cn(
      'border-border-default cursor-pointer',
      'hover:border-interactive-hover hover:shadow-md'
    )
  }
  
  const sizeClasses = {
    sm: 'p-sm',
    md: 'p-md', 
    lg: 'p-lg',
    xl: 'p-xl'
  }
  
  const stateClasses = cn(
    hoverable && 'hover:shadow-md hover:border-interactive-hover',
    selected && 'border-interactive-default bg-yellow-50 ring-2 ring-interactive-default ring-opacity-20'
  )
  
  return (
    <div 
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        stateClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// Subcomponentes
Card.Header = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn('flex items-center justify-between pb-md mb-md border-b border-border-default', className)}
    {...props}
  />
))

Card.Title = React.forwardRef(({ as: Component = 'h3', className, ...props }, ref) => (
  <Component 
    ref={ref}
    className={cn('text-heading-h3 font-heading text-text-primary', className)}
    {...props}
  />
))

Card.Content = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-md', className)} {...props} />
))

Card.Footer = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn('flex items-center gap-sm pt-md mt-md border-t border-border-default', className)}
    {...props}
  />
))

export default Card
```

---

## 📚 **Recursos Adicionales**

- [🎨 Design System Overview](../design-system/overview.md) - Principios generales
- [🌈 Color Palette Guide](../design-system/color-palette.md) - Sistema de colores
- [🔘 Button System Guide](../design-system/button-system.md) - Componente Button completo
- [📐 Spacing & Layout](../design-system/spacing-layout.md) - Sistema de espaciado
- [🧪 Testing Strategy](../testing/strategy.md) - Estrategias de testing
- [React Documentation](https://react.dev/) - Documentación oficial de React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilizado

**Código fuente**: `src/components/`  
**Última actualización**: Enero 2025  
**Versión**: 1.0.0  
**Mantenido por**: Equipo Frontend