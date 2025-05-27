import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * Context para manejo de temas (claro/oscuro)
 * Implementa las especificaciones de la guía de estilo para modo oscuro
 */
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
})

/**
 * Hook para usar el contexto de tema
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider')
  }
  return context
}

/**
 * Proveedor de tema que maneja la lógica de cambio entre modo claro y oscuro
 * 
 * Características:
 * - Persiste la preferencia del usuario en localStorage
 * - Respeta la preferencia del sistema operativo como valor inicial
 * - Aplica las clases CSS apropiadas al documento
 * - Proporciona métodos para cambiar y alternar temas
 */
export const ThemeProvider = ({ children, defaultTheme = 'system' }) => {
  const [theme, setTheme] = useState(() => {
    // Intentar obtener tema guardado del localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        return savedTheme
      }
    }
    return defaultTheme
  })

  /**
   * Obtiene el tema efectivo basado en la preferencia y sistema
   */
  const getEffectiveTheme = (currentTheme) => {
    if (currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return currentTheme
  }

  /**
   * Aplica el tema al documento HTML
   */
  const applyTheme = (newTheme) => {
    const root = window.document.documentElement
    const effectiveTheme = getEffectiveTheme(newTheme)
    
    // Remover clases anteriores
    root.classList.remove('light', 'dark')
    
    // Aplicar nueva clase
    root.classList.add(effectiveTheme)
    
    // Actualizar meta theme-color para dispositivos móviles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      if (effectiveTheme === 'dark') {
        metaThemeColor.setAttribute('content', '#1F2937') // bg-dark-primary
      } else {
        metaThemeColor.setAttribute('content', '#374151') // text-base
      }
    }
  }

  /**
   * Cambia el tema y persiste la preferencia
   */
  const changeTheme = (newTheme) => {
    if (!['light', 'dark', 'system'].includes(newTheme)) {
      console.warn(`Tema inválido: ${newTheme}. Debe ser 'light', 'dark' o 'system'.`)
      return
    }

    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  /**
   * Alterna entre modo claro y oscuro
   */
  const toggleTheme = () => {
    const currentEffective = getEffectiveTheme(theme)
    const newTheme = currentEffective === 'light' ? 'dark' : 'light'
    changeTheme(newTheme)
  }

  // Efecto para aplicar el tema inicial y escuchar cambios del sistema
  useEffect(() => {
    applyTheme(theme)

    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [theme])

  // Efecto para crear meta theme-color si no existe
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta')
        metaThemeColor.setAttribute('name', 'theme-color')
        document.head.appendChild(metaThemeColor)
      }
      
      // Aplicar color inicial
      const effectiveTheme = getEffectiveTheme(theme)
      metaThemeColor.setAttribute(
        'content', 
        effectiveTheme === 'dark' ? '#1F2937' : '#374151'
      )
    }
  }, [])

  const value = {
    theme,
    setTheme: changeTheme,
    toggleTheme,
    effectiveTheme: getEffectiveTheme(theme),
    isDark: getEffectiveTheme(theme) === 'dark',
    isLight: getEffectiveTheme(theme) === 'light',
    isSystem: theme === 'system',
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Componente para alternar tema con icono
 * Implementa las especificaciones de accesibilidad de la guía de estilo
 */
export const ThemeToggle = ({ className = '', size = 'md', ...props }) => {
  const { theme, toggleTheme, isDark } = useTheme()
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        inline-flex items-center justify-center
        rounded-md border-2
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2
        min-h-[48px] min-w-[48px]
        ${isDark 
          ? 'bg-gray-800 border-gray-200 text-gray-200 hover:bg-gray-700 hover:border-yellow-400 hover:text-yellow-400' 
          : 'bg-transparent border-gray-100 text-gray-100 hover:bg-white hover:bg-opacity-10 hover:border-yellow-400 hover:text-yellow-400'
        }
        active:scale-95
        ${sizeClasses[size]}
        ${className}
      `}
      aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
      title={`Modo actual: ${isDark ? 'Oscuro' : 'Claro'}. Clic para cambiar.`}
      {...props}
    >
      {isDark ? (
        // Icono de sol para modo oscuro (cambiar a claro)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        // Icono de luna para modo claro (cambiar a oscuro)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  )
}

/**
 * Componente selector de tema más completo
 * Incluye opciones para claro, oscuro y sistema
 */
export const ThemeSelector = ({ className = '' }) => {
  const { theme, setTheme, effectiveTheme } = useTheme()

  const themes = [
    {
      value: 'light',
      label: 'Claro',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2m8.5-10h2m-18.5 0h2m15.07-6.93l1.41 1.41M4.93 4.93l1.41 1.41m12.73 12.73l1.41 1.41M4.93 19.07l1.41 1.41" />
        </svg>
      ),
    },
    {
      value: 'dark',
      label: 'Oscuro',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ),
    },
    {
      value: 'system',
      label: 'Sistema',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
  ]

  return (
    <div className={`flex bg-bg-light rounded-md p-1 ${className}`} role="radiogroup" aria-label="Seleccionar tema">
      {themes.map((themeOption) => (
        <button
          key={themeOption.value}
          onClick={() => setTheme(themeOption.value)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-sm text-sm font-medium
            transition-default focus-ring
            ${theme === themeOption.value
              ? 'bg-interactive-default text-text-base shadow-sm'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-canvas'
            }
          `}
          aria-pressed={theme === themeOption.value}
          role="radio"
          aria-checked={theme === themeOption.value}
        >
          {themeOption.icon}
          <span>{themeOption.label}</span>
          {theme === 'system' && themeOption.value === 'system' && (
            <span className="text-xs opacity-75">
              ({effectiveTheme === 'dark' ? 'Oscuro' : 'Claro'})
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default ThemeProvider