import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useAuth } from '../../contexts/AuthContext'

function PersonalRegisterForm() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors, isSubmitting } 
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      const registerData = {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        tipo_cuenta: 'personal',
        tipo_documento: data.tipoDocumento,
        numero_documento: data.numeroDocumento,
        telefono: data.telefono
      }

      const result = await registerUser(registerData)
      if (result.success) {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error en registro:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información Personal */}
      <div>
        <h3 className="text-heading-h4 font-semibold mb-4 text-text-base">
          Información Personal
        </h3>
        
        <div className="space-y-4">
          <Input
            label="Nombre Completo"
            icon={<User />}
            placeholder="Ingresa tu nombre completo"
            {...register('nombre', { 
              required: 'El nombre es requerido',
              minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
            })}
            error={errors.nombre?.message}
          />
          
          <div>
            <label className="block mb-2 font-medium text-heading-h4 text-text-base">
              Tipo de Documento
            </label>
            <select 
              className="form-input w-full"
              {...register('tipoDocumento', { required: 'Selecciona un tipo de documento' })}
            >
              <option value="">Selecciona tu tipo de documento</option>
              <option value="cc">Cédula de Ciudadanía</option>
              <option value="ce">Cédula de Extranjería</option>
              <option value="passport">Pasaporte</option>
            </select>
            {errors.tipoDocumento && (
              <p className="error-text">{errors.tipoDocumento.message}</p>
            )}
          </div>
          
          <Input
            label="Número de Documento"
            placeholder="Ingresa tu número de documento"
            {...register('numeroDocumento', { 
              required: 'El número de documento es requerido',
              pattern: { 
                value: /^[0-9]+$/,
                message: 'El número de documento debe contener solo números'
              }
            })}
            error={errors.numeroDocumento?.message}
          />
          
          <div>
            <label className="block mb-2 font-medium text-heading-h4 text-text-base">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5 z-10" />
              <input
                type="tel"
                placeholder="Ej: 3001234567"
                className="form-input pl-12 w-full"
                {...register('telefono', { 
                  required: 'El teléfono es requerido',
                  pattern: { 
                    value: /^[0-9]{10}$/,
                    message: 'El teléfono debe tener 10 dígitos'
                  }
                })}
              />
            </div>
            {errors.telefono && (
              <p className="error-text">{errors.telefono.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-border-default my-6"></div>

      {/* Información de Cuenta */}
      <div>
        <h3 className="text-heading-h4 font-semibold mb-4 text-text-base">
          Información de Cuenta
        </h3>
        
        <div className="space-y-4">
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
            placeholder="Crea una contraseña segura"
            helperText="La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número."
            {...register('password', { 
              required: 'La contraseña es requerida',
              minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres' },
              pattern: { 
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
                message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
              }
            })}
            error={errors.password?.message}
          />
          
          <Input
            label="Confirmar Contraseña"
            type="password"
            icon={<Lock />}
            placeholder="Confirma tu contraseña"
            {...register('confirmPassword', { 
              required: 'Confirma tu contraseña',
              validate: value => value === password || 'Las contraseñas no coinciden'
            })}
            error={errors.confirmPassword?.message}
          />
        </div>
      </div>

      {/* Términos y Condiciones */}
      <div>
        <label className="flex items-start">
          <input
            type="checkbox"
            className="mt-1 mr-2"
            {...register('terms', { required: 'Debes aceptar los términos y condiciones' })}
          />
          <span className="text-sm text-text-primary">
            Acepto los{' '}
            <a href="#" className="text-interactive-default hover:underline">
              Términos y Condiciones
            </a>{' '}
            y la{' '}
            <a href="#" className="text-interactive-default hover:underline">
              Política de Privacidad
            </a>
          </span>
        </label>
        {errors.terms && (
          <p className="error-text mt-1">{errors.terms.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        variant="primary" 
        block 
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        Crear Cuenta
      </Button>
    </form>
  )
}

export default PersonalRegisterForm
