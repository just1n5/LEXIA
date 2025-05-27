import React from 'react';

const FrequencySelector = ({ 
  value, 
  onChange, 
  options = [
    { value: 'diario', label: 'Diario' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'mensual', label: 'Mensual' }
  ],
  className = ''
}) => {
  const handleCardClick = (optionValue) => {
    onChange(optionValue);
  };

  return (
    <div className={`radio-card-group ${className}`}>
      {options.map((option) => (
        <label 
          key={option.value}
          className={`radio-card ${value === option.value ? 'selected' : ''}`}
          onClick={() => handleCardClick(option.value)}
        >
          <input
            type="radio"
            name="frecuencia"
            value={option.value}
            checked={value === option.value}
            onChange={() => handleCardClick(option.value)}
            className="mr-3"
          />
          <span className="radio-card-label">{option.label}</span>
        </label>
      ))}
      
      <style jsx>{`
        .radio-card-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm, 0.5rem);
        }
        
        .radio-card {
          display: flex;
          align-items: center;
          padding: var(--spacing-md, 1rem);
          border: 1px solid var(--color-border-default, #e5e7eb);
          border-radius: var(--border-radius-sm, 0.375rem);
          background-color: var(--color-bg-canvas, #ffffff);
          cursor: pointer;
          transition: var(--transition-default, all 0.2s ease-in-out);
        }
        
        .radio-card:hover {
          background-color: var(--color-bg-light, #f9fafb);
        }
        
        .radio-card.selected {
          border-color: var(--color-interactive-default, #facc15);
          background-color: rgba(250, 204, 21, 0.1);
        }
        
        .radio-card input[type="radio"] {
          margin-right: var(--spacing-md, 1rem);
        }
        
        .radio-card-label {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default FrequencySelector;
