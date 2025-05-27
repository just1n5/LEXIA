import React, { useState, useMemo } from 'react'
import { 
  Eye, Edit3, Trash2, Play, Pause, Download, FileText, 
  AlertTriangle, Calendar, Bell, Clock, ChevronDown, ChevronUp,
  BellRing, BellOff
} from 'lucide-react'
import Badge from '../ui/Badge'
import Pagination from '../ui/Pagination'
import SearchInputEnhanced from '../enhanced/SearchInputEnhanced'
import { cn } from '../../utils/cn'
import { searchInFields } from '../../utils/searchUtils'

/**
 * 🆕 TABLA MEJORADA CON COLUMNAS DE FRECUENCIA Y ÚLTIMA NOTIFICACIÓN
 */
const SolicitudesTable = ({
  solicitudes = [],
  isLoading = false,
  onEdit = () => {},
  onView = () => {},
  onDelete = () => {},
  onToggleStatus = () => {},
  onDownload = () => {},
  onExecuteNow = () => {},
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange = () => {},
  className = '',
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  // ===== UTILIDADES DE FORMATEO =====
  
  const truncateText = (text, maxLength = 30) => {
    if (!text) return 'N/A'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin ejecuciones'
    
    try {
      const date = new Date(fecha)
      const ahora = new Date()
      const diferencia = ahora - date
      const minutos = Math.floor(diferencia / (1000 * 60))
      const horas = Math.floor(diferencia / (1000 * 60 * 60))
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
      
      if (dias > 7) {
        return date.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })
      } else if (dias > 0) {
        return `Hace ${dias} día${dias > 1 ? 's' : ''}`
      } else if (horas > 0) {
        return `Hace ${horas}h`
      } else if (minutos > 0) {
        return `Hace ${minutos}m`
      } else {
        return 'Hace poco'
      }
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  // 🆕 NUEVA FUNCIÓN: Formatear última notificación
  const formatearUltimaNotificacion = (solicitud) => {
    const tieneNotificaciones = solicitud.estado === 'activa' || solicitud.estado === 'en_proceso'
    
    if (!tieneNotificaciones) {
      return {
        texto: 'Sin notificaciones',
        icono: BellOff,
        color: 'text-text-secondary',
        titulo: 'No hay notificaciones recientes'
      }
    }

    const ultimaEjecucion = solicitud.ultima_ejecucion
    if (!ultimaEjecucion) {
      return {
        texto: 'Pendiente',
        icono: Bell,
        color: 'text-feedback-warning',
        titulo: 'Esperando primera notificación'
      }
    }

    const fechaNotificacion = new Date(ultimaEjecucion)
    const ahora = new Date()
    const diferencia = ahora - fechaNotificacion
    const horas = Math.floor(diferencia / (1000 * 60 * 60))
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))

    const tipoNotificacion = solicitud.resultados_encontrados > 0 ? 'nueva_actualizacion' : 'sin_cambios'
    
    let notificacionInfo = {
      icono: BellRing,
      color: 'text-feedback-info'
    }

    if (tipoNotificacion === 'nueva_actualizacion') {
      notificacionInfo = {
        icono: BellRing,
        color: 'text-feedback-success',
        titulo: 'Última notificación: Nueva actualización encontrada'
      }
    } else {
      notificacionInfo = {
        icono: Bell,
        color: 'text-feedback-info',
        titulo: 'Última notificación: Sin cambios detectados'
      }
    }

    if (dias > 7) {
      return {
        texto: fechaNotificacion.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        ...notificacionInfo
      }
    } else if (dias > 0) {
      return {
        texto: `Hace ${dias}d`,
        ...notificacionInfo
      }
    } else if (horas > 0) {
      return {
        texto: `Hace ${horas}h`,
        ...notificacionInfo
      }
    } else {
      return {
        texto: 'Reciente',
        ...notificacionInfo
      }
    }
  }

  const getEstadoBadge = (estado) => {
    const estados = {
      'activa': { component: Badge.Active, text: 'Activa' },
      'en_proceso': { component: Badge.Processing, text: 'En Proceso' },
      'pausada': { component: Badge.Warning, text: 'Pausada' },
      'error': { component: Badge.Error, text: 'Error' },
      'completada': { component: Badge.Info, text: 'Completada' }
    }

    const estadoConfig = estados[estado] || { component: Badge, text: estado || 'Desconocido' }
    const BadgeComponent = estadoConfig.component

    return <BadgeComponent size="sm">{estadoConfig.text}</BadgeComponent>
  }

  const getFrecuenciaBadge = (frecuencia) => {
    const frecuencias = {
      'diaria': { 
        variant: 'success', 
        text: 'Diaria',
        description: 'Se ejecuta todos los días',
        icon: '🔄'
      },
      'semanal': { 
        variant: 'info', 
        text: 'Semanal',
        description: 'Se ejecuta cada semana',
        icon: '📅'
      },
      'mensual': { 
        variant: 'warning', 
        text: 'Mensual',
        description: 'Se ejecuta cada mes',
        icon: '🗓️'
      },
      'manual': { 
        variant: 'neutral', 
        text: 'Manual',
        description: 'Solo se ejecuta manualmente',
        icon: '👆'
      }
    }

    const frecuenciaConfig = frecuencias[frecuencia] || { 
      variant: 'neutral', 
      text: frecuencia || 'N/A',
      description: 'Frecuencia no definida',
      icon: '❓'
    }

    return (
      <div 
        className="flex items-center gap-2"
        title={frecuenciaConfig.description}
      >
        <span className="text-sm" aria-hidden="true">{frecuenciaConfig.icon}</span>
        <Badge 
          variant={frecuenciaConfig.variant}
          size="sm"
        >
          {frecuenciaConfig.text}
        </Badge>
      </div>
    )
  }

  // ===== FILTRADO Y ORDENAMIENTO =====
  
  const solicitudesFiltradas = useMemo(() => {
    let filtered = searchInFields(
      solicitudes, 
      searchTerm, 
      ['nombre_descriptivo', 'tipo_busqueda', 'estado', 'frecuencia']
    )

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key]
        let bVal = b[sortConfig.key]

        if (sortConfig.key === 'ultima_ejecucion') {
          aVal = aVal ? new Date(aVal) : new Date(0)
          bVal = bVal ? new Date(bVal) : new Date(0)
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [solicitudes, searchTerm, sortConfig])

  // ===== HANDLERS DE ORDENAMIENTO =====
  
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const SortableHeader = ({ children, sortKey, className = '' }) => (
    <th 
      className={cn('cursor-pointer hover:bg-bg-light transition-colors select-none', className)}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        {children}
        <div className="flex flex-col">
          <ChevronUp 
            className={cn(
              'w-3 h-3',
              sortConfig.key === sortKey && sortConfig.direction === 'asc'
                ? 'text-interactive-default'
                : 'text-text-secondary'
            )}
          />
          <ChevronDown 
            className={cn(
              'w-3 h-3 -mt-1',
              sortConfig.key === sortKey && sortConfig.direction === 'desc'
                ? 'text-interactive-default'
                : 'text-text-secondary'
            )}
          />
        </div>
      </div>
    </th>
  )

  // ===== RENDER PRINCIPAL =====
  
  if (isLoading) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Solicitudes de Consulta</h3>
          <div className="animate-pulse bg-gray-200 h-10 w-64 rounded-md"></div>
        </div>
        
        <div className="p-6">
          {[...Array(itemsPerPage)].map((_, index) => (
            <div key={index} className="flex space-x-4 mb-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded flex-[3]"></div>
              <div className="h-4 bg-gray-200 rounded flex-[2]"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded flex-[2]"></div>
              <div className="h-4 bg-gray-200 rounded flex-[2]"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (solicitudes.length === 0) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Solicitudes de Consulta</h3>
        </div>
        
        <div className="table-empty-state">
          <div className="flex justify-center mb-6">
            <FileText className="w-16 h-16 text-text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-text-base mb-2">
            No tienes solicitudes registradas
          </h3>
          <p className="text-text-secondary mb-6">
            Crea tu primera solicitud para comenzar a monitorear procesos judiciales
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('table-container', className)} {...props}>
      {/* Header con búsqueda */}
      <div className="table-header">
        <h3 className="table-title">
          Solicitudes de Consulta
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({solicitudesFiltradas.length} de {solicitudes.length})
          </span>
        </h3>
        
        <SearchInputEnhanced
          placeholder="Buscar por nombre, tipo, estado o frecuencia..."
          value={searchTerm}
          onSearch={setSearchTerm}
          className="table-search"
          showSuggestions={true}
          suggestions={[
            ...new Set(solicitudes.map(s => s.nombre_descriptivo).filter(Boolean)),
            'Número de Radicado',
            'Nombre/Razón Social',
            'Activa', 'Pausada', 'En Proceso', 'Completada', 'Error',
            'Diaria', 'Semanal', 'Mensual', 'Manual'
          ]}
          maxSuggestions={8}
          onSuggestionSelect={setSearchTerm}
        />
      </div>

      {/* 🆕 TABLA RESPONSIVE CON NUEVAS COLUMNAS */}
      <div className="overflow-x-auto">
        <table className="solicitudes-table">
          <thead>
            <tr>
              <SortableHeader sortKey="nombre_descriptivo" className="w-1/5 min-w-0">
                Nombre Descriptivo
              </SortableHeader>
              <th className="hidden lg:table-cell w-1/6">Tipo de Búsqueda</th>
              <SortableHeader sortKey="frecuencia" className="hidden md:table-cell w-1/6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Frecuencia
                </div>
              </SortableHeader>
              <SortableHeader sortKey="estado" className="w-1/8">
                Estado
              </SortableHeader>
              <SortableHeader sortKey="ultima_ejecucion" className="hidden lg:table-cell w-1/6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Última Ejecución
                </div>
              </SortableHeader>
              <th className="hidden xl:table-cell w-1/6">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Última Notificación
                </div>
              </th>
              <th className="w-1/8">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudesFiltradas.map((solicitud, index) => {
              const ultimaNotificacion = formatearUltimaNotificacion(solicitud)
              const IconoNotificacion = ultimaNotificacion.icono

              return (
                <tr key={solicitud.id || index}>
                  {/* Nombre Descriptivo */}
                  <td className="w-1/5 min-w-0">
                    <div className="flex flex-col max-w-xs">
                      <button
                        className="font-medium text-text-primary leading-tight cursor-pointer hover:text-interactive-default text-left transition-colors truncate"
                        onClick={() => onView(solicitud)}
                        title={solicitud.nombre_descriptivo}
                      >
                        {truncateText(solicitud.nombre_descriptivo, 25)}
                      </button>
                      
                      {/* 🆕 INFO MÓVIL MEJORADA */}
                      <div className="md:hidden mt-2 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <span>{solicitud.tipo_busqueda}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {getFrecuenciaBadge(solicitud.frecuencia)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <Clock className="w-3 h-3" />
                          <span>Ejecutado: {formatearFecha(solicitud.ultima_ejecucion)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <IconoNotificacion className={cn('w-3 h-3', ultimaNotificacion.color)} />
                          <span className={ultimaNotificacion.color}>
                            {ultimaNotificacion.texto}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tipo de Búsqueda */}
                  <td className="hidden lg:table-cell">
                    <span className="text-sm text-text-secondary">
                      {solicitud.tipo_busqueda}
                    </span>
                  </td>

                  {/* 🆕 FRECUENCIA CON ICONOS */}
                  <td className="hidden md:table-cell">
                    {getFrecuenciaBadge(solicitud.frecuencia)}
                  </td>

                  {/* Estado */}
                  <td>
                    {getEstadoBadge(solicitud.estado)}
                  </td>

                  {/* Última Ejecución */}
                  <td className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-text-secondary" />
                      <span className="text-sm text-text-secondary">
                        {formatearFecha(solicitud.ultima_ejecucion)}
                      </span>
                    </div>
                  </td>

                  {/* 🆕 NUEVA COLUMNA: Última Notificación */}
                  <td className="hidden xl:table-cell">
                    <div 
                      className="flex items-center gap-2"
                      title={ultimaNotificacion.titulo}
                    >
                      <IconoNotificacion className={cn('w-4 h-4', ultimaNotificacion.color)} />
                      <span className={cn('text-sm', ultimaNotificacion.color)}>
                        {ultimaNotificacion.texto}
                      </span>
                    </div>
                  </td>

                  {/* 🆕 ACCIONES MEJORADAS */}
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => onView(solicitud)}
                        className="table-action-btn"
                        title="Ver detalles"
                        aria-label="Ver detalles de la solicitud"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onEdit(solicitud)}
                        className="table-action-btn"
                        title="Editar solicitud"
                        aria-label="Editar solicitud"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      
                      {/* Ejecutar ahora - Solo si está activa */}
                      {solicitud.estado === 'activa' && onExecuteNow && (
                        <button
                          onClick={() => onExecuteNow(solicitud)}
                          className="table-action-btn action-success"
                          title="Ejecutar consulta ahora"
                          aria-label="Ejecutar consulta ahora"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => onToggleStatus(solicitud)}
                        className={cn(
                          'table-action-btn',
                          solicitud.estado === 'activa' 
                            ? 'action-warning' 
                            : 'action-success'
                        )}
                        title={solicitud.estado === 'activa' ? 'Pausar' : 'Activar'}
                        aria-label={solicitud.estado === 'activa' ? 'Pausar solicitud' : 'Activar solicitud'}
                      >
                        {solicitud.estado === 'activa' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => onDelete(solicitud)}
                        className="table-action-btn action-danger"
                        title="Eliminar solicitud"
                        aria-label="Eliminar solicitud"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Info adicional móvil */}
      <div className="md:hidden table-mobile-info">
        <div className="flex justify-between items-center">
          <span>Toca el nombre para ver detalles completos</span>
          <span>{solicitudesFiltradas.length} solicitudes</span>
        </div>
      </div>

      {/* Paginación */}
      {totalItems > itemsPerPage && (
        <div className="border-t border-border-default bg-bg-light px-6 py-4">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
            showInfo={true}
          />
        </div>
      )}

      {/* 🆕 LEYENDA DE ESTADOS */}
      {solicitudesFiltradas.length > 0 && (
        <div className="border-t border-border-default bg-bg-light px-6 py-3">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-text-primary transition-colors">
              <span>Leyenda de estados y frecuencias</span>
              <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h5 className="font-medium text-text-primary mb-2">Estados:</h5>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge.Active size="sm">Activa</Badge.Active>
                    <span className="text-text-secondary">Monitoreando automáticamente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge.Warning size="sm">Pausada</Badge.Warning>
                    <span className="text-text-secondary">Temporalmente deshabilitada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge.Processing size="sm">En Proceso</Badge.Processing>
                    <span className="text-text-secondary">Ejecutándose actualmente</span>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-text-primary mb-2">Frecuencias:</h5>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span>🔄</span>
                    <span className="text-text-secondary">Diaria: Cada 24 horas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span className="text-text-secondary">Semanal: Cada 7 días</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👆</span>
                    <span className="text-text-secondary">Manual: Solo cuando lo ejecutes</span>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}

SolicitudesTable.displayName = 'SolicitudesTable'

export default SolicitudesTable