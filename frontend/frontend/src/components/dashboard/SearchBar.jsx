import React from 'react'
import SearchInput from '../ui/SearchInput'

/**
 * Componente de barra de búsqueda para el dashboard
 * Usa el SearchInput mejorado con tokens de diseño
 */
function SearchBar({ 
  onSearch, 
  onClear,
  placeholder = "Buscar por nombre o radicado...", 
  disabled = false,
  value = '',
  className = ''
}) {

  return (
    <SearchInput
      placeholder={placeholder}
      onSearch={onSearch}
      onClear={onClear}
      value={value}
      disabled={disabled}
      className={className}
      size="md"
      debounceMs={300}
      showClearButton={true}
      aria-label="Buscar en solicitudes"
    />
  )
}

export default SearchBar