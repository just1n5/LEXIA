import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../utils/cn';
import SelectField from '../ui/SelectField';
import { departamentos, getCiudadesByDepartamento, getDepartamentoById, getCiudadById } from '../../data/colombiaLocations';

/**
 * ✨ SimpleAdvancedForm - FORMULARIO LIMPIO DESDE CERO
 * 
 * Formulario simple y optimizado sin re-renders innecesarios
 */
const SimpleAdvancedForm = ({ onBack, onComplete, loading = false }) => {
  // ✅ Estado consolidado en un solo objeto
  const [formData, setFormData] = useState({
    nombreDemandante: '',
    nombreDemandado: '',
    numeroRadicado: '',
    departamentoId: '',
    ciudadId: '',
    alias: '',
    // Valores automáticos - siempre true
    ejecutarDiariamente: true,
    notificarCambios: true
  });

  const [activeField, setActiveField] = useState(null);

  // ✅ Handler optimizado con useCallback
  const handleInputChange = useCallback((field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // ✅ Handler para departamento (resetea ciudad cuando cambia)
  const handleDepartamentoChange = useCallback((departamentoId) => {
    setFormData(prev => ({ 
      ...prev, 
      departamentoId, 
      ciudadId: '' // Reset ciudad cuando cambia departamento
    }));
  }, []);

  // ✅ Handler para ciudad
  const handleCiudadChange = useCallback((ciudadId) => {
    setFormData(prev => ({ ...prev, ciudadId }));
  }, []);

  // ✅ Ciudades disponibles memoizadas
  const ciudadesDisponibles = useMemo(() => {
    return formData.departamentoId ? getCiudadesByDepartamento(formData.departamentoId) : [];
  }, [formData.departamentoId]);

  const handleFieldFocus = useCallback((field) => {
    setActiveField(field);
  }, []);

  const handleFieldBlur = useCallback(() => {
    setTimeout(() => setActiveField(null), 150);
  }, []);

  // ✅ Validación memoizada
  const isValid = useMemo(() => {
    return formData.nombreDemandante.trim() || 
           formData.nombreDemandado.trim() || 
           formData.numeroRadicado.trim();
  }, [formData.nombreDemandante, formData.nombreDemandado, formData.numeroRadicado]);

  // ✅ Handlers de formulario con useCallback
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (isValid && onComplete) {
      // Convertir IDs a nombres para la API
      const departamento = formData.departamentoId ? getDepartamentoById(formData.departamentoId)?.nombre || '' : '';
      const ciudad = formData.ciudadId ? getCiudadById(formData.departamentoId, formData.ciudadId)?.nombre || '' : '';
      
      const dataToSend = {
        ...formData,
        departamento,
        ciudad
      };
      
      onComplete({
        action: 'dashboard',
        data: dataToSend
      });
    }
  }, [formData, isValid, onComplete]);

  const handleBackClick = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  // ✅ Clase de input memoizada
  const getInputClass = useCallback((fieldName) => {
    return cn(
      'w-full px-sm py-sm border rounded-md transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-interactive-default',
      activeField === fieldName 
        ? 'border-interactive-default' 
        : 'border-border-default',
      'text-body-paragraph font-sans'
    );
  }, [activeField]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-lg">
        <div className="flex items-center text-body-auxiliary text-text-secondary">
          <span>Paso 1 de 1</span>
          <div className="flex-1 mx-md">
            <div className="h-1 bg-bg-light rounded-full">
              <div className="h-1 bg-interactive-default rounded-full w-full"></div>
            </div>
          </div>
          <span>100%</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-bg-canvas rounded-lg border border-border-default p-lg">
        <form onSubmit={handleSubmit} className="space-y-lg">
          
          {/* Tipo de búsqueda */}
          <div>
            <h2 className="text-heading-h2 font-heading text-text-primary mb-md">
              Información de Búsqueda
            </h2>
            <p className="text-body-paragraph text-text-secondary mb-lg">
              Complete al menos uno de los siguientes campos para realizar la consulta
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              
              {/* Nombre Demandante */}
              <div>
                <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                  Nombre del Demandante
                </label>
                <input
                  type="text"
                  className={getInputClass('nombreDemandante')}
                  placeholder="Ej: Juan Carlos Pérez"
                  value={formData.nombreDemandante}
                  onChange={handleInputChange('nombreDemandante')}
                  onFocus={() => handleFieldFocus('nombreDemandante')}
                  onBlur={handleFieldBlur}
                />
              </div>

              {/* Nombre Demandado */}
              <div>
                <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                  Nombre del Demandado
                </label>
                <input
                  type="text"
                  className={getInputClass('nombreDemandado')}
                  placeholder="Ej: María García López"
                  value={formData.nombreDemandado}
                  onChange={handleInputChange('nombreDemandado')}
                  onFocus={() => handleFieldFocus('nombreDemandado')}
                  onBlur={handleFieldBlur}
                />
              </div>

              {/* Número de Radicado */}
              <div className="md:col-span-2">
                <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                  Número de Radicado
                </label>
                <input
                  type="text"
                  className={getInputClass('numeroRadicado')}
                  placeholder="Ej: 11001310300120240001"
                  value={formData.numeroRadicado}
                  onChange={handleInputChange('numeroRadicado')}
                  onFocus={() => handleFieldFocus('numeroRadicado')}
                  onBlur={handleFieldBlur}
                />
              </div>

            </div>
          </div>

          {/* Información Adicional */}
          <div>
            <h3 className="text-heading-h3 font-heading text-text-primary mb-md">
              Información Adicional
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              
              {/* Departamento */}
              <div>
                <SelectField
                  label="Departamento"
                  value={formData.departamentoId}
                  onChange={handleDepartamentoChange}
                  options={departamentos}
                  placeholder="Seleccionar departamento"
                  onFocus={() => handleFieldFocus('departamento')}
                  onBlur={handleFieldBlur}
                />
              </div>

              {/* Ciudad */}
              <div>
                <SelectField
                  label="Ciudad"
                  value={formData.ciudadId}
                  onChange={handleCiudadChange}
                  options={ciudadesDisponibles}
                  placeholder={formData.departamentoId ? "Seleccionar ciudad" : "Primero selecciona un departamento"}
                  disabled={!formData.departamentoId}
                  onFocus={() => handleFieldFocus('ciudad')}
                  onBlur={handleFieldBlur}
                />
              </div>

              {/* Alias */}
              <div className="md:col-span-2">
                <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                  Alias para la consulta
                </label>
                <input
                  type="text"
                  className={getInputClass('alias')}
                  placeholder="Ej: Caso Juan vs María - Divorcio"
                  value={formData.alias}
                  onChange={handleInputChange('alias')}
                  onFocus={() => handleFieldFocus('alias')}
                  onBlur={handleFieldBlur}
                />
              </div>

            </div>
          </div>

          {/* Banner Informativo - Comportamiento Automático */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-lg">
            <div className="flex items-start gap-md">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🤖</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-heading-h3 font-heading text-blue-800 mb-sm">
                  Automatización Inteligente Activada
                </h3>
                <div className="space-y-sm text-body-paragraph text-blue-700">
                  <p className="flex items-center gap-sm">
                    <span className="text-green-600 font-bold">✅</span>
                    <strong>Consulta Diaria Automática:</strong> El sistema ejecutará esta consulta todos los días a las 6:00 AM
                  </p>
                  <p className="flex items-center gap-sm">
                    <span className="text-green-600 font-bold">📧</span>
                    <strong>Notificaciones Inteligentes:</strong> Te notificaremos por correo electrónico cuando detectemos cambios en el proceso judicial
                  </p>
                  <p className="flex items-center gap-sm">
                    <span className="text-green-600 font-bold">📊</span>
                    <strong>Historial Completo:</strong> Todos los resultados se guardarán en tu dashboard para análisis y seguimiento
                  </p>
                </div>
                <div className="mt-md p-sm bg-blue-100 rounded border border-blue-300">
                  <p className="text-body-auxiliary text-blue-800 flex items-center gap-xs">
                    <span className="text-blue-600">💡</span>
                    <strong>Tip:</strong> Puedes pausar o modificar la automatización desde tu dashboard en cualquier momento
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-sm pt-lg border-t border-border-default">
            <button
              type="button"
              onClick={handleBackClick}
              className="px-lg py-sm bg-bg-canvas border border-border-default text-text-base rounded-md hover:bg-bg-light transition-colors"
            >
              ← Volver
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className={cn(
                "px-lg py-sm rounded-md font-medium transition-colors",
                isValid && !loading
                  ? "bg-interactive-default text-text-base hover:bg-interactive-hover"
                  : "bg-border-disabled text-text-secondary cursor-not-allowed"
              )}
            >
              {loading ? 'Creando...' : 'Crear Consulta'}
            </button>
          </div>

        </form>
      </div>

      {/* Debug info (remover en producción) */}
      <div className="mt-md p-sm bg-bg-light rounded text-body-auxiliary text-text-secondary">
        <p>
          <strong>Estado:</strong> 
          {isValid ? ' ✅ Válido' : ' ❌ Incompleto'} | 
          <strong> Campo activo:</strong> {activeField || 'Ninguno'}
        </p>
        <p className="text-xs mt-xs">
          <strong>Departamento:</strong> {formData.departamentoId ? getDepartamentoById(formData.departamentoId)?.nombre : 'Sin seleccionar'} | 
          <strong> Ciudad:</strong> {formData.ciudadId ? getCiudadById(formData.departamentoId, formData.ciudadId)?.nombre : 'Sin seleccionar'}
        </p>
        <p className="text-xs mt-xs">
          <strong>Automatización:</strong> ✅ Diaria activada | ✅ Notificaciones activadas
        </p>
      </div>

    </div>
  );
};

export default SimpleAdvancedForm;