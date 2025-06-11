// src/components/advanced-query/SimpleAdvancedFormValidation.jsx
import React, { useState, useEffect } from 'react'
import { 
  CheckCircle, AlertCircle, Info
} from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * 🔍 SimpleAdvancedFormValidation - Validaciones simplificadas
 * 
 * Versión simplificada que evita bucles infinitos mientras mantiene
 * validación básica y feedback útil.
 */
const SimpleAdvancedFormValidation = ({ 
  value, 
  fieldType, 
  onValidation,
  className = '',
  showStrength = false,
  ...props 
}) => {
  const [validation, setValidation] = useState({
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    strength: 'medium'
  })

  // Reglas de validación simplificadas
  const validateField = (inputValue) => {
    if (!inputValue || inputValue.trim() === '') {
      return {
        isValid: true,
        errors: [],
        warnings: [],
        suggestions: [],
        strength: 'medium'
      }
    }

    const errors = []
    const warnings = []
    const suggestions = []
    let strength = 'medium'

    switch (fieldType) {
      case 'numeroRadicado':
        validateNumeroRadicado(inputValue, errors, warnings, suggestions)
        break
      case 'numeroRadicacion':
        validateNumeroRadicacion(inputValue, errors, warnings, suggestions)
        break
      case 'nombrePersona':
        validateNombrePersona(inputValue, errors, warnings, suggestions)
        break
      case 'email':
        validateEmail(inputValue, errors, warnings, suggestions)
        break
    }

    // Determinar fortaleza
    if (errors.length === 0) {
      if (warnings.length === 0 && suggestions.length === 0) {
        strength = 'strong'
      } else if (warnings.length > 0) {
        strength = 'medium'
      }
    } else {
      strength = 'weak'
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      strength
    }
  }

  // Validaciones específicas simplificadas
  const validateNumeroRadicado = (value, errors, warnings, suggestions) => {
    // Verificar longitud básica
    if (value.length < 11) {
      errors.push('Debe tener al menos 11 dígitos')
      return
    }
    
    if (value.length > 23) {
      errors.push('No puede exceder 23 dígitos')
      return
    }

    // Verificar que solo contiene números
    if (!/^\d+$/.test(value)) {
      errors.push('Solo debe contener números')
      return
    }

    // Sugerencias positivas
    if (value.length >= 15 && value.length <= 20) {
      suggestions.push('✓ Formato de radicado típico detectado')
    }

    // Verificar año en la posición típica
    if (value.length >= 9) {
      const year = value.substring(5, 9)
      const currentYear = new Date().getFullYear()
      
      if (parseInt(year) >= 2000 && parseInt(year) <= currentYear) {
        suggestions.push('✓ Año válido detectado')
      } else if (parseInt(year) > currentYear) {
        warnings.push('El año parece ser futuro')
      }
    }
  }

  const validateNumeroRadicacion = (value, errors, warnings, suggestions) => {
    // Verificar longitud básica
    if (value.length < 4) {
      errors.push('Debe tener al menos 4 caracteres')
      return
    }
    
    if (value.length > 20) {
      errors.push('No puede exceder 20 caracteres')
      return
    }

    // Verificar que contiene principalmente números
    if (!/^\d+(-\d+)*$/.test(value)) {
      warnings.push('Se recomienda usar solo números o números con guiones')
    }

    // Verificar año al inicio
    if (value.length >= 4) {
      const firstFour = value.substring(0, 4)
      const currentYear = new Date().getFullYear()
      
      if (parseInt(firstFour) >= 2000 && parseInt(firstFour) <= currentYear) {
        suggestions.push('✓ Año de radicación válido')
      }
    }
  }

  const validateNombrePersona = (value, errors, warnings, suggestions) => {
    // Verificar longitud
    if (value.length < 2) {
      errors.push('Debe tener al menos 2 caracteres')
      return
    }
    
    if (value.length > 100) {
      errors.push('No puede exceder 100 caracteres')
      return
    }

    // Verificar caracteres válidos
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
      errors.push('Solo se permiten letras y espacios')
      return
    }

    // Verificar que tenga al menos nombre y apellido
    const words = value.trim().split(/\s+/)
    
    if (words.length < 2) {
      warnings.push('Se recomienda incluir nombre y apellido completos')
    } else {
      suggestions.push('✓ Nombre completo detectado')
    }

    // Verificar capitalización
    const isProperCase = words.every(word => 
      word.charAt(0) === word.charAt(0).toUpperCase()
    )
    
    if (!isProperCase) {
      suggestions.push('Considera usar la primera letra en mayúscula')
    }
  }

  const validateEmail = (value, errors, warnings, suggestions) => {
    // Verificar formato básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!emailRegex.test(value)) {
      errors.push('Formato de email inválido')
      return
    }

    // Verificar dominios comunes
    const commonDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com']
    const domain = value.split('@')[1]
    
    if (commonDomains.includes(domain?.toLowerCase())) {
      suggestions.push('✓ Dominio de email reconocido')
    }
    
    if (value.includes('..')) {
      errors.push('No puede contener puntos consecutivos')
    }
  }

  // Efecto simplificado para validar
  useEffect(() => {
    const result = validateField(value)
    setValidation(result)
    
    // Llamar onValidation solo si existe y es diferente
    if (onValidation && typeof onValidation === 'function') {
      onValidation(result)
    }
  }, [value, fieldType]) // Solo las dependencias esenciales

  // No renderizar si no hay valor
  if (!value || value.trim() === '') {
    return null
  }

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
                Ejemplos correctos:
              </span>
              <div className="text-body-auxiliary text-feedback-info ml-xs font-mono">
                {fieldType === 'numeroRadicado' && '11001310300120240001234'}
                {fieldType === 'numeroRadicacion' && '20240001234'}
                {fieldType === 'nombrePersona' && 'Juan Carlos Pérez'}
                {fieldType === 'email' && 'usuario@ejemplo.com'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

SimpleAdvancedFormValidation.displayName = 'SimpleAdvancedFormValidation'

export default SimpleAdvancedFormValidation