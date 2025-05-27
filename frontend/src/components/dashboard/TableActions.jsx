import React from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

function TableActions({ 
  solicitud, 
  onEdit, 
  onDelete, 
  onView,
  disabled = false 
}) {
  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit(solicitud)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(solicitud)
  }

  const handleView = (e) => {
    e.stopPropagation()
    if (onView) {
      onView(solicitud)
    }
  }

  return (
    <div className="table-actions">
      {/* Ver detalles */}
      {onView ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleView}
          disabled={disabled}
          title="Ver detalles"
          className="btn-with-icon"
        >
          <Eye size={16} />
        </Button>
      ) : (
        <Button
          as={Link}
          to={`/solicitudes/${solicitud.id}`}
          variant="ghost"
          size="sm"
          disabled={disabled}
          title="Ver detalles"
          className="btn-with-icon"
        >
          <Eye size={16} />
        </Button>
      )}

      {/* Editar */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        disabled={disabled}
        title="Editar solicitud"
        className="btn-with-icon"
      >
        <Edit size={16} />
      </Button>

      {/* Eliminar */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={disabled}
        title="Eliminar solicitud"
        className="btn-with-icon"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  )
}

export default TableActions
