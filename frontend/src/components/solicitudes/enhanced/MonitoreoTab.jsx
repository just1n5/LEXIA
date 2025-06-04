import React, { useState, useMemo } from 'react'
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Filter,
  Calendar,
  BarChart3
} from 'lucide-react'

// UI Components
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import Badge from '../../ui/Badge'
import LoadingSpinner from '../../ui/LoadingSpinner'

// Componentes existentes mejorados
import ExecutionHistory from '../ExecutionHistory'
import InteractiveTimeline from './InteractiveTimeline'

// Utils
import { cn } from '../../../utils/cn'

/**
 * MonitoreoTab - Fusión optimizada de ExecutionHistory + InteractiveTimeline
 * Ofrece vista unificada de monitoreo en tiempo real
 */
const MonitoreoTab = ({
  solicitudId,
  executionData = [],
  timelineEvents = [],
  onRefresh,
  isRefreshing = false,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState('combined') // 'combined' | 'executions' | 'timeline'
  const [showFilters, setShowFilters] = useState(false)

  // Calcular estadísticas de monitoreo en tiempo real
  const monitoringStats = useMemo(() => {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Filtrar ejecutions de las últimas 24 horas
    const executions24h = executionData.filter(exec => 
      new Date(exec.fecha_ejecucion) > last24h
    )

    const executions7d = executionData.filter(exec => 
      new Date(exec.fecha_ejecucion) > last7d
    )

    // Calcular métricas
    const totalExecutions24h = executions24h.length
    const successfulExecutions24h = executions24h.filter(exec => 
      exec.estado_extraccion === 'EXITOSA'
    ).length

    const totalExecutions7d = executions7d.length
    const successfulExecutions7d = executions7d.filter(exec => 
      exec.estado_extraccion === 'EXITOSA'
    ).length

    // Calcular tiempo promedio
    const avgDuration24h = executions24h.length > 0 
      ? executions24h.reduce((acc, exec) => acc + parseFloat(exec.tiempo_ejecucion || 0), 0) / executions24h.length
      : 0

    // Estado del sistema
    const lastExecution = executionData[0] // Asumiendo orden descendente
    const systemStatus = lastExecution ? 
      (lastExecution.estado_extraccion === 'EXITOSA' ? 'healthy' : 'warning') : 
      'unknown'

    return {
      executions24h: {
        total: totalExecutions24h,
        successful: successfulExecutions24h,
        successRate: totalExecutions24h > 0 ? Math.round((successfulExecutions24h / totalExecutions24h) * 100) : 0
      },
      executions7d: {
        total: totalExecutions7d,
        successful: successfulExecutions7d,
        successRate: totalExecutions7d > 0 ? Math.round((successfulExecutions7d / totalExecutions7d) * 100) : 0
      },
      avgDuration24h: Math.round(avgDuration24h * 10) / 10,
      systemStatus,
      lastExecution: lastExecution ? new Date(lastExecution.fecha_ejecucion) : null,
      isExecuting: isRefreshing // Simulamos que está ejecutando cuando está refrescando
    }
  }, [executionData, isRefreshing])

  // Combinar eventos de timeline y executions para vista unificada
  const combinedEvents = useMemo(() => {
    const executionEvents = executionData.slice(0, 5).map(exec => ({
      id: `exec-${exec.id}`,
      type: 'execution',
      status: exec.estado_extraccion === 'EXITOSA' ? 'success' : 'error',
      title: exec.estado_extraccion === 'EXITOSA' ? 'Ejecución exitosa' : 'Error en ejecución',
      description: `${exec.despacho_juzgado} - ${exec.tiempo_ejecucion}`,
      date: exec.fecha_ejecucion,
      metadata: {
        radicado: exec.numero_radicado_completo,
        resultados: exec.resultados_encontrados,
        duracion: exec.tiempo_ejecucion,
        despacho: exec.despacho_juzgado
      }
    }))

    // Combinar con eventos de timeline
    const allEvents = [...executionEvents, ...timelineEvents]
    
    // Ordenar por fecha descendente
    return allEvents.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [executionData, timelineEvents])

  const getStatusColor = (status) => {
    const colors = {
      healthy: 'text-feedback-success',
      warning: 'text-feedback-warning',
      error: 'text-feedback-error',
      unknown: 'text-text-secondary'
    }
    return colors[status] || colors.unknown
  }

  const getStatusBadge = (status) => {
    const badges = {
      healthy: <Badge.Success size="sm">Sistema Saludable</Badge.Success>,
      warning: <Badge.Warning size="sm">Requiere Atención</Badge.Warning>,
      error: <Badge.Error size="sm">Error Crítico</Badge.Error>,
      unknown: <Badge variant="neutral" size="sm">Estado Desconocido</Badge>
    }
    return badges[status] || badges.unknown
  }

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className={cn('space-y-lg p-lg', className)}>
      {/* Header con estado en tiempo real */}
      <div className="flex items-center justify-between mb-lg">
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-xs">
            <Activity className={cn(
              'w-6 h-6',
              monitoringStats.isExecuting ? 'animate-pulse text-interactive-default' : getStatusColor(monitoringStats.systemStatus)
            )} />
            <h2 className="text-heading-h2 font-heading text-text-primary">
              Monitoreo en Tiempo Real
            </h2>
          </div>
          {getStatusBadge(monitoringStats.systemStatus)}
        </div>

        <div className="flex items-center gap-sm">
          {/* Controles de vista */}
          <div className="hidden sm:flex border border-border-default rounded-md p-xs">
            <button
              onClick={() => setViewMode('combined')}
              className={cn(
                'px-sm py-xs text-sm rounded transition-colors',
                viewMode === 'combined' 
                  ? 'bg-interactive-default text-text-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              Combinado
            </button>
            <button
              onClick={() => setViewMode('executions')}
              className={cn(
                'px-sm py-xs text-sm rounded transition-colors',
                viewMode === 'executions' 
                  ? 'bg-interactive-default text-text-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              Ejecuciones
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={cn(
                'px-sm py-xs text-sm rounded transition-colors',
                viewMode === 'timeline' 
                  ? 'bg-interactive-default text-text-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              Timeline
            </button>
          </div>

          {/* Acciones */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter className="w-4 h-4" />}
            className={showFilters ? 'bg-interactive-default/10 text-interactive-default' : ''}
          >
            Filtros
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            icon={isRefreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          >
            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      {/* Métricas de monitoreo en tiempo real */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        {/* Ejecuciones últimas 24h */}
        <Card size="sm" className="text-center p-md border-l-4 border-interactive-default">
          <Card.Content className="space-y-xs">
            <div className="flex items-center justify-center gap-xs">
              <Clock className="w-4 h-4 text-interactive-default" />
              {monitoringStats.isExecuting && (
                <div className="w-2 h-2 bg-interactive-default rounded-full animate-pulse" />
              )}
            </div>
            <div className="text-heading-h2 font-heading text-interactive-default">
              {monitoringStats.executions24h.total}
            </div>
            <div className="text-body-auxiliary text-text-secondary">
              Últimas 24 horas
            </div>
            <div className="text-xs text-text-secondary">
              {monitoringStats.executions24h.successRate}% éxito
            </div>
          </Card.Content>
        </Card>

        {/* Ejecuciones exitosas */}
        <Card size="sm" className="text-center p-md border-l-4 border-feedback-success">
          <Card.Content className="space-y-xs">
            <CheckCircle className="w-4 h-4 text-feedback-success mx-auto" />
            <div className="text-heading-h2 font-heading text-feedback-success">
              {monitoringStats.executions24h.successful}
            </div>
            <div className="text-body-auxiliary text-text-secondary">
              Exitosas hoy
            </div>
            <div className="text-xs text-text-secondary">
              de {monitoringStats.executions24h.total} totales
            </div>
          </Card.Content>
        </Card>

        {/* Tiempo promedio */}
        <Card size="sm" className="text-center p-md border-l-4 border-feedback-info">
          <Card.Content className="space-y-xs">
            <BarChart3 className="w-4 h-4 text-feedback-info mx-auto" />
            <div className="text-heading-h2 font-heading text-feedback-info">
              {formatDuration(monitoringStats.avgDuration24h)}
            </div>
            <div className="text-body-auxiliary text-text-secondary">
              Tiempo promedio
            </div>
            <div className="text-xs text-text-secondary">
              últimas 24h
            </div>
          </Card.Content>
        </Card>

        {/* Última ejecución */}
        <Card size="sm" className="text-center p-md border-l-4 border-border-default">
          <Card.Content className="space-y-xs">
            <Calendar className="w-4 h-4 text-text-secondary mx-auto" />
            <div className="text-heading-h3 font-heading text-text-primary">
              {monitoringStats.lastExecution ? (
                <>
                  {Math.floor((Date.now() - monitoringStats.lastExecution) / 60000)}
                  <span className="text-sm font-normal">min</span>
                </>
              ) : (
                'N/A'
              )}
            </div>
            <div className="text-body-auxiliary text-text-secondary">
              Última ejecución
            </div>
            <div className="text-xs text-text-secondary">
              {monitoringStats.lastExecution?.toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit'
              }) || 'No disponible'}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Contenido principal según modo de vista */}
      {viewMode === 'combined' && (
        <div className="space-y-lg">
          {/* Vista combinada optimizada */}
          <Card>
            <Card.Header>
              <Card.Title>
                <div className="flex items-center gap-sm">
                  <Activity className="w-5 h-5 text-interactive-default" />
                  Actividad Reciente
                </div>
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <InteractiveTimeline
                events={combinedEvents}
                showFilters={showFilters}
                expandable={true}
                onEventClick={(event) => {
                  console.log('Evento seleccionado:', event)
                  // Aquí se puede abrir un modal con detalles
                }}
                className="max-h-96 overflow-y-auto"
              />
            </Card.Content>
          </Card>

          {/* Tabla de ejecuciones recientes resumida */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>
                  <div className="flex items-center gap-sm">
                    <Clock className="w-5 h-5 text-interactive-default" />
                    Ejecuciones Recientes
                  </div>
                </Card.Title>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('executions')}
                >
                  Ver todas
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              <ExecutionHistory 
                solicitudId={solicitudId}
                data={executionData.slice(0, 5)}
                compact={true}
              />
            </Card.Content>
          </Card>
        </div>
      )}

      {viewMode === 'executions' && (
        <div className="space-y-lg">
          {/* Vista completa de ejecuciones */}
          <Card>
            <Card.Header>
              <Card.Title>
                <div className="flex items-center gap-sm">
                  <Clock className="w-5 h-5 text-interactive-default" />
                  Historial Completo de Ejecuciones
                </div>
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <ExecutionHistory 
                solicitudId={solicitudId}
                data={executionData}
                showFilters={showFilters}
              />
            </Card.Content>
          </Card>
        </div>
      )}

      {viewMode === 'timeline' && (
        <div className="space-y-lg">
          {/* Vista completa de timeline */}
          <Card>
            <Card.Header>
              <Card.Title>
                <div className="flex items-center gap-sm">
                  <Calendar className="w-5 h-5 text-interactive-default" />
                  Timeline Completo de Eventos
                </div>
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <InteractiveTimeline
                events={combinedEvents}
                showFilters={showFilters}
                expandable={true}
                onEventClick={(event) => {
                  console.log('Evento seleccionado:', event)
                }}
                onEventFilter={(filters) => {
                  console.log('Filtros aplicados:', filters)
                }}
              />
            </Card.Content>
          </Card>
        </div>
      )}

      {/* Panel de estado del sistema */}
      <Card className="bg-bg-light border border-border-default">
        <Card.Content className="p-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-md">
              <div className={cn(
                'w-3 h-3 rounded-full',
                monitoringStats.systemStatus === 'healthy' ? 'bg-feedback-success animate-pulse' :
                monitoringStats.systemStatus === 'warning' ? 'bg-feedback-warning' :
                monitoringStats.systemStatus === 'error' ? 'bg-feedback-error' :
                'bg-text-secondary'
              )} />
              <div>
                <p className="text-body-paragraph font-medium text-text-primary">
                  Sistema de Monitoreo
                </p>
                <p className="text-body-auxiliary text-text-secondary">
                  {monitoringStats.systemStatus === 'healthy' && 'Funcionando correctamente'}
                  {monitoringStats.systemStatus === 'warning' && 'Requiere atención'}
                  {monitoringStats.systemStatus === 'error' && 'Error crítico detectado'}
                  {monitoringStats.systemStatus === 'unknown' && 'Estado no determinado'}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-body-auxiliary text-text-secondary">
                Última actualización:
              </p>
              <p className="text-body-paragraph font-medium text-text-primary">
                {new Date().toLocaleTimeString('es-CO', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Acciones rápidas de monitoreo */}
      <div className="flex flex-wrap gap-sm justify-center pt-md">
        <Button
          variant="primary"
          onClick={onRefresh}
          disabled={isRefreshing}
          icon={isRefreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        >
          {isRefreshing ? 'Actualizando...' : 'Actualizar Datos'}
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
          icon={<Filter className="w-4 h-4" />}
        >
          {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => {
            // Navegar a vista de análisis detallado
            console.log('Navegar a análisis detallado')
          }}
          icon={<BarChart3 className="w-4 h-4" />}
        >
          Análisis Detallado
        </Button>
      </div>
    </div>
  )
}

MonitoreoTab.displayName = 'MonitoreoTab'

export default MonitoreoTab