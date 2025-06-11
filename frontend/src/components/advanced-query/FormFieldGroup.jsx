// src/components/advanced-query/FormFieldGroup.jsx
import React from 'react'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { cn } from '../../utils/cn'
import Badge from '../ui/Badge'

/**
 * 🔧 FormFieldGroup - Agrupador de campos de formulario
 * 
 * Organiza campos relacionados con título, descripción y numeración,
 * mejorando la estructura visual y la comprensión del formulario.
 */
const FormFieldGroup = ({ 
  number,
  title,
  description,
  children,
  required = false,
  completed = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={cn('space-y-md', className)} {...props}>
      {/* Header del grupo */}
      <div className="flex items-start gap-sm">
        {number && (
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
            completed ? 'bg-feedback-success' : 'bg-interactive-default'
          )}>
            {completed ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <span className="text-body-auxiliary font-bold text-white">
                {number}
              </span>
            )}
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-sm">
            <h3 className="text-heading-h3 font-heading text-text-primary">
              {title}
            </h3>
            {required && (
              <Badge variant="secondary" size="sm">
                Requerido
              </Badge>
            )}
          </div>
          
          {description && (
            <p className="text-body-paragraph text-text-secondary mt-xs">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Contenido del grupo */}
      <div className="ml-10">
        {children}
      </div>
    </div>
  )
}

/**
 * 📝 FormField - Campo individual del formulario
 */
const FormField = ({ 
  label,
  required = false,
  children,
  error,
  hint,
  className = '',
  ...props 
}) => {
  return (
    <div className={cn('space-y-xs', className)} {...props}>
      {label && (
        <label className="block text-body-paragraph font-medium text-text-primary">
          {label}
          {required && <span className="text-feedback-error ml-xs">*</span>}
        </label>
      )}
      
      {children}
      
      {error && (
        <div className="flex items-center gap-xs">
          <AlertTriangle className="w-3 h-3 text-feedback-error" />
          <span className="text-body-auxiliary text-feedback-error">
            {error}
          </span>
        </div>
      )}
      
      {hint && !error && (
        <p className="text-body-auxiliary text-text-secondary">
          {hint}
        </p>
      )}
    </div>
  )
}

/**
 * 🎛️ FormToggle - Toggle personalizado para formularios
 */
const FormToggle = ({ 
  id,
  label,
  description,
  icon: Icon,
  checked,
  onChange,
  className = '',
  ...props 
}) => {
  return (
    <div className={cn(
      'flex items-start gap-sm p-md bg-bg-light rounded border border-border-default transition-colors',
      checked && 'border-interactive-default bg-interactive-default bg-opacity-5',
      className
    )} {...props}>
      <div className="flex items-center mt-xs">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-interactive-default border-border-default rounded focus:ring-interactive-default focus:ring-2"
        />
      </div>
      
      <div className="flex-1">
        <label htmlFor={id} className="text-body-paragraph font-medium text-text-primary cursor-pointer">
          <div className="flex items-center gap-sm">
            {Icon && <Icon className="w-4 h-4 text-interactive-default" />}
            {label}
          </div>
        </label>
        {description && (
          <p className="text-body-auxiliary text-text-secondary mt-xs">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

// Exportar componentes
FormFieldGroup.Field = FormField
FormFieldGroup.Toggle = FormToggle

export default FormFieldGroup