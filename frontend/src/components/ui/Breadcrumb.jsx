import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Componente Breadcrumb siguiendo el design system
 * Proporciona navegación jerárquica clara y accesible
 */
const Breadcrumb = ({ 
  items = [], 
  separator = <ChevronRight className="w-4 h-4" />,
  className = '',
  ...props 
}) => {
  if (!items.length) return null

  return (
    <nav 
      className={cn(
        'flex items-center space-x-sm mb-lg',
        'text-body-auxiliary text-text-secondary',
        className
      )}
      aria-label="Breadcrumb"
      {...props}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        
        return (
          <React.Fragment key={index}>
            {/* Separador */}
            {index > 0 && (
              <span 
                className="text-text-secondary flex-shrink-0" 
                aria-hidden="true"
              >
                {separator}
              </span>
            )}
            
            {/* Item del breadcrumb */}
            {isLast ? (
              // Último item - no es clickeable
              <span 
                className="text-text-primary font-medium"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : item.href ? (
              // Item con enlace
              <Link
                to={item.href}
                className={cn(
                  'hover:text-text-primary transition-colors',
                  'focus:outline-none focus:text-text-primary',
                  'underline-offset-2 hover:underline'
                )}
              >
                {item.label}
              </Link>
            ) : (
              // Item sin enlace
              <span>{item.label}</span>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

/**
 * Hook helper para generar breadcrumbs comunes
 */
export const useSolicitudBreadcrumb = (solicitud) => {
  return [
    {
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      label: 'Mis Solicitudes',
      href: '/dashboard'
    },
    {
      label: solicitud?.nombre_descriptivo || solicitud?.alias || 'Detalles de Solicitud'
    }
  ]
}

Breadcrumb.displayName = 'Breadcrumb'

export default Breadcrumb