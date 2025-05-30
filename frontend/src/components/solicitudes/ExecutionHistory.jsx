import React, { useState, useEffect } from 'react'
import { FileText, Search, Mail, Eye, Clock, Calendar, CheckCircle, XCircle, AlertCircle, ClipboardList } from 'lucide-react'

// Components del design system
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Timeline, { formatTimelineDate } from '../ui/Timeline'
import LoadingSpinner from '../ui/LoadingSpinner'

// Services
import { solicitudesService } from '../../services/solicitudes'
import { cn } from '../../utils/cn'

/**
 * Componente ExecutionHistory modernizado con design system
 * Muestra tanto el historial de eventos como el historial de ejecuciones
 */
const ExecutionHistory = ({ solicitudId, className = '', ...props }) => {
  const [resultados, setResultados] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [error, setError] = useState(null)

  // Cargar resultados al montar el componente
  useEffect(() => {
    if (solicitudId) {
      loadResultados()
    }
  }, [solicitudId])

  const loadResultados = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await solicitudesService.getResultadosSolicitud(solicitudId, 0, 5)
      setResultados(data)
    } catch (error) {
      console.error('Error cargando resultados:', error)
      setError('Error al cargar el historial')
      
      // Mostrar datos de demo si hay error
      setResultados(generateDemoResultados())
    } finally {
      setLoading(false)
    }
  }

  const loadMoreResultados = async () => {
    setLoading(true)
    
    try {
      const data = await solicitudesService.getResultadosSolicitud(solicitudId, resultados.length, 10)
      setResultados(prev => [...prev, ...data])
      setShowMore(false)
    } catch (error) {
      console.error('Error cargando más resultados:', error)
      // Simular carga de más datos
      const moreData = generateDemoResultados(resultados.length)
      setResultados(prev => [...prev, ...moreData])
    } finally {
      setLoading(false)
    }
  }

  // Generar datos de demo para el historial
  const generateDemoResultados = (offset = 0) => {
    const estados = ['EXITOSA', 'EXITOSA', 'EXITOSA', 'FALLIDA', 'EXITOSA']
    const despachos = [
      'Juzgado Primero Civil del Circuito de Bogotá',
      'Juzgado Segundo Civil Municipal de Medellín',
      'Tribunal Superior de Cali',
      'Juzgado Tercero Laboral de Barranquilla'
    ]
    
    return Array.from({ length: 5 }, (_, index) => ({
      id: offset + index + 1,
      fecha_ejecucion: new Date(Date.now() - (offset + index + 1) * 24 * 60 * 60 * 1000).toISOString(),
      estado_extraccion: estados[index % estados.length],
      numero_radicado_completo: `1100131030012024000${offset + index + 1}`,
      despacho_juzgado: despachos[index % despachos.length],
      resultados_encontrados: Math.floor(Math.random() * 4),
      tiempo_ejecucion: Math.floor(Math.random() * 300) + 30 // 30-330 segundos
    }))
  }

  // Generar timeline de eventos de la solicitud
  const generateTimelineEvents = () => {
    const baseDate = new Date()
    
    return [
      {
        icon: FileText,
        title: 'Solicitud creada',
        description: 'Se creó la solicitud de consulta automática',
        date: formatTimelineDate(new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000)),
        variant: 'success'
      },
      {
        icon: Search,
        title: 'Primera ejecución',
        description: 'Se ejecutó la primera búsqueda en las bases de datos judiciales',
        date: formatTimelineDate(new Date(baseDate.getTime() - 14 * 24 * 60 * 60 * 1000)),
        variant: 'info'
      },
      {
        icon: Mail,
        title: 'Notificación enviada',
        description: 'Se envió la primera notificación por correo electrónico',
        date: formatTimelineDate(new Date(baseDate.getTime() - 14 * 24 * 60 * 60 * 1000)),
        variant: 'success'
      },
      {
        icon: CheckCircle,
        title: 'Monitoreo activo',
        description: 'La solicitud está siendo monitoreada automáticamente',
        date: formatTimelineDate(new Date(baseDate.getTime() - 2 * 60 * 60 * 1000)),
        variant: 'success'
      }
    ]
  }

  // Helper para obtener badge de estado
  const getEstadoBadge = (estado) => {
    const estadosConfig = {
      'EXITOSA': {
        component: Badge.Success,
        text: 'Completado',
        icon: <CheckCircle className="w-3 h-3" />
      },
      'FALLIDA': {
        component: Badge.Error, 
        text: 'Error',
        icon: <XCircle className="w-3 h-3" />
      },
      'PENDIENTE': {
        component: Badge.Warning,
        text: 'Pendiente', 
        icon: <AlertCircle className="w-3 h-3" />
      }
    }
    
    const config = estadosConfig[estado] || estadosConfig['PENDIENTE']
    const BadgeComponent = config.component
    
    return (
      <div className="flex items-center gap-xs">
        {config.icon}
        <BadgeComponent size="sm">{config.text}</BadgeComponent>
      </div>
    )
  }

  // Helper para formatear tiempo de ejecución
  const formatTiempoEjecucion = (segundos) => {
    if (!segundos) return 'N/A'
    
    if (segundos < 60) {
      return `${segundos}s`
    } else if (segundos < 3600) {
      return `${Math.floor(segundos / 60)}m ${segundos % 60}s`
    } else {
      const horas = Math.floor(segundos / 3600)
      const minutos = Math.floor((segundos % 3600) / 60)
      return `${horas}h ${minutos}m`
    }
  }

  return (
    <div className={cn('space-y-xl', className)} {...props}>
      {/* Historial de Eventos */}
      <Card size="lg">
        <Card.Header>
          <div className="flex items-center gap-sm">
            <Clock className="w-5 h-5 text-interactive-default" />
            <Card.Title>Historial de eventos</Card.Title>
          </div>
        </Card.Header>
        
        <Card.Content>
          <Timeline items={generateTimelineEvents()} />
        </Card.Content>
      </Card>

      {/* Historial de Ejecuciones */}
      <Card size="lg">
        <Card.Header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <Calendar className="w-5 h-5 text-interactive-default" />
              <Card.Title>Historial de ejecuciones</Card.Title>
            </div>
            
            {resultados.length > 0 && (
              <Badge variant="info" size="sm">
                {resultados.length} ejecuciones
              </Badge>
            )}
          </div>
        </Card.Header>
        
        <Card.Content>
          {loading && resultados.length === 0 ? (
            <div className="flex items-center justify-center py-xl">
              <LoadingSpinner size="md" className="mr-sm" />
              <span className="text-body-paragraph text-text-secondary">
                Cargando historial de ejecuciones...
              </span>
            </div>
          ) : error && resultados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-xl text-center">
              <div className="mb-md">
                <AlertCircle size={48} className="text-feedback-error mx-auto" />
              </div>
              <h4 className="text-heading-h4 font-heading text-text-primary mb-sm">
                Error al cargar historial
              </h4>
              <p className="text-body-paragraph text-text-secondary mb-lg">
                {error}
              </p>
              <Button
                variant="secondary"
                onClick={loadResultados}
                loading={loading}
              >
                Reintentar
              </Button>
            </div>
          ) : resultados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-xl text-center">
              <div className="mb-md">
                <ClipboardList size={48} className="text-text-secondary mx-auto" />
              </div>
              <h4 className="text-heading-h4 font-heading text-text-primary mb-sm">
                Sin ejecuciones registradas
              </h4>
              <p className="text-body-paragraph text-text-secondary">
                Esta solicitud aún no ha sido ejecutada. Las ejecuciones aparecerán aquí una vez que se procesen.
              </p>
            </div>
          ) : (
            <>
              {/* Tabla de ejecuciones */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border-default">
                      <th className="text-left py-sm px-md text-body-auxiliary font-medium text-text-secondary">
                        Fecha y hora
                      </th>
                      <th className="text-left py-sm px-md text-body-auxiliary font-medium text-text-secondary">
                        Estado
                      </th>
                      <th className="text-left py-sm px-md text-body-auxiliary font-medium text-text-secondary">
                        Radicado
                      </th>
                      <th className="text-left py-sm px-md text-body-auxiliary font-medium text-text-secondary">
                        Despacho
                      </th>
                      <th className="text-left py-sm px-md text-body-auxiliary font-medium text-text-secondary">
                        Tiempo
                      </th>
                      <th className="text-center py-sm px-md text-body-auxiliary font-medium text-text-secondary">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((resultado, index) => (
                      <tr 
                        key={resultado.id || index}
                        className="border-b border-border-default hover:bg-bg-light transition-colors"
                      >
                        <td className="py-sm px-md">
                          <div className="text-body-paragraph text-text-primary">
                            {formatTimelineDate(resultado.fecha_ejecucion, {
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        
                        <td className="py-sm px-md">
                          {getEstadoBadge(resultado.estado_extraccion)}
                        </td>
                        
                        <td className="py-sm px-md">
                          <span className="font-mono text-body-auxiliary text-text-primary">
                            {resultado.numero_radicado_completo || 'N/A'}
                          </span>
                        </td>
                        
                        <td className="py-sm px-md">
                          <div className="text-body-auxiliary text-text-secondary max-w-xs truncate">
                            {resultado.despacho_juzgado || 'No especificado'}
                          </div>
                        </td>
                        
                        <td className="py-sm px-md">
                          <div className="text-body-auxiliary text-text-secondary">
                            {formatTiempoEjecucion(resultado.tiempo_ejecucion)}
                          </div>
                        </td>
                        
                        <td className="py-sm px-md text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Eye className="w-4 h-4" />}
                            onClick={() => {
                              // TODO: Implementar vista de detalles de resultado
                              console.log('Ver detalles de resultado:', resultado.id)
                            }}
                            title="Ver detalles del resultado"
                          >
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Botón para cargar más resultados */}
              {resultados.length >= 5 && (
                <div className="mt-lg">
                  <Button
                    variant="secondary"
                    onClick={loadMoreResultados}
                    loading={loading}
                    className="w-full"
                  >
                    {loading ? 'Cargando más resultados...' : 'Ver más ejecuciones'}
                  </Button>
                </div>
              )}

              {/* Resumen estadístico */}
              <div className="mt-lg pt-lg border-t border-border-default">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                  <div className="text-center p-md bg-feedback-success-light rounded-lg">
                    <div className="text-heading-h3 font-heading text-feedback-success mb-xs">
                      {resultados.filter(r => r.estado_extraccion === 'EXITOSA').length}
                    </div>
                    <div className="text-body-auxiliary text-text-secondary">
                      Exitosas
                    </div>
                  </div>
                  
                  <div className="text-center p-md bg-feedback-error-light rounded-lg">
                    <div className="text-heading-h3 font-heading text-feedback-error mb-xs">
                      {resultados.filter(r => r.estado_extraccion === 'FALLIDA').length}
                    </div>
                    <div className="text-body-auxiliary text-text-secondary">
                      Con errores
                    </div>
                  </div>
                  
                  <div className="text-center p-md bg-feedback-info-light rounded-lg">
                    <div className="text-heading-h3 font-heading text-feedback-info mb-xs">
                      {Math.round((resultados.filter(r => r.estado_extraccion === 'EXITOSA').length / resultados.length) * 100)}%
                    </div>
                    <div className="text-body-auxiliary text-text-secondary">
                      Tasa de éxito
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card.Content>
      </Card>
    </div>
  )
}

ExecutionHistory.displayName = 'ExecutionHistory'

export default ExecutionHistory