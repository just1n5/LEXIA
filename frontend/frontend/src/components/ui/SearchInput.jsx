import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Loader } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Componente de búsqueda con debounce automático
 * Implementa las especificaciones exactas de la guía de estilo
 * Corrige el problema de sobreposición de iconos y texto
 */
const SearchInput = React.forwardRef((
  {
    placeholder = 'Buscar...',
    onSearch = () => {},
    onClear = () => {},
    debounceMs = 300,
    value = '',
    disabled = false,
    loading = false,
    showClearButton = true,
    className = '',
    size = 'md',
    variant = 'default',
    fullWidth = true,
    ...props
  },
  ref
) => {
  const [inputValue, setInputValue] = useState(value)
  const [isSearching, setIsSearching] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const timeoutRef = useRef()
  const inputRef = useRef()

  // Usar ref externa si se proporciona, sino usar la interna
  const finalRef = ref || inputRef

  // Sincronizar valor externo con estado interno
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Cancelar búsqueda anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Mostrar estado de búsqueda
    setIsSearching(true)

    // Debounce la búsqueda
    timeoutRef.current = setTimeout(() => {
      setIsSearching(false)
      onSearch(newValue)
    }, debounceMs)
  }

  const handleClear = () => {
    setInputValue('')
    setIsSearching(false)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    onSearch('')
    onClear()
    
    // Enfocar el input después de limpiar
    if (finalRef.current) {
      finalRef.current.focus()
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  // Calcular clases según el tamaño
  const sizeClasses = {
    sm: {
      container: 'h-8',
      input: 'text-sm pl-8 pr-8',
      icon: 'w-4 h-4',
      iconLeft: 'left-2',
      iconRight: 'right-2'
    },
    md: {
      container: 'h-10',
      input: 'text-body-paragraph pl-10 pr-10',
      icon: 'w-5 h-5',
      iconLeft: 'left-3',
      iconRight: 'right-3'
    },
    lg: {
      container: 'h-12',
      input: 'text-lg pl-12 pr-12',
      icon: 'w-6 h-6',
      iconLeft: 'left-3',
      iconRight: 'right-3'
    }
  }

  // Calcular clases según la variante
  const variantClasses = {
    default: {
      container: cn(
        'border border-border-default bg-bg-canvas',
        'focus-within:border-interactive-default focus-within:ring-2 focus-within:ring-interactive-default/20',
        'hover:border-text-secondary transition-default',
        disabled && 'opacity-50 cursor-not-allowed',
        isFocused && 'border-interactive-default ring-2 ring-interactive-default/20'
      ),
      input: 'text-text-primary placeholder:text-text-secondary bg-transparent'
    },
    filled: {
      container: cn(
        'bg-bg-light border border-transparent',
        'focus-within:bg-bg-canvas focus-within:border-interactive-default focus-within:ring-2 focus-within:ring-interactive-default/20',
        'hover:bg-bg-canvas transition-default',
        disabled && 'opacity-50 cursor-not-allowed',
        isFocused && 'bg-bg-canvas border-interactive-default ring-2 ring-interactive-default/20'
      ),
      input: 'text-text-primary placeholder:text-text-secondary bg-transparent'
    }
  }

  const currentSize = sizeClasses[size]
  const currentVariant = variantClasses[variant]

  // Determinar qué icono mostrar en el lado derecho
  const rightIcon = (() => {
    if (loading || isSearching) {
      return <Loader className={cn(currentSize.icon, 'animate-spin text-text-secondary')} />
    }
    if (showClearButton && inputValue && !disabled) {
      return (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'text-text-secondary hover:text-text-primary transition-default',
            'focus:outline-none focus:text-interactive-default',
            'touch-target flex items-center justify-center'
          )}
          aria-label="Limpiar búsqueda"
        >
          <X className={currentSize.icon} />
        </button>
      )
    }
    return null
  })()

  return (
    <div 
      className={cn(
        'relative flex items-center',
        fullWidth ? 'w-full' : 'w-auto',
        className
      )}
    >
      <div className={cn(
        'relative flex items-center rounded-md transition-default',
        currentSize.container,
        currentVariant.container,
        fullWidth ? 'w-full' : 'w-auto'
      )}>
        {/* Icono de búsqueda a la izquierda */}
        <Search 
          className={cn(
            currentSize.icon,
            currentSize.iconLeft,
            'absolute text-text-secondary pointer-events-none z-10'
          )} 
        />

        {/* Input principal */}
        <input
          ref={finalRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full border-none outline-none focus:ring-0',
            currentSize.input,
            currentVariant.input,
            disabled && 'cursor-not-allowed'
          )}
          {...props}
        />

        {/* Icono derecho (loading, clear button, etc.) */}
        {rightIcon && (
          <div className={cn(
            'absolute flex items-center justify-center',
            currentSize.iconRight,
            'z-10'
          )}>
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  )
})

SearchInput.displayName = 'SearchInput'

export default SearchInput