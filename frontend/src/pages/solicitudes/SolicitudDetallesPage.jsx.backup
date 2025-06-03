import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  Download, 
  ExternalLink, 
  Trash2, 
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  // Nuevos iconos para información
  FileText,
  Calendar,
  Bell,
  BellOff,
  Copy
} from 'lucide-react';

// Components
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Hooks
import { useSolicitudes } from '../../hooks/useSolicitudes';
import { useToast } from '../../hooks/useToast';

// Services
import { getSolicitudById, updateSolicitud, deleteSolicitud } from '../../services/solicitudes';

// Utils (assuming they exist)
const formatearFechaCorta = (fecha) => {
  if (!fecha) return 'N/A';
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatearFechaCompleta = (fecha) => {
  if (!fecha) return 'N/A';
  return new Date(fecha).toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatearTiempoRelativo = (fecha) => {
  if (!fecha) return 'N/A';
  
  const ahora = new Date();
  const fechaObj = new Date(fecha);
  const diffMs = ahora - fechaObj;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffHours < 1) return 'hace menos de 1 hora';
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
  
  return formatearFechaCorta(fecha);
};

const calcularProximaEjecucion = (frecuencia) => {
  switch (frecuencia?.toLowerCase()) {
    case 'diaria': return '20 horas';
    case 'semanal': return '4 días';
    case 'mensual': return '22 días';
    default: return '24 horas';
  }
};

const SolicitudDetallesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { } = useSolicitudes();
  const { toast } = useToast();
  
  // Estados
  const [solicitudData, setSolicitudData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllExecutions, setShowAllExecutions] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);

  // Componente MetricaCard mejorado
  const MetricaCard = ({ titulo, valor, icono, color, contexto, porcentaje, isAnimated = false }) => (
    <Card size="sm" className="relative overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
      <Card.Content>
        <div className="flex items-center justify-between mb-sm">
          <div className="flex-1">
            <p className="text-body-auxiliary font-medium text-text-secondary mb-xs transition-colors duration-200 group-hover:text-text-primary">
              {titulo}
            </p>
            <p className={`text-heading-h2 font-heading ${color} transition-colors duration-200`}>
              {valor}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color.replace('text-', 'bg-').replace('text-text-primary', 'bg-interactive-default')}/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
            {icono}
          </div>
        </div>
        {contexto && (
          <div className="flex items-center gap-xs">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isAnimated ? 'animate-pulse' : 'group-hover:animate-pulse'} ${color.replace('text-', 'bg-').replace('text-text-primary', 'bg-interactive-default')}`}></div>
            <span className="text-body-auxiliary text-text-secondary transition-colors duration-200 group-hover:text-text-primary">
              {contexto}
            </span>
          </div>
        )}
      </Card.Content>
      {porcentaje !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
          <div 
            className={`h-full transition-all duration-700 ease-out ${color.replace('text-', 'bg-').replace('text-text-primary', 'bg-interactive-default')} group-hover:animate-pulse`}
            style={{ width: `${Math.max(0, Math.min(100, porcentaje))}%` }}
          ></div>
        </div>
      )}
    </Card>
  );

  // Cargar datos de la solicitud
  useEffect(() => {
    cargarSolicitudData();
  }, [id]);

  // Cerrar menú de acciones cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Buscar el contenedor del menú más específicamente
      const menuContainer = event.target.closest('[data-menu-container]');
      if (!menuContainer && showActionsMenu) {
        setShowActionsMenu(false);
      }
    };

    if (showActionsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showActionsMenu]);

  const cargarSolicitudData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Intentar usar el servicio, si falla usar mock data
      let data;
      try {
        data = await getSolicitudById(id);
      } catch (serviceError) {
        console.warn('Servicio no disponible, usando mock data:', serviceError);
        data = await mockSolicitudData(id);
      }
        
      setSolicitudData(data);
    } catch (err) {
      setError('Error al cargar los detalles de la solicitud');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock data temporal mientras se implementa el servicio
  const mockSolicitudData = async (id) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: id,
      nombre_descriptivo: `Solicitud de Consulta #${id}`,
      estado: 'activa',
      tipo_consulta: 'Consulta por Radicado',
      numero_radicado: '11001310300120240001',
      frecuencia_consulta: 'Diaria',
      fecha_creacion: new Date().toISOString(),
      fecha_modificacion: new Date().toISOString(),
      notificaciones_habilitadas: true,
      auto_renovacion: true,
      total_ejecuciones: 15,
      ejecuciones_exitosas: 12,
      ejecuciones_fallidas: 3,
      ultima_ejecucion: new Date().toISOString(),
      historial_eventos: [
        {
          descripcion: 'Solicitud creada exitosamente',
          fecha: new Date(Date.now() - 86400000).toISOString()
        },
        {
          descripcion: 'Primera ejecución completada',
          fecha: new Date(Date.now() - 82800000).toISOString()
        },
        {
          descripcion: 'Notificación enviada por email',
          fecha: new Date(Date.now() - 79200000).toISOString()
        }
      ],
      historial_ejecuciones: [
        {
          fecha: new Date().toISOString(),
          estado: 'exitosa',
          duracion: '2.3s',
          resultados_encontrados: 1,
          tipo_resultados: 'Actualizaciones encontradas',
          notificacion_enviada: true,
          detalles_url: '/detalles/1'
        },
        {
          fecha: new Date(Date.now() - 86400000).toISOString(),
          estado: 'exitosa',
          duracion: '1.8s',
          resultados_encontrados: 0,
          tipo_resultados: 'Sin cambios',
          notificacion_enviada: false,
          detalles_url: null
        },
        {
          fecha: new Date(Date.now() - 172800000).toISOString(),
          estado: 'fallida',
          duracion: '5.2s',
          resultados_encontrados: null,
          tipo_resultados: 'Error de conexión',
          notificacion_enviada: false,
          error_detalle: 'Timeout en servidor judicial'
        }
      ]
    };
  };

  // Función para obtener badge según estado
  const getEstadoBadge = (estado) => {
    const badges = {
      'activa': <Badge variant="success">Activa</Badge>,
      'pausada': <Badge variant="warning">Pausada</Badge>,
      'completada': <Badge variant="info">Completada</Badge>,
      'error': <Badge variant="error">Error</Badge>,
      'cancelada': <Badge variant="error">Cancelada</Badge>
    };
    return badges[estado?.toLowerCase()] || <Badge>{estado}</Badge>;
  };

  const getEjecucionBadge = (estado) => {
    const badges = {
      'exitosa': <Badge variant="success">Exitosa</Badge>,
      'fallida': <Badge variant="error">Fallida</Badge>,
      'en_progreso': <Badge variant="warning">En Progreso</Badge>,
      'cancelada': <Badge variant="error">Cancelada</Badge>
    };
    return badges[estado?.toLowerCase()] || <Badge>{estado}</Badge>;
  };

  // Handlers
  const handleDescargarReporte = () => {
    toast.success('Descarga iniciada', 'El reporte se está generando...');
    console.log('Descargar reporte para solicitud:', id);
  };

  const handleEliminar = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta solicitud? Esta acción no se puede deshacer.')) {
      try {
        await deleteSolicitud(id);
        toast.success('Solicitud eliminada', 'La solicitud ha sido eliminada exitosamente');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Error', 'No se pudo eliminar la solicitud');
      }
    }
  };

  const handleCopiarRadicado = async () => {
    try {
      await navigator.clipboard.writeText(solicitudData.numero_radicado);
      toast.success('Copiado', 'Número de radicado copiado al portapapeles');
    } catch (error) {
      toast.error('Error', 'No se pudo copiar el número de radicado');
    }
  };

  const handleToggleStatus = async () => {
    setLoadingToggle(true);
    
    try {
      const newStatus = solicitudData.estado === 'activa' ? 'pausada' : 'activa';
      
      await updateSolicitud(id, { estado: newStatus });
      
      setSolicitudData(prev => ({ ...prev, estado: newStatus }));
      
      // Toast más descriptivo
      toast.success(
        `Solicitud ${newStatus === 'activa' ? 'reactivada' : 'pausada'}`,
        `${newStatus === 'activa' 
          ? 'Los monitoreos se reanudarán automáticamente según la frecuencia configurada' 
          : 'Los monitoreos automáticos han sido pausados. Puedes reanudarlos cuando gustes'
        }`
      );
    } catch (error) {
      toast.error(
        'Error al cambiar estado',
        'No se pudo actualizar el estado de la solicitud. Por favor intenta nuevamente.'
      );
    } finally {
      setLoadingToggle(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light">
        <div className="container mx-auto px-md md:px-lg py-xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-md" />
              <p className="text-body-paragraph text-text-secondary">
                Cargando detalles de la solicitud...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-bg-light">
        <div className="container mx-auto px-md md:px-lg py-xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-feedback-error mx-auto mb-md" />
              <h2 className="text-heading-h3 font-heading text-text-primary mb-sm">
                Error al cargar
              </h2>
              <p className="text-body-paragraph text-text-secondary mb-lg">
                {error}
              </p>
              <Button
                variant="primary"
                onClick={cargarSolicitudData}
              >
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!solicitudData) {
    return (
      <div className="min-h-screen bg-bg-light">
        <div className="container mx-auto px-md md:px-lg py-xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-feedback-warning mx-auto mb-md" />
              <h2 className="text-heading-h3 font-heading text-text-primary mb-sm">
                Solicitud no encontrada
              </h2>
              <p className="text-body-paragraph text-text-secondary mb-lg">
                La solicitud que buscas no existe o ha sido eliminada
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
              >
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ejecucionesAMostrar = showAllExecutions 
    ? (solicitudData.historial_ejecuciones || []) 
    : (solicitudData.historial_ejecuciones || []).slice(0, 5);

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header con navegación */}
      <div className="bg-bg-canvas border-b border-border-default sticky top-0 z-10">
        <div className="container mx-auto px-md md:px-lg py-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                icon={<ArrowLeft size={16} />}
              >
                Volver
              </Button>
              
              <nav className="flex items-center gap-xs text-body-auxiliary text-text-secondary">
                <Link 
                  to="/dashboard" 
                  className="hover:text-text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <ChevronRight size={14} className="text-border-default" />
                <span className="text-text-primary">Detalles</span>
              </nav>
            </div>
            
            <div className="flex items-center gap-sm">
              {loadingToggle ? (
                <Button variant="secondary" disabled>
                  {solicitudData.estado === 'pausada' ? 'Reanudando...' : 'Pausando...'}
                </Button>
              ) : (
                <Button
                  variant={solicitudData.estado === 'pausada' ? 'primary' : 'secondary'}
                  onClick={handleToggleStatus}
                  icon={solicitudData.estado === 'pausada' ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
                >
                  {solicitudData.estado === 'pausada' ? 'Reanudar' : 'Pausar'}
                </Button>
              )}
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowActionsMenu(!showActionsMenu)}
                  icon={<MoreVertical size={16} />}
                  aria-label="Más acciones"
                />
                
                {showActionsMenu && (
                  <div className="absolute right-0 top-full mt-xs w-48 bg-bg-canvas border border-border-default rounded-md shadow-lg z-20">
                    <div className="py-xs">
                      <button
                        onClick={() => {
                          handleDescargarReporte();
                          setShowActionsMenu(false);
                        }}
                        className="w-full px-sm py-xs text-left hover:bg-bg-light flex items-center gap-sm text-body-paragraph"
                      >
                        <Download size={14} />
                        Descargar Reporte
                      </button>
                      
                      <Link
                        to={`/historial?solicitud=${id}`}
                        onClick={() => setShowActionsMenu(false)}
                        className="w-full px-sm py-xs text-left hover:bg-bg-light flex items-center gap-sm text-body-paragraph"
                      >
                        <ExternalLink size={14} />
                        Ver en Historial
                      </Link>
                      
                      <div className="h-px bg-border-default my-xs" />
                      
                      <button
                        onClick={() => {
                          handleEliminar();
                          setShowActionsMenu(false);
                        }}
                        className="w-full px-sm py-xs text-left hover:bg-feedback-error hover:text-bg-canvas flex items-center gap-sm text-body-paragraph text-feedback-error"
                      >
                        <Trash2 size={14} />
                        Eliminar Solicitud
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Título */}
          <div className="mt-md">
            <h1 className="text-heading-h1 font-heading text-text-primary mb-sm">
              {solicitudData.nombre_descriptivo}
            </h1>
            <p className="text-body-paragraph text-text-secondary">
              Revisa los detalles y el progreso de tu consulta judicial automatizada
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-md md:px-lg py-xl">
        <div className="max-w-6xl mx-auto space-y-xl">
          {/* Estadísticas Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            <MetricaCard
              titulo="Total Ejecuciones"
              valor={solicitudData.total_ejecuciones || 0}
              icono={<Clock className="w-6 h-6 text-interactive-default" />}
              color="text-text-primary"
              contexto={`+${Math.floor(Math.random() * 5) + 1} esta semana`}
            />
            
            <MetricaCard
              titulo="Exitosas"
              valor={solicitudData.ejecuciones_exitosas || 0}
              icono={<CheckCircle className="w-6 h-6 text-feedback-success" />}
              color="text-feedback-success"
              contexto={`${Math.round(((solicitudData.ejecuciones_exitosas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}% tasa de éxito`}
              porcentaje={Math.round(((solicitudData.ejecuciones_exitosas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}
            />
            
            <MetricaCard
              titulo="Fallidas"
              valor={solicitudData.ejecuciones_fallidas || 0}
              icono={<XCircle className="w-6 h-6 text-feedback-error" />}
              color="text-feedback-error"
              contexto={`${Math.round(((solicitudData.ejecuciones_fallidas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}% tasa de error`}
              porcentaje={Math.round(((solicitudData.ejecuciones_fallidas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}
            />
            
            <MetricaCard
              titulo="Última Ejecución"
              valor={solicitudData.ultima_ejecucion ? formatearTiempoRelativo(solicitudData.ultima_ejecucion) : 'N/A'}
              icono={<Clock className="w-6 h-6 text-text-secondary" />}
              color="text-text-primary"
              contexto={`Próxima en ${calcularProximaEjecucion(solicitudData.frecuencia_consulta)}`}
              isAnimated={true}
            />
          </div>

          {/* Información Principal */}
          <Card size="lg">
            <Card.Header>
              <Card.Title>Información de la Solicitud</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
                {/* Columna 1: Información principal */}
                <div className="space-y-lg">
                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Estado Actual
                    </label>
                    <div className="flex items-center gap-sm">
                      {getEstadoBadge(solicitudData.estado)}
                      <span className="text-body-auxiliary text-text-secondary">
                        desde {formatearTiempoRelativo(solicitudData.fecha_modificacion)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Número de Radicado
                    </label>
                    <div className="flex items-center gap-sm">
                      <div className="flex items-center gap-sm bg-bg-light px-sm py-xs rounded border">
                        <FileText size={16} className="text-interactive-default" />
                        <p className="text-body-paragraph text-text-primary font-mono">
                          {solicitudData.numero_radicado || 'N/A'}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={<Copy size={14} />}
                        onClick={handleCopiarRadicado}
                        aria-label="Copiar radicado"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Tipo de Consulta
                    </label>
                    <div className="flex items-center gap-sm">
                      <FileText size={16} className="text-interactive-default" />
                      <p className="text-body-paragraph text-text-primary">
                        {solicitudData.tipo_consulta || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Columna 2: Configuración */}
                <div className="space-y-lg">
                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Frecuencia de Monitoreo
                    </label>
                    <div className="flex items-center gap-sm">
                      <Calendar size={16} className="text-interactive-default" />
                      <p className="text-body-paragraph text-text-primary">
                        {solicitudData.frecuencia_consulta || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Notificaciones
                    </label>
                    <div className="flex items-center gap-sm">
                      {solicitudData.notificaciones_habilitadas ? (
                        <>
                          <Bell size={16} className="text-feedback-success" />
                          <span className="text-body-paragraph text-feedback-success">Habilitadas</span>
                        </>
                      ) : (
                        <>
                          <BellOff size={16} className="text-text-secondary" />
                          <span className="text-body-paragraph text-text-secondary">Deshabilitadas</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Creada
                    </label>
                    <div className="space-y-xs">
                      <p className="text-body-paragraph text-text-primary">
                        {formatearFechaCompleta(solicitudData.fecha_creacion)}
                      </p>
                      <p className="text-body-auxiliary text-text-secondary">
                        {formatearTiempoRelativo(solicitudData.fecha_creacion)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Historial */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
            {/* Historial de Eventos */}
            <Card size="lg">
              <Card.Header>
                <Card.Title>Historial de Eventos</Card.Title>
              </Card.Header>
              <Card.Content>
                {solicitudData.historial_eventos?.length > 0 ? (
                  <div className="space-y-md">
                    {solicitudData.historial_eventos.map((evento, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-sm p-sm border border-border-default rounded-md"
                      >
                        <div className="w-2 h-2 bg-interactive-default rounded-full mt-2 flex-shrink-0" />
                        
                        <div className="flex-1">
                          <p className="text-body-paragraph text-text-primary mb-xs">
                            {evento.descripcion}
                          </p>
                          <p className="text-body-auxiliary text-text-secondary">
                            {formatearFechaCompleta(evento.fecha)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-lg">
                    <p className="text-body-paragraph text-text-secondary">
                      No hay eventos registrados para esta solicitud
                    </p>
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Historial de Ejecuciones */}
            <Card size="lg">
              <Card.Header>
                <Card.Title>Historial de Ejecuciones</Card.Title>
              </Card.Header>
              <Card.Content>
                {solicitudData.historial_ejecuciones?.length > 0 ? (
                  <>
                    <div className="space-y-sm">
                      {ejecucionesAMostrar.map((ejecucion, index) => (
                        <Card 
                          key={index} 
                          size="sm" 
                          className="border-l-4 border-l-transparent hover:border-l-interactive-default transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
                        >
                          <Card.Content className="p-md">
                            <div className="flex justify-between items-start mb-sm">
                              <div className="flex-1">
                                <div className="flex items-center gap-sm mb-xs">
                                  {getEjecucionBadge(ejecucion.estado)}
                                  <span className="text-body-auxiliary text-text-secondary">
                                    {ejecucion.duracion}
                                  </span>
                                </div>
                                <p className="text-body-paragraph font-medium text-text-primary">
                                  {formatearFechaCorta(ejecucion.fecha)}
                                </p>
                                <p className="text-body-auxiliary text-text-secondary">
                                  {formatearTiempoRelativo(ejecucion.fecha)}
                                </p>
                              </div>
                              
                              {ejecucion.detalles_url && (
                                <Button
                                  as={Link}
                                  to={ejecucion.detalles_url}
                                  variant="ghost"
                                  size="sm"
                                  icon={<Eye size={14} />}
                                  aria-label="Ver detalles"
                                />
                              )}
                            </div>

                            {/* Resultados */}
                            <div className="space-y-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-body-auxiliary text-text-secondary">Resultados:</span>
                                <span className="text-body-paragraph text-text-primary">
                                  {ejecucion.resultados_encontrados !== null 
                                    ? `${ejecucion.resultados_encontrados} encontrado${ejecucion.resultados_encontrados !== 1 ? 's' : ''}`
                                    : 'N/A'
                                  }
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-body-auxiliary text-text-secondary">Tipo:</span>
                                <span className="text-body-auxiliary text-text-primary">
                                  {ejecucion.tipo_resultados}
                                </span>
                              </div>

                              {ejecucion.notificacion_enviada && (
                                <div className="flex items-center gap-xs mt-sm pt-sm border-t border-border-default">
                                  <Mail className="w-3 h-3 text-feedback-info" />
                                  <span className="text-body-auxiliary text-feedback-info">
                                    Notificación enviada
                                  </span>
                                </div>
                              )}
                            </div>

                            {ejecucion.error_detalle && (
                              <div className="mt-sm pt-sm border-t border-border-default">
                                <p className="text-body-auxiliary text-feedback-error">
                                  {ejecucion.error_detalle}
                                </p>
                              </div>
                            )}
                          </Card.Content>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Botón Ver Más */}
                    {!showAllExecutions && (solicitudData.historial_ejecuciones?.length || 0) > 5 && (
                      <div className="mt-md pt-md border-t border-border-default">
                        <Button
                          variant="secondary"
                          onClick={() => setShowAllExecutions(true)}
                          className="w-full"
                          icon={<ChevronDown size={16} />}
                        >
                          Ver {(solicitudData.historial_ejecuciones?.length || 0) - 5} ejecuciones más
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-lg">
                    <p className="text-body-paragraph text-text-secondary">
                      No hay ejecuciones registradas para esta solicitud
                    </p>
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Acciones Adicionales */}
          <Card size="lg" className="bg-gradient-to-r from-bg-canvas to-bg-light border-l-4 border-l-interactive-default">
            <Card.Content className="p-xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-xl">
                {/* Descripción */}
                <div className="flex-1">
                  <div className="flex items-center gap-sm mb-sm">
                    <div className="w-10 h-10 bg-interactive-default/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-interactive-default" />
                    </div>
                    <h3 className="text-heading-h3 font-heading text-text-primary">
                      Gestión Avanzada
                    </h3>
                  </div>
                  <p className="text-body-paragraph text-text-secondary mb-sm">
                    Accede a herramientas avanzadas para el manejo completo de tu solicitud judicial
                  </p>
                  <div className="flex flex-wrap gap-xs">
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-success/10 text-feedback-success text-body-auxiliary rounded-md">
                      <CheckCircle className="w-3 h-3 mr-xs" />
                      Exportación completa
                    </span>
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-info/10 text-feedback-info text-body-auxiliary rounded-md">
                      <Eye className="w-3 h-3 mr-xs" />
                      Análisis detallado
                    </span>
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-warning/10 text-feedback-warning text-body-auxiliary rounded-md">
                      <AlertTriangle className="w-3 h-3 mr-xs" />
                      Acción irreversible
                    </span>
                  </div>
                </div>
                
                {/* Botones */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm lg:flex lg:flex-col lg:gap-sm xl:flex-row xl:gap-sm">
                  <Button
                    variant="secondary"
                    onClick={handleDescargarReporte}
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                    icon={<Download size={16} />}
                  >
                    <span className="hidden sm:inline">Descargar Reporte</span>
                    <span className="sm:hidden">Descargar</span>
                  </Button>
                  
                  <Button
                    as={Link}
                    to={`/historial?solicitud=${id}`}
                    variant="secondary"
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                    icon={<ExternalLink size={16} />}
                  >
                    <span className="hidden sm:inline">Ver Historial</span>
                    <span className="sm:hidden">Historial</span>
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={handleEliminar}
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                    icon={<Trash2 size={16} />}
                  >
                    <span className="hidden sm:inline">Eliminar Solicitud</span>
                    <span className="sm:hidden">Eliminar</span>
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SolicitudDetallesPage;A'}
              icono={<Clock className="w-6 h-6 text-text-secondary" />}
              color="text-text-primary"
              contexto={`Próxima en ${calcularProximaEjecucion(solicitudData.frecuencia_consulta)}`}
              isAnimated={true}
            />
          </div>

          {/* Información Principal */}
          <Card size="lg">
            <Card.Header>
              <Card.Title>Información de la Solicitud</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
                {/* Columna 1: Información principal */}
                <div className="space-y-lg">
                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Estado Actual
                    </label>
                    <div className="flex items-center gap-sm">
                      {getEstadoBadge(solicitudData.estado)}
                      <span className="text-body-auxiliary text-text-secondary">
                        desde {formatearTiempoRelativo(solicitudData.fecha_modificacion)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Número de Radicado
                    </label>
                    <div className="flex items-center gap-sm">
                      <div className="flex items-center gap-sm bg-bg-light px-sm py-xs rounded border">
                        <FileText size={16} className="text-interactive-default" />
                        <p className="text-body-paragraph text-text-primary font-mono">
                          {solicitudData.numero_radicado || 'N/A'}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={<Copy size={14} />}
                        onClick={handleCopiarRadicado}
                        aria-label="Copiar radicado"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Tipo de Consulta
                    </label>
                    <div className="flex items-center gap-sm">
                      <FileText size={16} className="text-interactive-default" />
                      <p className="text-body-paragraph text-text-primary">
                        {solicitudData.tipo_consulta || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Columna 2: Configuración */}
                <div className="space-y-lg">
                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Frecuencia de Monitoreo
                    </label>
                    <div className="flex items-center gap-sm">
                      <Calendar size={16} className="text-interactive-default" />
                      <p className="text-body-paragraph text-text-primary">
                        {solicitudData.frecuencia_consulta || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Notificaciones
                    </label>
                    <div className="flex items-center gap-sm">
                      {solicitudData.notificaciones_habilitadas ? (
                        <>
                          <Bell size={16} className="text-feedback-success" />
                          <span className="text-body-paragraph text-feedback-success">Habilitadas</span>
                        </>
                      ) : (
                        <>
                          <BellOff size={16} className="text-text-secondary" />
                          <span className="text-body-paragraph text-text-secondary">Deshabilitadas</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Creada
                    </label>
                    <div className="space-y-xs">
                      <p className="text-body-paragraph text-text-primary">
                        {formatearFechaCompleta(solicitudData.fecha_creacion)}
                      </p>
                      <p className="text-body-auxiliary text-text-secondary">
                        {formatearTiempoRelativo(solicitudData.fecha_creacion)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Historial */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
            {/* Historial de Eventos */}
            <Card size="lg">
              <Card.Header>
                <Card.Title>Historial de Eventos</Card.Title>
              </Card.Header>
              <Card.Content>
                {solicitudData.historial_eventos?.length > 0 ? (
                  <div className="space-y-md">
                    {solicitudData.historial_eventos.map((evento, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-sm p-sm border border-border-default rounded-md"
                      >
                        <div className="w-2 h-2 bg-interactive-default rounded-full mt-2 flex-shrink-0" />
                        
                        <div className="flex-1">
                          <p className="text-body-paragraph text-text-primary mb-xs">
                            {evento.descripcion}
                          </p>
                          <p className="text-body-auxiliary text-text-secondary">
                            {formatearFechaCompleta(evento.fecha)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-lg">
                    <p className="text-body-paragraph text-text-secondary">
                      No hay eventos registrados para esta solicitud
                    </p>
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Historial de Ejecuciones */}
            <Card size="lg">
              <Card.Header>
                <Card.Title>Historial de Ejecuciones</Card.Title>
              </Card.Header>
              <Card.Content>
                {solicitudData.historial_ejecuciones?.length > 0 ? (
                  <>
                    <div className="space-y-sm">
                      {ejecucionesAMostrar.map((ejecucion, index) => (
                        <Card 
                          key={index} 
                          size="sm" 
                          className="border-l-4 border-l-transparent hover:border-l-interactive-default transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
                        >
                          <Card.Content className="p-md">
                            <div className="flex justify-between items-start mb-sm">
                              <div className="flex-1">
                                <div className="flex items-center gap-sm mb-xs">
                                  {getEjecucionBadge(ejecucion.estado)}
                                  <span className="text-body-auxiliary text-text-secondary">
                                    {ejecucion.detalles_url && (
                                <Button
                                  as={Link}
                                  to={ejecucion.detalles_url}
                                  variant="ghost"
                                  size="sm"
                                  icon={<Eye size={14} />}
                                  aria-label="Ver detalles"
                                />
                              )}
                            </div>

                            {/* Resultados */}
                            <div className="space-y-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-body-auxiliary text-text-secondary">Resultados:</span>
                                <span className="text-body-paragraph text-text-primary">
                                  {ejecucion.resultados_encontrados !== null 
                                    ? `${ejecucion.resultados_encontrados} encontrado${ejecucion.resultados_encontrados !== 1 ? 's' : ''}`
                                    : 'N/A'
                                  }
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-body-auxiliary text-text-secondary">Tipo:</span>
                                <span className="text-body-auxiliary text-text-primary">
                                  {ejecucion.tipo_resultados}
                                </span>
                              </div>

                              {ejecucion.notificacion_enviada && (
                                <div className="flex items-center gap-xs mt-sm pt-sm border-t border-border-default">
                                  <Mail className="w-3 h-3 text-feedback-info" />
                                  <span className="text-body-auxiliary text-feedback-info">
                                    Notificación enviada
                                  </span>
                                </div>
                              )}
                            </div>

                            {ejecucion.error_detalle && (
                              <div className="mt-sm pt-sm border-t border-border-default">
                                <p className="text-body-auxiliary text-feedback-error">
                                  {ejecucion.error_detalle}
                                </p>
                              </div>
                            )}
                          </Card.Content>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Botón Ver Más */}
                    {!showAllExecutions && (solicitudData.historial_ejecuciones?.length || 0) > 5 && (
                      <div className="mt-md pt-md border-t border-border-default">
                        <Button
                          variant="secondary"
                          onClick={() => setShowAllExecutions(true)}
                          className="w-full"
                          icon={<ChevronDown size={16} />}
                        >
                          Ver {(solicitudData.historial_ejecuciones?.length || 0) - 5} ejecuciones más
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-lg">
                    <p className="text-body-paragraph text-text-secondary">
                      No hay ejecuciones registradas para esta solicitud
                    </p>
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Acciones Adicionales */}
          <Card size="lg" className="bg-gradient-to-r from-bg-canvas to-bg-light border-l-4 border-l-interactive-default">
            <Card.Content className="p-xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-xl">
                {/* Descripción */}
                <div className="flex-1">
                  <div className="flex items-center gap-sm mb-sm">
                    <div className="w-10 h-10 bg-interactive-default/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-interactive-default" />
                    </div>
                    <h3 className="text-heading-h3 font-heading text-text-primary">
                      Gestión Avanzada
                    </h3>
                  </div>
                  <p className="text-body-paragraph text-text-secondary mb-sm">
                    Accede a herramientas avanzadas para el manejo completo de tu solicitud judicial
                  </p>
                  <div className="flex flex-wrap gap-xs">
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-success/10 text-feedback-success text-body-auxiliary rounded-md">
                      <CheckCircle className="w-3 h-3 mr-xs" />
                      Exportación completa
                    </span>
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-info/10 text-feedback-info text-body-auxiliary rounded-md">
                      <Eye className="w-3 h-3 mr-xs" />
                      Análisis detallado
                    </span>
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-warning/10 text-feedback-warning text-body-auxiliary rounded-md">
                      <AlertTriangle className="w-3 h-3 mr-xs" />
                      Acción irreversible
                    </span>
                  </div>
                </div>
                
                {/* Botones */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm lg:flex lg:flex-col lg:gap-sm xl:flex-row xl:gap-sm">
                  <Button
                    variant="secondary"
                    onClick={handleDescargarReporte}
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                    icon={<Download size={16} />}
                  >
                    <span className="hidden sm:inline">Descargar Reporte</span>
                    <span className="sm:hidden">Descargar</span>
                  </Button>
                  
                  <Button
                    as={Link}
                    to={`/historial?solicitud=${id}`}
                    variant="secondary"
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                    icon={<ExternalLink size={16} />}
                  >
                    <span className="hidden sm:inline">Ver Historial</span>
                    <span className="sm:hidden">Historial</span>
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={handleEliminar}
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                    icon={<Trash2 size={16} />}
                  >
                    <span className="hidden sm:inline">Eliminar Solicitud</span>
                    <span className="sm:hidden">Eliminar</span>
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SolicitudDetallesPage;duracion}
                                  </span>
                                </div>
                                <p className="text-body-auxiliary text-text-secondary">
                                  {formatearTiempoRelativo(ejecucion.fecha)}
                                </p>
                              </div>
                              
                              {ejecucion.detalles_url && (
                                <Button
                                  as={Link}
                                  to={ejecucion.detalles_url}
                                  variant="ghost"
                                  size="sm"
                                  icon={<Eye size={14} />}
                                  aria-label="Ver detalles"
                                />
                              )}
                            </div>

                            {/* Resultados */}
                            <div className="space-y-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-body-auxiliary text-text-secondary">Resultados:</span>
                                <span className="text-body-paragraph text-text-primary">
                                  {ejecucion.resultados_encontrados !== null 
                                    ? `${ejecucion.resultados_encontrados} encontrado${ejecucion.resultados_encontrados !== 1 ? 's' : ''}`
                                    : 'N/A'
                                  }
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-body-auxiliary text-text-secondary">Tipo:</span>
                                <span className="text-body-auxiliary text-text-primary">
                                  {ejecucion.tipo_resultados}
                                </span>
                              </div>

                              {ejecucion.notificacion_enviada && (
                                <div className="flex items-center gap-xs mt-sm pt-sm border-t border-border-default">
                                  <Mail className="w-3 h-3 text-feedback-info" />
                                  <span className="text-body-auxiliary text-feedback-info">
                                    Notificación enviada
                                  </span>
                                </div>
                              )}
                            </div>

                            {ejecucion.error_detalle && (
                              <div className="mt-sm pt-sm border-t border-border-default">
                                <p className="text-body-auxiliary text-feedback-error">
                                  {ejecucion.error_detalle}
                                </p>
                              </div>
                            )}
                          </Card.Content>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Botón Ver Más */}
                    {!showAllExecutions && (solicitudData.historial_ejecuciones?.length || 0) > 5 && (
                      <div className="mt-md pt-md border-t border-border-default">
                        <Button
                          variant="secondary"
                          onClick={() => setShowAllExecutions(true)}
                          className="w-full"
                          icon={<ChevronDown size={16} />}
                        >
                          Ver {(solicitudData.historial_ejecuciones?.length || 0) - 5} ejecuciones más
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-lg">
                    <p className="text-body-paragraph text-text-secondary">
                      No hay ejecuciones registradas para esta solicitud
                    </p>
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Acciones Adicionales */}
          <Card size="lg" className="bg-gradient-to-r from-bg-canvas to-bg-light border-l-4 border-l-interactive-default">
            <Card.Content className="p-xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-xl">
                {/* Descripción */}
                <div className="flex-1">
                  <div className="flex items-center gap-sm mb-sm">
                    <div className="w-10 h-10 bg-interactive-default/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-interactive-default" />
                    </div>
                    <h3 className="text-heading-h3 font-heading text-text-primary">
                      Gestión Avanzada
                    </h3>
                  </div>
                  <p className="text-body-paragraph text-text-secondary mb-sm">
                    Accede a herramientas avanzadas para el manejo completo de tu solicitud judicial
                  </p>
                  <div className="flex flex-wrap gap-xs">
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-success/10 text-feedback-success text-body-auxiliary rounded-md">
                      <CheckCircle className="w-3 h-3 mr-xs" />
                      Exportación completa
                    </span>
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-info/10 text-feedback-info text-body-auxiliary rounded-md">
                      <Eye className="w-3 h-3 mr-xs" />
                      Análisis detallado
                    </span>
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-warning/10 text-feedback-warning text-body-auxiliary rounded-md">
                      <AlertTriangle className="w-3 h-3 mr-xs" />
                      Acción irreversible
                    </span>
                  </div>
                </div>
                
                {/* Botones */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm lg:flex lg:flex-col lg:gap-sm xl:flex-row xl:gap-sm">
                  <Button
                    variant="secondary"
                    onClick={handleDescargarReporte}
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                    icon={<Download size={16} />}
                  >
                    <span className="hidden sm:inline">Descargar Reporte</span>
                    <span className="sm:hidden">Descargar</span>
                  </Button>
                  
                  <Button
                    as={Link}
                    to={`/historial?solicitud=${id}`}
                    variant="secondary"
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                    icon={<ExternalLink size={16} />}
                  >
                    <span className="hidden sm:inline">Ver Historial</span>
                    <span className="sm:hidden">Historial</span>
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={handleEliminar}
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                    icon={<Trash2 size={16} />}
                  >
                    <span className="hidden sm:inline">Eliminar Solicitud</span>
                    <span className="sm:hidden">Eliminar</span>
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SolicitudDetallesPage;body-paragraph font-medium text-text-primary">
                                  {formatearFechaCorta(ejecucion.fecha)}
                                </p>
                                <p className="text-body-auxiliary text-text-secondary">
                                  {formatearTiempoRelativo(ejecucion.fecha)}
                                </p>
                              </div>
                              
                              {ejecucion.detalles_url && (
                                <Button
                                  as={Link}
                                  to={ejecucion.detalles_url}
                                  variant="ghost"
                                  size="sm"
                                  icon={<Eye size={14} />}
                                  aria-label="Ver detalles"
                                />
                              )}
                            </div>

                            {/* Resultados */}
                            <div className="space-y-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-body-auxiliary text-text-secondary">Resultados:</span>
                                <span className="text-body-paragraph text-text-primary">
                                  {ejecucion.resultados_encontrados !== null 
                                    ? `${ejecucion.resultados_encontrados} encontrado${ejecucion.resultados_encontrados !== 1 ? 's' : ''}`
                                    : 'N/A'
                                  }
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-body-auxiliary text-text-secondary">Tipo:</span>
                                <span className="text-body-auxiliary text-text-primary">
                                  {ejecucion.tipo_resultados}
                                </span>
                              </div>

                              {ejecucion.notificacion_enviada && (
                                <div className="flex items-center gap-xs mt-sm pt-sm border-t border-border-default">
                                  <Mail className="w-3 h-3 text-feedback-info" />
                                  <span className="text-body-auxiliary text-feedback-info">
                                    Notificación enviada
                                  </span>
                                </div>
                              )}
                            </div>

                            {ejecucion.error_detalle && (
                              <div className="mt-sm pt-sm border-t border-border-default">
                                <p className="text-body-auxiliary text-feedback-error">
                                  {ejecucion.error_detalle}
                                </p>
                              </div>
                            )}
                          </Card.Content>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Botón Ver Más */}
                    {!showAllExecutions && (solicitudData.historial_ejecuciones?.length || 0) > 5 && (
                      <div className="mt-md pt-md border-t border-border-default">
                        <Button
                          variant="secondary"
                          onClick={() => setShowAllExecutions(true)}
                          className="w-full"
                          icon={<ChevronDown size={16} />}
                        >
                          Ver {(solicitudData.historial_ejecuciones?.length || 0) - 5} ejecuciones más
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-lg">
                    <p className="text-body-paragraph text-text-secondary">
                      No hay ejecuciones registradas para esta solicitud
                    </p>
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Acciones Adicionales */}
          <Card size="lg" className="bg-gradient-to-r from-bg-canvas to-bg-light border-l-4 border-l-interactive-default">
            <Card.Content className="p-xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-xl">
                {/* Descripción */}
                <div className="flex-1">
                  <div className="flex items-center gap-sm mb-sm">
                    <div className="w-10 h-10 bg-interactive-default/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-interactive-default" />
                    </div>
                    <h3 className="text-heading-h3 font-heading text-text-primary">
                      Gestión Avanzada
                    </h3>
                  </div>
                  <p className="text-body-paragraph text-text-secondary mb-sm">
                    Accede a herramientas avanzadas para el manejo completo de tu solicitud judicial
                  </p>
                  <div className="flex flex-wrap gap-xs">
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-success/10 text-feedback-success text-body-auxiliary rounded-md">
                      <CheckCircle className="w-3 h-3 mr-xs" />
                      Exportación completa
                    </span>
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-info/10 text-feedback-info text-body-auxiliary rounded-md">
                      <Eye className="w-3 h-3 mr-xs" />
                      Análisis detallado
                    </span>
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-warning/10 text-feedback-warning text-body-auxiliary rounded-md">
                      <AlertTriangle className="w-3 h-3 mr-xs" />
                      Acción irreversible
                    </span>
                  </div>
                </div>
                
                {/* Botones */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm lg:flex lg:flex-col lg:gap-sm xl:flex-row xl:gap-sm">
                  <Button
                    variant="secondary"
                    onClick={handleDescargarReporte}
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                    icon={<Download size={16} />}
                  >
                    <span className="hidden sm:inline">Descargar Reporte</span>
                    <span className="sm:hidden">Descargar</span>
                  </Button>
                  
                  <Button
                    as={Link}
                    to={`/historial?solicitud=${id}`}
                    variant="secondary"
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                    icon={<ExternalLink size={16} />}
                  >
                    <span className="hidden sm:inline">Ver Historial</span>
                    <span className="sm:hidden">Historial</span>
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={handleEliminar}
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                    icon={<Trash2 size={16} />}
                  >
                    <span className="hidden sm:inline">Eliminar Solicitud</span>
                    <span className="sm:hidden">Eliminar</span>
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SolicitudDetallesPage;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light">
        <div className="container mx-auto px-md md:px-lg py-xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-md" />
              <p className="text-body-paragraph text-text-secondary">
                Cargando detalles de la solicitud...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-bg-light">
        <div className="container mx-auto px-md md:px-lg py-xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-feedback-error mx-auto mb-md" />
              <h2 className="text-heading-h3 font-heading text-text-primary mb-sm">
                Error al cargar
              </h2>
              <p className="text-body-paragraph text-text-secondary mb-lg">
                {error}
              </p>
              <Button
                variant="primary"
                onClick={cargarSolicitudData}
              >
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!solicitudData) {
    return (
      <div className="min-h-screen bg-bg-light">
        <div className="container mx-auto px-md md:px-lg py-xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-feedback-warning mx-auto mb-md" />
              <h2 className="text-heading-h3 font-heading text-text-primary mb-sm">
                Solicitud no encontrada
              </h2>
              <p className="text-body-paragraph text-text-secondary mb-lg">
                La solicitud que buscas no existe o ha sido eliminada
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
              >
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ejecucionesAMostrar = showAllExecutions 
    ? (solicitudData.historial_ejecuciones || []) 
    : (solicitudData.historial_ejecuciones || []).slice(0, 5);

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header Híbrido - HTML puro para funcionalidad */
      <div style={{backgroundColor: 'white', borderBottom: '1px solid #d1d5db', position: 'sticky', top: 0, zIndex: 1000}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '16px'}}>
          {/* Mobile Layout */}
          <div style={{display: window.innerWidth < 1024 ? 'block' : 'none'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
              {/* Botón volver */}
              <button 
                onClick={() => navigate(-1)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ArrowLeft size={16} />
                <span>Volver</span>
              </button>
              
              {/* Botones de acción */}
              <div style={{display: 'flex', gap: '8px'}}>
                {loadingToggle ? (
                  <button 
                    disabled
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'not-allowed'
                    }}
                  >
                    {solicitudData.estado === 'pausada' ? 'Reanudando...' : 'Pausando...'}
                  </button>
                ) : (
                  <button
                    onClick={handleToggleStatus}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: solicitudData.estado === 'pausada' ? '#FACC15' : '#f3f4f6',
                      border: '1px solid ' + (solicitudData.estado === 'pausada' ? '#FACC15' : '#d1d5db'),
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      color: solicitudData.estado === 'pausada' ? '#374151' : '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {solicitudData.estado === 'pausada' ? <PlayCircle size={14} /> : <PauseCircle size={14} />}
                    {solicitudData.estado === 'pausada' ? 'Reanudar' : 'Pausar'}
                  </button>
                )}
                
                {/* Menú de acciones */}
                <div style={{position: 'relative'}}>
                  <button
                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                    style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  {showActionsMenu && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '4px',
                      width: '192px',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      zIndex: 20
                    }}>
                      <div style={{padding: '4px'}}>
                        <button
                          onClick={() => {
                            handleDescargarReporte();
                            setShowActionsMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            textAlign: 'left',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <Download size={14} />
                          Descargar
                        </button>
                        <button
                          onClick={() => {
                            navigate(`/historial?solicitud=${id}`);
                            setShowActionsMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            textAlign: 'left',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <ExternalLink size={14} />
                          Ver en Historial
                        </button>
                        
                        <div style={{height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0'}}></div>
                        
                        <button
                          onClick={() => {
                            handleEliminar();
                            setShowActionsMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            textAlign: 'left',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#dc2626'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#dc2626';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#dc2626';
                          }}
                        >
                          <Trash2 size={14} />
                          Eliminar Solicitud
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-md md:px-lg py-xl">
        <div className="max-w-6xl mx-auto">
          {/* Estadísticas Rápidas Mejoradas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-xl">
            <MetricaCard
              titulo="Total Ejecuciones"
              valor={solicitudData.total_ejecuciones || 0}
              icono={<Clock className="w-6 h-6 text-interactive-default" />}
              color="text-text-primary"
              contexto={`+${Math.floor(Math.random() * 5) + 1} esta semana`}
            />
            
            <MetricaCard
              titulo="Exitosas"
              valor={solicitudData.ejecuciones_exitosas || 0}
              icono={<CheckCircle className="w-6 h-6 text-feedback-success" />}
              color="text-feedback-success"
              contexto={`${Math.round(((solicitudData.ejecuciones_exitosas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}% tasa de éxito`}
              porcentaje={Math.round(((solicitudData.ejecuciones_exitosas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}
            />
            
            <MetricaCard
              titulo="Fallidas"
              valor={solicitudData.ejecuciones_fallidas || 0}
              icono={<XCircle className="w-6 h-6 text-feedback-error" />}
              color="text-feedback-error"
              contexto={`${Math.round(((solicitudData.ejecuciones_fallidas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}% tasa de error`}
              porcentaje={Math.round(((solicitudData.ejecuciones_fallidas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}
            />
            
            <MetricaCard
              titulo="Última Ejecución"
              valor={solicitudData.ultima_ejecucion ? formatearTiempoRelativo(solicitudData.ultima_ejecucion) : 'N/A'}
              icono={<Clock className="w-6 h-6 text-text-secondary" />}
              color="text-text-primary"
              contexto={`Próxima en ${calcularProximaEjecucion(solicitudData.frecuencia_consulta)}`}
              isAnimated={true}
            />
          </div>

          {/* Información Principal Mejorada */}
          <Card size="lg" className="mb-xl">
            <Card.Header>
              <Card.Title>Información de la Solicitud</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
                {/* Columna 1: Información principal */}
                <div className="space-y-lg">
                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Estado Actual
                    </label>
                    <div className="flex items-center gap-sm">
                      {getEstadoBadge(solicitudData.estado)}
                      <span className="text-body-auxiliary text-text-secondary">
                        desde {formatearTiempoRelativo(solicitudData.fecha_modificacion)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Número de Radicado
                    </label>
                    <div className="flex items-center gap-sm">
                      <div className="flex items-center gap-sm bg-bg-light px-sm py-xs rounded border">
                        <FileText size={16} className="text-interactive-default" />
                        <p className="text-body-paragraph text-text-primary font-mono">
                          {solicitudData.numero_radicado || 'N/A'}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={<Copy size={14} />}
                        onClick={handleCopiarRadicado}
                        aria-label="Copiar radicado"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Tipo de Consulta
                    </label>
                    <div className="flex items-center gap-sm">
                      <FileText size={16} className="text-interactive-default" />
                      <p className="text-body-paragraph text-text-primary">
                        {solicitudData.tipo_consulta || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Columna 2: Configuración */}
                <div className="space-y-lg">
                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Frecuencia de Monitoreo
                    </label>
                    <div className="flex items-center gap-sm">
                      <Calendar size={16} className="text-interactive-default" />
                      <p className="text-body-paragraph text-text-primary">
                        {solicitudData.frecuencia_consulta || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Notificaciones
                    </label>
                    <div className="flex items-center gap-sm">
                      {solicitudData.notificaciones_habilitadas ? (
                        <>
                          <Bell size={16} className="text-feedback-success" />
                          <span className="text-body-paragraph text-feedback-success">Habilitadas</span>
                        </>
                      ) : (
                        <>
                          <BellOff size={16} className="text-text-secondary" />
                          <span className="text-body-paragraph text-text-secondary">Deshabilitadas</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Creada
                    </label>
                    <div className="space-y-xs">
                      <p className="text-body-paragraph text-text-primary">
                        {formatearFechaCompleta(solicitudData.fecha_creacion)}
                      </p>
                      <p className="text-body-auxiliary text-text-secondary">
                        {formatearTiempoRelativo(solicitudData.fecha_creacion)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Historial */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
            {/* Historial de Eventos */}
            <Card size="lg">
              <Card.Header>
                <Card.Title>Historial de Eventos</Card.Title>
              </Card.Header>
              <Card.Content>
                {solicitudData.historial_eventos?.length > 0 ? (
                  <div className="space-y-md">
                    {solicitudData.historial_eventos.map((evento, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-sm p-sm border border-border-default rounded-md"
                      >
                        <div className="w-2 h-2 bg-interactive-default rounded-full mt-2 flex-shrink-0" />
                        
                        <div className="flex-1">
                          <p className="text-body-paragraph text-text-primary mb-xs">
                            {evento.descripcion}
                          </p>
                          <p className="text-body-auxiliary text-text-secondary">
                            {formatearFechaCompleta(evento.fecha)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-lg">
                    <p className="text-body-paragraph text-text-secondary">
                      No hay eventos registrados para esta solicitud
                    </p>
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Historial de Ejecuciones */}
            <Card size="lg">
              <Card.Header>
                <Card.Title>Historial de Ejecuciones</Card.Title>
              </Card.Header>
              <Card.Content>
                {solicitudData.historial_ejecuciones?.length > 0 ? (
                  <>
                    {/* Vista Desktop - Tabla */}
                    <div className="hidden lg:block">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                        <thead>
                          <tr className="border-b border-border-default">
                            <th className="text-left py-sm px-sm text-body-auxiliary font-medium text-text-secondary">
                              Fecha
                            </th>
                            <th className="text-left py-sm px-sm text-body-auxiliary font-medium text-text-secondary">
                              Estado
                            </th>
                            <th className="text-left py-sm px-sm text-body-auxiliary font-medium text-text-secondary">
                              Resultados
                            </th>
                            <th className="text-left py-sm px-sm text-body-auxiliary font-medium text-text-secondary">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {ejecucionesAMostrar.map((ejecucion, index) => (
                            <tr key={index} className="border-b border-border-default">
                              <td className="py-sm px-sm">
                                <div className="text-body-paragraph text-text-primary">
                                  {formatearFechaCorta(ejecucion.fecha)}
                                </div>
                                <div className="text-body-auxiliary text-text-secondary">
                                  Duración: {ejecucion.duracion}
                                </div>
                              </td>
                              
                              <td className="py-sm px-sm">
                                {getEjecucionBadge(ejecucion.estado)}
                              </td>
                              
                              <td className="py-sm px-sm">
                                <div className="text-body-paragraph text-text-primary">
                                  {ejecucion.resultados_encontrados !== null 
                                    ? `${ejecucion.resultados_encontrados} resultado${ejecucion.resultados_encontrados !== 1 ? 's' : ''}`
                                    : 'N/A'
                                  }
                                </div>
                                <div className="text-body-auxiliary text-text-secondary">
                                  {ejecucion.tipo_resultados}
                                </div>
                                {ejecucion.notificacion_enviada && (
                                  <div className="flex items-center gap-xs mt-xs">
                                    <Mail className="w-3 h-3 text-feedback-info" />
                                    <span className="text-body-auxiliary text-feedback-info">
                                      Notificación enviada
                                    </span>
                                  </div>
                                )}
                              </td>
                              
                              <td className="py-sm px-sm">
                                {ejecucion.detalles_url ? (
                                  <Button
                                    as={Link}
                                    to={ejecucion.detalles_url}
                                    variant="ghost"
                                    size="sm"
                                    icon={<Eye size={14} />}
                                  >
                                    Ver detalles
                                  </Button>
                                ) : (
                                  <span className="text-body-auxiliary text-text-secondary">
                                    {ejecucion.error_detalle || 'Sin detalles'}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Vista Mobile - Cards */}
                    <div className="block lg:hidden space-y-sm">
                      {ejecucionesAMostrar.map((ejecucion, index) => (
                        <Card 
                          key={index} 
                          size="sm" 
                          className="border-l-4 border-l-transparent hover:border-l-interactive-default transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
                        >
                          <Card.Content className="p-md">
                            <div className="flex justify-between items-start mb-sm">
                              <div className="flex-1">
                                <div className="flex items-center gap-sm mb-xs">
                                  {getEjecucionBadge(ejecucion.estado)}
                                  <span className="text-body-auxiliary text-text-secondary">
                                    {ejecucion.duracion}
                                  </span>
                                </div>
                                <p className="text-body-paragraph font-medium text-text-primary">
                                  {formatearFechaCorta(ejecucion.fecha)}
                                </p>
                                <p className="text-body-auxiliary text-text-secondary">
                                  {formatearTiempoRelativo(ejecucion.fecha)}
                                </p>
                              </div>
                              
                              {ejecucion.detalles_url && (
                                <Button
                                  as={Link}
                                  to={ejecucion.detalles_url}
                                  variant="ghost"
                                  size="sm"
                                  icon={<Eye size={14} />}
                                  aria-label="Ver detalles"
                                />
                              )}
                            </div>

                            {/* Resultados */}
                            <div className="space-y-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-body-auxiliary text-text-secondary">Resultados:</span>
                                <span className="text-body-paragraph text-text-primary">
                                  {ejecucion.resultados_encontrados !== null 
                                    ? `${ejecucion.resultados_encontrados} encontrado${ejecucion.resultados_encontrados !== 1 ? 's' : ''}`
                                    : 'N/A'
                                  }
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-body-auxiliary text-text-secondary">Tipo:</span>
                                <span className="text-body-auxiliary text-text-primary">
                                  {ejecucion.tipo_resultados}
                                </span>
                              </div>

                              {ejecucion.notificacion_enviada && (
                                <div className="flex items-center gap-xs mt-sm pt-sm border-t border-border-default">
                                  <Mail className="w-3 h-3 text-feedback-info" />
                                  <span className="text-body-auxiliary text-feedback-info">
                                    Notificación enviada
                                  </span>
                                </div>
                              )}
                            </div>

                            {ejecucion.error_detalle && (
                              <div className="mt-sm pt-sm border-t border-border-default">
                                <p className="text-body-auxiliary text-feedback-error">
                                  {ejecucion.error_detalle}
                                </p>
                              </div>
                            )}
                          </Card.Content>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Botón Ver Más - Común para ambas vistas */}
                    {!showAllExecutions && (solicitudData.historial_ejecuciones?.length || 0) > 5 && (
                      <div className="mt-md pt-md border-t border-border-default">
                        <Button
                          variant="secondary"
                          onClick={() => setShowAllExecutions(true)}
                          className="w-full"
                          icon={<ChevronDown size={16} />}
                        >
                          Ver {(solicitudData.historial_ejecuciones?.length || 0) - 5} ejecuciones más
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-lg">
                    <p className="text-body-paragraph text-text-secondary">
                      No hay ejecuciones registradas para esta solicitud
                    </p>
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Acciones Adicionales Mejorada */}
          <Card size="lg" className="mt-xl bg-gradient-to-r from-bg-canvas to-bg-light border-l-4 border-l-interactive-default">
            <Card.Content className="p-xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-xl">
                {/* Descripción mejorada */}
                <div className="flex-1">
                  <div className="flex items-center gap-sm mb-sm">
                    <div className="w-10 h-10 bg-interactive-default/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-interactive-default" />
                    </div>
                    <h3 className="text-heading-h3 font-heading text-text-primary">
                      Gestión Avanzada
                    </h3>
                  </div>
                  <p className="text-body-paragraph text-text-secondary mb-sm">
                    Accede a herramientas avanzadas para el manejo completo de tu solicitud judicial
                  </p>
                  <div className="flex flex-wrap gap-xs">
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-success/10 text-feedback-success text-body-auxiliary rounded-md">
                      <CheckCircle className="w-3 h-3 mr-xs" />
                      Exportación completa
                    </span>
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-info/10 text-feedback-info text-body-auxiliary rounded-md">
                      <Eye className="w-3 h-3 mr-xs" />
                      Análisis detallado
                    </span>
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-warning/10 text-feedback-warning text-body-auxiliary rounded-md">
                      <AlertTriangle className="w-3 h-3 mr-xs" />
                      Acción irreversible
                    </span>
                  </div>
                </div>
                
                {/* Botones organizados en grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm lg:flex lg:flex-col lg:gap-sm xl:flex-row xl:gap-sm">
                  {/* Descargar Reporte */}
                  <div className="group">
                    <Button
                      variant="secondary"
                      onClick={handleDescargarReporte}
                      className="w-full transition-all duration-200 hover:scale-105 active:scale-95 group-hover:shadow-md"
                    >
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 bg-feedback-success/10 rounded-lg flex items-center justify-center group-hover:bg-feedback-success/20 transition-colors">
                          <Download className="w-4 h-4 text-feedback-success" />
                        </div>
                        <div className="text-left hidden sm:block">
                          <div className="text-body-paragraph font-medium text-text-primary">Descargar</div>
                          <div className="text-body-auxiliary text-text-secondary">Reporte PDF</div>
                        </div>
                        <div className="text-left block sm:hidden">
                          <div className="text-body-paragraph font-medium text-text-primary">Descargar Reporte</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                  
                  {/* Ver en Historial */}
                  <div className="group">
                    <Button
                      as={Link}
                      to={`/historial?solicitud=${id}`}
                      variant="secondary"
                      className="w-full transition-all duration-200 hover:scale-105 active:scale-95 group-hover:shadow-md"
                    >
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 bg-feedback-info/10 rounded-lg flex items-center justify-center group-hover:bg-feedback-info/20 transition-colors">
                          <ExternalLink className="w-4 h-4 text-feedback-info" />
                        </div>
                        <div className="text-left hidden sm:block">
                          <div className="text-body-paragraph font-medium text-text-primary">Ver Historial</div>
                          <div className="text-body-auxiliary text-text-secondary">Completo</div>
                        </div>
                        <div className="text-left block sm:hidden">
                          <div className="text-body-paragraph font-medium text-text-primary">Ver Historial</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                  
                  {/* Eliminar Solicitud */}
                  <div className="group">
                    <Button
                      variant="destructive"
                      onClick={handleEliminar}
                      className="w-full transition-all duration-200 hover:scale-105 active:scale-95 group-hover:shadow-lg"
                    >
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 bg-bg-canvas/20 rounded-lg flex items-center justify-center group-hover:bg-bg-canvas/30 transition-colors">
                          <Trash2 className="w-4 h-4 text-bg-canvas" />
                        </div>
                        <div className="text-left hidden sm:block">
                          <div className="text-body-paragraph font-medium text-bg-canvas">Eliminar</div>
                          <div className="text-body-auxiliary text-bg-canvas/80">Permanente</div>
                        </div>
                        <div className="text-left block sm:hidden">
                          <div className="text-body-paragraph font-medium text-bg-canvas">Eliminar Solicitud</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SolicitudDetallesPage;
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            textAlign: 'left',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <ExternalLink size={14} />
                          Ver Historial
                        </button>
                        <div style={{height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0'}}></div>
                        <button
                          onClick={() => {
                            handleEliminar();
                            setShowActionsMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            textAlign: 'left',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            color: '#dc2626'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#dc2626';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#dc2626';
                          }}
                        >
                          <Trash2 size={14} />
                          Eliminar Solicitud
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-md md:px-lg py-xl">
        <div className="max-w-6xl mx-auto">
          {/* Estadísticas Rápidas Mejoradas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-xl">
            <MetricaCard
              titulo="Total Ejecuciones"
              valor={solicitudData.total_ejecuciones || 0}
              icono={<Clock className="w-6 h-6 text-interactive-default" />}
              color="text-text-primary"
              contexto={`+${Math.floor(Math.random() * 5) + 1} esta semana`}
            />
            
            <MetricaCard
              titulo="Exitosas"
              valor={solicitudData.ejecuciones_exitosas || 0}
              icono={<CheckCircle className="w-6 h-6 text-feedback-success" />}
              color="text-feedback-success"
              contexto={`${Math.round(((solicitudData.ejecuciones_exitosas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}% tasa de éxito`}
              porcentaje={Math.round(((solicitudData.ejecuciones_exitosas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}
            />
            
            <MetricaCard
              titulo="Fallidas"
              valor={solicitudData.ejecuciones_fallidas || 0}
              icono={<XCircle className="w-6 h-6 text-feedback-error" />}
              color="text-feedback-error"
              contexto={`${Math.round(((solicitudData.ejecuciones_fallidas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}% tasa de error`}
              porcentaje={Math.round(((solicitudData.ejecuciones_fallidas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}
            />
            
            <MetricaCard
              titulo="Última Ejecución"
              valor={solicitudData.ultima_ejecucion || '28 de ene de 2025'}
              icono={<Clock className="w-6 h-6 text-text-secondary" />}
              color="text-text-primary"
              contexto={`Próxima en ${calcularProximaEjecucion(solicitudData.frecuencia_consulta)}`}
              isAnimated={true}
            />
          </div>

          {/* Información Principal Mejorada */}
          <Card size="lg" className="mb-xl">
            <Card.Header>
              <Card.Title>Información de la Solicitud</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
                {/* Columna 1: Información principal */}
                <div className="space-y-lg">
                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Estado Actual
                    </label>
                    <div className="flex items-center gap-sm">
                      {getEstadoBadge(solicitudData.estado)}
                      <span className="text-body-auxiliary text-text-secondary">
                        desde N/A
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Número de Radicado
                    </label>
                    <div className="flex items-center gap-sm">
                      <div className="flex items-center gap-sm bg-bg-light px-sm py-xs rounded border">
                        <FileText size={16} className="text-interactive-default" />
                        <p className="text-body-paragraph text-text-primary font-mono">
                          {solicitudData.numero_radicado || 'N/A'}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={<Copy size={14} />}
                        onClick={handleCopiarRadicado}
                        aria-label="Copiar radicado"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Tipo de Consulta
                    </label>
                    <div className="flex items-center gap-sm">
                      <FileText size={16} className="text-interactive-default" />
                      <p className="text-body-paragraph text-text-primary">
                        {solicitudData.tipo_consulta || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Columna 2: Configuración */}
                <div className="space-y-lg">
                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Frecuencia de Monitoreo
                    </label>
                    <div className="flex items-center gap-sm">
                      <Calendar size={16} className="text-interactive-default" />
                      <p className="text-body-paragraph text-text-primary">
                        {solicitudData.frecuencia_consulta || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Notificaciones
                    </label>
                    <div className="flex items-center gap-sm">
                      {solicitudData.notificaciones_habilitadas ? (
                        <>
                          <Bell size={16} className="text-feedback-success" />
                          <span className="text-body-paragraph text-feedback-success">Habilitadas</span>
                        </>
                      ) : (
                        <>
                          <BellOff size={16} className="text-text-secondary" />
                          <span className="text-body-paragraph text-text-secondary">Deshabilitadas</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Creada
                    </label>
                    <div className="space-y-xs">
                      <p className="text-body-paragraph text-text-primary">
                        miércoles, 15 de enero de 2025, 05:00 a.&nbsp;m.
                      </p>
                      <p className="text-body-auxiliary text-text-secondary">
                        15 de ene de 2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Historial */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
            {/* Historial de Eventos */}
            <Card size="lg">
              <Card.Header>
                <Card.Title>Historial de Eventos</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-center py-lg">
                  <p className="text-body-paragraph text-text-secondary">
                    No hay eventos registrados para esta solicitud
                  </p>
                </div>
              </Card.Content>
            </Card>

            {/* Historial de Ejecuciones */}
            <Card size="lg">
              <Card.Header>
                <Card.Title>Historial de Ejecuciones</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-center py-lg">
                  <p className="text-body-paragraph text-text-secondary">
                    No hay ejecuciones registradas para esta solicitud
                  </p>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Acciones Adicionales Mejorada */}
          <Card size="lg" className="mt-xl bg-gradient-to-r from-bg-canvas to-bg-light border-l-4 border-l-interactive-default">
            <Card.Content className="p-xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-xl">
                {/* Descripción mejorada */}
                <div className="flex-1">
                  <div className="flex items-center gap-sm mb-sm">
                    <div className="w-10 h-10 bg-interactive-default/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-interactive-default" />
                    </div>
                    <h3 className="text-heading-h3 font-heading text-text-primary">
                      Gestión Avanzada
                    </h3>
                  </div>
                  <p className="text-body-paragraph text-text-secondary mb-sm">
                    Accede a herramientas avanzadas para el manejo completo de tu solicitud judicial
                  </p>
                  <div className="flex flex-wrap gap-xs">
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-success/10 text-feedback-success text-body-auxiliary rounded-md">
                      <CheckCircle className="w-3 h-3 mr-xs" />
                      Exportación completa
                    </span>
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-info/10 text-feedback-info text-body-auxiliary rounded-md">
                      <Eye className="w-3 h-3 mr-xs" />
                      Análisis detallado
                    </span>
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-warning/10 text-feedback-warning text-body-auxiliary rounded-md">
                      <AlertTriangle className="w-3 h-3 mr-xs" />
                      Acción irreversible
                    </span>
                  </div>
                </div>
                
                {/* Botones organizados en grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm lg:flex lg:flex-col lg:gap-sm xl:flex-row xl:gap-sm">
                  {/* Descargar Reporte */}
                  <div className="group">
                    <Button
                      variant="secondary"
                      onClick={handleDescargarReporte}
                      className="w-full transition-all duration-200 hover:scale-105 active:scale-95 group-hover:shadow-md"
                    >
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 bg-feedback-success/10 rounded-lg flex items-center justify-center group-hover:bg-feedback-success/20 transition-colors">
                          <Download className="w-4 h-4 text-feedback-success" />
                        </div>
                        <div className="text-left hidden sm:block">
                          <div className="text-body-paragraph font-medium text-text-primary">Descargar</div>
                          <div className="text-body-auxiliary text-text-secondary">Reporte PDF</div>
                        </div>
                        <div className="text-left block sm:hidden">
                          <div className="text-body-paragraph font-medium text-text-primary">Descargar Reporte</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                  
                  {/* Ver en Historial */}
                  <div className="group">
                    <Button
                      as={Link}
                      to={`/historial?solicitud=${id}`}
                      variant="secondary"
                      className="w-full transition-all duration-200 hover:scale-105 active:scale-95 group-hover:shadow-md"
                    >
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 bg-feedback-info/10 rounded-lg flex items-center justify-center group-hover:bg-feedback-info/20 transition-colors">
                          <ExternalLink className="w-4 h-4 text-feedback-info" />
                        </div>
                        <div className="text-left hidden sm:block">
                          <div className="text-body-paragraph font-medium text-text-primary">Ver Historial</div>
                          <div className="text-body-auxiliary text-text-secondary">Completo</div>
                        </div>
                        <div className="text-left block sm:hidden">
                          <div className="text-body-paragraph font-medium text-text-primary">Ver Historial</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                  
                  {/* Eliminar Solicitud */}
                  <div className="group">
                    <Button
                      variant="destructive"
                      onClick={handleEliminar}
                      className="w-full transition-all duration-200 hover:scale-105 active:scale-95 group-hover:shadow-lg"
                    >
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 bg-bg-canvas/20 rounded-lg flex items-center justify-center group-hover:bg-bg-canvas/30 transition-colors">
                          <Trash2 className="w-4 h-4 text-bg-canvas" />
                        </div>
                        <div className="text-left hidden sm:block">
                          <div className="text-body-paragraph font-medium text-bg-canvas">Eliminar</div>
                          <div className="text-body-auxiliary text-bg-canvas/80">Permanente</div>
                        </div>
                        <div className="text-left block sm:hidden">
                          <div className="text-body-paragraph font-medium text-bg-canvas">Eliminar Solicitud</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SolicitudDetallesPage;
                            e.target.style.color = '#dc2626';
                          }}
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Título mobile */}
            <div>
              <h1 style={{fontSize: '20px', fontWeight: '600', color: '#111827', lineHeight: '1.25'}}>
                {solicitudData.nombre_descriptivo}
              </h1>
            </div>
            
            {/* Breadcrumb mobile */}
            <nav style={{display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280', marginTop: '12px'}}>
              <button 
                onClick={() => navigate('/dashboard')} 
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.color = '#111827'}
                onMouseLeave={(e) => e.target.style.color = '#6b7280'}
              >
                Dashboard
              </button>
              <ChevronRight size={14} style={{margin: '0 4px', color: '#d1d5db'}} />
              <span style={{color: '#111827'}}>Detalles</span>
            </nav>
          </div>
          
          {/* Desktop Layout */}
          <div style={{display: window.innerWidth >= 1024 ? 'block' : 'none'}}>
            {/* Breadcrumb desktop */}
            <nav style={{display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280', marginBottom: '12px'}}>
              <button 
                onClick={() => navigate('/dashboard')} 
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.color = '#111827'}
                onMouseLeave={(e) => e.target.style.color = '#6b7280'}
              >
                Dashboard
              </button>
              <ChevronRight size={14} style={{margin: '0 4px', color: '#d1d5db'}} />
              <span style={{color: '#111827'}}>Detalles de Solicitud</span>
            </nav>
            
            {/* Header content desktop */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px'}}>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                  <button
                    onClick={() => navigate(-1)}
                    style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '4px'
                    }}
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h1 style={{fontSize: '30px', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>
                      {solicitudData.nombre_descriptivo}
                    </h1>
                    <p style={{color: '#6b7280', fontSize: '16px'}}>
                      Revisa los detalles y el progreso de tu consulta judicial automatizada
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Acciones principales desktop */}
              <div style={{display: 'flex', gap: '12px'}}>
                {loadingToggle ? (
                  <button 
                    disabled
                    style={{
                      padding: '12px 16px',
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      cursor: 'not-allowed'
                    }}
                  >
                    {solicitudData.estado === 'pausada' ? 'Reanudando...' : 'Pausando...'}
                  </button>
                ) : (
                  <button
                    onClick={handleToggleStatus}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: solicitudData.estado === 'pausada' ? '#FACC15' : '#f3f4f6',
                      border: '1px solid ' + (solicitudData.estado === 'pausada' ? '#FACC15' : '#d1d5db'),
                      borderRadius: '6px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {solicitudData.estado === 'pausada' ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
                    {solicitudData.estado === 'pausada' ? 'Reanudar' : 'Pausar'}
                  </button>
                )}
                
                {/* Menú desktop */}
                <div style={{position: 'relative'}}>
                  <button
                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                    style={{
                      padding: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  {showActionsMenu && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '4px',
                      width: '192px',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      zIndex: 20
                    }}>
                      <div style={{padding: '4px'}}>
                        <button
                          onClick={() => {
                            handleDescargarReporte();
                            setShowActionsMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            textAlign: 'left',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <Download size={14} />
                          Descargar Reporte
                        </button>
                        
                        <button
                          onClick={() => {
                            navigate(`/historial?solicitud=${id}`);
                            setShowActionsMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            textAlign: 'left',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <ExternalLink size={14} />
                          Ver en Historial
                        </button>
                        
                        <div style={{height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0'}}></div>
                        
                        <button
                          onClick={() => {
                            handleEliminar();
                            setShowActionsMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            textAlign: 'left',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#dc2626'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#dc2626';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#dc2626';
                          }}
                        >
                          <Trash2 size={14} />
                          Eliminar Solicitud
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-md md:px-lg py-xl">
        <div className="max-w-6xl mx-auto">
          {/* Estadísticas Rápidas Mejoradas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-xl">
            <MetricaCard
              titulo="Total Ejecuciones"
              valor={solicitudData.total_ejecuciones || 0}
              icono={<Clock className="w-6 h-6 text-interactive-default" />}
              color="text-text-primary"
              contexto={`+${Math.floor(Math.random() * 5) + 1} esta semana`}
            />
            
            <MetricaCard
              titulo="Exitosas"
              valor={solicitudData.ejecuciones_exitosas || 0}
              icono={<CheckCircle className="w-6 h-6 text-feedback-success" />}
              color="text-feedback-success"
              contexto={`${Math.round(((solicitudData.ejecuciones_exitosas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}% tasa de éxito`}
              porcentaje={Math.round(((solicitudData.ejecuciones_exitosas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}
            />
            
            <MetricaCard
              titulo="Fallidas"
              valor={solicitudData.ejecuciones_fallidas || 0}
              icono={<XCircle className="w-6 h-6 text-feedback-error" />}
              color="text-feedback-error"
              contexto={`${Math.round(((solicitudData.ejecuciones_fallidas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}% tasa de error`}
              porcentaje={Math.round(((solicitudData.ejecuciones_fallidas || 0) / (solicitudData.total_ejecuciones || 1)) * 100)}
            />
            
            <MetricaCard
              titulo="Última Ejecución"
              valor={solicitudData.ultima_ejecucion ? formatearTiempoRelativo(solicitudData.ultima_ejecucion) : 'N/A'}
              icono={<Clock className="w-6 h-6 text-text-secondary" />}
              color="text-text-primary"
              contexto={`Próxima en ${calcularProximaEjecucion(solicitudData.frecuencia_consulta)}`}
              isAnimated={true}
            />
          </div>

          {/* Información Principal Mejorada */}
          <Card size="lg" className="mb-xl">
            <Card.Header>
              <Card.Title>Información de la Solicitud</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
                {/* Columna 1: Información principal */}
                <div className="space-y-lg">
                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Estado Actual
                    </label>
                    <div className="flex items-center gap-sm">
                      {getEstadoBadge(solicitudData.estado)}
                      <span className="text-body-auxiliary text-text-secondary">
                        desde {formatearTiempoRelativo(solicitudData.fecha_modificacion)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Número de Radicado
                    </label>
                    <div className="flex items-center gap-sm">
                      <div className="flex items-center gap-sm bg-bg-light px-sm py-xs rounded border">
                        <FileText size={16} className="text-interactive-default" />
                        <p className="text-body-paragraph text-text-primary font-mono">
                          {solicitudData.numero_radicado || 'N/A'}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={<Copy size={14} />}
                        onClick={handleCopiarRadicado}
                        aria-label="Copiar radicado"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Tipo de Consulta
                    </label>
                    <div className="flex items-center gap-sm">
                      <FileText size={16} className="text-interactive-default" />
                      <p className="text-body-paragraph text-text-primary">
                        {solicitudData.tipo_consulta || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Columna 2: Configuración */}
                <div className="space-y-lg">
                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Frecuencia de Monitoreo
                    </label>
                    <div className="flex items-center gap-sm">
                      <Calendar size={16} className="text-interactive-default" />
                      <p className="text-body-paragraph text-text-primary">
                        {solicitudData.frecuencia_consulta || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Notificaciones
                    </label>
                    <div className="flex items-center gap-sm">
                      {solicitudData.notificaciones_habilitadas ? (
                        <>
                          <Bell size={16} className="text-feedback-success" />
                          <span className="text-body-paragraph text-feedback-success">Habilitadas</span>
                        </>
                      ) : (
                        <>
                          <BellOff size={16} className="text-text-secondary" />
                          <span className="text-body-paragraph text-text-secondary">Deshabilitadas</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-body-auxiliary font-medium text-text-secondary block mb-sm">
                      Creada
                    </label>
                    <div className="space-y-xs">
                      <p className="text-body-paragraph text-text-primary">
                        {formatearFechaCompleta(solicitudData.fecha_creacion)}
                      </p>
                      <p className="text-body-auxiliary text-text-secondary">
                        {formatearTiempoRelativo(solicitudData.fecha_creacion)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Historial */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
            {/* Historial de Eventos */}
            <Card size="lg">
              <Card.Header>
                <Card.Title>Historial de Eventos</Card.Title>
              </Card.Header>
              <Card.Content>
                {solicitudData.historial_eventos?.length > 0 ? (
                  <div className="space-y-md">
                    {solicitudData.historial_eventos.map((evento, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-sm p-sm border border-border-default rounded-md"
                      >
                        <div className="w-2 h-2 bg-interactive-default rounded-full mt-2 flex-shrink-0" />
                        
                        <div className="flex-1">
                          <p className="text-body-paragraph text-text-primary mb-xs">
                            {evento.descripcion}
                          </p>
                          <p className="text-body-auxiliary text-text-secondary">
                            {formatearFechaCompleta(evento.fecha)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-lg">
                    <p className="text-body-paragraph text-text-secondary">
                      No hay eventos registrados para esta solicitud
                    </p>
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Historial de Ejecuciones */}
            <Card size="lg">
              <Card.Header>
                <Card.Title>Historial de Ejecuciones</Card.Title>
              </Card.Header>
              <Card.Content>
                {solicitudData.historial_ejecuciones?.length > 0 ? (
                  <>
                    {/* Vista Desktop - Tabla */}
                    <div className="hidden lg:block">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                        <thead>
                          <tr className="border-b border-border-default">
                            <th className="text-left py-sm px-sm text-body-auxiliary font-medium text-text-secondary">
                              Fecha
                            </th>
                            <th className="text-left py-sm px-sm text-body-auxiliary font-medium text-text-secondary">
                              Estado
                            </th>
                            <th className="text-left py-sm px-sm text-body-auxiliary font-medium text-text-secondary">
                              Resultados
                            </th>
                            <th className="text-left py-sm px-sm text-body-auxiliary font-medium text-text-secondary">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {ejecucionesAMostrar.map((ejecucion, index) => (
                            <tr key={index} className="border-b border-border-default">
                              <td className="py-sm px-sm">
                                <div className="text-body-paragraph text-text-primary">
                                  {formatearFechaCorta(ejecucion.fecha)}
                                </div>
                                <div className="text-body-auxiliary text-text-secondary">
                                  Duración: {ejecucion.duracion}
                                </div>
                              </td>
                              
                              <td className="py-sm px-sm">
                                {getEjecucionBadge(ejecucion.estado)}
                              </td>
                              
                              <td className="py-sm px-sm">
                                <div className="text-body-paragraph text-text-primary">
                                  {ejecucion.resultados_encontrados !== null 
                                    ? `${ejecucion.resultados_encontrados} resultado${ejecucion.resultados_encontrados !== 1 ? 's' : ''}`
                                    : 'N/A'
                                  }
                                </div>
                                <div className="text-body-auxiliary text-text-secondary">
                                  {ejecucion.tipo_resultados}
                                </div>
                                {ejecucion.notificacion_enviada && (
                                  <div className="flex items-center gap-xs mt-xs">
                                    <Mail className="w-3 h-3 text-feedback-info" />
                                    <span className="text-body-auxiliary text-feedback-info">
                                      Notificación enviada
                                    </span>
                                  </div>
                                )}
                              </td>
                              
                              <td className="py-sm px-sm">
                                {ejecucion.detalles_url ? (
                                  <Button
                                    as={Link}
                                    to={ejecucion.detalles_url}
                                    variant="ghost"
                                    size="sm"
                                    icon={<Eye size={14} />}
                                  >
                                    Ver detalles
                                  </Button>
                                ) : (
                                  <span className="text-body-auxiliary text-text-secondary">
                                    {ejecucion.error_detalle || 'Sin detalles'}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Vista Mobile - Cards */}
                    <div className="block lg:hidden space-y-sm">
                      {ejecucionesAMostrar.map((ejecucion, index) => (
                        <Card 
                          key={index} 
                          size="sm" 
                          className="border-l-4 border-l-transparent hover:border-l-interactive-default transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
                        >
                          <Card.Content className="p-md">
                            <div className="flex justify-between items-start mb-sm">
                              <div className="flex-1">
                                <div className="flex items-center gap-sm mb-xs">
                                  {getEjecucionBadge(ejecucion.estado)}
                                  <span className="text-body-auxiliary text-text-secondary">
                                    {ejecucion.duracion}
                                  </span>
                                </div>
                                <p className="text-body-paragraph font-medium text-text-primary">
                                  {formatearFechaCorta(ejecucion.fecha)}
                                </p>
                                <p className="text-body-auxiliary text-text-secondary">
                                  {formatearTiempoRelativo(ejecucion.fecha)}
                                </p>
                              </div>
                              
                              {ejecucion.detalles_url && (
                                <Button
                                  as={Link}
                                  to={ejecucion.detalles_url}
                                  variant="ghost"
                                  size="sm"
                                  icon={<Eye size={14} />}
                                  aria-label="Ver detalles"
                                />
                              )}
                            </div>

                            {/* Resultados */}
                            <div className="space-y-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-body-auxiliary text-text-secondary">Resultados:</span>
                                <span className="text-body-paragraph text-text-primary">
                                  {ejecucion.resultados_encontrados !== null 
                                    ? `${ejecucion.resultados_encontrados} encontrado${ejecucion.resultados_encontrados !== 1 ? 's' : ''}`
                                    : 'N/A'
                                  }
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-body-auxiliary text-text-secondary">Tipo:</span>
                                <span className="text-body-auxiliary text-text-primary">
                                  {ejecucion.tipo_resultados}
                                </span>
                              </div>

                              {ejecucion.notificacion_enviada && (
                                <div className="flex items-center gap-xs mt-sm pt-sm border-t border-border-default">
                                  <Mail className="w-3 h-3 text-feedback-info" />
                                  <span className="text-body-auxiliary text-feedback-info">
                                    Notificación enviada
                                  </span>
                                </div>
                              )}
                            </div>

                            {ejecucion.error_detalle && (
                              <div className="mt-sm pt-sm border-t border-border-default">
                                <p className="text-body-auxiliary text-feedback-error">
                                  {ejecucion.error_detalle}
                                </p>
                              </div>
                            )}
                          </Card.Content>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Botón Ver Más - Común para ambas vistas */}
                    {!showAllExecutions && (solicitudData.historial_ejecuciones?.length || 0) > 5 && (
                      <div className="mt-md pt-md border-t border-border-default">
                        <Button
                          variant="secondary"
                          onClick={() => setShowAllExecutions(true)}
                          className="w-full"
                          icon={<ChevronDown size={16} />}
                        >
                          Ver {(solicitudData.historial_ejecuciones?.length || 0) - 5} ejecuciones más
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-lg">
                    <p className="text-body-paragraph text-text-secondary">
                      No hay ejecuciones registradas para esta solicitud
                    </p>
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Acciones Adicionales Mejorada */}
          <Card size="lg" className="mt-xl bg-gradient-to-r from-bg-canvas to-bg-light border-l-4 border-l-interactive-default">
            <Card.Content className="p-xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-xl">
                {/* Descripción mejorada */}
                <div className="flex-1">
                  <div className="flex items-center gap-sm mb-sm">
                    <div className="w-10 h-10 bg-interactive-default/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-interactive-default" />
                    </div>
                    <h3 className="text-heading-h3 font-heading text-text-primary">
                      Gestión Avanzada
                    </h3>
                  </div>
                  <p className="text-body-paragraph text-text-secondary mb-sm">
                    Accede a herramientas avanzadas para el manejo completo de tu solicitud judicial
                  </p>
                  <div className="flex flex-wrap gap-xs">
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-success/10 text-feedback-success text-body-auxiliary rounded-md">
                      <CheckCircle className="w-3 h-3 mr-xs" />
                      Exportación completa
                    </span>
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-info/10 text-feedback-info text-body-auxiliary rounded-md">
                      <Eye className="w-3 h-3 mr-xs" />
                      Análisis detallado
                    </span>
                    <span className="inline-flex items-center px-sm py-xs bg-feedback-warning/10 text-feedback-warning text-body-auxiliary rounded-md">
                      <AlertTriangle className="w-3 h-3 mr-xs" />
                      Acción irreversible
                    </span>
                  </div>
                </div>
                
                {/* Botones organizados en grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm lg:flex lg:flex-col lg:gap-sm xl:flex-row xl:gap-sm">
                  {/* Descargar Reporte */}
                  <div className="group">
                    <Button
                      variant="secondary"
                      onClick={handleDescargarReporte}
                      className="w-full transition-all duration-200 hover:scale-105 active:scale-95 group-hover:shadow-md"
                    >
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 bg-feedback-success/10 rounded-lg flex items-center justify-center group-hover:bg-feedback-success/20 transition-colors">
                          <Download className="w-4 h-4 text-feedback-success" />
                        </div>
                        <div className="text-left hidden sm:block">
                          <div className="text-body-paragraph font-medium text-text-primary">Descargar</div>
                          <div className="text-body-auxiliary text-text-secondary">Reporte PDF</div>
                        </div>
                        <div className="text-left block sm:hidden">
                          <div className="text-body-paragraph font-medium text-text-primary">Descargar Reporte</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                  
                  {/* Ver en Historial */}
                  <div className="group">
                    <Button
                      as={Link}
                      to={`/historial?solicitud=${id}`}
                      variant="secondary"
                      className="w-full transition-all duration-200 hover:scale-105 active:scale-95 group-hover:shadow-md"
                    >
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 bg-feedback-info/10 rounded-lg flex items-center justify-center group-hover:bg-feedback-info/20 transition-colors">
                          <ExternalLink className="w-4 h-4 text-feedback-info" />
                        </div>
                        <div className="text-left hidden sm:block">
                          <div className="text-body-paragraph font-medium text-text-primary">Ver Historial</div>
                          <div className="text-body-auxiliary text-text-secondary">Completo</div>
                        </div>
                        <div className="text-left block sm:hidden">
                          <div className="text-body-paragraph font-medium text-text-primary">Ver Historial</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                  
                  {/* Eliminar Solicitud */}
                  <div className="group">
                    <Button
                      variant="destructive"
                      onClick={handleEliminar}
                      className="w-full transition-all duration-200 hover:scale-105 active:scale-95 group-hover:shadow-lg"
                    >
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 bg-bg-canvas/20 rounded-lg flex items-center justify-center group-hover:bg-bg-canvas/30 transition-colors">
                          <Trash2 className="w-4 h-4 text-bg-canvas" />
                        </div>
                        <div className="text-left hidden sm:block">
                          <div className="text-body-paragraph font-medium text-bg-canvas">Eliminar</div>
                          <div className="text-body-auxiliary text-bg-canvas/80">Permanente</div>
                        </div>
                        <div className="text-left block sm:hidden">
                          <div className="text-body-paragraph font-medium text-bg-canvas">Eliminar Solicitud</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SolicitudDetallesPage;

/* CSS adicional para micro-interacciones */
// Estas clases deberían estar en el archivo CSS global o en tailwind.config.js
// animate-fade-in: Animación de entrada suave
// Si no funciona, usar: className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"