import React from 'react'
import { cn } from '../../utils/cn'

/**
 * Componente Badge mejorado siguiendo las especificaciones exactas de la guía de estilo
 * Implementa colores de feedback semánticos y accesibilidad WCAG 2.1 AA
 */
const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  // Configuraciones de variantes siguiendo la guía de estilo
  const variantClasses = {
    // Estados de feedback con colores exactos de la guía
    success: 'bg-feedback-success-light text-feedback-success border-feedback-success',
    warning: 'bg-feedback-warning-light text-feedback-warning border-feedback-warning', 
    error: 'bg-feedback-error-light text-feedback-error border-feedback-error',
    info: 'bg-feedback-info-light text-feedback-info border-feedback-info',
    neutral: 'bg-bg-light text-text-secondary border-border-default',
    primary: 'bg-feedback-warning-light text-feedback-warning border-feedback-warning', // Usando amarillo como color primario
  }

  // Tamaños siguiendo el sistema de espaciado de la guía
  const sizeClasses = {
    sm: 'px-xs py-xs text-xs', // 4px 4px, 12px
    md: 'px-sm py-xs text-sm',  // 8px 4px, 14px (body-auxiliary)
    lg: 'px-md py-sm text-base', // 16px 8px, 16px
  }

  const baseClasses = 'inline-flex items-center font-medium rounded-full border transition-default'

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={`Estado: ${children}`}
      {...props}
    >
      {icon && (
        <span 
          className="mr-xs text-current flex-shrink-0" 
          role="img" 
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}

/**
 * Componentes de conveniencia para estados específicos
 * Implementan iconos semánticos y colores apropiados
 */

// Estados de proceso
Badge.Success = React.forwardRef(({ children, ...props }, ref) => (
  <Badge 
    ref={ref}
    variant="success" 
    icon="✅" 
    {...props}
  >
    {children}
  </Badge>
))
Badge.Success.displayName = 'Badge.Success'

Badge.Warning = React.forwardRef(({ children, ...props }, ref) => (
  <Badge 
    ref={ref}
    variant="warning" 
    icon="⚠️" 
    {...props}
  >
    {children}
  </Badge>
))
Badge.Warning.displayName = 'Badge.Warning'

Badge.Error = React.forwardRef(({ children, ...props }, ref) => (
  <Badge 
    ref={ref}
    variant="error" 
    icon="❌" 
    {...props}
  >
    {children}
  </Badge>
))
Badge.Error.displayName = 'Badge.Error'

Badge.Info = React.forwardRef(({ children, ...props }, ref) => (
  <Badge 
    ref={ref}
    variant="info" 
    icon="ℹ️" 
    {...props}
  >
    {children}
  </Badge>
))
Badge.Info.displayName = 'Badge.Info'

// Estados específicos para solicitudes
Badge.Active = React.forwardRef(({ children = 'Activa', ...props }, ref) => (
  <Badge 
    ref={ref}
    variant="success" 
    icon="🟢" 
    {...props}
  >
    {children}
  </Badge>
))
Badge.Active.displayName = 'Badge.Active'

Badge.Pending = React.forwardRef(({ children = 'Pendiente', ...props }, ref) => (
  <Badge 
    ref={ref}
    variant="warning" 
    icon="⏳" 
    {...props}
  >
    {children}
  </Badge>
))
Badge.Pending.displayName = 'Badge.Pending'

Badge.Processing = React.forwardRef(({ children = 'En Proceso', ...props }, ref) => (
  <Badge 
    ref={ref}
    variant="info" 
    icon="⚡" 
    {...props}
  >
    {children}
  </Badge>
))
Badge.Processing.displayName = 'Badge.Processing'

Badge.Paused = React.forwardRef(({ children = 'Pausada', ...props }, ref) => (
  <Badge 
    ref={ref}
    variant="neutral" 
    icon="⏸️" 
    {...props}
  >
    {children}
  </Badge>
))
Badge.Paused.displayName = 'Badge.Paused'

Badge.Completed = React.forwardRef(({ children = 'Completada', ...props }, ref) => (
  <Badge 
    ref={ref}
    variant="success" 
    icon="✔️" 
    {...props}
  >
    {children}
  </Badge>
))
Badge.Completed.displayName = 'Badge.Completed'

// Estados de frecuencia con iconos semánticos
Badge.Daily = React.forwardRef(({ children = 'Diaria', ...props }, ref) => (
  <Badge 
    ref={ref}
    variant="success" 
    icon="📅" 
    {...props}
  >
    {children}
  </Badge>
))
Badge.Daily.displayName = 'Badge.Daily'

Badge.Weekly = React.forwardRef(({ children = 'Semanal', ...props }, ref) => (
  <Badge 
    ref={ref}
    variant="info" 
    icon="📊" 
    {...props}
  >
    {children}
  </Badge>
))
Badge.Weekly.displayName = 'Badge.Weekly'

Badge.Monthly = React.forwardRef(({ children = 'Mensual', ...props }, ref) => (
  <Badge 
    ref={ref}
    variant="warning" 
    icon="📆" 
    {...props}
  >
    {children}
  </Badge>
))
Badge.Monthly.displayName = 'Badge.Monthly'

Badge.Manual = React.forwardRef(({ children = 'Manual', ...props }, ref) => (
  <Badge 
    ref={ref}
    variant="neutral" 
    icon="👤" 
    {...props}
  >
    {children}
  </Badge>
))
Badge.Manual.displayName = 'Badge.Manual'

/**
 * Función helper para obtener badge según estado
 * Útil para mapear estados dinámicos desde APIs
 */
export const getBadgeByStatus = (status, size = 'md', additionalProps = {}) => {
  const statusMap = {
    // Estados de proceso
    'activa': Badge.Active,
    'active': Badge.Active,
    'en_proceso': Badge.Processing,
    'processing': Badge.Processing,
    'pausada': Badge.Paused,
    'paused': Badge.Paused,
    'completada': Badge.Completed,
    'completed': Badge.Completed,
    'error': Badge.Error,
    'failed': Badge.Error,
    'pendiente': Badge.Pending,
    'pending': Badge.Pending,
    
    // Frecuencias
    'diaria': Badge.Daily,
    'daily': Badge.Daily,
    'semanal': Badge.Weekly,
    'weekly': Badge.Weekly,
    'mensual': Badge.Monthly,
    'monthly': Badge.Monthly,
    'manual': Badge.Manual,
  }

  const BadgeComponent = statusMap[status?.toLowerCase()] || Badge
  return <BadgeComponent size={size} {...additionalProps} />
}

/**
 * Función helper para obtener badge según frecuencia
 */
export const getBadgeByFrequency = (frequency, size = 'md', additionalProps = {}) => {
  const frequencyMap = {
    'diaria': Badge.Daily,
    'daily': Badge.Daily,
    'semanal': Badge.Weekly,
    'weekly': Badge.Weekly,
    'mensual': Badge.Monthly,
    'monthly': Badge.Monthly,
    'manual': Badge.Manual,
  }

  const BadgeComponent = frequencyMap[frequency?.toLowerCase()] || Badge.Manual
  return <BadgeComponent size={size} {...additionalProps} />
}

Badge.displayName = 'Badge'

export default Badge