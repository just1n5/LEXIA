import { useState, useCallback } from 'react'
import { useToast } from '../../ui/Toast'

/**
 * useOptimisticUpdates - Hook para actualizaciones optimistas
 * Actualiza la UI inmediatamente y revierte en caso de error
 */
export const useOptimisticUpdates = () => {
  const [pendingUpdates, setPendingUpdates] = useState(new Map())
  const { toast } = useToast()

  const executeOptimistic = useCallback(async ({
    key,
    optimisticUpdate,
    asyncOperation,
    onSuccess,
    onError,
    successMessage,
    errorMessage
  }) => {
    // Marcar como pendiente
    setPendingUpdates(prev => new Map(prev.set(key, true)))
    
    // Aplicar actualización optimista
    const rollback = optimisticUpdate()
    
    try {
      // Ejecutar operación asíncrona
      const result = await asyncOperation()
      
      // Operación exitosa
      onSuccess?.(result)
      
      if (successMessage) {
        toast.success('Actualización exitosa', successMessage)
      }
      
      return result
    } catch (error) {
      // Revertir cambios optimistas
      rollback?.()
      
      // Manejar error
      onError?.(error)
      
      if (errorMessage) {
        toast.error('Error en actualización', errorMessage)
      }
      
      throw error
    } finally {
      // Limpiar estado pendiente
      setPendingUpdates(prev => {
        const newMap = new Map(prev)
        newMap.delete(key)
        return newMap
      })
    }
  }, [toast])

  const isPending = useCallback((key) => {
    return pendingUpdates.has(key)
  }, [pendingUpdates])

  return {
    executeOptimistic,
    isPending,
    pendingCount: pendingUpdates.size
  }
}

/**
 * Hook específico para solicitudes con operaciones comunes
 */
export const useSolicitudOptimistic = (solicitud, setSolicitud) => {
  const { executeOptimistic, isPending } = useOptimisticUpdates()

  const toggleStatus = useCallback(async (newStatus) => {
    return executeOptimistic({
      key: 'status',
      optimisticUpdate: () => {
        const originalStatus = solicitud.activa
        const originalEstado = solicitud.estado
        
        // Actualización optimista
        setSolicitud(prev => ({
          ...prev,
          activa: newStatus === 'activa',
          estado: newStatus,
          updated_at: new Date().toISOString()
        }))
        
        // Función de rollback
        return () => {
          setSolicitud(prev => ({
            ...prev,
            activa: originalStatus,
            estado: originalEstado
          }))
        }
      },
      asyncOperation: async () => {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Simular posible error (5% probabilidad)
        if (Math.random() < 0.05) {
          throw new Error('Error del servidor')
        }
        
        return { success: true, newStatus }
      },
      successMessage: `Solicitud ${newStatus === 'activa' ? 'activada' : 'pausada'} correctamente`,
      errorMessage: 'No se pudo cambiar el estado de la solicitud'
    })
  }, [solicitud, setSolicitud, executeOptimistic])

  const updateField = useCallback(async (field, value) => {
    return executeOptimistic({
      key: `field_${field}`,
      optimisticUpdate: () => {
        const originalValue = solicitud[field]
        
        // Actualización optimista
        setSolicitud(prev => ({
          ...prev,
          [field]: value,
          updated_at: new Date().toISOString()
        }))
        
        // Función de rollback
        return () => {
          setSolicitud(prev => ({
            ...prev,
            [field]: originalValue
          }))
        }
      },
      asyncOperation: async () => {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        if (Math.random() < 0.1) {
          throw new Error('Error de validación')
        }
        
        return { success: true, field, value }
      },
      successMessage: 'Campo actualizado correctamente',
      errorMessage: 'No se pudo actualizar el campo'
    })
  }, [solicitud, setSolicitud, executeOptimistic])

  return {
    toggleStatus,
    updateField,
    isPending,
    isStatusPending: isPending('status')
  }
}

export default useOptimisticUpdates