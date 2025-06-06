import React from 'react'
import { FileText, Calendar, User, MapPin, Clock, CheckCircle, Pause } from 'lucide-react'
import Card from '../../ui/Card'
import Badge from '../../ui/Badge'
import InfoField from '../../ui/InfoField'
import { cn } from '../../../utils/cn'

/**
 * ProcessInfoCompact - Versión condensada de información del proceso para tab Resumen
 */
const ProcessInfoCompact = ({ solicitud, className = '' }) => {
  if (!solicitud) {
    return (
      <Card size="sm" className={cn('animate-pulse', className)}>
        <Card.Content className="p-md">
          <div className="space-y-sm">
            <div className="h-4 bg-bg-light rounded w-3/4"></div>
            <div className="h-3 bg-bg-light rounded w-1/2"></div>
            <div className="h-3 bg-bg-light rounded w-2/3"></div>
          </div>
        </Card.Content>
      </Card>
    )
  }

  const getEstadoBadge = () => {
    return solicitud.activa ? (
      <Badge variant="success" size="sm">
        <CheckCircle className="w-3 h-3 mr-1" />
        Activa
      </Badge>
    ) : (
      <Badge variant="warning" size="sm">
        <Pause className="w-3 h-3 mr-1" />
        Pausada
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible'
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  return (
    <Card size="sm" className={cn('border-l-4 border-l-interactive-default', className)}>
      <Card.Header className="pb-sm">
        <div className="flex items-start justify-between gap-lg">
          <div className="flex items-center gap-md">
            <FileText className="w-4 h-4 text-interactive-default" />
            <Card.Title className="text-heading-h4">Información del Proceso</Card.Title>
          </div>
          <div className="ml-lg">
            {getEstadoBadge()}
          </div>
        </div>
      </Card.Header>
      
      <Card.Content className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {/* Información básica */}
          <div className="space-y-sm">
            <div>
              <div className="flex items-center gap-xs mb-xs">
                <User className="w-3 h-3 text-text-secondary" />
                <span className="text-body-auxiliary text-text-secondary">Radicado</span>
              </div>
              <p className="text-body-paragraph text-text-primary font-mono">
                {solicitud.criterio_busqueda_radicado || 'No especificado'}
              </p>
            </div>
            
            {solicitud.criterio_busqueda_nombre && (
              <div>
                <div className="flex items-center gap-xs mb-xs">
                  <User className="w-3 h-3 text-text-secondary" />
                  <span className="text-body-auxiliary text-text-secondary">Demandante</span>
                </div>
                <p className="text-body-paragraph text-text-primary">
                  {solicitud.criterio_busqueda_nombre}
                </p>
              </div>
            )}
          </div>

          {/* Información de tiempo */}
          <div className="space-y-sm">
            <div>
              <div className="flex items-center gap-xs mb-xs">
                <Calendar className="w-3 h-3 text-text-secondary" />
                <span className="text-body-auxiliary text-text-secondary">Creado</span>
              </div>
              <p className="text-body-paragraph text-text-primary">
                {formatDate(solicitud.fecha_creacion)}
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-xs mb-xs">
                <Clock className="w-3 h-3 text-text-secondary" />
                <span className="text-body-auxiliary text-text-secondary">Última consulta</span>
              </div>
              <p className="text-body-paragraph text-text-primary">
                {formatDate(solicitud.ultima_ejecucion) || 'Nunca'}
              </p>
            </div>
          </div>
        </div>

        {/* Información del juzgado */}
        {solicitud.despacho_juzgado && (
          <div className="mt-md pt-md border-t border-border-default">
            <div className="flex items-center gap-xs mb-xs">
              <MapPin className="w-3 h-3 text-text-secondary" />
              <span className="text-body-auxiliary text-text-secondary">Juzgado</span>
            </div>
            <p className="text-body-auxiliary text-text-base">
              {solicitud.despacho_juzgado}
            </p>
          </div>
        )}
      </Card.Content>
    </Card>
  )
}

export default ProcessInfoCompact