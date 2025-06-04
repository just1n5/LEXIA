import React, { useMemo } from 'react'
import { 
  FileText, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Zap,
  Calendar,
  User,
  Settings
} from 'lucide-react'

// UI Components
import Card from '../../ui/Card'
import Badge from '../../ui/Badge'
import InfoField from '../../ui/InfoField'
import Button from '../../ui/Button'

// Utils
import { cn } from '../../../utils/cn'

/**
 * ResumenTab - Vista principal optimizada que condensa información clave
 * Reemplaza el tab "overview" con mejor organización y jerarquía visual
 */
const ResumenTab = ({ 
  solicitud, 
  executionData = {},
  recentActivity = [],
  onViewDetails,
  className = '' 
}) => {
  // Calcular métricas principales para el resumen
  const summaryMetrics = useMemo(() => {
    const totalEjecuciones = executionData.total || 15
    const exitosas = executionData.exitosas || 12
    const tasaExito = totalEjecuciones > 0 ? Math.round((exitosas / totalEjecuciones) * 100) : 0
    const consultasConCambios = executionData.cambios || 3

    return {
      tasaExito: {
        value: tasaExito,
        status: tasaExito >= 90 ? 'excellent' : tasaExito >= 70 ? 'good' : 'needs-attention',
        trend: tasaExito > 85 ? 'up' : 'stable'
      },
      totalEjecuciones: {
        value: totalEjecuciones,
        trend: totalEjecuciones > 10 ? 'up' : 'stable'
      },
      consultasConCambios: {
        value: consultasConCambios,
        isNew: consultasConCambios > 0,
        trend: consultasConCambios > 2 ? 'up' : 'stable'
      }
    }
  }, [executionData])

  // Estado actual del proceso
  const currentStatus = useMemo(() => {
    const isActive = solicitud?.activa !== false
    const lastExecution = solicitud?.ultima_ejecucion ? new Date(solicitud.ultima_ejecucion) : null
    const timeSinceLastExecution = lastExecution ? Date.now() - lastExecution.getTime() : 0
    const hoursSinceLastExecution = Math.floor(timeSinceLastExecution / (1000 * 60 * 60))

    return {
      isActive,
      lastExecution,
      hoursSinceLastExecution,
      nextExecution: isActive ? 'Hoy 7:00 PM' : 'Pausado',
      healthStatus: isActive && hoursSinceLastExecution < 25 ? 'healthy' : 'warning'
    }
  }, [solicitud])

  // Actividad reciente filtrada y formateada
  const recentActivityFormatted = useMemo(() => {
    return recentActivity.slice(0, 3).map(activity => ({
      ...activity,
      timeAgo: getTimeAgo(activity.date),
      iconComponent: getActivityIcon(activity.type, activity.status)
    }))
  }, [recentActivity])

  // Helpers
  const getTimeAgo = (date) => {
    const now = new Date()
    const activityDate = new Date(date)
    const diff = now - activityDate
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`
    if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
    if (minutes > 0) return `hace ${minutes} min`
    return 'hace un momento'
  }

  const getActivityIcon = (type, status) => {
    const iconMap = {
      execution: status === 'success' ? CheckCircle : AlertTriangle,
      creation: FileText,
      notification: Activity,
      configuration: Settings
    }
    return iconMap[type] || Activity
  }

  const getStatusColor = (status) => {
    const colorMap = {
      excellent: 'text-feedback-success',
      good: 'text-interactive-default', 
      'needs-attention': 'text-feedback-warning',
      healthy: 'text-feedback-success',
      warning: 'text-feedback-warning',
      error: 'text-feedback-error'
    }
    return colorMap[status] || 'text-text-secondary'
  }

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-feedback-success" />
    if (trend === 'down') return <TrendingUp className="w-3 h-3 text-feedback-error rotate-180" />
    return null
  }

  return (
    <div className={cn('space-y-lg p-lg', className)}>
      {/* Header con estado actual */}
      <div className="mb-xl">
        <div className="flex items-start justify-between gap-lg mb-md">
          <div className="flex-1">
            <h2 className="text-heading-h2 font-heading text-text-primary mb-xs">
              {solicitud?.nombre_descriptivo || solicitud?.alias || 'Proceso Judicial'}
            </h2>
            <p className="text-body-auxiliary text-text-secondary mb-sm">
              {solicitud?.criterio_busqueda_radicado && (
                <span className="font-medium">Radicado: {solicitud.criterio_busqueda_radicado}</span>
              )}
              {solicitud?.fecha_creacion && (
                <span className="ml-md">
                  Creado: {new Date(solicitud.fecha_creacion).toLocaleDateString('es-CO')}
                </span>
              )}
            </p>
          </div>
          
          {/* Estado visual principal */}
          <div className="text-right">
            <div className={cn(
              'inline-flex items-center gap-xs px-sm py-xs rounded-full text-sm font-medium mb-xs',
              currentStatus.isActive 
                ? 'bg-feedback-success/10 text-feedback-success'
                : 'bg-feedback-warning/10 text-feedback-warning'
            )}>
              <div className={cn(
                'w-2 h-2 rounded-full',
                currentStatus.isActive ? 'bg-feedback-success animate-pulse' : 'bg-feedback-warning'
              )} />
              {currentStatus.isActive ? 'Activo' : 'Pausado'}
            </div>
            <p className="text-body-auxiliary text-text-secondary">
              Próxima ejecución: {currentStatus.nextExecution}
            </p>
          </div>
        </div>
      </div>

      {/* Grid principal - Métricas clave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
        {/* Métrica 1: Tasa de éxito */}
        <Card size="sm" className={cn(
          'text-center p-lg border-l-4 transition-all duration-300 hover:shadow-md',
          summaryMetrics.tasaExito.status === 'excellent' ? 'border-feedback-success' :
          summaryMetrics.tasaExito.status === 'good' ? 'border-interactive-default' :
          'border-feedback-warning'
        )}>
          <Card.Content className="space-y-sm">
            <div className="flex items-center justify-center gap-xs mb-xs">
              <CheckCircle className={cn(
                'w-5 h-5',
                getStatusColor(summaryMetrics.tasaExito.status)
              )} />
              {getTrendIcon(summaryMetrics.tasaExito.trend)}
            </div>
            <div className={cn(
              'text-heading-h1 font-heading',
              getStatusColor(summaryMetrics.tasaExito.status)
            )}>
              {summaryMetrics.tasaExito.value}%
            </div>
            <div className="text-body-auxiliary text-text-secondary">
              Tasa de éxito
            </div>
            <div className="text-body-auxiliary text-text-secondary text-xs">
              {summaryMetrics.totalEjecuciones.value} ejecuciones totales
            </div>
          </Card.Content>
        </Card>

        {/* Métrica 2: Consultas con cambios */}
        <Card size="sm" className={cn(
          'text-center p-lg border-l-4 transition-all duration-300 hover:shadow-md',
          summaryMetrics.consultasConCambios.isNew ? 'border-feedback-warning' : 'border-border-default'
        )}>
          <Card.Content className="space-y-sm">
            <div className="flex items-center justify-center gap-xs mb-xs">
              <Zap className={cn(
                'w-5 h-5',
                summaryMetrics.consultasConCambios.isNew ? 'text-feedback-warning' : 'text-text-secondary'
              )} />
              {summaryMetrics.consultasConCambios.isNew && (
                <div className="w-2 h-2 bg-feedback-warning rounded-full animate-pulse" />
              )}
            </div>
            <div className={cn(
              'text-heading-h1 font-heading',
              summaryMetrics.consultasConCambios.isNew ? 'text-feedback-warning' : 'text-text-primary'
            )}>
              {summaryMetrics.consultasConCambios.value}
            </div>
            <div className="text-body-auxiliary text-text-secondary">
              Consultas con cambios
            </div>
            <div className="text-body-auxiliary text-text-secondary text-xs">
              {summaryMetrics.consultasConCambios.isNew ? 'Nuevos cambios detectados' : 'Sin cambios recientes'}
            </div>
          </Card.Content>
        </Card>

        {/* Métrica 3: Última ejecución */}
        <Card size="sm" className={cn(
          'text-center p-lg border-l-4 transition-all duration-300 hover:shadow-md',
          getStatusColor(currentStatus.healthStatus).includes('success') ? 'border-feedback-success' : 'border-feedback-warning'
        )}>
          <Card.Content className="space-y-sm">
            <div className="flex items-center justify-center gap-xs mb-xs">
              <Clock className={cn(
                'w-5 h-5',
                getStatusColor(currentStatus.healthStatus)
              )} />
            </div>
            <div className={cn(
              'text-heading-h1 font-heading',
              getStatusColor(currentStatus.healthStatus)
            )}>
              {currentStatus.hoursSinceLastExecution}h
            </div>
            <div className="text-body-auxiliary text-text-secondary">
              Última ejecución
            </div>
            <div className="text-body-auxiliary text-text-secondary text-xs">
              {currentStatus.lastExecution?.toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              }) || 'No disponible'}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Información esencial del proceso */}
      <Card className="mb-xl">
        <Card.Header>
          <Card.Title>
            <div className="flex items-center gap-sm">
              <FileText className="w-5 h-5 text-interactive-default" />
              Información esencial
            </div>
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <InfoField.Grid columns={2}>
            {/* Tipo de búsqueda */}
            <InfoField
              label="Tipo de búsqueda"
              value={solicitud?.tipo_busqueda === 'radicado' ? 'Por número de radicado' : 
                     solicitud?.tipo_busqueda === 'nombre' ? 'Por nombre/razón social' : 
                     'Búsqueda avanzada'}
            />

            {/* Despacho/Juzgado */}
            {solicitud?.despacho_juzgado && (
              <InfoField
                label="Despacho/Juzgado"
                value={solicitud.despacho_juzgado}
              />
            )}

            {/* Horario de ejecución */}
            <InfoField.Badge
              label="Horario de ejecución"
              badge={<Badge variant="info" size="sm">Diario 7:00 PM</Badge>}
            >
              <span className="text-text-secondary text-sm ml-1">
                (Automático)
              </span>
            </InfoField.Badge>

            {/* Email de notificación */}
            {solicitud?.email_notificacion && (
              <InfoField
                label="Email de notificación"
                value={solicitud.email_notificacion}
              />
            )}
          </InfoField.Grid>
        </Card.Content>
      </Card>

      {/* Actividad reciente */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title>
              <div className="flex items-center gap-sm">
                <Activity className="w-5 h-5 text-interactive-default" />
                Actividad reciente
              </div>
            </Card.Title>
            {recentActivity.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails?.('monitoreo')}
              >
                Ver todo
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Content>
          {recentActivityFormatted.length > 0 ? (
            <div className="space-y-md">
              {recentActivityFormatted.map((activity, index) => {
                const IconComponent = activity.iconComponent
                return (
                  <div key={activity.id || index} className="flex items-center gap-md p-sm hover:bg-bg-light rounded-md transition-colors">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      activity.status === 'success' ? 'bg-feedback-success/10 text-feedback-success' :
                      activity.status === 'error' ? 'bg-feedback-error/10 text-feedback-error' :
                      'bg-bg-light text-text-secondary'
                    )}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-paragraph text-text-primary font-medium truncate">
                        {activity.title}
                      </p>
                      <p className="text-body-auxiliary text-text-secondary truncate">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-body-auxiliary text-text-secondary flex-shrink-0">
                      {activity.timeAgo}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-lg">
              <Activity className="w-8 h-8 text-text-secondary mx-auto mb-sm" />
              <p className="text-body-paragraph text-text-secondary">
                No hay actividad reciente
              </p>
              <p className="text-body-auxiliary text-text-secondary">
                La actividad aparecerá aquí cuando el proceso esté en funcionamiento
              </p>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Acciones rápidas */}
      <div className="flex flex-wrap gap-sm justify-center pt-lg">
        <Button
          variant="primary"
          onClick={() => onViewDetails?.('monitoreo')}
          icon={<Activity className="w-4 h-4" />}
        >
          Ver Monitoreo
        </Button>
        <Button
          variant="secondary"
          onClick={() => onViewDetails?.('analisis')}
          icon={<TrendingUp className="w-4 h-4" />}
        >
          Ver Análisis
        </Button>
        <Button
          variant="ghost"
          onClick={() => onViewDetails?.('configuracion')}
          icon={<Settings className="w-4 h-4" />}
        >
          Configurar
        </Button>
      </div>
    </div>
  )
}

ResumenTab.displayName = 'ResumenTab'

export default ResumenTab