import React from 'react'
import { cn } from '../../utils/cn'

/**
 * Componente Timeline siguiendo el design system
 * Basado en el prototipo HTML pero usando tokens del design system
 */
const Timeline = ({ 
  items = [], 
  className = '',
  ...props 
}) => {
  if (!items.length) return null

  return (
    <ul 
      className={cn('relative space-y-lg', className)}
      {...props}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const IconComponent = item.icon
        
        return (
          <li key={index} className="relative flex items-start">
            {/* Línea vertical */}
            {!isLast && (
              <div 
                className="absolute left-3 top-6 bottom-0 w-0.5 bg-border-default"
                aria-hidden="true"
              />
            )}
            
            {/* Icono del evento */}
            <div className={cn(
              'relative z-10 flex items-center justify-center',
              'w-6 h-6 rounded-full border-2',
              'bg-bg-canvas border-interactive-default',
              'flex-shrink-0'
            )}>
              {IconComponent && (
                <IconComponent 
                  className="w-3 h-3 text-interactive-default" 
                  aria-hidden="true"
                />
              )}
            </div>
            
            {/* Contenido del evento */}
            <div className="ml-4 min-w-0 flex-1">
              {/* Título del evento */}
              <div className="text-body-paragraph font-medium text-text-primary mb-xs">
                {item.title}
              </div>
              
              {/* Descripción opcional */}
              {item.description && (
                <div className="text-body-auxiliary text-text-secondary mb-xs">
                  {item.description}
                </div>
              )}
              
              {/* Fecha/hora */}
              <div className="text-body-auxiliary text-text-secondary">
                {item.date}
              </div>
              
              {/* Contenido adicional */}
              {item.children && (
                <div className="mt-sm">
                  {item.children}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Item individual del timeline
 */
const TimelineItem = ({ 
  icon,
  title,
  description,
  date,
  children,
  variant = 'default',
  className = '',
  ...props 
}) => {
  const IconComponent = icon
  
  // Variantes de color para diferentes tipos de eventos
  const variants = {
    default: 'border-interactive-default text-interactive-default',
    success: 'border-feedback-success text-feedback-success',
    warning: 'border-feedback-warning text-feedback-warning',
    error: 'border-feedback-error text-feedback-error',
    info: 'border-feedback-info text-feedback-info'
  }

  return (
    <div 
      className={cn('relative flex items-start', className)}
      {...props}
    >
      {/* Icono del evento */}
      <div className={cn(
        'relative z-10 flex items-center justify-center',
        'w-6 h-6 rounded-full border-2 bg-bg-canvas',
        variants[variant],
        'flex-shrink-0'
      )}>
        {IconComponent && (
          <IconComponent 
            className="w-3 h-3" 
            aria-hidden="true"
          />
        )}
      </div>
      
      {/* Contenido */}
      <div className="ml-4 min-w-0 flex-1">
        <div className="text-body-paragraph font-medium text-text-primary mb-xs">
          {title}
        </div>
        
        {description && (
          <div className="text-body-auxiliary text-text-secondary mb-xs">
            {description}
          </div>
        )}
        
        <div className="text-body-auxiliary text-text-secondary">
          {date}
        </div>
        
        {children && (
          <div className="mt-sm">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Helper para formatear fechas en timeline
 */
export const formatTimelineDate = (date, options = {}) => {
  if (!date) return 'Fecha no disponible'
  
  try {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    })
  } catch (error) {
    return 'Fecha inválida'
  }
}

/**
 * Helper para generar items del timeline desde datos de solicitud
 */
export const generateSolicitudTimeline = (solicitud) => {
  // Esta función ahora se ha movido a ExecutionHistory para mejor organización
  // y para evitar problemas de importación circular
  return []
}

Timeline.Item = TimelineItem
Timeline.displayName = 'Timeline'

export default Timeline