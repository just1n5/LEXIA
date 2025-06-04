import React, { useState, createContext, useContext, useEffect, useMemo, useCallback } from 'react'
import { ChevronDown, MoreHorizontal, Loader2, AlertTriangle, Zap } from 'lucide-react'
import { cn } from '../../../utils/cn'
import Button from '../../ui/Button'
import { TABS_CONFIG, RESPONSIVE_CONFIG, TAB_STATES_CONFIG, getTabOrder } from './TabsConfig'

/**
 * Context para el estado avanzado de tabs
 */
const EnhancedTabContext = createContext()

/**
 * TabContainer Enhanced - Versión mejorada con funcionalidades avanzadas
 */
const EnhancedTabContainer = ({ 
  defaultTab = 'resumen',
  children, 
  className = '',
  onTabChange,
  variant = 'enhanced',
  dataState = {},
  userPermissions = {},
  userPreferences = {},
  enableAnalytics = true,
  lazyLoad = true,
  preloadStrategy = 'adjacent'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [loadedTabs, setLoadedTabs] = useState(new Set([defaultTab]))
  const [preloadedTabs, setPreloadedTabs] = useState(new Set())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tabAnalytics, setTabAnalytics] = useState({})

  // Obtener orden de tabs personalizado
  const tabOrder = useMemo(() => getTabOrder(userPreferences), [userPreferences])

  // Detectar tamaño de pantalla
  const [screenSize, setScreenSize] = useState('desktop')
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setScreenSize('mobile')
      else if (width < 1024) setScreenSize('tablet') 
      else setScreenSize('desktop')
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Configuración responsive actual
  const responsiveConfig = RESPONSIVE_CONFIG[screenSize]

  // Manejar cambio de tab con analytics
  const handleTabChange = useCallback((tabId) => {
    const startTime = Date.now()
    
    // Analytics del tab anterior
    if (enableAnalytics && activeTab) {
      const timeSpent = startTime - (tabAnalytics[activeTab]?.startTime || startTime)
      setTabAnalytics(prev => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          timeSpent: (prev[activeTab]?.timeSpent || 0) + timeSpent,
          visits: (prev[activeTab]?.visits || 0) + 1
        }
      }))
    }

    // Lazy loading
    if (lazyLoad && !loadedTabs.has(tabId)) {
      setLoadedTabs(prev => new Set([...prev, tabId]))
    }

    // Preload estratégico
    if (preloadStrategy === 'adjacent') {
      const currentIndex = tabOrder.indexOf(tabId)
      const nextTab = tabOrder[currentIndex + 1]
      const prevTab = tabOrder[currentIndex - 1]
      
      const toPreload = [nextTab, prevTab].filter(Boolean)
      setPreloadedTabs(prev => new Set([...prev, ...toPreload]))
    }

    setActiveTab(tabId)
    setMobileMenuOpen(false)
    
    // Analytics del nuevo tab
    if (enableAnalytics) {
      setTabAnalytics(prev => ({
        ...prev,
        [tabId]: {
          ...prev[tabId],
          startTime
        }
      }))
    }

    onTabChange?.(tabId)
  }, [activeTab, enableAnalytics, lazyLoad, preloadStrategy, tabOrder, tabAnalytics, onTabChange])

  // Context value
  const contextValue = {
    activeTab,
    setActiveTab: handleTabChange,
    loadedTabs,
    preloadedTabs,
    screenSize,
    responsiveConfig,
    dataState,
    userPermissions,
    analytics: tabAnalytics
  }

  // Tabs visibles según configuración responsive
  const visibleTabs = useMemo(() => {
    const maxVisible = responsiveConfig.maxVisibleTabs
    if (maxVisible >= tabOrder.length) return tabOrder
    
    // En mobile, mostrar tabs primarios + activo si no está en primarios
    if (screenSize === 'mobile') {
      const primary = responsiveConfig.primaryTabs || []
      if (!primary.includes(activeTab)) {
        return [...primary.slice(0, maxVisible - 1), activeTab]
      }
      return primary.slice(0, maxVisible)
    }
    
    return tabOrder.slice(0, maxVisible)
  }, [responsiveConfig, tabOrder, screenSize, activeTab])

  const hiddenTabs = tabOrder.filter(tab => !visibleTabs.includes(tab))

  const variantClasses = {
    default: 'bg-white border border-gray-200 rounded-lg',
    enhanced: 'bg-bg-canvas border border-border-default rounded-lg shadow-sm',
    minimal: 'bg-transparent',
    card: 'bg-bg-canvas border border-border-default rounded-lg shadow-md'
  }

  return (
    <EnhancedTabContext.Provider value={contextValue}>
      <div className={cn('w-full', variantClasses[variant], className)}>
        {children}
      </div>
    </EnhancedTabContext.Provider>
  )
}

/**
 * TabNavigation - Lista de tabs con funcionalidades avanzadas
 */
const TabNavigation = ({ children, className = '' }) => {
  const { screenSize, responsiveConfig } = useContext(EnhancedTabContext)
  
  return (
    <div className={cn(
      'flex border-b border-border-default',
      'bg-bg-light',
      // Responsive behavior
      screenSize === 'mobile' && 'overflow-x-auto',
      className
    )}>
      <div className={cn(
        'flex',
        screenSize === 'mobile' ? 'min-w-full lg:min-w-0' : 'w-full'
      )}>
        {children}
      </div>
    </div>
  )
}

/**
 * Tab individual con estados avanzados
 */
const Tab = ({ 
  id, 
  label, 
  icon: Icon,
  disabled = false,
  className = '',
  badge,
  counter,
  loading
}) => {
  const { 
    activeTab, 
    setActiveTab, 
    dataState, 
    screenSize 
  } = useContext(EnhancedTabContext)
  
  const isActive = activeTab === id
  const tabConfig = TABS_CONFIG[id]
  const stateConfig = TAB_STATES_CONFIG[id]

  // Calcular estados dinámicos
  const dynamicCounter = useMemo(() => {
    if (counter !== undefined) return counter
    if (stateConfig?.counter) return stateConfig.counter(dataState)
    return null
  }, [counter, stateConfig, dataState])

  const dynamicBadge = useMemo(() => {
    if (badge !== undefined) return badge
    if (stateConfig?.badge) return stateConfig.badge(dataState)
    return null
  }, [badge, stateConfig, dataState])

  const isLoading = useMemo(() => {
    if (loading !== undefined) return loading
    if (stateConfig?.loading) return stateConfig.loading(dataState)
    return false
  }, [loading, stateConfig, dataState])

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(id)
    }
  }

  // Configuración de badge
  const getBadgeConfig = (badgeType) => {
    const configs = {
      alert: { bg: 'bg-feedback-error', text: 'text-bg-canvas', icon: AlertTriangle },
      active: { bg: 'bg-feedback-success', text: 'text-bg-canvas', icon: Zap },
      error: { bg: 'bg-feedback-error', text: 'text-bg-canvas' },
      new: { bg: 'bg-interactive-default', text: 'text-text-primary' },
      insights: { bg: 'bg-feedback-info', text: 'text-bg-canvas' },
      unsaved: { bg: 'bg-feedback-warning', text: 'text-text-primary' },
      optimize: { bg: 'bg-feedback-warning', text: 'text-text-primary', icon: Zap },
      scheduled: { bg: 'bg-feedback-info', text: 'text-bg-canvas' }
    }
    return configs[badgeType] || { bg: 'bg-bg-light', text: 'text-text-secondary' }
  }

  const badgeConfig = dynamicBadge ? getBadgeConfig(dynamicBadge) : null

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-sm px-lg py-md',
        'border-b-2 transition-all duration-200',
        'whitespace-nowrap font-medium text-body-paragraph',
        'min-h-[48px] relative',
        
        // Estados activo/inactivo
        isActive
          ? 'border-interactive-default text-interactive-default bg-interactive-default/10'
          : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-light',
        
        // Estado disabled
        disabled && 'opacity-50 cursor-not-allowed',
        
        // Estados de focus
        'focus:outline-none focus:ring-2 focus:ring-interactive-default focus:ring-offset-2',
        
        // Responsive
        screenSize === 'mobile' && 'min-w-[120px] justify-center',
        
        className
      )}
      aria-selected={isActive}
      role="tab"
      title={tabConfig?.description}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-canvas/80">
          <Loader2 className="w-4 h-4 animate-spin text-interactive-default" />
        </div>
      )}
      
      {/* Icono */}
      {Icon && (
        <span className={cn(
          'transition-colors duration-200',
          isActive ? 'text-interactive-default' : 'text-text-secondary'
        )}>
          <Icon className="w-4 h-4" />
        </span>
      )}
      
      {/* Label */}
      <span className={screenSize === 'mobile' ? 'text-sm' : ''}>{label}</span>
      
      {/* Badge especial */}
      {badgeConfig && (
        <div className={cn(
          'flex items-center gap-xs px-xs py-xs rounded-full text-xs font-medium min-w-[16px] h-5',
          'transition-colors duration-200',
          badgeConfig.bg,
          badgeConfig.text
        )}>
          {badgeConfig.icon && <badgeConfig.icon className="w-3 h-3" />}
        </div>
      )}
      
      {/* Contador */}
      {dynamicCounter !== null && dynamicCounter !== undefined && (
        <span className={cn(
          'ml-xs px-sm py-xs rounded-full text-xs font-medium min-w-[20px] text-center',
          'transition-colors duration-200',
          isActive
            ? 'bg-interactive-default text-text-primary'
            : 'bg-bg-light text-text-secondary'
        )}>
          {dynamicCounter}
        </span>
      )}
    </button>
  )
}

