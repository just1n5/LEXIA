import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Hook avanzado para validación con estado, cache y validación asíncrona
 */
export function useValidation(rules = {}, options = {}) {
  const {
    mode = 'onChange', // 'onChange', 'onBlur', 'onSubmit', 'all'
    reValidateMode = 'onChange',
    shouldFocusError = true,
    delayError = 0,
    resolver, // función de validación personalizada
  } = options

  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState(true)
  const [isValidating, setIsValidating] = useState(false)
  const [touchedFields, setTouchedFields] = useState(new Set())
  
  const validationCache = useRef({})
  const validationPromises = useRef({})
  const timeouts = useRef({})

  // Actualizar estado de validez general
  useEffect(() => {
    const hasErrors = Object.values(errors).some(error => error != null && error !== '')
    setIsValid(!hasErrors)
  }, [errors])

  // Función principal de validación
  const validateField = useCallback(async (name, value, allValues = {}) => {
    const fieldRules = rules[name]
    if (!fieldRules) return null

    // Cache key para evitar validaciones duplicadas
    const cacheKey = `${name}:${JSON.stringify(value)}`
    if (validationCache.current[cacheKey] !== undefined) {
      return validationCache.current[cacheKey]
    }

    // Cancelar validación anterior si existe
    if (validationPromises.current[name]) {
      validationPromises.current[name].cancel = true
    }

    const validationPromise = { cancel: false }
    validationPromises.current[name] = validationPromise

    try {
      setIsValidating(true)
      let error = null

      // Usar resolver personalizado si existe
      if (resolver) {
        const resolverResult = await resolver({ [name]: value }, allValues)
        if (resolverResult.errors && resolverResult.errors[name]) {
          error = resolverResult.errors[name].message || resolverResult.errors[name]
        }
        validationCache.current[cacheKey] = error
        return error
      }

      // Validación de requerido
      if (fieldRules.required) {
        if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
          error = fieldRules.requiredMessage || 'Este campo es obligatorio'
        }
      }

      // Si ya hay error de requerido, no continuar
      if (error) {
        validationCache.current[cacheKey] = error
        return error
      }

      // Validación de tipo
      if (fieldRules.type && value != null && value !== '') {
        switch (fieldRules.type) {
          case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              error = fieldRules.typeMessage || 'Debe ser un email válido'
            }
            break
          case 'number':
            if (isNaN(Number(value))) {
              error = fieldRules.typeMessage || 'Debe ser un número válido'
            }
            break
          case 'url':
            try {
              new URL(value)
            } catch {
              error = fieldRules.typeMessage || 'Debe ser una URL válida'
            }
            break
          case 'date':
            if (isNaN(Date.parse(value))) {
              error = fieldRules.typeMessage || 'Debe ser una fecha válida'
            }
            break
          case 'phone':
            if (!/^[\d\s\-\+\(\)]{7,15}$/.test(value)) {
              error = fieldRules.typeMessage || 'Formato de teléfono inválido'
            }
            break
          case 'cedula':
            if (!/^\d{6,12}$/.test(value)) {
              error = fieldRules.typeMessage || 'Debe contener entre 6 y 12 dígitos'
            }
            break
          case 'radicado':
            if (!/^\d{5,23}$/.test(value)) {
              error = fieldRules.typeMessage || 'Debe contener entre 5 y 23 dígitos'
            }
            break
        }
      }

      if (error) {
        validationCache.current[cacheKey] = error
        return error
      }

      // Validación de longitud
      if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
        error = fieldRules.minLengthMessage || `Mínimo ${fieldRules.minLength} caracteres`
      }

      if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
        error = fieldRules.maxLengthMessage || `Máximo ${fieldRules.maxLength} caracteres`
      }

      if (error) {
        validationCache.current[cacheKey] = error
        return error
      }

      // Validación de rango numérico
      if (fieldRules.min != null && Number(value) < fieldRules.min) {
        error = fieldRules.minMessage || `El valor mínimo es ${fieldRules.min}`
      }

      if (fieldRules.max != null && Number(value) > fieldRules.max) {
        error = fieldRules.maxMessage || `El valor máximo es ${fieldRules.max}`
      }

      if (error) {
        validationCache.current[cacheKey] = error
        return error
      }

      // Validación con patrón regex
      if (fieldRules.pattern && value) {
        const regex = typeof fieldRules.pattern === 'string' 
          ? new RegExp(fieldRules.pattern) 
          : fieldRules.pattern
        
        if (!regex.test(value)) {
          error = fieldRules.patternMessage || 'Formato inválido'
        }
      }

      if (error) {
        validationCache.current[cacheKey] = error
        return error
      }

      // Validación personalizada síncrona
      if (fieldRules.validate && typeof fieldRules.validate === 'function') {
        const customResult = fieldRules.validate(value, allValues)
        if (customResult !== true) {
          error = typeof customResult === 'string' ? customResult : 'Valor inválido'
        }
      }

      if (error) {
        validationCache.current[cacheKey] = error
        return error
      }

      // Validación asíncrona
      if (fieldRules.asyncValidate && typeof fieldRules.asyncValidate === 'function') {
        const asyncResult = await fieldRules.asyncValidate(value, allValues)
        
        // Verificar si la validación fue cancelada
        if (validationPromise.cancel) {
          return null
        }
        
        if (asyncResult !== true) {
          error = typeof asyncResult === 'string' ? asyncResult : 'Valor inválido'
        }
      }

      validationCache.current[cacheKey] = error
      return error

    } catch (err) {
      if (!validationPromise.cancel) {
        console.error('Error en validación:', err)
        const error = 'Error en validación'
        validationCache.current[cacheKey] = error
        return error
      }
      return null
    } finally {
      if (!validationPromise.cancel) {
        setIsValidating(false)
      }
    }
  }, [rules, resolver])

  // Validar múltiples campos
  const validateFields = useCallback(async (fields, allValues = {}) => {
    setIsValidating(true)
    
    try {
      const validationPromises = Object.entries(fields).map(async ([name, value]) => {
        const error = await validateField(name, value, allValues)
        return { name, error }
      })

      const results = await Promise.all(validationPromises)
      const newErrors = {}
      
      results.forEach(({ name, error }) => {
        newErrors[name] = error
      })

      return newErrors
    } finally {
      setIsValidating(false)
    }
  }, [validateField])

  // Establecer error con delay opcional
  const setFieldError = useCallback((name, error, delay = delayError) => {
    if (timeouts.current[name]) {
      clearTimeout(timeouts.current[name])
    }

    if (delay > 0) {
      timeouts.current[name] = setTimeout(() => {
        setErrors(prev => ({
          ...prev,
          [name]: error
        }))
      }, delay)
    } else {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }, [delayError])

  // Validar y establecer error
  const validateAndSetError = useCallback(async (name, value, allValues = {}) => {
    const error = await validateField(name, value, allValues)
    setFieldError(name, error)
    return error
  }, [validateField, setFieldError])

  // Limpiar errores
  const clearErrors = useCallback((fieldNames = null) => {
    if (fieldNames === null) {
      setErrors({})
      validationCache.current = {}
    } else {
      const names = Array.isArray(fieldNames) ? fieldNames : [fieldNames]
      setErrors(prev => {
        const newErrors = { ...prev }
        names.forEach(name => {
          delete newErrors[name]
          // Limpiar cache también
          Object.keys(validationCache.current).forEach(key => {
            if (key.startsWith(`${name}:`)) {
              delete validationCache.current[key]
            }
          })
        })
        return newErrors
      })
    }
  }, [])

  // Marcar campos como tocados
  const setTouched = useCallback((fieldNames) => {
    const names = Array.isArray(fieldNames) ? fieldNames : [fieldNames]
    setTouchedFields(prev => {
      const newSet = new Set(prev)
      names.forEach(name => newSet.add(name))
      return newSet
    })
  }, [])

  // Limpiar campos tocados
  const clearTouched = useCallback((fieldNames = null) => {
    if (fieldNames === null) {
      setTouchedFields(new Set())
    } else {
      const names = Array.isArray(fieldNames) ? fieldNames : [fieldNames]
      setTouchedFields(prev => {
        const newSet = new Set(prev)
        names.forEach(name => newSet.delete(name))
        return newSet
      })
    }
  }, [])

  // Reset completo
  const reset = useCallback(() => {
    setErrors({})
    setIsValid(true)
    setIsValidating(false)
    setTouchedFields(new Set())
    validationCache.current = {}
    
    // Cancelar validaciones pendientes
    Object.values(validationPromises.current).forEach(promise => {
      if (promise) promise.cancel = true
    })
    validationPromises.current = {}
    
    // Limpiar timeouts
    Object.values(timeouts.current).forEach(timeout => {
      if (timeout) clearTimeout(timeout)
    })
    timeouts.current = {}
  }, [])

  // Helper para obtener estado de un campo
  const getFieldState = useCallback((name) => {
    return {
      error: errors[name] || null,
      hasError: !!(errors[name]),
      isTouched: touchedFields.has(name),
      isValidating: !!validationPromises.current[name] && !validationPromises.current[name].cancel
    }
  }, [errors, touchedFields])

  // Helper para obtener props de campo
  const getFieldProps = useCallback((name, options = {}) => {
    const { 
      validateOn = mode,
      reValidateOn = reValidateMode,
      onValidate,
    } = options

    const fieldState = getFieldState(name)

    return {
      name,
      error: fieldState.error,
      hasError: fieldState.hasError,
      isTouched: fieldState.isTouched,
      isValidating: fieldState.isValidating,
      'aria-invalid': fieldState.hasError,
      'aria-describedby': fieldState.hasError ? `${name}-error` : undefined,
      
      onBlur: async (e) => {
        const value = e.target ? e.target.value : e
        setTouched(name)
        
        if (validateOn === 'onBlur' || validateOn === 'all' || 
           (fieldState.isTouched && reValidateOn === 'onBlur')) {
          const error = await validateAndSetError(name, value)
          if (onValidate) onValidate(name, value, error)
        }
      },
      
      onChange: async (e) => {
        const value = e.target ? e.target.value : e
        
        if (validateOn === 'onChange' || validateOn === 'all' ||
           (fieldState.isTouched && reValidateOn === 'onChange')) {
          const error = await validateAndSetError(name, value)
          if (onValidate) onValidate(name, value, error)
        }
      }
    }
  }, [mode, reValidateMode, getFieldState, validateAndSetError, setTouched])

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      Object.values(timeouts.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout)
      })
      
      Object.values(validationPromises.current).forEach(promise => {
        if (promise) promise.cancel = true
      })
    }
  }, [])

  return {
    // Estados
    errors,
    isValid,
    isValidating,
    touchedFields: Array.from(touchedFields),
    hasErrors: Object.keys(errors).length > 0,
    
    // Funciones de validación
    validateField,
    validateFields,
    validateAndSetError,
    
    // Funciones de manejo de errores
    setFieldError,
    clearErrors,
    
    // Funciones de campos tocados
    setTouched,
    clearTouched,
    
    // Utilidades
    reset,
    getFieldState,
    getFieldProps,
    
    // Helpers
    isFieldValid: (name) => !errors[name],
    isFieldTouched: (name) => touchedFields.has(name),
    getFieldError: (name) => errors[name] || null,
  }
}

// Validadores predefinidos comunes
export const validationRules = {
  required: {
    required: true,
    requiredMessage: 'Este campo es obligatorio'
  },
  
  email: {
    required: true,
    type: 'email',
    requiredMessage: 'El email es obligatorio',
    typeMessage: 'Ingresa un email válido'
  },
  
  password: {
    required: true,
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)',
    requiredMessage: 'La contraseña es obligatoria',
    minLengthMessage: 'La contraseña debe tener al menos 8 caracteres',
    patternMessage: 'Debe contener al menos una mayúscula, una minúscula y un número'
  },
  
  radicado: {
    required: true,
    type: 'radicado',
    requiredMessage: 'El número de radicado es obligatorio',
    typeMessage: 'Debe contener entre 5 y 23 dígitos'
  },
  
  cedula: {
    required: true,
    type: 'cedula',
    requiredMessage: 'La cédula es obligatoria',
    typeMessage: 'Debe contener entre 6 y 12 dígitos'
  },
  
  telefono: {
    type: 'phone',
    typeMessage: 'Formato de teléfono inválido'
  },
  
  nombre: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$',
    requiredMessage: 'El nombre es obligatorio',
    minLengthMessage: 'El nombre debe tener al menos 2 caracteres',
    maxLengthMessage: 'El nombre no puede exceder 50 caracteres',
    patternMessage: 'Solo se permiten letras y espacios'
  }
}

export default useValidation
