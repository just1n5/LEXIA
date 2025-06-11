import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { solicitudesService } from '../services/solicitudes'
import { useToast } from '../components/ui/Toast'

/**
 * 🚀 Hook OPTIMIZADO para gestión de solicitudes
 * 
 * ✅ ARREGLADO: useMemo para prevenir re-renders masivos
 * ✅ ARREGLADO: useCallback para funciones estables
 * ✅ ARREGLADO: dependencias optimizadas
 */
export function useSolicitudesOptimized(options = {}) {
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

  // Query principal para obtener solicitudes
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
    gcTime: cacheTime,
    retry: retryCount,
    refetchInterval: enableRealTime ? pollingInterval : false,
    placeholderData: [],
    meta: {
      errorMessage: 'No se pudieron cargar las solicitudes'
    }
  })

  // ✅ Error handling sin dependencia toast inestable
  useEffect(() => {
    if (isError && error) {
      console.error('❌ Error en query solicitudes:', error)
      toast?.error('Error', 'No se pudieron cargar las solicitudes')
    }
  }, [isError, error])

  // 🔧 CLAVE: useCallback para funciones estables
  const invalidateCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
  }, [queryClient])

  const refreshSolicitudes = useCallback(() => {
    return refetch()
  }, [refetch])

  // 🎯 CLAVE: useMemo para objeto retornado estable
  return useMemo(() => ({
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
    
    // Funciones de utilidad - ESTABLES
    refreshSolicitudes,
    invalidateCache
  }), [
    solicitudes,
    isLoading,
    isFetching,
    isRefetching,
    isError,
    error,
    refetch,
    refreshSolicitudes,
    invalidateCache
  ]) // ← 🎯 Solo cambia cuando algo realmente cambia
}

/**
 * 🚀 Hook OPTIMIZADO para crear solicitud
 * 
 * ✅ ARREGLADO: Objeto retornado estable con useMemo
 */
export function useCreateSolicitudOptimized() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createMutation = useMutation({
    mutationFn: async (solicitudData) => {
      return await solicitudesService.createSolicitud(solicitudData)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] })
      toast?.success('Solicitud creada', 'La solicitud se ha creado exitosamente')
    },
    onError: (error) => {
      console.error('Error creando solicitud:', error)
      toast?.error('Error', 'No se pudo crear la solicitud')
    }
  })

  // 🎯 CLAVE: Funciones estables con useCallback
  const createSolicitud = useCallback((data) => {
    createMutation.mutate(data)
  }, [createMutation.mutate])

  // 🎯 CLAVE: Objeto retornado estable con useMemo
  return useMemo(() => ({
    createSolicitud,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    createSuccess: createMutation.isSuccess,
    loading: createMutation.isPending // ← Alias para compatibilidad
  }), [
    createSolicitud,
    createMutation.isPending,
    createMutation.error,
    createMutation.isSuccess
  ])
}

/**
 * 🔧 Hook combinado OPTIMIZADO para uso simple
 * 
 * Combina ambos hooks en uno solo con objeto estable
 */
export function useSolicitudes(options = {}) {
  const solicitudesData = useSolicitudesOptimized(options)
  const createData = useCreateSolicitudOptimized()

  // 🎯 CLAVE: Combinar ambos hooks en un objeto estable
  return useMemo(() => ({
    ...solicitudesData,
    ...createData
  }), [solicitudesData, createData])
}

export default useSolicitudes