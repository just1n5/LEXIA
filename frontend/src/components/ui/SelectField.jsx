import React, { useCallback } from 'react';
import { cn } from '../../utils/cn';

/**
 * ✨ SelectField - Componente optimizado de dropdown
 * 
 * Select reutilizable con estilos consistentes y performance optimizada
 */
const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  disabled = false,
  required = false,
  className = '',
  optionKey = 'id',
  optionLabel = 'nombre',
  onFocus,
  onBlur,
  ...props
}) => {
  
  const handleChange = useCallback((event) => {
    const selectedValue = event.target.value;
    if (onChange) {
      onChange(selectedValue);
    }
  }, [onChange]);

  const handleFocus = useCallback((event) => {
    if (onFocus) {
      onFocus(event);
    }
  }, [onFocus]);

  const handleBlur = useCallback((event) => {
    if (onBlur) {
      onBlur(event);
    }
  }, [onBlur]);

  const selectClass = cn(
    'w-full px-sm py-sm border rounded-md transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-interactive-default',
    'text-body-paragraph font-sans',
    disabled
      ? 'bg-bg-light border-border-disabled text-text-secondary cursor-not-allowed'
      : 'bg-bg-canvas border-border-default text-text-base hover:border-interactive-default',
    className
  );

  return (
    <div>
      {label && (
        <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
          {label}
          {required && <span className="text-feedback-error ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className={selectClass}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        
        {options.map((option) => {
          const key = typeof option === 'object' ? option[optionKey] : option;
          const label = typeof option === 'object' ? option[optionLabel] : option;
          
          return (
            <option key={key} value={key}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectField;