import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Loader } from 'lucide-react'
import { cn } from '../../utils/cn'
import { normalizeText, matchesSearch } from '../../utils/searchUtils'

/**
 * 🚀 SearchInputEnhanced - Versión mejorada del SearchInput
 * 
 * ✅ MANTIENE 100% la funcionalidad actual
 * ✅ CONSERVA todas las props y comportamientos existentes
 * ✅ AGREGA mejoras sutiles de UX:
 *   - Sugerencias inteligentes con filtrado
 *   - Micro-interacciones más fluidas
 *   - Mejor feedback visual en estados
 *   - Navegación por teclado mejorada
 *   - Animaciones de transición optimizadas
 *   - Performance mejorado
 */

const SearchInputEnhanced = React.forwardRef((
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
    // 🚀 NUEVAS PROPS ENHANCED
    suggestions = [],
    showSuggestions = false,
    onSuggestionSelect = () => {},
    maxSuggestions = 5,
    highlightQuery = true,
    autoFocus = false,
    ...props
  },
  ref
) => {
  const [inputValue, setInputValue] = useState(value)
  const [isSearching, setIsSearching] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestionsList, setShowSuggestionsList] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [isHovered, setIsHovered] = useState(false)
  
  const timeoutRef = useRef()
  const inputRef = useRef()
  const suggestionsRef = useRef()

  // Usar ref externa si se proporciona, sino usar la interna
  const finalRef = ref || inputRef

  // Sincronizar valor externo con estado interno
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Auto focus si está habilitado
  useEffect(() => {
    if (autoFocus && finalRef.current && !disabled) {
      finalRef.current.focus()
    }
  }, [autoFocus, disabled])

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // 🚀 ENHANCED: Filtrar sugerencias SIN TILDES usando searchUtils
  const filteredSuggestions = React.useMemo(() => {
    if (!showSuggestions || !inputValue.trim()) return []
    
    return suggestions
      .filter(suggestion => {
        // Usar matchesSearch para ignorar tildes y mayúsculas
        return matchesSearch(inputValue, suggestion) &&
               normalizeText(suggestion) !== normalizeText(inputValue)
      })
      .slice(0, maxSuggestions)
  }, [suggestions, inputValue, showSuggestions, maxSuggestions])

  // Manejar clics fuera para cerrar sugerencias
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestionsList(false)
        setSelectedSuggestionIndex(-1)
      }
    }

    if (showSuggestionsList) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSuggestionsList])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setSelectedSuggestionIndex(-1)

    // Mostrar sugerencias si hay texto y sugerencias disponibles
    if (showSuggestions && newValue.trim() && filteredSuggestions.length > 0) {
      setShowSuggestionsList(true)
    } else {
      setShowSuggestionsList(false)
    }

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
    setShowSuggestionsList(false)
    setSelectedSuggestionIndex(-1)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    onSearch('')
    onClear()
    
    // Enfocar el input después de limpiar con animación suave
    if (finalRef.current) {
      setTimeout(() => finalRef.current.focus(), 100)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    
    // Mostrar sugerencias si hay texto y sugerencias disponibles
    if (showSuggestions && inputValue.trim() && filteredSuggestions.length > 0) {
      setShowSuggestionsList(true)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Delay para permitir clicks en sugerencias
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestionsList(false)
        setSelectedSuggestionIndex(-1)
      }
    }, 150)
  }

  // 🚀 ENHANCED: Navegación por teclado en sugerencias
  const handleKeyDown = (e) => {
    if (!showSuggestionsList || filteredSuggestions.length === 0) {
      if (e.key === 'Escape') {
        setShowSuggestionsList(false)
        setSelectedSuggestionIndex(-1)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionSelect(filteredSuggestions[selectedSuggestionIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowSuggestionsList(false)
        setSelectedSuggestionIndex(-1)
        break
    }
  }

  const handleSuggestionSelect = (suggestion) => {
    setInputValue(suggestion)
    setShowSuggestionsList(false)
    setSelectedSuggestionIndex(-1)
    onSuggestionSelect(suggestion)
    onSearch(suggestion)
    
    // Quitar focus del input
    if (finalRef.current) {
      finalRef.current.blur()
    }
  }

  // 🚀 ENHANCED: Highlight con soporte para tildes
  const highlightText = (text, query) => {
    if (!highlightQuery || !query.trim()) return text
    
    // Usar normalizeText para encontrar coincidencias sin tildes
    const normalizedQuery = normalizeText(query)
    const normalizedText = normalizeText(text)
    const queryIndex = normalizedText.indexOf(normalizedQuery)
    
    if (queryIndex === -1) return text
    
    // Encontrar la posición real en el texto original
    const beforeMatch = text.substring(0, queryIndex)
    const matchText = text.substring(queryIndex, queryIndex + query.length)
    const afterMatch = text.substring(queryIndex + query.length)
    
    return (
      <>
        {beforeMatch}
        <span style={{ 
          backgroundColor: 'var(--color-interactive-default)', 
          color: 'var(--color-text-base)',
          fontWeight: '600',
          padding: '0 2px',
          borderRadius: '2px'
        }}>
          {matchText}
        </span>
        {afterMatch}
      </>
    )
  }

  // Calcular clases según el tamaño - EXACTAS al original
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

  // Calcular clases según la variante - EXACTAS al original
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

  // Determinar qué icono mostrar en el lado derecho - EXACTO al original
  const rightIcon = (() => {
    if (loading || isSearching) {
      return <Loader className={cn(currentSize.icon, 'animate-spin text-text-secondary')} />
    }
    if (showClearButton && inputValue && !disabled) {
      return (
        <button
          type="button"
          onClick={handleClear}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            'text-text-secondary hover:text-text-primary transition-default',
            'focus:outline-none focus:text-interactive-default',
            'touch-target flex items-center justify-center'
          )}
          style={{
            // 🚀 ENHANCED: Micro-interacción en clear button
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'var(--transition-default)',
          }}
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
      ref={suggestionsRef}
    >
      <div className={cn(
        'relative flex items-center rounded-md transition-default',
        currentSize.container,
        currentVariant.container,
        fullWidth ? 'w-full' : 'w-auto',
        // 🚀 ENHANCED: Efecto sutil de scale en focus
        isFocused && 'transform scale-[1.01]'
      )}>
        {/* Icono de búsqueda a la izquierda */}
        <Search 
          className={cn(
            currentSize.icon,
            currentSize.iconLeft,
            'absolute pointer-events-none z-10 transition-colors duration-200',
            // 🚀 ENHANCED: Color dinámico del icono
            isFocused ? 'text-interactive-default' : 'text-text-secondary'
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
          onKeyDown={handleKeyDown}
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

      {/* 🚀 NUEVA FUNCIONALIDAD: Lista de sugerencias */}
      {showSuggestionsList && filteredSuggestions.length > 0 && (
        <div 
          className="absolute z-20 w-full mt-1 rounded-lg shadow-lg border overflow-hidden"
          style={{
            top: '100%',
            backgroundColor: 'var(--color-bg-canvas)',
            borderColor: 'var(--color-border-default)',
            boxShadow: 'var(--shadow-lg)',
            animation: 'slideDown 0.2s ease-out', // Usar animación existente
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={cn(
                'w-full px-4 py-3 text-left text-sm transition-colors duration-150 flex items-center space-x-2',
                'first:rounded-t-lg last:rounded-b-lg border-none bg-transparent',
                selectedSuggestionIndex === index 
                  ? 'text-interactive-text' 
                  : 'text-text-primary'
              )}
              style={{
                backgroundColor: selectedSuggestionIndex === index 
                  ? 'rgba(250, 204, 21, 0.15)' // Usar color interactive con opacidad
                  : 'transparent',
              }}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
            >
              <Search 
                className="h-4 w-4 flex-shrink-0" 
                style={{ color: 'var(--color-text-secondary)' }}
              />
              <span>{highlightText(suggestion, inputValue)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
})

SearchInputEnhanced.displayName = 'SearchInputEnhanced'

export default SearchInputEnhanced

/* 
🎯 CARACTERÍSTICAS ENHANCED:

✅ MANTIENE 100% compatibilidad con SearchInput original:
- Todas las props existentes funcionan igual
- Misma API y comportamientos
- Mismas clases CSS y estilos
- Mismo debounce y loading states

✅ MEJORAS AGREGADAS:
- Sugerencias inteligentes con filtrado automático
- Navegación por teclado (↑↓ Enter Escape)
- Highlight del texto buscado en sugerencias
- Micro-interacciones mejoradas (scale, hover effects)
- Clear button con animación
- Auto-focus opcional
- Performance optimizado con useMemo

✅ NUEVA FUNCIONALIDAD:
- showSuggestions: habilitar sugerencias
- suggestions: array de sugerencias
- onSuggestionSelect: callback al seleccionar
- maxSuggestions: límite de sugerencias mostradas
- highlightQuery: resaltar texto buscado
- autoFocus: enfocar automáticamente

🔄 USO:
// Drop-in replacement del SearchInput original
<SearchInputEnhanced 
  // Todas las props originales funcionan
  placeholder="Buscar solicitudes..."
  onSearch={handleSearch}
  debounceMs={300}
  
  // Nuevas props opcionales
  showSuggestions={true}
  suggestions={['SOL-001', 'SOL-002', 'En proceso']}
  onSuggestionSelect={handleSuggestionSelect}
/>
*/