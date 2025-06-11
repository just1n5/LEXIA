// src/components/advanced-query/FinalImprovedAdvancedQueryForm.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { 
  Search, ArrowLeft, ArrowRight, Eye, 
  CheckCircle, Settings, Sparkles, Zap,
  AlertTriangle, Info, Calendar, Bell, User, FileText
} from 'lucide-react'
import { cn } from '../../utils/cn'
import Card from '../ui/Card'
import Button from '../ui/Button'

// Importar todos los componentes mejorados
import QueryPreview from './QueryPreview'
import LoadingStates from './LoadingStates'
import BasicFormValidation from './BasicFormValidation'
import ContextualHelp from './ContextualHelp'
import LocationSelector from './LocationSelector'
// import SimpleLocationSelector from './SimpleLocationSelector' // Versión directa
import FormSuccess from './FormSuccess'
import ResponsiveLayout from './ResponsiveLayout'
import ProgressTracker from './ProgressTracker'
import FormFieldGroup from './FormFieldGroup'

/**
 * 🚀 FinalImprovedAdvancedQueryForm - Formulario de consulta avanzada definitivo
 * 
 * Versión final que integra todas las mejoras de UX, diseño responsivo,
 * validaciones avanzadas y feedback inteligente para crear la mejor
 * experiencia posible en la creación de consultas judiciales.
 */
