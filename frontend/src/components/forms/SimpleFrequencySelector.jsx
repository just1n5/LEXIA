import React from 'react';
import { cn } from '../../utils/cn';
import Badge from '../ui/Badge';

const SimpleFrequencySelector = ({ 
  value, 
  onChange, 
  options = [
    { 
      value: 'dinamico', 
      label: 'Monitoreo Dinámico', 
      icon: '🔄', 
      description: 'Consultas diarias con notificaciones solo cuando hay cambios',
      recommended: true
    },
    { value: 'diario', label: 'Diario', icon: '📅', description: 'Revisión diaria del proceso' },
    { value: 'semanal', label: 'Semanal', icon: '📊', description: 'Revisión semanal del estado' },
    { value: 'mensual', label: 'Mensual', icon: '📈', description: 'Revisión mensual completa' }
  ]
}) => {
  const handleCardClick = (optionValue) => {
    onChange(optionValue);
  };

  return (
    <div className="space-y-sm">
      {options.map((option) => {
        const isSelected = value === option.value;
        
        return (
          <label 
            key={option.value}
            className={cn(
              'flex items-center p-md border-2 rounded-lg bg-bg-canvas cursor-pointer transition-all duration-200',
              'hover:bg-yellow-50 hover:border-interactive-hover',
              isSelected 
                ? 'border-interactive-default bg-yellow-50 shadow-md' 
                : 'border-border-default'
            )}
            onClick={() => handleCardClick(option.value)}
          >
            {/* Radio Button */}
            <div className={cn(
              'w-5 h-5 rounded-full border-2 mr-md flex items-center justify-center transition-colors',
              isSelected
                ? 'border-interactive-default bg-interactive-default'
                : 'border-border-default bg-bg-canvas'
            )}>
              {isSelected && (
                <div className="w-2 h-2 bg-text-primary rounded-full"></div>
              )}
            </div>
            
            {/* Hidden input for form compatibility */}
            <input
              type="radio"
              name="frecuencia"
              value={option.value}
              checked={isSelected}
              onChange={() => handleCardClick(option.value)}
              className="sr-only"
            />
            
            {/* Icon */}
            <div className={cn(
              'flex items-center justify-center w-10 h-10 rounded-lg mr-md transition-colors text-xl',
              isSelected 
                ? 'bg-interactive-default' 
                : 'bg-bg-light'
            )}>
              {option.icon}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-sm mb-xs">
                <span className="text-body-paragraph font-medium text-text-primary">
                  {option.label}
                </span>
                {option.recommended && (
                  <Badge variant="success" size="sm">Recomendado</Badge>
                )}
              </div>
              <span className="text-body-auxiliary text-text-secondary">
                {option.description}
              </span>
            </div>
            
            {/* Selected indicator */}
            {isSelected && (
              <div className="w-6 h-6 bg-feedback-success rounded-full flex items-center justify-center ml-sm">
                <span className="text-bg-canvas text-sm font-bold">✓</span>
              </div>
            )}
          </label>
        );
      })}
    </div>
  );
};

export default SimpleFrequencySelector;