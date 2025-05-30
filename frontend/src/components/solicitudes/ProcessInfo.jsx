import React from 'react'
import { Calendar, Clock, FileText, Mail, User, Building2, PauseCircle } from 'lucide-react'

// Components del design system
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import InfoField from '../ui/InfoField'
import { cn } from '../../utils/cn'

/**
 * Componente ProcessInfo modernizado siguiendo el design system
 * Muestra información detallada del proceso judicial en formato de grid
 */
const ProcessInfo = ({ solicitud, className = '', ...props }) => {
  if (!solicitud) {
    return (
      <Card size="lg" className={cn('mb-xl', className)} {...props}>
        <Card.Header>
          <Card.Title>Información del proceso</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center justify-center py-xl">
            <p className="text-body-paragraph text-text-secondary">
              No hay información disponible
            </p>
          </div>
        </Card.Content>
      </Card>
    )
  }

  // Helper para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado'
    
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
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
  const getEstadoBadge = (activa, estado) => {
    if (estado === 'error') {
      return <Badge.Error size="sm">Error</Badge.Error>
    }
    
    if (estado === 'en_proceso') {
      return <Badge.Processing size="sm">En Proceso</Badge.Processing>
    }
    
    if (activa) {
      return <Badge.Active size="sm">Activa</Badge.Active>
    } else {
      return <Badge.Paused size="sm">Pausada</Badge.Paused>
    }
  }

  // Helper para obtener badge de frecuencia
  const getFrecuenciaBadge = (frecuencia) => {
    const frecuenciaMap = {
      'diaria': <Badge.Daily size="sm">Diaria</Badge.Daily>,
      'semanal': <Badge.Weekly size="sm">Semanal</Badge.Weekly>,
      'mensual': <Badge.Monthly size="sm">Mensual</Badge.Monthly>,
      'manual': <Badge.Manual size="sm">Manual</Badge.Manual>
    }
    
    return frecuenciaMap[frecuencia?.toLowerCase()] || (
      <Badge variant="neutral" size="sm">
        {frecuencia || 'No especificada'}
      </Badge>
    )
  }

  // Helper para obtener texto de tipo de búsqueda
  const getTipoBusqueda = (tipo) => {
    const tipos = {
      'radicado': 'Por número de radicado',
      'nombre': 'Por nombre/razón social',
      'avanzada': 'Búsqueda avanzada'
    }
    
    return tipos[tipo] || tipo || 'No especificado'
  }

  return (
    <Card size="lg" className={cn('mb-xl', className)} {...props}>
      <Card.Header>
        <div className="flex items-center gap-sm">
          <FileText className="w-5 h-5 text-interactive-default" />
          <Card.Title>Información del proceso</Card.Title>
        </div>
      </Card.Header>
      
      <Card.Content>
        <InfoField.Grid columns={2} gap="lg">
          {/* Información básica del proceso */}
          <InfoField
            label="Nombre descriptivo"
            icon={<FileText className="w-4 h-4" />}
          >
            <div className="space-y-xs">
              <div className="font-semibold text-text-primary">
                {solicitud.nombre_descriptivo || solicitud.alias || 'Sin nombre'}
              </div>
              {solicitud.alias && solicitud.nombre_descriptivo !== solicitud.alias && (
                <div className="text-body-auxiliary text-text-secondary">
                  Alias: {solicitud.alias}
                </div>
              )}
            </div>
          </InfoField>

          <InfoField
            label="Tipo de búsqueda"
            value={getTipoBusqueda(solicitud.tipo_busqueda)}
          />

          {/* Criterios de búsqueda */}
          {solicitud.criterio_busqueda_radicado && (
            <InfoField
              label="Número de radicado"
              icon={<FileText className="w-4 h-4" />}
            >
              <span className="font-mono text-text-primary">
                {solicitud.criterio_busqueda_radicado}
              </span>
            </InfoField>
          )}

          {solicitud.criterio_busqueda_nombre && (
            <InfoField
              label="Nombre/Razón social"
              icon={<User className="w-4 h-4" />}
              value={solicitud.criterio_busqueda_nombre}
            />
          )}

          {/* Despacho/Juzgado */}
          {solicitud.despacho && (
            <InfoField
              label="Despacho/Juzgado"
              icon={<Building2 className="w-4 h-4" />}
              value={solicitud.despacho}
            />
          )}

          {/* Configuración de notificaciones */}
          <InfoField
            label="Frecuencia de notificación"
            icon={<Calendar className="w-4 h-4" />}
          >
            {getFrecuenciaBadge(solicitud.frecuencia_envio)}
          </InfoField>

          {solicitud.email_notificacion && (
            <InfoField
              label="Email de notificación"
              icon={<Mail className="w-4 h-4" />}
            >
              <a 
                href={`mailto:${solicitud.email_notificacion}`}
                className="text-interactive-default hover:text-interactive-hover transition-colors"
              >
                {solicitud.email_notificacion}
              </a>
            </InfoField>
          )}

          {/* Fechas importantes */}
          <InfoField.Date
            label="Fecha de creación"
            date={solicitud.fecha_creacion}
            icon={<Clock className="w-4 h-4" />}
          />

          <InfoField.Date
            label="Última ejecución"
            date={solicitud.ultima_ejecucion}
            icon={<Clock className="w-4 h-4" />}
          />

          {/* Estado de la solicitud */}
          <InfoField
            label="Estado de la solicitud"
          >
            {getEstadoBadge(solicitud.activa, solicitud.estado)}
          </InfoField>

          {/* Estadísticas */}
          {(solicitud.resultados_encontrados !== undefined || solicitud.notificaciones_enviadas !== undefined) && (
            <InfoField
              label="Estadísticas"
            >
              <div className="space-y-xs text-body-auxiliary">
                {solicitud.resultados_encontrados !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Resultados encontrados:</span>
                    <span className="font-medium text-text-primary">
                      {solicitud.resultados_encontrados}
                    </span>
                  </div>
                )}
                {solicitud.notificaciones_enviadas !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Notificaciones enviadas:</span>
                    <span className="font-medium text-text-primary">
                      {solicitud.notificaciones_enviadas}
                    </span>
                  </div>
                )}
              </div>
            </InfoField>
          )}
        </InfoField.Grid>

        {/* Información adicional si hay criterios específicos */}
        {(solicitud.criterio_busqueda_cedula || solicitud.criterio_busqueda_codigo_verificacion) && (
          <div className="mt-lg pt-lg border-t border-border-default">
            <h4 className="text-heading-h4 font-heading text-text-primary mb-md">
              Criterios adicionales
            </h4>
            
            <InfoField.Grid columns={2} gap="md">
              {solicitud.criterio_busqueda_cedula && (
                <InfoField
                  label="Cédula"
                  value={solicitud.criterio_busqueda_cedula}
                  size="sm"
                />
              )}
              
              {solicitud.criterio_busqueda_codigo_verificacion && (
                <InfoField
                  label="Código de verificación"
                  value={solicitud.criterio_busqueda_codigo_verificacion}
                  size="sm"
                />
              )}
            </InfoField.Grid>
          </div>
        )}

        {/* Nota sobre el estado */}
        {!solicitud.activa && (
          <div className="mt-lg p-md bg-feedback-warning-light border border-feedback-warning rounded-lg">
            <div className="flex items-start gap-sm">
              <div className="flex-shrink-0">
                <PauseCircle className="w-5 h-5 text-feedback-warning" />
              </div>
              <div>
                <h5 className="text-body-paragraph font-medium text-feedback-warning mb-xs">
                  Solicitud pausada
                </h5>
                <p className="text-body-auxiliary text-text-secondary">
                  Esta solicitud está temporalmente pausada y no se ejecutará automáticamente. 
                  Puedes activarla desde los botones de acción para reanudar el monitoreo.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  )
}

ProcessInfo.displayName = 'ProcessInfo'

export default ProcessInfo