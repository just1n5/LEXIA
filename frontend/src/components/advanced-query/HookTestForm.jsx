// src/components/advanced-query/HookTestForm.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSolicitudes } from '../../hooks/useSolicitudes'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../utils/cn'

/**
 * 🧪 HookTestForm - Prueba de hooks individuales
 * Para identificar exactamente qué hook causa los re-renders problemáticos
 */
const HookTestForm = ({ mode, onBack, onComplete }) => {
  const [formData, setFormData] = useState({
    nombreDemandante: '',
    nombreDemandado: '',
    numeroRadicado: ''
  })
  const [activeField, setActiveField] = useState(null)

  console.log('🧪 HookTestForm render - Mode:', mode, 'FormData:', formData)

  // Renderizar componente específico según modo
  switch(mode) {
    case 'none':
      return <TestFormNoHooks 
        formData={formData} 
        setFormData={setFormData}
        activeField={activeField}
        setActiveField={setActiveField}
      />
    case 'navigate':
      return <TestFormWithNavigate 
        formData={formData} 
        setFormData={setFormData}
        activeField={activeField}
        setActiveField={setActiveField}
      />
    case 'toast':
      return <TestFormWithToast 
        formData={formData} 
        setFormData={setFormData}
        activeField={activeField}
        setActiveField={setActiveField}
      />
    case 'solicitudes':
      return <TestFormWithSolicitudes 
        formData={formData} 
        setFormData={setFormData}
        activeField={activeField}
        setActiveField={setActiveField}
      />
    case 'all':
      return <TestFormWithAll 
        formData={formData} 
        setFormData={setFormData}
        activeField={activeField}
        setActiveField={setActiveField}
      />
    default:
      return <div className="p-6 text-center text-gray-500">
        Selecciona un modo de prueba
      </div>
  }
}

// Componentes de prueba individuales para respetar reglas de hooks
const TestFormNoHooks = ({ formData, setFormData, activeField, setActiveField }) => {
  const handleNombreDemandanteChange = (e) => {
    console.log('✅ NoHooks - onChange nombreDemandante:', e.target.value)
    setFormData(prev => ({ ...prev, nombreDemandante: e.target.value }))
  }
  
  const handleNombreDemandadoChange = (e) => {
    setFormData(prev => ({ ...prev, nombreDemandado: e.target.value }))
  }
  
  const handleNumeroRadicadoChange = (e) => {
    setFormData(prev => ({ ...prev, numeroRadicado: e.target.value }))
  }
  
  const handleFieldFocus = (field) => setActiveField(field)
  const handleFieldBlur = () => setTimeout(() => setActiveField(null), 150)
  
  return <TestFields 
    formData={formData}
    activeField={activeField}
    onNombreDemandanteChange={handleNombreDemandanteChange}
    onNombreDemandadoChange={handleNombreDemandadoChange}
    onNumeroRadicadoChange={handleNumeroRadicadoChange}
    onFieldFocus={handleFieldFocus}
    onFieldBlur={handleFieldBlur}
    mode="none"
  />
}

const TestFormWithNavigate = ({ formData, setFormData, activeField, setActiveField }) => {
  const navigate = useNavigate() // 🧠 Solo este hook
  
  const handleNombreDemandanteChange = (e) => {
    console.log('🧠 WithNavigate - onChange nombreDemandante:', e.target.value)
    setFormData(prev => ({ ...prev, nombreDemandante: e.target.value }))
  }
  
  const handleNombreDemandadoChange = (e) => {
    setFormData(prev => ({ ...prev, nombreDemandado: e.target.value }))
  }
  
  const handleNumeroRadicadoChange = (e) => {
    setFormData(prev => ({ ...prev, numeroRadicado: e.target.value }))
  }
  
  const handleFieldFocus = (field) => setActiveField(field)
  const handleFieldBlur = () => setTimeout(() => setActiveField(null), 150)
  
  return <TestFields 
    formData={formData}
    activeField={activeField}
    onNombreDemandanteChange={handleNombreDemandanteChange}
    onNombreDemandadoChange={handleNombreDemandadoChange}
    onNumeroRadicadoChange={handleNumeroRadicadoChange}
    onFieldFocus={handleFieldFocus}
    onFieldBlur={handleFieldBlur}
    mode="navigate"
    hasNavigate={!!navigate}
  />
}

