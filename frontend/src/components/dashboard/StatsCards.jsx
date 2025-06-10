import React from 'react'
import { TrendingUp, TrendingDown, Minus, AlertCircle, FileText, CheckCircle, Zap, RotateCcw, BarChart3 } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Componente de tarjeta de estadística individual
 * Implementa las especificaciones exactas de la guía de estilo
 */
const StatCard = ({
  title,
  value,
  icon,
  description,
  trend,
  trendDirection, // 'up' | 'down' | 'neutral'
  isLoading = false,
  error = null,
  className = '',
  ...props
}) => {
  const getTrendConfig = () => {
    switch (trendDirection) {
      case 'up':
        return {
          color: 'text-feedback-success',
          bgColor: 'bg-feedback-success-light',
          icon: <TrendingUp className="w-3 h-3" aria-hidden="true" />,
          label: 'Tendencia positiva'
        }
      case 'down':
        return {
          color: 'text-feedback-error',
          bgColor: 'bg-feedback-error-light',
          icon: <TrendingDown className="w-3 h-3" aria-hidden="true" />,
          label: 'Tendencia negativa'
        }
      default:
        return {
          color: 'text-text-secondary',
          bgColor: 'bg-bg-light',
          icon: <Minus className="w-3 h-3" aria-hidden="true" />,
          label: 'Sin cambios'
        }
    }
  }

  const trendConfig = getTrendConfig()

  if (isLoading) {
    return (
      <div className={cn('stat-card', className)} {...props}>
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          
          {/* Value skeleton */}
          <div className="h-10 bg-gray-200 rounded w-16 mb-2"></div>
          
          {/* Trend skeleton */}
          <div className="h-6 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('stat-card border-feedback-error', className)} {...props}>
        <div className="flex items-center gap-3 text-feedback-error">
          <div className="w-12 h-12 bg-feedback-error-light rounded-lg flex items-center justify-center">
            <AlertCircle className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="stat-title text-feedback-error">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn('stat-card group', className)} 
      role="article"
      aria-labelledby={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
      {...props}
    >
      {/* Header con icono y título */}
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div className="w-12 h-12 bg-gradient-to-br from-interactive-default to-yellow-500 rounded-lg flex items-center justify-center text-white shadow-sm">
            <div className="text-white">
              {icon}
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 
            id={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="stat-title"
          >
            {title}
          </h3>
          {description && (
            <p className="text-xs text-text-secondary mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex items-end justify-between">
        {/* Valor principal */}
        <div>
          <div 
            className="stat-value"
            aria-label={`Valor: ${value}`}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        </div>
        
        {/* Indicador de tendencia */}
        {trend && (
          <div 
            className={cn(
              'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
              trendConfig.color,
              trendConfig.bgColor
            )}
            aria-label={`${trendConfig.label}: ${trend}`}
            title={`${trendConfig.label}: ${trend}`}
          >
            {trendConfig.icon}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Componente principal de tarjetas de estadísticas
 * Implementa el sistema de diseño de la guía de estilo
 */
const StatsCards = ({ 
  solicitudes = [], 
  isLoading = false,
  error = null,
  className = '',
  ...props
}) => {
  // Calcular estadísticas basadas en los datos reales
  const stats = React.useMemo(() => {
    if (isLoading || error) {
      return [
        { key: 'total', title: 'Total Solicitudes', value: 0, icon: <FileText className="w-5 h-5" />, description: 'Solicitudes registradas' },
        { key: 'activas', title: 'Solicitudes Activas', value: 0, icon: <CheckCircle className="w-5 h-5" />, description: 'En monitoreo activo' },
        { key: 'proceso', title: 'En Proceso', value: 0, icon: <Zap className="w-5 h-5" />, description: 'Ejecutándose ahora' },
        { key: 'recientes', title: 'Actualizaciones', value: 0, icon: <RotateCcw className="w-5 h-5" />, description: 'Últimas 24 horas' }
      ]
    }

    const totalSolicitudes = solicitudes.length
    const solicitudesActivas = solicitudes.filter(s => s.estado === 'activa').length
    const enProceso = solicitudes.filter(s => s.estado === 'en_proceso').length
    
    // Calcular actualizaciones recientes (últimas 24 horas)
    const hace24Horas = new Date()
    hace24Horas.setDate(hace24Horas.getDate() - 1)
    
    const actualizacionesRecientes = solicitudes.filter(s => {
      if (!s.ultima_ejecucion) return false
      try {
        const fechaEjecucion = new Date(s.ultima_ejecucion)
        return fechaEjecucion > hace24Horas
      } catch {
        return false
      }
    }).length

    // Simular tendencias (en producción vendrían del backend)
    const calcularTendencia = (valorActual, tipo) => {
      const tendencias = {
        total: { valor: valorActual > 5 ? '+2' : '+1', direccion: 'up' },
        activas: { valor: solicitudesActivas > 3 ? '+1' : '0', direccion: solicitudesActivas > 3 ? 'up' : 'neutral' },
        proceso: { valor: enProceso > 0 ? 'Activo' : 'Inactivo', direccion: enProceso > 0 ? 'up' : 'neutral' },
        recientes: { valor: actualizacionesRecientes > 5 ? '+3' : actualizacionesRecientes > 0 ? '+' + actualizacionesRecientes : '0', direccion: actualizacionesRecientes > 0 ? 'up' : 'neutral' }
      }
      return tendencias[tipo] || { valor: '0', direccion: 'neutral' }
    }

    return [
      {
        key: 'total',
        title: 'Total Solicitudes',
        value: totalSolicitudes,
        icon: <FileText className="w-5 h-5" />,
        description: 'Solicitudes registradas',
        trend: calcularTendencia(totalSolicitudes, 'total').valor,
        trendDirection: calcularTendencia(totalSolicitudes, 'total').direccion
      },
      {
        key: 'activas',
        title: 'Solicitudes Activas',
        value: solicitudesActivas,
        icon: <CheckCircle className="w-5 h-5" />,
        description: 'En monitoreo activo',
        trend: calcularTendencia(solicitudesActivas, 'activas').valor,
        trendDirection: calcularTendencia(solicitudesActivas, 'activas').direccion
      },
      {
        key: 'proceso',
        title: 'En Proceso',
        value: enProceso,
        icon: <Zap className="w-5 h-5" />,
        description: 'Ejecutándose ahora',
        trend: calcularTendencia(enProceso, 'proceso').valor,
        trendDirection: calcularTendencia(enProceso, 'proceso').direccion
      },
      {
        key: 'recientes',
        title: 'Actualizaciones',
        value: actualizacionesRecientes,
        icon: <RotateCcw className="w-5 h-5" />,
        description: 'Últimas 24 horas',
        trend: calcularTendencia(actualizacionesRecientes, 'recientes').valor,
        trendDirection: calcularTendencia(actualizacionesRecientes, 'recientes').direccion
      }
    ]
  }, [solicitudes, isLoading, error])

  return (
    <section 
      className={cn('mb-xl', className)}
      aria-labelledby="stats-heading"
      {...props}
    >
      {/* Título de la sección (visualmente oculto pero accesible) */}
      <h2 id="stats-heading" className="sr-only">
        Estadísticas del Dashboard
      </h2>
      
      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            trend={stat.trend}
            trendDirection={stat.trendDirection}
            isLoading={isLoading}
            error={error}
            // Agregar delay progresivo para animación
            style={{
              animationDelay: isLoading ? `${index * 100}ms` : '0ms'
            }}
            className="hover:scale-105 transition-transform duration-200"
          />
        ))}
      </div>

      {/* Estado vacío cuando no hay solicitudes */}
      {!isLoading && !error && solicitudes.length === 0 && (
        <div className="mt-lg p-lg bg-bg-light border border-border-default rounded-md text-center">
          <div className="flex justify-center mb-md" aria-hidden="true">
            <BarChart3 className="w-12 h-12 text-text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-text-base mb-sm">
            Sin datos para mostrar
          </h3>
          <p className="text-text-secondary">
            Crea tu primera solicitud para ver las estadísticas aquí.
          </p>
        </div>
      )}
    </section>
  )
}

StatsCards.displayName = 'StatsCards'

export default StatsCards