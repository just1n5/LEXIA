import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Clock, 
  Zap, 
  Upload,
  FileSpreadsheet,
  TrendingUp,
  Wifi,
  WifiOff
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useMobileDetection } from '../../hooks/mobile/useMobileDetection';

/**
 * Sistema de indicadores de estado flotantes para feedback en tiempo real
 * Perfecto para mostrar progreso de operaciones en background
 */
const FloatingStatusIndicator = ({ 
  status = 'idle', // idle, processing, success, error, warning, offline
  title,
  message,
  progress,
  actions = [],
  persistent = false,
  position = 'bottom-right', // bottom-right, bottom-left, top-right, top-left, bottom-center
  autoHide = true,
  hideDelay = 5000,
  onClose,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isMobile } = useMobileDetection();

  // Auto-hide logic
  useEffect(() => {
    if (!autoHide || persistent || status === 'processing') return;

    const timer = setTimeout(() => {
      handleClose();
    }, hideDelay);

    return () => clearTimeout(timer);
  }, [autoHide, persistent, status, hideDelay]);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const getStatusConfig = () => {
    const configs = {
      idle: {
        icon: Clock,
        bgClass: 'bg-bg-canvas border-border-default',
        iconClass: 'text-text-secondary',
        titleClass: 'text-text-primary'
      },
      processing: {
        icon: Zap,
        bgClass: 'bg-feedback-info-light border-feedback-info',
        iconClass: 'text-feedback-info animate-pulse',
        titleClass: 'text-feedback-info'
      },
      success: {
        icon: CheckCircle,
        bgClass: 'bg-feedback-success-light border-feedback-success',
        iconClass: 'text-feedback-success',
        titleClass: 'text-feedback-success'
      },
      error: {
        icon: AlertCircle,
        bgClass: 'bg-feedback-error-light border-feedback-error',
        iconClass: 'text-feedback-error',
        titleClass: 'text-feedback-error'
      },
      warning: {
        icon: AlertCircle,
        bgClass: 'bg-feedback-warning-light border-feedback-warning',
        iconClass: 'text-feedback-warning',
        titleClass: 'text-feedback-warning'
      },
      offline: {
        icon: WifiOff,
        bgClass: 'bg-border-disabled border-border-disabled',
        iconClass: 'text-text-secondary',
        titleClass: 'text-text-secondary'
      }
    };

    return configs[status] || configs.idle;
  };

  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    // En móvil, siempre usar bottom-center
    return isMobile ? positions['bottom-center'] : positions[position];
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        'fixed z-50 pointer-events-auto',
        getPositionClasses(),
        isMobile ? 'mx-4 left-4 right-4' : 'max-w-sm'
      )}
    >
      <div
        className={cn(
          'rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300 ease-out',
          statusConfig.bgClass,
          'transform',
          isAnimating ? 'scale-95 opacity-0 translate-y-2' : 'scale-100 opacity-100 translate-y-0',
          isMobile ? 'p-md' : 'p-lg',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start gap-sm">
          {/* Icono de estado */}
          <div className="flex-shrink-0 mt-xs">
            <StatusIcon size={20} className={statusConfig.iconClass} />
          </div>

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={cn(
                'font-medium mb-xs',
                isMobile ? 'text-body-paragraph' : 'text-body-paragraph',
                statusConfig.titleClass
              )}>
                {title}
              </h4>
            )}
            
            {message && (
              <p className={cn(
                'text-text-secondary',
                isMobile ? 'text-body-auxiliary' : 'text-body-auxiliary'
              )}>
                {message}
              </p>
            )}

            {/* Barra de progreso */}
            {progress !== undefined && (
              <div className="mt-sm">
                <div className="flex justify-between text-body-auxiliary mb-xs">
                  <span>Progreso</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-bg-light rounded-full h-2 overflow-hidden">
                  <div 
                    className={cn(
                      'h-full rounded-full transition-all duration-500 ease-out',
                      status === 'processing' ? 'bg-feedback-info' : 'bg-current'
                    )}
                    style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                  >
                    {status === 'processing' && (
                      <div className="h-full w-full bg-gradient-to-r from-transparent via-white via-opacity-30 to-transparent animate-shimmer" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Acciones */}
            {actions.length > 0 && (
              <div className={cn(
                'flex gap-sm mt-md',
                isMobile && 'flex-col'
              )}>
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={cn(
                      'btn btn-sm',
                      action.variant === 'primary' ? 'btn-primary' : 'btn-secondary',
                      isMobile && 'w-full'
                    )}
                  >
                    {action.icon && (
                      <span className="mr-xs">{action.icon}</span>
                    )}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botón de cierre */}
          {!persistent && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-xs hover:bg-current hover:bg-opacity-10 rounded transition-colors"
              aria-label="Cerrar notificación"
            >
              <X size={16} className="text-text-secondary" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Hook para manejar múltiples indicators
 */
export const useFloatingIndicators = () => {
  const [indicators, setIndicators] = useState([]);

  const addIndicator = (indicator) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newIndicator = { ...indicator, id };
    
    setIndicators(prev => {
      // Limitar a máximo 3 indicators
      const updated = [...prev, newIndicator];
      return updated.slice(-3);
    });
    
    return id;
  };

  const updateIndicator = (id, updates) => {
    setIndicators(prev => 
      prev.map(indicator => 
        indicator.id === id ? { ...indicator, ...updates } : indicator
      )
    );
  };

  const removeIndicator = (id) => {
    setIndicators(prev => prev.filter(indicator => indicator.id !== id));
  };

  const clearAll = () => {
    setIndicators([]);
  };

  return {
    indicators,
    addIndicator,
    updateIndicator,
    removeIndicator,
    clearAll
  };
};

/**
 * Container para múltiples indicators
 */
const FloatingIndicatorContainer = ({ indicators, onRemove }) => {
  const { isMobile } = useMobileDetection();

  if (indicators.length === 0) return null;

  return (
    <div className={cn(
      'fixed z-50 flex flex-col gap-sm pointer-events-none',
      isMobile ? 'bottom-4 left-4 right-4' : 'bottom-4 right-4 max-w-sm'
    )}>
      {indicators.map((indicator) => (
        <FloatingStatusIndicator
          key={indicator.id}
          {...indicator}
          onClose={() => onRemove(indicator.id)}
          className="pointer-events-auto"
        />
      ))}
    </div>
  );
};

/**
 * Indicators específicos para bulk upload
 */
export const BulkUploadIndicators = {
  fileUploading: (fileName) => ({
    status: 'processing',
    title: 'Subiendo archivo',
    message: `Cargando ${fileName}...`,
    persistent: true
  }),

  fileProcessing: (fileName, progress = 0) => ({
    status: 'processing',
    title: 'Procesando archivo',
    message: `Validando ${fileName}...`,
    progress,
    persistent: true
  }),

  fileProcessed: (validRows, totalRows) => ({
    status: 'success',
    title: 'Archivo procesado',
    message: `${validRows} de ${totalRows} registros válidos`,
    autoHide: true,
    hideDelay: 4000
  }),

  fileError: (fileName, error) => ({
    status: 'error',
    title: 'Error en archivo',
    message: `${fileName}: ${error}`,
    autoHide: true,
    hideDelay: 8000,
    actions: [{
      label: 'Reintentar',
      variant: 'primary',
      onClick: () => window.location.reload()
    }]
  }),

  bulkCreating: (count) => ({
    status: 'processing',
    title: 'Creando consultas',
    message: `Procesando ${count} consultas automáticas...`,
    persistent: true
  }),

  bulkCreated: (count) => ({
    status: 'success',
    title: 'Consultas creadas',
    message: `${count} consultas automáticas creadas exitosamente`,
    actions: [{
      label: 'Ver Dashboard',
      variant: 'primary',
      icon: <TrendingUp size={14} />,
      onClick: () => window.location.href = '/dashboard'
    }]
  }),

  connectionLost: () => ({
    status: 'offline',
    title: 'Conexión perdida',
    message: 'Verifica tu conexión a internet',
    persistent: true,
    actions: [{
      label: 'Reintentar',
      variant: 'secondary',
      icon: <Wifi size={14} />,
      onClick: () => window.location.reload()
    }]
  })
};

// Asignar subcomponentes
FloatingStatusIndicator.Container = FloatingIndicatorContainer;
FloatingStatusIndicator.useIndicators = useFloatingIndicators;
FloatingStatusIndicator.BulkUpload = BulkUploadIndicators;

export default FloatingStatusIndicator;