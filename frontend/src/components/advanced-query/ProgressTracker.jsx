// src/components/advanced-query/ProgressTracker.jsx
import React from 'react'
import { 
  MapPin, Search, Settings, CheckCircle, 
  AlertTriangle, Clock, Zap
} from 'lucide-react'
import { cn } from '../../utils/cn'
import Badge from '../ui/Badge'

/**
 * 📊 ProgressTracker - Seguimiento visual del progreso
 * 
 * Muestra el progreso detallado del formulario con indicadores
 * visuales intuitivos y motivacionales.
 */
const ProgressTracker = ({ 
  formData = {}, 
  validations = {},
  className = '',
  compact = false,
  ...props 
}) => {
  // Definir las secciones del formulario
  const sections = [
    {
      id: 'location',
      title: 'Ubicación',
      icon: MapPin,
      fields: ['departamento', 'ciudad'],
      required: true,
      description: 'Departamento y ciudad del proceso'
    },
    {
      id: 'criteria',
      title: 'Criterios de Búsqueda',
      icon: Search,
      fields: ['nombreDemandante', 'nombreDemandado', 'numeroRadicado', 'numeroRadicacion'],
      required: true,
      description: 'Al menos un criterio de búsqueda',
      minRequired: 1
    },
    {
      id: 'automation',
      title: 'Automatización',
      icon: Settings,
      fields: ['ejecutarDiariamente', 'notificarCambios'],
      required: false,
      description: 'Configuración opcional'
    }
  ]

  // Calcular el estado de cada sección
  const getSectionStatus = (section) => {
    const sectionFields = section.fields.filter(field => formData.hasOwnProperty(field))
    
    if (section.minRequired) {
      // Para criterios de búsqueda - necesita al menos uno
      const filledFields = sectionFields.filter(field => 
        formData[field] && formData[field] !== ''
      )
      const hasValidFields = filledFields.some(field => 
        !validations[field] || validations[field].isValid !== false
      )
      
      return {
        completed: filledFields.length >= section.minRequired && hasValidFields,
        partial: filledFields.length > 0 && filledFields.length < sectionFields.length,
        filled: filledFields.length,
        total: sectionFields.length,
        hasErrors: filledFields.some(field => 
          validations[field] && !validations[field].isValid
        )
      }
    } else {
      // Para otras secciones - necesita todos los campos requeridos
      const requiredFields = section.required ? sectionFields : []
      const filledFields = sectionFields.filter(field => {
        const value = formData[field]
        return value !== undefined && value !== null && value !== ''
      })
      
      const completed = section.required 
        ? requiredFields.every(field => formData[field] && formData[field] !== '')
        : true
      
      return {
        completed,
        partial: filledFields.length > 0 && !completed,
        filled: filledFields.length,
        total: sectionFields.length,
        hasErrors: sectionFields.some(field => 
          validations[field] && !validations[field].isValid
        )
      }
    }
  }

  // Calcular progreso general
  const getOverallProgress = () => {
    const totalSections = sections.filter(s => s.required).length
    const completedSections = sections.filter(s => s.required && getSectionStatus(s).completed).length
    
    return {
      completed: completedSections,
      total: totalSections,
      percentage: Math.round((completedSections / totalSections) * 100)
    }
  }

  const overallProgress = getOverallProgress()

  if (compact) {
    return (
      <div className={cn('p-md bg-bg-light rounded-lg border border-border-default', className)} {...props}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-body-paragraph font-medium text-text-primary">
              Progreso del Formulario
            </h4>
            <p className="text-body-auxiliary text-text-secondary">
              {overallProgress.completed}/{overallProgress.total} secciones completadas
            </p>
          </div>
          
          <div className="flex items-center gap-sm">
            <div className="w-12 h-12 relative">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-bg-light"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-interactive-default"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${overallProgress.percentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-body-auxiliary font-bold text-interactive-default">
                  {overallProgress.percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Indicadores rápidos */}
        <div className="flex gap-xs mt-sm">
          {sections.map(section => {
            const status = getSectionStatus(section)
            const SectionIcon = section.icon
            
            return (
              <div
                key={section.id}
                className={cn(
                  'flex items-center gap-xs px-xs py-xs rounded text-body-auxiliary',
                  status.completed && 'bg-feedback-success text-white',
                  status.partial && 'bg-feedback-warning text-white',
                  status.hasErrors && 'bg-feedback-error text-white',
                  !status.completed && !status.partial && !status.hasErrors && 'bg-text-secondary text-white'
                )}
              >
                <SectionIcon className="w-3 h-3" />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-md', className)} {...props}>
      <div className="p-md bg-bg-light rounded-lg border border-border-default">
        <div className="flex items-center justify-between mb-md">
          <h3 className="text-heading-h4 font-heading text-text-primary">
            Progreso del Formulario
          </h3>
          <Badge 
            variant={overallProgress.percentage === 100 ? 'success' : 'secondary'}
            size="sm"
          >
            {overallProgress.percentage}% completado
          </Badge>
        </div>

        {/* Barra de progreso general */}
        <div className="mb-md">
          <div className="w-full bg-border-default rounded-full h-2">
            <div 
              className="bg-interactive-default h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress.percentage}%` }}
            />
          </div>
          <p className="text-body-auxiliary text-text-secondary mt-xs">
            {overallProgress.completed} de {overallProgress.total} secciones requeridas completadas
          </p>
        </div>

        {/* Detalles por sección */}
        <div className="space-y-sm">
          {sections.map(section => {
            const status = getSectionStatus(section)
            const SectionIcon = section.icon

            return (
              <div key={section.id} className="flex items-center gap-sm p-sm rounded-lg bg-bg-canvas border border-border-default">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  status.completed && 'bg-feedback-success',
                  status.partial && 'bg-feedback-warning',
                  status.hasErrors && 'bg-feedback-error',
                  !status.completed && !status.partial && !status.hasErrors && 'bg-text-secondary'
                )}>
                  {status.completed ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : status.hasErrors ? (
                    <AlertTriangle className="w-4 h-4 text-white" />
                  ) : status.partial ? (
                    <Clock className="w-4 h-4 text-white" />
                  ) : (
                    <SectionIcon className="w-4 h-4 text-white" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-body-paragraph font-medium text-text-primary">
                      {section.title}
                    </h4>
                    <div className="flex items-center gap-xs">
                      {section.required && (
                        <Badge variant="secondary" size="sm">Requerido</Badge>
                      )}
                      <span className="text-body-auxiliary text-text-secondary">
                        {section.minRequired 
                          ? `${status.filled}/${section.minRequired}+`
                          : `${status.filled}/${status.total}`
                        }
                      </span>
                    </div>
                  </div>
                  <p className="text-body-auxiliary text-text-secondary">
                    {section.description}
                  </p>

                  {/* Barra de progreso de la sección */}
                  <div className="w-full bg-border-default rounded-full h-1 mt-xs">
                    <div 
                      className={cn(
                        'h-1 rounded-full transition-all duration-300',
                        status.completed && 'bg-feedback-success',
                        status.partial && 'bg-feedback-warning',
                        status.hasErrors && 'bg-feedback-error',
                        !status.completed && !status.partial && !status.hasErrors && 'bg-text-secondary'
                      )}
                      style={{ 
                        width: section.minRequired 
                          ? `${Math.min((status.filled / section.minRequired) * 100, 100)}%`
                          : `${(status.filled / status.total) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mensaje motivacional */}
        {overallProgress.percentage < 100 && (
          <div className="mt-md p-sm bg-interactive-default bg-opacity-10 rounded border border-interactive-default">
            <div className="flex items-center gap-sm">
              <Zap className="w-4 h-4 text-interactive-default" />
              <p className="text-body-auxiliary text-interactive-default">
                {overallProgress.percentage === 0 && "¡Comienza completando la ubicación del proceso!"}
                {overallProgress.percentage > 0 && overallProgress.percentage < 50 && "¡Vas bien! Continúa con los criterios de búsqueda."}
                {overallProgress.percentage >= 50 && overallProgress.percentage < 100 && "¡Casi listo! Solo faltan algunos detalles."}
              </p>
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {overallProgress.percentage === 100 && (
          <div className="mt-md p-sm bg-feedback-success-light rounded border border-feedback-success">
            <div className="flex items-center gap-sm">
              <CheckCircle className="w-4 h-4 text-feedback-success" />
              <p className="text-body-auxiliary text-feedback-success font-medium">
                ¡Excelente! Todos los campos requeridos están completos. Puedes proceder a crear la consulta.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

ProgressTracker.displayName = 'ProgressTracker'

export default ProgressTracker