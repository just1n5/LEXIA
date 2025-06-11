// src/components/advanced-query/QueryPreview.jsx
import React from 'react'
import { 
  Eye, Calendar, Clock, MapPin, Building, 
  User, FileText, ChevronRight, Sparkles,
  CheckCircle, AlertTriangle, Info
} from 'lucide-react'
import { cn } from '../../utils/cn'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

/**
 * 🔍 QueryPreview - Vista previa de consulta avanzada
 * 
 * Muestra un resumen claro y organizado de los criterios de búsqueda
 * antes de crear la solicitud, mejorando la confianza del usuario.
 */
const QueryPreview = ({ 
  data = {}, 
  onEdit, 
  onConfirm, 
  className = '',
  ...props 
}) => {
  // Validar si hay datos suficientes
  const hasMinimumData = data.departamento && data.ciudad && (
    data.nombreDemandante || 
    data.nombreDemandado || 
    data.numeroRadicado ||
    data.numeroRadicacion
  )

  // Contar criterios activos
  const activeCriteria = Object.entries(data).filter(([key, value]) => 
    value && value !== '' && key !== 'ejecutarDiariamente' && key !== 'notificarCambios'
  ).length

  // Obtener configuración de notificaciones
  const notificationConfig = {
    ejecutarDiariamente: data.ejecutarDiariamente || false,
    notificarCambios: data.notificarCambios || false
  }

  return (
    <Card size="lg" className={cn('border-interactive-default', className)} {...props}>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-interactive-default rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <Card.Title as="h3">
                Vista Previa de la Consulta
              </Card.Title>
              <p className="text-body-auxiliary text-text-secondary">
                Revisa los criterios antes de crear la solicitud
              </p>
            </div>
          </div>
          
          {hasMinimumData && (
            <Badge variant="success" size="sm">
              <CheckCircle className="w-3 h-3 mr-xs" />
              Lista para crear
            </Badge>
          )}
        </div>
      </Card.Header>

      <Card.Content>
        {!hasMinimumData ? (
          // Estado sin datos suficientes
          <div className="text-center py-xl">
            <div className="w-16 h-16 bg-text-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-md">
              <AlertTriangle className="w-8 h-8 text-text-secondary" />
            </div>
            <h4 className="text-heading-h4 text-text-primary mb-sm">
              Completa los criterios de búsqueda
            </h4>
            <p className="text-body-paragraph text-text-secondary mb-lg">
              Necesitas especificar al menos la ubicación y un criterio de búsqueda 
              para poder crear la consulta avanzada.
            </p>
            <Button variant="secondary" onClick={onEdit}>
              Completar formulario
            </Button>
          </div>
        ) : (
          <div className="space-y-lg">
            {/* Resumen de criterios */}
            <div>
              <div className="flex items-center justify-between mb-md">
                <h4 className="text-heading-h4 text-text-primary flex items-center gap-sm">
                  <Sparkles className="w-4 h-4 text-interactive-default" />
                  Criterios de Búsqueda
                </h4>
                <Badge variant="info" size="sm">
                  {activeCriteria} criterio{activeCriteria !== 1 ? 's' : ''} activo{activeCriteria !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {/* Ubicación */}
                <div className="bg-bg-light rounded-lg p-md border border-border-default">
                  <div className="flex items-center gap-sm mb-sm">
                    <MapPin className="w-4 h-4 text-interactive-default" />
                    <h5 className="text-body-paragraph font-medium text-text-primary">
                      Ubicación
                    </h5>
                  </div>
                  <div className="space-y-xs">
                    <div className="flex items-center gap-sm">
                      <Building className="w-3 h-3 text-text-secondary" />
                      <span className="text-body-auxiliary text-text-base">
                        {data.departamento}
                      </span>
                    </div>
                    <div className="flex items-center gap-sm">
                      <MapPin className="w-3 h-3 text-text-secondary" />
                      <span className="text-body-auxiliary text-text-base">
                        {data.ciudad}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Criterios de persona */}
                {(data.nombreDemandante || data.nombreDemandado) && (
                  <div className="bg-bg-light rounded-lg p-md border border-border-default">
                    <div className="flex items-center gap-sm mb-sm">
                      <User className="w-4 h-4 text-interactive-default" />
                      <h5 className="text-body-paragraph font-medium text-text-primary">
                        Personas
                      </h5>
                    </div>
                    <div className="space-y-xs">
                      {data.nombreDemandante && (
                        <div>
                          <span className="text-body-auxiliary text-text-secondary">Demandante:</span>
                          <span className="text-body-auxiliary text-text-base ml-xs">
                            {data.nombreDemandante}
                          </span>
                        </div>
                      )}
                      {data.nombreDemandado && (
                        <div>
                          <span className="text-body-auxiliary text-text-secondary">Demandado:</span>
                          <span className="text-body-auxiliary text-text-base ml-xs">
                            {data.nombreDemandado}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Números de radicado */}
                {(data.numeroRadicado || data.numeroRadicacion) && (
                  <div className="bg-bg-light rounded-lg p-md border border-border-default">
                    <div className="flex items-center gap-sm mb-sm">
                      <FileText className="w-4 h-4 text-interactive-default" />
                      <h5 className="text-body-paragraph font-medium text-text-primary">
                        Números de Referencia
                      </h5>
                    </div>
                    <div className="space-y-xs">
                      {data.numeroRadicado && (
                        <div>
                          <span className="text-body-auxiliary text-text-secondary">Radicado:</span>
                          <span className="text-body-auxiliary text-text-base ml-xs font-mono">
                            {data.numeroRadicado}
                          </span>
                        </div>
                      )}
                      {data.numeroRadicacion && (
                        <div>
                          <span className="text-body-auxiliary text-text-secondary">Radicación:</span>
                          <span className="text-body-auxiliary text-text-base ml-xs font-mono">
                            {data.numeroRadicacion}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Configuración de notificaciones */}
            <div>
              <h4 className="text-heading-h4 text-text-primary flex items-center gap-sm mb-md">
                <Calendar className="w-4 h-4 text-interactive-default" />
                Configuración de Ejecución
              </h4>
              
              <div className="bg-interactive-default bg-opacity-5 rounded-lg p-md border border-interactive-default">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="flex items-center gap-sm">
                    <div className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center',
                      notificationConfig.ejecutarDiariamente 
                        ? 'bg-feedback-success' 
                        : 'bg-text-secondary'
                    )}>
                      {notificationConfig.ejecutarDiariamente && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-body-paragraph font-medium text-text-primary">
                        Ejecución diaria
                      </p>
                      <p className="text-body-auxiliary text-text-secondary">
                        {notificationConfig.ejecutarDiariamente 
                          ? 'Activada - Se ejecutará a las 7:00 PM' 
                          : 'Desactivada - Ejecución manual únicamente'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-sm">
                    <div className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center',
                      notificationConfig.notificarCambios 
                        ? 'bg-feedback-success' 
                        : 'bg-text-secondary'
                    )}>
                      {notificationConfig.notificarCambios && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-body-paragraph font-medium text-text-primary">
                        Notificaciones
                      </p>
                      <p className="text-body-auxiliary text-text-secondary">
                        {notificationConfig.notificarCambios 
                          ? 'Activadas - Recibirás alertas por email' 
                          : 'Desactivadas - Sin notificaciones automáticas'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-feedback-info-light rounded-lg p-md border border-feedback-info">
              <div className="flex items-start gap-sm">
                <Info className="w-4 h-4 text-feedback-info mt-xs" />
                <div>
                  <h5 className="text-body-paragraph font-medium text-feedback-info mb-xs">
                    ¿Qué sucederá después?
                  </h5>
                  <ul className="text-body-auxiliary text-feedback-info space-y-xs">
                    <li>• La consulta se creará y estará disponible en tu dashboard</li>
                    <li>• Si activaste la ejecución diaria, se ejecutará automáticamente</li>
                    <li>• Podrás monitorear el progreso y ver resultados en tiempo real</li>
                    <li>• Recibirás notificaciones cuando se detecten cambios (si está activado)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-sm pt-md border-t border-border-default">
              <Button 
                variant="secondary" 
                onClick={onEdit}
                className="flex items-center gap-sm"
              >
                Editar criterios
              </Button>
              <Button 
                variant="primary" 
                onClick={onConfirm}
                className="flex items-center gap-sm"
              >
                Crear consulta avanzada
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  )
}

QueryPreview.displayName = 'QueryPreview'

export default QueryPreview