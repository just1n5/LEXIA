// src/components/notifications/NotificationModal.jsx
import React, { useEffect, useRef } from 'react'
import { 
  X, Bell, CheckCircle, AlertTriangle, Clock, 
  FileText, Eye, Trash2, CheckCheck, Settings 
} from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Portal from '../ui/Portal'

/**
 * 🔔 Modal de Notificaciones - ConsultaJudicial RPA
 * 
 * Modal que muestra las notificaciones del usuario siguiendo el design system.
 * Incluye notificaciones de consultas, actualizaciones de estado y acciones del sistema.
 * 
 * Usa Portal para renderizar fuera de la jerarquía del header y cubrir toda la página.
 */

const NotificationModal = ({ 
  isOpen, 
  onClose, 
  className = '',
  ...props 
}) => {
  const modalRef = useRef(null)
  const firstFocusableRef = useRef(null)

  // ===== DATOS DE NOTIFICACIONES REALISTAS =====
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Nueva actualización encontrada',
      message: 'Se encontraron 2 actualizaciones en "Consulta proceso Juan Pérez vs Banco Nacional"',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
      read: false,
      actionUrl: '/solicitudes/1',
      actionText: 'Ver detalles',
      icon: CheckCircle,
      priority: 'high'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Captcha requerido',
      message: 'La consulta "Seguimiento demanda laboral - María García" requiere resolución de captcha',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      read: false,
      actionUrl: '/solicitudes/2',
      actionText: 'Resolver captcha',
      icon: AlertTriangle,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'info',
      title: 'Consulta ejecutada',
      message: 'Se completó la consulta automática para "Proceso comercial ABC S.A.S"',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
      read: true,
      actionUrl: '/solicitudes/3',
      actionText: 'Ver resultados',
      icon: FileText,
      priority: 'low'
    },
    {
      id: 4,
      type: 'error',
      title: 'Error en consulta',
      message: 'Fallo en la conexión para "Embargo vehicular - Resolución administrativa"',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
      read: true,
      actionUrl: '/solicitudes/5',
      actionText: 'Reintentar',
      icon: AlertTriangle,
      priority: 'high'
    },
    {
      id: 5,
      type: 'info',
      title: 'Recordatorio semanal',
      message: 'Tienes 3 solicitudes programadas para ejecutar esta semana',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
      read: true,
      actionUrl: '/dashboard',
      actionText: 'Ver dashboard',
      icon: Clock,
      priority: 'low'
    }
  ]

  // ===== UTILIDADES =====
  
  const getNotificationConfig = (type) => {
    const configs = {
      success: {
        bgColor: 'bg-feedback-success-light',
        borderColor: 'border-feedback-success',
        iconColor: 'text-feedback-success',
        badge: 'success'
      },
      warning: {
        bgColor: 'bg-feedback-warning-light',
        borderColor: 'border-feedback-warning',
        iconColor: 'text-feedback-warning',
        badge: 'warning'
      },
      error: {
        bgColor: 'bg-feedback-error-light',
        borderColor: 'border-feedback-error',
        iconColor: 'text-feedback-error',
        badge: 'error'
      },
      info: {
        bgColor: 'bg-feedback-info-light',
        borderColor: 'border-feedback-info',
        iconColor: 'text-feedback-info',
        badge: 'info'
      }
    }
    return configs[type] || configs.info
  }

  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `Hace ${minutes} min`
    } else if (hours < 24) {
      return `Hace ${hours}h`
    } else {
      return `Hace ${days} día${days > 1 ? 's' : ''}`
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  // ===== EFECTOS =====

  // Gestión de focus y escape
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    // Focus en primer elemento
    setTimeout(() => {
      firstFocusableRef.current?.focus()
    }, 100)

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // ===== HANDLERS =====

  const handleNotificationClick = (notification) => {
    console.log('Navegando a:', notification.actionUrl)
    // Aquí iría la navegación real
    onClose()
  }

  const handleMarkAllAsRead = () => {
    console.log('Marcando todas como leídas')
    // Aquí iría la lógica para marcar como leídas
  }

  const handleClearAll = () => {
    console.log('Limpiando todas las notificaciones')
    // Aquí iría la lógica para limpiar
  }

  if (!isOpen) return null

  return (
    <Portal>
      {/* Overlay que cubre TODA la página gracias al Portal */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999] transition-opacity"
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-modal-title"
        {...props}
      >
        <div 
          ref={modalRef}
          className={cn(
            'bg-bg-canvas rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col',
            'border border-border-default',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-default">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-interactive-default rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 
                  id="notification-modal-title"
                  className="text-heading-h3 font-heading text-text-primary"
                >
                  Notificaciones
                </h2>
                {unreadCount > 0 && (
                  <p className="text-body-auxiliary text-text-secondary">
                    {unreadCount} sin leer
                  </p>
                )}
              </div>
            </div>
            
            <button
              ref={firstFocusableRef}
              onClick={onClose}
              className="p-2 hover:bg-bg-light rounded-md transition-colors"
              aria-label="Cerrar notificaciones"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Actions Bar */}
          {unreadCount > 0 && (
            <div className="px-6 py-3 border-b border-border-default bg-bg-light">
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  icon={<CheckCheck className="w-4 h-4" />}
                >
                  Marcar todas como leídas
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Limpiar
                </Button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-bg-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-text-secondary" />
                </div>
                <h3 className="text-heading-h4 font-heading text-text-primary mb-2">
                  No hay notificaciones
                </h3>
                <p className="text-body-auxiliary text-text-secondary">
                  Recibirás notificaciones sobre el estado de tus consultas aquí.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border-default">
                {notifications.map((notification) => {
                  const config = getNotificationConfig(notification.type)
                  const IconComponent = notification.icon

                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 hover:bg-bg-light transition-colors cursor-pointer relative',
                        !notification.read && 'bg-blue-50'
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {/* Indicador de no leído */}
                      {!notification.read && (
                        <div className="absolute left-2 top-6 w-2 h-2 bg-interactive-default rounded-full" />
                      )}

                      <div className="flex gap-3 ml-2">
                        {/* Icono */}
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1',
                          config.bgColor
                        )}>
                          <IconComponent className={cn('w-4 h-4', config.iconColor)} />
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className={cn(
                              'text-body-paragraph font-medium',
                              !notification.read ? 'text-text-primary' : 'text-text-base'
                            )}>
                              {notification.title}
                            </h4>
                            <span className="text-body-auxiliary text-text-secondary ml-2 flex-shrink-0">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-body-auxiliary text-text-secondary mb-3 leading-relaxed">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <Badge variant={config.badge} size="sm">
                              {notification.type === 'success' && 'Completado'}
                              {notification.type === 'warning' && 'Atención'}
                              {notification.type === 'error' && 'Error'}
                              {notification.type === 'info' && 'Información'}
                            </Badge>
                            
                            <span className="text-interactive-default text-sm font-medium">
                              {notification.actionText} →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border-default bg-bg-light">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              icon={<Settings className="w-4 h-4" />}
            >
              Configurar notificaciones
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  )
}

NotificationModal.displayName = 'NotificationModal'

export default NotificationModal