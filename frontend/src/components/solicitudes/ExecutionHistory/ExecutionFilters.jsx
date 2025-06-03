import React, { useState } from 'react'
import { Calendar, Filter, Search, X, RotateCcw } from 'lucide-react'

// Components del design system
import Card from '../../../ui/Card'
import Button from '../../../ui/Button'
import Badge from '../../../ui/Badge'
import SearchInput from '../../../ui/SearchInput'
import { cn } from '../../../../utils/cn'

/**
 * Panel de filtros inteligentes para el historial de ejecuciones
 * Incluye filtros por fecha, estado y búsqueda de texto
 */
const ExecutionFilters = ({
  filters,
  onFiltersChange,
  metrics,
  loading = false,
  className = '',
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { dateRange, statusFilter, searchQuery } = filters

  // Opciones de estados
  const statusOptions = [
    { value: 'all', label: 'Todos los estados', count: metrics?.totalExecutions || 0 },
    { value: 'EXITOSA', label: 'Exitosas', count: metrics?.successCount || 0, variant: 'success' },
    { value: 'FALLIDA', label: 'Con errores', count: metrics?.errorCount || 0, variant: 'error' },
    { value: 'PENDIENTE', label: 'Pendientes', count: 0, variant: 'warning' }
  ]

  // Presets de fechas
  const datePresets = [
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 3 meses' },
    { value: 'all', label: 'Todo el tiempo' }
  ]

  const handleDatePreset = (preset) => {
    onFiltersChange.setDateRangePreset(preset)
  }

  const handleStatusFilter = (status) => {
    onFiltersChange.setStatusFilter(status)
  }

  const handleSearchChange = (value) => {
    onFiltersChange.setSearchQuery(value)
  }

  const clearAllFilters = () => {
    onFiltersChange.clearFilters()
  }

  // Verificar si hay filtros activos
  const hasActiveFilters = dateRange.start || statusFilter !== 'all' || searchQuery.trim()

  // Contar filtros activos
  const activeFiltersCount = [
    dateRange.start,
    statusFilter !== 'all',
    searchQuery.trim()
  ].filter(Boolean).length

  return (
    <Card className={cn('mb-lg', className)} {...props}>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <Filter className="w-5 h-5 text-interactive-default" />
            <Card.Title>Filtros</Card.Title>
            {activeFiltersCount > 0 && (
              <Badge variant="primary" size="sm">
                {activeFiltersCount} activo{activeFiltersCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-sm">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                icon={<RotateCcw className="w-4 h-4" />}
                disabled={loading}
              >
                Limpiar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden"
            >
              {isExpanded ? 'Ocultar' : 'Expandir'}
            </Button>
          </div>
        </div>
      </Card.Header>
      
      <Card.Content>
        <div className={cn(
          'space-y-lg transition-all duration-200',
          // En móvil, usar collapsed/expanded state
          'lg:block',
          isExpanded ? 'block' : 'hidden lg:block'
        )}>
          {/* Búsqueda por texto */}
          <div className="space-y-xs">
            <label className="block text-body-auxiliary font-medium text-text-secondary">
              Buscar ejecuciones
            </label>
            <div className="relative">
              <SearchInput
                placeholder="Buscar por radicado o despacho..."
                value={searchQuery}
                onSearch={handleSearchChange}
                className="w-full"
                disabled={loading}
                debounceMs={300}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 w-6 h-6"
                  icon={<X className="w-3 h-3" />}
                />
              )}
            </div>
          </div>

          {/* Filtro por rango de fechas */}
          <div className="space-y-xs">
            <label className="block text-body-auxiliary font-medium text-text-secondary">
              Período de tiempo
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-xs">
              {datePresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={
                    (preset.value === 'all' && !dateRange.start) ||
                    (preset.value !== 'all' && dateRange.start)
                      ? 'primary' 
                      : 'secondary'
                  }
                  size="sm"
                  onClick={() => handleDatePreset(preset.value)}
                  disabled={loading}
                  className="justify-center text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            
            {dateRange.start && (
              <div className="text-body-auxiliary text-text-secondary">
                <Calendar className="w-4 h-4 inline mr-xs" />
                Desde {dateRange.start.toLocaleDateString('es-ES')} hasta {dateRange.end.toLocaleDateString('es-ES')}
              </div>
            )}
          </div>

          {/* Filtro por estado */}
          <div className="space-y-xs">
            <label className="block text-body-auxiliary font-medium text-text-secondary">
              Estado de ejecución
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xs">
              {statusOptions.map((option) => {
                const isActive = statusFilter === option.value
                
                return (
                  <Button
                    key={option.value}
                    variant={isActive ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handleStatusFilter(option.value)}
                    disabled={loading}
                    className="justify-between text-left"
                  >
                    <span className="truncate">
                      {option.label}
                    </span>
                    <Badge 
                      variant={isActive ? 'neutral' : (option.variant || 'neutral')} 
                      size="sm"
                      className="ml-xs"
                    >
                      {option.count}
                    </Badge>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Resumen de filtros activos */}
          {hasActiveFilters && (
            <div className="pt-sm border-t border-border-default">
              <div className="flex flex-wrap items-center gap-xs">
                <span className="text-body-auxiliary text-text-secondary">
                  Filtros activos:
                </span>
                
                {dateRange.start && (
                  <Badge variant="info" size="sm">
                    📅 Período personalizado
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDatePreset('all')}
                      className="ml-xs p-0 w-4 h-4"
                      icon={<X className="w-3 h-3" />}
                    />
                  </Badge>
                )}
                
                {statusFilter !== 'all' && (
                  <Badge variant="info" size="sm">
                    📊 {statusOptions.find(o => o.value === statusFilter)?.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusFilter('all')}
                      className="ml-xs p-0 w-4 h-4"
                      icon={<X className="w-3 h-3" />}
                    />
                  </Badge>
                )}
                
                {searchQuery.trim() && (
                  <Badge variant="info" size="sm">
                    🔍 "{searchQuery.slice(0, 15)}{searchQuery.length > 15 ? '...' : ''}"
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSearchChange('')}
                      className="ml-xs p-0 w-4 h-4"
                      icon={<X className="w-3 h-3" />}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  )
}

ExecutionFilters.displayName = 'ExecutionFilters'

export default ExecutionFilters