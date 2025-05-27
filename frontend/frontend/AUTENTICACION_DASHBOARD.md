# 🔐 Guía para Probar la Autenticación y Redirección al Dashboard

## 🚀 Configuración Inicial

### 1. Instalar Dependencias
```bash
cd "C:\Users\justi\Desktop\RPA\Prototipo por IA\frontend"
npm install
npm install react-query@^3.39.3
```

### 2. Verificar Variables de Entorno
Asegúrate de que `.env` tiene:
```
VITE_USE_MOCK=true
VITE_API_URL=http://localhost:8000
```

### 3. Ejecutar Servidor
```bash
npm run dev
```

## 🧪 Credenciales de Prueba (Modo Mock)

Para probar la autenticación en modo mock, usa estas credenciales:

**📧 Email:** `admin@test.com`  
**🔒 Password:** `password`

## 🔄 Flujo de Autenticación Completo

### **Test 1: Login y Redirección Automática**

1. **Ir al login:**
   - Navegar a `http://localhost:5173`
   - Debería redirigir automáticamente a `/login`

2. **Intentar login incorrecto:**
   - Email: `wrong@email.com`
   - Password: `wrongpass`
   - ✅ Ver toast de error "Credenciales inválidas"

3. **Login correcto:**
   - Email: `admin@test.com`
   - Password: `password`
   - ✅ Ver loading en botón "Iniciar Sesión"
   - ✅ **Redirección automática al dashboard** después de ~1 segundo
   - ✅ Ver dashboard con datos mock cargados

### **Test 2: Persistencia de Sesión**

1. **Recargar página:**
   - Estar en el dashboard
   - Presionar F5 o recargar
   - ✅ Ver loading spinner breve
   - ✅ **Permanecer en dashboard** (no redirigir a login)

2. **Navegación directa estando autenticado:**
   - Ir a `http://localhost:5173/login` manualmente
   - ✅ **Redirección automática al dashboard**

### **Test 3: Logout y Protección de Rutas**

1. **Cerrar sesión:**
   - En el dashboard, click menú usuario (arriba derecha)
   - Click "Cerrar Sesión"
   - ✅ **Redirección automática al login**

2. **Intentar acceso directo sin autenticación:**
   - Ir a `http://localhost:5173/dashboard`
   - ✅ **Redirección automática al login**

3. **Intentar acceso a ruta raíz:**
   - Ir a `http://localhost:5173/`
   - ✅ **Redirección automática al login**

### **Test 4: Registro y Auto-Login**

1. **Ir a registro:**
   - En login, click tab "Registrarse"
   - Click "Crear nueva cuenta"
   - ✅ Redirigir a selector de tipo de cuenta

2. **Completar registro:**
   - Seguir flujo de registro completo
   - ✅ **Auto-login después del registro**
   - ✅ **Redirección automática al dashboard**

## 🎯 Estados de la Aplicación

### **🔓 Usuario NO Autenticado**
- `/` → Redirige a `/login`
- `/dashboard` → Redirige a `/login`
- `/login` → Muestra login
- `/auth/*` → Muestra páginas de auth

### **🔒 Usuario Autenticado**
- `/` → Redirige a `/dashboard`
- `/dashboard` → Muestra dashboard
- `/login` → Redirige a `/dashboard`
- `/auth/*` → Redirige a `/dashboard`

## 🔧 Verificación Técnica

### **LocalStorage**
Después del login, verifica en DevTools > Application > LocalStorage:
```
Key: accessToken
Value: mock-token-12345
```

### **Contexto de Auth**
En React DevTools, verificar `AuthContext`:
```javascript
{
  user: { id: '1', email: 'admin@test.com', nombre: 'Juan Pérez' },
  isAuthenticated: true,
  isLoading: false,
  error: null
}
```

### **Network Requests (Mock)**
En DevTools > Network, NO deberías ver requests a API real, solo:
- Simulación de delay de ~1 segundo en login
- No errores 404 o conexión

## 🏗️ Arquitectura de Autenticación

### **Componentes Creados/Actualizados:**

