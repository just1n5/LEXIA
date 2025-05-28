# 📝 Tipografía - ConsultaJudicial RPA

## 🎯 **Filosofía Tipográfica**

La tipografía en ConsultaJudicial RPA está diseñada para maximizar la legibilidad y crear una jerarquía de información clara en el contexto profesional jurídico. Priorizamos la claridad sobre la decoración, garantizando que los usuarios puedan procesar información compleja de manera eficiente y sin fatiga visual.

## 🔤 **Familias Tipográficas**

### **Inter - Fuente de Cuerpo**
```css
font-family: 'Inter', system-ui, sans-serif;
```

**Características:**
- ✅ **Legibilidad excepcional** en pantallas de cualquier resolución
- ✅ **Optimizada para UI** con espaciado consistente entre caracteres
- ✅ **Soporta números tabulares** para alineación en tablas
- ✅ **Amplio soporte de caracteres** incluyendo acentos en español

**Casos de Uso:**
- Texto de cuerpo principal
- Contenido de formularios
- Tablas de datos
- Información detallada

### **Poppins - Fuente de Encabezados**
```css
font-family: 'Poppins', system-ui, sans-serif;
```

**Características:**
- ✅ **Autoridad visual** apropiada para títulos
- ✅ **Contraste con Inter** sin ser discordante
- ✅ **Excelente legibilidad** en tamaños grandes
- ✅ **Personalidad profesional** pero accesible

**Casos de Uso:**
- Títulos principales (H1, H2)
- Encabezados de sección
- Botones importantes
- Navegación principal

## 📏 **Escala Tipográfica**

### **Sistema de Jerarquía de 6 Niveles**

#### **H1 - Título Principal** 
```css
/* Tokens CSS */
font-size: var(--text-heading-h1);
/* Tailwind */
text-heading-h1 font-heading
/* Valores */
font-size: 2rem;      /* 32px */
line-height: 1.25;    /* 40px */
font-weight: 700;     /* Bold */
font-family: Poppins;
```

**Casos de Uso:**
- ✅ **Títulos de página principales** (Dashboard, Crear Solicitud)
- ✅ **Encabezados de modales importantes**
- ✅ **Títulos de onboarding**
- ❌ **NO usar** más de uno por página
- ❌ **NO usar** en componentes pequeños

**Ejemplos:**
```jsx
<h1 className="text-heading-h1 font-heading text-text-primary mb-lg">
  Consulta Judicial RPA
</h1>

<h1 className="text-heading-h1 font-heading text-text-primary">
  Crear Nueva Solicitud
</h1>
```

#### **H2 - Título de Sección**
```css
/* Tokens CSS */
font-size: var(--text-heading-h2);
/* Tailwind */
text-heading-h2 font-heading
/* Valores */
font-size: 1.5rem;    /* 24px */
line-height: 1.33;    /* 32px */
font-weight: 600;     /* Semi-bold */
font-family: Poppins;
```

**Casos de Uso:**
- ✅ **Títulos de secciones principales** (Solicitudes Activas, Historial)
- ✅ **Encabezados de cards importantes**
- ✅ **Títulos de pasos en formularios**
- ✅ **Puede haber múltiples** por página

**Ejemplos:**
```jsx
<h2 className="text-heading-h2 font-heading text-text-primary mb-md">
  Solicitudes Activas
</h2>

<Card>
  <h2 className="text-heading-h2 font-heading text-text-primary">
    Configuración de Consulta
  </h2>
</Card>
```

#### **H3 - Subtítulo de Grupo**
```css
/* Tokens CSS */
font-size: var(--text-heading-h3);
/* Tailwind */
text-heading-h3 font-heading
/* Valores */
font-size: 1.25rem;   /* 20px */
line-height: 1.4;     /* 28px */
font-weight: 600;     /* Semi-bold */
font-family: Poppins;
```

**Casos de Uso:**
- ✅ **Subtítulos dentro de secciones**
- ✅ **Encabezados de grupos de formulario**
- ✅ **Títulos de cards secundarios**
- ✅ **Labels de secciones en configuración**

**Ejemplos:**
```jsx
<div className="space-y-md">
  <h3 className="text-heading-h3 font-heading text-text-primary">
    Datos del Demandante
  </h3>
  {/* Formulario */}
</div>

<Card>
  <h3 className="text-heading-h3 font-heading text-text-primary mb-sm">
    Últimas Consultas
  </h3>
  {/* Contenido */}
</Card>
```

#### **H4 - Título de Componente**
```css
/* Tokens CSS */
font-size: var(--text-heading-h4);
/* Tailwind */
text-heading-h4 font-heading
/* Valores */
font-size: 1.125rem;  /* 18px */
line-height: 1.5;     /* 27px */
font-weight: 500;     /* Medium */
font-family: Poppins;
```

**Casos de Uso:**
- ✅ **Títulos de componentes específicos**
- ✅ **Labels destacados en formularios**
- ✅ **Encabezados de listas**
- ✅ **Títulos de steps en wizards**

**Ejemplos:**
```jsx
<div className="form-section">
  <h4 className="text-heading-h4 font-heading text-text-primary mb-sm">
    Información de Contacto
  </h4>
  {/* Campos del formulario */}
</div>

<ProgressSteps>
  <h4 className="text-heading-h4 font-heading text-text-primary">
    Paso 1: Datos Básicos
  </h4>
</ProgressSteps>
```

#### **Paragraph - Texto de Cuerpo**
```css
/* Tokens CSS */
font-size: var(--text-body-paragraph);
/* Tailwind */
text-body-paragraph font-sans
/* Valores */
font-size: 1rem;      /* 16px */
line-height: 1.6;     /* 25.6px */
font-weight: 400;     /* Regular */
font-family: Inter;
```

**Casos de Uso:**
- ✅ **Texto principal** de la aplicación
- ✅ **Descripciones y explicaciones**
- ✅ **Contenido de cards**
- ✅ **Texto de ayuda contextual**

**Ejemplos:**
```jsx
<p className="text-body-paragraph font-sans text-text-base">
  Esta consulta verificará el estado actual del proceso judicial 
  en tiempo real utilizando el número de radicado proporcionado.
</p>

<Card>
  <p className="text-body-paragraph font-sans text-text-base">
    El proceso automatizado puede tomar entre 2-5 minutos dependiendo 
    de la respuesta del servidor judicial.
  </p>
</Card>
```

#### **Auxiliary - Texto Auxiliar**
```css
/* Tokens CSS */
font-size: var(--text-body-auxiliary);
/* Tailwind */
text-body-auxiliary font-sans
/* Valores */
font-size: 0.875rem;  /* 14px */
line-height: 1.5;     /* 21px */
font-weight: 400;     /* Regular */
font-family: Inter;
```

**Casos de Uso:**
- ✅ **Metadatos** (fechas, timestamps, autores)
- ✅ **Texto de ayuda** y explicaciones secundarias
- ✅ **Labels de estado** en badges
- ✅ **Texto en tablas** con información complementaria

**Ejemplos:**
```jsx
<div className="flex justify-between items-center">
  <span className="text-body-auxiliary font-sans text-text-secondary">
    Última actualización: hace 5 minutos
  </span>
</div>

<Badge variant="info">
  <span className="text-body-auxiliary font-sans">
    En proceso
  </span>
</Badge>
```

#### **Links - Enlaces**
```css
/* Tokens CSS */
font-size: var(--text-link);
/* Tailwind */
text-link font-sans
/* Valores */
font-size: 1rem;      /* 16px */
line-height: 1.6;     /* 25.6px */
font-weight: 500;     /* Medium */
font-family: Inter;
```

**Casos de Uso:**
- ✅ **Enlaces en texto corrido**
- ✅ **Navegación secundaria**
- ✅ **Call-to-actions textuales**
- ✅ **Enlaces de ayuda**

**Ejemplos:**
```jsx
<p className="text-body-paragraph font-sans text-text-base">
  Para más información, consulta nuestra 
  <a href="/help" className="text-link font-sans text-interactive-default hover:text-interactive-hover underline">
    guía de ayuda
  </a>.
</p>

<nav>
  <a href="/settings" className="text-link font-sans text-text-base hover:text-interactive-default">
    Configuración
  </a>
</nav>
```

## 🌙 **Adaptaciones para Modo Oscuro**

### **Ajustes de Peso Tipográfico**
En modo oscuro, algunos pesos se ajustan para mantener legibilidad óptima:

```css
/* Modo oscuro - pesos ligeramente reducidos */
.dark .text-heading-h1 { font-weight: 600; } /* En lugar de 700 */
.dark .text-heading-h2 { font-weight: 600; } /* Se mantiene */
.dark .text-heading-h3 { font-weight: 500; } /* En lugar de 600 */
```

**Razón:** Las fuentes claras sobre fondos oscuros pueden parecer más "pesadas" visualmente.

### **Implementación Automática**
```jsx
// Los tokens dark se aplican automáticamente con class="dark"
<h1 className="text-dark-heading-h1 font-heading text-text-dark-primary">
  Título en Modo Oscuro
</h1>
```

