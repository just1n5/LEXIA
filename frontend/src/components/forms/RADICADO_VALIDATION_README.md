# 🏛️ Sistema de Validación de Radicados - ConsultaJudicial RPA

## 🎯 Descripción General

Sistema avanzado de validación para números de radicación de procesos judiciales en Colombia, basado en la estructura oficial definida por el **Acuerdo No. 201 de 1997** de la Rama Judicial.

### ✨ Características Principales

- ✅ **Validación oficial** basada en estructura de 23 dígitos
- ✅ **Feedback en tiempo real** con sugerencias inteligentes
- ✅ **Validación por segmentos** (DANE, entidad, año, etc.)
- ✅ **Interfaz moderna** siguiendo el design system
- ✅ **Casos de prueba** predefinidos para testing
- ✅ **Acciones rápidas** (copiar, formatear, limpiar)
- ✅ **Responsive** y totalmente accesible

## 📁 Estructura de Archivos

```
src/
├── hooks/
│   └── useAdvancedRadicadoValidation.js     # Hook principal de validación
├── components/
│   └── forms/
│       └── RadicadoValidationInput.jsx      # Componente de input con validación
│   └── demo/
│       └── RadicadoValidationDemo.jsx       # Demo interactivo
└── pages/
    └── test/
        └── RadicadoValidationTestPage.jsx   # Página de prueba
```

## 🏗️ Componentes del Sistema

### 1. 🔧 Hook: `useAdvancedRadicadoValidation.js`

**Funcionalidad principal:**
- Validación en tiempo real con debounce
- Análisis estructural por segmentos
- Estados de validación (idle, valid, warning, error)
- Sugerencias automáticas de corrección

**API del Hook:**
```javascript
const {
  value,                    // Valor actual del input
  setValue,                 // Función para cambiar valor
  validationState,          // Estado: 'idle'|'valid'|'warning'|'error'
  message,                  // Mensaje de feedback
  suggestions,              // Array de sugerencias
  isValidating,             // Boolean: está validando
  detectedPattern,          // Información del patrón detectado
  validateSync,             // Validación síncrona para submit
  getInputProps,            // Props para el input
  isValid,                  // Boolean: es válido
  hasError,                 // Boolean: tiene error
  hasWarning,               // Boolean: tiene advertencia
  isComplete,               // Boolean: 23 dígitos completos
  cleanValue,               // Valor solo números
  formattedValue,           // Valor con formato visual
  officialStructure,        // Estructura oficial del radicado
  progress                  // Porcentaje de completitud (0-100)
} = useAdvancedRadicadoValidation(initialValue);
```

### 2. 🎨 Componente: `RadicadoValidationInput.jsx`

**Props principales:**
```javascript
<RadicadoValidationInput
  label="Número de Radicación"
  required={true}
  defaultValue=""
  onValidRadicado={handleValidation}  // Callback cuando es válido
  showStructureInfo={true}            // Mostrar info estructural
  showQuickActions={true}             // Mostrar acciones rápidas
  className=""
  // ...otros props del input
/>
```

**Características visuales:**
- Estados de color según validación (verde=válido, amarillo=advertencia, rojo=error)
- Barra de progreso de completitud
- Iconos de estado dinámicos
- Información estructural expandible
- Acciones rápidas (copiar, formatear)

### 3. 🎮 Demo: `RadicadoValidationDemo.jsx`

**Incluye:**
- Casos de prueba predefinidos
- Formulario de ejemplo integrado
- Información técnica del sistema
- Exportación de datos validados
- Documentación interactiva

## 📊 Estructura Oficial del Radicado

Según el **Acuerdo No. 201 de 1997**, el número de radicación tiene **exactamente 23 dígitos**:

| Posición | Dígitos | Descripción | Ejemplo |
|----------|---------|-------------|---------|
| 1-2      | 2       | Código DANE Departamento | `05` |
| 3-5      | 3       | Código DANE Ciudad | `001` |
| 6-7      | 2       | Código Entidad/Corporación | `31` |
| 8-9      | 2       | Código Especialidad | `00` |
| 10-12    | 3       | Número Despacho | `012` |
| 13-16    | 4       | Año de Radicación | `2021` |
| 17-21    | 5       | Código Proceso (Consecutivo) | `00001` |
| 22-23    | 2       | Recurso del Proceso | `00` |

**Ejemplo completo:** `05001310012021000100`
**Formato visual:** `05001-31-00-012-2021-00001-00`

## 🎯 Casos de Use Case

### 1. Validación Simple
```javascript
import { useAdvancedRadicadoValidation } from './hooks/useAdvancedRadicadoValidation';

const MyComponent = () => {
  const { 
    value, 
    setValue, 
    validationState, 
    message, 
    isValid 
  } = useAdvancedRadicadoValidation();

  return (
    <div>
      <input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`input ${validationState}`}
      />
      {message && <p className={`message ${validationState}`}>{message}</p>}
    </div>
  );
};
```

### 2. Componente Completo
```javascript
import { RadicadoValidationInput } from './components/forms/RadicadoValidationInput';

const FormWithValidation = () => {
  const [formData, setFormData] = useState({});

  const handleValidRadicado = (data) => {
    setFormData(prev => ({ 
      ...prev, 
      radicado: data.cleanValue,
      radicadoFormat: data.formattedValue 
    }));
  };

  return (
    <form>
      <RadicadoValidationInput
        label="Número de Radicación"
        required
        onValidRadicado={handleValidRadicado}
        showStructureInfo={true}
      />
      {/* Otros campos del formulario */}
    </form>
  );
};
```

