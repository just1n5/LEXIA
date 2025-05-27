import React from 'react';
import { useForm } from 'react-hook-form';
import { useRadicadoValidation } from '../../hooks/useRadicadoValidation';
import { useDepartmentCities } from '../../hooks/useDepartmentCities';
import ValidationMessage from './ValidationMessage';
import FrequencySelector from './FrequencySelector';

const AdvancedQueryForm = ({ onSubmit, loading = false }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      tipoPersona: '',
      numeroRadicado: '',
      nombresApellidos: '',
      departamento: '',
      ciudad: '',
      especialidad: '',
      despacho: '',
      frecuencia: 'diario',
      alias: ''
    }
  });

  const { validationState, validationMessage, validateRadicado } = useRadicadoValidation();
  const { 
    departamentos, 
    selectedDepartamento, 
    availableCiudades, 
    handleDepartamentoChange 
  } = useDepartmentCities();
  
  const watchedRadicado = watch('numeroRadicado');
  const watchedDepartamento = watch('departamento');
  const watchedFrecuencia = watch('frecuencia');

  // Validar radicado cuando cambie
  React.useEffect(() => {
    if (watchedRadicado) {
      validateRadicado(watchedRadicado);
    }
  }, [watchedRadicado, validateRadicado]);

  // Manejar cambio de departamento
  React.useEffect(() => {
    if (watchedDepartamento && watchedDepartamento !== selectedDepartamento) {
      handleDepartamentoChange(watchedDepartamento);
      setValue('ciudad', ''); // Reset ciudad cuando cambia departamento
    }
  }, [watchedDepartamento, selectedDepartamento, handleDepartamentoChange, setValue]);

  const handleFormSubmit = (data) => {
    const formData = {
      alias: data.alias,
      tipo_busqueda: data.numeroRadicado ? 'radicado' : 'nombre_razon_social',
      criterio_busqueda_radicado: data.numeroRadicado || null,
      criterio_busqueda_nombre: data.nombresApellidos || null,
      frecuencia_envio: data.frecuencia,
      // Campos adicionales para contexto
      tipo_persona: data.tipoPersona,
      departamento: data.departamento,
      ciudad: data.ciudad,
      especialidad: data.especialidad,
      despacho: data.despacho
    };
    
    onSubmit(formData);
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="form-columns">
          {/* Left Column - Criterio de Búsqueda */}
          <div className="form-column">
            <h3 className="form-column-title">Criterio de Búsqueda</h3>
            
            <div className="form-group">
              <label htmlFor="tipoPersona">Tipo de persona</label>
              <select
                {...register('tipoPersona')}
                id="tipoPersona"
                className="form-control"
              >
                <option value="" disabled>Persona Jurídica/Persona Natural</option>
                <option value="juridica">Persona Jurídica</option>
                <option value="natural">Persona Natural</option>
              </select>
            </div>
            
            <div className={`form-group ${validationState}`}>
              <label htmlFor="numeroRadicado">Número de Radicado</label>
              <input
                {...register('numeroRadicado')}
                type="text"
                id="numeroRadicado"
                className="form-control"
                placeholder="Número de Radicado"
              />
              <ValidationMessage 
                state={validationState}
                message={validationMessage}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="nombresApellidos">Nombres y Apellido/Razón social</label>
              <input
                {...register('nombresApellidos')}
                type="text"
                id="nombresApellidos"
                className="form-control"
                placeholder="Nombres y Apellidos"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="departamento">Departamento</label>
              <select
                {...register('departamento')}
                id="departamento"
                className="form-control"
              >
                <option value="" disabled>Departamento</option>
                {departamentos.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="ciudad">Ciudad</label>
              <select
                {...register('ciudad')}
                id="ciudad"
                className="form-control"
                disabled={!availableCiudades.length}
              >
                <option value="" disabled>Ciudad</option>
                {availableCiudades.map((ciudad) => (
                  <option key={ciudad.value} value={ciudad.value}>
                    {ciudad.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="especialidad">Especialidad</label>
              <input
                {...register('especialidad')}
                type="text"
                id="especialidad"
                className="form-control"
                placeholder="Especialidad"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="despacho">Despacho</label>
              <input
                {...register('despacho')}
                type="text"
                id="despacho"
                className="form-control"
                placeholder="Despacho"
              />
            </div>
          </div>
          
          {/* Right Column - Frecuencia de notificación */}
          <div className="form-column">
            <h3 className="form-column-title">Frecuencia de notificación</h3>
            
            <FrequencySelector
              value={watchedFrecuencia}
              onChange={(value) => setValue('frecuencia', value)}
            />
            
            <div className="form-group" style={{ marginTop: 'var(--spacing-xl, 1.5rem)' }}>
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
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading || validationState === 'validating'}
            >
              {loading ? 'Creando Solicitud...' : 'Crear Solicitud'}
            </button>
          </div>
        </div>
      </form>
      
      <style jsx>{`
        .form-card {
          background-color: var(--color-bg-canvas, #ffffff);
          border-radius: var(--border-radius-md, 0.5rem);
          border: 1px solid var(--color-border-default, #e5e7eb);
          padding: var(--spacing-xl, 1.5rem);
          margin-bottom: var(--spacing-xl, 1.5rem);
        }
        
        .form-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-xl, 1.5rem);
        }
        
        .form-column-title {
          font-size: var(--font-heading-h4, 1.25rem);
          font-weight: 600;
          margin-bottom: var(--spacing-lg, 1.25rem);
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
        
        .form-control:disabled {
          background-color: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
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
        
        @media (max-width: 768px) {
          .form-columns {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg, 1.25rem);
          }
        }
      `}</style>
    </div>
  );
};

export default AdvancedQueryForm;
