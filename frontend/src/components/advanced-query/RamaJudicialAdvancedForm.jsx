// src/components/advanced-query/RamaJudicialAdvancedForm.jsx

import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, ArrowRight, Building, MapPin, Scale, Gavel, 
  User, FileText, AlertTriangle, Info, CheckCircle, Clock, Zap
} from 'lucide-react'
import { cn } from '../../utils/cn'
import Card from '../ui/Card'
import Button from '../ui/Button'

// Importar datos de la Rama Judicial
import {
  departamentos,
  ciudadesPorDepartamento,
  getEntidadesByCiudad,
  getEspecialidadesByEntidad,
  getDespachosByEspecialidad,
  tiposPersona,
  opcionesSujetoProcesal,
  validateHierarchy,
  getSelectionPath
} from '../../data/ramaJudicialData'

/**
 * 🏛️ RamaJudicialAdvancedForm - Formulario de consulta avanzada oficial
 * 
 * Replica exactamente los criterios de búsqueda de la página oficial de la
 * Rama Judicial de Colombia para garantizar compatibilidad total con el bot RPA.
 * 
 * Criterios exactos de la página oficial:
 * - Sujeto Procesal (radio buttons)
 * - Tipo de Persona (obligatorio)
 * - Nombre(s) Apellido o Razón Social (obligatorio)
 * - Departamento → Ciudad → Entidad → Especialidad → Despacho (cascada)
 */