### 3. Validación en Submit
```javascript
const { validateSync } = useAdvancedRadicadoValidation(radicado);

const handleSubmit = (e) => {
  e.preventDefault();
  
  const validation = validateSync();
  if (!validation.isValid) {
    alert(validation.error);
    return;
  }
  
  // Proceder con el submit
  submitForm(formData);
};
```

## 🧪 Testing y Desarrollo

### Acceso a la Página de Prueba

1. **URL directa:** `/test/radicado-validation`
2. **Desde home:** Ir a "Área de Pruebas" → "Test Validación Radicados"

### Casos de Prueba Incluidos

1. **Válido - Bogotá Civil:** `11001310300120240001200`
2. **Válido - Medellín Penal:** `05001610500120240005600`
3. **Incompleto:** `1100131030012024` (faltan dígitos)
4. **Muy largo:** `110013103001202400012001234` (dígitos extra)
5. **Con caracteres:** `11001-31030-01-2024-00012-00` (guiones)
6. **Año inválido:** `11001310300119950001200` (año 1995)

### Estados de Validación

- **`idle`**: Sin validar (campo vacío)
- **`validating`**: Validando (con spinner)
- **`valid`**: ✅ Válido (verde)
- **`warning`**: ⚠️ Advertencia (amarillo) - Válido pero con observaciones
- **`error`**: ❌ Error (rojo) - No válido

## 🎨 Design System Integration

### Colores Utilizados
```css
/* Estados de validación */
.valid { 
  border-color: var(--feedback-success);
  background-color: var(--feedback-success-light);
}
.warning { 
  border-color: var(--feedback-warning);
  background-color: var(--feedback-warning-light);
}
.error { 
  border-color: var(--feedback-error);
  background-color: var(--feedback-error-light);
}

/* Colores interactivos */
.tech-accent { color: var(--tech-accent); }
.interactive { color: var(--interactive-default); }
```

### Tipografía
- **Labels:** `text-body-paragraph font-sans font-medium`
- **Inputs:** `text-body-paragraph font-sans`
- **Mensajes:** `text-body-auxiliary font-sans`
- **Código:** `font-mono text-tech-accent`

### Espaciado
- **Componente:** `space-y-sm`
- **Secciones:** `space-y-lg`
- **Padding interno:** `p-sm`, `p-md`, `p-lg`

## 🔧 Configuración Técnica

### Dependencias
```json
{
  "react": "^18.x",
  "lucide-react": "^0.x",
  "tailwindcss": "^3.x"
}
```

### Configuración Tailwind
Los tokens están definidos en `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'feedback-success': '#10B981',
        'feedback-warning': '#FBBF24',
        'feedback-error': '#EF4444',
        'tech-accent': '#3B82F6',
        // ... más colores
      }
    }
  }
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile** (< 768px): Stacked layout, botones full-width
- **Tablet** (768px+): Grid 1-2, acciones horizontales
- **Desktop** (1024px+): Grid 1-3, layout completo

### Touch Targets
- **Mínimo 48px** para todos los elementos táctiles
- **Espaciado generoso** entre elementos interactivos
- **Accesibilidad táctil** optimizada

## ♿ Accesibilidad

### Estándares WCAG AA
- **Contraste:** Todos los colores cumplen ratio 4.5:1
- **Teclado:** Navegación completa por teclado
- **Screen readers:** ARIA labels apropiados
- **Focus:** Indicadores visuales claros

### ARIA Labels
```javascript
// Elementos importantes con labels descriptivos
<input 
  aria-label="Número de radicación de 23 dígitos"
  aria-describedby="radicado-help"
  aria-invalid={hasError}
/>
<div id="radicado-help">
  Ingrese el número completo de radicación judicial
</div>
```

## 🚀 Performance

### Optimizaciones
- **Debounce:** 500ms para evitar validaciones excesivas
- **Memoization:** Callbacks y computaciones memorizadas
- **Lazy loading:** Información estructural cargada bajo demanda
- **Virtual scrolling:** Para listas grandes de sugerencias

### Métricas Objetivo
- **Validación:** <100ms tiempo de respuesta
- **Renderizado:** <16ms (60fps)
- **Memoria:** <10MB uso adicional

## 🔗 Enlaces Útiles

- [📖 Documentación Oficial Rama Judicial](https://consultaprocesos.ramajudicial.gov.co/manual/consulta.html#construir-numero)
- [🎯 Demo Interactivo](/test/radicado-validation)
- [📋 Crear Solicitud Real](/solicitudes/select-type)
- [📊 Dashboard](/dashboard)

## 📝 Changelog

### v1.0.0 (Enero 2025)
- ✅ Implementación inicial con validación oficial
- ✅ Hook de validación avanzada
- ✅ Componente de UI completo
- ✅ Demo interactivo con casos de prueba
- ✅ Integración con design system
- ✅ Documentación completa

---

**Desarrollado por:** Equipo Frontend ConsultaJudicial RPA  
**Última actualización:** Enero 2025  
**Versión:** 1.0.0