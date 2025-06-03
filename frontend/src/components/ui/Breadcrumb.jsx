import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Componente Breadcrumb siguiendo el design system
 * Proporciona navegación jerárquica con React Router
 */
const Breadcrumb = ({ 
  items = [], 
  className = '',
  separator: CustomSeparator,
  ...props 
}) => {
  if (!items.length) return null

  const DefaultSeparator = () => (
    <ChevronRight className="w-4 h-4 text-text-secondary" aria-hidden="true" />
  )
  
  const Separator = CustomSeparator || DefaultSeparator

  return (
    <nav 
      className={cn(
        'flex items-center flex-wrap gap-xs mb-lg',
        'text-body-auxiliary text-text-secondary',
        className
      )}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className="flex items-center flex-wrap gap-xs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <li key={index} className="flex items-center gap-xs">
              {/* Separator (excepto para el primer item) */}
              {index > 0 && (
                <span className="flex items-center" role="presentation">
                  <Separator />
                </span>
              )}
              
              {/* Item del breadcrumb */}
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className={cn(
                    'hover:text-text-primary transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-interactive-default focus:ring-opacity-20',
                    'rounded px-xs py-xs -mx-xs -my-xs' // Padding para focus ring
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  className={cn(
                    isLast 
                      ? 'text-text-primary font-medium' 
                      : 'text-text-secondary'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * Hook helper para construir breadcrumbs dinámicamente
 */
export const useBreadcrumb = (basePath = '/dashboard') => {
  const buildSolicitudBreadcrumb = (solicitudId, solicitudNombre) => [
    { 
      label: 'Mis Solicitudes', 
      href: basePath 
    },
    { 
      label: solicitudNombre ? `${solicitudNombre.substring(0, 30)}...` : `Solicitud #${solicitudId}`,
      href: null // Sin href para el item actual
    }
  ]

  const buildHistorialBreadcrumb = () => [
    { 
      label: 'Dashboard', 
      href: basePath 
    },
    { 
      label: 'Historial de Consultas',
      href: null
    }
  ]

  const buildFormBreadcrumb = (formType) => [
    { 
      label: 'Dashboard', 
      href: basePath 
    },
    {
      label: 'Nueva Solicitud',
      href: '/solicitudes/select-type'
    },
    {
      label: formType === 'simple' ? 'Consulta Simple' : 'Consulta Avanzada',
      href: null
    }
  ]

  return {
    buildSolicitudBreadcrumb,
    buildHistorialBreadcrumb,
    buildFormBreadcrumb
  }
}

/**
 * Variantes de separador personalizadas
 */
Breadcrumb.TextSeparator = ({ children = '/' }) => (
  <span className="text-text-secondary px-xs" aria-hidden="true">
    {children}
  </span>
)

Breadcrumb.DotSeparator = () => (
  <span className="text-text-secondary" aria-hidden="true">
    •
  </span>
)

Breadcrumb.displayName = 'Breadcrumb'

export default Breadcrumb