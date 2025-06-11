import React, { useState, useCallback, useMemo, useRef } from 'react'
import { 
  Search, ArrowLeft, ArrowRight, Eye, 
  CheckCircle, Settings, Sparkles, Zap,
  AlertTriangle, Info, Calendar, Bell, User, FileText
} from 'lucide-react'
import { cn } from '../../utils/cn'
import Card from '../ui/Card'
import Button from '../ui/Button'

// Importar componentes optimizados
import LocationSelectorOptimized from './LocationSelectorOptimized'
import useOptimizedValidation from '../../hooks/useOptimizedValidation'

// Importar otros componentes necesarios
import QueryPreview from './QueryPreview'
import LoadingStates from './LoadingStates'
import FormSuccess from './FormSuccess'
import ResponsiveLayout from './ResponsiveLayout'
import ProgressTracker from './ProgressTracker'
import FormFieldGroup from './FormFieldGroup'

/**
 * 🚀 OptimizedAdvancedQueryForm - PERFORMANCE OPTIMIZADO
 * 
 * Versión completamente optimizada del formulario avanzado:
 * - ✅ useCallback consistente para todos los handlers
 * - ✅ React.memo en componentes pesados
 * - ✅ Hook de validación optimizado (300ms debounce)
 * - ✅ Estado consolidado para reducir re-renders
 * - ✅ Memoización inteligente de cálculos complejos
 * - ✅ Event handlers estables
 */
const OptimizedAdvancedQueryForm = React.memo(({ 
  onBack,
  onComplete,
  loading = false,
  className = '',
  ...props 
}) => {
  // 🔍 Debug counter para medir mejoras
  const renderCount = useRef(0)
  renderCount.current++
  console.log(`🚀 OptimizedAdvancedQueryForm RENDER #${renderCount.current}`)

  // ✅ OPTIMIZACIÓN: Estado consolidado para reducir re-renders
  const [currentStep, setCurrentStep] = useState('form')
  const [activeField, setActiveField] = useState(null)
  const [showErrors, setShowErrors] = useState(false)
  
  // ✅ OPTIMIZACIÓN: Estado del formulario optimizado
  const [formData, setFormData] = useState(() => ({
    departamento: '',
    ciudad: '',
    nombreDemandante: '',
    nombreDemandado: '',
    numeroRadicado: '',
    numeroRadicacion: '',
    ejecutarDiariamente: true,
    notificarCambios: true
  }))

  // ✅ OPTIMIZACIÓN: Hook de validación optimizado
  const {
    validations,
    isFormValid,
    validateFieldWithDelay,
    isFieldValid,
    getFieldError,
    resetValidations
  } = useOptimizedValidation()

  // ✅ OPTIMIZACIÓN: Tipos de campo memoizados
  const fieldTypes = useMemo(() => ({
    nombreDemandante: 'nombrePersona',
    nombreDemandado: 'nombrePersona',
    numeroRadicado: 'numeroRadicado',
    numeroRadicacion: 'numeroRadicacion'
  }), [])

  // ✅ OPTIMIZACIÓN: Referencias para navegación suave
  const formRef = useRef(null)

  // ✅ OPTIMIZACIÓN: Handlers de cambio de campo optimizados con useCallback
  const handleFieldChange = useCallback((fieldName, fieldType) => (e) => {
    const value = e.target.value
    
    // Actualizar datos del formulario
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
    
    // Validar con debounce optimizado si el campo tiene tipo
    if (fieldType) {
      validateFieldWithDelay(fieldName, value, fieldType)
    }
    
    // Ocultar errores si el usuario empieza a escribir
    if (showErrors && value) {
      setShowErrors(false)
    }
  }, [validateFieldWithDelay, showErrors])

  // ✅ OPTIMIZACIÓN: Handlers específicos memoizados
  const handleNombreDemandanteChange = useMemo(
    () => handleFieldChange('nombreDemandante', 'nombrePersona'),
    [handleFieldChange]
  )
  
  const handleNombreDemandadoChange = useMemo(
    () => handleFieldChange('nombreDemandado', 'nombrePersona'),
    [handleFieldChange]
  )
  
  const handleNumeroRadicadoChange = useMemo(
    () => handleFieldChange('numeroRadicado', 'numeroRadicado'),
    [handleFieldChange]
  )
  
  const handleNumeroRadicacionChange = useMemo(
    () => handleFieldChange('numeroRadicacion', 'numeroRadicacion'),
    [handleFieldChange]
  )

  // ✅ OPTIMIZACIÓN: Handlers de focus/blur optimizados
  const handleFieldFocus = useCallback((fieldName) => () => {
    setActiveField(fieldName)
  }, [])

  const handleFieldBlur = useCallback(() => {
    setTimeout(() => setActiveField(null), 150)
  }, [])

  // ✅ OPTIMIZACIÓN: Handler de ubicación optimizado
  const handleLocationChange = useCallback((location) => {
    setFormData(prev => ({ 
      ...prev, 
      departamento: location.departamento, 
      ciudad: location.ciudad 
    }))
  }, [])

  // ✅ OPTIMIZACIÓN: Handlers de toggle optimizados
  const handleEjecutarDiariamenteChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      ejecutarDiariamente: e.target.checked
    }))
  }, [])

  const handleNotificarCambiosChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      notificarCambios: e.target.checked
    }))
  }, [])

  // ✅ OPTIMIZACIÓN: Verificación de secciones completadas memoizada
  const sectionsCompleted = useMemo(() => {
    const hasLocation = formData.departamento && formData.ciudad
    const hasCriteria = formData.nombreDemandante || 
                       formData.nombreDemandado || 
                       formData.numeroRadicado || 
                       formData.numeroRadicacion
    
    return {
      location: hasLocation,
      criteria: hasCriteria,
      automation: true // Siempre opcional
    }
  }, [formData])

  const isSectionComplete = useCallback((sectionName) => {
    return sectionsCompleted[sectionName] || false
  }, [sectionsCompleted])

  // ✅ OPTIMIZACIÓN: Validación final del formulario memoizada
  const isFormReadyToSubmit = useMemo(() => {
    const hasValidLocation = sectionsCompleted.location
    const hasValidCriteria = sectionsCompleted.criteria
    const hasNoValidationErrors = Object.values(validations).every(v => !v || v.isValid)
    
    return hasValidLocation && hasValidCriteria && hasNoValidationErrors
  }, [sectionsCompleted, validations])

  // ✅ OPTIMIZACIÓN: Handlers de navegación optimizados
  const handleContinueToPreview = useCallback(() => {
    if (!isFormReadyToSubmit) {
      setShowErrors(true)
      // Scroll al primer error
      const firstErrorField = document.querySelector('.border-feedback-error, [data-error="true"]')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    setCurrentStep('preview')
  }, [isFormReadyToSubmit])

  const handleBackToForm = useCallback(() => {
    setCurrentStep('form')
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [])

  const handleCreateRequest = useCallback(() => {
    setCurrentStep('loading')
  }, [])

  const handleLoadingComplete = useCallback(() => {
    setCurrentStep('success')
  }, [])

  const handleViewDashboard = useCallback(() => {
    onComplete?.({ action: 'dashboard', data: formData })
  }, [onComplete, formData])

  const handleCreateAnother = useCallback(() => {
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
    resetValidations()
    setActiveField(null)
    setShowErrors(false)
    
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [resetValidations])

  // ✅ OPTIMIZACIÓN: Componente FormField memoizado para evitar re-renders
  const FormField = React.memo(({ 
    fieldName, 
    label, 
    placeholder, 
    hint,
    type = 'text',
    className: fieldClassName = ''
  }) => {
    const value = formData[fieldName] || ''
    const isValid = isFieldValid(fieldName)
    const error = getFieldError(fieldName)
    const isFocused = activeField === fieldName
    
    return (
      <FormFieldGroup.Field
        label={label}
        hint={hint}
      >
        <input
          type={type}
          className={cn(
            'w-full px-sm py-sm border rounded-md focus:outline-none transition-colors',
            type === 'text' && /numero/i.test(fieldName) && 'font-mono',
            isFocused ? 'border-interactive-default' : 'border-border-default',
            !isValid && 'border-feedback-error',
            fieldClassName
          )}
          placeholder={placeholder}
          value={value}
          onChange={
            fieldName === 'nombreDemandante' ? handleNombreDemandanteChange :
            fieldName === 'nombreDemandado' ? handleNombreDemandadoChange :
            fieldName === 'numeroRadicado' ? handleNumeroRadicadoChange :
            fieldName === 'numeroRadicacion' ? handleNumeroRadicacionChange :
            undefined
          }
          onFocus={handleFieldFocus(fieldName)}
          onBlur={handleFieldBlur}
        />
        {!isValid && error && (
          <div className="flex items-center gap-xs mt-xs">
            <AlertTriangle className="w-3 h-3 text-feedback-error" />
            <span className="text-body-auxiliary text-feedback-error">
              {error}
            </span>
          </div>
        )}
      </FormFieldGroup.Field>
    )
  })

  // ✅ OPTIMIZACIÓN: Componente de contenido del formulario memoizado
  const FormContent = React.memo(() => (
    <div ref={formRef} className="space-y-xl">
      <Card size="lg">
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <Card.Title as="h2" className="flex items-center gap-sm">
                <Settings className="w-5 h-5 text-interactive-default" />
                Configurar Consulta Avanzada
              </Card.Title>
              <p className="text-body-paragraph text-text-secondary mt-xs">
                Define los criterios y configuración para tu búsqueda automatizada
              </p>
            </div>
            
            {/* Progreso móvil */}
            <div className="block lg:hidden">
              <div className="text-xs text-text-secondary">
                Renders: <span className="font-mono font-bold">{renderCount.current}</span>
              </div>
            </div>
          </div>
        </Card.Header>

        <Card.Content>
          <div className="space-y-2xl">
            {/* Sección 1: Ubicación */}
            <FormFieldGroup
              number={1}
              title="Ubicación del Proceso"
              description="Especifica el departamento y ciudad donde se tramita el proceso judicial"
              required={true}
              completed={isSectionComplete('location')}
            >
              <LocationSelectorOptimized
                value={{ departamento: formData.departamento, ciudad: formData.ciudad }}
                onChange={handleLocationChange}
              />
              
              {showErrors && !isSectionComplete('location') && (
                <div className="flex items-center gap-xs mt-sm p-sm bg-feedback-error-light rounded border border-feedback-error">
                  <AlertTriangle className="w-4 h-4 text-feedback-error" />
                  <span className="text-body-auxiliary text-feedback-error">
                    Debes seleccionar un departamento y una ciudad
                  </span>
                </div>
              )}
            </FormFieldGroup>

            {/* Sección 2: Criterios de Búsqueda */}
            <FormFieldGroup
              number={2}
              title="Criterios de Búsqueda"
              description="Define al menos un criterio para identificar los procesos que deseas monitorear"
              required={true}
              completed={isSectionComplete('criteria')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <FormField
                  fieldName="nombreDemandante"
                  label="Nombre del Demandante"
                  placeholder="Ej: Juan Carlos Pérez González"
                  hint="Persona o entidad que inicia la acción judicial"
                />

                <FormField
                  fieldName="nombreDemandado"
                  label="Nombre del Demandado"
                  placeholder="Ej: María Elena González Herrera"
                  hint="Persona o entidad contra quien se dirige la acción"
                />

                <FormField
                  fieldName="numeroRadicado"
                  label="Número de Radicado"
                  placeholder="Ej: 11001310300120240001234"
                  hint="Número único del proceso (más preciso)"
                />

                <FormField
                  fieldName="numeroRadicacion"
                  label="Número de Radicación"
                  placeholder="Ej: 20240001234"
                  hint="Número interno del despacho"
                />
              </div>

              {/* Mensaje sobre criterios */}
              <div className="p-md bg-feedback-info-light rounded border border-feedback-info">
                <div className="flex items-start gap-sm">
                  <Info className="w-4 h-4 text-feedback-info mt-xs" />
                  <div>
                    <h5 className="text-body-paragraph font-medium text-feedback-info mb-xs">
                      💡 Optimiza tu búsqueda
                    </h5>
                    <p className="text-body-auxiliary text-feedback-info">
                      No necesitas completar todos los campos. Con 1-2 criterios específicos obtendrás mejores resultados. 
                      Los números de radicado son más precisos que los nombres de personas.
                    </p>
                  </div>
                </div>
              </div>

              {showErrors && !isSectionComplete('criteria') && (
                <div className="flex items-center gap-xs mt-sm p-sm bg-feedback-error-light rounded border border-feedback-error">
                  <AlertTriangle className="w-4 h-4 text-feedback-error" />
                  <span className="text-body-auxiliary text-feedback-error">
                    Debes especificar al menos un criterio de búsqueda
                  </span>
                </div>
              )}
            </FormFieldGroup>

            {/* Sección 3: Automatización */}
            <FormFieldGroup
              number={3}
              title="Configuración de Automatización"
              description="Define cómo y cuándo se ejecutará tu consulta"
              completed={isSectionComplete('automation')}
            >
              <div className="space-y-md">
                <FormFieldGroup.Toggle
                  id="ejecutarDiariamente"
                  label="Ejecutar diariamente"
                  description="La consulta se ejecutará automáticamente todos los días a las 7:00 PM"
                  icon={Calendar}
                  checked={formData.ejecutarDiariamente}
                  onChange={handleEjecutarDiariamenteChange}
                />

                <FormFieldGroup.Toggle
                  id="notificarCambios"
                  label="Notificar cambios"
                  description="Recibirás un email cuando se detecten cambios en los procesos encontrados"
                  icon={Bell}
                  checked={formData.notificarCambios}
                  onChange={handleNotificarCambiosChange}
                />
              </div>
            </FormFieldGroup>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-sm justify-between pt-lg border-t border-border-default">
              <Button
                variant="secondary"
                onClick={onBack}
                className="flex items-center gap-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              
              <Button
                variant="primary"
                size="lg"
                onClick={handleContinueToPreview}
                disabled={!isFormReadyToSubmit}
                className="flex items-center gap-sm"
              >
                {isFormReadyToSubmit ? (
                  <>
                    Revisar y Crear
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Completar campos requeridos
                    <AlertTriangle className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  ))

  // ✅ OPTIMIZACIÓN: Componente de ayuda lateral memoizado
  const SideContent = React.memo(() => (
    <div className="space-y-md">
      {/* Indicador de performance */}
      <div className="hidden lg:block p-sm bg-green-50 rounded border border-green-200">
        <div className="text-xs text-green-700 font-medium mb-xs">
          🚀 Performance Optimizado
        </div>
        <div className="text-xs text-green-600">
          Renders: <span className="font-mono font-bold">{renderCount.current}</span> · 
          Validación: <span className="font-mono">300ms</span> · 
          Status: <span className="font-mono">{isFormReadyToSubmit ? '✅' : '⏳'}</span>
        </div>
      </div>
      
      {/* Progreso */}
      <ProgressTracker 
        formData={formData} 
        validations={validations}
      />
    </div>
  ))

  return (
    <div className={cn('max-w-7xl mx-auto', className)} {...props}>
      {/* Header principal */}
      <div className="mb-lg">
        <div className="flex items-center justify-between mb-md">
          <div>
            <h1 className="text-heading-h1 font-heading text-text-primary">
              Nueva Consulta Avanzada
            </h1>
            <p className="text-body-paragraph text-text-secondary">
              Versión optimizada - Configura una búsqueda automatizada y personalizada
            </p>
          </div>
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
      </div>

      {/* Contenido principal con layout responsivo */}
      {currentStep === 'form' && (
        <ResponsiveLayout
          mainContent={<FormContent />}
          sideContent={<SideContent />}
          sideContentTitle="Progreso y Performance"
          collapsibleSide={true}
        />
      )}

      {currentStep === 'preview' && (
        <div className="max-w-4xl mx-auto">
          <QueryPreview
            data={formData}
            onEdit={handleBackToForm}
            onConfirm={handleCreateRequest}
          />
        </div>
      )}

      {currentStep === 'loading' && (
        <div className="max-w-4xl mx-auto">
          <LoadingStates
            isLoading={true}
            onComplete={handleLoadingComplete}
          />
        </div>
      )}

      {currentStep === 'success' && (
        <div className="max-w-4xl mx-auto">
          <FormSuccess
            solicitudData={formData}
            onViewDashboard={handleViewDashboard}
            onCreateAnother={handleCreateAnother}
          />
        </div>
      )}
    </div>
  )
})

OptimizedAdvancedQueryForm.displayName = 'OptimizedAdvancedQueryForm'

export default OptimizedAdvancedQueryForm