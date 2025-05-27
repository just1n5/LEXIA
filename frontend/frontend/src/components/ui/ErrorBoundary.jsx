import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error) {
    // Actualizar el estado para mostrar la UI de error
    return { 
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    }
  }

  componentDidCatch(error, errorInfo) {
    // Guardar detalles del error
    this.setState({
      error,
      errorInfo
    })

    // Log del error (en producción enviar a servicio de monitoreo)
    console.error('ErrorBoundary capturó un error:', error, errorInfo)
    
    // En producción, enviar error a servicio de monitoreo
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo)
    }
  }

  logErrorToService = (error, errorInfo) => {
    // Implementar envío a servicio de monitoreo (Sentry, LogRocket, etc.)
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    }

    // Ejemplo de envío (reemplazar con servicio real)
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorReport)
    }).catch(err => {
      console.error('Error al enviar reporte de error:', err)
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    })
  }

  render() {
    if (this.state.hasError) {
      // UI de error personalizada
      const { fallback: CustomFallback, level = 'page' } = this.props
      
      if (CustomFallback) {
        return (
          <CustomFallback 
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            retry={this.handleRetry}
            reload={this.handleReload}
          />
        )
      }

      // UI de error por defecto según el nivel
      if (level === 'component') {
        return (
          <div className="p-4 border border-feedback-error-light bg-feedback-error-light rounded-md">
            <div className="flex items-center gap-2 text-feedback-error mb-2">
              <AlertTriangle size={20} />
              <h4 className="font-medium">Error en el componente</h4>
            </div>
            <p className="text-sm text-text-secondary mb-3">
              Hubo un problema al cargar este componente.
            </p>
            <button 
              onClick={this.handleRetry}
              className="btn btn-sm btn-secondary"
            >
              <RefreshCw size={14} />
              Reintentar
            </button>
          </div>
        )
      }

      // UI de error para página completa
      return (
        <div className="min-h-screen bg-bg-light flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-bg-canvas rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-feedback-error-light rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-feedback-error" />
            </div>
            
            <h1 className="text-heading-h2 font-bold text-text-base mb-2">
              Algo salió mal
            </h1>
            
            <p className="text-text-secondary mb-6">
              Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado automáticamente.
            </p>

            {/* Detalles del error en desarrollo */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-6 p-3 bg-bg-light rounded-md">
                <summary className="cursor-pointer font-medium text-sm mb-2">
                  Detalles técnicos
                </summary>
                <div className="text-xs text-text-secondary space-y-2">
                  <div>
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div>
                    <strong>ID:</strong> {this.state.errorId}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={this.handleRetry}
                className="btn btn-primary btn-with-icon"
              >
                <RefreshCw size={16} />
                Reintentar
              </button>
              
              <button 
                onClick={this.handleReload}
                className="btn btn-secondary btn-with-icon"
              >
                <RefreshCw size={16} />
                Recargar página
              </button>
              
              <Link 
                to="/"
                className="btn btn-ghost btn-with-icon"
              >
                <Home size={16} />
                Ir al inicio
              </Link>
            </div>

            {/* Información adicional */}
            <div className="mt-6 pt-4 border-t border-border-default">
              <p className="text-xs text-text-secondary">
                ID del error: {this.state.errorId}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Si el problema persiste, contacta al soporte técnico
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook para uso en componentes funcionales
export function useErrorHandler() {
  return (error, errorInfo) => {
    // En desarrollo, lanzar el error para que lo capture ErrorBoundary
    if (process.env.NODE_ENV === 'development') {
      throw error
    }
    
    // En producción, manejar graciosamente
    console.error('Error manejado:', error, errorInfo)
    
    // Opcional: mostrar toast de error
    if (window.toast) {
      window.toast.error('Error', 'Ha ocurrido un problema inesperado')
    }
  }
}

// Componente funcional para errores menores
export function ErrorFallback({ error, retry, level = 'component' }) {
  if (level === 'inline') {
    return (
      <div className="flex items-center gap-2 p-2 text-feedback-error text-sm">
        <AlertTriangle size={16} />
        <span>Error al cargar</span>
        <button 
          onClick={retry}
          className="underline hover:no-underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 border border-feedback-error-light bg-feedback-error-light rounded-md text-center">
      <AlertTriangle size={24} className="text-feedback-error mx-auto mb-3" />
      <h3 className="font-medium text-text-base mb-2">Error al cargar</h3>
      <p className="text-sm text-text-secondary mb-4">
        {error?.message || 'Ha ocurrido un problema inesperado'}
      </p>
      <button 
        onClick={retry}
        className="btn btn-sm btn-secondary btn-with-icon"
      >
        <RefreshCw size={14} />
        Reintentar
      </button>
    </div>
  )
}

// HOC para envolver componentes con error boundary
export function withErrorBoundary(Component, errorBoundaryConfig = {}) {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryConfig}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Error boundaries especializados
export class NetworkErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, isNetworkError: false }
  }

  static getDerivedStateFromError(error) {
    const isNetworkError = error.name === 'NetworkError' || 
                          error.message.includes('fetch') ||
                          error.message.includes('network')
    
    return { 
      hasError: true,
      isNetworkError
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error('NetworkErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isNetworkError) {
        return (
          <div className="p-4 border border-feedback-warning-light bg-feedback-warning-light rounded-md">
            <div className="flex items-center gap-2 text-feedback-warning mb-2">
              <AlertTriangle size={20} />
              <h4 className="font-medium">Problema de conexión</h4>
            </div>
            <p className="text-sm text-text-secondary mb-3">
              No se pudo conectar con el servidor. Verifica tu conexión a internet.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-sm btn-secondary"
            >
              <RefreshCw size={14} />
              Reintentar
            </button>
          </div>
        )
      }
    }

    return this.props.children
  }
}

export default ErrorBoundary
