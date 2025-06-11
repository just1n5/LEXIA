// src/components/advanced-query/FormSuccess.jsx
import React, { useState, useEffect } from 'react'
import { 
  CheckCircle, Sparkles, Calendar, Bell, 
  ArrowRight, Copy, ExternalLink, Gift,
  Clock, MapPin, User, FileText, Zap
} from 'lucide-react'
import { cn } from '../../utils/cn'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

/**
 * 🎉 FormSuccess - Feedback de éxito mejorado
 * 
 * Proporciona una experiencia de éxito completa con resumen,
 * próximos pasos y acciones recomendadas.
 */
const FormSuccess = ({ 
  solicitudData,
  onViewDashboard,
  onCreateAnother,
  className = '',
  ...props 
}) => {
  const [showConfetti, setShowConfetti] = useState(true)
  const [copied, setCopied] = useState(false)

  // Generar ID de solicitud simulado
  const solicitudId = `ADV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`

  // Ocultar confetti después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Copiar ID de solicitud
  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(solicitudId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  // Obtener tiempo estimado para primera ejecución
  const getEstimatedTime = () => {
    if (solicitudData?.ejecutarDiariamente) {
      const now = new Date()
      const nextExecution = new Date()
      nextExecution.setHours(19, 0, 0, 0) // 7:00 PM
      
      if (nextExecution <= now) {
        nextExecution.setDate(nextExecution.getDate() + 1)
      }
      
      const hours = Math.ceil((nextExecution - now) / (1000 * 60 * 60))
      return `${hours} horas`
    }
    return 'Manual'
  }

  // Obtener resumen de criterios
  const getCriteriosSummary = () => {
    const criterios = []
    
    if (solicitudData?.departamento && solicitudData?.ciudad) {
      criterios.push({
        icon: MapPin,
        label: 'Ubicación',
        value: `${solicitudData.ciudad}, ${solicitudData.departamento}`
      })
    }
    
    if (solicitudData?.nombreDemandante) {
      criterios.push({
        icon: User,
        label: 'Demandante',
        value: solicitudData.nombreDemandante
      })
    }
    
    if (solicitudData?.nombreDemandado) {
      criterios.push({
        icon: User,
        label: 'Demandado',
        value: solicitudData.nombreDemandado
      })
    }
    
    if (solicitudData?.numeroRadicado) {
      criterios.push({
        icon: FileText,
        label: 'Radicado',
        value: solicitudData.numeroRadicado
      })
    }
    
    if (solicitudData?.numeroRadicacion) {
      criterios.push({
        icon: FileText,
        label: 'Radicación',
        value: solicitudData.numeroRadicacion
      })
    }
    
    return criterios
  }

  return (
    <div className={cn('space-y-lg', className)} {...props}>
      {/* Tarjeta principal de éxito */}
      <Card size="lg" className="border-feedback-success bg-feedback-success-light relative overflow-hidden">
        {/* Efecto de confetti */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 w-2 h-2 bg-interactive-default rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="absolute top-8 right-8 w-1 h-1 bg-feedback-success rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="absolute top-12 left-1/2 w-1.5 h-1.5 bg-interactive-default rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            <div className="absolute top-6 right-1/4 w-1 h-1 bg-feedback-success rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
          </div>
        )}

        <Card.Header>
          <div className="flex items-center justify-center mb-md">
            <div className="w-20 h-20 bg-feedback-success rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <div className="text-center">
            <Card.Title as="h2" className="text-feedback-success mb-sm flex items-center justify-center gap-sm">
              <Sparkles className="w-5 h-5" />
              ¡Consulta Avanzada Creada Exitosamente!
            </Card.Title>
            
            <p className="text-body-paragraph text-feedback-success">
              Tu consulta automatizada está lista y funcionando. 
              Recibirás notificaciones cuando se detecten cambios en los procesos.
            </p>
          </div>
        </Card.Header>

        <Card.Content>
          {/* ID de solicitud */}
          <div className="bg-white bg-opacity-70 rounded-lg p-md border border-feedback-success border-opacity-30 mb-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-body-paragraph font-medium text-feedback-success mb-xs">
                  ID de Solicitud
                </h4>
                <code className="text-heading-h4 font-mono text-text-primary">
                  {solicitudId}
                </code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyId}
                className="text-feedback-success hover:bg-feedback-success hover:bg-opacity-10"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-xs" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-xs" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Resumen de configuración */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
            <div className="space-y-sm">
              <h4 className="text-body-paragraph font-medium text-feedback-success flex items-center gap-sm">
                <Calendar className="w-4 h-4" />
                Configuración de Ejecución
              </h4>
              
              <div className="space-y-xs">
                <div className="flex items-center justify-between">
                  <span className="text-body-auxiliary text-text-secondary">Frecuencia:</span>
                  <Badge variant={solicitudData?.ejecutarDiariamente ? 'success' : 'secondary'} size="sm">
                    {solicitudData?.ejecutarDiariamente ? 'Diaria (7:00 PM)' : 'Manual'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-body-auxiliary text-text-secondary">Notificaciones:</span>
                  <Badge variant={solicitudData?.notificarCambios ? 'info' : 'secondary'} size="sm">
                    {solicitudData?.notificarCambios ? 'Activadas' : 'Desactivadas'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-body-auxiliary text-text-secondary">Primera ejecución:</span>
                  <span className="text-body-auxiliary text-text-base font-medium">
                    {getEstimatedTime()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-sm">
              <h4 className="text-body-paragraph font-medium text-feedback-success flex items-center gap-sm">
                <Search className="w-4 h-4" />
                Criterios Configurados
              </h4>
              
              <div className="space-y-xs">
                {getCriteriosSummary().map((criterio, index) => {
                  const IconComponent = criterio.icon
                  return (
                    <div key={index} className="flex items-start gap-xs">
                      <IconComponent className="w-3 h-3 text-text-secondary mt-1" />
                      <div className="flex-1 min-w-0">
                        <span className="text-body-auxiliary text-text-secondary">{criterio.label}:</span>
                        <span className="text-body-auxiliary text-text-base ml-xs break-words">
                          {criterio.value}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Próximos pasos */}
          <div className="bg-white bg-opacity-70 rounded-lg p-md border border-feedback-success border-opacity-30">
            <h4 className="text-body-paragraph font-medium text-feedback-success mb-md flex items-center gap-sm">
              <Zap className="w-4 h-4" />
              ¿Qué sucede ahora?
            </h4>
            
            <div className="space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex items-start gap-sm">
                  <div className="w-6 h-6 bg-feedback-success rounded-full flex items-center justify-center mt-xs">
                    <span className="text-xs text-white font-bold">1</span>
                  </div>
                  <div>
                    <h5 className="text-body-paragraph font-medium text-text-primary">
                      Monitoreo automático
                    </h5>
                    <p className="text-body-auxiliary text-text-secondary">
                      {solicitudData?.ejecutarDiariamente 
                        ? 'Se ejecutará automáticamente todos los días a las 7:00 PM'
                        : 'Ejecuta manualmente desde tu dashboard cuando lo necesites'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-sm">
                  <div className="w-6 h-6 bg-feedback-success rounded-full flex items-center justify-center mt-xs">
                    <span className="text-xs text-white font-bold">2</span>
                  </div>
                  <div>
                    <h5 className="text-body-paragraph font-medium text-text-primary">
                      Notificaciones inteligentes
                    </h5>
                    <p className="text-body-auxiliary text-text-secondary">
                      {solicitudData?.notificarCambios 
                        ? 'Recibirás alertas por email cuando se detecten cambios'
                        : 'Revisa manualmente los resultados en tu dashboard'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-sm">
                  <div className="w-6 h-6 bg-feedback-success rounded-full flex items-center justify-center mt-xs">
                    <span className="text-xs text-white font-bold">3</span>
                  </div>
                  <div>
                    <h5 className="text-body-paragraph font-medium text-text-primary">
                      Resultados en tiempo real
                    </h5>
                    <p className="text-body-auxiliary text-text-secondary">
                      Accede a los resultados actualizados desde tu dashboard
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-sm">
                  <div className="w-6 h-6 bg-feedback-success rounded-full flex items-center justify-center mt-xs">
                    <span className="text-xs text-white font-bold">4</span>
                  </div>
                  <div>
                    <h5 className="text-body-paragraph font-medium text-text-primary">
                      Gestión completa
                    </h5>
                    <p className="text-body-auxiliary text-text-secondary">
                      Modifica, pausa o elimina la consulta cuando quieras
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Acciones principales */}
      <div className="flex flex-col sm:flex-row gap-sm">
        <Button 
          variant="primary" 
          size="lg"
          onClick={onViewDashboard}
          className="flex items-center gap-sm"
        >
          Ver en Dashboard
          <ArrowRight className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="secondary" 
          size="lg"
          onClick={onCreateAnother}
          className="flex items-center gap-sm"
        >
          Crear Otra Consulta
        </Button>
      </div>

      {/* Información adicional */}
      <Card className="bg-feedback-info-light border-feedback-info">
        <Card.Content>
          <div className="flex items-start gap-sm">
            <Gift className="w-5 h-5 text-feedback-info mt-xs" />
            <div>
              <h4 className="text-body-paragraph font-medium text-feedback-info mb-xs">
                💡 Consejo profesional
              </h4>
              <p className="text-body-auxiliary text-feedback-info">
                Para obtener mejores resultados, considera crear consultas específicas por tipo de proceso 
                (civil, penal, laboral, etc.) en lugar de una consulta muy amplia. 
                Esto te permitirá un monitoreo más efectivo y notificaciones más relevantes.
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

FormSuccess.displayName = 'FormSuccess'

export default FormSuccess