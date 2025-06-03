import React, { useState } from 'react'
import { 
  Eye, 
  RefreshCw, 
  Download, 
  ChevronUp, 
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Calendar
} from 'lucide-react'

// Components del design system
import Button from '../../../ui/Button'
import Badge from '../../../ui/Badge'
import { cn } from '../../../../utils/cn'

/**
 * Componente ExecutionTable optimizado para desktop
 * Tabla mejorada con ordenamiento, filtros y acciones por fila
 */
const ExecutionTable = ({
  executions = [],
  loading = false,
  sortBy,
  onSort,
  onViewDetails,
  onRerun,
  onExport,
  className = '',
  ...props
}) => {
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [hoveredRow, setHoveredRow] = useState(null)

  // Configuración de columnas
  const columns = [
    {
      key: 'fecha_ejecucion',
      label: 'Fecha y hora',
      sortable: true,
      width: 'w-36'
    },
    {
      key: 'estado_extraccion',
      label: 'Estado',
      sortable: true,
      width: 'w-28'
    },
    {
      key: 'numero_radicado_completo',
      label: 'Radicado',
      sortable: true,
      width: 'w-40'
    },
    {
      key: 'despacho_juzgado',
      label: 'Despacho',
      sortable: true,
      width: 'flex-1'
    },
    {
      key: 'tiempo_ejecucion',
      label: 'Duración',
      sortable: true,
      width: 'w-20'
    },
    {
      key: 'resultados_encontrados',
      label: 'Resultados',
      sortable: true,
      width: 'w-24'
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      width: 'w-32'
    }
  ]

  // Formatear fecha de ejecución
  const formatExecutionDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  // Formatear tiempo de ejecución
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A'
    
    if (seconds < 60) {
      return `${seconds}s`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
    } else {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${hours}h ${minutes}m`
    }
  }

  // Obtener badge de estado
  const getStatusBadge = (estado) => {
    const statusConfig = {
      'EXITOSA': {
        component: Badge.Success,
        icon: <CheckCircle className="w-3 h-3" />,
        text: 'Completado'
      },
      'FALLIDA': {
        component: Badge.Error,
        icon: <XCircle className="w-3 h-3" />,
        text: 'Error'
      },
      'PENDIENTE': {
        component: Badge.Warning,
        icon: <AlertCircle className="w-3 h-3" />,
        text: 'Pendiente'
      }
    }
    
    const config = statusConfig[estado] || statusConfig['PENDIENTE']
    const BadgeComponent = config.component
    
    return (
      <div className="flex items-center gap-xs">
        {config.icon}
        <BadgeComponent size="sm">{config.text}</BadgeComponent>
      </div>
    )
  }

  // Manejar click en header para ordenamiento
  const handleHeaderClick = (columnKey) => {
    if (!onSort) return
    
    const currentDirection = sortBy?.field === columnKey ? sortBy.direction : null
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc'
    
    onSort({
      field: columnKey,
      direction: newDirection
    })
  }

  // Obtener icono de ordenamiento
  const getSortIcon = (columnKey) => {
    if (sortBy?.field !== columnKey) {
      return <div className="w-4 h-4" /> // Placeholder invisible
    }
    
    return sortBy.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />
  }

  // Truncar texto largo
  const truncateText = (text, maxLength = 35) => {
    if (!text) return 'N/A'
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
  }

  // Loading skeleton
  if (loading && executions.length === 0) {
    return (
      <div className={cn('overflow-x-auto', className)} {...props}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-default">
              {columns.map((column) => (
                <th key={column.key} className={cn(
                  'text-left py-sm px-md text-body-auxiliary font-medium text-text-secondary',
                  column.width
                )}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-b border-border-default animate-pulse">
                <td className="py-sm px-md">
                  <div className="h-4 bg-bg-light rounded w-24"></div>
                </td>
                <td className="py-sm px-md">
                  <div className="h-6 bg-bg-light rounded w-20"></div>
                </td>
                <td className="py-sm px-md">
                  <div className="h-4 bg-bg-light rounded w-32"></div>
                </td>
                <td className="py-sm px-md">
                  <div className="h-4 bg-bg-light rounded w-48"></div>
                </td>
                <td className="py-sm px-md">
                  <div className="h-4 bg-bg-light rounded w-16"></div>
                </td>
                <td className="py-sm px-md">
                  <div className="h-4 bg-bg-light rounded w-12"></div>
                </td>
                <td className="py-sm px-md">
                  <div className="flex gap-xs">
                    <div className="h-8 bg-bg-light rounded w-8"></div>
                    <div className="h-8 bg-bg-light rounded w-8"></div>
                    <div className="h-8 bg-bg-light rounded w-8"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Empty state
  if (executions.length === 0) {
    return (
      <div className={cn('text-center py-xl', className)} {...props}>
        <Calendar className="w-12 h-12 text-text-secondary mx-auto mb-md" />
        <h4 className="text-heading-h4 font-heading text-text-primary mb-sm">
          No se encontraron ejecuciones
        </h4>
        <p className="text-body-paragraph text-text-secondary">
          No hay ejecuciones que coincidan con los filtros aplicados.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto', className)} {...props}>
      <table className="w-full border-collapse">
        {/* Header */}
        <thead>
          <tr className="border-b border-border-default">
            {columns.map((column) => (
              <th 
                key={column.key}
                className={cn(
                  'text-left py-sm px-md text-body-auxiliary font-medium text-text-secondary',
                  column.width,
                  column.sortable && 'cursor-pointer hover:text-text-primary transition-colors user-select-none'
                )}
                onClick={column.sortable ? () => handleHeaderClick(column.key) : undefined}
              >
                <div className="flex items-center gap-xs">
                  <span>{column.label}</span>
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Body */}
        <tbody>
          {executions.map((execution, index) => (
            <tr 
              key={execution.id || index}
              className={cn(
                'border-b border-border-default transition-colors',
                'hover:bg-bg-light',
                hoveredRow === execution.id && 'bg-bg-light'
              )}
              onMouseEnter={() => setHoveredRow(execution.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {/* Fecha y hora */}
              <td className="py-sm px-md">
                <div className="text-body-paragraph text-text-primary">
                  {formatExecutionDate(execution.fecha_ejecucion)}
                </div>
              </td>
              
              {/* Estado */}
              <td className="py-sm px-md">
                {getStatusBadge(execution.estado_extraccion)}
              </td>
              
              {/* Radicado */}
              <td className="py-sm px-md">
                <span className="font-mono text-body-auxiliary text-text-primary">
                  {execution.numero_radicado_completo || 'N/A'}
                </span>
              </td>
              
              {/* Despacho */}
              <td className="py-sm px-md">
                <div 
                  className="text-body-auxiliary text-text-secondary"
                  title={execution.despacho_juzgado}
                >
                  {truncateText(execution.despacho_juzgado)}
                </div>
              </td>
              
              {/* Duración */}
              <td className="py-sm px-md">
                <div className="text-body-auxiliary text-text-secondary">
                  {formatDuration(execution.tiempo_ejecucion)}
                </div>
              </td>
              
              {/* Resultados */}
              <td className="py-sm px-md">
                <div className="flex items-center gap-xs">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    execution.resultados_encontrados > 0 
                      ? 'bg-feedback-success' 
                      : 'bg-feedback-warning'
                  )} />
                  <span className="text-body-auxiliary text-text-secondary">
                    {execution.resultados_encontrados || 0}
                  </span>
                </div>
              </td>
              
              {/* Acciones */}
              <td className="py-sm px-md">
                <div className="flex items-center gap-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails?.(execution)}
                    icon={<Eye className="w-4 h-4" />}
                    disabled={loading}
                    title="Ver detalles"
                    className="p-1 w-8 h-8"
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRerun?.(execution.id)}
                    icon={<RefreshCw className="w-4 h-4" />}
                    disabled={loading}
                    title="Reejecutar"
                    className="p-1 w-8 h-8"
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onExport?.(execution.id)}
                    icon={<Download className="w-4 h-4" />}
                    disabled={loading}
                    title="Exportar"
                    className="p-1 w-8 h-8"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Loading overlay */}
      {loading && executions.length > 0 && (
        <div className="absolute inset-0 bg-bg-canvas bg-opacity-50 flex items-center justify-center">
          <div className="flex items-center gap-sm bg-bg-canvas px-lg py-md rounded-lg shadow-lg">
            <div className="animate-spin w-6 h-6 border-2 border-interactive-default border-t-transparent rounded-full" />
            <span className="text-body-paragraph text-text-primary">
              Cargando...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Componente wrapper para tabla con acciones masivas
 */
const ExecutionTableWithActions = ({
  executions = [],
  selectedExecutions = new Set(),
  onSelectionChange,
  onBulkExport,
  onBulkRerun,
  ...tableProps
}) => {
  const hasSelection = selectedExecutions.size > 0
  
  return (
    <div className="space-y-md">
      {/* Acciones masivas */}
      {hasSelection && (
        <div className="flex items-center justify-between p-md bg-feedback-info-light border border-feedback-info rounded-lg">
          <span className="text-body-paragraph text-feedback-info">
            {selectedExecutions.size} ejecución{selectedExecutions.size > 1 ? 'es' : ''} seleccionada{selectedExecutions.size > 1 ? 's' : ''}
          </span>
          
          <div className="flex items-center gap-sm">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBulkExport?.(Array.from(selectedExecutions))}
              icon={<Download className="w-4 h-4" />}
            >
              Exportar seleccionadas
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onBulkRerun?.(Array.from(selectedExecutions))}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Reejecutar seleccionadas
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectionChange?.(new Set())}
            >
              Limpiar selección
            </Button>
          </div>
        </div>
      )}
      
      {/* Tabla */}
      <ExecutionTable
        executions={executions}
        {...tableProps}
      />
    </div>
  )
}

// Exportar componentes
ExecutionTable.WithActions = ExecutionTableWithActions
ExecutionTable.displayName = 'ExecutionTable'

export default ExecutionTable