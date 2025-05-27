import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, UserPlus } from 'lucide-react'
import AuthTabs from '../../components/forms/AuthTabs'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'

function LoginPage() {
  const [activeTab, setActiveTab] = useState('login')
  const navigate = useNavigate()
  const { login, error } = useAuth()
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const result = await login({
        username: data.email, // FastAPI OAuth2 usa 'username' para el email
        password: data.password
      })
      
      if (result.success) {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error en login:', error)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleCreateAccount = () => {
    navigate('/auth/select-account-type')
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-heading-h1 font-bold text-text-base mb-2">
            Consulta de Procesos Judiciales
          </h1>
          <p className="text-text-secondary">
            Automatiza el seguimiento de tus procesos judiciales en la Rama Judicial Colombiana
          </p>
        </div>

        {/* Tabs */}
        <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Correo Electrónico"
                type="email"
                icon={<Mail />}
                placeholder="ejemplo@correo.com"
                {...register('email', { 
                  required: 'El correo es requerido',
                  pattern: { 
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Correo electrónico inválido'
                  }
                })}
                error={errors.email?.message}
              />

              <Input
                label="Contraseña"
                type="password"
                icon={<Lock />}
                placeholder="Ingresa tu contraseña"
                {...register('password', { 
                  required: 'La contraseña es requerida'
                })}
                error={errors.password?.message}
              />

              <div className="flex justify-end">
                <Link 
                  to="/auth/recover-password" 
                  className="text-interactive-default hover:underline text-sm"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {error && (
                <div className="bg-feedback-error-light text-feedback-error p-3 rounded-sm text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                variant="primary" 
                block 
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Iniciar Sesión
              </Button>
            </form>
          </div>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-heading-h3 font-semibold text-text-base">
                Crea una cuenta para comenzar
              </h3>
              <p className="text-text-secondary">
                Selecciona el tipo de cuenta que deseas crear según tus necesidades.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                variant="primary" 
                block 
                icon={<UserPlus />}
                onClick={handleCreateAccount}
                className="justify-center"
              >
                Crear nueva cuenta
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-text-secondary">
                  Podrás elegir entre cuenta personal o empresarial
                </p>
              </div>
            </div>
            
            <div className="border-t border-border-default my-6"></div>
            
            <div className="text-center">
              <p className="text-text-secondary">
                ¿Ya tienes una cuenta?{' '}
                <button 
                  onClick={() => handleTabChange('login')}
                  className="text-interactive-default hover:underline"
                >
                  Iniciar sesión
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginPage
