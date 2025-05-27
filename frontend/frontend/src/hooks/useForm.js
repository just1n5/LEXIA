import { useState, useCallback, useEffect, useRef } from 'react'
import { useToast } from '../components/ui/Toast'

/**
 * Hook avanzado para manejo de formularios con validación, estados y optimizaciones
 */
export function useForm(initialValues = {}, options = {}) {
  const {
    validation = {},
    onSubmit,
    enableReinitialize = false,
    validateOnChange = true,
    validateOnBlur = true,
    validateOnMount = false,
  } = options

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [submitCount, setSubmitCount] = useState(0)
  
  const { toast } = useToast()
  const initialValuesRef = useRef(initialValues)
  const validationTimeouts = useRef({})

  // Reinicializar si enableReinitialize está activo y cambian los valores iniciales
  useEffect(() => {
    if (enableReinitialize && initialValues !== initialValuesRef.current) {
      setValues(initialValues)
      setErrors({})
      setTouched({})
      initialValuesRef.current = initialValues
    }
  }, [initialValues, enableReinitialize])

  // Validar en mount si está habilitado
  useEffect(() => {
    if (validateOnMount) {
      validateForm()
    }
  }, [])

  // Función de validación con debounce
  const validateField = useCallback(async (name, value, shouldSetError = true) => {
    const fieldValidation = validation[name]
    if (!fieldValidation) return true

    // Cancelar validación pendiente
    if (validationTimeouts.current[name]) {
      clearTimeout(validationTimeouts.current[name])
    }

    return new Promise((resolve) => {
      validationTimeouts.current[name] = setTimeout(async () => {
        setIsValidating(true)
        
        try {
          let error = null

          // Validación requerido
          if (fieldValidation.required && (!value || String(value).trim() === '')) {
            error = fieldValidation.requiredMessage || 'Este campo es obligatorio'
          }

          // Validación de longitud mínima
          else if (fieldValidation.minLength && String(value).length < fieldValidation.minLength) {
            error = fieldValidation.minLengthMessage || `Mínimo ${fieldValidation.minLength} caracteres`
          }

          // Validación de longitud máxima
          else if (fieldValidation.maxLength && String(value).length > fieldValidation.maxLength) {
            error = fieldValidation.maxLengthMessage || `Máximo ${fieldValidation.maxLength} caracteres`
          }

          // Validación de patrón
          else if (fieldValidation.pattern && !new RegExp(fieldValidation.pattern).test(value)) {
            error = fieldValidation.patternMessage || 'Formato inválido'
          }

          // Validación personalizada
          else if (fieldValidation.validate && typeof fieldValidation.validate === 'function') {
            const customResult = await fieldValidation.validate(value, values)
            if (customResult !== true) {
              error = typeof customResult === 'string' ? customResult : 'Valor inválido'
            }
          }

          if (shouldSetError) {
            setErrors(prev => ({
              ...prev,
              [name]: error
            }))
          }

          resolve(!error)
        } catch (err) {
          const error = 'Error en validación'
          if (shouldSetError) {
            setErrors(prev => ({
              ...prev,
              [name]: error
            }))
          }
          resolve(false)
        } finally {
          setIsValidating(false)
        }
      }, 300) // Debounce de 300ms
    })
  }, [validation, values])

  // Validar todo el formulario
  const validateForm = useCallback(async () => {
    setIsValidating(true)
    const fieldNames = Object.keys(validation)
    const validationPromises = fieldNames.map(name => 
      validateField(name, values[name], true)
    )
    
    try {
      const results = await Promise.all(validationPromises)
      const isValid = results.every(result => result === true)
      return isValid
    } finally {
      setIsValidating(false)
    }
  }, [validation, values, validateField])

  // Manejar cambio de valor
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))

    // Validar en cambio si está habilitado
    if (validateOnChange && touched[name]) {
      validateField(name, value)
    }
  }, [validateOnChange, touched, validateField])

  // Manejar blur
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    // Validar en blur si está habilitado
    if (validateOnBlur) {
      validateField(name, values[name])
    }
  }, [validateOnBlur, values, validateField])

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault()
    }

    setSubmitCount(prev => prev + 1)
    setTouched(Object.keys(validation).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {}))

    try {
      setIsSubmitting(true)
      const isValid = await validateForm()

      if (!isValid) {
        toast.error('Error de validación', 'Corrige los errores en el formulario')
        return
      }

      if (onSubmit) {
        await onSubmit(values, { setErrors, setValues, reset })
      }
    } catch (error) {
      console.error('Error en envío del formulario:', error)
      toast.error('Error', error.message || 'Error al procesar el formulario')
    } finally {
      setIsSubmitting(false)
    }
  }, [validation, validateForm, onSubmit, values, toast])

  // Resetear formulario
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
    setIsValidating(false)
    setSubmitCount(0)
    
    // Limpiar timeouts pendientes
    Object.values(validationTimeouts.current).forEach(timeout => {
      if (timeout) clearTimeout(timeout)
    })
    validationTimeouts.current = {}
  }, [initialValues])

  // Establecer valores múltiples
  const setFieldValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }))
  }, [])

  // Establecer error específico
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }, [])

  // Helpers computados
  const isValid = Object.keys(errors).length === 0 && 
                  Object.values(errors).every(error => !error)
  
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues)
  
  const canSubmit = isValid && !isSubmitting && !isValidating

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      Object.values(validationTimeouts.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout)
      })
    }
  }, [])

  return {
    // Estados
    values,
    errors,
    touched,
    isSubmitting,
    isValidating,
    isValid,
    isDirty,
    canSubmit,
    submitCount,
    
    // Funciones
    handleChange,
    handleBlur,
    handleSubmit,
    validateField,
    validateForm,
    reset,
    setFieldValues,
    setFieldError,
    setValues,
    setErrors,
    
    // Helpers para campos individuales
    getFieldProps: (name) => ({
      value: values[name] || '',
      onChange: (e) => handleChange(name, e.target ? e.target.value : e),
      onBlur: () => handleBlur(name),
      error: errors[name],
      touched: touched[name],
      'aria-invalid': !!errors[name],
      'aria-describedby': errors[name] ? `${name}-error` : undefined
    }),
    
    // Helper para obtener estado de campo
    getFieldState: (name) => ({
      value: values[name],
      error: errors[name],
      touched: touched[name],
      hasError: !!errors[name],
      isTouched: !!touched[name]
    })
  }
}

/**
 * Hook simplificado para formularios básicos
 */
export function useSimpleForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues)
  const [loading, setLoading] = useState(false)

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    handleChange(name, type === 'checkbox' ? checked : value)
  }, [handleChange])

  const reset = useCallback(() => {
    setValues(initialValues)
    setLoading(false)
  }, [initialValues])

  const submit = useCallback(async (submitFn) => {
    if (!submitFn) return
    
    try {
      setLoading(true)
      await submitFn(values)
    } finally {
      setLoading(false)
    }
  }, [values])

  return {
    values,
    loading,
    handleChange,
    handleInputChange,
    reset,
    submit,
    setLoading,
    setValues
  }
}

export default useForm
