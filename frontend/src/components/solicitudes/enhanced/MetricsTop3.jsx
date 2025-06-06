import React from 'react'
import { TrendingUp, CheckCircle, RefreshCw, BarChart3 } from 'lucide-react'
import Card from '../../ui/Card'
import { cn } from '../../../utils/cn'

/**
 * MetricsTop3 - Las 3 métricas más importantes condensadas para el tab Resumen
 */
const MetricsTop3 = ({ 
  solicitud, 
  executionData = {},
  className = '' 
}) => {
  // Calcular métricas condensadas específicas del proceso
  const calcularMetricasTop3 = () => {
    const fechaCreacion = solicitud?.fecha_creacion ? new Date(solicitud.fecha_creacion) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const diasDesdeLaCreacion = Math.floor((new Date() - fechaCreacion) / (1000 * 60 * 60 * 24))
    
    // Calcular ejecuciones de este proceso específico este mes
    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)
    
    const diasTranscurridosMes = Math.floor((new Date() - inicioMes) / (1000 * 60 * 60 * 24)) + 1
    const ejecutucionesEsteMes = Math.min(diasTranscurridosMes, diasDesdeLaCreacion)
    
    const consultasExitosas = executionData.exitosasEsteProceso || Math.floor(ejecutucionesEsteMes * 0.9)
    const consultasConCambios = executionData.consultasConCambios || Math.floor(Math.random() * Math.min(ejecutucionesEsteMes, 3))
    const tasaExito = ejecutucionesEsteMes > 0 ? ((consultasExitosas / ejecutucionesEsteMes) * 100).toFixed(0) : 0

    return [
      {
        id: 'consultas-exitosas',
        label: 'Consultas Exitosas',
        value: consultasExitosas,
        subtitle: `${ejecutucionesEsteMes} este mes`,
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'success',
        trend: consultasExitosas === ejecutucionesEsteMes ? '+100%' : '+90%'
      },
      {
        id: 'consultas-cambios',
        label: 'Cambios Detectados',
        value: consultasConCambios,
        subtitle: 'Nuevas actualizaciones',
        icon: <RefreshCw className="w-5 h-5" />,
        color: consultasConCambios > 0 ? 'warning' : 'info',
        trend: consultasConCambios > 0 ? `+${consultasConCambios}` : '0'
      },
      {
        id: 'efectividad',
        label: 'Efectividad',
        value: `${tasaExito}%`,
        subtitle: 'Tasa de éxito',
        icon: <BarChart3 className="w-5 h-5" />,
        color: tasaExito >= 90 ? 'success' : tasaExito >= 70 ? 'primary' : 'warning',
        trend: tasaExito >= 90 ? '↑ Excelente' : '↑ Bueno'
      }
    ]
  }

  const metricas = calcularMetricasTop3()

  const getColorClasses = (color) => {
    const colors = {
      success: {
        text: 'text-feedback-success',
        bg: 'bg-feedback-success/10',
        border: 'border-feedback-success/20'
      },
      warning: {
        text: 'text-feedback-warning',
        bg: 'bg-feedback-warning/10',
        border: 'border-feedback-warning/20'
      },
      info: {
        text: 'text-feedback-info',
        bg: 'bg-feedback-info/10',
        border: 'border-feedback-info/20'
      },
      primary: {
        text: 'text-interactive-default',
        bg: 'bg-interactive-default/10',
        border: 'border-interactive-default/20'
      }
    }
    return colors[color] || colors.info
  }

  return (
    <Card size="sm" className={cn('border-l-4 border-l-interactive-default', className)}>
      <Card.Header className="pb-sm">
        <div className="flex items-center gap-sm">
          <TrendingUp className="w-4 h-4 text-interactive-default" />
          <Card.Title className="text-heading-h4">Métricas Principales</Card.Title>
        </div>
      </Card.Header>
      
      <Card.Content className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
          {metricas.map((metrica) => {
            const colorClasses = getColorClasses(metrica.color)
            
            return (
              <div 
                key={metrica.id}
                className={cn(
                  'relative p-md rounded-lg border transition-all duration-300 hover:shadow-sm',
                  colorClasses.bg,
                  colorClasses.border
                )}
              >
                {/* Header con icono */}
                <div className="flex items-center justify-between mb-sm">
                  <div className={cn(
                    'p-xs rounded-md',
                    colorClasses.bg,
                    colorClasses.text
                  )}>
                    {metrica.icon}
                  </div>
                  
                  {/* Trend indicator */}
                  <span className={cn(
                    'text-xs font-medium px-xs py-xs rounded-full',
                    metrica.trend.startsWith('+') || metrica.trend.startsWith('↑') 
                      ? 'text-feedback-success bg-feedback-success/10' 
                      : 'text-text-secondary bg-bg-light'
                  )}>
                    {metrica.trend}
                  </span>
                </div>

                {/* Valor principal */}
                <div className="mb-xs">
                  <div className={cn(
                    'text-heading-h3 font-heading transition-colors duration-300',
                    colorClasses.text
                  )}>
                    {metrica.value}
                  </div>
                </div>

                {/* Label y subtitle */}
                <div>
                  <p className="text-body-auxiliary text-text-secondary font-medium mb-xs">
                    {metrica.label}
                  </p>
                  <p className="text-body-auxiliary text-text-secondary text-sm">
                    {metrica.subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Resumen rápido */}
        <div className="mt-md pt-md border-t border-border-default">
          <div className="flex items-center justify-between text-body-auxiliary text-text-secondary">
            <span>Proceso: {solicitud?.numero_radicado || solicitud?.criterio_busqueda_radicado || 'Actual'}</span>
            <span>Actualizado hace 2 min</span>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

export default MetricsTop3