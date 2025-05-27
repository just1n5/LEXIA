import React, { useEffect } from 'react'
import { X, Download, FileText, Calendar, User, Building, Gavel } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

/**
 * Modal de detalles completos del historial
 * Basado exactamente en el modal del prototipo HTML
 * Incluye información general, partes y actuaciones scrolleables
 */
const HistorialDetailModal = ({
  isOpen = false,
  onClose = () => {},
  historialItem = null,
  onDownloadPDF = () => {},
  isDownloading = false,
  className = '',
  ...props
}) => {

  // Manejar ESC key y click fuera del modal
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleModalContentClick = (e) => {
    e.stopPropagation()
  }

  // Formateo de fechas
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha'
    
    try {
      const date = new Date(fecha)
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  const formatearFechaSolo = (fecha) => {
    if (!fecha) return 'Sin fecha'
    
    try {
      const date = new Date(fecha)
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'exitoso':
        return <Badge variant="success">Exitoso</Badge>
      case 'error_captcha':
        return <Badge variant="warning">Error Captcha</Badge>
      case 'error_sistema':
        return <Badge variant="error">Error Sistema</Badge>
      case 'pendiente':
        return <Badge variant="info">Pendiente</Badge>
      default:
        return <Badge variant="neutral">{estado || 'Desconocido'}</Badge>
    }
  }

  if (!isOpen || !historialItem) return null

  const actuaciones = historialItem.actuaciones || []

  return (
    <div 
      className="modal-overlay clickable-overlay" 
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        zIndex: 1000,
        overflowY: 'auto',
        padding: '1rem'
      }}
    >
      <div 
        className={cn('modal', className)}
        onClick={handleModalContentClick}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '75vh',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        {...props}
      >
        {/* Modal Header - Fixed */}
        <div 
          className="modal-header"
          style={{
            flexShrink: 0,
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Detalles del Proceso Judicial</span>
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            title="Cerrar modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body - Scrolleable */}
        <div 
          className="modal-body"
          style={{
            padding: '1.5rem',
            overflowY: 'scroll',
            overflowX: 'hidden',
            flex: '1 1 auto',
            maxHeight: 'calc(75vh - 120px)',
            minHeight: '200px'
          }}
        >
          
          {/* Información General */}
          <div className="form-section mb-6">
            <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Información General</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solicitud</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{historialItem.solicitud_alias}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Consulta</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{formatearFecha(historialItem.fecha_ejecucion)}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Radicado</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded font-mono break-all">
                  {historialItem.numero_radicado_completo}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Extracción</label>
                <div className="bg-gray-50 p-2 rounded">
                  {getEstadoBadge(historialItem.estado_extraccion)}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Despacho/Juzgado</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                {historialItem.despacho_juzgado}
              </p>
            </div>
          </div>

          {/* Partes del Proceso */}
          {(historialItem.demandante || historialItem.demandado) && (
            <div className="form-section mb-6">
              <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-4 h-4 text-green-600" />
                <span>Partes</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {historialItem.demandante && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Demandante</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{historialItem.demandante}</p>
                  </div>
                )}
                {historialItem.demandado && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Demandado</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{historialItem.demandado}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actuaciones */}
          <div className="form-section">
            <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Gavel className="w-4 h-4 text-purple-600" />
              <span>Actuaciones ({actuaciones.length})</span>
            </h4>
            
            {actuaciones.length > 0 ? (
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actuación
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Cuaderno
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {actuaciones.map((actuacion, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-xs text-gray-900 whitespace-nowrap">
                          {formatearFechaSolo(actuacion.fecha)}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-900">
                          <span className="font-medium">{actuacion.actuacion}</span>
                          {actuacion.observaciones && (
                            <div className="text-gray-500 mt-1">
                              {actuacion.observaciones}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                          {actuacion.cuaderno}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Gavel className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No hay actuaciones registradas</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer - Fixed */}
        <div 
          className="modal-footer"
          style={{
            flexShrink: 0,
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem'
          }}
        >
          <Button 
            variant="secondary" 
            onClick={onClose}
          >
            Cerrar
          </Button>
          <Button 
            variant="primary"
            onClick={() => onDownloadPDF(historialItem)}
            loading={isDownloading}
            icon={<Download className="w-4 h-4" />}
          >
            Descargar PDF
          </Button>
        </div>
      </div>
    </div>
  )
}

HistorialDetailModal.displayName = 'HistorialDetailModal'

export default HistorialDetailModal
