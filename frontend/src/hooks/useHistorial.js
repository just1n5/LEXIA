import { useState, useCallback, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { solicitudesService } from '../services/solicitudes'
import { useToast } from '../components/ui/Toast'

/**
 * Hook especializado para gestión completa de historial de consultas
 * Incluye filtros reactivos, búsqueda y paginación optimizada
 */
export function useHistorial(options = {}) {
  const {
    skip = 0,
    limit = 10,
    filters = {},
    searchTerm = '',
    staleTime = 5 * 60 * 1000, // 5 minutos
    cacheTime = 10 * 60 * 1000, // 10 minutos
    retryCount = 3,
    enabled = true
  } = options

  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Query principal para obtener historial con filtros
  const {
    data: historialResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isRefetching
  } = useQuery({
    queryKey: ['historial', skip, limit, filters, searchTerm],
    queryFn: async () => {
      try {
        const response = await solicitudesService.getHistorial({
          skip,
          limit,
          searchTerm,
          ...filters
        })
        return response
      } catch (error) {
        console.error('❌ Error en hook historial:', error)
        throw error
      }
    },
    staleTime,
    cacheTime,
    retry: retryCount,
    enabled,
    onError: (error) => {
      console.error('❌ Error en query historial:', error)
      toast.error('Error', 'No se pudo cargar el historial')
    },
    keepPreviousData: true // Mantener datos previos durante nuevas consultas
  })

  // Extraer datos de la respuesta
  const historialData = historialResponse?.data || []
  const totalItems = historialResponse?.total || 0
  const hasMore = historialResponse?.hasMore || false
  const currentPage = Math.floor(skip / limit) + 1

  return {
    // Datos
    historialData,
    totalItems,
    hasMore,
    currentPage,
    
    // Estados de carga
    isLoading,
    isFetching,
    isRefetching,
    isError,
    error,
    
    // Funciones de control
    refetch,
    refreshHistorial: refetch,
    
    // Utilidades de cache
    invalidateCache: () => {
      queryClient.invalidateQueries(['historial'])
    },
    
    // Prefetch para la siguiente página
    prefetchNextPage: () => {
      if (hasMore) {
        queryClient.prefetchQuery({
          queryKey: ['historial', skip + limit, limit, filters, searchTerm],
          queryFn: async () => {
            return await solicitudesService.getHistorial({
              skip: skip + limit,
              limit,
              searchTerm,
              ...filters
            })
          },
          staleTime
        })
      }
    }
  }
}

/**
 * Hook para obtener detalles completos de un item del historial
 */
export function useHistorialDetalle(historialId, options = {}) {
  const { enabled = true } = options
  const { toast } = useToast()

  return useQuery({
    queryKey: ['historial-detalle', historialId],
    queryFn: async () => {
      if (!historialId) throw new Error('ID de historial requerido')
      return await solicitudesService.getHistorialDetalle(historialId)
    },
    enabled: enabled && !!historialId,
    staleTime: 10 * 60 * 1000, // 10 minutos - los detalles no cambian frecuentemente
    onError: (error) => {
      console.error('Error cargando detalle de historial:', error)
      toast.error('Error', 'No se pudo cargar el detalle del historial')
    }
  })
}

/**
 * Hook para búsqueda optimizada con debounce automático
 */
export function useHistorialSearch(initialFilters = {}) {
  const [searchState, setSearchState] = useState({
    searchTerm: '',
    filters: initialFilters,
    isSearching: false,
    results: [],
    totalResults: 0
  })

  const searchTimeoutRef = useRef()
  const { toast } = useToast()

  const search = useCallback(async (term, filters = {}) => {
    // Limpiar búsqueda anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    setSearchState(prev => ({
      ...prev,
      searchTerm: term,
      filters,
      isSearching: true
    }))

    // Si no hay término de búsqueda, limpiar resultados
    if (!term.trim()) {
      setSearchState(prev => ({
        ...prev,
        isSearching: false,
        results: [],
        totalResults: 0
      }))
      return
    }

    // Debounce la búsqueda
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await solicitudesService.searchHistorial(term, filters)

        setSearchState(prev => ({
          ...prev,
          isSearching: false,
          results: results.data || [],
          totalResults: results.total || 0
        }))
      } catch (error) {
        console.error('Error en búsqueda de historial:', error)
        setSearchState(prev => ({
          ...prev,
          isSearching: false,
          results: [],
          totalResults: 0
        }))
        toast.error('Error', 'Error en la búsqueda')
      }
    }, 300)
  }, [toast])

  const clearSearch = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    setSearchState({
      searchTerm: '',
      filters: initialFilters,
      isSearching: false,
      results: [],
      totalResults: 0
    })
  }, [initialFilters])

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return {
    ...searchState,
    search,
    clearSearch
  }
}

/**
 * Hook para descargar PDFs del historial
 */
export function useHistorialPDF() {
  const { toast } = useToast()

  const downloadPDF = useMutation({
    mutationFn: async (historialId) => {
      return await solicitudesService.downloadHistorialPDF(historialId)
    },
    onSuccess: (data) => {
      toast.success('Descarga iniciada', data.message || 'El PDF se descargará en breve')
    },
    onError: (error) => {
      console.error('Error descargando PDF:', error)
      toast.error('Error', 'No se pudo generar el PDF')
    }
  })

  return {
    downloadPDF: downloadPDF.mutate,
    isDownloading: downloadPDF.isLoading,
    downloadError: downloadPDF.error
  }
}

/**
 * Hook para exportar historial completo
 */
export function useHistorialExport() {
  const { toast } = useToast()

  const exportHistorial = useMutation({
    mutationFn: async ({ filters = {}, format = 'csv' }) => {
      return await solicitudesService.exportHistorial(filters, format)
    },
    onSuccess: (data) => {
      toast.success('Exportación completada', data.message || 'El archivo se descargará en breve')
    },
    onError: (error) => {
      console.error('Error exportando historial:', error)
      toast.error('Error', 'No se pudo exportar el historial')
    }
  })

  return {
    exportHistorial: exportHistorial.mutate,
    isExporting: exportHistorial.isLoading,
    exportError: exportHistorial.error
  }
}

/**
 * Hook para estadísticas del historial
 */
export function useHistorialStats(options = {}) {
  const { enabled = true } = options
  const { toast } = useToast()

  return useQuery({
    queryKey: ['historial-stats'],
    queryFn: async () => {
      return await solicitudesService.getHistorialStats()
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    onError: (error) => {
      console.error('Error cargando estadísticas:', error)
      toast.error('Error', 'No se pudieron cargar las estadísticas')
    }
  })
}

/**
 * Hook combinado con filtros reactivos y paginación
 */
export function useHistorialWithFilters(initialState = {}) {
  const [state, setState] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    filters: {
      solicitudId: '',
      fechaDesde: '',
      fechaHasta: ''
    },
    searchTerm: '',
    ...initialState
  })

  // Calcular skip para paginación
  const skip = (state.currentPage - 1) * state.itemsPerPage

  // Hook principal de historial
  const historialQuery = useHistorial({
    skip,
    limit: state.itemsPerPage,
    filters: state.filters,
    searchTerm: state.searchTerm
  })

  // Actualizar filtros
  const updateFilters = useCallback((newFilters) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
      currentPage: 1 // Reset pagination cuando cambian filtros
    }))
  }, [])

  // Actualizar búsqueda
  const updateSearch = useCallback((searchTerm) => {
    setState(prev => ({
      ...prev,
      searchTerm,
      currentPage: 1 // Reset pagination cuando cambia búsqueda
    }))
  }, [])

  // Cambiar página
  const changePage = useCallback((page) => {
    setState(prev => ({
      ...prev,
      currentPage: page
    }))
    
    // Prefetch siguiente página si existe
    if (historialQuery.hasMore) {
      historialQuery.prefetchNextPage()
    }
  }, [historialQuery])

  // Limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: {
        solicitudId: '',
        fechaDesde: '',
        fechaHasta: ''
      },
      searchTerm: '',
      currentPage: 1
    }))
  }, [])

  return {
    // Estado actual
    ...state,
    
    // Datos del historial
    ...historialQuery,
    
    // Funciones de control
    updateFilters,
    updateSearch,
    changePage,
    clearAllFilters
  }
}

export default useHistorial
