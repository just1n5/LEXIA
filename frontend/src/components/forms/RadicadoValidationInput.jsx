// 🏛️ components/forms/RadicadoValidationInput.jsx
// Componente avanzado de validación de números de radicación
// Basado en información oficial de la Rama Judicial de Colombia

import React, { useState } from 'react';
import { useAdvancedRadicadoValidation } from '../../hooks/useAdvancedRadicadoValidation';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Eye, 
  Copy, 
  RefreshCw,
  HelpCircle,
  Zap
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

/**
 * 🎯 Componente de Input con validación avanzada para números de radicación
 * 
 * Características:
 * - Validación en tiempo real basada en estructura oficial
 * - Feedback visual claro con sugerencias inteligentes
 * - Información contextual sobre la estructura del radicado
 * - Formato automático para mejor legibilidad
 * - Acciones rápidas (copiar, limpiar, ejemplo)
 * - Responsive y accesible
 */
export const RadicadoValidationInput = ({
  label = "Número de Radicación",
  required = true,
  className = "",
  onValidRadicado = null,
  showStructureInfo = true,
  showQuickActions = true,
  ...props
}) => {
  const [showFormatted, setShowFormatted] = useState(false);
  const [showStructureDetails, setShowStructureDetails] = useState(false);
  
  const {
    value,
    setValue,
    validationState,
    message,
    suggestions,
    isValidating,
    detectedPattern,
    validateSync,
    getInputProps,
    clear,
    retry,
    isValid,
    hasError,
    hasWarning,
    isEmpty,
    isComplete,
    cleanValue,
    formattedValue,
    officialStructure,
    progress
  } = useAdvancedRadicadoValidation(props.defaultValue || '');

  // 🎨 Estilos dinámicos basados en estado de validación
  const getInputStyles = () => {
    const baseStyles = `
      w-full px-sm py-sm text-body-paragraph font-sans
      border-2 rounded-md transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-interactive-default/20
      placeholder:text-text-secondary
    `;
    
    if (isValidating) {
      return `${baseStyles} border-tech-accent bg-tech-accent/5 focus:border-tech-accent`;
    }
    
    switch (validationState) {
      case 'valid':
        return `${baseStyles} border-feedback-success bg-feedback-success-light/30 focus:border-feedback-success`;
      case 'warning':
        return `${baseStyles} border-feedback-warning bg-feedback-warning-light/30 focus:border-feedback-warning`;
      case 'error':
        return `${baseStyles} border-feedback-error bg-feedback-error-light/30 focus:border-feedback-error`;
      default:
        return `${baseStyles} border-border-default bg-bg-canvas hover:border-interactive-default/50 focus:border-interactive-default`;
    }
  };

  // 🎯 Obtener icono según estado
  const getStatusIcon = () => {
    if (isValidating) {
      return <RefreshCw className="w-4 h-4 text-tech-accent animate-spin" />;
    }
    
    switch (validationState) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-feedback-success" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-feedback-warning" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-feedback-error" />;
      default:
        return isEmpty ? null : <Info className="w-4 h-4 text-text-secondary" />;
    }
  };

  // 📝 Handler para cambios - sincronizar con props
  const handleChange = (newValue) => {
    setValue(newValue);
    
    // Callback cuando el radicado es válido
    if (onValidRadicado && validationState === 'valid') {
      onValidRadicado({
        value: newValue,
        cleanValue: newValue.replace(/\D/g, ''),
        formattedValue: formatRadicado(newValue.replace(/\D/g, '')),
        patternInfo: detectedPattern
      });
    }
  };

  // 🎨 Formatear número para visualización
  const formatRadicado = (cleanValue) => {
    if (cleanValue && cleanValue.length === 23) {
      return cleanValue.replace(
        /(\d{5})(\d{2})(\d{2})(\d{3})(\d{4})(\d{5})(\d{2})/,
        '$1-$2-$3-$4-$5-$6-$7'
      );
    }
    return cleanValue;
  };

  // 📋 Copiar al portapapeles
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Aquí podrías agregar un toast de confirmación
    } catch (err) {
      console.warn('No se pudo copiar al portapapeles');
    }
  };

  return (
    <div className={`space-y-sm ${className}`}>
      {/* 🏷️ Label principal */}
      <div className="flex items-center justify-between">
        <label className="text-body-paragraph font-sans font-medium text-text-primary">
          {label}
          {required && <span className="text-feedback-error ml-1">*</span>}
        </label>
        
        {showStructureInfo && (
          <button
            type="button"
            onClick={() => setShowStructureDetails(!showStructureDetails)}
            className="text-body-auxiliary font-sans text-tech-accent hover:text-tech-accent/80 
                     flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3 h-3" />
            Estructura
          </button>
        )}
      </div>

      {/* 📊 Barra de progreso */}
      {!isEmpty && (
        <div className="w-full bg-border-default rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all duration-300 ${
              isComplete ? 'bg-feedback-success' : 'bg-interactive-default'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* 📝 Input principal */}
      <div className="relative">
        <input
          {...getInputProps()}
          type="text"
          className={getInputStyles()}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={showFormatted ? "05001-31-00-012-2021-00001-00" : "05001310012021000100"}
          {...props}
        />
        
        {/* 🎯 Icono de estado */}
        <div className="absolute right-sm top-1/2 transform -translate-y-1/2 flex items-center gap-xs">
          {getStatusIcon()}
          
          {/* 👁️ Toggle formato */}
          {!isEmpty && (
            <button
              type="button"
              onClick={() => setShowFormatted(!showFormatted)}
              className="text-text-secondary hover:text-interactive-default transition-colors"
              title={showFormatted ? "Ver sin formato" : "Ver con formato"}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 📋 Acciones rápidas */}
      {showQuickActions && !isEmpty && (
        <div className="flex gap-xs">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(cleanValue)}
            className="text-body-auxiliary"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copiar
          </Button>
          
          {isComplete && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(formattedValue)}
              className="text-body-auxiliary"
            >
              <Copy className="w-3 h-3 mr-1" />
              Formato
            </Button>
          )}
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clear}
            className="text-body-auxiliary text-feedback-error hover:text-feedback-error/80"
          >
            Limpiar
          </Button>
        </div>
      )}

      {/* 💬 Mensaje de validación */}
      {message && (
        <div className={`text-body-auxiliary font-sans flex items-start gap-xs ${
          validationState === 'valid' ? 'text-feedback-success' :
          validationState === 'warning' ? 'text-feedback-warning' :
          validationState === 'error' ? 'text-feedback-error' :
          'text-text-secondary'
        }`}>
          <div className="flex-shrink-0 mt-0.5">
            {getStatusIcon()}
          </div>
          <span>{message}</span>
        </div>
      )}

      {/* 💡 Sugerencias */}
      {suggestions.length > 0 && (
        <div className="space-y-xs">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center justify-between p-xs rounded-md bg-bg-light border border-border-default">
              <span className="text-body-auxiliary font-sans text-text-base">
                {suggestion.text}
              </span>
              {suggestion.action && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={suggestion.action}
                  className="text-interactive-default hover:text-interactive-hover"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Aplicar
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 📊 Información de estructura (expandible) */}
      {showStructureDetails && officialStructure && (
        <Card className="p-md bg-bg-light border border-border-default">
          <div className="space-y-sm">
            <div className="flex items-center gap-sm">
              <Info className="w-4 h-4 text-tech-accent" />
              <h4 className="text-heading-h4 font-heading text-text-primary">
                Estructura Oficial del Radicado
              </h4>
            </div>
            
            <p className="text-body-auxiliary font-sans text-text-secondary">
              Según Acuerdo No. 201 de 1997 - Rama Judicial de Colombia
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-xs">
              {officialStructure.map((part, index) => (
                <div key={index} className="flex justify-between items-center p-xs rounded bg-bg-canvas">
                  <div>
                    <span className="text-body-auxiliary font-sans font-medium text-text-primary">
                      {part.name}
                    </span>
                    <span className="text-body-auxiliary font-sans text-text-secondary ml-sm">
                      ({part.length} dígitos)
                    </span>
                  </div>
                  {detectedPattern?.parts && detectedPattern.parts[index] && (
                    <span className="text-body-auxiliary font-sans font-mono text-tech-accent bg-tech-accent/10 px-xs py-1 rounded">
                      {detectedPattern.parts[index].value}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-body-auxiliary font-sans text-text-secondary">
              <strong>Formato:</strong> DDDDD-EE-SS-DDD-AAAA-CCCCC-RR
            </div>
          </div>
        </Card>
      )}

      {/* 🎯 Información del patrón detectado */}
      {detectedPattern && isComplete && (
        <Card className="p-md bg-feedback-success-light/30 border border-feedback-success">
          <div className="flex items-start gap-sm">
            <CheckCircle className="w-5 h-5 text-feedback-success flex-shrink-0 mt-0.5" />
            <div className="space-y-xs">
              <div className="text-body-paragraph font-sans font-medium text-feedback-success">
                ✅ Estructura Válida Detectada
              </div>
              <div className="text-body-auxiliary font-sans text-text-base">
                {detectedPattern.description}
              </div>
              <div className="text-body-auxiliary font-sans font-mono text-text-secondary bg-bg-canvas px-xs py-1 rounded">
                {formattedValue}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// 🎯 Subcomponente para información de ayuda
export const RadicadoHelpInfo = () => {
  return (
    <Card className="p-md bg-bg-light border border-border-default">
      <div className="space-y-sm">
        <div className="flex items-center gap-sm">
          <HelpCircle className="w-4 h-4 text-tech-accent" />
          <h4 className="text-heading-h4 font-heading text-text-primary">
            ¿Qué es el número de radicación?
          </h4>
        </div>
        
        <div className="text-body-auxiliary font-sans text-text-base space-y-xs">
          <p>
            El número de radicación es un código único de <strong>23 dígitos</strong> que 
            identifica cada proceso judicial en Colombia.
          </p>
          
          <p>
            <strong>Ejemplo:</strong> 05001310012021000100
          </p>
          
          <div className="bg-bg-canvas p-xs rounded border border-border-default">
            <div className="text-body-auxiliary font-sans text-text-secondary">
              <strong>Estructura:</strong>
            </div>
            <ul className="text-body-auxiliary font-sans text-text-base mt-xs space-y-1">
              <li>• <strong>05001:</strong> Código de ubicación (Departamento + Ciudad)</li>
              <li>• <strong>31:</strong> Código de la entidad</li>
              <li>• <strong>00:</strong> Código de especialidad</li>
              <li>• <strong>012:</strong> Número del despacho</li>
              <li>• <strong>2021:</strong> Año de radicación</li>
              <li>• <strong>00001:</strong> Número consecutivo del proceso</li>
              <li>• <strong>00:</strong> Recurso (00 = primera instancia)</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RadicadoValidationInput;