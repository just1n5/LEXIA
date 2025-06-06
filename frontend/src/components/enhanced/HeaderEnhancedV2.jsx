import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  User, 
  ChevronDown, 
  LogOut, 
  Settings, 
  Menu, 
  X, 
  Bell,
  Sun,
  Moon,
  Monitor
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../contexts/ThemeProvider'
import LexiaLogo from '../brand/LexiaLogo'
import { cn } from '../../utils/cn'

/**
 * 🚀 HeaderEnhanced V2 - Versión simplificada y limpia
 * 
 * ✅ MANTIENE 100% la funcionalidad actual
 * ✅ SIMPLIFICA la interfaz consolidando controles
 * ✅ MEJORA la jerarquía visual
 * 
 * CAMBIOS:
 * - Toggle de tema integrado en menú de usuario
 * - Menos elementos en la barra principal
 * - Mejor organización visual
 * - Mismo sistema de colores y estilos
 */

/**
 * Componente de menú de usuario consolidado con tema
 */
function ConsolidatedUserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const menuRef = useRef(null)
  const toggleRef = useRef(null)

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    // Cerrar con Escape
    function handleEscapeKey(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleToggle()
    }
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    // No cerrar el menú para permitir cambios rápidos
  }

  // Obtener icono del tema actual
  const getThemeIcon = (themeValue) => {
    switch (themeValue) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button 
        ref={toggleRef}
        className="user-menu-toggle" // 🎨 Usar clase existente
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Menú de usuario de ${user?.nombre || 'Usuario'}`}
        style={{
          // 🎨 Micro-interacciones sutiles manteniendo estilos base
          transform: isHovered && !isOpen ? 'scale(1.02)' : 'scale(1)',
          transition: 'var(--transition-default)',
        }}
      >
        <User size={20} aria-hidden="true" />
        <span className="hidden md:inline">
          {user?.nombre || user?.email?.split('@')[0] || 'Usuario'}
        </span>
        <ChevronDown 
          size={16} 
          aria-hidden="true"
          className={cn(
            'transition-transform duration-200', 
            isOpen && 'rotate-180'
          )} 
        />
      </button>
      
      {isOpen && (
        <div 
          className="user-menu-content" // 🎨 Usar clase existente
          role="menu"
          aria-label="Opciones de usuario y configuración"
          style={{
            // 🎨 Usar animación existente pero mejorada
            animation: 'slideDown 0.2s ease-out',
            minWidth: '220px', // Más ancho para acomodar opciones de tema
          }}
        >
          <div className="py-2">
            {/* 📱 User Info - Información del usuario */}
            <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border-default)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {user?.nombre || 'Usuario'}
              </p>
              <p className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>
                {user?.email || 'usuario@ejemplo.com'}
              </p>
            </div>

            {/* 🎨 Theme Selection - Selección de tema */}
            <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border-default)' }}>
              <p className="text-xs font-medium uppercase tracking-wide mb-3" 
                 style={{ color: 'var(--color-text-secondary)' }}>
                Tema
              </p>
              <div className="space-y-1">
                {[
                  { value: 'light', label: 'Claro', icon: Sun },
                  { value: 'dark', label: 'Oscuro', icon: Moon },
                  { value: 'system', label: 'Sistema', icon: Monitor }
                ].map((themeOption) => {
                  const IconComponent = themeOption.icon
                  const isActive = theme === themeOption.value
                  
                  return (
                    <button
                      key={themeOption.value}
                      onClick={() => handleThemeChange(themeOption.value)}
                      className={cn(
                        'flex w-full items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors duration-150',
                        isActive 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      )}
                      role="menuitemradio"
                      aria-checked={isActive}
                    >
                      <IconComponent className="h-4 w-4 flex-shrink-0" />
                      <span>{themeOption.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 rounded-full" 
                             style={{ backgroundColor: 'var(--color-interactive-default)' }} />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* 👤 User Actions - Acciones de usuario */}
            <div className="py-2">
              <button className="user-menu-item"> {/* 🎨 Usar clase existente */}
                <User size={16} aria-hidden="true" />
                <span>Mi Perfil</span>
              </button>
              
              <button className="user-menu-item"> {/* 🎨 Usar clase existente */}
                <Settings size={16} aria-hidden="true" />
                <span>Configuración</span>
              </button>
            </div>
            
            {/* 🚪 Logout - Cerrar sesión */}
            <div className="border-t pt-2" style={{ borderColor: 'var(--color-border-default)' }}>
              <button 
                onClick={handleLogout}
                className="user-menu-item destructive w-full text-left" /* 🎨 Usar clases existentes */
                role="menuitem"
              >
                <LogOut size={16} aria-hidden="true" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Componente de notificaciones simplificado
 */
function NotificationButton({ count = 0 }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button 
      className="hidden md:flex relative items-center justify-center"
      style={{
        // 🎨 Usar estilos del sistema nav-menu-button pero con mejoras
        padding: 'var(--spacing-sm)',
        borderRadius: 'var(--border-radius-sm)',
        border: '2px solid var(--color-bg-light)',
        backgroundColor: 'transparent',
        color: 'var(--color-bg-light)',
        minHeight: 'var(--touch-target-min)',
        minWidth: 'var(--touch-target-min)',
        transition: 'var(--transition-default)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Notificaciones${count > 0 ? ` (${count} nuevas)` : ''}`}
    >
      <Bell size={20} />
      {count > 0 && (
        <span 
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ 
            backgroundColor: 'var(--color-feedback-error)',
            animation: 'pulse 2s infinite',
          }}
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}

/**
 * Header Enhanced V2 - Simplificado
 */
function HeaderEnhancedV2() {
  const location = useLocation()
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false)
  const [isNavButtonHovered, setIsNavButtonHovered] = useState(false)
  const navMenuRef = useRef(null)
  
  // 🔔 Mock notifications
  const [notifications] = useState(3)
  
  // Configuración de navegación - Actualizada para LEXIA
  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      current: location.pathname === '/dashboard',
      description: 'Panel principal con analytics inteligente'
    },
    { 
      name: 'Nueva Consulta', 
      href: '/solicitudes/select-type', 
      current: location.pathname.includes('/solicitudes/select-type') || location.pathname.includes('/solicitudes/nueva'),
      description: 'Crear consulta con automatización IA'
    },
    { 
      name: 'Analytics', 
      href: '/historial', 
      current: location.pathname === '/historial',
      description: 'Insights y reportes automatizados'
    },
  ]

  // Cerrar menú al hacer click fuera - EXACTO al original
  useEffect(() => {
    function handleClickOutside(event) {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
        setIsNavMenuOpen(false)
      }
    }

    if (isNavMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isNavMenuOpen])

  // Cerrar menú al cambiar de ruta - EXACTO al original
  useEffect(() => {
    setIsNavMenuOpen(false)
  }, [location.pathname])

  const toggleNavMenu = () => {
    setIsNavMenuOpen(!isNavMenuOpen)
  }

  const handleNavMenuKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsNavMenuOpen(false)
    }
  }

  return (
    <header 
      className="header" // 🎨 Usar EXACTAMENTE la misma clase del original
      role="banner"
    >
      {/* Logo/Marca LEXIA - Moderno y con hover mejorado */}
      <Link 
        to="/dashboard" 
        className="header-logo flex items-center" // 🎨 Añadir flex para el logo
        aria-label="LEXIA - Automatización Jurídica Inteligente"
        style={{
          transition: 'var(--transition-default)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        <LexiaLogo 
          size="header" 
          variant="light" 
          useRealLogo={true}
          className="transition-all duration-200 hover:scale-105" 
        />
      </Link>
      
      {/* Navegación Desktop - EXACTA al original */}
      <nav 
        className="header-nav" // 🎨 Misma clase exacta
        role="navigation"
        aria-label="Navegación principal"
      >
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'header-nav-item', // 🎨 Misma clase exacta
              item.current && 'active'
            )}
            aria-current={item.current ? 'page' : undefined}
            title={item.description}
            style={{
              transition: 'var(--transition-default)',
              transform: item.current ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* 🚀 REORDENADO: Controles principales con mejor jerarquía */}
      <div className="header-controls"> {/* 🎨 Misma clase exacta */}
        
        {/* 🔔 Notificaciones (solo desktop) */}
        <NotificationButton count={notifications} />
        
        {/* 📱 Botón de navegación móvil - ANTES del usuario */}
        <div className="relative" ref={navMenuRef}>
          <button
            onClick={toggleNavMenu}
            onKeyDown={handleNavMenuKeyDown}
            onMouseEnter={() => setIsNavButtonHovered(true)}
            onMouseLeave={() => setIsNavButtonHovered(false)}
            className="nav-menu-button" // 🎨 Misma clase exacta
            aria-label={isNavMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={isNavMenuOpen}
            aria-controls="nav-menu"
            style={{
              transform: isNavButtonHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'var(--transition-default)',
            }}
          >
            {isNavMenuOpen ? (
              <X 
                className="w-5 h-5" 
                aria-hidden="true"
                style={{
                  transform: isNavMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'var(--transition-default)',
                }}
              />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
          
          {/* Menú desplegable de navegación - EXACTO al original */}
          {isNavMenuOpen && (
            <div 
              id="nav-menu"
              className="nav-dropdown" // 🎨 Misma clase exacta
              role="navigation"
              aria-label="Menú de navegación"
              style={{
                animation: 'slideDown 0.2s ease-out',
                // 🚀 ENHANCED: Mejor posicionamiento para evitar solapamiento
                right: '0',
                left: 'auto',
                minWidth: '200px'
              }}
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'nav-item', // 🎨 Misma clase exacta
                    item.current && 'active'
                  )}
                  onClick={() => setIsNavMenuOpen(false)}
                  aria-current={item.current ? 'page' : undefined}
                  style={{
                    transition: 'var(--transition-default)',
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* 👤 Menú consolidado (usuario + tema) - AL FINAL */}
        <ConsolidatedUserMenu />
      </div>
    </header>
  )
}

export default HeaderEnhancedV2

/* 
🎯 MEJORAS IMPLEMENTADAS:

✅ SIMPLIFICACIÓN VISUAL:
- De 4 elementos a 3 en header-controls
- Toggle de tema integrado en menú de usuario
- Menos noise visual en la barra principal
- Mejor jerarquía de información

✅ MANTIENE 100% funcionalidad:
- Todas las opciones de tema disponibles
- Mismo acceso a perfil y configuración
- Mismas notificaciones
- Misma navegación móvil

✅ MEJORA UX:
- Menos clics para cambiar tema (directo en menú)
- Agrupa funciones relacionadas logicamente
- Mantiene fácil acceso a todo
- Tema con feedback visual (dot indicator)

✅ COHERENCIA VISUAL:
- Usa todas las clases CSS existentes
- Respeta sistema de colores actual
- Mantiene espaciado y tipografía
- Misma estructura HTML base

🔄 IMPLEMENTACIÓN:
1. Reemplazar HeaderEnhanced por HeaderEnhancedV2
2. Zero cambios en CSS
3. Zero breaking changes en funcionalidad
4. Header más limpio inmediatamente
*/