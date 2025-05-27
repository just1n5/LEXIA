import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AccountTypeSelector from '../../components/forms/AccountTypeSelector'

function SelectAccountTypePage() {
  const [selectedType, setSelectedType] = useState('')

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-bg-light">
      <div className="bg-bg-canvas rounded-md shadow-md w-full max-w-4xl p-8">
        <AccountTypeSelector 
          selectedType={selectedType}
          onTypeSelect={setSelectedType}
        />
        
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

export default SelectAccountTypePage
