import React, { useState, useMemo, useCallback } from 'react'
import { FileText, Download, Eye, ChevronUp, ChevronDown, MoreHorizontal, CheckSquare, Square, Trash2, Archive, ChevronLeft, ChevronRight, Settings, Columns, Filter } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import LoadingSpinner from '../ui/LoadingSpinner'

/**
 * ✨ ADVANCED TABLE - Funcionalidad avanzada SIN duplicación de estado
 * Tabla con sorting real, gestión de columnas, filtros avanzados
 * Estado solo aparece como badge bajo el nombre de la solicitud
 */
const AdvancedHistorialTable = ({
  data = [],
  isLoading = false,
  onViewDetails = () => {},
  onDownload = () => {},
  onBulkAction = () => {},
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange = () => {},
  className = '',
  ...props
}) => {
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [showColumnManager, setShowColumnManager] = useState(false)
  
  // ✅ FIXED: Eliminada la columna 'estado' - estado solo aparece bajo el nombre
  const [visibleColumns, setVisibleColumns] = useState({
    solicitud: true,
    fecha_consulta: true,
    radicado: true,
    despacho: true,
    fecha_auto: true
    // ❌ Eliminado: estado: true
  })

  // ✅ FIXED: Configuración de columnas sin la columna 'estado' independiente
  const columnConfig = {
    solicitud: {
      key: 'solicitud_alias',
      label: 'Solicitud',
      sortable: true,
      width: 'w-48',
      required: true // No se puede ocultar
    },
    fecha_consulta: {
      key: 'fecha_ejecucion',
      label: 'Fecha de Consulta',
      sortable: true,
      width: 'w-36'
    },
    radicado: {
      key: 'numero_radicado_completo',
      label: 'Número de Radicado',
      sortable: true,
      width: 'w-44'
    },
    despacho: {
      key: 'despacho_juzgado',
      label: 'Despacho/Juzgado',
      sortable: true,
      width: 'w-64',
      responsive: 'hidden lg:table-cell'
    },
    fecha_auto: {
      key: 'fecha_ultimo_auto',
      label: 'Fecha Último Auto',
      sortable: true,
      width: 'w-32',
      responsive: 'hidden md:table-cell'
    }
    // ❌ Eliminado: configuración de columna 'estado'
  }

  // Datos ordenados con mejor algoritmo (incluyendo sorting por estado si es necesario)
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]
      
      // ✅ FIXED: Permitir sorting por estado_extraccion desde otras funciones
      if (sortConfig.key === 'estado_extraccion') {
        aValue = a.estado_extraccion
        bValue = b.estado_extraccion
      }
      
      // Manejar valores nulos/undefined
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1
      
      // Ordenamiento por tipo de dato
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const result = aValue.localeCompare(bValue, 'es', { numeric: true })
        return sortConfig.direction === 'asc' ? result : -result
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        const result = aValue.getTime() - bValue.getTime()
        return sortConfig.direction === 'asc' ? result : -result
      }
      
      // Fallback para otros tipos
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortConfig])

  // Handlers mejorados
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  const toggleSelectAll = useCallback(() => {
    if (selectedItems.size === sortedData.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(sortedData.map(item => item.id)))
    }
  }, [selectedItems.size, sortedData])

  const toggleSelectItem = useCallback((id) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev)
      if (newSelected.has(id)) {
        newSelected.delete(id)
      } else {
        newSelected.add(id)
      }
      return newSelected
    })
  }, [])

  const handleBulkActionClick = useCallback((action) => {
    const selectedData = sortedData.filter(item => selectedItems.has(item.id))
    onBulkAction(action, selectedData)
    setSelectedItems(new Set()) // Clear selection after action
  }, [sortedData, selectedItems, onBulkAction])

  const toggleColumnVisibility = useCallback((column) => {
    if (columnConfig[column].required) return // No permitir ocultar columnas requeridas
    
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }))
  }, [])

  // Utilidades de formateo optimizadas
  const formatearFechaConsulta = useCallback((fecha) => {
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
  }, [])

  const formatearFechaUltimoAuto = useCallback((fecha) => {
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
  }, [])

  const getEstadoBadge = useCallback((estado) => {
    const variants = {
      exitoso: { variant: 'success', label: 'Exitoso' },
      error_captcha: { variant: 'warning', label: 'Error Captcha' },
      error_sistema: { variant: 'error', label: 'Error Sistema' },
      pendiente: { variant: 'info', label: 'Pendiente' }
    }
    
    const config = variants[estado] || { variant: 'neutral', label: estado || 'Desconocido' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }, [])

  const truncateText = useCallback((text, maxLength = 50) => {
    if (!text) return 'N/A'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }, [])

  // Componente de header sorteable mejorado
  const SortHeader = ({ column, children, className = '' }) => {
    const config = columnConfig[column]
    if (!config.sortable) {
      return (
        <th className={cn('px-lg py-sm text-left text-body-auxiliary font-medium text-text-secondary', className)}>
          {children}
        </th>
      )
    }

    const isActive = sortConfig.key === config.key
    
    return (
      <th 
        className={cn(
          'px-lg py-sm text-left text-body-auxiliary font-medium text-text-secondary cursor-pointer hover:bg-bg-light transition-default select-none group',
          className
        )}
        onClick={() => handleSort(config.key)}
      >
        <div className="flex items-center space-x-xs">
          <span className="group-hover:text-text-primary transition-default">{children}</span>
          <div className="flex flex-col opacity-50 group-hover:opacity-100 transition-default">
            <ChevronUp 
              className={cn(
                'w-3 h-3',
                isActive && sortConfig.direction === 'asc' 
                  ? 'text-interactive-default opacity-100' 
                  : 'text-border-default'
              )} 
            />
            <ChevronDown 
              className={cn(
                'w-3 h-3 -mt-0.5',
                isActive && sortConfig.direction === 'desc' 
                  ? 'text-interactive-default opacity-100' 
                  : 'text-border-default'
              )} 
            />
          </div>
        </div>
      </th>
    )
  }

  // Column Manager Modal (actualizado sin la columna estado)
  const ColumnManager = () => (
    <div className="absolute top-full right-0 mt-xs bg-bg-canvas border border-border-default rounded-lg shadow-lg z-50 p-sm min-w-48">
      <div className="pb-sm mb-sm border-b border-border-default">
        <h4 className="text-body-paragraph font-medium text-text-primary">Columnas visibles</h4>
        <p className="text-body-auxiliary text-text-secondary mt-xs">
          El estado aparece bajo el nombre de la solicitud
        </p>
      </div>
      
      <div className="space-y-xs">
        {Object.entries(columnConfig).map(([key, config]) => (
          <label 
            key={key}
            className={cn(
              'flex items-center space-x-sm p-xs rounded hover:bg-bg-light transition-default cursor-pointer',
              config.required && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input
              type="checkbox"
              checked={visibleColumns[key]}
              onChange={() => toggleColumnVisibility(key)}
              disabled={config.required}
              className="w-4 h-4 text-interactive-default rounded border-border-default focus:ring-interactive-default focus:ring-2"
            />
            <span className="text-body-auxiliary text-text-base">
              {config.label}
              {config.required && <span className="text-text-secondary ml-xs">(requerida)</span>}
            </span>
          </label>
        ))}
      </div>
      
      <div className="pt-sm mt-sm border-t border-border-default">
        <Button
          variant="link"
          size="sm"
          onClick={() => setShowColumnManager(false)}
          className="w-full justify-center text-interactive-default"
        >
          Cerrar
        </Button>
      </div>
    </div>
  )

  // Estados de carga
  if (isLoading) {
    return (
      <div className="bg-bg-canvas rounded-lg border border-border-default shadow-sm">
        <LoadingSpinner.TableSkeleton 
          rows={itemsPerPage} 
          columns={Object.keys(visibleColumns).filter(key => visibleColumns[key]).length + 2}
          showActions={true}
        />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-bg-canvas rounded-lg border border-border-default shadow-sm p-xl text-center">
        <div className="text-heading-h3 font-heading text-text-secondary mb-sm">Sin datos</div>
        <p className="text-body-paragraph text-text-secondary">No hay resultados para mostrar</p>
      </div>
    )
  }

  return (
    <div className={cn('bg-bg-canvas rounded-lg border border-border-default shadow-sm', className)} {...props}>
      
      {/* Enhanced Bulk Actions Header */}
      {selectedItems.size > 0 && (
        <div className="px-lg py-sm bg-interactive-default bg-opacity-10 border-b border-interactive-hover">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-sm">
              <span className="text-body-paragraph font-medium text-text-primary">
                {selectedItems.size} elemento{selectedItems.size !== 1 ? 's' : ''} seleccionado{selectedItems.size !== 1 ? 's' : ''}
              </span>
              <Button
                variant="link"
                size="sm"
                onClick={() => setSelectedItems(new Set())}
                className="text-text-secondary hover:text-text-primary"
              >
                Deseleccionar todo
              </Button>
            </div>
            
            <div className="flex items-center space-x-sm">
              <Button
                variant="secondary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => handleBulkActionClick('download')}
              >
                Descargar PDFs ({selectedItems.size})
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                icon={<Archive className="w-4 h-4" />}
                onClick={() => handleBulkActionClick('archive')}
              >
                Archivar
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => handleBulkActionClick('delete')}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Results Header */}
      <div className="px-lg py-sm text-body-auxiliary text-text-secondary bg-bg-light border-b border-border-default">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-lg">
            <span>{totalItems} resultado{totalItems !== 1 ? 's' : ''} encontrado{totalItems !== 1 ? 's' : ''}</span>
            {sortConfig.key && (
              <span className="text-interactive-default">
                Ordenado por {columnConfig[Object.keys(columnConfig).find(k => columnConfig[k].key === sortConfig.key)]?.label} 
                ({sortConfig.direction === 'asc' ? 'A-Z' : 'Z-A'})
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-sm relative">
            <Button
              variant="ghost"
              size="sm"
              icon={<Columns className="w-4 h-4" />}
              onClick={() => setShowColumnManager(!showColumnManager)}
              className="text-text-secondary hover:text-text-primary"
            >
              Columnas
            </Button>
            
            {showColumnManager && <ColumnManager />}
          </div>
        </div>
      </div>

      {/* ✅ FIXED: Table sin columna Estado duplicada */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-default bg-bg-light">
              <th className="px-lg py-sm text-left w-12">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center justify-center w-4 h-4 focus:ring-2 focus:ring-interactive-default rounded-sm transition-default"
                >
                  {selectedItems.size === sortedData.length && sortedData.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-interactive-default" />
                  ) : selectedItems.size > 0 ? (
                    <div className="w-4 h-4 bg-interactive-default rounded-sm flex items-center justify-center">
                      <div className="w-2 h-0.5 bg-white"></div>
                    </div>
                  ) : (
                    <Square className="w-4 h-4 text-border-default hover:text-text-secondary" />
                  )}
                </button>
              </th>
              
              {visibleColumns.solicitud && (
                <SortHeader column="solicitud">Solicitud</SortHeader>
              )}
              {visibleColumns.fecha_consulta && (
                <SortHeader column="fecha_consulta">Fecha de Consulta</SortHeader>
              )}
              {visibleColumns.radicado && (
                <SortHeader column="radicado">Número de Radicado</SortHeader>
              )}
              {visibleColumns.despacho && (
                <SortHeader column="despacho" className={columnConfig.despacho.responsive}>
                  Despacho/Juzgado
                </SortHeader>
              )}
              {visibleColumns.fecha_auto && (
                <SortHeader column="fecha_auto" className={columnConfig.fecha_auto.responsive}>
                  Fecha Último Auto
                </SortHeader>
              )}
              {/* ❌ ELIMINADO: Header de Estado */}
              
              <th className="px-lg py-sm text-left text-body-auxiliary font-medium text-text-secondary w-32">
                Acciones
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border-default bg-bg-canvas">
            {sortedData.map((item, index) => (
              <tr 
                key={item.id} 
                className={cn(
                  'hover:bg-bg-light transition-default duration-150 group',
                  selectedItems.has(item.id) && 'bg-interactive-default bg-opacity-5',
                  index % 2 === 0 ? 'bg-bg-canvas' : 'bg-bg-light bg-opacity-30'
                )}
              >
                {/* Enhanced Checkbox */}
                <td className="px-lg py-lg">
                  <button
                    onClick={() => toggleSelectItem(item.id)}
                    className="flex items-center justify-center w-4 h-4 focus:ring-2 focus:ring-interactive-default rounded-sm transition-default opacity-70 group-hover:opacity-100"
                  >
                    {selectedItems.has(item.id) ? (
                      <CheckSquare className="w-4 h-4 text-interactive-default" />
                    ) : (
                      <Square className="w-4 h-4 text-border-default hover:text-text-secondary" />
                    )}
                  </button>
                </td>

                {/* ✅ FIXED: Solicitud con estado badge - Única ubicación del estado */}
                {visibleColumns.solicitud && (
                  <td className="px-lg py-lg">
                    <div className="flex flex-col">
                      <span className="text-body-paragraph font-medium text-text-primary leading-tight">
                        {truncateText(item.solicitud_alias, 40)}
                      </span>
                      <div className="flex items-center space-x-sm mt-xs">
                        {getEstadoBadge(item.estado_extraccion)}
                      </div>
                    </div>
                  </td>
                )}

                {visibleColumns.fecha_consulta && (
                  <td className="px-lg py-lg">
                    <span className="text-body-paragraph text-text-base">
                      {formatearFechaConsulta(item.fecha_ejecucion)}
                    </span>
                  </td>
                )}

                {visibleColumns.radicado && (
                  <td className="px-lg py-lg">
                    <span className="text-body-paragraph font-mono text-text-base break-all">
                      {item.numero_radicado_completo || 'N/A'}
                    </span>
                  </td>
                )}

                {visibleColumns.despacho && (
                  <td className={cn('px-lg py-lg', columnConfig.despacho.responsive)}>
                    <span className="text-body-paragraph text-text-base" title={item.despacho_juzgado}>
                      {truncateText(item.despacho_juzgado, 45)}
                    </span>
                  </td>
                )}

                {visibleColumns.fecha_auto && (
                  <td className={cn('px-lg py-lg', columnConfig.fecha_auto.responsive)}>
                    <span className="text-body-paragraph text-text-base">
                      {formatearFechaUltimoAuto(item.fecha_ultimo_auto)}
                    </span>
                  </td>
                )}

                {/* ❌ ELIMINADO: Celda de Estado independiente */}

                {/* Enhanced Actions */}
                <td className="px-lg py-lg">
                  <div className="flex items-center space-x-xs opacity-70 group-hover:opacity-100 transition-default">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(item)}
                      icon={<Eye className="w-4 h-4" />}
                      title="Ver detalles completos"
                      className="hover:bg-feedback-info-light hover:text-feedback-info"
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(item)}
                      icon={<Download className="w-4 h-4" />}
                      title="Descargar PDF"
                      className="hover:bg-feedback-success-light hover:text-feedback-success"
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<MoreHorizontal className="w-4 h-4" />}
                      title="Más opciones"
                      className="hover:bg-bg-light hover:text-text-primary"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {Math.ceil(totalItems / itemsPerPage) > 1 && (
        <div className="border-t border-border-default bg-bg-light px-lg py-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-lg">
            <div className="flex items-center space-x-lg">
              <div className="text-body-auxiliary text-text-secondary">
                Mostrando <span className="font-medium text-text-primary">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                <span className="font-medium text-text-primary">{Math.min(currentPage * itemsPerPage, totalItems)}</span> de{' '}
                <span className="font-medium text-text-primary">{totalItems}</span> resultados
              </div>
              
              {selectedItems.size > 0 && (
                <div className="text-body-auxiliary text-interactive-default">
                  {selectedItems.size} seleccionado{selectedItems.size !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            {/* Paginación mantenida igual que antes */}
            <div className="flex items-center gap-sm">
              <button
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={cn(
                  'flex items-center gap-xs px-sm py-sm text-body-auxiliary font-medium rounded-md transition-default border',
                  currentPage > 1
                    ? 'text-text-primary bg-bg-canvas border-border-default hover:bg-bg-light'
                    : 'text-text-secondary bg-border-disabled border-border-disabled cursor-not-allowed'
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <div className="flex items-center gap-xs">
                {/* Páginas con lógica mejorada */}
                {Math.ceil(totalItems / itemsPerPage) > 1 && (
                  <>
                    {currentPage > 2 && (
                      <>
                        <button
                          onClick={() => onPageChange(1)}
                          className="px-sm py-sm text-body-auxiliary font-medium text-text-primary bg-bg-canvas border border-border-default rounded-md hover:bg-bg-light transition-default"
                        >
                          1
                        </button>
                        {currentPage > 3 && (
                          <span className="px-sm py-sm text-body-auxiliary text-text-secondary">...</span>
                        )}
                      </>
                    )}

                    {currentPage > 1 && (
                      <button
                        onClick={() => onPageChange(currentPage - 1)}
                        className="px-sm py-sm text-body-auxiliary font-medium text-text-primary bg-bg-canvas border border-border-default rounded-md hover:bg-bg-light transition-default"
                      >
                        {currentPage - 1}
                      </button>
                    )}

                    <button
                      className="px-sm py-sm text-body-auxiliary font-medium text-text-base bg-interactive-default border border-interactive-default rounded-md"
                      aria-current="page"
                    >
                      {currentPage}
                    </button>

                    {currentPage < Math.ceil(totalItems / itemsPerPage) && (
                      <button
                        onClick={() => onPageChange(currentPage + 1)}
                        className="px-sm py-sm text-body-auxiliary font-medium text-text-primary bg-bg-canvas border border-border-default rounded-md hover:bg-bg-light transition-default"
                      >
                        {currentPage + 1}
                      </button>
                    )}

                    {currentPage < Math.ceil(totalItems / itemsPerPage) - 1 && (
                      <>
                        {currentPage < Math.ceil(totalItems / itemsPerPage) - 2 && (
                          <span className="px-sm py-sm text-body-auxiliary text-text-secondary">...</span>
                        )}
                        <button
                          onClick={() => onPageChange(Math.ceil(totalItems / itemsPerPage))}
                          className="px-sm py-sm text-body-auxiliary font-medium text-text-primary bg-bg-canvas border border-border-default rounded-md hover:bg-bg-light transition-default"
                        >
                          {Math.ceil(totalItems / itemsPerPage)}
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
              
              <button
                onClick={() => currentPage < Math.ceil(totalItems / itemsPerPage) && onPageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                className={cn(
                  'flex items-center gap-xs px-sm py-sm text-body-auxiliary font-medium rounded-md transition-default border',
                  currentPage < Math.ceil(totalItems / itemsPerPage)
                    ? 'text-text-primary bg-bg-canvas border-border-default hover:bg-bg-light'
                    : 'text-text-secondary bg-border-disabled border-border-disabled cursor-not-allowed'
                )}
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

AdvancedHistorialTable.displayName = 'AdvancedHistorialTable'

export default AdvancedHistorialTable