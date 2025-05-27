// Versión simplificada del selector de frecuencia
import React from 'react';

const SimpleFrequencySelector = ({ 
  value, 
  onChange, 
  options = [
    { value: 'diario', label: 'Diario' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'mensual', label: 'Mensual' }
  ]
}) => {
  const handleCardClick = (optionValue) => {
    onChange(optionValue);
  };

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    marginBottom: '8px'
  };

  const selectedStyle = {
    ...cardStyle,
    borderColor: '#facc15',
    backgroundColor: 'rgba(250, 204, 21, 0.1)'
  };

  return (
    <div>
      {options.map((option) => (
        <label 
          key={option.value}
          style={value === option.value ? selectedStyle : cardStyle}
          onClick={() => handleCardClick(option.value)}
        >
          <input
            type="radio"
            name="frecuencia"
            value={option.value}
            checked={value === option.value}
            onChange={() => handleCardClick(option.value)}
            style={{ marginRight: '12px' }}
          />
          <span style={{ fontWeight: '500' }}>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default SimpleFrequencySelector;