## 📐 **Espaciado Tipográfico**

### **Espaciado Vertical Entre Elementos**

#### **Títulos Principales (H1)**
```css
margin-bottom: 1.5rem; /* 24px - spacing-lg */
```

#### **Títulos de Sección (H2)**
```css
margin-top: 2rem;      /* 32px - spacing-xl */
margin-bottom: 1rem;   /* 16px - spacing-md */
```

#### **Subtítulos (H3, H4)**
```css
margin-top: 1.5rem;    /* 24px - spacing-lg */
margin-bottom: 0.5rem; /* 8px - spacing-sm */
```

#### **Párrafos**
```css
margin-bottom: 1rem;   /* 16px - spacing-md */
```

**Ejemplos Prácticos:**
```jsx
{/* Sección típica con espaciado correcto */}
<section className="space-y-md">
  <h2 className="text-heading-h2 font-heading text-text-primary mb-md">
    Configuración de Consultas
  </h2>
  
  <div className="space-y-sm">
    <h3 className="text-heading-h3 font-heading text-text-primary mb-sm">
      Parámetros Básicos
    </h3>
    
    <p className="text-body-paragraph font-sans text-text-base mb-md">
      Configura los parámetros básicos para las consultas automatizadas.
    </p>
  </div>
</section>
```

## 🎨 **Combinaciones con Colores**

### **Jerarquía Visual por Color**

#### **Texto Principal**
```jsx
{/* Títulos principales - Text Primary */}
<h1 className="text-heading-h1 font-heading text-text-primary">
  Título Principal
</h1>

{/* Texto de cuerpo - Text Base */}
<p className="text-body-paragraph font-sans text-text-base">
  Contenido principal de la aplicación.
</p>
```

#### **Texto Secundario**
```jsx
{/* Información auxiliar - Text Secondary */}
<span className="text-body-auxiliary font-sans text-text-secondary">
  Creado el 15 de enero, 2025
</span>

{/* Enlaces - Interactive Color */}
<a href="#" className="text-link font-sans text-interactive-default">
  Ver detalles
</a>
```

#### **Estados de Feedback**
```jsx
{/* Mensaje de éxito */}
<p className="text-body-paragraph font-sans text-feedback-success">
  ✅ Solicitud procesada exitosamente
</p>

{/* Mensaje de error */}
<p className="text-body-paragraph font-sans text-feedback-error">
  ❌ Error al procesar la solicitud
</p>

{/* Advertencia */}
<p className="text-body-auxiliary font-sans text-feedback-warning">
  ⚠️ Verificación requerida
</p>
```

## 📱 **Responsividad Tipográfica**

### **Escalado por Breakpoint**

#### **Mobile First**
Los tamaños base están optimizados para móvil:

```jsx
{/* Base mobile-first */}
<h1 className="text-heading-h1 font-heading">
  Título Principal
</h1>

{/* Escalado en tablet y desktop */}
<h1 className="text-heading-h1 md:text-4xl lg:text-5xl font-heading">
  Título Responsivo
</h1>
```

#### **Ajustes Recomendados**
```css
/* Mobile (base) */
h1: 2rem     /* 32px */
h2: 1.5rem   /* 24px */
h3: 1.25rem  /* 20px */

/* Tablet (md:) */
h1: 2.25rem  /* 36px */
h2: 1.75rem  /* 28px */
h3: 1.5rem   /* 24px */

/* Desktop (lg:) */
h1: 2.5rem   /* 40px */
h2: 2rem     /* 32px */
h3: 1.75rem  /* 28px */
```

## 🧩 **Patrones de Uso por Componente**

### **Cards**
```jsx
<Card>
  {/* Título del card */}
  <h3 className="text-heading-h3 font-heading text-text-primary mb-sm">
    Solicitud #2025-001
  </h3>
  
  {/* Contenido principal */}
  <p className="text-body-paragraph font-sans text-text-base mb-md">
    Consulta de estado procesal para radicado 11001...
  </p>
  
  {/* Metadatos */}
  <div className="flex justify-between">
    <span className="text-body-auxiliary font-sans text-text-secondary">
      Creada: 15 ene 2025
    </span>
    <Badge variant="success">
      <span className="text-body-auxiliary font-sans">Activa</span>
    </Badge>
  </div>
</Card>
```

