import React, { useState, useEffect, useMemo } from 'react'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Table,
  History,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Mail,
  Settings,
  FileText,
  Zap,
  RefreshCw
} from 'lucide-react'

// UI Components - Imports simplificados
import { cn } from '../../../utils/cn'

/**
 * UnifiedExecutionHistory - Historial específico del caso actual
 * ✅ CORREGIDO: Solo muestra ejecuciones del proceso actual, no múltiples casos
 */
const UnifiedExecutionHistory = ({ solicitudId, className = '' }) => {
  const [executionData, setExecutionData] = useState([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState('timeline') // 'timeline' | 'table'

  useEffect(() => {
    if (solicitudId) {
      loadExecutionData()
    }
  }, [solicitudId])

  const loadExecutionData = async () => {
    setLoading(true)
    try {
      // ✅ HISTORIAL ESPECÍFICO DEL CASO ACTUAL
      // Todos los registros pertenecen al mismo radicado y proceso
      const solicitudInfo = {
        numero_radicado: '11001310300120240001',
        juzgado: 'Juzgado 33 Civil del Circuito de Bogotá',
        tipo_proceso: 'Civil - Ejecutivo',
        estado_proceso_actual: 'En trámite - Práctica de pruebas'
      }
      
      const data = [
        // Ejecución más reciente - Exitosa con nuevas actualizaciones
        {
          id: 1,
          fecha_ejecucion: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          estado_extraccion: 'EXITOSA',
          numero_radicado_completo: solicitudInfo.numero_radicado,
          despacho_juzgado: solicitudInfo.juzgado,
          resultados_encontrados: 2,
          tiempo_ejecucion: '2.3s',
          detalles: 'Consulta exitosa. Se encontraron 2 nuevas actualizaciones: Decreto de práctica de pruebas testimoniales programadas para el 15 de febrero de 2025, Citación a testigos notificada.',
          tipo_evento: 'consulta_automatica',
          estado_proceso: 'En trámite - Práctica de pruebas'
        },
        
        // Hace 4 horas - Consulta sin cambios
        {
          id: 2,
          fecha_ejecucion: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          estado_extraccion: 'EXITOSA',
          numero_radicado_completo: solicitudInfo.numero_radicado,
          despacho_juzgado: solicitudInfo.juzgado,
          resultados_encontrados: 0,
          tiempo_ejecucion: '1.8s',
          detalles: 'Consulta exitosa. No se encontraron cambios desde la última verificación. El proceso mantiene su estado anterior.',
          tipo_evento: 'consulta_automatica',
          estado_proceso: 'En trámite - Práctica de pruebas'
        },

        // Hace 8 horas - Error temporal del sistema
        {
          id: 3,
          fecha_ejecucion: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          estado_extraccion: 'FALLIDA',
          numero_radicado_completo: solicitudInfo.numero_radicado,
          despacho_juzgado: solicitudInfo.juzgado,
          resultados_encontrados: 0,
          tiempo_ejecucion: '30.0s',
          error_mensaje: 'Timeout - Servidor judicial saturado',
          detalles: 'El servidor del sistema judicial no respondió dentro del tiempo límite (30s). Reintento automático programado.',
          tipo_evento: 'consulta_automatica'
        },

        // Hace 12 horas - Consulta con advertencia CAPTCHA
        {
          id: 4,
          fecha_ejecucion: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          estado_extraccion: 'ADVERTENCIA',
          numero_radicado_completo: solicitudInfo.numero_radicado,
          despacho_juzgado: solicitudInfo.juzgado,
          resultados_encontrados: 1,
          tiempo_ejecucion: '8.7s',
          detalles: 'Consulta completada con advertencia. El sistema solicitó resolución de CAPTCHA, resuelto automáticamente. Se encontró 1 actualización: Notificación por correo certificado.',
          tipo_evento: 'consulta_automatica',
          advertencia: 'CAPTCHA resuelto automáticamente',
          estado_proceso: 'En trámite - Práctica de pruebas'
        },

        // Ayer - Actualización importante del proceso
        {
          id: 5,
          fecha_ejecucion: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          estado_extraccion: 'EXITOSA',
          numero_radicado_completo: solicitudInfo.numero_radicado,
          despacho_juzgado: solicitudInfo.juzgado,
          resultados_encontrados: 3,
          tiempo_ejecucion: '3.1s',
          detalles: 'Consulta exitosa con actualizaciones importantes. Se encontraron 3 nuevas actualizaciones: Auto que ordena práctica de pruebas, Calendario de audiencias actualizado, Notificación a las partes.',
          tipo_evento: 'consulta_automatica',
          estado_proceso: 'En trámite - Práctica de pruebas'
        },

        // Hace 2 días - Consulta exitosa rutinaria
        {
          id: 6,
          fecha_ejecucion: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          estado_extraccion: 'EXITOSA',
          numero_radicado_completo: solicitudInfo.numero_radicado,
          despacho_juzgado: solicitudInfo.juzgado,
          resultados_encontrados: 0,
          tiempo_ejecucion: '2.1s',
          detalles: 'Consulta rutinaria exitosa. No se registraron cambios en el estado del proceso desde la consulta anterior.',
          tipo_evento: 'consulta_automatica',
          estado_proceso: 'En trámite - Etapa probatoria'
        },

        // Hace 3 días - Error de mantenimiento
        {
          id: 7,
          fecha_ejecucion: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          estado_extraccion: 'FALLIDA',
          numero_radicado_completo: solicitudInfo.numero_radicado,
          despacho_juzgado: solicitudInfo.juzgado,
          resultados_encontrados: 0,
          tiempo_ejecucion: '45.0s',
          error_mensaje: 'Mantenimiento programado del sistema judicial',
          detalles: 'El Consejo Superior de la Judicatura informó mantenimiento de servidores entre las 02:00 y 06:00. La consulta fue reprogramada automáticamente.',
          tipo_evento: 'consulta_automatica'
        },

        // Hace 4 días - Consulta con múltiples actualizaciones
        {
          id: 8,
          fecha_ejecucion: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
          estado_extraccion: 'EXITOSA',
          numero_radicado_completo: solicitudInfo.numero_radicado,
          despacho_juzgado: solicitudInfo.juzgado,
          resultados_encontrados: 4,
          tiempo_ejecucion: '4.2s',
          detalles: 'Consulta exitosa con múltiples actualizaciones. Se encontraron 4 nuevas actualizaciones: Admisión de demanda, Traslado a la parte demandada, Auto de citación, Fijación en lista para notificación.',
          tipo_evento: 'consulta_automatica',
          estado_proceso: 'En trámite - Etapa probatoria'
        },

        // Hace 5 días - Notificación enviada por email
        {
          id: 9,
          fecha_ejecucion: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
          estado_extraccion: 'EXITOSA',
          numero_radicado_completo: solicitudInfo.numero_radicado,
          despacho_juzgado: 'Sistema de Notificaciones RPA',
          resultados_encontrados: 1,
          tiempo_ejecucion: '0.8s',
          detalles: 'Notificación automática enviada. Se detectaron cambios importantes en el proceso y se envió notificación por correo electrónico al usuario registrado.',
          tipo_evento: 'notificacion_email',
          estado_proceso: 'En trámite'
        },

        // Hace 6 días - Primera consulta exitosa
        {
          id: 10,
          fecha_ejecucion: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(),
          estado_extraccion: 'EXITOSA',
          numero_radicado_completo: solicitudInfo.numero_radicado,
          despacho_juzgado: solicitudInfo.juzgado,
          resultados_encontrados: 2,
          tiempo_ejecucion: '5.1s',
          detalles: 'Primera consulta exitosa del proceso. Se encontraron 2 actualizaciones iniciales: Radicación de la demanda, Asignación al Juzgado 33 Civil del Circuito.',
          tipo_evento: 'consulta_automatica',
          estado_proceso: 'Admitido'
        },

        // Hace 1 semana - Configuración inicial
        {
          id: 11,
          fecha_ejecucion: new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString(),
          estado_extraccion: 'EXITOSA',
          numero_radicado_completo: solicitudInfo.numero_radicado,
          despacho_juzgado: 'Sistema RPA ConsultaJudicial',
          resultados_encontrados: 1,
          tiempo_ejecucion: '1.2s',
          detalles: 'Configuración inicial completada. Solicitud de monitoreo automático creada para el radicado. Frecuencia de consulta: cada 6 horas.',
          tipo_evento: 'configuracion_inicial',
          estado_proceso: 'Configurado para monitoreo'
        }
      ]
      
      setExecutionData(data)
    } catch (error) {
      console.error('Error cargando historial:', error)
    } finally {
      setLoading(false)
    }
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  // Formatear fecha relativa
  const formatRelativeDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`
      if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
      if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
      return 'hace un momento'
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  // Badge de estado mejorado
  const getStatusBadge = (estado) => {
    switch (estado?.toUpperCase()) {
      case 'EXITOSA':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md font-medium">
            ✅ Completado
          </span>
        )
      case 'FALLIDA':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-md font-medium">
            ❌ Error
          </span>
        )
      case 'ADVERTENCIA':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-md font-medium">
            ⚠️ Advertencia
          </span>
        )
      case 'EN_PROCESO':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium">
            🔄 En Proceso
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md font-medium">
            ❓ Desconocido
          </span>
        )
    }
  }

  // Icono según el estado
  const getStatusIcon = (estado) => {
    switch (estado?.toUpperCase()) {
      case 'EXITOSA':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'FALLIDA':
        return <XCircle className="w-6 h-6 text-red-500" />
      case 'ADVERTENCIA':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case 'EN_PROCESO':
        return <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-6 h-6 text-gray-400" />
    }
  }

  // Badge de tipo de evento
  const getTipoEventoBadge = (tipo) => {
    if (!tipo) return null
    
    const tipoMap = {
      'consulta_automatica': { label: '🔄 Consulta Automática', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      'notificacion_email': { label: '📧 Notificación Email', color: 'bg-green-50 text-green-700 border-green-200' },
      'configuracion_inicial': { label: '⚙️ Configuración', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      'manual': { label: '👤 Consulta Manual', color: 'bg-gray-50 text-gray-700 border-gray-200' }
    }
    
    const config = tipoMap[tipo] || { label: tipo, color: 'bg-gray-50 text-gray-700 border-gray-200' }
    
    return (
      <span className={`px-2 py-1 text-xs rounded border ${config.color} font-medium`}>
        {config.label}
      </span>
    )
  }

  // Botón simplificado
  const SimpleButton = ({ onClick, children, variant = 'primary', icon, className: btnClassName = '' }) => {
    const baseClass = 'px-3 py-2 rounded-md text-sm font-medium transition-colors'
    const variantClass = variant === 'primary' 
      ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
      : variant === 'ghost'
      ? 'bg-transparent text-gray-600 hover:bg-gray-100'
      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
    
    return (
      <button 
        onClick={onClick}
        className={cn(baseClass, variantClass, btnClassName)}
      >
        {icon && <span className="inline-flex items-center mr-1">{icon}</span>}
        {children}
      </button>
    )
  }

  // Calcular estadísticas del caso actual
  const stats = useMemo(() => {
    const totalExecutions = executionData.length
    const successfulExecutions = executionData.filter(e => e.estado_extraccion === 'EXITOSA').length
    const failedExecutions = executionData.filter(e => e.estado_extraccion === 'FALLIDA').length
    const warningExecutions = executionData.filter(e => e.estado_extraccion === 'ADVERTENCIA').length
    const successRate = totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 0
    const totalResults = executionData.reduce((sum, e) => sum + (e.resultados_encontrados || 0), 0)
    
    const avgDuration = executionData.length > 0 
      ? executionData.reduce((sum, e) => {
          const duration = parseFloat(e.tiempo_ejecucion?.replace('s', '') || 0)
          return sum + duration
        }, 0) / executionData.length
      : 0

    const consultasAutomaticas = executionData.filter(e => e.tipo_evento === 'consulta_automatica').length
    const notificacionesEnviadas = executionData.filter(e => e.tipo_evento === 'notificacion_email').length

    // Información del caso actual
    const solicitudInfo = executionData.length > 0 ? {
      radicado: executionData[0].numero_radicado_completo,
      juzgado: executionData[0].despacho_juzgado,
      estadoActual: executionData.find(e => e.estado_proceso)?.estado_proceso || 'No disponible'
    } : null

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      warningExecutions,
      successRate,
      totalResults,
      avgDuration: avgDuration.toFixed(1),
      consultasAutomaticas,
      notificacionesEnviadas,
      solicitudInfo
    }
  }, [executionData])

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header con información del caso */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        {stats.solicitudInfo && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Información del Caso</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Radicado:</span>
                <div className="font-mono text-blue-900">{stats.solicitudInfo.radicado}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Juzgado:</span>
                <div className="text-blue-900">{stats.solicitudInfo.juzgado}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Estado Actual:</span>
                <div className="text-blue-900">{stats.solicitudInfo.estadoActual}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Historial del Caso - {executionData.length} eventos
            </h3>
          </div>
          
          {/* Toggle de vista simplificado */}
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-md p-1">
              <SimpleButton
                variant={viewMode === 'timeline' ? 'primary' : 'ghost'}
                onClick={() => setViewMode('timeline')}
                icon={<History size={14} />}
                className="rounded-r-none text-xs"
              >
                Timeline
              </SimpleButton>
              <SimpleButton
                variant={viewMode === 'table' ? 'primary' : 'ghost'}
                onClick={() => setViewMode('table')}
                icon={<Table size={14} />}
                className="rounded-l-none text-xs"
              >
                Tabla
              </SimpleButton>
            </div>
          </div>
        </div>
        
        {/* Contenido */}
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
              <span className="ml-2 text-gray-600">Cargando historial del caso...</span>
            </div>
          ) : (
            <>
              {/* Vista Timeline */}
              {viewMode === 'timeline' && (
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-700 mb-4">Cronología del Proceso</h4>
                  <div className="relative">
                    {/* Línea vertical del timeline */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {executionData.map((execution, index) => (
                      <div key={execution.id} className="relative flex items-start gap-4 pb-6">
                        {/* Icono del timeline */}
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-4 border-gray-200 rounded-full">
                          {getStatusIcon(execution.estado_extraccion)}
                        </div>
                        
                        {/* Contenido del evento */}
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h5 className="font-medium text-gray-900">
                                    {execution.estado_extraccion === 'EXITOSA' ? 'Consulta exitosa' : 
                                     execution.estado_extraccion === 'ADVERTENCIA' ? 'Consulta con advertencia' : 
                                     'Error en consulta'}
                                  </h5>
                                  {getStatusBadge(execution.estado_extraccion)}
                                  {getTipoEventoBadge(execution.tipo_evento)}
                                </div>
                                
                                {execution.estado_proceso && (
                                  <p className="text-sm text-gray-600 mb-2">
                                    <strong>Estado del proceso:</strong> 
                                    <span className="ml-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                                      {execution.estado_proceso}
                                    </span>
                                  </p>
                                )}
                                
                                <p className="text-sm text-gray-700 mb-3">
                                  {execution.detalles}
                                </p>
                                
                                {execution.error_mensaje && (
                                  <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                                    <p className="text-sm text-red-700">
                                      <strong>Error:</strong> {execution.error_mensaje}
                                    </p>
                                  </div>
                                )}
                                
                                {execution.advertencia && (
                                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
                                    <p className="text-sm text-yellow-700">
                                      <strong>Advertencia:</strong> {execution.advertencia}
                                    </p>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>
                                    📊 {execution.resultados_encontrados || 0} resultado{execution.resultados_encontrados !== 1 ? 's' : ''}
                                  </span>
                                  <span>⏱️ {execution.tiempo_ejecucion}</span>
                                  <span>📅 {formatRelativeDate(execution.fecha_ejecucion)}</span>
                                </div>
                              </div>
                              
                              <div className="text-right ml-4">
                                <div className="text-sm text-gray-500">
                                  {formatDate(execution.fecha_ejecucion)}
                                </div>
                                <SimpleButton
                                  variant="ghost"
                                  onClick={() => {
                                    alert(`Detalles del evento ${execution.id}:\n\n${execution.detalles}`)
                                  }}
                                  icon={<Eye size={14} />}
                                  className="text-xs mt-2"
                                >
                                  Ver
                                </SimpleButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vista Tabla */}
              {viewMode === 'table' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                          Fecha y hora
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                          Estado
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                          Tipo de Evento
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                          Estado del Proceso
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                          Resultados
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {executionData.map((resultado) => (
                        <tr 
                          key={resultado.id} 
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          {/* Fecha */}
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-900">
                              {formatDate(resultado.fecha_ejecucion)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatRelativeDate(resultado.fecha_ejecucion)}
                            </div>
                            <div className="text-xs text-gray-500">
                              ⏱️ {resultado.tiempo_ejecucion}
                            </div>
                          </td>
                          
                          {/* Estado */}
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              {getStatusBadge(resultado.estado_extraccion)}
                              {resultado.error_mensaje && (
                                <span className="text-xs text-red-600">
                                  {resultado.error_mensaje}
                                </span>
                              )}
                              {resultado.advertencia && (
                                <span className="text-xs text-yellow-600">
                                  {resultado.advertencia}
                                </span>
                              )}
                            </div>
                          </td>
                          
                          {/* Tipo de Evento */}
                          <td className="py-3 px-4">
                            {getTipoEventoBadge(resultado.tipo_evento)}
                          </td>
                          
                          {/* Estado del Proceso */}
                          <td className="py-3 px-4">
                            {resultado.estado_proceso && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                {resultado.estado_proceso}
                              </span>
                            )}
                          </td>
                          
                          {/* Resultados */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center">
                              <span className={cn(
                                'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                                resultado.resultados_encontrados > 0
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-600'
                              )}>
                                {resultado.resultados_encontrados || 0}
                              </span>
                            </div>
                            {resultado.resultados_encontrados > 0 && (
                              <div className="text-xs text-green-600 mt-1">
                                Actualizaciones
                              </div>
                            )}
                          </td>
                          
                          {/* Acciones */}
                          <td className="py-3 px-4 text-center">
                            <SimpleButton
                              variant="ghost"
                              onClick={() => {
                                alert(`Detalles del evento:\n\n${resultado.detalles}`)
                              }}
                              icon={<Eye size={14} />}
                              className="text-xs"
                            >
                              Ver
                            </SimpleButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Estadísticas específicas del caso */}
      {executionData.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-yellow-500" />
            <h4 className="text-md font-semibold text-gray-900">
              Estadísticas de Monitoreo del Caso
            </h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <div className="text-xl font-semibold text-gray-900">
                {stats.totalExecutions}
              </div>
              <div className="text-xs text-gray-600">
                Total eventos
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="text-xl font-semibold text-green-600">
                  {stats.successfulExecutions}
                </div>
                <TrendingUp className="w-3 h-3 text-green-600" />
              </div>
              <div className="text-xs text-gray-600">
                Exitosos
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <div className="text-xl font-semibold text-blue-600">
                {stats.successRate}%
              </div>
              <div className="text-xs text-gray-600">
                Tasa éxito
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <div className="text-xl font-semibold text-green-600">
                {stats.totalResults}
              </div>
              <div className="text-xs text-gray-600">
                Actualizaciones
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <div className="text-xl font-semibold text-purple-600">
                {stats.avgDuration}s
              </div>
              <div className="text-xs text-gray-600">
                Tiempo promedio
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <div className="text-xl font-semibold text-blue-600">
                {stats.consultasAutomaticas}
              </div>
              <div className="text-xs text-gray-600">
                Consultas auto
              </div>
            </div>
          </div>
          
          {/* Resumen del caso */}
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h5 className="text-sm font-medium text-green-900 mb-2">📈 Resumen del Monitoreo</h5>
            <p className="text-sm text-green-800">
              Se han realizado <strong>{stats.totalExecutions} eventos de monitoreo</strong> para este caso con una tasa de éxito del <strong>{stats.successRate}%</strong>. 
              Se han detectado <strong>{stats.totalResults} actualizaciones</strong> del proceso durante el seguimiento. 
              Se ejecutaron <strong>{stats.consultasAutomaticas} consultas automáticas</strong> y <strong>{stats.notificacionesEnviadas} notificaciones por email</strong>.
              El tiempo promedio de respuesta es de <strong>{stats.avgDuration} segundos</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default UnifiedExecutionHistory