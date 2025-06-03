import React from 'react'
import { CheckCircle, PauseCircle, AlertTriangle, Clock } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * StatusBadge - Componente para mostrar el estado de una solicitud
 * Implementa los colores semánticos del design system
 */
const StatusBadge = ({ 
  status, 
  size = 'md',
  showIcon = true,
  className = ""
}) => {
  // Configuración de variantes por estado
  const variants = {
    activa: { 
      className: "bg-feedback-success-light text-feedback-success border-feedback-success",
      icon: CheckCircle,
      label: "Activa"
    },
    pausada: { 
      className: "bg-feedback-warning-light text-feedback-warning border-feedback-warning",
      icon: PauseCircle,
      label: "Pausada"
    },
    error: { 
      className: "bg-feedback-error-light text-feedback-error border-feedback-error",
      icon: AlertTriangle,
      label: "Error"
    },
    completada: {
      className: "bg-feedback-info-light text-feedback-info border-feedback-info",
      icon: CheckCircle,
      label: "Completada"
    },
    pendiente: {
      className: "bg-bg-light text-text-secondary border-border-default",
      icon: Clock,
      label: "Pendiente"
    }
  }

  // Tamaños disponibles
  const sizes = {
    sm: {
      padding: "px-xs py-xs",
      text: "text-body-auxiliary",
      iconSize: 12
    },
    md: {
      padding: "px-sm py-xs",
      text: "text-body-auxiliary",
      iconSize: 14
    },
    lg: {
      padding: "px-md py-sm",
      text: "text-body-paragraph",
      iconSize: 16
    }
  }

  const variant = variants[status?.toLowerCase()] || variants.pendiente
  const sizeConfig = sizes[size] || sizes.md
  const IconComponent = variant.icon

  return (
    <span className={cn(
      "inline-flex items-center gap-xs rounded-md border font-medium transition-all duration-200",
      "hover:scale-105 hover:shadow-sm",
      variant.className,
      sizeConfig.padding,
      sizeConfig.text,
      className
    )}>
      {showIcon && IconComponent && (
        <IconComponent size={sizeConfig.iconSize} />
      )}
      {variant.label}
    </span>
  )
}

// Variantes de conveniencia
StatusBadge.Active = (props) => <StatusBadge {...props} status="activa" />
StatusBadge.Paused = (props) => <StatusBadge {...props} status="pausada" />
StatusBadge.Error = (props) => <StatusBadge {...props} status="error" />
StatusBadge.Completed = (props) => <StatusBadge {...props} status="completada" />
StatusBadge.Pending = (props) => <StatusBadge {...props} status="pendiente" />

export default StatusBadge