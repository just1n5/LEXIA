// src/components/advanced-query/MicroscopicForm.jsx
import React, { useState, useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'

/**
 * 🔬 MicroscopicForm - Detector microscópico de re-renders
 * Formulario ultra-minimalista para capturar el problema exacto
 */
const MicroscopicForm = () => {
  const [formData, setFormData] = useState({
    nombreDemandante: '',
    nombreDemandado: ''
  })
  const [activeField, setActiveField] = useState(null)
  
  // 🔬 DETECTOR DE RE-RENDERS
  const renderCount = useRef(0)
  const lastRenderReason = useRef('')
  const lastFormData = useRef(formData)
  const lastActiveField = useRef(activeField)
  
  renderCount.current++
  
  // Detectar QUÉ causó el re-render
  if (JSON.stringify(lastFormData.current) !== JSON.stringify(formData)) {
    lastRenderReason.current = `formData changed: ${JSON.stringify(formData)}`
    lastFormData.current = formData
  } else if (lastActiveField.current !== activeField) {
    lastRenderReason.current = `activeField changed: ${activeField}`
    lastActiveField.current = activeField
  } else {
    lastRenderReason.current = 'Unknown reason - possible parent re-render'
  }

  console.log(`🔬 MICROSCOPIC RENDER #${renderCount.current}:`, lastRenderReason.current)

  // Handlers ULTRA-SIMPLES
  const handleNombreDemandanteChange = (e) => {
    console.log('🔬 handleNombreDemandanteChange called:', e.target.value)
    setFormData(prev => ({ ...prev, nombreDemandante: e.target.value }))
  }

  const handleNombreDemandadoChange = (e) => {
    console.log('🔬 handleNombreDemandadoChange called:', e.target.value)
    setFormData(prev => ({ ...prev, nombreDemandado: e.target.value }))
  }

  const handleFieldFocus = (field) => {
    console.log('🔬 handleFieldFocus called:', field)
    setActiveField(field)
  }

  const handleFieldBlur = () => {
    console.log('🔬 handleFieldBlur called')
    setTimeout(() => setActiveField(null), 150)
  }

  // Clase para inputs
  const inputClass = (fieldName) => cn(
    'w-full px-3 py-2 border rounded-md focus:outline-none transition-colors',
    activeField === fieldName ? 'border-red-500' : 'border-gray-300'
  )

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border rounded-lg">
      {/* Debug info EN TIEMPO REAL */}
      <div className="mb-6 p-4 bg-red-50 rounded border-2 border-red-200">
        <h3 className="font-bold text-red-800 mb-2">🔬 MICROSCOPIC DEBUG</h3>
        <div className="text-xs space-y-1 font-mono">
          <div><strong>Render Count:</strong> {renderCount.current}</div>
          <div><strong>Last Reason:</strong> {lastRenderReason.current}</div>
          <div><strong>Active Field:</strong> {activeField}</div>
          <div><strong>FormData:</strong> {JSON.stringify(formData)}</div>
        </div>
      </div>

      {/* Campos ULTRA-MINIMALISTAS */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            🔬 Nombre Demandante (MICROSCOPIC):
          </label>
          <input
            type="text"
            className={inputClass('nombreDemandante')}
            placeholder="Escribe aquí..."
            value={formData.nombreDemandante}
            onChange={handleNombreDemandanteChange}
            onFocus={() => handleFieldFocus('nombreDemandante')}
            onBlur={handleFieldBlur}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            🔬 Nombre Demandado (MICROSCOPIC):
          </label>
          <input
            type="text"
            className={inputClass('nombreDemandado')}
            placeholder="Escribe aquí..."
            value={formData.nombreDemandado}
            onChange={handleNombreDemandadoChange}
            onFocus={() => handleFieldFocus('nombreDemandado')}
            onBlur={handleFieldBlur}
          />
        </div>
      </div>

      {/* Estado en tiempo real */}
      <div className="mt-6 p-3 bg-gray-100 rounded">
        <h3 className="font-medium mb-2">🔬 Estado Live:</h3>
        <pre className="text-xs">
          {JSON.stringify({ 
            renderCount: renderCount.current,
            activeField, 
            formData
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default MicroscopicForm