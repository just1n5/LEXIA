import React, { useState, createContext, useContext, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '../../../utils/cn'
import Button from '../../ui/Button'

/**
 * TabContainer v2 - Sistema de tabs mejorado con lazy loading, responsive y persistencia
 */
const TabContext = createContext()

const TabContainer = ({ 
  defaultTab, 
  children, 
  className = '',
  onTabChange,
  variant = 'enhanced',
  persistState = true,
  lazyLoad = true,
  storageKey = 'tab-preferences'
}) => {
  // Estado persistente
  const getInitialTab = () => {
    if (persistState && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`${storageKey}-active-tab`)
      return stored || defaultTab
    }
    return defaultTab
  }

  const [activeTab, setActiveTab] = useState(getInitialTab)
  const [loadedTabs, setLoadedTabs] = useState(new Set([activeTab]))
  const [tabOrder, setTabOrder] = useState([])

  // Detectar tabs disponibles desde children
  const availableTabs = useMemo(() => {
    const tabs = []
    React.Children.forEach(children, child => {
      if (child?.type?.displayName === 'TabNavigation' || child?.type?.displayName === 'TabList') {
        React.Children.forEach(child.props.children, tabChild => {
          if (tabChild?.props?.id) {
            tabs.push({
              id: tabChild.props.id,
              label: tabChild.props.label,
              priority: tabChild.props.priority || 'secondary',
              hidden: tabChild.props.hidden || false
            })
          }
        })
      }
    })
    return tabs
  }, [children])

  useEffect(() => {
    if (availableTabs.length > 0 && tabOrder.length === 0) {
      // Establecer orden inicial: primarios primero, luego secundarios
      const primaryTabs = availableTabs.filter(tab => tab.priority === 'primary' && !tab.hidden)
      const secondaryTabs = availableTabs.filter(tab => tab.priority === 'secondary' && !tab.hidden)
      setTabOrder([...primaryTabs, ...secondaryTabs])
    }
  }, [availableTabs, tabOrder.length])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    
    // Persistir estado
    if (persistState && typeof window !== 'undefined') {
      localStorage.setItem(`${storageKey}-active-tab`, tabId)
    }
    
    // Lazy loading: marcar tab como cargado
    if (lazyLoad) {
      setLoadedTabs(prev => new Set([...prev, tabId]))
    }
    
    // Callback externo
    onTabChange?.(tabId)
  }

  const contextValue = {
    activeTab,
    setActiveTab: handleTabChange,
    loadedTabs: lazyLoad ? loadedTabs : new Set(availableTabs.map(t => t.id)),
    tabOrder,
    lazyLoad,
    variant
  }

  const variantClasses = {
    default: 'bg-bg-canvas border border-border-default rounded-lg',
    enhanced: 'bg-bg-canvas border border-border-default rounded-lg shadow-sm',
    minimal: 'bg-transparent',
    card: 'bg-bg-canvas border border-border-default rounded-lg shadow-md'
  }

  return (
    <TabContext.Provider value={contextValue}>
      <div className={cn('w-full overflow-hidden', variantClasses[variant], className)}>
        {children}
      </div>
    </TabContext.Provider>
  )
}

/**
 * TabNavigation - Nueva navegación con soporte para responsive y tabs secundarios
 */
