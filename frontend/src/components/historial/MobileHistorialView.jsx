import React, { useState, useCallback } from 'react'
import { FileText, Download, Eye, Calendar, Building, Gavel, MoreVertical, CheckCircle, AlertCircle, Clock, XCircle, ChevronDown, Filter, SortAsc } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

/**
 * ✨ MOBILE-FIRST EXPERIENCE - Cards Responsivos
 * Experiencia optimizada para móvil con cards inteligentes
 */
const MobileHistorialView = ({
  data = [],
  isLoading = false,
  onViewDetails = () => {},
  onDownload = () => {},
  onBulkAction = () => {},
  selectedItems = new Set(),
  onSelectionChange = () => {},
  sortOptions = [],
  currentSort = '',
  onSortChange = () => {},
  className = '',
  ...props
}) => {
  const [expandedItems, setExpandedItems] = useState(new Set())
  const [showSortMenu, setShowSortMenu] = useState(false)

  // Configuración de estados con iconos y colores
  const getEstadoConfig = useCallback((estado) => {
    const configs = {
      exitoso: {
        icon: CheckCircle,
        text: 'Exitoso',
        className: 'text-feedback-success bg-feedback-success-light border-feedback-success',
        dotColor: 'bg-feedback-success'
      },
      error_captcha: {
        icon: AlertCircle,
        text: 'Error Captcha',
        className: 'text-feedback-warning bg-feedback-warning-light border-feedback-warning',
        dotColor: 'bg-feedback-warning'
      },
      error_sistema: {
        icon: XCircle,
        text: 'Error Sistema',
        className: 'text-feedback-error bg-feedback-error-light border-feedback-error',
        dotColor: 'bg-feedback-error'
      },
      pendiente: {
        icon: Clock,
        text: 'Pendiente',
        className: 'text-feedback-info bg-feedback-info-light border-feedback-info',
        dotColor: 'bg-feedback-info'
      }
    }
    return configs[estado] || configs.pendiente
  }, [])

  // Formateo de fechas optimizado
  const formatFecha = useCallback((fecha) => {
    if (!fecha) return 'Sin fecha'
    
    try {
      const date = new Date(fecha)
      const now = new Date()
      const diffMs = now - date
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Hoy'
      if (diffDays === 1) return 'Ayer'
      if (diffDays < 7) return `Hace ${diffDays} días`
      
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch (error) {
      return 'Fecha inválida'
    }
  }, [])

  const formatFechaCompleta = useCallback((fecha) => {
    if (!fecha) return 'Sin fecha'
    
    try {
      const date = new Date(fecha)
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Fecha inválida'
    }
  }, [])

  // Handlers
  const toggleSelectItem = useCallback((id) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    onSelectionChange(newSelected)
  }, [selectedItems, onSelectionChange])

  const toggleExpandItem = useCallback((id) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }, [expandedItems])

  const handleBulkActionClick = useCallback((action) => {
    const selectedData = data.filter(item => selectedItems.has(item.id))
    onBulkAction(action, selectedData)
  }, [data, selectedItems, onBulkAction])

  // Componente de Card individual
  const HistorialCard = ({ item }) => {
    const estadoConfig = getEstadoConfig(item.estado_extraccion)
    const EstadoIcon = estadoConfig.icon
    const isSelected = selectedItems.has(item.id)
    const isExpanded = expandedItems.has(item.id)

    return (
      <div 
        className={cn(
          'bg-bg-canvas rounded-lg border-2 transition-all duration-200 shadow-sm hover:shadow-md',
          isSelected 
            ? 'border-interactive-default shadow-lg shadow-interactive-default/20' 
            : 'border-border-default hover:border-border-default'
        )}
      >
        {/* Card Header */}
        <div className="p-lg border-b border-border-default">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-start space-x-sm">
                {/* Selection checkbox */}
                <button
                  onClick={() => toggleSelectItem(item.id)}
                  className={cn(
                    'mt-xs w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
                    isSelected 
                      ? 'bg-interactive-default border-interactive-default' 
                      : 'border-border-default hover:border-text-secondary'
                  )}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-text-base" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h3 className="text-body-paragraph font-semibold text-text-primary truncate mb-xs">
                    {item.solicitud_alias}
                  </h3>
                  
                  <div className="flex items-center space-x-sm">
                    <div className={cn('w-2 h-2 rounded-full', estadoConfig.dotColor)}></div>
                    <EstadoIcon className="w-4 h-4" />
                    <span className={cn(
                      'text-body-auxiliary font-medium px-sm py-xs rounded-full border',
                      estadoConfig.className
                    )}>
                      {estadoConfig.text}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions menu */}
            <div className="flex items-center space-x-xs ml-sm">
              <button
                onClick={() => toggleExpandItem(item.id)}
                className={cn(
                  'p-xs rounded-full transition-all duration-200',
                  isExpanded 
                    ? 'bg-interactive-default text-text-base' 
                    : 'text-text-secondary hover:bg-bg-light hover:text-text-primary'
                )}
              >
                <ChevronDown className={cn(
                  'w-4 h-4 transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )} />
              </button>
              
              <button className="p-xs text-text-secondary hover:bg-bg-light hover:text-text-primary rounded-full transition-default">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Card Content - Información principal siempre visible */}
        <div className="p-lg space-y-sm">
          {/* Radicado - Información más importante */}
          <div className="flex items-start space-x-sm">
            <Gavel className="w-4 h-4 text-text-secondary mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-body-auxiliary text-text-secondary font-medium mb-xs">RADICADO</p>
              <p className="text-body-paragraph font-mono text-text-primary break-all leading-tight">
                {item.numero_radicado_completo}
              </p>
            </div>
          </div>

          {/* Información temporal */}
          <div className="grid grid-cols-2 gap-sm">
            <div className="flex items-start space-x-xs">
              <Calendar className="w-4 h-4 text-text-secondary mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-body-auxiliary text-text-secondary font-medium">CONSULTA</p>
                <p className="text-body-auxiliary text-text-primary">
                  {formatFecha(item.fecha_ejecucion)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-xs">
              <FileText className="w-4 h-4 text-text-secondary mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-body-auxiliary text-text-secondary font-medium">ÚLT. AUTO</p>
                <p className="text-body-auxiliary text-text-primary">
                  {formatFecha(item.fecha_ultimo_auto)}
                </p>
              </div>
            </div>
          </div>

          {/* Información expandida */}
          {isExpanded && (
            <div className="pt-sm border-t border-border-default space-y-sm animate-slide-down">
              {/* Despacho */}
              <div className="flex items-start space-x-sm">
                <Building className="w-4 h-4 text-text-secondary mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-body-auxiliary text-text-secondary font-medium mb-xs">DESPACHO/JUZGADO</p>
                  <p className="text-body-auxiliary text-text-primary line-clamp-2">
                    {item.despacho_juzgado}
                  </p>
                </div>
              </div>

              {/* Partes del proceso */}
              {(item.demandante || item.demandado) && (
                <div className="grid grid-cols-1 gap-sm">
                  {item.demandante && (
                    <div>
                      <p className="text-body-auxiliary text-text-secondary font-medium">DEMANDANTE</p>
                      <p className="text-body-auxiliary text-text-primary truncate">{item.demandante}</p>
                    </div>
                  )}
                  {item.demandado && (
                    <div>
                      <p className="text-body-auxiliary text-text-secondary font-medium">DEMANDADO</p>
                      <p className="text-body-auxiliary text-text-primary truncate">{item.demandado}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Detalles de fechas completas */}
              <div className="bg-bg-light rounded-md p-sm">
                <div className="grid grid-cols-1 gap-xs text-body-auxiliary">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Consulta completa:</span>
                    <span className="text-text-primary font-medium">{formatFechaCompleta(item.fecha_ejecucion)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Último auto:</span>
                    <span className="text-text-primary font-medium">{formatFechaCompleta(item.fecha_ultimo_auto)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Actions */}
        <div className="px-lg py-sm bg-bg-light border-t border-border-default rounded-b-lg">
          <div className="flex justify-between items-center">
            <div className="flex space-x-xs">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(item)}
                icon={<Eye className="w-3 h-3" />}
                className="text-feedback-info hover:bg-feedback-info-light"
              >
                <span className="text-body-auxiliary">Ver</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(item)}
                icon={<Download className="w-3 h-3" />}
                className="text-feedback-success hover:bg-feedback-success-light"
              >
                <span className="text-body-auxiliary">PDF</span>
              </Button>
            </div>
            
            <div className="text-body-auxiliary text-text-secondary">
              {formatFecha(item.fecha_ejecucion)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Sort Menu Component
  const SortMenu = () => (
    <div className="absolute top-full right-0 mt-xs bg-bg-canvas border border-border-default rounded-lg shadow-lg z-50 p-xs min-w-48">
      <div className="pb-xs mb-xs border-b border-border-default">
        <h4 className="text-body-paragraph font-medium text-text-primary px-sm py-xs">Ordenar por</h4>
      </div>
      
      <div className="space-y-xs">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              onSortChange(option.value)
              setShowSortMenu(false)
            }}
            className={cn(
              'w-full text-left px-sm py-xs rounded hover:bg-bg-light transition-default text-body-auxiliary',
              currentSort === option.value 
                ? 'text-interactive-default bg-interactive-default bg-opacity-10' 
                : 'text-text-base'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className={cn('space-y-lg', className)} {...props}>
      {/* Mobile Header with Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="bg-interactive-default bg-opacity-10 border border-interactive-default rounded-lg p-sm">
          <div className="flex items-center justify-between">
            <span className="text-body-paragraph font-medium text-text-primary">
              {selectedItems.size} seleccionado{selectedItems.size !== 1 ? 's' : ''}
            </span>
            
            <div className="flex space-x-xs">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkActionClick('download')}
                icon={<Download className="w-4 h-4" />}
                className="text-feedback-success hover:bg-feedback-success-light"
              >
                <span className="text-body-auxiliary">PDF</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkActionClick('archive')}
                className="text-text-secondary hover:bg-bg-light"
              >
                <span className="text-body-auxiliary">Archivar</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Controls */}
      <div className="flex justify-between items-center">
        <div className="text-body-paragraph text-text-secondary">
          {data.length} resultado{data.length !== 1 ? 's' : ''}
        </div>
        
        <div className="flex items-center space-x-sm relative">
          <Button
            variant="ghost"
            size="sm"
            icon={<SortAsc className="w-4 h-4" />}
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="text-text-secondary hover:text-text-primary"
          >
            Ordenar
          </Button>
          
          {showSortMenu && <SortMenu />}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-lg">
        {data.map((item) => (
          <HistorialCard key={item.id} item={item} />
        ))}
      </div>

      {/* Load More or Pagination for Mobile */}
      {data.length > 0 && (
        <div className="text-center pt-lg">
          <Button 
            variant="secondary" 
            className="w-full sm:w-auto"
            icon={<ChevronDown className="w-4 h-4" />}
          >
            Cargar más resultados
          </Button>
        </div>
      )}
    </div>
  )
}

MobileHistorialView.displayName = 'MobileHistorialView'

export default MobileHistorialView