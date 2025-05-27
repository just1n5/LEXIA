import React from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const ToastContainer = () => {
  const { toasts, hideToast } = useToast();

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  const getToastClass = (type) => {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      case 'info':
      default:
        return 'toast-info';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`toast ${getToastClass(toast.type)}`}
        >
          <div className="toast-icon">
            {getToastIcon(toast.type)}
          </div>
          <div className="toast-content">
            <div className="toast-message">{toast.message}</div>
          </div>
          <button 
            className="toast-close" 
            onClick={() => hideToast(toast.id)}
            aria-label="Cerrar notificación"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: var(--spacing-lg, 1.25rem);
          right: var(--spacing-lg, 1.25rem);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm, 0.5rem);
          max-width: 400px;
        }
        
        .toast {
          display: flex;
          align-items: flex-start;
          padding: var(--spacing-md, 1rem);
          border-radius: var(--border-radius-md, 0.5rem);
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
          animation: slideIn 0.3s ease-out;
          min-width: 300px;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .toast-success {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        }
        
        .toast-error {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }
        
        .toast-warning {
          background-color: #fffbeb;
          border: 1px solid #fed7aa;
          color: #92400e;
        }
        
        .toast-info {
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e40af;
        }
        
        .toast-icon {
          margin-right: var(--spacing-sm, 0.5rem);
          flex-shrink: 0;
          margin-top: 2px;
        }
        
        .toast-content {
          flex: 1;
        }
        
        .toast-message {
          font-weight: 500;
          line-height: 1.4;
        }
        
        .toast-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-left: var(--spacing-sm, 0.5rem);
          color: inherit;
          opacity: 0.7;
          transition: opacity 0.2s ease-in-out;
          flex-shrink: 0;
        }
        
        .toast-close:hover {
          opacity: 1;
        }
        
        @media (max-width: 640px) {
          .toast-container {
            top: var(--spacing-sm, 0.5rem);
            right: var(--spacing-sm, 0.5rem);
            left: var(--spacing-sm, 0.5rem);
            max-width: none;
          }
          
          .toast {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;
