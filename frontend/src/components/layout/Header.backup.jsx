import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User, ChevronDown, LogOut, Settings, Menu, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { ThemeToggle } from '../../contexts/ThemeProvider'
import { cn } from '../../utils/cn'
import LexiaLogo from '../brand/LexiaLogo'

/**
 * Componente de menú de usuario mejorado
 * Implementa las especificaciones de accesibilidad y diseño de la guía de estilo
 */
function UserMenu() {
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
    <div className="user-menu" ref={menuRef}>
      <button 
        ref={toggleRef}
        className="user-menu-toggle"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Menú de usuario de ${user?.nombre || 'Usuario'}`}
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
          className="user-menu-content"
          role="menu"
          aria-label="Opciones de usuario"
        >
          <Link 
            to="/profile" 
            className="user-menu-item" 
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <User size={16} aria-hidden="true" />
            <span>Mi Perfil</span>
          </Link>
          
          <Link 
            to="/settings" 
            className="user-menu-item" 
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <Settings size={16} aria-hidden="true" />
            <span>Configuración</span>
          </Link>
          
          <button 
            className="user-menu-item destructive w-full text-left" 
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
 * Componente Header principal
 * Implementa navegación responsiva y accesible según las especificaciones de la guía de estilo
 */
function Header() {
  const location = useLocation()
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false)
  const navMenuRef = useRef(null)
  
  // Configuración de navegación
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

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
        setIsNavMenuOpen(false)
      }
    }

    if (isNavMenuOpen) {
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
  }, [isNavMenuOpen])

  // Cerrar menú al cambiar de ruta
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
      className="header"
      role="banner"
    >
      {/* Logo/Marca LEXIA */}
      <Link 
        to="/dashboard" 
        className="header-logo flex items-center"
        aria-label="LEXIA - Automatización Jurídica Inteligente"
      >
        <LexiaLogo 
          size="header" 
          variant="light" 
          useRealLogo={true}
          className="transition-all duration-200 hover:scale-105" 
        />
      </Link>
      
      {/* Navegación Desktop - Ahora oculta, solo en dropdown */}
      <nav 
        className="header-nav"
        role="navigation"
        aria-label="Navegación principal"
      >
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'header-nav-item',
              item.current && 'active'
            )}
            aria-current={item.current ? 'page' : undefined}
            title={item.description}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Controles Principales (Theme, User, Nav Menu) */}
      <div className="header-controls">
        {/* Toggle de tema */}
        <ThemeToggle 
          size="sm"
          aria-label="Cambiar tema de la aplicación"
        />
        
        {/* Menú de usuario */}
        <UserMenu />
        
        {/* Botón de menú de navegación */}
        <div className="relative" ref={navMenuRef}>
          <button
            onClick={toggleNavMenu}
            onKeyDown={handleNavMenuKeyDown}
            className="nav-menu-button"
            aria-label={isNavMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={isNavMenuOpen}
            aria-controls="nav-menu"
          >
            {isNavMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
          
          {/* Menú desplegable de navegación */}
          {isNavMenuOpen && (
            <div 
              id="nav-menu"
              className="nav-dropdown"
              role="navigation"
              aria-label="Menú de navegación"
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'nav-item',
                    item.current && 'active'
                  )}
                  onClick={() => setIsNavMenuOpen(false)}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header