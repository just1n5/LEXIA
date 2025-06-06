import React, { useState } from 'react'
import { HelpCircle, X, Keyboard, Smartphone, Monitor } from 'lucide-react'
import Button from '../../ui/Button'
import Modal from '../../ui/Modal'
import { cn } from '../../../utils/cn'
import { useResponsiveLayout } from '../../../hooks/useResponsiveLayout'

/**
 * Componente de ayuda para navegación mejorada
 * Muestra atajos de teclado y gestos táctiles disponibles
 */
const NavigationHelp = ({ 
  trigger = null,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { layout, isMobile, isTablet, isDesktop } = useResponsiveLayout()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  // Trigger personalizado o botón por defecto
  const triggerButton = trigger || (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleOpen}
      icon={<HelpCircle size={16} />}
      className={cn('fixed bottom-4 right-20 z-40 bg-bg-canvas border border-border-default shadow-lg', className)}
      aria-label="Ayuda de navegación"
    >
      Ayuda
    </Button>
  )

  return (
    <>
      {React.cloneElement(triggerButton, { onClick: handleOpen })}
      
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose} 
        title={(
          <div className="flex items-center gap-sm">
            <HelpCircle size={20} className="text-interactive-default" />
            Navegación Mejorada
          </div>
        )}
        footer={(
          <div className="flex justify-between items-center w-full">
            <span className="text-body-auxiliary text-text-secondary">
              Presiona ? en cualquier momento para ver esta ayuda
            </span>
            <Button variant="primary" onClick={handleClose}>
              Entendido
            </Button>
          </div>
        )}
        className="max-w-4xl"
      >
          <div className="space-y-lg">
            {/* Información actual del dispositivo */}
            <div className="bg-bg-light p-md rounded-lg border border-border-default">
              <div className="flex items-center gap-sm mb-sm">
                {isMobile && <Smartphone size={16} className="text-interactive-default" />}
                {isTablet && <Monitor size={16} className="text-interactive-default" />}
                {isDesktop && <Keyboard size={16} className="text-interactive-default" />}
                <span className="text-body-paragraph font-medium text-text-primary">
                  Modo actual: {layout === 'mobile' ? 'Móvil (Acordeón)' : layout === 'tablet' ? 'Tablet (Scroll)' : 'Escritorio (Completo)'}
                </span>
              </div>
              <p className="text-body-auxiliary text-text-secondary">
                La interfaz se adapta automáticamente a tu dispositivo para una mejor experiencia.
              </p>
            </div>

            {/* Navegación por teclado (Desktop/Tablet) */}
            {!isMobile && (
              <div className="space-y-md">
                <h3 className="text-heading-h3 font-heading text-text-primary flex items-center gap-sm">
                  <Keyboard size={18} />
                  Atajos de Teclado
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                  <KeyboardShortcut 
                    keys={['Ctrl', '1-5']}
                    description="Navegar directamente a tabs 1-5"
                  />
                  <KeyboardShortcut 
                    keys={['Ctrl', '←/→']}
                    description="Tab anterior/siguiente"
                  />
                  <KeyboardShortcut 
                    keys={['Tab']}
                    description="Navegar por elementos"
                  />
                  <KeyboardShortcut 
                    keys={['Enter', 'Space']}
                    description="Activar elemento enfocado"
                  />
                  <KeyboardShortcut 
                    keys={['?']}
                    description="Mostrar esta ayuda"
                  />
                  <KeyboardShortcut 
                    keys={['Esc']}
                    description="Cerrar modales/menús"
                  />
                </div>
              </div>
            )}

            {/* Gestos táctiles (Mobile/Tablet) */}
            {(isMobile || isTablet) && (
              <div className="space-y-md">
                <h3 className="text-heading-h3 font-heading text-text-primary flex items-center gap-sm">
                  <Smartphone size={18} />
                  Gestos Táctiles
                </h3>
                <div className="space-y-sm">
                  <GestureItem 
                    gesture="Deslizar izquierda →"
                    description="Siguiente tab"
                    icon="👆"
                  />
                  <GestureItem 
                    gesture="Deslizar derecha ←"
                    description="Tab anterior"
                    icon="👆"
                  />
                  <GestureItem 
                    gesture="Tocar tab"
                    description="Expandir/contraer sección"
                    icon="👆"
                    mobileOnly
                  />
                  <GestureItem 
                    gesture="Scroll horizontal"
                    description="Navegar entre tabs"
                    icon="📱"
                    tabletOnly
                  />
                </div>
              </div>
            )}

            {/* Funciones especiales */}
            <div className="space-y-md">
              <h3 className="text-heading-h3 font-heading text-text-primary">
                Funcionalidades Especiales
              </h3>
              <div className="space-y-sm">
                <FeatureItem 
                  title="Persistencia de Estado"
                  description="Tu tab activo se recuerda entre sesiones"
                  icon="💾"
                />
                <FeatureItem 
                  title="Carga Perezosa"
                  description="Los tabs se cargan solo cuando los necesitas"
                  icon="⚡"
                />
                <FeatureItem 
                  title="Navegación Inteligente"
                  description="Atajos contextuales según el contenido"
                  icon="🧠"
                />
                <FeatureItem 
                  title="Accesibilidad Completa"
                  description="Compatible con lectores de pantalla"
                  icon="♿"
                />
              </div>
            </div>
          </div>
      </Modal>
    </>
  )
}

/**
 * Componente para mostrar atajos de teclado
 */
const KeyboardShortcut = ({ keys, description }) => (
  <div className="flex items-center gap-sm p-sm bg-bg-canvas border border-border-default rounded-md">
    <div className="flex items-center gap-xs">
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <kbd className="px-xs py-xs bg-bg-light border border-border-default rounded text-body-auxiliary font-mono">
            {key}
          </kbd>
          {index < keys.length - 1 && (
            <span className="text-text-secondary">+</span>
          )}
        </React.Fragment>
      ))}
    </div>
    <span className="text-body-auxiliary text-text-secondary flex-1">
      {description}
    </span>
  </div>
)

/**
 * Componente para mostrar gestos táctiles
 */
const GestureItem = ({ gesture, description, icon, mobileOnly, tabletOnly }) => {
  const { isMobile, isTablet } = useResponsiveLayout()
  
  // Mostrar solo si es relevante para el dispositivo actual
  if (mobileOnly && !isMobile) return null
  if (tabletOnly && !isTablet) return null
  
  return (
    <div className="flex items-center gap-sm p-sm bg-bg-canvas border border-border-default rounded-md">
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <div className="text-body-paragraph font-medium text-text-primary">
          {gesture}
        </div>
        <div className="text-body-auxiliary text-text-secondary">
          {description}
        </div>
      </div>
    </div>
  )
}

/**
 * Componente para mostrar características especiales
 */
const FeatureItem = ({ title, description, icon }) => (
  <div className="flex items-start gap-sm p-sm bg-bg-canvas border border-border-default rounded-md">
    <span className="text-lg">{icon}</span>
    <div className="flex-1">
      <div className="text-body-paragraph font-medium text-text-primary">
        {title}
      </div>
      <div className="text-body-auxiliary text-text-secondary">
        {description}
      </div>
    </div>
  </div>
)

export default NavigationHelp
export { KeyboardShortcut, GestureItem, FeatureItem }
