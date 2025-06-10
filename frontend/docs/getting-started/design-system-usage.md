# 🎨 Usando el Design System - LEXIA

<div align="center">
  
  **Guía práctica para usar el Design System de LEXIA**
  
  *De componentes básicos a patrones avanzados*

</div>

---

## 🎯 **Quick Start**

### **⚡ En 5 Minutos**

```tsx
// 1. Importar componentes del design system
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

// 2. Usar con props tipadas
function MiComponente() {
  return (
    <Card className="p-lg space-y-md">
      <h2 className="text-heading-h2 font-heading text-text-primary">
        Nueva Consulta
      </h2>
      
      <Input 
        placeholder="Número de radicado"
        className="w-full"
      />
      
      <Button variant="primary" size="md">
        Crear Solicitud
      </Button>
    </Card>
  )
}
```

### **📦 ¿Qué está incluido?**

- 🧩 **Componentes UI**: Button, Input, Modal, Card, Badge, etc.
- 🎨 **Design Tokens**: Colores, tipografía, espaciado
- 📐 **Layout System**: Grid, spacing, responsive utilities
- ♿ **Accesibilidad**: ARIA, keyboard navigation, contraste
- 🌙 **Dark Mode**: Soporte automático
- 📱 **Mobile-First**: Responsive por defecto

---

## 🧩 **Componentes Disponibles**

### **🔘 Buttons - Sistema Completo**

```tsx
import { Button } from '@/components/ui/Button'

// Variants (solo UNO primary por pantalla)
<Button variant="primary">Acción Principal</Button>
<Button variant="secondary">Acción Secundaria</Button>
<Button variant="ghost">Acción Sutil</Button>
<Button variant="destructive">Eliminar</Button>
<Button variant="link">Ver más</Button>

// Sizes
<Button size="sm">Pequeño</Button>
<Button size="md">Mediano (default)</Button>
<Button size="lg">Grande</Button>

// States
<Button loading>Procesando...</Button>
<Button disabled>No disponible</Button>

// Con iconos
<Button variant="primary" icon={<Plus />}>
  Nueva Consulta
</Button>

<Button variant="secondary" icon={<Download />} iconPosition="right">
  Exportar
</Button>

// Solo icono
<Button.Icon 
  variant="ghost" 
  icon={<Eye />} 
  aria-label="Ver detalles"
/>
```

**📋 Cuándo usar cada variant:**
- **Primary**: Acción más importante (crear, enviar, confirmar)
- **Secondary**: Acciones complementarias (cancelar, volver)
- **Ghost**: Acciones en listas/tablas (ver, editar)
- **Destructive**: Eliminar, borrar permanentemente
- **Link**: Enlaces que necesitan funcionalidad de botón

### **📝 Inputs y Forms**

```tsx
import { Input, Label, FormField } from '@/components/ui/Form'

// Input básico
<Input 
  type="text"
  placeholder="Número de radicado"
  value={radicado}
  onChange={(e) => setRadicado(e.target.value)}
/>

// Input con validación
<Input 
  type="email"
  error={emailError}
  helperText="Ingresa un email válido"
  required
/>

// FormField completo
<FormField>
  <Label htmlFor="radicado" required>
    Número de Radicado
  </Label>
  <Input 
    id="radicado"
    placeholder="Ej: 11001310300120240001"
    value={radicado}
    onChange={(e) => setRadicado(e.target.value)}
    error={radicadoError}
  />
  <HelperText>
    Ingresa el número completo de 23 dígitos
  </HelperText>
</FormField>

// Select dropdown
<Select 
  placeholder="Seleccionar tipo"
  options={[
    { value: 'simple', label: 'Consulta Simple' },
    { value: 'avanzada', label: 'Consulta Avanzada' }
  ]}
  value={tipo}
  onChange={setTipo}
/>
```

### **🏷️ Badges y Estados**

```tsx
import { Badge } from '@/components/ui/Badge'

// Estados semánticos
<Badge variant="success">Completada</Badge>
<Badge variant="warning">En Proceso</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Pendiente</Badge>

// Con iconos
<Badge variant="success" icon={<CheckCircle />}>
  Exitosa
</Badge>

// Diferentes tamaños
<Badge size="sm" variant="info">Pequeño</Badge>
<Badge size="md" variant="success">Mediano</Badge>
<Badge size="lg" variant="warning">Grande</Badge>
```

### **🃃 Cards y Contenedores**

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card'

