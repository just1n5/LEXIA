// 🎯 components/demo/RadicadoValidationDemo.jsx
// Demo interactivo del sistema de validación de radicados

import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { RadicadoValidationInput, RadicadoHelpInfo } from '../forms/RadicadoValidationInput';
import { 
  Play, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  Copy,
  Download,
  Zap
} from 'lucide-react';

/**
 * 🎯 Demo interactivo del sistema de validación de radicados
 * 
 * Muestra:
 * - Validación en tiempo real
 * - Diferentes casos de prueba
 * - Información estructural
 * - Estados de validación
 * - Integración con formularios
 */
export const RadicadoValidationDemo = () => {
  const [validatedData, setValidatedData] = useState(null);
  const [selectedExample, setSelectedExample] = useState('');
  const [formData, setFormData] = useState({
    radicado: '',
    descripcion: '',
    prioridad: 'normal'
  });

  // 📋 Ejemplos de radicados para testing
  const testCases = [
    {
      name: 'Válido - Bogotá Civil',
      value: '11001310300120240001200',
      description: 'Proceso civil de Bogotá, 2024',
      expected: 'valid'
    },
    {
      name: 'Válido - Medellín Penal', 
      value: '05001610500120240005600',
      description: 'Proceso penal de Medellín, 2024',
      expected: 'valid'
    },
    {
      name: 'Incompleto',
      value: '1100131030012024',
      description: 'Faltan dígitos al final',
      expected: 'warning'
    },
    {
      name: 'Muy largo',
      value: '110013103001202400012001234',
      description: 'Dígitos adicionales',
      expected: 'error'
    },
    {
      name: 'Con caracteres inválidos',
      value: '11001-31030-01-2024-00012-00',
      description: 'Contiene guiones',
      expected: 'error'
    },
    {
      name: 'Año inválido',
      value: '11001310300119950001200',
      description: 'Año muy antiguo (1995)',
      expected: 'warning'
    }
  ];

  // 🎯 Handler para cuando se valida un radicado
  const handleValidRadicado = (data) => {
    setValidatedData(data);
  };

  // 🎯 Aplicar ejemplo seleccionado
  const applyExample = (example) => {
    setSelectedExample(example.value);
    setFormData(prev => ({ ...prev, radicado: example.value }));
  };

  // 🎯 Limpiar demo
  const clearDemo = () => {
    setSelectedExample('');
    setValidatedData(null);
    setFormData({ radicado: '', descripcion: '', prioridad: 'normal' });
  };

  // 📝 Simular envío de formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatedData) {
      alert(`✅ Formulario enviado con éxito!\n\nRadicado: ${validatedData.formattedValue}\nDescripción: ${formData.descripcion}\nPrioridad: ${formData.prioridad}`);
    } else {
      alert('❌ Por favor complete un número de radicado válido');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-lg space-y-xl">
      {/* 🎯 Header */}
      <div className="text-center space-y-sm">
        <h1 className="text-heading-h1 font-heading text-text-primary">
          Demo: Validación de Radicados
        </h1>
        <p className="text-body-paragraph font-sans text-text-secondary max-w-2xl mx-auto">
          Sistema avanzado de validación basado en la estructura oficial de la Rama Judicial de Colombia.
          Prueba diferentes casos y observa la validación en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* 📋 Panel de ejemplos */}
        <div className="lg:col-span-1">
          <Card className="p-md">
            <div className="space-y-sm">
              <h3 className="text-heading-h3 font-heading text-text-primary flex items-center gap-sm">
                <Play className="w-4 h-4 text-tech-accent" />
                Casos de Prueba
              </h3>
              
              <div className="space-y-xs">
                {testCases.map((testCase, index) => (
                  <button
                    key={index}
                    onClick={() => applyExample(testCase)}
                    className={`w-full text-left p-sm rounded-md border transition-all hover:shadow-sm ${
                      selectedExample === testCase.value
                        ? 'border-interactive-default bg-interactive-default/10'
                        : 'border-border-default hover:border-interactive-default/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-body-auxiliary font-sans font-medium text-text-primary">
                          {testCase.name}
                        </div>
                        <div className="text-body-auxiliary font-sans text-text-secondary text-xs mt-1">
                          {testCase.description}
                        </div>
                        <div className="text-body-auxiliary font-sans font-mono text-tech-accent text-xs mt-1">
                          {testCase.value}
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full mt-1 ${
                        testCase.expected === 'valid' ? 'bg-feedback-success' :
                        testCase.expected === 'warning' ? 'bg-feedback-warning' :
                        'bg-feedback-error'
                      }`} />
                    </div>
                  </button>
                ))}
              </div>
              
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={clearDemo}
                className="w-full"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Limpiar Demo
              </Button>
            </div>
          </Card>
        </div>

        {/* 📝 Panel principal de validación */}
        <div className="lg:col-span-2">
          <Card className="p-lg">
            <form onSubmit={handleSubmit} className="space-y-lg">
              <div className="space-y-sm">
                <h3 className="text-heading-h3 font-heading text-text-primary">
                  Formulario de Consulta Judicial
                </h3>
                <p className="text-body-auxiliary font-sans text-text-secondary">
                  Ingresa un número de radicado y observa la validación en tiempo real
                </p>
              </div>

              {/* 🎯 Input de validación principal */}
              <RadicadoValidationInput
                label="Número de Radicación"
                required
                defaultValue={selectedExample}
                onValidRadicado={handleValidRadicado}
                showStructureInfo={true}
                showQuickActions={true}
                key={selectedExample} // Force re-render when example changes
              />

              {/* 📝 Campos adicionales del formulario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="text-body-paragraph font-sans font-medium text-text-primary">
                    Descripción de la Consulta
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                    className="w-full px-sm py-sm text-body-paragraph font-sans border border-border-default rounded-md
                             focus:outline-none focus:ring-2 focus:ring-interactive-default/20 focus:border-interactive-default
                             placeholder:text-text-secondary resize-none"
                    rows={3}
                    placeholder="Ej: Consulta de estado del proceso civil por alimentos..."
                  />
                </div>
                
                <div className="space-y-xs">
                  <label className="text-body-paragraph font-sans font-medium text-text-primary">
                    Prioridad
                  </label>
                  <select
                    value={formData.prioridad}
                    onChange={(e) => setFormData(prev => ({ ...prev, prioridad: e.target.value }))}
                    className="w-full px-sm py-sm text-body-paragraph font-sans border border-border-default rounded-md
                             focus:outline-none focus:ring-2 focus:ring-interactive-default/20 focus:border-interactive-default"
                  >
                    <option value="baja">Baja</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              {/* 🎯 Información del radicado validado */}
              {validatedData && (
                <Card className="p-md bg-feedback-success-light/30 border border-feedback-success">
                  <div className="space-y-sm">
                    <div className="flex items-center gap-sm">
                      <CheckCircle className="w-4 h-4 text-feedback-success" />
                      <h4 className="text-heading-h4 font-heading text-feedback-success">
                        Radicado Validado Correctamente
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-sm text-body-auxiliary font-sans">
                      <div>
                        <strong>Número original:</strong><br />
                        <code className="bg-bg-canvas px-xs py-1 rounded text-tech-accent">
                          {validatedData.cleanValue}
                        </code>
                      </div>
                      <div>
                        <strong>Formato estructurado:</strong><br />
                        <code className="bg-bg-canvas px-xs py-1 rounded text-tech-accent">
                          {validatedData.formattedValue}
                        </code>
                      </div>
                    </div>
                    
                    {validatedData.patternInfo && (
                      <div className="text-body-auxiliary font-sans text-text-secondary">
                        <strong>Patrón detectado:</strong> {validatedData.patternInfo.description}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* 🎯 Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-sm">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!validatedData}
                  className="flex-1"
                >
                  <Zap className="w-4 h-4 mr-sm" />
                  Crear Consulta Judicial
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (validatedData) {
                      const data = JSON.stringify({
                        radicado: validatedData.cleanValue,
                        formateado: validatedData.formattedValue,
                        descripcion: formData.descripcion,
                        prioridad: formData.prioridad,
                        timestamp: new Date().toISOString()
                      }, null, 2);
                      
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `consulta_${validatedData.cleanValue}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  }}
                  disabled={!validatedData}
                >
                  <Download className="w-4 h-4 mr-sm" />
                  Exportar JSON
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* 📚 Información de ayuda */}
      <RadicadoHelpInfo />

      {/* 📊 Estadísticas del demo */}
      <Card className="p-md bg-tech-accent/5 border border-tech-accent/20">
        <div className="flex items-center justify-between">
          <div className="space-y-xs">
            <h4 className="text-heading-h4 font-heading text-text-primary">
              📊 Información Técnica
            </h4>
            <div className="text-body-auxiliary font-sans text-text-secondary">
              <p>• Validación basada en <strong>Acuerdo No. 201 de 1997</strong> de la Rama Judicial</p>
              <p>• Estructura de <strong>23 dígitos exactos</strong> con verificación por segmentos</p>
              <p>• Validación en tiempo real con <strong>debounce de 500ms</strong></p>
              <p>• Soporte para formato visual y acciones rápidas</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RadicadoValidationDemo;