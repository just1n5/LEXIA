import React, { useState, useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'
import { 
  Sparkles, Check, AlertCircle, Clock, User, Building, 
  Scale, Zap, ArrowRight, CheckCircle2, Loader2 
} from 'lucide-react'

/**
 * 🚀 EnhancedCreateButton - Botón mejorado para crear consultas
 * 
 * Características avanzadas:
 * - Estados inteligentes con feedback visual
 * - Preview de la consulta a crear
 * - Animaciones y micro-interacciones
 * - Validación visual en tiempo real
 * - Estimación de tiempo y progreso
 * - Accesibilidad mejorada
 */
const EnhancedCreateButton = ({
  formData = {},
  errors = {},
  isSubmitting = false,
  onSubmit,
  disabled = false,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [ripples, setRipples] = useState([])
  const buttonRef = useRef(null)

  // 📊 Calcular progreso del formulario
  const calculateProgress = () => {
    const requiredFields = ['tipoPersona', 'nombreRazonSocial']
    const optionalFields = ['departamento', 'ciudad', 'entidad', 'especialidad', 'despacho']
    
    const completedRequired = requiredFields.filter(field => 
      formData[field] && formData[field].trim() !== ''
    ).length
    
    const completedOptional = optionalFields.filter(field => 
      formData[field] && formData[field].trim() !== ''
    ).length

    const requiredProgress = (completedRequired / requiredFields.length) * 100
    const optionalProgress = (completedOptional / optionalFields.length) * 100
    
    return {
      required: requiredProgress,
      optional: optionalProgress,
      overall: (requiredProgress * 0.7) + (optionalProgress * 0.3), // Peso: 70% requeridos, 30% opcionales
      completedRequired,
      totalRequired: requiredFields.length,
      completedOptional,
      totalOptional: optionalFields.length,
      isValid: requiredProgress === 100 && Object.keys(errors).length === 0
    }
  }

  const progress = calculateProgress()

  // 🎯 Determinar estado del botón
  const getButtonState = () => {
    if (isSubmitting) return 'submitting'
    if (disabled) return 'disabled'
    if (!progress.isValid) return 'incomplete'
    if (progress.isValid) return 'ready'
    return 'default'
  }

  const buttonState = getButtonState()

  // 🎨 Configuración de estilos por estado
  const stateConfig = {
    default: {
      icon: Sparkles,
      text: 'Completar campos obligatorios',
      bgClass: 'bg-gray-400',
      hoverClass: 'hover:bg-gray-500',
      description: 'Complete los campos requeridos para continuar'
    },
    incomplete: {
      icon: AlertCircle,
      text: `Faltan ${progress.totalRequired - progress.completedRequired} campos obligatorios`,
      bgClass: 'bg-gray-400',
      hoverClass: 'hover:bg-gray-500',
      description: 'Complete todos los campos obligatorios'
    },
    ready: {
      icon: Zap,
      text: 'Crear Consulta Oficial',
      bgClass: 'bg-gradient-to-r from-interactive-default via-yellow-400 to-interactive-default animate-pulse-subtle',
      hoverClass: 'hover:bg-pos-100',
      description: 'Todo listo para crear su consulta oficial'
    },
    submitting: {
      icon: Loader2,
      text: 'Creando consulta oficial...',
      bgClass: 'bg-gradient-to-r from-interactive-default to-yellow-400',
      hoverClass: '',
      description: 'Procesando su solicitud con la Rama Judicial'
    },
    disabled: {
      icon: AlertCircle,
      text: 'Botón deshabilitado',
      bgClass: 'bg-gray-300',
      hoverClass: '',
      description: 'El botón está temporalmente deshabilitado'
    }
  }

  const config = stateConfig[buttonState]
  const IconComponent = config.icon

  // ⚡ Estimación de tiempo
  const getTimeEstimate = () => {
    if (formData.sujetoProcesal === 'recientes') {
      return '1-2 minutos'
    } else if (formData.sujetoProcesal === 'todos') {
      return '2-8 minutos'
    }
    return '2-5 minutos'
  }

  // 🎪 Efecto Ripple
  const createRipple = (event) => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    }

    setRipples(prev => [...prev, newRipple])

    // Remover ripple después de la animación
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)
  }

  // 🎮 Manejo de eventos
  const handleClick = (event) => {
    if (buttonState === 'ready' && onSubmit) {
      createRipple(event)
      onSubmit(event)
    }
  }

  const handleKeyDown = (event) => {
    // Ctrl+Enter para submit rápido
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && buttonState === 'ready') {
      handleClick(event)
    }
  }

  // 🎯 Hook para keyboard shortcut global
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [buttonState])

  // 📝 Preview de la consulta
  const getPreviewContent = () => {
    if (!formData.nombreRazonSocial) return null

    return (
      <div className="text-left">
        <h4 className="text-body-paragraph font-semibold text-text-primary mb-sm">
          Vista previa de su consulta:
        </h4>
        <div className="space-y-xs text-body-auxiliary">
          <div className="flex items-center gap-xs">
            <User className="w-3 h-3 text-interactive-default" />
            <span><strong>Persona:</strong> {formData.tipoPersona === 'natural' ? 'Natural' : 'Jurídica'}</span>
          </div>
          <div className="flex items-center gap-xs">
            <Scale className="w-3 h-3 text-interactive-default" />
            <span><strong>Nombre:</strong> {formData.nombreRazonSocial}</span>
          </div>
          {formData.departamento && (
            <div className="flex items-center gap-xs">
              <Building className="w-3 h-3 text-interactive-default" />
              <span><strong>Ubicación:</strong> {formData.ciudad || formData.departamento}</span>
            </div>
          )}
          <div className="flex items-center gap-xs">
            <Clock className="w-3 h-3 text-interactive-default" />
            <span><strong>Frecuencia:</strong> Diaria (7:00 PM)</span>
          </div>
          <div className="flex items-center gap-xs">
            <Zap className="w-3 h-3 text-interactive-default" />
            <span><strong>Tiempo estimado:</strong> {getTimeEstimate()}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Indicador de progreso */}
      {progress.overall > 0 && progress.overall < 100 && (
        <div className="mb-sm">
          <div className="flex justify-between items-center mb-xs">
            <span className="text-body-auxiliary text-text-secondary">
              Progreso del formulario
            </span>
            <span className="text-body-auxiliary text-text-secondary font-medium">
              {Math.round(progress.overall)}%
            </span>
          </div>
          <div className="w-full bg-border-default rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-interactive-default to-yellow-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress.overall}%` }}
            />
          </div>
          <div className="flex justify-between text-body-auxiliary text-text-secondary mt-xs">
            <span>
              Obligatorios: {progress.completedRequired}/{progress.totalRequired}
            </span>
            <span>
              Opcionales: {progress.completedOptional}/{progress.totalOptional}
            </span>
          </div>
        </div>
      )}

      {/* Botón principal mejorado */}
      <div className="relative group">
        <button
          ref={buttonRef}
          type={buttonState === 'ready' ? 'submit' : 'button'}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
            setShowPreview(false)
          }}
          onFocus={() => setShowPreview(true)}
          onBlur={() => setShowPreview(false)}
          disabled={buttonState === 'disabled' || buttonState === 'submitting'}
          className={cn(
            // Base styles
            'relative overflow-hidden w-full py-md px-lg rounded-lg font-medium text-body-paragraph',
            'transition-all duration-300 ease-out transform',
            'focus:outline-none focus:ring-2 focus:ring-interactive-default focus:ring-offset-2',
            'disabled:cursor-not-allowed',
            
            // Estado-specific styles
            config.bgClass,
            config.hoverClass,
            
            // Interactive effects
            buttonState === 'ready' && [
              'hover:scale-105 hover:shadow-lg'
            ],
            
            buttonState === 'submitting' && 'cursor-wait',
            
            // Shadow effects
            isHovered && buttonState === 'ready' && 'shadow-[0_0_20px_rgba(250,204,21,0.4)]'
          )}
          aria-label={`${config.text} - ${config.description}`}
          aria-describedby="create-button-description"
          title={config.description}
        >
          {/* Ripple effects */}
          {ripples.map(ripple => (
            <span
              key={ripple.id}
              className="absolute rounded-full bg-white bg-opacity-30 animate-ripple pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
              }}
            />
          ))}

          {/* Contenido del botón */}
          <div className="relative flex items-center justify-center gap-sm text-text-primary">
            <IconComponent 
              className={cn(
                'w-5 h-5 transition-transform duration-300',
                buttonState === 'submitting' && 'animate-spin',
                buttonState === 'ready' && isHovered && 'scale-110'
              )} 
            />
            <span className="font-semibold">
              {config.text}
            </span>
            {buttonState === 'ready' && (
              <ArrowRight 
                className={cn(
                  'w-4 h-4 transition-transform duration-300',
                  isHovered && 'translate-x-1'
                )}
              />
            )}
          </div>

          {/* Background animation gradient */}
          {buttonState === 'ready' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          )}
        </button>

        {/* Tooltip con preview */}
        {showPreview && buttonState === 'ready' && formData.nombreRazonSocial && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-sm">
            <div className="bg-text-primary text-bg-canvas text-body-auxiliary p-md rounded-lg shadow-lg max-w-xs">
              {getPreviewContent()}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-text-primary" />
            </div>
          </div>
        )}

        {/* Descripción para screen readers */}
        <div id="create-button-description" className="sr-only">
          {config.description}
          {buttonState === 'ready' && formData.nombreRazonSocial && (
            <span>
              {` Presione Ctrl+Enter para envío rápido. Creará consulta oficial para ${formData.nombreRazonSocial}.`}
            </span>
          )}
        </div>
      </div>

      {/* Información adicional contextual */}
      {buttonState === 'ready' && (
        <div className="mt-sm text-center">
          <p className="text-body-auxiliary text-text-secondary">
            <Zap className="w-3 h-3 inline mr-xs" /> <strong>Consejo:</strong> Use <kbd className="px-1 py-0.5 bg-bg-light border border-border-default rounded text-xs">Ctrl+Enter</kbd> para envío rápido
          </p>
        </div>
      )}

      {/* Mensajes de estado */}
      {buttonState === 'submitting' && (
        <div className="mt-sm p-sm bg-feedback-info-light border border-feedback-info rounded-md">
          <div className="flex items-start gap-sm">
            <Loader2 className="w-4 h-4 text-feedback-info mt-0.5 animate-spin" />
            <div>
              <p className="text-body-auxiliary text-feedback-info font-medium">
                Procesando su consulta oficial
              </p>
              <p className="text-body-auxiliary text-feedback-info">
                Enviando solicitud a la Rama Judicial... <Clock className="w-3 h-3 inline mx-xs" /> {getTimeEstimate()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedCreateButton