// src/pages/solicitudes/RamaJudicialAdvancedPage.jsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, CheckCircle, ExternalLink, Home, 
  FileText, Clock, Zap
} from 'lucide-react'

// Componentes
import { RamaJudicialAdvancedForm, RamaJudicialPreview } from '../../components/advanced-query'
import LoadingStates from '../../components/advanced-query/LoadingStates'
import FormSuccess from '../../components/advanced-query/FormSuccess'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

/**
 * 🏛️ RamaJudicialAdvancedPage - Página completa de consulta avanzada oficial
 * 
 * Flujo completo de creación de consulta avanzada que replica exactamente
 * los criterios de búsqueda de la página oficial de la Rama Judicial.
 * 
 * Flujo: Formulario → Preview → Loading → Success
 */
const RamaJudicialAdvancedPage = () => {
  const navigate = useNavigate()
  
  // Estados del flujo
  const [currentStep, setCurrentStep] = useState('form') // form | preview | loading | success
  const [formData, setFormData] = useState(null)
  const [solicitudCreada, setSolicitudCreada] = useState(null)

  // Handlers del flujo
  const handleBack = () => {
    navigate('/solicitudes/nuevo')
  }

  const handleFormComplete = (data) => {
    setFormData(data)
    setCurrentStep('preview')
  }

  const handleBackToForm = () => {
    setCurrentStep('form')
  }

  const handleConfirmCreate = () => {
    setCurrentStep('loading')
  }

  const handleLoadingComplete = () => {
    // Simular datos de la solicitud creada
    const nuevaSolicitud = {
      id: Date.now().toString(),
      tipo: 'rama_judicial_avanzada',
      nombre: `Consulta: ${formData.data.nombreRazonSocial}`,
      tipoPersona: formData.data.tipoPersona,
      sujetoProcesal: formData.data.sujetoProcesal,
      filtrosAplicados: formData.selectionPath || 'Sin filtros de jurisdicción',
      fechaCreacion: new Date().toISOString(),
      estado: 'pendiente',
      estimatedDuration: formData.data.sujetoProcesal === 'recientes' ? '1-2 minutos' : '2-8 minutos'
    }
    
    setSolicitudCreada(nuevaSolicitud)
    setCurrentStep('success')
  }

  const handleViewDashboard = () => {
    navigate('/dashboard')
  }

  const handleCreateAnother = () => {
    setCurrentStep('form')
    setFormData(null)
    setSolicitudCreada(null)
  }

  const handleViewRamaJudicial = () => {
    window.open('https://consultaprocesos.ramajudicial.gov.co/Procesos/NombreRazonSocial', '_blank')
  }

  // Componente personalizado de loading para la Rama Judicial
  const RamaJudicialLoading = () => (
    <div className="max-w-4xl mx-auto">
      <Card size="lg">
        <Card.Content>
          <div className="text-center py-xl">
            <div className="flex justify-center mb-lg">
              <div className="relative">
                <div className="w-16 h-16 bg-interactive-default rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-feedback-success rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-heading-h2 font-heading text-text-primary mb-sm">
              Conectando con la Rama Judicial
            </h2>
            <p className="text-body-paragraph text-text-secondary mb-lg">
              Configurando tu consulta automatizada en el sistema oficial...
            </p>

            {/* Indicador de progreso */}
            <div className="space-y-md mb-lg">
              <div className="flex items-center justify-center gap-sm">
                <div className="w-2 h-2 bg-interactive-default rounded-full animate-pulse"></div>
                <span className="text-body-auxiliary text-text-secondary">
                  Validando criterios de búsqueda
                </span>
              </div>
              <div className="flex items-center justify-center gap-sm">
                <div className="w-2 h-2 bg-interactive-default rounded-full animate-pulse delay-75"></div>
                <span className="text-body-auxiliary text-text-secondary">
                  Configurando bot automatizado
                </span>
              </div>
              <div className="flex items-center justify-center gap-sm">
                <div className="w-2 h-2 bg-interactive-default rounded-full animate-pulse delay-150"></div>
                <span className="text-body-auxiliary text-text-secondary">
                  Preparando ejecución
                </span>
              </div>
            </div>

            {/* Tiempo estimado */}
            <div className="p-md bg-feedback-info-light border border-feedback-info rounded-md">
              <div className="flex items-center justify-center gap-sm">
                <Clock className="w-4 h-4 text-feedback-info" />
                <span className="text-body-auxiliary text-feedback-info">
                  Tiempo estimado: {formData?.data?.sujetoProcesal === 'recientes' ? '1-2 minutos' : '2-8 minutos'}
                </span>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )

  // Componente personalizado de éxito
  const RamaJudicialSuccess = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-xl">
        <div className="flex justify-center mb-lg">
          <div className="w-20 h-20 bg-feedback-success rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-heading-h1 font-heading text-text-primary mb-sm">
          ¡Consulta Creada Exitosamente!
        </h1>
        <p className="text-body-paragraph text-text-secondary">
          Tu consulta automatizada ha sido configurada y comenzará a ejecutarse en unos momentos
        </p>
      </div>

      <Card size="lg" className="mb-lg">
        <Card.Header>
          <Card.Title>
            Detalles de la Consulta Creada
          </Card.Title>
        </Card.Header>
        
        <Card.Content>
          <div className="space-y-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <span className="text-body-auxiliary text-text-secondary block">
                  Nombre o Razón Social:
                </span>
                <span className="text-body-paragraph font-medium text-text-base">
                  {formData?.data?.nombreRazonSocial}
                </span>
              </div>
              
              <div>
                <span className="text-body-auxiliary text-text-secondary block">
                  Tipo de Persona:
                </span>
                <span className="text-body-paragraph font-medium text-text-base">
                  {formData?.data?.tipoPersona === 'natural' ? 'Persona Natural' : 'Persona Jurídica'}
                </span>
              </div>
              
              <div>
                <span className="text-body-auxiliary text-text-secondary block">
                  Tipo de Búsqueda:
                </span>
                <span className="text-body-paragraph font-medium text-text-base">
                  {formData?.data?.sujetoProcesal === 'recientes' ? 'Procesos Recientes' : 'Todos los Procesos'}
                </span>
              </div>
              
              <div>
                <span className="text-body-auxiliary text-text-secondary block">
                  Tiempo Estimado:
                </span>
                <span className="text-body-paragraph font-medium text-text-base">
                  {solicitudCreada?.estimatedDuration}
                </span>
              </div>
            </div>

            {formData?.selectionPath && (
              <div className="mt-md p-md bg-interactive-default bg-opacity-10 border border-interactive-default rounded-md">
                <span className="text-body-auxiliary text-interactive-default block mb-xs">
                  Filtros de Jurisdicción Aplicados:
                </span>
                <span className="text-body-paragraph text-text-base">
                  {formData.selectionPath}
                </span>
              </div>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Acciones siguientes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        <Button
          variant="primary"
          onClick={handleViewDashboard}
          className="flex items-center gap-sm justify-center"
        >
          <Home className="w-4 h-4" />
          Ver Dashboard
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleCreateAnother}
          className="flex items-center gap-sm justify-center"
        >
          <FileText className="w-4 h-4" />
          Crear Otra Consulta
        </Button>
        
        <Button
          variant="ghost"
          onClick={handleViewRamaJudicial}
          className="flex items-center gap-sm justify-center"
        >
          <ExternalLink className="w-4 h-4" />
          Ver Rama Judicial
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg-light">
      <div className="container mx-auto px-md md:px-lg py-lg">
        {/* Breadcrumb / Navigation */}
        <div className="mb-lg">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-sm mb-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Tipos de Consulta
          </Button>

          {/* Indicador de paso */}
          <div className="flex items-center gap-sm text-body-auxiliary text-text-secondary">
            <span>Consultas</span>
            <span>→</span>
            <span>Nueva Consulta</span>
            <span>→</span>
            <span className="text-interactive-default font-medium">
              Consulta por Nombre (Rama Judicial)
            </span>
          </div>
        </div>

        {/* Contenido según el paso actual */}
        {currentStep === 'form' && (
          <RamaJudicialAdvancedForm
            onBack={handleBack}
            onComplete={handleFormComplete}
          />
        )}

        {currentStep === 'preview' && formData && (
          <RamaJudicialPreview
            data={formData.data}
            onEdit={handleBackToForm}
            onConfirm={handleConfirmCreate}
          />
        )}

        {currentStep === 'loading' && (
          <RamaJudicialLoading />
        )}

        {currentStep === 'success' && (
          <RamaJudicialSuccess />
        )}
      </div>

      {/* Auto-advance del loading */}
      {currentStep === 'loading' && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(() => {
                // Este script se ejecutará después de 3 segundos
                // En una implementación real, esto sería manejado por el componente React
              }, 3000);
            `
          }}
        />
      )}
      
      {/* Trigger automático del loading complete */}
      {currentStep === 'loading' && (
        <div style={{ display: 'none' }}>
          {setTimeout(handleLoadingComplete, 3000)}
        </div>
      )}
    </div>
  )
}

export default RamaJudicialAdvancedPage