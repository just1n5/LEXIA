import React from 'react'
import { cn } from '../../utils/cn'

const Input = React.forwardRef(({ 
  type = 'text',
  label,
  placeholder,
  icon,
  error,
  helperText,
  validationState, // 'validating', 'valid', 'error'
  validationMessage,
  className = '',
  ...props 
}, ref) => {
  const inputClasses = cn(
    'form-input',
    icon && 'pl-12',
    className
  )

  const groupClasses = cn(
    'form-group',
    validationState && `${validationState}`,
    error && 'has-error'
  )

  return (
    <div className={groupClasses}>
      {label && (
        <label className="block mb-xs font-medium text-heading-h4 text-text-base">
          {label}
        </label>
      )}
      
      <div className={cn(icon && 'input-with-icon', 'relative')}>
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {/* Validation Message */}
      {validationMessage && (
        <div className="validation-message">
          {validationMessage}
        </div>
      )}
      
      {/* Helper Text */}
      {helperText && !error && !validationMessage && (
        <p className="helper-text">
          {helperText}
        </p>
      )}
      
      {/* Error Text */}
      {error && (
        <p className="error-text">
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
