import React from 'react'
import { cn } from '../../utils/cn'

function AuthTabs({ activeTab, onTabChange }) {
  return (
    <div className="auth-tabs flex mb-6">
      <button 
        className={cn(
          "flex-1 py-3 px-4 text-center font-medium transition-all duration-200 border-b-2",
          activeTab === 'login' 
            ? "border-interactive-default text-text-base bg-bg-light" 
            : "border-border-default text-text-secondary hover:text-text-base hover:border-text-secondary"
        )}
        onClick={() => onTabChange('login')}
      >
        Iniciar Sesión
      </button>
      <button 
        className={cn(
          "flex-1 py-3 px-4 text-center font-medium transition-all duration-200 border-b-2",
          activeTab === 'register' 
            ? "border-interactive-default text-text-base bg-bg-light" 
            : "border-border-default text-text-secondary hover:text-text-base hover:border-text-secondary"
        )}
        onClick={() => onTabChange('register')}
      >
        Registrarse
      </button>
    </div>
  )
}

export default AuthTabs
