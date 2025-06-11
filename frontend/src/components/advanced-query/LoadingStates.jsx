// src/components/advanced-query/LoadingStates.jsx
import React, { useState, useEffect } from 'react'
import { 
  CheckCircle, Clock, Loader2, AlertCircle, 
  Search, Server, FileText, Bell, Sparkles
} from 'lucide-react'
import { cn } from '../../utils/cn'
import Card from '../ui/Card'

/**
 * 🔄 LoadingStates - Estados de carga mejorados
 * 
 * Proporciona feedback detallado durante el proceso de creación
 * de solicitudes, mostrando pasos específicos y progreso.
 */
const LoadingStates = ({ 
  isLoading, 
  onComplete, 
  className = '', 
  ...props 
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])

  // Definir los pasos del proceso
  const steps = [
    {
      id: 'validating',
      title: 'Validando criterios',
      description: 'Verificando parámetros de búsqueda',
      icon: Search,
      duration: 800
    },
    {
      id: 'connecting',
      title: 'Conectando con servidor',
      description: 'Estableciendo conexión segura',
      icon: Server,
      duration: 1200
    },
    {
      id: 'creating',
      title: 'Creando solicitud',
      description: 'Configurando consulta avanzada',
      icon: FileText,
      duration: 1500
    },
    {
      id: 'notifications',
      title: 'Configurando notificaciones',
      description: 'Programando ejecución diaria',
      icon: Bell,
      duration: 600
    },
    {
      id: 'complete',
      title: '¡Solicitud creada exitosamente!',
      description: 'Tu consulta avanzada está lista',
      icon: Sparkles,
      duration: 0
    }
  ]

  // Efecto para manejar la progresión de pasos
  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0)
      setCompletedSteps([])
      return
    }

    let timeoutId
    
    const progressToNextStep = () => {
      if (currentStep < steps.length - 1) {
        const currentStepData = steps[currentStep]
        
        timeoutId = setTimeout(() => {
          setCompletedSteps(prev => [...prev, currentStep])
          setCurrentStep(prev => prev + 1)
        }, currentStepData.duration)
      } else {
        // Último paso completado
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, currentStep])
          onComplete?.()
        }, 1000)
      }
    }

    progressToNextStep()

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isLoading, currentStep, steps, onComplete])

  // Reset cuando se desmonta o cambia isLoading
  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0)
      setCompletedSteps([])
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <Card size="lg" className={cn('border-interactive-default bg-interactive-default bg-opacity-5', className)} {...props}>
      <Card.Header>
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 bg-interactive-default rounded-lg flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </div>
          <div>
            <Card.Title as="h4" className="text-interactive-default">
              Creando Solicitud Avanzada
            </Card.Title>
            <p className="text-body-auxiliary text-text-secondary">
              Por favor espera mientras procesamos tu solicitud...
            </p>
          </div>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="space-y-md">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index)
            const isCurrent = currentStep === index
            const isPending = index > currentStep

            const StepIcon = step.icon

            return (
              <div 
                key={step.id}
                className={cn(
                  'flex items-center gap-sm p-md rounded-lg transition-all duration-300',
                  isCompleted && 'bg-feedback-success-light border border-feedback-success',
                  isCurrent && 'bg-interactive-default bg-opacity-10 border border-interactive-default',
                  isPending && 'bg-bg-light border border-border-default opacity-60'
                )}
              >
                {/* Icono de estado */}
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
                  isCompleted && 'bg-feedback-success',
                  isCurrent && 'bg-interactive-default',
                  isPending && 'bg-text-secondary'
                )}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <StepIcon className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Contenido del paso */}
                <div className="flex-1">
                  <h6 className={cn(
                    'text-body-paragraph font-medium transition-colors',
                    isCompleted && 'text-feedback-success',
                    isCurrent && 'text-interactive-default',
                    isPending && 'text-text-secondary'
                  )}>
                    {step.title}
                  </h6>
                  <p className={cn(
                    'text-body-auxiliary transition-colors',
                    isCompleted && 'text-feedback-success',
                    isCurrent && 'text-text-base',
                    isPending && 'text-text-secondary'
                  )}>
                    {step.description}
                  </p>
                </div>

                {/* Indicador de tiempo */}
                {isCurrent && (
                  <div className="flex items-center gap-xs">
                    <Clock className="w-3 h-3 text-interactive-default" />
                    <span className="text-body-auxiliary text-interactive-default">
                      {Math.ceil(step.duration / 1000)}s
                    </span>
                  </div>
                )}

                {isCompleted && (
                  <div className="text-feedback-success">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Barra de progreso general */}
        <div className="mt-lg">
          <div className="flex items-center justify-between mb-sm">
            <span className="text-body-auxiliary text-text-secondary">
              Progreso general
            </span>
            <span className="text-body-auxiliary font-medium text-text-primary">
              {Math.round(((completedSteps.length + (currentStep < steps.length - 1 ? 0.5 : 0)) / steps.length) * 100)}%
            </span>
          </div>
          
          <div className="w-full bg-bg-light rounded-full h-2">
            <div 
              className="bg-interactive-default h-2 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${((completedSteps.length + (currentStep < steps.length - 1 ? 0.5 : 0)) / steps.length) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Mensaje de ayuda */}
        <div className="mt-lg p-md bg-feedback-info-light rounded border border-feedback-info">
          <p className="text-body-auxiliary text-feedback-info">
            <strong>💡 ¿Sabías que...</strong> Una vez creada, tu consulta se ejecutará automáticamente todos los días a las 7:00 PM y recibirás notificaciones cuando se detecten cambios.
          </p>
        </div>
      </Card.Content>
    </Card>
  )
}

LoadingStates.displayName = 'LoadingStates'

export default LoadingStates