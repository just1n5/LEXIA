// src/components/advanced-query/RamaJudicialPreview.jsx

import React from 'react'
import { 
  ArrowLeft, CheckCircle, Edit3, Clock, User, Building, 
  Scale, Gavel, MapPin, FileText, Zap
} from 'lucide-react'
import { cn } from '../../utils/cn'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

// Importar datos para obtener nombres completos
import {
  tiposPersona,
  opcionesSujetoProcesal,
  getEntidadesByCiudad,
  getEspecialidadesByEntidad,
  getDespachosByEspecialidad,
  getSelectionPath
} from '../../data/ramaJudicialData'

/**
 * 🔍 RamaJudicialPreview - Vista previa de consulta avanzada
 * 
 * Muestra un resumen detallado de todos los criterios seleccionados
 * antes de crear la consulta automatizada, permitiendo al usuario
 * revisar y confirmar la configuración.
 */
const RamaJudicialPreview = ({ 
  data,
  onEdit,
  onConfirm,
  className = '',
  ...props 
}) => {
  // Obtener nombres completos de los IDs seleccionados
  const getTipoPersonaNombre = (id) => {
    const tipo = tiposPersona.find(t => t.id === id)
    return tipo ? tipo.nombre : id
  }

  const getSujetoProcesalNombre = (id) => {
    const opcion = opcionesSujetoProcesal.find(o => o.id === id)
    return opcion ? opcion.nombre : id
  }

  const getEntidadNombre = (ciudadNombre, entidadId) => {
    if (!ciudadNombre || !entidadId) return null
    const entidades = getEntidadesByCiudad(ciudadNombre)
    const entidad = entidades.find(e => e.id === entidadId)
    return entidad ? entidad.nombre : entidadId
  }

  const getEspecialidadNombre = (entidadId, especialidadId) => {
    if (!entidadId || !especialidadId) return null
    const especialidades = getEspecialidadesByEntidad(entidadId)
    const especialidad = especialidades.find(e => e.id === especialidadId)
    return especialidad ? especialidad.nombre : especialidadId
  }

  const getDespachoNombre = (especialidadId, despachoId) => {
    if (!especialidadId || !despachoId) return null
    const despachos = getDespachosByEspecialidad(especialidadId)
    const despacho = despachos.find(d => d.id === despachoId)
    return despacho ? despacho.nombre : despachoId
  }

  // Componente para mostrar un campo de información
  const InfoField = ({ icon: Icon, label, value, badge = null }) => {
    if (!value) return null
    
    return (
      <div className="flex items-start gap-sm">
        <Icon className="w-4 h-4 text-interactive-default mt-xs" />
        <div className="flex-1">
          <span className="text-body-auxiliary text-text-secondary">
            {label}:
          </span>
          <p className="text-body-paragraph text-text-base font-medium">
            {value}
          </p>
          {badge && (
            <div className="mt-xs">
              {badge}
            </div>
          )}
        </div>
      </div>
    )
  }

  const hasJurisdictionFilters = data.departamento || data.ciudad || data.entidad || data.especialidad || data.despacho

  return (
    <div className={cn('max-w-4xl mx-auto', className)} {...props}>
      {/* Header */}
      <div className="mb-xl">
        <h1 className="text-heading-h1 font-heading text-text-primary mb-sm">
          Revisar Consulta Avanzada
        </h1>
        <p className="text-body-paragraph text-text-secondary">
          Confirma los criterios de búsqueda antes de crear tu consulta automatizada
        </p>
      </div>

      <div className="space-y-lg">
        {/* Resumen Principal */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title className="flex items-center gap-sm">
                <FileText className="w-5 h-5 text-interactive-default" />
                Resumen de Consulta
              </Card.Title>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="flex items-center gap-xs"
              >
                <Edit3 className="w-4 h-4" />
                Editar
              </Button>
            </div>
          </Card.Header>

          <Card.Content>
            <div className="space-y-lg">
              {/* Criterios de Búsqueda */}
              <div>
                <h3 className="text-heading-h4 font-heading text-text-primary mb-md">
                  Criterios de Búsqueda
                </h3>
                
                <div className="space-y-md">
                  <InfoField
                    icon={Clock}
                    label="Sujeto Procesal"
                    value={getSujetoProcesalNombre(data.sujetoProcesal)}
                    badge={
                      <Badge variant={data.sujetoProcesal === 'recientes' ? 'success' : 'info'}>
                        {data.sujetoProcesal === 'recientes' ? 'Búsqueda Rápida' : 'Búsqueda Completa'}
                      </Badge>
                    }
                  />

                  <InfoField
                    icon={User}
                    label="Tipo de Persona"
                    value={getTipoPersonaNombre(data.tipoPersona)}
                  />

                  <InfoField
                    icon={FileText}
                    label="Nombre o Razón Social"
                    value={data.nombreRazonSocial}
                  />
                </div>
              </div>

              {/* Filtros de Jurisdicción */}
              {hasJurisdictionFilters && (
                <div>
                  <h3 className="text-heading-h4 font-heading text-text-primary mb-md">
                    Filtros de Jurisdicción
                  </h3>
                  
                  <div className="space-y-md">
                    <InfoField
                      icon={Building}
                      label="Departamento"
                      value={data.departamento}
                    />

                    <InfoField
                      icon={MapPin}
                      label="Ciudad"
                      value={data.ciudad}
                    />

                    <InfoField
                      icon={Building}
                      label="Entidad"
                      value={getEntidadNombre(data.ciudad, data.entidad)}
                    />

                    <InfoField
                      icon={Scale}
                      label="Especialidad"
                      value={getEspecialidadNombre(data.entidad, data.especialidad)}
                    />

                    <InfoField
                      icon={Gavel}
                      label="Despacho"
                      value={getDespachoNombre(data.especialidad, data.despacho)}
                    />
                  </div>

                  {/* Path completo */}
                  <div className="mt-md p-md bg-interactive-default bg-opacity-10 border border-interactive-default rounded-md">
                    <p className="text-body-auxiliary text-interactive-default font-medium mb-xs">
                      📍 Filtro Aplicado:
                    </p>
                    <p className="text-body-paragraph text-text-base">
                      {getSelectionPath(data)}
                    </p>
                  </div>
                </div>
              )}

              {!hasJurisdictionFilters && (
                <div className="p-md bg-bg-light border border-border-default rounded-md">
                  <p className="text-body-auxiliary text-text-secondary">
                    No se aplicaron filtros de jurisdicción. La búsqueda se realizará en todas las entidades disponibles.
                  </p>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Información sobre la Consulta */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-sm">
              <Zap className="w-5 h-5 text-interactive-default" />
              ¿Qué sucederá a continuación?
            </Card.Title>
          </Card.Header>

          <Card.Content>
            <div className="space-y-md">
              <div className="flex items-start gap-sm">
                <div className="w-6 h-6 bg-interactive-default text-white rounded-full flex items-center justify-center text-body-auxiliary font-medium">
                  1
                </div>
                <div>
                  <h4 className="text-body-paragraph font-medium text-text-base">
                    Creación de la Consulta
                  </h4>
                  <p className="text-body-auxiliary text-text-secondary">
                    Se configurará una consulta automatizada con los criterios especificados
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-sm">
                <div className="w-6 h-6 bg-interactive-default text-white rounded-full flex items-center justify-center text-body-auxiliary font-medium">
                  2
                </div>
                <div>
                  <h4 className="text-body-paragraph font-medium text-text-base">
                    Ejecución Automática
                  </h4>
                  <p className="text-body-auxiliary text-text-secondary">
                    El bot realizará la búsqueda en la página oficial de la Rama Judicial
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-sm">
                <div className="w-6 h-6 bg-interactive-default text-white rounded-full flex items-center justify-center text-body-auxiliary font-medium">
                  3
                </div>
                <div>
                  <h4 className="text-body-paragraph font-medium text-text-base">
                    Resultados y Monitoreo
                  </h4>
                  <p className="text-body-auxiliary text-text-secondary">
                    Recibirás los resultados y podrás monitorear el estado desde tu dashboard
                  </p>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Estimación de tiempo */}
        <div className="p-md bg-feedback-info-light border border-feedback-info rounded-md">
          <div className="flex items-start gap-sm">
            <Clock className="w-5 h-5 text-feedback-info mt-xs" />
            <div>
              <h4 className="text-body-paragraph font-medium text-feedback-info mb-xs">
                Tiempo Estimado de Ejecución
              </h4>
              <p className="text-body-auxiliary text-feedback-info">
                {data.sujetoProcesal === 'recientes' 
                  ? 'Entre 30 segundos y 2 minutos (búsqueda rápida en procesos recientes)'
                  : 'Entre 2 y 8 minutos (búsqueda completa en toda la base de datos)'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-sm justify-between">
          <Button
            variant="secondary"
            onClick={onEdit}
            className="flex items-center gap-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Editar
          </Button>
          
          <Button
            variant="primary"
            size="lg"
            onClick={onConfirm}
            className="flex items-center gap-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Confirmar y Crear Consulta
          </Button>
        </div>
      </div>
    </div>
  )
}

RamaJudicialPreview.displayName = 'RamaJudicialPreview'

export default RamaJudicialPreview