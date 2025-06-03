import React from 'react'
import { Edit3, Download, Play, Pause } from 'lucide-react'
import Button from '../ui/Button'

/**
 * QuickActions - Componente para las acciones rápidas de una solicitud
 * Agrupa las acciones principales de forma consistente
 */
const QuickActions = ({ 
  solicitud,
  onEdit,
  onToggleStatus,
  onDownload,
  actionLoading = false,
  className = ""
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-sm ${className}`}>
      <Button
        variant="secondary"
        onClick={onEdit}
        icon={<Edit3 size={16} />}
        disabled={actionLoading}
        className="transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <span className="hidden sm:inline">Editar</span>
        <span className="sm:hidden">Editar</span>
      </Button>
      
      <Button
        variant={solicitud?.activa ? "warning" : "primary"}
        onClick={onToggleStatus}
        icon={solicitud?.activa ? <Pause size={16} /> : <Play size={16} />}
        loading={actionLoading}
        disabled={actionLoading}
        className="transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <span className="hidden sm:inline">
          {solicitud?.activa ? 'Pausar' : 'Activar'}
        </span>
        <span className="sm:hidden">
          {solicitud?.activa ? 'Pausar' : 'Activar'}
        </span>
      </Button>
      
      <Button
        variant="ghost"
        onClick={onDownload}
        icon={<Download size={16} />}
        disabled={actionLoading}
        className="transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <span className="hidden sm:inline">Exportar</span>
        <span className="sm:hidden">Exportar</span>
      </Button>
    </div>
  )
}

export default QuickActions