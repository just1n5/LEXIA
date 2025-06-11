import React from 'react';

/**
 * 🤖 AutomationBanner - Banner informativo sobre automatización
 * 
 * Variaciones de banner para explicar el comportamiento automático
 */
const AutomationBanner = ({ variant = 'default' }) => {
  
  if (variant === 'modern') {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl p-lg text-white">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-md mb-lg">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl">🤖</span>
            </div>
            <div>
              <h3 className="text-heading-h2 font-heading text-white mb-xs">
                IA Jurídica Activada
              </h3>
              <p className="text-body-auxiliary text-blue-100">
                Tu asistente legal inteligente trabajando 24/7
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="flex items-center gap-sm">
              <span className="text-xl">⚡</span>
              <div>
                <p className="font-medium">Consulta Diaria</p>
                <p className="text-xs text-blue-100">6:00 AM automático</p>
              </div>
            </div>
            <div className="flex items-center gap-sm">
              <span className="text-xl">📧</span>
              <div>
                <p className="font-medium">Alertas Inteligentes</p>
                <p className="text-xs text-blue-100">Cambios detectados</p>
              </div>
            </div>
            <div className="flex items-center gap-sm">
              <span className="text-xl">📊</span>
              <div>
                <p className="font-medium">Dashboard Completo</p>
                <p className="text-xs text-blue-100">Análisis detallado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'simple') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-lg">
        <div className="flex items-center gap-md mb-md">
          <span className="text-2xl">✅</span>
          <h3 className="text-heading-h3 font-heading text-green-800">
            Automatización Configurada
          </h3>
        </div>
        <div className="text-body-paragraph text-green-700 space-y-xs">
          <p>• <strong>Consulta diaria automática</strong> a las 6:00 AM</p>
          <p>• <strong>Notificaciones por email</strong> cuando detectemos cambios</p>
          <p>• <strong>Historial completo</strong> guardado en tu dashboard</p>
        </div>
      </div>
    );
  }

  // Variant por defecto (el que ya está implementado)
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-lg">
      <div className="flex items-start gap-md">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">🤖</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-heading-h3 font-heading text-blue-800 mb-sm">
            Automatización Inteligente Activada
          </h3>
          <div className="space-y-sm text-body-paragraph text-blue-700">
            <p className="flex items-center gap-sm">
              <span className="text-green-600 font-bold">✅</span>
              <strong>Consulta Diaria Automática:</strong> El sistema ejecutará esta consulta todos los días a las 6:00 AM
            </p>
            <p className="flex items-center gap-sm">
              <span className="text-green-600 font-bold">📧</span>
              <strong>Notificaciones Inteligentes:</strong> Te notificaremos por correo electrónico cuando detectemos cambios en el proceso judicial
            </p>
            <p className="flex items-center gap-sm">
              <span className="text-green-600 font-bold">📊</span>
              <strong>Historial Completo:</strong> Todos los resultados se guardarán en tu dashboard para análisis y seguimiento
            </p>
          </div>
          <div className="mt-md p-sm bg-blue-100 rounded border border-blue-300">
            <p className="text-body-auxiliary text-blue-800 flex items-center gap-xs">
              <span className="text-blue-600">💡</span>
              <strong>Tip:</strong> Puedes pausar o modificar la automatización desde tu dashboard en cualquier momento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationBanner;