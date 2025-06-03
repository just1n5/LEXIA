import React from 'react'
import { 
  Eye, 
  RefreshCw, 
  Download, 
  Clock, 
  Calendar,
  Building2,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react'

// Components del design system
import Card from '../../../ui/Card'
import Button from '../../../ui/Button'
import Badge from '../../../ui/Badge'
import { cn } from '../../../../utils/cn'

/**
 * Componente ExecutionCard optimizado para móviles
 * Muestra información de ejecución en formato card compacto
 */
const ExecutionCard = ({
  execution,
  onViewDetails,
  onRerun,
  onExport,
  compact = false,
  loading = false,
  className = '',
  ...props
}) => {
  if (!execution) return null

  // Formatear fecha de ejecución
  const formatExecutionDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible'
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = (now - date) / (1000 * 60 * 60)
      
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60))
        return `Hace ${diffInMinutes} min`
      } else if (diffInHours < 24) {
        return `Hace ${Math.floor(diffInHours)}h`
      } else if (diffInHours < 48) {
        return 'Ayer'
      } else {
        return date.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
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

  // Truncar texto largo
  const truncateText = (text, maxLength = 30) => {
    if (!text) return 'N/A'
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
  }

  return (
    <Card 
      className={cn(
        'hover:shadow-md transition-all duration-200',
        compact && 'p-md',
        className
      )} 
      {...props}
    >
      <Card.Content className={compact ? 'p-0' : undefined}>
        {/* Header con estado y fecha */}
        <div className="flex items-start justify-between mb-md">
          <div className="flex-1">
            {getStatusBadge(execution.estado_extraccion)}
          </div>
          <div className="text-right">
            <div className="text-body-auxiliary text-text-secondary">
              {formatExecutionDate(execution.fecha_ejecucion)}
            </div>
          </div>
        </div>

        {/* Información principal */}
        <div className="space-y-sm mb-lg">
          {/* Radicado */}
          <div className="flex items-center gap-sm">
            <FileText className="w-4 h-4 text-text-secondary flex-shrink-0" />
            <div>
              <div className="text-body-auxiliary text-text-secondary">
                Radicado
              </div>
              <div className="text-body-paragraph text-text-primary font-mono text-sm">
                {execution.numero_radicado_completo || 'No especificado'}
              </div>
            </div>
          </div>

          {/* Despacho */}
          <div className="flex items-start gap-sm">
            <Building2 className="w-4 h-4 text-text-secondary flex-shrink-0 mt-xs" />
            <div className="min-w-0 flex-1">
              <div className="text-body-auxiliary text-text-secondary">
                Despacho
              </div>
              <div className="text-body-paragraph text-text-primary">
                {truncateText(execution.despacho_juzgado, compact ? 25 : 40)}
              </div>
            </div>
          </div>

          {/* Duración */}
          <div className="flex items-center gap-sm">
            <Clock className="w-4 h-4 text-text-secondary flex-shrink-0" />
            <div>
              <div className="text-body-auxiliary text-text-secondary">
                Duración
              </div>
              <div className="text-body-paragraph text-text-primary">
                {formatDuration(execution.tiempo_ejecucion)}
              </div>
            </div>
          </div>

          {/* Resultados encontrados (si existe) */}
          {execution.resultados_encontrados !== undefined && (
            <div className="flex items-center gap-sm">
              <div className={cn(
                'w-4 h-4 rounded-full flex-shrink-0',
                execution.resultados_encontrados > 0 
                  ? 'bg-feedback-success' 
                  : 'bg-feedback-warning'
              )} />
              <div>
                <div className="text-body-auxiliary text-text-secondary">
                  Resultados
                </div>
                <div className="text-body-paragraph text-text-primary">
                  {execution.resultados_encontrados} encontrado{execution.resultados_encontrados !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-xs pt-sm border-t border-border-default">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails?.(execution)}
            icon={<Eye className="w-4 h-4" />}
            disabled={loading}
            className="flex-1 justify-center"
          >
            Ver
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRerun?.(execution.id)}
            icon={<RefreshCw className="w-4 h-4" />}
            disabled={loading}
            className="flex-1 justify-center"
          >
            Rerun
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onExport?.(execution.id)}
            icon={<Download className="w-4 h-4" />}
            disabled={loading}
            className="flex-1 justify-center"
          >
            Export
          </Button>
        </div>

        {/* Indicador de loading */}
        {loading && (
          <div className="absolute inset-0 bg-bg-canvas bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-interactive-default border-t-transparent rounded-full" />
          </div>
        )}
      </Card.Content>
    </Card>
  )
}

/**
 * Variante compacta del ExecutionCard
 */
const CompactExecutionCard = (props) => (
  <ExecutionCard {...props} compact={true} />
)

/**
 * Lista de ExecutionCards con loading states
 */
const ExecutionCardList = ({
  executions = [],
  loading = false,
  compact = false,
  onViewDetails,
  onRerun,
  onExport,
  className = '',
  ...props
}) => {
  if (loading && executions.length === 0) {
    return (
      <div className={cn('space-y-md', className)} {...props}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <Card.Content>
              <div className="flex justify-between mb-md">
                <div className="h-6 bg-bg-light rounded w-20"></div>
                <div className="h-4 bg-bg-light rounded w-16"></div>
              </div>
              <div className="space-y-sm mb-lg">
                <div className="h-4 bg-bg-light rounded w-full"></div>
                <div className="h-4 bg-bg-light rounded w-3/4"></div>
                <div className="h-4 bg-bg-light rounded w-1/2"></div>
              </div>
              <div className="flex gap-xs pt-sm border-t border-border-default">
                <div className="h-8 bg-bg-light rounded flex-1"></div>
                <div className="h-8 bg-bg-light rounded flex-1"></div>
                <div className="h-8 bg-bg-light rounded flex-1"></div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    )
  }

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
    <div className={cn('space-y-md', className)} {...props}>
      {executions.map((execution, index) => (
        <ExecutionCard
          key={execution.id || index}
          execution={execution}
          compact={compact}
          onViewDetails={onViewDetails}
          onRerun={onRerun}
          onExport={onExport}
          loading={loading}
        />
      ))}
    </div>
  )
}

// Exportar componentes
ExecutionCard.Compact = CompactExecutionCard
ExecutionCard.List = ExecutionCardList
ExecutionCard.displayName = 'ExecutionCard'

export default ExecutionCard