1. **`AuthContext.jsx`** - Manejo de estado global con modo mock
2. **`ProtectedRoute.jsx`** - Protege rutas privadas
3. **`PublicRoute.jsx`** - ✨ **NUEVO** - Redirige si ya autenticado
4. **`App.jsx`** - Routing con redirecciones automáticas
5. **`DashboardPage.jsx`** - Incluye Layout automáticamente

### **Flujo de Redirección:**

```
Usuario no autenticado:
/ → /login (ProtectedRoute)
/dashboard → /login (ProtectedRoute)
/login → /login ✓

Usuario autenticado:
/ → /dashboard (ProtectedRoute)
/dashboard → /dashboard ✓
/login → /dashboard (PublicRoute)
```

## 🐛 Troubleshooting

### **Problema: Loop infinito de redirecciones**
- Verificar que `isLoading` termine en `false`
- Check `localStorage.getItem('accessToken')`

### **Problema: No redirige después del login**
- Verificar credenciales: `admin@test.com` / `password`
- Check console para errores
- Verificar que `VITE_USE_MOCK=true`

### **Problema: Dashboard no carga**
- Verificar que `react-query` está instalado
- Check imports de componentes
- Verificar rutas en `App.jsx`

### **Problema: CSS roto o estilos faltantes**
- Ejecutar `npm run build && npm run dev`
- Verificar que Tailwind está configurado
- Check que `globals.css` se importa en `main.jsx`

### **Problema: Componentes no encontrados**
- Verificar imports relativos `../../`
- Check que todos los archivos existen
- Reinstalar: `rm -rf node_modules && npm install`

## ✅ Checklist de Verificación

### **Flujo Básico:**
- [ ] Login con credenciales correctas funciona
- [ ] Redirección automática al dashboard después del login
- [ ] Dashboard carga con datos mock
- [ ] Logout funciona y redirige al login
- [ ] Sesión persiste al recargar página

### **Protección de Rutas:**
- [ ] `/dashboard` redirige a login si no autenticado
- [ ] `/` redirige a login si no autenticado
- [ ] `/login` redirige a dashboard si ya autenticado
- [ ] Header con menú de usuario funciona

### **Estados de Loading:**
- [ ] Loading spinner durante verificación inicial
- [ ] Loading en botón durante login
- [ ] Transiciones suaves entre estados

### **Integración Dashboard:**
- [ ] Dashboard mantiene todo el diseño original
- [ ] Tabla con datos mock funciona
- [ ] Búsqueda y paginación operativas
- [ ] Modal de eliminación abre correctamente
- [ ] Toast notifications aparecen

## 🎯 Resultado Esperado

Al completar todas las pruebas:

1. **✅ Autenticación completa** - Login/logout funcional
2. **✅ Redirección inteligente** - Automática según estado auth
3. **✅ Protección de rutas** - Acceso controlado
4. **✅ Persistencia de sesión** - Mantiene login al recargar
5. **✅ Dashboard integrado** - Funciona después del login
6. **✅ UX fluida** - Transiciones y loading states

## 🔄 Flujo Completo de Usuario

```
1. Usuario va a app → Redirige a /login
2. Ingresa credenciales → Loading → Dashboard
3. Usuario navega y usa dashboard → Todo funciona
4. Usuario recarga página → Mantiene sesión → Dashboard
5. Usuario cierra sesión → Redirige a /login
6. Usuario intenta /dashboard → Redirige a /login
```

## 📝 Notas Importantes

- **Modo Mock activo**: No necesitas backend funcionando
- **Credenciales fijas**: `admin@test.com` / `password`
- **Token mock**: Se guarda en localStorage como `mock-token-12345`
- **Datos persistentes**: Las solicitudes mock se mantienen durante la sesión
- **Responsive**: Funciona en desktop, tablet y mobile

**¡El sistema de autenticación está completamente integrado con el dashboard!** 🎉

## 🚀 Próximos Pasos

1. **Probar toda la funcionalidad** siguiendo esta guía
2. **Verificar responsive** en diferentes dispositivos
3. **Integrar con backend real** cambiando `VITE_USE_MOCK=false`
4. **Añadir más páginas** (perfil, configuración, etc.)
5. **Implementar recuperación de contraseña**
