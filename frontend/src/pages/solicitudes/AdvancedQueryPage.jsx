import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Filter, Info } from 'lucide-react';
import { useSolicitudes } from '../../hooks/useSolicitudes';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import AdvancedQueryForm from '../../components/forms/AdvancedQueryForm';

const AdvancedQueryPage = () => {
  const navigate = useNavigate();
  const { createSolicitud, loading } = useSolicitudes();
  const { toast } = useToast();

  const handleBack = () => {
    navigate('/solicitudes/select-type');
  };

  const handleSubmit = async (formData) => {
    try {
      await createSolicitud(formData);
      toast.success('¡Éxito!', 'Solicitud avanzada creada exitosamente');
      
      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      toast.error('Error', 'Error al crear la solicitud. Por favor intenta nuevamente.');
      console.error('Error creating solicitud:', error);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header */}
      <header className="bg-bg-canvas border-b border-border-default">
        <div className="container mx-auto px-md md:px-lg py-md">
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<ArrowLeft size={16} />}
            onClick={handleBack}
            className="mb-sm"
          >
            Volver a Selección
          </Button>
          
          {/* Breadcrumb */}
          <nav className="flex items-center text-body-auxiliary text-text-secondary" aria-label="Breadcrumb">
            <Button.Link onClick={() => navigate('/dashboard')} className="text-body-auxiliary">
              Mis Solicitudes
            </Button.Link>
            <ChevronRight size={14} className="mx-xs text-border-default" />
            <Button.Link onClick={handleBack} className="text-body-auxiliary">
              Nueva Solicitud
            </Button.Link>
            <ChevronRight size={14} className="mx-xs text-border-default" />
            <span className="text-text-primary">Consulta Avanzada</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-md md:px-lg py-xl">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-xl">
            <div className="w-16 h-16 bg-feedback-warning rounded-2xl flex items-center justify-center mx-auto mb-md">
              <Filter size={32} className="text-bg-canvas" />
            </div>
            <h1 className="text-heading-h1 font-heading text-text-primary mb-sm">
              Configurar Consulta Avanzada
            </h1>
            <p className="text-body-paragraph text-text-secondary max-w-3xl mx-auto">
              Define criterios de búsqueda específicos y opciones avanzadas de configuración. 
              Puedes buscar por número de radicado o por información del demandante/demandado.
            </p>
          </div>

          {/* Form */}
          <AdvancedQueryForm 
            onSubmit={handleSubmit}
            loading={loading}
            onCancel={handleBack}
          />

          {/* Advanced Features Info */}
          <Card variant="info" size="lg" className="mt-xl">
            <Card.Header>
              <div className="flex items-center gap-sm">
                <Info size={20} className="text-feedback-info" />
                <Card.Title as="h3">Características de la Consulta Avanzada</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                <div className="space-y-sm">
                  <div className="w-8 h-8 bg-feedback-info rounded-lg flex items-center justify-center">
                    <span className="text-bg-canvas">🔍</span>
                  </div>
                  <h4 className="text-heading-h4 font-heading text-text-primary">
                    Búsqueda Flexible
                  </h4>
                  <p className="text-body-paragraph text-text-base">
                    Busca por número de radicado o por nombres y apellidos del demandante/demandado.
                  </p>
                </div>

                <div className="space-y-sm">
                  <div className="w-8 h-8 bg-feedback-success rounded-lg flex items-center justify-center">
                    <span className="text-bg-canvas">🎯</span>
                  </div>
                  <h4 className="text-heading-h4 font-heading text-text-primary">
                    Filtros Específicos
                  </h4>
                  <p className="text-body-paragraph text-text-base">
                    Filtra por departamento, ciudad, especialidad y despacho judicial específico.
                  </p>
                </div>

                <div className="space-y-sm">
                  <div className="w-8 h-8 bg-feedback-warning rounded-lg flex items-center justify-center">
                    <span className="text-bg-canvas">⚙️</span>
                  </div>
                  <h4 className="text-heading-h4 font-heading text-text-primary">
                    Configuración Detallada
                  </h4>
                  <p className="text-body-paragraph text-text-base">
                    Personaliza la frecuencia de monitoreo y recibe notificaciones específicas.
                  </p>
                </div>
              </div>
              
              <div className="mt-lg p-md bg-feedback-info-light rounded-lg border border-feedback-info">
                <p className="text-body-paragraph text-feedback-info">
                  <strong>💡 Consejo:</strong> Puedes dejar campos vacíos para búsquedas más amplias. 
                  Cuantos más criterios especifiques, más precisa será la búsqueda.
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdvancedQueryPage;