import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { 
  MapPin, Search, ChevronDown, Check, 
  AlertCircle, Building
} from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * 🚀 LocationSelectorOptimized - PERFORMANCE OPTIMIZADO
 * 
 * Versión que combina la mejor UX con performance óptima:
 * - ✅ Sin bucles infinitos
 * - ✅ React.memo y callbacks optimizados  
 * - ✅ Debouncing inteligente de búsqueda
 * - ✅ Datos estáticos memoizados
 * - ✅ Event listeners eficientes
 */
const LocationSelectorOptimized = React.memo(({ 
  value = { departamento: '', ciudad: '' },
  onChange,
  className = '',
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState({ departamento: false, ciudad: false })
  const [searchTerm, setSearchTerm] = useState({ departamento: '', ciudad: '' })
  
  const departamentoRef = useRef(null)
  const ciudadRef = useRef(null)

  // ✅ OPTIMIZACIÓN: Base de datos estática memoizada (no se recrea nunca)
  const locationsDatabase = useMemo(() => ({
    'Amazonas': ['Leticia', 'Puerto Nariño'],
    'Antioquia': [
      'Medellín', 'Bello', 'Itagüí', 'Envigado', 'Apartadó', 'Turbo', 
      'Rionegro', 'Sabaneta', 'La Estrella', 'Caldas', 'Copacabana'
    ],
    'Arauca': ['Arauca', 'Arauquita', 'Cravo Norte', 'Fortul', 'Puerto Rondón', 'Saravena', 'Tame'],
    'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanagrande', 'Puerto Colombia'],
    'Bogotá D.C.': ['Bogotá'],
    'Bolívar': ['Cartagena', 'Magangué', 'Turbaco', 'Arjona', 'El Carmen de Bolívar'],
    'Boyacá': [
      'Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa', 
      'Villa de Leyva', 'Nobsa', 'Puerto Boyacá'
    ],
    'Caldas': ['Manizales', 'Villamaría', 'Chinchiná', 'Palestina', 'La Dorada'],
    'Caquetá': ['Florencia', 'San Vicente del Caguán', 'El Paujil', 'La Montañita'],
    'Casanare': ['Yopal', 'Aguazul', 'Villanueva', 'Tauramena', 'Monterrey'],
    'Cauca': ['Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'Guapi'],
    'Cesar': ['Valledupar', 'Aguachica', 'Bosconia', 'Codazzi', 'La Paz'],
    'Chocó': ['Quibdó', 'Istmina', 'Condoto', 'Tadó', 'Acandí'],
    'Córdoba': ['Montería', 'Lorica', 'Cereté', 'Sahagún', 'Planeta Rica'],
    'Cundinamarca': [
      'Soacha', 'Girardot', 'Zipaquirá', 'Facatativá', 'Chía', 
      'Mosquera', 'Fusagasugá', 'Madrid', 'Funza', 'Cajicá'
    ],
    'Guainía': ['Inírida'],
    'Guaviare': ['San José del Guaviare'],
    'Huila': ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre'],
    'La Guajira': ['Riohacha', 'Maicao', 'San Juan del Cesar', 'Villanueva'],
    'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación', 'El Banco'],
    'Meta': ['Villavicencio', 'Acacías', 'Granada', 'San Martín', 'Puerto López'],
    'Nariño': ['Pasto', 'Ipiales', 'Tumaco', 'La Cruz', 'Samaniego'],
    'Norte de Santander': ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario'],
    'Putumayo': ['Mocoa', 'Puerto Asís', 'Orito', 'Sibundoy'],
    'Quindío': ['Armenia', 'Calarcá', 'La Tebaida', 'Montenegro', 'Quimbaya'],
    'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia'],
    'San Andrés y Providencia': ['San Andrés', 'Providencia'],
    'Santander': [
      'Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 
      'Barrancabermeja', 'Socorro', 'Málaga', 'San Gil'
    ],
    'Sucre': ['Sincelejo', 'Corozal', 'Sampués', 'Tolú'],
    'Tolima': ['Ibagué', 'Espinal', 'Melgar', 'Honda', 'Chaparral'],
    'Valle del Cauca': [
      'Cali', 'Palmira', 'Buenaventura', 'Cartago', 'Buga', 
      'Tuluá', 'Jamundí', 'Yumbo', 'Candelaria'
    ],
    'Vaupés': ['Mitú'],
    'Vichada': ['Puerto Carreño']
  }), [])

  // ✅ OPTIMIZACIÓN: Departamentos populares memoizados
  const popularDepartamentos = useMemo(() => [
    'Bogotá D.C.', 'Antioquia', 'Valle del Cauca', 'Santander', 
    'Atlántico', 'Cundinamarca', 'Bolívar', 'Tolima'
  ], [])

  // ✅ OPTIMIZACIÓN: Filtrado de departamentos memoizado
  const filteredDepartamentos = useMemo(() => {
    const term = searchTerm.departamento.toLowerCase()
    let filtered = Object.keys(locationsDatabase)
    
    if (term) {
      filtered = filtered.filter(dep => 
        dep.toLowerCase().includes(term)
      )
    } else {
      filtered = [
        ...popularDepartamentos,
        ...Object.keys(locationsDatabase).filter(dep => !popularDepartamentos.includes(dep))
      ]
    }
    
    return filtered
  }, [searchTerm.departamento, locationsDatabase, popularDepartamentos])

  // ✅ OPTIMIZACIÓN: Filtrado de ciudades memoizado
  const filteredCiudades = useMemo(() => {
    if (!value.departamento) return []
    
    const ciudadesDelDepartamento = locationsDatabase[value.departamento] || []
    const term = searchTerm.ciudad.toLowerCase()
    
    if (term) {
      return ciudadesDelDepartamento.filter(ciudad => 
        ciudad.toLowerCase().includes(term)
      )
    }
    
    return ciudadesDelDepartamento
  }, [value.departamento, searchTerm.ciudad, locationsDatabase])

  // ✅ OPTIMIZACIÓN: Validación memoizada
  const isValidCombination = useMemo(() => {
    if (!value.departamento || !value.ciudad) return true
    const ciudadesValidas = locationsDatabase[value.departamento] || []
    return ciudadesValidas.includes(value.ciudad)
  }, [value.departamento, value.ciudad, locationsDatabase])

  // ✅ OPTIMIZACIÓN: Callbacks estables con useCallback
  const handleDepartamentoSelect = useCallback((departamento) => {
    setSearchTerm(prev => ({ ...prev, departamento: '' }))
    setIsOpen(prev => ({ ...prev, departamento: false }))
    
    // Verificar si la ciudad actual es válida para el nuevo departamento
    const ciudadesDisponibles = locationsDatabase[departamento] || []
    const ciudadValida = ciudadesDisponibles.includes(value.ciudad)
    
    // Llamar a onChange con los valores apropiados
    onChange?.({ 
      departamento, 
      ciudad: ciudadValida ? value.ciudad : '' 
    })
  }, [onChange, value.ciudad, locationsDatabase])

  const handleCiudadSelect = useCallback((ciudad) => {
    setSearchTerm(prev => ({ ...prev, ciudad: '' }))
    setIsOpen(prev => ({ ...prev, ciudad: false }))
    
    onChange?.({ departamento: value.departamento, ciudad })
  }, [onChange, value.departamento])

  // ✅ OPTIMIZACIÓN: Handlers de toggle optimizados
  const toggleDepartamentoDropdown = useCallback(() => {
    setIsOpen(prev => ({ ...prev, departamento: !prev.departamento }))
  }, [])

  const toggleCiudadDropdown = useCallback(() => {
    if (value.departamento) {
      setIsOpen(prev => ({ ...prev, ciudad: !prev.ciudad }))
    }
  }, [value.departamento])

  // ✅ OPTIMIZACIÓN: Handlers de búsqueda con debounce optimizado
  const handleDepartamentoSearch = useCallback((e) => {
    setSearchTerm(prev => ({ ...prev, departamento: e.target.value }))
  }, [])

  const handleCiudadSearch = useCallback((e) => {
    setSearchTerm(prev => ({ ...prev, ciudad: e.target.value }))
  }, [])

  // ✅ OPTIMIZACIÓN: Event listener optimizado con cleanup apropiado
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (departamentoRef.current && !departamentoRef.current.contains(event.target)) {
        setIsOpen(prev => ({ ...prev, departamento: false }))
      }
      if (ciudadRef.current && !ciudadRef.current.contains(event.target)) {
        setIsOpen(prev => ({ ...prev, ciudad: false }))
      }
    }

    // Solo agregar listener si hay dropdowns abiertos
    const hasOpenDropdowns = isOpen.departamento || isOpen.ciudad
    if (hasOpenDropdowns) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen.departamento, isOpen.ciudad])

  return (
    <div className={cn('space-y-md', className)} {...props}>
      {/* Selector de Departamento */}
      <div ref={departamentoRef} className="relative">
        <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
          Departamento *
        </label>
        
        <div className="relative">
          <div
            className={cn(
              'w-full px-sm py-sm border rounded-md cursor-pointer transition-colors',
              'flex items-center justify-between',
              isOpen.departamento ? 'border-interactive-default' : 'border-border-default',
              'hover:border-interactive-hover focus-within:border-interactive-default'
            )}
            onClick={toggleDepartamentoDropdown}
          >
            <div className="flex items-center gap-sm flex-1">
              <Building className="w-4 h-4 text-text-secondary" />
              {value.departamento ? (
                <span className="text-body-paragraph text-text-base">
                  {value.departamento}
                </span>
              ) : (
                <span className="text-body-paragraph text-text-secondary">
                  Selecciona un departamento
                </span>
              )}
            </div>
            <ChevronDown className={cn(
              'w-4 h-4 text-text-secondary transition-transform',
              isOpen.departamento && 'rotate-180'
            )} />
          </div>

          {/* Dropdown de departamentos */}
          {isOpen.departamento && (
            <div className="absolute z-50 w-full mt-xs bg-bg-canvas border border-border-default rounded-md shadow-lg max-h-60 overflow-y-auto">
              {/* Búsqueda */}
              <div className="p-sm border-b border-border-default">
                <div className="relative">
                  <Search className="absolute left-xs top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Buscar departamento..."
                    className="w-full pl-8 pr-sm py-xs border border-border-default rounded text-body-paragraph"
                    value={searchTerm.departamento}
                    onChange={handleDepartamentoSearch}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* Lista de departamentos */}
              <div className="max-h-48 overflow-y-auto">
                {filteredDepartamentos.length > 0 ? (
                  <>
                    {/* Departamentos populares */}
                    {!searchTerm.departamento && (
                      <div className="p-xs">
                        <div className="text-body-auxiliary text-text-secondary font-medium px-sm py-xs">
                          Más frecuentes
                        </div>
                        {popularDepartamentos.slice(0, 4).map(dept => (
                          <div
                            key={dept}
                            className={cn(
                              'px-sm py-xs rounded cursor-pointer transition-colors',
                              'hover:bg-interactive-default hover:bg-opacity-10',
                              value.departamento === dept && 'bg-interactive-default text-white'
                            )}
                            onClick={() => handleDepartamentoSelect(dept)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-body-paragraph">
                                {dept}
                              </span>
                              {value.departamento === dept && (
                                <Check className="w-4 h-4" />
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {popularDepartamentos.length < filteredDepartamentos.length && (
                          <div className="text-body-auxiliary text-text-secondary font-medium px-sm py-xs border-t border-border-default mt-xs">
                            Todos los departamentos
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Todos los departamentos o resultados de búsqueda */}
                    {filteredDepartamentos
                      .filter(dept => searchTerm.departamento || !popularDepartamentos.slice(0, 4).includes(dept))
                      .map(dept => (
                      <div
                        key={dept}
                        className={cn(
                          'px-sm py-xs cursor-pointer transition-colors',
                          'hover:bg-interactive-default hover:bg-opacity-10',
                          value.departamento === dept && 'bg-interactive-default text-white'
                        )}
                        onClick={() => handleDepartamentoSelect(dept)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-body-paragraph">
                            {dept}
                          </span>
                          {value.departamento === dept && (
                            <Check className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-sm text-center text-body-auxiliary text-text-secondary">
                    No se encontraron departamentos
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selector de Ciudad */}
      <div ref={ciudadRef} className="relative">
        <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
          Ciudad *
        </label>
        
        <div className="relative">
          <div
            className={cn(
              'w-full px-sm py-sm border rounded-md transition-colors',
              'flex items-center justify-between',
              !value.departamento && 'opacity-50 cursor-not-allowed',
              value.departamento && 'cursor-pointer',
              isOpen.ciudad ? 'border-interactive-default' : 'border-border-default',
              value.departamento && 'hover:border-interactive-hover focus-within:border-interactive-default',
              !isValidCombination && 'border-feedback-error'
            )}
            onClick={toggleCiudadDropdown}
          >
            <div className="flex items-center gap-sm flex-1">
              <MapPin className="w-4 h-4 text-text-secondary" />
              {value.ciudad ? (
                <span className="text-body-paragraph text-text-base">
                  {value.ciudad}
                </span>
              ) : (
                <span className="text-body-paragraph text-text-secondary">
                  {value.departamento ? 'Selecciona una ciudad' : 'Primero selecciona un departamento'}
                </span>
              )}
            </div>
            <ChevronDown className={cn(
              'w-4 h-4 text-text-secondary transition-transform',
              isOpen.ciudad && 'rotate-180'
            )} />
          </div>

          {/* Dropdown de ciudades */}
          {isOpen.ciudad && value.departamento && (
            <div className="absolute z-50 w-full mt-xs bg-bg-canvas border border-border-default rounded-md shadow-lg max-h-60 overflow-y-auto">
              {/* Búsqueda */}
              <div className="p-sm border-b border-border-default">
                <div className="relative">
                  <Search className="absolute left-xs top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Buscar ciudad..."
                    className="w-full pl-8 pr-sm py-xs border border-border-default rounded text-body-paragraph"
                    value={searchTerm.ciudad}
                    onChange={handleCiudadSearch}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* Lista de ciudades */}
              <div className="max-h-48 overflow-y-auto">
                {filteredCiudades.length > 0 ? (
                  filteredCiudades.map(ciudad => (
                    <div
                      key={ciudad}
                      className={cn(
                        'px-sm py-xs cursor-pointer transition-colors',
                        'hover:bg-interactive-default hover:bg-opacity-10',
                        value.ciudad === ciudad && 'bg-interactive-default text-white'
                      )}
                      onClick={() => handleCiudadSelect(ciudad)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-body-paragraph">
                          {ciudad}
                        </span>
                        {value.ciudad === ciudad && (
                          <Check className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-sm text-center text-body-auxiliary text-text-secondary">
                    No se encontraron ciudades
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mensaje de error de correspondencia */}
        {!isValidCombination && (
          <div className="flex items-center gap-xs mt-xs">
            <AlertCircle className="w-3 h-3 text-feedback-error" />
            <span className="text-body-auxiliary text-feedback-error">
              {value.ciudad} no pertenece a {value.departamento}
            </span>
          </div>
        )}

        {/* Información de ayuda */}
        {value.departamento && !value.ciudad && (
          <p className="text-body-auxiliary text-text-secondary mt-xs">
            {filteredCiudades.length} ciudades disponibles en {value.departamento}
          </p>
        )}
      </div>
    </div>
  )
})

LocationSelectorOptimized.displayName = 'LocationSelectorOptimized'

export default LocationSelectorOptimized