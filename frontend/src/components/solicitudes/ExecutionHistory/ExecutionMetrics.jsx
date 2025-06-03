import React, { useMemo } from 'react'
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, BarChart3 } from 'lucide-react'

// Components del design system
import Card from '../../../ui/Card'
import Badge from '../../../ui/Badge'
import { cn } from '../../../../utils/cn'

/**
 * Componente de métricas con mini dashboard visual
 * Muestra estadísticas clave y tendencias de las ejecuciones
 */
const ExecutionMetrics = ({
  metrics,
  executions = [],
  loading = false,
  className = '',
  ...props
}) => {
  // Generar datos de tendencia simple (simulado)
  const trendData = useMemo(() => {
    if (!executions.length) return []
    
    // Agrupar por día y calcular tasa de éxito
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date
    })
    
    return last7Days.map(date => {
      const dayExecutions = executions.filter(exec => {
        const execDate = new Date(exec.fecha_ejecucion)
        return execDate.toDateString() === date.toDateString()
      })
      
      const successCount = dayExecutions.filter(e => e.estado_extraccion === 'EXITOSA').length
      const successRate = dayExecutions.length > 0 ? (successCount / dayExecutions.length) * 100 : 0
      
      return {
        date: date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        value: successRate,
        count: dayExecutions.length
      }
    })
  }, [executions])

  // Formatear tiempo promedio
  const formatTime = (seconds) => {
    if (!seconds) return '0s'
    
    if (seconds < 60) {
      return `${Math.round(seconds)}s`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.round(seconds % 60)
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
    } else {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${hours}h ${minutes}m`
    }
  }

  // Formatear tendencia
  const formatTrend = (value, type = 'percentage') => {
    if (!value) return { text: '0%', icon: null, color: 'text-text-secondary' }
    
    const isPositive = value > 0
    const formattedValue = type === 'time' 
      ? `${Math.abs(Math.round(value))}s`
      : `${Math.abs(Math.round(value * 10) / 10)}%`
    
    return {
      text: (isPositive ? '+' : '-') + formattedValue,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: type === 'time' 
        ? (isPositive ? 'text-feedback-warning' : 'text-feedback-success') // Para tiempo, menos es mejor
        : (isPositive ? 'text-feedback-success' : 'text-feedback-error')   // Para porcentajes, más es mejor
    }
  }

  if (loading) {
    return (
      <Card className={cn('mb-lg', className)} {...props}>
        <Card.Header>
          <div className="flex items-center gap-sm">
            <BarChart3 className="w-5 h-5 text-interactive-default" />
            <Card.Title>Métricas de rendimiento</Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-bg-light rounded mb-sm"></div>
                <div className="h-8 bg-bg-light rounded mb-xs"></div>
                <div className="h-3 bg-bg-light rounded w-16"></div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    )
  }

  if (!metrics || metrics.totalExecutions === 0) {
    return (
      <Card className={cn('mb-lg', className)} {...props}>
        <Card.Header>
          <div className="flex items-center gap-sm">
            <BarChart3 className="w-5 h-5 text-interactive-default" />
            <Card.Title>Métricas de rendimiento</Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="text-center py-xl">
            <BarChart3 className="w-12 h-12 text-text-secondary mx-auto mb-md" />
            <p className="text-body-paragraph text-text-secondary">
              No hay suficientes datos para mostrar métricas
            </p>
          </div>
        </Card.Content>
      </Card>
    )
  }

  const successTrend = formatTrend(metrics.trend?.successRate)
  const timeTrend = formatTrend(metrics.trend?.averageTime, 'time')

  return (
    <Card className={cn('mb-lg', className)} {...props}>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <BarChart3 className="w-5 h-5 text-interactive-default" />
            <Card.Title>Métricas de rendimiento</Card.Title>
          </div>
          <Badge variant="info" size="sm">
            {metrics.totalExecutions} ejecuciones
          </Badge>
        </div>
      </Card.Header>
      
      <Card.Content>
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-lg">
          {/* Tasa de éxito */}
          <div className="text-center p-lg bg-feedback-success-light rounded-lg border border-feedback-success">
            <div className="flex items-center justify-center mb-sm">
              <CheckCircle className="w-6 h-6 text-feedback-success" />
            </div>
            <div className="text-heading-h2 font-heading text-feedback-success mb-xs">
              {metrics.successRate}%
            </div>
            <div className="text-body-auxiliary text-text-secondary mb-xs">
              Tasa de éxito
            </div>
            {successTrend.icon && (
              <div className={cn('flex items-center justify-center gap-xs text-xs', successTrend.color)}>
                {React.createElement(successTrend.icon, { className: 'w-3 h-3' })}
                <span>{successTrend.text}</span>
              </div>
            )}
          </div>

          {/* Tiempo promedio */}
          <div className="text-center p-lg bg-feedback-info-light rounded-lg border border-feedback-info">
            <div className="flex items-center justify-center mb-sm">
              <Clock className="w-6 h-6 text-feedback-info" />
            </div>
            <div className="text-heading-h2 font-heading text-feedback-info mb-xs">
              {formatTime(metrics.averageTime)}
            </div>
            <div className="text-body-auxiliary text-text-secondary mb-xs">
              Tiempo promedio
            </div>
            {timeTrend.icon && (
              <div className={cn('flex items-center justify-center gap-xs text-xs', timeTrend.color)}>
                {React.createElement(timeTrend.icon, { className: 'w-3 h-3' })}
                <span>{timeTrend.text}</span>
              </div>
            )}
          </div>

          {/* Total ejecutadas */}
          <div className="text-center p-lg bg-feedback-warning-light rounded-lg border border-feedback-warning">
            <div className="flex items-center justify-center mb-sm">
              <BarChart3 className="w-6 h-6 text-feedback-warning" />
            </div>
            <div className="text-heading-h2 font-heading text-feedback-warning mb-xs">
              {metrics.totalExecutions}
            </div>
            <div className="text-body-auxiliary text-text-secondary mb-xs">
              Total ejecutadas
            </div>
            <div className="flex items-center justify-center gap-sm text-xs">
              <span className="text-feedback-success">
                {metrics.successCount} exitosas
              </span>
              {metrics.errorCount > 0 && (
                <span className="text-feedback-error">
                  {metrics.errorCount} errores
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mini gráfico de tendencia */}
        {trendData.length > 0 && (
          <div className="border-t border-border-default pt-lg">
            <h4 className="text-heading-h4 font-heading text-text-primary mb-md">
              Tendencia (últimos 7 días)
            </h4>
            
            <div className="flex items-end justify-between gap-xs h-20 mb-sm">
              {trendData.map((point, index) => {
                const height = Math.max((point.value / 100) * 100, 5) // Mínimo 5% height
                const hasExecutions = point.count > 0
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className={cn(
                        'w-full rounded-t transition-all duration-300',
                        hasExecutions
                          ? point.value >= 80
                            ? 'bg-feedback-success'
                            : point.value >= 50
                            ? 'bg-feedback-warning'
                            : 'bg-feedback-error'
                          : 'bg-bg-light'
                      )}
                      style={{ height: `${height}%` }}
                      title={hasExecutions 
                        ? `${point.date}: ${Math.round(point.value)}% éxito (${point.count} ejecuciones)`
                        : `${point.date}: Sin ejecuciones`
                      }
                    />
                  </div>
                )
              })}
            </div>
            
            {/* Labels de fechas */}
            <div className="flex justify-between text-body-auxiliary text-text-secondary">
              {trendData.map((point, index) => (
                <div key={index} className="text-center text-xs">
                  {point.date}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estadísticas adicionales */}
        <div className="border-t border-border-default pt-lg mt-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md text-center">
            <div>
              <div className="text-body-paragraph font-medium text-text-primary">
                {formatTime(metrics.totalTime)}
              </div>
              <div className="text-body-auxiliary text-text-secondary">
                Tiempo total
              </div>
            </div>
            
            <div>
              <div className="text-body-paragraph font-medium text-text-primary">
                {metrics.successCount}
              </div>
              <div className="text-body-auxiliary text-text-secondary">
                Exitosas
              </div>
            </div>
            
            <div>
              <div className="text-body-paragraph font-medium text-text-primary">
                {metrics.errorCount}
              </div>
              <div className="text-body-auxiliary text-text-secondary">
                Con errores
              </div>
            </div>
            
            <div>
              <div className="text-body-paragraph font-medium text-text-primary">
                {metrics.totalExecutions > 0 ? Math.round(metrics.totalTime / metrics.totalExecutions) : 0}s
              </div>
              <div className="text-body-auxiliary text-text-secondary">
                Promedio
              </div>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

ExecutionMetrics.displayName = 'ExecutionMetrics'

export default ExecutionMetrics