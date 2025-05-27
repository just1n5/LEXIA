import React, { useState, useRef } from 'react'
import { cn } from '../../utils/cn'

/**
 * 🚀 ButtonEnhanced - Versión mejorada del Button
 * 
 * ✅ MANTIENE 100% la funcionalidad del Button original
 * ✅ CONSERVA todas las props, variantes y comportamientos existentes
 * ✅ AGREGA mejoras sutiles de UX:
 *   - Micro-interacciones más fluidas (ripple effect, scale)
 *   - Feedback visual mejorado en press/hover
 *   - Loading states más profesionales
 *   - Transiciones optimizadas
 *   - Estados hover/focus más naturales
 *   - Soporte para success/error feedback
 */
const ButtonEnhanced = React.forwardRef(({ 
  children, 
  as: Component = 'button',
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  icon = null,
  iconPosition = 'left',
  block = false,
  className = '',
  type = 'button',
  // 🚀 NUEVAS PROPS ENHANCED
  ripple = true,
  successState = false,
  errorState = false,
  loadingText = null,
  pressEffect = true,
  ...props 
}, ref) => {
  
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showRipple, setShowRipple] = useState(false)
  const [rippleCoords, setRippleCoords] = useState({ x: 0, y: 0 })
  const buttonRef = useRef(null)
  const finalRef = ref || buttonRef

  // 🎨 Clases base EXACTAS del Button original
  const baseClasses = cn(
    'inline-flex items-center justify-center',
    'font-medium cursor-pointer transition-default',
    'border-none rounded-sm focus-ring',
    'touch-target',
    'select-none',
    'text-body-paragraph leading-none'
  )
  
  // 🎨 Variantes EXACTAS del Button original
  const variantClasses = {
    primary: cn(
      'bg-interactive-default text-text-base',
      'hover:bg-interactive-hover hover:shadow-sm',
      'active:bg-interactive-active',
      'focus:bg-interactive-hover'
    ),
    secondary: cn(
      'bg-bg-canvas text-text-base border border-border-default',
      'hover:bg-bg-light hover:shadow-sm hover:border-interactive-default',
      'active:bg-bg-light active:border-interactive-active',
      'focus:border-interactive-default'
    ),
    ghost: cn(
      'bg-transparent text-text-base',
      'hover:bg-bg-light',
      'active:bg-bg-light',
      'focus:bg-bg-light'
    ),
    destructive: cn(
      'bg-feedback-error text-bg-canvas',
      'hover:bg-red-600 hover:shadow-sm',
      'active:bg-red-700',
      'focus:bg-red-600'
    ),
    link: cn(
      'bg-transparent text-feedback-info p-0 h-auto',
      'hover:text-interactive-default hover:underline',
      'focus:text-interactive-default focus:underline',
      'active:text-interactive-active'
    )
  }
  
  // 🎨 Tamaños EXACTOS del Button original
  const sizeClasses = {
    sm: cn(
      'h-8 px-sm text-body-auxiliary',
      variant === 'link' ? '' : 'min-w-16'
    ),
    md: cn(
      'h-10 px-md',
      variant === 'link' ? '' : 'min-w-20'
    ),
    lg: cn(
      'h-12 px-lg text-heading-h4',
      variant === 'link' ? '' : 'min-w-24'
    ),
  }
  
  // 🚀 ENHANCED: Estados especiales con override para success/error
  const currentVariant = successState ? 'success' : (errorState ? 'error' : variant)
  
  // Estados success/error temporales
  const enhancedVariantClasses = {
    ...variantClasses,
    success: cn(
      'bg-feedback-success text-bg-canvas',
      'hover:bg-green-600 hover:shadow-sm',
      'active:bg-green-700',
      'focus:bg-green-600'
    ),
    error: cn(
      'bg-feedback-error text-bg-canvas',
      'hover:bg-red-600 hover:shadow-sm',
      'active:bg-red-700',
      'focus:bg-red-600'
    )
  }
  
  const stateClasses = cn(
    // Estados originales
    (disabled || loading) && cn(
      'cursor-not-allowed opacity-60',
      currentVariant === 'primary' && 'bg-border-disabled text-text-secondary hover:bg-border-disabled',
      currentVariant === 'secondary' && 'bg-border-disabled text-text-secondary border-border-disabled hover:bg-border-disabled',
      currentVariant === 'ghost' && 'text-text-secondary hover:bg-transparent',
      currentVariant === 'destructive' && 'bg-border-disabled text-text-secondary hover:bg-border-disabled',
      currentVariant === 'link' && 'text-text-secondary hover:text-text-secondary hover:no-underline'
    ),
    loading && 'pointer-events-none',
    block && 'w-full',
    (icon || loading) && currentVariant !== 'link' && 'gap-sm'
  )

  // 🚀 ENHANCED: Micro-interacciones
  const enhancedStateClasses = cn(
    // Press effect
    pressEffect && isPressed && !disabled && !loading && 'transform scale-95',
    // Hover effect sutil
    isHovered && !disabled && !loading && currentVariant !== 'link' && 'transform scale-[1.02]',
    // Ripple container
    ripple && 'relative overflow-hidden'
  )

  // Combinar todas las clases
  const buttonClasses = cn(
    baseClasses,
    enhancedVariantClasses[currentVariant] || enhancedVariantClasses[variant],
    sizeClasses[size],
    stateClasses,
    enhancedStateClasses,
    className
  )

  // 🚀 ENHANCED: Loading icon mejorado
  const LoadingIcon = () => (
    <svg 
      className="animate-spin w-4 h-4 flex-shrink-0" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        // Usar color actual del botón
        color: 'currentColor'
      }}
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

  // 🚀 ENHANCED: Success/Error icons
  const SuccessIcon = () => (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )

  const ErrorIcon = () => (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  // Renderizar icono según estado
  const renderIcon = () => {
    if (loading) {
      return <LoadingIcon />
    }
    
    if (successState) {
      return <SuccessIcon />
    }
    
    if (errorState) {
      return <ErrorIcon />
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

  // 🚀 ENHANCED: Event handlers con micro-interacciones
  const handleMouseDown = (e) => {
    if (disabled || loading) return
    
    setIsPressed(true)
    
    // Ripple effect
    if (ripple && finalRef.current) {
      const rect = finalRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setRippleCoords({ x, y })
      setShowRipple(true)
      
      // Ocultar ripple después de la animación
      setTimeout(() => setShowRipple(false), 600)
    }
    
    props.onMouseDown?.(e)
  }

  const handleMouseUp = (e) => {
    setIsPressed(false)
    props.onMouseUp?.(e)
  }

  const handleMouseEnter = (e) => {
    setIsHovered(true)
    props.onMouseEnter?.(e)
  }

  const handleMouseLeave = (e) => {
    setIsHovered(false)
    setIsPressed(false)
    props.onMouseLeave?.(e)
  }

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault()
      return
    }
    props.onClick?.(e)
  }

  // Props del componente
  const componentProps = {
    ref: finalRef,
    className: buttonClasses,
    disabled: disabled || loading,
    type: Component === 'button' ? type : undefined,
    'aria-disabled': disabled || loading,
    'aria-busy': loading,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    style: {
      // 🚀 ENHANCED: Transiciones suaves usando variables CSS
      transition: 'var(--transition-default), transform 0.1s ease-out',
      ...props.style
    },
    ...props
  }

  // Eliminar event handlers duplicados de props
  delete componentProps.onMouseDown
  delete componentProps.onMouseUp  
  delete componentProps.onMouseEnter
  delete componentProps.onMouseLeave
  delete componentProps.onClick

  // Agregar nuevamente con nuestros handlers mejorados
  componentProps.onMouseDown = handleMouseDown
  componentProps.onMouseUp = handleMouseUp
  componentProps.onMouseEnter = handleMouseEnter
  componentProps.onMouseLeave = handleMouseLeave
  componentProps.onClick = handleClick

  // Aria-label dinámico para estados
  if (loading && !componentProps['aria-label']) {
    componentProps['aria-label'] = loadingText || 'Cargando...'
  }
  if (successState && !componentProps['aria-label']) {
    componentProps['aria-label'] = 'Operación exitosa'
  }
  if (errorState && !componentProps['aria-label']) {
    componentProps['aria-label'] = 'Error en la operación'
  }

  return (
    <Component {...componentProps}>
      {/* 🚀 ENHANCED: Ripple effect */}
      {ripple && showRipple && (
        <span
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: rippleCoords.x - 10,
            top: rippleCoords.y - 10,
            width: 20,
            height: 20,
            opacity: 0.3,
            transform: 'scale(0)',
            animation: 'ripple 0.6s ease-out'
          }}
        />
      )}
      
      {/* Icono izquierdo */}
      {iconPosition === 'left' && renderIcon()}
      
      {/* Contenido del botón */}
      {children && (
        <span className={cn(
          loading && variant === 'link' && 'sr-only'
        )}>
          {/* 🚀 ENHANCED: Texto dinámico para loading */}
          {loading && loadingText ? loadingText : children}
        </span>
      )}
      
      {/* Icono derecho */}
      {iconPosition === 'right' && !loading && !successState && !errorState && renderIcon()}
    </Component>
  )
})

ButtonEnhanced.displayName = 'ButtonEnhanced'

/**
 * 🚀 ENHANCED: Componentes de conveniencia mejorados
 */

ButtonEnhanced.Primary = React.forwardRef((props, ref) => (
  <ButtonEnhanced ref={ref} variant="primary" {...props} />
))
ButtonEnhanced.Primary.displayName = 'ButtonEnhanced.Primary'

ButtonEnhanced.Secondary = React.forwardRef((props, ref) => (
  <ButtonEnhanced ref={ref} variant="secondary" {...props} />
))
ButtonEnhanced.Secondary.displayName = 'ButtonEnhanced.Secondary'

ButtonEnhanced.Ghost = React.forwardRef((props, ref) => (
  <ButtonEnhanced ref={ref} variant="ghost" {...props} />
))
ButtonEnhanced.Ghost.displayName = 'ButtonEnhanced.Ghost'

ButtonEnhanced.Destructive = React.forwardRef((props, ref) => (
  <ButtonEnhanced ref={ref} variant="destructive" {...props} />
))
ButtonEnhanced.Destructive.displayName = 'ButtonEnhanced.Destructive'

ButtonEnhanced.Link = React.forwardRef((props, ref) => (
  <ButtonEnhanced ref={ref} variant="link" {...props} />
))
ButtonEnhanced.Link.displayName = 'ButtonEnhanced.Link'

// 🚀 ENHANCED: Icon button con mejores interacciones
ButtonEnhanced.Icon = React.forwardRef(({ 
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
    <ButtonEnhanced
      ref={ref}
      variant={variant}
      className={cn(iconSizes[size], 'px-0')}
      aria-label={ariaLabel || 'Botón'}
      ripple={true}
      pressEffect={true}
      {...props}
    >
      {icon || children}
    </ButtonEnhanced>
  )
})
ButtonEnhanced.Icon.displayName = 'ButtonEnhanced.Icon'

export default ButtonEnhanced

/* 
🎯 NUEVAS CARACTERÍSTICAS ENHANCED:

✅ MANTIENE 100% compatibilidad con Button original:
- Todas las props funcionan igual
- Mismas variantes (primary, secondary, ghost, destructive, link)
- Mismos tamaños (sm, md, lg)
- Mismo sistema de loading y disabled

✅ MEJORAS AGREGADAS:
- ripple={true}: Efecto ripple al hacer click
- pressEffect={true}: Scale down al presionar
- successState/errorState: Estados temporales con iconos
- loadingText: Texto personalizado durante loading
- Hover effect: Scale up sutil en hover
- Transiciones optimizadas usando variables CSS

✅ MICRO-INTERACCIONES:
- Ripple effect en click (como Material Design)
- Scale 0.95 al presionar, 1.02 en hover
- Iconos automáticos para success/error states
- Transiciones suaves coordinadas
- Feedback visual inmediato

🔄 USO:
// Drop-in replacement del Button original
<ButtonEnhanced 
  variant="primary"
  loading={isSubmitting}
  loadingText="Guardando..."
  onClick={handleSubmit}
>
  Guardar
</ButtonEnhanced>

// Con estados success/error
<ButtonEnhanced 
  successState={showSuccess}
  errorState={showError}
  variant="primary"
>
  Procesar
</ButtonEnhanced>
*/