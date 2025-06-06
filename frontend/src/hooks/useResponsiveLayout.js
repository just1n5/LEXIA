import { useState, useEffect } from 'react'

/**
 * Hook para gestionar layout responsivo según el plan de mejoras
 * Implementa patrones adaptativos: Accordion (mobile) -> Scrollable (tablet) -> Full (desktop)
 */
export const useResponsiveLayout = () => {
  const [layout, setLayout] = useState('desktop')
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  })

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth
      setScreenSize({
        width,
        height: window.innerHeight
      })

      // Breakpoints según el design system
      if (width < 640) {
        setLayout('mobile')      // Accordion pattern
      } else if (width < 1024) {
        setLayout('tablet')      // Scrollable tabs
      } else {
        setLayout('desktop')     // Full tabs
      }
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  return {
    layout,
    screenSize,
    isMobile: layout === 'mobile',
    isTablet: layout === 'tablet',
    isDesktop: layout === 'desktop',
    // Helpers para componentes
    shouldUseAccordion: layout === 'mobile',
    shouldUseScrollableTabs: layout === 'tablet',
    shouldShowSidebar: layout === 'desktop'
  }
}

/**
 * Hook para gestos táctiles en tabs (swipe navigation)
 */
export const useSwipeGestures = ({ 
  onSwipeLeft, 
  onSwipeRight, 
  threshold = 100,
  preventScroll = true 
}) => {
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    if (preventScroll) {
      e.preventDefault()
    }
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > threshold
    const isRightSwipe = distance < -threshold

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft()
    } else if (isRightSwipe && onSwipeRight) {
      onSwipeRight()
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}

/**
 * Hook para navegación por teclado avanzada
 */
export const useAdvancedKeyboardNav = (tabs = [], activeTab, setActiveTab) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Navegación entre tabs
      if (e.ctrlKey || e.metaKey) {
        const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
        
        switch (e.key) {
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
            e.preventDefault()
            const tabIndex = parseInt(e.key) - 1
            if (tabs[tabIndex]) {
              setActiveTab(tabs[tabIndex].id)
            }
            break
            
          case 'ArrowLeft':
            e.preventDefault()
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
            setActiveTab(tabs[prevIndex].id)
            break
            
          case 'ArrowRight':
            e.preventDefault()
            const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
            setActiveTab(tabs[nextIndex].id)
            break
        }
      }
      
      // Ayuda rápida
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        // Mostrar modal de atajos de teclado
        console.log('Mostrar ayuda de navegación')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [tabs, activeTab, setActiveTab])

  return {
    shortcuts: {
      'Ctrl+1-5': 'Navegar directamente a tab',
      'Ctrl+←/→': 'Tab anterior/siguiente',
      '?': 'Mostrar ayuda'
    }
  }
}
