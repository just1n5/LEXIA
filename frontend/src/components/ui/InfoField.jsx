import React from 'react'
import { cn } from '../../utils/cn'

/**
 * Componente InfoField para mostrar información etiquetada
 * Sigue las especificaciones del design system para campos de información
 */
const InfoField = ({ 
  label, 
  value, 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  labelClassName = '',
  valueClassName = '',
  ...props 
}) => {
  
  // Variantes de diseño
  const variants = {
    default: 'space-y-xs',
    compact: 'space-y-xs',
    spaced: 'space-y-sm'
  }
  
  // Tamaños
  const sizes = {
    sm: {
      label: 'text-xs',
      value: 'text-sm'
    },
    md: {
      label: 'text-body-auxiliary',
      value: 'text-body-paragraph'
    },
    lg: {
      label: 'text-body-paragraph', 
      value: 'text-heading-h4'
    }
  }

  const sizeConfig = sizes[size] || sizes.md

  return (
    <div 
      className={cn(
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Label */}
      <label className={cn(
        'block font-medium text-text-secondary',
        sizeConfig.label,
        labelClassName
      )}>
        {label}
      </label>
      
      {/* Value */}
      <div className={cn(
        'text-text-primary font-medium',
        sizeConfig.value,
        valueClassName
      )}>
        {children || value || (
          <span className="text-text-secondary italic">
            No especificado
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * Variantes especializadas
 */

// Para fechas
const DateField = ({ label, date, format = 'es-ES', options = {}, ...props }) => {
  const formattedDate = date ? new Date(date).toLocaleDateString(format, {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    ...options
  }) : null

  return (
    <InfoField 
      label={label}
      value={formattedDate}
      {...props}
    />
  )
}

// Para estados con badge
const StatusField = ({ label, status, getBadge, ...props }) => (
  <InfoField label={label} {...props}>
    {getBadge ? getBadge(status) : status}
  </InfoField>
)

// Para valores monetarios
const CurrencyField = ({ label, amount, currency = 'COP', ...props }) => {
  const formattedAmount = amount ? new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency
  }).format(amount) : null

  return (
    <InfoField
      label={label}
      value={formattedAmount}
      {...props}
    />
  )
}

// Para valores numéricos
const NumberField = ({ label, number, ...props }) => {
  const formattedNumber = number ? new Intl.NumberFormat('es-CO').format(number) : null

  return (
    <InfoField
      label={label}
      value={formattedNumber}
      {...props}
    />
  )
}

// Grid de campos de información
const InfoGrid = ({ 
  children, 
  columns = 2, 
  gap = 'lg',
  className = '',
  ...props 
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  const gapClasses = {
    sm: 'gap-sm',
    md: 'gap-md', 
    lg: 'gap-lg',
    xl: 'gap-xl'
  }

  return (
    <div 
      className={cn(
        'grid',
        gridClasses[columns],
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Asignar subcomponentes
InfoField.Date = DateField
InfoField.Status = StatusField
InfoField.Currency = CurrencyField
InfoField.Number = NumberField
InfoField.Grid = InfoGrid

InfoField.displayName = 'InfoField'

export default InfoField