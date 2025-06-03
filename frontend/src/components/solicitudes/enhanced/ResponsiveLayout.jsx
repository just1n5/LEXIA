import React from 'react'
import { cn } from '../../../utils/cn'

/**
 * ResponsiveLayout - Layout que se adapta a mobile/desktop
 * Implementa mobile-first optimization del plan
 */
const ResponsiveLayout = ({ children, className = '' }) => {
  return (
    <div className={cn('w-full', className)}>
      {children}
    </div>
  )
}

/**
 * MobileView - Contenido específico para mobile
 */
export const MobileView = ({ children, className = '' }) => {
  return (
    <div className={cn('block lg:hidden', className)}>
      {children}
    </div>
  )
}

/**
 * DesktopView - Contenido específico para desktop
 */
export const DesktopView = ({ children, className = '' }) => {
  return (
    <div className={cn('hidden lg:block', className)}>
      {children}
    </div>
  )
}

/**
 * CollapsibleCard - Card que se puede colapsar en mobile
 */
export const CollapsibleCard = ({ 
  title, 
  children, 
  defaultOpen = false,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className={cn(
      'border border-border-default rounded-lg bg-bg-canvas',
      className
    )}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-lg py-md text-left hover:bg-bg-light transition-colors duration-200"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-heading-h4 font-heading text-text-primary">
            {title}
          </h3>
          <div className={cn(
            'transform transition-transform duration-200',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>
      
      <div className={cn(
        'overflow-hidden transition-all duration-300',
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="px-lg pb-lg">
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * SplitLayout - Layout de dos columnas para desktop
 */
export const SplitLayout = ({ children, className = '' }) => {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-xl', className)}>
      {children}
    </div>
  )
}

/**
 * MainPanel - Panel principal en split layout
 */
export const MainPanel = ({ children, className = '' }) => {
  return (
    <div className={cn('lg:col-span-2', className)}>
      {children}
    </div>
  )
}

/**
 * SidePanel - Panel lateral en split layout
 */
export const SidePanel = ({ children, className = '' }) => {
  return (
    <div className={cn('lg:col-span-1 space-y-lg', className)}>
      {children}
    </div>
  )
}

export default ResponsiveLayout