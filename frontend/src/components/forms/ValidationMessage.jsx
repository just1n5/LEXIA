import React from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const ValidationMessage = ({ 
  state, 
  message, 
  className = '' 
}) => {
  if (state === 'idle' || !message) {
    return null;
  }

  const getIcon = () => {
    switch (state) {
      case 'validating':
        return <Loader2 className="animate-spin" size={16} />;
      case 'valid':
        return <CheckCircle size={16} />;
      case 'error':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (state) {
      case 'validating':
        return 'text-blue-600';
      case 'valid':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`validation-message flex items-center mt-2 ${getColor()} ${className}`}>
      {getIcon()}
      <span className="ml-2 text-sm">{message}</span>
    </div>
  );
};

export default ValidationMessage;
