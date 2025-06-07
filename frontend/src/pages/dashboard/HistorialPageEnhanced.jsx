import React, { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { BarChart3, Eye, Settings, RefreshCw, Plus, AlertTriangle, TrendingUp, Wrench, FileText } from 'lucide-react'
import Button from '../../components/ui/Button'
import { useSolicitudes } from '../../hooks/useSolicitudes'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../utils/cn'

/**
 * 🚀 HISTORIAL PAGE - VERSIÓN SIMPLIFICADA CON DATOS MOCK
 * Versión básica con datos de ejemplo mientras se implementan las funcionalidades completas
 */
const HistorialPageEnhanced = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('historial')
  
  // 🔍 Detectar parámetros de URL
  const solicitudIdFromUrl = searchParams.get('solicitud')
  const nombreFromUrl = searchParams.get('nombre')
  
  // 📊 Hook para obtener solicitudes básico
  const { solicitudes, isLoading, error, refetch } = useSolicitudes({ limit: 100 })
  
  // 📋 Datos mock del historial
  const historialMock = [
    {
      id: 1,
      numero_radicado: '11001-31-03-001-2024-00123',
      fecha_ejecucion: '2024-06-06 14:30:00',
      estado_extraccion: 'exitoso',
      despacho_juzgado: 'Juzgado 1° Civil del Circuito de Bogotá',
      tipo_consulta: 'Número de Radicado',
      solicitud_nombre: 'Consulta proceso Juan Pérez vs Banco Nacional',
      resultados_encontrados: 3,
      actuaciones_nuevas: 1
    },
    {
      id: 2,
      numero_radicado: '11001-31-05-002-2024-00456',
      fecha_ejecucion: '2024-06-06 10:15:00',
      estado_extraccion: 'exitoso',
      despacho_juzgado: 'Juzgado 5° Laboral del Circuito de Bogotá',
      tipo_consulta: 'Nombre/Razón Social',
      solicitud_nombre: 'Seguimiento demanda laboral - María García',
      resultados_encontrados: 2,
      actuaciones_nuevas: 0
    },
    {
      id: 3,
      numero_radicado: '11001-31-10-003-2024-00789',
      fecha_ejecucion: '2024-06-06 08:45:00',
      estado_extraccion: 'error',
      despacho_juzgado: 'Juzgado 10° Civil del Circuito de Bogotá',
      tipo_consulta: 'Número de Radicado',
      solicitud_nombre: 'Proceso comercial ABC S.A.S vs Distribuidora XYZ',
      resultados_encontrados: 0,
      actuaciones_nuevas: 0,
      error_message: 'Error de conexión con el servidor judicial'
    },
    {
      id: 4,
      numero_radicado: '11001-31-04-004-2024-00321',
      fecha_ejecucion: '2024-06-05 16:20:00',
      estado_extraccion: 'exitoso',
      despacho_juzgado: 'Juzgado 4° de Familia de Bogotá',
      tipo_consulta: 'Nombre/Razón Social',
      solicitud_nombre: 'Consulta proceso familiar - Divorcio contentioso',
      resultados_encontrados: 1,
      actuaciones_nuevas: 1
    },
    {
      id: 5,
      numero_radicado: '11001-31-06-005-2024-00654',
      fecha_ejecucion: '2024-06-05 12:10:00',
      estado_extraccion: 'exitoso',
      despacho_juzgado: 'Juzgado 6° Penal del Circuito de Bogotá',
      tipo_consulta: 'Número de Radicado',
      solicitud_nombre: 'Proceso penal - Hurto calificado',
      resultados_encontrados: 4,
      actuaciones_nuevas: 2
    }
  ]
  
  // Filtrar historial si viene de una solicitud específica
  const historialFiltrado = solicitudIdFromUrl 
    ? historialMock.filter(item => item.solicitud_nombre.includes(nombreFromUrl || ''))
    : historialMock
  
  // 🎯 Handlers básicos
  const handleRefresh = () => {
    refetch()
    toast.info('Actualizando', 'Cargando últimos datos...')
  }
  
  const handleCreateSolicitud = () => {
    navigate('/solicitudes/select-type')
  }

  // 🎨 Renderizado del breadcrumb
  const renderBreadcrumb = () => {
    if (solicitudIdFromUrl && nombreFromUrl) {
      return (
        <div className="mb-lg p-sm bg-interactive-default bg-opacity-10 border border-interactive-default border-opacity-30 rounded-lg">
          <div className="flex items-center gap-sm text-body-auxiliary">
            <Link to="/dashboard" className="text-interactive-default hover:text-interactive-hover transition-colors">
              Dashboard
            </Link>
            <span className="text-text-secondary">→</span>
            <span className="text-text-secondary">Historial</span>
            <span className="text-text-secondary">→</span>
            <span className="font-medium text-interactive-default">
              {decodeURIComponent(nombreFromUrl)}
            </span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-xs text-body-auxiliary text-interactive-default hover:text-interactive-hover underline transition-colors"
          >
            ← Volver al Dashboard
          </button>
        </div>
      )
    }
    return null
  }

  return (
    <div className="container max-w-7xl mx-auto">
      
      {/* 🎯 Header del Dashboard */}
      <div className="dashboard-header">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-lg">
          <div>
            <h1 className="page-title">
              Historial de Resultados
              {nombreFromUrl && (
                <span className="text-lg font-normal text-text-secondary ml-sm">
                  - {decodeURIComponent(nombreFromUrl)}
                </span>
              )}
            </h1>
            <p className="page-subtitle">
              {solicitudIdFromUrl 
                ? `Historial filtrado para la solicitud seleccionada`
                : 'Consulta el historial detallado y analytics de tus solicitudes'
              }
            </p>
          </div>

          {/* 🎛️ Controles principales */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-sm">
            
            {/* Toggle de vista */}
            <div className="flex items-center bg-bg-light rounded-lg p-xs border border-border-default">
              <button
                onClick={() => setViewMode('historial')}
                className={cn(
                  'flex items-center space-x-xs px-sm py-xs rounded-md transition-all duration-200',
                  viewMode === 'historial'
                    ? 'bg-interactive-default text-text-base shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-canvas'
                )}
              >
                <Eye className="w-4 h-4" />
                <span className="text-body-auxiliary font-medium">Historial</span>
              </button>
              
              <button
                onClick={() => setViewMode('analytics')}
                className={cn(
                  'flex items-center space-x-xs px-sm py-xs rounded-md transition-all duration-200',
                  viewMode === 'analytics'
                    ? 'bg-interactive-default text-text-base shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-canvas'
                )}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-body-auxiliary font-medium">Analytics</span>
              </button>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                icon={<RefreshCw className="w-4 h-4" />}
                disabled={isLoading}
                className="text-text-secondary hover:text-text-primary"
              >
                Actualizar
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateSolicitud}
                icon={<Plus className="w-4 h-4" />}
              >
                Nueva Consulta
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 Breadcrumb para navegación contextual */}
      {renderBreadcrumb()}
      
      {/* 📊 Contenido Principal */}
      <div className="bg-bg-canvas rounded-lg border border-border-default shadow-sm overflow-hidden">
        
        {/* Header de la sección */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-lg border-b border-border-default">
          <div>
            <h3 className="text-heading-h3 font-heading text-text-primary">
              {viewMode === 'analytics' ? 'Dashboard de Analytics' : 'Resultados Históricos'}
            </h3>
            <p className="text-body-auxiliary text-text-secondary mt-xs">
              {viewMode === 'analytics' 
                ? 'Insights y tendencias de tus consultas judiciales'
                : `${historialFiltrado.length} resultado${historialFiltrado.length !== 1 ? 's' : ''} encontrado${historialFiltrado.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>
        
        {/* 🎯 Contenido dinámico */}
        <div className="min-h-[600px] p-lg">
          {error ? (
            <div className="text-center py-xl">
              <AlertTriangle className="w-12 h-12 text-feedback-error mx-auto mb-md" />
              <h3 className="text-heading-h3 text-feedback-error mb-sm">Error al cargar historial</h3>
              <p className="text-text-secondary mb-lg">
                No se pudieron cargar los datos del historial. Intenta nuevamente.
              </p>
              <Button
                variant="primary"
                onClick={handleRefresh}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Reintentar
              </Button>
            </div>
          ) : isLoading ? (
            <div className="text-center py-xl">
              <div className="loading-spinner mx-auto mb-lg"></div>
              <h3 className="text-heading-h3 text-text-primary mb-sm">Cargando historial...</h3>
              <p className="text-text-secondary">
                Obteniendo los últimos resultados de tus consultas
              </p>
            </div>
          ) : (
            <div className="space-y-md">
              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-lg">
                <div className="bg-bg-light rounded-lg p-md text-center">
                  <div className="text-heading-h2 font-heading text-feedback-success">
                    {historialFiltrado.filter(item => item.estado_extraccion === 'exitoso').length}
                  </div>
                  <p className="text-body-auxiliary text-text-secondary">Exitosos</p>
                </div>
                <div className="bg-bg-light rounded-lg p-md text-center">
                  <div className="text-heading-h2 font-heading text-feedback-error">
                    {historialFiltrado.filter(item => item.estado_extraccion === 'error').length}
                  </div>
                  <p className="text-body-auxiliary text-text-secondary">Con errores</p>
                </div>
                <div className="bg-bg-light rounded-lg p-md text-center">
                  <div className="text-heading-h2 font-heading text-text-primary">
                    {historialFiltrado.reduce((acc, item) => acc + item.resultados_encontrados, 0)}
                  </div>
                  <p className="text-body-auxiliary text-text-secondary">Resultados</p>
                </div>
                <div className="bg-bg-light rounded-lg p-md text-center">
                  <div className="text-heading-h2 font-heading text-feedback-info">
                    {new Set(historialFiltrado.map(item => item.despacho_juzgado)).size}
                  </div>
                  <p className="text-body-auxiliary text-text-secondary">Despachos</p>
                </div>
              </div>

              {/* Lista de resultados */}
              <div className="space-y-sm">
                {historialFiltrado.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-bg-light border border-border-default rounded-lg p-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-md">
                      {/* Información principal */}
                      <div className="flex-1">
                        <div className="flex items-center gap-sm mb-xs">
                          <div className={cn(
                            "w-3 h-3 rounded-full",
                            item.estado_extraccion === 'exitoso' ? 'bg-feedback-success' : 'bg-feedback-error'
                          )}></div>
                          <span className="font-medium text-text-primary">{item.numero_radicado}</span>
                          {item.actuaciones_nuevas > 0 && (
                            <span className="bg-interactive-default text-text-base px-xs py-1 text-xs rounded-md font-medium">
                              {item.actuaciones_nuevas} nueva{item.actuaciones_nuevas > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <h4 className="text-body-paragraph font-medium text-text-primary mb-xs">
                          {item.solicitud_nombre}
                        </h4>
                        <p className="text-body-auxiliary text-text-secondary">
                          {item.despacho_juzgado}
                        </p>
                        {item.error_message && (
                          <p className="text-body-auxiliary text-feedback-error mt-xs">
                            Error: {item.error_message}
                          </p>
                        )}
                      </div>

                      {/* Metadatos */}
                      <div className="flex flex-col lg:items-end gap-xs">
                        <span className="text-body-auxiliary text-text-secondary">
                          {new Date(item.fecha_ejecucion).toLocaleString('es-CO', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="text-body-auxiliary text-text-secondary">
                          {item.tipo_consulta}
                        </span>
                        <span className="text-body-auxiliary font-medium text-text-primary">
                          {item.resultados_encontrados} resultado{item.resultados_encontrados !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mensaje si no hay resultados */}
              {historialFiltrado.length === 0 && (
                <div className="text-center py-xl">
                  <TrendingUp className="w-12 h-12 text-text-secondary mx-auto mb-md" />
                  <h3 className="text-heading-h3 text-text-primary mb-sm">
                    No hay resultados
                  </h3>
                  <p className="text-text-secondary mb-lg">
                    {solicitudIdFromUrl 
                      ? 'No se encontraron resultados para esta solicitud específica.'
                      : 'Aún no hay resultados en el historial. Crea tu primera consulta para comenzar.'
                    }
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleCreateSolicitud}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Crear Nueva Consulta
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 📱 Información temporal de desarrollo */}
      <div className="mt-xl p-lg bg-feedback-info bg-opacity-10 border border-feedback-info border-opacity-30 rounded-lg">
        <div className="flex items-start space-x-sm">
          <Wrench className="w-5 h-5 text-feedback-info flex-shrink-0 mt-xs" />
          <div>
            <h4 className="text-body-paragraph font-medium text-feedback-info mb-xs">
              Página en Desarrollo
            </h4>
            <p className="text-body-auxiliary text-text-secondary">
              El historial ahora muestra datos de ejemplo. Las funcionalidades avanzadas como filtros, 
              export y analytics detallados están siendo implementados.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  )
}

HistorialPageEnhanced.displayName = 'HistorialPageEnhanced'

export default HistorialPageEnhanced