// Card básica
<Card>
  <CardContent className="p-lg">
    Contenido de la card
  </CardContent>
</Card>

// Card completa con estructura
<Card className="max-w-md">
  <CardHeader>
    <h3 className="text-heading-h3 font-heading text-text-primary">
      Solicitud #2025-001
    </h3>
    <Badge variant="success">Activa</Badge>
  </CardHeader>
  
  <CardContent className="space-y-sm">
    <p className="text-body-paragraph text-text-base">
      Consulta de estado procesal para radicado 11001...
    </p>
    
    <div className="flex gap-xs text-body-auxiliary text-text-secondary">
      <span>Creada: 15 ene 2025</span>
      <span>•</span>
      <span>Última actualización: hace 2h</span>
    </div>
  </CardContent>
  
  <CardFooter className="flex gap-sm">
    <Button variant="primary" size="sm">Ver Detalles</Button>
    <Button variant="secondary" size="sm">Pausar</Button>
  </CardFooter>
</Card>
```

### **🎭 Modals y Overlays**

```tsx
import { Modal, ModalContent, ModalHeader, ModalFooter } from '@/components/ui/Modal'

function MiComponente() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Abrir Modal
      </Button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>
            <h2 className="text-heading-h2 font-heading text-text-primary">
              Confirmar Eliminación
            </h2>
          </ModalHeader>
          
          <div className="p-lg">
            <p className="text-body-paragraph text-text-base mb-md">
              ¿Estás seguro de que deseas eliminar esta solicitud?
              Esta acción no se puede deshacer.
            </p>
            
            <p className="text-body-auxiliary text-feedback-warning">
              ⚠️ Se perderán todos los datos asociados.
            </p>
          </div>
          
          <ModalFooter>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
```

---

## 🎨 **Design Tokens en Acción**

### **🌈 Sistema de Colores**

```tsx
// Usar colores semánticamente correctos
function StatusIndicator({ status }: { status: string }) {
  return (
    <div className={`
      p-sm rounded-md border
      ${status === 'success' ? 'bg-feedback-success-light border-feedback-success text-feedback-success' : ''}
      ${status === 'error' ? 'bg-feedback-error-light border-feedback-error text-feedback-error' : ''}
      ${status === 'warning' ? 'bg-feedback-warning-light border-feedback-warning text-feedback-warning' : ''}
    `}>
      {getStatusMessage(status)}
    </div>
  )
}

// Jerarquía de texto con colores
<div className="space-y-sm">
  <h1 className="text-heading-h1 font-heading text-text-primary">
    Título Principal
  </h1>
  <p className="text-body-paragraph font-sans text-text-base">
    Contenido principal con información importante.
  </p>
  <span className="text-body-auxiliary font-sans text-text-secondary">
    Metadatos o información secundaria
  </span>
</div>
```

### **📝 Tipografía Consistente**

```tsx
// Jerarquía clara de encabezados
<article className="space-y-lg">
  <h1 className="text-heading-h1 font-heading text-text-primary mb-lg">
    Documentación de API
  </h1>
  
  <section className="space-y-md">
    <h2 className="text-heading-h2 font-heading text-text-primary mb-md">
      Autenticación
    </h2>
    
    <div className="space-y-sm">
      <h3 className="text-heading-h3 font-heading text-text-primary mb-sm">
        JWT Tokens
      </h3>
      
      <p className="text-body-paragraph font-sans text-text-base mb-md">
        LEXIA utiliza JWT tokens para autenticación. Los tokens tienen
        una duración de 1 hora y pueden ser renovados usando refresh tokens.
      </p>
      
      <p className="text-body-auxiliary font-sans text-text-secondary">
        Última actualización: 15 de enero, 2025
      </p>
    </div>
  </section>
</article>
```

### **📐 Espaciado Sistemático**

```tsx
// Espaciado consistente usando tokens
<div className="container mx-auto px-md md:px-lg lg:px-xl py-lg md:py-xl">
  {/* Contenedor principal */}
  
  <section className="space-y-xl">
    {/* Separación entre secciones principales */}
    
    <div className="space-y-lg">
      {/* Separación entre subsecciones */}
      
      <Card className="p-lg space-y-md">
        {/* Contenido interno de card */}
        
        <h3 className="text-heading-h3 font-heading text-text-primary mb-sm">
          Título de Card
        </h3>
        
        <div className="space-y-xs">
          {/* Elementos relacionados muy cercanos */}
          <Label>Campo de texto</Label>
          <Input placeholder="Placeholder" />
          <HelperText>Texto de ayuda</HelperText>
        </div>
        
        <div className="flex gap-sm pt-md border-t border-border-default">
          {/* Botones con separación pequeña */}
          <Button variant="primary">Guardar</Button>
          <Button variant="secondary">Cancelar</Button>
        </div>
      </Card>
    </div>
  </section>
