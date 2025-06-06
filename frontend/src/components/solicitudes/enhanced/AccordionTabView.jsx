import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '../../../utils/cn'

/**
 * Componente AccordionTabView - Patrón mobile-first para tabs
 * Convierte tabs en acordeón vertical en dispositivos móviles
 */
const AccordionTabView = ({ 
  tabs = [], 
  defaultOpen = null,
  allowMultiple = false,
  children,
  className = ''
}) => {
  const [openPanels, setOpenPanels] = useState(
    defaultOpen ? [defaultOpen] : []
  )

  const togglePanel = (tabId) => {
    if (allowMultiple) {
      setOpenPanels(prev => 
        prev.includes(tabId) 
          ? prev.filter(id => id !== tabId)
          : [...prev, tabId]
      )
    } else {
      setOpenPanels(prev => 
        prev.includes(tabId) ? [] : [tabId]
      )
    }
  }

  const isOpen = (tabId) => openPanels.includes(tabId)

  return (
    <div className={cn('space-y-sm', className)}>
      {tabs.map((tab) => (
        <AccordionPanel
          key={tab.id}
          tab={tab}
          isOpen={isOpen(tab.id)}
          onToggle={() => togglePanel(tab.id)}
        >
          {children}
        </AccordionPanel>
      ))}
    </div>
  )
}

/**
 * Panel individual del acordeón
 */
const AccordionPanel = ({ 
  tab, 
  isOpen, 
  onToggle, 
  children 
}) => {
  return (
    <div className="border border-border-default rounded-lg overflow-hidden bg-bg-canvas">
      {/* Header del panel */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full px-md py-sm flex items-center justify-between',
          'text-left transition-colors duration-200',
          'hover:bg-bg-light focus:bg-bg-light focus:outline-none',
          'focus:ring-2 focus:ring-interactive-default focus:ring-inset',
          isOpen && 'bg-bg-light border-b border-border-default'
        )}
        aria-expanded={isOpen}
        aria-controls={`panel-${tab.id}`}
      >
        <div className="flex items-center gap-sm flex-1">
          {/* Icono del tab */}
          {tab.icon && (
            <span className="text-text-secondary">
              {tab.icon}
            </span>
          )}
          
          {/* Label y contadores */}
          <div className="flex items-center gap-xs flex-1">
            <span className="text-body-paragraph font-medium text-text-primary">
              {tab.label}
            </span>
            
            {/* Badges e indicadores */}
            {tab.count > 0 && (
              <span className="px-xs py-0.5 bg-interactive-default text-text-base text-body-auxiliary font-medium rounded-full">
                {tab.count}
              </span>
            )}
            
            {tab.indicators?.badge && (
              <span className={cn(
                'px-xs py-0.5 text-body-auxiliary font-medium rounded-full',
                tab.indicators.badge === 'new' && 'bg-feedback-success text-bg-canvas',
                tab.indicators.badge === 'paused' && 'bg-feedback-warning text-text-base'
              )}>
                {tab.indicators.badge === 'new' ? 'Nuevo' : 'Pausado'}
              </span>
            )}
          </div>
        </div>
        
        {/* Indicador de expansión */}
        <span className="text-text-secondary transition-transform duration-200">
          {isOpen ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </span>
      </button>
      
      {/* Contenido del panel */}
      {isOpen && (
        <div 
          id={`panel-${tab.id}`}
          className="px-md py-lg animate-in slide-in-from-top-2 duration-200"
        >
          {children}
        </div>
      )}
    </div>
  )
}

/**
 * Wrapper para usar con TabContainer existente
 */
const TabAccordionWrapper = ({ 
  tabsConfig, 
  children, 
  defaultOpen = 'resumen' 
}) => {
  // Convertir configuración de tabs a formato acordeón
  const accordionTabs = Object.values(tabsConfig).map(tab => ({
    id: tab.id,
    label: tab.label,
    icon: tab.icon,
    count: tab.count || 0,
    indicators: tab.indicators || {}
  }))

  return (
    <AccordionTabView 
      tabs={accordionTabs}
      defaultOpen={defaultOpen}
      allowMultiple={false}
    >
      {children}
    </AccordionTabView>
  )
}

export default AccordionTabView
export { AccordionPanel, TabAccordionWrapper }
