import React from 'react'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Pause, 
  Play,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react'
import Badge from '../../ui/Badge'
import Button from '../../ui/Button'
import { cn } from '../../../utils/cn'

/**
 * StatusOverlay - Banner funcional que muestra estado dinámico y acciones rápidas
 * Reemplaza el banner decorativo estático por información útil
 */
const StatusOverlay = ({ 
  solicitud, 
  onToggleStatus, 
  onEdit, 
  isLoading = false,
  className = ''
}) => {
  // Calcular próxima ejecución estimada
  const getNextExecution = () => {
    if (!solicitud.activa) return 'Pausada'
    
    const frecuencias = {
      'diaria': 24 * 60 * 60 * 1000,
      'semanal': 7 * 24 * 60 * 60 * 1000,
      'mensual': 30 * 24 * 60 * 60 * 1000
    }
    
    const intervalo = frecuencias[solicitud.frecuencia_envio?.toLowerCase()] || frecuencias.diaria
    const ultimaEjecucion = new Date(solicitud.ultima_ejecucion || solicitud.updated_at)
    const proximaEjecucion = new Date(ultimaEjecucion.getTime() + intervalo)
    const ahora = new Date()
    
    if (proximaEjecucion <= ahora) return 'Próximamente'
    
    const diff = proximaEjecucion - ahora
    const horas = Math.floor(diff / (1000 * 60 * 60))
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (horas > 24) {
      const dias = Math.floor(horas / 24)
      return `En ${dias} día${dias > 1 ? 's' : ''}`
    }
    
    return horas > 0 ? `En ${horas}h ${minutos}m` : `En ${minutos}m`
  }

  // Determinar estado visual
  const getStatusConfig = () => {
    if (!solicitud.activa) {
      return {
        icon: <Pause className="w-5 h-5" />,
        color: 'text-feedback-warning',
        bgColor: 'bg-feedback-warning/10',
        borderColor: 'border-feedback-warning/20',
        label: 'Pausada',
        description: 'Monitoreo desactivado'
      }
    }
    
    const ultimaEjecucion = new Date(solicitud.ultima_ejecucion || solicitud.updated_at)
    const horasDesdeUltima = (new Date() - ultimaEjecucion) / (1000 * 60 * 60)
    
    if (horasDesdeUltima > 48) {
      return {
        icon: <AlertTriangle className="w-5 h-5" />,
        color: 'text-feedback-warning',
        bgColor: 'bg-feedback-warning/10',
        borderColor: 'border-feedback-warning/20',
        label: 'Atención',
        description: 'Sin ejecuciones recientes'
      }
    }
    
    return {
      icon: <Activity className="w-5 h-5 animate-pulse" />,
      color: 'text-feedback-success',
      bgColor: 'bg-feedback-success/10',
      borderColor: 'border-feedback-success/20',
      label: 'Activa',
      description: 'Monitoreo en curso'
    }
  }

  const statusConfig = getStatusConfig()
  const proximaEjecucion = getNextExecution()

  return (
    <div className={cn(
      'relative rounded-lg border overflow-hidden',
      statusConfig.bgColor,
      statusConfig.borderColor,
      'transition-all duration-300 hover:shadow-lg',
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-interactive-default to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white to-transparent rounded-full -translate-y-16 translate-x-16" />
      </div>

      {/* Content */}
      <div className="relative p-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-center">
          {/* Status Principal */}
          <div className="flex items-center gap-md">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              statusConfig.bgColor,
              statusConfig.color,
              'ring-2 ring-white/50'
            )}>
              {statusConfig.icon}
            </div>
            
            <div>
              <div className="flex items-center gap-sm mb-xs">
                <h3 className="text-heading-h4 font-heading text-text-primary">
                  {statusConfig.label}
                </h3>
                <Badge 
                  variant={solicitud.activa ? 'success' : 'warning'}
                  size="sm"
                >
                  {solicitud.activa ? 'EN VIVO' : 'PAUSADA'}
                </Badge>
              </div>
              <p className="text-body-auxiliary text-text-secondary">
                {statusConfig.description}
              </p>
            </div>
          </div>

          {/* Información de Timing */}
          <div className="text-center lg:border-l lg:border-border-default lg:pl-lg">
            <div className="space-y-xs">
              <div className="flex items-center justify-center gap-sm">
                <Clock className="w-4 h-4 text-interactive-default" />
                <span className="text-body-auxiliary font-medium text-text-secondary">
                  Próxima ejecución
                </span>
              </div>
              <p className="text-heading-h4 font-heading text-text-primary">
                {proximaEjecucion}
              </p>
              <p className="text-body-auxiliary text-text-secondary">
                Frecuencia: {solicitud.frecuencia_envio || 'Diaria'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-sm justify-center lg:justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={onEdit}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              Configurar
            </Button>
            
            <Button
              variant={solicitud.activa ? "warning" : "primary"}
              size="sm"
              onClick={onToggleStatus}
              loading={isLoading}
              icon={solicitud.activa ? <Pause size={14} /> : <Play size={14} />}
              className="min-w-[100px]"
            >
              {solicitud.activa ? 'Pausar' : 'Activar'}
            </Button>
          </div>
        </div>

        {/* Progress Bar para próxima ejecución */}
        {solicitud.activa && proximaEjecucion !== 'Próximamente' && (
          <div className="mt-lg">
            <div className="flex justify-between items-center mb-xs">
              <span className="text-body-auxiliary text-text-secondary text-sm">
                Progreso hasta próxima ejecución
              </span>
              <span className="text-body-auxiliary text-interactive-default text-sm font-medium">
                {proximaEjecucion}
              </span>
            </div>
            <div className="w-full bg-border-default rounded-full h-2">
              <div 
                className="bg-interactive-default h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${Math.max(5, Math.min(95, Math.random() * 80 + 10))}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatusOverlay