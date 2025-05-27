import React, { useState, useEffect } from 'react'
import { Check, X, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const validationIcons = {
  validating: Loader2,
  valid: Check,
  invalid: X,
  warning: AlertCircle,
}

const validationMessages = {
  required: 'Este campo es obligatorio',
  email: 'Ingresa un email válido',
  minLength: (min) => `Mínimo ${min} caracteres`,
  maxLength: (max) => `Máximo ${max} caracteres`,
  pattern: 'Formato inválido',
  custom: 'Valor inválido',
}

function RealTimeValidation({
  children,
  validation = {},
  value = '',
  onValidationChange,
  debounceMs = 300,
  showValidIcon = true,
  className = '',
  ...props
}) {
  const [validationState, setValidationState] = useState({
    status: 'idle', // idle, validating, valid, invalid, warning
    message: '',
    isValid: true
  })

  const [debouncedValue, setDebouncedValue] = useState(value)

  // Debounce del valor
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [value, debounceMs])

  // Ejecutar validación cuando cambie el valor debounced
  useEffect(() => {
    if (debouncedValue === '') {
      setValidationState({
        status: 'idle',
        message: '',
        isValid: !validation.required
      })
      return
    }

    validateValue(debouncedValue)
  }, [debouncedValue, validation])

  // Notificar cambios de validación al padre
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validationState)
    }
  }, [validationState, onValidationChange])

  const validateValue = async (val) => {
    if (!val && !validation.required) {
      setValidationState({
        status: 'idle',
        message: '',
        isValid: true
      })
      return
    }

    // Mostrar estado de validación
    setValidationState(prev => ({
      ...prev,
      status: 'validating'
    }))

    try {
      const result = await runValidation(val, validation)
      setValidationState(result)
    } catch (error) {
      setValidationState({
        status: 'invalid',
        message: 'Error en validación',
        isValid: false
      })
    }
  }

  const runValidation = async (value, rules) => {
    // Validación requerido
    if (rules.required && (!value || value.trim() === '')) {
      return {
        status: 'invalid',
        message: validationMessages.required,
        isValid: false
      }
    }

    // Validación de longitud mínima
    if (rules.minLength && value.length < rules.minLength) {
      return {
        status: 'invalid',
        message: validationMessages.minLength(rules.minLength),
        isValid: false
      }
    }

    // Validación de longitud máxima
    if (rules.maxLength && value.length > rules.maxLength) {
      return {
        status: 'invalid',
        message: validationMessages.maxLength(rules.maxLength),
        isValid: false
      }
    }

    // Validación de email
    if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return {
          status: 'invalid',
          message: validationMessages.email,
          isValid: false
        }
      }
    }

    // Validación de patrón
    if (rules.pattern) {
      const regex = new RegExp(rules.pattern)
      if (!regex.test(value)) {
        return {
          status: 'invalid',
          message: rules.patternMessage || validationMessages.pattern,
          isValid: false
        }
      }
    }

    // Validación personalizada
    if (rules.custom && typeof rules.custom === 'function') {
      const customResult = await rules.custom(value)
      if (customResult !== true) {
        return {
          status: 'invalid',
          message: typeof customResult === 'string' ? customResult : validationMessages.custom,
          isValid: false
        }
      }
    }

    // Validación asíncrona (ej: verificar disponibilidad)
    if (rules.async && typeof rules.async === 'function') {
      const asyncResult = await rules.async(value)
      if (asyncResult !== true) {
        return {
          status: 'invalid',
          message: typeof asyncResult === 'string' ? asyncResult : validationMessages.custom,
          isValid: false
        }
      }
    }

    // Advertencias (no bloquean el envío pero informan al usuario)
    if (rules.warning && typeof rules.warning === 'function') {
      const warningResult = await rules.warning(value)
      if (warningResult !== true) {
        return {
          status: 'warning',
          message: typeof warningResult === 'string' ? warningResult : 'Ten en cuenta esta advertencia',
          isValid: true
        }
      }
    }

    return {
      status: 'valid',
      message: rules.successMessage || '',
      isValid: true
    }
  }

  const ValidationIcon = validationIcons[validationState.status]
  const showIcon = validationState.status !== 'idle' && showValidIcon

  return (
    <div className={cn('form-group', validationState.status, className)} {...props}>
      <div className="input-validation-wrapper">
        {/* Clonar el input hijo para agregar props de validación */}
        {React.cloneElement(children, {
          className: cn(
            children.props.className,
            'validation-input',
            validationState.status !== 'idle' && `validation-${validationState.status}`
          ),
          'aria-invalid': !validationState.isValid,
          'aria-describedby': validationState.message ? `${children.props.id || 'input'}-error` : undefined
        })}

        {/* Icono de validación */}
        {showIcon && ValidationIcon && (
          <div className={cn('validation-icon', validationState.status)}>
            <ValidationIcon 
              size={16} 
              className={validationState.status === 'validating' ? 'animate-spin' : ''}
            />
          </div>
        )}
      </div>

      {/* Mensaje de validación */}
      {validationState.message && (
        <div 
          className={cn('validation-message', validationState.status)}
          id={`${children.props.id || 'input'}-error`}
          role={validationState.status === 'invalid' ? 'alert' : 'status'}
        >
          {validationState.message}
        </div>
      )}
    </div>
  )
}

// Hook para usar validación en tiempo real
export function useRealTimeValidation(initialValue = '', validation = {}, options = {}) {
  const [value, setValue] = useState(initialValue)
  const [validationState, setValidationState] = useState({
    status: 'idle',
    message: '',
    isValid: true
  })

  const handleValidationChange = (newValidationState) => {
    setValidationState(newValidationState)
  }

  const reset = () => {
    setValue(initialValue)
    setValidationState({
      status: 'idle',
      message: '',
      isValid: true
    })
  }

  return {
    value,
    setValue,
    validationState,
    handleValidationChange,
    reset,
    isValid: validationState.isValid,
    isValidating: validationState.status === 'validating'
  }
}

// Validadores comunes predefinidos
export const validators = {
  required: { required: true },
  
  email: { 
    required: true, 
    email: true 
  },
  
  password: {
    required: true,
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)',
    patternMessage: 'Debe contener al menos una mayúscula, una minúscula y un número'
  },
  
  radicado: {
    required: true,
    pattern: '^\\d{5,23}$',
    patternMessage: 'Debe contener entre 5 y 23 dígitos'
  },
  
  cedula: {
    required: true,
    pattern: '^\\d{6,12}$',
    patternMessage: 'Debe contener entre 6 y 12 dígitos'
  },
  
  telefono: {
    pattern: '^[\\d\\s\\-\\+\\(\\)]{7,15}$',
    patternMessage: 'Formato de teléfono inválido'
  },
  
  url: {
    pattern: '^https?:\\/\\/.+',
    patternMessage: 'Debe ser una URL válida (http:// o https://)'
  }
}

export default RealTimeValidation
