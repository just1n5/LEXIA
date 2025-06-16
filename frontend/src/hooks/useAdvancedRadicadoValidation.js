// 🏛️ hooks/useAdvancedRadicadoValidation.js
// Hook para validación oficial de números de radicación según Acuerdo 201 de 1997

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';

/**
 * 🎯 Hook para validación oficial de números de radicación
 * 
 * Basado en: Acuerdo No. 201 de 1997 - Rama Judicial de Colombia
 * Estructura oficial: 23 dígitos exactos
 * 
 * Composición:
 * - 5 dígitos: Código DANE (2 depto + 3 ciudad)
 * - 2 dígitos: Código Entidad/Corporación
 * - 2 dígitos: Código Especialidad
 * - 3 dígitos: Despacho (000 para Altas Cortes)
 * - 4 dígitos: Año de radicación
 * - 5 dígitos: Código de Proceso (consecutivo)
 * - 2 dígitos: Recurso del Proceso (00=primera instancia)
 */
export const useAdvancedRadicadoValidation = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  const [validationState, setValidationState] = useState('idle');
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [detectedPattern, setDetectedPattern] = useState(null);
  
  // Debounce del valor para evitar validaciones excesivas
  const debouncedValue = useDebounce(value, 500);
  const validationRef = useRef(null);

  // 🏛️ Estructura oficial del número de radicación (23 dígitos exactos)
  const oficialRadicadoPattern = {
    regex: /^(\d{2})(\d{3})(\d{2})(\d{2})(\d{3})(\d{4})(\d{5})(\d{2})$/,
    description: 'Estructura oficial según Acuerdo 201 de 1997',
    example: '05001310012021000100',
    length: 23,
    parts: [
      { name: 'Departamento', length: 2, description: 'Código DANE departamento' },
      { name: 'Ciudad', length: 3, description: 'Código DANE ciudad' },
      { name: 'Entidad', length: 2, description: 'Código entidad/corporación' },
      { name: 'Especialidad', length: 2, description: 'Código especialidad' },
      { name: 'Despacho', length: 3, description: 'Número despacho (000 para Altas Cortes)' },
      { name: 'Año', length: 4, description: 'Año de radicación' },
      { name: 'Consecutivo', length: 5, description: 'Código proceso consecutivo' },
      { name: 'Recurso', length: 2, description: 'Recurso proceso (00=primera instancia)' }
    ]
  };

  // 🔍 Validaciones específicas por segmento
  const validateSegments = (parts) => {
    const warnings = [];
    const currentYear = new Date().getFullYear();
    
    if (parts && parts.length === 9) { // parts[0] es la coincidencia completa
      const [, depto, ciudad, entidad, especialidad, despacho, año, consecutivo, recurso] = parts;
      
      // Validar departamento (01-99)
      const deptoNum = parseInt(depto);
      if (deptoNum < 1 || deptoNum > 99) {
        warnings.push('Código de departamento fuera del rango válido (01-99)');
      }
      
      // Validar año (1900-actualidad+5)
      const añoNum = parseInt(año);
      if (añoNum < 1900 || añoNum > currentYear + 5) {
        warnings.push(`Año de radicación inusual (${año}). Rango típico: 2000-${currentYear}`);
      }
      
      // Validar consecutivo (no puede ser 00000)
      if (consecutivo === '00000') {
        warnings.push('El código de proceso consecutivo no puede ser 00000');
      }
      
      // Validar recurso (00-03 típicos)
      const recursoNum = parseInt(recurso);
      if (recursoNum > 10) {
        warnings.push('Código de recurso inusualmente alto. Típicos: 00 (primera instancia), 01-03 (instancias superiores)');
      }
    }
    
    return warnings;
  };

  // 🔍 Función de validación principal
  const validateRadicado = useCallback(async (radicado) => {
    if (!radicado || radicado.trim() === '') {
      setValidationState('idle');
      setMessage('');
      setSuggestions([]);
      setDetectedPattern(null);
      return;
    }

    setIsValidating(true);
    
    try {
      // Limpiar valor (solo números)
      const cleanValue = radicado.replace(/\D/g, '');
      
      if (cleanValue !== radicado) {
        setValidationState('error');
        setMessage('❌ Error: Solo debe contener números, sin espacios ni caracteres especiales');
        setSuggestions([{
          type: 'correction',
          text: `Corrección sugerida: ${cleanValue}`,
          action: () => setValue(cleanValue)
        }]);
        return;
      }

      // Validación por longitud específica
      if (cleanValue.length < oficialRadicadoPattern.length) {
        const missing = oficialRadicadoPattern.length - cleanValue.length;
        setValidationState('warning');
        setMessage(`⚠️ Incompleto: Faltan ${missing} dígitos. Los radicados tienen exactamente 23 dígitos`);
        setSuggestions([{
          type: 'info',
          text: `Ejemplo oficial: ${oficialRadicadoPattern.example}`,
          action: null
        }]);
        return;
      }

      if (cleanValue.length > oficialRadicadoPattern.length) {
        const extra = cleanValue.length - oficialRadicadoPattern.length;
        setValidationState('error');
        setMessage(`❌ Muy largo: Sobran ${extra} dígitos. Los radicados tienen exactamente 23 dígitos`);
        setSuggestions([{
          type: 'suggestion',
          text: `¿Los primeros 23 dígitos? ${cleanValue.substring(0, 23)}`,
          action: () => setValue(cleanValue.substring(0, 23))
        }]);
        return;
      }

      // Validación de estructura oficial
      const match = cleanValue.match(oficialRadicadoPattern.regex);
      
      if (match) {
        // Validaciones adicionales de segmentos
        const warnings = validateSegments(match);
        
        setDetectedPattern({
          pattern: oficialRadicadoPattern,
          parts: match,
          segments: oficialRadicadoPattern.parts.map((part, index) => ({
            ...part,
            value: match[index + 1]
          }))
        });
        
        if (warnings.length > 0) {
          setValidationState('warning');
          setMessage(`⚠️ Formato correcto, pero revise: ${warnings[0]}`);
          setSuggestions(warnings.map(warning => ({
            type: 'info',
            text: warning,
            action: null
          })));
        } else {
          setValidationState('valid');
          setMessage('✅ Número de radicación válido (estructura oficial)');
          setSuggestions([{
            type: 'success',
            text: 'Estructura conforme al Acuerdo 201 de 1997 - Rama Judicial',
            action: null
          }]);
        }
      } else {
        // Estructura no válida
        setValidationState('error');
        setMessage('❌ Estructura no válida. Debe seguir el formato oficial de 23 dígitos');
        setSuggestions([
          {
            type: 'info',
            text: 'Estructura: DDDDD-EE-SS-DDD-AAAA-CCCCC-RR',
            action: null
          },
          {
            type: 'example',
            text: `Ejemplo: ${oficialRadicadoPattern.example}`,
            action: () => setValue(oficialRadicadoPattern.example)
          }
        ]);
      }
      
    } catch (error) {
      setValidationState('error');
      setMessage('❌ Error al validar. Intente nuevamente');
      setSuggestions([]);
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  }, []);

  // 🔄 Efecto para validación automática
  useEffect(() => {
    if (validationRef.current) {
      clearTimeout(validationRef.current);
    }
    
    validationRef.current = setTimeout(() => {
      validateRadicado(debouncedValue);
    }, 300);
    
    return () => {
      if (validationRef.current) {
        clearTimeout(validationRef.current);
      }
    };
  }, [debouncedValue, validateRadicado]);

  // 📝 Handler para cambios de valor
  const handleChange = useCallback((newValue) => {
    // Limitar a 23 dígitos máximo
    const cleanValue = newValue.replace(/\D/g, '').substring(0, 23);
    setValue(cleanValue);
    
    // Reset inmediato si se borra todo
    if (!cleanValue) {
      setValidationState('idle');
      setMessage('');
      setSuggestions([]);
      setDetectedPattern(null);
    }
  }, []);

  // 🎯 Validación manual (para submit)
  const validateSync = useCallback(() => {
    const cleanValue = value.replace(/\D/g, '');
    
    if (!cleanValue) {
      return { isValid: false, error: 'El número de radicación es obligatorio' };
    }
    
    if (cleanValue.length !== 23) {
      return { isValid: false, error: `Debe tener exactamente 23 dígitos (actual: ${cleanValue.length})` };
    }
    
    if (validationState === 'error') {
      return { isValid: false, error: 'El formato del número de radicación no es válido' };
    }
    
    return { isValid: true, error: null };
  }, [value, validationState]);

  // 🎨 Función para obtener props del input
  const getInputProps = useCallback(() => {
    return {
      value,
      onChange: (e) => handleChange(e.target.value),
      validationState: isValidating ? 'validating' : validationState,
      placeholder: oficialRadicadoPattern.example,
      maxLength: 23
    };
  }, [value, handleChange, isValidating, validationState]);

  // 📊 Información del patrón detectado
  const getPatternInfo = useCallback(() => {
    if (!detectedPattern) return null;
    
    return {
      description: detectedPattern.pattern.description,
      parts: detectedPattern.segments,
      isOfficial: true,
      structure: 'DDDDD-EE-SS-DDD-AAAA-CCCCC-RR'
    };
  }, [detectedPattern]);

  // 🎯 Formatear número para visualización
  const getFormattedValue = useCallback(() => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length === 23) {
      // Formato: DDDDD-EE-SS-DDD-AAAA-CCCCC-RR
      return cleanValue.replace(
        /(\d{5})(\d{2})(\d{2})(\d{3})(\d{4})(\d{5})(\d{2})/,
        '$1-$2-$3-$4-$5-$6-$7'
      );
    }
    return cleanValue;
  }, [value]);

  return {
    value,
    setValue: handleChange,
    validationState: isValidating ? 'validating' : validationState,
    message,
    suggestions,
    isValidating,
    detectedPattern: getPatternInfo(),
    validateSync,
    getInputProps,
    
    // Métodos de utilidad
    clear: () => {
      setValue('');
      setValidationState('idle');
      setMessage('');
      setSuggestions([]);
      setDetectedPattern(null);
    },
    
    retry: () => validateRadicado(value),
    
    // Estados calculados
    isValid: validationState === 'valid' || (validationState === 'warning' && value.replace(/\D/g, '').length === 23),
    hasError: validationState === 'error',
    hasWarning: validationState === 'warning',
    isEmpty: !value.trim(),
    isComplete: value.replace(/\D/g, '').length === 23,
    
    // Información adicional oficial
    cleanValue: value.replace(/\D/g, ''),
    formattedValue: getFormattedValue(),
    officialStructure: oficialRadicadoPattern.parts,
    progress: Math.min((value.replace(/\D/g, '').length / 23) * 100, 100)
  };
};