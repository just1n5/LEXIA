import React, { useState, useEffect } from 'react'
import { 
  Activity, 
  Clock, 
  Calendar, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import Card from '../../ui/Card'
import Badge from '../../ui/Badge'
import Button from '../../ui/Button'
import { cn } from '../../../utils/cn'

/**
 * StatusCurrent - Estado actual del proceso con próximas acciones
 */
const StatusCurrent = ({ 
  solicitud, 
  onToggleStatus, 
  isLoading = false,
  className = '' 
}) => {
  const [nextExecution, setNextExecution] = useState('')
  const [timeUntilNext, setTimeUntilNext] = useState('')

  // Calcular próxima ejecución
  useEffect(() => {
    const calculateNextExecution = () => {
      if (!solicitud?.activa) {
        setNextExecution('Pausada')
        setTimeUntilNext('')
        return
      }

      const now = new Date()
      const today7PM = new Date(now)
      today7PM.setHours(19, 0, 0, 0) // 7:00 PM

      // Si ya pasó las 7PM hoy, la próxima es mañana
      if (now > today7PM) {
        today7PM.setDate(today7PM.getDate() + 1)
      }

      const diff = today7PM - now
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (hours > 24) {
        setNextExecution('Mañana 7:00 PM')
        setTimeUntilNext('En más de 24h')
      } else if (hours > 0) {
        setNextExecution(`Hoy ${today7PM.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`)
        setTimeUntilNext(`En ${hours}h ${minutes}m`)
      } else {
        setNextExecution('Muy pronto')
        setTimeUntilNext(`En ${minutes}m`)
      }
    }

    calculateNextExecution()
    const interval = setInterval(calculateNextExecution, 60000) // Actualizar cada minuto

    return () => clearInterval(interval)
  }, [solicitud?.activa])

  const getStatusInfo = () => {
    if (!solicitud?.activa) {
      return {
        status: 'pausada',
        label: 'Pausada',
        description: 'El monitoreo está temporalmente desactivado',
        color: 'warning',
        icon: <Pause className="w-4 h-4" />,
        action: 'Reanudar'
      }
    }

    return {
      status: 'activa',
      label: 'Activa',
      description: 'Monitoreando automáticamente',
      color: 'success',
      icon: <Play className="w-4 h-4" />,
      action: 'Pausar'
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <Card size="sm" className={cn('border-l-4', {
      'border-l-feedback-success': statusInfo.status === 'activa',
      'border-l-feedback-warning': statusInfo.status === 'pausada'
    }, className)}>
      <Card.Header className="pb-sm">
        <div className="flex items-center justify-between gap-lg">
          <div className="flex items-center gap-md">
            <Activity className="w-4 h-4 text-interactive-default" />
            <Card.Title className="text-heading-h4">Estado Actual</Card.Title>
          </div>
          <Badge variant={statusInfo.color} size="sm" className="ml-lg">
            {statusInfo.icon}
            <span className="ml-1">{statusInfo.label}</span>
          </Badge>
        </div>
      </Card.Header>
      
      <Card.Content className="pt-0">
        <div className="space-y-md">
          {/* Descripción del estado */}
          <p className="text-body-paragraph text-text-secondary">
            {statusInfo.description}
          </p>

          {/* Información de próxima ejecución */}
          <div className="bg-bg-light rounded-md p-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-xs mb-xs">
                  <Clock className="w-3 h-3 text-text-secondary" />
                  <span className="text-body-auxiliary text-text-secondary">
                    Próxima ejecución
                  </span>
                </div>
                <p className="text-body-paragraph text-text-primary font-medium">
                  {nextExecution}
                </p>
                {timeUntilNext && (
                  <p className="text-body-auxiliary text-text-secondary">
                    {timeUntilNext}
                  </p>
                )}
              </div>
              
              {solicitud?.activa && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-feedback-success rounded-full animate-pulse mr-xs" />
                  <span className="text-body-auxiliary text-feedback-success">
                    Programada
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Última actividad */}
          {solicitud?.ultima_ejecucion && (
            <div className="flex items-center gap-sm text-body-auxiliary text-text-secondary">
              <CheckCircle className="w-3 h-3" />
              <span>
                Última consulta: {' '}
                {new Date(solicitud.ultima_ejecucion).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}

          {/* Acciones rápidas */}
          <div className="flex gap-sm pt-sm border-t border-border-default">
            <Button
              variant={statusInfo.status === 'activa' ? 'secondary' : 'primary'}
              size="sm"
              onClick={onToggleStatus}
              disabled={isLoading}
              icon={isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : statusInfo.icon}
            >
              {isLoading ? 'Procesando...' : statusInfo.action}
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

export default StatusCurrent