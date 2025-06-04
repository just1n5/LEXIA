import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Filter, RotateCcw, Search, Calendar, Clock, CheckCircle, XCircle, Bookmark, Save, X, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../../utils/cn'
import Button from '../../ui/Button'
import DateRangeInput from '../../ui/DateRangeInput'
import SearchInput from '../../ui/SearchInput'
import Badge from '../../ui/Badge'

/**
 * 🧠 SMART HISTORIAL FILTERS - Sprint 1 Core UX
 * Filtros inteligentes con presets, persistencia y aplicación automática
 */
const SmartHistorialFilters = ({
  solicitudes = [],
  onFiltersChange = () => {},
  onSearchChange = () => {},
  initialFilters = {
    solicitudId: '',
    fechaDesde: '',
    fechaHasta: '',
    estados: [],
    despachos: []
  },
  initialSearchTerm = '',
  isLoading = false,
  totalResults = 0,
  className = '',
  ...props
}) => {
  // 🎯 Estados del componente
  const [filters, setFilters] = useState(initialFilters)
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [isExpanded, setIsExpanded] = useState(false)
  const [savedPresets, setSavedPresets] = useState([])
  const [presetName, setPresetName] = useState('')
  const [showPresetSaver, setShowPresetSaver] = useState(false)

  // 🎨 Presets predefinidos
  const predefinedPresets = useMemo(() => [
    {
      id: 'hoy',
      name: 'Hoy',
      description: 'Consultas de hoy',
      icon: Clock,
      filters: {
        solicitudId: '',
        fechaDesde: new Date().toISOString().split('T')[0],
        fechaHasta: new Date().toISOString().split('T')[0],
        estados: [],
        despachos: []
      },
      searchTerm: '',
      color: 'interactive'
    },
    {
      id: 'ultimos_7_dias',
      name: 'Últimos 7 días',
      description: 'Última semana',
      icon: Calendar,
      filters: {
        solicitudId: '',
        fechaDesde: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fechaHasta: new Date().toISOString().split('T')[0],
        estados: [],
        despachos: []
      },
      searchTerm: '',
      color: 'info'
    },
    {
      id: 'exitosas',
      name: 'Solo Exitosas',
      description: 'Consultas exitosas',
      icon: CheckCircle,
      filters: {
        solicitudId: '',
        fechaDesde: '',
        fechaHasta: '',
        estados: ['exitoso'],
        despachos: []
      },
      searchTerm: '',
      color: 'success'
    },
    {
      id: 'con_errores',
      name: 'Con Errores',
      description: 'Consultas con errores',
      icon: XCircle,
      filters: {
        solicitudId: '',
        fechaDesde: '',
        fechaHasta: '',
        estados: ['error_captcha', 'error_sistema'],
        despachos: []
      },
      searchTerm: '',
      color: 'error'
    },
    {
      id: 'ultimo_mes',
      name: 'Último Mes',
      description: 'Últimos 30 días',
      icon: Calendar,
      filters: {
        solicitudId: '',
        fechaDesde: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fechaHasta: new Date().toISOString().split('T')[0],
        estados: [],
        despachos: []
      },
      searchTerm: '',
      color: 'warning'
    }
  ], [])

  // 📱 Cargar presets guardados del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('historial-filter-presets')
    if (saved) {
      try {
        setSavedPresets(JSON.parse(saved))
      } catch (error) {
        console.error('Error cargando presets guardados:', error)
      }
    }
  }, [])

  // 💾 Guardar presets en localStorage
  const savePresets = useCallback((presets) => {
    localStorage.setItem('historial-filter-presets', JSON.stringify(presets))
    setSavedPresets(presets)
  }, [])

  // 🔍 Detectar filtros activos
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) return value.length > 0
      return value !== ''
    }) || searchTerm !== ''
  }, [filters, searchTerm])

  // 📊 Opciones dinámicas basadas en datos
  const estadoOptions = [
    { value: 'exitoso', label: 'Exitoso', icon: CheckCircle, color: 'success' },
    { value: 'error_captcha', label: 'Error Captcha', icon: XCircle, color: 'warning' },
    { value: 'error_sistema', label: 'Error Sistema', icon: XCircle, color: 'error' },
    { value: 'pendiente', label: 'Pendiente', icon: Clock, color: 'info' }
  ]

  // 🔄 Handlers de cambio
  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Auto-aplicar después de un breve delay para mejor UX
    setTimeout(() => {
      onFiltersChange(newFilters)
    }, 300)
  }, [filters, onFiltersChange])

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term)
    onSearchChange(term)
  }, [onSearchChange])

  const handleArrayFilterChange = useCallback((key, value, checked) => {
    const currentArray = filters[key] || []
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value)
    
    handleFilterChange(key, newArray)
  }, [filters, handleFilterChange])

  // 🎯 Aplicar preset
  const applyPreset = useCallback((preset) => {
    setFilters(preset.filters)
    setSearchTerm(preset.searchTerm || '')
    onFiltersChange(preset.filters)
    onSearchChange(preset.searchTerm || '')
  }, [onFiltersChange, onSearchChange])

  // 💾 Guardar preset personalizado
  const saveCustomPreset = useCallback(() => {
    if (!presetName.trim()) return

    const newPreset = {
      id: `custom_${Date.now()}`,
      name: presetName.trim(),
      description: 'Preset personalizado',
      icon: Bookmark,
      filters: { ...filters },
      searchTerm,
      color: 'interactive',
      isCustom: true,
      createdAt: new Date().toISOString()
    }

    const updatedPresets = [...savedPresets, newPreset]
    savePresets(updatedPresets)
    setPresetName('')
    setShowPresetSaver(false)
  }, [filters, searchTerm, savedPresets, presetName, savePresets])

  // 🗑️ Eliminar preset personalizado
  const deleteCustomPreset = useCallback((presetId) => {
    const updatedPresets = savedPresets.filter(preset => preset.id !== presetId)
    savePresets(updatedPresets)
  }, [savedPresets, savePresets])

  // 🧹 Limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    const cleanFilters = {
      solicitudId: '',
      fechaDesde: '',
      fechaHasta: '',
      estados: [],
      despachos: []
    }
    setFilters(cleanFilters)
    setSearchTerm('')
    onFiltersChange(cleanFilters)
    onSearchChange('')
  }, [onFiltersChange, onSearchChange])

  // 🎨 Componente de Preset
  const PresetButton = ({ preset, isActive = false }) => {
    const Icon = preset.icon
    const colorClasses = {
      interactive: 'border-interactive-default bg-interactive-default bg-opacity-10 text-interactive-default',
      success: 'border-feedback-success bg-feedback-success bg-opacity-10 text-feedback-success',
      error: 'border-feedback-error bg-feedback-error bg-opacity-10 text-feedback-error',
      warning: 'border-feedback-warning bg-feedback-warning bg-opacity-10 text-feedback-warning',
      info: 'border-feedback-info bg-feedback-info bg-opacity-10 text-feedback-info'
    }

    return (
      <div className="relative group">
        <button
          onClick={() => applyPreset(preset)}
          className={cn(
            'flex items-center space-x-sm px-sm py-xs rounded-lg border-2 transition-all duration-200',
            isActive 
              ? colorClasses[preset.color] 
              : 'border-border-default bg-bg-canvas text-text-secondary hover:border-text-secondary hover:text-text-primary'
          )}
          title={preset.description}
        >
          <Icon className="w-4 h-4" />
          <span className="text-body-auxiliary font-medium">{preset.name}</span>
        </button>

        {/* Botón de eliminar para presets personalizados */}
        {preset.isCustom && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              deleteCustomPreset(preset.id)
            }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-feedback-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="Eliminar preset"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={cn('bg-bg-canvas rounded-lg border border-border-default shadow-sm', className)} {...props}>
      
      {/* 🎯 Header compacto con presets rápidos */}
      <div className="p-md border-b border-border-default">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-md">
          
          {/* Título y estado */}
          <div className="flex items-center space-x-md">
            <div className="flex items-center space-x-sm">
              <Filter className="w-5 h-5 text-text-secondary" />
              <h3 className="text-body-paragraph font-semibold text-text-primary">
                Filtros Inteligentes
              </h3>
              {hasActiveFilters && (
                <Badge variant="info" size="sm">
                  Activos
                </Badge>
              )}
            </div>

            {/* Resultados contador */}
            {totalResults > 0 && (
              <span className="text-body-auxiliary text-text-secondary">
                {totalResults.toLocaleString()} resultado{totalResults !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Controles rápidos */}
          <div className="flex items-center space-x-sm">
            
            {/* Presets rápidos */}
            <div className="flex items-center space-x-xs overflow-x-auto pb-xs">
              {predefinedPresets.slice(0, 3).map(preset => (
                <PresetButton key={preset.id} preset={preset} />
              ))}
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-xs">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  icon={<RotateCcw className="w-4 h-4" />}
                  className="text-text-secondary hover:text-text-primary"
                >
                  Limpiar
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                icon={isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                className="text-text-secondary hover:text-text-primary"
              >
                {isExpanded ? 'Menos' : 'Más filtros'}
              </Button>
            </div>
          </div>
        </div>

        {/* 🔍 Búsqueda principal siempre visible */}
        <div className="mt-md">
          <SearchInput
            placeholder="Buscar por solicitud, radicado, despacho, partes..."
            value={searchTerm}
            onSearch={handleSearchChange}
            disabled={isLoading}
            className="w-full"
            size="lg"
          />
        </div>
      </div>

      {/* 🎛️ Panel expandido de filtros avanzados */}
      {isExpanded && (
        <div className="p-md space-y-lg">
          
          {/* 📑 Presets completos */}
          <div>
            <div className="flex items-center justify-between mb-sm">
              <h4 className="text-body-paragraph font-medium text-text-primary">Presets Rápidos</h4>
              
              <div className="flex items-center space-x-sm">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPresetSaver(!showPresetSaver)}
                    icon={<Save className="w-4 h-4" />}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    Guardar filtro actual
                  </Button>
                )}
              </div>
            </div>

            {/* Grid de presets */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-sm">
              {predefinedPresets.map(preset => (
                <PresetButton key={preset.id} preset={preset} />
              ))}
              {savedPresets.map(preset => (
                <PresetButton key={preset.id} preset={preset} />
              ))}
            </div>

            {/* 💾 Guardador de preset */}
            {showPresetSaver && (
              <div className="mt-sm p-sm bg-bg-light rounded-lg border border-border-default">
                <div className="flex items-center space-x-sm">
                  <input
                    type="text"
                    placeholder="Nombre del preset..."
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    className="flex-1 px-sm py-xs border border-border-default rounded text-body-auxiliary"
                    onKeyPress={(e) => e.key === 'Enter' && saveCustomPreset()}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={saveCustomPreset}
                    disabled={!presetName.trim()}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPresetSaver(false)}
                    icon={<X className="w-4 h-4" />}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 🎯 Filtros específicos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-lg">
            
            {/* Filtro por solicitud */}
            <div>
              <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
                Solicitud
              </label>
              <select
                value={filters.solicitudId}
                onChange={(e) => handleFilterChange('solicitudId', e.target.value)}
                disabled={isLoading}
                className="w-full px-sm py-sm border border-border-default rounded-md bg-bg-canvas text-body-paragraph"
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
            <div className="lg:col-span-2">
              <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
                Rango de fechas
              </label>
              <DateRangeInput
                startDate={filters.fechaDesde}
                endDate={filters.fechaHasta}
                onStartDateChange={(date) => handleFilterChange('fechaDesde', date)}
                onEndDateChange={(date) => handleFilterChange('fechaHasta', date)}
                startLabel="Desde"
                endLabel="Hasta"
                disabled={isLoading}
                layout="horizontal"
              />
            </div>
          </div>

          {/* 🏷️ Filtros por estado */}
          <div>
            <h4 className="text-body-paragraph font-medium text-text-primary mb-sm">Estados</h4>
            <div className="flex flex-wrap gap-sm">
              {estadoOptions.map(estado => {
                const Icon = estado.icon
                const isSelected = filters.estados.includes(estado.value)
                
                return (
                  <label
                    key={estado.value}
                    className={cn(
                      'flex items-center space-x-sm px-sm py-xs rounded-lg border-2 cursor-pointer transition-all duration-200',
                      isSelected
                        ? `border-feedback-${estado.color} bg-feedback-${estado.color} bg-opacity-10 text-feedback-${estado.color}`
                        : 'border-border-default bg-bg-canvas text-text-secondary hover:border-text-secondary hover:text-text-primary'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleArrayFilterChange('estados', estado.value, e.target.checked)}
                      className="sr-only"
                    />
                    <Icon className="w-4 h-4" />
                    <span className="text-body-auxiliary font-medium">{estado.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* 📊 Resumen de filtros activos */}
          {hasActiveFilters && (
            <div className="bg-interactive-default bg-opacity-10 border border-interactive-default border-opacity-30 rounded-lg p-sm">
              <div className="flex items-start space-x-sm">
                <Filter className="w-5 h-5 text-interactive-default flex-shrink-0 mt-xs" />
                <div className="flex-1">
                  <h5 className="text-body-paragraph font-medium text-interactive-default mb-xs">
                    Filtros Aplicados
                  </h5>
                  <div className="flex flex-wrap gap-xs">
                    {searchTerm && (
                      <Badge variant="info" size="sm">
                        Búsqueda: "{searchTerm}"
                      </Badge>
                    )}
                    {filters.solicitudId && (
                      <Badge variant="info" size="sm">
                        Solicitud específica
                      </Badge>
                    )}
                    {(filters.fechaDesde || filters.fechaHasta) && (
                      <Badge variant="info" size="sm">
                        Rango de fechas
                      </Badge>
                    )}
                    {filters.estados.length > 0 && (
                      <Badge variant="info" size="sm">
                        {filters.estados.length} estado{filters.estados.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🎯 Footer con información de uso */}
      <div className="px-md py-sm bg-bg-light border-t border-border-default rounded-b-lg">
        <div className="flex justify-between items-center text-body-auxiliary text-text-secondary">
          <span>
            {hasActiveFilters 
              ? 'Filtros aplicados automáticamente' 
              : 'Selecciona filtros para refinar la búsqueda'
            }
          </span>
          
          {isLoading && (
            <div className="flex items-center space-x-xs">
              <div className="w-4 h-4 border-2 border-interactive-default border-t-transparent rounded-full animate-spin"></div>
              <span className="text-interactive-default">Filtrando...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

SmartHistorialFilters.displayName = 'SmartHistorialFilters'

export default SmartHistorialFilters