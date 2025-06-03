import React from 'react'
import Card from '../ui/Card'
import InfoField from '../ui/InfoField'
import Badge from '../ui/Badge'
import { Calendar, Clock, User, FileText } from 'lucide-react'

/**
 * Componente ProcessInfo modernizado con design system
 * Muestra información estructurada de la solicitud
 */
const ProcessInfo = ({ solicitud }) => {
  if (!solicitud) {
    return (
      <Card size="lg" className="animate-pulse">
        <Card.Content>
          <div className="space-y-lg">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-xs">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </Card.Content>
      </Card>
    )
  }

  // Helper para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  // Helper para obtener badge de estado
  const getEstadoBadge = () => {
    const estado = solicitud.activa ? 'activa' : 'pausada'
    
    switch (estado) {
      case 'activa':
        return <Badge.Active size="sm" />
      case 'pausada':
        return <Badge.Paused size="sm" />
      case 'en_proceso':
        return <Badge.Processing size="sm" />
      case 'error':
        return <Badge.Error size="sm" />
      default:
        return <Badge variant="neutral" size="sm">{estado}</Badge>
    }
  }

  // Helper para obtener badge de frecuencia
  const getFrecuenciaBadge = () => {
    const frecuencia = solicitud.frecuencia_envio || solicitud.frecuencia

    switch (frecuencia?.toLowerCase()) {
      case 'diaria':
      case 'daily':
        return <Badge.Daily size="sm" />
      case 'semanal':
      case 'weekly':
        return <Badge.Weekly size="sm" />
      case 'mensual':
      case 'monthly':
        return <Badge.Monthly size="sm" />
      case 'manual':
        return <Badge.Manual size="sm" />
      default:
        return <Badge variant="neutral" size="sm">{frecuencia || 'No definida'}</Badge>
    }
  }

  // Helper para obtener tipo de búsqueda formateado
  const getTipoBusqueda = () => {
    const tipo = solicitud.tipo_busqueda
    switch (tipo?.toLowerCase()) {
      case 'radicado':
        return 'Por número de radicado'
      case 'nombre':
        return 'Por nombre/razón social'
      case 'avanzada':
        return 'Búsqueda avanzada'
      default:
        return tipo || 'No especificado'
    }
  }

  return (
    <Card size="lg" className="mb-xl">
      <Card.Header>
        <Card.Title>
          <div className="flex items-center gap-sm">
            <FileText className="w-5 h-5 text-interactive-default" />
            Información del proceso
          </div>
        </Card.Title>
      </Card.Header>
      
      <Card.Content>
        <InfoField.Grid columns={2}>
          {/* Alias/Nombre descriptivo */}
          <InfoField
            label="Nombre descriptivo"
            value={solicitud.alias || solicitud.nombre_descriptivo || 'Sin nombre'}
          />

          {/* Tipo de búsqueda */}
          <InfoField
            label="Tipo de búsqueda"
            value={getTipoBusqueda()}
          />

          {/* Criterio de búsqueda por radicado */}
          {solicitud.criterio_busqueda_radicado && (
            <InfoField
              label="Número de radicado"
              value={solicitud.criterio_busqueda_radicado}
            />
          )}

          {/* Criterio de búsqueda por nombre */}
          {solicitud.criterio_busqueda_nombre && (
            <InfoField
              label="Nombre/Razón social"
              value={solicitud.criterio_busqueda_nombre}
            />
          )}

          {/* Despacho/Juzgado */}
          {solicitud.despacho_juzgado && (
            <InfoField
              label="Entidad / Especialidad / Despacho"
              value={solicitud.despacho_juzgado}
            />
          )}

          {/* Horario de ejecución automática */}
          <InfoField.Badge
            label="Horario de ejecución"
            badge={<Badge variant="info" size="sm">Diario 7:00 PM</Badge>}
          >
            <span className="text-text-secondary text-sm ml-1">
              (Automático todos los días)
            </span>
          </InfoField.Badge>

          {/* Próxima ejecución */}
          <InfoField
            label="Próxima ejecución"
            value={(() => {
              const now = new Date()
              const today7PM = new Date(now)
              today7PM.setHours(19, 0, 0, 0)
              
              // Si ya pasó las 7PM hoy, la próxima es mañana
              if (now > today7PM) {
                today7PM.setDate(today7PM.getDate() + 1)
              }
              
              return solicitud.activa 
                ? today7PM.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Pausada (no programada)'
            })()}
          />

          {/* Estado de la solicitud */}
          <InfoField.Badge
            label="Estado de la solicitud"
            badge={getEstadoBadge()}
          >
            <span className="text-text-secondary text-sm ml-1">
              {solicitud.activa ? '(Monitoreo activo)' : '(Pausada temporalmente)'}
            </span>
          </InfoField.Badge>

          {/* Fecha de creación */}
          <InfoField.Date
            label="Fecha de creación"
            value={solicitud.fecha_creacion || solicitud.created_at}
            dateOptions={{
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }}
          />

          {/* Última ejecución */}
          <InfoField.Date
            label="Última ejecución"
            value={solicitud.ultima_ejecucion || solicitud.updated_at}
          />

          {/* Email de notificación */}
          {solicitud.email_notificacion && (
            <InfoField
              label="Email de notificación"
              value={solicitud.email_notificacion}
            />
          )}
        </InfoField.Grid>

        {/* Información adicional si está disponible */}
        {(solicitud.descripcion || solicitud.notas) && (
          <div className="mt-lg pt-lg border-t border-border-default">
            <InfoField
              label="Descripción adicional"
              value={solicitud.descripcion || solicitud.notas}
              className="max-w-none"
            />
          </div>
        )}

        {/* Estadísticas rápidas */}
        <div className="mt-lg pt-lg border-t border-border-default">
          <h4 className="text-heading-h4 font-heading text-text-primary mb-md">
            Estadísticas de la solicitud
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            <div className="text-center p-sm bg-bg-light rounded-md">
              <div className="text-heading-h3 font-heading text-interactive-default">
                {solicitud.total_ejecuciones || '0'}
              </div>
              <div className="text-body-auxiliary text-text-secondary">
                Ejecuciones
              </div>
            </div>
            
            <div className="text-center p-sm bg-bg-light rounded-md">
              <div className="text-heading-h3 font-heading text-feedback-success">
                {solicitud.resultados_encontrados || '0'}
              </div>
              <div className="text-body-auxiliary text-text-secondary">
                Resultados
              </div>
            </div>
            
            <div className="text-center p-sm bg-bg-light rounded-md">
              <div className="text-heading-h3 font-heading text-feedback-info">
                {solicitud.notificaciones_enviadas || '0'}
              </div>
              <div className="text-body-auxiliary text-text-secondary">
                Notificaciones
              </div>
            </div>
            
            <div className="text-center p-sm bg-bg-light rounded-md">
              <div className="text-heading-h3 font-heading text-text-primary">
                {solicitud.dias_activa || 
                 (solicitud.fecha_creacion ? 
                   Math.floor((new Date() - new Date(solicitud.fecha_creacion)) / (1000 * 60 * 60 * 24)) : 
                   '0'
                 )
                }
              </div>
              <div className="text-body-auxiliary text-text-secondary">
                Días activa
              </div>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

export default ProcessInfo