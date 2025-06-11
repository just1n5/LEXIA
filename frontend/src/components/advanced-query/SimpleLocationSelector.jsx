// src/components/advanced-query/SimpleLocationSelector.jsx
import React, { useState } from 'react'
import { MapPin, Building, ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * 🗺️ SimpleLocationSelector - Versión ultra-simplificada
 * 
 * Versión de respaldo sin funcionalidades avanzadas pero sin bucles infinitos.
 */
const SimpleLocationSelector = ({ 
  value = { departamento: '', ciudad: '' },
  onChange,
  className = '',
  ...props 
}) => {
  // Departamentos principales
  const departamentos = [
    'Bogotá D.C.',
    'Antioquia',
    'Valle del Cauca',
    'Atlántico',
    'Santander',
    'Cundinamarca',
    'Bolívar',
    'Norte de Santander',
    'Tolima',
    'Meta',
    'Caldas',
    'Risaralda',
    'Quindío',
    'Huila',
    'Nariño',
    'Cauca',
    'Córdoba',
    'Magdalena',
    'La Guajira',
    'Cesar',
    'Sucre',
    'Boyacá',
    'Casanare',
    'Chocó',
    'Caquetá',
    'Putumayo',
    'Arauca',
    'Amazonas',
    'Guainía',
    'Guaviare',
    'Vaupés',
    'Vichada',
    'San Andrés y Providencia'
  ]

  // Ciudades por departamento (principales)
  const ciudadesPorDepartamento = {
    'Bogotá D.C.': ['Bogotá'],
    'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Apartadó', 'Turbo', 'Rionegro', 'Sabaneta'],
    'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Cartago', 'Buga', 'Tuluá', 'Jamundí'],
    'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanagrande', 'Puerto Colombia'],
    'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja'],
    'Cundinamarca': ['Soacha', 'Girardot', 'Zipaquirá', 'Facatativá', 'Chía', 'Mosquera', 'Fusagasugá'],
    'Bolívar': ['Cartagena', 'Magangué', 'Turbaco', 'Arjona', 'El Carmen de Bolívar'],
    'Norte de Santander': ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario'],
    'Tolima': ['Ibagué', 'Espinal', 'Melgar', 'Honda', 'Chaparral'],
    'Meta': ['Villavicencio', 'Acacías', 'Granada', 'San Martín', 'Puerto López'],
    'Caldas': ['Manizales', 'Villamaría', 'Chinchiná', 'Palestina', 'La Dorada'],
    'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia'],
    'Quindío': ['Armenia', 'Calarcá', 'La Tebaida', 'Montenegro', 'Quimbaya'],
    'Huila': ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre'],
    'Nariño': ['Pasto', 'Ipiales', 'Tumaco', 'La Cruz', 'Samaniego'],
    'Cauca': ['Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'Guapi'],
    'Córdoba': ['Montería', 'Lorica', 'Cereté', 'Sahagún', 'Planeta Rica'],
    'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación', 'El Banco'],
    'La Guajira': ['Riohacha', 'Maicao', 'San Juan del Cesar', 'Villanueva'],
    'Cesar': ['Valledupar', 'Aguachica', 'Bosconia', 'Codazzi', 'La Paz'],
    'Sucre': ['Sincelejo', 'Corozal', 'Sampués', 'Tolú'],
    'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa'],
    'Casanare': ['Yopal', 'Aguazul', 'Villanueva', 'Tauramena', 'Monterrey'],
    'Chocó': ['Quibdó', 'Istmina', 'Condoto', 'Tadó', 'Acandí'],
    'Caquetá': ['Florencia', 'San Vicente del Caguán', 'El Paujil', 'La Montañita'],
    'Putumayo': ['Mocoa', 'Puerto Asís', 'Orito', 'Sibundoy'],
    'Arauca': ['Arauca', 'Arauquita', 'Cravo Norte', 'Fortul'],
    'Amazonas': ['Leticia', 'Puerto Nariño'],
    'Guainía': ['Inírida'],
    'Guaviare': ['San José del Guaviare'],
    'Vaupés': ['Mitú'],
    'Vichada': ['Puerto Carreño'],
    'San Andrés y Providencia': ['San Andrés', 'Providencia']
  }

  const handleDepartamentoChange = (e) => {
    const departamento = e.target.value
    onChange?.({ departamento, ciudad: '' })
  }

  const handleCiudadChange = (e) => {
    const ciudad = e.target.value
    onChange?.({ departamento: value.departamento, ciudad })
  }

  const ciudadesDisponibles = ciudadesPorDepartamento[value.departamento] || []

  return (
    <div className={cn('space-y-md', className)} {...props}>
      {/* Selector de Departamento */}
      <div>
        <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
          Departamento *
        </label>
        <div className="relative">
          <Building className="absolute left-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <select
            value={value.departamento}
            onChange={handleDepartamentoChange}
            className={cn(
              'w-full pl-10 pr-8 py-sm border rounded-md transition-colors appearance-none',
              'border-border-default focus:border-interactive-default focus:outline-none',
              'text-body-paragraph bg-bg-canvas text-text-base'
            )}
          >
            <option value="">Selecciona un departamento</option>
            {departamentos.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
      </div>

      {/* Selector de Ciudad */}
      <div>
        <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
          Ciudad *
        </label>
        <div className="relative">
          <MapPin className="absolute left-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <select
            value={value.ciudad}
            onChange={handleCiudadChange}
            disabled={!value.departamento}
            className={cn(
              'w-full pl-10 pr-8 py-sm border rounded-md transition-colors appearance-none',
              'border-border-default focus:border-interactive-default focus:outline-none',
              'text-body-paragraph bg-bg-canvas text-text-base',
              !value.departamento && 'opacity-50 cursor-not-allowed'
            )}
          >
            <option value="">
              {value.departamento ? 'Selecciona una ciudad' : 'Primero selecciona un departamento'}
            </option>
            {ciudadesDisponibles.map(ciudad => (
              <option key={ciudad} value={ciudad}>
                {ciudad}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-sm top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
        
        {value.departamento && !value.ciudad && (
          <p className="text-body-auxiliary text-text-secondary mt-xs">
            {ciudadesDisponibles.length} ciudades disponibles en {value.departamento}
          </p>
        )}
      </div>
    </div>
  )
}

SimpleLocationSelector.displayName = 'SimpleLocationSelector'

export default SimpleLocationSelector