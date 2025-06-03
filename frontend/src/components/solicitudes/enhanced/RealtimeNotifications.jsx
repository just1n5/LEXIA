import React, { useState, useEffect, useRef } from 'react'
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info,
  Volume2,
  VolumeX
} from 'lucide-react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import { cn } from '../../../utils/cn'

/**
 * RealtimeNotifications - Sistema de notificaciones en tiempo real
 */
const RealtimeNotifications = ({
  solicitudId,
  onStatusChange,
  onNewExecution,
  position = 'top-right',
  maxNotifications = 5,
  autoRemoveDelay = 5000,
  soundEnabled = true,
  className = ''
}) => {
  const [notifications, setNotifications] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [soundOn, setSoundOn] = useState(soundEnabled)
  const notificationIdRef = useRef(0)
  const wsRef = useRef(null)
  const audioRef = useRef(null)

  // Efectos de sonido - usando una función simple en lugar de audio base64
  useEffect(() => {
    if (soundOn) {
      // Crear un sonido simple usando Web Audio API si está disponible
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        audioRef.current = {
          play: () => {
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()
            
            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
            
            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.1)
          }
        }
      } catch (error) {
        console.warn('Audio context no disponible:', error)
        audioRef.current = { play: () => {} } // Fallback silencioso
      }
    }
  }, [soundOn])

  // Simular conexión WebSocket
  useEffect(() => {
    if (!solicitudId) return

    // Simular conexión
    setIsConnected(true)
    
    // Simular eventos aleatorios
    const interval = setInterval(() => {
      if (Math.random() > 0.85) { // 15% probabilidad cada 5 segundos
        const eventTypes = [
          {
            type: 'execution_success',
            title: 'Ejecución exitosa',
            message: 'La consulta se completó correctamente',
            severity: 'success'
          },
          {
            type: 'execution_error',
            title: 'Error en ejecución',
            message: 'La consulta falló por timeout',
            severity: 'error'
          },
          {
            type: 'status_change',
            title: 'Estado modificado',
            message: 'La solicitud fue pausada',
            severity: 'warning'
          },
          {
            type: 'new_update',
            title: 'Nueva actualización',
            message: 'Se encontraron cambios en el proceso',
            severity: 'info'
          }
        ]
        
        const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)]
        addNotification(randomEvent)
      }
    }, 5000)

    return () => {
      clearInterval(interval)
      setIsConnected(false)
    }
  }, [solicitudId])

  // Función para añadir notificaciones
  const addNotification = (notification) => {
    const id = ++notificationIdRef.current
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification
    }

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, maxNotifications)
      return updated
    })

    // Reproducir sonido
    if (soundOn && audioRef.current) {
      try {
        audioRef.current.play()
      } catch (error) {
        // Ignore audio play errors
        console.warn('Error reproduciendo sonido:', error)
      }
    }

    // Auto-remove notification
    if (autoRemoveDelay > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, autoRemoveDelay)
    }

    // Llamar callbacks
    if (notification.type === 'status_change') {
      onStatusChange?.(notification)
    } else if (notification.type.includes('execution')) {
      onNewExecution?.(notification)
    }
  }

  // Función para remover notificaciones
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Limpiar todas las notificaciones
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Configuración de posición
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-6 left-6'
      case 'top-right':
      default:
        return 'top-6 right-6'
      case 'bottom-left':
        return 'bottom-6 left-6'
      case 'bottom-right':
        return 'bottom-6 right-6'
    }
  }

  // Configuración de iconos y colores por severidad
  const getSeverityConfig = (severity) => {
    const configs = {
      success: {
        icon: <CheckCircle className="w-5 h-5" />,
        bgColor: 'bg-feedback-success/10',
        borderColor: 'border-feedback-success/20',
        textColor: 'text-feedback-success',
        iconBg: 'bg-feedback-success'
      },
      error: {
        icon: <XCircle className="w-5 h-5" />,
        bgColor: 'bg-feedback-error/10',
        borderColor: 'border-feedback-error/20',
        textColor: 'text-feedback-error',
        iconBg: 'bg-feedback-error'
      },
      warning: {
        icon: <AlertTriangle className="w-5 h-5" />,
        bgColor: 'bg-feedback-warning/10',
        borderColor: 'border-feedback-warning/20',
        textColor: 'text-feedback-warning',
        iconBg: 'bg-feedback-warning'
      },
      info: {
        icon: <Info className="w-5 h-5" />,
        bgColor: 'bg-feedback-info/10',
        borderColor: 'border-feedback-info/20',
        textColor: 'text-feedback-info',
        iconBg: 'bg-feedback-info'
      }
    }
    return configs[severity] || configs.info
  }

  // Formatear tiempo relativo
  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'ahora'
    if (minutes < 60) return `hace ${minutes}m`
    return timestamp.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Indicador de conexión flotante */}
      <div className={cn(
        'fixed z-50 transition-all duration-300',
        getPositionClasses(),
        className
      )}>
        {/* Control de notificaciones */}
        <div className="flex items-center gap-sm mb-md">
          {/* Indicador de conexión */}
          <div className={cn(
            'flex items-center gap-xs px-sm py-xs rounded-md text-body-auxiliary',
            isConnected 
              ? 'bg-feedback-success/10 text-feedback-success'
              : 'bg-feedback-error/10 text-feedback-error'
          )}>
            <div className={cn(
              'w-2 h-2 rounded-full',
              isConnected ? 'bg-feedback-success animate-pulse' : 'bg-feedback-error'
            )} />
            <span className="text-xs font-medium">
              {isConnected ? 'EN VIVO' : 'DESCONECTADO'}
            </span>
          </div>
          
          {/* Controles */}
          <div className="flex gap-xs">
            {/* Toggle sonido */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundOn(!soundOn)}
              className="w-8 h-8 p-0"
              title={soundOn ? 'Desactivar sonido' : 'Activar sonido'}
            >
              {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </Button>
            
            {/* Limpiar notificaciones */}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="w-8 h-8 p-0"
                title="Limpiar notificaciones"
              >
                <X size={14} />
              </Button>
            )}
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="space-y-sm w-80 max-w-sm">
          {notifications.map((notification, index) => {
            const config = getSeverityConfig(notification.severity)
            
            return (
              <Card
                key={notification.id}
                size="sm"
                className={cn(
                  'transition-all duration-300 hover:shadow-lg',
                  'animate-in slide-in-from-top-2 fade-in-0',
                  config.bgColor,
                  config.borderColor,
                  'border-l-4'
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <Card.Content className="p-md">
                  <div className="flex items-start gap-sm">
                    {/* Icono */}
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      config.iconBg,
                      'text-white'
                    )}>
                      {config.icon}
                    </div>
                    
                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-sm">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-body-paragraph font-medium text-text-primary truncate">
                            {notification.title}
                          </h4>
                          <p className="text-body-auxiliary text-text-secondary mt-xs">
                            {notification.message}
                          </p>
                        </div>
                        
                        {/* Botón cerrar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="w-6 h-6 p-0 flex-shrink-0"
                        >
                          <X size={12} />
                        </Button>
                      </div>
                      
                      {/* Timestamp */}
                      <div className="flex items-center justify-between mt-sm">
                        <span className="text-xs text-text-secondary">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        
                        {/* Tipo de evento */}
                        <span className={cn(
                          'text-xs px-xs py-xs rounded uppercase tracking-wide font-medium',
                          config.textColor,
                          config.bgColor
                        )}>
                          {notification.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            )
          })}
        </div>
        
        {/* Estado vacío */}
        {notifications.length === 0 && isConnected && (
          <Card size="sm" className="w-80 max-w-sm">
            <Card.Content className="p-md text-center">
              <Bell className="w-8 h-8 text-text-secondary mx-auto mb-sm" />
              <p className="text-body-auxiliary text-text-secondary">
                Esperando notificaciones...
              </p>
            </Card.Content>
          </Card>
        )}
      </div>
    </>
  )
}

/**
 * Hook para usar notificaciones desde componentes
 */
export const useRealtimeNotifications = () => {
  const [notifications, setNotifications] = useState([])
  
  const addNotification = (notification) => {
    const id = Date.now()
    setNotifications(prev => [{ id, ...notification }, ...prev].slice(0, 10))
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }
  
  return {
    notifications,
    addNotification
  }
}

export default RealtimeNotifications