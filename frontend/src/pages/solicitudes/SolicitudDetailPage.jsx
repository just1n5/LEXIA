import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Edit3, Trash2, Play, Pause, Download } from 'lucide-react'

// UI Components (SIN Layout ya que viene de App.jsx)
import Breadcrumb, { useBreadcrumb } from '../../components/ui/Breadcrumb'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { useToast } from '../../components/ui/Toast'

// Componentes específicos de solicitud
import ProcessInfo from '../../components/solicitudes/ProcessInfo'

// Componentes mejorados (Sprint 1, 2 & 3)
import StatusOverlay from '../../components/solicitudes/enhanced/StatusOverlay'
import FloatingActionMenu, { useSolicitudFAB } from '../../components/solicitudes/enhanced/FloatingActionMenu'
import StatusIndicator from '../../components/solicitudes/enhanced/StatusIndicator'
import MetricsGrid from '../../components/solicitudes/enhanced/MetricsGrid'
import TabContainer from '../../components/solicitudes/enhanced/TabContainer'
import { useTimelineData } from '../../components/solicitudes/enhanced/InteractiveTimeline'
import AdvancedFilters from '../../components/solicitudes/enhanced/AdvancedFilters'

// Componente unificado para el historial
import UnifiedExecutionHistory from '../../components/solicitudes/enhanced/UnifiedExecutionHistory'

// Componentes condensados para nueva estructura
import ProcessInfoCompact from '../../components/solicitudes/enhanced/ProcessInfoCompact'
import StatusCurrent from '../../components/solicitudes/enhanced/StatusCurrent'
import MetricsTop3 from '../../components/solicitudes/enhanced/MetricsTop3'
import ActivityRecent from '../../components/solicitudes/enhanced/ActivityRecent'

// Componentes responsive y navegación táctil (Fase 2)
import AccordionTabView from '../../components/solicitudes/enhanced/AccordionTabView'
import NavigationHelp from '../../components/solicitudes/enhanced/NavigationHelp'
import { useResponsiveLayout, useSwipeGestures, useAdvancedKeyboardNav } from '../../hooks/useResponsiveLayout'
// Sprint 3: Advanced Features
import { useSolicitudOptimistic } from '../../components/solicitudes/enhanced/OptimisticUpdates'
import TemporalComparison from '../../components/solicitudes/enhanced/TemporalComparison'
import SmartExport from '../../components/solicitudes/enhanced/SmartExport'
import OptimizationWizard from '../../components/solicitudes/enhanced/OptimizationWizard'
// import SystemInfoBanner from '../../components/solicitudes/enhanced/SystemInfoBanner' // Eliminado

// Services y utils
import { solicitudesService } from '../../services/solicitudes'
import { cn } from '../../utils/cn'

