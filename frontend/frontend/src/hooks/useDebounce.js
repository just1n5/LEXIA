import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Hook para debounce de valores
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para debounce de funciones
 */
export function useDebouncedCallback(callback, delay, deps = []) {
  const timeoutRef = useRef()

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay, ...deps]
  )

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const flush = useCallback(
    (...args) => {
      cancel()
      callback(...args)
    },
    [callback, cancel]
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    debouncedCallback,
    cancel,
    flush
  }
}

/**
 * Hook para throttle de funciones
 */
export function useThrottle(callback, delay, deps = []) {
  const lastCallRef = useRef(0)
  const timeoutRef = useRef()

  const throttledCallback = useCallback(
    (...args) => {
      const now = Date.now()
      const timeSinceLastCall = now - lastCallRef.current

      if (timeSinceLastCall >= delay) {
        lastCallRef.current = now
        callback(...args)
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now()
          callback(...args)
        }, delay - timeSinceLastCall)
      }
    },
    [callback, delay, ...deps]
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return throttledCallback
}

export default useDebounce
