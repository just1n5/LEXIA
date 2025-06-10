import React from 'react';
import { Clock, Mail, CheckCircle, Info, RefreshCw, Lightbulb } from 'lucide-react';
import Card from '../ui/Card';

const FrequencyInfo = ({ className = '' }) => {
  return (
    <div className={`space-y-md ${className}`}>
      {/* Card principal usando el componente del design system */}
      <Card variant="info" size="lg" className="border-2 border-feedback-info bg-feedback-info-light">
        {/* Header con icono */}
        <div className="flex items-center gap-sm mb-lg">
          <div className="w-8 h-8 bg-feedback-info rounded-lg flex items-center justify-center">
            <Info size={16} className="text-bg-canvas" />
          </div>
          <h4 className="text-heading-h4 font-heading text-feedback-info">
            Frecuencia de Notificación Estándar
          </h4>
        </div>
        
        {/* Content */}
        <div className="space-y-lg">
          {/* Información principal */}
          <div className="bg-bg-canvas rounded-lg p-md border border-feedback-info">
            <div className="flex items-start gap-md">
              <div className="w-10 h-10 bg-feedback-success rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw size={20} className="text-bg-canvas" />
              </div>
              <div className="flex-1">
                <h5 className="text-heading-h4 font-heading text-text-primary mb-xs">
                  Monitoreo Diario Automático
                </h5>
                <p className="text-body-paragraph text-text-base leading-relaxed">
                  Tu consulta será revisada <strong>una vez al día</strong> de forma completamente automática.
                  No necesitas configurar nada adicional.
                </p>
              </div>
            </div>
          </div>

          {/* Detalles del horario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="flex items-start gap-sm">
              <div className="w-8 h-8 bg-interactive-default rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-text-primary" />
              </div>
              <div>
                <h6 className="text-body-paragraph font-medium text-text-primary mb-xs">
                  Horario de Consulta
                </h6>
                <p className="text-body-auxiliary text-text-secondary">
                  Las consultas se realizan diariamente a partir de las <strong>7:00 PM</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-sm">
              <div className="w-8 h-8 bg-feedback-warning rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-bg-canvas" />
              </div>
              <div>
                <h6 className="text-body-paragraph font-medium text-text-primary mb-xs">
                  Notificaciones
                </h6>
                <p className="text-body-auxiliary text-text-secondary">
                  Recibirás un email cuando <strong>detectemos cambios</strong> en el proceso
                </p>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-feedback-success-light border border-feedback-success rounded-lg p-sm">
            <div className="flex items-start gap-sm">
              <div className="w-6 h-6 bg-feedback-success rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb size={14} className="text-bg-canvas" />
              </div>
              <div>
                <p className="text-body-auxiliary text-feedback-success">
                  <strong className="flex items-center gap-xs mb-xs">
                    ¿Por qué esta frecuencia?
                  </strong>
                  La frecuencia diaria es óptima para el seguimiento judicial: detecta cambios importantes 
                  sin saturar tu email y respeta los tiempos procesales típicos del sistema judicial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FrequencyInfo;