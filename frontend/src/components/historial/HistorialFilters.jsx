import React, { useState, useEffect } from 'react'
import { Filter, RotateCcw, Search } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'
import DateRangeInput from '../ui/DateRangeInput'
import SearchInput from '../ui/SearchInput'

/**
 * Componente de filtros para la página de historial
 * Integra filtros por solicitud, fechas y búsqueda de texto
 */
const HistorialFilters = ({
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

  // Manejar cambio de rango de fechas
  const handleDateRangeChange = ({ startDate, endDate, isValid }) => {
    if (isValid) {
      const newFilters = {
        ...filters,
        fechaDesde: startDate,
        fechaHasta: endDate
      }
      setFilters(newFilters)
    }
  }

  // Auto-aplicar filtros cuando cambian (opcional)
  const autoApplyFilters = () => {
    onFiltersChange(filters)
  }

  // Opciones del dropdown de solicitudes
  const solicitudOptions = [
    { value: '', label: 'Todas las solicitudes' },
    ...solicitudes.map(solicitud => ({
      value: solicitud.id,
      label: solicitud.alias || `Solicitud ${solicitud.id}`
    }))
  ]

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm', className)} {...props}>
      {/* Header del card */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Filtros activos
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Toggle expandir/contraer en móvil */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="sm:hidden p-1 text-gray-500 hover:text-gray-700 rounded"
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
        'p-4 space-y-4',
        'sm:block', // Siempre visible en desktop
        isExpanded ? 'block' : 'hidden sm:block' // Toggle en móvil
      )}>
        
        {/* Búsqueda de texto */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Búsqueda de texto
          </label>
          <SearchInput
            placeholder="Buscar por solicitud, radicado, despacho, partes..."
            value={searchTerm}
            onSearch={handleSearchChange}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Filtros principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Filtro por solicitud */}
          <div>
            <label htmlFor="solicitud" className="block text-sm font-medium text-gray-700 mb-2">
              Solicitud
            </label>
            <select
              id="solicitud"
              value={filters.solicitudId}
              onChange={(e) => handleFilterChange('solicitudId', e.target.value)}
              disabled={isLoading}
              className="form-input w-full"
            >
              {solicitudOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de fechas */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rango de fechas
            </label>
            <DateRangeInput
              startDate={filters.fechaDesde}
              endDate={filters.fechaHasta}
              onStartDateChange={(date) => handleFilterChange('fechaDesde', date)}
              onEndDateChange={(date) => handleFilterChange('fechaHasta', date)}
              onRangeChange={handleDateRangeChange}
              startLabel="Desde"
              endLabel="Hasta"
              disabled={isLoading}
              layout="horizontal"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 pt-2 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            {hasActiveFilters ? (
              <span>Filtros aplicados. Los resultados se actualizan automáticamente.</span>
            ) : (
              <span>Selecciona filtros para refinar la búsqueda</span>
            )}
          </div>
          
          <div className="flex space-x-2">
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

        {/* Auto-aplicar filtros (comentado para usar botón manual) */}
        {/* 
        useEffect(() => {
          const timer = setTimeout(() => {
            autoApplyFilters()
          }, 500)
          return () => clearTimeout(timer)
        }, [filters])
        */}
      </div>
    </div>
  )
}

HistorialFilters.displayName = 'HistorialFilters'

export default HistorialFilters