const FinalImprovedAdvancedQueryForm = ({ 
  onBack,
  onComplete,
  className = '',
  ...props 
}) => {
  // Estados principales
  const [currentStep, setCurrentStep] = useState('form')
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
  const [showErrors, setShowErrors] = useState(false)

  // Referencias para navegación suave
  const formRef = useRef(null)

  // Referencias para timers de validación individual por campo
  const validationTimers = useRef({})
  
  // 🔧 NUEVA ESTRATEGIA: Validación individual por campo con debounce de 1 segundo
  const validateFieldWithDelay = (fieldName, value, fieldType) => {
    // Limpiar timer anterior para este campo
    if (validationTimers.current[fieldName]) {
      clearTimeout(validationTimers.current[fieldName])
    }
    
    // Crear nuevo timer para este campo específico
    validationTimers.current[fieldName] = setTimeout(() => {
      const validateField = (val, type) => {
        if (!val || val.trim() === '') return { isValid: true }
        
        switch (type) {
          case 'numeroRadicado':
            return {
              isValid: val.length >= 11 && val.length <= 23 && /^\d+$/.test(val)
            }
          case 'numeroRadicacion':
            return {
              isValid: val.length >= 4 && val.length <= 20
            }
          case 'nombrePersona':
            return {
              isValid: val.length >= 2 && val.length <= 100 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val)
            }
          default:
            return { isValid: true }
        }
      }
      
      const fieldValidation = validateField(value, fieldType)
      
      // Solo actualizar la validación para este campo específico
      setValidations(prev => ({
        ...prev,
        [fieldName]: fieldValidation
      }))
      
      // Actualizar isFormValid después de un pequeño delay para que validations se actualice
      setTimeout(() => {
        const hasLocation = formData.departamento && formData.ciudad
        const hasSearchCriteria = formData.nombreDemandante || 
                                 formData.nombreDemandado || 
                                 formData.numeroRadicado || 
                                 formData.numeroRadicacion
        
        setValidations(currentValidations => {
          const hasErrors = Object.values(currentValidations).some(v => v && !v.isValid)
          const newIsFormValid = hasLocation && hasSearchCriteria && !hasErrors
          setIsFormValid(prev => prev !== newIsFormValid ? newIsFormValid : prev)
          return currentValidations
        })
      }, 50)
    }, 1000) // ← 🎯 1 SEGUNDO de debounce como solicitaste
  }
  
  // Limpiar todos los timers al desmontar el componente
  useEffect(() => {
    return () => {
      Object.values(validationTimers.current).forEach(timer => {
        if (timer) clearTimeout(timer)
      })
    }
  }, [])

  // Handlers directos y específicos para cada campo - CON validación individual
  const handleNombreDemandanteChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      nombreDemandante: value
    }))
    
    // Validar este campo específico después de 1 segundo sin escribir
    validateFieldWithDelay('nombreDemandante', value, 'nombrePersona')
    
    if (showErrors && value) {
      setShowErrors(false)
    }
  }

  const handleNombreDemandadoChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      nombreDemandado: value
    }))
    
    // Validar este campo específico después de 1 segundo sin escribir
    validateFieldWithDelay('nombreDemandado', value, 'nombrePersona')
    
    if (showErrors && value) {
      setShowErrors(false)
    }
  }

  const handleNumeroRadicadoChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      numeroRadicado: value
    }))
    
    // Validar este campo específico después de 1 segundo sin escribir
    validateFieldWithDelay('numeroRadicado', value, 'numeroRadicado')
    
    if (showErrors && value) {
      setShowErrors(false)
    }
  }

  const handleNumeroRadicacionChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      numeroRadicacion: value
    }))
    
    // Validar este campo específico después de 1 segundo sin escribir
    validateFieldWithDelay('numeroRadicacion', value, 'numeroRadicacion')
    
    if (showErrors && value) {
      setShowErrors(false)
    }
  }

  // Handlers de focus específicos - estables
  const handleNombreDemandanteFocus = () => setActiveField('nombreDemandante')
  const handleNombreDemandadoFocus = () => setActiveField('nombreDemandado')
  const handleNumeroRadicadoFocus = () => setActiveField('numeroRadicado')
  const handleNumeroRadicacionFocus = () => setActiveField('numeroRadicacion')

  const handleFieldBlur = () => {
    setTimeout(() => setActiveField(null), 150)
  }

  // Handler para cambios de ubicación
  const handleLocationChange = (location) => {
    setFormData(prev => ({ 
      ...prev, 
      departamento: location.departamento, 
      ciudad: location.ciudad 
    }))
  }

  // Handlers para toggles de automatización - específicos
  const handleEjecutarDiariamenteChange = (e) => {
    setFormData(prev => ({
      ...prev,
      ejecutarDiariamente: e.target.checked
    }))
  }

  const handleNotificarCambiosChange = (e) => {
    setFormData(prev => ({
      ...prev,
      notificarCambios: e.target.checked
    }))
  }

  // Verificar si una sección está completa - memoizado
  const sectionsCompleted = useMemo(() => ({
    location: formData.departamento && formData.ciudad,
    criteria: formData.nombreDemandante || formData.nombreDemandado || 
              formData.numeroRadicado || formData.numeroRadicacion,
    automation: true // Siempre opcional
  }), [formData])

  const isSectionComplete = (sectionName) => {
    return sectionsCompleted[sectionName] || false
  }

  // Proceder al siguiente paso
  const handleContinueToPreview = () => {
    if (!isFormValid) {
      setShowErrors(true)
      // Scroll al primer error
      const firstErrorField = document.querySelector('.border-feedback-error, [data-error="true"]')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    setCurrentStep('preview')
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

  // Completar el proceso
  const handleLoadingComplete = () => {
    setCurrentStep('success')
  }

  // Acciones finales
  const handleViewDashboard = () => {
    onComplete?.({ action: 'dashboard', data: formData })
  }

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
    setShowErrors(false)
    
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Componente del formulario principal
  const FormContent = () => (
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
              <ProgressTracker 
                formData={formData} 
                validations={validations}
                compact={true}
              />
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
              <LocationSelector
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
                {/* Nombres de las partes */}
                <FormFieldGroup.Field
                  label="Nombre del Demandante"
                  hint="Persona o entidad que inicia la acción judicial"
                >
                  <input
                    type="text"
                    className={cn(
                      'w-full px-sm py-sm border rounded-md focus:outline-none transition-colors',
                      activeField === 'nombreDemandante' ? 'border-interactive-default' : 'border-border-default',
                      validations.nombreDemandante && !validations.nombreDemandante.isValid && 'border-feedback-error'
                    )}
                    placeholder="Ej: Juan Carlos Pérez González"
                    value={formData.nombreDemandante}
                    onChange={handleNombreDemandanteChange}
                    onFocus={handleNombreDemandanteFocus}
                    onBlur={handleFieldBlur}
                  />
                  <BasicFormValidation
                    value={formData.nombreDemandante}
                    fieldType="nombrePersona"
                  />
                </FormFieldGroup.Field>

                <FormFieldGroup.Field
                  label="Nombre del Demandado"
                  hint="Persona o entidad contra quien se dirige la acción"
                >
                  <input
                    type="text"
                    className={cn(
                      'w-full px-sm py-sm border rounded-md focus:outline-none transition-colors',
                      activeField === 'nombreDemandado' ? 'border-interactive-default' : 'border-border-default',
                      validations.nombreDemandado && !validations.nombreDemandado.isValid && 'border-feedback-error'
                    )}
                    placeholder="Ej: María Elena González Herrera"
                    value={formData.nombreDemandado}
                    onChange={handleNombreDemandadoChange}
                    onFocus={handleNombreDemandadoFocus}
                    onBlur={handleFieldBlur}
                  />
                  <BasicFormValidation
                    value={formData.nombreDemandado}
                    fieldType="nombrePersona"
                  />
                </FormFieldGroup.Field>

                {/* Números de identificación */}
                <FormFieldGroup.Field
                  label="Número de Radicado"
                  hint="Número único del proceso (más preciso)"
                >
                  <input
                    type="text"
                    className={cn(
                      'w-full px-sm py-sm border rounded-md focus:outline-none transition-colors font-mono',
                      activeField === 'numeroRadicado' ? 'border-interactive-default' : 'border-border-default',
                      validations.numeroRadicado && !validations.numeroRadicado.isValid && 'border-feedback-error'
                    )}
                    placeholder="Ej: 11001310300120240001234"
                    value={formData.numeroRadicado}
                    onChange={handleNumeroRadicadoChange}
                    onFocus={handleNumeroRadicadoFocus}
                    onBlur={handleFieldBlur}
                  />
                  <BasicFormValidation
                    value={formData.numeroRadicado}
                    fieldType="numeroRadicado"
                    showStrength={true}
                  />
                </FormFieldGroup.Field>

                <FormFieldGroup.Field
                  label="Número de Radicación"
                  hint="Número interno del despacho"
                >
                  <input
                    type="text"
                    className={cn(
                      'w-full px-sm py-sm border rounded-md focus:outline-none transition-colors font-mono',
                      activeField === 'numeroRadicacion' ? 'border-interactive-default' : 'border-border-default',
                      validations.numeroRadicacion && !validations.numeroRadicacion.isValid && 'border-feedback-error'
                    )}
                    placeholder="Ej: 20240001234"
                    value={formData.numeroRadicacion}
                    onChange={handleNumeroRadicacionChange}
                    onFocus={handleNumeroRadicacionFocus}
                    onBlur={handleFieldBlur}
                  />
                  <BasicFormValidation
                    value={formData.numeroRadicacion}
                    fieldType="numeroRadicacion"
                  />
                </FormFieldGroup.Field>
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
                disabled={!isFormValid}
                className="flex items-center gap-sm"
              >
                {isFormValid ? (
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
  )

  // Componente de ayuda lateral
  const SideContent = () => (
    <div className="space-y-md">
      {/* Progreso (solo desktop) */}
      <div className="hidden lg:block">
        <ProgressTracker 
          formData={formData} 
          validations={validations}
        />
      </div>
      
      {/* Ayuda contextual */}
      <ContextualHelp
        activeField={activeField}
        formData={formData}
        compact={true}
      />
    </div>
  )

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
              Configura una búsqueda automatizada y personalizada de procesos judiciales
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
          sideContentTitle="Progreso y Ayuda"
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
}

FinalImprovedAdvancedQueryForm.displayName = 'FinalImprovedAdvancedQueryForm'

export default FinalImprovedAdvancedQueryForm