const RamaJudicialAdvancedForm = ({ 
  onBack,
  onComplete,
  className = '',
  ...props 
}) => {
  // Estados del formulario según la página oficial
  const [formData, setFormData] = useState({
    // Campos obligatorios según la página oficial
    sujetoProcesal: 'recientes', // Default a recientes (más rápido)
    tipoPersona: '',
    nombreRazonSocial: '',
    
    // Jerarquía de ubicación judicial (todos opcionales)
    departamento: '',
    ciudad: '',
    entidad: '',
    especialidad: '',
    despacho: ''
  })

  const [errors, setErrors] = useState({})
  const [showErrors, setShowErrors] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Datos derivados para los dropdowns en cascada
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState([])
  const [entidadesDisponibles, setEntidadesDisponibles] = useState([])
  const [especialidadesDisponibles, setEspecialidadesDisponibles] = useState([])
  const [despachosDisponibles, setDespachosDisponibles] = useState([])

  // Actualizar ciudades cuando cambia el departamento
  useEffect(() => {
    if (formData.departamento) {
      const ciudades = ciudadesPorDepartamento[formData.departamento] || []
      setCiudadesDisponibles(ciudades)
      
      // Resetear selecciones dependientes si la ciudad actual no existe
      if (formData.ciudad && !ciudades.find(c => c.nombre === formData.ciudad)) {
        setFormData(prev => ({
          ...prev,
          ciudad: '',
          entidad: '',
          especialidad: '',
          despacho: ''
        }))
      }
    } else {
      setCiudadesDisponibles([])
      setFormData(prev => ({
        ...prev,
        ciudad: '',
        entidad: '',
        especialidad: '',
        despacho: ''
      }))
    }
  }, [formData.departamento])

  // Actualizar entidades cuando cambia la ciudad
  useEffect(() => {
    if (formData.ciudad) {
      const entidades = getEntidadesByCiudad(formData.ciudad)
      setEntidadesDisponibles(entidades)
      
      // Resetear selecciones dependientes si la entidad actual no existe
      if (formData.entidad && !entidades.find(e => e.id === formData.entidad)) {
        setFormData(prev => ({
          ...prev,
          entidad: '',
          especialidad: '',
          despacho: ''
        }))
      }
    } else {
      setEntidadesDisponibles([])
      setFormData(prev => ({
        ...prev,
        entidad: '',
        especialidad: '',
        despacho: ''
      }))
    }
  }, [formData.ciudad])

  // Actualizar especialidades cuando cambia la entidad
  useEffect(() => {
    if (formData.entidad) {
      const especialidades = getEspecialidadesByEntidad(formData.entidad)
      setEspecialidadesDisponibles(especialidades)
      
      // Resetear selecciones dependientes si la especialidad actual no existe
      if (formData.especialidad && !especialidades.find(e => e.id === formData.especialidad)) {
        setFormData(prev => ({
          ...prev,
          especialidad: '',
          despacho: ''
        }))
      }
    } else {
      setEspecialidadesDisponibles([])
      setFormData(prev => ({
        ...prev,
        especialidad: '',
        despacho: ''
      }))
    }
  }, [formData.entidad])

  // Actualizar despachos cuando cambia la especialidad
  useEffect(() => {
    if (formData.especialidad) {
      const despachos = getDespachosByEspecialidad(formData.especialidad)
      setDespachosDisponibles(despachos)
      
      // Resetear selección dependiente si el despacho actual no existe
      if (formData.despacho && !despachos.find(d => d.id === formData.despacho)) {
        setFormData(prev => ({
          ...prev,
          despacho: ''
        }))
      }
    } else {
      setDespachosDisponibles([])
      setFormData(prev => ({
        ...prev,
        despacho: ''
      }))
    }
  }, [formData.especialidad])

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    // Campos obligatorios según la página oficial
    if (!formData.tipoPersona) {
      newErrors.tipoPersona = 'Tipo de persona es obligatorio'
    }

    if (!formData.nombreRazonSocial || formData.nombreRazonSocial.trim() === '') {
      newErrors.nombreRazonSocial = 'Nombre o razón social es obligatorio'
    } else if (formData.nombreRazonSocial.trim().length < 2) {
      newErrors.nombreRazonSocial = 'El nombre debe tener al menos 2 caracteres'
    } else if (formData.nombreRazonSocial.trim().length > 100) {
      newErrors.nombreRazonSocial = 'El nombre no puede exceder 100 caracteres'
    }

    // Validar jerarquía si se han hecho selecciones
    const hierarchyValidation = validateHierarchy(formData)
    if (!hierarchyValidation.isValid) {
      hierarchyValidation.errors.forEach(error => {
        newErrors.hierarchy = error
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handlers de cambio para cada campo
  const handleSujetoProcesalChange = (value) => {
    setFormData(prev => ({ ...prev, sujetoProcesal: value }))
  }

  const handleTipoPersonaChange = (e) => {
    setFormData(prev => ({ ...prev, tipoPersona: e.target.value }))
    if (errors.tipoPersona) {
      setErrors(prev => ({ ...prev, tipoPersona: null }))
    }
  }

  const handleNombreRazonSocialChange = (e) => {
    setFormData(prev => ({ ...prev, nombreRazonSocial: e.target.value }))
    if (errors.nombreRazonSocial) {
      setErrors(prev => ({ ...prev, nombreRazonSocial: null }))
    }
  }

  const handleDepartamentoChange = (e) => {
    setFormData(prev => ({ ...prev, departamento: e.target.value }))
  }

  const handleCiudadChange = (e) => {
    setFormData(prev => ({ ...prev, ciudad: e.target.value }))
  }

  const handleEntidadChange = (e) => {
    setFormData(prev => ({ ...prev, entidad: e.target.value }))
  }

  const handleEspecialidadChange = (e) => {
    setFormData(prev => ({ ...prev, especialidad: e.target.value }))
  }

  const handleDespachoChange = (e) => {
    setFormData(prev => ({ ...prev, despacho: e.target.value }))
  }

  // Enviar formulario
  const handleSubmit = () => {
    setShowErrors(true)
    
    if (!validateForm()) {
      // Scroll al primer error
      const firstErrorField = document.querySelector('.border-feedback-error')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setIsSubmitting(true)
    
    // Simular envío (aquí se conectaría con el backend real)
    setTimeout(() => {
      onComplete?.({
        type: 'rama_judicial_avanzada',
        data: formData,
        selectionPath: getSelectionPath(formData)
      })
    }, 1500)
  }

  const isFormValid = formData.tipoPersona && formData.nombreRazonSocial.trim().length >= 2

  return (
    <div className={cn('max-w-4xl mx-auto', className)} {...props}>
      {/* Header */}
      <div className="mb-xl">
        <div className="flex items-center justify-between mb-md">
          <div>
            <h1 className="text-heading-h1 font-heading text-text-primary">
              Consulta por Nombre o Razón Social
            </h1>
            <p className="text-body-paragraph text-text-secondary">
              Búsqueda exacta según los criterios oficiales de la Rama Judicial de Colombia
            </p>
          </div>
          
          {/* Indicador de compatibilidad */}
          <div className="hidden md:flex items-center gap-sm px-sm py-xs bg-feedback-success-light border border-feedback-success rounded-md">
            <CheckCircle className="w-4 h-4 text-feedback-success" />
            <span className="text-body-auxiliary font-medium text-feedback-success">
              100% Compatible
            </span>
          </div>
        </div>

        {/* Banner informativo */}
        <div className="p-md bg-feedback-info-light border border-feedback-info rounded-md">
          <div className="flex items-start gap-sm">
            <Info className="w-5 h-5 text-feedback-info mt-xs" />
            <div>
              <h3 className="text-body-paragraph font-medium text-feedback-info mb-xs">
                Formulario Oficial de la Rama Judicial
              </h3>
              <p className="text-body-auxiliary text-feedback-info">
                Este formulario replica exactamente los criterios de búsqueda de la página oficial de consulta de procesos, 
                garantizando total compatibilidad con el sistema automatizado.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card size="lg">
        <Card.Content>
          <div className="space-y-2xl">
            {/* Sección 1: Sujeto Procesal */}
            <div className="space-y-md">
              <div className="flex items-center gap-sm">
                <Clock className="w-5 h-5 text-interactive-default" />
                <h2 className="text-heading-h3 font-heading text-text-primary">
                  Sujeto Procesal
                </h2>
              </div>
              
              <div className="space-y-sm">
                {opcionesSujetoProcesal.map(opcion => (
                  <label 
                    key={opcion.id}
                    className="flex items-start gap-sm p-sm border border-border-default rounded-md hover:border-interactive-default cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="sujetoProcesal"
                      value={opcion.id}
                      checked={formData.sujetoProcesal === opcion.id}
                      onChange={(e) => handleSujetoProcesalChange(e.target.value)}
                      className="mt-xs"
                    />
                    <div>
                      <span className="text-body-paragraph font-medium text-text-base">
                        {opcion.nombre}
                      </span>
                      <p className="text-body-auxiliary text-text-secondary">
                        {opcion.descripcion}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Sección 2: Datos Obligatorios */}
            <div className="space-y-md">
              <div className="flex items-center gap-sm">
                <User className="w-5 h-5 text-interactive-default" />
                <h2 className="text-heading-h3 font-heading text-text-primary">
                  Datos Obligatorios
                </h2>
                <span className="px-xs py-xs bg-feedback-error text-white text-body-auxiliary font-medium rounded">
                  Requerido
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {/* Tipo de Persona */}
                <div>
                  <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                    * Tipo de Persona
                  </label>
                  <select
                    value={formData.tipoPersona}
                    onChange={handleTipoPersonaChange}
                    className={cn(
                      'w-full px-sm py-sm border rounded-md transition-colors appearance-none',
                      'text-body-paragraph bg-bg-canvas text-text-base',
                      errors.tipoPersona 
                        ? 'border-feedback-error focus:border-feedback-error' 
                        : 'border-border-default focus:border-interactive-default',
                      'focus:outline-none'
                    )}
                  >
                    <option value="">Seleccione el tipo de persona</option>
                    {tiposPersona.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                  {showErrors && errors.tipoPersona && (
                    <p className="text-body-auxiliary text-feedback-error mt-xs">
                      {errors.tipoPersona}
                    </p>
                  )}
                </div>

                {/* Nombre/Razón Social */}
                <div>
                  <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                    * Nombre(s) Apellido o Razón Social
                  </label>
                  <input
                    type="text"
                    value={formData.nombreRazonSocial}
                    onChange={handleNombreRazonSocialChange}
                    placeholder="Ingrese el nombre completo o razón social"
                    className={cn(
                      'w-full px-sm py-sm border rounded-md transition-colors',
                      'text-body-paragraph bg-bg-canvas text-text-base',
                      errors.nombreRazonSocial 
                        ? 'border-feedback-error focus:border-feedback-error' 
                        : 'border-border-default focus:border-interactive-default',
                      'focus:outline-none'
                    )}
                  />
                  {showErrors && errors.nombreRazonSocial && (
                    <p className="text-body-auxiliary text-feedback-error mt-xs">
                      {errors.nombreRazonSocial}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sección 3: Filtros de Jurisdicción (Opcional) */}
            <div className="space-y-md">
              <div className="flex items-center gap-sm">
                <Scale className="w-5 h-5 text-interactive-default" />
                <h2 className="text-heading-h3 font-heading text-text-primary">
                  Filtros de Jurisdicción
                </h2>
                <span className="px-xs py-xs bg-text-secondary text-white text-body-auxiliary font-medium rounded">
                  Opcional
                </span>
              </div>

              <div className="p-md bg-bg-light rounded-md border border-border-default">
                <p className="text-body-auxiliary text-text-secondary mb-md">
                  Puede especificar uno o más filtros para delimitar la búsqueda a una jurisdicción específica. 
                  Los filtros trabajan en cascada: Departamento → Ciudad → Entidad → Especialidad → Despacho.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                  {/* Departamento */}
                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      Departamento
                    </label>
                    <div className="relative">
                      <Building className="absolute left-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <select
                        value={formData.departamento}
                        onChange={handleDepartamentoChange}
                        className="w-full pl-10 pr-sm py-sm border border-border-default rounded-md focus:border-interactive-default focus:outline-none text-body-paragraph bg-bg-canvas text-text-base appearance-none"
                      >
                        <option value="">Todos los departamentos</option>
                        {departamentos.map(dept => (
                          <option key={dept.id} value={dept.nombre}>
                            {dept.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Ciudad */}
                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      Ciudad
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <select
                        value={formData.ciudad}
                        onChange={handleCiudadChange}
                        disabled={!formData.departamento}
                        className={cn(
                          'w-full pl-10 pr-sm py-sm border border-border-default rounded-md focus:border-interactive-default focus:outline-none text-body-paragraph bg-bg-canvas text-text-base appearance-none',
                          !formData.departamento && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <option value="">
                          {formData.departamento ? 'Todas las ciudades' : 'Seleccione departamento primero'}
                        </option>
                        {ciudadesDisponibles.map(ciudad => (
                          <option key={ciudad.id} value={ciudad.nombre}>
                            {ciudad.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Entidad */}
                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      Entidad
                    </label>
                    <div className="relative">
                      <Building className="absolute left-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <select
                        value={formData.entidad}
                        onChange={handleEntidadChange}
                        disabled={!formData.ciudad}
                        className={cn(
                          'w-full pl-10 pr-sm py-sm border border-border-default rounded-md focus:border-interactive-default focus:outline-none text-body-paragraph bg-bg-canvas text-text-base appearance-none',
                          !formData.ciudad && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <option value="">
                          {formData.ciudad ? 'Todas las entidades' : 'Seleccione ciudad primero'}
                        </option>
                        {entidadesDisponibles.map(entidad => (
                          <option key={entidad.id} value={entidad.id}>
                            {entidad.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Especialidad */}
                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      Especialidad
                    </label>
                    <div className="relative">
                      <Scale className="absolute left-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <select
                        value={formData.especialidad}
                        onChange={handleEspecialidadChange}
                        disabled={!formData.entidad}
                        className={cn(
                          'w-full pl-10 pr-sm py-sm border border-border-default rounded-md focus:border-interactive-default focus:outline-none text-body-paragraph bg-bg-canvas text-text-base appearance-none',
                          !formData.entidad && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <option value="">
                          {formData.entidad ? 'Todas las especialidades' : 'Seleccione entidad primero'}
                        </option>
                        {especialidadesDisponibles.map(especialidad => (
                          <option key={especialidad.id} value={especialidad.id}>
                            {especialidad.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Despacho */}
                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      Despacho
                    </label>
                    <div className="relative">
                      <Gavel className="absolute left-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <select
                        value={formData.despacho}
                        onChange={handleDespachoChange}
                        disabled={!formData.especialidad}
                        className={cn(
                          'w-full pl-10 pr-sm py-sm border border-border-default rounded-md focus:border-interactive-default focus:outline-none text-body-paragraph bg-bg-canvas text-text-base appearance-none',
                          !formData.especialidad && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <option value="">
                          {formData.especialidad ? 'Todos los despachos' : 'Seleccione especialidad primero'}
                        </option>
                        {despachosDisponibles.map(despacho => (
                          <option key={despacho.id} value={despacho.id}>
                            {despacho.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Mostrar path de selección */}
                {getSelectionPath(formData) && (
                  <div className="mt-md p-sm bg-interactive-default bg-opacity-10 border border-interactive-default rounded-md">
                    <p className="text-body-auxiliary text-interactive-default font-medium">
                      📍 Filtro aplicado: {getSelectionPath(formData)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Errores de jerarquía */}
            {showErrors && errors.hierarchy && (
              <div className="flex items-center gap-xs p-sm bg-feedback-error-light border border-feedback-error rounded-md">
                <AlertTriangle className="w-4 h-4 text-feedback-error" />
                <span className="text-body-auxiliary text-feedback-error">
                  {errors.hierarchy}
                </span>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-sm justify-between pt-lg border-t border-border-default">
              <Button
                variant="secondary"
                onClick={onBack}
                disabled={isSubmitting}
                className="flex items-center gap-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                loading={isSubmitting}
                className="flex items-center gap-sm"
              >
                {isSubmitting ? (
                  <>
                    Creando consulta...
                    <Zap className="w-4 h-4" />
                  </>
                ) : isFormValid ? (
                  <>
                    Crear Consulta Avanzada
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Completar campos obligatorios
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
}

RamaJudicialAdvancedForm.displayName = 'RamaJudicialAdvancedForm'

export default RamaJudicialAdvancedForm