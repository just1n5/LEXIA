import React from 'react'
import { cn } from '../../utils/cn'

/**
 * Componente Timeline siguiendo el design system
 * Muestra una línea de tiempo vertical con eventos
 */
const Timeline = ({ 
  items = [], 
  className = '',
  variant = 'default',
  ...props 
}) => {
  if (!items.length) {
    return (
      <div className="text-center py-lg text-text-secondary">
        <p>No hay eventos para mostrar</p>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)} {...props}>
      <ul className="space-y-lg">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const IconComponent = item.icon

          return (
            <TimelineItem
              key={item.id || index}
              item={item}
              isLast={isLast}
              variant={variant}
            />
          )
        })}
      </ul>
    </div>
  )
}

/**
 * Componente individual de Timeline
 */
const TimelineItem = ({ 
  item, 
  isLast = false, 
  variant = 'default',
  className = '' 
}) => {
  const IconComponent = item.icon
  
  // Variantes de estilo
  const variants = {
    default: {
      iconContainer: 'bg-bg-canvas border-2 border-interactive-default',
      iconColor: 'text-interactive-default',
      line: 'border-border-default'
    },
    success: {
      iconContainer: 'bg-feedback-success-light border-2 border-feedback-success',
      iconColor: 'text-feedback-success',
      line: 'border-feedback-success'
    },
    warning: {
      iconContainer: 'bg-feedback-warning-light border-2 border-feedback-warning',
      iconColor: 'text-feedback-warning',
      line: 'border-feedback-warning'
    },
    error: {
      iconContainer: 'bg-feedback-error-light border-2 border-feedback-error',
      iconColor: 'text-feedback-error',
      line: 'border-feedback-error'
    }
  }

  const variantStyles = variants[item.variant || variant] || variants.default

  return (
    <li className={cn('relative flex items-start gap-md', className)}>
      {/* Línea vertical (excepto para el último item) */}
      {!isLast && (
        <div 
          className={cn(
            'absolute left-3 top-8 bottom-0 w-0.5 -mb-lg',
            variantStyles.line
          )}
          aria-hidden="true"
        />
      )}
      
      {/* Icono del evento */}
      <div 
        className={cn(
          'relative z-10 flex items-center justify-center',
          'w-6 h-6 rounded-full flex-shrink-0',
          variantStyles.iconContainer
        )}
        role="img"
        aria-label={item.iconLabel || item.title}
      >
        {IconComponent ? (
          <IconComponent 
            className={cn('w-3 h-3', variantStyles.iconColor)} 
            aria-hidden="true"
          />
        ) : (
          <div 
            className={cn('w-2 h-2 rounded-full', variantStyles.iconColor.replace('text-', 'bg-'))}
            aria-hidden="true"
          />
        )}
      </div>
      
      {/* Contenido del evento */}
      <div className="flex-1 min-w-0 pb-lg">
        {/* Título y descripción */}
        <div className="space-y-xs">
          <h4 className="text-body-paragraph font-medium text-text-primary">
            {item.title}
          </h4>
          
          {item.description && (
            <p className="text-body-auxiliary text-text-secondary">
              {item.description}
            </p>
          )}
        </div>
        
        {/* Fecha/hora */}
        {item.date && (
          <div className="flex items-center gap-xs mt-xs">
            <time 
              className="text-body-auxiliary text-text-secondary"
              dateTime={item.date}
            >
              {formatTimelineDate(item.date)}
            </time>
            
            {/* Badge de estado opcional */}
            {item.status && (
              <span className={cn(
                'inline-flex items-center px-xs py-xs rounded-full text-xs',
                'bg-bg-light text-text-secondary'
              )}>
                {item.status}
              </span>
            )}
          </div>
        )}
        
        {/* Contenido adicional */}
        {item.content && (
          <div className="mt-sm">
            {item.content}
          </div>
        )}
        
        {/* Acciones opcionales */}
        {item.actions && (
          <div className="flex items-center gap-sm mt-sm">
            {item.actions}
          </div>
        )}
      </div>
    </li>
  )
}

/**
 * Componente de Timeline compacto para espacios reducidos
 */
const CompactTimeline = ({ 
  items = [], 
  className = '',
  maxItems = 3,
  showMore = false,
  onShowMore,
  ...props 
}) => {
  const displayItems = showMore ? items : items.slice(0, maxItems)
  const hasMore = items.length > maxItems

  return (
    <div className={cn('space-y-sm', className)} {...props}>
      {displayItems.map((item, index) => {
        const IconComponent = item.icon
        
        return (
          <div key={item.id || index} className="flex items-center gap-sm py-xs">
            {/* Icono pequeño */}
            <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
              {IconComponent ? (
                <IconComponent className="w-3 h-3 text-interactive-default" />
              ) : (
                <div className="w-1.5 h-1.5 bg-interactive-default rounded-full" />
              )}
            </div>
            
            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <span className="text-body-auxiliary text-text-primary font-medium">
                {item.title}
              </span>
              {item.date && (
                <span className="text-xs text-text-secondary ml-sm">
                  {formatTimelineDate(item.date, true)}
                </span>
              )}
            </div>
          </div>
        )
      })}
      
      {/* Mostrar más */}
      {hasMore && !showMore && (
        <button
          onClick={onShowMore}
          className="text-body-auxiliary text-interactive-default hover:text-interactive-hover transition-colors"
        >
          Ver {items.length - maxItems} eventos más...
        </button>
      )}
    </div>
  )
}

/**
 * Helper para formatear fechas en timeline
 */
const formatTimelineDate = (dateString, compact = false) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    
    // Diferencias en tiempo
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (compact) {
      if (days > 7) {
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
      } else if (days > 0) {
        return `${days}d`
      } else if (hours > 0) {
        return `${hours}h`
      } else {
        return `${minutes}m`
      }
    }
    
    // Formato completo
    if (days > 7) {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } else if (days > 0) {
      return `Hace ${days} día${days > 1 ? 's' : ''}`
    } else if (hours > 0) {
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
    } else if (minutes > 0) {
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
    } else {
      return 'Hace un momento'
    }
  } catch (error) {
    console.warn('Invalid date for timeline:', dateString)
    return 'Fecha inválida'
  }
}

/**
 * Timeline especializado para eventos de solicitud
 */
const SolicitudTimeline = ({ 
  solicitudId, 
  eventos = [],
  className = '',
  ...props 
}) => {
  // Eventos por defecto si no se proporcionan
  const defaultEventos = [
    {
      id: 'created',
      title: 'Solicitud creada',
      description: 'La solicitud de consulta judicial fue registrada en el sistema',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      variant: 'success'
    },
    {
      id: 'processed',
      title: 'Búsqueda procesada',
      description: 'El sistema procesó la consulta y accedió a la base de datos judicial',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      variant: 'default'
    },
    {
      id: 'notification',
      title: 'Notificación enviada',
      description: 'Se envió un correo electrónico con los resultados encontrados',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
      variant: 'default'
    }
  ]

  const timelineEventos = eventos.length > 0 ? eventos : defaultEventos

  return (
    <Timeline 
      items={timelineEventos}
      className={className}
      {...props}
    />
  )
}

// Asignar subcomponentes
Timeline.Item = TimelineItem
Timeline.Compact = CompactTimeline
Timeline.Solicitud = SolicitudTimeline

Timeline.displayName = 'Timeline'

export default Timeline