const TestFormWithToast = ({ formData, setFormData, activeField, setActiveField }) => {
  const { toast } = useToast() // 🍞 Solo este hook
  
  const handleNombreDemandanteChange = (e) => {
    console.log('🍞 WithToast - onChange nombreDemandante:', e.target.value)
    setFormData(prev => ({ ...prev, nombreDemandante: e.target.value }))
  }
  
  const handleNombreDemandadoChange = (e) => {
    setFormData(prev => ({ ...prev, nombreDemandado: e.target.value }))
  }
  
  const handleNumeroRadicadoChange = (e) => {
    setFormData(prev => ({ ...prev, numeroRadicado: e.target.value }))
  }
  
  const handleFieldFocus = (field) => setActiveField(field)
  const handleFieldBlur = () => setTimeout(() => setActiveField(null), 150)
  
  return <TestFields 
    formData={formData}
    activeField={activeField}
    onNombreDemandanteChange={handleNombreDemandanteChange}
    onNombreDemandadoChange={handleNombreDemandadoChange}
    onNumeroRadicadoChange={handleNumeroRadicadoChange}
    onFieldFocus={handleFieldFocus}
    onFieldBlur={handleFieldBlur}
    mode="toast"
    hasToast={!!toast}
    onTestToast={() => toast?.info('Test', 'Toast funciona')}
  />
}

const TestFormWithSolicitudes = ({ formData, setFormData, activeField, setActiveField }) => {
  const solicitudesHook = useSolicitudes() // 🔥 Solo este hook
  
  const handleNombreDemandanteChange = (e) => {
    console.log('🔥 WithSolicitudes - onChange nombreDemandante:', e.target.value)
    setFormData(prev => ({ ...prev, nombreDemandante: e.target.value }))
  }
  
  const handleNombreDemandadoChange = (e) => {
    setFormData(prev => ({ ...prev, nombreDemandado: e.target.value }))
  }
  
  const handleNumeroRadicadoChange = (e) => {
    setFormData(prev => ({ ...prev, numeroRadicado: e.target.value }))
  }
  
  const handleFieldFocus = (field) => setActiveField(field)
  const handleFieldBlur = () => setTimeout(() => setActiveField(null), 150)
  
  return <TestFields 
    formData={formData}
    activeField={activeField}
    onNombreDemandanteChange={handleNombreDemandanteChange}
    onNombreDemandadoChange={handleNombreDemandadoChange}
    onNumeroRadicadoChange={handleNumeroRadicadoChange}
    onFieldFocus={handleFieldFocus}
    onFieldBlur={handleFieldBlur}
    mode="solicitudes"
    hasSolicitudes={!!solicitudesHook}
    onTestSolicitudes={() => console.log('🔥 Solicitudes:', solicitudesHook)}
  />
}

const TestFormWithAll = ({ formData, setFormData, activeField, setActiveField }) => {
  const navigate = useNavigate() // 💥 Todos los hooks
  const { toast } = useToast()
  const solicitudesHook = useSolicitudes()
  
  const handleNombreDemandanteChange = (e) => {
    console.log('💥 WithAll - onChange nombreDemandante:', e.target.value)
    setFormData(prev => ({ ...prev, nombreDemandante: e.target.value }))
  }
  
  const handleNombreDemandadoChange = (e) => {
    setFormData(prev => ({ ...prev, nombreDemandado: e.target.value }))
  }
  
  const handleNumeroRadicadoChange = (e) => {
    setFormData(prev => ({ ...prev, numeroRadicado: e.target.value }))
  }
  
  const handleFieldFocus = (field) => setActiveField(field)
  const handleFieldBlur = () => setTimeout(() => setActiveField(null), 150)
  
  return <TestFields 
    formData={formData}
    activeField={activeField}
    onNombreDemandanteChange={handleNombreDemandanteChange}
    onNombreDemandadoChange={handleNombreDemandadoChange}
    onNumeroRadicadoChange={handleNumeroRadicadoChange}
    onFieldFocus={handleFieldFocus}
    onFieldBlur={handleFieldBlur}
    mode="all"
    hasNavigate={!!navigate}
    hasToast={!!toast}
    hasSolicitudes={!!solicitudesHook}
    onTestToast={() => toast?.info('Test', 'Toast funciona')}
    onTestSolicitudes={() => console.log('🔥 Solicitudes:', solicitudesHook)}
  />
}

// Componente reutilizable para renderizar campos
const TestFields = ({ 
  formData, 
  activeField, 
  onNombreDemandanteChange,
  onNombreDemandadoChange, 
  onNumeroRadicadoChange,
  onFieldFocus,
  onFieldBlur,
  mode,
  hasNavigate,
  hasToast,
  hasSolicitudes,
  onTestToast,
  onTestSolicitudes
}) => {
  const inputClass = (fieldName) => cn(
    'w-full px-3 py-2 border rounded-md focus:outline-none transition-colors',
    activeField === fieldName ? 'border-yellow-500' : 'border-gray-300'
  )

  const modeDescriptions = {
    'none': '✅ Sin hooks - Solo React state puro',
    'navigate': '🧠 Con useNavigate - Router hook',
    'toast': '🍞 Con useToast - Notification hook',
    'solicitudes': '🔥 Con useSolicitudes - API hook',
    'all': '💥 Con TODOS los hooks - Debería fallar'
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border rounded-lg">
      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h3 className="font-bold text-lg mb-2">🧪 Modo de Prueba: {mode}</h3>
        <p className="text-sm text-gray-700">{modeDescriptions[mode]}</p>
        
        {/* Estado de hooks */}
        <div className="mt-3 text-xs">
          <div>useNavigate: {hasNavigate ? '✅ Activo' : '❌ Inactivo'}</div>
          <div>useToast: {hasToast ? '✅ Activo' : '❌ Inactivo'}</div>
          <div>useSolicitudes: {hasSolicitudes ? '✅ Activo' : '❌ Inactivo'}</div>
        </div>
      </div>

      {/* Campos de prueba */}
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
            onChange={onNombreDemandanteChange}
            onFocus={() => onFieldFocus('nombreDemandante')}
            onBlur={onFieldBlur}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre del Demandado:
          </label>
          <input
            type="text"
            className={inputClass('nombreDemandado')}
            placeholder="Ej: María González"
            value={formData.nombreDemandado}
            onChange={onNombreDemandadoChange}
            onFocus={() => onFieldFocus('nombreDemandado')}
            onBlur={onFieldBlur}
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
            onChange={onNumeroRadicadoChange}
            onFocus={() => onFieldFocus('numeroRadicado')}
            onBlur={onFieldBlur}
          />
        </div>
      </div>

      {/* Debug info */}
      <div className="mt-6 p-3 bg-gray-100 rounded">
        <h3 className="font-medium mb-2">🔍 Estado del formulario:</h3>
        <pre className="text-xs">
          {JSON.stringify({ 
            mode,
            activeField, 
            nombreDemandante: formData.nombreDemandante?.slice(0, 10) + '...', 
            hasNavigate,
            hasToast,
            hasSolicitudes
          }, null, 2)}
        </pre>
      </div>

      {/* Botones de prueba de hooks */}
      {(hasNavigate || hasToast || hasSolicitudes) && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">🧪 Pruebas de Hooks:</h4>
          <div className="flex gap-2">
            {hasNavigate && (
              <button
                onClick={() => console.log('🧠 Navigate disponible')}
                className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
              >
                Test Navigate
              </button>
            )}
            {hasToast && onTestToast && (
              <button
                onClick={onTestToast}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-xs"
              >
                Test Toast
              </button>
            )}
            {hasSolicitudes && onTestSolicitudes && (
              <button
                onClick={onTestSolicitudes}
                className="px-3 py-1 bg-red-500 text-white rounded text-xs"
              >
                Test Solicitudes
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default HookTestForm