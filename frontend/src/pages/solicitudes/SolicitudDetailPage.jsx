import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Edit3, Trash2, Play, Pause, Download } from 'lucide-react'

// Layout y UI Components
import Layout from '../../components/layout/Layout'
import Breadcrumb, { useBreadcrumb } from '../../components/ui/Breadcrumb'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { useToast } from '../../components/ui/Toast'

// Componentes específicos de solicitud
import ProcessInfo from '../../components/solicitudes/ProcessInfo'
import ExecutionHistory from '../../components/solicitudes/ExecutionHistory'

// Componentes mejorados (Sprint 1, 2 & 3)
import StatusOverlay from '../../components/solicitudes/enhanced/StatusOverlay'
import FloatingActionMenu, { useSolicitudFAB } from '../../components/solicitudes/enhanced/FloatingActionMenu'
import StatusIndicator from '../../components/solicitudes/enhanced/StatusIndicator'
import MetricsGrid from '../../components/solicitudes/enhanced/MetricsGrid'
import TabContainer from '../../components/solicitudes/enhanced/TabContainer'
import InteractiveTimeline, { useTimelineData } from '../../components/solicitudes/enhanced/InteractiveTimeline'
import AdvancedFilters, { useAdvancedFilters } from '../../components/solicitudes/enhanced/AdvancedFilters'
import RealtimeNotifications from '../../components/solicitudes/enhanced/RealtimeNotifications'
// Sprint 3: Advanced Features
import { useSolicitudOptimistic } from '../../components/solicitudes/enhanced/OptimisticUpdates'
import TemporalComparison from '../../components/solicitudes/enhanced/TemporalComparison'
import SmartExport from '../../components/solicitudes/enhanced/SmartExport'
import OptimizationWizard from '../../components/solicitudes/enhanced/OptimizationWizard'

// Services y utils
import { solicitudesService } from '../../services/solicitudes'
import { cn } from '../../utils/cn'

/**
 * Página de detalles de solicitud completamente integrada con el design system
 */
const SolicitudDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { buildSolicitudBreadcrumb } = useBreadcrumb()
  
  // Estados
  const [solicitud, setSolicitud] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Cargar datos de la solicitud
  useEffect(() => {
    if (id) {
      loadSolicitud()
    }
  }, [id])

  const loadSolicitud = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // En desarrollo, usar datos de prueba si el servicio falla
      let data
      try {
        data = await solicitudesService.getSolicitud(id)
      } catch (serviceError) {
        console.warn('Servicio no disponible, usando datos de prueba:', serviceError)
        // Datos de prueba que coinciden con la estructura esperada
        data = {
          id: id,
          alias: `Consulta proceso demanda laboral - Caso ${id}`,
          nombre_descriptivo: `Seguimiento demanda laboral - Usuario vs Empresa ${id}`,
          tipo_busqueda: 'radicado',
          criterio_busqueda_radicado: `2023-CV-${String(id).padStart(6, '0')}`,
          criterio_busqueda_nombre: 'María García López',
          frecuencia_envio: 'diaria',
          activa: true,
          estado: 'activa',
          fecha_creacion: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          ultima_ejecucion: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          despacho_juzgado: 'Juzgado Laboral del Circuito de Bogotá',
          email_notificacion: 'usuario@example.com',
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
        }
      }
      
      setSolicitud(data)
    } catch (err) {
      console.error('Error loading solicitud:', err)
      setError('Error cargando los detalles de la solicitud')
    } finally {
      setLoading(false)
    }
  }

  // Handlers de acciones
  const handleEdit = () => {
    navigate(`/solicitudes/${id}/editar`)
  }

  const handleDelete = async () => {
    const confirmMessage = `¿Estás seguro de que deseas eliminar "${solicitud.nombre_descriptivo}"?\n\nEsta acción no se puede deshacer.`
    
    if (window.confirm(confirmMessage)) {
      setActionLoading(true)
      try {
        // Simular eliminación
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        toast.success(
          'Solicitud eliminada',
          'La solicitud se eliminó correctamente'
        )
        navigate('/dashboard')
      } catch (error) {
        toast.error(
          'Error al eliminar',
          'No se pudo eliminar la solicitud'
        )
      } finally {
        setActionLoading(false)
      }
    }
  }

  const handleToggleStatus = async () => {
    try {
      const newStatus = solicitud.activa ? 'pausada' : 'activa'
      
      // Usar optimistic updates del Sprint 3
      await optimisticUpdates.toggleStatus(newStatus)
      
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      // El optimistic update ya maneja el rollback y el toast de error
    }
  }

  const handleRefresh = async () => {
    await loadSolicitud()
    toast.success('Datos actualizados', 'Se cargaron los últimos datos')
  }

  const handleDownload = () => {
    toast.success('Descarga iniciada', 'El reporte se está generando...')
    console.log('Descargar reporte para solicitud:', id)
  }

  // Configuración del FAB
  const fabConfig = useSolicitudFAB({
    solicitud,
    onToggleStatus: handleToggleStatus,
    onEdit: handleEdit,
    onDownload: handleDownload,
    onDelete: handleDelete,
    onRefresh: handleRefresh,
    isLoading: actionLoading
  })

  // Sprint 3: Optimistic Updates
  const optimisticUpdates = useSolicitudOptimistic(solicitud, setSolicitud)

  // Datos de timeline y filtros (Sprint 2)
  const timelineEvents = useTimelineData(id)
  const { filteredData, handleFilter, exportToCSV } = useAdvancedFilters([])
  
  // Mock data para comparación temporal (Sprint 3)
  const performanceData = {
    current: {
      totalExecutions: Math.floor(Math.random() * 100) + 50,
      successRate: Math.floor(Math.random() * 20) + 80,
      avgDuration: Math.random() * 3 + 1,
      uptime: Math.floor(Math.random() * 10) + 90
    },
    previous: {
      totalExecutions: Math.floor(Math.random() * 80) + 40,
      successRate: Math.floor(Math.random() * 15) + 75,
      avgDuration: Math.random() * 4 + 1.5,
      uptime: Math.floor(Math.random() * 8) + 85
    }
  }
  
  // Mock data para el historial de ejecuciones
  const executionHistoryData = [
    {
      id: '1',
      date: new Date().toISOString(),
      status: 'exitosa',
      duration: '2.3',
      despacho: 'Juzgado Laboral del Circuito',
      title: 'Consulta exitosa',
      description: 'Proceso consultado correctamente'
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'fallida',
      duration: '5.2',
      despacho: 'Juzgado Civil del Circuito',
      title: 'Error de timeout',
      description: 'El servidor no respondió a tiempo'
    },
    {
      id: '3',
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: 'exitosa',
      duration: '1.8',
      despacho: 'Juzgado Penal del Circuito',
      title: 'Consulta completada',
      description: 'Sin novedades en el proceso'
    }
  ]

  // Construir breadcrumb
  const breadcrumbItems = solicitud 
    ? buildSolicitudBreadcrumb(id, solicitud.nombre_descriptivo || solicitud.alias)
    : [{ label: 'Cargando...', href: null }]

  // Loading State
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-md md:px-lg lg:px-xl py-lg">
          <div className="flex flex-col items-center justify-center min-h-96 space-y-lg">
            <LoadingSpinner size="lg" />
            <div className="text-center space-y-sm">
              <h2 className="text-heading-h3 font-heading text-text-primary">
                Cargando detalles de la solicitud
              </h2>
              <p className="text-body-paragraph text-text-secondary">
                Esto puede tomar unos segundos...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // Error State
  if (error || !solicitud) {
    return (
      <Layout>
        <div className="container mx-auto px-md md:px-lg lg:px-xl py-lg">
          <Card variant="error" size="lg" className="max-w-2xl mx-auto">
            <Card.Content>
              <div className="text-center space-y-lg">
                <div className="text-feedback-error text-5xl">❌</div>
                <div className="space-y-sm">
                  <h2 className="text-heading-h3 font-heading text-feedback-error">
                    Error al cargar la solicitud
                  </h2>
                  <p className="text-body-paragraph text-text-secondary">
                    {error || 'La solicitud solicitada no fue encontrada'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-sm justify-center">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/dashboard')}
                    icon={<ArrowLeft size={16} />}
                  >
                    Volver al Dashboard
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleRefresh}
                    icon={<RefreshCw size={16} />}
                    loading={loading}
                  >
                    Intentar de nuevo
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </Layout>
    )
  }

  // Main Content
  return (
    <Layout>
      <div className="container mx-auto px-md md:px-lg lg:px-xl py-lg">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header compacto con información esencial */}
        <div className="mb-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-md mb-md">
            <div className="flex-1">
              <h1 className="text-heading-h2 font-heading text-text-primary mb-xs">
                {solicitud.nombre_descriptivo || solicitud.alias}
              </h1>
              <p className="text-body-auxiliary text-text-secondary">
                Solicitud creada el {new Date(solicitud.fecha_creacion).toLocaleDateString('es-CO')}
              </p>
            </div>
            
            {/* Acciones en desktop (ocultas en mobile por FAB) */}
            <div className="hidden lg:flex gap-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                icon={<RefreshCw size={14} />}
                disabled={actionLoading}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                icon={<Download size={14} />}
                disabled={actionLoading}
              >
                Descargar
              </Button>
            </div>
          </div>
        </div>

        {/* StatusIndicator - Información de estado en tiempo real */}
        <StatusIndicator
          status={solicitud.estado}
          lastUpdate={solicitud.updated_at}
          nextExecution={solicitud.activa ? "En 4h 23m" : null}
          isLive={true}
          solicitudId={id}
          className="mb-lg"
        />

        {/* StatusOverlay - Banner funcional optimizado */}
        <StatusOverlay
          solicitud={solicitud}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEdit}
          isLoading={actionLoading}
          className="mb-xl"
        />

        {/* MetricsGrid - KPIs destacados */}
        <div className="mb-xl">
          <h2 className="text-heading-h3 font-heading text-text-primary mb-lg">
            Métricas de Rendimiento
          </h2>
          <MetricsGrid solicitud={solicitud} />
        </div>

        {/* Sistema de Tabs Inteligentes - Sprint 2 */}
        <TabContainer defaultTab="overview" className="mb-xl">
          <TabContainer.List>
            <TabContainer.Tab
              id="overview"
              label="Resumen"
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>}
              count={1}
            />
            <TabContainer.Tab
              id="executions"
              label="Ejecuciones"
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>}
              count={executionHistoryData.length}
            />
            <TabContainer.Tab
              id="timeline"
              label="Actividad"
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
              count={timelineEvents.length}
            />
            <TabContainer.Tab
              id="settings"
              label="Configuración"
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>}
            />
            <TabContainer.Tab
              id="analytics"
              label="Análisis"
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>}
            />
            <TabContainer.Tab
              id="export"
              label="Exportar"
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>}
            />
            <TabContainer.Tab
              id="optimization"
              label="Optimización"
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>}
            />
          </TabContainer.List>

          {/* Tab Panel: Resumen */}
          <TabContainer.Panel id="overview">
            <div className="space-y-lg">
              {/* Process Information */}
              <ProcessInfo solicitud={solicitud} />
              
              {/* Resumen de actividad reciente */}
              <Card>
                <Card.Header>
                  <h3 className="text-heading-h3 font-heading text-text-primary">
                    Actividad Reciente
                  </h3>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-md">
                    {timelineEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center gap-md p-sm hover:bg-bg-light rounded-md transition-colors">
                        <div className="w-2 h-2 rounded-full bg-interactive-default" />
                        <div className="flex-1">
                          <p className="text-body-paragraph text-text-primary font-medium">
                            {event.title}
                          </p>
                          <p className="text-body-auxiliary text-text-secondary">
                            {event.description}
                          </p>
                        </div>
                        <span className="text-body-auxiliary text-text-secondary">
                          {new Date(event.date).toLocaleDateString('es-CO')}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </div>
          </TabContainer.Panel>

          {/* Tab Panel: Ejecuciones con Filtros Avanzados */}
          <TabContainer.Panel id="executions">
            <div className="space-y-lg">
              <AdvancedFilters
                data={executionHistoryData}
                onFilter={handleFilter}
                onExport={exportToCSV}
              />
              
              {/* Historial de Ejecuciones */}
              <ExecutionHistory 
                solicitudId={id} 
                data={filteredData.length > 0 ? filteredData : executionHistoryData} 
              />
            </div>
          </TabContainer.Panel>

          {/* Tab Panel: Timeline Interactivo */}
          <TabContainer.Panel id="timeline">
            <InteractiveTimeline
              events={timelineEvents}
              onEventClick={(event) => {
                console.log('Evento clickeado:', event)
                toast.info('Evento seleccionado', `Ver detalles de: ${event.title}`)
              }}
              onEventFilter={(filters) => {
                console.log('Filtros aplicados:', filters)
              }}
              showFilters={true}
              expandable={true}
            />
          </TabContainer.Panel>

          {/* Tab Panel: Configuración */}
          <TabContainer.Panel id="settings">
            <div className="space-y-lg">
              <div className="text-center py-xl">
                <h3 className="text-heading-h3 font-heading text-text-primary mb-sm">
                  Configuración de la Solicitud
                </h3>
                <p className="text-body-paragraph text-text-secondary mb-lg">
                  Aquí podrás modificar los parámetros de tu consulta judicial.
                </p>
                <Button
                  variant="primary"
                  onClick={handleEdit}
                  icon={<Edit3 size={16} />}
                >
                  Editar Configuración
                </Button>
              </div>
            </div>
          </TabContainer.Panel>

          {/* Tab Panel: Análisis Temporal - Sprint 3 */}
          <TabContainer.Panel id="analytics">
            <TemporalComparison
              currentData={performanceData.current}
              previousData={performanceData.previous}
              period="30d"
            />
          </TabContainer.Panel>

          {/* Tab Panel: Exportación Inteligente - Sprint 3 */}
          <TabContainer.Panel id="export">
            <SmartExport
              data={executionHistoryData}
              solicitud={solicitud}
              onExport={(exportInfo) => {
                console.log('Exportación completada:', exportInfo)
                toast.success(
                  'Exportación completada',
                  `Archivo ${exportInfo.fileName} descargado correctamente`
                )
              }}
            />
          </TabContainer.Panel>

          {/* Tab Panel: Asistente de Optimización - Sprint 3 */}
          <TabContainer.Panel id="optimization">
            <OptimizationWizard
              solicitud={solicitud}
              performanceData={performanceData.current}
              onApplyOptimization={(optimizations) => {
                console.log('Optimizaciones aplicadas:', optimizations)
                toast.success(
                  'Optimizaciones aplicadas',
                  `Se implementaron ${optimizations.length} mejoras`
                )
              }}
            />
          </TabContainer.Panel>
        </TabContainer>

        {/* Footer Actions */}
        <div className="mt-2xl pt-xl border-t border-border-default">
          <div className="flex flex-col sm:flex-row gap-sm justify-center">
            <Button
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              icon={<ArrowLeft size={16} />}
            >
              Volver al Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate(`/historial?solicitud=${id}`)}
            >
              Ver historial completo
            </Button>
          </div>
        </div>

        {/* Notificaciones en Tiempo Real - Sprint 2 */}
        <RealtimeNotifications
          solicitudId={id}
          onStatusChange={(notification) => {
            console.log('Estado cambiado:', notification)
            // Recargar datos si es necesario
            if (notification.type === 'status_change') {
              loadSolicitud()
            }
          }}
          onNewExecution={(notification) => {
            console.log('Nueva ejecución:', notification)
            // Mostrar toast de nueva ejecución
            toast.info(
              notification.title,
              notification.message
            )
          }}
          position="top-right"
          maxNotifications={3}
          autoRemoveDelay={6000}
          soundEnabled={true}
        />

        {/* FloatingActionMenu - FAB para acciones rápidas */}
        <FloatingActionMenu
          primary={fabConfig.primary}
          actions={fabConfig.actions}
          position="bottom-right"
        />
      </div>
    </Layout>
  )
}

export default SolicitudDetailPage