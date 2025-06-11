import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * 🚀 useOptimizedValidation - Hook de validación con performance optimizada
 * 
 * Reemplaza el sistema actual de validaciones que usa timers individuales
 * por uno mucho más eficiente con:
 * - ✅ Debounce global inteligente (300ms vs 1000ms)
 * - ✅ Validación batch para múltiples campos
 * - ✅ Cleanup automático de timers
 * - ✅ Validación condicional solo cuando es necesario
 * - ✅ Memory leak prevention
 */
const useOptimizedValidation = (initialValidations = {}) => {
  const [validations, setValidations] = useState(initialValidations)
  const [isFormValid, setIsFormValid] = useState(false)
  
  // Timer global para debounce (uno solo en lugar de múltiples)
  const validationTimer = useRef(null)
  
  // Queue de validaciones pendientes
  const pendingValidations = useRef({})

  // ✅ OPTIMIZACIÓN: Función de validación rápida y eficiente
  const validateField = useCallback((value, fieldType) => {
    // Si no hay valor, es válido (campos opcionales)
    if (!value || value.trim() === '') {
      return { isValid: true, message: '', strength: null }
    }
    
    switch (fieldType) {
      case 'numeroRadicado':
        return validateNumeroRadicado(value)
      
      case 'numeroRadicacion':
        return validateNumeroRadicacion(value)
      
      case 'nombrePersona':
        return validateNombrePersona(value)
      
      case 'email':
        return validateEmail(value)
      
      default:
        return { isValid: true, message: '', strength: null }
    }
  }, [])

  // ✅ OPTIMIZACIÓN: Validaciones específicas optimizadas
  const validateNumeroRadicado = useCallback((value) => {
    const isNumeric = /^\d+$/.test(value)
    const length = value.length
    
    if (!isNumeric) {
      return {
        isValid: false,
        message: 'Solo debe contener números',
        strength: 'error'
      }
    }
    
    if (length < 11) {
      return {
        isValid: false,
        message: `Muy corto (${length}/11-23 dígitos)`,
        strength: 'weak'
      }
    }
    
    if (length > 23) {
      return {
        isValid: false,
        message: `Muy largo (${length}/23 dígitos máximo)`,
        strength: 'error'
      }
    }
    
    // Análisis de estructura del radicado
    let strength = 'good'
    let message = 'Formato válido'
    
    if (length >= 20) {
      strength = 'excellent'
      message = 'Radicado completo - búsqueda muy precisa'
    } else if (length >= 15) {
      strength = 'good'
      message = 'Radicado válido - búsqueda precisa'
    }
    
    return {
      isValid: true,
      message,
      strength
    }
  }, [])

  const validateNumeroRadicacion = useCallback((value) => {
    const length = value.length
    
    if (length < 4) {
      return {
        isValid: false,
        message: 'Muy corto (mínimo 4 caracteres)',
        strength: 'weak'
      }
    }
    
    if (length > 20) {
      return {
        isValid: false,
        message: 'Muy largo (máximo 20 caracteres)',
        strength: 'error'
      }
    }
    
    return {
      isValid: true,
      message: 'Formato válido',
      strength: 'good'
    }
  }, [])

  const validateNombrePersona = useCallback((value) => {
    const length = value.length
    const hasValidChars = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)
    
    if (!hasValidChars) {
      return {
        isValid: false,
        message: 'Solo letras y espacios permitidos',
        strength: 'error'
      }
    }
    
    if (length < 2) {
      return {
        isValid: false,
        message: 'Muy corto (mínimo 2 caracteres)',
        strength: 'weak'
      }
    }
    
    if (length > 100) {
      return {
        isValid: false,
        message: 'Muy largo (máximo 100 caracteres)',
        strength: 'error'
      }
    }
    
    // Análisis de calidad del nombre
    const words = value.trim().split(/\s+/)
    let strength = 'good'
    let message = 'Nombre válido'
    
    if (words.length >= 2) {
      strength = 'excellent'
      message = 'Nombre completo - búsqueda más precisa'
    }
    
    return {
      isValid: true,
      message,
      strength
    }
  }, [])

  const validateEmail = useCallback((value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!emailRegex.test(value)) {
      return {
        isValid: false,
        message: 'Formato de email inválido',
        strength: 'error'
      }
    }
    
    return {
      isValid: true,
      message: 'Email válido',
      strength: 'good'
    }
  }, [])

  // ✅ OPTIMIZACIÓN: Función de validación con debounce inteligente
  const validateFieldWithDelay = useCallback((fieldName, value, fieldType) => {
    // Agregar a la queue de validaciones pendientes
    pendingValidations.current[fieldName] = { value, fieldType }
    
    // Limpiar timer anterior
    if (validationTimer.current) {
      clearTimeout(validationTimer.current)
    }
    
    // Crear nuevo timer con debounce optimizado (300ms vs 1000ms anterior)
    validationTimer.current = setTimeout(() => {
      // Procesar todas las validaciones pendientes en batch
      const updates = {}
      
      Object.entries(pendingValidations.current).forEach(([field, { value, fieldType }]) => {
        updates[field] = validateField(value, fieldType)
      })
      
      // Actualizar todas las validaciones de una vez (evita múltiples re-renders)
      setValidations(prev => ({ ...prev, ...updates }))
      
      // Limpiar queue
      pendingValidations.current = {}
      
    }, 300) // ⚡ 300ms vs 1000ms anterior = 70% más rápido
  }, [validateField])

  // ✅ OPTIMIZACIÓN: Validación inmediata (sin debounce) para casos específicos
  const validateFieldImmediate = useCallback((fieldName, value, fieldType) => {
    const result = validateField(value, fieldType)
    setValidations(prev => ({ ...prev, [fieldName]: result }))
    return result
  }, [validateField])

  // ✅ OPTIMIZACIÓN: Calcular validez del formulario de forma eficiente
  useEffect(() => {
    const hasErrors = Object.values(validations).some(v => v && !v.isValid)
    setIsFormValid(prev => {
      const newValue = !hasErrors
      return prev !== newValue ? newValue : prev
    })
  }, [validations])

  // ✅ OPTIMIZACIÓN: Cleanup automático de timers
  useEffect(() => {
    return () => {
      if (validationTimer.current) {
        clearTimeout(validationTimer.current)
      }
    }
  }, [])

  // ✅ Helper: Verificar si un campo específico es válido
  const isFieldValid = useCallback((fieldName) => {
    const validation = validations[fieldName]
    return !validation || validation.isValid
  }, [validations])

  // ✅ Helper: Obtener mensaje de error de un campo
  const getFieldError = useCallback((fieldName) => {
    const validation = validations[fieldName]
    return validation && !validation.isValid ? validation.message : null
  }, [validations])

  // ✅ Helper: Obtener fortaleza de un campo (para progress bars)
  const getFieldStrength = useCallback((fieldName) => {
    const validation = validations[fieldName]
    return validation?.strength || null
  }, [validations])

  // ✅ Helper: Reset de validaciones
  const resetValidations = useCallback(() => {
    setValidations({})
    setIsFormValid(false)
    pendingValidations.current = {}
    if (validationTimer.current) {
      clearTimeout(validationTimer.current)
    }
  }, [])

  // ✅ Helper: Validar todo el formulario de una vez
  const validateAllFields = useCallback((formData, fieldTypes) => {
    const newValidations = {}
    
    Object.entries(formData).forEach(([fieldName, value]) => {
      const fieldType = fieldTypes[fieldName]
      if (fieldType) {
        newValidations[fieldName] = validateField(value, fieldType)
      }
    })
    
    setValidations(newValidations)
    
    const hasErrors = Object.values(newValidations).some(v => v && !v.isValid)
    setIsFormValid(!hasErrors)
    
    return newValidations
  }, [validateField])

  return {
    // Estados
    validations,
    isFormValid,
    
    // Funciones principales
    validateFieldWithDelay,
    validateFieldImmediate,
    validateAllFields,
    
    // Helpers
    isFieldValid,
    getFieldError,
    getFieldStrength,
    resetValidations
  }
}

export default useOptimizedValidation