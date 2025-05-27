import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Briefcase, Check } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'

function AccountTypeSelector({ selectedType, onTypeSelect }) {
  const navigate = useNavigate()

  const handleSelectPersonal = () => {
    onTypeSelect('personal')
    navigate('/auth/register/personal')
  }

  const handleSelectBusiness = () => {
    onTypeSelect('business')
    navigate('/auth/register/business')
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-heading-h1 font-bold text-text-base">Crear Cuenta</h1>
        <p className="text-text-secondary">
          Selecciona el tipo de cuenta que deseas crear para comenzar.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Persona Natural */}
        <div 
          className={cn(
            "bg-bg-canvas border-2 rounded-md p-6 text-center cursor-pointer transition-all duration-200 h-full flex flex-col",
            "hover:border-interactive-default hover:shadow-md hover:-translate-y-1",
            selectedType === 'personal' 
              ? "border-interactive-default bg-yellow-50" 
              : "border-border-default"
          )}
          onClick={() => onTypeSelect('personal')}
        >
          <div className="w-16 h-16 bg-bg-light rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-interactive-default" />
          </div>
          
          <h3 className="text-heading-h3 font-semibold mb-3 text-text-base">
            Persona Natural
          </h3>
          
          <p className="text-text-secondary mb-6 flex-grow">
            Para individuos que desean consultar procesos judiciales para uso personal.
          </p>
          
          <div className="text-left space-y-2 mb-6">
            <div className="flex items-start">
              <Check className="w-4 h-4 text-interactive-default mr-2 mt-1 flex-shrink-0" />
              <span className="text-text-primary text-sm">Acceso a todas las funciones básicas</span>
            </div>
            <div className="flex items-start">
              <Check className="w-4 h-4 text-interactive-default mr-2 mt-1 flex-shrink-0" />
              <span className="text-text-primary text-sm">Consultas ilimitadas de procesos</span>
            </div>
            <div className="flex items-start">
              <Check className="w-4 h-4 text-interactive-default mr-2 mt-1 flex-shrink-0" />
              <span className="text-text-primary text-sm">Notificaciones por correo electrónico</span>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            className="w-full"
            onClick={handleSelectPersonal}
          >
            Seleccionar
          </Button>
        </div>

        {/* Empresa */}
        <div 
          className={cn(
            "bg-bg-canvas border-2 rounded-md p-6 text-center cursor-pointer transition-all duration-200 h-full flex flex-col",
            "hover:border-interactive-default hover:shadow-md hover:-translate-y-1",
            selectedType === 'business' 
              ? "border-interactive-default bg-yellow-50" 
              : "border-border-default"
          )}
          onClick={() => onTypeSelect('business')}
        >
          <div className="w-16 h-16 bg-bg-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-interactive-default" />
          </div>
          
          <h3 className="text-heading-h3 font-semibold mb-3 text-text-base">
            Empresa
          </h3>
          
          <p className="text-text-secondary mb-6 flex-grow">
            Para firmas de abogados o empresas que necesitan gestionar múltiples casos.
          </p>
          
          <div className="text-left space-y-2 mb-6">
            <div className="flex items-start">
              <Check className="w-4 h-4 text-interactive-default mr-2 mt-1 flex-shrink-0" />
              <span className="text-text-primary text-sm">Todas las funciones de persona natural</span>
            </div>
            <div className="flex items-start">
              <Check className="w-4 h-4 text-interactive-default mr-2 mt-1 flex-shrink-0" />
              <span className="text-text-primary text-sm">Gestión de múltiples usuarios</span>
            </div>
            <div className="flex items-start">
              <Check className="w-4 h-4 text-interactive-default mr-2 mt-1 flex-shrink-0" />
              <span className="text-text-primary text-sm">Dashboard de equipo con métricas</span>
            </div>
            <div className="flex items-start">
              <Check className="w-4 h-4 text-interactive-default mr-2 mt-1 flex-shrink-0" />
              <span className="text-text-primary text-sm">Reportes y análisis avanzados</span>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            className="w-full"
            onClick={handleSelectBusiness}
          >
            Seleccionar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AccountTypeSelector
