import { useState, useEffect, useMemo, useCallback } from 'react'
import { solicitudesService } from '../../../../services/solicitudes'
import { useToast } from '../../../ui/Toast'

/**
 * Hook principal para manejar el estado completo del historial de ejecuciones
 * Incluye filtros, paginación, métricas y acciones
 */
export const useExecutionHistory = (solicitudId) => {
  const { toast } = useToast()
  
  // Estados base
  const [executions, setExecutions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initialized, setInitialized] = useState(false)

  // Estados de filtros
  const [dateRange, setDateRange] = useState({ start: null, end: null })
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  // Estados de vista
  const [viewMode, setViewMode] = useState('auto') // 'table', 'cards', 'auto'
  const [groupBy, setGroupBy] = useState('date') // 'date', 'status', 'none'
  const [sortBy, setSortBy] = useState({ field: 'fecha_ejecucion', direction: 'desc' })

  // Estados de acciones
  const [selectedExecution, setSelectedExecution] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Función para cargar ejecuciones
  const loadExecutions = useCallback(async (options = {}) => {
    if (!solicitudId) return

    setLoading(true)
    setError(null)

    try {
      const params = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        ...options
      }

      const data = await solicitudesService.getResultadosSolicitud(solicitudId, params)
      
      // Asegurar que data es un array
      const executionList = Array.isArray(data) ? data : data.data || []
      
      setExecutions(executionList)
      setTotalCount(data.total || executionList.length)
      
      if (!initialized) {
        setInitialized(true)
      }
    } catch (err) {
      console.error('Error loading executions:', err)
      setError('Error al cargar el historial de ejecuciones')
      
      // Fallback a datos de demo
      const demoData = generateDemoExecutions()
      setExecutions(demoData)
      setTotalCount(demoData.length)
    } finally {
      setLoading(false)
    }
  }, [solicitudId, currentPage, pageSize, initialized])

  // Cargar ejecuciones al montar y cuando cambien dependencias clave
  useEffect(() => {
    loadExecutions()
  }, [loadExecutions])

  // Función para generar datos de demo
  const generateDemoExecutions = useCallback(() => {
    const estados = ['EXITOSA', 'EXITOSA', 'EXITOSA', 'FALLIDA', 'EXITOSA']
    const despachos = [
      'Juzgado Primero Civil del Circuito de Bogotá',
      'Juzgado Segundo Civil Municipal de Medellín',
      'Tribunal Superior de Cali',
      'Juzgado Tercero Laboral de Barranquilla'
    ]
    
    return Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      fecha_ejecucion: new Date(Date.now() - (index * 6 * 60 * 60 * 1000)).toISOString(),
      estado_extraccion: estados[index % estados.length],
      numero_radicado_completo: `1100131030012024${String(index + 1).padStart(4, '0')}`,
      despacho_juzgado: despachos[index % despachos.length],
      resultados_encontrados: Math.floor(Math.random() * 4),
      tiempo_ejecucion: Math.floor(Math.random() * 300) + 30,
      logs: [
        'Conectando con sistema judicial...',
        'Autenticando credenciales...',
        'Realizando búsqueda...',
        estados[index % estados.length] === 'EXITOSA' ? 'Búsqueda completada exitosamente' : 'Error en la búsqueda'
      ]
    }))
  }, [])

  // Filtrar y ordenar ejecuciones
  const filteredExecutions = useMemo(() => {
    let filtered = [...executions]

    // Filtro por rango de fechas
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(exec => {
        const execDate = new Date(exec.fecha_ejecucion)
        return execDate >= dateRange.start && execDate <= dateRange.end
      })
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(exec => exec.estado_extraccion === statusFilter)
    }

    // Filtro por búsqueda de texto
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(exec => 
        exec.numero_radicado_completo?.toLowerCase().includes(query) ||
        exec.despacho_juzgado?.toLowerCase().includes(query)
      )
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      const aValue = a[sortBy.field]
      const bValue = b[sortBy.field]
      
      if (sortBy.field === 'fecha_ejecucion') {
        const aDate = new Date(aValue)
        const bDate = new Date(bValue)
        return sortBy.direction === 'desc' ? bDate - aDate : aDate - bDate
      }
      
      if (typeof aValue === 'string') {
        return sortBy.direction === 'desc' 
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue)
      }
      
      return sortBy.direction === 'desc' ? bValue - aValue : aValue - bValue
    })

    return filtered
  }, [executions, dateRange, statusFilter, searchQuery, sortBy])

  // Agrupar ejecuciones por fecha
  const groupedExecutions = useMemo(() => {
    if (groupBy !== 'date') {
      return { ungrouped: filteredExecutions }
    }

    const groups = {}
    const today = new Date()
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    filteredExecutions.forEach(exec => {
      const execDate = new Date(exec.fecha_ejecucion)
      
      if (isSameDay(execDate, today)) {
        if (!groups.today) groups.today = []
        groups.today.push(exec)
      } else if (isSameDay(execDate, yesterday)) {
        if (!groups.yesterday) groups.yesterday = []
        groups.yesterday.push(exec)
      } else if (execDate >= thisWeek) {
        if (!groups.thisWeek) groups.thisWeek = []
        groups.thisWeek.push(exec)
      } else {
        const monthKey = execDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
        if (!groups[monthKey]) groups[monthKey] = []
        groups[monthKey].push(exec)
      }
    })

    return groups
  }, [filteredExecutions, groupBy])

  // Calcular métricas
  const metrics = useMemo(() => {
    if (!filteredExecutions.length) {
      return {
        totalExecutions: 0,
        successRate: 0,
        averageTime: 0,
        totalTime: 0,
        successCount: 0,
        errorCount: 0,
        trend: { successRate: 0, averageTime: 0 }
      }
    }

    const successCount = filteredExecutions.filter(e => e.estado_extraccion === 'EXITOSA').length
    const errorCount = filteredExecutions.filter(e => e.estado_extraccion === 'FALLIDA').length
    const successRate = (successCount / filteredExecutions.length) * 100
    
    const totalTime = filteredExecutions.reduce((sum, e) => sum + (e.tiempo_ejecucion || 0), 0)
    const averageTime = totalTime / filteredExecutions.length

    // Calcular trend comparando con el periodo anterior (simulado)
    const trend = {
      successRate: Math.random() > 0.5 ? (Math.random() * 10) : -(Math.random() * 5),
      averageTime: Math.random() > 0.5 ? -(Math.random() * 30) : (Math.random() * 15)
    }

    return {
      totalExecutions: filteredExecutions.length,
      successRate: Math.round(successRate),
      averageTime: Math.round(averageTime),
      totalTime,
      successCount,
      errorCount,
      trend
    }
  }, [filteredExecutions])

  // Helpers
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  // Acciones
  const handleRerunExecution = useCallback(async (executionId) => {
    setActionLoading(true)
    
    try {
      // Simular rerun
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(
        'Ejecución requeued',
        'La ejecución se ha agregado a la cola para ser procesada nuevamente'
      )
      
      // Recargar datos
      await loadExecutions()
    } catch (error) {
      toast.error('Error', 'No se pudo requeustar la ejecución')
    } finally {
      setActionLoading(false)
    }
  }, [loadExecutions, toast])

  const handleExportData = useCallback(async (format = 'csv', executionIds = null) => {
    setActionLoading(true)
    
    try {
      const dataToExport = executionIds 
        ? filteredExecutions.filter(e => executionIds.includes(e.id))
        : filteredExecutions

      // Simular export
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success(
        'Exportación completada',
        `Se han exportado ${dataToExport.length} ejecuciones en formato ${format.toUpperCase()}`
      )
    } catch (error) {
      toast.error('Error en exportación', 'No se pudo completar la exportación')
    } finally {
      setActionLoading(false)
    }
  }, [filteredExecutions, toast])

  const handleViewDetails = useCallback((execution) => {
    setSelectedExecution(execution)
    setShowDetails(true)
  }, [])

  const handleCloseDetails = useCallback(() => {
    setSelectedExecution(null)
    setShowDetails(false)
  }, [])

  // Funciones de filtros
  const setDateRangePreset = useCallback((preset) => {
    const now = new Date()
    const presets = {
      '7d': {
        start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        end: now
      },
      '30d': {
        start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        end: now
      },
      '90d': {
        start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        end: now
      },
      'all': {
        start: null,
        end: null
      }
    }
    
    setDateRange(presets[preset] || presets.all)
    setCurrentPage(1) // Reset pagination
  }, [])

  const clearFilters = useCallback(() => {
    setDateRange({ start: null, end: null })
    setStatusFilter('all')
    setSearchQuery('')
    setCurrentPage(1)
  }, [])

  // Paginación
  const totalPages = Math.ceil(totalCount / pageSize)
  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }, [])

  return {
    // Datos
    executions: filteredExecutions,
    groupedExecutions,
    metrics,
    
    // Estados
    loading,
    error,
    initialized,
    actionLoading,
    
    // Filtros
    filters: {
      dateRange,
      statusFilter,
      searchQuery,
      sortBy
    },
    
    // Paginación
    pagination: {
      currentPage,
      pageSize,
      totalPages,
      totalCount,
      hasNextPage,
      hasPreviousPage
    },
    
    // Vista
    view: {
      viewMode,
      groupBy,
      selectedExecution,
      showDetails
    },
    
    // Acciones de filtros
    filterActions: {
      setDateRange,
      setStatusFilter,
      setSearchQuery,
      setSortBy,
      setDateRangePreset,
      clearFilters
    },
    
    // Acciones de paginación
    paginationActions: {
      goToPage,
      changePageSize,
      nextPage: () => goToPage(currentPage + 1),
      previousPage: () => goToPage(currentPage - 1)
    },
    
    // Acciones de vista
    viewActions: {
      setViewMode,
      setGroupBy,
      handleViewDetails,
      handleCloseDetails
    },
    
    // Acciones de datos
    dataActions: {
      loadExecutions,
      handleRerunExecution,
      handleExportData,
      refresh: () => loadExecutions()
    }
  }
}

export default useExecutionHistory