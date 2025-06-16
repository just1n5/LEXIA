// 🎨 components/forms/EnhancedValidationMessage.jsx
// Componente visual mejorado para mostrar estados de validación con animaciones

import React from 'react';
import { cn } from '../../utils/cn';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Loader2, 
  Info,
  ExternalLink,
  RefreshCw,
  Copy,
  Eye,
  Lightbulb
} from 'lucide-react';
import Button from '../ui/Button';

/**
 * 🎨 EnhancedValidationMessage - Mensajes de validación con micro-interacciones
 * 
 * Características:
 * - Estados visuales claros y accesibles
 * - Animaciones sutiles de entrada/salida
 * - Acciones contextuales (retry, copy, links)
 * - Información educativa
 * - Soporte para sugerencias múltiples
 */
const EnhancedValidationMessage = ({
  state = 'idle',
  message = '',
  suggestions = [],
  detectedPattern = null,
  isValidating = false,
  className = '',
  showPatternInfo = true,
  showSuggestions = true,
  onRetry,
  onCopy,
  ...props
}) => {

  // 🎯 Configuración por estado
  const stateConfig = {
    idle: {
      show: false,
      icon: null,
      bgClass: '',
      textClass: '',
      borderClass: ''
    },
    validating: {
      show: true,
      icon: Loader2,
      bgClass: 'bg-feedback-info-light',
      textClass: 'text-feedback-info',
      borderClass: 'border-feedback-info',
      animation: 'animate-spin'
    },
    valid: {
      show: true,
      icon: CheckCircle2,
      bgClass: 'bg-feedback-success-light',
      textClass: 'text-feedback-success',
      borderClass: 'border-feedback-success',
      animation: 'animate-pulse-success'
    },
    warning: {
      show: true,
      icon: AlertTriangle,
      bgClass: 'bg-feedback-warning-light',
      textClass: 'text-feedback-warning',
      borderClass: 'border-feedback-warning',
      animation: 'animate-bounce-subtle'
    },
    error: {
      show: true,
      icon: AlertCircle,
      bgClass: 'bg-feedback-error-light',
      textClass: 'text-feedback-error',
      borderClass: 'border-feedback-error',
      animation: 'animate-shake-subtle'
    }
  };

  const config = stateConfig[state] || stateConfig.idle;
  const IconComponent = config.icon;

  if (!config.show && !message) return null;

  // 🎨 Renderizar sugerencias
  const renderSuggestions = () => {
    if (!showSuggestions || !suggestions.length) return null;

    return (
      <div className="mt-sm space-y-xs">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index}
            className="flex items-start gap-xs"
          >
            {/* Icono por tipo de sugerencia */}
            <div className="mt-1">
              {suggestion.type === 'correction' && <RefreshCw size={12} className="text-feedback-warning" />}
              {suggestion.type === 'example' && <Eye size={12} className="text-feedback-info" />}
              {suggestion.type === 'help' && <ExternalLink size={12} className="text-feedback-info" />}
              {suggestion.type === 'retry' && <RefreshCw size={12} className="text-feedback-warning" />}
              {suggestion.type === 'info' && <Info size={12} className="text-text-secondary" />}
              {suggestion.type === 'success' && <CheckCircle2 size={12} className="text-feedback-success" />}
              {suggestion.type === 'suggestion' && <Lightbulb size={12} className="text-interactive-default" />}
            </div>
            
            {/* Contenido de la sugerencia */}
            <div className="flex-1 min-w-0">
              {suggestion.action ? (
                <Button
                  variant="link"
                  size="sm"
                  onClick={suggestion.action}
                  className="text-left p-0 h-auto text-body-auxiliary hover:underline"
                >
                  {suggestion.text}
                </Button>
              ) : (
                <span className="text-body-auxiliary text-text-secondary">
                  {suggestion.text}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 🔍 Renderizar información del patrón detectado
  const renderPatternInfo = () => {
    if (!showPatternInfo || !detectedPattern) return null;

    return (
      <div className="mt-sm p-sm bg-feedback-success-light/50 border border-feedback-success/30 rounded-md">
        <div className="flex items-start gap-sm">
          <Info size={16} className="text-feedback-success mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="text-body-auxiliary font-medium text-feedback-success mb-xs">
              Patrón detectado
            </h4>
            <p className="text-body-auxiliary text-feedback-success mb-sm">
              {detectedPattern.description}
            </p>
            
            {/* Desglose de partes */}
            {detectedPattern.parts && detectedPattern.parts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-xs">
                {detectedPattern.parts.map((part, index) => (
                  <div 
                    key={index}
                    className="flex flex-col"
                  >
                    <span className="text-xs font-medium text-feedback-success opacity-75">
                      {part.label}
                    </span>
                    <span className="text-body-auxiliary font-mono text-feedback-success bg-feedback-success/10 px-xs py-xs rounded text-center">
                      {part.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 🎮 Renderizar acciones contextuales
  const renderActions = () => {
    const actions = [];
    
    if (onRetry && (state === 'error' || state === 'warning')) {
      actions.push(
        <Button
          key="retry"
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="text-current hover:bg-current/10"
        >
          <RefreshCw size={12} className="mr-xs" />
          Reintentar
        </Button>
      );
    }
    
    if (onCopy && state === 'valid') {
      actions.push(
        <Button
          key="copy"
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="text-current hover:bg-current/10"
        >
          <Copy size={12} className="mr-xs" />
          Copiar
        </Button>
      );
    }

    if (actions.length === 0) return null;

    return (
      <div className="flex gap-xs mt-sm">
        {actions}
      </div>
    );
  };

  return (
    <div 
      className={cn(
        'transition-all duration-300 ease-in-out',
        config.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
        className
      )}
      role="alert"
      aria-live="polite"
      {...props}
    >
      {/* Mensaje principal */}
      {(message || config.show) && (
        <div className={cn(
          'flex items-start gap-sm p-sm rounded-md border',
          'transition-colors duration-200',
          config.bgClass,
          config.borderClass
        )}>
          {/* Icono de estado */}
          {IconComponent && (
            <div className="flex-shrink-0 mt-0.5">
              <IconComponent 
                size={16} 
                className={cn(
                  config.textClass,
                  state === 'validating' && 'animate-spin'
                )}
              />
            </div>
          )}
          
          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            {/* Mensaje */}
            {message && (
              <p className={cn(
                'text-body-auxiliary font-medium',
                config.textClass
              )}>
                {message}
              </p>
            )}
            
            {/* Información adicional de validación */}
            {isValidating && !message && (
              <p className={cn(
                'text-body-auxiliary font-medium',
                config.textClass
              )}>
                Validando número de radicado...
              </p>
            )}
            
            {/* Acciones contextuales */}
            {renderActions()}
          </div>
        </div>
      )}
      
      {/* Información del patrón */}
      {renderPatternInfo()}
      
      {/* Sugerencias */}
      {renderSuggestions()}
    </div>
  );
};

// 🎯 Componentes de conveniencia
EnhancedValidationMessage.Success = ({ children, ...props }) => (
  <EnhancedValidationMessage 
    state="valid" 
    message={children} 
    {...props} 
  />
);

EnhancedValidationMessage.Error = ({ children, ...props }) => (
  <EnhancedValidationMessage 
    state="error" 
    message={children} 
    {...props} 
  />
);

EnhancedValidationMessage.Warning = ({ children, ...props }) => (
  <EnhancedValidationMessage 
    state="warning" 
    message={children} 
    {...props} 
  />
);

EnhancedValidationMessage.Loading = ({ children, ...props }) => (
  <EnhancedValidationMessage 
    state="validating" 
    message={children} 
    {...props} 
  />
);

export default EnhancedValidationMessage;