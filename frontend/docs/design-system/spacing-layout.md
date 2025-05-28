# 📐 Espaciado y Layout - ConsultaJudicial RPA

## 🎯 **Filosofía del Espaciado**

El sistema de espaciado en ConsultaJudicial RPA está diseñado para crear jerarquía visual, mejorar la legibilidad y proporcionar una experiencia usuario consistente. Utilizamos un sistema modular basado en múltiplos de 4px que garantiza coherencia matemática y visual en todos los componentes.

## 📏 **Sistema de Espaciado Base**

### **Escala Modular de 4px**
Todos los valores de espaciado siguen múltiplos de 4px para mantener consistencia pixel-perfect.

```css
/* Tokens de Espaciado */
--spacing-xs: 4px;     /* 0.25rem */
--spacing-sm: 8px;     /* 0.5rem */
--spacing-md: 16px;    /* 1rem */
--spacing-lg: 24px;    /* 1.5rem */
--spacing-xl: 32px;    /* 2rem */
--spacing-2xl: 48px;   /* 3rem */
--spacing-3xl: 64px;   /* 4rem */
```

### **Escala Visual**

| Token | Valor | Rem | Uso Principal |
|-------|-------|-----|---------------|
| `xs` | 4px | 0.25rem | Separación mínima, border-radius pequeño |
| `sm` | 8px | 0.5rem | Padding interno, separación entre elementos relacionados |
| `md` | 16px | 1rem | **Base** - Espaciado estándar, padding de componentes |
| `lg` | 24px | 1.5rem | Separación entre secciones relacionadas |
| `xl` | 32px | 2rem | Separación entre secciones principales |
| `2xl` | 48px | 3rem | Separación entre bloques grandes |
| `3xl` | 64px | 4rem | Separación máxima, márgenes de página |

### **Implementación en Tailwind**
```css
/* Clases Tailwind correspondientes */
.space-xs   /* 4px  - gap-1, p-1, m-1 */
.space-sm   /* 8px  - gap-2, p-2, m-2 */
.space-md   /* 16px - gap-4, p-4, m-4 */
.space-lg   /* 24px - gap-6, p-6, m-6 */
.space-xl   /* 32px - gap-8, p-8, m-8 */
.space-2xl  /* 48px - gap-12, p-12, m-12 */
.space-3xl  /* 64px - gap-16, p-16, m-16 */
```

## 🏗️ **Principios de Layout**

### **1. Jerarquía Visual por Espaciado**
El espaciado comunica relaciones entre elementos:

- **Elementos relacionados**: Espaciado menor (xs, sm)
- **Secciones relacionadas**: Espaciado medio (md, lg)
- **Bloques independientes**: Espaciado mayor (xl, 2xl, 3xl)

### **2. Consistencia Vertical y Horizontal**
Mantenemos el mismo sistema tanto para espaciado vertical como horizontal:

```jsx
{/* Consistencia en ambas direcciones */}
<div className="p-md space-y-md">
  <section className="mb-lg">
    <h2 className="mb-sm">Título</h2>
    <p className="mb-md">Contenido</p>
  </section>
</div>
```

### **3. Mobile-First Responsive**
El espaciado se adapta progresivamente:

```jsx
{/* Escalado responsivo */}
<div className="p-sm md:p-md lg:p-lg xl:p-xl">
  <div className="space-y-sm md:space-y-md lg:space-y-lg">
    {/* Contenido */}
  </div>
</div>
```

## 🎯 **Patrones de Espaciado por Contexto**

### **📄 Páginas (Page-Level Spacing)**

#### **Márgenes de Página**
```jsx
{/* Contenedor principal de página */}
<main className="container mx-auto px-md md:px-lg lg:px-xl py-lg md:py-xl">
  {/* Contenido de la página */}
</main>
```

#### **Separación entre Secciones Principales**
```jsx
<main className="space-y-2xl md:space-y-3xl">
  <section className="hero-section">
    {/* Hero content */}
  </section>
  
  <section className="dashboard-section">
    {/* Dashboard content */}
  </section>
  
  <section className="footer-section">
    {/* Footer content */}
  </section>
</main>
```

### **🏗️ Secciones (Section-Level Spacing)**

#### **Dentro de una Sección**
```jsx
<section className="py-xl px-md space-y-lg">
  {/* Título de sección */}
  <div className="mb-lg">
    <h2 className="text-heading-h2 font-heading text-text-primary mb-sm">
      Solicitudes Activas
    </h2>
    <p className="text-body-paragraph text-text-secondary">
      Gestiona tus consultas judiciales en curso
    </p>
  </div>
  
  {/* Contenido de la sección */}
  <div className="space-y-md">
    {/* Cards o componentes */}
  </div>
</section>
```

### **🧩 Componentes (Component-Level Spacing)**

#### **Cards**
```jsx
<Card className="p-lg space-y-md">
  {/* Header del card */}
  <div className="flex justify-between items-start mb-md">
    <h3 className="text-heading-h3 font-heading text-text-primary">
      Solicitud #2025-001
    </h3>
    <Badge variant="success">Activa</Badge>
  </div>
  
  {/* Contenido principal */}
  <div className="space-y-sm">
    <p className="text-body-paragraph text-text-base">
      Consulta de estado procesal para radicado 11001...
    </p>
    
    <div className="flex gap-sm text-body-auxiliary text-text-secondary">
      <span>Creada: 15 ene 2025</span>
      <span>•</span>
      <span>Última actualización: hace 2h</span>
    </div>
  </div>
  
  {/* Acciones del card */}
  <div className="flex gap-sm pt-md border-t border-border-default">
    <Button variant="primary" size="sm">
      Ver Detalles
    </Button>
    <Button variant="secondary" size="sm">
      Pausar
    </Button>
  </div>
</Card>
```

#### **Formularios**
```jsx
<form className="space-y-xl">
  {/* Título del formulario */}
  <div className="mb-lg">
    <h2 className="text-heading-h2 font-heading text-text-primary mb-sm">
      Nueva Consulta Judicial
    </h2>
    <p className="text-body-paragraph text-text-secondary">
      Complete la información requerida para crear una nueva consulta
    </p>
  </div>
  
  {/* Grupo de campos */}
  <fieldset className="space-y-lg">
    <legend className="text-heading-h3 font-heading text-text-primary mb-md">
      Información Básica
    </legend>
    
    {/* Campo individual */}
    <div className="space-y-xs">
      <label className="text-body-paragraph font-medium text-text-primary">
        Número de Radicado
      </label>
      <input 
        className="w-full p-sm border border-border-default rounded-md"
        placeholder="Ej: 11001310300120240001"
      />
      <p className="text-body-auxiliary text-text-secondary">
        Ingresa el número completo de radicado judicial
      </p>
    </div>
  </fieldset>
  
  {/* Botones de acción */}
  <div className="flex gap-sm pt-lg border-t border-border-default">
    <Button variant="primary">Crear Solicitud</Button>
    <Button variant="secondary">Cancelar</Button>
  </div>
</form>
```

## 📱 **Layout Responsive**

### **Sistema de Grid Responsivo**

#### **Grid Container Base**
```jsx
{/* Container principal responsivo */}
<div className="container mx-auto px-md md:px-lg lg:px-xl xl:px-2xl">
  {/* Contenido */}
</div>
```

#### **Grid de Contenido**
```jsx
{/* Grid de 12 columnas adaptativo */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md md:gap-lg">
  {/* Items del grid */}
  <Card className="col-span-1">
    {/* Contenido del card */}
  </Card>
</div>
```

### **Breakpoints y Espaciado**

| Breakpoint | Espaciado Base | Padding Container | Gap Grid |
|------------|----------------|-------------------|----------|
| Mobile (< 768px) | `sm` - `md` | `px-md` | `gap-sm` |
| Tablet (768px+) | `md` - `lg` | `px-lg` | `gap-md` |
| Desktop (1024px+) | `lg` - `xl` | `px-xl` | `gap-lg` |
| Large (1280px+) | `xl` - `2xl` | `px-2xl` | `gap-xl` |

### **Patrones de Layout Común**

#### **Layout de Dashboard**
```jsx
<div className="min-h-screen bg-bg-light">
  {/* Header */}
  <header className="bg-bg-canvas border-b border-border-default px-md md:px-lg py-md">
    {/* Header content */}
  </header>
  
  {/* Main content area */}
  <div className="flex">
    {/* Sidebar */}
    <aside className="hidden lg:block w-64 bg-bg-canvas border-r border-border-default p-lg">
      {/* Sidebar content */}
    </aside>
    
    {/* Main content */}
    <main className="flex-1 p-md md:p-lg lg:p-xl">
      <div className="max-w-7xl mx-auto space-y-xl">
        {/* Page content */}
      </div>
    </main>
  </div>
</div>
```

## 🎨 **Espaciado en Componentes Específicos**

### **🔘 Botones**
```jsx
{/* Espaciado interno de botones */}
<Button size="sm" className="px-sm py-xs">   {/* Pequeño */}
<Button size="md" className="px-md py-sm">   {/* Mediano (default) */}
<Button size="lg" className="px-lg py-md">   {/* Grande */}

{/* Grupos de botones */}
<div className="flex gap-sm">
  <Button variant="primary">Guardar</Button>
  <Button variant="secondary">Cancelar</Button>
</div>
```

### **🏷️ Badges y Tags**
```jsx
{/* Espaciado interno de badges */}
<Badge className="px-sm py-xs">
  Estado
</Badge>

{/* Grupos de badges */}
<div className="flex flex-wrap gap-xs">
  <Badge variant="success">Activa</Badge>
  <Badge variant="info">Urgente</Badge>
  <Badge variant="warning">Revisión</Badge>
</div>
```

### **📝 Inputs y Forms**
```jsx
{/* Espaciado de campos de formulario */}
<div className="space-y-lg">
  <div className="space-y-xs">
    <label className="block text-body-paragraph font-medium text-text-primary">
      Campo de Texto
    </label>
    <input className="w-full px-sm py-sm border border-border-default rounded-md" />
    <p className="text-body-auxiliary text-text-secondary">
      Texto de ayuda
    </p>
  </div>
</div>
```

## ♿ **Espaciado y Accesibilidad**

### **Touch Targets Mínimos**
```css
/* Tamaño mínimo táctil para accesibilidad */
.touch-target {
  min-height: 48px; /* spacing-3xl */
  min-width: 48px;
}
```

```jsx
{/* Aplicación en componentes */}
<Button className="min-h-[48px] px-md py-sm touch-target">
  Botón Accesible
</Button>
```

## 🎯 **Do's and Don'ts**

### **✅ DO - Mejores Prácticas**

✅ **Usar múltiplos de 4px**
```jsx
// Correcto: Usar tokens de espaciado
<div className="p-md space-y-lg">
  {/* Contenido */}
</div>
```

✅ **Mantener consistencia en patrones similares**
```jsx
// Correcto: Mismo patrón para todos los cards
<Card className="p-lg space-y-md">
  <h3 className="mb-sm">Título</h3>
  <p className="mb-md">Contenido</p>
</Card>
```

### **❌ DON'T - Evitar**

❌ **No usar valores hardcoded**
```jsx
// Incorrecto: Valores hardcoded
<div style={{padding: '14px', margin: '22px'}}>
  {/* Contenido */}
</div>

// Correcto: Usar tokens
<div className="p-md m-lg">
  {/* Contenido */}
</div>
```

❌ **No ser inconsistente en patrones similares**
```jsx
// Incorrecto: Inconsistencia entre cards similares
<Card className="p-lg">          {/* Card 1 */}
<Card className="p-sm">          {/* Card 2 - diferente padding */}

// Correcto: Consistencia
<Card className="p-lg">          {/* Todos los cards iguales */}
<Card className="p-lg">
```

## 🔧 **Implementación Técnica**

### **CSS Custom Properties**
```css
:root {
  /* Espaciado Base */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */
  
  /* Container Widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}
```

### **React Hook para Espaciado Responsivo**
```jsx
// Hook personalizado para manejar espaciado responsivo
const useResponsiveSpacing = () => {
  const [spacing, setSpacing] = useState('md')
  
  useEffect(() => {
    const updateSpacing = () => {
      const width = window.innerWidth
      if (width < 768) setSpacing('sm')
      else if (width < 1024) setSpacing('md')
      else setSpacing('lg')
    }
    
    updateSpacing()
    window.addEventListener('resize', updateSpacing)
    return () => window.removeEventListener('resize', updateSpacing)
  }, [])
  
  return spacing
}
```

### **Componente Layout Helper**
```jsx
// Componente reutilizable para layouts consistentes
const Layout = ({ 
  variant = 'default',
  children,
  spacing = 'md',
  responsive = true,
  className = ''
}) => {
  const variants = {
    page: 'min-h-screen bg-bg-light',
    section: 'py-xl px-md',
    card: 'bg-bg-canvas rounded-lg border border-border-default',
    form: 'space-y-xl',
    grid: 'grid gap-md',
    stack: `space-y-${spacing}`
  }
  
  const responsiveClasses = responsive ? {
    page: 'px-md md:px-lg lg:px-xl',
    section: 'py-md md:py-lg lg:py-xl px-sm md:px-md lg:px-lg',
    card: 'p-sm md:p-md lg:p-lg',
    grid: 'gap-sm md:gap-md lg:gap-lg'
  } : {}
  
  const baseClasses = variants[variant] || variants.default
  const responsiveClass = responsive ? responsiveClasses[variant] || '' : ''
  
  return (
    <div className={`${baseClasses} ${responsiveClass} ${className}`}>
      {children}
    </div>
  )
}
```

## 📊 **Métricas y Testing**

### **Targets de Performance**
- **CLS (Cumulative Layout Shift)**: <0.1
- **Consistencia visual**: 100% de componentes usando tokens
- **Responsive breakpoints**: Sin contenido cortado en ningún breakpoint
- **Touch targets**: Mínimo 48px en móvil

### **Testing del Sistema de Espaciado**
```jsx
// Test de consistencia de espaciado
const spacingTokens = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

const validateSpacing = (component) => {
  spacingTokens.forEach(token => {
    // Verificar que todos los espaciados usen tokens válidos
    expect(component).not.toHaveStyleRule('margin', /[0-9]+px/)
    expect(component).not.toHaveStyleRule('padding', /[0-9]+px/)
  })
}
```

---

## 📚 **Recursos Adicionales**

- [🎨 Design System Overview](./overview.md) - Principios generales
- [🌈 Color Palette Guide](./color-palette.md) - Sistema de colores
- [📝 Typography Guide](./typography.md) - Jerarquía tipográfica
- [🔘 Button System](./button-system.md) - Implementación en botones
- [Tailwind CSS Spacing](https://tailwindcss.com/docs/spacing) - Documentación oficial
- [Material Design Layout](https://material.io/design/layout/) - Principios de layout
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Estándares de accesibilidad

**Última actualización**: Enero 2025  
**Versión**: 1.0.0  
**Mantenido por**: Equipo de Frontend