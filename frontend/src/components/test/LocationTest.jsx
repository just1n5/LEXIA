import React, { useState } from 'react';
import SelectField from '../ui/SelectField';
import { departamentos, getCiudadesByDepartamento, getDepartamentoById, getCiudadById } from '../../data/colombiaLocations';

/**
 * 🧪 LocationTest - Test de dropdowns de departamento y ciudad
 */
const LocationTest = () => {
  const [departamentoId, setDepartamentoId] = useState('');
  const [ciudadId, setCiudadId] = useState('');

  const handleDepartamentoChange = (newDepartamentoId) => {
    setDepartamentoId(newDepartamentoId);
    setCiudadId(''); // Reset ciudad cuando cambia departamento
  };

  const ciudadesDisponibles = departamentoId ? getCiudadesByDepartamento(departamentoId) : [];

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-lg">
      
      <h3 className="text-lg font-bold mb-4">🧪 Test de Dropdowns de Ubicación</h3>

      <div className="space-y-4">
        
        {/* Departamento */}
        <SelectField
          label="Departamento"
          value={departamentoId}
          onChange={handleDepartamentoChange}
          options={departamentos}
          placeholder="Seleccionar departamento"
        />

        {/* Ciudad */}
        <SelectField
          label="Ciudad"
          value={ciudadId}
          onChange={setCiudadId}
          options={ciudadesDisponibles}
          placeholder={departamentoId ? "Seleccionar ciudad" : "Primero selecciona un departamento"}
          disabled={!departamentoId}
        />

        {/* Debug info */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Departamento ID: <code>{departamentoId || 'none'}</code></p>
          <p>Departamento: <code>{departamentoId ? getDepartamentoById(departamentoId)?.nombre : 'none'}</code></p>
          <p>Ciudad ID: <code>{ciudadId || 'none'}</code></p>
          <p>Ciudad: <code>{ciudadId ? getCiudadById(departamentoId, ciudadId)?.nombre : 'none'}</code></p>
          <p>Ciudades disponibles: <code>{ciudadesDisponibles.length}</code></p>
        </div>

      </div>

    </div>
  );
};

export default LocationTest;