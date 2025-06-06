# Manual para Integración del Logo LEXIA

## 📁 Paso 1: Copiar Logo
Copiar manualmente el archivo `Logotipo lexia.png` desde:
```
frontend/Images/Logotipo lexia.png
```

Hacia:
```
public/logos/lexia-logo.png
```

## 🔧 Paso 2: Verificar Integración

### Componente Actualizado
- ✅ LexiaLogo.jsx actualizado con soporte para imagen real
- ✅ Props `useRealLogo={true}` agregadas
- ✅ Fallback automático si falla la carga

### Headers Actualizados
- ✅ Header.jsx usando logo real
- ✅ HeaderEnhancedV2.jsx usando logo real  
- ✅ HeroSection.jsx usando logo real

### Variantes Disponibles
```jsx
// Solo imagen del logo
<LexiaLogoImage size="md" variant="default" />

// Logo + texto LEXIA
<LexiaLogoBrand size="md" variant="default" />

// Control completo
<LexiaLogo 
  size="lg"
  variant="light" 
  useRealLogo={true}
  showText={false}
/>
```

## 🎨 Variantes de Color
- `default`: Logo original
- `light`: Invertido para fondos oscuros
- `dark`: Logo estándar
- `monochrome`: Escala de grises

## 🔄 Fallback Automático
Si el logo no se carga, automáticamente muestra el placeholder con ⚖️

## ▶️ Siguiente Paso
Ejecutar: `npm run dev`