import React, { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
// 🎨 UPDATED: Importar componentes mejorados
import EnhancedHistorialFilters from '../../components/historial/SmartFiltersEnhanced'
import HistorialTable from '../../components/historial/HistorialTable'
import HistorialDetailModal from '../../components/historial/HistorialDetailModal'
import HistorialEmptyState from '../../components/historial/HistorialEmptyState'
import { 
  HistorialTableSkeleton, 
  ProgressiveLoader, 
  SmartRefreshIndicator,
  TransitionWrapper,
  HoverCard,
  PulseOnUpdate
} from '../../components/historial/EnhancedLoadingStates'
import { useHistorialWithFilters, useHistorialPDF } from '../../hooks/useHistorial'
import { useSolicitudes } from '../../hooks/useSolicitudes'
import { useToast } from '../../components/ui/Toast'

const HistorialPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  
  // 🆕 Detectar si venimos desde el dashboard con filtros específicos
  const solicitudIdFromUrl = searchParams.get('solicitud')
  const nombreFromUrl = searchParams.get('nombre')
  
  // Estados del modal
  const [selectedHistorialItem, setSelectedHistorialItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString())
  
  // Hook para obtener solicitudes (para filtros)
  const { solicitudes } = useSolicitudes({ limit: 100 })
  
  // 🆕 Configurar filtros iniciales basados en URL
  const initialFilters = {
    solicitudId: solicitudIdFromUrl || '',
    fechaDesde: '',
    fechaHasta: ''
  }
  
  // Hook principal de historial con filtros integrados
  const {
    // Estado actual
    currentPage,
    itemsPerPage,
    filters,
    searchTerm,
    
    // Datos del historial
    historialData,
    totalItems,
    hasMore,
    isLoading,
    isFetching,
    isError,
    error,
    
    // Funciones de control
    updateFilters,
    updateSearch,
    changePage,
    clearAllFilters,
    refreshHistorial
  } = useHistorialWithFilters({
    currentPage: 1,
    itemsPerPage: 10,
    filters: initialFilters, // 🆕 Usar filtros de URL
    searchTerm: ''
  })
  
  // Hook para descargar PDFs
  const { downloadPDF, isDownloading } = useHistorialPDF()
  
  // 🎯 ENHANCED HANDLERS con mejores transiciones
  const handleViewDetails = (historialItem) => {
    setSelectedHistorialItem(historialItem)
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setSelectedHistorialItem(null)
    setIsModalOpen(false)
  }
  
  const handleDownloadPDF = async (historialItem) => {
    try {
      await downloadPDF(historialItem.id)
      toast.success('Descarga iniciada', 'El PDF se descargará en breve')
    } catch (error) {
      console.error('Error descargando PDF:', error)
      toast.error('Error', 'No se pudo generar el PDF')
    }
  }
  
  const handleCreateSolicitud = () => {
    navigate('/solicitudes/select-type')
  }
  
  // 🔄 ENHANCED REFRESH con indicador de última actualización
  const handleRefresh = async () => {
    try {
      await refreshHistorial()
      setLastUpdated(new Date().toISOString())
      toast.success('Actualizado', 'Historial actualizado correctamente')
    } catch (error) {
      toast.error('Error', 'No se pudo actualizar el historial')
    }
  }
  
  // 🆕 Mostrar breadcrumb mejorado con animaciones
  const renderBreadcrumb = () => {
    if (solicitudIdFromUrl && nombreFromUrl) {
      return (
        <TransitionWrapper isVisible={true} type="slide" className="mb-lg">
          <HoverCard className="p-lg bg-interactive-default bg-opacity-5 border border-interactive-default border-opacity-20 rounded-lg">
            <div className="flex items-center gap-sm text-body-paragraph">
              <Link 
                to="/dashboard" 
                className="text-interactive-default hover:text-interactive-hover transition-colors font-medium"
              >
                Dashboard
              </Link>
              <span className="text-text-secondary">→</span>
              <span className="text-text-secondary">Historial</span>
              <span className="text-text-secondary">→</span>
              <span className="font-medium text-text-primary">
                {decodeURIComponent(nombreFromUrl)}
              </span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-sm text-body-auxiliary text-interactive-default hover:text-interactive-hover underline transition-colors"
            >
              ← Volver al Dashboard
            </button>
          </HoverCard>
        </TransitionWrapper>
      )
    }
    return null
  }
  
  // Determinar qué mostrar
  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchTerm !== ''
  const hasData = historialData.length > 0
  const isFirstLoad = !hasData && !hasActiveFilters && !isLoading
  
  // 🎨 ENHANCED CONTENT RENDERING con mejor UX
  const renderMainContent = () => {
    // Error state
    if (isError) {
      return (
        <TransitionWrapper isVisible={true} type="fade">
          <HistorialEmptyState.Error onRefresh={handleRefresh} />
        </TransitionWrapper>
      )
    }
    
    // Loading state con skeleton mejorado
    if (isLoading && isFirstLoad) {
      return (
        <TransitionWrapper isVisible={true} type="fade">
          <HistorialTableSkeleton rows={itemsPerPage} />
        </TransitionWrapper>
      )
    }
    
    // Estado: Usuario nuevo sin historial
    if (isFirstLoad && !hasData) {
      return (
        <TransitionWrapper isVisible={true} type="scale">
          <HistorialEmptyState.NoHistorial
            onCreateSolicitud={handleCreateSolicitud}
            onRefresh={handleRefresh}
          />
        </TransitionWrapper>
      )
    }
    
    // Estado: Filtros/búsqueda sin resultados
    if (!hasData && hasActiveFilters) {
      if (searchTerm) {
        return (
          <TransitionWrapper isVisible={true} type="fade">
            <HistorialEmptyState.SearchEmpty
              searchTerm={searchTerm}
              onClearFilters={clearAllFilters}
            />
          </TransitionWrapper>
        )
      } else {
        return (
          <TransitionWrapper isVisible={true} type="fade">
            <HistorialEmptyState.FiltrosEmpty
              hasFilters={true}
              onClearFilters={clearAllFilters}
              onRefresh={handleRefresh}
            />
          </TransitionWrapper>
        )
      }
    }
    
    // Estado: Datos disponibles con loading overlay si está refrescando
    if (hasData) {
      return (
        <ProgressiveLoader 
          isLoading={isFetching && !isLoading}
          message="Actualizando datos..."
        >
          <TransitionWrapper isVisible={true} type="fade">
            <HistorialTable
              data={historialData}
              isLoading={false} // No mostrar loading en tabla si tenemos datos
              onViewDetails={handleViewDetails}
              onDownload={handleDownloadPDF}
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={changePage}
            />
          </TransitionWrapper>
        </ProgressiveLoader>
      )
    }
    
    // Fallback
    return (
      <TransitionWrapper isVisible={true} type="fade">
        <HistorialEmptyState type="empty" onRefresh={handleRefresh} />
      </TransitionWrapper>
    )
  }
  
  return (
    <Layout>
      <div className="container">
        
        {/* 🎨 ENHANCED HEADER con animaciones */}
        <TransitionWrapper isVisible={true} type="slide">
          <div className="dashboard-header">
            <div>
              <PulseOnUpdate value={totalItems}>
                <h1 className="text-heading-h1 font-heading text-text-primary">
                  Historial de Resultados
                  {nombreFromUrl && (
                    <span className="text-heading-h3 font-normal text-text-secondary ml-sm">
                      - {decodeURIComponent(nombreFromUrl)}
                    </span>
                  )}
                </h1>
              </PulseOnUpdate>
              <p className="text-body-paragraph text-text-secondary mt-sm">
                {solicitudIdFromUrl 
                  ? `Historial filtrado para la solicitud seleccionada`
                  : 'Consulta el historial detallado de resultados de tus solicitudes'
                }
              </p>
            </div>
          </div>
        </TransitionWrapper>

        {/* 🆕 Breadcrumb para navegación contextual */}
        {renderBreadcrumb()}
        
        {/* 🧠 SMART FILTERS - Componente mejorado */}
        <TransitionWrapper isVisible={true} type="slide" className="mb-xl">
          <EnhancedHistorialFilters
            solicitudes={solicitudes}
            onFiltersChange={updateFilters}
            onSearchChange={updateSearch}
            initialFilters={filters}
            initialSearchTerm={searchTerm}
            isLoading={isLoading}
          />
        </TransitionWrapper>
        
        {/* 🎯 RESULTS SECTION con indicador de refresh */}
        <div className="bg-bg-canvas rounded-lg border border-border-default shadow-sm overflow-hidden">
          {/* Smart refresh indicator */}
          <SmartRefreshIndicator
            isRefreshing={isFetching}
            lastUpdated={lastUpdated}
            onRefresh={handleRefresh}
          />
          
          {/* Header de resultados mejorado */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-lg border-b border-border-default">
            <div className="mb-sm sm:mb-0">
              <h3 className="text-heading-h3 font-heading text-text-primary">
                Resultados Históricos
              </h3>
              {totalItems > 0 && (
                <PulseOnUpdate value={totalItems}>
                  <p className="text-body-auxiliary text-text-secondary mt-xs">
                    {totalItems.toLocaleString()} resultado{totalItems !== 1 ? 's' : ''} encontrado{totalItems !== 1 ? 's' : ''}
                    {hasActiveFilters && ' con filtros aplicados'}
                  </p>
                </PulseOnUpdate>
              )}
            </div>
            
            <div className="flex items-center space-x-sm">
              {/* Indicadores de estado */}
              {isLoading && (
                <div className="flex items-center space-x-xs text-body-auxiliary text-text-secondary">
                  <div className="w-3 h-3 border border-interactive-default border-t-transparent rounded-full animate-spin" />
                  <span>Cargando...</span>
                </div>
              )}
              
              {isFetching && !isLoading && (
                <div className="flex items-center space-x-xs text-body-auxiliary text-interactive-default">
                  <div className="w-3 h-3 border border-interactive-default border-t-transparent rounded-full animate-spin" />
                  <span>Actualizando...</span>
                </div>
              )}
            </div>
          </div>
          
          {/* 🎨 MAIN CONTENT con transiciones mejoradas */}
          <div className="min-h-96">
            {renderMainContent()}
          </div>
        </div>
        
        {/* 🔍 MODAL DE DETALLES con mejor UX */}
        <HistorialDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          historialItem={selectedHistorialItem}
          onDownloadPDF={handleDownloadPDF}
          isDownloading={isDownloading}
        />
        
        {/* 💡 TIPS SECTION - Información útil para el usuario */}
        <TransitionWrapper isVisible={hasData} type="fade" className="mt-xl">
          <div className="bg-interactive-default bg-opacity-5 border border-interactive-default border-opacity-20 rounded-lg p-lg">
            <div className="flex items-start gap-sm">
              <div className="w-5 h-5 text-interactive-default flex-shrink-0 mt-xs">
                💡
              </div>
              <div>
                <h4 className="text-body-paragraph font-medium text-text-primary mb-xs">
                  Tips para una mejor experiencia
                </h4>
                <ul className="text-body-auxiliary text-text-secondary space-y-xs">
                  <li>• Usa los filtros de fecha para encontrar consultas específicas más rápido</li>
                  <li>• La búsqueda inteligente sugiere opciones mientras escribes</li>
                  <li>• Haz clic en "Ver detalles" para información completa del proceso judicial</li>
                  <li>• Los datos se actualizan automáticamente cada 5 minutos</li>
                </ul>
              </div>
            </div>
          </div>
        </TransitionWrapper>
      </div>
    </Layout>
  )
}

export default HistorialPage