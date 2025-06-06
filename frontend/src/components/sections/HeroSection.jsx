import React from 'react'
import clsx from 'clsx'
import LexiaLogo from '../brand/LexiaLogo'

const HeroSection = ({ 
  showBackground = true,
  size = "default",
  className = ""
}) => {
  const sizes = {
    compact: {
      container: "p-lg",
      title: "text-3xl md:text-4xl",
      subtitle: "text-lg",
      spacing: "mb-md"
    },
    default: {
      container: "p-xl py-2xl",
      title: "text-4xl md:text-5xl lg:text-6xl",
      subtitle: "text-xl",
      spacing: "mb-lg"
    },
    hero: {
      container: "p-2xl py-3xl",
      title: "text-5xl md:text-6xl lg:text-7xl",
      subtitle: "text-xl md:text-2xl",
      spacing: "mb-xl"
    }
  }
  
  const currentSize = sizes[size]
  
  return (
    <div className={clsx(
      "relative rounded-xl text-white overflow-hidden",
      showBackground ? "bg-gradient-to-br from-interactive-default via-yellow-400 to-yellow-500" : "bg-text-primary",
      currentSize.container,
      className
    )}>
      {/* Patrón de fondo sutil */}
      {showBackground && (
        <>
          <div className="absolute inset-0 bg-white bg-opacity-5 bg-[radial-gradient(circle_at_20%_80%,white_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5"></div>
        </>
      )}
      
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Logo */}
        <div className={currentSize.spacing}>
          <LexiaLogo 
            size={size === "compact" ? "lg" : "xl"} 
            variant="light" 
            useRealLogo={true}
            className="mx-auto" 
          />
        </div>
        
        {/* Título principal */}
        <h1 className={clsx(
          "font-heading font-bold leading-tight tracking-tight",
          currentSize.title,
          currentSize.spacing
        )}>
          Automatización Jurídica
          <br />
          <span className="font-normal opacity-90 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Inteligente
          </span>
        </h1>
        
        {/* Subtítulo */}
        <p className={clsx(
          "opacity-90 max-w-3xl mx-auto font-sans",
          currentSize.subtitle,
          size === "compact" ? "mb-lg" : "mb-xl"
        )}>
          Revoluciona tu práctica legal con Inteligencia Artificial avanzada y automatización robótica para consultas judiciales en tiempo real
        </p>
        
        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-md justify-center">
          <a 
            href="/solicitudes/select-type"
            className="inline-flex items-center justify-center px-lg py-md bg-white text-interactive-default hover:bg-gray-50 shadow-lg rounded-md font-medium transition-all duration-200 hover:scale-105"
          >
            Comenzar Ahora
          </a>
          <a 
            href="/dashboard"
            className="inline-flex items-center justify-center px-lg py-md text-white border border-white/50 hover:bg-white/10 hover:border-white rounded-md font-medium transition-all duration-200"
          >
            Ver Demo ▶
          </a>
        </div>
        
        {/* Features destacados */}
        {size !== "compact" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md mt-xl text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-md">
              <div className="text-2xl mb-sm">🤖</div>
              <div className="font-medium text-sm">IA Avanzada</div>
              <div className="text-xs opacity-80">Automatización inteligente</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-md">
              <div className="text-2xl mb-sm">⚡</div>
              <div className="font-medium text-sm">Tiempo Real</div>
              <div className="text-xs opacity-80">Consultas instantáneas 24/7</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-md">
              <div className="text-2xl mb-sm">🛡️</div>
              <div className="font-medium text-sm">Seguridad Total</div>
              <div className="text-xs opacity-80">Encriptación y compliance</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeroSection