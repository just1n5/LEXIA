# 🔘 Sistema de Botones - ConsultaJudicial RPA

## 🎯 **Visión General**

El sistema de botones es la base de la interacción en ConsultaJudicial RPA. Cada botón está diseñado para comunicar claramente su propósito, importancia y estado, facilitando un flujo de trabajo eficiente para consultas judiciales.

## 🎨 **Variantes de Botón**

### **🔸 Primary Button - Acción Principal**

El botón primario destaca la acción más importante en cualquier contexto.

```jsx
<Button variant="primary">Crear Solicitud</Button>
<Button variant="primary" icon={<Plus />}>Nueva Consulta</Button>
```

**Características Visuales:**
- **Fondo**: `bg-interactive-default` (#FACC15)
- **Texto**: `text-text-base` (#374151)
- **Estados**: Hover (#DBB613), Active (#C6A411)
- **Sombra**: Sutil en hover para elevación

**Casos de Uso:**
- ✅ **Crear Nueva Solicitud** - Acción principal del dashboard
- ✅ **Enviar Formulario** - Submit en formularios importantes
- ✅ **Confirmar Acciones** - Confirmaciones críticas
- ✅ **Call-to-Action** - Botones de conversión principales

**Reglas de Uso:**
- 🚨 **Solo UN botón primary por pantalla/sección**
- ✅ **Siempre visible** y fácilmente accesible
- ✅ **Texto descriptivo** (no solo "Enviar" o "OK")

---

### **🔹 Secondary Button - Acción Secundaria**

Para acciones importantes pero no primarias, que complementan el flujo principal.

```jsx
<Button variant="secondary">Cancelar</Button>
<Button variant="secondary" icon={<RefreshCw />}>Actualizar</Button>
```

**Características Visuales:**
- **Fondo**: `bg-bg-canvas` (#FFFFFF)
- **Borde**: `border-border-default` (#D1D5DB)
- **Texto**: `text-text-base` (#374151)
- **Hover**: `bg-bg-light` con borde amarillo

**Casos de Uso:**
- ✅ **Cancelar** operaciones o formularios
- ✅ **Actualizar/Refrescar** datos
- ✅ **Navegación secundaria** (Volver, Siguiente)
- ✅ **Acciones alternativas** que no destruyen datos

**Buenas Prácticas:**
- ✅ **Posición consistente** (generalmente a la izquierda del primary)
- ✅ **Texto claro** sobre la acción que realizará
- ✅ **No competir** visualmente con el botón primary

---

### **👻 Ghost Button - Acción Sutil**

Para acciones discretas que no deben dominar la interfaz.

```jsx
<Button variant="ghost">Ver Detalles</Button>
<Button variant="ghost" icon={<Eye />}>Inspeccionar</Button>
```

**Características Visuales:**
- **Fondo**: Transparente
- **Texto**: `text-text-base` (#374151)
- **Hover**: `bg-bg-light` (#F9FAFB)
- **Minimalista**: Sin bordes ni sombras

**Casos de Uso:**
- ✅ **Acciones en tablas** (Ver, Editar, Eliminar)
- ✅ **Navegación discreta** (Enlaces internos)
- ✅ **Herramientas auxiliares** (Filtros, Ordenamiento)
- ✅ **Acciones secundarias** en cards

**Cuándo Usar:**
- ✅ **Múltiples acciones** en la misma área
- ✅ **Funcionalidad opcional** no crítica
- ✅ **Conservar espacio** visual

---

### **🗑️ Destructive Button - Acciones Irreversibles**

Para acciones que eliminan o modifican permanentemente datos.

```jsx
<Button variant="destructive">Eliminar Solicitud</Button>
<Button variant="destructive" icon={<Trash2 />}>Borrar Historial</Button>
```

**Características Visuales:**
- **Fondo**: `bg-feedback-error` (#EF4444)
- **Texto**: `text-bg-canvas` (blanco)
- **Estados**: Hover más oscuro, focus ring rojo
- **Impacto visual**: Claramente diferenciado

**Casos de Uso:**
- ❌ **Eliminar solicitudes** permanentemente
- ❌ **Borrar historial** de consultas
- ❌ **Cancelar procesos** en curso
- ❌ **Desactivar cuentas** o configuraciones

**Consideraciones de UX:**
- 🚨 **Siempre confirmar** con modal o diálogo
- ✅ **Texto específico** ("Eliminar Solicitud" no "Eliminar")
- ✅ **Mensaje de confirmación** claro sobre consecuencias
- ✅ **Posición separada** de otros botones

---

### **🔗 Link Button - Como Enlace**

Para acciones que se comportan como enlaces pero necesitan funcionalidad de botón.

```jsx
<Button variant="link">Ver Historial Completo</Button>
<Button variant="link" icon={<ExternalLink />}>Ir a Rama Judicial</Button>
```

**Características Visuales:**
- **Apariencia**: Como enlace de texto
- **Color**: `text-feedback-info` (#3B82F6)
- **Hover**: Subrayado + color amarillo
- **Sin padding**: Solo el espacio del texto

**Casos de Uso:**
- ✅ **Navegación inline** en párrafos
- ✅ **Enlaces externos** con tracking
- ✅ **Acciones menores** que no necesitan peso visual
- ✅ **CTAs sutiles** en contextos densos

---

## 📏 **Tamaños de Botón**

### **Small (32px)** - `size="sm"`
```jsx
<Button size="sm">Filtrar</Button>
```
- **Altura**: 32px
- **Padding**: 8px lateral
- **Texto**: 14px (body-auxiliary)
- **Uso**: Controles en tablas, herramientas, acciones menores

### **Medium (40px)** - `size="md"` (Default)
```jsx
<Button>Crear Solicitud</Button>
```
- **Altura**: 40px  
- **Padding**: 16px lateral
- **Texto**: 16px (body-paragraph)
- **Uso**: Botones estándar en formularios y acciones principales

### **Large (48px)** - `size="lg"`
```jsx
<Button size="lg">Comenzar Consulta</Button>
```
- **Altura**: 48px
- **Padding**: 24px lateral  
- **Texto**: 18px (heading-h4)
- **Uso**: CTAs principales, landing pages, acciones críticas

---

## 🎭 **Estados del Botón**

### **Default State**
Estado normal del botón cuando no hay interacción.

```jsx
<Button variant="primary">Estado Normal</Button>
```

### **Hover State**
Feedback visual cuando el cursor está sobre el botón.

**Cambios Visuales:**
- **Primary**: Fondo más oscuro + sombra sutil
- **Secondary**: Fondo gris claro + borde amarillo
- **Ghost**: Fondo gris muy claro
- **Destructive**: Rojo más oscuro

```jsx
// El hover se aplica automáticamente
<Button variant="primary">Hover automático</Button>
```

### **Active/Pressed State**
Estado visual cuando el botón está siendo presionado.

- **Duración**: Momentáneo durante el click
- **Visual**: Color más oscuro que hover
- **Propósito**: Feedback táctil inmediato

### **Focus State**
Estado visible para navegación por teclado.

```jsx
<Button variant="primary">
  Navegable por teclado
</Button>
```

**Características:**
- **Focus ring**: Anillo amarillo de 2px
- **Visible**: Solo con navegación por teclado
- **Accesible**: WCAG 2.1 AA compliant

### **Disabled State**
Para botones temporalmente no disponibles.

```jsx
<Button variant="primary" disabled>
  No Disponible
</Button>
```

**Cambios Visuales:**
- **Opacidad**: 60%
- **Cursor**: `not-allowed`
- **Color**: Gris desaturado
- **Sin interacción**: No hover ni focus

**Cuándo Usar:**
- ✅ **Formularios incompletos** (validación pendiente)
- ✅ **Procesos en curso** (enviando datos)
- ✅ **Permisos insuficientes** (usuario sin acceso)
- ✅ **Dependencias no cumplidas** (selección requerida)

### **Loading State**
Feedback visual durante operaciones asíncronas.

```jsx
<Button variant="primary" loading>
  Creando Solicitud...
</Button>
```

**Características:**
- **Spinner**: Icono de carga animado
- **Texto opcional**: "Cargando..." o específico
- **No interactivo**: Disabled durante carga
- **Preserva tamaño**: No cambia dimensiones

---

## 🔧 **Uso con Iconos**

### **Iconos a la Izquierda** (Default)
```jsx
<Button variant="primary" icon={<Plus />}>
  Crear Solicitud
</Button>
```

### **Iconos a la Derecha**
```jsx
<Button variant="secondary" icon={<ChevronRight />} iconPosition="right">
  Continuar
</Button>
```

### **Solo Icono**
```jsx
<Button.Icon 
  variant="ghost" 
  icon={<Eye />} 
  aria-label="Ver detalles"
/>
```

**Mejores Prácticas:**
- ✅ **Iconos 16px** para botones normales
- ✅ **Iconos 14px** para botones small
- ✅ **Aria-label** obligatorio en botones solo-icono
- ✅ **Iconos semánticamente** relacionados con la acción

---

## 🎯 **Patrones de Uso Comunes**

### **Formularios - Primary + Secondary**
```jsx
<div className="flex gap-3">
  <Button variant="secondary">Cancelar</Button>
  <Button variant="primary">Guardar Solicitud</Button>
</div>
```

### **Tablas - Ghost Actions**
```jsx
<div className="flex gap-2">
  <Button.Icon variant="ghost" icon={<Eye />} aria-label="Ver" />
  <Button.Icon variant="ghost" icon={<Edit3 />} aria-label="Editar" />
  <Button.Icon variant="ghost" icon={<Trash2 />} aria-label="Eliminar" />
</div>
```

### **Confirmación - Destructive + Cancel**
```jsx
<div className="flex gap-3">
  <Button variant="secondary">Mantener</Button>
  <Button variant="destructive">Eliminar Permanentemente</Button>
</div>
```

### **CTA en Cards**
```jsx
<div className="card">
  <p>Descripción de la funcionalidad...</p>
  <Button variant="primary" size="lg" block>
    Comenzar Ahora
  </Button>
</div>
```

---

## ✅ **Do's and Don'ts**

### **✅ DO - Mejores Prácticas**

#### **Jerarquía Clara**
```jsx
// ✅ CORRECTO: Un primary, resto secondary/ghost
<div>
  <Button variant="secondary">Volver</Button>
  <Button variant="primary">Crear Solicitud</Button>
</div>
```

#### **Texto Descriptivo**
```jsx
// ✅ CORRECTO: Específico y claro
<Button variant="primary">Crear Nueva Solicitud</Button>
<Button variant="destructive">Eliminar Solicitud #123</Button>
```

#### **Loading States**
```jsx
// ✅ CORRECTO: Feedback durante proceso
<Button variant="primary" loading disabled>
  Enviando solicitud...
</Button>
```

#### **Confirmación para Destructive**
```jsx
// ✅ CORRECTO: Siempre confirmar acciones irreversibles
const handleDelete = () => {
  if (confirm('¿Eliminar solicitud permanentemente?')) {
    deleteSolicitud()
  }
}
```

### **❌ DON'T - Evitar**

#### **Múltiples Primary**
```jsx
// ❌ INCORRECTO: Confunde jerarquía
<div>
  <Button variant="primary">Guardar</Button>
  <Button variant="primary">Enviar</Button>  {/* ❌ */}
</div>
```

#### **Texto Genérico**
```jsx
// ❌ INCORRECTO: No específico
<Button variant="primary">OK</Button>
<Button variant="destructive">Eliminar</Button>  {/* ❌ ¿Qué elimina? */}
```

#### **Disabled Sin Razón**
```jsx
// ❌ INCORRECTO: Usuario no sabe por qué está disabled
<Button disabled>Crear</Button>  {/* ❌ Sin explicación */}

// ✅ MEJOR: Con tooltip o mensaje
<Button disabled title="Complete todos los campos requeridos">
  Crear
</Button>
```

#### **Iconos Sin Sentido**
```jsx
// ❌ INCORRECTO: Icono no relacionado
<Button icon={<Star />}>Eliminar</Button>  {/* ❌ */}

// ✅ CORRECTO: Icono semánticamente correcto
<Button variant="destructive" icon={<Trash2 />}>Eliminar</Button>
```

---

## 📱 **Consideraciones Responsive**

### **Mobile (< 640px)**
- **Tamaño mínimo**: 48px altura para touch targets
- **Spacing**: Mayor separación entre botones
- **Full width**: Botones importantes ocupan ancho completo
- **Stack vertical**: Botones se apilan en lugar de horizontal

```jsx
// Responsive automático
<Button className="w-full sm:w-auto">
  Responsive Button
</Button>
```

### **Tablet (640px - 1024px)**
- **Tamaño estándar**: 40px altura
- **Horizontal layout**: Botones en fila cuando hay espacio
- **Adequate spacing**: 12px entre botones

### **Desktop (> 1024px)**
- **Hover states**: Completamente habilitados
- **Keyboard navigation**: Focus rings visibles
- **Tooltips**: Información adicional en hover

---

## ♿ **Accesibilidad**

### **Navegación por Teclado**
- **Tab**: Navegar entre botones
- **Space/Enter**: Activar botón focused
- **Escape**: Cancelar si aplicable

### **Screen Readers**
```jsx
// Información descriptiva
<Button 
  variant="primary"
  aria-label="Crear nueva solicitud de consulta judicial"
  aria-describedby="help-text"
>
  Crear Solicitud
</Button>
```

### **Estados Comunicados**
```jsx
// Estados para tecnologías asistivas
<Button 
  variant="primary"
  disabled
  aria-disabled="true"
  aria-describedby="why-disabled"
>
  Enviar
</Button>
```

### **Focus Management**
- **Focus visible**: Anillo amarillo de 2px
- **Focus trap**: En modales y diálogos
- **Logical order**: Orden de tab coherente

---

## 🔧 **API Reference**

### **Props Principales**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  block?: boolean  // Ancho completo
  as?: React.ElementType  // Para usar como Link
  children: ReactNode
}
```

### **Subcomponentes**
```jsx
// Componentes de conveniencia
<Button.Primary>Crear</Button.Primary>
<Button.Secondary>Cancelar</Button.Secondary>
<Button.Ghost>Ver</Button.Ghost>
<Button.Destructive>Eliminar</Button.Destructive>
<Button.Link>Enlace</Button.Link>
<Button.Icon icon={<Eye />} aria-label="Ver" />
```

### **Eventos**
```jsx
<Button 
  onClick={handleClick}
  onFocus={handleFocus}
  onBlur={handleBlur}
  onMouseEnter={handleHover}
>
  Interactive Button
</Button>
```

---

## 📚 **Ejemplos Avanzados**

### **Botón con Confirmación**
```jsx
const ConfirmButton = ({ onConfirm, children, ...props }) => {
  const [confirming, setConfirming] = useState(false)
  
  const handleClick = () => {
    if (confirming) {
      onConfirm()
      setConfirming(false)
    } else {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
    }
  }
  
  return (
    <Button 
      variant="destructive"
      onClick={handleClick}
      {...props}
    >
      {confirming ? 'Confirmar Eliminación' : children}
    </Button>
  )
}
```

### **Botón con Estado Asyncrono**
```jsx
const AsyncButton = ({ onAsyncAction, children, ...props }) => {
  const [loading, setLoading] = useState(false)
  
  const handleClick = async () => {
    setLoading(true)
    try {
      await onAsyncAction()
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Button 
      loading={loading}
      disabled={loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? 'Procesando...' : children}
    </Button>
  )
}
```

---

## 📚 **Referencias**

- [🎨 Color Palette Guide](./color-palette.md) - Colores usados en botones
- [📝 Typography Guide](./typography.md) - Tipografía de botones  
- [📐 Spacing Guide](./spacing-layout.md) - Espaciado y layout
- [♿ WCAG Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/) - Estándares de accesibilidad

**Código fuente**: `src/components/ui/Button.jsx`  
**Última actualización**: Enero 2025  
**Versión**: 1.0.0