### **Formularios**
```jsx
<form className="space-y-lg">
  {/* Título del formulario */}
  <h2 className="text-heading-h2 font-heading text-text-primary mb-lg">
    Nueva Consulta Judicial
  </h2>
  
  {/* Sección de formulario */}
  <div className="space-y-md">
    <h3 className="text-heading-h3 font-heading text-text-primary mb-sm">
      Información del Caso
    </h3>
    
    {/* Campo individual */}
    <div>
      <label className="text-body-paragraph font-sans text-text-primary font-medium mb-xs block">
        Número de Radicado
      </label>
      <input 
        className="text-body-paragraph font-sans text-text-base"
        placeholder="Ej: 11001310300120240001"
      />
      <p className="text-body-auxiliary font-sans text-text-secondary mt-xs">
        Ingresa el número completo de radicado judicial
      </p>
    </div>
  </div>
</form>
```

### **Tablas**
```jsx
<table>
  <thead>
    <tr>
      <th className="text-body-auxiliary font-sans text-text-secondary font-medium">
        Radicado
      </th>
      <th className="text-body-auxiliary font-sans text-text-secondary font-medium">
        Estado
      </th>
      <th className="text-body-auxiliary font-sans text-text-secondary font-medium">
        Fecha
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="text-body-paragraph font-sans text-text-base">
        11001310300120240001
      </td>
      <td>
        <Badge variant="success">
          <span className="text-body-auxiliary font-sans">Activo</span>
        </Badge>
      </td>
      <td className="text-body-auxiliary font-sans text-text-secondary">
        15 ene 2025
      </td>
    </tr>
  </tbody>
</table>
```

### **Modales**
```jsx
<Modal>
  {/* Título del modal */}
  <h2 className="text-heading-h2 font-heading text-text-primary mb-md">
    Confirmar Eliminación
  </h2>
  
  {/* Contenido principal */}
  <p className="text-body-paragraph font-sans text-text-base mb-lg">
    ¿Estás seguro de que deseas eliminar esta solicitud? 
    Esta acción no se puede deshacer.
  </p>
  
  {/* Texto de advertencia */}
  <p className="text-body-auxiliary font-sans text-feedback-warning mb-lg">
    ⚠️ Se perderán todos los datos asociados a esta consulta.
  </p>
  
  {/* Botones con texto apropiado */}
  <div className="flex gap-sm">
    <Button variant="destructive">
      <span className="font-medium">Eliminar</span>
    </Button>
    <Button variant="secondary">
      <span className="font-normal">Cancelar</span>
    </Button>
  </div>
</Modal>
```

## ♿ **Accesibilidad Tipográfica**

### **Estándares WCAG**

#### **Contraste de Color**
Todas las combinaciones de texto cumplen WCAG AA:

| Combinación | Contraste | Estado |
|-------------|-----------|---------|
| Text Primary / Canvas | 15.25:1 | ✅ AAA |
| Text Base / Canvas | 11.2:1 | ✅ AAA |
| Text Secondary / Canvas | 5.8:1 | ✅ AA |
| Interactive / Dark BG | 8.2:1 | ✅ AAA |

#### **Tamaños Mínimos**
- **Texto normal**: Mínimo 16px (1rem)
- **Texto pequeño**: Mínimo 14px (0.875rem) solo para auxiliar
- **Touch targets**: Mínimo 48px de altura para botones con texto

#### **Espaciado de Líneas**
- **Mínimo 1.5**: Para texto de cuerpo (cumplimos con 1.6)
- **Mínimo 1.2**: Para títulos (cumplimos con 1.25-1.5)

### **Navegación por Teclado**
```jsx
{/* Ensure proper heading hierarchy */}
<main>
  <h1>Página Principal</h1>
    <section>
      <h2>Sección Principal</h2>
        <h3>Subsección</h3>
        <h3>Otra Subsección</h3>
    </section>
    <section>
      <h2>Segunda Sección</h2>
    </section>
</main>
```

### **Screen Readers**
```jsx
{/* Títulos descriptivos */}
<h2 className="text-heading-h2 font-heading text-text-primary">
  Lista de Solicitudes Activas (3 elementos)
</h2>

{/* Texto alternativo para información visual */}
<span className="sr-only">
  Estado de la solicitud:
</span>
<Badge variant="success">Activa</Badge>
```

## 🎯 **Do's and Don'ts**

### **✅ DO - Mejores Prácticas**

✅ **Usar jerarquía semántica correcta**
```jsx
// Correcto: Orden lógico de títulos
<h1>Página</h1>
  <h2>Sección</h2>
    <h3>Subsección</h3>
```

✅ **Mantener consistencia de familias**
```jsx
// Correcto: Poppins para títulos, Inter para cuerpo
<h2 className="font-heading">Título</h2>
<p className="font-sans">Contenido</p>
```

