import React from 'react'
import { FileText, Download, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import LoadingSpinner from '../ui/LoadingSpinner'
import EmptyState from '../ui/EmptyState'

/**
 * Tabla de historial con las columnas exactas del prototipo
 * Solicitud | Fecha de Consulta | Número de Radicado | Despacho/Juzgado | Fecha Último Auto | Acciones
 * 🔄 ACTUALIZADA: Paginación coherente con SolicitudesTable
 */
const HistorialTable = ({
  data = [],
  isLoading = false,
  onViewDetails = () => {},
  onDownload = () => {},
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange = () => {},
  className = '',
  ...props
}) => {

  // Utilidades de formateo
  const formatearFechaConsulta = (fecha) => {
    if (!fecha) return 'Sin fecha'
    
    try {
      const date = new Date(fecha)
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  const formatearFechaUltimoAuto = (fecha) => {
    if (!fecha) return 'Sin actuaciones'
    
    try {
      const date = new Date(fecha)
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'exitoso':
        return <Badge variant="success">Exitoso</Badge>
      case 'error_captcha':
        return <Badge variant="warning">Error Captcha</Badge>
      case 'error_sistema':
        return <Badge variant="error">Error Sistema</Badge>
      case 'pendiente':
        return <Badge variant="info">Pendiente</Badge>
      default:
        return <Badge variant="neutral">{estado || 'Desconocido'}</Badge>
    }
  }

  const truncateText = (text, maxLength = 50) => {
    if (!text) return 'N/A'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Estados de carga y vacío
  if (isLoading) {
    return (
      <div className="table-container">
        <LoadingSpinner.TableSkeleton 
          rows={itemsPerPage} 
          columns={6}
          showActions={true}
        />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="table-container">
        <EmptyState.Preset preset="historialEmpty" />
      </div>
    )
  }

  return (
    <div className={cn('table-container', className)} {...props}>
      {/* Info de resultados */}
      {totalItems > 0 && (
        <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50 border-b border-gray-200">
          {totalItems} resultado{totalItems !== 1 ? 's' : ''} encontrado{totalItems !== 1 ? 's' : ''}
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Solicitud
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Fecha de Consulta
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Número de Radicado
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">
                Despacho/Juzgado
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">
                Fecha Último Auto
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((item, index) => (
              <tr 
                key={item.id || index} 
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {/* Solicitud */}
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 leading-tight">
                      {truncateText(item.solicitud_alias, 40)}
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      {getEstadoBadge(item.estado_extraccion)}
                    </div>
                  </div>
                </td>

                {/* Fecha de Consulta */}
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-900">
                    {formatearFechaConsulta(item.fecha_ejecucion)}
                  </span>
                </td>

                {/* Número de Radicado */}
                <td className="px-4 py-4">
                  <span className="text-sm font-mono text-gray-900 break-all">
                    {item.numero_radicado_completo || 'N/A'}
                  </span>
                </td>

                {/* Despacho/Juzgado */}
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className="text-sm text-gray-900" title={item.despacho_juzgado}>
                    {truncateText(item.despacho_juzgado, 45)}
                  </span>
                </td>

                {/* Fecha Último Auto */}
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-sm text-gray-900">
                    {formatearFechaUltimoAuto(item.fecha_ultimo_auto)}
                  </span>
                </td>

                {/* Acciones */}
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(item)}
                      icon={<FileText className="w-4 h-4" />}
                      title="Ver detalles completos"
                      className="hover:bg-blue-50 hover:text-blue-600"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(item)}
                      icon={<Download className="w-4 h-4" />}
                      title="Descargar PDF"
                      className="hover:bg-green-50 hover:text-green-600"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Información móvil adicional */}
      <div className="lg:hidden">
        {data.map((item, index) => (
          <div key={`mobile-${item.id || index}`} className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
            <div className="flex justify-between">
              <span>Despacho: {truncateText(item.despacho_juzgado, 30)}</span>
              <span>Último Auto: {formatearFechaUltimoAuto(item.fecha_ultimo_auto)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 🚀 PAGINACIÓN CON COHERENCIA VISUAL - IGUAL A SOLICITUDESTABLE */}
      {Math.ceil(totalItems / itemsPerPage) > 1 && (
        <div className="border-t border-border-default bg-bg-light px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Información de resultados */}
            <div className="text-sm text-text-secondary">
              Mostrando <span className="font-medium text-text-primary">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
              <span className="font-medium text-text-primary">{Math.min(currentPage * itemsPerPage, totalItems)}</span> de{' '}
              <span className="font-medium text-text-primary">{totalItems}</span> resultados
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
      )}
    </div>
  )
}

HistorialTable.displayName = 'HistorialTable'

export default HistorialTable