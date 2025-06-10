# 🏃‍♂️ Primera Contribución - LEXIA

<div align="center">
  
  **Tu primera contribución exitosa en menos de 30 minutos**
  
  *De cero a pull request mergeable siguiendo nuestros estándares*

</div>

---

## 🎯 **Objetivo**

Al final de esta guía serás capaz de:
- ✅ **Identificar** una tarea apropiada para tu primera contribución
- ✅ **Crear** un pull request siguiendo nuestros estándares
- ✅ **Pasar** el proceso de code review exitosamente
- ✅ **Mergear** tu primera contribución a LEXIA

**⏱️ Tiempo estimado**: 20-30 minutos (después del setup inicial)

---

## 📋 **Pre-requisitos**

### **✅ Checklist Obligatorio**

Antes de empezar, verifica que tienes:

- [ ] ✅ **Setup de desarrollo completado** → [Development Setup](./development-setup.md)
- [ ] ✅ **Aplicación corriendo localmente** (frontend + backend funcionando)
- [ ] ✅ **Cuenta GitHub** con SSH keys configuradas
- [ ] ✅ **Git configurado** con tu nombre y email
- [ ] ✅ **Editor configurado** (VS Code recomendado con extensiones)

### **🔧 Verificación Rápida**

```bash
# Verificar que todo está funcionando
git --version                    # Git instalado
node --version                   # Node.js 18+
python --version                 # Python 3.9+
docker --version                 # Docker funcionando

# Verificar que LEXIA corre localmente
curl http://localhost:8000/health   # Backend: {"status": "healthy"}
curl http://localhost:3000          # Frontend: HTML response
```

---

## 🎯 **Paso 1: Identificar Tu Primera Tarea**

### **🌟 Opciones Recomendadas para Primera Contribución**

#### **🔰 Nivel Principiante (Recomendado)**

| Tipo | Ejemplo | Dificultad | Tiempo |
|------|---------|------------|---------|
| **📝 Documentation** | Corregir typo, agregar ejemplo | ⭐ | 10 min |
| **🎨 UI Polish** | Ajustar spacing, mejorar accesibilidad | ⭐⭐ | 20 min |
| **🧪 Tests** | Agregar test unitario faltante | ⭐⭐ | 15 min |
| **🔧 Refactor** | Extraer componente reutilizable | ⭐⭐⭐ | 30 min |

#### **🔍 Cómo Encontrar Issues**

1. **GitHub Issues con label `good-first-issue`**:
   ```
   https://github.com/tu-org/lexia/labels/good-first-issue
   ```

2. **TODO comments en el código**:
   ```bash
   # Buscar TODOs en el proyecto
   grep -r "TODO\|FIXME\|XXX" src/ --include="*.tsx" --include="*.ts"
   ```

3. **Improvements obvios** (mientras exploras el código):
   - Componentes sin tests
   - Funciones sin documentación JSDoc
   - Hardcoded strings que deberían ser constantes
   - Missing TypeScript types

### **💡 Sugerencias Específicas de Primera Contribución**

#### **📝 Documentation (Más fácil)**
```bash
# Ejemplos de mejoras de documentación:
1. Agregar ejemplo de uso en README.md
2. Completar JSDoc en componentes
3. Traducir comentarios al español
4. Agregar screenshots a guías de usuario
```

#### **🎨 Frontend (Intermedio)**
```bash
# Ejemplos de mejoras de UI:
1. Agregar loading states faltantes
2. Mejorar responsive design
3. Agregar animaciones sutiles
4. Implementar dark mode toggle
```

#### **🧪 Testing (Intermedio)**
```bash
# Ejemplos de tests faltantes:
1. Test para componente Button
2. Test para hook useAuth
3. Test de integración para API endpoint
4. E2E test para flujo de login
```

---

## 🚀 **Paso 2: Workflow de Contribución**

### **🔄 Git Workflow Estándar**

#### **1. Fork y Clone (Solo primera vez)**

```bash
# 1. Fork en GitHub UI (botón "Fork")
# 2. Clone tu fork
git clone git@github.com:TU-USERNAME/lexia.git
cd lexia

# 3. Agregar upstream
git remote add upstream git@github.com:ORIGINAL-OWNER/lexia.git

# 4. Verificar remotes
git remote -v
# origin    git@github.com:TU-USERNAME/lexia.git (fetch)
# origin    git@github.com:TU-USERNAME/lexia.git (push)
# upstream  git@github.com:ORIGINAL-OWNER/lexia.git (fetch)
# upstream  git@github.com:ORIGINAL-OWNER/lexia.git (push)
```

