// Hook para validación de número de radicado en tiempo real
import { useState, useCallback, useRef } from 'react';
import { solicitudesService } from '../services/solicitudes';

export const useRadicadoValidation = () => {
  const [validationState, setValidationState] = useState('idle'); // idle, validating, valid, error
  const [validationMessage, setValidationMessage] = useState('');
  const timeoutRef = useRef(null);

  const validateRadicado = useCallback(async (numeroRadicado) => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Si está vacío, resetear estado
    if (!numeroRadicado || numeroRadicado.trim() === '') {
      setValidationState('idle');
      setValidationMessage('');
      return;
    }

    // Cambiar a estado de validación
    setValidationState('validating');
    setValidationMessage('');

    // Debounce de 1 segundo
    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await solicitudesService.validateRadicado(numeroRadicado);
        
        if (result.valid) {
          setValidationState('valid');
          setValidationMessage(result.message);
        } else {
          setValidationState('error');
          setValidationMessage(result.message);
        }
      } catch (error) {
        setValidationState('error');
        setValidationMessage('Error validando número de radicado');
      }
    }, 1000);
  }, []);

  const resetValidation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setValidationState('idle');
    setValidationMessage('');
  }, []);

  return {
    validationState,
    validationMessage,
    validateRadicado,
    resetValidation
  };
};
