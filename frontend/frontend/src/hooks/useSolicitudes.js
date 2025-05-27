import { useState, useCallback, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { solicitudesService } from '../services/solicitudes'
import { useToast } from '../components/ui/Toast'

/**
 * Hook especializado para gestión completa de solicitudes - VERSIÓN SIMPLIFICADA
 */
export function useSolicitudes(options = {}) {
  const {
    skip = 0,
    limit = 10,
    enableRealTime = false,
    pollingInterval = 30000,
    staleTime = 5 * 60 * 1000,
    cacheTime = 10 * 60 * 1000,
    retryCount = 3,
  } = options

  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Query SIMPLIFICADA para obtener solicitudes
  const {
    data: solicitudes = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isRefetching
  } = useQuery({
    queryKey: ['solicitudes', skip, limit],
    queryFn: async () => {
      try {
        const response = await solicitudesService.getSolicitudes({
          skip,
          limit
        })
        return response || []
      } catch (error) {
        console.error('❌ Error en hook queryFn:', error)
        throw error
      }
    },
    staleTime,
    cacheTime,
    retry: retryCount,
    refetchInterval: enableRealTime ? pollingInterval : false,
    onError: (error) => {
      console.error('❌ Error en query solicitudes:', error)
      toast.error('Error', 'No se pudieron cargar las solicitudes')
    }
  })

  // RETURN SIMPLIFICADO
  return {
    // Datos
    solicitudes: solicitudes || [],
    rawSolicitudes: solicitudes,
    
    // Estados de carga
    isLoading,
    isFetching,
    isRefetching,
    isError,
    error,
    
    // Funciones básicas
    refetch,
    
    // Funciones de utilidad
    refreshSolicitudes: refetch,
    
    // Invalidar cache manualmente
    invalidateCache: () => {
      queryClient.invalidateQueries(['solicitudes'])
    }
  }
}

/**
 * Hook específico para obtener una solicitud individual
 */
export function useSolicitud(id, options = {}) {
  const { enabled = true } = options
  const { toast } = useToast()

  return useQuery({
    queryKey: ['solicitud', id],
    queryFn: async () => {
      if (!id) throw new Error('ID de solicitud requerido')
      return await solicitudesService.getSolicitudById(id)
    },
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutos
    onError: (error) => {
      console.error('Error cargando solicitud:', error)
      toast.error('Error', 'No se pudo cargar la solicitud')
    }
  })
}

/**
 * Hook para ejecutar solicitudes con seguimiento en tiempo real
 */
export function useSolicitudExecution(id) {
  const [executionState, setExecutionState] = useState({
    isExecuting: false,
    progress: 0,
    currentStep: '',
    logs: [],
    error: null
  })

  const executeWithTracking = useCallback(async () => {
    setExecutionState({
      isExecuting: true,
      progress: 0,
      currentStep: 'Iniciando...',
      logs: [],
      error: null
    })

    try {
      const result = await solicitudesService.executeSolicitud(id, {
        onProgress: (progress, step) => {
          setExecutionState(prev => ({
            ...prev,
            progress,
            currentStep: step
          }))
        },
        onLog: (log) => {
          setExecutionState(prev => ({
            ...prev,
            logs: [...prev.logs, log]
          }))
        }
      })

      setExecutionState(prev => ({
        ...prev,
        isExecuting: false,
        progress: 100,
        currentStep: 'Completado'
      }))

      return result
    } catch (error) {
      setExecutionState(prev => ({
        ...prev,
        isExecuting: false,
        error: error.message || 'Error en la ejecución'
      }))
      throw error
    }
  }, [id])

  const resetExecution = useCallback(() => {
    setExecutionState({
      isExecuting: false,
      progress: 0,
      currentStep: '',
      logs: [],
      error: null
    })
  }, [])

  return {
    ...executionState,
    executeWithTracking,
    resetExecution
  }
}

/**
 * Hook para búsqueda optimizada con debounce
 */
export function useSolicitudesSearch(initialFilters = {}) {
  const [searchState, setSearchState] = useState({
    searchTerm: '',
    filters: initialFilters,
    isSearching: false,
    results: [],
    totalResults: 0
  })

  const searchTimeoutRef = useRef()

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

    // Debounce la búsqueda
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await solicitudesService.searchSolicitudes({
          searchTerm: term,
          ...filters
        })

        setSearchState(prev => ({
          ...prev,
          isSearching: false,
          results: results.data || [],
          totalResults: results.total || 0
        }))
      } catch (error) {
        console.error('Error en búsqueda:', error)
        setSearchState(prev => ({
          ...prev,
          isSearching: false,
          results: [],
          totalResults: 0
        }))
      }
    }, 300)
  }, [])

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

// Hook de compatibilidad (mantener la función original)
export const useDeleteSolicitud = (solicitudId) => {
  const { deleteSolicitud } = useSolicitudes()
  return useCallback(() => deleteSolicitud(solicitudId), [deleteSolicitud, solicitudId])
}

export default useSolicitudes
