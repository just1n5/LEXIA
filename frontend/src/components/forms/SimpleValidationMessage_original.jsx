// Versión simplificada sin dependencias externas para testing
import React, { useState } from 'react';

const SimpleValidationMessage = ({ state, message }) => {
  if (state === 'idle' || !message) return null;

  const getIcon = () => {
    switch (state) {
      case 'validating': return '⏳';
      case 'valid': return '✅';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getColor = () => {
    switch (state) {
      case 'validating': return '#3b82f6';
      case 'valid': return '#10b981';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginTop: '8px', 
      color: getColor(),
      fontSize: '14px'
    }}>
      <span style={{ marginRight: '8px' }}>{getIcon()}</span>
      <span>{message}</span>
    </div>
  );
};

export default SimpleValidationMessage;
