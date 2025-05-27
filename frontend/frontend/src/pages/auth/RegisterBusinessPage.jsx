import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import BusinessRegisterForm from '../../components/forms/BusinessRegisterForm'

function RegisterBusinessPage() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-bg-light">
      <div className="bg-bg-canvas rounded-md shadow-md w-full max-w-2xl p-8">
        {/* Back Link */}
        <Link 
          to="/auth/select-account-type"
          className="flex items-center text-text-secondary hover:text-text-primary transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a selección de tipo de cuenta
        </Link>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-heading-h1 font-bold text-text-base mb-2">
            Registro Empresa
          </h1>
          <p className="text-text-secondary">
            Crea una cuenta empresarial para gestionar consultas de procesos judiciales.
          </p>
        </div>

        {/* Form */}
        <BusinessRegisterForm />
        
        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-text-secondary">
            ¿Ya tienes una cuenta?{' '}
            <Link 
              to="/auth/login" 
              className="text-interactive-default hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterBusinessPage
