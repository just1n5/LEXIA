import React from 'react'
import { Check, Circle } from 'lucide-react'
import { cn } from '../../utils/cn'

function ProgressSteps({ 
  steps = [], 
  currentStep = 0, 
  completedSteps = [],
  className = '',
  variant = 'horizontal',
  showProgress = false,
  progressText = '',
  animated = true
}) {
  const isStepCompleted = (stepIndex) => {
    return completedSteps.includes(stepIndex) || stepIndex < currentStep
  }

  const isStepActive = (stepIndex) => {
    return stepIndex === currentStep
  }

  const getStepStatus = (stepIndex) => {
    if (isStepCompleted(stepIndex)) return 'completed'
    if (isStepActive(stepIndex)) return 'active'
    return 'pending'
  }

  if (variant === 'vertical') {
    return (
      <div className={cn('progress-steps-vertical', className)}>
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const isLast = index === steps.length - 1

          return (
            <div key={index} className={cn('step-vertical', status)}>
              <div className="step-indicator">
                <div className={cn('step-icon', { 'animated': animated && status === 'active' })}>
                  {status === 'completed' ? (
                    <Check size={16} />
                  ) : (
                    <span className="step-number">{index + 1}</span>
                  )}
                </div>
                {!isLast && (
                  <div className={cn('step-connector', {
                    'completed': isStepCompleted(index + 1)
                  })} />
                )}
              </div>
              
              <div className="step-content">
                <div className="step-title">{step.title || step.label || step}</div>
                {step.description && (
                  <div className="step-description">{step.description}</div>
                )}
                {step.time && status === 'completed' && (
                  <div className="step-time">{step.time}</div>
                )}
              </div>
            </div>
          )
        })}
        
        {progressText && (
          <div className="progress-text-vertical">
            {progressText}
          </div>
        )}
      </div>
    )
  }

  // Variante horizontal (por defecto)
  return (
    <div className={cn('progress-steps', className)}>
      <div className="step-container">
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const isLast = index === steps.length - 1

          return (
            <div key={index} className={cn('step', status)}>
              {/* Línea conectora */}
              {!isLast && (
                <div className={cn('step-connector', {
                  'completed': isStepCompleted(index + 1)
                })} />
              )}

              {/* Icono del paso */}
              <div className={cn('step-icon', { 
                'animated': animated && status === 'active' 
              })}>
                {status === 'completed' ? (
                  <Check size={20} />
                ) : step.icon ? (
                  React.createElement(step.icon, { size: 20 })
                ) : (
                  <span className="step-number">{index + 1}</span>
                )}
              </div>

              {/* Etiqueta del paso */}
              <span className="step-label">
                {step.title || step.label || step}
              </span>

              {/* Descripción opcional */}
              {step.description && (
                <div className="step-description">{step.description}</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Texto de progreso */}
      {(showProgress || progressText) && (
        <div className="progress-text">
          {progressText || `Paso ${currentStep + 1} de ${steps.length}`}
        </div>
      )}
    </div>
  )
}

// Componente específico para búsqueda de procesos
function SearchProgressSteps({ searchState, className = '' }) {
  const steps = [
    { label: 'Conectando', icon: 'wifi' },
    { label: 'Autenticando', icon: 'key' },
    { label: 'Buscando procesos', icon: 'search' },
    { label: 'Procesando resultados', icon: 'file-text' }
  ]

  const getProgressData = () => {
    switch (searchState.status) {
      case 'connecting':
        return {
          currentStep: 0,
          completedSteps: [],
          progressText: 'Conectando con el servidor...'
        }
      case 'authenticating':
        return {
          currentStep: 1,
          completedSteps: [0],
          progressText: 'Autenticando credenciales...'
        }
      case 'searching':
        return {
          currentStep: 2,
          completedSteps: [0, 1],
          progressText: `Buscando en ${searchState.totalJuzgados || 5} juzgados... ${searchState.progress || 0}% completado`
        }
      case 'processing':
        return {
          currentStep: 3,
          completedSteps: [0, 1, 2],
          progressText: `Procesando ${searchState.resultsFound || 0} resultados encontrados...`
        }
      case 'completed':
        return {
          currentStep: 3,
          completedSteps: [0, 1, 2, 3],
          progressText: `¡Búsqueda completada! ${searchState.resultsFound || 0} procesos encontrados.`
        }
      case 'error':
        return {
          currentStep: searchState.errorStep || 0,
          completedSteps: [],
          progressText: searchState.errorMessage || 'Error en la búsqueda'
        }
      default:
        return {
          currentStep: 0,
          completedSteps: [],
          progressText: 'Iniciando búsqueda...'
        }
    }
  }

  const { currentStep, completedSteps, progressText } = getProgressData()

  return (
    <ProgressSteps
      steps={steps}
      currentStep={currentStep}
      completedSteps={completedSteps}
      progressText={progressText}
      className={className}
      animated={true}
    />
  )
}

// Mini componente para progreso lineal
function LinearProgress({ 
  value = 0, 
  max = 100, 
  className = '',
  variant = 'default',
  showLabel = false,
  label = ''
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  return (
    <div className={cn('linear-progress', `linear-progress-${variant}`, className)}>
      {showLabel && (
        <div className="linear-progress-label">
          {label || `${Math.round(percentage)}%`}
        </div>
      )}
      <div className="linear-progress-track">
        <div 
          className="linear-progress-bar"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Exportar componentes
ProgressSteps.Search = SearchProgressSteps
ProgressSteps.Linear = LinearProgress

export default ProgressSteps
