import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Hash, 
  UserCheck, 
  MapPin, 
  Building, 
  Scale, 
  Gavel, 
  FileText, 
  Calendar,
  ChevronRight,
  ChevronDown,
  Filter
} from 'lucide-react';
import { useRadicadoValidation } from '../../hooks/useRadicadoValidation';
import { useDepartmentCities } from '../../hooks/useDepartmentCities';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import ValidationMessage from './ValidationMessage';
import FrequencySelector from './FrequencySelector';

const AdvancedQueryForm = ({ onSubmit, loading = false, onCancel }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      tipoPersona: '',
      numeroRadicado: '',
      nombresApellidos: '',
      departamento: '',
      ciudad: '',
      especialidad: '',
      despacho: '',
      frecuencia: 'dinamico',
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
    <div className="space-y-xl">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
          {/* Criterios de Búsqueda - 2 columnas */}
          <div className="lg:col-span-2 space-y-lg">
            <Card size="xl">
              <Card.Header>
                <div className="flex items-center gap-sm">
                  <Filter size={20} className="text-interactive-default" />
                  <Card.Title as="h3">Criterios de Búsqueda</Card.Title>
                </div>
                <p className="text-body-auxiliary text-text-secondary mt-xs">
                  Define los parámetros específicos para localizar el proceso judicial
                </p>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  {/* Left Column */}
                  <div className="space-y-lg">
                    {/* Tipo de Persona */}
                    <div>
                      <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
                        <div className="flex items-center gap-xs">
                          <User size={16} className="text-interactive-default" />
                          Tipo de Persona
                        </div>
                      </label>
                      <select
                        {...register('tipoPersona')}
                        className={`
                          w-full px-md py-sm border border-border-default rounded-md 
                          text-body-paragraph bg-bg-canvas text-text-base
                          focus:border-interactive-default focus:ring-2 focus:ring-interactive-default focus:ring-opacity-20
                          transition-default
                        `}
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="juridica">Persona Jurídica</option>
                        <option value="natural">Persona Natural</option>
                      </select>
                      <p className="text-body-auxiliary text-text-secondary mt-xs">
                        Especifica si es una empresa o persona natural
                      </p>
                    </div>

                    {/* Número de Radicado */}
                    <div>
                      <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
                        <div className="flex items-center gap-xs">
                          <Hash size={16} className="text-interactive-default" />
                          Número de Radicado
                        </div>
                      </label>
                      <Input
                        {...register('numeroRadicado')}
                        type="text"
                        placeholder="Ej: 2024-CV-123456789"
                        validationState={validationState}
                        helperText="Número completo del radicado judicial"
                        className="w-full"
                      />
                      <ValidationMessage 
                        state={validationState}
                        message={validationMessage}
                      />
                    </div>

                    {/* Nombres y Apellidos */}
                    <div>
                      <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
                        <div className="flex items-center gap-xs">
                          <UserCheck size={16} className="text-interactive-default" />
                          Nombres y Apellidos / Razón Social
                        </div>
                      </label>
                      <Input
                        {...register('nombresApellidos')}
                        type="text"
                        placeholder="Ej: Juan Pérez García / Empresa XYZ S.A.S"
                        helperText="Nombre completo de la persona o empresa"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-lg">
                    {/* Departamento */}
                    <div>
                      <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
                        <div className="flex items-center gap-xs">
                          <MapPin size={16} className="text-interactive-default" />
                          Departamento
                        </div>
                      </label>
                      <div className="relative">
                        <select
                          {...register('departamento')}
                          className={`
                            w-full px-md py-sm border border-border-default rounded-md 
                            text-body-paragraph bg-bg-canvas text-text-base
                            focus:border-interactive-default focus:ring-2 focus:ring-interactive-default focus:ring-opacity-20
                            transition-default appearance-none
                          `}
                        >
                          <option value="">Seleccionar departamento</option>
                          {departamentos.map((dept) => (
                            <option key={dept.value} value={dept.value}>
                              {dept.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" />
                      </div>
                      <p className="text-body-auxiliary text-text-secondary mt-xs">
                        Departamento donde se tramita el proceso
                      </p>
                    </div>

                    {/* Ciudad */}
                    <div>
                      <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
                        <div className="flex items-center gap-xs">
                          <Building size={16} className="text-interactive-default" />
                          Ciudad
                        </div>
                      </label>
                      <div className="relative">
                        <select
                          {...register('ciudad')}
                          disabled={!availableCiudades.length}
                          className={`
                            w-full px-md py-sm border border-border-default rounded-md 
                            text-body-paragraph bg-bg-canvas text-text-base
                            focus:border-interactive-default focus:ring-2 focus:ring-interactive-default focus:ring-opacity-20
                            transition-default appearance-none
                            disabled:bg-bg-light disabled:text-text-secondary disabled:cursor-not-allowed
                          `}
                        >
                          <option value="">Seleccionar ciudad</option>
                          {availableCiudades.map((ciudad) => (
                            <option key={ciudad.value} value={ciudad.value}>
                              {ciudad.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" />
                      </div>
                      <p className="text-body-auxiliary text-text-secondary mt-xs">
                        {!availableCiudades.length ? 'Selecciona un departamento primero' : 'Ciudad específica del proceso'}
                      </p>
                    </div>

                    {/* Especialidad */}
                    <div>
                      <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
                        <div className="flex items-center gap-xs">
                          <Scale size={16} className="text-interactive-default" />
                          Especialidad
                        </div>
                      </label>
                      <Input
                        {...register('especialidad')}
                        type="text"
                        placeholder="Ej: Civil, Penal, Laboral, Comercial"
                        helperText="Área del derecho del proceso"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Despacho - Full Width */}
                <div className="mt-lg">
                  <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
                    <div className="flex items-center gap-xs">
                      <Gavel size={16} className="text-interactive-default" />
                      Despacho Judicial
                    </div>
                  </label>
                  <Input
                    {...register('despacho')}
                    type="text"
                    placeholder="Ej: Juzgado 1 Civil del Circuito, Tribunal Superior"
                    helperText="Nombre específico del despacho que conoce el caso"
                    className="w-full"
                  />
                </div>
              </Card.Content>
            </Card>

            {/* Alias */}
            <Card size="lg">
              <Card.Header>
                <div className="flex items-center gap-sm">
                  <FileText size={20} className="text-interactive-default" />
                  <Card.Title as="h4">Identificación</Card.Title>
                </div>
              </Card.Header>
              <Card.Content>
                <div>
                  <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
                    Nombre Descriptivo (Alias) *
                  </label>
                  <Input
                    {...register('alias', { 
                      required: 'El alias es requerido',
                      minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                    })}
                    type="text"
                    placeholder="Ej: Caso Familia García, Demanda Empresa XYZ..."
                    error={errors.alias?.message}
                    helperText="Un nombre que te ayude a identificar fácilmente esta solicitud"
                    className="w-full"
                  />
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Configuración - 1 columna */}
          <div className="lg:col-span-1">
            <div className="space-y-lg h-full">
              {/* Frecuencia */}
              <Card size="xl" className="h-full flex flex-col">
                <Card.Header>
                  <div className="flex items-center gap-sm">
                    <Calendar size={20} className="text-interactive-default" />
                    <Card.Title as="h4">Frecuencia de Monitoreo</Card.Title>
                  </div>
                </Card.Header>
                <Card.Content className="flex-1 flex flex-col justify-between">
                  <div>
                    <FrequencySelector
                      value={watchedFrecuencia}
                      onChange={(value) => setValue('frecuencia', value)}
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-xl">
                    <div className="space-y-sm">
                      <Button
                        variant="primary"
                        size="lg"
                        type="submit"
                        disabled={loading || validationState === 'validating'}
                        loading={loading}
                        icon={loading ? null : <ChevronRight size={20} />}
                        iconPosition="right"
                        className="w-full"
                      >
                        {loading ? 'Creando Solicitud...' : 'Crear Solicitud Avanzada'}
                      </Button>
                      
                      <Button
                        variant="secondary"
                        size="lg"
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="w-full"
                      >
                        Cancelar
                      </Button>
                    </div>

                    <div className="mt-md p-sm bg-feedback-info-light rounded-md border border-feedback-info">
                      <p className="text-body-auxiliary text-feedback-info">
                        <strong>💡 Tip:</strong> Puedes usar solo algunos criterios. 
                        Más criterios = búsqueda más específica.
                      </p>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdvancedQueryForm;