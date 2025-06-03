import React, { useState, useMemo } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  ChevronDown,
  BarChart3,
  Activity,
  Clock,
  Target,
  Zap
} from 'lucide-react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import { cn } from '../../../utils/cn'

/**
 * TemporalComparison - Componente para comparar métricas entre períodos
 */
const TemporalComparison = ({
  currentData,
  previousData,
  period = '30d',
  className = ''
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(period)
  const [viewMode, setViewMode] = useState('overview') // 'overview' | 'detailed'

  // Opciones de período
  const periodOptions = [
    { value: '7d', label: 'Últimos 7 días', comparison: '7 días anteriores' },
    { value: '30d', label: 'Últimos 30 días', comparison: '30 días anteriores' },
    { value: '90d', label: 'Últimos 90 días', comparison: '90 días anteriores' },
    { value: 'custom', label: 'Período personalizado', comparison: 'Período anterior' }
  ]

  // Calcular métricas comparativas
  const metrics = useMemo(() => {
    const calculateChange = (current, previous) => {
      if (!previous || previous === 0) return { value: 0, percentage: 0, trend: 'neutral' }
      
      const change = current - previous
      const percentage = (change / previous) * 100
      const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
      
      return { value: change, percentage, trend }
    }

    return {
      executions: {
        current: currentData?.totalExecutions || 0,
        previous: previousData?.totalExecutions || 0,
        change: calculateChange(currentData?.totalExecutions || 0, previousData?.totalExecutions || 0)
      },
      successRate: {
        current: currentData?.successRate || 0,
        previous: previousData?.successRate || 0,
        change: calculateChange(currentData?.successRate || 0, previousData?.successRate || 0)
      },
      avgDuration: {
        current: currentData?.avgDuration || 0,
        previous: previousData?.avgDuration || 0,
        change: calculateChange(currentData?.avgDuration || 0, previousData?.avgDuration || 0)
      },
      uptime: {
        current: currentData?.uptime || 0,
        previous: previousData?.uptime || 0,
        change: calculateChange(currentData?.uptime || 0, previousData?.uptime || 0)
      }
    }
  }, [currentData, previousData])

  // Obtener datos mock si no se proporcionan
  const getMockData = (period) => {
    const base = {
      totalExecutions: Math.floor(Math.random() * 100) + 50,
      successRate: Math.floor(Math.random() * 20) + 80,
      avgDuration: Math.random() * 3 + 1,
      uptime: Math.floor(Math.random() * 10) + 90
    }
    
    return base
  }

  const current = currentData || getMockData('current')
  const previous = previousData || getMockData('previous')

  // Formatear números
  const formatNumber = (value, type = 'number') => {
    switch (type) {
      case 'percentage':
        return `${value.toFixed(1)}%`
      case 'duration':
        return `${value.toFixed(1)}s`
      case 'change':
        return value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1)
      default:
        return value.toLocaleString()
    }
  }

  // Componente de métrica individual
  const MetricCard = ({ 
    title, 
    icon, 
    current, 
    previous, 
    change, 
    format = 'number',
    inverse = false // true si valores menores son mejores (ej: duración)
  }) => {
    const isPositive = inverse ? change.trend === 'down' : change.trend === 'up'
    const isNegative = inverse ? change.trend === 'up' : change.trend === 'down'
    
    return (
      <Card className="relative overflow-hidden">
        <Card.Content className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
                {icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(current, format)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={cn(
                'flex items-center gap-1 text-sm font-medium',
                isPositive && 'text-green-600',
                isNegative && 'text-red-600',
                change.trend === 'neutral' && 'text-gray-500'
              )}>
                {change.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                {change.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                {change.trend === 'neutral' && <div className="w-4 h-4" />}
                {formatNumber(Math.abs(change.percentage), 'change')}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                vs período anterior
              </p>
            </div>
          </div>
          
          {/* Barra de progreso comparativa */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Anterior: {formatNumber(previous, format)}</span>
              <span>Actual: {formatNumber(current, format)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  'h-2 rounded-full transition-all duration-500',
                  isPositive && 'bg-green-500',
                  isNegative && 'bg-red-500',
                  change.trend === 'neutral' && 'bg-gray-400'
                )}
                style={{ 
                  width: `${Math.min(Math.max((current / Math.max(current, previous)) * 100, 0), 100)}%` 
                }}
              />
            </div>
          </div>
        </Card.Content>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Análisis Comparativo
          </h3>
          <p className="text-sm text-gray-600">
            Comparación de rendimiento entre períodos
          </p>
        </div>
        
        <div className="flex gap-2">
          {/* Selector de período */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          
          {/* Toggle vista */}
          <Button
            variant={viewMode === 'overview' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('overview')}
            icon={<BarChart3 size={14} />}
          >
            Resumen
          </Button>
          
          <Button
            variant={viewMode === 'detailed' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('detailed')}
            icon={<Activity size={14} />}
          >
            Detallado
          </Button>
        </div>
      </div>

      {/* Vista de resumen */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <MetricCard
            title="Total Ejecuciones"
            icon={<Zap className="w-6 h-6 text-yellow-600" />}
            current={current.totalExecutions}
            previous={previous.totalExecutions}
            change={metrics.executions.change}
            format="number"
          />
          
          <MetricCard
            title="Tasa de Éxito"
            icon={<Target className="w-6 h-6 text-green-600" />}
            current={current.successRate}
            previous={previous.successRate}
            change={metrics.successRate.change}
            format="percentage"
          />
          
          <MetricCard
            title="Duración Promedio"
            icon={<Clock className="w-6 h-6 text-blue-600" />}
            current={current.avgDuration}
            previous={previous.avgDuration}
            change={metrics.avgDuration.change}
            format="duration"
            inverse={true}
          />
          
          <MetricCard
            title="Disponibilidad"
            icon={<Activity className="w-6 h-6 text-purple-600" />}
            current={current.uptime}
            previous={previous.uptime}
            change={metrics.uptime.change}
            format="percentage"
          />
        </div>
      )}

      {/* Vista detallada */}
      {viewMode === 'detailed' && (
        <div className="space-y-6">
          {/* Gráfico de tendencias */}
          <Card>
            <Card.Header>
              <h4 className="text-lg font-medium text-gray-900">
                Tendencias de Rendimiento
              </h4>
            </Card.Header>
            <Card.Content>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Gráfico de tendencias</p>
                  <p className="text-sm">Integración con biblioteca de gráficos pendiente</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Tabla de comparación detallada */}
          <Card>
            <Card.Header>
              <h4 className="text-lg font-medium text-gray-900">
                Comparación Detallada
              </h4>
            </Card.Header>
            <Card.Content>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Métrica</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Período Anterior</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Período Actual</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Cambio</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">% Cambio</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">Total de Ejecuciones</td>
                      <td className="py-3 px-4 text-right text-gray-600">{previous.totalExecutions}</td>
                      <td className="py-3 px-4 text-right text-gray-900 font-medium">{current.totalExecutions}</td>
                      <td className={cn(
                        'py-3 px-4 text-right font-medium',
                        metrics.executions.change.trend === 'up' && 'text-green-600',
                        metrics.executions.change.trend === 'down' && 'text-red-600',
                        metrics.executions.change.trend === 'neutral' && 'text-gray-600'
                      )}>
                        {formatNumber(metrics.executions.change.value, 'change')}
                      </td>
                      <td className={cn(
                        'py-3 px-4 text-right font-medium',
                        metrics.executions.change.trend === 'up' && 'text-green-600',
                        metrics.executions.change.trend === 'down' && 'text-red-600',
                        metrics.executions.change.trend === 'neutral' && 'text-gray-600'
                      )}>
                        {formatNumber(metrics.executions.change.percentage, 'change')}%
                      </td>
                    </tr>
                    
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">Tasa de Éxito</td>
                      <td className="py-3 px-4 text-right text-gray-600">{formatNumber(previous.successRate, 'percentage')}</td>
                      <td className="py-3 px-4 text-right text-gray-900 font-medium">{formatNumber(current.successRate, 'percentage')}</td>
                      <td className={cn(
                        'py-3 px-4 text-right font-medium',
                        metrics.successRate.change.trend === 'up' && 'text-green-600',
                        metrics.successRate.change.trend === 'down' && 'text-red-600',
                        metrics.successRate.change.trend === 'neutral' && 'text-gray-600'
                      )}>
                        {formatNumber(metrics.successRate.change.value, 'change')}%
                      </td>
                      <td className={cn(
                        'py-3 px-4 text-right font-medium',
                        metrics.successRate.change.trend === 'up' && 'text-green-600',
                        metrics.successRate.change.trend === 'down' && 'text-red-600',
                        metrics.successRate.change.trend === 'neutral' && 'text-gray-600'
                      )}>
                        {formatNumber(metrics.successRate.change.percentage, 'change')}%
                      </td>
                    </tr>
                    
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">Duración Promedio</td>
                      <td className="py-3 px-4 text-right text-gray-600">{formatNumber(previous.avgDuration, 'duration')}</td>
                      <td className="py-3 px-4 text-right text-gray-900 font-medium">{formatNumber(current.avgDuration, 'duration')}</td>
                      <td className={cn(
                        'py-3 px-4 text-right font-medium',
                        metrics.avgDuration.change.trend === 'down' && 'text-green-600',
                        metrics.avgDuration.change.trend === 'up' && 'text-red-600',
                        metrics.avgDuration.change.trend === 'neutral' && 'text-gray-600'
                      )}>
                        {formatNumber(metrics.avgDuration.change.value, 'change')}s
                      </td>
                      <td className={cn(
                        'py-3 px-4 text-right font-medium',
                        metrics.avgDuration.change.trend === 'down' && 'text-green-600',
                        metrics.avgDuration.change.trend === 'up' && 'text-red-600',
                        metrics.avgDuration.change.trend === 'neutral' && 'text-gray-600'
                      )}>
                        {formatNumber(metrics.avgDuration.change.percentage, 'change')}%
                      </td>
                    </tr>
                    
                    <tr>
                      <td className="py-3 px-4 text-gray-900">Disponibilidad</td>
                      <td className="py-3 px-4 text-right text-gray-600">{formatNumber(previous.uptime, 'percentage')}</td>
                      <td className="py-3 px-4 text-right text-gray-900 font-medium">{formatNumber(current.uptime, 'percentage')}</td>
                      <td className={cn(
                        'py-3 px-4 text-right font-medium',
                        metrics.uptime.change.trend === 'up' && 'text-green-600',
                        metrics.uptime.change.trend === 'down' && 'text-red-600',
                        metrics.uptime.change.trend === 'neutral' && 'text-gray-600'
                      )}>
                        {formatNumber(metrics.uptime.change.value, 'change')}%
                      </td>
                      <td className={cn(
                        'py-3 px-4 text-right font-medium',
                        metrics.uptime.change.trend === 'up' && 'text-green-600',
                        metrics.uptime.change.trend === 'down' && 'text-red-600',
                        metrics.uptime.change.trend === 'neutral' && 'text-gray-600'
                      )}>
                        {formatNumber(metrics.uptime.change.percentage, 'change')}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

      {/* Insights y recomendaciones */}
      <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
        <Card.Content className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-yellow-700" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-yellow-900 mb-2">
                Insights del Período
              </h4>
              <div className="space-y-2 text-sm text-yellow-800">
                {metrics.executions.change.trend === 'up' && (
                  <p>• El número de ejecuciones aumentó un {formatNumber(metrics.executions.change.percentage, 'change')}%</p>
                )}
                {metrics.successRate.change.trend === 'up' && (
                  <p>• La tasa de éxito mejoró en {formatNumber(metrics.successRate.change.percentage, 'change')}%</p>
                )}
                {metrics.avgDuration.change.trend === 'down' && (
                  <p>• El tiempo de respuesta mejoró en {formatNumber(Math.abs(metrics.avgDuration.change.percentage), 'change')}%</p>
                )}
                <p>• Recomendación: {metrics.successRate.change.trend === 'up' ? 'Mantener las configuraciones actuales' : 'Revisar configuraciones de timeout'}</p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default TemporalComparison