import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit3, Download, Play, Pause, Trash2, AlertTriangle, Scale, CheckCircle, PauseCircle } from 'lucide-react'

// Components del design system
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Breadcrumb, { useSolicitudBreadcrumb } from '../../components/ui/Breadcrumb'
import Badge from '../../components/ui/Badge'

// Components específicos
import ProcessInfo from '../../components/solicitudes/ProcessInfo'
import ExecutionHistory from '../../components/solicitudes/ExecutionHistory'

// Services y hooks
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../utils/cn'

/**
 * Página de detalles de solicitud completamente refactorizada
 * Implementa el design system y el diseño del prototipo
 */
const SolicitudDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // Estados
  const [solicitud, setSolicitud] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Breadcrumb items
  const breadcrumbItems = useSolicitudBreadcrumb(solicitud)

  // Cargar datos de la solicitud
  useEffect(() => {
    if (id) {
      loadSolicitud()
    }
  }, [id])

  const loadSolicitud = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mostrar datos de demo siempre
      setSolicitud(generateDemoSolicitud(id))
    } catch (err) {
      console.error('Error loading solicitud:', err)
      setError('Error cargando los detalles de la solicitud')
      setSolicitud(generateDemoSolicitud(id))
    } finally {
      setLoading(false)
    }
  }

  // Generar datos de demo basados en el ID
  const generateDemoSolicitud = (solicitudId) => {
    const demoData = {
      id: solicitudId,
      nombre_descriptivo: 'Consulta proceso Juan Pérez vs Banco Nacional',
      alias: 'Caso Banco Nacional 2024',
      tipo_busqueda: 'radicado',
      criterio_busqueda_radicado: '11001310300120240001',
      criterio_busqueda_nombre: 'Juan Pérez',
      despacho: 'Juzgado Primero Civil del Circuito de Bogotá',
      frecuencia_envio: 'diaria',
      activa: true,
      estado: 'activa',
      fecha_creacion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      ultima_ejecucion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      email_notificacion: 'usuario@ejemplo.com',
      resultados_encontrados: 3,
      notificaciones_enviadas: 25
    }
    
    return demoData
  }

  // Handlers de acciones
  const handleEdit = () => {
    navigate(`/solicitudes/${id}/editar`)
  }

  const handleToggleStatus = async () => {
    if (!solicitud) return
    
    setActionLoading(true)
    try {
      const newStatus = solicitud.activa ? 'pausada' : 'activa'
      const action = newStatus === 'activa' ? 'activada' : 'pausada'
      
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSolicitud(prev => ({
        ...prev,
        activa: !prev.activa,
        estado: newStatus
      }))
      
      toast.success(
        `Solicitud ${action}`,
        `La solicitud ha sido ${action} correctamente`
      )
    } catch (error) {
      toast.error('Error al cambiar estado', 'No se pudo cambiar el estado de la solicitud')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDownload = async () => {
    setActionLoading(true)
    try {
      toast.info('Preparando descarga', 'Generando reporte...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Reporte descargado', 'El reporte se ha descargado correctamente')
    } catch (error) {
      toast.error('Error en descarga', 'No se pudo generar el reporte')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!solicitud) return
    
    const confirmMessage = `¿Estás seguro de que deseas eliminar "${solicitud.nombre_descriptivo}"?\n\nEsta acción no se puede deshacer.`
    
    if (window.confirm(confirmMessage)) {
      try {
        setActionLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        toast.success('Solicitud eliminada', 'La solicitud se eliminó correctamente')
        navigate('/dashboard')
      } catch (error) {
        toast.error('Error al eliminar', 'No se pudo eliminar la solicitud')
        setActionLoading(false)
      }
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="container mx-auto px-md md:px-lg lg:px-xl py-lg">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <LoadingSpinner size="lg" className="mb-lg" />
          <h3 className="text-heading-h3 font-heading text-text-primary mb-sm">
            Cargando detalles
          </h3>
          <p className="text-body-paragraph text-text-secondary">
            Obteniendo información de la solicitud...
          </p>
        </div>
      </div>
    )
  }

  // Error State
  if (error && !solicitud) {
    return (
      <div className="container mx-auto px-md md:px-lg lg:px-xl py-lg">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="mb-lg">
            <AlertTriangle size={64} className="text-feedback-error mx-auto" />
          </div>
          <h2 className="text-heading-h2 font-heading text-feedback-error mb-md">
            Error al cargar la solicitud
          </h2>
          <p className="text-body-paragraph text-text-secondary mb-lg max-w-md">
            {error || 'No se pudo cargar la información de la solicitud. Verifica que el enlace sea correcto e intenta nuevamente.'}
          </p>
          <div className="flex gap-sm">
            <Button
              variant="primary"
              onClick={loadSolicitud}
              loading={loading}
            >
              Reintentar
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              icon={<ArrowLeft size={16} />}
            >
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Main Content
  return (
    <div className="container mx-auto px-md md:px-lg lg:px-xl py-lg">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-lg mb-xl">
        {/* Title and Description */}
        <div className="flex-1">
          <h1 className="text-heading-h1 font-heading text-text-primary mb-sm">
            Detalles de la solicitud
          </h1>
          <p className="text-body-paragraph text-text-secondary">
            Información completa y seguimiento de tu consulta judicial automatizada
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-sm lg:flex-col xl:flex-row">
          <Button
            variant="secondary"
            onClick={handleEdit}
            icon={<Edit3 size={16} />}
            disabled={actionLoading}
          >
            Editar
          </Button>
          
          <Button
            variant={solicitud?.activa ? "warning" : "primary"}
            onClick={handleToggleStatus}
            icon={solicitud?.activa ? <Pause size={16} /> : <Play size={16} />}
            loading={actionLoading}
          >
            {solicitud?.activa ? 'Pausar' : 'Activar'}
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleDownload}
            icon={<Download size={16} />}
            disabled={actionLoading}
          >
            Descargar
          </Button>
          
          <Button
            variant="destructive"
            onClick={handleDelete}
            icon={<Trash2 size={16} />}
            disabled={actionLoading}
          >
            Eliminar
          </Button>
        </div>
      </div>
      
      {/* Banner Image */}
      <div className={cn(
        'w-full h-48 md:h-56 rounded-lg mb-xl',
        'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800',
        'bg-cover bg-center bg-no-repeat',
        'flex items-center justify-center text-white',
        'relative overflow-hidden'
      )}>
        {/* Overlay pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="mb-md">
            <Scale size={48} className="text-white mx-auto" />
          </div>
          <h3 className="text-heading-h3 font-heading mb-sm">
            Sistema de Consulta Judicial
          </h3>
          <p className="text-body-auxiliary opacity-90">
            Monitoreo automatizado de procesos legales
          </p>
        </div>
      </div>

      {/* Status Banner */}
      {solicitud && (
        <Card 
          className={cn(
            'mb-xl p-lg',
            solicitud.activa 
              ? 'border-feedback-success bg-feedback-success-light' 
              : 'border-feedback-warning bg-feedback-warning-light'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-md">
              <div className={cn(
                'p-2 rounded-full',
                solicitud.activa 
                  ? 'bg-feedback-success text-white' 
                  : 'bg-feedback-warning text-white'
              )}>
                {solicitud.activa ? (
                  <CheckCircle size={24} />
                ) : (
                  <PauseCircle size={24} />
                )}
              </div>
              <div>
                <h4 className="text-heading-h4 font-heading text-text-primary mb-xs">
                  Estado: {solicitud.activa ? 'Activa' : 'Pausada'}
                </h4>
                <p className="text-body-auxiliary text-text-secondary">
                  {solicitud.activa 
                    ? 'La solicitud se está ejecutando automáticamente según la frecuencia configurada'
                    : 'La solicitud está temporalmente pausada y no se ejecutará hasta ser activada'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-sm">
              <Badge 
                variant={solicitud.activa ? 'success' : 'warning'}
                size="sm"
              >
                {solicitud.activa ? 'Activa' : 'Pausada'}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Main Content Areas */}
      <div className="space-y-xl">
        {/* Process Information */}
        {solicitud && <ProcessInfo solicitud={solicitud} />}
        
        {/* Execution History */}
        {solicitud && <ExecutionHistory solicitudId={id} />}
      </div>

      {/* Back to Dashboard */}
      <div className="mt-xl pt-xl border-t border-border-default">
        <Button
          variant="secondary"
          onClick={() => navigate('/dashboard')}
          icon={<ArrowLeft size={16} />}
        >
          Volver al Dashboard
        </Button>
      </div>
    </div>
  )
}

export default SolicitudDetailPage