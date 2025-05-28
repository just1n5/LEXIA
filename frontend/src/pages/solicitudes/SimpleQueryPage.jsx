import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronRight, 
  Search, 
  Info, 
  Zap, 
  Target, 
  Mail, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useSolicitudes } from '../../hooks/useSolicitudes';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import SimpleQueryForm from '../../components/forms/SimpleQueryForm';

const SimpleQueryPage = () => {
  const navigate = useNavigate();
  const { createSolicitud, loading } = useSolicitudes();
  const { toast } = useToast();

  const handleBack = () => {
    navigate('/solicitudes/select-type');
  };

  const handleSubmit = async (formData) => {
    try {
      await createSolicitud(formData);
      toast.success('¡Éxito!', 'Solicitud creada exitosamente');
      
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
            <span className="text-text-primary">Consulta Sencilla</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-md md:px-lg py-xl">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-xl">
            <div className="w-16 h-16 bg-feedback-success rounded-2xl flex items-center justify-center mx-auto mb-md">
              <Search size={32} className="text-bg-canvas" />
            </div>
            <h1 className="text-heading-h1 font-heading text-text-primary mb-sm">
              Configurar Consulta Sencilla
            </h1>
            <p className="text-body-paragraph text-text-secondary max-w-2xl mx-auto">
              Ingresa el número de radicado y configura la frecuencia de consulta. 
              El proceso más directo para monitorear un caso específico.
            </p>
          </div>

          {/* Form */}
          <SimpleQueryForm 
            onSubmit={handleSubmit}
            loading={loading}
            onCancel={handleBack}
          />

          {/* Information Card */}
          <Card variant="success" size="lg" className="mt-xl">
            <Card.Header>
              <div className="flex items-center gap-sm">
                <Info size={20} className="text-feedback-success" />
                <Card.Title as="h3">Ventajas de la Consulta Sencilla</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-md">
                  <div className="flex items-start gap-sm">
                    <div className="w-8 h-8 bg-feedback-success rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap size={16} className="text-bg-canvas" />
                    </div>
                    <div>
                      <h4 className="text-heading-h4 font-heading text-text-primary mb-xs">
                        Configuración Rápida
                      </h4>
                      <p className="text-body-paragraph text-text-base">
                        Solo necesitas el número de radicado para comenzar el monitoreo automático.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-sm">
                    <div className="w-8 h-8 bg-feedback-info rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target size={16} className="text-bg-canvas" />
                    </div>
                    <div>
                      <h4 className="text-heading-h4 font-heading text-text-primary mb-xs">
                        Seguimiento Directo
                      </h4>
                      <p className="text-body-paragraph text-text-base">
                        Monitoreo específico y directo del proceso que te interesa.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-md">
                  <div className="flex items-start gap-sm">
                    <div className="w-8 h-8 bg-feedback-warning rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail size={16} className="text-bg-canvas" />
                    </div>
                    <div>
                      <h4 className="text-heading-h4 font-heading text-text-primary mb-xs">
                        Notificaciones Precisas
                      </h4>
                      <p className="text-body-paragraph text-text-base">
                        Recibe actualizaciones solo sobre el caso específico que estás monitoreando.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-sm">
                    <div className="w-8 h-8 bg-interactive-default rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={16} className="text-text-primary" />
                    </div>
                    <div>
                      <h4 className="text-heading-h4 font-heading text-text-primary mb-xs">
                        Ideal para Principiantes
                      </h4>
                      <p className="text-body-paragraph text-text-base">
                        Perfecto si es tu primera vez usando el sistema de consultas automáticas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-lg p-md bg-feedback-success-light rounded-lg border border-feedback-success">
                <p className="text-body-paragraph text-feedback-success">
                  <strong className="flex items-center gap-xs">
                    <Sparkles size={16} />
                    Recomendado para:
                  </strong> 
                  Consultas ocasionales de 1-5 radicados, casos específicos y usuarios que prefieren simplicidad.
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SimpleQueryPage;