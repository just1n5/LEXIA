import React from 'react'
import SearchInputEnhanced from '../enhanced/SearchInputEnhanced'

/**
 * 🚀 SearchBarEnhanced - Versión mejorada de SearchBar
 * 
 * ✅ MANTIENE 100% compatibilidad con SearchBar original
 * ✅ AGREGA sugerencias inteligentes para el dashboard
 * ✅ CONSERVA todas las props y comportamientos existentes
 */
function SearchBarEnhanced({ 
  onSearch, 
  onClear,
  placeholder = "Buscar por nombre o radicado...", 
  disabled = false,
  value = '',
  className = '',
  // 🚀 NUEVAS PROPS ENHANCED
  suggestions = [],
  showSuggestions = true,
  onSuggestionSelect,
  ...props
}) {
  
  // 🎯 Sugerencias por defecto para búsquedas comunes en RPA
  const defaultSuggestions = [
    'SOL-001',
    'SOL-002', 
    'SOL-003',
    'En proceso',
    'Completada',
    'Pendiente',
    'Rechazada',
    'Juan Pérez',
    'María García',
    'Carlos López',
    'Ana Rodríguez',
    'consulta',
    'expediente',
    'demanda',
    'sentencia',
    ...suggestions // Combinar con sugerencias personalizadas
  ]

  const handleSuggestionSelect = (suggestion) => {
    // Ejecutar búsqueda inmediatamente al seleccionar sugerencia
    onSearch?.(suggestion)
    onSuggestionSelect?.(suggestion)
  }

  return (
    <SearchInputEnhanced
      placeholder={placeholder}
      onSearch={onSearch}
      onClear={onClear}
      value={value}
      disabled={disabled}
      className={className}
      size="md"
      debounceMs={300}
      showClearButton={true}
      // 🚀 ENHANCED FEATURES
      showSuggestions={showSuggestions}
      suggestions={defaultSuggestions}
      onSuggestionSelect={handleSuggestionSelect}
      maxSuggestions={6}
      highlightQuery={true}
      aria-label="Buscar en solicitudes"
      {...props}
    />
  )
}

export default SearchBarEnhanced

/* 
🎯 EJEMPLO DE USO:

// OPCIÓN 1: Reemplazo directo (mantiene funcionalidad exacta)
- import SearchBar from '../dashboard/SearchBar'
+ import SearchBarEnhanced from '../enhanced/SearchBarEnhanced'

// OPCIÓN 2: Con sugerencias personalizadas
<SearchBarEnhanced
  onSearch={handleSearch}
  placeholder="Buscar solicitudes..."
  suggestions={['Mi sugerencia custom', 'Otra sugerencia']}
  onSuggestionSelect={(suggestion) => {
    console.log('Sugerencia seleccionada:', suggestion)
  }}
/>

// OPCIÓN 3: Desactivar sugerencias (comportamiento original)
<SearchBarEnhanced
  onSearch={handleSearch}
  showSuggestions={false}
/>
*/