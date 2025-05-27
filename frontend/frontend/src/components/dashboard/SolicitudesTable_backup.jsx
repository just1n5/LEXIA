import React, { useState } from 'react'
import { Eye, Edit3, Trash2, Play, Pause, Download, FileText, AlertTriangle } from 'lucide-react'
import Badge from '../ui/Badge'
import Pagination from '../ui/Pagination'
import SearchInputEnhanced from '../enhanced/SearchInputEnhanced'
import { cn } from '../../utils/cn'
import { searchInFields } from '../../utils/searchUtils'

/**
 * Tabla de solicitudes mejorada con responsive design y mejores interacciones
 */
const SolicitudesTable = ({
  solicitudes = [],
  isLoading = false,
  onEdit = () => {},
  onView = () => {},
  onDelete = () => {},
  onToggleStatus = () => {},
  onDownload = () => {},
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange = () => {},
  className = '',
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  // Utilidades de formateo
  const truncateText = (text, maxLength = 40) => {
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
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
      const horas = Math.floor(diferencia / (1000 * 60 * 60))
      
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
      } else {
        return 'Hace poco'
      }
    } catch (error) {
      return 'Fecha inválida'
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
      'diaria': { variant: 'success', text: 'Diaria' },
      'semanal': { variant: 'info', text: 'Semanal' },
      'mensual': { variant: 'warning', text: 'Mensual' },
      'manual': { variant: 'neutral', text: 'Manual' }
    }

    const frecuenciaConfig = frecuencias[frecuencia] || { variant: 'neutral', text: frecuencia || 'N/A' }

    return (
      <Badge 
        variant={frecuenciaConfig.variant}
        size="sm"
      >
        {frecuenciaConfig.text}
      </Badge>
    )
  }

  // 🚀 ENHANCED: Filtrar solicitudes SIN TILDES usando searchUtils
  const solicitudesFiltradas = searchInFields(
    solicitudes, 
    searchTerm, 
    ['nombre_descriptivo', 'tipo_busqueda', 'estado', 'frecuencia']
  )

  // Estados de carga y vacío
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
              <div className="h-4 bg-gray-200 rounded flex-[2]"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
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
          placeholder="Buscar por nombre, tipo o estado..."
          value={searchTerm}
          onSearch={setSearchTerm}
          className="table-search"
          // 🚀 ENHANCED: Sugerencias inteligentes basadas en los datos
          showSuggestions={true}
          suggestions={[
            // Extraer nombres únicos de solicitudes existentes
            ...new Set(solicitudes.map(s => s.nombre_descriptivo).filter(Boolean)),
            // Tipos de búsqueda comunes
            'Número de Radicado',
            'Nombre/Razón Social',
            // Estados posibles
            'Activa',
            'Pausada', 
            'En Proceso',
            'Completada',
            'Error',
            // Términos comunes de búsqueda
            'proceso',
            'demanda',
            'consulta',
            'expediente',
            'Juan Pérez',
            'María García',
            'Carlos López'
          ]}
          maxSuggestions={6}
          onSuggestionSelect={(suggestion) => {
            setSearchTerm(suggestion)
          }}
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="solicitudes-table">
          <thead>
            <tr>
              <th>Nombre Descriptivo</th>
              <th className="table-cell">Tipo de Búsqueda</th>
              <th className="hidden sm:table-cell">Frecuencia</th>
              <th>Estado</th>
              <th className="hidden md:table-cell">Última Ejecución</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudesFiltradas.map((solicitud, index) => (
              <tr key={solicitud.id || index}>
                {/* Nombre Descriptivo */}
                <td>
                  <div className="flex flex-col">
                    <button
                      className="font-medium text-text-primary leading-tight cursor-pointer hover:text-interactive-default text-left transition-colors"
                      onClick={() => onView(solicitud)}
                      title={solicitud.nombre_descriptivo}
                    >
                      {truncateText(solicitud.nombre_descriptivo, 50)}
                    </button>
                    {/* Info adicional en móvil - Solo en pantallas muy pequeñas */}
                    <div className="sm:hidden mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-secondary">
                          {solicitud.tipo_busqueda}
                        </span>
                        <span className="text-xs text-text-secondary">•</span>
                        {getFrecuenciaBadge(solicitud.frecuencia)}
                      </div>
                      <div className="text-xs text-text-secondary">
                        Última ejecución: {formatearFecha(solicitud.ultima_ejecucion)}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Tipo de Búsqueda - SIEMPRE VISIBLE */}
                <td className="table-cell">
                  <span className="text-sm text-text-secondary">
                    {solicitud.tipo_busqueda}
                  </span>
                </td>

                {/* Frecuencia - Mostrar desde sm (640px+) */}
                <td className="hidden sm:table-cell">
                  {getFrecuenciaBadge(solicitud.frecuencia)}
                </td>

                {/* Estado - visible siempre */}
                <td>
                  {getEstadoBadge(solicitud.estado)}
                </td>

                {/* Última Ejecución - Mostrar desde md (768px+) */}
                <td className="hidden md:table-cell">
                  <span className="text-sm text-text-secondary">
                    {formatearFecha(solicitud.ultima_ejecucion)}
                  </span>
                </td>

                {/* Acciones */}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Info adicional móvil */}
      <div className="sm:hidden table-mobile-info">
        <div className="flex justify-between items-center">
          <span>Toca el nombre para ver detalles</span>
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
    </div>
  )
}

SolicitudesTable.displayName = 'SolicitudesTable'

export default SolicitudesTable
