import React from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '../../utils/cn';
import { useRadicadoValidation } from '../../hooks/useRadicadoValidation';
import { Search, FileText, Clock, Info, AlertTriangle, Zap, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ValidationMessage from './ValidationMessage';
import FrequencyInfoTest from './FrequencyInfo-test';

/**
 * 🔍 SimpleQueryForm - FORMULARIO SENCILLO RAMA JUDICIAL
 * 
 * Formulario simplificado para búsqueda por número de radicado.
 * Migrado al design system para consistencia visual.
 * 
 * Características:
 * - Búsqueda únicamente por número de radicado
 * - Alias/nombre descriptivo obligatorio
 * - Frecuencia fija: diaria a las 7PM
 * - Validación en tiempo real del radicado
 */
const SimpleQueryForm = ({ onSubmit, loading = false, onCancel }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      alias: '',
      numeroRadicado: '',
      frecuencia: 'diario' // Valor fijo - no se puede cambiar
    }
  });

  const { validationState, validationMessage, validateRadicado } = useRadicadoValidation();
  
  const watchedRadicado = watch('numeroRadicado');

  // Validar radicado cuando cambie
  React.useEffect(() => {
    if (watchedRadicado) {
      validateRadicado(watchedRadicado);
    }
  }, [watchedRadicado, validateRadicado]);

  const handleFormSubmit = (data) => {
    const formData = {
      alias: data.alias,
      tipo_busqueda: 'radicado',
      criterio_busqueda_radicado: data.numeroRadicado,
      criterio_busqueda_nombre: null,
      frecuencia_envio: 'diario' // Siempre diario
    };
    
    onSubmit(formData);
  };

  return (
    <Card size="lg">
      <Card.Header>
        <div className="flex items-center justify-between">
          <div>
            <Card.Title className="flex items-center gap-sm">
              <Search className="w-5 h-5 text-interactive-default" />
              Configurar Consulta Sencilla
            </Card.Title>
            <p className="text-body-paragraph text-text-secondary mt-xs">
              Búsqueda directa y rápida por número de radicado
            </p>
          </div>
          <Badge variant="success" className="hidden md:flex">
            <CheckCircle className="w-3 h-3 mr-xs" />
            Básica
          </Badge>
        </div>
      </Card.Header>

      <Card.Content>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-2xl">
          
          {/* BANNER INFORMATIVO */}
          <div className="p-md bg-feedback-success-light border border-feedback-success rounded-md">
            <div className="flex items-start gap-sm">
              <Info className="w-5 h-5 text-feedback-success mt-xs" />
              <div>
                <h3 className="text-body-paragraph font-medium text-feedback-success mb-xs">
                  Formulario de Consulta Sencilla
                </h3>
                <p className="text-body-auxiliary text-feedback-success">
                  Configuración rápida y directa. Solo necesitas el número de radicado 
                  para comenzar el monitoreo automático.
                </p>
              </div>
            </div>
          </div>

          {/* SECCIÓN 1: DATOS DE LA CONSULTA */}
          <div>
            <h3 className="text-heading-h3 font-heading text-text-primary mb-md flex items-center gap-sm">
              <FileText className="w-5 h-5 text-interactive-default" />
              1. Datos de la Consulta
              <Badge variant="error" size="sm">Requerido</Badge>
            </h3>
            
            <div className="space-y-lg">
              {/* Alias/Nombre Descriptivo */}
              <div>
                <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                  * Nombre Descriptivo (Alias)
                </label>
                <input
                  {...register('alias', { 
                    required: 'El alias es requerido',
                    minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                  })}
                  type="text"
                  className={cn(
                    'w-full px-sm py-sm border rounded-md transition-colors',
                    'text-body-paragraph bg-bg-canvas text-text-base',
                    errors.alias 
                      ? 'border-feedback-error focus:border-feedback-error' 
                      : 'border-border-default focus:border-interactive-default',
                    'focus:outline-none'
                  )}
                  placeholder="Ej: Caso Familia García, Demanda Empresa XYZ..."
                />
                {errors.alias && (
                  <p className="text-body-auxiliary text-feedback-error mt-xs flex items-center gap-xs">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.alias.message}
                  </p>
                )}
                {!errors.alias && (
                  <p className="text-body-auxiliary text-text-secondary mt-xs">
                    Un nombre que te ayude a identificar fácilmente esta solicitud
                  </p>
                )}
              </div>
              
              {/* Número de Radicado */}
              <div>
                <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                  * Número de Radicado
                </label>
                <input
                  {...register('numeroRadicado', { 
                    required: 'El número de radicado es requerido',
                    pattern: {
                      value: /^\d{4}-[A-Z]{2}-\d{6}$/,
                      message: 'Formato inválido. Debe ser: AAAA-LL-NNNNNN'
                    }
                  })}
                  type="text"
                  className={cn(
                    'w-full px-sm py-sm border rounded-md transition-colors',
                    'text-body-paragraph bg-bg-canvas text-text-base',
                    errors.numeroRadicado 
                      ? 'border-feedback-error focus:border-feedback-error'
                      : validationState === 'validating'
                      ? 'border-feedback-info focus:border-feedback-info'
                      : validationState === 'valid'
                      ? 'border-feedback-success focus:border-feedback-success'
                      : validationState === 'error'
                      ? 'border-feedback-error focus:border-feedback-error'
                      : 'border-border-default focus:border-interactive-default',
                    'focus:outline-none'
                  )}
                  placeholder="Ej: 11001310300120210012300"
                />
                {errors.numeroRadicado && (
                  <p className="text-body-auxiliary text-feedback-error mt-xs flex items-center gap-xs">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.numeroRadicado.message}
                  </p>
                )}
                <ValidationMessage 
                  state={validationState}
                  message={validationMessage}
                />
                {!errors.numeroRadicado && !validationMessage && (
                  <p className="text-body-auxiliary text-text-secondary mt-xs">
                    Ingresa el número de radicado completo del proceso judicial
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* SECCIÓN 2: CONFIGURACIÓN DE AUTOMATIZACIÓN */}
          <div>
            <h3 className="text-heading-h3 font-heading text-text-primary mb-md flex items-center gap-sm">
              <Clock className="w-5 h-5 text-interactive-default" />
              2. Configuración de Automatización
            </h3>
            
            {/* Banner informativo de automatización */}
            <div className="bg-gradient-to-r from-feedback-success/10 to-interactive-default/10 border border-feedback-success/30 rounded-lg p-lg mb-md">
              <div className="flex items-start gap-sm mb-md">
                <div className="w-6 h-6 bg-feedback-success rounded-full flex items-center justify-center flex-shrink-0 mt-xs">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="text-body-paragraph font-semibold text-text-primary mb-xs">
                    Automatización Óptima Configurada
                  </h4>
                  <p className="text-body-auxiliary text-text-base mb-md">
                    Tu consulta sencilla se ejecutará automáticamente con la configuración más eficiente.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex items-start gap-sm">
                  <div className="w-5 h-5 bg-feedback-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h5 className="text-body-paragraph font-medium text-text-primary mb-xs">
                      Ejecución Diaria Automática
                    </h5>
                    <p className="text-body-auxiliary text-text-secondary">
                      Verificación diaria del radicado <strong>{watchedRadicado || 'especificado'}</strong> todos los días a las 7:00 PM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-sm">
                  <div className="w-5 h-5 bg-feedback-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h5 className="text-body-paragraph font-medium text-text-primary mb-xs">
                      Notificaciones Inteligentes
                    </h5>
                    <p className="text-body-auxiliary text-text-secondary">
                      <strong>Email automático</strong> solo cuando se detecten cambios en el proceso judicial
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-md pt-md border-t border-feedback-success/20">
                <p className="text-body-auxiliary text-text-secondary text-center">
                  <CheckCircle className="w-3 h-3 inline mr-xs" />
                  <strong>Tiempo estimado:</strong> 1-2 minutos por verificación
                </p>
              </div>
            </div>
            
            {/* Componente temporal de frecuencia */}
            <FrequencyInfoTest />
            
            {/* Campo oculto para mantener compatibilidad con el backend */}
            <input 
              {...register('frecuencia')}
              type="hidden" 
              value="diario" 
            />
          </div>
          
          {/* BOTONES DE ACCIÓN */}
          <div className="flex flex-col sm:flex-row gap-sm justify-between pt-lg border-t border-border-default">
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={onCancel}
                disabled={loading}
                className="sm:w-auto"
              >
                Cancelar
              </Button>
            )}
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || validationState === 'validating' || validationState === 'error'}
              loading={loading}
              className="sm:w-auto flex-1 sm:flex-initial max-w-md ml-auto"
            >
              {loading ? 'Creando Solicitud...' : 'Crear Solicitud'}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

export default SimpleQueryForm;
