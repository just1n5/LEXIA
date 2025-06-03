// components/historial/EnhancedLoadingStates.jsx
import React from 'react'
import { RefreshCw, FileText, Clock } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * 🎨 ENHANCED LOADING STATES
 * Mejores estados de carga con skeleton screens realistas
 */
export const HistorialTableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="space-y-md">
      {/* Header skeleton */}
      <div className="grid grid-cols-6 gap-lg p-lg border-b border-border-default">
        {['Solicitud', 'Fecha', 'Radicado', 'Despacho', 'Último Auto', 'Acciones'].map((header, i) => (
          <div key={i} className="h-5 bg-bg-light rounded animate-pulse" />
        ))}
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-6 gap-lg p-lg border-b border-border-default">
          {/* Solicitud column - más detallado */}
          <div className="space-y-xs">
            <div className="h-4 bg-bg-light rounded animate-pulse" />
            <div className="h-3 w-16 bg-feedback-success-light rounded animate-pulse" />
          </div>
          
          {/* Fecha column */}
          <div className="h-4 w-20 bg-bg-light rounded animate-pulse" />
          
          {/* Radicado column */}
          <div className="h-4 bg-bg-light rounded animate-pulse" />
          
          {/* Despacho column */}
          <div className="h-4 bg-bg-light rounded animate-pulse" />
          
          {/* Último Auto column */}
          <div className="h-4 w-16 bg-bg-light rounded animate-pulse" />
          
          {/* Acciones column */}
          <div className="flex space-x-sm">
            <div className="w-8 h-8 bg-bg-light rounded animate-pulse" />
            <div className="w-8 h-8 bg-bg-light rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

export const HistorialCardSkeleton = () => {
  return (
    <div className="bg-bg-canvas rounded-lg border border-border-default p-lg space-y-md">
      <div className="flex justify-between items-start">
        <div className="space-y-xs flex-1">
          <div className="h-5 bg-bg-light rounded animate-pulse w-3/4" />
          <div className="h-3 w-20 bg-feedback-info-light rounded animate-pulse" />
        </div>
        <div className="h-6 w-16 bg-bg-light rounded animate-pulse" />
      </div>
      
      <div className="space-y-sm">
        <div className="h-4 bg-bg-light rounded animate-pulse w-1/2" />
        <div className="h-4 bg-bg-light rounded animate-pulse w-2/3" />
      </div>
      
      <div className="flex justify-between items-center pt-sm border-t border-border-default">
        <div className="h-3 w-24 bg-bg-light rounded animate-pulse" />
        <div className="flex space-x-sm">
          <div className="w-8 h-8 bg-bg-light rounded animate-pulse" />
          <div className="w-8 h-8 bg-bg-light rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

/**
 * 🎭 PROGRESSIVE LOADING
 * Carga progresiva con transiciones suaves
 */
export const ProgressiveLoader = ({ 
  isLoading, 
  progress = 0, 
  message = 'Cargando historial...',
  children 
}) => {
  if (!isLoading) return children

  return (
    <div className="relative">
      {/* Overlay de carga */}
      <div className="absolute inset-0 bg-bg-canvas bg-opacity-80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
        <div className="text-center space-y-lg">
          {/* Spinner mejorado */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-border-default rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-interactive-default border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          {/* Mensaje de estado */}
          <div className="space-y-sm">
            <p className="text-body-paragraph text-text-primary font-medium">
              {message}
            </p>
            
            {/* Barra de progreso */}
            {progress > 0 && (
              <div className="w-64 h-2 bg-bg-light rounded-full overflow-hidden">
                <div 
                  className="h-full bg-interactive-default transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Contenido con opacidad reducida */}
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </div>
  )
}

/**
 * 🎯 SMART REFRESH INDICATOR
 * Indicador inteligente de actualizaciones
 */
export const SmartRefreshIndicator = ({ 
  isRefreshing, 
  lastUpdated, 
  onRefresh 
}) => {
  const getTimeAgo = () => {
    if (!lastUpdated) return 'Nunca'
    const now = new Date()
    const diff = now - new Date(lastUpdated)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (minutes < 1) return 'Ahora mismo'
    if (minutes < 60) return `Hace ${minutes} min`
    if (hours < 24) return `Hace ${hours}h`
    return new Date(lastUpdated).toLocaleDateString()
  }

  return (
    <div className="flex items-center justify-between py-sm px-lg bg-bg-light border-b border-border-default">
      <div className="flex items-center space-x-sm text-body-auxiliary text-text-secondary">
        <div className={cn(
          "w-2 h-2 rounded-full transition-colors duration-300",
          isRefreshing ? "bg-interactive-default animate-pulse" : "bg-feedback-success"
        )} />
        <span>
          Última actualización: {getTimeAgo()}
        </span>
      </div>
      
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className={cn(
          "text-body-auxiliary text-interactive-default hover:text-interactive-hover transition-colors",
          isRefreshing && "animate-spin"
        )}
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  )
}

/**
 * 🔄 TRANSITION WRAPPER
 * Wrapper para transiciones suaves entre estados
 */
export const TransitionWrapper = ({ 
  isVisible, 
  children, 
  type = 'fade',
  duration = 200,
  className = '' 
}) => {
  const transitions = {
    fade: {
      enter: 'transition-opacity duration-200 ease-in-out opacity-0',
      enterActive: 'opacity-100',
      exit: 'transition-opacity duration-200 ease-in-out opacity-100',
      exitActive: 'opacity-0'
    },
    slide: {
      enter: 'transition-transform duration-200 ease-in-out transform translate-y-2 opacity-0',
      enterActive: 'translate-y-0 opacity-100',
      exit: 'transition-transform duration-200 ease-in-out transform translate-y-0 opacity-100',
      exitActive: 'translate-y-2 opacity-0'
    },
    scale: {
      enter: 'transition-transform duration-200 ease-in-out transform scale-95 opacity-0',
      enterActive: 'scale-100 opacity-100',
      exit: 'transition-transform duration-200 ease-in-out transform scale-100 opacity-100',
      exitActive: 'scale-95 opacity-0'
    }
  }

  const currentTransition = transitions[type] || transitions.fade

  return (
    <div 
      className={cn(
        currentTransition.enter,
        isVisible && currentTransition.enterActive,
        !isVisible && currentTransition.exitActive,
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}

/**
 * 💫 MICRO INTERACTION COMPONENTS
 * Pequeños componentes para micro-interacciones
 */
export const HoverCard = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={cn(
        "transition-all duration-200 ease-in-out",
        "hover:shadow-md hover:-translate-y-1 hover:scale-[1.02]",
        "active:scale-[0.98] active:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const PulseOnUpdate = ({ value, children, className = '' }) => {
  const [isUpdating, setIsUpdating] = React.useState(false)
  const prevValue = React.useRef(value)

  React.useEffect(() => {
    if (prevValue.current !== value) {
      setIsUpdating(true)
      prevValue.current = value
      
      const timer = setTimeout(() => {
        setIsUpdating(false)
      }, 600)
      
      return () => clearTimeout(timer)
    }
  }, [value])

  return (
    <div 
      className={cn(
        "transition-all duration-300",
        isUpdating && "animate-pulse bg-interactive-default bg-opacity-10 rounded",
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * 📊 LOADING STATES FOR DIFFERENT CONTEXTS
 */
export const FilterLoadingState = () => (
  <div className="bg-bg-canvas rounded-lg border border-border-default p-lg">
    <div className="animate-pulse space-y-md">
      <div className="h-5 bg-bg-light rounded w-1/4" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="h-10 bg-bg-light rounded" />
        <div className="h-10 bg-bg-light rounded" />
        <div className="h-10 bg-bg-light rounded" />
      </div>
    </div>
  </div>
)

export const StatsLoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-bg-canvas rounded-lg border border-border-default p-lg">
        <div className="animate-pulse space-y-sm">
          <div className="flex items-center space-x-sm">
            <div className="w-5 h-5 bg-bg-light rounded" />
            <div className="h-4 bg-bg-light rounded w-1/2" />
          </div>
          <div className="h-8 bg-bg-light rounded w-3/4" />
          <div className="h-3 bg-bg-light rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
)