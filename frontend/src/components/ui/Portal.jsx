// src/components/ui/Portal.jsx
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * 🚪 Portal Component - ConsultaJudicial RPA
 * 
 * Renderiza children fuera de la jerarquía normal del DOM,
 * útil para modales, tooltips y overlays que necesitan estar
 * por encima de todo el contenido.
 */
const Portal = ({ children, containerId = 'portal-root' }) => {
  const [portalElement, setPortalElement] = useState(null)

  useEffect(() => {
    // Buscar el contenedor existente o crear uno nuevo
    let element = document.getElementById(containerId)
    
    if (!element) {
      element = document.createElement('div')
      element.id = containerId
      element.style.position = 'relative'
      element.style.zIndex = '9999'
      element.style.pointerEvents = 'none' // Permite que clicks pasen a través cuando vacío
      document.body.appendChild(element)
    }

    setPortalElement(element)

    // Habilitar pointer events cuando hay contenido
    if (element) {
      element.style.pointerEvents = 'auto'
    }

    // Cleanup: remover el elemento si fue creado por nosotros
    return () => {
      if (element && element.children.length === 0) {
        document.body.removeChild(element)
      }
    }
  }, [containerId])

  // Renderizar solo cuando el portal element está listo
  if (!portalElement) return null

  return createPortal(children, portalElement)
}

Portal.displayName = 'Portal'

export default Portal