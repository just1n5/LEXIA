import React from 'react'
import clsx from 'clsx'

const LexiaLogo = ({ 
  size = "md", 
  variant = "default", 
  showIcon = true,
  showText = false, // Cambiado a false por defecto ya que el logo incluye texto
  className = "",
  useRealLogo = true // Nueva prop para alternar entre logo real y placeholder
}) => {
  const sizes = {
    xs: { container: "h-6", logo: "h-6", text: "text-lg" },
    sm: { container: "h-8", logo: "h-8", text: "text-xl" },
    md: { container: "h-12", logo: "h-12", text: "text-2xl" },
    lg: { container: "h-16", logo: "h-16", text: "text-3xl" },
    xl: { container: "h-24", logo: "h-24", text: "text-4xl" },
    header: { container: "h-16", logo: "h-16", text: "text-2xl" } // Tamaño especial para headers (aumentado)
  }
  
  const variants = {
    default: {
      filter: "none",
      text: "text-text-primary"
    },
    light: {
      filter: "brightness(0) invert(1)", // Invertir colores para fondos oscuros
      text: "text-white"
    },
    dark: {
      filter: "none",
      text: "text-text-primary"
    },
    monochrome: {
      filter: "grayscale(1)",
      text: "text-text-primary"
    }
  }
  
  const currentSize = sizes[size]
  const currentVariant = variants[variant]
  
  // Si useRealLogo es true y showIcon es true, mostrar logo real
  if (useRealLogo && showIcon) {
    return (
      <div className={clsx(
        "flex items-center",
        showIcon && showText ? "gap-3" : "",
        currentSize.container,
        className
      )}>
        {/* Logo Real LEXIA */}
        <img
          src="/logos/lexia-logo.png"
          alt="LEXIA - Automatización Jurídica Inteligente"
          className={clsx(
            currentSize.logo,
            "object-contain transition-all duration-200 hover:scale-105"
          )}
          style={{
            filter: currentVariant.filter,
            maxWidth: "auto",
            height: "100%"
          }}
          onError={(e) => {
            // Fallback al logo placeholder si falla la carga
            console.warn('Logo no encontrado, usando fallback')
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        
        {/* Fallback placeholder (oculto inicialmente) */}
        <div 
          className={clsx(
            currentSize.logo,
            "rounded-lg flex items-center justify-center bg-gradient-to-br from-interactive-default to-yellow-500",
            "transition-all duration-200 hover:scale-105"
          )}
          style={{ display: 'none' }}
        >
          <span className={clsx(
            "font-bold text-white",
            size === "xs" ? "text-xs" :
            size === "sm" ? "text-sm" :
            size === "md" ? "text-lg" :
            size === "lg" ? "text-xl" :
            "text-2xl"
          )}>
            ⚖
          </span>
        </div>
        
        {/* Texto adicional si se requiere */}
        {showText && (
          <span className={clsx(
            "font-heading font-bold tracking-tight",
            currentSize.text,
            currentVariant.text,
            "transition-all duration-200"
          )}>
            LEXIA
          </span>
        )}
      </div>
    )
  }
  
  // Fallback al logo placeholder original
  return (
    <div className={clsx(
      "flex items-center",
      showIcon && showText ? "gap-3" : "",
      currentSize.container,
      className
    )}>
      {/* Icono LEXIA placeholder */}
      {showIcon && (
        <div className={clsx(
          currentSize.logo,
          "bg-gradient-to-br from-interactive-default to-yellow-500",
          "rounded-lg flex items-center justify-center",
          "transition-all duration-200 hover:scale-105"
        )}>
          <span className={clsx(
            "font-bold text-white",
            size === "xs" ? "text-xs" :
            size === "sm" ? "text-sm" :
            size === "md" ? "text-lg" :
            size === "lg" ? "text-xl" :
            "text-2xl"
          )}>
            ⚖
          </span>
        </div>
      )}
      
      {/* Texto LEXIA */}
      {showText && (
        <span className={clsx(
          "font-heading font-bold tracking-tight",
          currentSize.text,
          currentVariant.text,
          "transition-all duration-200"
        )}>
          LEXIA
        </span>
      )}
    </div>
  )
}

// Componente específico para mostrar solo la imagen del logo
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

// Componente para mostrar logo + texto
export const LexiaLogoBrand = ({ 
  size = "md", 
  variant = "default",
  className = "" 
}) => {
  return (
    <LexiaLogo 
      size={size}
      variant={variant}
      showIcon={true}
      showText={true}
      useRealLogo={true}
      className={className}
    />
  )
}

export default LexiaLogo