✅ **Usar colores semánticamente apropiados**
```jsx
// Correcto: Color de error para mensajes de error
<p className="text-feedback-error">Error al procesar</p>
```

✅ **Aplicar espaciado consistente**
```jsx
// Correcto: Usar tokens de espaciado
<section className="space-y-md">
  <h2 className="mb-lg">Título</h2>
  <p className="mb-md">Contenido</p>
</section>
```

### **❌ DON'T - Evitar**

❌ **No saltarse niveles de jerarquía**
```jsx
// Incorrecto: H1 directo a H3
<h1>Título Principal</h1>
<h3>Subtítulo</h3>  {/* Falta H2 */}
```

❌ **No mezclar familias inconsistentemente**
```jsx
// Incorrecto: Inter para títulos
<h2 className="font-sans">Título</h2>  {/* Debe ser font-heading */}
```

❌ **No usar tamaños hardcoded**
```jsx
// Incorrecto: Tamaño custom
<p style={{fontSize: '15px'}}>Texto</p>
// Correcto: Usar tokens
<p className="text-body-paragraph">Texto</p>
```

❌ **No usar más de un H1 por página**
```jsx
// Incorrecto: Múltiples H1
<h1>Título Principal</h1>
<h1>Otro Título Principal</h1>  {/* Debe ser H2 */}
```

## 🔧 **Implementación Técnica**

### **CSS Custom Properties**
```css
:root {
  /* Heading Styles */
  --text-heading-h1: 2rem;
  --text-heading-h2: 1.5rem;
  --text-heading-h3: 1.25rem;
  --text-heading-h4: 1.125rem;
  
  /* Body Styles */
  --text-body-paragraph: 1rem;
  --text-body-auxiliary: 0.875rem;
  --text-link: 1rem;
  
  /* Font Families */
  --font-heading: 'Poppins', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
}
```

### **React Typography Component**
```jsx
// Componente reutilizable para tipografía consistente
const Typography = ({ 
  variant = 'paragraph', 
  children, 
  className = '', 
  color = 'base',
  ...props 
}) => {
  const variants = {
    h1: 'text-heading-h1 font-heading',
    h2: 'text-heading-h2 font-heading',
    h3: 'text-heading-h3 font-heading',
    h4: 'text-heading-h4 font-heading',
    paragraph: 'text-body-paragraph font-sans',
    auxiliary: 'text-body-auxiliary font-sans',
    link: 'text-link font-sans'
  }
  
  const colors = {
    primary: 'text-text-primary',
    base: 'text-text-base',
    secondary: 'text-text-secondary',
    success: 'text-feedback-success',
    error: 'text-feedback-error',
    warning: 'text-feedback-warning',
    interactive: 'text-interactive-default'
  }
  
  const Element = variant.startsWith('h') ? variant : 'p'
  
  return (
    <Element 
      className={`${variants[variant]} ${colors[color]} ${className}`}
      {...props}
    >
      {children}
    </Element>
  )
}

// Uso del componente
<Typography variant="h1" color="primary">
  Título Principal
</Typography>

<Typography variant="paragraph" color="base">
  Contenido del párrafo con estilo consistente.
</Typography>
```

### **Utilities CSS Adicionales**
```css
/* Utilidades para casos especiales */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-wrap-balance {
  text-wrap: balance;
}

.text-gradient {
  background: linear-gradient(135deg, var(--color-interactive-default), var(--color-interactive-hover));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 📊 **Métricas de Performance**

### **Optimización de Fuentes**
```html
<!-- Preload de fuentes críticas -->
<link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/Poppins-SemiBold.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font display swap para mejorar performance -->
@font-face {
  font-family: 'Inter';
  font-display: swap;
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
}
```

### **Targets de Performance**
- **Font loading**: <100ms para fuentes críticas
- **CLS (Cumulative Layout Shift)**: <0.1
- **Fallback fonts**: System fonts como backup
- **Font subsetting**: Solo caracteres necesarios

---

## 📚 **Recursos Adicionales**

- [🎨 Design System Overview](./overview.md) - Principios generales
- [🌈 Color Palette Guide](./color-palette.md) - Sistema de colores
- [📐 Spacing & Layout Guide](./spacing-layout.md) - Espaciado y estructura
- [🔘 Button System](./button-system.md) - Implementación en botones
- [Google Fonts - Inter](https://fonts.google.com/specimen/Inter) - Documentación oficial
- [Google Fonts - Poppins](https://fonts.google.com/specimen/Poppins) - Documentación oficial

**Última actualización**: Enero 2025  
**Versión**: 1.0.0  
**Mantenido por**: Equipo de Frontend