import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Filter,
  Calendar,
  Clock,
  Search,
  X,
  ChevronDown,
  Download,
  SortAsc,
  SortDesc,
  RefreshCw
} from 'lucide-react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import { cn } from '../../../utils/cn'

/**
 * AdvancedFilters - Sistema completo de filtros para historial de ejecuciones
 * ✅ VERSIÓN SIMPLIFICADA sin useEffect problemático
 */
const AdvancedFilters = ({
  data = [],
  onExport,
  className = ''
}) => {
  // Estados del filtro
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    status: [],
    despacho: [],
    duration: { min: '', max: '' },
    searchTerm: ''
  })
  
  const [sortConfig, setSortConfig] = useState({
    field: 'date',
    direction: 'desc'
  })
  
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Opciones disponibles extraídas de los datos
  const filterOptions = useMemo(() => {
    const statusOptions = [...new Set(data.map(item => item.status))].filter(Boolean)
    const despachoOptions = [...new Set(data.map(item => item.despacho))].filter(Boolean)
    
    return {
      status: statusOptions.map(status => ({
        value: status,
        label: status.charAt(0).toUpperCase() + status.slice(1),
        count: data.filter(item => item.status === status).length
      })),
      despacho: despachoOptions.map(despacho => ({
        value: despacho,
        label: despacho,
        count: data.filter(item => item.despacho === despacho).length
      }))
    }
  }, [data])

  // Aplicar filtros y ordenamiento
  const filteredData = useMemo(() => {
    let filtered = [...data]

    // Filtro de búsqueda por texto
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.despacho?.toLowerCase().includes(searchLower)
      )
    }

    // Filtro por estado
    if (filters.status.length > 0) {
      filtered = filtered.filter(item => 
        filters.status.includes(item.status)
      )
    }

    // Filtro por despacho
    if (filters.despacho.length > 0) {
      filtered = filtered.filter(item => 
        filters.despacho.includes(item.despacho)
      )
    }

    // Filtro por rango de fechas
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date)
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null
        
        if (startDate && itemDate < startDate) return false
        if (endDate && itemDate > endDate) return false
        return true
      })
    }

    // Filtro por duración
    if (filters.duration.min || filters.duration.max) {
      filtered = filtered.filter(item => {
        const duration = parseFloat(item.duration) || 0
        const minDuration = parseFloat(filters.duration.min) || 0
        const maxDuration = parseFloat(filters.duration.max) || Infinity
        
        return duration >= minDuration && duration <= maxDuration
      })
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.field]
      let bValue = b[sortConfig.field]
      
      // Manejar diferentes tipos de datos
      if (sortConfig.field === 'date') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      } else if (sortConfig.field === 'duration') {
        aValue = parseFloat(aValue) || 0
        bValue = parseFloat(bValue) || 0
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [data, filters, sortConfig])

  // Contar filtros activos
  useEffect(() => {
    let count = 0
    if (filters.searchTerm) count++
    if (filters.status.length > 0) count++
    if (filters.despacho.length > 0) count++
    if (filters.dateRange.start || filters.dateRange.end) count++
    if (filters.duration.min || filters.duration.max) count++
    
    setActiveFiltersCount(count)
  }, [filters])

  // ✅ SOLUCIÓN DEFINITIVA: Eliminar useEffect problemático
  // El componente padre puede acceder a filteredData directamente
  // No necesitamos notificar automáticamente cada cambio

  // Handlers
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleMultiSelectFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }))
  }

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      dateRange: { start: '', end: '' },
      status: [],
      despacho: [],
      duration: { min: '', max: '' },
      searchTerm: ''
    })
  }

  const exportData = () => {
    // ✅ Llamar a onExport directamente
    if (onExport) {
      onExport(filteredData, filters)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Barra de controles principal */}
      <Card size="sm">
        <Card.Content className="p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-md">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Buscar en historial..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full h-10 pl-10 pr-3 py-sm border border-border-default rounded-md bg-bg-canvas text-body-paragraph focus:outline-none focus:ring-2 focus:ring-interactive-default focus:border-interactive-default"
              />
            </div>
            
            {/* Controles */}
            <div className="flex gap-sm flex-shrink-0">
              {/* Botón de filtros */}
              <Button
                variant={isFilterOpen ? "primary" : "secondary"}
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                icon={<Filter size={14} />}
                className="relative"
              >
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-feedback-error text-bg-canvas rounded-full text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
              
              {/* Exportar */}
              <Button
                variant="secondary"
                size="sm"
                onClick={exportData}
                icon={<Download size={14} />}
                disabled={filteredData.length === 0}
              >
                Exportar
              </Button>
              
              {/* Limpiar filtros */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  icon={<X size={14} />}
                >
                  Limpiar
                </Button>
              )}
            </div>
          </div>
          
          {/* Información de resultados */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mt-lg pt-lg border-t border-border-default">
            <div className="text-body-auxiliary text-text-secondary">
              Mostrando {filteredData.length} de {data.length} registros
              {activeFiltersCount > 0 && (
                <span className="ml-2 text-interactive-default">
                  • {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} activo{activeFiltersCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {/* Ordenamiento rápido */}
            <div className="flex gap-xs">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('date')}
                icon={
                  sortConfig.field === 'date' && sortConfig.direction === 'asc'
                    ? <SortAsc size={14} />
                    : <SortDesc size={14} />
                }
                className={cn(
                  sortConfig.field === 'date' && 'text-interactive-default'
                )}
              >
                Fecha
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('duration')}
                icon={
                  sortConfig.field === 'duration' && sortConfig.direction === 'asc'
                    ? <SortAsc size={14} />
                    : <SortDesc size={14} />
                }
                className={cn(
                  sortConfig.field === 'duration' && 'text-interactive-default'
                )}
              >
                Duración
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Panel de filtros expandido */}
      {isFilterOpen && (
        <Card 
          size="sm" 
          className="animate-in slide-in-from-top-2 duration-300"
        >
          <Card.Content className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Filtro por fechas */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Rango de fechas
                </label>
                <div className="space-y-1">
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => handleFilterChange('dateRange', {
                      ...filters.dateRange,
                      start: e.target.value
                    })}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Fecha inicio"
                  />
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => handleFilterChange('dateRange', {
                      ...filters.dateRange,
                      end: e.target.value
                    })}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Fecha fin"
                  />
                </div>
              </div>

              {/* Filtro por estado */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Estado
                </label>
                <div className="space-y-1">
                  {filterOptions.status.map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(option.value)}
                        onChange={() => handleMultiSelectFilter('status', option.value)}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-700">
                        {option.label}
                      </span>
                      <span className="text-xs text-gray-500">({option.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtro por despacho */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Despacho
                </label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {filterOptions.despacho.map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.despacho.includes(option.value)}
                        onChange={() => handleMultiSelectFilter('despacho', option.value)}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-700 truncate" title={option.label}>
                        {option.label}
                      </span>
                      <span className="text-xs text-gray-500">({option.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtro por duración */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Duración (segundos)
                </label>
                <div className="space-y-1">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={filters.duration.min}
                    onChange={(e) => handleFilterChange('duration', {
                      ...filters.duration,
                      min: e.target.value
                    })}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    min="0"
                    step="0.1"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={filters.duration.max}
                    onChange={(e) => handleFilterChange('duration', {
                      ...filters.duration,
                      max: e.target.value
                    })}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
            
            {/* Acciones del panel */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {filteredData.length} resultado{filteredData.length !== 1 ? 's' : ''} encontrado{filteredData.length !== 1 ? 's' : ''}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                >
                  Limpiar todo
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  )
}

/**
 * Hook para manejar filtros con persistencia local - OPTIMIZADO
 */
export const useAdvancedFilters = (initialData = []) => {
  const [filteredData, setFilteredData] = useState(initialData)
  const [filterState, setFilterState] = useState(null)
  
  // ✅ Memoizar handleFilter para evitar recreaciones
  const handleFilter = useCallback((data, state) => {
    setFilteredData(data)
    setFilterState(state)
  }, [])
  
  // ✅ Memoizar exportToCSV para evitar recreaciones
  const exportToCSV = useCallback((data, filters) => {
    if (!data || data.length === 0) {
      console.warn('No hay datos para exportar')
      return
    }

    const headers = Object.keys(data[0] || {})
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(field => `"${row[field] || ''}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `historial_filtrado_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }, [])
  
  return {
    filteredData,
    filterState,
    handleFilter,
    exportToCSV
  }
}

export default AdvancedFilters