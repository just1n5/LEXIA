# 🚨 TROUBLESHOOTING - Sitio en Blanco

## **DIAGNÓSTICO PASO A PASO**

### **1. VERIFICAR ERRORES EN CONSOLA**
```bash
1. Abrir DevTools (F12)
2. Ir a la pestaña "Console"
3. Buscar errores en rojo
4. Tomar screenshot de errores encontrados
```

**Errores comunes:**
- ❌ `Module not found` - Falta instalar dependencias
- ❌ `Cannot resolve` - Rutas de importación incorrectas
- ❌ `Unexpected token` - Error de sintaxis JSX
- ❌ `Cannot read property` - Variables undefined

### **2. VERIFICAR DEPENDENCIAS**
```bash
# Verificar si están instaladas:
npm list react-hook-form
npm list lucide-react
npm list react-router-dom

# Si faltan, instalar:
npm install react-hook-form lucide-react react-router-dom
```

### **3. TEST BÁSICO - PASO A PASO**

#### **Paso 3.1: Backup del App.jsx actual**
```bash
# Renombrar el App.jsx actual
mv src/App.jsx src/App_original.jsx
mv src/App_con_test.jsx src/App.jsx
```

#### **Paso 3.2: Iniciar servidor y probar**
```bash
npm start
# Ir a: http://localhost:3000/test/solicitudes
```

**Si funciona el test:** ✅ React está bien, el problema son las dependencias
**Si sigue en blanco:** ❌ Problema más profundo

### **4. SOLUCIÓN INMEDIATA - APP MÍNIMO**

Si el test falla, crear App.jsx súper básico:

```javascript
// src/App.jsx - Versión mínima para test
import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>✅ React Funciona</h1>
      <p>Si ves esto, el problema estaba en las importaciones complejas.</p>
      <a href="/test/solicitudes">Ir a Test de Solicitudes</a>
    </div>
  );
}

export default App;
```

### **5. DIAGNÓSTICO DE IMPORTACIONES**

#### **Test Individual de Componentes:**
```javascript
// Test 1: ValidationMessage
import ValidationMessage from './components/forms/ValidationMessage';
console.log('ValidationMessage:', ValidationMessage);

// Test 2: FrequencySelector  
import FrequencySelector from './components/forms/FrequencySelector';
console.log('FrequencySelector:', FrequencySelector);

// Test 3: Hooks
import { useRadicadoValidation } from './hooks/useRadicadoValidation';
console.log('useRadicadoValidation:', useRadicadoValidation);
```

### **6. SOLUCIONES POR ERROR ESPECÍFICO**

#### **Error: "Module not found: Can't resolve 'react-hook-form'"**
```bash
npm install react-hook-form
# O si falla:
npm install --force react-hook-form
```

#### **Error: "Module not found: Can't resolve 'lucide-react'"**
```bash
npm install lucide-react
# Alternativa con iconos básicos:
# Reemplazar iconos de Lucide con emojis
```

#### **Error: "Cannot resolve module './hooks/...'"**
```bash
# Verificar que los archivos existen:
ls src/hooks/
# Si faltan archivos, recrear los hooks básicos
```

#### **Error: "Unexpected token '<'"**
```bash
# Verificar extensión de archivos:
# Cambiar .jsx a .js si es necesario
# O configurar Webpack para manejar JSX
```

### **7. SOLUCIÓN GRADUAL**

#### **Nivel 1: App básico funcionando**
```javascript
// App.jsx - Solo estructura básica
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/test" element={<div>Test</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

#### **Nivel 2: Agregar página de test**
```javascript
// App.jsx - Con página de test
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestSolicitudesPage from './pages/test/TestSolicitudesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/test/solicitudes" element={<TestSolicitudesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

#### **Nivel 3: Agregar componentes uno por uno**
1. Primero agregar SimpleValidationMessage
2. Luego SimpleFrequencySelector
3. Después los hooks básicos
4. Finalmente los componentes complejos

### **8. ALTERNATIVA SIN DEPENDENCIAS EXTERNAS**

Si todo falla, usar la versión sin dependencias:

```javascript
// src/pages/solicitudes/BasicSolicitudPage.jsx
import React, { useState } from 'react';

const BasicSolicitudPage = () => {
  const [alias, setAlias] = useState('');
  const [radicado, setRadicado] = useState('');
  const [frecuencia, setFrecuencia] = useState('diario');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(\`Solicitud: \${alias}, \${radicado}, \${frecuencia}\`);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Sistema de Solicitudes</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Alias:</label>
          <input 
            type="text" 
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Número de Radicado:</label>
          <input 
            type="text" 
            value={radicado}
            onChange={(e) => setRadicado(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Frecuencia:</label>
          <select 
            value={frecuencia}
            onChange={(e) => setFrecuencia(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
          </select>
        </div>

        <button 
          type="submit"
          style={{ 
            backgroundColor: '#facc15', 
            color: '#111827', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Crear Solicitud
        </button>
      </form>
    </div>
  );
};

export default BasicSolicitudPage;
```

### **9. PASOS DE VERIFICACIÓN**

1. **✅ Test 1:** `npm start` sin errores
2. **✅ Test 2:** Página básica se carga
3. **✅ Test 3:** Navegación funciona
4. **✅ Test 4:** Formulario responde
5. **✅ Test 5:** Estados cambian
6. **✅ Test 6:** Submit funciona

### **10. ÚLTIMA INSTANCIA - RECREAR DESDE CERO**

Si nada funciona:
```bash
# 1. Crear nuevo proyecto React
npx create-react-app solicitudes-test
cd solicitudes-test

# 2. Copiar solo los archivos básicos
cp ../frontend/src/pages/test/TestSolicitudesPage.jsx src/
cp ../frontend/src/components/forms/SimpleValidationMessage.jsx src/components/
cp ../frontend/src/components/forms/SimpleFrequencySelector.jsx src/components/

# 3. Probar paso a paso
npm start
```

---

## 📞 **¿QUÉ HACER AHORA?**

1. **Abrir DevTools** y buscar errores en Console
2. **Reemplazar App.jsx** con la versión de test
3. **Ir a** `/test/solicitudes` 
4. **Reportar** qué errores aparecen en consola

¡Con esto deberías poder identificar exactamente qué está causando el problema! 🔍
