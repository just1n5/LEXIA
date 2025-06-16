import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Info, 
  AlertTriangle, 
  X, 
  Upload, 
  Download, 
  FileSpreadsheet,
  Zap,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de ToastProvider');
  }
  return context;
};

/**
 * Iconos y configuraciones para diferentes tipos de toast
 */
const toastConfigs = {
  success: {
    icon: CheckCircle,
    baseClasses: 'bg-feedback-success-light border-feedback-success text-feedback-success',
    duration: 4000
  },
  error: {
    icon: XCircle,
    baseClasses: 'bg-feedback-error-light border-feedback-error text-feedback-error',
    duration: 6000
  },
  warning: {
    icon: AlertTriangle,
    baseClasses: 'bg-feedback-warning-light border-feedback-warning text-feedback-warning',
    duration: 5000
  },
  info: {
    icon: Info,
    baseClasses: 'bg-feedback-info-light border-feedback-info text-feedback-info',
    duration: 4000
  },
  // 🆕 NUEVOS: Tipos específicos para bulk upload
  upload: {
    icon: Upload,
    baseClasses: 'bg-interactive-default bg-opacity-10 border-interactive-default text-interactive-default',
    duration: 3000
  },
  processing: {
    icon: Zap,
    baseClasses: 'bg-feedback-info-light border-feedback-info text-feedback-info',
    duration: 0, // No auto-dismiss
    animated: true
  },
  download: {
    icon: Download,
    baseClasses: 'bg-feedback-success-light border-feedback-success text-feedback-success',
    duration: 3000
  },
  fileError: {
    icon: FileSpreadsheet,
    baseClasses: 'bg-feedback-error-light border-feedback-error text-feedback-error',
    duration: 7000
  }
};

/**
 * Componente Toast individual mejorado
 */
function Toast({ id, type, title, message, action, persistent = false, progress, onClose }) {
  const config = toastConfigs[type] || toastConfigs.info;
  const Icon = config.icon;
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  // Auto-dismiss logic
  React.useEffect(() => {
    if (persistent || config.duration === 0) return;

    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        onClose(id);
      }, 300); // Tiempo para animación de salida
    }, config.duration);

    return () => clearTimeout(timer);
  }, [id, onClose, persistent, config.duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  return (
    <div 
      className={cn(
        // Estructura base
        'toast-item pointer-events-auto flex items-start gap-sm p-md rounded-lg border shadow-lg',
        'transition-all duration-300 ease-in-out transform',
        // Clases específicas del tipo
        config.baseClasses,
        // Estados de animación
        isVisible && !isLeaving && 'translate-x-0 opacity-100',
        isLeaving && 'translate-x-full opacity-0',
        // Animación específica para processing
        config.animated && 'animate-pulse-subtle'
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Icono */}
      <div className="flex-shrink-0 mt-xs">
        <Icon 
          size={20} 
          className={cn(
            'transition-transform duration-300',
            config.animated && 'animate-pulse'
          )} 
        />
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-body-paragraph font-medium text-text-primary">
              {title}
            </h4>
            {message && (
              <p className="text-body-auxiliary text-text-secondary mt-xs">
                {message}
              </p>
            )}
            
            {/* Progress bar para toasts de progreso */}
            {progress !== undefined && (
              <div className="mt-sm">
                <div className="flex justify-between text-body-auxiliary mb-xs">
                  <span>Progreso</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-bg-light rounded-full h-2">
                  <div 
                    className="bg-current h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Acción personalizada */}
            {action && (
              <div className="mt-sm">
                {action}
              </div>
            )}
          </div>

          {/* Botón de cierre */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-sm p-xs hover:bg-current hover:bg-opacity-10 rounded transition-colors"
            aria-label="Cerrar notificación"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Contenedor de toasts con posicionamiento fijo
 */
function ToastContainer({ toasts, onClose }) {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="toast-container fixed top-4 right-4 z-50 flex flex-col gap-sm max-w-sm w-full pointer-events-none"
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          action={toast.action}
          persistent={toast.persistent}
          progress={toast.progress}
          onClose={onClose}
        />
      ))}
    </div>
  );
}

/**
 * Provider mejorado con más funcionalidades
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts((prev) => {
      // Limitar a máximo 5 toasts visibles
      const updated = [...prev, newToast];
      return updated.slice(-5);
    });
    
    return id;
  }, []);

  const updateToast = useCallback((id, updates) => {
    setToasts((prev) => 
      prev.map((toast) => 
        toast.id === id ? { ...toast, ...updates } : toast
      )
    );
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // API de toast mejorada
  const toast = useMemo(() => ({
    // Métodos básicos
    success: (title, message, options = {}) => 
      addToast({ type: 'success', title, message, ...options }),
    
    error: (title, message, options = {}) => 
      addToast({ type: 'error', title, message, ...options }),
    
    warning: (title, message, options = {}) => 
      addToast({ type: 'warning', title, message, ...options }),
    
    info: (title, message, options = {}) => 
      addToast({ type: 'info', title, message, ...options }),

    // 🆕 NUEVOS: Métodos específicos para bulk upload
    fileUploaded: (fileName) => 
      addToast({
        type: 'upload',
        title: 'Archivo cargado',
        message: `${fileName} se ha cargado correctamente`
      }),

    fileProcessing: (fileName) => {
      const id = addToast({
        type: 'processing',
        title: 'Procesando archivo',
        message: `Validando ${fileName}...`,
        persistent: true,
        progress: 0
      });
      return id;
    },

    fileProcessed: (validRows, totalRows) => 
      addToast({
        type: 'success',
        title: 'Archivo procesado',
        message: `${validRows} de ${totalRows} registros válidos`
      }),

    fileError: (fileName, error) => 
      addToast({
        type: 'fileError',
        title: 'Error en archivo',
        message: `${fileName}: ${error}`
      }),

    templateDownloaded: () => 
      addToast({
        type: 'download',
        title: 'Plantilla descargada',
        message: 'El archivo de plantilla se ha descargado correctamente'
      }),

    bulkCreated: (count) => 
      addToast({
        type: 'success',
        title: 'Consultas creadas',
        message: `Se han creado ${count} consultas automáticas exitosamente`
      }),

    // Métodos de control
    update: updateToast,
    remove: removeToast,
    clear: removeAllToasts,

    // 🆕 NUEVO: Toast personalizado con acción
    custom: (config) => addToast(config)

  }), [addToast, updateToast, removeToast, removeAllToasts]);

  return (
    <ToastContext.Provider value={{ toast, removeToast, updateToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * Hook especializado para bulk upload toasts
 */
export const useBulkUploadToast = () => {
  const { toast } = useToast();

  return {
    // Notificaciones específicas de bulk upload
    notifyFileUploaded: (fileName) => toast.fileUploaded(fileName),
    notifyFileProcessing: (fileName) => toast.fileProcessing(fileName),
    notifyFileProcessed: (validRows, totalRows) => toast.fileProcessed(validRows, totalRows),
    notifyFileError: (fileName, error) => toast.fileError(fileName, error),
    notifyTemplateDownloaded: () => toast.templateDownloaded(),
    notifyBulkCreated: (count) => toast.bulkCreated(count),
    
    // Control de progreso
    updateProgress: (id, progress) => toast.update(id, { progress }),
    completeProgress: (id, title, message) => {
      toast.update(id, { 
        type: 'success', 
        title, 
        message, 
        persistent: false,
        progress: undefined 
      });
    },

    // Acceso directo al toast general
    toast
  };
};

export default ToastProvider;