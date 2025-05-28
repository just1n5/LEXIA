import React, { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import HistorialFilters from '../../components/historial/HistorialFilters'
import HistorialTable from '../../components/historial/HistorialTable'
import HistorialDetailModal from '../../components/historial/HistorialDetailModal'
import HistorialEmptyState from '../../components/historial/HistorialEmptyState'
import SearchInput from '../../components/ui/SearchInput'
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
  
  // Handlers de eventos
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
  
  const handleRefresh = () => {
    refreshHistorial()
    toast.info('Actualizando', 'Cargando últimos datos...')
  }
  
  // 🆕 Mostrar breadcrumb si venimos de una solicitud específica
  const renderBreadcrumb = () => {
    if (solicitudIdFromUrl && nombreFromUrl) {
      return (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 transition-colors">
              Dashboard
            </Link>
            <span className="text-gray-400">→</span>
            <span className="text-gray-600">Historial</span>
            <span className="text-gray-400">→</span>
            <span className="font-medium text-blue-800">
              {decodeURIComponent(nombreFromUrl)}
            </span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline transition-colors"
          >
            ← Volver al Dashboard
          </button>
        </div>
      )
    }
    return null
  }
  
  // Determinar qué mostrar
  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchTerm !== ''
  const hasData = historialData.length > 0
  const isFirstLoad = !hasData && !hasActiveFilters && !isLoading
  
  // Renderizado condicional del contenido principal
  const renderMainContent = () => {
    // Error state
    if (isError) {
      return (
        <HistorialEmptyState.Error
          onRefresh={handleRefresh}
        />
      )
    }
    
    // Loading state (solo en primera carga)
    if (isLoading && isFirstLoad) {
      return (
        <HistorialEmptyState.Loading />
      )
    }
    
    // Estado: Usuario nuevo sin historial
    if (isFirstLoad && !hasData) {
      return (
        <HistorialEmptyState.NoHistorial
          onCreateSolicitud={handleCreateSolicitud}
          onRefresh={handleRefresh}
        />
      )
    }
    
    // Estado: Filtros/búsqueda sin resultados
    if (!hasData && hasActiveFilters) {
      if (searchTerm) {
        return (
          <HistorialEmptyState.SearchEmpty
            searchTerm={searchTerm}
            onClearFilters={clearAllFilters}
          />
        )
      } else {
        return (
          <HistorialEmptyState.FiltrosEmpty
            hasFilters={true}
            onClearFilters={clearAllFilters}
            onRefresh={handleRefresh}
          />
        )
      }
    }
    
    // Estado: Datos disponibles - mostrar tabla
    if (hasData) {
      return (
        <HistorialTable
          data={historialData}
          isLoading={isFetching}
          onViewDetails={handleViewDetails}
          onDownload={handleDownloadPDF}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={changePage}
        />
      )
    }
    
    // Fallback
    return (
      <HistorialEmptyState
        type="empty"
        onRefresh={handleRefresh}
      />
    )
  }
  
  return (
    <Layout>
      <div className="container">
        
        {/* Header del Dashboard */}
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">
              Historial de Resultados
              {nombreFromUrl && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                  - {decodeURIComponent(nombreFromUrl)}
                </span>
              )}
            </h1>
            <p className="page-subtitle">
              {solicitudIdFromUrl 
                ? `Historial filtrado para la solicitud seleccionada`
                : 'Consulta el historial detallado de resultados de tus solicitudes'
              }
            </p>
          </div>
        </div>

        {/* 🆕 Breadcrumb para navegación contextual */}
        {renderBreadcrumb()}
        
        {/* Filtros de Búsqueda */}
        <HistorialFilters
          solicitudes={solicitudes}
          onFiltersChange={updateFilters}
          onSearchChange={updateSearch}
          initialFilters={filters}
          initialSearchTerm={searchTerm}
          isLoading={isLoading}
          className="mb-6"
        />
        
        {/* Sección de Resultados con Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Header de resultados con búsqueda adicional */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
              Resultados Históricos
            </h3>
            <div className="flex items-center space-x-4">
              {/* Búsqueda rápida adicional */}
              <SearchInput
                placeholder="Buscar en resultados..."
                value={searchTerm}
                onSearch={updateSearch}
                disabled={isLoading}
                size="sm"
                className="w-64"
              />
            </div>
          </div>
          
          {/* Contenido principal */}
          <div className="min-h-96">
            {renderMainContent()}
          </div>
        </div>
        
        {/* Modal de Detalles */}
        <HistorialDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          historialItem={selectedHistorialItem}
          onDownloadPDF={handleDownloadPDF}
          isDownloading={isDownloading}
        />
        
      </div>
    </Layout>
  )
}

export default HistorialPage