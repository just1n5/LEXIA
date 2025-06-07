import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User, ChevronDown, LogOut, Settings, Menu, X, Bell, BarChart3, Plus, TrendingUp, Palette } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { ThemeToggle } from '../../contexts/ThemeProvider'
import { cn } from '../../utils/cn'
import lexiaLogo from '../../assets/images/Logotipo lexia.png'

/**
 * Componente de menú de usuario mejorado
 * Implementa las especificaciones de accesibilidad y diseño de la guía de estilo
 */
function UserMenuEnhanced() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
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
        toggleRef.current?.focus() // Devolver foco al botón
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

  return (
    <div className="user-menu-enhanced" ref={menuRef}>
      <button 
        ref={toggleRef}
        className="user-menu-toggle-enhanced"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Menú de usuario de ${user?.nombre || 'Usuario'}`}
      >
        <div className="user-avatar">
          <User size={18} aria-hidden="true" />
        </div>
        <span className="user-info hidden md:block">
          <span className="user-name">{user?.nombre || user?.email?.split('@')[0] || 'Usuario'}</span>
          <span className="user-role">Admin</span>
        </span>
        <ChevronDown 
          size={14} 
          aria-hidden="true"
          className={cn(
            'transition-transform duration-200', 
            isOpen && 'rotate-180'
          )} 
        />
      </button>
      
      {isOpen && (
        <div 
          className="user-menu-content-enhanced"
          role="menu"
          aria-label="Opciones de usuario"
        >
          <div className="user-menu-header">
            <div className="user-avatar large">
              <User size={20} aria-hidden="true" />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.nombre || 'Usuario'}</span>
              <span className="user-email">{user?.email || 'usuario@lexia.com'}</span>
            </div>
          </div>
          
          <div className="menu-divider" />
          
          <Link 
            to="/profile" 
            className="user-menu-item-enhanced" 
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <User size={16} aria-hidden="true" />
            <span>Mi Perfil</span>
          </Link>
          
          <Link 
            to="/settings" 
            className="user-menu-item-enhanced" 
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <Settings size={16} aria-hidden="true" />
            <span>Configuración</span>
          </Link>
          
          {/* Toggle de tema dentro del menú */}
          <div className="user-menu-item-enhanced cursor-default flex items-center justify-between" role="menuitem">
            <div className="flex items-center gap-3">
              <Palette size={16} aria-hidden="true" />
              <span>Tema</span>
            </div>
            <ThemeToggle 
              size="sm"
              aria-label="Cambiar tema de la aplicación"
            />
          </div>
          
          <div className="menu-divider" />
          
          <button 
            className="user-menu-item-enhanced destructive w-full text-left" 
            onClick={handleLogout}
            role="menuitem"
          >
            <LogOut size={16} aria-hidden="true" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Componente de navegación móvil mejorado
 */
function NavigationMobile({ navigation, isOpen, onToggle }) {
  const navMenuRef = useRef(null)

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
        onToggle(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onToggle])

  const handleNavMenuKeyDown = (event) => {
    if (event.key === 'Escape') {
      onToggle(false)
    }
  }

  return (
    <div className="lg:hidden" ref={navMenuRef}>
      <button
        onClick={() => onToggle(!isOpen)}
        onKeyDown={handleNavMenuKeyDown}
        className="mobile-nav-toggle"
        aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-menu"
      >
        {isOpen ? (
          <X className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Menu className="w-5 h-5" aria-hidden="true" />
        )}
      </button>
      
      {/* Overlay */}
      {isOpen && <div className="mobile-nav-overlay" onClick={() => onToggle(false)} />}
      
      {/* Menú desplegable de navegación */}
      {isOpen && (
        <div 
          id="mobile-nav-menu"
          className="mobile-nav-menu"
          role="navigation"
          aria-label="Menú de navegación móvil"
        >
          <div className="mobile-nav-header">
            <h3>Navegación</h3>
          </div>
          
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'mobile-nav-item',
                item.current && 'active'
              )}
              onClick={() => onToggle(false)}
              aria-current={item.current ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <div className="nav-content">
                <span className="nav-name">{item.name}</span>
                <span className="nav-description">{item.description}</span>
              </div>
              {item.current && <div className="nav-indicator" aria-hidden="true" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Componente Header principal mejorado
 * Implementa navegación responsiva y accesible según las especificaciones de la guía de estilo
 */
function Header() {
  const location = useLocation()
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false)
  
  // Configuración de navegación mejorada con iconos
  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      current: location.pathname === '/dashboard',
      description: 'Panel principal con analytics inteligente',
      icon: <BarChart3 size={16} />
    },
    { 
      name: 'Nueva Consulta', 
      href: '/solicitudes/select-type', 
      current: location.pathname.includes('/solicitudes/select-type') || location.pathname.includes('/solicitudes/nueva'),
      description: 'Crear consulta con automatización IA',
      icon: <Plus size={16} />
    },
    { 
      name: 'Historial', 
      href: '/historial', 
      current: location.pathname === '/historial',
      description: 'Historial y reportes de consultas',
      icon: <TrendingUp size={16} />
    },
  ]

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsNavMenuOpen(false)
  }, [location.pathname])

  return (
    <header 
      className="header-enhanced"
      role="banner"
    >
      {/* Logo LEXIA con imagen real */}
      <Link 
        to="/dashboard" 
        className="header-logo-enhanced"
        aria-label="LEXIA - Automatización Jurídica Inteligente - Ir al dashboard"
      >
        <div className="flex items-center gap-0.5">
          <img 
            src={lexiaLogo} 
            alt="LEXIA Logo" 
            className="w-16 h-16 object-contain"
          />
          <span className="text-text-primary font-heading font-bold text-2xl">
            LEXIA
          </span>
        </div>
      </Link>
      
      {/* Navegación Principal - Visible en Desktop */}
      <nav 
        className="header-nav-enhanced hidden lg:flex"
        role="navigation"
        aria-label="Navegación principal"
      >
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'header-nav-item-enhanced',
              item.current && 'active'
            )}
            aria-current={item.current ? 'page' : undefined}
            title={item.description}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
            {item.current && <span className="nav-indicator" aria-hidden="true" />}
          </Link>
        ))}
      </nav>

      {/* Controles Principales */}
      <div className="header-controls-enhanced">
        {/* Notificaciones */}
        <button
          className="notification-btn"
          aria-label="Ver notificaciones (3 no leídas)"
          title="Notificaciones"
        >
          <Bell size={18} />
          <span className="notification-badge" aria-hidden="true">3</span>
        </button>
        
        {/* Menú de usuario mejorado */}
        <UserMenuEnhanced />
        
        {/* Menú de navegación móvil */}
        <NavigationMobile 
          navigation={navigation}
          isOpen={isNavMenuOpen}
          onToggle={setIsNavMenuOpen}
        />
      </div>
    </header>
  )
}

export default Header