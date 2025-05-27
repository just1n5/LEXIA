import React from 'react'
import { cn } from '../../utils/cn'

/**
 * Componente Button mejorado siguiendo las especificaciones exactas de la guía de estilo
 * Implementa todos los estados, tamaños y variantes definidos en la documentación
 */
const Button = React.forwardRef(({ 
  children, 
  as: Component = 'button',
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  icon = null,
  iconPosition = 'left', // 'left' | 'right'
  block = false,
  className = '',
  type = 'button',
  ...props 
}, ref) => {
  
  // Clases base según especificaciones de la guía de estilo
  const baseClasses = cn(
    // Estructura básica
    'inline-flex items-center justify-center',
    'font-medium cursor-pointer transition-default',
    'border-none rounded-sm focus-ring',
    // Accesibilidad - tamaño táctil mínimo
    'touch-target',
    // Prevenir selección de texto
    'select-none',
    // Typography
    'text-body-paragraph leading-none'
  )
  
  // Variantes de botón según la guía de estilo
  const variantClasses = {
    // Primario: Color interactivo principal (amarillo)
    primary: cn(
      'bg-interactive-default text-text-base',
      'hover:bg-interactive-hover hover:shadow-sm',
      'active:bg-interactive-active',
      'focus:bg-interactive-hover'
    ),
    
    // Secundario: Fondo canvas con borde
    secondary: cn(
      'bg-bg-canvas text-text-base border border-border-default',
      'hover:bg-bg-light hover:shadow-sm hover:border-interactive-default',
      'active:bg-bg-light active:border-interactive-active',
      'focus:border-interactive-default'
    ),
    
    // Ghost: Transparente, sutil
    ghost: cn(
      'bg-transparent text-text-base',
      'hover:bg-bg-light',
      'active:bg-bg-light',
      'focus:bg-bg-light'
    ),
    
    // Destructivo: Para acciones irreversibles
    destructive: cn(
      'bg-feedback-error text-bg-canvas',
      'hover:bg-red-600 hover:shadow-sm',
      'active:bg-red-700',
      'focus:bg-red-600'
    ),
    
    // Enlace: Se ve como un enlace
    link: cn(
      'bg-transparent text-feedback-info p-0 h-auto',
      'hover:text-interactive-default hover:underline',
      'focus:text-interactive-default focus:underline',
      'active:text-interactive-active'
    )
  }
  
  // Tamaños según especificaciones de la guía de estilo
  const sizeClasses = {
    // Pequeño: 32px altura, spacing reducido
    sm: cn(
      'h-8 px-sm text-body-auxiliary',
      variant === 'link' ? '' : 'min-w-16'
    ),
    
    // Mediano: 40px altura (predeterminado)
    md: cn(
      'h-10 px-md',
      variant === 'link' ? '' : 'min-w-20'
    ),
    
    // Grande: 48px altura, spacing amplio
    lg: cn(
      'h-12 px-lg text-heading-h4',
      variant === 'link' ? '' : 'min-w-24'
    ),
  }
  
  // Estados especiales
  const stateClasses = cn(
    // Deshabilitado
    (disabled || loading) && cn(
      'cursor-not-allowed opacity-60',
      variant === 'primary' && 'bg-border-disabled text-text-secondary hover:bg-border-disabled',
      variant === 'secondary' && 'bg-border-disabled text-text-secondary border-border-disabled hover:bg-border-disabled',
      variant === 'ghost' && 'text-text-secondary hover:bg-transparent',
      variant === 'destructive' && 'bg-border-disabled text-text-secondary hover:bg-border-disabled',
      variant === 'link' && 'text-text-secondary hover:text-text-secondary hover:no-underline'
    ),
    
    // Loading
    loading && 'pointer-events-none',
    
    // Bloque (ancho completo)
    block && 'w-full',
    
    // Con icono
    (icon || loading) && variant !== 'link' && 'gap-sm'
  )

  // Combinar todas las clases
  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    stateClasses,
    className
  )

  // Icono de loading
  const LoadingIcon = () => (
    <svg 
      className="animate-spin w-4 h-4 flex-shrink-0" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4" 
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
      />
    </svg>
  )

  // Renderizar icono según posición
  const renderIcon = () => {
    if (loading) {
      return <LoadingIcon />
    }
    
    if (icon) {
      return (
        <span className="flex-shrink-0" aria-hidden="true">
          {React.isValidElement(icon) ? icon : <span>{icon}</span>}
        </span>
      )
    }
    
    return null
  }

  // Props del componente
  const componentProps = {
    ref,
    className: buttonClasses,
    disabled: disabled || loading,
    type: Component === 'button' ? type : undefined,
    'aria-disabled': disabled || loading,
    'aria-busy': loading,
    ...props
  }

  // Si está loading, agregar aria-label descriptivo
  if (loading && !componentProps['aria-label']) {
    componentProps['aria-label'] = 'Cargando...'
  }

  return (
    <Component {...componentProps}>
      {/* Icono izquierdo */}
      {iconPosition === 'left' && renderIcon()}
      
      {/* Contenido del botón */}
      {children && (
        <span className={cn(
          // Ocultar texto en loading si es necesario
          loading && variant === 'link' && 'sr-only'
        )}>
          {children}
        </span>
      )}
      
      {/* Icono derecho */}
      {iconPosition === 'right' && !loading && renderIcon()}
    </Component>
  )
})

Button.displayName = 'Button'

/**
 * Componentes de conveniencia para casos comunes
 */

// Botón primario de acción
Button.Primary = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="primary" {...props} />
))
Button.Primary.displayName = 'Button.Primary'

// Botón secundario
Button.Secondary = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="secondary" {...props} />
))
Button.Secondary.displayName = 'Button.Secondary'

// Botón ghost/sutil
Button.Ghost = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="ghost" {...props} />
))
Button.Ghost.displayName = 'Button.Ghost'

// Botón destructivo
Button.Destructive = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="destructive" {...props} />
))
Button.Destructive.displayName = 'Button.Destructive'

// Botón como enlace
Button.Link = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="link" {...props} />
))
Button.Link.displayName = 'Button.Link'

// Botón de icono solamente
Button.Icon = React.forwardRef(({ 
  children, 
  icon, 
  size = 'md', 
  variant = 'ghost',
  'aria-label': ariaLabel,
  ...props 
}, ref) => {
  const iconSizes = {
    sm: 'w-8 h-8 p-1',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5'
  }

  return (
    <Button
      ref={ref}
      variant={variant}
      className={cn(iconSizes[size], 'px-0')}
      aria-label={ariaLabel || 'Botón'}
      {...props}
    >
      {icon || children}
    </Button>
  )
})
Button.Icon.displayName = 'Button.Icon'

export default Button