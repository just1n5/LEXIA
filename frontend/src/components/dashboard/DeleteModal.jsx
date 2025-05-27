import React from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

function DeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  solicitud, 
  isLoading = false 
}) {
  const handleConfirm = () => {
    onConfirm(solicitud.id)
  }

  const footer = (
    <>
      <Button 
        variant="secondary" 
        onClick={onClose}
        disabled={isLoading}
      >
        Cancelar
      </Button>
      <Button 
        variant="destructive" 
        onClick={handleConfirm}
        loading={isLoading}
        disabled={isLoading}
      >
        Eliminar
      </Button>
    </>
  )

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Confirmar Eliminación"
      footer={footer}
    >
      <p>
        ¿Estás seguro de que deseas eliminar la solicitud 
        <strong> "{solicitud?.alias}"</strong>? 
        Esta acción no se puede deshacer.
      </p>
      
      {solicitud?.activa && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            <strong>Nota:</strong> Esta solicitud está activa y se detendrán todas las consultas automáticas.
          </p>
        </div>
      )}
    </Modal>
  )
}

export default DeleteModal
