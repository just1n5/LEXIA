import React, { useState, useEffect } from 'react';
import { Check, ChevronRight, Circle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useMobileDetection } from '../../hooks/mobile/useMobileDetection';

/**
 * Sistema de stepper avanzado para procesos multi-paso
 * Incluye estados, validaciones y feedback visual rico
 */
const AdvancedStepper = ({ 
  steps = [],
  currentStep = 0,
  completed = [],
  errors = [],
  warnings = [],
  orientation = 'horizontal',
  showLabels = true,
  showDescription = true,
  interactive = false,
  onStepClick,
  className = '',
  ...props 
}) => {
  const { isMobile } = useMobileDetection();
  
  // En móvil, siempre usar orientación vertical
  const actualOrientation = isMobile ? 'vertical' : orientation;
  
  const getStepStatus = (stepIndex) => {
    if (completed.includes(stepIndex)) return 'completed';
    if (errors.includes(stepIndex)) return 'error';
    if (warnings.includes(stepIndex)) return 'warning';
    if (stepIndex === currentStep) return 'current';
    if (stepIndex < currentStep) return 'passed';
    return 'pending';
  };

  const getStepIcon = (step, stepIndex, status) => {
    if (step.icon && status === 'pending') return step.icon;
    if (step.icon && status === 'current') return step.icon;
    
    switch (status) {
      case 'completed':
        return <Check size={16} />;
      case 'error':
        return <AlertCircle size={16} />;
      case 'warning':
        return <AlertCircle size={16} />;
      case 'current':
        return step.icon || <Clock size={16} />;
      case 'passed':
        return <Check size={16} />;
      default:
        return <Circle size={16} />;
    }
  };

  const getStepClasses = (stepIndex, status) => {
    const baseClasses = cn(
      'flex items-center gap-sm transition-all duration-300',
      interactive && 'cursor-pointer hover:scale-105'
    );

    const statusClasses = {
      completed: 'text-feedback-success',
      error: 'text-feedback-error',
      warning: 'text-feedback-warning',
      current: 'text-interactive-default',
      passed: 'text-feedback-success',
      pending: 'text-text-secondary'
    };

    return cn(baseClasses, statusClasses[status]);
  };

  const getConnectorClasses = (stepIndex, status, nextStatus) => {
    const baseClasses = 'transition-all duration-300';
    
    if (actualOrientation === 'vertical') {
      return cn(
        baseClasses,
        'w-px h-8 ml-3',
        status === 'completed' || status === 'passed' ? 'bg-feedback-success' : 'bg-border-default'
      );
    }
    
    return cn(
      baseClasses,
      'h-px flex-1 mx-md',
      status === 'completed' || status === 'passed' ? 'bg-feedback-success' : 'bg-border-default'
    );
  };

  const handleStepClick = (stepIndex) => {
    if (interactive && onStepClick) {
      onStepClick(stepIndex);
    }
  };

  return (
    <div 
      className={cn(
        'stepper',
        actualOrientation === 'vertical' ? 'space-y-md' : 'flex items-center w-full',
        className
      )}
      {...props}
    >
      {steps.map((step, stepIndex) => {
        const status = getStepStatus(stepIndex);
        const nextStatus = stepIndex < steps.length - 1 ? getStepStatus(stepIndex + 1) : null;
        const icon = getStepIcon(step, stepIndex, status);
        
        return (
          <React.Fragment key={stepIndex}>
            {/* Step Item */}
            <div
              className={cn(
                getStepClasses(stepIndex, status),
                actualOrientation === 'vertical' ? 'w-full' : 'flex-shrink-0'
              )}
              onClick={() => handleStepClick(stepIndex)}
            >
              {/* Step Icon/Number */}
              <div className={cn(
                'flex items-center justify-center rounded-full border-2 transition-all duration-300',
                isMobile ? 'w-8 h-8' : 'w-10 h-10',
                {
                  'border-feedback-success bg-feedback-success text-bg-canvas': status === 'completed' || status === 'passed',
                  'border-feedback-error bg-feedback-error text-bg-canvas': status === 'error',
                  'border-feedback-warning bg-feedback-warning text-text-primary': status === 'warning',
                  'border-interactive-default bg-interactive-default text-text-primary animate-pulse-subtle': status === 'current',
                  'border-border-default bg-bg-canvas text-text-secondary': status === 'pending'
                }
              )}>
                {icon || <span className="text-sm font-medium">{stepIndex + 1}</span>}
              </div>

              {/* Step Content */}
              {(showLabels || showDescription) && (
                <div className={cn(
                  'flex-1 min-w-0',
                  actualOrientation === 'horizontal' && !isMobile && 'hidden md:block'
                )}>
                  {showLabels && (
                    <div className={cn(
                      'font-medium transition-colors duration-300',
                      isMobile ? 'text-body-auxiliary' : 'text-body-paragraph',
                      status === 'current' && 'text-interactive-default'
                    )}>
                      {step.label}
                    </div>
                  )}
                  
                  {showDescription && step.description && (
                    <div className={cn(
                      'text-text-secondary transition-colors duration-300',
                      isMobile ? 'text-xs' : 'text-body-auxiliary',
                      status === 'current' && 'text-text-base'
                    )}>
                      {step.description}
                    </div>
                  )}

                  {/* Error/Warning Messages */}
                  {status === 'error' && step.errorMessage && (
                    <div className="text-feedback-error text-body-auxiliary mt-xs">
                      {step.errorMessage}
                    </div>
                  )}
                  
                  {status === 'warning' && step.warningMessage && (
                    <div className="text-feedback-warning text-body-auxiliary mt-xs">
                      {step.warningMessage}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Connector */}
            {stepIndex < steps.length - 1 && (
              <div className={getConnectorClasses(stepIndex, status, nextStatus)} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/**
 * Hook para manejar el estado del stepper
 */
export const useStepper = (totalSteps, initialStep = 0) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [errorSteps, setErrorSteps] = useState([]);
  const [warningSteps, setWarningSteps] = useState([]);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStep(stepIndex);
    }
  };

  const completeStep = (stepIndex) => {
    setCompletedSteps(prev => [...new Set([...prev, stepIndex])]);
    setErrorSteps(prev => prev.filter(step => step !== stepIndex));
    setWarningSteps(prev => prev.filter(step => step !== stepIndex));
  };

  const setStepError = (stepIndex, errorMessage = '') => {
    setErrorSteps(prev => [...new Set([...prev, stepIndex])]);
    setCompletedSteps(prev => prev.filter(step => step !== stepIndex));
  };

  const setStepWarning = (stepIndex, warningMessage = '') => {
    setWarningSteps(prev => [...new Set([...prev, stepIndex])]);
  };

  const clearStepStatus = (stepIndex) => {
    setCompletedSteps(prev => prev.filter(step => step !== stepIndex));
    setErrorSteps(prev => prev.filter(step => step !== stepIndex));
    setWarningSteps(prev => prev.filter(step => step !== stepIndex));
  };

  const reset = () => {
    setCurrentStep(initialStep);
    setCompletedSteps([]);
    setErrorSteps([]);
    setWarningSteps([]);
  };

  return {
    currentStep,
    completedSteps,
    errorSteps,
    warningSteps,
    nextStep,
    prevStep,
    goToStep,
    completeStep,
    setStepError,
    setStepWarning,
    clearStepStatus,
    reset,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress: ((completedSteps.length + (currentStep > 0 ? 1 : 0)) / totalSteps) * 100
  };
};

/**
 * Componente de navegación para stepper
 */
const StepperNavigation = ({ 
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  nextLabel = 'Siguiente',
  prevLabel = 'Anterior',
  canGoNext = true,
  canGoPrev = true,
  isLoading = false,
  className = '',
  ...props 
}) => {
  const { isMobile } = useMobileDetection();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div 
      className={cn(
        'flex gap-sm',
        isMobile ? 'flex-col w-full' : 'justify-between items-center',
        className
      )}
      {...props}
    >
      {/* Botón Anterior */}
      <button
        onClick={onPrev}
        disabled={isFirstStep || !canGoPrev || isLoading}
        className={cn(
          'btn btn-secondary',
          isMobile && 'w-full order-2'
        )}
      >
        <ChevronRight size={16} className="rotate-180" />
        {prevLabel}
      </button>

      {/* Indicador de progreso (solo en móvil) */}
      {isMobile && (
        <div className="text-center text-body-auxiliary text-text-secondary order-1">
          Paso {currentStep + 1} de {totalSteps}
        </div>
      )}

      {/* Botón Siguiente */}
      <button
        onClick={onNext}
        disabled={isLastStep || !canGoNext || isLoading}
        className={cn(
          'btn btn-primary',
          isMobile && 'w-full order-3'
        )}
      >
        {isLoading ? (
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <ChevronRight size={16} />
        )}
        {isLastStep ? 'Finalizar' : nextLabel}
      </button>
    </div>
  );
};

// Asignar subcomponentes
AdvancedStepper.Navigation = StepperNavigation;
AdvancedStepper.useStepper = useStepper;

export default AdvancedStepper;