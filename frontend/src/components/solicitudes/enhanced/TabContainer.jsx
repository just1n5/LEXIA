import React, { useState, createContext, useContext } from 'react'
import { cn } from '../../../utils/cn'

/**
 * TabContainer - Sistema de tabs inteligentes con contadores y estado persistente
 */
const TabContext = createContext()

const TabContainer = ({ 
  defaultTab, 
  children, 
  className = '',
  onTabChange,
  variant = 'default'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  const contextValue = {
    activeTab,
    setActiveTab: handleTabChange
  }

  const variantClasses = {
    default: 'bg-white border border-gray-200 rounded-lg',
    minimal: 'bg-transparent',
    card: 'bg-white border border-gray-200 rounded-lg shadow-md'
  }

  return (
    <TabContext.Provider value={contextValue}>
      <div className={cn('w-full', variantClasses[variant], className)}>
        {children}
      </div>
    </TabContext.Provider>
  )
}

/**
 * TabList - Lista de tabs con scroll horizontal en mobile
 */
const TabList = ({ children, className = '' }) => {
  return (
    <div className={cn(
      'flex border-b border-gray-200',
      'overflow-x-auto',
      'bg-gray-50',
      className
    )}>
      <div className="flex min-w-full lg:min-w-0">
        {children}
      </div>
    </div>
  )
}

/**
 * Tab - Botón individual de tab con contador y estados
 */
const Tab = ({ 
  id, 
  label, 
  count, 
  icon, 
  disabled = false,
  className = '' 
}) => {
  const { activeTab, setActiveTab } = useContext(TabContext)
  const isActive = activeTab === id

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(id)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 px-6 py-3',
        'border-b-2 transition-all duration-200',
        'whitespace-nowrap font-medium text-sm',
        'min-h-[48px]',
        // Estados activo/inactivo
        isActive
          ? 'border-yellow-400 text-yellow-600 bg-yellow-50'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100',
        // Estado disabled
        disabled && 'opacity-50 cursor-not-allowed',
        // Estados de focus
        'focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2',
        className
      )}
      aria-selected={isActive}
      role="tab"
    >
      {/* Icono */}
      {icon && (
        <span className={cn(
          'transition-colors duration-200',
          isActive ? 'text-yellow-600' : 'text-gray-500'
        )}>
          {icon}
        </span>
      )}
      
      {/* Label */}
      <span>{label}</span>
      
      {/* Contador */}
      {count !== undefined && (
        <span className={cn(
          'ml-1 px-2 py-1 rounded-full text-xs font-medium min-w-[20px] text-center',
          'transition-colors duration-200',
          isActive
            ? 'bg-yellow-400 text-gray-800'
            : 'bg-gray-200 text-gray-600'
        )}>
          {count}
        </span>
      )}
    </button>
  )
}

/**
 * TabPanel - Contenido de un tab con animaciones de entrada
 */
const TabPanel = ({ 
  id, 
  children, 
  className = '',
  loading = false 
}) => {
  const { activeTab } = useContext(TabContext)
  const isActive = activeTab === id

  if (!isActive) return null

  return (
    <div 
      className={cn(
        'p-6 animate-in fade-in-0 duration-300',
        className
      )}
      role="tabpanel"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">
              Cargando contenido...
            </span>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
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
 * Componente compuesto con subcomponentes
 */
TabContainer.List = TabList
TabContainer.Tab = Tab
TabContainer.Panel = TabPanel

export default TabContainer