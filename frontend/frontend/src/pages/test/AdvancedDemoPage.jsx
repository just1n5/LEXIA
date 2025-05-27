import React, { useState } from 'react'
import { Plus, Search, Users, Building2, Calendar, Download, Filter, MoreVertical } from 'lucide-react'
import { useTable } from '../hooks/useTable'
import { useSolicitudes } from '../hooks/useSolicitudes'
import { useForm } from '../hooks/useForm'
import EmptyState from '../components/ui/EmptyState'
import ProgressSteps from '../components/ui/ProgressSteps'
import RealTimeValidation, { validators } from '../components/forms/RealTimeValidation'
import { useToast } from '../components/ui/Toast'

function AdvancedDemoPage() {
  const [activeDemo, setActiveDemo] = useState('table')
  const { toast } = useToast()

  // Mock data para la tabla
  const mockSolicitudes = [
    {
      id: 1,
      nombre: 'Consulta Proceso Civil',
      estado: 'activa',
      tipo: 'simple',
      fecha_creacion: '2024-01-15',
      ultima_ejecucion: '2024-01-20',
      progreso: 85,
      departamento: 'Cundinamarca',
      ciudad: 'Bogotá'
    },
    {
      id: 2,
      nombre: 'Seguimiento Proceso Laboral',
      estado: 'completada',
      tipo: 'avanzada',
      fecha_creacion: '2024-01-10',
      ultima_ejecucion: '2024-01-22',
      progreso: 100,
      departamento: 'Antioquia',
      ciudad: 'Medellín'
    },
    {
      id: 3,
      nombre: 'Consulta Multiple Radicados',
      estado: 'pausada',
      tipo: 'simple',
      fecha_creacion: '2024-01-12',
      ultima_ejecucion: '2024-01-18',
      progreso: 45,
      departamento: 'Valle del Cauca',
      ciudad: 'Cali'
    }
  ]

  // Demo del hook useTable
  const TableDemo = () => {
    const {
      data,
      searchTerm,
      handleSearch,
      handleSort,
      getSortProps,
      getSearchProps,
      getPaginationProps,
      paginationInfo,
      selectedRows,
      handleRowSelect,
      handleSelectAll,
      clearFilters,
      handleFilter,
      filters
    } = useTable(mockSolicitudes, {
      searchFields: ['nombre', 'departamento', 'ciudad'],
      initialPageSize: 5,
      enableSearch: true,
      enableSort: true,
      enableFilter: true
    })

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-heading-h3 font-semibold">Demo: Hook useTable Avanzado</h3>
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-with-icon">
              <Filter size={16} />
              Filtros
            </button>
            <button className="btn btn-primary btn-with-icon">
              <Download size={16} />
              Exportar
            </button>
          </div>
        </div>

        {/* Controles de búsqueda y filtros */}
        <div className="flex flex-wrap gap-4 p-4 bg-bg-light rounded-md">
          <div className="flex-1 min-w-64">
            <input
              {...getSearchProps()}
              className="form-input"
              placeholder="Buscar solicitudes..."
            />
          </div>
          
          <select 
            value={filters.estado || ''}
            onChange={(e) => handleFilter('estado', e.target.value)}
            className="form-input max-w-48"
          >
            <option value="">Todos los estados</option>
            <option value="activa">Activa</option>
            <option value="completada">Completada</option>
            <option value="pausada">Pausada</option>
          </select>

          <select 
            value={filters.tipo || ''}
            onChange={(e) => handleFilter('tipo', e.target.value)}
            className="form-input max-w-48"
          >
            <option value="">Todos los tipos</option>
            <option value="simple">Simple</option>
            <option value="avanzada">Avanzada</option>
          </select>

          {(searchTerm || Object.keys(filters).length > 0) && (
            <button 
              onClick={clearFilters}
              className="btn btn-ghost"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Información de selección */}
        {selectedRows.size > 0 && (
          <div className="flex items-center justify-between p-3 bg-interactive-default bg-opacity-10 rounded-md">
            <span className="text-sm">
              {selectedRows.size} elementos seleccionados
            </span>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-secondary">Ejecutar</button>
              <button className="btn btn-sm btn-destructive">Eliminar</button>
            </div>
          </div>
        )}

        {/* Tabla */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={selectedRows.size === data.length && data.length > 0}
                  />
                </th>
                <th>
                  <button 
                    {...getSortProps('nombre')}
                    className="flex items-center gap-1 font-semibold"
                  >
                    Nombre
                    {getSortProps('nombre').sortBy && (
                      <span className="text-xs">
                        {getSortProps('nombre').sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th>
                  <button 
                    {...getSortProps('estado')}
                    className="flex items-center gap-1 font-semibold"
                  >
                    Estado
                  </button>
                </th>
                <th>Tipo</th>
                <th>
                  <button 
                    {...getSortProps('fecha_creacion')}
                    className="flex items-center gap-1 font-semibold"
                  >
                    Fecha Creación
                  </button>
                </th>
                <th>Progreso</th>
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <EmptyState.Preset 
                      preset="searchEmpty"
                      onAction={(action) => toast.info('Acción', `Acción: ${action}`)}
                    />
                  </td>
                </tr>
              ) : (
                data.map((solicitud) => (
                  <tr key={solicitud.id}>
                    <td>
                      <input 
                        type="checkbox"
                        checked={selectedRows.has(solicitud.id)}
                        onChange={(e) => handleRowSelect(solicitud.id, e.target.checked)}
                      />
                    </td>
                    <td className="font-medium">{solicitud.nombre}</td>
                    <td>
                      <span className={`badge ${
                        solicitud.estado === 'activa' ? 'badge-success' :
                        solicitud.estado === 'completada' ? 'badge-info' :
                        'badge-warning'
                      }`}>
                        {solicitud.estado}
                      </span>
                    </td>
                    <td>
                      <span className="capitalize">{solicitud.tipo}</span>
                    </td>
                    <td>{new Date(solicitud.fecha_creacion).toLocaleDateString()}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-bg-light rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-interactive-default transition-all duration-300"
                            style={{ width: `${solicitud.progreso}%` }}
                          />
                        </div>
                        <span className="text-sm text-text-secondary">
                          {solicitud.progreso}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>{solicitud.ciudad}</div>
                        <div className="text-text-secondary">{solicitud.departamento}</div>
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Paginación */}
          {paginationInfo.totalPages > 1 && (
            <div className="table-pagination">
              <div className="pagination-info">
                Mostrando {paginationInfo.startItem} - {paginationInfo.endItem} de {paginationInfo.totalItems} resultados
              </div>
              <div className="pagination-controls">
                <button 
                  className="pagination-button"
                  onClick={() => getPaginationProps().onPageChange(paginationInfo.currentPage - 1)}
                  disabled={!paginationInfo.hasPreviousPage}
                >
                  Anterior
                </button>
                {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-button ${page === paginationInfo.currentPage ? 'active' : ''}`}
                    onClick={() => getPaginationProps().onPageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  className="pagination-button"
                  onClick={() => getPaginationProps().onPageChange(paginationInfo.currentPage + 1)}
                  disabled={!paginationInfo.hasNextPage}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Demo del hook useForm con validación
  const FormDemo = () => {
    const {
      values,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      isValid,
      getFieldProps
    } = useForm(
      {
        nombre: '',
        email: '',
        radicado: '',
        departamento: '',
        comentarios: ''
      },
      {
        validation: {
          nombre: validators.nombre,
          email: validators.email,
          radicado: validators.radicado,
          departamento: validators.required,
          comentarios: {
            maxLength: 500,
            maxLengthMessage: 'Máximo 500 caracteres'
          }
        },
        onSubmit: async (data) => {
          // Simular envío
          await new Promise(resolve => setTimeout(resolve, 2000))
          toast.success('Éxito', 'Formulario enviado correctamente')
          console.log('Datos enviados:', data)
        }
      }
    )

    return (
      <div className="space-y-6">
        <h3 className="text-heading-h3 font-semibold">Demo: Hook useForm con Validación Avanzada</h3>
        
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-section">
            <h4 className="form-section-title">Información Personal</h4>
            
            <div className="form-row">
              <RealTimeValidation
                validation={validators.nombre}
                value={values.nombre}
                onValidationChange={(state) => console.log('Validación nombre:', state)}
              >
                <input
                  type="text"
                  placeholder="Ingresa tu nombre completo"
                  {...getFieldProps('nombre')}
                  className="form-input"
                />
              </RealTimeValidation>

              <RealTimeValidation
                validation={validators.email}
                value={values.email}
              >
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...getFieldProps('email')}
                  className="form-input"
                />
              </RealTimeValidation>
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-section-title">Información de Consulta</h4>
            
            <div className="form-row">
              <RealTimeValidation
                validation={validators.radicado}
                value={values.radicado}
              >
                <input
                  type="text"
                  placeholder="Número de radicado (5-23 dígitos)"
                  {...getFieldProps('radicado')}
                  className="form-input"
                />
              </RealTimeValidation>

              <div className="form-group">
                <select
                  {...getFieldProps('departamento')}
                  className="form-input"
                >
                  <option value="">Selecciona departamento</option>
                  <option value="cundinamarca">Cundinamarca</option>
                  <option value="antioquia">Antioquia</option>
                  <option value="valle">Valle del Cauca</option>
                </select>
                {errors.departamento && (
                  <div className="error-text">{errors.departamento}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Comentarios adicionales</label>
              <textarea
                rows="4"
                placeholder="Describe detalles adicionales de tu consulta..."
                {...getFieldProps('comentarios')}
                className="form-input"
              />
              <div className="helper-text">
                {values.comentarios.length}/500 caracteres
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => window.history.back()}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Crear Solicitud'}
            </button>
          </div>
        </form>

        {/* Estado del formulario */}
        <div className="p-4 bg-bg-light rounded-md">
          <h5 className="font-medium mb-2">Estado del Formulario:</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>✅ Válido: {isValid ? 'Sí' : 'No'}</div>
            <div>📝 Enviando: {isSubmitting ? 'Sí' : 'No'}</div>
            <div>❌ Errores: {Object.keys(errors).filter(key => errors[key]).length}</div>
            <div>📊 Campos completados: {Object.values(values).filter(Boolean).length}/5</div>
          </div>
        </div>
      </div>
    )
  }

  // Demo de estados vacíos
  const EmptyStatesDemo = () => {
    const [emptyType, setEmptyType] = useState('noSolicitudes')

    const emptyTypes = [
      { key: 'noSolicitudes', label: 'Sin Solicitudes' },
      { key: 'searchEmpty', label: 'Búsqueda Vacía' },
      { key: 'connectionError', label: 'Error de Conexión' },
      { key: 'firstTime', label: 'Primera Vez' },
      { key: 'loading', label: 'Cargando' }
    ]

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-heading-h3 font-semibold">Demo: Estados Vacíos</h3>
          <select 
            value={emptyType}
            onChange={(e) => setEmptyType(e.target.value)}
            className="form-input max-w-48"
          >
            {emptyTypes.map(type => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="border border-border-default rounded-md min-h-96">
          <EmptyState.Preset 
            preset={emptyType}
            onAction={(action, e) => {
              toast.success('Acción ejecutada', `Botón clickeado: ${action}`)
            }}
          />
        </div>
      </div>
    )
  }

  // Demo de progress steps
  const ProgressDemo = () => {
    const [currentStep, setCurrentStep] = useState(2)
    const [searchState, setSearchState] = useState({
      status: 'searching',
      progress: 60,
      totalJuzgados: 5,
      resultsFound: 0
    })

    const steps = [
      { title: 'Configuración', description: 'Datos de la consulta' },
      { title: 'Validación', description: 'Verificar información' },
      { title: 'Procesamiento', description: 'Ejecutando consulta' },
      { title: 'Resultados', description: 'Consulta completada' }
    ]

    const simulateSearchProgress = () => {
      const states = [
        { status: 'connecting', progress: 0 },
        { status: 'authenticating', progress: 25 },
        { status: 'searching', progress: 60, totalJuzgados: 5 },
        { status: 'processing', progress: 90, resultsFound: 12 },
        { status: 'completed', progress: 100, resultsFound: 12 }
      ]

      let index = 0
      const interval = setInterval(() => {
        if (index < states.length) {
          setSearchState(prev => ({ ...prev, ...states[index] }))
          index++
        } else {
          clearInterval(interval)
        }
      }, 1500)
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-heading-h3 font-semibold">Demo: Progress Steps</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              className="btn btn-secondary"
              disabled={currentStep === 0}
            >
              Anterior
            </button>
            <button 
              onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
              className="btn btn-secondary"
              disabled={currentStep === 3}
            >
              Siguiente
            </button>
            <button 
              onClick={simulateSearchProgress}
              className="btn btn-primary"
            >
              Simular Búsqueda
            </button>
          </div>
        </div>

        {/* Progress Steps Horizontal */}
        <div className="card">
          <h4 className="text-heading-h4 font-medium mb-4">Progreso Horizontal</h4>
          <ProgressSteps
            steps={steps}
            currentStep={currentStep}
            completedSteps={Array.from({ length: currentStep }, (_, i) => i)}
            showProgress
          />
        </div>

        {/* Progress Steps para Búsqueda */}
        <div className="card">
          <h4 className="text-heading-h4 font-medium mb-4">Progreso de Búsqueda</h4>
          <ProgressSteps.Search 
            searchState={searchState}
          />
        </div>

        {/* Progress Steps Vertical */}
        <div className="card">
          <h4 className="text-heading-h4 font-medium mb-4">Progreso Vertical</h4>
          <ProgressSteps
            steps={steps.map((step, index) => ({
              ...step,
              time: index <= currentStep ? '✓ Completado' : 'Pendiente'
            }))}
            currentStep={currentStep}
            completedSteps={Array.from({ length: currentStep }, (_, i) => i)}
            variant="vertical"
          />
        </div>

        {/* Linear Progress */}
        <div className="card">
          <h4 className="text-heading-h4 font-medium mb-4">Progreso Lineal</h4>
          <ProgressSteps.Linear
            value={searchState.progress}
            max={100}
            showLabel
            label={`${searchState.progress}% completado`}
          />
        </div>
      </div>
    )
  }

  const demos = {
    table: { component: TableDemo, title: 'Tabla Avanzada' },
    form: { component: FormDemo, title: 'Formulario con Validación' },
    empty: { component: EmptyStatesDemo, title: 'Estados Vacíos' },
    progress: { component: ProgressDemo, title: 'Progress Steps' }
  }

  const ActiveComponent = demos[activeDemo].component

  return (
    <div className="container">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Demo Avanzado</h1>
          <p className="page-subtitle">
            Demostración de componentes y hooks avanzados del sistema
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 mb-8 p-1 bg-bg-light rounded-md">
        {Object.entries(demos).map(([key, demo]) => (
          <button
            key={key}
            onClick={() => setActiveDemo(key)}
            className={`px-4 py-2 rounded-sm transition-all duration-200 ${
              activeDemo === key 
                ? 'bg-interactive-default text-text-base shadow-sm' 
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-canvas'
            }`}
          >
            {demo.title}
          </button>
        ))}
      </div>

      {/* Demo Content */}
      <ActiveComponent />
    </div>
  )
}

export default AdvancedDemoPage
