import { useState, useCallback, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { solicitudesService } from '../services/solicitudes'
import { useToast } from '../components/ui/Toast'

/**
 * Hook especializado para gestión completa de solicitudes
 * ✅ ACTUALIZADO: Migrado a @tanstack/react-query v5
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

  // Query principal para obtener solicitudes con API v5
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
    gcTime: cacheTime, // ✅ v5: gcTime reemplaza cacheTime
    retry: retryCount,
    refetchInterval: enableRealTime ? pollingInterval : false,
    placeholderData: [], // ✅ v5: placeholderData para datos iniciales
    meta: {
      errorMessage: 'No se pudieron cargar las solicitudes'
    }
  })

  // ✅ Error handling mejorado para v5 - SIN dependencia toast inestable
  useEffect(() => {
    if (isError && error) {
      console.error('❌ Error en query solicitudes:', error)
      // Usar toast sin incluirlo en dependencias para evitar re-renders
      toast?.error('Error', 'No se pudieron cargar las solicitudes')
    }
  }, [isError, error]) // ← 🔧 ARREGLADO: Removida dependencia toast

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
    
    // Invalidar cache manualmente con API v5
    invalidateCache: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
    }
  }
}

/**
 * Hook específico para obtener una solicitud individual
 * ✅ ACTUALIZADO: Migrado a @tanstack/react-query v5
 */
export function useSolicitud(id, options = {}) {
  const { enabled = true } = options
  const { toast } = useToast()

  const query = useQuery({
    queryKey: ['solicitud', id],
    queryFn: async () => {
      if (!id) throw new Error('ID de solicitud requerido')
      return await solicitudesService.getSolicitudById(id)
    },
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutos
    meta: {
      errorMessage: 'No se pudo cargar la solicitud'
    }
  })

  // ✅ Error handling mejorado para v5 - SIN dependencia toast inestable
  useEffect(() => {
    if (query.isError && query.error) {
      console.error('Error cargando solicitud:', query.error)
      // Usar toast sin incluirlo en dependencias para evitar re-renders
      toast?.error('Error', 'No se pudo cargar la solicitud')
    }
  }, [query.isError, query.error]) // ← 🔧 ARREGLADO: Removida dependencia toast

  return query
}

/**
 * Hook para crear solicitud
 * ✅ ACTUALIZADO: Migrado a @tanstack/react-query v5
 */
export function useCreateSolicitud() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createMutation = useMutation({
    mutationFn: async (solicitudData) => {
      return await solicitudesService.createSolicitud(solicitudData)
    },
    onSuccess: (data) => {
      // Invalidar y refetch la lista de solicitudes
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
      toast?.success('Solicitud creada', 'La solicitud se ha creado exitosamente')
    },
    onError: (error) => {
      console.error('Error creando solicitud:', error)
      toast?.error('Error', 'No se pudo crear la solicitud')
    }
  })

  return {
    createSolicitud: createMutation.mutate,
    isCreating: createMutation.isPending, // ✅ v5: isPending reemplaza isLoading
    createError: createMutation.error,
    createSuccess: createMutation.isSuccess
  }
}

/**
 * Hook para actualizar solicitud
 * ✅ ACTUALIZADO: Migrado a @tanstack/react-query v5
 */
export function useUpdateSolicitud() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await solicitudesService.updateSolicitud(id, data)
    },
    onSuccess: (data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
      queryClient.invalidateQueries({ queryKey: ['solicitud', variables.id] })
      toast?.success('Solicitud actualizada', 'Los cambios se han guardado')
    },
    onError: (error) => {
      console.error('Error actualizando solicitud:', error)
      toast?.error('Error', 'No se pudieron guardar los cambios')
    }
  })

  return {
    updateSolicitud: updateMutation.mutate,
    isUpdating: updateMutation.isPending, // ✅ v5: isPending reemplaza isLoading
    updateError: updateMutation.error
  }
}

/**
 * Hook para eliminar solicitud
 * ✅ ACTUALIZADO: Migrado a @tanstack/react-query v5
 */
export function useDeleteSolicitudMutation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const deleteMutation = useMutation({
    mutationFn: async (solicitudId) => {
      return await solicitudesService.deleteSolicitud(solicitudId)
    },
    onSuccess: () => {
      // Invalidar la lista de solicitudes
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
      toast?.success('Solicitud eliminada', 'La solicitud se ha eliminado exitosamente')
    },
    onError: (error) => {
      console.error('Error eliminando solicitud:', error)
      toast?.error('Error', 'No se pudo eliminar la solicitud')
    }
  })

  return {
    deleteSolicitud: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending, // ✅ v5: isPending reemplaza isLoading
    deleteError: deleteMutation.error
  }
}

/**
 * Hook para ejecutar solicitudes con seguimiento en tiempo real
 * ✅ Sin cambios específicos de React Query - mantiene funcionalidad
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
 * ✅ Sin cambios específicos de React Query - mantiene funcionalidad
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
        // Usar toast sin incluirlo en dependencias para evitar re-renders
        toast?.error('Error', 'Error en la búsqueda')
      }
    }, 300)
  }, []) // ← 🔧 ARREGLADO: Removida dependencia toast

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
 * Hook para obtener estadísticas de solicitudes
 * ✅ ACTUALIZADO: Migrado a @tanstack/react-query v5
 */
export function useSolicitudesStats() {
  const { toast } = useToast()

  const query = useQuery({
    queryKey: ['solicitudes-stats'],
    queryFn: async () => {
      return await solicitudesService.getStats()
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // ✅ v5: gcTime reemplaza cacheTime
    meta: {
      errorMessage: 'No se pudieron cargar las estadísticas'
    }
  })

  // ✅ Error handling mejorado para v5 - SIN dependencia toast inestable
  useEffect(() => {
    if (query.isError && query.error) {
      console.error('Error cargando estadísticas:', query.error)
      // Usar toast sin incluirlo en dependencias para evitar re-renders
      toast?.error('Error', 'No se pudieron cargar las estadísticas')
    }
  }, [query.isError, query.error]) // ← 🔧 ARREGLADO: Removida dependencia toast

  return query
}

// Hook de compatibilidad (mantener la función original)
export const useDeleteSolicitud = (solicitudId) => {
  const { deleteSolicitud } = useDeleteSolicitudMutation()
  return useCallback(() => deleteSolicitud(solicitudId), [deleteSolicitud, solicitudId])
}

export default useSolicitudes