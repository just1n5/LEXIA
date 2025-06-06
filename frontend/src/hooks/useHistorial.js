import { useState, useCallback, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { solicitudesService } from '../services/solicitudes'
import { useToast } from '../components/ui/Toast'

/**
 * Hook especializado para gestión completa de historial de consultas
 * Incluye filtros reactivos, búsqueda y paginación optimizada
 * ✅ ACTUALIZADO: Migrado a @tanstack/react-query v5
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
    gcTime: cacheTime, // ✅ v5: gcTime reemplaza cacheTime
    retry: retryCount,
    enabled,
    placeholderData: { data: [], total: 0, hasMore: false }, // ✅ v5: placeholderData reemplaza keepPreviousData
    meta: {
      errorMessage: 'No se pudo cargar el historial'
    }
  })

  // Extraer datos de la respuesta
  const historialData = historialResponse?.data || []
  const totalItems = historialResponse?.total || 0
  const hasMore = historialResponse?.hasMore || false
  const currentPage = Math.floor(skip / limit) + 1

  // ✅ Error handling mejorado para v5
  useEffect(() => {
    if (isError && error) {
      console.error('❌ Error en query historial:', error)
      toast?.error('Error', 'No se pudo cargar el historial')
    }
  }, [isError, error, toast])

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
      queryClient.invalidateQueries({ queryKey: ['historial'] })
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
 * ✅ ACTUALIZADO: Migrado a @tanstack/react-query v5
 */
export function useHistorialDetalle(historialId, options = {}) {
  const { enabled = true } = options
  const { toast } = useToast()

  const query = useQuery({
    queryKey: ['historial-detalle', historialId],
    queryFn: async () => {
      if (!historialId) throw new Error('ID de historial requerido')
      return await solicitudesService.getHistorialDetalle(historialId)
    },
    enabled: enabled && !!historialId,
    staleTime: 10 * 60 * 1000, // 10 minutos - los detalles no cambian frecuentemente
    meta: {
      errorMessage: 'No se pudo cargar el detalle del historial'
    }
  })

  // ✅ Error handling mejorado para v5
  useEffect(() => {
    if (query.isError && query.error) {
      console.error('Error cargando detalle de historial:', query.error)
      toast?.error('Error', 'No se pudo cargar el detalle del historial')
    }
  }, [query.isError, query.error, toast])

  return query
}

/**
 * Hook para búsqueda optimizada con debounce automático
 * ✅ ACTUALIZADO: Lógica mejorada sin dependencias específicas de React Query
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
        toast?.error('Error', 'Error en la búsqueda')
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
 * ✅ ACTUALIZADO: Migrado a @tanstack/react-query v5
 */
export function useHistorialPDF() {
  const { toast } = useToast()

  const downloadMutation = useMutation({
    mutationFn: async (historialId) => {
      return await solicitudesService.downloadHistorialPDF(historialId)
    },
    onSuccess: (data) => {
      toast?.success('Descarga iniciada', data.message || 'El PDF se descargará en breve')
    },
    onError: (error) => {
      console.error('Error descargando PDF:', error)
      toast?.error('Error', 'No se pudo generar el PDF')
    }
  })

  return {
    downloadPDF: downloadMutation.mutate,
    isDownloading: downloadMutation.isPending, // ✅ v5: isPending reemplaza isLoading
    downloadError: downloadMutation.error
  }
}

/**
 * Hook para exportar historial completo
 * ✅ ACTUALIZADO: Migrado a @tanstack/react-query v5
 */
export function useHistorialExport() {
  const { toast } = useToast()

  const exportMutation = useMutation({
    mutationFn: async ({ filters = {}, format = 'csv' }) => {
      return await solicitudesService.exportHistorial(filters, format)
    },
    onSuccess: (data) => {
      toast?.success('Exportación completada', data.message || 'El archivo se descargará en breve')
    },
    onError: (error) => {
      console.error('Error exportando historial:', error)
      toast?.error('Error', 'No se pudo exportar el historial')
    }
  })

  return {
    exportHistorial: exportMutation.mutate,
    isExporting: exportMutation.isPending, // ✅ v5: isPending reemplaza isLoading
    exportError: exportMutation.error
  }
}

/**
 * Hook para estadísticas del historial
 * ✅ ACTUALIZADO: Migrado a @tanstack/react-query v5
 */
export function useHistorialStats(options = {}) {
  const { enabled = true } = options
  const { toast } = useToast()

  const query = useQuery({
    queryKey: ['historial-stats'],
    queryFn: async () => {
      return await solicitudesService.getHistorialStats()
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    meta: {
      errorMessage: 'No se pudieron cargar las estadísticas'
    }
  })

  // ✅ Error handling mejorado para v5
  useEffect(() => {
    if (query.isError && query.error) {
      console.error('Error cargando estadísticas:', query.error)
      toast?.error('Error', 'No se pudieron cargar las estadísticas')
    }
  }, [query.isError, query.error, toast])

  return query
}

/**
 * Hook combinado con filtros reactivos y paginación
 * ✅ ACTUALIZADO: Lógica mejorada sin cambios específicos de React Query
 */
export function useHistorialWithFilters(initialState = {}) {
  const [state, setState] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    filters: {
      solicitudId: '',
      fechaDesde: '',
      fechaHasta: '',
      estados: [],
      despachos: []
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
        fechaHasta: '',
        estados: [],
        despachos: []
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