import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import EnhancedCreateButton from '../enhanced/EnhancedCreateButton'
import EnhancedBackButton from '../enhanced/EnhancedBackButton'
import { 
  ArrowLeft, 
  Settings, 
  Eye, 
  Code, 
  Palette,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Info,
  Home,
  RefreshCw,
  Lightbulb
} from 'lucide-react'

/**
 * 🎨 ButtonSystemDemo - Demostración del Sistema de Botones Mejorado
 * 
 * Página para mostrar las capacidades del nuevo sistema de botones:
 * - EnhancedCreateButton con todos sus estados
 * - EnhancedBackButton con detección de cambios
 * - Comparación con botones básicos
 * - Casos de uso reales
 */
const ButtonSystemDemo = () => {
  // Estado para simulación de formulario
  const [demoFormData, setDemoFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  })
  
  const originalFormData = {
    nombre: '',
    email: '',
    mensaje: ''
  }
  
  const [showDemo, setShowDemo] = useState('enhanced') // 'enhanced' | 'basic'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)

  // Simular envío de formulario
  const handleDemoSubmit = async (e) => {
    e?.preventDefault?.()
    setIsSubmitting(true)
    setSubmitResult(null)
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular éxito/error aleatoriamente
      if (Math.random() > 0.3) {
        setSubmitResult({ type: 'success', message: '¡Formulario enviado exitosamente!' })
      } else {
        setSubmitResult({ type: 'error', message: 'Error al enviar. Inténtalo de nuevo.' })
      }
    } catch (error) {
      setSubmitResult({ type: 'error', message: 'Error inesperado.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Función para volver
  const handleBack = (options = {}) => {
    console.log('Volviendo...', options)
    setSubmitResult({ type: 'info', message: 'Navegación simulada' })
  }

  // Detectar cambios en formulario demo
  const hasChanges = JSON.stringify(demoFormData) !== JSON.stringify(originalFormData)

  // Acciones rápidas para el botón de volver
  const quickActions = [
    {
      id: 'home',
      label: 'Ir al inicio',
      icon: Home,
      action: () => handleBack({ action: 'home' })
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
      action: () => handleBack({ action: 'settings' })
    }
  ]

  return (
    <div className="min-h-screen bg-bg-light py-xl">
      <div className="container mx-auto px-md lg:px-lg">
        
        {/* Header */}
        <div className="text-center mb-2xl">
          <div className="flex items-center justify-center gap-sm mb-md">
            <Sparkles className="w-8 h-8 text-interactive-default" />
            <h1 className="text-heading-h1 font-heading text-text-primary">
              Sistema de Botones Mejorado
            </h1>
          </div>
          <p className="text-body-paragraph text-text-secondary max-w-2xl mx-auto">
            Demostración de los componentes EnhancedCreateButton y EnhancedBackButton 
            con todas sus características avanzadas y estados interactivos.
          </p>
        </div>

        {/* Selector de Vista */}
        <div className="flex justify-center mb-xl">
          <div className="flex bg-bg-canvas rounded-lg p-xs border border-border-default">
            <button
              onClick={() => setShowDemo('enhanced')}
              className={cn(
                'px-md py-sm rounded-md transition-all duration-200',
                showDemo === 'enhanced'
                  ? 'bg-interactive-default text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-light'
              )}
            >
              <Sparkles className="w-4 h-4 inline mr-xs" />
              Botones Mejorados
            </button>
            <button
              onClick={() => setShowDemo('basic')}
              className={cn(
                'px-md py-sm rounded-md transition-all duration-200',
                showDemo === 'basic'
                  ? 'bg-interactive-default text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-light'
              )}
            >
              <Code className="w-4 h-4 inline mr-xs" />
              Botones Básicos
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
          
          {/* Formulario Demo */}
          <Card size="lg">
            <Card.Header>
              <Card.Title className="flex items-center gap-sm">
                <Eye className="w-5 h-5 text-interactive-default" />
                Formulario de Demostración
              </Card.Title>
              <p className="text-body-auxiliary text-text-secondary">
                Interactúa con el formulario para ver los botones en acción
              </p>
            </Card.Header>

            <Card.Content>
              <form onSubmit={handleDemoSubmit} className="space-y-lg">
                
                {/* Campos del formulario */}
                <div className="space-y-md">
                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={demoFormData.nombre}
                      onChange={(e) => setDemoFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Ingresa tu nombre"
                      className="w-full px-sm py-sm border border-border-default rounded-md focus:border-interactive-default focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      Email
                    </label>
                    <input
                      type="email"
                      value={demoFormData.email}
                      onChange={(e) => setDemoFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="tu@email.com"
                      className="w-full px-sm py-sm border border-border-default rounded-md focus:border-interactive-default focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      Mensaje
                    </label>
                    <textarea
                      value={demoFormData.mensaje}
                      onChange={(e) => setDemoFormData(prev => ({ ...prev, mensaje: e.target.value }))}
                      placeholder="Escribe tu mensaje aquí..."
                      rows={4}
                      className="w-full px-sm py-sm border border-border-default rounded-md focus:border-interactive-default focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Estado de los datos */}
                <div className="p-sm bg-bg-light rounded-md border border-border-default">
                  <div className="flex items-center gap-xs mb-xs">
                    {hasChanges ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-feedback-warning" />
                        <span className="text-body-auxiliary text-feedback-warning font-medium">
                          Cambios detectados
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-feedback-success" />
                        <span className="text-body-auxiliary text-feedback-success font-medium">
                          Sin cambios
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-body-auxiliary text-text-secondary">
                    {hasChanges 
                      ? 'El formulario tiene cambios no guardados'
                      : 'El formulario está en su estado original'
                    }
                  </p>
                </div>

                {/* Resultado de envío */}
                {submitResult && (
                  <div className={cn(
                    'p-sm rounded-md border',
                    submitResult.type === 'success' && 'bg-feedback-success-light border-feedback-success text-feedback-success',
                    submitResult.type === 'error' && 'bg-feedback-error-light border-feedback-error text-feedback-error',
                    submitResult.type === 'info' && 'bg-feedback-info-light border-feedback-info text-feedback-info'
                  )}>
                    <p className="text-body-auxiliary font-medium">
                      {submitResult.message}
                    </p>
                  </div>
                )}

                {/* Botones según el modo */}
                <div className="flex flex-col sm:flex-row gap-sm justify-between pt-lg border-t border-border-default">
                  
                  {showDemo === 'enhanced' ? (
                    <>
                      {/* Botón Volver Mejorado */}
                      <EnhancedBackButton
                        onClick={handleBack}
                        disabled={isSubmitting}
                        hasUnsavedChanges={hasChanges}
                        originalData={originalFormData}
                        currentData={demoFormData}
                        onSaveAndExit={async () => {
                          await handleDemoSubmit()
                          if (submitResult?.type === 'success') {
                            handleBack()
                          }
                        }}
                        onDiscardChanges={() => {
                          setDemoFormData(originalFormData)
                          setSubmitResult(null)
                        }}
                        quickActions={quickActions}
                        confirmationTitle="¿Salir sin guardar?"
                        confirmationMessage="Tienes cambios en el formulario de demostración que se perderán."
                        text="Volver"
                        className="min-w-[120px]"
                      />

                      {/* Botón Crear Mejorado */}
                      <div className="flex-1 max-w-sm ml-auto">
                        <EnhancedCreateButton
                          formData={demoFormData}
                          errors={{}}
                          isSubmitting={isSubmitting}
                          onSubmit={handleDemoSubmit}
                          disabled={!demoFormData.nombre || !demoFormData.email}
                          submitText="Enviar Demo"
                          loadingText="Enviando..."
                          successText="¡Enviado!"
                          className="w-full"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Botones básicos para comparación */}
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleBack({ basic: true })}
                        disabled={isSubmitting}
                        className="flex items-center gap-sm min-w-[120px]"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                      </Button>

                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting || !demoFormData.nombre || !demoFormData.email}
                        className="flex-1 max-w-sm ml-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-xs animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          'Enviar Demo'
                        )}
                      </Button>
                    </>
                  )}
                  
                </div>
              </form>
            </Card.Content>
          </Card>

          {/* Características */}
          <Card size="lg">
            <Card.Header>
              <Card.Title className="flex items-center gap-sm">
                <Palette className="w-5 h-5 text-interactive-default" />
                Características Mejoradas
              </Card.Title>
            </Card.Header>

            <Card.Content>
              <div className="space-y-lg">
                
                {/* EnhancedCreateButton */}
                <div>
                  <h3 className="text-heading-h3 font-heading text-text-primary mb-md flex items-center gap-sm">
                    <Sparkles className="w-5 h-5 text-interactive-default" />
                    EnhancedCreateButton
                  </h3>
                  
                  <div className="space-y-sm">
                    <div className="flex items-start gap-sm">
                      <CheckCircle className="w-4 h-4 text-feedback-success mt-xs flex-shrink-0" />
                      <div>
                        <p className="text-body-paragraph text-text-base font-medium">
                          Validación Visual Inteligente
                        </p>
                        <p className="text-body-auxiliary text-text-secondary">
                          Muestra errores específicos y progreso de validación en tiempo real
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-sm">
                      <CheckCircle className="w-4 h-4 text-feedback-success mt-xs flex-shrink-0" />
                      <div>
                        <p className="text-body-paragraph text-text-base font-medium">
                          Estados de Carga Mejorados
                        </p>
                        <p className="text-body-auxiliary text-text-secondary">
                          Animaciones sutiles y feedback de progreso durante el envío
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-sm">
                      <CheckCircle className="w-4 h-4 text-feedback-success mt-xs flex-shrink-0" />
                      <div>
                        <p className="text-body-paragraph text-text-base font-medium">
                          Tooltips Contextuales
                        </p>
                        <p className="text-body-auxiliary text-text-secondary">
                          Información útil basada en el estado actual del formulario
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EnhancedBackButton */}
                <div>
                  <h3 className="text-heading-h3 font-heading text-text-primary mb-md flex items-center gap-sm">
                    <ArrowLeft className="w-5 h-5 text-interactive-default" />
                    EnhancedBackButton
                  </h3>
                  
                  <div className="space-y-sm">
                    <div className="flex items-start gap-sm">
                      <CheckCircle className="w-4 h-4 text-feedback-success mt-xs flex-shrink-0" />
                      <div>
                        <p className="text-body-paragraph text-text-base font-medium">
                          Detección de Cambios
                        </p>
                        <p className="text-body-auxiliary text-text-secondary">
                          Detecta automáticamente cambios no guardados y alerta al usuario
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-sm">
                      <CheckCircle className="w-4 h-4 text-feedback-success mt-xs flex-shrink-0" />
                      <div>
                        <p className="text-body-paragraph text-text-base font-medium">
                          Confirmación Inteligente
                        </p>
                        <p className="text-body-auxiliary text-text-secondary">
                          Modal de confirmación con opciones para guardar o descartar cambios
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-sm">
                      <CheckCircle className="w-4 h-4 text-feedback-success mt-xs flex-shrink-0" />
                      <div>
                        <p className="text-body-paragraph text-text-base font-medium">
                          Acciones Rápidas
                        </p>
                        <p className="text-body-auxiliary text-text-secondary">
                          Navegación directa a secciones específicas de la aplicación
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estado actual */}
                <div className="p-md bg-gradient-to-r from-interactive-default/10 to-feedback-info/10 border border-interactive-default/30 rounded-md">
                  <div className="flex items-center gap-sm mb-sm">
                    <Info className="w-5 h-5 text-interactive-default" />
                    <h4 className="text-body-paragraph font-medium text-text-primary">
                      Estado Actual del Demo
                    </h4>
                  </div>
                  
                  <div className="space-y-xs text-body-auxiliary">
                    <div className="flex justify-between">
                      <span>Modo de demostración:</span>
                      <Badge variant={showDemo === 'enhanced' ? 'success' : 'secondary'}>
                        {showDemo === 'enhanced' ? 'Mejorado' : 'Básico'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Cambios en formulario:</span>
                      <Badge variant={hasChanges ? 'warning' : 'success'}>
                        {hasChanges ? 'Sí' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Estado de envío:</span>
                      <Badge variant={isSubmitting ? 'info' : 'secondary'}>
                        {isSubmitting ? 'Enviando' : 'Listo'}
                      </Badge>
                    </div>
                  </div>
                </div>

              </div>
            </Card.Content>
          </Card>

        </div>

        {/* Footer informativo */}
        <div className="mt-2xl text-center">
          <p className="text-body-auxiliary text-text-secondary">
            <Lightbulb className="w-3 h-3 inline mr-xs" /> <strong>Tip:</strong> Haz cambios en el formulario y prueba el botón "Volver" para ver 
            la detección de cambios en acción. Alterna entre modos para comparar.
          </p>
        </div>

      </div>
    </div>
  )
}

export default ButtonSystemDemo