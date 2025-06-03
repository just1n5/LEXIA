import React from 'react'
import { 
  TrendingUp, 
  TrendingDown,
  Clock, 
  CheckCircle, 
  XCircle, 
  Timer,
  Activity,
  BarChart3,
  Zap,
  Target
} from 'lucide-react'
import Card from '../../ui/Card'
import { cn } from '../../../utils/cn'

/**
 * MetricCard - Card individual para mostrar una métrica específica
 */
const MetricCard = ({
  title,
  value,
  trend,
  icon,
  color = 'info',
  countdown = false,
  isAnimated = false,
  description,
  className = ''
}) => {
  const colorConfig = {
    success: {
      text: 'text-feedback-success',
      bg: 'bg-feedback-success/10',
      border: 'border-feedback-success/20',
      iconBg: 'bg-feedback-success/20'
    },
    warning: {
      text: 'text-feedback-warning',
      bg: 'bg-feedback-warning/10',
      border: 'border-feedback-warning/20',
      iconBg: 'bg-feedback-warning/20'
    },
    error: {
      text: 'text-feedback-error',
      bg: 'bg-feedback-error/10',
      border: 'border-feedback-error/20',
      iconBg: 'bg-feedback-error/20'
    },
    info: {
      text: 'text-feedback-info',
      bg: 'bg-feedback-info/10',
      border: 'border-feedback-info/20',
      iconBg: 'bg-feedback-info/20'
    },
    primary: {
      text: 'text-interactive-default',
      bg: 'bg-interactive-default/10',
      border: 'border-interactive-default/20',
      iconBg: 'bg-interactive-default/20'
    }
  }

  const config = colorConfig[color]

  return (
    <Card 
      size="sm" 
      className={cn(
        'relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        'border-l-4 hover:border-l-interactive-default',
        config.border,
        className
      )}
    >
      <Card.Content className="p-lg">
        <div className="flex items-start justify-between mb-md">
          <div className="flex-1">
            <p className="text-body-auxiliary font-medium text-text-secondary mb-xs">
              {title}
            </p>
            <div className="flex items-baseline gap-sm mb-xs">
              <span className={cn(
                'text-heading-h2 font-heading transition-colors duration-300',
                config.text,
                isAnimated && 'animate-pulse'
              )}>
                {value}
              </span>
              
              {trend && (
                <div className={cn(
                  'flex items-center gap-xs px-xs py-xs rounded text-body-auxiliary',
                  trend.startsWith('+') || trend.startsWith('↑') 
                    ? 'text-feedback-success bg-feedback-success/10' 
                    : 'text-feedback-error bg-feedback-error/10'
                )}>
                  {trend.startsWith('+') || trend.startsWith('↑') ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  <span className="text-xs font-medium">{trend}</span>
                </div>
              )}
            </div>
            
            {description && (
              <p className="text-body-auxiliary text-text-secondary text-sm">
                {description}
              </p>
            )}
          </div>
          
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
            'transition-all duration-300 hover:scale-110',
            config.iconBg,
            config.text
          )}>
            {icon}
          </div>
        </div>

        {countdown && (
          <div className="mt-md">
            <div className="w-full bg-border-default rounded-full h-1">
              <div 
                className={cn(
                  'h-1 rounded-full transition-all duration-1000',
                  config.text.replace('text-', 'bg-')
                )}
                style={{ width: '65%' }}
              />
            </div>
          </div>
        )}
      </Card.Content>
      
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </Card>
  )
}

/**
 * MetricsGrid - Grid de métricas para KPIs y decisiones informadas
 */
const MetricsGrid = ({ 
  solicitud, 
  executionData = {},
  className = '' 
}) => {
  // Calcular métricas dinámicas
  const calcularMetricas = () => {
    const totalEjecuciones = executionData.total || 15
    const exitosas = executionData.exitosas || 12
    const fallidas = executionData.fallidas || 3
    const tasaExito = totalEjecuciones > 0 ? ((exitosas / totalEjecuciones) * 100).toFixed(1) : 0
    const tiempoPromedio = executionData.tiempoPromedio || 2.3
    
    // Calcular próxima ejecución
    const getProximaEjecucion = () => {
      if (!solicitud?.activa) return 'Pausada'
      
      const now = new Date()
      const today7PM = new Date(now)
      today7PM.setHours(19, 0, 0, 0) // 7:00 PM
      
      // Si ya pasó las 7PM hoy, la próxima es mañana
      if (now > today7PM) {
        today7PM.setDate(today7PM.getDate() + 1)
      }
      
      const diff = today7PM - now
      const horas = Math.floor(diff / (1000 * 60 * 60))
      const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (horas > 24) {
        return 'Mañana 7:00 PM'
      } else if (horas > 0) {
        return `${horas}h ${minutos}m`
      } else {
        return `${minutos}m`
      }
    }

    return {
      tasaExito: {
        value: `${tasaExito}%`,
        trend: tasaExito > 80 ? '+5%' : tasaExito > 60 ? '+2%' : '-3%',
        description: `${exitosas} de ${totalEjecuciones} exitosas`
      },
      tiempoPromedio: {
        value: `${tiempoPromedio} min`,
        trend: tiempoPromedio < 3 ? '-12s' : '+8s',
        description: 'Tiempo de respuesta promedio'
      },
      proximaEjecucion: {
        value: getProximaEjecucion(),
        description: 'Ejecución automática diaria a las 7:00 PM'
      },
      rendimiento: {
        value: tasaExito > 90 ? 'Excelente' : tasaExito > 70 ? 'Bueno' : 'Regular',
        trend: tasaExito > 80 ? '↑ Mejorando' : '↓ Revisar',
        description: 'Rendimiento general del sistema'
      }
    }
  }

  const metricas = calcularMetricas()

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md', className)}>
      {/* Tasa de Éxito */}
      <MetricCard
        title="Tasa de Éxito"
        value={metricas.tasaExito.value}
        trend={metricas.tasaExito.trend}
        icon={<Target className="w-6 h-6" />}
        color="success"
        description={metricas.tasaExito.description}
      />

      {/* Tiempo Promedio */}
      <MetricCard
        title="Tiempo Promedio"
        value={metricas.tiempoPromedio.value}
        trend={metricas.tiempoPromedio.trend}
        icon={<Clock className="w-6 h-6" />}
        color="info"
        description={metricas.tiempoPromedio.description}
      />

      {/* Próxima Ejecución */}
      <MetricCard
        title="Próxima Ejecución"
        value={metricas.proximaEjecucion.value}
        icon={<Timer className="w-6 h-6" />}
        color={solicitud?.activa ? "warning" : "error"}
        countdown={solicitud?.activa}
        isAnimated={solicitud?.activa}
        description={metricas.proximaEjecucion.description}
      />

      {/* Rendimiento General */}
      <MetricCard
        title="Rendimiento"
        value={metricas.rendimiento.value}
        trend={metricas.rendimiento.trend}
        icon={<BarChart3 className="w-6 h-6" />}
        color={
          metricas.rendimiento.value === 'Excelente' ? 'success' :
          metricas.rendimiento.value === 'Bueno' ? 'primary' : 'warning'
        }
        description={metricas.rendimiento.description}
      />
    </div>
  )
}

// Componente para métricas en tiempo real con actualización automática
export const LiveMetricsGrid = ({ 
  solicitud, 
  updateInterval = 30000,
  ...props 
}) => {
  const [executionData, setExecutionData] = React.useState({})
  const [lastUpdate, setLastUpdate] = React.useState(new Date())

  React.useEffect(() => {
    // Función para simular actualización de datos
    const updateMetrics = () => {
      // Simular nuevos datos de ejecución
      const newData = {
        total: Math.floor(Math.random() * 50) + 10,
        exitosas: Math.floor(Math.random() * 40) + 8,
        fallidas: Math.floor(Math.random() * 10) + 1,
        tiempoPromedio: (Math.random() * 3 + 1).toFixed(1)
      }
      
      setExecutionData(newData)
      setLastUpdate(new Date())
    }

    // Actualización inicial
    updateMetrics()
    
    // Configurar intervalo de actualización
    const interval = setInterval(updateMetrics, updateInterval)
    
    return () => clearInterval(interval)
  }, [updateInterval])

  return (
    <div>
      <div className="flex justify-between items-center mb-md">
        <h3 className="text-heading-h3 font-heading text-text-primary">
          Métricas en Tiempo Real
        </h3>
        <div className="flex items-center gap-xs text-body-auxiliary text-text-secondary">
          <Activity className="w-4 h-4 animate-pulse text-feedback-success" />
          <span>Actualizado: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>
      
      <MetricsGrid 
        solicitud={solicitud} 
        executionData={executionData}
        {...props} 
      />
    </div>
  )
}

export default MetricsGrid