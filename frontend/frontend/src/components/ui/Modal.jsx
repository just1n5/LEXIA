import React from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from './Button'

function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  className = '',
  ...props 
}) {
  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={cn('modal', className)} {...props}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// Modal de confirmación de eliminación
function DeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar Eliminación",
  message = "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.",
  confirmText = "Eliminar",
  cancelText = "Cancelar"
}) {
  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        {cancelText}
      </Button>
      <Button variant="destructive" onClick={onConfirm}>
        {confirmText}
      </Button>
    </>
  )

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
      footer={footer}
    >
      <p>{message}</p>
    </Modal>
  )
}

Modal.Delete = DeleteModal

export default Modal
