// Componente de validación mejorado con iconos consistentes
import React from 'react';

const SimpleValidationMessage = ({ state, message }) => {
  if (state === 'idle' || !message) return null;

  const getIcon = () => {
    switch (state) {
      case 'validating': 
        return (
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid #3b82f6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        );
      case 'valid': 
        return (
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 'bold'
          }}>
            ✓
          </div>
        );
      case 'error': 
        return (
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 'bold'
          }}>
            ✕
          </div>
        );
      default: 
        return (
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: '#64748b',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '10px'
          }}>
            i
          </div>
        );
    }
  };

  const getColor = () => {
    switch (state) {
      case 'validating': return '#3b82f6';
      case 'valid': return '#10b981';
      case 'error': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getBgColor = () => {
    switch (state) {
      case 'validating': return '#dbeafe';
      case 'valid': return '#dcfce7';
      case 'error': return '#fee2e2';
      default: return '#f1f5f9';
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginTop: '8px',
      padding: '8px 12px',
      backgroundColor: getBgColor(),
      border: `1px solid ${getColor()}20`,
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500'
    }}>
      {getIcon()}
      <span style={{ 
        marginLeft: '8px', 
        color: getColor(),
        flex: 1
      }}>
        {message}
      </span>
      {state === 'valid' && (
        <div style={{
          fontSize: '16px',
          marginLeft: '8px'
        }}>
          🎉
        </div>
      )}
    </div>
  );
};

export default SimpleValidationMessage;
