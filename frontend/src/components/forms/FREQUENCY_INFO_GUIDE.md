# 📋 FrequencyInfo Components - Guía de Integración

## 🎯 **Descripción General**

Se han creado dos versiones especializadas del componente `FrequencyInfo` para adaptarse a diferentes contextos de uso en la aplicación ConsultaJudicial RPA:

- **FrequencyInfo-simple.jsx**: Para consultas individuales
- **FrequencyInfo-bulk.jsx**: Para carga masiva de consultas

## 🎨 **Diferencias de Diseño**

### **FrequencyInfo-simple.jsx**
- **Paleta de colores**: Azul (profesional pero cercano)
- **Tono**: Personal y amigable ("Tu consulta personal", "Nosotros nos encargamos")
- **Iconos**: User, Heart (enfoque humano)
- **Enfoque**: Un solo radicado, simplicidad

### **FrequencyInfo-bulk.jsx**
- **Paleta de colores**: Púrpura (empresarial y técnico)
- **Tono**: Profesional y eficiente ("Procesamiento masivo", "Consolidado")
- **Iconos**: Package, Layers, BarChart3 (enfoque técnico)
- **Enfoque**: Múltiples radicados, eficiencia

## 🚀 **Implementación**

### **1. FrequencyInfo-simple.jsx**

**Usado en**: `SimpleQueryForm.jsx`

```jsx
import FrequencyInfoSimple from './FrequencyInfo-simple';

// En el formulario
<div className="form-section">
  <h3 className="form-section-title">Frecuencia de notificación</h3>
  <FrequencyInfoSimple />
</div>
```

**Props disponibles**:
- `className`: Clases CSS adicionales

### **2. FrequencyInfo-bulk.jsx**

**Usado en**: `BulkUploadPage.jsx` (después de validación exitosa)

```jsx
import FrequencyInfoBulk from '../../components/forms/FrequencyInfo-bulk';

// Condicional después de upload exitoso
{uploadStatus === 'success' && validationResults && (
  <div className="mb-xl">
    <h2 className="text-heading-h2 font-heading text-text-primary mb-lg">
      Configuración de Monitoreo
    </h2>
    <FrequencyInfoBulk 
      totalRecords={validationResults.validRows} 
      className="mb-lg"
    />
  </div>
)}
```

**Props disponibles**:
- `className`: Clases CSS adicionales
- `totalRecords`: Número de registros válidos (se muestra en el header)

## 📁 **Estructura de Archivos**

```
src/components/forms/
├── FrequencyInfo.jsx                 # Original (deprecated)
├── FrequencyInfo-simple.jsx          # ✅ Nueva versión para consulta simple
├── FrequencyInfo-bulk.jsx            # ✅ Nueva versión para carga masiva
├── FrequencyInfo-design-system.jsx   # Versión con design system
└── FrequencyInfo-old.jsx             # Backup antiguo
```

## 🔄 **Migración**

### **SimpleQueryForm.jsx** ✅ COMPLETADO
```jsx
// ANTES
import FrequencyInfo from './FrequencyInfo';
<FrequencyInfo />

// DESPUÉS
import FrequencyInfoSimple from './FrequencyInfo-simple';
<FrequencyInfoSimple />
```

### **BulkUploadPage.jsx** ✅ COMPLETADO
```jsx
// AGREGAR después de validación exitosa
import FrequencyInfoBulk from '../../components/forms/FrequencyInfo-bulk';

// En el render, después de los resultados de validación
{uploadStatus === 'success' && validationResults && (
  <div className="mb-xl">
    <h2 className="text-heading-h2 font-heading text-text-primary mb-lg">
      Configuración de Monitoreo
    </h2>
    <FrequencyInfoBulk 
      totalRecords={validationResults.validRows} 
      className="mb-lg"
    />
  </div>
)}
```

## 🎯 **Casos de Uso**

### **Consulta Simple**
```jsx
// Para usuarios individuales que crean una consulta
<FrequencyInfoSimple />
// Mensaje: "Tu consulta personal", tono amigable
```

### **Carga Masiva**
```jsx
// Para usuarios empresariales con múltiples consultas
<FrequencyInfoBulk totalRecords={150} />
// Mensaje: "Procesamiento masivo", tono profesional
```

### **Consulta Avanzada** (futuro)
```jsx
// Para usuarios con configuraciones personalizadas
<FrequencyInfoAdvanced 
  allowCustomFrequency={true}
  currentFrequency="diario"
  onFrequencyChange={handleChange}
/>
```

## 🛡️ **Compatibilidad**

### **Tokens de Design System**
Ambos componentes usan los tokens del design system:
- `text-heading-h*` para tipografía
- `text-body-*` para contenido
- `px-md`, `py-sm`, etc. para espaciado
- `border-*-200`, `bg-*-50` para colores

### **Responsive Design**
- **Mobile**: Stack vertical automático
- **Tablet+**: Layout optimizado para ancho disponible
- **Touch targets**: Mínimo 48px de altura

### **Accesibilidad**
- Contraste WCAG AA compliant
- Estructura semántica apropiada
- Iconos con significado semántico

## 🔧 **Personalización**

### **Cambiar Colores**
```jsx
// FrequencyInfo-simple.jsx - personalizar paleta azul
<div className="border-2 border-green-300 bg-green-50"> // Cambiar a verde
  <div className="bg-green-500"> // Header verde
```

### **Agregar Props Adicionales**
```jsx
// Ejemplo: agregar prop para mostrar/ocultar secciones
const FrequencyInfoSimple = ({ 
  className = '', 
  showExplanation = true,
  showSchedule = true 
}) => {
  return (
    <div className={className}>
      {/* Contenido principal */}
      {showSchedule && (
        <div className="bg-yellow-50 border border-yellow-200">
          {/* Información de horario */}
        </div>
      )}
      {showExplanation && (
        <div className="bg-green-50 border border-green-200">
          {/* Explicación */}
        </div>
      )}
    </div>
  );
};
```

## 🧪 **Testing**

### **Tests Recomendados**
```jsx
// FrequencyInfo-simple.test.jsx
describe('FrequencyInfoSimple', () => {
  test('renders personal tone correctly', () => {
    render(<FrequencyInfoSimple />);
    expect(screen.getByText('Tu Consulta Personal')).toBeInTheDocument();
  });
});

// FrequencyInfo-bulk.test.jsx
describe('FrequencyInfoBulk', () => {
  test('shows record count when provided', () => {
    render(<FrequencyInfoBulk totalRecords={150} />);
    expect(screen.getByText('150 procesos')).toBeInTheDocument();
  });
});
```

## 📝 **Próximos Pasos**

1. ✅ **Crear componentes especializados**
2. ✅ **Integrar en SimpleQueryForm**
3. ✅ **Integrar en BulkUploadPage**
4. 🔄 **Testing de componentes**
5. 🔄 **Documentación de usuario**
6. 🔄 **Deprecar FrequencyInfo.jsx original**

## 📚 **Referencias**

- [Design System Overview](../docs/design-system/overview.md)
- [Color Palette Guide](../docs/design-system/color-palette.md)
- [Button System Guide](../docs/design-system/button-system.md)
- [Typography Guide](../docs/design-system/typography.md)

---

**Última actualización**: Enero 2025  
**Versión**: 1.0.0  
**Mantenido por**: Equipo de Frontend