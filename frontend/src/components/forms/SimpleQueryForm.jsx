import React from 'react';
import { useForm } from 'react-hook-form';
import { useRadicadoValidation } from '../../hooks/useRadicadoValidation';
import ValidationMessage from './ValidationMessage';
import FrequencyInfoTest from './FrequencyInfo-test';

const SimpleQueryForm = ({ onSubmit, loading = false }) => {
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
    <div className="form-card">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="form-section">
          <h3 className="form-section-title">Datos de la consulta</h3>
          
          <div className="form-group">
            <label htmlFor="alias">Nombre Descriptivo (Alias)</label>
            <input
              {...register('alias', { 
                required: 'El alias es requerido',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' }
              })}
              type="text"
              id="alias"
              className={`form-control ${errors.alias ? 'error' : ''}`}
              placeholder="Ej: Caso Familia García, Demanda Empresa XYZ..."
            />
            {errors.alias && (
              <p className="error-text">{errors.alias.message}</p>
            )}
            <p className="helper-text">Un nombre que te ayude a identificar fácilmente esta solicitud</p>
          </div>
          
          <div className={`form-group ${validationState}`}>
            <label htmlFor="numeroRadicado">Número de Radicado</label>
            <input
              {...register('numeroRadicado', { 
                required: 'El número de radicado es requerido',
                pattern: {
                  value: /^\d{4}-[A-Z]{2}-\d{6}$/,
                  message: 'Formato inválido. Debe ser: AAAA-LL-NNNNNN'
                }
              })}
              type="text"
              id="numeroRadicado"
              className={`form-control ${errors.numeroRadicado ? 'error' : ''}`}
              placeholder="Ej: 11001310300120210012300"
            />
            {errors.numeroRadicado && (
              <p className="error-text">{errors.numeroRadicado.message}</p>
            )}
            <ValidationMessage 
              state={validationState}
              message={validationMessage}
            />
            <p className="helper-text">Ingresa el número de radicado completo del proceso judicial</p>
          </div>
        </div>
        
        {/* Sección de información de frecuencia (ya no selector) */}
        <div className="form-section">
          <h3 className="form-section-title">Frecuencia de notificación</h3>
          
          {/* Componente informativo en lugar de selector */}
          <FrequencyInfoTest />
          
          {/* Campo oculto para mantener compatibilidad con el backend */}
          <input 
            {...register('frecuencia')}
            type="hidden" 
            value="diario" 
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={loading || validationState === 'validating' || validationState === 'error'}
        >
          {loading ? 'Creando Solicitud...' : 'Crear Solicitud'}
        </button>
      </form>
      
      <style jsx>{`
        .form-card {
          background-color: var(--color-bg-canvas, #ffffff);
          border-radius: var(--border-radius-md, 0.5rem);
          border: 1px solid var(--color-border-default, #e5e7eb);
          padding: var(--spacing-xl, 1.5rem);
          margin-bottom: var(--spacing-xl, 1.5rem);
        }
        
        .form-section {
          margin-bottom: var(--spacing-xl, 1.5rem);
        }
        
        .form-section-title {
          font-size: var(--font-heading-h4, 1.25rem);
          font-weight: 600;
          margin-bottom: var(--spacing-md, 1rem);
          color: var(--color-text-base, #111827);
        }
        
        .form-group {
          margin-bottom: var(--spacing-lg, 1.25rem);
        }
        
        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: var(--spacing-xs, 0.25rem);
          color: var(--color-text-primary, #374151);
        }
        
        .form-control {
          width: 100%;
          padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
          border: 1px solid var(--color-border-default, #e5e7eb);
          border-radius: var(--border-radius-sm, 0.375rem);
          font-size: var(--font-body-paragraph, 1rem);
          transition: var(--transition-default, all 0.2s ease-in-out);
        }
        
        .form-control:focus {
          outline: none;
          border-color: var(--color-interactive-default, #facc15);
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.1);
        }
        
        .form-control.error {
          border-color: var(--color-feedback-error, #ef4444);
        }
        
        .form-group.validating .form-control {
          border-color: #3b82f6;
        }
        
        .form-group.valid .form-control {
          border-color: #10b981;
        }
        
        .form-group.error .form-control {
          border-color: var(--color-feedback-error, #ef4444);
        }
        
        .helper-text {
          font-size: var(--font-body-auxiliary, 0.875rem);
          color: var(--color-text-secondary, #6b7280);
          margin-top: var(--spacing-xs, 0.25rem);
        }
        
        .error-text {
          font-size: var(--font-body-auxiliary, 0.875rem);
          color: var(--color-feedback-error, #ef4444);
          margin-top: var(--spacing-xs, 0.25rem);
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-sm, 0.5rem) var(--spacing-lg, 1.25rem);
          border-radius: var(--border-radius-sm, 0.375rem);
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition-default, all 0.2s ease-in-out);
          cursor: pointer;
          border: none;
        }
        
        .btn-primary {
          background-color: var(--color-interactive-default, #facc15);
          color: var(--color-text-base, #111827);
        }
        
        .btn-primary:hover:not(:disabled) {
          background-color: #eab308;
        }
        
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .btn-block {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default SimpleQueryForm;
