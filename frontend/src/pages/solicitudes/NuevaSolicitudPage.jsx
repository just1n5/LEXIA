import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronRight, 
  FileText, 
  Hash, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Search,
  Mail,
  BarChart3,
  Settings
} from 'lucide-react';
import { useSolicitudes } from '../../hooks/useSolicitudes';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import SimpleValidationMessage from '../../components/forms/SimpleValidationMessage';
import SimpleFrequencySelector from '../../components/forms/SimpleFrequencySelector';

const NuevaSolicitudPage = () => {
  const navigate = useNavigate();
  const { createSolicitud, loading } = useSolicitudes();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    alias: '',
    numeroRadicado: '',
    frecuencia: 'dinamico'
  });

  const [validationState, setValidationState] = useState('idle');
  const [validationMessage, setValidationMessage] = useState('');

  const handleBack = () => {
    navigate('/solicitudes/select-type');
  };

  const handleRadicadoChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, numeroRadicado: value });

    // Simulación de validación mejorada
    if (value.length === 0) {
      setValidationState('idle');
      setValidationMessage('');
    } else if (value.length < 10) {
      setValidationState('validating');
      setValidationMessage('Validando formato del número de radicado...');
      
      setTimeout(() => {
        setValidationState('error');
        setValidationMessage('Formato incompleto. Debe tener al menos 10 caracteres');
      }, 1000);
    } else {
      setValidationState('validating');
      setValidationMessage('Verificando número de radicado en base de datos...');
      
      setTimeout(() => {
        setValidationState('valid');
        setValidationMessage('Número de radicado válido y encontrado en el sistema');
      }, 1500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.alias.trim()) {
      toast.error('Error de validación', 'Por favor ingresa un alias para la solicitud');
      return;
    }
    
    if (!formData.numeroRadicado.trim()) {
      toast.error('Error de validación', 'Por favor ingresa el número de radicado');
      return;
    }

    if (validationState !== 'valid') {
      toast.error('Error de validación', 'El número de radicado debe ser válido antes de continuar');
      return;
    }

    try {
      // Preparar datos para el servicio
      const solicitudData = {
        alias: formData.alias,
        tipo_busqueda: 'radicado',
        criterio_busqueda_radicado: formData.numeroRadicado,
        frecuencia_envio: formData.frecuencia,
        activa: true
      };

      await createSolicitud(solicitudData);
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
            <div className="w-16 h-16 bg-interactive-default rounded-2xl flex items-center justify-center mx-auto mb-md">
              <FileText size={32} className="text-text-primary" />
            </div>
            <h1 className="text-heading-h1 font-heading text-text-primary mb-sm">
              Configurar Consulta Sencilla
            </h1>
            <p className="text-body-paragraph text-text-secondary max-w-2xl mx-auto">
              Ingresa el número de radicado y configura la frecuencia de monitoreo. 
              El sistema verificará automáticamente el estado del proceso judicial.
            </p>
          </div>

          {/* Form Card */}
          <Card size="xl" className="mb-xl">
            <Card.Content>
              <form onSubmit={handleSubmit} className="space-y-xl">
                {/* Alias Field */}
                <div>
                  <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
                    <div className="flex items-center gap-xs">
                      <FileText size={16} className="text-interactive-default" />
                      Alias de la Solicitud *
                    </div>
                  </label>
                  <Input
                    type="text"
                    value={formData.alias}
                    onChange={(e) => setFormData({...formData, alias: e.target.value})}
                    placeholder="Ej: Caso Familia García, Demanda Empresa XYZ..."
                    helperText="Un nombre que te ayude a identificar fácilmente esta solicitud"
                    required
                    className="w-full"
                  />
                </div>

                {/* Radicado Field */}
                <div>
                  <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
                    <div className="flex items-center gap-xs">
                      <Hash size={16} className="text-interactive-default" />
                      Número de Radicado *
                    </div>
                  </label>
                  <Input
                    type="text"
                    value={formData.numeroRadicado}
                    onChange={handleRadicadoChange}
                    placeholder="Ej: 2024-CV-123456789"
                    validationState={validationState}
                    helperText="Ingresa el número de radicado completo del proceso judicial"
                    required
                    className="w-full"
                  />
                  <SimpleValidationMessage 
                    state={validationState}
                    message={validationMessage}
                  />
                </div>

                {/* Frequency Field */}
                <div>
                  <label className="block text-body-paragraph font-medium text-text-primary mb-sm">
                    <div className="flex items-center gap-xs">
                      <Calendar size={16} className="text-interactive-default" />
                      Frecuencia de Notificación *
                    </div>
                  </label>
                  <SimpleFrequencySelector
                    value={formData.frecuencia}
                    onChange={(value) => setFormData({...formData, frecuencia: value})}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-sm sm:justify-end pt-lg border-t border-border-default">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleBack}
                    className="sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={loading || validationState !== 'valid'}
                    loading={loading}
                    icon={loading ? null : <ChevronRight size={20} />}
                    iconPosition="right"
                    className="sm:w-auto"
                  >
                    {loading ? 'Creando Solicitud...' : 'Crear Solicitud'}
                  </Button>
                </div>
              </form>
            </Card.Content>
          </Card>

          {/* Information Card */}
          <Card variant="info" size="lg">
            <Card.Header>
              <div className="flex items-center gap-sm">
                <Info size={20} className="text-feedback-info" />
                <Card.Title as="h3">¿Cómo funciona el monitoreo automático?</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-md">
                  <div className="flex items-start gap-sm">
                    <div className="w-8 h-8 bg-feedback-info rounded-lg flex items-center justify-center flex-shrink-0">
                      <Search size={16} className="text-bg-canvas" />
                    </div>
                    <div>
                      <h4 className="text-heading-h4 font-heading text-text-primary mb-xs">
                        Monitoreo Continuo
                      </h4>
                      <p className="text-body-paragraph text-text-base">
                        El sistema revisará automáticamente el estado del proceso según la frecuencia seleccionada.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-sm">
                    <div className="w-8 h-8 bg-feedback-success rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail size={16} className="text-bg-canvas" />
                    </div>
                    <div>
                      <h4 className="text-heading-h4 font-heading text-text-primary mb-xs">
                        Notificaciones Inteligentes
                      </h4>
                      <p className="text-body-paragraph text-text-base">
                        Recibirás notificaciones por email solo cuando haya cambios importantes en el proceso.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-md">
                  <div className="flex items-start gap-sm">
                    <div className="w-8 h-8 bg-feedback-warning rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 size={16} className="text-bg-canvas" />
                    </div>
                    <div>
                      <h4 className="text-heading-h4 font-heading text-text-primary mb-xs">
                        Historial Completo
                      </h4>
                      <p className="text-body-paragraph text-text-base">
                        Podrás ver todo el historial de cambios y actualizaciones desde tu dashboard.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-sm">
                    <div className="w-8 h-8 bg-interactive-default rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings size={16} className="text-text-primary" />
                    </div>
                    <div>
                      <h4 className="text-heading-h4 font-heading text-text-primary mb-xs">
                        Control Total
                      </h4>
                      <p className="text-body-paragraph text-text-base">
                        Puedes pausar, reanudar o modificar la solicitud en cualquier momento.
                      </p>
                    </div>
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

export default NuevaSolicitudPage;