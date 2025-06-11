// src/components/advanced-query/BasicFormValidation.jsx
import React, { useMemo } from 'react'
import { 
  CheckCircle, AlertCircle, Info
} from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * 🔍 BasicFormValidation - Validaciones sin callbacks
 * 
 * Versión simplificada que solo muestra validaciones visuales
 * sin callbacks para evitar bucles infinitos.
 */
const BasicFormValidation = ({ 
  value, 
  fieldType, 
  className = '',
  showStrength = false,
  ...props 
}) => {
  // Si no hay valor, no mostrar nada
  if (!value || value.trim() === '') {
    return null
  }

  // Memoizar la validación para evitar recálculos innecesarios
  const validation = useMemo(() => {
    const errors = []
    const warnings = []
    const suggestions = []
    let strength = 'medium'

    switch (fieldType) {
      case 'numeroRadicado':
        // Validación básica de radicado
        if (value.length < 11) {
          errors.push('Debe tener al menos 11 dígitos')
        } else if (value.length > 23) {
          errors.push('No puede exceder 23 dígitos')
        } else if (!/^\d+$/.test(value)) {
          errors.push('Solo debe contener números')
        } else {
          // Es válido
          if (value.length >= 15 && value.length <= 20) {
            suggestions.push('✓ Formato de radicado típico')
            strength = 'strong'
          }
        }
        break

      case 'numeroRadicacion':
        // Validación básica de radicación
        if (value.length < 4) {
          errors.push('Debe tener al menos 4 caracteres')
        } else if (value.length > 20) {
          errors.push('No puede exceder 20 caracteres')
        } else {
          suggestions.push('✓ Formato aceptable')
          strength = 'strong'
        }
        break

      case 'nombrePersona':
        // Validación básica de nombre
        if (value.length < 2) {
          errors.push('Debe tener al menos 2 caracteres')
        } else if (value.length > 100) {
          errors.push('No puede exceder 100 caracteres')
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errors.push('Solo se permiten letras y espacios')
        } else {
          const words = value.trim().split(/\s+/)
          if (words.length < 2) {
            warnings.push('Se recomienda nombre y apellido completos')
          } else {
            suggestions.push('✓ Nombre completo')
            strength = 'strong'
          }
        }
        break

      case 'email':
        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          errors.push('Formato de email inválido')
        } else {
          suggestions.push('✓ Email válido')
          strength = 'strong'
        }
        break
    }

    if (errors.length > 0) {
      strength = 'weak'
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      strength
    }
  }, [value, fieldType])

  const hasMessages = validation.errors.length > 0 || 
                    validation.warnings.length > 0 || 
                    validation.suggestions.length > 0

  if (!hasMessages && !showStrength) {
    return null
  }

  return (
    <div className={cn('mt-xs space-y-xs', className)} {...props}>
      {/* Mensajes de error */}
      {validation.errors.map((error, index) => (
        <div key={`error-${index}`} className="flex items-start gap-xs">
          <AlertCircle className="w-3 h-3 text-feedback-error mt-px" />
          <span className="text-body-auxiliary text-feedback-error">
            {error}
          </span>
        </div>
      ))}

      {/* Mensajes de advertencia */}
      {validation.warnings.map((warning, index) => (
        <div key={`warning-${index}`} className="flex items-start gap-xs">
          <AlertCircle className="w-3 h-3 text-feedback-warning mt-px" />
          <span className="text-body-auxiliary text-feedback-warning">
            {warning}
          </span>
        </div>
      ))}

      {/* Sugerencias */}
      {validation.suggestions.map((suggestion, index) => (
        <div key={`suggestion-${index}`} className="flex items-start gap-xs">
          <Info className="w-3 h-3 text-feedback-info mt-px" />
          <span className="text-body-auxiliary text-feedback-info">
            {suggestion}
          </span>
        </div>
      ))}

      {/* Indicador de fortaleza */}
      {showStrength && validation.isValid && (
        <div className="flex items-center gap-xs">
          <div className="flex gap-xs">
            <div className={cn(
              'w-2 h-1 rounded-full',
              validation.strength === 'weak' ? 'bg-feedback-error' : 'bg-feedback-success'
            )} />
            <div className={cn(
              'w-2 h-1 rounded-full',
              validation.strength === 'medium' || validation.strength === 'strong' 
                ? 'bg-feedback-success' 
                : 'bg-border-default'
            )} />
            <div className={cn(
              'w-2 h-1 rounded-full',
              validation.strength === 'strong' ? 'bg-feedback-success' : 'bg-border-default'
            )} />
          </div>
          <span className={cn(
            'text-body-auxiliary',
            validation.strength === 'weak' && 'text-feedback-error',
            validation.strength === 'medium' && 'text-feedback-warning',
            validation.strength === 'strong' && 'text-feedback-success'
          )}>
            {validation.strength === 'weak' && 'Información básica'}
            {validation.strength === 'medium' && 'Información buena'}
            {validation.strength === 'strong' && 'Información excelente'}
          </span>
        </div>
      )}

      {/* Ejemplo de formato correcto para errores */}
      {validation.errors.length > 0 && (
        <div className="bg-feedback-info-light rounded p-sm border border-feedback-info">
          <div className="flex items-start gap-xs">
            <Info className="w-3 h-3 text-feedback-info mt-px" />
            <div>
              <span className="text-body-auxiliary text-feedback-info font-medium">
                Ejemplo:
              </span>
              <span className="text-body-auxiliary text-feedback-info ml-xs font-mono">
                {fieldType === 'numeroRadicado' && '11001310300120240001234'}
                {fieldType === 'numeroRadicacion' && '20240001234'}
                {fieldType === 'nombrePersona' && 'Juan Carlos Pérez'}
                {fieldType === 'email' && 'usuario@ejemplo.com'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

BasicFormValidation.displayName = 'BasicFormValidation'

export default BasicFormValidation