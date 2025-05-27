// Servicio API para gestión de solicitudes
import { apiRequest } from './api';

export const solicitudesService = {
  // Obtener todas las solicitudes del usuario
  async getSolicitudes(skip = 0, limit = 100) {
    try {
      const response = await apiRequest(`/solicitudes/?skip=${skip}&limit=${limit}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Error obteniendo solicitudes:', error);
      throw error;
    }
  },

  // Crear nueva solicitud
  async createSolicitud(solicitudData) {
    try {
      const response = await apiRequest('/solicitudes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solicitudData),
      });
      return response;
    } catch (error) {
      console.error('Error creando solicitud:', error);
      throw error;
    }
  },

  // Obtener solicitud específica
  async getSolicitud(solicitudId) {
    try {
      const response = await apiRequest(`/solicitudes/${solicitudId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Error obteniendo solicitud:', error);
      throw error;
    }
  },

  // Actualizar solicitud
  async updateSolicitud(solicitudId, updateData) {
    try {
      const response = await apiRequest(`/solicitudes/${solicitudId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      return response;
    } catch (error) {
      console.error('Error actualizando solicitud:', error);
      throw error;
    }
  },

  // Eliminar solicitud
  async deleteSolicitud(solicitudId) {
    try {
      const response = await apiRequest(`/solicitudes/${solicitudId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Error eliminando solicitud:', error);
      throw error;
    }
  },

  // Obtener resultados/historial de una solicitud
  async getResultadosSolicitud(solicitudId, skip = 0, limit = 100) {
    try {
      const response = await apiRequest(
        `/solicitudes/${solicitudId}/resultados?skip=${skip}&limit=${limit}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo resultados:', error);
      throw error;
    }
  },

  // Validar número de radicado
  async validateRadicado(numeroRadicado) {
    try {
      // Simulación de validación - en producción sería un endpoint real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Patrón de validación del prototipo
      const pattern = /^\d{4}-[A-Z]{2}-\d{6}$/;
      const isValid = pattern.test(numeroRadicado);
      
      return {
        valid: isValid,
        message: isValid 
          ? 'Número de radicado válido' 
          : 'Formato inválido. Debe ser: AAAA-LL-NNNNNN'
      };
    } catch (error) {
      console.error('Error validando radicado:', error);
      throw error;
    }
  }
};

// Datos mock para departamentos y ciudades
export const departamentosData = {
  bogota: {
    name: 'Bogotá D.C.',
    ciudades: [
      { value: 'bogota', label: 'Bogotá' }
    ]
  },
  antioquia: {
    name: 'Antioquia', 
    ciudades: [
      { value: 'medellin', label: 'Medellín' },
      { value: 'envigado', label: 'Envigado' },
      { value: 'itagui', label: 'Itagüí' }
    ]
  },
  valle: {
    name: 'Valle del Cauca',
    ciudades: [
      { value: 'cali', label: 'Cali' },
      { value: 'palmira', label: 'Palmira' },
      { value: 'buenaventura', label: 'Buenaventura' }
    ]
  },
  atlantico: {
    name: 'Atlántico',
    ciudades: [
      { value: 'barranquilla', label: 'Barranquilla' },
      { value: 'soledad', label: 'Soledad' }
    ]
  }
};

export const getAllDepartamentos = () => {
  return Object.entries(departamentosData).map(([value, data]) => ({
    value,
    label: data.name
  }));
};

export const getCiudadesByDepartamento = (departamento) => {
  return departamentosData[departamento]?.ciudades || [];
};
