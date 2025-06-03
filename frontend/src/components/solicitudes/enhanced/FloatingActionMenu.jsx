import React, { useState, useRef, useEffect } from 'react'
import { 
  Plus, 
  X, 
  Edit3, 
  Download, 
  Trash2, 
  RefreshCw,
  ExternalLink,
  Copy,
  Play,
  Pause
} from 'lucide-react'
import Button from '../../ui/Button'
import { cn } from '../../../utils/cn'

/**
 * FloatingActionMenu - FAB que mantiene las acciones principales siempre accesibles
 * Implementa UX mobile-first con acciones contextuales
 */
const FloatingActionMenu = ({
  primary,
  actions = [],
  position = 'bottom-right',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const fabRef = useRef(null)
  const lastScrollY = useRef(0)

  // Hide/show FAB en scroll (comportamiento mobile-friendly)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down - hide
        setIsVisible(false)
        setIsOpen(false)
      } else {
        // Scrolling up - show
        setIsVisible(true)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Posición del FAB
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6'
      case 'bottom-right':
      default:
        return 'bottom-6 right-6'
    }
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleActionClick = (action) => {
    action.onClick?.()
    setIsOpen(false)
  }

  return (
    <div 
      ref={fabRef}
      className={cn(
        'fixed z-50 transition-all duration-300',
        getPositionClasses(),
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0',
        className
      )}
    >
      {/* Action Items */}
      <div className={cn(
        'absolute bottom-16 right-0 space-y-3 transition-all duration-300',
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}>
        {actions.map((action, index) => (
          <div
            key={action.label}
            className={cn(
              'flex items-center gap-3 transition-all duration-300',
              isOpen ? 'translate-x-0' : 'translate-x-6'
            )}
            style={{ 
              transitionDelay: isOpen ? `${index * 50}ms` : '0ms' 
            }}
          >
            {/* Label */}
            <div className="bg-text-primary text-bg-canvas px-sm py-xs rounded-md text-body-auxiliary font-medium whitespace-nowrap shadow-lg">
              {action.label}
            </div>
            
            {/* Action Button */}
            <button
              onClick={() => handleActionClick(action)}
              disabled={action.disabled}
              className={cn(
                'w-12 h-12 rounded-full shadow-lg',
                'flex items-center justify-center',
                'transition-all duration-200 hover:scale-110 active:scale-95',
                'focus:outline-none focus:ring-2 focus:ring-interactive-default focus:ring-offset-2',
                action.variant === 'destructive' 
                  ? 'bg-feedback-error text-bg-canvas hover:bg-feedback-error/90' 
                  : 'bg-bg-canvas text-text-primary hover:bg-bg-light border border-border-default',
                action.disabled && 'opacity-50 cursor-not-allowed hover:scale-100'
              )}
              title={action.label}
            >
              {action.icon}
            </button>
          </div>
        ))}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={primary?.onClick || toggleMenu}
        disabled={primary?.disabled}
        className={cn(
          'w-14 h-14 rounded-full shadow-xl',
          'flex items-center justify-center',
          'transition-all duration-300 hover:scale-110 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-interactive-default focus:ring-offset-2',
          primary?.variant === 'destructive'
            ? 'bg-feedback-error text-bg-canvas hover:bg-feedback-error/90'
            : 'bg-interactive-default text-text-base hover:bg-interactive-hover',
          primary?.disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
          isOpen && 'rotate-45'
        )}
        title={primary?.label || 'Más acciones'}
      >
        {primary?.loading ? (
          <RefreshCw className="w-6 h-6 animate-spin" />
        ) : isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          primary?.icon || <Plus className="w-6 h-6" />
        )}
      </button>
    </div>
  )
}

// Hook personalizado para usar el FAB con acciones estándar de solicitud
export const useSolicitudFAB = ({
  solicitud,
  onToggleStatus,
  onEdit,
  onDownload,
  onDelete,
  onRefresh,
  isLoading = false
}) => {
  const standardActions = [
    {
      icon: <RefreshCw size={16} />,
      label: 'Actualizar',
      onClick: onRefresh,
      disabled: isLoading
    },
    {
      icon: <Edit3 size={16} />,
      label: 'Editar',
      onClick: onEdit,
      disabled: isLoading
    },
    {
      icon: <Download size={16} />,
      label: 'Descargar',
      onClick: onDownload,
      disabled: isLoading
    },
    {
      icon: <ExternalLink size={16} />,
      label: 'Ver en Historial',
      onClick: () => window.open(`/historial?solicitud=${solicitud?.id}`, '_blank'),
      disabled: isLoading
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Eliminar',
      onClick: onDelete,
      variant: 'destructive',
      disabled: isLoading
    }
  ]

  const primaryAction = {
    icon: solicitud?.activa ? <Pause size={20} /> : <Play size={20} />,
    label: solicitud?.activa ? 'Pausar' : 'Activar',
    onClick: onToggleStatus,
    disabled: isLoading,
    loading: isLoading
  }

  return {
    primary: primaryAction,
    actions: standardActions
  }
}

export default FloatingActionMenu