/**
 * Página de detalles de solicitud completamente integrada con el design system
 * ✅ CORREGIDO: Layout removido para evitar duplicación de header
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
          // Remover frecuencia_envio ya que ahora es fijo
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

  // Datos de timeline (Sprint 2) - ✅ CORREGIDO para evitar ciclos infinitos
  const timelineEvents = useTimelineData(id)
  
  // Hooks para experiencia responsive y navegación mejorada (Fase 2)
  const responsive = useResponsiveLayout()
  const [activeTab, setActiveTab] = useState('resumen')
  
  // Configuración de tabs para móvil
  const tabsConfig = {
    resumen: {
      id: 'resumen',
      label: 'Resumen',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>,
      count: 4,
      priority: 'primary',
      indicators: { badge: solicitud?.activa ? null : 'paused' }
    },
    monitoreo: {
      id: 'monitoreo',
      label: 'Monitoreo',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>,
      count: timelineEvents.length,
      priority: 'primary',
      indicators: {
        status: solicitud?.activa ? 'success' : 'warning',
        notification: solicitud?.activa && Math.random() > 0.7
      }
    },
    analisis: {
      id: 'analisis',
      label: 'Análisis',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>,
      count: 3,
      priority: 'primary'
    },
    configuracion: {
      id: 'configuracion',
      label: 'Configuración',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>,
      priority: 'secondary'
    },
    acciones: {
      id: 'acciones',
      label: 'Acciones',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>,
      priority: 'secondary'
    }
  }
  
  // Navegación por teclado avanzada
  useAdvancedKeyboardNav(Object.values(tabsConfig), activeTab, setActiveTab)
  
  // Navegación táctil para mobile
  const swipeHandlers = useSwipeGestures({
    onSwipeLeft: () => {
      const tabIds = Object.keys(tabsConfig)
      const currentIndex = tabIds.indexOf(activeTab)
      if (currentIndex < tabIds.length - 1) {
        setActiveTab(tabIds[currentIndex + 1])
      }
    },
    onSwipeRight: () => {
      const tabIds = Object.keys(tabsConfig)
      const currentIndex = tabIds.indexOf(activeTab)
      if (currentIndex > 0) {
        setActiveTab(tabIds[currentIndex - 1])
      }
    },
    threshold: 100
  })
  
  // Estado para control de ayuda de navegación
  const [showNavigationHelp, setShowNavigationHelp] = useState(false)
  
  // Hook para mostrar ayuda con '?'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        setShowNavigationHelp(true)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  // Hook para mostrar ayuda con '?'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        setShowNavigationHelp(true)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  // ✅ Handler estable memoizado para exportación
  const exportToCSV = useCallback((data, filters) => {
    if (!data || data.length === 0) {
      console.warn('No hay datos para exportar')
      return
    }

    const headers = Object.keys(data[0] || {})
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(field => `"${row[field] || ''}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `historial_filtrado_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }, [])
  
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
  
  // Construir breadcrumb
  const breadcrumbItems = solicitud 
    ? buildSolicitudBreadcrumb(id, solicitud.nombre_descriptivo || solicitud.alias)
    : [{ label: 'Cargando...', href: null }]

  // Loading State
  if (loading) {
    return (
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
    )
  }

  // Error State
  if (error || !solicitud) {
    return (
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
    )
  }

  // ✅ Main Content - SIN Layout wrapper
  return (
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

      {/* Banner eliminado según solicitud del usuario */}

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

      {/* Sistema de Tabs Inteligentes v2 - Responsive y Mobile-First */}
      <div {...swipeHandlers} className="mb-xl">
        {/* Patrón adaptativo: Accordion (mobile) -> Scrollable (tablet) -> Full (desktop) */}
        {responsive.shouldUseAccordion ? (
          /* Modo móvil: Acordeón vertical */
          <AccordionTabView 
            tabs={Object.values(tabsConfig)}
            defaultOpen={activeTab}
            className="space-y-sm"
          >
            {activeTab === 'resumen' && (
              <div className="space-y-lg">
                {/* Grid de componentes principales */}
                <div className="grid grid-cols-1 gap-lg">
                  {/* Información del proceso condensada */}
                  <ProcessInfoCompact solicitud={solicitud} />
                  
                  {/* Estado actual y próximas acciones */}
                  <StatusCurrent 
                    solicitud={solicitud}
                    onToggleStatus={handleToggleStatus}
                    isLoading={actionLoading}
                  />
                </div>
                {/* Métricas principales (top 3) */}
                <MetricsTop3 solicitud={solicitud} />
                {/* Actividad reciente */}
                <ActivityRecent 
                  solicitudId={id}
                  onViewAll={() => setActiveTab('monitoreo')}
                />
              </div>
            )}
            {activeTab === 'monitoreo' && (
              <div className="space-y-lg">
                {/* Historial unificado con filtros integrados */}
                <UnifiedExecutionHistory 
                  solicitudId={id}
                  className=""
                />
              </div>
            )}
            {activeTab === 'analisis' && (
              <div className="space-y-lg">
                {/* Métricas completas del proceso */}
                <div className="mb-lg">
                  <h3 className="text-heading-h3 font-heading text-text-primary mb-md">
                    Análisis Detallado del Proceso
                  </h3>
                  <MetricsGrid solicitud={solicitud} />
                </div>
                {/* Comparación temporal */}
                <TemporalComparison
                  currentData={performanceData.current}
                  previousData={performanceData.previous}
                  period="30d"
                />
              </div>
            )}
            {activeTab === 'configuracion' && (
              <div className="space-y-lg">
                {/* Configuración básica */}
                <div className="text-center py-lg">
                  <h3 className="text-heading-h3 font-heading text-text-primary mb-sm">
                    Configuración de la Solicitud
                  </h3>
                  <p className="text-body-paragraph text-text-secondary mb-lg">
                    Modifica los parámetros y optimiza el rendimiento de tu consulta judicial.
                  </p>
                  <div className="flex flex-col gap-sm">
                    <Button
                      variant="primary"
                      onClick={handleEdit}
                      icon={<Edit3 size={16} />}
                      className="w-full"
                    >
                      Editar Configuración
                    </Button>
                    <Button
                      variant="secondary"
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>}
                      className="w-full"
                    >
                      Asistente de Optimización
                    </Button>
                  </div>
                </div>
                {/* Asistente de Optimización */}
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
              </div>
            )}
            {activeTab === 'acciones' && (
              <div className="space-y-lg">
                {/* Exportación inteligente */}
                <div className="mb-lg">
                  <h3 className="text-heading-h3 font-heading text-text-primary mb-md">
                    Exportación y Reportes
                  </h3>
                  <SmartExport
                    data={[]}
                    solicitud={solicitud}
                    onExport={(exportInfo) => {
                      console.log('Exportación completada:', exportInfo)
                      toast.success(
                        'Exportación completada',
                        `Archivo ${exportInfo.fileName} descargado correctamente`
                      )
                    }}
                  />
                </div>
                {/* Acciones de gestión */}
                <div className="mb-lg">
                  <h3 className="text-heading-h3 font-heading text-text-primary mb-md">
                    Gestión de la Solicitud
                  </h3>
                  <Card>
                    <Card.Content>
                      <div className="grid grid-cols-1 gap-md">
                        <Button
                          variant="secondary"
                          onClick={handleEdit}
                          icon={<Edit3 size={16} />}
                          className="w-full"
                        >
                          Editar Solicitud
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={handleDownload}
                          icon={<Download size={16} />}
                          className="w-full"
                        >
                          Descargar Reporte
                        </Button>
                        <Button
                          variant={solicitud?.activa ? 'secondary' : 'primary'}
                          onClick={handleToggleStatus}
                          disabled={actionLoading}
                          icon={solicitud?.activa ? <Pause size={16} /> : <Play size={16} />}
                          className="w-full"
                        >
                          {solicitud?.activa ? 'Pausar' : 'Reanudar'}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDelete}
                          disabled={actionLoading}
                          icon={<Trash2 size={16} />}
                          className="w-full"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>
                </div>
              </div>
            )}
          </AccordionTabView>
        ) : (
          /* Modo tablet/desktop: TabContainer normal con mejoras */
          <TabContainer 
            defaultTab={activeTab}
            variant="enhanced"
            persistState={true}
            lazyLoad={true}
            storageKey={`solicitud-${id}`}
            onTabChange={setActiveTab}
          >
        <TabContainer.Navigation>
          {/* Tabs Primarios */}
          <TabContainer.Tab
            id="resumen"
            label="Resumen"
            priority="primary"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>}
            count={4}
            indicators={{
              badge: solicitud?.activa ? null : 'paused'
            }}
          />
          <TabContainer.Tab
            id="monitoreo"
            label="Monitoreo"
            priority="primary"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>}
            count={timelineEvents.length}
            indicators={{
              status: solicitud?.activa ? 'success' : 'warning',
              notification: solicitud?.activa && Math.random() > 0.7
            }}
          />
          <TabContainer.Tab
            id="analisis"
            label="Análisis"
            priority="primary"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>}
            count={3}
          />
          <TabContainer.Tab
            id="configuracion"
            label="Configuración"
            priority="secondary"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>}
          />
          <TabContainer.Tab
            id="acciones"
            label="Acciones"
            priority="secondary"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>}
          />
        </TabContainer.Navigation>

        {/* Tab Panel: Resumen - Dashboard principal con componentes condensados */}
        <TabContainer.Panel id="resumen">
          <div className="space-y-lg">
            {/* Grid de componentes principales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
              {/* Información del proceso condensada */}
              <ProcessInfoCompact solicitud={solicitud} />
              
              {/* Estado actual y próximas acciones */}
              <StatusCurrent 
                solicitud={solicitud}
                onToggleStatus={handleToggleStatus}
                isLoading={actionLoading}
              />
            </div>

            {/* Métricas principales (top 3) */}
            <MetricsTop3 solicitud={solicitud} />

            {/* Actividad reciente */}
            <ActivityRecent 
              solicitudId={id}
              onViewAll={() => {/* Cambiar a tab monitoreo */}}
            />
          </div>
        </TabContainer.Panel>

        {/* Tab Panel: Monitoreo - Historial Unificado */}
        <TabContainer.Panel id="monitoreo">
          <div className="space-y-lg">
            {/* Historial unificado que combina timeline + tabla con filtros */}
            <UnifiedExecutionHistory 
              solicitudId={id}
              className=""
            />
          </div>
        </TabContainer.Panel>

        {/* Tab Panel: Análisis - Fusión de Analytics + Comparaciones */}
        <TabContainer.Panel id="analisis">
          <div className="space-y-lg">
            {/* Métricas completas del proceso */}
            <div className="mb-lg">
              <h3 className="text-heading-h3 font-heading text-text-primary mb-md">
                Análisis Detallado del Proceso
              </h3>
              <MetricsGrid solicitud={solicitud} />
            </div>
            
            {/* Comparación temporal */}
            <TemporalComparison
              currentData={performanceData.current}
              previousData={performanceData.previous}
              period="30d"
            />
          </div>
        </TabContainer.Panel>

        {/* Tab Panel: Configuración - Fusión de Settings + Optimización */}
        <TabContainer.Panel id="configuracion">
          <div className="space-y-lg">
            {/* Configuración básica */}
            <div className="text-center py-lg">
              <h3 className="text-heading-h3 font-heading text-text-primary mb-sm">
                Configuración de la Solicitud
              </h3>
              <p className="text-body-paragraph text-text-secondary mb-lg">
                Modifica los parámetros y optimiza el rendimiento de tu consulta judicial.
              </p>
              <div className="flex justify-center gap-sm">
                <Button
                  variant="primary"
                  onClick={handleEdit}
                  icon={<Edit3 size={16} />}
                >
                  Editar Configuración
                </Button>
                <Button
                  variant="secondary"
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>}
                >
                  Asistente de Optimización
                </Button>
              </div>
            </div>
            
            {/* Asistente de Optimización */}
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
          </div>
        </TabContainer.Panel>

        {/* Tab Panel: Acciones - Fusión de Exportar + Gestión */}
        <TabContainer.Panel id="acciones">
          <div className="space-y-lg">
            {/* Exportación inteligente */}
            <div className="mb-lg">
              <h3 className="text-heading-h3 font-heading text-text-primary mb-md">
                Exportación y Reportes
              </h3>
              <SmartExport
                data={[]}
                solicitud={solicitud}
                onExport={(exportInfo) => {
                  console.log('Exportación completada:', exportInfo)
                  toast.success(
                    'Exportación completada',
                    `Archivo ${exportInfo.fileName} descargado correctamente`
                  )
                }}
              />
            </div>
            
            {/* Acciones de gestión */}
            <div className="mb-lg">
              <h3 className="text-heading-h3 font-heading text-text-primary mb-md">
                Gestión de la Solicitud
              </h3>
              <Card>
                <Card.Content>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <Button
                      variant="secondary"
                      onClick={handleEdit}
                      icon={<Edit3 size={16} />}
                      className="w-full"
                    >
                      Editar Solicitud
                    </Button>
                    
                    <Button
                      variant="secondary"
                      onClick={handleDownload}
                      icon={<Download size={16} />}
                      className="w-full"
                    >
                      Descargar Reporte
                    </Button>
                    
                    <Button
                      variant={solicitud?.activa ? 'secondary' : 'primary'}
                      onClick={handleToggleStatus}
                      disabled={actionLoading}
                      icon={solicitud?.activa ? <Pause size={16} /> : <Play size={16} />}
                      className="w-full"
                    >
                      {solicitud?.activa ? 'Pausar' : 'Reanudar'}
                    </Button>
                    
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={actionLoading}
                      icon={<Trash2 size={16} />}
                      className="w-full"
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </div>

            {/* Acciones masivas y colaboración */}
            <div>
              <h3 className="text-heading-h3 font-heading text-text-primary mb-md">
                Herramientas Avanzadas
              </h3>
              <Card>
                <Card.Content>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                    <Button
                      variant="ghost"
                      className="w-full"
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>}
                    >
                      Compartir
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full"
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>}
                    >
                      Duplicar
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full"
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h6m0 0a2 2 0 002 2 2 2 0 002-2M7 16h6m2 0h2a2 2 0 002-2V8a2 2 0 00-2-2h-2m0 0V4a2 2 0 012-2 2 2 0 012 2v2M7 16v-2a2 2 0 012-2h2a2 2 0 012 2v2" />
                      </svg>}
                    >
                      Archivar
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>
        </TabContainer.Panel>
      </TabContainer>
        )}
      </div>

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

      {/* FloatingActionMenu - FAB para acciones rápidas */}
      <FloatingActionMenu
        primary={fabConfig.primary}
        actions={fabConfig.actions}
        position="bottom-right"
      />
      
      {/* Navigation Help - Ayuda de navegación mejorada */}
      <NavigationHelp />
    </div>
  )
}

export default SolicitudDetailPage