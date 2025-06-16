import { useState, useEffect } from 'react';

/**
 * Hook para detectar dispositivos móviles y características específicas
 * Incluye detección de touch, orientation, tamaño de pantalla, etc.
 */
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  const [orientation, setOrientation] = useState('portrait');
  const [isTouch, setIsTouch] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewport({ width, height });
      
      // Breakpoints según el design system
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      const desktop = width >= 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      if (mobile) {
        setScreenSize('mobile');
      } else if (tablet) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
      
      // Detección de orientación
      setOrientation(height > width ? 'portrait' : 'landscape');
      
      // Detección de capacidades touch
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    // Verificación inicial
    checkDevice();

    // Listener para cambios de tamaño
    const handleResize = () => {
      checkDevice();
    };

    // Listener para cambios de orientación
    const handleOrientationChange = () => {
      // Pequeño delay para que el navegador actualice las dimensiones
      setTimeout(checkDevice, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: screenSize === 'desktop',
    screenSize,
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    isTouch,
    viewport,
    // Utilidades adicionales
    isMobileOrTablet: isMobile || isTablet,
    isSmallScreen: viewport.width < 640,
    canHover: !isTouch, // Dispositivos que soportan hover real
  };
};

/**
 * Hook para manejo de gestos touch específicos
 */
export const useTouchGestures = (element, options = {}) => {
  const [gestureState, setGestureState] = useState({
    isPressed: false,
    startPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
    deltaPos: { x: 0, y: 0 },
    startTime: 0
  });

  useEffect(() => {
    if (!element) return;

    const {
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      onTap,
      onLongPress,
      swipeThreshold = 50,
      tapThreshold = 200,
      longPressThreshold = 500
    } = options;

    let longPressTimer = null;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      const startPos = { x: touch.clientX, y: touch.clientY };
      const startTime = Date.now();
      
      setGestureState(prev => ({
        ...prev,
        isPressed: true,
        startPos,
        currentPos: startPos,
        deltaPos: { x: 0, y: 0 },
        startTime
      }));

      // Configurar timer para long press
      if (onLongPress) {
        longPressTimer = setTimeout(() => {
          onLongPress(e);
        }, longPressThreshold);
      }
    };

    const handleTouchMove = (e) => {
      if (!gestureState.isPressed) return;
      
      const touch = e.touches[0];
      const currentPos = { x: touch.clientX, y: touch.clientY };
      const deltaPos = {
        x: currentPos.x - gestureState.startPos.x,
        y: currentPos.y - gestureState.startPos.y
      };

      setGestureState(prev => ({
        ...prev,
        currentPos,
        deltaPos
      }));

      // Cancelar long press si hay movimiento
      if (longPressTimer && (Math.abs(deltaPos.x) > 10 || Math.abs(deltaPos.y) > 10)) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };

    const handleTouchEnd = (e) => {
      if (!gestureState.isPressed) return;

      const duration = Date.now() - gestureState.startTime;
      const { deltaPos } = gestureState;
      
      // Limpiar long press timer
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }

      // Detectar tipo de gesto
      const absX = Math.abs(deltaPos.x);
      const absY = Math.abs(deltaPos.y);

      if (absX < 10 && absY < 10) {
        // Tap
        if (duration < tapThreshold && onTap) {
          onTap(e);
        }
      } else if (absX > swipeThreshold || absY > swipeThreshold) {
        // Swipe
        if (absX > absY) {
          // Horizontal swipe
          if (deltaPos.x > 0 && onSwipeRight) {
            onSwipeRight(e);
          } else if (deltaPos.x < 0 && onSwipeLeft) {
            onSwipeLeft(e);
          }
        } else {
          // Vertical swipe
          if (deltaPos.y > 0 && onSwipeDown) {
            onSwipeDown(e);
          } else if (deltaPos.y < 0 && onSwipeUp) {
            onSwipeUp(e);
          }
        }
      }

      setGestureState(prev => ({
        ...prev,
        isPressed: false,
        deltaPos: { x: 0, y: 0 }
      }));
    };

    // Event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [element, options, gestureState.isPressed, gestureState.startPos, gestureState.startTime]);

  return gestureState;
};

/**
 * Hook para manejar scroll vertical en móviles
 */
export const useMobileScroll = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimer = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrollPosition(currentScrollY);
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setIsScrolling(true);
      
      // Limpiar timer anterior
      if (scrollTimer) clearTimeout(scrollTimer);
      
      // Establecer que ya no se está scrolleando después de 150ms
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  return {
    scrollPosition,
    scrollDirection,
    isScrolling,
    isScrolledToTop: scrollPosition === 0,
    isScrollingUp: scrollDirection === 'up',
    isScrollingDown: scrollDirection === 'down'
  };
};