/**
 * Dropdown para tabs ocultos en mobile
 */
const TabDropdown = ({ hiddenTabs }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { setActiveTab, activeTab } = useContext(EnhancedTabContext)

  if (hiddenTabs.length === 0) return null

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        icon={<ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />}
        className="border-b-2 border-transparent hover:border-interactive-default rounded-none"
      >
        <MoreHorizontal className="w-4 h-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-bg-canvas border border-border-default rounded-lg shadow-lg z-50 min-w-[160px]">
          {hiddenTabs.map(tabId => {
            const config = TABS_CONFIG[tabId]
            const Icon = config.icon
            
            return (
              <button
                key={tabId}
                onClick={() => {
                  setActiveTab(tabId)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-sm px-md py-sm text-left',
                  'hover:bg-bg-light transition-colors',
                  'text-body-paragraph text-text-base',
                  activeTab === tabId && 'text-interactive-default bg-interactive-default/10'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{config.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * TabPanel con lazy loading
 */
const TabPanel = ({ 
  id, 
  children, 
  className = '',
  loading = false,
  fallback = null
}) => {
  const { activeTab, loadedTabs, preloadedTabs } = useContext(EnhancedTabContext)
  const isActive = activeTab === id
  const isLoaded = loadedTabs.has(id)
  const isPreloaded = preloadedTabs.has(id)

  // No renderizar si no está activo y no ha sido cargado
  if (!isActive && !isLoaded && !isPreloaded) return null

  return (
    <div 
      className={cn(
        'transition-all duration-300',
        isActive ? 'animate-in fade-in-0 duration-300' : 'hidden',
        className
      )}
      role="tabpanel"
      aria-hidden={!isActive}
    >
      {loading ? (
        <div className="flex items-center justify-center py-xl">
          <div className="flex items-center gap-sm">
            <Loader2 className="w-6 h-6 animate-spin text-interactive-default" />
            <span className="text-text-secondary">
              Cargando {TABS_CONFIG[id]?.label.toLowerCase()}...
            </span>
          </div>
        </div>
      ) : isLoaded || isActive ? (
        children
      ) : (
        fallback || (
          <div className="flex items-center justify-center py-xl">
            <span className="text-text-secondary">
              Preparando contenido...
            </span>
          </div>
        )
      )}
    </div>
  )
}

/**
 * Hook para controlar tabs programáticamente
 */
export const useEnhancedTabController = () => {
  const context = useContext(EnhancedTabContext)
  if (!context) {
    throw new Error('useEnhancedTabController must be used within an EnhancedTabContainer')
  }
  return context
}

/**
 * Componente compuesto
 */
EnhancedTabContainer.Navigation = TabNavigation
EnhancedTabContainer.Tab = Tab
EnhancedTabContainer.Panel = TabPanel
EnhancedTabContainer.Dropdown = TabDropdown

export default EnhancedTabContainer