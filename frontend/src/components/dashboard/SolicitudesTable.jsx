// src/components/dashboard/SolicitudesTable.jsx - TABLA OPTIMIZADA DE SOLICITUDES
import React, { useState, useMemo } from 'react'
import { 
  Eye, Edit3, Trash2, Download, FileText, 
  AlertTriangle, Bell, Clock, ChevronDown, ChevronUp,
  BellRing, BellOff, ChevronLeft, ChevronRight
} from 'lucide-react'
import Badge from '../ui/Badge'
import Pagination from '../ui/Pagination'
import SearchInputEnhanced from '../enhanced/SearchInputEnhanced'
import { cn } from '../../utils/cn'
import { searchInFields } from '../../utils/searchUtils'

/**
 * 🚀 TABLA DE SOLICITUDES - OPTIMIZADA SIN COLUMNA DE FRECUENCIA
 * Tabla principal para mostrar y gestionar las solicitudes de consulta judicial
 * con acciones integradas y paginación.
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
  
  const truncateText = (text, maxLength = 40) => {
    if (!text) return 'N/A'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // 🆕 FUNCIÓN: Formatear nombre con salto de línea si es necesario
  const formatearNombreDescriptivo = (nombre) => {
    if (!nombre) return 'N/A'
    
    // Si el nombre es muy largo, lo dividimos en palabras
    const palabras = nombre.split(' ')
    if (palabras.length <= 2 || nombre.length <= 28) {
      return { linea1: nombre, linea2: null }
    }
    
    // Para espacio más reducido, dividimos más agresivamente
    const mitad = Math.ceil(palabras.length / 2)
    const primeraLinea = palabras.slice(0, mitad).join(' ')
    const segundaLinea = palabras.slice(mitad).join(' ')
    
    // Si la primera línea es muy larga, intentamos una división diferente
    if (primeraLinea.length > 25) {
      const tercio = Math.ceil(palabras.length / 3)
      return {
        linea1: palabras.slice(0, tercio).join(' '),
        linea2: palabras.slice(tercio).join(' ')
      }
    }
    
    return {
      linea1: primeraLinea,
      linea2: segundaLinea
    }
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

  // 🆕 FUNCIÓN: Formatear última notificación
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

  // Función getFrecuenciaBadge removida - ya no se usa la columna de frecuencia

  // ===== FILTRADO Y ORDENAMIENTO =====
  
  const solicitudesFiltradas = useMemo(() => {
    let filtered = searchInFields(
      solicitudes, 
      searchTerm, 
      ['nombre_descriptivo', 'tipo_busqueda', 'estado']
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

  // ===== LOADING Y EMPTY STATES =====
  
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
          placeholder="Buscar por nombre, estado o tipo..."
          value={searchTerm}
          onSearch={setSearchTerm}
          className="table-search"
          showSuggestions={true}
          suggestions={[
            ...new Set(solicitudes.map(s => s.nombre_descriptivo).filter(Boolean)),
            'Activa', 'Pausada', 'En Proceso', 'Completada', 'Error'
          ]}
          maxSuggestions={8}
          onSuggestionSelect={setSearchTerm}
        />
      </div>

      {/* 🚀 TABLA COMPLETAMENTE OPTIMIZADA - CADA COLUMNA CON ESPACIO EXACTO */}
      <div className="overflow-x-auto">
        <table className="solicitudes-table" style={{ tableLayout: 'fixed', width: '100%', borderSpacing: '0' }}>
          <thead>
            <tr>
              {/* ✅ DISTRIBUCIÓN OPTIMIZADA - CADA COLUMNA CON ESPACIO EXACTO */}
              <SortableHeader sortKey="nombre_descriptivo" className="w-[27%] px-4 py-3">
                Nombre Descriptivo
              </SortableHeader>
              <SortableHeader sortKey="estado" className="w-[12%] px-3 py-3">
                Estado
              </SortableHeader>
              <SortableHeader sortKey="ultima_ejecucion" className="w-[20%] px-3 py-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Última Ejecución
                </div>
              </SortableHeader>
              <th className="w-[26%] px-3 py-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Última Notificación
                </div>
              </th>
              <th className="w-[15%] px-3 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudesFiltradas.map((solicitud, index) => {
              const ultimaNotificacion = formatearUltimaNotificacion(solicitud)
              const IconoNotificacion = ultimaNotificacion.icono
              const nombreFormateado = formatearNombreDescriptivo(solicitud.nombre_descriptivo)

              return (
                <tr key={solicitud.id || index} className="h-16 border-b border-border-default hover:bg-bg-light transition-colors">
                  {/* ✅ Nombre Descriptivo - 27% balanceado */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <button
                        className="font-medium text-text-primary leading-tight cursor-pointer hover:text-interactive-default text-left transition-colors"
                        onClick={() => onView(solicitud)}
                        title={solicitud.nombre_descriptivo}
                      >
                        <div className="leading-tight">
                          <div>{nombreFormateado.linea1}</div>
                          {nombreFormateado.linea2 && (
                            <div className="text-sm text-text-secondary">{nombreFormateado.linea2}</div>
                          )}
                        </div>
                      </button>
                    </div>
                  </td>

                  {/* ✅ Estado - 12% compacto y eficiente */}
                  <td className="px-2 py-3">
                    <div className="flex justify-center">
                      {getEstadoBadge(solicitud.estado)}
                    </div>
                  </td>

                  {/* ✅ Última Ejecución - 20% optimizado */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2 justify-start">
                      <Clock className="w-4 h-4 text-text-secondary flex-shrink-0" />
                      <span className="text-sm text-text-secondary">
                        {formatearFecha(solicitud.ultima_ejecucion)}
                      </span>
                    </div>
                  </td>

                  {/* ✅ Última Notificación - 26% prioritario */}
                  <td className="px-3 py-3">
                    <div 
                      className="flex items-center gap-2 justify-start"
                      title={ultimaNotificacion.titulo}
                    >
                      <IconoNotificacion className={cn('w-4 h-4 flex-shrink-0', ultimaNotificacion.color)} />
                      <span className={cn('text-sm', ultimaNotificacion.color)}>
                        {ultimaNotificacion.texto}
                      </span>
                    </div>
                  </td>

                  {/* ✅ Acciones - 15% amplio y cómodo */}
                  <td className="px-2 py-3">
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => onView(solicitud)}
                        className="table-action-btn p-2 hover:bg-interactive-default hover:bg-opacity-10 rounded transition-colors"
                        title="Ver detalles"
                        aria-label="Ver detalles de la solicitud"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onEdit(solicitud)}
                        className="table-action-btn p-2 hover:bg-interactive-default hover:bg-opacity-10 rounded transition-colors"
                        title="Editar solicitud"
                        aria-label="Editar solicitud"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onDelete(solicitud)}
                        className="table-action-btn action-danger p-2 hover:bg-feedback-error hover:bg-opacity-10 rounded transition-colors"
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

      {/* 🚀 PAGINACIÓN CON COHERENCIA VISUAL */}
      <div className="border-t border-border-default bg-bg-light px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Información de resultados */}
          <div className="text-sm text-text-secondary">
            Mostrando <span className="font-medium text-text-primary">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
            <span className="font-medium text-text-primary">{Math.min(currentPage * itemsPerPage, totalItems)}</span> de{' '}
            <span className="font-medium text-text-primary">{totalItems}</span> solicitudes
          </div>
          
          {/* Controles de paginación */}
          <div className="flex items-center gap-2">
            {/* Botón anterior */}
            <button
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className={cn(
                'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                currentPage > 1
                  ? 'text-text-primary bg-white border border-border-default hover:bg-bg-light'
                  : 'text-text-secondary bg-gray-100 border border-border-disabled cursor-not-allowed'
              )}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            {/* Indicador de página actual */}
            <div className="flex items-center gap-1">
              {Math.ceil(totalItems / itemsPerPage) > 1 && (
                <>
                  {/* Página 1 si no está visible */}
                  {currentPage > 2 && (
                    <>
                      <button
                        onClick={() => onPageChange(1)}
                        className="px-3 py-2 text-sm font-medium text-text-primary bg-white border border-border-default rounded-md hover:bg-bg-light transition-colors"
                      >
                        1
                      </button>
                      {currentPage > 3 && (
                        <span className="px-2 py-2 text-sm text-text-secondary">...</span>
                      )}
                    </>
                  )}

                  {/* Página anterior */}
                  {currentPage > 1 && (
                    <button
                      onClick={() => onPageChange(currentPage - 1)}
                      className="px-3 py-2 text-sm font-medium text-text-primary bg-white border border-border-default rounded-md hover:bg-bg-light transition-colors"
                    >
                      {currentPage - 1}
                    </button>
                  )}

                  {/* Página actual */}
                  <button
                    className="px-3 py-2 text-sm font-medium text-white bg-interactive-default border border-interactive-default rounded-md"
                    aria-current="page"
                  >
                    {currentPage}
                  </button>

                  {/* Página siguiente */}
                  {currentPage < Math.ceil(totalItems / itemsPerPage) && (
                    <button
                      onClick={() => onPageChange(currentPage + 1)}
                      className="px-3 py-2 text-sm font-medium text-text-primary bg-white border border-border-default rounded-md hover:bg-bg-light transition-colors"
                    >
                      {currentPage + 1}
                    </button>
                  )}

                  {/* Última página si no está visible */}
                  {currentPage < Math.ceil(totalItems / itemsPerPage) - 1 && (
                    <>
                      {currentPage < Math.ceil(totalItems / itemsPerPage) - 2 && (
                        <span className="px-2 py-2 text-sm text-text-secondary">...</span>
                      )}
                      <button
                        onClick={() => onPageChange(Math.ceil(totalItems / itemsPerPage))}
                        className="px-3 py-2 text-sm font-medium text-text-primary bg-white border border-border-default rounded-md hover:bg-bg-light transition-colors"
                      >
                        {Math.ceil(totalItems / itemsPerPage)}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
            
            {/* Botón siguiente */}
            <button
              onClick={() => currentPage < Math.ceil(totalItems / itemsPerPage) && onPageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
              className={cn(
                'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                currentPage < Math.ceil(totalItems / itemsPerPage)
                  ? 'text-text-primary bg-white border border-border-default hover:bg-bg-light'
                  : 'text-text-secondary bg-gray-100 border border-border-disabled cursor-not-allowed'
              )}
              aria-label="Página siguiente"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Leyenda de estados */}
      {solicitudesFiltradas.length > 0 && (
        <div className="border-t border-border-default bg-bg-light px-6 py-3">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-text-primary transition-colors">
              <span>Leyenda de estados</span>
              <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-3 text-xs">
              <div>
                <h5 className="font-medium text-text-primary mb-2">Estados de las solicitudes:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                  <div className="flex items-center gap-2">
                    <Badge.Error size="sm">Error</Badge.Error>
                    <span className="text-text-secondary">Requiere atención</span>
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