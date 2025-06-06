import React, { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { BarChart3, Eye, Settings, RefreshCw, Plus, AlertTriangle, TrendingUp, Wrench } from 'lucide-react'
import Button from '../../components/ui/Button'
import { useSolicitudes } from '../../hooks/useSolicitudes'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../utils/cn'

/**
 * 🚀 HISTORIAL PAGE - VERSIÓN SIMPLIFICADA TEMPORAL
 * Versión básica mientras solucionamos las dependencias
 */
const HistorialPageEnhanced = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('historial')
  
  // 🔍 Detectar parámetros de URL
  const solicitudIdFromUrl = searchParams.get('solicitud')
  const nombreFromUrl = searchParams.get('nombre')
  
  // 📊 Hook para obtener solicitudes básico
  const { solicitudes, isLoading, error, refetch } = useSolicitudes({ limit: 100 })
  
  // 🎯 Handlers básicos
  const handleRefresh = () => {
    refetch()
    toast.info('Actualizando', 'Cargando últimos datos...')
  }
  
  const handleCreateSolicitud = () => {
    navigate('/solicitudes/select-type')
  }

  // 🎨 Renderizado del breadcrumb
  const renderBreadcrumb = () => {
    if (solicitudIdFromUrl && nombreFromUrl) {
      return (
        <div className="mb-lg p-sm bg-interactive-default bg-opacity-10 border border-interactive-default border-opacity-30 rounded-lg">
          <div className="flex items-center gap-sm text-body-auxiliary">
            <Link to="/dashboard" className="text-interactive-default hover:text-interactive-hover transition-colors">
              Dashboard
            </Link>
            <span className="text-text-secondary">→</span>
            <span className="text-text-secondary">Historial</span>
            <span className="text-text-secondary">→</span>
            <span className="font-medium text-interactive-default">
              {decodeURIComponent(nombreFromUrl)}
            </span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-xs text-body-auxiliary text-interactive-default hover:text-interactive-hover underline transition-colors"
          >
            ← Volver al Dashboard
          </button>
        </div>
      )
    }
    return null
  }

  return (
    <div className="container max-w-7xl mx-auto">
      
      {/* 🎯 Header del Dashboard */}
      <div className="dashboard-header">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-lg">
          <div>
            <h1 className="page-title">
              Historial de Resultados
              {nombreFromUrl && (
                <span className="text-lg font-normal text-text-secondary ml-sm">
                  - {decodeURIComponent(nombreFromUrl)}
                </span>
              )}
            </h1>
            <p className="page-subtitle">
              {solicitudIdFromUrl 
                ? `Historial filtrado para la solicitud seleccionada`
                : 'Consulta el historial detallado y analytics de tus solicitudes'
              }
            </p>
          </div>

          {/* 🎛️ Controles principales */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-sm">
            
            {/* Toggle de vista */}
            <div className="flex items-center bg-bg-light rounded-lg p-xs border border-border-default">
              <button
                onClick={() => setViewMode('historial')}
                className={cn(
                  'flex items-center space-x-xs px-sm py-xs rounded-md transition-all duration-200',
                  viewMode === 'historial'
                    ? 'bg-interactive-default text-text-base shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-canvas'
                )}
              >
                <Eye className="w-4 h-4" />
                <span className="text-body-auxiliary font-medium">Historial</span>
              </button>
              
              <button
                onClick={() => setViewMode('analytics')}
                className={cn(
                  'flex items-center space-x-xs px-sm py-xs rounded-md transition-all duration-200',
                  viewMode === 'analytics'
                    ? 'bg-interactive-default text-text-base shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-canvas'
                )}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-body-auxiliary font-medium">Analytics</span>
              </button>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                icon={<RefreshCw className="w-4 h-4" />}
                disabled={isLoading}
                className="text-text-secondary hover:text-text-primary"
              >
                Actualizar
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateSolicitud}
                icon={<Plus className="w-4 h-4" />}
              >
                Nueva Consulta
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 Breadcrumb para navegación contextual */}
      {renderBreadcrumb()}
      
      {/* 📊 Contenido Principal */}
      <div className="bg-bg-canvas rounded-lg border border-border-default shadow-sm overflow-hidden">
        
        {/* Header de la sección */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-lg border-b border-border-default">
          <div>
            <h3 className="text-heading-h3 font-heading text-text-primary">
              {viewMode === 'analytics' ? 'Dashboard de Analytics' : 'Resultados Históricos'}
            </h3>
            <p className="text-body-auxiliary text-text-secondary mt-xs">
              {viewMode === 'analytics' 
                ? 'Insights y tendencias de tus consultas judiciales'
                : `Historial de resultados de consultas automatizadas`
              }
            </p>
          </div>
        </div>
        
        {/* 🎯 Contenido dinámico */}
        <div className="min-h-[600px] p-lg">
          {error ? (
            <div className="text-center py-xl">
              <AlertTriangle className="w-12 h-12 text-feedback-error mx-auto mb-md" />
              <h3 className="text-heading-h3 text-feedback-error mb-sm">Error al cargar historial</h3>
              <p className="text-text-secondary mb-lg">
                No se pudieron cargar los datos del historial. Intenta nuevamente.
              </p>
              <Button
                variant="primary"
                onClick={handleRefresh}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Reintentar
              </Button>
            </div>
          ) : isLoading ? (
            <div className="text-center py-xl">
              <div className="loading-spinner mx-auto mb-lg"></div>
              <h3 className="text-heading-h3 text-text-primary mb-sm">Cargando historial...</h3>
              <p className="text-text-secondary">
                Obteniendo los últimos resultados de tus consultas
              </p>
            </div>
          ) : (
            <div className="text-center py-xl">
              <TrendingUp className="w-16 h-16 text-interactive-default mx-auto mb-lg" />
              <h3 className="text-heading-h3 text-text-primary mb-sm">
                Página de Historial en Desarrollo
              </h3>
              <p className="text-text-secondary mb-lg max-w-md mx-auto">
                Esta página mostrará el historial completo de resultados de tus consultas automatizadas. 
                Las funcionalidades avanzadas están siendo implementadas.
              </p>
              <div className="flex flex-col sm:flex-row gap-sm justify-center">
                <Button
                  variant="primary"
                  onClick={handleCreateSolicitud}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Crear Nueva Consulta
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Volver al Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 📱 Información temporal de desarrollo */}
      <div className="mt-xl p-lg bg-feedback-info bg-opacity-10 border border-feedback-info border-opacity-30 rounded-lg">
        <div className="flex items-start space-x-sm">
          <Wrench className="w-5 h-5 text-feedback-info flex-shrink-0 mt-xs" />
          <div>
            <h4 className="text-body-paragraph font-medium text-feedback-info mb-xs">
              Página en Desarrollo
            </h4>
            <p className="text-body-auxiliary text-text-secondary">
              El historial completo con filtros avanzados, analytics y configuraciones está siendo implementado. 
              Por ahora puedes crear nuevas consultas desde el dashboard.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  )
}

HistorialPageEnhanced.displayName = 'HistorialPageEnhanced'

export default HistorialPageEnhanced