// src/components/advanced-query/ContextualHelp.jsx
import React, { useState, useEffect } from 'react'
import { 
  HelpCircle, Info, Lightbulb, AlertTriangle, 
  Eye, ChevronDown, ChevronUp, FileText,
  MapPin, User, Calendar, Search, Zap, CheckCircle
} from 'lucide-react'
import { cn } from '../../utils/cn'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

/**
 * 💡 ContextualHelp - Ayuda contextual inteligente
 * 
 * Proporciona información relevante, ejemplos y consejos
 * basados en el campo activo y el contexto del formulario.
 */
const ContextualHelp = ({ 
  activeField, 
  formData = {}, 
  className = '',
  compact = false,
  ...props 
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact)
  const [helpContent, setHelpContent] = useState(null)

  // Contenido de ayuda por campo
  const helpDatabase = {
    departamento: {
      title: 'Selección de Departamento',
      icon: MapPin,
      description: 'Elige el departamento donde se tramita el proceso judicial.',
      tips: [
        'Bogotá D.C. concentra la mayoría de procesos judiciales',
        'Cada departamento tiene juzgados específicos por materia',
        'La búsqueda será más efectiva si conoces la ubicación exacta'
      ],
      examples: [
        'Bogotá D.C. - Para procesos en la capital',
        'Antioquia - Para procesos en Medellín y municipios',
        'Valle del Cauca - Para procesos en Cali y alrededores'
      ],
      warnings: [
        'Verificar que el proceso realmente se tramite en este departamento'
      ],
      relatedFields: ['ciudad']
    },
    
    ciudad: {
      title: 'Selección de Ciudad',
      icon: MapPin,
      description: 'Especifica la ciudad donde está radicado el proceso.',
      tips: [
        'La ciudad debe corresponder al departamento seleccionado',
        'Algunas ciudades tienen múltiples sedes judiciales',
        'Los municipios menores pueden depender de ciudades principales'
      ],
      examples: [
        'Bogotá - Principal sede judicial del país',
        'Medellín - Centro judicial de Antioquia',
        'Cali - Principal sede del Valle del Cauca'
      ],
      warnings: [
        'Asegurar correspondencia entre departamento y ciudad'
      ],
      relatedFields: ['departamento']
    },

    nombreDemandante: {
      title: 'Nombre del Demandante',
      icon: User,
      description: 'Persona o entidad que inicia la acción judicial.',
      tips: [
        'Usar el nombre completo como aparece en documentos oficiales',
        'Para empresas, incluir la razón social completa',
        'Verificar spelling correcto para mejores resultados'
      ],
      examples: [
        'Juan Carlos Pérez González',
        'María Elena Rodríguez de López',
        'Banco de Bogotá S.A.',
        'Ministerio de Hacienda y Crédito Público'
      ],
      warnings: [
        'Los nombres parciales pueden arrojar muchos resultados irrelevantes',
        'Evitar abreviaciones no oficiales'
      ],
      relatedFields: ['nombreDemandado']
    },

    nombreDemandado: {
      title: 'Nombre del Demandado',
      icon: User,
      description: 'Persona o entidad contra quien se dirige la acción judicial.',
      tips: [
        'Incluir nombres y apellidos completos',
        'Para empresas, usar la denominación legal exacta',
        'Considerar variaciones del nombre si no hay resultados'
      ],
      examples: [
        'Carlos Alberto González Méndez',
        'Ana Sofía Martínez Herrera',
        'Seguros Bolívar S.A.',
        'Instituto de Seguros Sociales'
      ],
      warnings: [
        'Nombres genéricos pueden generar demasiados resultados',
        'Verificar la denominación legal de entidades'
      ],
      relatedFields: ['nombreDemandante']
    },

    numeroRadicado: {
      title: 'Número de Radicado',
      icon: FileText,
      description: 'Número único asignado al proceso judicial al momento de su radicación.',
      tips: [
        'El radicado es único por juzgado y año',
        'Incluye información sobre el juzgado y fecha',
        'Es la forma más precisa de buscar un proceso específico'
      ],
      examples: [
        '11001310300120240001234 - Bogotá, 2024',
        '05001310300220230005678 - Antioquia, 2023',
        '76001310300120240009876 - Valle del Cauca, 2024'
      ],
      warnings: [
        'Verificar que todos los dígitos sean correctos',
        'Un dígito incorrecto impedirá encontrar el proceso'
      ],
      structure: {
        title: 'Estructura del Radicado',
        parts: [
          { label: 'Código Juzgado', example: '11001', description: '5 dígitos' },
          { label: 'Código Proceso', example: '31', description: '2 dígitos' },
          { label: 'Código Subproceso', example: '03', description: '2 dígitos' },
          { label: 'Código Interno', example: '001', description: '3 dígitos' },
          { label: 'Año', example: '2024', description: '4 dígitos' },
          { label: 'Consecutivo', example: '0001234', description: '7 dígitos' }
        ]
      },
      relatedFields: ['numeroRadicacion']
    },

    numeroRadicacion: {
      title: 'Número de Radicación',
      icon: FileText,
      description: 'Número interno de radicación, generalmente más corto que el radicado completo.',
      tips: [
        'Suele comenzar con el año de radicación',
        'Es específico de cada despacho judicial',
        'Útil cuando no se conoce el radicado completo'
      ],
      examples: [
        '20240001234 - Radicación 2024',
        '20230005678 - Radicación 2023',
        '2024-001-234 - Con separadores'
      ],
      warnings: [
        'Puede variar en formato según el juzgado',
        'Menos específico que el número de radicado completo'
      ],
      relatedFields: ['numeroRadicado']
    }
  }

  // Obtener contenido contextual
  useEffect(() => {
    if (activeField && helpDatabase[activeField]) {
      setHelpContent(helpDatabase[activeField])
    } else {
      setHelpContent(null)
    }
  }, [activeField])

  // Obtener sugerencias dinámicas basadas en datos del formulario
  const getDynamicSuggestions = () => {
    const suggestions = []

    if (formData.departamento && !formData.ciudad) {
      suggestions.push({
        type: 'suggestion',
        message: `Selecciona una ciudad en ${formData.departamento} para mejorar la precisión`
      })
    }

    if (formData.nombreDemandante && formData.nombreDemandado) {
      suggestions.push({
        type: 'success',
        message: 'Excelente: tienes ambas partes del proceso definidas'
      })
    }

    if (!formData.numeroRadicado && !formData.numeroRadicacion && 
        !formData.nombreDemandante && !formData.nombreDemandado) {
      suggestions.push({
        type: 'warning',
        message: 'Necesitas al menos un criterio de búsqueda para proceder'
      })
    }

    return suggestions
  }

  if (!helpContent && getDynamicSuggestions().length === 0) {
    return null
  }

  return (
    <Card 
      size="sm" 
      className={cn(
        'border-feedback-info bg-feedback-info-light',
        compact && 'p-sm',
        className
      )} 
      {...props}
    >
      {compact && (
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-sm">
            <HelpCircle className="w-4 h-4 text-feedback-info" />
            <span className="text-body-auxiliary font-medium text-feedback-info">
              Ayuda contextual
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-feedback-info" />
          ) : (
            <ChevronDown className="w-4 h-4 text-feedback-info" />
          )}
        </div>
      )}

      {isExpanded && (
        <div className={cn('space-y-md', compact && 'mt-sm')}>
          {helpContent && (
            <>
              {/* Título y descripción */}
              <div>
                <div className="flex items-center gap-sm mb-sm">
                  <div className="w-6 h-6 bg-feedback-info rounded-lg flex items-center justify-center">
                    <helpContent.icon className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="text-body-paragraph font-medium text-feedback-info">
                    {helpContent.title}
                  </h4>
                </div>
                <p className="text-body-auxiliary text-feedback-info">
                  {helpContent.description}
                </p>
              </div>

              {/* Consejos */}
              {helpContent.tips && helpContent.tips.length > 0 && (
                <div>
                  <div className="flex items-center gap-sm mb-sm">
                    <Lightbulb className="w-4 h-4 text-feedback-info" />
                    <h5 className="text-body-auxiliary font-medium text-feedback-info">
                      Consejos útiles
                    </h5>
                  </div>
                  <ul className="space-y-xs">
                    {helpContent.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-xs">
                        <span className="text-feedback-info mt-1">•</span>
                        <span className="text-body-auxiliary text-feedback-info">
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ejemplos */}
              {helpContent.examples && helpContent.examples.length > 0 && (
                <div>
                  <div className="flex items-center gap-sm mb-sm">
                    <Eye className="w-4 h-4 text-feedback-info" />
                    <h5 className="text-body-auxiliary font-medium text-feedback-info">
                      Ejemplos
                    </h5>
                  </div>
                  <div className="space-y-xs">
                    {helpContent.examples.map((example, index) => (
                      <div key={index} className="bg-white bg-opacity-50 rounded p-xs border border-feedback-info border-opacity-30">
                        <code className="text-body-auxiliary text-feedback-info font-mono">
                          {example}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estructura especial para radicados */}
              {helpContent.structure && (
                <div>
                  <div className="flex items-center gap-sm mb-sm">
                    <Search className="w-4 h-4 text-feedback-info" />
                    <h5 className="text-body-auxiliary font-medium text-feedback-info">
                      {helpContent.structure.title}
                    </h5>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-xs">
                    {helpContent.structure.parts.map((part, index) => (
                      <div key={index} className="bg-white bg-opacity-50 rounded p-xs border border-feedback-info border-opacity-30">
                        <div className="flex justify-between items-center">
                          <span className="text-body-auxiliary text-feedback-info font-medium">
                            {part.label}
                          </span>
                          <code className="text-body-auxiliary text-feedback-info font-mono">
                            {part.example}
                          </code>
                        </div>
                        <p className="text-body-auxiliary text-feedback-info opacity-75">
                          {part.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advertencias */}
              {helpContent.warnings && helpContent.warnings.length > 0 && (
                <div>
                  <div className="flex items-center gap-sm mb-sm">
                    <AlertTriangle className="w-4 h-4 text-feedback-warning" />
                    <h5 className="text-body-auxiliary font-medium text-feedback-warning">
                      Importante tener en cuenta
                    </h5>
                  </div>
                  <ul className="space-y-xs">
                    {helpContent.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start gap-xs">
                        <AlertTriangle className="w-3 h-3 text-feedback-warning mt-px" />
                        <span className="text-body-auxiliary text-feedback-warning">
                          {warning}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Sugerencias dinámicas */}
          {getDynamicSuggestions().length > 0 && (
            <div className="space-y-xs pt-md border-t border-feedback-info border-opacity-30">
              {getDynamicSuggestions().map((suggestion, index) => (
                <div key={index} className="flex items-start gap-xs">
                  {suggestion.type === 'suggestion' && <Zap className="w-3 h-3 text-feedback-warning mt-px" />}
                  {suggestion.type === 'success' && <CheckCircle className="w-3 h-3 text-feedback-success mt-px" />}
                  {suggestion.type === 'warning' && <AlertTriangle className="w-3 h-3 text-feedback-warning mt-px" />}
                  <span className={cn(
                    'text-body-auxiliary',
                    suggestion.type === 'suggestion' && 'text-feedback-warning',
                    suggestion.type === 'success' && 'text-feedback-success',
                    suggestion.type === 'warning' && 'text-feedback-warning'
                  )}>
                    {suggestion.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

ContextualHelp.displayName = 'ContextualHelp'

export default ContextualHelp