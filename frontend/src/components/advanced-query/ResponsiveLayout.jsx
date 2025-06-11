// src/components/advanced-query/ResponsiveLayout.jsx
import React, { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * 📱 ResponsiveLayout - Layout adaptativo para formulario avanzado
 * 
 * Optimiza la disposición del contenido según el tamaño de pantalla,
 * mejorando la experiencia en móviles y tablets.
 */
const ResponsiveLayout = ({ 
  mainContent, 
  sideContent, 
  className = '',
  sideContentTitle = "Ayuda contextual",
  collapsibleSide = true,
  ...props 
}) => {
  const [isMobile, setIsMobile] = useState(false)
  const [sideCollapsed, setSideCollapsed] = useState(false)

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024 // lg breakpoint
      setIsMobile(mobile)
      
      // Auto-colapsar en móvil si está configurado
      if (mobile && collapsibleSide) {
        setSideCollapsed(true)
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [collapsibleSide])

  return (
    <div className={cn('w-full', className)} {...props}>
      {isMobile ? (
        // Layout móvil - stack vertical con contenido lateral colapsable
        <div className="space-y-md">
          {/* Contenido principal */}
          <div className="w-full">
            {mainContent}
          </div>

          {/* Contenido lateral colapsable en móvil */}
          {sideContent && (
            <div className="w-full">
              {collapsibleSide ? (
                <div className="border border-border-default rounded-lg overflow-hidden">
                  <button
                    className="w-full px-md py-sm bg-bg-light border-b border-border-default flex items-center justify-between text-body-paragraph font-medium text-text-primary hover:bg-bg-canvas transition-colors"
                    onClick={() => setSideCollapsed(!sideCollapsed)}
                  >
                    <div className="flex items-center gap-sm">
                      <HelpCircle className="w-4 h-4 text-feedback-info" />
                      {sideContentTitle}
                    </div>
                    {sideCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                  
                  {!sideCollapsed && (
                    <div className="p-md">
                      {sideContent}
                    </div>
                  )}
                </div>
              ) : (
                <div className="border border-border-default rounded-lg p-md">
                  {sideContent}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // Layout desktop - grid con sidebar
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            {mainContent}
          </div>

          {/* Contenido lateral */}
          {sideContent && (
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                {sideContent}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

ResponsiveLayout.displayName = 'ResponsiveLayout'

export default ResponsiveLayout