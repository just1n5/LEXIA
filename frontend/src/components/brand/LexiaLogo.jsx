import React from 'react'
import clsx from 'clsx'

const LexiaLogo = ({ 
  size = "md", 
  variant = "default", 
  showIcon = true,
  showText = false,
  className = "",
  useRealLogo = true,
  textColor = "auto"
}) => {
  const sizes = {
    xs: { 
      container: "h-6", 
      logo: "h-6", 
      text: "text-sm",
      spacing: "gap-1"
    },
    sm: { 
      container: "h-8", 
      logo: "h-8", 
      text: "text-base",
      spacing: "gap-2"
    },
    md: { 
      container: "h-12", 
      logo: "h-12", 
      text: "text-lg",
      spacing: "gap-2"
    },
    lg: { 
      container: "h-16", 
      logo: "h-16", 
      text: "text-xl",
      spacing: "gap-3"
    },
    xl: { 
      container: "h-24", 
      logo: "h-24", 
      text: "text-2xl",
      spacing: "gap-4"
    },
    header: { 
      container: "h-8", 
      logo: "h-8", 
      text: "text-base font-bold",
      spacing: "gap-2"
    }
  }
  
  const variants = {
    default: {
      filter: "none",
      text: textColor === "auto" ? "text-text-primary" : textColor
    },
    light: {
      filter: "brightness(0) invert(1)",
      text: textColor === "auto" ? "text-white" : textColor
    },
    dark: {
      filter: "none",
      text: textColor === "auto" ? "text-text-primary" : textColor
    }
  }
  
  const currentSize = sizes[size]
  const currentVariant = variants[variant]
  
  const renderRealLogo = () => (
    <img
      src="/logos/lexia-logo.png"
      alt="LEXIA"
      className={clsx(
        currentSize.logo,
        "object-contain transition-all duration-200"
      )}
      style={{
        filter: currentVariant.filter,
        maxWidth: "auto",
        height: "100%"
      }}
      onError={(e) => {
        console.warn('Logo LEXIA no encontrado, usando fallback')
        e.target.style.display = 'none'
        if (e.target.nextSibling) {
          e.target.nextSibling.style.display = 'flex'
        }
      }}
    />
  )

  const renderPlaceholderLogo = () => (
    <div 
      className={clsx(
        currentSize.logo,
        "rounded-lg flex items-center justify-center bg-gradient-to-br from-interactive-default to-yellow-500",
        "transition-all duration-200"
      )}
      style={{ 
        display: useRealLogo ? 'none' : 'flex'
      }}
    >
      <span className={clsx(
        "font-bold text-white",
        size === "xs" ? "text-xs" :
        size === "sm" ? "text-sm" :
        size === "md" ? "text-lg" :
        size === "lg" ? "text-xl" :
        "text-2xl"
      )}>
        L
      </span>
    </div>
  )

  const renderText = () => {
    if (!showText) return null
    
    return (
      <span className={clsx(
        "font-heading font-bold tracking-tight transition-all duration-200 select-none",
        currentSize.text,
        currentVariant.text,
        size === "header" && "drop-shadow-sm"
      )}>
        LEXIA
      </span>
    )
  }

  return (
    <div className={clsx(
      "flex items-center transition-all duration-200",
      showIcon && showText ? currentSize.spacing : "",
      currentSize.container,
      className
    )}>
      {showIcon && (
        <div className="relative flex-shrink-0">
          {useRealLogo && renderRealLogo()}
          {renderPlaceholderLogo()}
        </div>
      )}
      
      {renderText()}
    </div>
  )
}

export const LexiaLogoImage = ({ 
  size = "md", 
  variant = "default",
  className = "" 
}) => {
  return (
    <LexiaLogo 
      size={size}
      variant={variant}
      showIcon={true}
      showText={false}
      useRealLogo={true}
      className={className}
    />
  )
}

export const LexiaLogoBrand = ({ 
  size = "md", 
  variant = "default",
  className = "",
  textColor = "auto"
}) => {
  return (
    <LexiaLogo 
      size={size}
      variant={variant}
      showIcon={true}
      showText={true}
      useRealLogo={true}
      textColor={textColor}
      className={className}
    />
  )
}

export const LexiaHeaderLogo = ({ 
  variant = "default",
  className = "" 
}) => {
  const textColor = variant === "light" 
    ? "text-white drop-shadow-md" 
    : "text-text-primary drop-shadow-sm"
    
  return (
    <LexiaLogoBrand
      size="header"
      variant={variant}
      textColor={textColor}
      className={clsx(
        "hover:scale-105 active:scale-95 transition-transform duration-200",
        className
      )}
    />
  )
}

export const LexiaTextOnly = ({ 
  size = "md",
  variant = "default",
  className = ""
}) => {
  return (
    <LexiaLogo 
      size={size}
      variant={variant}
      showIcon={false}
      showText={true}
      className={className}
    />
  )
}

export default LexiaLogo