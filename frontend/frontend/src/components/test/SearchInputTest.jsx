import React, { useState } from 'react'
import SearchInput from '../ui/SearchInput'

/**
 * Componente de prueba para verificar el funcionamiento del SearchInput
 * Incluye múltiples variantes y casos de uso
 */
const SearchInputTest = () => {
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Simular búsqueda con datos de prueba
  const mockData = [
    'Juan Pérez González',
    'María Elena Rodríguez',
    'Carlos Alberto Mendoza',
    'Ana Isabel García',
    'Roberto Luis Fernández',
    'Patricia Carmen Díaz',
    'Fernando José Herrera',
    'Lucía Esperanza Torres'
  ]

  const handleSearch = (query) => {
    console.log('Buscando:', query)
    setSearchValue(query)
    
    if (!query.trim()) {
      setResults([])
      return
    }

    // Simular loading
    setIsLoading(true)
    
    // Simular delay de API
    setTimeout(() => {
      const filtered = mockData.filter(item => 
        item.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setIsLoading(false)
    }, 500)
  }

  const handleClear = () => {
    console.log('Búsqueda limpiada')
    setResults([])
    setSearchValue('')
  }

  return (
    <div className="p-xl space-y-xl max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-heading-h1 font-heading text-text-primary mb-md">
          🔍 Test SearchInput Component
        </h1>
        <p className="text-body-paragraph text-text-secondary">
          Prueba todas las variantes y funcionalidades del componente SearchInput
        </p>
      </div>

      {/* Búsqueda Principal */}
      <div className="space-y-lg">
        <div>
          <h2 className="text-heading-h2 font-heading text-text-primary mb-md">
            Búsqueda Principal
          </h2>
          <SearchInput
            placeholder="Buscar personas por nombre..."
            onSearch={handleSearch}
            onClear={handleClear}
            value={searchValue}
            loading={isLoading}
            debounceMs={300}
            size="md"
            variant="default"
          />
          
          {/* Resultados */}
          {searchValue && (
            <div className="mt-md">
              <p className="text-body-auxiliary text-text-secondary mb-sm">
                {isLoading ? 'Buscando...' : `${results.length} resultados encontrados`}
              </p>
              
              {results.length > 0 && (
                <div className="space-y-sm">
                  {results.map((result, index) => (
                    <div 
                      key={index}
                      className="p-md bg-bg-light rounded-md border border-border-default hover:bg-interactive-default/10 transition-default cursor-pointer"
                    >
                      <span className="text-body-paragraph text-text-primary">
                        {result}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {results.length === 0 && !isLoading && (
                <div className="text-center p-xl text-text-secondary">
                  <p>No se encontraron resultados para "{searchValue}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Variants Testing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
        {/* Tamaños */}
        <div className="space-y-lg">
          <h3 className="text-heading-h3 font-heading text-text-primary">
            Diferentes Tamaños
          </h3>
          
          <div className="space-y-md">
            <div>
              <label className="block text-body-auxiliary text-text-secondary mb-sm">
                Pequeño (sm)
              </label>
              <SearchInput
                placeholder="Búsqueda pequeña..."
                size="sm"
                onSearch={(q) => console.log('Small search:', q)}
              />
            </div>
            
            <div>
              <label className="block text-body-auxiliary text-text-secondary mb-sm">
                Mediano (md) - Por defecto
              </label>
              <SearchInput
                placeholder="Búsqueda mediana..."
                size="md"
                onSearch={(q) => console.log('Medium search:', q)}
              />
            </div>
            
            <div>
              <label className="block text-body-auxiliary text-text-secondary mb-sm">
                Grande (lg)
              </label>
              <SearchInput
                placeholder="Búsqueda grande..."
                size="lg"
                onSearch={(q) => console.log('Large search:', q)}
              />
            </div>
          </div>
        </div>

        {/* Variantes */}
        <div className="space-y-lg">
          <h3 className="text-heading-h3 font-heading text-text-primary">
            Diferentes Variantes
          </h3>
          
          <div className="space-y-md">
            <div>
              <label className="block text-body-auxiliary text-text-secondary mb-sm">
                Default
              </label>
              <SearchInput
                placeholder="Variante por defecto..."
                variant="default"
                onSearch={(q) => console.log('Default variant:', q)}
              />
            </div>
            
            <div>
              <label className="block text-body-auxiliary text-text-secondary mb-sm">
                Filled
              </label>
              <SearchInput
                placeholder="Variante filled..."
                variant="filled"
                onSearch={(q) => console.log('Filled variant:', q)}
              />
            </div>
            
            <div>
              <label className="block text-body-auxiliary text-text-secondary mb-sm">
                Deshabilitado
              </label>
              <SearchInput
                placeholder="Campo deshabilitado..."
                disabled={true}
                value="Texto no editable"
                onSearch={(q) => console.log('Disabled search:', q)}
              />
            </div>
            
            <div>
              <label className="block text-body-auxiliary text-text-secondary mb-sm">
                Con Loading
              </label>
              <SearchInput
                placeholder="Cargando resultados..."
                loading={true}
                value="Búsqueda en progreso"
                onSearch={(q) => console.log('Loading search:', q)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Estados y Funcionalidades */}
      <div className="space-y-lg">
        <h3 className="text-heading-h3 font-heading text-text-primary">
          Casos de Uso Especiales
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div>
            <label className="block text-body-auxiliary text-text-secondary mb-sm">
              Sin botón de limpiar
            </label>
            <SearchInput
              placeholder="Sin botón X..."
              showClearButton={false}
              onSearch={(q) => console.log('No clear button:', q)}
            />
          </div>
          
          <div>
            <label className="block text-body-auxiliary text-text-secondary mb-sm">
              Ancho automático
            </label>
            <SearchInput
              placeholder="Ancho auto..."
              fullWidth={false}
              className="w-64"
              onSearch={(q) => console.log('Auto width:', q)}
            />
          </div>
          
          <div>
            <label className="block text-body-auxiliary text-text-secondary mb-sm">
              Debounce rápido (100ms)
            </label>
            <SearchInput
              placeholder="Respuesta rápida..."
              debounceMs={100}
              onSearch={(q) => console.log('Fast debounce:', q)}
            />
          </div>
          
          <div>
            <label className="block text-body-auxiliary text-text-secondary mb-sm">
              Debounce lento (1000ms)
            </label>
            <SearchInput
              placeholder="Respuesta lenta..."
              debounceMs={1000}
              onSearch={(q) => console.log('Slow debounce:', q)}
            />
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-bg-light p-lg rounded-lg border border-border-default">
        <h4 className="text-heading-h4 font-heading text-text-primary mb-md">
          Debug Info
        </h4>
        <div className="text-body-auxiliary text-text-secondary space-y-sm">
          <p><strong>Valor actual:</strong> "{searchValue}"</p>
          <p><strong>Resultados:</strong> {results.length}</p>
          <p><strong>Loading:</strong> {isLoading ? 'Sí' : 'No'}</p>
          <p><strong>Consola:</strong> Revisa la consola del navegador para ver los logs de búsqueda</p>
        </div>
      </div>
    </div>
  )
}

export default SearchInputTest