#### **2. Crear Feature Branch**

```bash
# 1. Asegurarte de estar en main y actualizado
git checkout main
git pull upstream main

# 2. Crear branch descriptiva
git checkout -b tipo/descripcion-corta

# Ejemplos de nombres de branch:
git checkout -b docs/fix-readme-typos
git checkout -b feat/add-loading-spinner
git checkout -b fix/button-disabled-state
git checkout -b test/add-solicitud-form-tests
```

### **📝 Convenciones de Naming**

#### **🌿 Branch Names**
```bash
# Formato: tipo/descripcion-en-kebab-case
feat/nueva-funcionalidad        # Nueva feature
fix/corregir-bug               # Bug fix
docs/actualizar-documentacion  # Documentation
test/agregar-tests             # Tests
refactor/limpiar-codigo        # Refactoring
style/ajustar-estilos         # UI/styling
```

#### **💬 Commit Messages**
Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Formato: tipo(scope): descripción

# Ejemplos:
feat(auth): add remember me checkbox
fix(button): correct disabled state styling  
docs(readme): fix installation steps
test(solicitud): add form validation tests
refactor(utils): extract validation helpers
style(header): improve mobile responsiveness
```

**Tipos válidos:**
- `feat`: Nueva funcionalidad
- `fix`: Bug fix
- `docs`: Documentación
- `test`: Tests
- `refactor`: Refactoring
- `style`: Cambios de estilo/formato
- `perf`: Mejora de performance
- `ci`: Cambios de CI/CD

---

## 🛠️ **Paso 3: Desarrollar tu Contribución**

### **📝 Ejemplo Completo: Agregar Loading State al Button**

Vamos a seguir un ejemplo real paso a paso:

#### **1. Identificar el Issue**

```
Issue #123: Button component should show loading state
- El componente Button no tiene prop "loading"
- Necesitamos mostrar spinner cuando isLoading=true
- Debe mantener accesibilidad (aria-disabled)
```

#### **2. Crear Branch**

```bash
git checkout main
git pull upstream main
git checkout -b feat/button-loading-state
```

#### **3. Implementar el Cambio**

```typescript
// src/components/ui/Button.tsx - ANTES
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  children,
  onClick 
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

```typescript
// src/components/ui/Button.tsx - DESPUÉS
import { Loader2 } from 'lucide-react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean  // ✅ Nueva prop
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,  // ✅ Nueva prop con default
  children,
  onClick 
}: ButtonProps) {
  const isDisabled = disabled || loading  // ✅ Disabled cuando loading

  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={isDisabled}
      aria-disabled={isDisabled}  // ✅ Accesibilidad
      onClick={onClick}
    >
      {loading ? (  // ✅ Mostrar spinner cuando loading
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  )
}
```

#### **4. Agregar Tests**

```typescript
// src/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('should show loading state', () => {
    render(
      <Button loading>
        Submit
      </Button>
    )
    
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
  })
  
  it('should not show loading when loading=false', () => {
    render(
      <Button loading={false}>
        Submit
      </Button>
    )
    
    expect(screen.getByText('Submit')).toBeInTheDocument()
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
  })
})
```

#### **5. Actualizar Documentación**

```markdown
<!-- docs/design-system/button-system.md -->

### **🔄 Loading State**

```jsx
<Button loading={true}>
  Procesando...
</Button>
```

**Cuándo usar:**
- ✅ Operaciones asíncronas (submit forms, API calls)
- ✅ Prevenir doble click
- ✅ Feedback visual inmediato

**Comportamiento:**
- Muestra spinner animado
- Texto cambia a "Cargando..."
- Botón se deshabilita automáticamente
- Mantiene accesibilidad (aria-disabled)
```

#### **6. Probar Localmente**

```bash
# Frontend tests
npm run test Button.test.tsx
npm run lint
npm run type-check

# Test manual en browser
npm run dev
# Ir a http://localhost:3000 y probar el componente

# Test visual en Storybook (si aplica)
npm run storybook
```

### **✅ Quality Checklist**

Antes de hacer commit, verificar:

- [ ] ✅ **Funcionalidad**: El cambio funciona como se espera
- [ ] ✅ **Tests**: Tests pasan (nuevos y existentes)
- [ ] ✅ **Linting**: `npm run lint` sin errores
- [ ] ✅ **Types**: `npm run type-check` sin errores
- [ ] ✅ **Manual testing**: Probado en browser
- [ ] ✅ **Accesibilidad**: ARIA labels cuando corresponde
- [ ] ✅ **Documentation**: Docs actualizadas si es necesario
- [ ] ✅ **No breaking changes**: Backward compatibility mantenida

---

## 📤 **Paso 4: Commit y Push**

### **💬 Hacer Commits de Calidad**

```bash
# 1. Review de cambios
git status
git diff

# 2. Stage solo archivos relacionados
git add src/components/ui/Button.tsx
git add src/components/ui/Button.test.tsx
git add docs/design-system/button-system.md

# 3. Commit con mensaje descriptivo
git commit -m "feat(button): add loading state with spinner

- Add loading prop to Button component
- Show Loader2 icon when loading=true
- Auto-disable button during loading
- Add aria-disabled for accessibility
- Add comprehensive tests for loading state
- Update design system documentation

Closes #123"

# 4. Push a tu fork
git push origin feat/button-loading-state
```

### **📋 Template de Commit Message**

```
tipo(scope): descripción corta en presente

Descripción más detallada explicando:
- Qué cambios se hicieron
- Por qué eran necesarios
- Cómo afecta al usuario/developer

Breaking changes (si aplica):
BREAKING CHANGE: descripción del breaking change

Closes #123
```

---

## 🔄 **Paso 5: Crear Pull Request**

### **📝 Crear PR en GitHub**

1. **Ir a tu fork** en GitHub
2. **Click "Compare & pull request"** (aparece automáticamente)
3. **Llenar template de PR** (se auto-completa):

```markdown
## 📋 Descripción

Agrega estado de loading al componente Button para mejorar UX durante operaciones asíncronas.

## 🎯 Tipo de Cambio

- [x] ✨ Nueva funcionalidad (feat)
- [ ] 🐛 Bug fix (fix)
- [ ] 📝 Documentación (docs)
- [ ] 🧪 Tests (test)

## ✅ Testing

- [x] Unit tests agregados y pasan
- [x] Tests existentes pasan
- [x] Testing manual completado
- [x] No breaking changes

## 📸 Screenshots

**Antes:**
[Screenshot del botón normal]

**Después:**
[Screenshot del botón con loading]

## 📋 Checklist

- [x] Code follows style guidelines
- [x] Self-review completado
- [x] Code comentado en áreas complejas
- [x] Documentación actualizada
- [x] Tests agregados para nueva funcionalidad
- [x] Todos los tests pasan

## 🔗 Issues Relacionados

Closes #123

## 📝 Notas Adicionales

Esta implementación mantiene backward compatibility y sigue los patrones existentes del design system.
```

### **🎯 PR Title Convention**

```bash
# Formato: tipo(scope): descripción
feat(button): add loading state with spinner animation
fix(auth): resolve token refresh infinite loop
docs(readme): update installation instructions
test(solicitud): add form validation tests
```

---

## 👀 **Paso 6: Proceso de Review**

### **🔍 Qué Esperar del Review**

#### **⚡ Review Típico (1-2 días)**

```markdown
Reviewer comments:

💬 @reviewer1:
"Great work! A few small suggestions:

1. Consider extracting the loading text to a prop for i18n
2. The spinner size should adapt to button size  
3. Could you add a test for the disabled behavior?

Otherwise LGTM! 🚀"

🔧 Requested Changes:
- [ ] Add loadingText prop
- [ ] Responsive spinner size  
- [ ] Additional test case
```

#### **✅ Implementar Feedback**

```typescript
// Implementar sugerencias del reviewer
interface ButtonProps {
  // ... existing props
  loading?: boolean
  loadingText?: string  // ✅ Nueva prop sugerida
}

export function Button({ 
  // ... existing props
  loading = false,
  loadingText = 'Cargando...',  // ✅ Customizable text
  children,
}: ButtonProps) {
  // ✅ Spinner size responsive
  const spinnerSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'

  return (
    <button className={`btn btn-${variant} btn-${size}`} disabled={isDisabled}>
      {loading ? (
        <>
          <Loader2 className={`${spinnerSize} animate-spin mr-2`} />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}
```

```bash
# Commit los cambios del review
git add .
git commit -m "feat(button): address review feedback

- Add loadingText prop for i18n support
- Make spinner size responsive to button size
- Add test for disabled behavior during loading

Co-authored-by: Reviewer Name <reviewer@email.com>"

git push origin feat/button-loading-state
```

### **🎉 Approval y Merge**

```markdown
✅ @reviewer1 approved these changes

💬 @maintainer:
"Excellent first contribution! Thanks for being so responsive to feedback. 

The loading state looks great and the tests are comprehensive. Welcome to the team! 🎉

Merging now..."

🎯 Pull request merged by @maintainer
```

