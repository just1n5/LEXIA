import React from 'react'
import { cn } from '../../utils/cn'

/**
 * Componente InfoField para mostrar información estructurada
 * Sigue el design system de ConsultaJudicial RPA
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
  // Variantes de estilo
  const variants = {
    default: {
      container: '',
      label: 'text-body-auxiliary text-text-secondary',
      value: 'text-body-paragraph text-text-primary font-medium'
    },
    subtle: {
      container: '',
      label: 'text-body-auxiliary text-text-secondary',
      value: 'text-body-paragraph text-text-base'
    },
    prominent: {
      container: 'bg-bg-light p-sm rounded-md',
      label: 'text-body-auxiliary text-text-secondary font-medium',
      value: 'text-body-paragraph text-text-primary font-semibold'
    }
  }

  // Tamaños
  const sizes = {
    sm: {
      container: 'space-y-xs',
      label: 'text-xs',
      value: 'text-sm'
    },
    md: {
      container: 'space-y-xs',
      label: '',
      value: ''
    },
    lg: {
      container: 'space-y-sm',
      label: 'text-base',
      value: 'text-lg'
    }
  }

  const variantStyles = variants[variant] || variants.default
  const sizeStyles = sizes[size] || sizes.md

  // Contenido a mostrar
  const content = children || value || 'N/A'
  const isEmpty = !children && !value

  return (
    <div 
      className={cn(
        sizeStyles.container,
        variantStyles.container,
        className
      )}
      {...props}
    >
      {/* Label */}
      <label className={cn(
        'block',
        variantStyles.label,
        sizeStyles.label,
        labelClassName
      )}>
        {label}
      </label>
      
      {/* Value */}
      <div className={cn(
        variantStyles.value,
        sizeStyles.value,
        isEmpty && 'text-text-secondary italic',
        valueClassName
      )}>
        {content}
      </div>
    </div>
  )
}

/**
 * Variante específica para fechas
 */
const DateInfoField = ({ 
  label, 
  value, 
  format = 'es-ES',
  dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  },
  ...props 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return null
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(format, dateOptions)
    } catch (error) {
      console.warn('Invalid date:', dateString)
      return 'Fecha inválida'
    }
  }

  return (
    <InfoField 
      label={label} 
      value={formatDate(value)}
      {...props}
    />
  )
}

/**
 * Variante con badge/estado
 */
const BadgeInfoField = ({ 
  label, 
  badge, 
  children,
  ...props 
}) => (
  <InfoField 
    label={label} 
    {...props}
  >
    <div className="flex items-center gap-sm">
      {badge}
      {children}
    </div>
  </InfoField>
)

/**
 * Grid de InfoFields
 */
const InfoFieldGrid = ({ 
  children, 
  columns = 2,
  className = '',
  ...props 
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div 
      className={cn(
        'grid gap-lg',
        gridClasses[columns] || gridClasses[2],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Sección de InfoFields con título
 */
const InfoFieldSection = ({ 
  title, 
  description,
  children, 
  className = '',
  ...props 
}) => (
  <div className={cn('space-y-lg', className)} {...props}>
    {title && (
      <div className="space-y-xs">
        <h3 className="text-heading-h3 font-heading text-text-primary">
          {title}
        </h3>
        {description && (
          <p className="text-body-paragraph text-text-secondary">
            {description}
          </p>
        )}
      </div>
    )}
    {children}
  </div>
)

// Asignar subcomponentes
InfoField.Date = DateInfoField
InfoField.Badge = BadgeInfoField
InfoField.Grid = InfoFieldGrid
InfoField.Section = InfoFieldSection

InfoField.displayName = 'InfoField'

export default InfoField