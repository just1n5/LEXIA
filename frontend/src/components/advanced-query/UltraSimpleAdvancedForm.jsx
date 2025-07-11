import React, { useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import EnhancedCreateButton from '../enhanced/EnhancedCreateButton' // 🆕 Botón mejorado
import EnhancedBackButton from '../enhanced/EnhancedBackButton' // 🆕 Botón volver mejorado
import { 
  ArrowLeft, ArrowRight, AlertTriangle, MapPin, Building, ChevronDown,
  Scale, Gavel, User, FileText, Clock, Info, Check, Mail, Lightbulb 
} from 'lucide-react'

// Importar datos oficiales de la Rama Judicial
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
 * 🏛️ SimpleAdvancedQueryForm - FORMULARIO AVANZADO RAMA JUDICIAL
 * 
 * Formulario para búsqueda avanzada utilizando los criterios
 * de la Rama Judicial de Colombia.
 * 
 * Criterios implementados:
 * - Sujeto Procesal (Recientes vs Todos)
 * - Tipo de Persona (obligatorio)
 * - Nombre/Razón Social (obligatorio) 
 * - Filtros de jurisdicción en cascada (opcionales)
 */
const SimpleAdvancedQueryForm = ({ onBack, onComplete, className = '' }) => {
  // 📍 Configuración del formulario avanzado
  const location = useLocation()
  const formTitle = location.state?.title || 'Consulta Avanzada'
  const formSubtitle = location.state?.subtitle || 'Búsqueda por nombre o razón social con filtros de jurisdicción'
  
  // 🏛️ ESTADO AVANZADO RAMA JUDICIAL
  const initialFormData = {
    // Identificación del caso
    nombreDescriptivo: '',
    
    // Criterios obligatorios oficiales
    sujetoProcesal: 'recientes', // Default: búsqueda rápida
    tipoPersona: '',
    nombreRazonSocial: '',
    
    // Filtros de jurisdicción opcionales (en cascada)
    departamento: '',
    ciudad: '',
    entidad: '',
    especialidad: '',
    despacho: '',
    
    // Automatización (configuración fija)
    ejecutarDiariamente: true,
    notificarCambios: true
  }
  
  const [formData, setFormData] = useState(initialFormData)
  const [originalFormData] = useState(initialFormData) // Para detectar cambios
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para los dropdowns en cascada
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState([])
  const [entidadesDisponibles, setEntidadesDisponibles] = useState([])
  const [especialidadesDisponibles, setEspecialidadesDisponibles] = useState([])
  const [despachosDisponibles, setDespachosDisponibles] = useState([])

  // Actualizar ciudades cuando cambia el departamento
  useEffect(() => {
    if (formData.departamento) {
      const departamentoObj = departamentos.find(d => d.nombre === formData.departamento)
      if (departamentoObj) {
        const ciudades = ciudadesPorDepartamento[departamentoObj.id] || []
        setCiudadesDisponibles(ciudades)
        
        // Reset dependientes si la ciudad actual no existe
        if (formData.ciudad && !ciudades.find(c => c.nombre === formData.ciudad)) {
          setFormData(prev => ({
            ...prev,
            ciudad: '', entidad: '', especialidad: '', despacho: ''
          }))
        }
      }
    } else {
      setCiudadesDisponibles([])
      setFormData(prev => ({
        ...prev,
        ciudad: '', entidad: '', especialidad: '', despacho: ''
      }))
    }
  }, [formData.departamento])

  // Actualizar entidades cuando cambia la ciudad
  useEffect(() => {
    if (formData.ciudad) {
      const entidades = getEntidadesByCiudad(formData.ciudad)
      setEntidadesDisponibles(entidades)
      
      if (formData.entidad && !entidades.find(e => e.id === formData.entidad)) {
        setFormData(prev => ({ ...prev, entidad: '', especialidad: '', despacho: '' }))
      }
    } else {
      setEntidadesDisponibles([])
      setFormData(prev => ({ ...prev, entidad: '', especialidad: '', despacho: '' }))
    }
  }, [formData.ciudad])

  // Actualizar especialidades cuando cambia la entidad
  useEffect(() => {
    if (formData.entidad) {
      const especialidades = getEspecialidadesByEntidad(formData.entidad)
      setEspecialidadesDisponibles(especialidades)
      
      if (formData.especialidad && !especialidades.find(e => e.id === formData.especialidad)) {
        setFormData(prev => ({ ...prev, especialidad: '', despacho: '' }))
      }
    } else {
      setEspecialidadesDisponibles([])
      setFormData(prev => ({ ...prev, especialidad: '', despacho: '' }))
    }
  }, [formData.entidad])

  // Actualizar despachos cuando cambia la especialidad
  useEffect(() => {
    if (formData.especialidad) {
      const despachos = getDespachosByEspecialidad(formData.especialidad)
      setDespachosDisponibles(despachos)
      
      if (formData.despacho && !despachos.find(d => d.id === formData.despacho)) {
        setFormData(prev => ({ ...prev, despacho: '' }))
      }
    } else {
      setDespachosDisponibles([])
      setFormData(prev => ({ ...prev, despacho: '' }))
    }
  }, [formData.especialidad])

  // 🏛️ HANDLERS AVANZADOS
  const handleInputChange = (field) => (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleSelectChange = (field) => (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRadioChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 🏛️ VALIDACIÓN AVANZADA: Criterios de la Rama Judicial
  const validateForm = () => {
    const newErrors = {}

    // Nombre descriptivo (obligatorio para identificación)
    if (!formData.nombreDescriptivo || formData.nombreDescriptivo.trim() === '') {
      newErrors.nombreDescriptivo = 'Nombre descriptivo es obligatorio'
    } else if (formData.nombreDescriptivo.trim().length < 3) {
      newErrors.nombreDescriptivo = 'El nombre descriptivo debe tener al menos 3 caracteres'
    } else if (formData.nombreDescriptivo.trim().length > 100) {
      newErrors.nombreDescriptivo = 'El nombre descriptivo no puede exceder 100 caracteres'
    }

    // Campos obligatorios avanzados
    if (!formData.tipoPersona) {
      newErrors.tipoPersona = 'Tipo de persona es obligatorio'
    }

    if (!formData.nombreRazonSocial || formData.nombreRazonSocial.trim() === '') {
      newErrors.nombreRazonSocial = 'Nombre o razón social es obligatorio'
    } else if (formData.nombreRazonSocial.trim().length < 2) {
      newErrors.nombreRazonSocial = 'El nombre debe tener al menos 2 caracteres'
    }

    // Validar jerarquía si se han hecho selecciones
    const hierarchyValidation = validateHierarchy(formData)
    if (!hierarchyValidation.isValid) {
      newErrors.hierarchy = hierarchyValidation.errors[0]
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🔄 FUNCIONES AUXILIARES PARA ENHANCED BACK BUTTON
  
  // Detectar si hay cambios no guardados
  const hasUnsavedChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalFormData)
  }
  
  // Función para guardar y salir
  const handleSaveAndExit = async () => {
    if (validateForm()) {
      await handleSubmit(new Event('submit'))
      // Si llega aquí, el submit fue exitoso y ya se ejecutó onComplete
    } else {
      // Si hay errores de validación, lanzar error para mantener modal abierto
      throw new Error('Formulario inválido. Por favor, corrija los errores antes de guardar.')
    }
  }
  
  // Función para descartar cambios y volver
  const handleDiscardChanges = () => {
    // Resetear formulario a estado original
    setFormData(originalFormData)
    setErrors({})
  }
  
  // Acciones rápidas personalizadas
  const quickActions = [
    {
      id: 'dashboard',
      label: 'Ir al Dashboard',
      icon: ArrowLeft,
      action: () => onBack?.({ action: 'dashboard' })
    }
  ]

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
        data: {
          ...formData,
          // Información del formulario avanzado
          mode: 'oficial',
          formType: 'rama-judicial',
          // Agregar path de selección para contexto
          selectionPath: getSelectionPath(formData),
          // Usar nombre descriptivo como alias principal
          alias: formData.nombreDescriptivo || `Consulta: ${formData.nombreRazonSocial}`,
          tipo_busqueda: 'nombre_razon_social',
          criterio_busqueda_nombre: formData.nombreRazonSocial
        }
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Obtener nombres para mostrar
  const getSujetoProcesalLabel = (id) => {
    const opcion = opcionesSujetoProcesal.find(o => o.id === id)
    return opcion ? opcion.nombre : id
  }

  const getTipoPersonaLabel = (id) => {
    const tipo = tiposPersona.find(t => t.id === id)
    return tipo ? tipo.nombre : id
  }

  const ciudadesActuales = ciudadesDisponibles

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <form onSubmit={handleSubmit}>
        <Card size="lg">
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <Card.Title className="flex items-center gap-sm">
                  <Scale className="w-5 h-5 text-interactive-default" />
                  {formTitle}
                </Card.Title>
                <p className="text-body-paragraph text-text-secondary mt-xs">
                  {formSubtitle}
                </p>
              </div>
              <Badge variant="warning" className="hidden md:flex">
                <Scale className="w-3 h-3 mr-xs" />
                Avanzada
              </Badge>
            </div>
          </Card.Header>

          <Card.Content>
            <div className="space-y-2xl">
              
              {/* BANNER INFORMATIVO */}
              <div className="p-md bg-feedback-warning-light border border-feedback-warning rounded-md">
                <div className="flex items-start gap-sm">
                  <Info className="w-5 h-5 text-feedback-warning mt-xs" />
                  <div>
                    <h3 className="text-body-paragraph font-medium text-feedback-warning mb-xs">
                      Formulario de Búsqueda Avanzada
                    </h3>
                    <p className="text-body-auxiliary text-feedback-warning">
                      Este formulario utiliza los criterios de búsqueda de la Rama Judicial, 
                      garantizando compatibilidad total con el sistema automatizado.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 0: IDENTIFICACIÓN DEL CASO */}
              <div>
                <h3 className="text-heading-h3 font-heading text-text-primary mb-md flex items-center gap-sm">
                  <FileText className="w-5 h-5 text-interactive-default" />
                  Identificación del Caso
                  <Badge variant="error" size="sm">Requerido</Badge>
                </h3>
                
                <div className="max-w-2xl">
                  <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                    * Nombre descriptivo de la consulta
                  </label>
                  <input
                    type="text"
                    value={formData.nombreDescriptivo}
                    onChange={handleInputChange('nombreDescriptivo')}
                    placeholder="Ej: Consulta proceso civil Juan Pérez vs ABC S.A.S"
                    className={cn(
                      'w-full px-sm py-sm border rounded-md transition-colors',
                      'text-body-paragraph bg-bg-canvas text-text-base',
                      errors.nombreDescriptivo 
                        ? 'border-feedback-error focus:border-feedback-error' 
                        : 'border-border-default focus:border-interactive-default',
                      'focus:outline-none'
                    )}
                  />
                  {errors.nombreDescriptivo && (
                    <p className="text-body-auxiliary text-feedback-error mt-xs flex items-center gap-xs">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.nombreDescriptivo}
                    </p>
                  )}
                  {!errors.nombreDescriptivo && (
                    <p className="text-body-auxiliary text-text-secondary mt-xs">
                      Este nombre te ayudará a identificar fácilmente la consulta en tu panel de control. 
                      Usa algo descriptivo que represente el caso o la persona consultada.
                    </p>
                  )}
                </div>
              </div>

              {/* SECCIÓN 1: SUJETO PROCESAL */}
              <div>
                <h3 className="text-heading-h3 font-heading text-text-primary mb-md flex items-center gap-sm">
                  <Clock className="w-5 h-5 text-interactive-default" />
                  1. Sujeto Procesal
                </h3>
                
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
                        onChange={(e) => handleRadioChange('sujetoProcesal', e.target.value)}
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

              {/* SECCIÓN 2: DATOS OBLIGATORIOS */}
              <div>
                <h3 className="text-heading-h3 font-heading text-text-primary mb-md flex items-center gap-sm">
                  <User className="w-5 h-5 text-interactive-default" />
                  2. Datos de Búsqueda
                  <Badge variant="error" size="sm">Requerido</Badge>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* Tipo de Persona */}
                  <div>
                    <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                      * Tipo de Persona
                    </label>
                    <select
                      value={formData.tipoPersona}
                      onChange={handleSelectChange('tipoPersona')}
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
                    {errors.tipoPersona && (
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
                      onChange={handleInputChange('nombreRazonSocial')}
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
                    {errors.nombreRazonSocial && (
                      <p className="text-body-auxiliary text-feedback-error mt-xs">
                        {errors.nombreRazonSocial}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: FILTROS DE JURISDICCIÓN */}
              <div>
                <h3 className="text-heading-h3 font-heading text-text-primary mb-md flex items-center gap-sm">
                  <Building className="w-5 h-5 text-interactive-default" />
                  3. Filtros de Jurisdicción
                  <Badge variant="secondary" size="sm">Opcional</Badge>
                </h3>
                
                <div className="p-md bg-bg-light rounded-md border border-border-default mb-md">
                  <p className="text-body-auxiliary text-text-secondary mb-md">
                    Puede especificar uno o más filtros para delimitar la búsqueda a una jurisdicción específica. 
                    Los filtros trabajan en cascada: Departamento → Ciudad → Entidad → Especialidad → Despacho.
                  </p>
                </div>
                
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
                        onChange={handleSelectChange('departamento')}
                        className="w-full pl-10 pr-sm py-sm border border-border-default rounded-md focus:border-interactive-default focus:outline-none text-body-paragraph bg-bg-canvas text-text-base appearance-none"
                      >
                        <option value="">Todos los departamentos</option>
                        {departamentos.map(dept => (
                          <option key={dept.id} value={dept.nombre}>
                            {dept.nombre}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
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
                        onChange={handleSelectChange('ciudad')}
                        disabled={!formData.departamento}
                        className={cn(
                          'w-full pl-10 pr-sm py-sm border border-border-default rounded-md focus:border-interactive-default focus:outline-none text-body-paragraph bg-bg-canvas text-text-base appearance-none',
                          !formData.departamento && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <option value="">
                          {formData.departamento ? 'Todas las ciudades' : 'Seleccione departamento primero'}
                        </option>
                        {ciudadesActuales.map(ciudad => (
                          <option key={ciudad.id} value={ciudad.nombre}>
                            {ciudad.nombre}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
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
                        onChange={handleSelectChange('entidad')}
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
                      <ChevronDown className="absolute right-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
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
                        onChange={handleSelectChange('especialidad')}
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
                      <ChevronDown className="absolute right-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
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
                        onChange={handleSelectChange('despacho')}
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
                      <ChevronDown className="absolute right-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Mostrar path de selección */}
                {getSelectionPath(formData) && (
                  <div className="mt-md p-sm bg-interactive-default bg-opacity-10 border border-interactive-default rounded-md">
                    <p className="text-body-auxiliary text-interactive-default font-medium">
                      <MapPin className="w-3 h-3 inline mr-xs" />
                      Filtro aplicado: {getSelectionPath(formData)}
                    </p>
                  </div>
                )}
              </div>

              {/* Errores de jerarquía */}
              {errors.hierarchy && (
                <div className="flex items-center gap-xs p-sm bg-feedback-error-light border border-feedback-error rounded-md">
                  <AlertTriangle className="w-4 h-4 text-feedback-error" />
                  <span className="text-body-auxiliary text-feedback-error">
                    {errors.hierarchy}
                  </span>
                </div>
              )}

              {/* SECCIÓN 4: AUTOMATIZACIÓN */}
              <div>
                <h3 className="text-heading-h3 font-heading text-text-primary mb-md">
                  4. Configuración de Automatización
                </h3>
                
                {/* Banner informativo */}
                <div className="bg-gradient-to-r from-feedback-info/10 to-interactive-default/10 border border-feedback-info/30 rounded-lg p-lg">
                  <div className="flex items-start gap-sm mb-md">
                    <div className="w-6 h-6 bg-interactive-default rounded-full flex items-center justify-center flex-shrink-0 mt-xs">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="text-body-paragraph font-semibold text-text-primary mb-xs">
                        Automatización Inteligente Activada
                      </h4>
                      <p className="text-body-auxiliary text-text-base mb-md">
                        Tu consulta oficial se configurará automáticamente con las mejores prácticas.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="flex items-start gap-sm">
                      <div className="w-5 h-5 bg-feedback-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Clock className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <h5 className="text-body-paragraph font-medium text-text-primary mb-xs">
                          Ejecución Diaria Automática
                        </h5>
                        <p className="text-body-auxiliary text-text-secondary">
                          {formData.sujetoProcesal === 'recientes' 
                            ? 'Búsqueda rápida en procesos recientes (30 días) a las 7:00 PM'
                            : 'Búsqueda completa en toda la base de datos a las 7:00 PM'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-sm">
                      <div className="w-5 h-5 bg-feedback-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Mail className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <h5 className="text-body-paragraph font-medium text-text-primary mb-xs">
                          Notificaciones Inteligentes
                        </h5>
                        <p className="text-body-auxiliary text-text-secondary">
                          <strong>Email automático</strong> para "{formData.nombreDescriptivo || 'tu consulta'}" cada vez que se detecten cambios en los procesos de: <strong>{formData.nombreRazonSocial || 'la persona/entidad especificada'}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-md pt-md border-t border-feedback-info/20">
                    <p className="text-body-auxiliary text-text-secondary text-center">
                      <Lightbulb className="w-3 h-3 inline mr-xs" />
                      <strong>Tiempo estimado:</strong> {formData.sujetoProcesal === 'recientes' ? '1-2 minutos' : '2-8 minutos'} por ejecución
                    </p>
                  </div>
                </div>
              </div>

              {/* BOTONES MEJORADOS */}
              <div className="flex flex-col sm:flex-row gap-sm justify-between pt-lg border-t border-border-default">
                {/* 🔙 BOTÓN VOLVER MEJORADO */}
                <EnhancedBackButton
                  onClick={onBack}
                  disabled={isSubmitting}
                  hasUnsavedChanges={hasUnsavedChanges()}
                  originalData={originalFormData}
                  currentData={formData}
                  onSaveAndExit={handleSaveAndExit}
                  onDiscardChanges={handleDiscardChanges}
                  quickActions={quickActions}
                  confirmationTitle="¿Salir sin guardar la consulta?"
                  confirmationMessage="Has realizado cambios en el formulario de consulta judicial que se perderán si sales ahora."
                  text="Volver"
                  loadingText="Procesando..."
                  className="min-w-[120px]"
                />
                
                {/* 🆕 BOTÓN CREAR MEJORADO */}
                <div className="flex-1 max-w-md ml-auto">
                  <EnhancedCreateButton
                    formData={formData}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

            </div>
          </Card.Content>
        </Card>
      </form>
    </div>
  )
}

export default SimpleAdvancedQueryForm