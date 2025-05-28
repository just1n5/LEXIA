import React from 'react';
import { cn } from '../../utils/cn';
import Badge from '../ui/Badge';

const FrequencySelector = ({ 
  value, 
  onChange, 
  options = [
    { 
      value: 'dinamico', 
      label: 'Monitoreo Dinámico', 
      description: 'Consultas diarias con notificaciones solo cuando hay cambios',
      recommended: true
    },
    { value: 'diario', label: 'Diario', description: 'Una vez al día' },
    { value: 'semanal', label: 'Semanal', description: 'Una vez por semana' },
    { value: 'mensual', label: 'Mensual', description: 'Una vez al mes' }
  ],
  className = ''
}) => {
  const handleCardClick = (optionValue) => {
    onChange(optionValue);
  };

  return (
    <div className={cn('space-y-sm', className)}>
      {options.map((option) => (
        <label 
          key={option.value}
          className={cn(
            'flex items-center p-md border rounded-md bg-bg-canvas cursor-pointer transition-default',
            'hover:bg-bg-light',
            value === option.value 
              ? 'border-interactive-default bg-yellow-50' 
              : 'border-border-default'
          )}
          onClick={() => handleCardClick(option.value)}
        >
          <input
            type="radio"
            name="frecuencia"
            value={option.value}
            checked={value === option.value}
            onChange={() => handleCardClick(option.value)}
            className="w-4 h-4 text-interactive-default bg-bg-canvas border-border-default focus:ring-interactive-default focus:ring-2 mr-md"
          />
          <div className="flex-1">
            <div className="flex items-center gap-sm mb-xs">
              <span className="text-body-paragraph font-medium text-text-primary">
                {option.label}
              </span>
              {option.recommended && (
                <Badge variant="success" size="sm">Recomendado</Badge>
              )}
            </div>
            {option.description && (
              <span className="text-body-auxiliary text-text-secondary">
                {option.description}
              </span>
            )}
          </div>
        </label>
      ))}
    </div>
  );
};

export default FrequencySelector;