---

## 🏆 **Paso 7: Post-Merge**

### **🧹 Cleanup Local**

```bash
# 1. Switch back to main
git checkout main

# 2. Update from upstream
git pull upstream main

# 3. Delete feature branch (local)
git branch -d feat/button-loading-state

# 4. Delete remote branch (opcional)
git push origin --delete feat/button-loading-state

# 5. Verify your change is in main
git log --oneline -10
# Should see your commit in the history
```

### **🎉 Celebrar tu Primera Contribución**

**¡Felicitaciones! 🎊** Acabas de:

- ✅ **Completar** tu primera contribución a LEXIA
- ✅ **Seguir** el workflow profesional completo
- ✅ **Aprender** nuestros estándares de código y documentación
- ✅ **Ser parte** oficial del equipo de contributors

### **📈 Próximos Pasos**

Ahora que ya tienes experiencia, puedes:

1. **🎯 Buscar issues más complejos** con labels `help-wanted`
2. **🚀 Proponer nuevas features** para mejorar LEXIA
3. **👥 Ayudar a otros contributors** en el review process
4. **📚 Contribuir a documentación** y guías como esta

---

## 🚨 **Troubleshooting Común**

### **❌ Git Issues**

#### **"Git Push Rejected"**
```bash
# Error: Updates were rejected
git pull upstream main --rebase
git push origin tu-branch-name --force-with-lease
```

#### **"Merge Conflicts"**
```bash
# Durante rebase
git status  # Ver archivos en conflicto
# Editar archivos manualmente para resolver conflictos
git add archivo-resuelto.tsx
git rebase --continue
```

#### **"Branch Out of Date"**
```bash
# Actualizar branch con main
git checkout tu-branch
git rebase upstream/main
git push origin tu-branch --force-with-lease
```

### **❌ Code Issues**

#### **"Tests Failing"**
```bash
# Run específico test
npm run test Button.test.tsx

# Run en watch mode
npm run test:watch

# Debug mode
npm run test -- --verbose
```

#### **"Linting Errors"**
```bash
# Auto-fix what's possible
npm run lint -- --fix

# Check specific file
npx eslint src/components/ui/Button.tsx
```

#### **"TypeScript Errors"**
```bash
# Check types
npm run type-check

# Build to see all errors
npm run build
```

### **❌ PR Issues**

#### **"CI/CD Failing"**
- ✅ **Check GitHub Actions** tab en tu PR
- ✅ **Fix failing tests** locally first
- ✅ **Push fixes** y CI re-runs automáticamente

#### **"Review Taking Too Long"**
- ✅ **Ping maintainers** cortésmente después de 3-4 días
- ✅ **Check if CI is passing** (prerrequisito para review)
- ✅ **Self-review** para catchear obvios issues

---

## 📚 **Recursos Adicionales**

### **🔗 Links Útiles**

- **📖 Contributing Guidelines**: [CONTRIBUTING.md](../CONTRIBUTING.md)
- **🎨 Design System**: [Design System Overview](../design-system/overview.md)
- **🧪 Testing Guide**: [Testing Strategy](../testing/strategy.md)
- **🔧 Development Setup**: [Development Setup](./development-setup.md)

### **👥 Comunidad y Soporte**

- **💬 Discord**: #contributors channel
- **📧 Email**: contributors@lexia.co
- **📞 Office Hours**: Viernes 3-4 PM (optional video call)
- **📚 Mentorship**: Programa de mentoring para nuevos contributors

### **🏆 Recognition**

Tu contribución será reconocida en:

- ✅ **README.md**: Contributors section
- ✅ **Changelog**: Release notes
- ✅ **LinkedIn**: Post celebrando contribución (si deseas)
- ✅ **Team Slack**: Shoutout en #general

---

<div align="center">

**🎉 ¡Lista para tu primera contribución!**

[![Find Good First Issue](https://img.shields.io/badge/🔍-Find_Good_First_Issue-green?style=for-the-badge)](https://github.com/lexia/lexia/labels/good-first-issue)
[![Ask Questions](https://img.shields.io/badge/💬-Ask_Questions-blue?style=for-the-badge)](https://discord.gg/lexia-contributors)

---

<sub>📝 **¿Problemas siguiendo esta guía?** [Reportar Issue](https://github.com/lexia/lexia/issues/new?template=docs-improvement)</sub><br/>
<sub>⭐ **¿Te ayudó?** ¡Comparte con otros developers!</sub><br/>
<sub>🔄 **Última actualización:** Enero 2025 | **Mantenido por:** Maintainers Team</sub>

</div>