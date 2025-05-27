// Selector de frecuencia mejorado con diseño consistente
import React from 'react';

const SimpleFrequencySelector = ({ 
  value, 
  onChange, 
  options = [
    { value: 'diario', label: 'Diario', icon: '📅', description: 'Revisión diaria del proceso' },
    { value: 'semanal', label: 'Semanal', icon: '📊', description: 'Revisión semanal del estado' },
    { value: 'mensual', label: 'Mensual', icon: '📈', description: 'Revisión mensual completa' }
  ]
}) => {
  const handleCardClick = (optionValue) => {
    onChange(optionValue);
  };

  const getCardStyle = (isSelected) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    border: `2px solid ${isSelected ? '#facc15' : '#e2e8f0'}`,
    borderRadius: '12px',
    backgroundColor: isSelected ? '#fffbeb' : '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '12px',
    position: 'relative',
    boxShadow: isSelected ? '0 4px 12px rgba(250, 204, 21, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
  });

  const radioStyle = {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid #e2e8f0',
    marginRight: '16px',
    position: 'relative',
    flexShrink: 0,
    transition: 'all 0.2s ease'
  };

  const radioSelectedStyle = {
    ...radioStyle,
    borderColor: '#facc15',
    backgroundColor: '#facc15'
  };

  const radioInnerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#1e293b'
  };

  return (
    <div>
      {options.map((option) => {
        const isSelected = value === option.value;
        
        return (
          <div 
            key={option.value}
            style={getCardStyle(isSelected)}
            onClick={() => handleCardClick(option.value)}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.target.style.borderColor = '#facc15';
                e.target.style.backgroundColor = '#fefce8';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#ffffff';
              }
            }}
          >
            {/* Radio Button Custom */}
            <div style={isSelected ? radioSelectedStyle : radioStyle}>
              {isSelected && <div style={radioInnerStyle}></div>}
            </div>
            
            {/* Hidden input for form compatibility */}
            <input
              type="radio"
              name="frecuencia"
              value={option.value}
              checked={isSelected}
              onChange={() => handleCardClick(option.value)}
              style={{ display: 'none' }}
            />
            
            {/* Icon */}
            <div style={{
              fontSize: '24px',
              marginRight: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              backgroundColor: isSelected ? '#facc15' : '#f1f5f9',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}>
              {option.icon}
            </div>
            
            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: '600',
                fontSize: '16px',
                color: '#1e293b',
                marginBottom: '4px'
              }}>
                {option.label}
              </div>
              <div style={{ 
                fontSize: '14px',
                color: '#64748b'
              }}>
                {option.description}
              </div>
            </div>
            
            {/* Selected indicator */}
            {isSelected && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '24px',
                height: '24px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                ✓
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SimpleFrequencySelector;
