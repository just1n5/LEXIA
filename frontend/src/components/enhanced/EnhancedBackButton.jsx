import React, { useState, useEffect } from 'react'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { 
  ArrowLeft, 
  AlertCircle, 
  X, 
  Save,
  RotateCcw,
  ChevronLeft,
  Home
} from 'lucide-react'

/**
 * 🔙 EnhancedBackButton - Botón de Volver Inteligente
 * 
 * Características avanzadas:
 * - Detección de cambios no guardados
 * - Confirmación inteligente cuando hay cambios
 * - Estados visuales mejorados
 * - Animaciones sutiles
 * - Tooltips contextuales
 * - Opciones de navegación rápida
 */
const EnhancedBackButton = ({
  // Propiedades básicas
  onClick,
  disabled = false,
  loading = false,
  className = '',
  
  // Detección de cambios
  hasUnsavedChanges = false,
  originalData = {},
  currentData = {},
  
  // Configuración de comportamiento
  showConfirmation = true,
  confirmationTitle = "¿Salir sin guardar?",
  confirmationMessage = "Tienes cambios sin guardar que se perderán si sales ahora.",
  
  // Opciones de navegación
  showQuickActions = true,
  quickActions = [],
  
  // Personalización
  variant = "secondary",
  size = "md",
  showTooltip = true,
  
  // Callbacks adicionales
  onSaveAndExit,
  onDiscardChanges,
  
  // Texto personalizable
  text = "Volver",
  loadingText = "Procesando...",
  
  ...props
}) => {
  const [showModal, setShowModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [changesDetected, setChangesDetected] = useState(false)

  // Detectar cambios automáticamente
  useEffect(() => {
    if (hasUnsavedChanges) {
      setChangesDetected(true)
      return
    }

    // Detección automática comparando objetos
    if (originalData && currentData) {
      const hasChanges = JSON.stringify(originalData) !== JSON.stringify(currentData)
      setChangesDetected(hasChanges)
    }
  }, [hasUnsavedChanges, originalData, currentData])

  // Manejar click del botón
  const handleClick = () => {
    if (disabled || loading) return

    // Si hay cambios y confirmación está habilitada, mostrar modal
    if (changesDetected && showConfirmation) {
      setShowModal(true)
      return
    }

    // Ejecutar acción directamente
    onClick?.()
  }

  // Confirmar salida sin guardar
  const handleConfirmExit = () => {
    setShowModal(false)
    onDiscardChanges?.()
    onClick?.()
  }

  // Guardar y salir
  const handleSaveAndExit = async () => {
    if (onSaveAndExit) {
      try {
        await onSaveAndExit()
        setShowModal(false)
        onClick?.()
      } catch (error) {
        console.error('Error al guardar:', error)
        // Modal permanece abierto si hay error
      }
    }
  }

  // Cancelar modal
  const handleCancelModal = () => {
    setShowModal(false)
  }

  // Clases dinámicas basadas en estado
  const buttonClasses = cn(
    // Transiciones suaves
    'transition-all duration-200 ease-in-out',
    
    // Estados de hover mejorados
    !disabled && !loading && [
      'hover:scale-[1.02]',
      'hover:shadow-sm',
      changesDetected && 'hover:border-feedback-warning'
    ],
    
    // Indicador visual de cambios
    changesDetected && !disabled && [
      'relative',
      'before:absolute before:top-0 before:right-0',
      'before:w-2 before:h-2 before:bg-feedback-warning',
      'before:rounded-full before:transform before:translate-x-1 before:-translate-y-1',
      'before:animate-pulse'
    ],
    
    className
  )

  // Icono dinámico basado en estado
  const renderIcon = () => {
    if (loading) {
      return <RotateCcw className="w-4 h-4 animate-spin" />
    }
    
    if (changesDetected) {
      return <ChevronLeft className="w-4 h-4" />
    }
    
    return <ArrowLeft className="w-4 h-4" />
  }

  // Tooltip dinámico
  const getTooltipText = () => {
    if (disabled) return "No disponible"
    if (loading) return loadingText
    if (changesDetected) return "Hay cambios sin guardar. Click para confirmar salida"
    return "Regresar a la página anterior"
  }

  // Acciones rápidas por defecto
  const defaultQuickActions = [
    {
      id: 'home',
      label: 'Ir al inicio',
      icon: Home,
      action: () => {
        setShowModal(false)
        onClick?.({ action: 'home' })
      }
    }
  ]

  const actionsToShow = quickActions.length > 0 ? quickActions : defaultQuickActions

  return (
    <>
      {/* Botón principal */}
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Button
          type="button"
          variant={variant}
          size={size}
          onClick={handleClick}
          disabled={disabled || loading}
          className={buttonClasses}
          {...props}
        >
          <div className="flex items-center gap-sm">
            {renderIcon()}
            <span className={cn(
              'transition-colors duration-200',
              changesDetected && 'text-feedback-warning'
            )}>
              {loading ? loadingText : text}
            </span>
          </div>
        </Button>

        {/* Tooltip mejorado */}
        {showTooltip && isHovered && !showModal && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
            <div className="bg-text-primary text-bg-canvas px-sm py-xs rounded-md text-body-auxiliary whitespace-nowrap shadow-lg">
              {getTooltipText()}
              {/* Flecha del tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-text-primary"></div>
            </div>
          </div>
        )}

        {/* Indicador de cambios */}
        {changesDetected && !loading && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-feedback-warning rounded-full border-2 border-bg-canvas animate-pulse"></div>
        )}
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleCancelModal}
          className="max-w-md"
        >
          <Modal.Header>
            <Modal.Title className="flex items-center gap-sm text-feedback-warning">
              <AlertCircle className="w-5 h-5" />
              {confirmationTitle}
            </Modal.Title>
          </Modal.Header>

          <Modal.Content>
            <div className="space-y-md">
              {/* Mensaje principal */}
              <p className="text-body-paragraph text-text-base">
                {confirmationMessage}
              </p>

              {/* Lista de cambios detectados */}
              {originalData && currentData && (
                <div className="bg-feedback-warning-light border border-feedback-warning rounded-md p-sm">
                  <h4 className="text-body-paragraph font-medium text-feedback-warning mb-xs">
                    Cambios detectados:
                  </h4>
                  <ul className="text-body-auxiliary text-feedback-warning space-y-xs">
                    {Object.keys(currentData).map(key => {
                      if (currentData[key] !== originalData[key] && currentData[key]) {
                        return (
                          <li key={key} className="flex items-center gap-xs">
                            <span className="w-1.5 h-1.5 bg-feedback-warning rounded-full"></span>
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                          </li>
                        )
                      }
                      return null
                    })}
                  </ul>
                </div>
              )}

              {/* Acciones rápidas */}
              {showQuickActions && actionsToShow.length > 0 && (
                <div className="border-t border-border-default pt-md">
                  <p className="text-body-auxiliary text-text-secondary mb-sm">
                    O ir directamente a:
                  </p>
                  <div className="flex flex-wrap gap-xs">
                    {actionsToShow.map(action => (
                      <Button
                        key={action.id}
                        variant="ghost"
                        size="sm"
                        onClick={action.action}
                        className="text-text-secondary hover:text-interactive-default"
                      >
                        <action.icon className="w-4 h-4 mr-xs" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal.Content>

          <Modal.Footer>
            <div className="flex flex-col sm:flex-row gap-sm justify-end">
              {/* Botón cancelar */}
              <Button
                variant="secondary"
                onClick={handleCancelModal}
                className="order-3 sm:order-1"
              >
                <X className="w-4 h-4 mr-xs" />
                Continuar editando
              </Button>

              {/* Botón guardar y salir */}
              {onSaveAndExit && (
                <Button
                  variant="primary"
                  onClick={handleSaveAndExit}
                  className="order-1 sm:order-2"
                >
                  <Save className="w-4 h-4 mr-xs" />
                  Guardar y salir
                </Button>
              )}

              {/* Botón salir sin guardar */}
              <Button
                variant="destructive"
                onClick={handleConfirmExit}
                className="order-2 sm:order-3"
              >
                <ArrowLeft className="w-4 h-4 mr-xs" />
                Salir sin guardar
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

export default EnhancedBackButton