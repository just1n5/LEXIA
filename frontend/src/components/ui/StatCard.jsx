import React from 'react'
import { cn } from '../../utils/cn'

/**
 * Componente de tarjeta de estadística mejorado
 * Incluye icono, valor principal, descripción y tendencia opcional
 */
const StatCard = ({
  title,
  value,
  icon,
  description,
  trend,
  trendDirection, // 'up' | 'down' | 'neutral'
  className = '',
  ...props
}) => {
  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-500'
    }
  }

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up':
        return '↗️'
      case 'down':
        return '↘️'
      default:
        return '→'
    }
  }

  return (
    <div className={cn('stat-card', className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon && (
              <span className="text-2xl" role="img" aria-hidden="true">
                {icon}
              </span>
            )}
            <h3 className="stat-title">{title}</h3>
          </div>
          
          <div className="stat-value">{value}</div>
          
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        
        {trend && (
          <div className={cn('flex items-center gap-1 text-sm', getTrendColor())}>
            <span>{getTrendIcon()}</span>
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  )
}

StatCard.displayName = 'StatCard'

export default StatCard