const TabNavigation = ({ children, className = '' }) => {
  const { tabOrder } = useContext(TabContext)
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = React.useRef(null)

  // Separar tabs primarios y secundarios
  const primaryTabs = tabOrder.filter(tab => tab.priority === 'primary').slice(0, 3)
  const secondaryTabs = tabOrder.filter(tab => tab.priority === 'secondary')

  // Verificar capacidad de scroll
  const checkScrollCapability = () => {
    const container = scrollContainerRef.current
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth)
    }
  }

  useEffect(() => {
    checkScrollCapability()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollCapability)
      return () => container.removeEventListener('scroll', checkScrollCapability)
    }
  }, [])

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = 200
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center border-b border-border-default bg-bg-light">
        {/* Botón scroll izquierda */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll('left')}
            icon={<ChevronLeft className="w-4 h-4" />}
            className="flex-shrink-0 rounded-none border-r border-border-default"
            aria-label="Scroll tabs izquierda"
          />
        )}

        {/* Contenedor de tabs con scroll */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide flex-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex w-full lg:w-full">
            {children}
          </div>
        </div>

        {/* Botón scroll derecha */}
        {canScrollRight && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll('right')}
            icon={<ChevronRight className="w-4 h-4" />}
            className="flex-shrink-0 rounded-none border-l border-border-default"
            aria-label="Scroll tabs derecha"
          />
        )}

        {/* Menú de tabs secundarios */}
        {secondaryTabs.length > 0 && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSecondaryMenu(!showSecondaryMenu)}
              icon={<MoreHorizontal className="w-4 h-4" />}
              className="flex-shrink-0 rounded-none border-l border-border-default"
              aria-label="Más opciones"
            />
            
            {showSecondaryMenu && (
              <div className="absolute right-0 top-full mt-1 bg-bg-canvas border border-border-default rounded-md shadow-lg z-10 min-w-[200px]">
                {secondaryTabs.map(tab => (
                  <SecondaryTabItem key={tab.id} tab={tab} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Tab mejorado con estados visuales avanzados
 */
const Tab = ({ 
  id, 
  label, 
  count, 
  icon, 
  disabled = false,
  priority = 'secondary',
  indicators = {},
  className = '' 
}) => {
  const { activeTab, setActiveTab } = useContext(TabContext)
  const isActive = activeTab === id

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(id)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={cn(
        'relative flex items-center gap-xs px-md py-md',
        'border-b-2 transition-all duration-200',
        'whitespace-nowrap font-medium text-body-paragraph',
        'min-h-[48px] hover:bg-bg-light flex-1 justify-center',
        // Responsive: más compacto en desktop
        'lg:px-lg lg:gap-sm',
        // Estados activo/inactivo
        isActive
          ? 'border-interactive-default text-interactive-default bg-interactive-default/5'
          : 'border-transparent text-text-secondary hover:text-text-primary',
        // Estado disabled
        disabled && 'opacity-50 cursor-not-allowed',
        // Estados de focus para accesibilidad
        'focus:outline-none focus:ring-2 focus:ring-interactive-default focus:ring-offset-2',
        // Prioridad visual
        priority === 'primary' && 'font-semibold',
        className
      )}
      aria-selected={isActive}
      role="tab"
      tabIndex={disabled ? -1 : 0}
    >
      {/* Icono */}
      {icon && (
        <span className={cn(
          'transition-colors duration-200 flex-shrink-0',
          isActive ? 'text-interactive-default' : 'text-text-secondary'
        )}>
          {icon}
        </span>
      )}
      
      {/* Label */}
      <span className="truncate">{label}</span>
      
      {/* Contador */}
      {count !== undefined && (
        <span className={cn(
          'ml-xs px-xs py-xs rounded-full text-xs font-medium min-w-[20px] text-center',
          'transition-colors duration-200 flex-shrink-0',
          isActive
            ? 'bg-interactive-default text-text-primary'
            : 'bg-border-default text-text-secondary'
        )}>
          {count}
        </span>
      )}

      {/* Indicadores de estado */}
      {indicators.notification && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-feedback-error rounded-full animate-pulse" />
      )}
      
      {indicators.status === 'warning' && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-feedback-warning rounded-full" />
      )}
      
      {indicators.badge === 'new' && (
        <div className="absolute -top-1 -right-1 bg-feedback-success text-white text-xs px-1 rounded-full font-bold">
          •
        </div>
      )}
    </button>
  )
}

/**
 * TabPanel mejorado con lazy loading y estados
 */
const TabPanel = ({ 
  id, 
  children, 
  className = '',
  loading = false,
  error = null,
  loadingComponent = null,
  errorComponent = null
}) => {
  const { activeTab, loadedTabs, lazyLoad } = useContext(TabContext)
  const isActive = activeTab === id
  const isLoaded = loadedTabs.has(id)

  // Si no está activo y no debe renderizar, no mostrar nada
  if (!isActive) return null

  // Si usa lazy loading y no está cargado, mostrar loading
  if (lazyLoad && !isLoaded) {
    return (
      <div className={cn('p-lg', className)} role="tabpanel">
        {loadingComponent || <DefaultLoadingState />}
      </div>
    )
  }

  // Si hay error, mostrar componente de error
  if (error) {
    return (
      <div className={cn('p-lg', className)} role="tabpanel">
        {errorComponent || <DefaultErrorState error={error} />}
      </div>
    )
  }

  // Si está cargando, mostrar estado de carga
  if (loading) {
    return (
      <div className={cn('p-lg', className)} role="tabpanel">
        {loadingComponent || <DefaultLoadingState />}
      </div>
    )
  }

  return (
    <div 
      className={cn(
        'p-lg animate-in fade-in-0 duration-300',
        className
      )}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      id={`panel-${id}`}
    >
      {children}
    </div>
  )
}

/**
 * Componentes de estado por defecto
 */
const DefaultLoadingState = () => (
  <div className="flex items-center justify-center py-xl">
    <div className="flex items-center gap-md">
      <div className="w-6 h-6 border-2 border-interactive-default border-t-transparent rounded-full animate-spin" />
      <span className="text-body-paragraph text-text-secondary">
        Cargando contenido...
      </span>
    </div>
  </div>
)

const DefaultErrorState = ({ error }) => (
  <div className="flex flex-col items-center justify-center py-xl text-center">
    <div className="text-4xl mb-md">⚠️</div>
    <h3 className="text-heading-h3 font-heading text-feedback-error mb-sm">
      Error al cargar contenido
    </h3>
    <p className="text-body-paragraph text-text-secondary mb-lg">
      {error?.message || 'Ocurrió un error inesperado'}
    </p>
    <Button variant="secondary" onClick={() => window.location.reload()}>
      Reintentar
    </Button>
  </div>
)

/**
 * Item de tab secundario para dropdown
 */
const SecondaryTabItem = ({ tab }) => {
  const { setActiveTab, activeTab } = useContext(TabContext)
  const isActive = activeTab === tab.id

  return (
    <button
      onClick={() => setActiveTab(tab.id)}
      className={cn(
        'w-full px-md py-sm text-left hover:bg-bg-light transition-colors',
        'flex items-center gap-sm text-body-paragraph',
        isActive && 'bg-interactive-default/10 text-interactive-default'
      )}
    >
      <span>{tab.label}</span>
      {isActive && <span className="text-xs">✓</span>}
    </button>
  )
}

/**
 * Hook para controlar tabs programáticamente
 */
export const useTabController = () => {
  const context = useContext(TabContext)
  if (!context) {
    throw new Error('useTabController must be used within a TabContainer')
  }
  return context
}

/**
 * Hook para navegación por teclado
 */
export const useTabKeyboardNav = () => {
  const { activeTab, setActiveTab, tabOrder } = useTabController()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        const currentIndex = tabOrder.findIndex(tab => tab.id === activeTab)
        
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault()
            if (currentIndex > 0) {
              setActiveTab(tabOrder[currentIndex - 1].id)
            }
            break
          case 'ArrowRight':
            e.preventDefault()
            if (currentIndex < tabOrder.length - 1) {
              setActiveTab(tabOrder[currentIndex + 1].id)
            }
            break
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
            e.preventDefault()
            const tabIndex = parseInt(e.key) - 1
            if (tabOrder[tabIndex]) {
              setActiveTab(tabOrder[tabIndex].id)
            }
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab, setActiveTab, tabOrder])
}

/**
 * Componente compuesto con subcomponentes
 */
TabContainer.Navigation = TabNavigation
TabContainer.Tab = Tab
TabContainer.Panel = TabPanel

// Aliases para compatibilidad
TabContainer.List = TabNavigation  // Alias para retrocompatibilidad

export default TabContainer