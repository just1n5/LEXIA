import { useMemo, useCallback, useRef, useEffect } from 'react'

/**
 * 🚀 ANALYTICS HOOK - Performance Optimized
 * Hook personalizado para cálculos de analytics con memoización avanzada
 */
export const useAnalytics = (data = [], options = {}) => {
  const {
    timeframe = '30d',
    enableRealTime = false,
    cacheTimeout = 5 * 60 * 1000 // 5 minutos
  } = options

  const cacheRef = useRef({})
  const lastCalculationRef = useRef(0)

  // 🎯 MEMOIZED TIMEFRAME CALCULATIONS
  const timeframeBounds = useMemo(() => {
    const now = new Date()
    const timeframes = {
      '7d': { days: 7, label: 'Últimos 7 días' },
      '30d': { days: 30, label: 'Últimos 30 días' },
      '90d': { days: 90, label: 'Últimos 90 días' },
      '1y': { days: 365, label: 'Último año' }
    }
    
    const config = timeframes[timeframe] || timeframes['30d']
    const startDate = new Date(now.getTime() - (config.days * 24 * 60 * 60 * 1000))
    
    return {
      start: startDate,
      end: now,
      days: config.days,
      label: config.label
    }
  }, [timeframe])

  // 🚀 FILTERED DATA - Memoized for performance
  const filteredData = useMemo(() => {
    if (!data?.length) return []
    
    return data.filter(item => {
      if (!item.fecha_ejecucion) return false
      const itemDate = new Date(item.fecha_ejecucion)
      return itemDate >= timeframeBounds.start && itemDate <= timeframeBounds.end
    })
  }, [data, timeframeBounds])

  // 📊 CORE METRICS - Heavy calculations memoized
  const coreMetrics = useMemo(() => {
    const cacheKey = `metrics_${timeframe}_${filteredData.length}_${filteredData[0]?.id || 'empty'}`
    const now = Date.now()
    
    // Check cache first
    if (cacheRef.current[cacheKey] && 
        (now - lastCalculationRef.current) < cacheTimeout) {
      return cacheRef.current[cacheKey]
    }

    if (!filteredData.length) {
      const emptyMetrics = {
        totalConsultas: 0,
        exitosas: 0,
        errores: 0,
        pendientes: 0,
        tasaExito: 0,
        tasaError: 0,
        tasaPendiente: 0,
        promedioConsultasDia: 0,
        cambioAnterior: 0
      }
      cacheRef.current[cacheKey] = emptyMetrics
      return emptyMetrics
    }

    // Calculate metrics
    const totalConsultas = filteredData.length
    const exitosas = filteredData.filter(item => item.estado_extraccion === 'exitoso').length
    const errores = filteredData.filter(item => 
      item.estado_extraccion?.includes('error')
    ).length
    const pendientes = filteredData.filter(item => 
      item.estado_extraccion === 'pendiente'
    ).length

    const tasaExito = totalConsultas > 0 ? (exitosas / totalConsultas * 100) : 0
    const tasaError = totalConsultas > 0 ? (errores / totalConsultas * 100) : 0
    const tasaPendiente = totalConsultas > 0 ? (pendientes / totalConsultas * 100) : 0
    const promedioConsultasDia = totalConsultas / timeframeBounds.days

    // Calculate change vs previous period
    const previousPeriodStart = new Date(
      timeframeBounds.start.getTime() - (timeframeBounds.days * 24 * 60 * 60 * 1000)
    )
    const previousPeriodData = data.filter(item => {
      const itemDate = new Date(item.fecha_ejecucion)
      return itemDate >= previousPeriodStart && itemDate < timeframeBounds.start
    })
    
    const cambioAnterior = previousPeriodData.length > 0 
      ? ((totalConsultas - previousPeriodData.length) / previousPeriodData.length * 100)
      : 0

    const metrics = {
      totalConsultas,
      exitosas,
      errores,
      pendientes,
      tasaExito: Math.round(tasaExito * 10) / 10,
      tasaError: Math.round(tasaError * 10) / 10,
      tasaPendiente: Math.round(tasaPendiente * 10) / 10,
      promedioConsultasDia: Math.round(promedioConsultasDia * 10) / 10,
      cambioAnterior: Math.round(cambioAnterior * 10) / 10
    }

    // Cache results
    cacheRef.current[cacheKey] = metrics
    lastCalculationRef.current = now
    
    return metrics
  }, [filteredData, timeframeBounds, data, timeframe, cacheTimeout])

  // 🔄 REFRESH FUNCTION - Manual cache invalidation
  const refreshAnalytics = useCallback(() => {
    cacheRef.current = {}
    lastCalculationRef.current = 0
  }, [])

  // 🔄 AUTO REFRESH - For real-time updates
  useEffect(() => {
    if (!enableRealTime) return

    const interval = setInterval(() => {
      refreshAnalytics()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [enableRealTime, refreshAnalytics])

  return {
    // Core data
    metrics: coreMetrics,
    
    // Metadata
    timeframe: timeframeBounds,
    totalRecords: filteredData.length,
    isLoading: false,
    
    // Utility functions
    refreshAnalytics,
    
    // Cache info (for debugging)
    cacheSize: Object.keys(cacheRef.current).length,
    lastCalculation: new Date(lastCalculationRef.current)
  }
}

export default useAnalytics
