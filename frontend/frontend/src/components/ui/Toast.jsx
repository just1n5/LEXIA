import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '../../utils/cn'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe ser usado dentro de ToastProvider')
  }
  return context
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: Info,
}

function Toast({ id, type, title, message, onClose }) {
  const Icon = toastIcons[type]

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onClose])

  return (
    <div className={cn('toast', `toast-${type}`)}>
      <div className="toast-icon">
        <Icon size={20} />
      </div>
      <div className="toast-content">
        <div className="toast-title">{title}</div>
        {message && <p>{message}</p>}
      </div>
      <button 
        className="toast-close" 
        onClick={() => onClose(id)}
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </div>
  )
}

function ToastContainer({ toasts, onClose }) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={onClose}
        />
      ))}
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const toast = {
    success: (title, message) => addToast({ type: 'success', title, message }),
    error: (title, message) => addToast({ type: 'error', title, message }),
    info: (title, message) => addToast({ type: 'info', title, message }),
    warning: (title, message) => addToast({ type: 'warning', title, message }),
  }

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export default ToastProvider
