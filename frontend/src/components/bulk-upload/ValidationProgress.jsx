import React from 'react';
import { Zap, Check, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Componente para mostrar el progreso de validación con pasos detallados
 * Incluye barra de progreso animada y estado actual
 */
const ValidationProgress = ({ 
  progress = 0, 
  currentStep = '',
  status = 'processing', // processing, success, error
  className = '',
  ...props 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <Check size={20} className="text-feedback-success" />;
      case 'error':
        return <AlertCircle size={20} className="text-feedback-error" />;
      case 'processing':
      default:
        return <Zap size={20} className="text-feedback-info animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-feedback-success';
      case 'error':
        return 'bg-feedback-error';
      case 'processing':
      default:
        return 'bg-interactive-default';
    }
  };

  const progressSteps = [
    { step: 'Leyendo archivo...', minProgress: 0 },
    { step: 'Analizando estructura...', minProgress: 20 },
    { step: 'Extrayendo datos...', minProgress: 40 },
    { step: 'Validando radicados...', minProgress: 60 },
    { step: 'Generando vista previa...', minProgress: 80 },
    { step: 'Procesamiento completado', minProgress: 100 }
  ];

  const getCurrentStepIndex = () => {
    return progressSteps.findIndex(step => 
      step.step === currentStep || progress >= step.minProgress
    );
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className={cn('space-y-md', className)} {...props}>
      {/* Header con icono de estado */}
      <div className="flex items-center gap-sm">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="flex justify-between items-center text-body-paragraph">
            <span className="font-medium text-text-primary">
              {status === 'success' ? 'Completado' : 
               status === 'error' ? 'Error en procesamiento' : 
               'Procesando archivo...'}
            </span>
            <span className={cn(
              'text-body-auxiliary font-medium',
              status === 'success' ? 'text-feedback-success' :
              status === 'error' ? 'text-feedback-error' :
              'text-interactive-default'
            )}>
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Barra de progreso principal */}
      <div className="space-y-xs">
        <div className="w-full bg-bg-light rounded-full h-3 overflow-hidden shadow-inner">
          <div 
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              getStatusColor(),
              progress > 0 && 'shadow-sm'
            )}
            style={{ 
              width: `${Math.max(progress, 0)}%`,
              transform: progress > 0 ? 'translateX(0)' : 'translateX(-100%)'
            }}
          >
            {/* Efecto de brillo animado */}
            {status === 'processing' && progress < 100 && (
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white via-opacity-30 to-transparent animate-shimmer" />
            )}
          </div>
        </div>
        
        {/* Paso actual */}
        {currentStep && (
          <p className="text-body-auxiliary text-text-secondary">
            {currentStep}
          </p>
        )}
      </div>

      {/* Detalles de pasos (mostrar solo durante procesamiento) */}
      {status === 'processing' && (
        <div className="space-y-xs">
          <h5 className="text-body-auxiliary font-medium text-text-primary">
            Progreso detallado:
          </h5>
          <div className="space-y-xs">
            {progressSteps.map((step, index) => {
              const isCompleted = progress > step.minProgress;
              const isCurrent = index === currentStepIndex;
              const isUpcoming = index > currentStepIndex;

              return (
                <div 
                  key={index}
                  className={cn(
                    'flex items-center gap-sm text-body-auxiliary transition-all duration-300',
                    isCompleted && 'text-feedback-success',
                    isCurrent && 'text-interactive-default font-medium',
                    isUpcoming && 'text-text-secondary opacity-60'
                  )}
                >
                  {/* Indicador de estado */}
                  <div className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    isCompleted && 'bg-feedback-success scale-110',
                    isCurrent && 'bg-interactive-default animate-pulse scale-110',
                    isUpcoming && 'bg-border-default'
                  )} />
                  
                  {/* Texto del paso */}
                  <span className={cn(
                    'transition-all duration-300',
                    isCurrent && 'transform translate-x-1'
                  )}>
                    {step.step}
                  </span>
                  
                  {/* Checkmark para pasos completados */}
                  {isCompleted && (
                    <Check size={12} className="text-feedback-success ml-auto" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mensaje de estado final */}
      {status === 'success' && (
        <div className="p-sm bg-feedback-success-light border border-feedback-success rounded-md">
          <div className="flex items-center gap-sm text-feedback-success">
            <Check size={16} />
            <span className="text-body-auxiliary font-medium">
              Archivo procesado exitosamente
            </span>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="p-sm bg-feedback-error-light border border-feedback-error rounded-md">
          <div className="flex items-center gap-sm text-feedback-error">
            <AlertCircle size={16} />
            <span className="text-body-auxiliary font-medium">
              Error durante el procesamiento
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationProgress;