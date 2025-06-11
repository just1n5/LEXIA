import React, { useState, useCallback } from 'react'
import { cn } from '../../utils/cn'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { ArrowLeft, ArrowRight, AlertTriangle, MapPin, Building, ChevronDown } from 'lucide-react'

/**
 * 🎯 SimpleAdvancedQueryForm - ENFOQUE RADICAL: Sin validaciones en tiempo real
 * 
 * Nueva estrategia:
 * - ❌ ELIMINAMOS: Validaciones en tiempo real, debounce, timers
 * - ❌ ELIMINAMOS: Validaciones complejas, strength indicators
 * - ❌ ELIMINAMOS: Memoización excesiva, callbacks complejos
 * - ✅ SOLO: Validación básica al submit
 * - ✅ SOLO: Estado simple y directo
 * - ✅ SOLO: UX mínima pero efectiva
 */
const SimpleAdvancedQueryForm = ({ onBack, onComplete, className = '' }) => {
  // 🎯 ESTADO ULTRA-SIMPLE: Solo lo esencial
  const [formData, setFormData] = useState({
    departamento: '',
    ciudad: '',
    nombreDemandante: '',
    nombreDemandado: '',
    numeroRadicado: '',
    numeroRadicacion: '',
    // Valores automáticos para automatización (ya no configurables)
    ejecutarDiariamente: true,
    notificarCambios: true
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 🎯 DATOS ESTÁTICOS: Sin complicaciones
  const departamentos = {
    'Bogotá D.C.': ['Bogotá'],
    'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Apartadó', 'Turbo', 'Rionegro', 'Sabaneta'],
    'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Cartago', 'Buga', 'Tuluá', 'Jamundí'],
    'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanagrande', 'Puerto Colombia'],
    'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja'],
    'Cundinamarca': ['Soacha', 'Girardot', 'Zipaquirá', 'Facatativá', 'Chía', 'Mosquera', 'Fusagasugá'],
    'Bolívar': ['Cartagena', 'Magangué', 'Turbaco', 'Arjona', 'El Carmen de Bolívar'],
    'Norte de Santander': ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario'],
    'Tolima': ['Ibagué', 'Espinal', 'Melgar', 'Honda', 'Chaparral'],
    'Meta': ['Villavicencio', 'Acacías', 'Granada', 'San Martín', 'Puerto López'],
    'Caldas': ['Manizales', 'Villamaría', 'Chinchiná', 'Palestina', 'La Dorada'],
    'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia'],
    'Quindío': ['Armenia', 'Calarcá', 'La Tebaida', 'Montenegro', 'Quimbaya']
  }

  // 🎯 HANDLERS ULTRA-SIMPLES: Sin optimizaciones complejas
  const handleInputChange = (field) => (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleSelectChange = (field) => (e) => {
    const value = e.target.value
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      ...(field === 'departamento' && { ciudad: '' }) // Reset ciudad si cambia departamento
    }))
  }

  // 🎯 VALIDACIÓN ULTRA-SIMPLE: Solo al submit
  const validateForm = () => {
    const newErrors = {}

    // Validar ubicación (requerido)
    if (!formData.departamento) {
      newErrors.departamento = 'Selecciona un departamento'
    }
    if (!formData.ciudad) {
      newErrors.ciudad = 'Selecciona una ciudad'
    }

    // Validar al menos un criterio de búsqueda (requerido)
    const hasCriteria = formData.nombreDemandante || 
                       formData.nombreDemandado || 
                       formData.numeroRadicado || 
                       formData.numeroRadicacion

    if (!hasCriteria) {
      newErrors.criterios = 'Debes especificar al menos un criterio de búsqueda'
    }

    // Validaciones básicas de formato (solo si hay valor)
    if (formData.numeroRadicado && !/^\d{11,23}$/.test(formData.numeroRadicado)) {
      newErrors.numeroRadicado = 'Debe ser un número de 11 a 23 dígitos'
    }

    if (formData.nombreDemandante && formData.nombreDemandante.length < 2) {
      newErrors.nombreDemandante = 'Mínimo 2 caracteres'
    }

    if (formData.nombreDemandado && formData.nombreDemandado.length < 2) {
      newErrors.nombreDemandado = 'Mínimo 2 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🎯 SUBMIT SIMPLE: Sin complicaciones
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simular delay de envío
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onComplete?.({
        action: 'dashboard',
        data: formData
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const ciudadesDisponibles = departamentos[formData.departamento] || []

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <form onSubmit={handleSubmit}>
        <Card size="lg">
          <Card.Header>
            <Card.Title>Configurar Consulta Avanzada</Card.Title>
            <p className="text-body-paragraph text-text-secondary mt-xs">
              Versión ultra-simple - Solo validación al enviar
            </p>
          </Card.Header>

          <Card.Content>
            <div className="space-y-2xl">
              
              {/* SECCIÓN 1: UBICACIÓN */}
              <div>
                <h3 className="text-heading-h3 font-heading text-text-primary mb-md">
                  1. Ubicación del Proceso
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* Departamento */}
                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      Departamento *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <select
                        value={formData.departamento}
                        onChange={handleSelectChange('departamento')}
                        className={cn(
                          'w-full pl-10 pr-8 py-sm border rounded-md transition-colors appearance-none',
                          'border-border-default focus:border-interactive-default focus:outline-none',
                          'text-body-paragraph bg-bg-canvas text-text-base',
                          errors.departamento && 'border-feedback-error'
                        )}
                      >
                        <option value="">Selecciona un departamento</option>
                        {Object.keys(departamentos).map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                    </div>
                    {errors.departamento && (
                      <p className="text-body-auxiliary text-feedback-error mt-xs">
                        {errors.departamento}
                      </p>
                    )}
                  </div>

                  {/* Ciudad */}
                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      Ciudad *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <select
                        value={formData.ciudad}
                        onChange={handleSelectChange('ciudad')}
                        disabled={!formData.departamento}
                        className={cn(
                          'w-full pl-10 pr-8 py-sm border rounded-md transition-colors appearance-none',
                          'border-border-default focus:border-interactive-default focus:outline-none',
                          'text-body-paragraph bg-bg-canvas text-text-base',
                          !formData.departamento && 'opacity-50 cursor-not-allowed',
                          errors.ciudad && 'border-feedback-error'
                        )}
                      >
                        <option value="">
                          {formData.departamento ? 'Selecciona una ciudad' : 'Primero selecciona un departamento'}
                        </option>
                        {ciudadesDisponibles.map(ciudad => (
                          <option key={ciudad} value={ciudad}>{ciudad}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                    </div>
                    {errors.ciudad && (
                      <p className="text-body-auxiliary text-feedback-error mt-xs">
                        {errors.ciudad}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: CRITERIOS DE BÚSQUEDA */}
              <div>
                <h3 className="text-heading-h3 font-heading text-text-primary mb-md">
                  2. Criterios de Búsqueda
                </h3>
                <p className="text-body-auxiliary text-text-secondary mb-md">
                  Especifica al menos un criterio para identificar los procesos
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* Nombre Demandante */}
                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      Nombre del Demandante
                    </label>
                    <input
                      type="text"
                      value={formData.nombreDemandante}
                      onChange={handleInputChange('nombreDemandante')}
                      placeholder="Ej: Juan Carlos Pérez González"
                      className={cn(
                        'w-full px-sm py-sm border rounded-md transition-colors',
                        'border-border-default focus:border-interactive-default focus:outline-none',
                        'text-body-paragraph bg-bg-canvas text-text-base',
                        errors.nombreDemandante && 'border-feedback-error'
                      )}
                    />
                    {errors.nombreDemandante && (
                      <p className="text-body-auxiliary text-feedback-error mt-xs">
                        {errors.nombreDemandante}
                      </p>
                    )}
                  </div>

                  {/* Nombre Demandado */}
                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      Nombre del Demandado
                    </label>
                    <input
                      type="text"
                      value={formData.nombreDemandado}
                      onChange={handleInputChange('nombreDemandado')}
                      placeholder="Ej: María Elena González Herrera"
                      className={cn(
                        'w-full px-sm py-sm border rounded-md transition-colors',
                        'border-border-default focus:border-interactive-default focus:outline-none',
                        'text-body-paragraph bg-bg-canvas text-text-base',
                        errors.nombreDemandado && 'border-feedback-error'
                      )}
                    />
                    {errors.nombreDemandado && (
                      <p className="text-body-auxiliary text-feedback-error mt-xs">
                        {errors.nombreDemandado}
                      </p>
                    )}
                  </div>

                  {/* Número Radicado */}
                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      Número de Radicado
                    </label>
                    <input
                      type="text"
                      value={formData.numeroRadicado}
                      onChange={handleInputChange('numeroRadicado')}
                      placeholder="Ej: 11001310300120240001234"
                      className={cn(
                        'w-full px-sm py-sm border rounded-md transition-colors',
                        'border-border-default focus:border-interactive-default focus:outline-none',
                        'text-body-paragraph bg-bg-canvas text-text-base',
                        errors.numeroRadicado && 'border-feedback-error'
                      )}
                    />
                    {errors.numeroRadicado && (
                      <p className="text-body-auxiliary text-feedback-error mt-xs">
                        {errors.numeroRadicado}
                      </p>
                    )}
                  </div>

                  {/* Despacho */}
                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      Despacho
                    </label>
                    <input
                      type="text"
                      value={formData.numeroRadicacion}
                      onChange={handleInputChange('numeroRadicacion')}
                      placeholder="Ej: Juzgado 1 Civil Municipal"
                      className={cn(
                        'w-full px-sm py-sm border rounded-md transition-colors font-mono',
                        'border-border-default focus:border-interactive-default focus:outline-none',
                        'text-body-paragraph bg-bg-canvas text-text-base'
                      )}
                    />
                  </div>
                </div>

                {/* Error de criterios */}
                {errors.criterios && (
                  <div className="flex items-center gap-xs mt-md p-sm bg-feedback-error-light rounded border border-feedback-error">
                    <AlertTriangle className="w-4 h-4 text-feedback-error" />
                    <span className="text-body-auxiliary text-feedback-error">
                      {errors.criterios}
                    </span>
                  </div>
                )}
              </div>

              {/* SECCIÓN 3: AUTOMATIZACIÓN */}
              <div>
                <h3 className="text-heading-h3 font-heading text-text-primary mb-md">
                  3. Configuración de Automatización
                </h3>
                
                {/* Banner informativo */}
                <div className="bg-gradient-to-r from-feedback-info/10 to-interactive-default/10 border border-feedback-info/30 rounded-lg p-lg">
                  <div className="flex items-start gap-sm mb-md">
                    <div className="w-6 h-6 bg-interactive-default rounded-full flex items-center justify-center flex-shrink-0 mt-xs">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="text-body-paragraph font-semibold text-text-primary mb-xs">
                        Automatización Inteligente Activada
                      </h4>
                      <p className="text-body-auxiliary text-text-base mb-md">
                        Tu consulta avanzada se configurará automáticamente con las mejores prácticas para mantenerte siempre informado.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="flex items-start gap-sm">
                      <div className="w-5 h-5 bg-feedback-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">🕰</span>
                      </div>
                      <div>
                        <h5 className="text-body-paragraph font-medium text-text-primary mb-xs">
                          Ejecución Diaria Automática
                        </h5>
                        <p className="text-body-auxiliary text-text-secondary">
                          La consulta se ejecutará automáticamente todos los días a las <strong>7:00 PM</strong> para mantener la información actualizada.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-sm">
                      <div className="w-5 h-5 bg-feedback-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">📧</span>
                      </div>
                      <div>
                        <h5 className="text-body-paragraph font-medium text-text-primary mb-xs">
                          Notificaciones Inteligentes
                        </h5>
                        <p className="text-body-auxiliary text-text-secondary">
                          Recibirás un <strong>email de notificación</strong> cada vez que se detecten cambios en los procesos encontrados.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-md pt-md border-t border-feedback-info/20">
                    <p className="text-body-auxiliary text-text-secondary text-center">
                      💡 <strong>Tip:</strong> Podrás modificar estas configuraciones desde el dashboard después de crear la consulta.
                    </p>
                  </div>
                </div>
              </div>

              {/* BOTONES */}
              <div className="flex flex-col sm:flex-row gap-sm justify-between pt-lg border-t border-border-default">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onBack}
                  disabled={isSubmitting}
                  className="flex items-center gap-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  className="flex items-center gap-sm"
                >
                  {isSubmitting ? (
                    'Creando consulta...'
                  ) : (
                    <>
                      Crear Consulta
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>

            </div>
          </Card.Content>
        </Card>
      </form>
    </div>
  )
}

export default SimpleAdvancedQueryForm