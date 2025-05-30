import React, { useState, useCallback } from 'react'
import { Download, FileText, Table, FileSpreadsheet, Calendar, Filter, CheckCircle, X, AlertCircle } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'

/**
 * ✨ EXPORT FUNCTIONALITY - Exportación Avanzada
 * Componente para exportar datos con múltiples formatos y opciones
 */
const ExportModal = ({
  isOpen = false,
  onClose = () => {},
  selectedItems = new Set(),
  totalItems = 0,
  currentFilters = {},
  onExport = () => {},
  className = '',
  ...props
}) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'csv',
    scope: 'selected', // 'selected', 'filtered', 'all'
    includeColumns: {
      solicitud: true,
      fecha_consulta: true,
      radicado: true,
      despacho: true,
      fecha_auto: true,
      estado: true,
      demandante: false,
      demandado: false,
      actuaciones: false
    },
    dateRange: {
      enabled: false,
      start: '',
      end: ''
    },
    advanced: {
      includeHeaders: true,
      includeMetadata: true,
      compressed: false
    }
  })

  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  // Opciones de formato
  const formatOptions = [
    {
      value: 'csv',
      label: 'CSV',
      description: 'Archivo de valores separados por comas',
      icon: Table,
      recommended: true
    },
    {
      value: 'excel',
      label: 'Excel',
      description: 'Archivo de Microsoft Excel (.xlsx)',
      icon: FileSpreadsheet,
      popular: true
    },
    {
      value: 'pdf',
      label: 'PDF',
      description: 'Documento PDF con formato',
      icon: FileText
    },
    {
      value: 'json',
      label: 'JSON',
      description: 'Formato de datos estructurados',
      icon: FileText
    }
  ]

  // Opciones de alcance
  const scopeOptions = [
    {
      value: 'selected',
      label: `Elementos seleccionados (${selectedItems.size})`,
      description: 'Solo los elementos que has seleccionado',
      count: selectedItems.size,
      disabled: selectedItems.size === 0
    },
    {
      value: 'filtered',
      label: 'Resultados filtrados',
      description: 'Todos los resultados que coinciden con los filtros actuales',
      count: totalItems,
      disabled: totalItems === 0
    },
    {
      value: 'all',
      label: 'Todo el historial',
      description: 'Todos los registros sin filtros',
      count: totalItems,
      warning: totalItems > 1000 ? 'Archivo muy grande' : null
    }
  ]

  // Configuración de columnas
  const columnOptions = [
    { key: 'solicitud', label: 'Solicitud', required: true },
    { key: 'fecha_consulta', label: 'Fecha de Consulta', required: false },
    { key: 'radicado', label: 'Número de Radicado', required: false },
    { key: 'despacho', label: 'Despacho/Juzgado', required: false },
    { key: 'fecha_auto', label: 'Fecha Último Auto', required: false },
    { key: 'estado', label: 'Estado', required: false },
    { key: 'demandante', label: 'Demandante', required: false },
    { key: 'demandado', label: 'Demandado', required: false },
    { key: 'actuaciones', label: 'Actuaciones', required: false }
  ]

  // Handlers
  const handleConfigChange = useCallback((section, key, value) => {
    setExportConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }, [])

  const toggleColumn = useCallback((column) => {
    if (columnOptions.find(col => col.key === column)?.required) return
    
    setExportConfig(prev => ({
      ...prev,
      includeColumns: {
        ...prev.includeColumns,
        [column]: !prev.includeColumns[column]
      }
    }))
  }, [])

  const handleExport = useCallback(async () => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      // Simular progreso de exportación
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 20
        })
      }, 200)

      // Llamar al handler de exportación
      await onExport(exportConfig)

      // Completar progreso
      clearInterval(progressInterval)
      setExportProgress(100)

      // Cerrar modal después de un breve delay
      setTimeout(() => {
        setIsExporting(false)
        setExportProgress(0)
        onClose()
      }, 1000)

    } catch (error) {
      console.error('Error durante la exportación:', error)
      setIsExporting(false)
      setExportProgress(0)
    }
  }, [exportConfig, onExport, onClose])

  const resetToDefaults = useCallback(() => {
    setExportConfig({
      format: 'csv',
      scope: selectedItems.size > 0 ? 'selected' : 'filtered',
      includeColumns: {
        solicitud: true,
        fecha_consulta: true,
        radicado: true,
        despacho: true,
        fecha_auto: true,
        estado: true,
        demandante: false,
        demandado: false,
        actuaciones: false
      },
      dateRange: {
        enabled: false,
        start: '',
        end: ''
      },
      advanced: {
        includeHeaders: true,
        includeMetadata: true,
        compressed: false
      }
    })
  }, [selectedItems.size])

  // Calcular estimaciones
  const getEstimatedSize = useCallback(() => {
    const selectedScope = scopeOptions.find(opt => opt.value === exportConfig.scope)
    const itemCount = selectedScope?.count || 0
    const columnCount = Object.values(exportConfig.includeColumns).filter(Boolean).length
    
    // Estimación básica en KB
    let sizeKB = itemCount * columnCount * 0.1
    
    if (exportConfig.format === 'excel') sizeKB *= 1.5
    if (exportConfig.format === 'pdf') sizeKB *= 3
    if (exportConfig.advanced.includeMetadata) sizeKB *= 1.1
    
    if (sizeKB < 1) return '< 1 KB'
    if (sizeKB < 1024) return `${Math.round(sizeKB)} KB`
    return `${(sizeKB / 1024).toFixed(1)} MB`
  }, [exportConfig, scopeOptions])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-lg">
      <div 
        className={cn(
          'bg-bg-canvas rounded-lg border border-border-default shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-lg border-b border-border-default">
          <div>
            <h3 className="text-heading-h3 font-heading text-text-primary">Exportar Historial</h3>
            <p className="text-body-auxiliary text-text-secondary">
              Configura las opciones de exportación para tus datos
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            icon={<X className="w-4 h-4" />}
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        {/* Progress Bar (durante exportación) */}
        {isExporting && (
          <div className="p-lg border-b border-border-default">
            <div className="flex items-center space-x-sm mb-sm">
              <Download className="w-5 h-5 text-interactive-default animate-pulse" />
              <span className="text-body-paragraph font-medium text-text-primary">
                Generando exportación... {Math.round(exportProgress)}%
              </span>
            </div>
            
            <div className="w-full bg-bg-light rounded-full h-2">
              <div 
                className="bg-interactive-default h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="p-lg space-y-xl">
          
          {/* Formato de Archivo */}
          <div>
            <h4 className="text-body-paragraph font-semibold text-text-primary mb-sm">Formato de archivo</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
              {formatOptions.map((format) => {
                const Icon = format.icon
                const isSelected = exportConfig.format === format.value
                
                return (
                  <button
                    key={format.value}
                    onClick={() => handleConfigChange('', 'format', format.value)}
                    className={cn(
                      'p-sm border-2 rounded-lg text-left transition-all duration-200 relative',
                      isSelected
                        ? 'border-interactive-default bg-interactive-default bg-opacity-10'
                        : 'border-border-default hover:border-text-secondary hover:bg-bg-light'
                    )}
                  >
                    <div className="flex items-start space-x-sm">
                      <Icon className={cn(
                        'w-5 h-5 mt-xs',
                        isSelected ? 'text-interactive-default' : 'text-text-secondary'
                      )} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-xs mb-xs">
                          <span className={cn(
                            'text-body-paragraph font-medium',
                            isSelected ? 'text-text-primary' : 'text-text-base'
                          )}>
                            {format.label}
                          </span>
                          
                          {format.recommended && (
                            <span className="text-body-auxiliary text-feedback-success bg-feedback-success-light px-xs py-0.5 rounded">
                              Recomendado
                            </span>
                          )}
                          
                          {format.popular && (
                            <span className="text-body-auxiliary text-feedback-info bg-feedback-info-light px-xs py-0.5 rounded">
                              Popular
                            </span>
                          )}
                        </div>
                        
                        <p className="text-body-auxiliary text-text-secondary">
                          {format.description}
                        </p>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-sm right-sm">
                        <CheckCircle className="w-4 h-4 text-interactive-default" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Alcance de Datos */}
          <div>
            <h4 className="text-body-paragraph font-semibold text-text-primary mb-sm">Datos a exportar</h4>
            <div className="space-y-sm">
              {scopeOptions.map((scope) => {
                const isSelected = exportConfig.scope === scope.value
                const isDisabled = scope.disabled
                
                return (
                  <button
                    key={scope.value}
                    onClick={() => !isDisabled && handleConfigChange('', 'scope', scope.value)}
                    disabled={isDisabled}
                    className={cn(
                      'w-full p-sm border rounded-lg text-left transition-all duration-200 flex items-center justify-between',
                      isSelected && !isDisabled
                        ? 'border-interactive-default bg-interactive-default bg-opacity-10'
                        : isDisabled
                        ? 'border-border-disabled bg-bg-light opacity-50 cursor-not-allowed'
                        : 'border-border-default hover:border-text-secondary hover:bg-bg-light'
                    )}
                  >
                    <div className="flex items-center space-x-sm">
                      <div className={cn(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                        isSelected && !isDisabled
                          ? 'border-interactive-default bg-interactive-default'
                          : 'border-border-default'
                      )}>
                        {isSelected && !isDisabled && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-xs">
                          <span className="text-body-paragraph font-medium text-text-primary">
                            {scope.label}
                          </span>
                          {scope.warning && (
                            <AlertCircle className="w-4 h-4 text-feedback-warning" />
                          )}
                        </div>
                        <p className="text-body-auxiliary text-text-secondary">
                          {scope.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-body-auxiliary font-medium text-text-primary">
                        {scope.count.toLocaleString()}
                      </span>
                      <br />
                      <span className="text-body-auxiliary text-text-secondary">elementos</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selección de Columnas */}
          <div>
            <h4 className="text-body-paragraph font-semibold text-text-primary mb-sm">Columnas a incluir</h4>
            <div className="grid grid-cols-2 gap-sm">
              {columnOptions.map((column) => {
                const isIncluded = exportConfig.includeColumns[column.key]
                const isRequired = column.required
                
                return (
                  <label 
                    key={column.key}
                    className={cn(
                      'flex items-center space-x-sm p-sm rounded hover:bg-bg-light transition-default cursor-pointer',
                      isRequired && 'opacity-75 cursor-not-allowed'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isIncluded}
                      onChange={() => toggleColumn(column.key)}
                      disabled={isRequired}
                      className="w-4 h-4 text-interactive-default rounded border-border-default focus:ring-interactive-default focus:ring-2"
                    />
                    <span className="text-body-auxiliary text-text-base">
                      {column.label}
                      {isRequired && <span className="text-text-secondary ml-xs">(requerida)</span>}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Opciones Avanzadas */}
          <div>
            <h4 className="text-body-paragraph font-semibold text-text-primary mb-sm">Opciones avanzadas</h4>
            <div className="space-y-sm">
              <label className="flex items-center space-x-sm p-sm rounded hover:bg-bg-light transition-default cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportConfig.advanced.includeHeaders}
                  onChange={(e) => handleConfigChange('advanced', 'includeHeaders', e.target.checked)}
                  className="w-4 h-4 text-interactive-default rounded border-border-default focus:ring-interactive-default focus:ring-2"
                />
                <div>
                  <span className="text-body-auxiliary text-text-base">Incluir encabezados</span>
                  <p className="text-body-auxiliary text-text-secondary">Primera fila con nombres de columnas</p>
                </div>
              </label>

              <label className="flex items-center space-x-sm p-sm rounded hover:bg-bg-light transition-default cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportConfig.advanced.includeMetadata}
                  onChange={(e) => handleConfigChange('advanced', 'includeMetadata', e.target.checked)}
                  className="w-4 h-4 text-interactive-default rounded border-border-default focus:ring-interactive-default focus:ring-2"
                />
                <div>
                  <span className="text-body-auxiliary text-text-base">Incluir metadatos</span>
                  <p className="text-body-auxiliary text-text-secondary">Información de exportación y filtros aplicados</p>
                </div>
              </label>

              {(exportConfig.format === 'csv' || exportConfig.format === 'json') && (
                <label className="flex items-center space-x-sm p-sm rounded hover:bg-bg-light transition-default cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportConfig.advanced.compressed}
                    onChange={(e) => handleConfigChange('advanced', 'compressed', e.target.checked)}
                    className="w-4 h-4 text-interactive-default rounded border-border-default focus:ring-interactive-default focus:ring-2"
                  />
                  <div>
                    <span className="text-body-auxiliary text-text-base">Comprimir archivo</span>
                    <p className="text-body-auxiliary text-text-secondary">Generar archivo ZIP comprimido</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-bg-light rounded-lg p-lg border border-border-default">
            <h5 className="text-body-paragraph font-semibold text-text-primary mb-sm">Resumen de exportación</h5>
            <div className="grid grid-cols-2 gap-lg text-body-auxiliary">
              <div>
                <span className="text-text-secondary">Formato:</span>
                <span className="text-text-primary font-medium ml-xs">{exportConfig.format.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-text-secondary">Tamaño estimado:</span>
                <span className="text-text-primary font-medium ml-xs">{getEstimatedSize()}</span>
              </div>
              <div>
                <span className="text-text-secondary">Registros:</span>
                <span className="text-text-primary font-medium ml-xs">
                  {scopeOptions.find(opt => opt.value === exportConfig.scope)?.count.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Columnas:</span>
                <span className="text-text-primary font-medium ml-xs">
                  {Object.values(exportConfig.includeColumns).filter(Boolean).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-lg border-t border-border-default">
          <Button
            variant="link"
            onClick={resetToDefaults}
            className="text-text-secondary hover:text-text-primary"
          >
            Restablecer valores predeterminados
          </Button>
          
          <div className="flex space-x-sm">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isExporting}
            >
              Cancelar
            </Button>
            
            <Button
              variant="primary"
              onClick={handleExport}
              loading={isExporting}
              disabled={isExporting || scopeOptions.find(opt => opt.value === exportConfig.scope)?.disabled}
              icon={<Download className="w-4 h-4" />}
            >
              {isExporting ? 'Exportando...' : 'Exportar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente principal de exportación
const ExportHistorial = ({
  selectedItems = new Set(),
  totalItems = 0,
  currentFilters = {},
  onExport = () => {},
  className = '',
  ...props
}) => {
  const [showModal, setShowModal] = useState(false)

  const handleExportClick = useCallback(() => {
    setShowModal(true)
  }, [])

  const handleExport = useCallback(async (config) => {
    console.log('Configuración de exportación:', config)
    
    // Aquí implementarías la lógica real de exportación
    // Por ejemplo, llamar a un endpoint de tu API
    try {
      await onExport(config)
    } catch (error) {
      console.error('Error en exportación:', error)
      throw error
    }
  }, [onExport])

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleExportClick}
        icon={<Download className="w-4 h-4" />}
        className={cn('', className)}
        {...props}
      >
        Exportar
        {selectedItems.size > 0 && (
          <span className="ml-xs text-body-auxiliary">({selectedItems.size})</span>
        )}
      </Button>

      <ExportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedItems={selectedItems}
        totalItems={totalItems}
        currentFilters={currentFilters}
        onExport={handleExport}
      />
    </>
  )
}

ExportHistorial.displayName = 'ExportHistorial'

export default ExportHistorial