</div>
```

---

## 🎯 **Patrones de Uso Comunes**

### **📋 Formularios Estándar**

```tsx
import { useForm } from 'react-hook-form'

function SolicitudForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <h2 className="text-heading-h2 font-heading text-text-primary">
          Nueva Consulta Judicial
        </h2>
        <p className="text-body-paragraph text-text-secondary">
          Complete la información requerida
        </p>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-lg">
          <FormField>
            <Label htmlFor="radicado" required>
              Número de Radicado
            </Label>
            <Input
              id="radicado"
              placeholder="Ej: 11001310300120240001"
              {...register('radicado', { 
                required: 'Este campo es requerido',
                pattern: {
                  value: /^\d{23}$/,
                  message: 'Debe tener exactamente 23 dígitos'
                }
              })}
              error={errors.radicado?.message}
            />
            <HelperText>
              Ingrese el número completo de radicado judicial
            </HelperText>
          </FormField>
          
          <FormField>
            <Label htmlFor="tipo">Tipo de Consulta</Label>
            <Select
              id="tipo"
              placeholder="Seleccionar tipo"
              options={[
                { value: 'simple', label: 'Consulta Simple' },
                { value: 'avanzada', label: 'Consulta Avanzada' }
              ]}
              {...register('tipo', { required: 'Seleccione un tipo' })}
              error={errors.tipo?.message}
            />
          </FormField>
          
          <FormField>
            <Label htmlFor="descripcion">Descripción (Opcional)</Label>
            <Textarea
              id="descripcion"
              placeholder="Breve descripción del caso..."
              rows={3}
              {...register('descripcion')}
            />
          </FormField>
        </CardContent>
        
        <CardFooter className="flex gap-sm">
          <Button type="button" variant="secondary">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            loading={isSubmitting}
          >
            Crear Solicitud
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
```

### **📊 Listas y Tablas**

```tsx
function SolicitudesList({ solicitudes }: { solicitudes: Solicitud[] }) {
  return (
    <div className="space-y-md">
      <div className="flex justify-between items-center">
        <h2 className="text-heading-h2 font-heading text-text-primary">
          Solicitudes Recientes
        </h2>
        <Button variant="primary" icon={<Plus />}>
          Nueva Consulta
        </Button>
      </div>
      
      <div className="grid gap-md">
        {solicitudes.map((solicitud) => (
          <Card key={solicitud.id} className="p-lg">
            <div className="flex justify-between items-start mb-md">
              <div>
                <h3 className="text-heading-h3 font-heading text-text-primary">
                  Solicitud #{solicitud.numero}
                </h3>
                <p className="text-body-paragraph text-text-base">
                  Radicado: {solicitud.radicado}
                </p>
              </div>
              <Badge variant={getBadgeVariant(solicitud.status)}>
                {solicitud.status}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-xs text-body-auxiliary text-text-secondary">
                <span>Creada: {formatDate(solicitud.createdAt)}</span>
                <span>•</span>
                <span>Actualizada: {formatRelativeTime(solicitud.updatedAt)}</span>
              </div>
              
              <div className="flex gap-xs">
                <Button.Icon
                  variant="ghost"
                  icon={<Eye />}
                  aria-label="Ver detalles"
                  onClick={() => handleView(solicitud.id)}
                />
                <Button.Icon
                  variant="ghost"
                  icon={<Edit3 />}
                  aria-label="Editar"
                  onClick={() => handleEdit(solicitud.id)}
                />
                <Button.Icon
                  variant="ghost"
                  icon={<Trash2 />}
                  aria-label="Eliminar"
                  onClick={() => handleDelete(solicitud.id)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### **📊 Dashboard con Métricas**

```tsx
function DashboardMetrics({ metrics }: { metrics: DashboardData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
      <Card className="p-lg text-center">
        <div className="text-heading-h1 font-heading text-interactive-default mb-sm">
          {metrics.total}
        </div>
        <div className="text-body-paragraph font-sans text-text-base mb-xs">
          Total Consultas
        </div>
        <div className="text-body-auxiliary font-sans text-text-secondary">
          {metrics.totalChange > 0 ? '+' : ''}{metrics.totalChange}% vs mes anterior
        </div>
      </Card>
      
      <Card className="p-lg text-center">
        <div className="text-heading-h1 font-heading text-feedback-success mb-sm">
          {metrics.exitosas}
        </div>
        <div className="text-body-paragraph font-sans text-text-base mb-xs">
          Exitosas
        </div>
        <div className="text-body-auxiliary font-sans text-text-secondary">
          {(metrics.exitosas / metrics.total * 100).toFixed(1)}% tasa de éxito
        </div>
      </Card>
      
      <Card className="p-lg text-center">
        <div className="text-heading-h1 font-heading text-feedback-warning mb-sm">
          {metrics.enProceso}
        </div>
        <div className="text-body-paragraph font-sans text-text-base mb-xs">
          En Proceso
        </div>
        <div className="text-body-auxiliary font-sans text-text-secondary">
          Tiempo promedio: {metrics.tiempoPromedio}min
        </div>
      </Card>
      
      <Card className="p-lg text-center">
        <div className="text-heading-h1 font-heading text-feedback-error mb-sm">
          {metrics.errores}
        </div>
        <div className="text-body-paragraph font-sans text-text-base mb-xs">
          Con Errores
        </div>
        <div className="text-body-auxiliary font-sans text-text-secondary">
          {(metrics.errores / metrics.total * 100).toFixed(1)}% tasa de error
        </div>
      </Card>
    </div>
  )
}
```

---

## ✅ **Best Practices**

### **🎯 Cuándo Crear Componentes Nuevos**

#### **✅ DO - Crear componente cuando:**

```tsx
// ✅ Patrón que se repite 3+ veces
function SearchInput({ placeholder, onSearch }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
      <Input 
        className="pl-lg"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}

// ✅ Composición de múltiples componentes UI
function SolicitudCard({ solicitud }: { solicitud: Solicitud }) {
  return (
    <Card className="p-lg">
      <div className="flex justify-between items-start mb-md">
        <div>
          <h3 className="text-heading-h3 font-heading text-text-primary">
            {solicitud.titulo}
          </h3>
          <p className="text-body-auxiliary text-text-secondary">
            {solicitud.radicado}
          </p>
        </div>
        <Badge variant={getStatusVariant(solicitud.status)}>
          {solicitud.status}
        </Badge>
      </div>
      <SolicitudActions solicitud={solicitud} />
    </Card>
  )
}
```

#### **❌ DON'T - No crear componente para:**

```tsx
// ❌ Un solo uso - mejor inline
function OneTimeButton() {
  return <Button variant="primary">Solo se usa aquí</Button>
}

// ❌ Solo cambio de estilos - usar className
function RedButton({ children }: { children: ReactNode }) {
  return <Button className="bg-red-500">{children}</Button>  // ❌ Rompe design system
}

// ✅ MEJOR: usar variant existente o agregar nueva variant oficial
<Button variant="destructive">{children}</Button>
```

### **🎨 Customización vs Extensión**

#### **✅ Customización Apropiada**

```tsx
// ✅ Extend con className para casos específicos
<Button 
  variant="primary"
  className="w-full md:w-auto"  // Responsive width
>
  Responsive Button
</Button>

// ✅ Combinar componentes para casos específicos
function ConfirmButton({ onConfirm, children }: ConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false)
  
  return (
    <Button 
      variant="destructive"
      onClick={() => {
        if (confirming) {
          onConfirm()
          setConfirming(false)
        } else {
          setConfirming(true)
          setTimeout(() => setConfirming(false), 3000)
        }
      }}
    >
      {confirming ? 'Confirmar' : children}
    </Button>
  )
}
```

#### **❌ Customización Problemática**

```tsx
// ❌ Override design tokens
<Button 
  style={{ backgroundColor: '#ff0000' }}  // ❌ Rompe consistencia
  variant="primary"
>
  Don't do this
</Button>

// ❌ Usar CSS custom que rompe responsive
<Button className="!bg-red-500 !text-white">  // ❌ !important malo
  Bad practice
</Button>

// ✅ MEJOR: Agregar nueva variant al design system
// En Button.tsx:
// variant === 'custom-red' ? 'bg-custom-red text-white' : ''
```

### **🧪 Testing de Componentes**

```tsx
// ✅ Test de componente con design system
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SolicitudForm } from './SolicitudForm'

describe('SolicitudForm', () => {
  it('should render all form fields', () => {
    render(<SolicitudForm />)
    
    expect(screen.getByLabelText(/número de radicado/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tipo de consulta/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /crear solicitud/i })).toBeInTheDocument()
  })
  
  it('should show validation errors', async () => {
    const user = userEvent.setup()
    render(<SolicitudForm />)
    
    const submitButton = screen.getByRole('button', { name: /crear solicitud/i })
    await user.click(submitButton)
    
    expect(screen.getByText(/este campo es requerido/i)).toBeInTheDocument()
  })
  
  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<SolicitudForm onSubmit={onSubmit} />)
    
    const radicadoInput = screen.getByLabelText(/número de radicado/i)
    await user.type(radicadoInput, '11001310300120240001')
    
    const submitButton = screen.getByRole('button', { name: /crear solicitud/i })
    await user.click(submitButton)
    
    expect(onSubmit).toHaveBeenCalledWith({
      radicado: '11001310300120240001',
      tipo: 'simple'
    })
  })
  
  it('should show loading state during submission', async () => {
    const user = userEvent.setup()
    render(<SolicitudForm />)
    
    // Fill form and submit
    const radicadoInput = screen.getByLabelText(/número de radicado/i)
    await user.type(radicadoInput, '11001310300120240001')
    
    const submitButton = screen.getByRole('button', { name: /crear solicitud/i })
    await user.click(submitButton)
    
    // Check loading state
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByText(/procesando/i)).toBeInTheDocument()
  })
})
```

---

## 🌙 **Dark Mode Support**

### **🔄 Automático con Design Tokens**

```tsx
// ✅ Colores que se adaptan automáticamente
function ThemeAwareComponent() {
  return (
    <div className="bg-bg-canvas text-text-primary border border-border-default">
      {/* Se adapta automáticamente a dark/light mode */}
      
      <h2 className="text-heading-h2 font-heading text-text-primary">
        Título que se ve bien en ambos modos
      </h2>
      
      <p className="text-body-paragraph text-text-base">
        Contenido que mantiene contraste apropiado
      </p>
      
      <Button variant="primary">
        Botón que funciona en ambos temas
      </Button>
    </div>
  )
}
```

### **🎯 Testing Dark Mode**

```tsx
// Test para verificar dark mode
import { render } from '@testing-library/react'

describe('Dark Mode', () => {
  it('should adapt to dark mode', () => {
    // Simular dark mode
    document.documentElement.classList.add('dark')
    
    render(<MiComponente />)
    
    const elemento = screen.getByTestId('theme-aware-element')
    expect(elemento).toHaveClass('dark:bg-bg-dark-canvas')
    
    // Cleanup
    document.documentElement.classList.remove('dark')
  })
})
```

---

## 📱 **Responsive Design**

### **📐 Mobile-First Approach**

```tsx
// ✅ Mobile-first responsive design
function ResponsiveLayout() {
  return (
    <div className="
      // Mobile (default)
      px-md py-lg space-y-md
      
      // Tablet (md: 768px+)
      md:px-lg md:py-xl md:space-y-lg
      
      // Desktop (lg: 1024px+)  
      lg:px-xl lg:py-2xl lg:space-y-xl
      
      // Large screens (xl: 1280px+)
      xl:px-2xl xl:max-w-7xl xl:mx-auto
    ">
      
      {/* Grid responsive */}
      <div className="
        grid gap-md
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      ">
        {solicitudes.map(solicitud => (
          <SolicitudCard key={solicitud.id} solicitud={solicitud} />
        ))}
      </div>
      
      {/* Botones responsive */}
      <div className="
        flex flex-col gap-sm
        md:flex-row md:justify-between md:items-center
      ">
        <Button className="w-full md:w-auto" variant="primary">
          Nueva Consulta
        </Button>
        <Button className="w-full md:w-auto" variant="secondary">
          Ver Historial
        </Button>
      </div>
    </div>
  )
}
```

---

## 🚨 **Errores Comunes y Soluciones**

### **❌ Errores Frecuentes**

#### **1. Romper la Jerarquía de Botones**
```tsx
// ❌ MALO: Múltiples botones primary
<div className="flex gap-sm">
  <Button variant="primary">Guardar</Button>    {/* ❌ */}
  <Button variant="primary">Enviar</Button>     {/* ❌ */}
  <Button variant="primary">Exportar</Button>   {/* ❌ */}
</div>

// ✅ BUENO: Solo uno primary
<div className="flex gap-sm">
  <Button variant="secondary">Guardar</Button>
  <Button variant="primary">Enviar</Button>      {/* ✅ Acción principal */}
  <Button variant="ghost">Exportar</Button>
</div>
```

#### **2. No Usar Tokens de Espaciado**
```tsx
// ❌ MALO: Valores hardcoded
<div style={{ margin: '14px', padding: '22px' }}>
  <div style={{ marginBottom: '8px' }}>
    Contenido
  </div>
</div>

// ✅ BUENO: Tokens del design system
<div className="m-md p-lg">
  <div className="mb-sm">
    Contenido
  </div>
</div>
```

#### **3. Colores Incorrectos Semánticamente**
```tsx
// ❌ MALO: Color que confunde significado
<Badge className="bg-red-500 text-white">
  Proceso Completado  {/* ❌ Rojo para éxito? */}
</Badge>

// ✅ BUENO: Color semánticamente correcto
<Badge variant="success">
  Proceso Completado  {/* ✅ Verde para éxito */}
</Badge>
```

#### **4. Falta de Accesibilidad**
```tsx
// ❌ MALO: Sin labels para screen readers
<Button.Icon icon={<Trash2 />} />  {/* ❌ Qué hace este botón? */}

// ✅ BUENO: Con aria-label descriptivo
<Button.Icon 
  icon={<Trash2 />} 
  aria-label="Eliminar solicitud"  {/* ✅ Descriptivo */}
/>
```

### **🔧 Soluciones Rápidas**

#### **ESLint Rules Personalizadas**
```json
// .eslintrc.js - Rules para design system
{
  "rules": {
    "no-hardcoded-colors": "error",
    "require-aria-label-for-icon-buttons": "error",
    "max-primary-buttons-per-component": "error"
  }
}
```

#### **VS Code Snippets**
```json
// .vscode/snippets/lexia-components.json
{
  "Form Field": {
    "prefix": "formfield",
    "body": [
      "<FormField>",
      "  <Label htmlFor=\"$1\" required>$2</Label>",
      "  <Input",
      "    id=\"$1\"",
      "    placeholder=\"$3\"",
      "    {...register('$1', { required: 'Este campo es requerido' })}",
      "    error={errors.$1?.message}",
      "  />",
      "  <HelperText>$4</HelperText>",
      "</FormField>"
    ]
  }
}
```

---

## 📚 **Referencias y Próximos Pasos**

### **🔗 Documentación Relacionada**

- **🎨 [Design System Overview](../design-system/overview.md)**: Principios y filosofía
- **🌈 [Color Palette](../design-system/color-palette.md)**: Sistema completo de colores
- **📝 [Typography](../design-system/typography.md)**: Tipografía y jerarquía
- **📐 [Spacing & Layout](../design-system/spacing-layout.md)**: Sistema de espaciado
- **🔘 [Button System](../design-system/button-system.md)**: Documentación completa de botones

### **🧪 Testing y Quality**

- **🧪 [Frontend Testing](../testing/frontend-testing.md)**: Testing de componentes
- **♿ [Accessibility Testing](../testing/accessibility.md)**: Verificar accesibilidad
- **🎨 [Visual Regression](../testing/visual.md)**: Testing visual automático

### **🚀 Advanced Topics**

- **🧩 [Component Patterns](../development/component-patterns.md)**: Patrones avanzados
- **⚡ [Performance](../development/performance.md)**: Optimización de componentes
- **🔄 [State Management](../development/state-management.md)**: State con design system

---

<div align="center">

**🎨 ¿Listo para crear interfaces consistentes?**

[![Component Library](https://img.shields.io/badge/🧩-Component_Library-blue?style=for-the-badge)](../development/component-patterns.md)
[![Design Tokens](https://img.shields.io/badge/🎨-Design_Tokens-purple?style=for-the-badge)](../design-system/overview.md)
[![Examples](https://img.shields.io/badge/📝-Examples-green?style=for-the-badge)](../examples/ui-components.md)

---

<sub>📝 **¿Mejoras a esta guía?** [Editar en GitHub](https://github.com/lexia/lexia/edit/main/docs/getting-started/design-system-usage.md)</sub><br/>
<sub>⭐ **¿Te ayudó?** ¡Comparte con el equipo de frontend!</sub><br/>
<sub>🔄 **Última actualización:** Enero 2025 | **Mantenido por:** Frontend Team</sub>

</div>