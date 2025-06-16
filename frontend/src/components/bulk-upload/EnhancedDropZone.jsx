import React from 'react';
import { Upload, FileSpreadsheet, MousePointer, Zap } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

/**
 * Zona de drag & drop mejorada con animaciones y feedback visual avanzado
 * Incluye micro-interacciones y estados visuales claros
 */
const EnhancedDropZone = ({ 
  dragActive = false,
  onDrop,
  onDrag,
  onFileSelect,
  disabled = false,
  className = '',
  ...props 
}) => {
  const handleClick = () => {
    if (!disabled && onFileSelect) {
      onFileSelect();
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={cn(
        // Estructura base
        'relative border-2 border-dashed rounded-lg p-2xl text-center',
        'transition-all duration-300 ease-out cursor-pointer overflow-hidden',
        'focus:outline-none focus:ring-2 focus:ring-interactive-default focus:ring-opacity-50',
        
        // Estados normales
        !dragActive && !disabled && [
          'border-border-default hover:border-interactive-hover',
          'hover:bg-yellow-50 hover:bg-opacity-50 hover:scale-[1.02]',
          'hover:shadow-lg hover:shadow-yellow-100'
        ],
        
        // Estado drag active
        dragActive && [
          'border-interactive-default bg-yellow-50 scale-105',
          'shadow-lexia transform border-solid',
          'ring-2 ring-interactive-default ring-opacity-30'
        ],
        
        // Estado disabled
        disabled && [
          'border-border-disabled bg-bg-light opacity-60',
          'cursor-not-allowed'
        ],
        
        className
      )}
      onDrop={onDrop}
      onDragOver={onDrag}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label="Área para subir archivo de Excel"
      aria-disabled={disabled}
      {...props}
    >
      {/* Efecto de fondo animado */}
      <div className={cn(
        'absolute inset-0 opacity-0 transition-opacity duration-300',
        dragActive && 'opacity-10'
      )}>
        <div className="w-full h-full bg-interactive-default animate-pulse" />
      </div>

      {/* Ondas de ripple effect */}
      {dragActive && (
        <>
          <div className="absolute inset-0 border-2 border-interactive-default rounded-lg animate-ping opacity-30" />
          <div className="absolute inset-2 border-2 border-interactive-default rounded-lg animate-ping opacity-20" style={{ animationDelay: '0.2s' }} />
        </>
      )}

      {/* Contenido principal */}
      <div className="relative z-10 space-y-lg">
        {/* Icono principal */}
        <div className="flex justify-center">
          <div className={cn(
            'w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300',
            dragActive ? [
              'bg-interactive-default shadow-lexia-lg animate-bounce',
              'scale-110'
            ] : [
              'bg-bg-light group-hover:bg-interactive-default',
              'hover:scale-110 hover:shadow-lg'
            ],
            disabled && 'bg-border-disabled'
          )}>
            {dragActive ? (
              <Zap size={36} className="text-text-primary" />
            ) : (
              <Upload 
                size={36} 
                className={cn(
                  'transition-colors duration-300',
                  disabled ? 'text-text-secondary' : 'text-interactive-default'
                )}
              />
            )}
          </div>
        </div>

        {/* Texto principal */}
        <div className="space-y-sm">
          <h3 className="text-heading-h3 font-heading text-text-primary">
            {dragActive ? '¡Suelta el archivo aquí!' : 'Arrastra tu archivo Excel aquí'}
          </h3>
          
          <p className="text-body-paragraph text-text-secondary max-w-sm mx-auto">
            {dragActive 
              ? 'Procesaremos tu archivo inmediatamente'
              : 'o haz clic para seleccionar un archivo de tu computadora'
            }
          </p>
        </div>

        {/* Botón de acción */}
        <div className="flex justify-center">
          <Button
            variant={dragActive ? "primary" : "secondary"}
            size="lg"
            disabled={disabled}
            icon={dragActive ? <Zap size={20} /> : <MousePointer size={20} />}
            className={cn(
              'transition-all duration-300',
              dragActive && 'animate-pulse-subtle shadow-lexia'
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            {dragActive ? 'Procesar Archivo' : 'Seleccionar Archivo'}
          </Button>
        </div>

        {/* Indicadores de formato */}
        <div className="flex justify-center items-center gap-md pt-md border-t border-border-default border-opacity-50">
          <div className="flex items-center gap-xs text-body-auxiliary text-text-secondary">
            <FileSpreadsheet size={16} className="text-feedback-success" />
            <span>.xlsx</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border-default"></div>
          <div className="flex items-center gap-xs text-body-auxiliary text-text-secondary">
            <FileSpreadsheet size={16} className="text-feedback-success" />
            <span>.xls</span>
          </div>
        </div>

        {/* Información adicional */}
        <div className="text-body-auxiliary text-text-secondary space-y-xs">
          <p>Tamaño máximo: 10MB</p>
          <p>Hasta 1,000 registros por archivo</p>
        </div>
      </div>

      {/* Decoración de esquinas */}
      <div className={cn(
        'absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 rounded-tl-lg transition-all duration-300',
        dragActive ? 'border-interactive-default opacity-100' : 'border-border-default opacity-30'
      )} />
      <div className={cn(
        'absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 rounded-tr-lg transition-all duration-300',
        dragActive ? 'border-interactive-default opacity-100' : 'border-border-default opacity-30'
      )} />
      <div className={cn(
        'absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 rounded-bl-lg transition-all duration-300',
        dragActive ? 'border-interactive-default opacity-100' : 'border-border-default opacity-30'
      )} />
      <div className={cn(
        'absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 rounded-br-lg transition-all duration-300',
        dragActive ? 'border-interactive-default opacity-100' : 'border-border-default opacity-30'
      )} />
    </div>
  );
};

export default EnhancedDropZone;