import React, { useState, useMemo } from 'react'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  Pause,
  FileText,
  Mail,
  Settings,
  Zap,
  Filter,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import { cn } from '../../../utils/cn'

/**
 * InteractiveTimeline - Timeline con filtros, búsqueda y expansión
 */
const InteractiveTimeline = ({
  events = [],
  onEventClick,
  onEventFilter,
  showFilters = true,
  expandable = true,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState([])
  const [expandedEvents, setExpandedEvents] = useState(new Set())
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' | 'desc'

  // Tipos de evento disponibles
  const eventTypes = [
    { id: 'created', label: 'Creación', color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'execution', label: 'Ejecución', color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'error', label: 'Error', color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'notification', label: 'Notificación', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { id: 'config', label: 'Configuración', color: 'text-gray-600', bg: 'bg-gray-50' }
  ]

  // Filtrar y ordenar eventos
  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = selectedFilters.length === 0 || 
                           selectedFilters.includes(event.type)
      
      return matchesSearch && matchesFilter
    })

    // Ordenar por fecha
    filtered.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })

    return filtered
  }, [events, searchTerm, selectedFilters, sortOrder])

  // Obtener configuración de icono según tipo
  const getEventIcon = (type, status) => {
    const iconMap = {
      created: <FileText className="w-4 h-4" />,
      execution: status === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />,
      error: <XCircle className="w-4 h-4" />,
      notification: <Mail className="w-4 h-4" />,
      config: <Settings className="w-4 h-4" />
    }
    return iconMap[type] || <Clock className="w-4 h-4" />
  }

  // Obtener configuración de color según tipo
  const getEventConfig = (type, status) => {
    if (type === 'execution' && status === 'error') {
      return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
    }
    
    const typeConfig = eventTypes.find(t => t.id === type)
    return {
      color: typeConfig?.color || 'text-gray-600',
      bg: typeConfig?.bg || 'bg-gray-50',
      border: 'border-gray-200'
    }
  }

  // Manejar toggle de filtros
  const handleFilterToggle = (filterId) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    )
    onEventFilter?.(selectedFilters)
  }

  // Manejar expansión de eventos
  const handleEventToggle = (eventId) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }

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

  return (
    <div className={cn('space-y-6', className)}>
      {/* Controles de filtro y búsqueda */}
      {showFilters && (
        <Card size="sm">
          <Card.Content className="p-4 space-y-4">
            {/* Barra de búsqueda */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
              
              {/* Ordenamiento */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                icon={sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              >
                {sortOrder === 'desc' ? 'Más reciente' : 'Más antiguo'}
              </Button>
            </div>

            {/* Filtros por tipo */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 mr-2 self-center">
                Filtrar por:
              </span>
              {eventTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => handleFilterToggle(type.id)}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm font-medium transition-all duration-200',
                    'border border-gray-300 hover:border-yellow-400',
                    selectedFilters.includes(type.id)
                      ? 'bg-yellow-400 text-gray-800 border-yellow-400'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {type.label}
                </button>
              ))}
              
              {/* Limpiar filtros */}
              {selectedFilters.length > 0 && (
                <button
                  onClick={() => setSelectedFilters([])}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                >
                  Limpiar
                </button>
              )}
            </div>
            
            {/* Contador de resultados */}
            <div className="text-sm text-gray-600">
              {filteredEvents.length} de {events.length} eventos
              {searchTerm && ` • Buscando: "${searchTerm}"`}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Línea vertical principal */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300" />
        
        {/* Eventos */}
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => {
              const eventConfig = getEventConfig(event.type, event.status)
              const isExpanded = expandedEvents.has(event.id)
              const isExpandable = expandable && (event.details || event.metadata)
              
              return (
                <div key={event.id} className="relative flex items-start gap-4 group">
                  {/* Icono del evento */}
                  <div className={cn(
                    'relative z-10 flex items-center justify-center',
                    'w-12 h-12 rounded-full border-4 border-white',
                    'transition-all duration-300 group-hover:scale-110',
                    eventConfig.bg,
                    eventConfig.color
                  )}>
                    {getEventIcon(event.type, event.status)}
                  </div>
                  
                  {/* Contenido del evento */}
                  <div className="flex-1 min-w-0">
                    <Card 
                      size="sm" 
                      className={cn(
                        'transition-all duration-300 hover:shadow-md hover:-translate-y-0.5',
                        'border-l-4',
                        eventConfig.border
                      )}
                    >
                      <Card.Content className="p-4">
                        {/* Header del evento */}
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {event.title}
                              </h4>
                              <span className={cn(
                                'px-2 py-1 rounded text-xs font-medium uppercase tracking-wide',
                                eventConfig.bg,
                                eventConfig.color
                              )}>
                                {event.type}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600">
                              {event.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Timestamp */}
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {formatRelativeDate(event.date)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(event.date).toLocaleTimeString('es-CO', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                            
                            {/* Botón de expansión */}
                            {isExpandable && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEventToggle(event.id)}
                                icon={isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                className="w-8 h-8 p-0"
                              />
                            )}
                          </div>
                        </div>
                        
                        {/* Contenido expandido */}
                        {isExpanded && (event.details || event.metadata) && (
                          <div className={cn(
                            'mt-4 pt-4 border-t border-gray-200',
                            'animate-in slide-in-from-top-2 duration-300'
                          )}>
                            {/* Detalles adicionales */}
                            {event.details && (
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-gray-900 mb-1">
                                  Detalles:
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {event.details}
                                </p>
                              </div>
                            )}
                            
                            {/* Metadata */}
                            {event.metadata && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {Object.entries(event.metadata).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-sm text-gray-600 capitalize">
                                      {key.replace('_', ' ')}:
                                    </span>
                                    <span className="text-sm text-gray-900 font-medium">
                                      {value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Acción de click en el evento */}
                        {onEventClick && (
                          <button
                            onClick={() => onEventClick(event)}
                            className="absolute inset-0 w-full h-full bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded"
                            aria-label={`Ver detalles de ${event.title}`}
                          />
                        )}
                      </Card.Content>
                    </Card>
                  </div>
                </div>
              )
            })
          ) : (
            // Estado vacío
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron eventos
              </h3>
              <p className="text-sm text-gray-600">
                {searchTerm || selectedFilters.length > 0
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Aún no hay eventos registrados para esta solicitud'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Componente simplificado para casos básicos
 */
export const SimpleTimeline = ({ events, className = '' }) => {
  return (
    <InteractiveTimeline
      events={events}
      showFilters={false}
      expandable={false}
      className={className}
    />
  )
}

/**
 * Hook para generar eventos de ejemplo/demo
 */
export const useTimelineData = (solicitudId) => {
  return useMemo(() => {
    const baseDate = new Date()
    
    return [
      {
        id: '1',
        type: 'created',
        status: 'success',
        title: 'Solicitud creada',
        description: 'Se creó la solicitud de consulta automática',
        date: new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Solicitud configurada para consulta diaria del radicado judicial',
        metadata: {
          usuario: 'Admin',
          ip: '192.168.1.100',
          version: '1.0.0'
        }
      },
      {
        id: '2',
        type: 'execution',
        status: 'success',
        title: 'Primera ejecución exitosa',
        description: 'Se ejecutó la primera búsqueda automática',
        date: new Date(baseDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Consulta realizada exitosamente. Se encontraron actualizaciones en el proceso.',
        metadata: {
          duracion: '2.3 segundos',
          resultados: '1 actualización',
          servidor: 'RPA-01'
        }
      },
      {
        id: '3',
        type: 'notification',
        status: 'success',
        title: 'Notificación enviada',
        description: 'Se envió notificación por email sobre nuevas actualizaciones',
        date: new Date(baseDate.getTime() - 14 * 24 * 60 * 60 * 1000 + 60000).toISOString(),
        details: 'Email enviado correctamente al usuario configurado.',
        metadata: {
          destinatario: 'usuario@example.com',
          asunto: 'Actualización en proceso judicial',
          estado: 'Entregado'
        }
      },
      {
        id: '4',
        type: 'execution',
        status: 'error',
        title: 'Error en ejecución',
        description: 'Falló la consulta por timeout del servidor',
        date: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'El servidor judicial no respondió dentro del tiempo límite establecido (30 segundos).',
        metadata: {
          error_code: 'TIMEOUT_ERROR',
          duracion: '30.0 segundos',
          reintentos: '3'
        }
      },
      {
        id: '5',
        type: 'config',
        status: 'success',
        title: 'Configuración actualizada',
        description: 'Se modificó la frecuencia de consulta a semanal',
        date: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Usuario cambió la configuración de frecuencia diaria a semanal.',
        metadata: {
          campo_modificado: 'frecuencia_envio',
          valor_anterior: 'diaria',
          valor_nuevo: 'semanal'
        }
      },
      {
        id: '6',
        type: 'execution',
        status: 'success',
        title: 'Ejecución reciente',
        description: 'Última consulta ejecutada exitosamente',
        date: new Date(baseDate.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        details: 'Consulta completada sin novedades. El proceso mantiene su estado anterior.',
        metadata: {
          duracion: '1.8 segundos',
          resultados: 'Sin cambios',
          cache_hit: 'true'
        }
      }
    ]
  }, [solicitudId])
}

export default InteractiveTimeline