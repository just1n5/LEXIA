// Hook para manejo de dependencia departamento-ciudad
import { useState, useCallback } from 'react';
import { getAllDepartamentos, getCiudadesByDepartamento } from '../services/solicitudes';

export const useDepartmentCities = () => {
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [selectedCiudad, setSelectedCiudad] = useState('');
  const [availableCiudades, setAvailableCiudades] = useState([]);

  const departamentos = getAllDepartamentos();

  const handleDepartamentoChange = useCallback((departamentoValue) => {
    setSelectedDepartamento(departamentoValue);
    setSelectedCiudad(''); // Reset ciudad
    
    const ciudades = getCiudadesByDepartamento(departamentoValue);
    setAvailableCiudades(ciudades);
  }, []);

  const handleCiudadChange = useCallback((ciudadValue) => {
    setSelectedCiudad(ciudadValue);
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedDepartamento('');
    setSelectedCiudad('');
    setAvailableCiudades([]);
  }, []);

  return {
    departamentos,
    selectedDepartamento,
    selectedCiudad,
    availableCiudades,
    handleDepartamentoChange,
    handleCiudadChange,
    resetSelection
  };
};
