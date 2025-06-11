import React, { useEffect } from 'react'
import { cn } from '../../utils/cn'
import { X } from 'lucide-react'

/**
 * 🏗️ Modal Component - Sistema de Modales
 * 
 * Modal accesible que sigue los principios del design system:
 * - Overlay responsivo
 * - Gestión de focus
 * - Escape key support
 * - Scroll lock en body
 * - Animaciones suaves
 */
const Modal = ({
  isOpen = false,
  onClose,
  children,
  className = '',
  overlayClassName = '',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size = 'md',
  ...props
}) => {
  // Manejar tecla Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Bloquear scroll del body cuando modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Gestionar click en overlay
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.()
    }
  }

  // No renderizar si no está abierto
  if (!isOpen) return null

  // Tamaños de modal
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    full: 'max-w-full mx-md'
  }

  return (
    <div
      className={cn(
        // Base overlay
        'fixed inset-0 z-50',
        // Backdrop
        'bg-text-primary bg-opacity-50 backdrop-blur-sm',
        // Flexbox centering
        'flex items-center justify-center',
        // Padding para mobile
        'p-md',
        // Animación de entrada
        'animate-in fade-in duration-200',
        overlayClassName
      )}
      onClick={handleOverlayClick}
      {...props}
    >
      <div
        className={cn(
          // Base modal
          'relative bg-bg-canvas rounded-lg shadow-2xl',
          // Border sutil
          'border border-border-default',
          // Tamaño responsivo
          'w-full',
          sizeClasses[size],
          // Altura máxima
          'max-h-[90vh] overflow-y-auto',
          // Animación de entrada
          'animate-in slide-in-from-bottom-4 duration-200',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className={cn(
              'absolute top-md right-md z-10',
              'w-8 h-8 flex items-center justify-center',
              'text-text-secondary hover:text-text-primary',
              'hover:bg-bg-light rounded-md',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-interactive-default'
            )}
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {children}
      </div>
    </div>
  )
}

// Subcomponentes para mejor organización
const ModalHeader = ({ children, className = '', ...props }) => (
  <div
    className={cn(
      'px-lg pt-lg pb-md',
      'border-b border-border-default',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

const ModalTitle = ({ children, className = '', ...props }) => (
  <h2
    className={cn(
      'text-heading-h2 font-heading text-text-primary',
      'pr-8', // Espacio para botón cerrar
      className
    )}
    {...props}
  >
    {children}
  </h2>
)

const ModalContent = ({ children, className = '', ...props }) => (
  <div
    className={cn(
      'px-lg py-md',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

const ModalFooter = ({ children, className = '', ...props }) => (
  <div
    className={cn(
      'px-lg pb-lg pt-md',
      'border-t border-border-default',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

// Asignar subcomponentes
Modal.Header = ModalHeader
Modal.Title = ModalTitle
Modal.Content = ModalContent
Modal.Footer = ModalFooter

export default Modal