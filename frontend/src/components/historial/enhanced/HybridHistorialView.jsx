import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Monitor, Smartphone, Grid, Table as TableIcon, RefreshCw } from 'lucide-react'
import { cn } from '../../../utils/cn'
import Button from '../../ui/Button'
import HistorialTable from '../HistorialTable'
import MobileHistorialView from '../MobileHistorialView'

/**
 * 🔄 HYBRID HISTORIAL VIEW - Sprint 1 Core UX (Simplificado)
 * Vista híbrida automática que se adapta al dispositivo y preferencias del usuario
 * Integra tabla desktop + cards móviles
 */
const HybridHistorialView = ({
  data = [],
  isLoading = false,
  isFetching = false,
  onViewDetails = () => {},
  onDownload = () => {},
  onRerun = () => {},
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange = () => {},
  selectedItems = new Set(),
  onSelectionChange = () => {},
  className = '',
  ...props
}) => {
  // 📱 Detección automática de dispositivo
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop'
    }
    return 'desktop'
  })
  
  // 🎛️ Controles de vista del usuario
  const [viewMode, setViewMode] = useState('auto') // 'auto', 'table', 'cards'
  const [sortBy, setSortBy] = useState('fecha_desc') // 'fecha_desc', 'fecha_asc', 'estado', 'radicado'
  const [density, setDensity] = useState('comfortable') // 'compact', 'comfortable', 'spacious'

  // 🔍 Preferencias persistentes del usuario
  useEffect(() => {
    const savedPreferences = localStorage.getItem('historial-view-preferences')
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences)
        setViewMode(prefs.viewMode || 'auto')
        setSortBy(prefs.sortBy || 'fecha_desc')
        setDensity(prefs.density || 'comfortable')
      } catch (error) {
        console.error('Error loading preferences:', error)
      }
    }
  }, [])

  // 💾 Guardar preferencias
  const savePreferences = useCallback((newPrefs) => {
    const currentPrefs = {
      viewMode,
      sortBy,
      density,
      ...newPrefs
    }
    localStorage.setItem('historial-view-preferences', JSON.stringify(currentPrefs))
  }, [viewMode, sortBy, density])

  // 📏 Listener para cambios de pantalla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const newSize = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
      setScreenSize(newSize)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 🎯 Lógica de vista automática
  const actualViewMode = useMemo(() => {
    if (viewMode === 'auto') {
      // Lógica inteligente de vista automática
      if (screenSize === 'mobile') return 'cards'
      if (screenSize === 'tablet') return 'cards'
      if (screenSize === 'desktop') return 'table'
    }
    return viewMode
  }, [viewMode, screenSize])

  // 📊 Datos procesados
  const processedData = useMemo(() => {
    if (!data.length) return []

    // Ordenar datos
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case 'fecha_desc':
          return new Date(b.fecha_ejecucion) - new Date(a.fecha_ejecucion)
        case 'fecha_asc':
          return new Date(a.fecha_ejecucion) - new Date(b.fecha_ejecucion)
        case 'estado':
          return (a.estado_extraccion || '').localeCompare(b.estado_extraccion || '')
        case 'radicado':
          return (a.numero_radicado_completo || '').localeCompare(b.numero_radicado_completo || '')
        default:
          return new Date(b.fecha_ejecucion) - new Date(a.fecha_ejecucion)
      }
    })
  }, [data, sortBy])

  // 🎛️ Handlers de control
  const handleViewModeChange = useCallback((newViewMode) => {
    setViewMode(newViewMode)
    savePreferences({ viewMode: newViewMode })
  }, [savePreferences])

  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort)
    savePreferences({ sortBy: newSort })
  }, [savePreferences])

  const handleDensityChange = useCallback((newDensity) => {
    setDensity(newDensity)
    savePreferences({ density: newDensity })
  }, [savePreferences])

  // 📊 Opciones de configuración
  const viewModeOptions = [
    { value: 'auto', label: 'Automática', icon: Monitor, description: 'Se adapta al dispositivo' },
    { value: 'table', label: 'Tabla', icon: TableIcon, description: 'Vista de tabla clásica' },
    { value: 'cards', label: 'Cards', icon: Grid, description: 'Cards responsivos' }
  ]

  const sortOptions = [
    { value: 'fecha_desc', label: 'Más recientes primero' },
    { value: 'fecha_asc', label: 'Más antiguos primero' },
    { value: 'estado', label: 'Por estado' },
    { value: 'radicado', label: 'Por radicado' }
  ]

  const densityOptions = [
    { value: 'compact', label: 'Compacta' },
    { value: 'comfortable', label: 'Cómoda' },
    { value: 'spacious', label: 'Espaciosa' }
  ]

  return (
    <div className={cn('space-y-lg', className)} {...props}>
      
      {/* 🎛️ Panel de Control de Vista */}
      <div className="bg-bg-canvas rounded-lg border border-border-default p-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-md">
          
          {/* Información de resultados */}
          <div className="flex items-center space-x-md">
            <div>
              <span className="text-body-paragraph font-medium text-text-primary">
                {totalItems.toLocaleString()} resultado{totalItems !== 1 ? 's' : ''}
              </span>
              {selectedItems && selectedItems.size > 0 && (
                <span className="text-body-auxiliary text-interactive-default ml-sm">
                  ({selectedItems.size} seleccionado{selectedItems.size !== 1 ? 's' : ''})
                </span>
              )}
            </div>
            
            {/* Indicador de dispositivo */}
            <div className="flex items-center space-x-xs text-body-auxiliary text-text-secondary">
              {screenSize === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              <span className="capitalize">{screenSize}</span>
            </div>
          </div>

          {/* Controles de vista */}
          <div className="flex flex-wrap items-center gap-sm">
            
            {/* Selector de modo de vista */}
            <div className="flex items-center space-x-xs">
              <span className="text-body-auxiliary text-text-secondary">Vista:</span>
              <select
                value={viewMode}
                onChange={(e) => handleViewModeChange(e.target.value)}
                className="text-body-auxiliary border border-border-default rounded px-sm py-xs bg-bg-canvas"
              >
                {viewModeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de ordenamiento */}
            <div className="flex items-center space-x-xs">
              <span className="text-body-auxiliary text-text-secondary">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-body-auxiliary border border-border-default rounded px-sm py-xs bg-bg-canvas"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de densidad */}
            <div className="flex items-center space-x-xs">
              <span className="text-body-auxiliary text-text-secondary">Densidad:</span>
              <select
                value={density}
                onChange={(e) => handleDensityChange(e.target.value)}
                className="text-body-auxiliary border border-border-default rounded px-sm py-xs bg-bg-canvas"
              >
                {densityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 📊 Información de vista actual */}
        <div className="mt-sm pt-sm border-t border-border-default">
          <div className="flex items-center justify-between text-body-auxiliary text-text-secondary">
            <span>
              Vista actual: <strong className="text-text-primary capitalize">{actualViewMode}</strong>
            </span>
            
            {isFetching && (
              <div className="flex items-center space-x-xs">
                <RefreshCw className="w-4 h-4 animate-spin text-interactive-default" />
                <span className="text-interactive-default">Actualizando...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🎯 Renderizado de Vista Según Configuración */}
      <div className={cn(
        'transition-all duration-300',
        density === 'compact' && 'space-y-sm',
        density === 'comfortable' && 'space-y-md',
        density === 'spacious' && 'space-y-lg'
      )}>
        
        {/* Vista de Cards (Mobile/Tablet) */}
        {actualViewMode === 'cards' && (
          <MobileHistorialView
            data={processedData}
            isLoading={isLoading}
            onViewDetails={onViewDetails}
            onDownload={onDownload}
            selectedItems={selectedItems}
            onSelectionChange={onSelectionChange}
            sortOptions={sortOptions}
            currentSort={sortBy}
            onSortChange={handleSortChange}
          />
        )}

        {/* Vista de Tabla (Desktop) */}
        {actualViewMode === 'table' && (
          <HistorialTable
            data={processedData}
            isLoading={isLoading}
            onViewDetails={onViewDetails}
            onDownload={onDownload}
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
          />
        )}
      </div>

      {/* 🔢 Paginación */}
      {Math.ceil(totalItems / itemsPerPage) > 1 && (
        <div className="flex justify-center mt-xl">
          <div className="flex items-center space-x-sm">
            <span className="text-body-auxiliary text-text-secondary">
              Página {currentPage} de {Math.ceil(totalItems / itemsPerPage)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

HybridHistorialView.displayName = 'HybridHistorialView'

export default HybridHistorialView