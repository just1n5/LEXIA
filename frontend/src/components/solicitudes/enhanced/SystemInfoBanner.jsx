import React from 'react'
import { Clock, Info, CheckCircle } from 'lucide-react'
import Card from '../../ui/Card'
import { cn } from '../../../utils/cn'

/**
 * SystemInfoBanner - Banner informativo sobre el nuevo sistema automático
 */
const SystemInfoBanner = ({ className = '' }) => {
  return (
    <Card className={cn('border-blue-200 bg-blue-50', className)}>
      <Card.Content className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-base font-medium text-blue-900 mb-2">
              🚀 Sistema Automatizado Mejorado
            </h3>
            
            <div className="space-y-3">
              <p className="text-sm text-blue-800">
                Tu solicitud ahora funciona con nuestro nuevo sistema automatizado que ejecuta consultas 
                y envía notificaciones todos los días a las <strong>7:00 PM</strong> de forma automática.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">Ejecución diaria automática</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">Notificaciones puntuales</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">Horario optimizado (7:00 PM)</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">Sin configuración adicional</span>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-blue-100 rounded-md">
                <p className="text-xs text-blue-700">
                  💡 <strong>Beneficios:</strong> Mayor confiabilidad, mejor disponibilidad del servidor judicial 
                  en horario vespertino, y reducción de errores por configuraciones manuales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

export default SystemInfoBanner