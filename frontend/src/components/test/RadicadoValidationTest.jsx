// 🧪 components/test/RadicadoValidationTest.jsx
// Componente de prueba simple para verificar la validación de radicados

import React, { useState } from 'react';
import { useAdvancedRadicadoValidation } from '../../hooks/useAdvancedRadicadoValidation';
import { CheckCircle, AlertCircle, AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Componente de prueba simple para la validación de radicados
 * Sirve para verificar que el hook funcione correctamente
 */
export const RadicadoValidationTest = () => {
  const [testValue, setTestValue] = useState('');
  
  const {
    value,
    setValue,
    validationState,
    message,
    suggestions,
    isValidating,
    isValid,
    hasError,
    hasWarning,
    isComplete,
    cleanValue,
    formattedValue,
    progress
  } = useAdvancedRadicadoValidation(testValue);

  // Casos de prueba predefinidos
  const testCases = [
    { name: 'Válido - Bogotá', value: '11001310300120240001200' },
    { name: 'Válido - Medellín', value: '05001610500120240005600' },
    { name: 'Incompleto', value: '1100131030012024' },
    { name: 'Muy largo', value: '110013103001202400012001234' },
    { name: 'Con guiones', value: '11001-31030-01-2024' },
    { name: 'Año inválido', value: '11001310300119950001200' }
  ];

  const getStatusIcon = () => {
    if (isValidating) {
      return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    
    switch (validationState) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getInputStyles = () => {
    switch (validationState) {
      case 'valid':
        return 'border-green-500 bg-green-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          🧪 Test de Validación de Radicados
        </h1>
        <p className="text-gray-600">
          Componente de prueba para verificar el sistema de validación
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel de entrada */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Número de Radicación
            </label>
            <div className="relative">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ingresa un número de radicación"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${getInputStyles()}`}
                maxLength={23}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getStatusIcon()}
              </div>
            </div>
            
            {/* Barra de progreso */}
            {!isValidating && value && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isComplete ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Mensaje de validación */}
          {message && (
            <div className={`p-3 rounded-md flex items-start gap-2 ${
              validationState === 'valid' ? 'bg-green-50 text-green-800' :
              validationState === 'warning' ? 'bg-yellow-50 text-yellow-800' :
              validationState === 'error' ? 'bg-red-50 text-red-800' :
              'bg-gray-50 text-gray-800'
            }`}>
              {getStatusIcon()}
              <span className="text-sm">{message}</span>
            </div>
          )}

          {/* Sugerencias */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Sugerencias:</h4>
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-700">{suggestion.text}</span>
                  {suggestion.action && (
                    <button
                      onClick={suggestion.action}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Aplicar
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel de información */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Estado de Validación
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className={`font-medium ${
                  validationState === 'valid' ? 'text-green-600' :
                  validationState === 'warning' ? 'text-yellow-600' :
                  validationState === 'error' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {validationState}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Validando:</span>
                <span>{isValidating ? 'Sí' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>Válido:</span>
                <span>{isValid ? 'Sí' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>Completo:</span>
                <span>{isComplete ? 'Sí' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>Progreso:</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          {/* Información del valor */}
          {value && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Información del Valor
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Original:</span>
                  <div className="mt-1 p-2 bg-gray-50 rounded font-mono text-xs">
                    {value}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Limpio:</span>
                  <div className="mt-1 p-2 bg-gray-50 rounded font-mono text-xs">
                    {cleanValue}
                  </div>
                </div>
                {isComplete && (
                  <div>
                    <span className="font-medium">Formateado:</span>
                    <div className="mt-1 p-2 bg-gray-50 rounded font-mono text-xs">
                      {formattedValue}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Casos de prueba */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Casos de Prueba
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {testCases.map((testCase, index) => (
            <button
              key={index}
              onClick={() => setValue(testCase.value)}
              className="p-3 text-left border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-sm text-gray-900">
                {testCase.name}
              </div>
              <div className="text-xs text-gray-500 font-mono mt-1">
                {testCase.value}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadicadoValidationTest;