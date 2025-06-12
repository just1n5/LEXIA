import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Upload, ChevronRight, ArrowLeft, Clock, Target, CheckCircle, Scale } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const SelectQueryTypePage = () => {
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  const queryTypes = [
    {
      id: 'simple',
      title: 'Consulta Sencilla',
      description: 'Búsqueda rápida y directa utilizando únicamente el número de radicado del proceso judicial.',
      icon: Search,
      features: [
        'Búsqueda por número de radicado',
        'Notificaciones diarias automáticas (7PM)',
        'Alertas por email solo cuando hay cambios',
        'Reporte básico de estado procesal'
      ],
      bestFor: 'Consultas puntuales y seguimiento básico',
      estimatedTime: '2-3 minutos',
      complexity: 'Básica',
      complexityVariant: 'success'
    },
    {
      id: 'rama-judicial',
      title: 'Consulta Avanzada',
      description: 'Búsqueda completa por nombre o razón social con filtros de jurisdicción. Ideal cuando no tienes el número de radicado y necesitas encontrar procesos por datos de las partes.',
      icon: Scale,
      features: [
        'Búsqueda por nombre completo o razón social',
        'Filtros opcionales de jurisdicción en cascada',
        'Departamento → Ciudad → Entidad → Especialidad → Despacho',
        'Identificación personalizada del caso',
        'Notificaciones diarias automáticas (7PM)',
        'Alertas por email cuando hay cambios',
        'Compatible con criterios de la Rama Judicial'
      ],
      bestFor: 'Cuando solo conoces el nombre de la persona/empresa (sin radicado)',
      estimatedTime: '3-5 minutos',
      complexity: 'Intermedia',
      complexityVariant: 'warning'
    },
    {
      id: 'bulk',
      title: 'Carga Masiva',
      description: 'Carga múltiples consultas desde archivos de Excel. Ideal para procesar grandes volúmenes de radicados.',
      icon: Upload,
      features: [
        'Carga desde archivos Excel (.xlsx, .xls)',
        'Validación automática de formato',
        'Procesamiento en lote de hasta 1000 radicados',
        'Notificaciones diarias automáticas (7PM)',
        'Reporte consolidado de todos los procesos',
        'Seguimiento masivo automatizado'
      ],
      bestFor: 'Despachos jurídicos y grandes volúmenes',
      estimatedTime: '3-5 minutos',
      complexity: 'Especializada',
      complexityVariant: 'info'
    }
  ];

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (!selectedType) return;
    
    // Navegar según el tipo seleccionado
    if (selectedType === 'simple') {
      navigate('/solicitudes/simple');
    } else if (selectedType === 'rama-judicial') {
      // 🔍 AVANZADA: Formulario con criterios de la Rama Judicial
      navigate('/solicitudes/advanced', { 
        state: { 
          mode: 'oficial', 
          title: 'Consulta Avanzada',
          subtitle: 'Búsqueda por nombre o razón social con filtros de jurisdicción'
        } 
      });
    } else if (selectedType === 'bulk') {
      navigate('/solicitudes/bulk-upload');
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
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
            Volver al Dashboard
          </Button>
          
          {/* Breadcrumb */}
          <nav className="flex items-center text-body-auxiliary text-text-secondary" aria-label="Breadcrumb">
            <Button.Link onClick={handleBack} className="text-body-auxiliary">
              Mis Solicitudes
            </Button.Link>
            <ChevronRight size={14} className="mx-xs text-border-default" />
            <span className="text-text-primary">Nueva Solicitud</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-md md:px-lg py-xl">
        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center mb-2xl">
          <h1 className="text-heading-h1 font-heading text-text-primary mb-sm">
            Selecciona el Tipo de Consulta
          </h1>
          <p className="text-body-paragraph text-text-secondary max-w-2xl mx-auto">
            Elige la opción que mejor se adapte a tus necesidades. Todas las consultas 
            incluyen notificaciones diarias automáticas a partir de las 7PM.
          </p>
        </div>

        {/* Notification Info Banner */}
        <div className="max-w-4xl mx-auto mb-xl">
          <Card variant="info" size="sm" className="border-feedback-info bg-feedback-info-light">
            <Card.Content>
              <div className="flex items-center gap-sm text-center justify-center">
                <Clock size={20} className="text-feedback-info flex-shrink-0" />
                <p className="text-body-paragraph text-feedback-info">
                  <strong>Frecuencia estándar:</strong> Todas las consultas se realizan diariamente a partir de las 7PM. 
                  Recibirás notificaciones por email solo cuando detectemos cambios en los procesos.
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Query Type Cards */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mb-xl">
            {queryTypes.map((type) => {
              const IconComponent = type.id === 'rama-judicial' ? Scale : type.icon;
              const isSelected = selectedType === type.id;
              
              return (
                <div
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`
                    relative cursor-pointer rounded-lg border-2 p-lg transition-all duration-200
                    ${isSelected 
                      ? 'border-interactive-default bg-yellow-50 shadow-lg' 
                      : 'border-border-default bg-bg-canvas hover:border-interactive-hover hover:shadow-md'
                    }
                  `}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-interactive-default rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle size={20} className="text-text-primary" />
                    </div>
                  )}

                  {/* Card Header */}
                  <div className="mb-lg">
                    {/* Title with Icon */}
                    <div className="flex items-center gap-md mb-md">
                      {/* Icon */}
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                        ${isSelected 
                          ? 'bg-interactive-default shadow-sm' 
                          : 'bg-bg-light'
                        }
                      `}>
                        <IconComponent 
                          size={24} 
                          className={isSelected ? 'text-text-primary' : 'text-interactive-default'} 
                        />
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-heading-h3 font-heading text-text-primary flex-1">
                        {type.title}
                      </h3>
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-sm mb-md">
                      <Badge variant={type.complexityVariant} size="sm">
                        {type.complexity}
                      </Badge>
                      <div className="flex items-center gap-xs text-body-auxiliary text-text-secondary">
                        <Clock size={14} />
                        <span>{type.estimatedTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-lg">
                    <p className="text-body-paragraph text-text-base leading-relaxed mb-md">
                      {type.description}
                    </p>

                    {/* Best For */}
                    <div className="bg-bg-light rounded-lg p-sm">
                      <div className="flex items-start gap-xs">
                        <Target size={16} className="text-interactive-default mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-body-auxiliary font-medium text-text-primary">Ideal para: </span>
                          <span className="text-body-auxiliary text-text-secondary">{type.bestFor}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-lg">
                    <h4 className="text-heading-h4 font-heading text-text-primary mb-sm">
                      Características incluidas:
                    </h4>
                    <div className="space-y-xs">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-sm">
                          <div className="w-1.5 h-1.5 bg-interactive-default rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-body-paragraph text-text-base">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <Button
                      variant={isSelected ? 'primary' : 'secondary'}
                      size="md"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTypeSelect(type.id);
                      }}
                    >
                      {isSelected ? 'Seleccionado' : 'Seleccionar'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-sm sm:justify-center">
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
              onClick={handleContinue}
              disabled={!selectedType}
              icon={<ChevronRight size={20} />}
              iconPosition="right"
              className="sm:w-auto"
            >
              Continuar con {
                selectedType === 'simple' 
                  ? 'Consulta Sencilla' 
                  : selectedType === 'rama-judicial'
                  ? 'Consulta Avanzada'
                  : selectedType === 'bulk'
                  ? 'Carga Masiva'
                  : 'Selección'
              }
            </Button>
          </div>

          {/* Help Section */}
          <Card variant="info" size="lg" className="mt-2xl">
            <Card.Content>
              <div className="text-center">
                <h3 className="text-heading-h4 font-heading text-text-primary mb-sm">
                  ¿Necesitas ayuda para decidir?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-md text-left">
                  <div>
                    <h4 className="font-medium text-text-primary mb-xs">Consulta Sencilla</h4>
                    <p className="text-body-auxiliary text-text-secondary">
                      Para consultas ocasionales de 1-5 radicados cuando ya tienes los números
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary mb-xs">Consulta Avanzada</h4>
                    <p className="text-body-auxiliary text-text-secondary">
                      Cuando solo tienes el nombre de la persona/empresa (sin radicado)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary mb-xs">Carga Masiva</h4>
                    <p className="text-body-auxiliary text-text-secondary">
                      Para procesar 10+ radicados desde archivos Excel de forma masiva
                    </p>
                  </div>
                </div>
                <div className="mt-md">
                  <Button.Link className="text-body-paragraph">
                    Ver guía completa de tipos de consulta
                  </Button.Link>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SelectQueryTypePage;