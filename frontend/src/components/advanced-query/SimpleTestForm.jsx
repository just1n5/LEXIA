// src/components/advanced-query/SimpleTestForm.jsx
import React, { useState } from 'react'

/**
 * Formulario de prueba ultra-simplificado para diagnosticar
 * el problema de pérdida de foco
 */
const SimpleTestForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    numero: ''
  })

  const handleNombreChange = (e) => {
    console.log('onChange triggered:', e.target.value)
    setFormData(prev => ({
      ...prev,
      nombre: e.target.value
    }))
  }

  const handleNumeroChange = (e) => {
    console.log('onChange triggered:', e.target.value)
    setFormData(prev => ({
      ...prev,
      numero: e.target.value
    }))
  }

  console.log('Component render:', formData)

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Test Form - Diagnóstico</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre de prueba:
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Escribe aquí..."
            value={formData.nombre}
            onChange={handleNombreChange}
          />
          <p className="text-xs text-gray-500 mt-1">
            Valor actual: "{formData.nombre}"
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Número de prueba:
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="12345..."
            value={formData.numero}
            onChange={handleNumeroChange}
          />
          <p className="text-xs text-gray-500 mt-1">
            Valor actual: "{formData.numero}"
          </p>
        </div>
      </div>

      <div className="mt-6 p-3 bg-gray-100 rounded">
        <h3 className="font-medium mb-2">Estado del formulario:</h3>
        <pre className="text-xs">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default SimpleTestForm