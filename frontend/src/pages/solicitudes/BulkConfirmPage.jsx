import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle, 
  ArrowLeft, 
  ChevronRight, 
  Settings, 
  Clock, 
  Mail, 
  Bell, 
  FileSpreadsheet,
  AlertTriangle,
  Info,
  Play,
  Calendar,
  Users,
  Target
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const BulkConfirmPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { file, validation } = location.state || {};
  
  const [config, setConfig] = useState({
    frequency: 'daily',
    notifications: true,
    emailReports: true,
    startImmediately: true,
    priority: 'normal'
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleBack = () => {
    navigate('/solicitudes/bulk-upload');
  };

  const handleCreateBulkQueries = async () => {
    setIsProcessing(true);
    
    // Simular creación de consultas masivas
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('Creando consultas masivas con configuración:', config);
    
    // Navegar al dashboard con mensaje de éxito
    navigate('/dashboard', { 
      state: { 
        message: `Se han creado ${validation?.validRows || 0} consultas automáticas correctamente.`,
        type: 'success' 
      }
    });
  };

  const frequencyOptions = [
    { 
      value: 'hourly', 
      label: 'Cada Hora', 
      description: 'Consultas cada hora',
      icon: Clock,
      recommended: false
    },
    { 
      value: 'daily', 
      label: 'Diaria', 
      description: 'Una vez al día',
      icon: Calendar,
      recommended: true
    },
    { 
      value: 'weekly', 
      label: 'Semanal', 
      description: 'Una vez por semana',
      icon: Calendar,
      recommended: false
    },
    { 
      value: 'monthly', 
      label: 'Mensual', 
      description: 'Una vez al mes',
      icon: Calendar,
      recommended: false
    }
  ];

  const priorityOptions = [
    {
      value: 'low',
      label: 'Baja',
      description: 'Procesamiento en segundo plano',
      color: 'bg-gray-100 text-gray-600'
    },
    {
      value: 'normal',
      label: 'Normal',
      description: 'Procesamiento estándar',
      color: 'bg-feedback-info-light text-feedback-info'
    },
    {
      value: 'high',
      label: 'Alta',
      description: 'Procesamiento prioritario',
      color: 'bg-feedback-warning-light text-feedback-warning'
    }
  ];

  // Redirigir si no hay datos
  if (!file || !validation) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <Card size="lg" className="text-center">
          <Card.Content>
            <AlertTriangle size={48} className="text-feedback-warning mx-auto mb-md" />
            <h2 className="text-heading-h2 font-heading text-text-primary mb-sm">
              No hay archivo para procesar
            </h2>
            <p className="text-body-paragraph text-text-secondary mb-lg">
              Necesitas subir un archivo antes de continuar con la configuración.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/solicitudes/bulk-upload')}
            >
              Volver a Carga de Archivo
            </Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

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
            disabled={isProcessing}
          >
            Volver a Carga
          </Button>
          
          {/* Breadcrumb */}
          <nav className="flex items-center text-body-auxiliary text-text-secondary" aria-label="Breadcrumb">
            <Button.Link onClick={() => navigate('/dashboard')} className="text-body-auxiliary">
              Mis Solicitudes
            </Button.Link>
            <ChevronRight size={14} className="mx-xs text-border-default" />
            <Button.Link onClick={() => navigate('/solicitudes/select-type')} className="text-body-auxiliary">
              Nueva Solicitud
            </Button.Link>
            <ChevronRight size={14} className="mx-xs text-border-default" />
            <Button.Link onClick={handleBack} className="text-body-auxiliary">
              Carga Masiva
            </Button.Link>
            <ChevronRight size={14} className="mx-xs text-border-default" />
            <span className="text-text-primary">Confirmar</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-md md:px-lg py-xl">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-xl">
            <div className="w-16 h-16 bg-feedback-success rounded-lg flex items-center justify-center mx-auto mb-md">
              <CheckCircle size={32} className="text-bg-canvas" />
            </div>
            <h1 className="text-heading-h1 font-heading text-text-primary mb-sm">
              Configurar Consultas Masivas
            </h1>
            <p className="text-body-paragraph text-text-secondary max-w-2xl mx-auto">
              Tu archivo ha sido validado correctamente. Configura las opciones para las consultas automáticas antes de proceder.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
            {/* File Summary - Sidebar */}
            <div className="lg:col-span-1 space-y-lg">
              {/* File Info Card */}
              <Card size="lg">
                <Card.Header>
                  <div className="flex items-center gap-sm">
                    <FileSpreadsheet size={20} className="text-interactive-default" />
                    <Card.Title as="h3">Archivo Procesado</Card.Title>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-md">
                    <div>
                      <p className="text-body-auxiliary text-text-secondary">Nombre del archivo</p>
                      <p className="text-body-paragraph font-medium text-text-primary truncate">
                        {file.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-body-auxiliary text-text-secondary">Tamaño</p>
                      <p className="text-body-paragraph text-text-base">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {/* Validation Results */}
              <Card size="lg">
                <Card.Header>
                  <Card.Title as="h3">Resumen de Validación</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-md">
                    <div className="grid grid-cols-2 gap-sm">
                      <div className="text-center p-sm bg-bg-light rounded-md">
                        <div className="text-heading-h3 font-heading text-feedback-success">
                          {validation.totalRows}
                        </div>
                        <div className="text-body-auxiliary text-text-secondary">
                          Total
                        </div>
                      </div>
                      <div className="text-center p-sm bg-feedback-success-light rounded-md">
                        <div className="text-heading-h3 font-heading text-feedback-success">
                          {validation.validRows}
                        </div>
                        <div className="text-body-auxiliary text-text-secondary">
                          Válidos
                        </div>
                      </div>
                    </div>
                    
                    {validation.invalidRows > 0 && (
                      <div className="p-sm bg-feedback-warning-light border border-feedback-warning rounded-md">
                        <div className="flex items-center gap-xs text-feedback-warning mb-xs">
                          <AlertTriangle size={14} />
                          <span className="text-body-auxiliary font-medium">
                            {validation.invalidRows} registros con errores
                          </span>
                        </div>
                        <p className="text-body-auxiliary text-text-secondary">
                          Serán omitidos del procesamiento
                        </p>
                      </div>
                    )}

                    {validation.duplicates > 0 && (
                      <div className="p-sm bg-feedback-info-light border border-feedback-info rounded-md">
                        <div className="flex items-center gap-xs text-feedback-info mb-xs">
                          <Info size={14} />
                          <span className="text-body-auxiliary font-medium">
                            {validation.duplicates} duplicados detectados
                          </span>
                        </div>
                        <p className="text-body-auxiliary text-text-secondary">
                          Se procesarán una sola vez
                        </p>
                      </div>
                    )}
                  </div>
                </Card.Content>
              </Card>
            </div>

            {/* Configuration - Main Content */}
            <div className="lg:col-span-2 space-y-xl">
              {/* Frequency Configuration */}
              <Card size="xl">
                <Card.Header>
                  <div className="flex items-center gap-sm">
                    <Clock size={20} className="text-interactive-default" />
                    <Card.Title as="h3">Frecuencia de Consultas</Card.Title>
                  </div>
                </Card.Header>
                <Card.Content>
                  <p className="text-body-paragraph text-text-secondary mb-lg">
                    Selecciona la frecuencia con la que el sistema consultará automáticamente el estado de los procesos.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    {frequencyOptions.map((option) => {
                      const IconComponent = option.icon;
                      const isSelected = config.frequency === option.value;
                      
                      return (
                        <Card.Selectable
                          key={option.value}
                          selected={isSelected}
                          onSelect={() => setConfig({ ...config, frequency: option.value })}
                          className="relative"
                        >
                          <div className="flex items-start gap-sm">
                            <div className={`
                              w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-xs
                              ${isSelected ? 'bg-interactive-default' : 'bg-bg-light'}
                            `}>
                              <IconComponent 
                                size={20} 
                                className={isSelected ? 'text-text-primary' : 'text-interactive-default'} 
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-sm mb-xs">
                                <span className="text-body-paragraph font-medium text-text-primary">
                                  {option.label}
                                </span>
                                {option.recommended && (
                                  <Badge variant="success" size="sm">Recomendado</Badge>
                                )}
                              </div>
                              <p className="text-body-auxiliary text-text-secondary">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </Card.Selectable>
                      );
                    })}
                  </div>
                </Card.Content>
              </Card>

              {/* Additional Configuration */}
              <Card size="xl">
                <Card.Header>
                  <div className="flex items-center gap-sm">
                    <Settings size={20} className="text-interactive-default" />
                    <Card.Title as="h3">Configuración Adicional</Card.Title>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-lg">
                    {/* Priority */}
                    <div>
                      <h4 className="text-heading-h4 font-heading text-text-primary mb-sm">
                        Prioridad de Procesamiento
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
                        {priorityOptions.map((priority) => (
                          <button
                            key={priority.value}
                            onClick={() => setConfig({ ...config, priority: priority.value })}
                            className={`
                              p-md rounded-lg border-2 text-left transition-default
                              ${config.priority === priority.value
                                ? 'border-interactive-default bg-yellow-50'
                                : 'border-border-default hover:border-interactive-hover'
                              }
                            `}
                          >
                            <div className={`inline-flex px-sm py-xs rounded text-body-auxiliary font-medium mb-xs ${priority.color}`}>
                              {priority.label}
                            </div>
                            <p className="text-body-auxiliary text-text-secondary">
                              {priority.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notifications */}
                    <div className="space-y-md">
                      <h4 className="text-heading-h4 font-heading text-text-primary">
                        Notificaciones
                      </h4>
                      
                      <div className="space-y-sm">
                        <label className="flex items-center gap-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.notifications}
                            onChange={(e) => setConfig({ ...config, notifications: e.target.checked })}
                            className="w-4 h-4 text-interactive-default bg-bg-canvas border-border-default rounded focus:ring-interactive-default focus:ring-2"
                          />
                          <div className="flex items-center gap-sm">
                            <Bell size={16} className="text-interactive-default" />
                            <span className="text-body-paragraph text-text-primary">
                              Notificaciones push en la aplicación
                            </span>
                          </div>
                        </label>
                        
                        <label className="flex items-center gap-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.emailReports}
                            onChange={(e) => setConfig({ ...config, emailReports: e.target.checked })}
                            className="w-4 h-4 text-interactive-default bg-bg-canvas border-border-default rounded focus:ring-interactive-default focus:ring-2"
                          />
                          <div className="flex items-center gap-sm">
                            <Mail size={16} className="text-interactive-default" />
                            <span className="text-body-paragraph text-text-primary">
                              Reportes por correo electrónico
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Start Options */}
                    <div>
                      <h4 className="text-heading-h4 font-heading text-text-primary mb-sm">
                        Inicio de Consultas
                      </h4>
                      <div className="space-y-sm">
                        <label className="flex items-center gap-sm cursor-pointer">
                          <input
                            type="radio"
                            name="startOption"
                            checked={config.startImmediately}
                            onChange={() => setConfig({ ...config, startImmediately: true })}
                            className="w-4 h-4 text-interactive-default bg-bg-canvas border-border-default focus:ring-interactive-default focus:ring-2"
                          />
                          <div className="flex items-center gap-sm">
                            <Play size={16} className="text-interactive-default" />
                            <span className="text-body-paragraph text-text-primary">
                              Iniciar consultas inmediatamente
                            </span>
                          </div>
                        </label>
                        
                        <label className="flex items-center gap-sm cursor-pointer">
                          <input
                            type="radio"
                            name="startOption"
                            checked={!config.startImmediately}
                            onChange={() => setConfig({ ...config, startImmediately: false })}
                            className="w-4 h-4 text-interactive-default bg-bg-canvas border-border-default focus:ring-interactive-default focus:ring-2"
                          />
                          <div className="flex items-center gap-sm">
                            <Calendar size={16} className="text-interactive-default" />
                            <span className="text-body-paragraph text-text-primary">
                              Crear consultas pero iniciar manualmente
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {/* Summary Card */}
              <Card variant="success" size="lg">
                <Card.Header>
                  <div className="flex items-center gap-sm">
                    <Target size={20} className="text-feedback-success" />
                    <Card.Title as="h3">Resumen de Configuración</Card.Title>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md text-body-paragraph">
                    <div>
                      <span className="text-text-secondary">Consultas a crear:</span>
                      <span className="ml-sm font-medium text-text-primary">
                        {validation.validRows} consultas automáticas
                      </span>
                    </div>
                    <div>
                      <span className="text-text-secondary">Frecuencia:</span>
                      <span className="ml-sm font-medium text-text-primary">
                        {frequencyOptions.find(f => f.value === config.frequency)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-secondary">Prioridad:</span>
                      <span className="ml-sm font-medium text-text-primary">
                        {priorityOptions.find(p => p.value === config.priority)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-secondary">Inicio:</span>
                      <span className="ml-sm font-medium text-text-primary">
                        {config.startImmediately ? 'Inmediato' : 'Manual'}
                      </span>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-sm sm:justify-center pt-lg">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleBack}
                  disabled={isProcessing}
                  className="sm:w-auto"
                >
                  Volver a Carga
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleCreateBulkQueries}
                  disabled={isProcessing}
                  loading={isProcessing}
                  icon={isProcessing ? null : <ChevronRight size={20} />}
                  iconPosition="right"
                  className="sm:w-auto"
                >
                  {isProcessing 
                    ? `Creando ${validation.validRows} consultas...` 
                    : `Crear ${validation.validRows} Consultas`
                  }
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BulkConfirmPage;