// src/components/advanced-query/ImprovedAdvancedQueryForm.jsx
import React, { useState, useEffect, useRef } from 'react'
import { 
  Search, ArrowLeft, ArrowRight, Eye, 
  CheckCircle, Settings, Sparkles, Zap,
  AlertTriangle, Info, Calendar, Bell
} from 'lucide-react'
import { cn } from '../../utils/cn'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

// Importar los componentes nuevos
import QueryPreview from './QueryPreview'
import LoadingStates from './LoadingStates'
import AdvancedFormValidation from './AdvancedFormValidation'
import ContextualHelp from './ContextualHelp'
import LocationSelector from './LocationSelector'
import FormSuccess from './FormSuccess'

/**
 * 🚀 ImprovedAdvancedQueryForm - Formulario de consulta avanzada mejorado
 * 
 * Integra todas las mejoras de UX para crear una experiencia excepcional
 * en la creación de consultas judiciales avanzadas.
 */
const ImprovedAdvancedQueryForm = ({ 
  onBack,
  onComplete,
  className = '',
  ...props 
}) => {
  // Estados principales
  const [currentStep, setCurrentStep] = useState('form') // 'form', 'preview', 'loading', 'success'
  const [activeField, setActiveField] = useState(null)
  const [formData, setFormData] = useState({
    departamento: '',
    ciudad: '',
    nombreDemandante: '',
    nombreDemandado: '',
    numeroRadicado: '',
    numeroRadicacion: '',
    ejecutarDiariamente: true,
    notificarCambios: true
  })
  const [validations, setValidations] = useState({})
  const [isFormValid, setIsFormValid] = useState(false)

  // Referencias para el scroll automático
  const formRef = useRef(null)
  const previewRef = useRef(null)

  // Validar el formulario completo
  useEffect(() => {
    const hasLocation = formData.departamento && formData.ciudad
    const hasSearchCriteria = formData.nombreDemandante || 
                             formData.nombreDemandado || 
                             formData.numeroRadicado || 
                             formData.numeroRadicacion
    
    const hasErrors = Object.values(validations).some(v => v && !v.isValid)
    
    setIsFormValid(hasLocation && hasSearchCriteria && !hasErrors)
  }, [formData, validations])

  // Manejar cambios en los campos
  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  // Manejar cambios en ubicación
  const handleLocationChange = (location) => {
    setFormData(prev => ({ 
      ...prev, 
      departamento: location.departamento, 
      ciudad: location.ciudad 
    }))
  }

  // Manejar validaciones
  const handleValidation = (fieldName, validation) => {
    setValidations(prev => ({ ...prev, [fieldName]: validation }))
  }

  // Manejar focus en campos
  const handleFieldFocus = (fieldName) => {
    setActiveField(fieldName)
  }

  const handleFieldBlur = () => {
    // Mantener el campo activo por un momento para mostrar la ayuda
    setTimeout(() => setActiveField(null), 150)
  }

  // Proceder al preview
  const handleContinueToPreview = () => {
    setCurrentStep('preview')
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Volver al formulario
  const handleBackToForm = () => {
    setCurrentStep('form')
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Crear la solicitud
  const handleCreateRequest = () => {
    setCurrentStep('loading')
  }

  // Completar el proceso de carga
  const handleLoadingComplete = () => {
    setCurrentStep('success')
  }

  // Ir al dashboard
  const handleViewDashboard = () => {
    onComplete?.({ action: 'dashboard', data: formData })
  }

  // Crear otra consulta
  const handleCreateAnother = () => {
    setCurrentStep('form')
    setFormData({
      departamento: '',
      ciudad: '',
      nombreDemandante: '',
      nombreDemandado: '',
      numeroRadicado: '',
      numeroRadicacion: '',
      ejecutarDiariamente: true,
      notificarCambios: true
    })
    setValidations({})
    setActiveField(null)
    
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Obtener estadísticas del formulario
  const getFormStats = () => {
    const totalFields = 6 // departamento, ciudad, y 4 criterios de búsqueda
    const completedFields = Object.values(formData).filter(value => 
      value && value !== '' && typeof value === 'string'
    ).length
    
    return {
      completed: completedFields,
      total: totalFields,
      percentage: Math.round((completedFields / totalFields) * 100)
    }
  }

  return (
    <div className={cn('max-w-4xl mx-auto space-y-lg', className)} {...props}>
      {/* Header con progreso */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-md">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          
          <div>
            <h1 className="text-heading-h1 font-heading text-text-primary">
              Nueva Consulta Avanzada
            </h1>
            <p className="text-body-paragraph text-text-secondary">
              Configura una búsqueda automatizada y personalizada
            </p>
          </div>
        </div>

        {/* Indicador de progreso */}
        {currentStep === 'form' && (
          <div className="hidden sm:flex items-center gap-sm">
            <div className="text-right">
              <p className="text-body-auxiliary text-text-secondary">
                Progreso del formulario
              </p>
              <p className="text-body-paragraph font-medium text-text-primary">
                {getFormStats().completed}/{getFormStats().total} campos
              </p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-bg-light"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-interactive-default"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${getFormStats().percentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-body-auxiliary font-medium text-interactive-default">
                  {getFormStats().percentage}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Indicadores de paso */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-sm">
          {[
            { key: 'form', label: 'Configurar', icon: Settings },
            { key: 'preview', label: 'Revisar', icon: Eye },
            { key: 'loading', label: 'Crear', icon: Zap },
            { key: 'success', label: 'Completado', icon: CheckCircle }
          ].map((step, index) => {
            const isActive = currentStep === step.key
            const isCompleted = ['form', 'preview', 'loading'].indexOf(currentStep) > index
            const StepIcon = step.icon

            return (
              <div key={step.key} className="flex items-center">
                <div className={cn(
                  'flex items-center gap-sm px-sm py-xs rounded-full transition-all',
                  isActive && 'bg-interactive-default text-white',
                  isCompleted && !isActive && 'bg-feedback-success text-white',
                  !isActive && !isCompleted && 'bg-bg-light text-text-secondary'
                )}>
                  <StepIcon className="w-4 h-4" />
                  <span className="text-body-auxiliary font-medium hidden sm:inline">
                    {step.label}
                  </span>
                </div>
                
                {index < 3 && (
                  <div className={cn(
                    'w-8 h-px mx-sm transition-colors',
                    isCompleted && 'bg-feedback-success',
                    !isCompleted && 'bg-border-default'
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-lg">
          {/* Paso 1: Formulario */}
          {currentStep === 'form' && (
            <div ref={formRef}>
              <Card size="lg">
                <Card.Header>
                  <Card.Title as="h2" className="flex items-center gap-sm">
                    <Settings className="w-5 h-5 text-interactive-default" />
                    Criterios de Búsqueda
                  </Card.Title>
                  <p className="text-body-paragraph text-text-secondary">
                    Define los parámetros para tu consulta automatizada
                  </p>
                </Card.Header>

                <Card.Content>
                  <div className="space-y-xl">
                    {/* Selección de ubicación */}
                    <div>
                      <div className="flex items-center gap-sm mb-md">
                        <div className="w-8 h-8 bg-interactive-default rounded-lg flex items-center justify-center">
                          <span className="text-body-auxiliary font-bold text-white">1</span>
                        </div>
                        <h3 className="text-heading-h3 font-heading text-text-primary">
                          Ubicación del Proceso
                        </h3>
                      </div>
                      
                      <LocationSelector
                        value={{ departamento: formData.departamento, ciudad: formData.ciudad }}
                        onChange={handleLocationChange}
                      />
                    </div>

                    {/* Criterios de búsqueda */}
                    <div>
                      <div className="flex items-center gap-sm mb-md">
                        <div className="w-8 h-8 bg-interactive-default rounded-lg flex items-center justify-center">
                          <span className="text-body-auxiliary font-bold text-white">2</span>
                        </div>
                        <h3 className="text-heading-h3 font-heading text-text-primary">
                          Criterios de Búsqueda
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                        {/* Nombre del demandante */}
                        <div>
                          <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                            Nombre del Demandante
                          </label>
                          <input
                            type="text"
                            className="w-full px-sm py-sm border border-border-default rounded-md focus:border-interactive-default focus:outline-none transition-colors"
                            placeholder="Ej: Juan Carlos Pérez"
                            value={formData.nombreDemandante}
                            onChange={(e) => handleFieldChange('nombreDemandante', e.target.value)}
                            onFocus={() => handleFieldFocus('nombreDemandante')}
                            onBlur={handleFieldBlur}
                          />
                          <AdvancedFormValidation
                            value={formData.nombreDemandante}
                            fieldType="nombrePersona"
                            onValidation={(validation) => handleValidation('nombreDemandante', validation)}
                          />
                        </div>

                        {/* Nombre del demandado */}
                        <div>
                          <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                            Nombre del Demandado
                          </label>
                          <input
                            type="text"
                            className="w-full px-sm py-sm border border-border-default rounded-md focus:border-interactive-default focus:outline-none transition-colors"
                            placeholder="Ej: María Elena González"
                            value={formData.nombreDemandado}
                            onChange={(e) => handleFieldChange('nombreDemandado', e.target.value)}
                            onFocus={() => handleFieldFocus('nombreDemandado')}
                            onBlur={handleFieldBlur}
                          />
                          <AdvancedFormValidation
                            value={formData.nombreDemandado}
                            fieldType="nombrePersona"
                            onValidation={(validation) => handleValidation('nombreDemandado', validation)}
                          />
                        </div>

                        {/* Número de radicado */}
                        <div>
                          <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                            Número de Radicado
                          </label>
                          <input
                            type="text"
                            className="w-full px-sm py-sm border border-border-default rounded-md focus:border-interactive-default focus:outline-none transition-colors font-mono"
                            placeholder="Ej: 11001310300120240001"
                            value={formData.numeroRadicado}
                            onChange={(e) => handleFieldChange('numeroRadicado', e.target.value)}
                            onFocus={() => handleFieldFocus('numeroRadicado')}
                            onBlur={handleFieldBlur}
                          />
                          <AdvancedFormValidation
                            value={formData.numeroRadicado}
                            fieldType="numeroRadicado"
                            showStrength={true}
                            onValidation={(validation) => handleValidation('numeroRadicado', validation)}
                          />
                        </div>

                        {/* Número de radicación */}
                        <div>
                          <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                            Número de Radicación
                          </label>
                          <input
                            type="text"
                            className="w-full px-sm py-sm border border-border-default rounded-md focus:border-interactive-default focus:outline-none transition-colors font-mono"
                            placeholder="Ej: 20240001234"
                            value={formData.numeroRadicacion}
                            onChange={(e) => handleFieldChange('numeroRadicacion', e.target.value)}
                            onFocus={() => handleFieldFocus('numeroRadicacion')}
                            onBlur={handleFieldBlur}
                          />
                          <AdvancedFormValidation
                            value={formData.numeroRadicacion}
                            fieldType="numeroRadicacion"
                            onValidation={(validation) => handleValidation('numeroRadicacion', validation)}
                          />
                        </div>
                      </div>

                      {/* Mensaje informativo sobre criterios */}
                      <div className="mt-md p-md bg-feedback-info-light rounded border border-feedback-info">
                        <div className="flex items-start gap-sm">
                          <Info className="w-4 h-4 text-feedback-info mt-xs" />
                          <div>
                            <h5 className="text-body-paragraph font-medium text-feedback-info mb-xs">
                              💡 Consejo sobre criterios
                            </h5>
                            <p className="text-body-auxiliary text-feedback-info">
                              No necesitas completar todos los campos. Con uno o dos criterios específicos 
                              obtendrás mejores resultados. Los números de radicado son más precisos que los nombres.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Configuración de automatización */}
                    <div>
                      <div className="flex items-center gap-sm mb-md">
                        <div className="w-8 h-8 bg-interactive-default rounded-lg flex items-center justify-center">
                          <span className="text-body-auxiliary font-bold text-white">3</span>
                        </div>
                        <h3 className="text-heading-h3 font-heading text-text-primary">
                          Configuración de Automatización
                        </h3>
                      </div>

                      <div className="space-y-md">
                        {/* Ejecución diaria */}
                        <div className="flex items-start gap-sm p-md bg-bg-light rounded border border-border-default">
                          <div className="flex items-center mt-xs">
                            <input
                              type="checkbox"
                              id="ejecutarDiariamente"
                              checked={formData.ejecutarDiariamente}
                              onChange={(e) => handleFieldChange('ejecutarDiariamente', e.target.checked)}
                              className="w-4 h-4 text-interactive-default border-border-default rounded focus:ring-interactive-default"
                            />
                          </div>
                          <div className="flex-1">
                            <label htmlFor="ejecutarDiariamente" className="text-body-paragraph font-medium text-text-primary cursor-pointer">
                              <div className="flex items-center gap-sm">
                                <Calendar className="w-4 h-4 text-interactive-default" />
                                Ejecutar diariamente
                              </div>
                            </label>
                            <p className="text-body-auxiliary text-text-secondary mt-xs">
                              La consulta se ejecutará automáticamente todos los días a las 7:00 PM
                            </p>
                          </div>
                        </div>

                        {/* Notificaciones */}
                        <div className="flex items-start gap-sm p-md bg-bg-light rounded border border-border-default">
                          <div className="flex items-center mt-xs">
                            <input
                              type="checkbox"
                              id="notificarCambios"
                              checked={formData.notificarCambios}
                              onChange={(e) => handleFieldChange('notificarCambios', e.target.checked)}
                              className="w-4 h-4 text-interactive-default border-border-default rounded focus:ring-interactive-default"
                            />
                          </div>
                          <div className="flex-1">
                            <label htmlFor="notificarCambios" className="text-body-paragraph font-medium text-text-primary cursor-pointer">
                              <div className="flex items-center gap-sm">
                                <Bell className="w-4 h-4 text-interactive-default" />
                                Notificar cambios
                              </div>
                            </label>
                            <p className="text-body-auxiliary text-text-secondary mt-xs">
                              Recibirás un email cuando se detecten cambios en los procesos encontrados
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botón para continuar */}
                    <div className="flex justify-end pt-md border-t border-border-default">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleContinueToPreview}
                        disabled={!isFormValid}
                        className="flex items-center gap-sm"
                      >
                        Revisar y Crear
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}

          {/* Paso 2: Preview */}
          {currentStep === 'preview' && (
            <div ref={previewRef}>
              <QueryPreview
                data={formData}
                onEdit={handleBackToForm}
                onConfirm={handleCreateRequest}
              />
            </div>
          )}

          {/* Paso 3: Loading */}
          {currentStep === 'loading' && (
            <LoadingStates
              isLoading={true}
              onComplete={handleLoadingComplete}
            />
          )}

          {/* Paso 4: Success */}
          {currentStep === 'success' && (
            <FormSuccess
              solicitudData={formData}
              onViewDashboard={handleViewDashboard}
              onCreateAnother={handleCreateAnother}
            />
          )}
        </div>

        {/* Columna de ayuda contextual */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <ContextualHelp
              activeField={activeField}
              formData={formData}
              compact={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

ImprovedAdvancedQueryForm.displayName = 'ImprovedAdvancedQueryForm'

export default ImprovedAdvancedQueryForm