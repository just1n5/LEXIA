import React, { useMemo, useState, useCallback } from 'react'
import { Calendar, TrendingUp, TrendingDown, Activity, CheckCircle, XCircle, Clock, Filter, BarChart3, PieChart, LineChart } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

/**
 * 📊 HISTORIAL ANALYTICS DASHBOARD - Versión Simplificada
 * Visualización de datos con gráficos CSS hasta que se instale recharts
 * Optimizado para performance y accesibilidad
 */
const HistorialAnalytics = ({ 
  data = [], 
  isLoading = false, 
  className = '',
  onDateRangeChange = () => {},
  dateRange = { start: null, end: null }
}) => {
  const [selectedMetric, setSelectedMetric] = useState('all')
  const [timeframe, setTimeframe] = useState('7d') // 7d, 30d, 90d

  // 🚀 MEMOIZED CALCULATIONS - Performance Optimization
  const analytics = useMemo(() => {
    if (!data.length) return null

    const now = new Date()
    const timeframes = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000
    }

    const filteredData = data.filter(item => {
      const itemDate = new Date(item.fecha_ejecucion)
      return (now - itemDate) <= timeframes[timeframe]
    })

    // Métricas principales
    const totalConsultas = filteredData.length
    const exitosas = filteredData.filter(item => item.estado_extraccion === 'exitoso').length
    const errores = filteredData.filter(item => item.estado_extraccion?.includes('error')).length
    const pendientes = filteredData.filter(item => item.estado_extraccion === 'pendiente').length

    const tasaExito = totalConsultas > 0 ? (exitosas / totalConsultas * 100).toFixed(1) : 0
    const tasaError = totalConsultas > 0 ? (errores / totalConsultas * 100).toFixed(1) : 0

    // Datos por día para gráficos de tendencia
    const consultasPorDia = filteredData.reduce((acc, item) => {
      const fecha = new Date(item.fecha_ejecucion).toISOString().split('T')[0]
      acc[fecha] = (acc[fecha] || 0) + 1
      return acc
    }, {})

    const trendData = Object.entries(consultasPorDia)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fecha, cantidad]) => ({
        fecha: new Date(fecha).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
        cantidad,
        exitosas: filteredData.filter(item => 
          new Date(item.fecha_ejecucion).toISOString().split('T')[0] === fecha && 
          item.estado_extraccion === 'exitoso'
        ).length,
        errores: filteredData.filter(item => 
          new Date(item.fecha_ejecucion).toISOString().split('T')[0] === fecha && 
          item.estado_extraccion?.includes('error')
        ).length
      }))

    // Distribución de estados
    const estadosDistribucion = [
      { name: 'Exitoso', value: exitosas, color: '#10B981', percentage: totalConsultas > 0 ? (exitosas / totalConsultas * 100).toFixed(1) : 0 },
      { 
        name: 'Error Captcha', 
        value: filteredData.filter(item => item.estado_extraccion === 'error_captcha').length, 
        color: '#FBBF24',
        percentage: totalConsultas > 0 ? (filteredData.filter(item => item.estado_extraccion === 'error_captcha').length / totalConsultas * 100).toFixed(1) : 0
      },
      { 
        name: 'Error Sistema', 
        value: filteredData.filter(item => item.estado_extraccion === 'error_sistema').length, 
        color: '#EF4444',
        percentage: totalConsultas > 0 ? (filteredData.filter(item => item.estado_extraccion === 'error_sistema').length / totalConsultas * 100).toFixed(1) : 0
      },
      { 
        name: 'Pendiente', 
        value: pendientes, 
        color: '#3B82F6',
        percentage: totalConsultas > 0 ? (pendientes / totalConsultas * 100).toFixed(1) : 0
      }
    ].filter(item => item.value > 0)

    // Top despachos
    const despachos = filteredData.reduce((acc, item) => {
      if (item.despacho_juzgado) {
        acc[item.despacho_juzgado] = (acc[item.despacho_juzgado] || 0) + 1
      }
      return acc
    }, {})

    const topDespachos = Object.entries(despachos)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([despacho, cantidad]) => ({ despacho, cantidad, percentage: (cantidad / totalConsultas * 100).toFixed(1) }))

    return {
      totalConsultas,
      exitosas,
      errores,
      pendientes,
      tasaExito,
      tasaError,
      trendData,
      estadosDistribucion,
      topDespachos,
      promedioConsultasDia: (totalConsultas / Math.max(trendData.length, 1)).toFixed(1)
    }
  }, [data, timeframe])

  // 🎯 MEMOIZED HANDLERS - Performance Optimization
  const handleTimeframeChange = useCallback((newTimeframe) => {
    setTimeframe(newTimeframe)
  }, [])

  const handleMetricChange = useCallback((metric) => {
    setSelectedMetric(metric)
  }, [])

  if (isLoading) {
    return (
      <div className={cn('bg-bg-canvas rounded-lg border border-border-default p-xl', className)}>
        <div className="animate-pulse space-y-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-bg-light rounded-lg"></div>
            ))}
          </div>
          <div className="h-80 bg-bg-light rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className={cn('bg-bg-canvas rounded-lg border border-border-default p-xl text-center', className)}>
        <Activity className="w-12 h-12 text-text-secondary mx-auto mb-lg" />
        <h3 className="text-heading-h3 font-heading text-text-primary mb-sm">
          Sin datos para analizar
        </h3>
        <p className="text-body-paragraph text-text-secondary">
          Realiza algunas consultas para ver analytics detallados
        </p>
      </div>
    )
  }

  return (
    <div className={cn('bg-bg-canvas rounded-lg border border-border-default', className)} 
         role="region" 
         aria-label="Dashboard de analytics del historial">
      
      {/* Header con controles */}
      <div className="p-lg border-b border-border-default">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-lg">
          <div>
            <h2 className="text-heading-h2 font-heading text-text-primary mb-sm">
              Analytics del Historial
            </h2>
            <p className="text-body-paragraph text-text-secondary">
              Visualización y análisis de tendencias de consultas judiciales
            </p>
          </div>
          
          {/* Controles de timeframe */}
          <div className="flex items-center space-x-sm" role="group" aria-label="Filtros de período">
            {[
              { value: '7d', label: 'Últimos 7 días' },
              { value: '30d', label: 'Últimos 30 días' },
              { value: '90d', label: 'Últimos 90 días' }
            ].map(({ value, label }) => (
              <Button
                key={value}
                variant={timeframe === value ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleTimeframeChange(value)}
                aria-pressed={timeframe === value}
                aria-label={`Filtrar por ${label}`}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="p-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
          
          {/* Total de Consultas */}
          <div className="bg-bg-light rounded-lg p-lg border border-border-default" 
               role="article" 
               aria-label="Métrica: Total de consultas">
            <div className="flex items-center justify-between mb-sm">
              <div className="flex items-center space-x-sm">
                <Activity className="w-5 h-5 text-interactive-default" aria-hidden="true" />
                <span className="text-body-auxiliary font-medium text-text-secondary">
                  Total Consultas
                </span>
              </div>
            </div>
            <div className="text-heading-h1 font-heading text-text-primary" aria-live="polite">
              {analytics.totalConsultas.toLocaleString()}
            </div>
            <p className="text-body-auxiliary text-text-secondary mt-xs">
              {analytics.promedioConsultasDia} promedio/día
            </p>
          </div>

          {/* Tasa de Éxito */}
          <div className="bg-bg-light rounded-lg p-lg border border-border-default"
               role="article" 
               aria-label="Métrica: Tasa de éxito">
            <div className="flex items-center justify-between mb-sm">
              <div className="flex items-center space-x-sm">
                <CheckCircle className="w-5 h-5 text-feedback-success" aria-hidden="true" />
                <span className="text-body-auxiliary font-medium text-text-secondary">
                  Tasa de Éxito
                </span>
              </div>
              <TrendingUp className="w-4 h-4 text-feedback-success" aria-hidden="true" />
            </div>
            <div className="text-heading-h1 font-heading text-feedback-success" aria-live="polite">
              {analytics.tasaExito}%
            </div>
            <p className="text-body-auxiliary text-text-secondary mt-xs">
              {analytics.exitosas} consultas exitosas
            </p>
          </div>

          {/* Tasa de Error */}
          <div className="bg-bg-light rounded-lg p-lg border border-border-default"
               role="article" 
               aria-label="Métrica: Tasa de error">
            <div className="flex items-center justify-between mb-sm">
              <div className="flex items-center space-x-sm">
                <XCircle className="w-5 h-5 text-feedback-error" aria-hidden="true" />
                <span className="text-body-auxiliary font-medium text-text-secondary">
                  Tasa de Error
                </span>
              </div>
              <TrendingDown className="w-4 h-4 text-feedback-error" aria-hidden="true" />
            </div>
            <div className="text-heading-h1 font-heading text-feedback-error" aria-live="polite">
              {analytics.tasaError}%
            </div>
            <p className="text-body-auxiliary text-text-secondary mt-xs">
              {analytics.errores} consultas con errores
            </p>
          </div>

          {/* Pendientes */}
          <div className="bg-bg-light rounded-lg p-lg border border-border-default"
               role="article" 
               aria-label="Métrica: Consultas pendientes">
            <div className="flex items-center justify-between mb-sm">
              <div className="flex items-center space-x-sm">
                <Clock className="w-5 h-5 text-feedback-info" aria-hidden="true" />
                <span className="text-body-auxiliary font-medium text-text-secondary">
                  Pendientes
                </span>
              </div>
            </div>
            <div className="text-heading-h1 font-heading text-feedback-info" aria-live="polite">
              {analytics.pendientes}
            </div>
            <p className="text-body-auxiliary text-text-secondary mt-xs">
              En proceso de consulta
            </p>
          </div>
        </div>

        {/* Visualizaciones simplificadas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
          
          {/* Tendencia Simplificada */}
          <div className="bg-bg-light rounded-lg p-lg border border-border-default">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-heading-h3 font-heading text-text-primary flex items-center gap-sm">
                <LineChart className="w-5 h-5 text-interactive-default" />
                Tendencia de Consultas
              </h3>
              <Badge variant="info" className="text-body-auxiliary">
                {timeframe === '7d' ? 'Últimos 7 días' : timeframe === '30d' ? 'Últimos 30 días' : 'Últimos 90 días'}
              </Badge>
            </div>
            
            <div className="space-y-md">
              {analytics.trendData.slice(-7).map((item, index) => {
                const maxValue = Math.max(...analytics.trendData.map(d => d.cantidad))
                const percentage = maxValue > 0 ? (item.cantidad / maxValue) * 100 : 0
                
                return (
                  <div key={index} className="flex items-center gap-sm">
                    <div className="w-16 text-body-auxiliary text-text-secondary text-xs">
                      {item.fecha}
                    </div>
                    <div className="flex-1 bg-bg-canvas rounded-full h-6 relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-interactive-default to-interactive-hover rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-text-primary">
                          {item.cantidad}
                        </span>
                      </div>
                    </div>
                    <div className="text-body-auxiliary text-text-secondary text-xs w-16 text-right">
                      {item.exitosas}✓ {item.errores}✗
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Distribución de Estados */}
          <div className="bg-bg-light rounded-lg p-lg border border-border-default">
            <h3 className="text-heading-h3 font-heading text-text-primary mb-lg flex items-center gap-sm">
              <PieChart className="w-5 h-5 text-interactive-default" />
              Distribución de Estados
            </h3>
            
            <div className="space-y-md">
              {analytics.estadosDistribucion.map((estado, index) => (
                <div key={index} className="flex items-center gap-sm">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: estado.color }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-body-paragraph text-text-primary font-medium">
                        {estado.name}
                      </span>
                      <span className="text-body-auxiliary text-text-secondary">
                        {estado.value} ({estado.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-bg-canvas rounded-full h-2 mt-xs">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: estado.color,
                          width: `${estado.percentage}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Despachos */}
          <div className="bg-bg-light rounded-lg p-lg border border-border-default lg:col-span-2">
            <h3 className="text-heading-h3 font-heading text-text-primary mb-lg flex items-center gap-sm">
              <BarChart3 className="w-5 h-5 text-interactive-default" />
              Despachos Más Consultados
            </h3>
            
            <div className="space-y-md">
              {analytics.topDespachos.map((despacho, index) => {
                const maxValue = Math.max(...analytics.topDespachos.map(d => d.cantidad))
                const percentage = maxValue > 0 ? (despacho.cantidad / maxValue) * 100 : 0
                
                return (
                  <div key={index} className="space-y-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-body-paragraph text-text-primary font-medium truncate">
                        {despacho.despacho}
                      </span>
                      <span className="text-body-auxiliary text-text-secondary">
                        {despacho.cantidad} consultas
                      </span>
                    </div>
                    <div className="w-full bg-bg-canvas rounded-full h-3">
                      <div 
                        className="h-3 bg-gradient-to-r from-interactive-default to-interactive-hover rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Nota sobre gráficos */}
        <div className="mt-xl p-lg bg-feedback-info bg-opacity-10 border border-feedback-info border-opacity-30 rounded-lg">
          <div className="flex items-start gap-sm">
            <Activity className="w-5 h-5 text-feedback-info flex-shrink-0 mt-xs" />
            <div>
              <h4 className="text-body-paragraph font-medium text-feedback-info mb-xs">
                Versión Simplificada de Analytics
              </h4>
              <p className="text-body-auxiliary text-text-secondary mb-sm">
                Actualmente mostrando visualizaciones básicas. Para ver gráficos interactivos avanzados, 
                ejecuta <code className="bg-bg-canvas px-xs py-xs rounded text-xs">npm install</code> para 
                instalar las dependencias faltantes.
              </p>
              <p className="text-body-auxiliary text-text-secondary">
                Una vez instaladas las dependencias, obtendrás gráficos de línea interactivos, 
                gráficos circulares animados y gráficos de barras con tooltips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

HistorialAnalytics.displayName = 'HistorialAnalytics'

export default React.memo(HistorialAnalytics)
