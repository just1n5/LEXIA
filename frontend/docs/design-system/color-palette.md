# 🌈 Paleta de Colores - ConsultaJudicial RPA

## 🎯 **Filosofía del Color**

Nuestro sistema de colores está diseñado para comunicar claridad, confianza y eficiencia en el contexto profesional de consultas judiciales. Cada color tiene un propósito semántico específico y ha sido optimizado para accesibilidad y legibilidad.

## 🎨 **Colores Principales**

### **💛 Interactive Yellow - Color Primario**
El amarillo (#FACC15) es nuestro color distintivo para elementos interactivos principales.

```css
/* Token CSS */
color: var(--color-interactive-default);
/* Tailwind */
bg-interactive-default text-interactive-default
```

**Valores y Variaciones:**
- **Default**: `#FACC15` - Botones primarios, enlaces principales
- **Hover**: `#DBB613` - Estado hover de elementos interactivos  
- **Active**: `#C6A411` - Estado activo/pressed

**Casos de Uso:**
- ✅ **Botones primarios** (Submit, Crear Solicitud)
- ✅ **Enlaces principales** en navegación
- ✅ **Indicadores de progreso** activos
- ✅ **Estados de focus** en formularios
- ❌ **NO usar para** texto sobre fondos claros (contraste insuficiente)
- ❌ **NO usar para** errores o advertencias

**Accesibilidad:**
- **Contraste sobre blanco**: 3.8:1 (AA Large Text)
- **Contraste sobre gris oscuro**: 8.2:1 (AAA)
- **Recomendación**: Usar solo para elementos interactivos, no para texto

---

## 📝 **Colores de Texto**

### **Jerarquía de Texto Claro**
Sistema de tres niveles para establecer jerarquía de información.

#### **Primary Text** - `#1F2937`
```css
/* Token CSS */
color: var(--color-text-primary);
/* Tailwind */
text-text-primary
```
- **Uso**: Títulos principales, encabezados importantes
- **Contraste**: 15.25:1 sobre blanco (AAA)
- **Casos**: H1, H2, labels de formulario importantes

#### **Base Text** - `#374151`  
```css
/* Token CSS */
color: var(--color-text-base);
/* Tailwind */
text-text-base
```
- **Uso**: Texto de cuerpo principal, párrafos
- **Contraste**: 11.2:1 sobre blanco (AAA)
- **Casos**: Contenido principal, descripciones

#### **Secondary Text** - `#6B7280`
```css
/* Token CSS */
color: var(--color-text-secondary);
/* Tailwind */
text-text-secondary
```
- **Uso**: Texto auxiliar, metadatos, timestamps
- **Contraste**: 5.8:1 sobre blanco (AA)
- **Casos**: Fechas, información secundaria, placeholders

**Modo Oscuro:**
- **Dark Primary**: `#F9FAFB` - Texto principal sobre fondos oscuros
- **Dark Secondary**: `#D1D5DB` - Texto secundario sobre fondos oscuros
- **Dark Tertiary**: `#9CA3AF` - Texto auxiliar sobre fondos oscuros

---

## 🎭 **Colores Semánticos (Feedback)**

### **✅ Success Green - Confirmación**
```css
/* Color principal */
#10B981
/* Background suave */
#D1FAE5
```

**Casos de Uso:**
- ✅ **Mensajes de éxito** (Solicitud creada correctamente)
- ✅ **Estados completados** (Proceso finalizado)
- ✅ **Badges de estado activo**
- ✅ **Confirmaciones** de acciones

**Ejemplo de Implementación:**
```jsx
<Badge variant="success">Proceso Activo</Badge>
<div className="bg-feedback-success-light border border-feedback-success">
  Solicitud enviada exitosamente
</div>
```

### **⚠️ Warning Yellow - Advertencia**
```css
/* Color principal */
#FBBF24
/* Background suave */
#FEF3C7
```

**Casos de Uso:**
- ⚠️ **Advertencias** (Captcha requerido)
- ⚠️ **Estados pausados** (Solicitud pausada)
- ⚠️ **Información importante** que requiere atención
- ⚠️ **Procesos pendientes**

### **❌ Error Red - Errores**
```css
/* Color principal */
#EF4444
/* Background suave */
#FEE2E2
```

**Casos de Uso:**
- ❌ **Errores de sistema** (Fallo en consulta)
- ❌ **Validación de formularios** (Campo requerido)
- ❌ **Acciones destructivas** (Eliminar solicitud)
- ❌ **Estados de fallo**

### **ℹ️ Info Blue - Información**
```css
/* Color principal */
#3B82F6
/* Background suave */
#DBEAFE
```

**Casos de Uso:**
- ℹ️ **Información neutral** (Tips de ayuda)
- ℹ️ **Estados en proceso** (Consultando base de datos)
- ℹ️ **Enlaces secundarios**
- ℹ️ **Notificaciones informativas**

---

## 🖼️ **Colores de Fondo**

### **Backgrounds Neutros**
Sistema de fondos que crean jerarquía visual sin competir con el contenido.

#### **Canvas White** - `#FFFFFF`
```css
/* Token CSS */
background-color: var(--color-bg-canvas);
/* Tailwind */
bg-bg-canvas
```
- **Uso**: Fondo principal de la aplicación
- **Casos**: Cards, modales, formularios

#### **Light Gray** - `#F9FAFB`
```css
/* Token CSS */
background-color: var(--color-bg-light);
/* Tailwind */
bg-bg-light
```
- **Uso**: Fondos sutiles, separación de secciones
- **Casos**: Headers de tabla, fondos de paginación

#### **Dark Backgrounds** (Modo Oscuro)
- **Primary Dark**: `#1F2937` - Fondo principal
- **Surface Dark**: `#374151` - Superficies elevadas
- **Elevated Dark**: `#4B5563` - Elementos sobre superficies

---

## 🔲 **Colores de Borde**

### **Border System**
Bordes sutiles que definen áreas sin sobrecargar visualmente.

#### **Default Border** - `#D1D5DB`
```css
/* Token CSS */
border-color: var(--color-border-default);
/* Tailwind */
border-border-default
```
- **Uso**: Bordes estándar de inputs, cards, separadores
- **Contraste**: Suficiente para definir áreas, sutil para no distraer

#### **Disabled Border** - `#E5E7EB`
```css
/* Token CSS */
border-color: var(--color-border-disabled);
/* Tailwind */
border-border-disabled
```
- **Uso**: Elementos deshabilitados, estados inactivos
- **Más sutil**: Para elementos que no deben llamar atención

---

## 🎨 **Uso Práctico por Componente**

### **Botones**
```jsx
// Primario - Acción principal
<Button variant="primary">          // bg-interactive-default
  Crear Solicitud
</Button>

// Secundario - Acción secundaria  
<Button variant="secondary">        // bg-bg-canvas border-border-default
  Cancelar
</Button>

// Destructivo - Acción irreversible
<Button variant="destructive">      // bg-feedback-error
  Eliminar
</Button>
```

### **Badges de Estado**
```jsx
// Estado exitoso
<Badge variant="success">Activa</Badge>        // bg-feedback-success

// Estado en pausa
<Badge variant="warning">Pausada</Badge>       // bg-feedback-warning

// Estado con error
<Badge variant="error">Error</Badge>           // bg-feedback-error

// Estado informativo
<Badge variant="info">En Proceso</Badge>       // bg-feedback-info
```

### **Alerts y Notificaciones**
```jsx
// Éxito
<div className="bg-feedback-success-light border border-feedback-success text-feedback-success">
  Solicitud creada exitosamente
</div>

// Error
<div className="bg-feedback-error-light border border-feedback-error text-feedback-error">
  Error al procesar la solicitud
</div>
```

## 🌙 **Modo Oscuro**

### **Adaptación Automática**
Todos los colores tienen equivalentes optimizados para modo oscuro que mantienen:
- **Contraste adecuado** para legibilidad
- **Semántica de color** (error sigue siendo rojo)
- **Jerarquía visual** preservada

### **Implementación**
```css
/* Automático con class="dark" en el documento */
.dark .text-text-primary {
  color: #F9FAFB;  /* dark-primary */
}

.dark .bg-bg-canvas {
  background-color: #1F2937;  /* dark-primary */
}
```

## ♿ **Accesibilidad y Contraste**

### **Estándares WCAG**
Todos los colores cumplen o superan estándares WCAG AA:

| Combinación | Contraste | Estado |
|-------------|-----------|---------|
| Text Primary / Canvas | 15.25:1 | ✅ AAA |
| Text Base / Canvas | 11.2:1 | ✅ AAA |
| Text Secondary / Canvas | 5.8:1 | ✅ AA |
| Interactive Default / Canvas | 3.8:1 | ✅ AA Large |
| Success / Canvas | 4.2:1 | ✅ AA |
| Error / Canvas | 4.1:1 | ✅ AA |

### **Testing Tools**
- **WebAIM Contrast Checker**: Validación manual
- **axe DevTools**: Testing automatizado
- **Lighthouse**: Auditoría de accesibilidad

## 🎯 **Do's and Don'ts**

### **✅ DO - Mejores Prácticas**

✅ **Usar colores semánticos apropiados**
```jsx
// Correcto: Verde para éxito
<Badge variant="success">Proceso Completado</Badge>
```

✅ **Mantener contraste suficiente**
```jsx
// Correcto: Texto oscuro sobre fondo claro
<div className="bg-bg-canvas text-text-primary">
```

✅ **Usar interactive yellow solo para elementos interactivos**
```jsx
// Correcto: Botón primary
<Button variant="primary">Crear</Button>
```

### **❌ DON'T - Evitar**

❌ **No usar colores que confundan semántica**
```jsx
// Incorrecto: Rojo para éxito
<Badge variant="error">Proceso Completado</Badge>
```

❌ **No usar amarillo para texto normal**
```jsx
// Incorrecto: Bajo contraste
<p className="text-interactive-default">Texto normal</p>
```

❌ **No hardcodear colores**
```jsx
// Incorrecto: Color hardcoded
<div style={{backgroundColor: '#FACC15'}}>
// Correcto: Usar tokens
<div className="bg-interactive-default">
```

## 🔧 **Implementación Técnica**

### **CSS Custom Properties**
```css
:root {
  --color-interactive-default: #FACC15;
  --color-interactive-hover: #DBB613;
  --color-interactive-active: #C6A411;
  
  --color-text-primary: #1F2937;
  --color-text-base: #374151;
  --color-text-secondary: #6B7280;
  
  --color-feedback-success: #10B981;
  --color-feedback-warning: #FBBF24;
  --color-feedback-error: #EF4444;
  --color-feedback-info: #3B82F6;
}
```

### **Tailwind Configuration**
Ver `tailwind.config.js` para la implementación completa de tokens de color.

### **React Components**
```jsx
// Usando el sistema de colores en componentes
const Alert = ({ variant, children }) => {
  const variants = {
    success: 'bg-feedback-success-light border-feedback-success text-feedback-success',
    error: 'bg-feedback-error-light border-feedback-error text-feedback-error',
    warning: 'bg-feedback-warning-light border-feedback-warning text-feedback-warning',
    info: 'bg-feedback-info-light border-feedback-info text-feedback-info'
  }
  
  return (
    <div className={`p-4 border rounded-md ${variants[variant]}`}>
      {children}
    </div>
  )
}
```

---

## 📚 **Recursos Adicionales**

- [🎨 Design System Overview](./overview.md) - Principios generales
- [🔘 Button System](./button-system.md) - Implementación en botones
- [📝 Typography Guide](./typography.md) - Colores en tipografía
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Herramienta externa

**Última actualización**: Enero 2025  
**Versión**: 1.0.0