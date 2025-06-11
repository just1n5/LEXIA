// src/components/advanced-query/AdvancedTestForm.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { cn } from '../../utils/cn'
import { Settings } from 'lucide-react'
import Card from '../ui/Card'
import BasicFormValidation from './BasicFormValidation'
import FormFieldGroup from './FormFieldGroup'
import LocationSelector from './LocationSelector'
import ContextualHelp from './ContextualHelp'
import ProgressTracker from './ProgressTracker'
import ResponsiveLayout from './ResponsiveLayout'

/**
 * 🎯 DETECTOR DE COMPONENTE PROBLEMÁTICO - FASE 2
 * Diagnóstico específico para encontrar qué componente causa el problema de focus
 */
const AdvancedTestForm = () => {
  const [mode, setMode] = useState('base')
  
  const [formData, setFormData] = useState({
    departamento: '',
    ciudad: '',
    nombreDemandante: '',
    nombreDemandado: '',
    numeroRadicado: '',
    numeroRadicacion: ''
  })
  
  const [activeField, setActiveField] = useState(null)
  const [validations, setValidations] = useState({})
  const [showErrors, setShowErrors] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  // Handlers básicos - EXACTOS al formulario completo
  const handleNombreDemandanteChange = (e) => {
    console.log('🎯 Mode:', mode, '- onChange nombreDemandante:', e.target.value)
    setFormData(prev => ({
      ...prev,
      nombreDemandante: e.target.value
    }))
    if (showErrors && e.target.value) {
      setShowErrors(false)
    }
  }

  const handleNombreDemandadoChange = (e) => {
    console.log('🎯 Mode:', mode, '- onChange nombreDemandado:', e.target.value)
    setFormData(prev => ({
      ...prev,
      nombreDemandado: e.target.value
    }))
    if (showErrors && e.target.value) {
      setShowErrors(false)
    }
  }

  const handleNumeroRadicadoChange = (e) => {
    console.log('🎯 Mode:', mode, '- onChange numeroRadicado:', e.target.value)
    setFormData(prev => ({
      ...prev,
      numeroRadicado: e.target.value
    }))
    if (showErrors && e.target.value) {
      setShowErrors(false)
    }
  }

  const handleNombreDemandanteFocus = () => {
    console.log('🎯 Focus: nombreDemandante')
    setActiveField('nombreDemandante')
  }
  
  const handleNombreDemandadoFocus = () => {
    console.log('🎯 Focus: nombreDemandado')
    setActiveField('nombreDemandado')
  }
  
  const handleNumeroRadicadoFocus = () => {
    console.log('🎯 Focus: numeroRadicado')
    setActiveField('numeroRadicado')
  }
  
  const handleFieldBlur = () => {
    console.log('🎯 Blur')
    setTimeout(() => setActiveField(null), 150)
  }

  // Handler para ubicación
  const handleLocationChange = (location) => {
    console.log('🎯 Location change:', location)
    setFormData(prev => ({ 
      ...prev, 
      departamento: location.departamento, 
      ciudad: location.ciudad 
    }))
  }

  // Validaciones - EXACTAS al formulario completo
  useEffect(() => {
    const hasLocation = formData.departamento && formData.ciudad
    const hasSearchCriteria = formData.nombreDemandante || 
                             formData.nombreDemandado || 
                             formData.numeroRadicado || 
                             formData.numeroRadicacion
    
    const validateField = (value, fieldType) => {
      if (!value || value.trim() === '') return { isValid: true }
      
      switch (fieldType) {
        case 'numeroRadicado':
          return {
            isValid: value.length >= 11 && value.length <= 23 && /^\d+$/.test(value)
          }
        case 'nombrePersona':
          return {
            isValid: value.length >= 2 && value.length <= 100 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)
          }
        default:
          return { isValid: true }
      }
    }
    
    const fieldValidations = {
      nombreDemandante: validateField(formData.nombreDemandante, 'nombrePersona'),
      nombreDemandado: validateField(formData.nombreDemandado, 'nombrePersona'),
      numeroRadicado: validateField(formData.numeroRadicado, 'numeroRadicado')
    }
    
    setValidations(fieldValidations)
    
    const hasErrors = Object.values(fieldValidations).some(v => v && !v.isValid)
    setIsFormValid(hasLocation && hasSearchCriteria && !hasErrors)
  }, [formData])

  // useMemo - EXACTO al formulario completo
  const sectionsCompleted = useMemo(() => ({
    location: formData.departamento && formData.ciudad,
    criteria: formData.nombreDemandante || formData.nombreDemandado || 
              formData.numeroRadicado || formData.numeroRadicacion
  }), [formData])

  const isSectionComplete = (sectionName) => {
    return sectionsCompleted[sectionName] || false
  }

  // Clase para inputs
  const inputClass = (fieldName) => cn(
    'w-full px-3 py-2 border rounded-md focus:outline-none transition-colors',
    activeField === fieldName ? 'border-yellow-500' : 'border-gray-300',
    validations[fieldName] && !validations[fieldName].isValid && 'border-red-500'
  )

  console.log('🎯 Component render - Mode:', mode, 'FormData:', formData)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Control Panel */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h1 className="text-xl font-bold mb-4">🎯 Detector de Componente Problemático - Fase 2</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { key: 'base', label: '✅ Base', desc: 'Solo inputs' },
            { key: 'card', label: '🃏 +Card', desc: 'Con Card wrapper' },
            { key: 'fieldgroup', label: '📦 +FieldGroup', desc: 'Con FormFieldGroup' },
            { key: 'location', label: '📍 +Location', desc: 'Con LocationSelector' },
            { key: 'progress', label: '📊 +Progress', desc: 'Con ProgressTracker' },
            { key: 'help', label: '🤔 +Help', desc: 'Con ContextualHelp' },
            { key: 'validation', label: '✅ +Validation', desc: 'Con BasicFormValidation' },
            { key: 'responsive', label: '📱 +Responsive', desc: 'Con ResponsiveLayout' },
            { key: 'exact', label: '🎯 EXACTO', desc: 'Copia exacta del original' },
            { key: 'complete', label: '🔥 COMPLETO', desc: 'TODO JUNTO' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setMode(item.key)}
              className={cn(
                'px-3 py-2 rounded text-xs font-medium transition-colors text-left',
                mode === item.key 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              )}
            >
              <div>{item.label}</div>
              <div className="text-xs opacity-75">{item.desc}</div>
            </button>
          ))}
        </div>

        <div className="text-sm text-red-600 font-medium">
          🎯 <strong>Objetivo:</strong> Identificar QUÉ componente específico causa el problema de focus
        </div>
      </div>

      {/* Test Area */}
      <div className="bg-white border rounded-lg p-6">
        {renderByMode()}
      </div>
    </div>
  )

  // Función principal de renderizado por modo
  function renderByMode() {
    const baseFields = renderBaseFields()
    
    switch(mode) {
      case 'base':
        return baseFields
        
      case 'card':
        return (
          <Card size="lg">
            <Card.Header>
              <Card.Title>🃏 Test con Card Component</Card.Title>
            </Card.Header>
            <Card.Content>
              {baseFields}
            </Card.Content>
          </Card>
        )
        
      case 'fieldgroup':
        return (
          <FormFieldGroup
            number={1}
            title="📦 Test con FormFieldGroup"
            description="Campos envueltos en FormFieldGroup"
            required={true}
            completed={isSectionComplete('criteria')}
          >
            {baseFields}
          </FormFieldGroup>
        )
        
      case 'location':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded">
              <h3 className="font-medium mb-2">📍 LocationSelector:</h3>
              <LocationSelector
                value={{ departamento: formData.departamento, ciudad: formData.ciudad }}
                onChange={handleLocationChange}
              />
            </div>
            {baseFields}
          </div>
        )
        
      case 'progress':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {baseFields}
            </div>
            <div>
              <h3 className="font-medium mb-2">📊 ProgressTracker:</h3>
              <ProgressTracker 
                formData={formData} 
                validations={validations}
                compact={true}
              />
            </div>
          </div>
        )
        
      case 'help':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {baseFields}
            </div>
            <div>
              <h3 className="font-medium mb-2">🤔 ContextualHelp:</h3>
              <ContextualHelp
                activeField={activeField}
                formData={formData}
                compact={true}
              />
            </div>
          </div>
        )
        
      case 'validation':
        return (
          <div className="space-y-4">
            {/* Campo 1 con validación */}
            <div>
              <label className="block text-sm font-medium mb-1">
                ✅ Nombre Demandante (con BasicFormValidation):
              </label>
              <input
                type="text"
                className={inputClass('nombreDemandante')}
                placeholder="Ej: Juan Carlos Pérez"
                value={formData.nombreDemandante}
                onChange={handleNombreDemandanteChange}
                onFocus={handleNombreDemandanteFocus}
                onBlur={handleFieldBlur}
              />
              <BasicFormValidation
                value={formData.nombreDemandante}
                fieldType="nombrePersona"
              />
            </div>
            
            {/* Campo 2 con validación */}
            <div>
              <label className="block text-sm font-medium mb-1">
                ✅ Número Radicado (con BasicFormValidation):
              </label>
              <input
                type="text"
                className={inputClass('numeroRadicado') + ' font-mono'}
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
            </div>
          </div>
        )
        
      case 'responsive':
        return (
          <ResponsiveLayout
            mainContent={baseFields}
            sideContent={
              <div className="p-4 bg-blue-50 rounded">
                <h3 className="font-medium mb-2">📱 ResponsiveLayout Test</h3>
                <p className="text-sm text-gray-600">
                  Prueba si ResponsiveLayout causa re-renders que rompen el focus
                </p>
              </div>
            }
            sideContentTitle="Test de ResponsiveLayout"
            collapsibleSide={true}
          />
        )
        
      case 'exact':
        return (
          <ResponsiveLayout
            mainContent={
              <div className="space-y-xl">
                <Card size="lg">
                  <Card.Header>
                    <div className="flex items-center justify-between">
                      <div>
                        <Card.Title as="h2" className="flex items-center gap-sm">
                          <Settings className="w-5 h-5 text-interactive-default" />
                          Configurar Consulta Avanzada (EXACTO)
                        </Card.Title>
                        <p className="text-body-paragraph text-text-secondary mt-xs">
                          Reproduce exactamente la estructura del formulario original
                        </p>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-2xl">
                      <FormFieldGroup
                        number={2}
                        title="Criterios de Búsqueda"
                        description="Define al menos un criterio para identificar los procesos"
                        required={true}
                        completed={isSectionComplete('criteria')}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                          <FormFieldGroup.Field
                            label="Nombre del Demandante"
                            hint="Persona o entidad que inicia la acción judicial"
                          >
                            <input
                              type="text"
                              className={inputClass('nombreDemandante')}
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
                            label="Número de Radicado"
                            hint="Número único del proceso (más preciso)"
                          >
                            <input
                              type="text"
                              className={inputClass('numeroRadicado') + ' font-mono'}
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
                        </div>
                      </FormFieldGroup>
                    </div>
                  </Card.Content>
                </Card>
              </div>
            }
            sideContent={
              <div className="space-y-md">
                <ProgressTracker 
                  formData={formData} 
                  validations={validations}
                />
                <ContextualHelp
                  activeField={activeField}
                  formData={formData}
                  compact={true}
                />
              </div>
            }
            sideContentTitle="Progreso y Ayuda"
            collapsibleSide={true}
          />
        )
        
      case 'complete':
        return (
          <Card size="lg">
            <Card.Header>
              <Card.Title>🔥 FORMULARIO COMPLETO - Test Final</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* LocationSelector */}
                  <div className="p-4 bg-blue-50 rounded">
                    <h3 className="font-medium mb-2">Ubicación:</h3>
                    <LocationSelector
                      value={{ departamento: formData.departamento, ciudad: formData.ciudad }}
                      onChange={handleLocationChange}
                    />
                  </div>
                  
                  {/* FormFieldGroup con campos */}
                  <FormFieldGroup
                    number={1}
                    title="Criterios de Búsqueda"
                    description="Complete la información para realizar la consulta"
                    required={true}
                    completed={isSectionComplete('criteria')}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Nombre del Demandante:
                        </label>
                        <input
                          type="text"
                          className={inputClass('nombreDemandante')}
                          placeholder="Ej: Juan Carlos Pérez"
                          value={formData.nombreDemandante}
                          onChange={handleNombreDemandanteChange}
                          onFocus={handleNombreDemandanteFocus}
                          onBlur={handleFieldBlur}
                        />
                        <BasicFormValidation
                          value={formData.nombreDemandante}
                          fieldType="nombrePersona"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Número de Radicado:
                        </label>
                        <input
                          type="text"
                          className={inputClass('numeroRadicado') + ' font-mono'}
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
                      </div>
                    </div>
                  </FormFieldGroup>
                </div>
                
                {/* Sidebar con componentes */}
                <div className="space-y-4">
                  <ProgressTracker 
                    formData={formData} 
                    validations={validations}
                    compact={true}
                  />
                  <ContextualHelp
                    activeField={activeField}
                    formData={formData}
                    compact={true}
                  />
                </div>
              </div>
            </Card.Content>
          </Card>
        )
        
      default:
        return baseFields
    }
  }
  
  // Campos base sin componentes adicionales
  function renderBaseFields() {
    return (
      <div className="space-y-4">
        <div className="p-3 bg-green-50 rounded text-sm text-green-700">
          ✅ <strong>Modo: {mode}</strong> - Prueba escribiendo en los campos
        </div>
        
        {/* Campo 1 - Básico */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre del Demandante:
          </label>
          <input
            type="text"
            className={inputClass('nombreDemandante')}
            placeholder="Ej: Juan Carlos Pérez"
            value={formData.nombreDemandante}
            onChange={handleNombreDemandanteChange}
            onFocus={handleNombreDemandanteFocus}
            onBlur={handleFieldBlur}
          />
        </div>

        {/* Campo 2 - Básico */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre del Demandado:
          </label>
          <input
            type="text"
            className={inputClass('nombreDemandado')}
            placeholder="Ej: María González"
            value={formData.nombreDemandado}
            onChange={handleNombreDemandadoChange}
            onFocus={handleNombreDemandadoFocus}
            onBlur={handleFieldBlur}
          />
        </div>

        {/* Campo 3 - Básico */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Número de Radicado:
          </label>
          <input
            type="text"
            className={inputClass('numeroRadicado') + ' font-mono'}
            placeholder="Ej: 11001310300120240001234"
            value={formData.numeroRadicado}
            onChange={handleNumeroRadicadoChange}
            onFocus={handleNumeroRadicadoFocus}
            onBlur={handleFieldBlur}
          />
        </div>
        
        {/* Debug info */}
        <div className="mt-6 p-3 bg-gray-100 rounded">
          <h3 className="font-medium mb-2">🔍 Estado del formulario:</h3>
          <pre className="text-xs">
            {JSON.stringify({ 
              mode,
              activeField, 
              nombreDemandante: formData.nombreDemandante?.slice(0, 10) + '...', 
              isFormValid 
            }, null, 2)}
          </pre>
        </div>
      </div>
    )
  }
}

export default AdvancedTestForm