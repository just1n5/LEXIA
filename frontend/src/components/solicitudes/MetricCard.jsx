import React from 'react'
import { TrendingUp } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * MetricCard - Componente para mostrar métricas con estilo moderno
 * Implementa el design system y microinteracciones
 */
const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = "text-text-primary", 
  trend, 
  isLoading = false,
  onClick,
  className = ""
}) => {
  const isClickable = typeof onClick === 'function'

  // Determinar el color del gradiente basado en el color del texto
  const getGradientColor = () => {
    if (color.includes('success')) return 'from-feedback-success to-feedback-success'
    if (color.includes('error')) return 'from-feedback-error to-feedback-error'
    if (color.includes('warning')) return 'from-feedback-warning to-feedback-warning'
    if (color.includes('info')) return 'from-feedback-info to-feedback-info'
    return 'from-interactive-default to-interactive-hover'
  }

  // Determinar el color de fondo del icono
  const getIconBgColor = () => {
    if (color.includes('success')) return 'bg-feedback-success/10'
    if (color.includes('error')) return 'bg-feedback-error/10'
    if (color.includes('warning')) return 'bg-feedback-warning/10'
    if (color.includes('info')) return 'bg-feedback-info/10'
    return 'bg-interactive-default/10'
  }

  const baseClasses = cn(
    "bg-bg-canvas rounded-lg border border-border-default p-lg transition-all duration-300 relative overflow-hidden",
    "hover:shadow-lg hover:-translate-y-0.5 group",
    isClickable && "cursor-pointer hover:border-interactive-default",
    className
  )

  const content = (
    <>
      {/* Gradient accent bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", getGradientColor())} />
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-sm mb-xs">
            <p className="text-body-auxiliary font-medium text-text-secondary group-hover:text-text-primary transition-colors">
              {title}
            </p>
            {trend !== undefined && (
              <span className={cn(
                "text-body-auxiliary flex items-center gap-xs",
                trend > 0 ? 'text-feedback-success' : trend < 0 ? 'text-feedback-error' : 'text-text-secondary'
              )}>
                <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
                {Math.abs(trend)}%
              </span>
            )}
          </div>
          
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-bg-light rounded w-16 mb-xs"></div>
              <div className="h-4 bg-bg-light rounded w-24"></div>
            </div>
          ) : (
            <>
              <p className={cn(
                "text-heading-h2 font-heading transition-all duration-200 group-hover:scale-105 transform",
                color
              )}>
                {value}
              </p>
              {subtitle && (
                <p className="text-body-auxiliary text-text-secondary group-hover:text-text-primary transition-colors">
                  {subtitle}
                </p>
              )}
            </>
          )}
        </div>
        
        {icon && (
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
            "transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
            getIconBgColor()
          )}>
            {icon}
          </div>
        )}
      </div>
    </>
  )

  if (isClickable) {
    return (
      <button onClick={onClick} className={baseClasses}>
        {content}
      </button>
    )
  }

  return (
    <div className={baseClasses}>
      {content}
    </div>
  )
}

export default MetricCard