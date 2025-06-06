import React from 'react'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Mail, 
  FileText, 
  Settings,
  ArrowRight 
} from 'lucide-react'
import Card from '../../ui/Card'
import Badge from '../../ui/Badge'
import Button from '../../ui/Button'
import { cn } from '../../../utils/cn'

/**
 * ActivityRecent - Actividad reciente condensada (últimos 3 eventos) para tab Resumen
 */
const ActivityRecent = ({ 
  solicitudId, 
  onViewAll,
  className = '' 
}) => {
  // Generar eventos recientes del proceso específico
  const getRecentEvents = () => {
    const baseDate = new Date()
    
    return [
      {
        id: '1',
        type: 'execution',
        status: 'success',
        title: 'Consulta completada',
        description: 'Se ejecutó consulta automática exitosamente',
        date: new Date(baseDate.getTime() - 2 * 60 * 60 * 1000).toISOString(), // hace 2 horas
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'success'
      },
      {
        id: '2',
        type: 'notification',
        status: 'success',
        title: 'Notificación enviada',
        description: 'Email enviado con resultados de la consulta',
        date: new Date(baseDate.getTime() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(), // hace 2h - 5min
        icon: <Mail className="w-4 h-4" />,
        color: 'info'
      },
      {
        id: '3',
        type: 'execution',
        status: 'success',
        title: 'Consulta programada',
        description: 'Siguiente consulta programada para hoy 7:00 PM',
        date: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString(), // hace 1 día
        icon: <Clock className="w-4 h-4" />,
        color: 'primary'
      }
    ]
  }

  const events = getRecentEvents()

  // Formatear fecha relativa
  const formatRelativeDate = (date) => {
    const now = new Date()
    const eventDate = new Date(date)
    const diff = now - eventDate
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`
    if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
    if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
    return 'hace un momento'
  }

  const getEventConfig = (type, status) => {
    const configs = {
      execution: {
        success: { color: 'success', bg: 'bg-feedback-success/10' },
        error: { color: 'error', bg: 'bg-feedback-error/10' }
      },
      notification: {
        success: { color: 'info', bg: 'bg-feedback-info/10' }
      },
      config: {
        success: { color: 'primary', bg: 'bg-interactive-default/10' }
      }
    }
    
    return configs[type]?.[status] || { color: 'info', bg: 'bg-bg-light' }
  }

  return (
    <Card size="sm" className={cn('border-l-4 border-l-interactive-default', className)}>
      <Card.Header className="pb-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <Clock className="w-4 h-4 text-interactive-default" />
            <Card.Title className="text-heading-h4">Actividad Reciente</Card.Title>
          </div>
          
          {onViewAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              icon={<ArrowRight className="w-3 h-3" />}
              className="text-xs"
            >
              Ver todo
            </Button>
          )}
        </div>
      </Card.Header>
      
      <Card.Content className="pt-0">
        <div className="space-y-md">
          {events.map((event, index) => {
            const eventConfig = getEventConfig(event.type, event.status)
            
            return (
              <div 
                key={event.id}
                className={cn(
                  'flex items-start gap-sm p-sm rounded-md transition-colors duration-200',
                  'hover:bg-bg-light cursor-pointer',
                  eventConfig.bg
                )}
              >
                {/* Icono del evento */}
                <div className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 mt-xs',
                  eventConfig.bg,
                  `text-feedback-${eventConfig.color}`
                )}>
                  {event.icon}
                </div>
                
                {/* Contenido del evento */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-sm">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-body-paragraph font-medium text-text-primary truncate">
                        {event.title}
                      </h4>
                      <p className="text-body-auxiliary text-text-secondary text-sm">
                        {event.description}
                      </p>
                    </div>
                    
                    {/* Timestamp */}
                    <div className="text-right flex-shrink-0">
                      <span className="text-body-auxiliary text-text-secondary text-xs">
                        {formatRelativeDate(event.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* Estado cuando no hay eventos */}
          {events.length === 0 && (
            <div className="text-center py-lg">
              <div className="w-12 h-12 mx-auto mb-sm rounded-full bg-bg-light flex items-center justify-center">
                <Clock className="w-6 h-6 text-text-secondary" />
              </div>
              <p className="text-body-paragraph text-text-secondary">
                No hay actividad reciente
              </p>
              <p className="text-body-auxiliary text-text-secondary text-sm">
                Los eventos aparecerán aquí cuando ocurran
              </p>
            </div>
          )}
        </div>

        {/* Resumen de actividad */}
        {events.length > 0 && (
          <div className="mt-md pt-md border-t border-border-default">
            <div className="flex items-center justify-between text-body-auxiliary text-text-secondary">
              <div className="flex items-center gap-sm">
                <Badge variant="success" size="sm">
                  {events.filter(e => e.status === 'success').length} exitosas
                </Badge>
                {events.some(e => e.status === 'error') && (
                  <Badge variant="error" size="sm">
                    {events.filter(e => e.status === 'error').length} errores
                  </Badge>
                )}
              </div>
              <span className="text-xs">
                Últimas 24 horas
              </span>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  )
}

export default ActivityRecent