import React, { useState, useRef } from 'react'
import { 
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
  Calendar,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import { cn } from '../../../utils/cn'

/**
 * SmartExport - Sistema de exportación inteligente con múltiples formatos
 */
const SmartExport = ({
  data,
  solicitud,
  onExport,
  className = ''
}) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [selectedTemplate, setSelectedTemplate] = useState('executive')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [includeCharts, setIncludeCharts] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportStatus, setExportStatus] = useState('idle')
  const downloadRef = useRef(null)

  // Formatos disponibles
  const formats = [
    {
      id: 'pdf',
      name: 'PDF',
      icon: <FileText className="w-5 h-5" />,
      description: 'Documento completo con gráficos',
      extension: '.pdf',
      size: '~2-5 MB'
    },
    {
      id: 'excel',
      name: 'Excel',
      icon: <FileSpreadsheet className="w-5 h-5" />,
      description: 'Datos estructurados y tablas',
      extension: '.xlsx',
      size: '~500 KB'
    },
    {
      id: 'csv',
      name: 'CSV',
      icon: <FileText className="w-5 h-5" />,
      description: 'Datos tabulares simples',
      extension: '.csv',
      size: '~100 KB'
    },
    {
      id: 'powerpoint',
      name: 'PowerPoint',
      icon: <FileImage className="w-5 h-5" />,
      description: 'Presentación ejecutiva',
      extension: '.pptx',
      size: '~3-8 MB'
    }
  ]

  // Plantillas disponibles
  const templates = [
    {
      id: 'executive',
      name: 'Reporte Ejecutivo',
      description: 'Resumen de alto nivel para directivos',
      includes: ['Métricas clave', 'Tendencias', 'Recomendaciones'],
      duration: '~30 segundos'
    },
    {
      id: 'technical',
      name: 'Reporte Técnico',
      description: 'Análisis detallado para equipos técnicos',
      includes: ['Logs completos', 'Errores detallados', 'Configuraciones'],
      duration: '~60 segundos'
    },
    {
      id: 'weekly',
      name: 'Reporte Semanal',
      description: 'Resumen periódico automatizado',
      includes: ['Actividad semanal', 'Comparación vs anterior', 'Alertas'],
      duration: '~20 segundos'
    },
    {
      id: 'custom',
      name: 'Personalizado',
      description: 'Configuración avanzada de contenido',
      includes: ['Selección manual', 'Filtros específicos', 'Formato libre'],
      duration: '~Variable'
    }
  ]

  // Simular proceso de exportación
  const simulateExport = async () => {
    setIsExporting(true)
    setExportProgress(0)
    setExportStatus('processing')

    const steps = [
      { message: 'Recopilando datos...', duration: 1000 },
      { message: 'Aplicando plantilla...', duration: 1500 },
      { message: 'Generando gráficos...', duration: 2000 },
      { message: 'Compilando documento...', duration: 1200 },
      { message: 'Finalizando...', duration: 800 }
    ]

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      setExportProgress((i / steps.length) * 100)
      
      await new Promise(resolve => setTimeout(resolve, step.duration))
    }

    setExportProgress(100)
    setExportStatus('completed')

    // Simular descarga
    const fileName = `solicitud_${solicitud?.id || 'report'}_${selectedTemplate}_${new Date().toISOString().split('T')[0]}${formats.find(f => f.id === selectedFormat)?.extension}`
    
    // Crear blob simulado
    const content = generateReportContent()
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    // Trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    
    URL.revokeObjectURL(url)

    // Callback al padre
    onExport?.({
      format: selectedFormat,
      template: selectedTemplate,
      fileName,
      dateRange,
      includeCharts
    })

    // Reset después de un momento
    setTimeout(() => {
      setIsExporting(false)
      setExportStatus('idle')
      setExportProgress(0)
    }, 2000)
  }

  // Generar contenido del reporte
  const generateReportContent = () => {
    const selectedFormatData = formats.find(f => f.id === selectedFormat)
    const selectedTemplateData = templates.find(t => t.id === selectedTemplate)
    
    return `
# REPORTE CONSULTAJUDICIAL RPA
## ${selectedTemplateData?.name || 'Reporte'}

**Solicitud:** ${solicitud?.nombre_descriptivo || 'N/A'}
**ID:** ${solicitud?.id || 'N/A'}
**Fecha de generación:** ${new Date().toLocaleString('es-CO')}
**Formato:** ${selectedFormatData?.name}
**Plantilla:** ${selectedTemplateData?.name}

### RESUMEN EJECUTIVO
- Estado actual: ${solicitud?.estado || 'Activa'}
- Última ejecución: ${solicitud?.ultima_ejecucion ? new Date(solicitud.ultima_ejecucion).toLocaleString('es-CO') : 'N/A'}
- Frecuencia: ${solicitud?.frecuencia_envio || 'Diaria'}

### MÉTRICAS DE RENDIMIENTO
- Total de ejecuciones: ${Math.floor(Math.random() * 100) + 50}
- Tasa de éxito: ${Math.floor(Math.random() * 20) + 80}%
- Tiempo promedio: ${(Math.random() * 3 + 1).toFixed(1)}s
- Disponibilidad: ${Math.floor(Math.random() * 10) + 90}%

### CONFIGURACIÓN
- Tipo de búsqueda: ${solicitud?.tipo_busqueda || 'N/A'}
- Criterio: ${solicitud?.criterio_busqueda_radicado || solicitud?.criterio_busqueda_nombre || 'N/A'}
- Despacho: ${solicitud?.despacho_juzgado || 'N/A'}
- Email notificación: ${solicitud?.email_notificacion || 'N/A'}

---
Reporte generado automáticamente por ConsultaJudicial RPA
    `.trim()
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Exportación Inteligente
          </h3>
          <p className="text-sm text-gray-600">
            Genera reportes personalizados en múltiples formatos
          </p>
        </div>
        
        {exportStatus === 'completed' && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Exportación completada</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuración de formato */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selección de formato */}
          <Card>
            <Card.Header>
              <h4 className="text-base font-medium text-gray-900">
                Formato de Exportación
              </h4>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formats.map((format) => (
                  <div
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={cn(
                      'relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
                      'hover:shadow-md',
                      selectedFormat === format.id
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        selectedFormat === format.id ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                      )}>
                        {format.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900">{format.name}</h5>
                        <p className="text-sm text-gray-600 mb-2">{format.description}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{format.extension}</span>
                          <span>{format.size}</span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedFormat === format.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Selección de plantilla */}
          <Card>
            <Card.Header>
              <h4 className="text-base font-medium text-gray-900">
                Plantilla de Reporte
              </h4>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={cn(
                      'p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
                      'hover:shadow-sm',
                      selectedTemplate === template.id
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-medium text-gray-900">{template.name}</h5>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {template.duration}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {template.includes.map((item, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {selectedTemplate === template.id && (
                        <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center ml-4">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Configuración avanzada */}
          <Card>
            <Card.Header>
              <h4 className="text-base font-medium text-gray-900">
                Opciones Avanzadas
              </h4>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {/* Rango de fechas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rango de Fechas
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      placeholder="Fecha inicio"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      placeholder="Fecha fin"
                    />
                  </div>
                </div>

                {/* Incluir gráficos */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCharts}
                      onChange={(e) => setIncludeCharts(e.target.checked)}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Incluir gráficos y visualizaciones
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 ml-6">
                    Añade gráficos de tendencias y métricas al reporte
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Panel de vista previa y exportación */}
        <div className="space-y-6">
          {/* Vista previa */}
          <Card>
            <Card.Header>
              <h4 className="text-base font-medium text-gray-900">
                Vista Previa
              </h4>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Formato:</span>
                  <span className="font-medium text-gray-900">
                    {formats.find(f => f.id === selectedFormat)?.name}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Plantilla:</span>
                  <span className="font-medium text-gray-900">
                    {templates.find(t => t.id === selectedTemplate)?.name}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tamaño estimado:</span>
                  <span className="font-medium text-gray-900">
                    {formats.find(f => f.id === selectedFormat)?.size}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiempo estimado:</span>
                  <span className="font-medium text-gray-900">
                    {templates.find(t => t.id === selectedTemplate)?.duration}
                  </span>
                </div>

                {(dateRange.start || dateRange.end) && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Período:</span>
                      <span className="font-medium text-gray-900">
                        {dateRange.start || 'Inicio'} - {dateRange.end || 'Fin'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Progreso de exportación */}
          {isExporting && (
            <Card className="border-yellow-200 bg-yellow-50">
              <Card.Content className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">
                      Generando reporte...
                    </p>
                    <p className="text-xs text-yellow-700">
                      {Math.round(exportProgress)}% completado
                    </p>
                  </div>
                </div>
                
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Botón de exportación */}
          <Button
            variant="primary"
            size="lg"
            onClick={simulateExport}
            disabled={isExporting}
            icon={isExporting ? <Clock className="w-5 h-5" /> : <Download className="w-5 h-5" />}
            className="w-full"
          >
            {isExporting ? 'Generando...' : 'Generar Reporte'}
          </Button>

          {/* Enlaces rápidos */}
          <Card>
            <Card.Header>
              <h4 className="text-base font-medium text-gray-900">
                Accesos Rápidos
              </h4>
            </Card.Header>
            <Card.Content>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedFormat('csv')
                    setSelectedTemplate('technical')
                  }}
                >
                  Exportación rápida CSV
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedFormat('pdf')
                    setSelectedTemplate('executive')
                  }}
                >
                  Reporte ejecutivo PDF
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedFormat('excel')
                    setSelectedTemplate('weekly')
                  }}
                >
                  Reporte semanal Excel
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SmartExport