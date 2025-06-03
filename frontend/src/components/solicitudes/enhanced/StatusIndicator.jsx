import React, { useState, useEffect } from 'react'
import { 
  Wifi, 
  WifiOff, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Activity,
  Zap
} from 'lucide-react'
import Badge from '../../ui/Badge'
import { cn } from '../../../utils/cn'

/**
 * StatusIndicator - Indicadores de estado en tiempo real
 * Muestra información actualizada y reduce la necesidad de refresh manual
 */
const StatusIndicator = ({
  status,
  lastUpdate,
  nextExecution,
  isLive = false,
  solicitudId,
  className = ''
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastPing, setLastPing] = useState(new Date())
  const [connectionStatus, setConnectionStatus] = useState('connected')

  // Monitorear conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setConnectionStatus('connected')
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      setConnectionStatus('offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Simular ping periódico para verificar conectividad
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setLastPing(new Date())
      
      // Simular verificación de estado del servidor
      if (Math.random() > 0.95) {
        setConnectionStatus('unstable')
        setTimeout(() => setConnectionStatus('connected'), 2000)
      }
    }, 30000) // Ping cada 30 segundos

    return () => clearInterval(interval)
  }, [isLive])

  // Formatear tiempo relativo
  const formatTimeAgo = (date) => {
    if (!date) return 'N/A'
    
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`
    if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
    if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
    return 'hace un momento'
  }

  // Obtener configuración de estado
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'activa':
        return {
          icon: <Activity className="w-4 h-4" />,
          color: 'text-feedback-success',
          bgColor: 'bg-feedback-success/10',
          label: 'Activa',
          pulse: true
        }
      case 'pausada':
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'text-feedback-warning',
          bgColor: 'bg-feedback-warning/10',
          label: 'Pausada',
          pulse: false
        }
      case 'error':
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: 'text-feedback-error',
          bgColor: 'bg-feedback-error/10',
          label: 'Error',
          pulse: false
        }
      default:
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          color: 'text-text-secondary',
          bgColor: 'bg-bg-light',
          label: 'Desconocido',
          pulse: false
        }
    }
  }

  // Obtener configuración de conexión
  const getConnectionConfig = () => {
    if (!isOnline) {
      return {
        icon: <WifiOff className="w-4 h-4" />,
        color: 'text-feedback-error',
        label: 'Sin conexión',
        description: 'Verificando conexión...'
      }
    }

    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <Wifi className="w-4 h-4" />,
          color: 'text-feedback-success',
          label: 'Conectado',
          description: `Última verificación: ${formatTimeAgo(lastPing)}`
        }
      case 'unstable':
        return {
          icon: <Wifi className="w-4 h-4 animate-pulse" />,
          color: 'text-feedback-warning',
          label: 'Conexión inestable',
          description: 'Reconectando...'
        }
      default:
        return {
          icon: <Wifi className="w-4 h-4" />,
          color: 'text-text-secondary',
          label: 'Desconocido',
          description: 'Verificando estado...'
        }
    }
  }

  const statusConfig = getStatusConfig()
  const connectionConfig = getConnectionConfig()

  return (
    <div className={cn(
      'flex items-center justify-between p-md rounded-lg border',
      'bg-bg-canvas border-border-default',
      'transition-all duration-300',
      className
    )}>
      {/* Estado Principal */}
      <div className="flex items-center gap-md">
        {/* Indicador de Estado */}
        <div className={cn(
          'flex items-center gap-sm px-sm py-xs rounded-md',
          statusConfig.bgColor
        )}>
          <div className={cn(
            statusConfig.color,
            statusConfig.pulse && 'animate-pulse'
          )}>
            {statusConfig.icon}
          </div>
          <span className={cn(
            'text-body-auxiliary font-medium',
            statusConfig.color
          )}>
            {statusConfig.label}
          </span>
        </div>

        {/* Información Temporal */}
        <div className="text-body-auxiliary text-text-secondary">
          {lastUpdate && (
            <div className="flex items-center gap-xs">
              <Clock className="w-3 h-3" />
              <span>Actualizado {formatTimeAgo(lastUpdate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Estado de Conexión y Live Indicator */}
      <div className="flex items-center gap-md">
        {/* Próxima Ejecución */}
        {nextExecution && status === 'activa' && (
          <div className="text-right">
            <div className="text-body-auxiliary text-text-secondary text-sm">
              Próxima ejecución
            </div>
            <div className="text-body-paragraph font-medium text-text-primary">
              {nextExecution}
            </div>
          </div>
        )}

        {/* Indicador Live */}
        {isLive && (
          <div className="flex items-center gap-xs">
            <div className={cn(
              'flex items-center gap-xs px-sm py-xs rounded-md',
              isOnline ? 'bg-feedback-success/10' : 'bg-feedback-error/10'
            )}>
              <div className={connectionConfig.color}>
                {connectionConfig.icon}
              </div>
              <span className={cn(
                'text-body-auxiliary font-medium',
                connectionConfig.color
              )}>
                {isOnline ? 'EN VIVO' : 'OFFLINE'}
              </span>
            </div>
          </div>
        )}

        {/* Badge de Estado Adicional */}
        <Badge 
          variant={
            status === 'activa' ? 'success' : 
            status === 'pausada' ? 'warning' : 
            status === 'error' ? 'error' : 'info'
          }
          size="sm"
          className="min-w-[80px] justify-center"
        >
          {statusConfig.label.toUpperCase()}
        </Badge>
      </div>
    </div>
  )
}

// Componente compacto para usar en otras partes
export const StatusDot = ({ 
  status, 
  size = 'sm', 
  showLabel = false,
  className = '' 
}) => {
  const statusConfig = {
    'activa': { color: 'bg-feedback-success', label: 'Activa' },
    'pausada': { color: 'bg-feedback-warning', label: 'Pausada' },
    'error': { color: 'bg-feedback-error', label: 'Error' },
    'completada': { color: 'bg-feedback-info', label: 'Completada' }
  }

  const config = statusConfig[status?.toLowerCase()] || statusConfig.error
  const sizeClasses = {
    'xs': 'w-2 h-2',
    'sm': 'w-3 h-3', 
    'md': 'w-4 h-4',
    'lg': 'w-5 h-5'
  }

  return (
    <div className={cn('flex items-center gap-xs', className)}>
      <div className={cn(
        'rounded-full',
        sizeClasses[size],
        config.color,
        status === 'activa' && 'animate-pulse'
      )} />
      {showLabel && (
        <span className="text-body-auxiliary text-text-secondary">
          {config.label}
        </span>
      )}
    </div>
  )
}

export default StatusIndicator