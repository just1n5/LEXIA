// components/historial/SmartFiltersEnhanced.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Search, Filter, X, Clock, Building, FileText, ChevronDown, RotateCcw } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'
import { useDebounce } from '../../hooks/useDebounce'

/**
 * 🧠 SMART SEARCH con AUTO-SUGERENCIAS
 * Búsqueda inteligente con sugerencias basadas en historial
 */
const SmartSearchInput = ({ 
  value, 
  onChange, 
  suggestions = [], 
  isLoading = false,
  placeholder = "Buscar..." 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)

  // Categorizar sugerencias
  const categorizedSuggestions = suggestions.reduce((acc, item) => {
    const category = item.type || 'general'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})

  const categoryConfig = {
    radicado: { label: 'Números de Radicado', icon: FileText, color: 'text-blue-600' },
    despacho: { label: 'Despachos', icon: Building, color: 'text-green-600' },
    solicitud: { label: 'Solicitudes', icon: Clock, color: 'text-purple-600' },
    general: { label: 'Búsquedas Recientes', icon: Search, color: 'text-gray-600' }
  }

  const handleKeyDown = useCallback((e) => {
    if (!showSuggestions) return

    const totalSuggestions = suggestions.length

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < totalSuggestions - 1 ? prev + 1 : -1
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > -1 ? prev - 1 : totalSuggestions - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          const suggestion = suggestions[selectedIndex]
          onChange(suggestion.value)
          setShowSuggestions(false)
          setSelectedIndex(-1)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }, [showSuggestions, selectedIndex, suggestions, onChange])

  const handleSuggestionClick = useCallback((suggestion) => {
    onChange(suggestion.value)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }, [onChange])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-sm border border-border-default rounded-md",
            "focus:ring-2 focus:ring-interactive-default focus:border-interactive-default",
            "transition-all duration-200",
            showSuggestions && "border-interactive-default"
          )}
        />
        
        {value && (
          <button
            onClick={() => {
              onChange('')
              setShowSuggestions(false)
            }}
            className="absolute right-sm top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {isLoading && (
          <div className="absolute right-sm top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-interactive-default border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Sugerencias */}
      {showSuggestions && Object.keys(categorizedSuggestions).length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-bg-canvas border border-border-default rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {Object.entries(categorizedSuggestions).map(([category, items]) => {
            const config = categoryConfig[category]
            if (!config || items.length === 0) return null

            return (
              <div key={category} className="py-sm">
                <div className="px-sm py-xs">
                  <div className="flex items-center space-x-xs text-body-auxiliary text-text-secondary">
                    <config.icon className={cn("w-3 h-3", config.color)} />
                    <span className="font-medium">{config.label}</span>
                  </div>
                </div>
                
                {items.map((suggestion, index) => {
                  const globalIndex = suggestions.indexOf(suggestion)
                  const isSelected = globalIndex === selectedIndex
                  
                  return (
                    <button
                      key={suggestion.id || index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={cn(
                        "w-full px-sm py-xs text-left hover:bg-bg-light transition-colors",
                        "flex items-center justify-between group",
                        isSelected && "bg-interactive-default bg-opacity-10"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-sm">
                          <span className="text-body-paragraph text-text-primary truncate">
                            {suggestion.label || suggestion.value}
                          </span>
                          {suggestion.badge && (
                            <span className="text-body-auxiliary px-xs py-0.5 bg-bg-light rounded text-text-secondary">
                              {suggestion.badge}
                            </span>
                          )}
                        </div>
                        {suggestion.description && (
                          <p className="text-body-auxiliary text-text-secondary mt-xs truncate">
                            {suggestion.description}
                          </p>
                        )}
                      </div>
                      
                      {suggestion.count && (
                        <span className="text-body-auxiliary text-text-secondary ml-sm">
                          {suggestion.count} resultados
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })}
          
          {/* Footer con tip */}
          <div className="px-sm py-xs border-t border-border-default bg-bg-light">
            <p className="text-body-auxiliary text-text-secondary">
              💡 Usa ↑ ↓ para navegar, Enter para seleccionar
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 🎛️ ADVANCED FILTER CHIP SYSTEM
 * Sistema de chips de filtros con edición inline
 */
const AdvancedFilterChips = ({ 
  activeFilters, 
  onFilterChange, 
  onClearAll,
  availableFilters = []
}) => {
  const getFilterDisplay = (key, value) => {
    switch (key) {
      case 'fechaDesde':
      case 'fechaHasta':
        return new Date(value).toLocaleDateString('es-CO')
      case 'solicitudId':
        const filter = availableFilters.find(f => f.key === key)
        if (filter?.options) {
          const option = filter.options.find(o => o.value === value)
          return option?.label || value
        }
        return value
      default:
        return value
    }
  }

  const activeFilterEntries = Object.entries(activeFilters).filter(([_, value]) => 
    value !== '' && value !== null && value !== undefined
  )

  if (activeFilterEntries.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-sm p-lg bg-interactive-default bg-opacity-5 border border-interactive-default border-opacity-20 rounded-lg">
      <span className="text-body-auxiliary text-text-secondary font-medium">
        Filtros activos:
      </span>
      
      {activeFilterEntries.map(([key, value]) => (
        <div
          key={key}
          className="inline-flex items-center gap-xs bg-interactive-default bg-opacity-10 text-text-primary rounded-full px-sm py-xs text-body-auxiliary border border-interactive-default border-opacity-30"
        >
          <span className="font-medium">
            {availableFilters.find(f => f.key === key)?.label || key}:
          </span>
          <span>{getFilterDisplay(key, value)}</span>
          <button
            onClick={() => onFilterChange(key, '')}
            className="ml-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      
      <button
        onClick={onClearAll}
        className="text-body-auxiliary text-text-secondary hover:text-text-primary transition-colors underline"
      >
        Limpiar todos
      </button>
    </div>
  )
}

/**
 * 🎛️ ENHANCED FILTERS COMPONENT
 * Componente principal de filtros mejorado
 */
const EnhancedHistorialFilters = ({
  solicitudes = [],
  onFiltersChange = () => {},
  onSearchChange = () => {},
  initialFilters = {
    solicitudId: '',
    fechaDesde: '',
    fechaHasta: ''
  },
  initialSearchTerm = '',
  isLoading = false,
  className = '',
  ...props
}) => {
  const [filters, setFilters] = useState(initialFilters)
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [suggestions, setSuggestions] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  // Sincronizar filtros iniciales
  useEffect(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  useEffect(() => {
    setSearchTerm(initialSearchTerm)
  }, [initialSearchTerm])

  // Detectar si hay filtros activos
  useEffect(() => {
    const active = Object.values(filters).some(value => value !== '') || searchTerm !== ''
    setHasActiveFilters(active)
  }, [filters, searchTerm])

  // Generar sugerencias de búsqueda (simulado)
  useEffect(() => {
    if (searchTerm.length >= 2) {
      // Simular sugerencias basadas en datos existentes
      const mockSuggestions = [
        {
          id: 'radicado_001',
          type: 'radicado',
          value: '11001310300120240001',
          label: '11001310300120240001',
          description: 'Número de radicado',
          count: 3
        },
        {
          id: 'despacho_001',
          type: 'despacho',
          value: 'Juzgado Civil del Circuito',
          label: 'Juzgado Civil del Circuito',
          description: 'Despacho judicial',
          count: 8
        }
      ].filter(s => s.value.toLowerCase().includes(searchTerm.toLowerCase()))
      
      setSuggestions(mockSuggestions)
    } else {
      setSuggestions([])
    }
  }, [searchTerm])

  // Manejar cambio de filtros
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  // Manejar cambio de búsqueda
  const handleSearchChange = (term) => {
    setSearchTerm(term)
    onSearchChange(term)
  }

  // Aplicar filtros
  const applyFilters = () => {
    onFiltersChange(filters)
  }

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    const cleanFilters = {
      solicitudId: '',
      fechaDesde: '',
      fechaHasta: ''
    }
    setFilters(cleanFilters)
    setSearchTerm('')
    onFiltersChange(cleanFilters)
    onSearchChange('')
  }

  const availableFilters = [
    {
      key: 'solicitudId',
      label: 'Solicitud',
      options: solicitudes.map(s => ({ value: s.id, label: s.alias || `Solicitud ${s.id}` }))
    }
  ]

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm', className)} {...props}>
      {/* Header del card */}
      <div className="p-lg border-b border-border-default">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-sm">
            <Filter className="w-5 h-5 text-text-secondary" />
            <h3 className="text-heading-h3 font-heading text-text-primary">Filtros de Búsqueda</h3>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-xs py-0.5 rounded-full text-xs font-medium bg-interactive-default bg-opacity-10 text-interactive-default border border-interactive-default border-opacity-30">
                Filtros activos
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-sm">
            {/* Toggle expandir/contraer en móvil */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="sm:hidden p-1 text-text-secondary hover:text-text-primary rounded"
            >
              <Filter className="w-4 h-4" />
            </button>
            
            {/* Botón limpiar filtros */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                icon={<RotateCcw className="w-4 h-4" />}
                disabled={isLoading}
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido de filtros */}
      <div className={cn(
        'p-lg space-y-lg',
        'sm:block', // Siempre visible en desktop
        isExpanded ? 'block' : 'hidden sm:block' // Toggle en móvil
      )}>
        
        {/* Búsqueda de texto */}
        <div className="w-full">
          <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
            Búsqueda de texto
          </label>
          <SmartSearchInput
            placeholder="Buscar por solicitud, radicado, despacho, partes..."
            value={searchTerm}
            onChange={handleSearchChange}
            suggestions={suggestions}
            disabled={isLoading}
          />
        </div>

        {/* Chips de filtros activos */}
        <AdvancedFilterChips
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={clearAllFilters}
          availableFilters={availableFilters}
        />

        {/* Filtros principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          
          {/* Filtro por solicitud */}
          <div>
            <label htmlFor="solicitud" className="block text-body-paragraph font-medium text-text-primary mb-sm">
              Solicitud
            </label>
            <select
              id="solicitud"
              value={filters.solicitudId}
              onChange={(e) => handleFilterChange('solicitudId', e.target.value)}
              disabled={isLoading}
              className="w-full px-sm py-sm border border-border-default rounded-md focus:ring-2 focus:ring-interactive-default focus:border-interactive-default"
            >
              <option value="">Todas las solicitudes</option>
              {solicitudes.map(solicitud => (
                <option key={solicitud.id} value={solicitud.id}>
                  {solicitud.alias || `Solicitud ${solicitud.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de fechas */}
          <div>
            <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
              Fecha desde
            </label>
            <input
              type="date"
              value={filters.fechaDesde}
              onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
              disabled={isLoading}
              className="w-full px-sm py-sm border border-border-default rounded-md focus:ring-2 focus:ring-interactive-default focus:border-interactive-default"
            />
          </div>

          <div>
            <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
              Fecha hasta
            </label>
            <input
              type="date"
              value={filters.fechaHasta}
              onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
              disabled={isLoading}
              className="w-full px-sm py-sm border border-border-default rounded-md focus:ring-2 focus:ring-interactive-default focus:border-interactive-default"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-sm sm:space-y-0 pt-sm border-t border-border-default">
          <div className="text-body-auxiliary text-text-secondary">
            {hasActiveFilters ? (
              <span>Filtros aplicados. Los resultados se actualizan automáticamente.</span>
            ) : (
              <span>Selecciona filtros para refinar la búsqueda</span>
            )}
          </div>
          
          <div className="flex space-x-sm">
            <Button
              variant="primary"
              onClick={applyFilters}
              disabled={isLoading}
              loading={isLoading}
              icon={<Search className="w-4 h-4" />}
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

EnhancedHistorialFilters.displayName = 'EnhancedHistorialFilters'

export default EnhancedHistorialFilters
export { SmartSearchInput, AdvancedFilterChips }