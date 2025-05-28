import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Componente Card mejorado siguiendo las especificaciones del design system
 * Proporciona diferentes variantes y estados para diferentes contextos de uso
 */
const Card = React.forwardRef(({ 
  children, 
  variant = 'default',
  size = 'md',
  hoverable = false,
  selected = false,
  clickable = false,
  className = '',
  ...props 
}, ref) => {
  
  // Clases base del card
  const baseClasses = cn(
    // Estructura basica
    'bg-bg-canvas rounded-lg border transition-default',
    // Accesibilidad
    'focus-within:ring-2 focus-within:ring-interactive-default focus-within:ring-opacity-20'
  );
  
  // Variantes de card
  const variantClasses = {
    // Default: Card estandar
    default: cn(
      'border-border-default'
    ),
    
    // Elevated: Card con mas elevacion
    elevated: cn(
      'border-border-default shadow-md'
    ),
    
    // Outlined: Enfasis en el borde
    outlined: cn(
      'border-2 border-border-default'
    ),
    
    // Interactive: Para cards clickeables
    interactive: cn(
      'border-border-default cursor-pointer',
      'hover:border-interactive-hover hover:shadow-md',
      'active:border-interactive-active'
    ),
    
    // Success: Para estados de exito
    success: cn(
      'border-feedback-success bg-feedback-success-light'
    ),
    
    // Warning: Para advertencias
    warning: cn(
      'border-feedback-warning bg-feedback-warning-light'
    ),
    
    // Error: Para errores
    error: cn(
      'border-feedback-error bg-feedback-error-light'
    ),
    
    // Info: Para informacion
    info: cn(
      'border-feedback-info bg-feedback-info-light'
    )
  };
  
  // Tamaños de card
  const sizeClasses = {
    sm: 'p-sm',      // 8px padding
    md: 'p-md',      // 16px padding
    lg: 'p-lg',      // 24px padding
    xl: 'p-xl'       // 32px padding
  };
  
  // Estados del card
  const stateClasses = cn(
    // Hoverable
    hoverable && !clickable && 'hover:shadow-md hover:border-interactive-hover',
    
    // Selected
    selected && cn(
      'border-interactive-default bg-yellow-50',
      'ring-2 ring-interactive-default ring-opacity-20'
    ),
    
    // Clickable (si no es interactive variant)
    clickable && variant !== 'interactive' && cn(
      'cursor-pointer',
      'hover:border-interactive-hover hover:shadow-md',
      'active:border-interactive-active'
    )
  );

  // Combinar todas las clases
  const cardClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    stateClasses,
    className
  );

  return (
    <div 
      ref={ref}
      className={cardClasses}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

/**
 * Subcomponentes especializados para casos especificos
 */

// Card Header
const CardHeader = React.forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => (
  <div 
    ref={ref}
    className={cn(
      'flex items-center justify-between',
      'pb-md mb-md border-b border-border-default',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
CardHeader.displayName = 'Card.Header';

// Card Title
const CardTitle = React.forwardRef(({ 
  children, 
  as: Component = 'h3',
  className = '',
  ...props 
}, ref) => (
  <Component 
    ref={ref}
    className={cn(
      'text-heading-h3 font-heading text-text-primary',
      className
    )}
    {...props}
  >
    {children}
  </Component>
));
CardTitle.displayName = 'Card.Title';

// Card Content
const CardContent = React.forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => (
  <div 
    ref={ref}
    className={cn('space-y-md', className)}
    {...props}
  >
    {children}
  </div>
));
CardContent.displayName = 'Card.Content';

// Card Footer
const CardFooter = React.forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => (
  <div 
    ref={ref}
    className={cn(
      'flex items-center gap-sm',
      'pt-md mt-md border-t border-border-default',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = 'Card.Footer';

// Card para formularios
const FormCard = React.forwardRef(({ 
  children, 
  title,
  description,
  className = '',
  ...props 
}, ref) => (
  <Card 
    ref={ref}
    variant="outlined"
    size="lg"
    className={cn('max-w-2xl mx-auto', className)}
    {...props}
  >
    {title && (
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          {description && (
            <p className="text-body-paragraph text-text-secondary mt-xs">
              {description}
            </p>
          )}
        </div>
      </CardHeader>
    )}
    <CardContent>{children}</CardContent>
  </Card>
));
FormCard.displayName = 'Card.Form';

// Card para autenticacion
const AuthCard = React.forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => (
  <Card 
    ref={ref}
    variant="elevated"
    size="xl"
    className={cn(
      'w-full max-w-md mx-auto',
      'bg-bg-canvas',
      className
    )}
    {...props}
  >
    {children}
  </Card>
));
AuthCard.displayName = 'Card.Auth';

// Card seleccionable (para opciones)
const SelectableCard = React.forwardRef(({ 
  children,
  selected = false,
  onSelect,
  className = '',
  ...props 
}, ref) => (
  <Card 
    ref={ref}
    variant="interactive"
    selected={selected}
    clickable
    onClick={onSelect}
    className={cn(
      selected && 'border-interactive-default bg-yellow-50',
      className
    )}
    {...props}
  >
    {/* Selection indicator */}
    {selected && (
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-interactive-default rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-text-primary rounded-full"></div>
      </div>
    )}
    {children}
  </Card>
));
SelectableCard.displayName = 'Card.Selectable';

// Asignar subcomponentes
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Form = FormCard;
Card.Auth = AuthCard;
Card.Selectable = SelectableCard;

export default Card;