// src/components/advanced-query/ProgressiveTestForm.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { cn } from '../../utils/cn'
import BasicFormValidation from './BasicFormValidation'

/**
 * Formulario de prueba progresivo para identificar
 * qué está causando el problema de re-render
 */
const ProgressiveTestForm = ({ level = 1 }) => {
  const [formData, setFormData] = useState({
    nombreDemandante: '',
    nombreDemandado: '',
    numeroRadicado: ''
  })
  
  const [activeField, setActiveField] = useState(null)
  const [validations, setValidations] = useState({})

  // Level 1: Solo handlers básicos
  const handleNombreDemandanteChange = (e) => {
    console.log('Level', level, '- onChange:', e.target.value)
    setFormData(prev => ({
      ...prev,
      nombreDemandante: e.target.value
    }))
  }

  const handleNombreDemandadoChange = (e) => {
    setFormData(prev => ({
      ...prev,
      nombreDemandado: e.target.value
    }))
  }

  const handleNumeroRadicadoChange = (e) => {
    setFormData(prev => ({
      ...prev,
      numeroRadicado: e.target.value
    }))
  }

  // Level 2: Agregar focus handlers
  const handleNombreDemandanteFocus = () => setActiveField('nombreDemandante')
  const handleNombreDemandadoFocus = () => setActiveField('nombreDemandado')
  const handleNumeroRadicadoFocus = () => setActiveField('numeroRadicado')
  const handleFieldBlur = () => {
    setTimeout(() => setActiveField(null), 150)
  }

  // Level 3: Agregar validaciones con useEffect
  useEffect(() => {
    if (level < 3) return

    console.log('Level', level, '- useEffect triggered')
    
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
  }, [formData, level])

  // Level 4: Agregar useMemo
  const sectionsCompleted = useMemo(() => {
    if (level < 4) return {}
    
    console.log('Level', level, '- useMemo recalculated')
    return {
      criteria: formData.nombreDemandante || formData.nombreDemandado || formData.numeroRadicado
    }
  }, [formData, level])

  console.log('Level', level, '- Component render:', formData)

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white border rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        Test Form - Level {level}
      </h2>
      
      <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
        <strong>Level {level} incluye:</strong>
        <ul className="mt-1 list-disc list-inside">
          <li>✅ Handlers básicos de onChange</li>
          {level >= 2 && <li>✅ Focus/blur handlers + activeField state</li>}
          {level >= 3 && <li>✅ useEffect para validaciones + validations state</li>}
          {level >= 4 && <li>✅ useMemo para sectionsCompleted</li>}
          {level >= 5 && <li>✅ BasicFormValidation component</li>}
        </ul>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre del Demandante:
          </label>
          <input
            type="text"
            className={cn(
              'w-full px-3 py-2 border rounded-md focus:outline-none transition-colors',
              level >= 2 && activeField === 'nombreDemandante' ? 'border-yellow-500' : 'border-gray-300',
              level >= 3 && validations.nombreDemandante && !validations.nombreDemandante.isValid && 'border-red-500'
            )}
            placeholder="Ej: Juan Carlos Pérez"
            value={formData.nombreDemandante}
            onChange={handleNombreDemandanteChange}
            onFocus={level >= 2 ? handleNombreDemandanteFocus : undefined}
            onBlur={level >= 2 ? handleFieldBlur : undefined}
          />
          {level >= 5 && (
            <BasicFormValidation
              value={formData.nombreDemandante}
              fieldType="nombrePersona"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre del Demandado:
          </label>
          <input
            type="text"
            className={cn(
              'w-full px-3 py-2 border rounded-md focus:outline-none transition-colors',
              level >= 2 && activeField === 'nombreDemandado' ? 'border-yellow-500' : 'border-gray-300',
              level >= 3 && validations.nombreDemandado && !validations.nombreDemandado.isValid && 'border-red-500'
            )}
            placeholder="Ej: María González"
            value={formData.nombreDemandado}
            onChange={handleNombreDemandadoChange}
            onFocus={level >= 2 ? handleNombreDemandadoFocus : undefined}
            onBlur={level >= 2 ? handleFieldBlur : undefined}
          />
          {level >= 5 && (
            <BasicFormValidation
              value={formData.nombreDemandado}
              fieldType="nombrePersona"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Número de Radicado:
          </label>
          <input
            type="text"
            className={cn(
              'w-full px-3 py-2 border rounded-md focus:outline-none transition-colors font-mono',
              level >= 2 && activeField === 'numeroRadicado' ? 'border-yellow-500' : 'border-gray-300',
              level >= 3 && validations.numeroRadicado && !validations.numeroRadicado.isValid && 'border-red-500'
            )}
            placeholder="Ej: 11001310300120240001234"
            value={formData.numeroRadicado}
            onChange={handleNumeroRadicadoChange}
            onFocus={level >= 2 ? handleNumeroRadicadoFocus : undefined}
            onBlur={level >= 2 ? handleFieldBlur : undefined}
          />
          {level >= 5 && (
            <BasicFormValidation
              value={formData.numeroRadicado}
              fieldType="numeroRadicado"
              showStrength={true}
            />
          )}
        </div>
      </div>

      <div className="mt-6 p-3 bg-gray-100 rounded">
        <h3 className="font-medium mb-2">Estado del formulario:</h3>
        <pre className="text-xs mb-2">
          formData: {JSON.stringify(formData, null, 2)}
        </pre>
        {level >= 2 && (
          <p className="text-xs mb-1">activeField: {activeField || 'null'}</p>
        )}
        {level >= 3 && (
          <pre className="text-xs mb-1">
            validations: {JSON.stringify(validations, null, 2)}
          </pre>
        )}
        {level >= 4 && (
          <pre className="text-xs">
            sectionsCompleted: {JSON.stringify(sectionsCompleted, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

export default ProgressiveTestForm