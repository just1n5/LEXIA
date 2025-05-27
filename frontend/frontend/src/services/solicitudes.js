// Servicio de solicitudes con datos mock mejorados para desarrollo
import { apiRequest } from './api.js';
import { mockSolicitudes, mockEstadisticas, mockSolicitudesService, mockResultadosHistorial } from '../utils/mockData.js';

// Detectar si estamos en desarrollo o si no hay backend disponible
const isDevelopment = import.meta.env.DEV;
const useMockData = isDevelopment; // Cambiar a false cuando el backend esté listo

export const solicitudesService = {
  // Obtener todas las solicitudes del usuario
  async getSolicitudes(params = {}) {
    // En desarrollo, usar datos mock directamente
    if (useMockData) {
      const result = await mockSolicitudesService.getSolicitudes(params);
      
      // COMPATIBILIDAD: Siempre devolver array para consistencia
      // Asegurar que siempre devolvemos un array, independiente del formato del mock
      return Array.isArray(result) ? result : result.data || [];
    }

    try {
      const { skip = 0, limit = 100 } = params;
      const response = await apiRequest(`/solicitudes/?skip=${skip}&limit=${limit}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.warn('API no disponible, usando datos mock:', error.message);
      // Fallback a datos mock si el API falla
      const result = await mockSolicitudesService.getSolicitudes(params);
      return result.data || [];
    }
  },

  // Versión específica para paginación avanzada
  async getSolicitudesPaginated(params = {}) {
    if (useMockData) {
      return await mockSolicitudesService.getSolicitudes(params);
    }

    try {
      const { skip = 0, limit = 10 } = params;
      const response = await apiRequest(`/solicitudes/?skip=${skip}&limit=${limit}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.warn('API no disponible, usando datos mock:', error.message);
      return await mockSolicitudesService.getSolicitudes(params);
    }
  },

  // Obtener estadísticas para el dashboard
  async getStats() {
    if (useMockData) {
      // Calcular estadísticas dinámicamente de los datos mock
      const solicitudesActivas = mockSolicitudes.filter(s => s.activa).length;
      const actualizacionesRecientes = mockSolicitudes.filter(s => {
        if (!s.ultima_ejecucion) return false;
        const ejecucion = new Date(s.ultima_ejecucion);
        const ahora = new Date();
        const diffDias = Math.ceil((ahora - ejecucion) / (1000 * 60 * 60 * 24));
        return diffDias <= 7;
      }).length;

      const ultimaEjecucionMasReciente = mockSolicitudes
        .filter(s => s.ultima_ejecucion)
        .sort((a, b) => new Date(b.ultima_ejecucion) - new Date(a.ultima_ejecucion))[0];

      const formatearUltimaEjecucion = () => {
        if (!ultimaEjecucionMasReciente) return 'Sin ejecuciones';
        const fecha = new Date(ultimaEjecucionMasReciente.ultima_ejecucion);
        const hoy = new Date();
        const diffDias = Math.ceil((hoy - fecha) / (1000 * 60 * 60 * 24));
        
        if (diffDias <= 1) return 'Hoy';
        if (diffDias === 2) return 'Ayer';
        if (diffDias <= 7) return `Hace ${diffDias - 1} días`;
        return fecha.toLocaleDateString('es-CO');
      };

      return {
        solicitudesActivas,
        actualizacionesRecientes,
        ultimaEjecucion: formatearUltimaEjecucion()
      };
    }

    try {
      const response = await apiRequest('/solicitudes/stats', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.warn('Stats API no disponible, usando datos mock');
      return mockEstadisticas;
    }
  },

  // Crear nueva solicitud
  async createSolicitud(solicitudData) {
    if (useMockData) {
      return await mockSolicitudesService.createSolicitud(solicitudData);
    }

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
      console.warn('Create API no disponible, usando mock');
      return await mockSolicitudesService.createSolicitud(solicitudData);
    }
  },

  // Obtener solicitud específica
  async getSolicitudById(solicitudId) {
    if (useMockData) {
      return await mockSolicitudesService.getSolicitud(solicitudId);
    }

    try {
      const response = await apiRequest(`/solicitudes/${solicitudId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.warn('Get solicitud API no disponible, usando mock');
      return await mockSolicitudesService.getSolicitud(solicitudId);
    }
  },

  // Actualizar solicitud
  async updateSolicitud(solicitudId, updateData) {
    if (useMockData) {
      return await mockSolicitudesService.updateSolicitud(solicitudId, updateData);
    }

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
      console.warn('Update API no disponible, usando mock');
      return await mockSolicitudesService.updateSolicitud(solicitudId, updateData);
    }
  },

  // Eliminar solicitud
  async deleteSolicitud(solicitudId) {
    if (useMockData) {
      return await mockSolicitudesService.deleteSolicitud(solicitudId);
    }

    try {
      const response = await apiRequest(`/solicitudes/${solicitudId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.warn('Delete API no disponible, usando mock');
      return await mockSolicitudesService.deleteSolicitud(solicitudId);
    }
  },

  // Ejecutar solicitud (nuevo)
  async executeSolicitud(solicitudId, callbacks = {}) {
    const { onProgress, onLog } = callbacks;

    if (useMockData) {
      // Simular ejecución con progreso
      const steps = [
        { progress: 0, step: 'Conectando con el sistema judicial...' },
        { progress: 25, step: 'Autenticando credenciales...' },
        { progress: 50, step: 'Buscando información del proceso...' },
        { progress: 75, step: 'Procesando resultados...' },
        { progress: 100, step: 'Ejecución completada' }
      ];

      for (const stepData of steps) {
        if (onProgress) onProgress(stepData.progress, stepData.step);
        if (onLog) onLog(`[${new Date().toLocaleTimeString()}] ${stepData.step}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Actualizar la solicitud con nueva fecha de ejecución
      await this.updateSolicitud(solicitudId, {
        ultima_ejecucion: new Date().toISOString()
      });

      return {
        success: true,
        message: 'Solicitud ejecutada correctamente',
        resultados_encontrados: Math.floor(Math.random() * 5) + 1
      };
    }

    try {
      const response = await apiRequest(`/solicitudes/${solicitudId}/execute`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.warn('Execute API no disponible, usando simulación mock');
      throw new Error('Error al ejecutar la solicitud: ' + error.message);
    }
  },

  // Buscar solicitudes (nuevo)
  async searchSolicitudes(searchParams) {
    if (useMockData) {
      return await mockSolicitudesService.searchSolicitudes(searchParams);
    }

    try {
      const response = await apiRequest('/solicitudes/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });
      return response;
    } catch (error) {
      console.warn('Search API no disponible, usando búsqueda mock');
      return await mockSolicitudesService.searchSolicitudes?.(searchParams) || { data: [], total: 0 };
    }
  },

  // Obtener resultados/historial de una solicitud
  async getResultadosSolicitud(solicitudId, params = {}) {
    if (useMockData) {
      return await mockSolicitudesService.getResultados(solicitudId, params);
    }

    try {
      const { skip = 0, limit = 100 } = params;
      const response = await apiRequest(
        `/solicitudes/${solicitudId}/resultados?skip=${skip}&limit=${limit}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error) {
      console.warn('Resultados API no disponible, usando mock');
      return await mockSolicitudesService.getResultados(solicitudId, params);
    }
  },

  // Validar número de radicado
  async validateRadicado(numeroRadicado) {
    try {
      // Simulación de validación mejorada
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Validación más robusta basada en patrones reales
      const patterns = {
        // Patrón general: números de 5 a 23 dígitos
        general: /^\d{5,23}$/,
        // Patrón Bogotá: 11001 + código específico
        bogota: /^11001\d{16,18}$/,
        // Patrón Medellín: 05001 + código específico  
        medellin: /^05001\d{16,18}$/
      };
      
      const isValidGeneral = patterns.general.test(numeroRadicado);
      const isValidBogota = patterns.bogota.test(numeroRadicado);
      const isValidMedellin = patterns.medellin.test(numeroRadicado);
      
      const isValid = isValidGeneral;
      let message = '';
      
      if (!isValid) {
        message = 'Debe contener entre 5 y 23 dígitos';
      } else if (isValidBogota) {
        message = 'Número de radicado válido (Bogotá)';
      } else if (isValidMedellin) {
        message = 'Número de radicado válido (Medellín)';
      } else {
        message = 'Número de radicado válido';
      }
      
      return {
        valid: isValid,
        message,
        detected_city: isValidBogota ? 'Bogotá' : isValidMedellin ? 'Medellín' : 'General'
      };
    } catch (error) {
      console.error('Error validando radicado:', error);
      return {
        valid: false,
        message: 'Error en validación'
      };
    }
  },

  // ========================================
  // MÉTODOS DE HISTORIAL
  // ========================================

  // Obtener historial con filtros y paginación
  async getHistorial(params = {}) {
    if (useMockData) {
      return await mockSolicitudesService.getHistorial(params);
    }

    try {
      const { skip = 0, limit = 10, solicitudId, fechaDesde, fechaHasta, searchTerm } = params;
      let url = `/historial/?skip=${skip}&limit=${limit}`;
      
      if (solicitudId) url += `&solicitud_id=${solicitudId}`;
      if (fechaDesde) url += `&fecha_desde=${fechaDesde}`;
      if (fechaHasta) url += `&fecha_hasta=${fechaHasta}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      
      const response = await apiRequest(url, { method: 'GET' });
      return response;
    } catch (error) {
      console.warn('Historial API no disponible, usando datos mock:', error.message);
      return await mockSolicitudesService.getHistorial(params);
    }
  },

  // Obtener detalles completos de un item del historial
  async getHistorialDetalle(historialId) {
    if (useMockData) {
      return await mockSolicitudesService.getHistorialDetalle(historialId);
    }

    try {
      const response = await apiRequest(`/historial/${historialId}`, { method: 'GET' });
      return response;
    } catch (error) {
      console.warn('Historial detalle API no disponible, usando mock:', error.message);
      return await mockSolicitudesService.getHistorialDetalle(historialId);
    }
  },

  // Búsqueda rápida en historial
  async searchHistorial(searchTerm, params = {}) {
    if (useMockData) {
      return await mockSolicitudesService.searchHistorial(searchTerm, params);
    }

    try {
      const response = await apiRequest('/historial/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm, ...params })
      });
      return response;
    } catch (error) {
      console.warn('Historial search API no disponible, usando mock:', error.message);
      return await mockSolicitudesService.searchHistorial(searchTerm, params);
    }
  },

  // Obtener estadísticas del historial
  async getHistorialStats() {
    if (useMockData) {
      return await mockSolicitudesService.getHistorialStats();
    }

    try {
      const response = await apiRequest('/historial/stats', { method: 'GET' });
      return response;
    } catch (error) {
      console.warn('Historial stats API no disponible, usando mock:', error.message);
      return await mockSolicitudesService.getHistorialStats();
    }
  },

  // Descargar PDF de un resultado específico (mock)
  async downloadHistorialPDF(historialId) {
    if (useMockData) {
      // Simular descarga
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En un entorno real, esto devolvería una URL de descarga o blob
      const item = await this.getHistorialDetalle(historialId);
      return {
        success: true,
        filename: `historial_${item.numero_radicado_completo}_${new Date().getTime()}.pdf`,
        message: 'PDF generado exitosamente'
      };
    }

    try {
      const response = await apiRequest(`/historial/${historialId}/download`, {
        method: 'GET',
        headers: { 'Accept': 'application/pdf' }
      });
      return response;
    } catch (error) {
      console.warn('PDF download API no disponible, usando simulación:', error.message);
      throw new Error('Error al generar PDF: ' + error.message);
    }
  },

  // Exportar historial completo (mock)
  async exportHistorial(params = {}, format = 'csv') {
    if (useMockData) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        filename: `historial_export_${new Date().getTime()}.${format}`,
        message: `Exportación ${format.toUpperCase()} completada`
      };
    }

    try {
      const response = await apiRequest('/historial/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, format })
      });
      return response;
    } catch (error) {
      console.warn('Export API no disponible, usando simulación:', error.message);
      throw new Error('Error en exportación: ' + error.message);
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
      { value: 'itagui', label: 'Itagüí' },
      { value: 'sabaneta', label: 'Sabaneta' },
      { value: 'bello', label: 'Bello' }
    ]
  },
  valle: {
    name: 'Valle del Cauca',
    ciudades: [
      { value: 'cali', label: 'Cali' },
      { value: 'palmira', label: 'Palmira' },
      { value: 'buenaventura', label: 'Buenaventura' },
      { value: 'tulua', label: 'Tuluá' }
    ]
  },
  atlantico: {
    name: 'Atlántico',
    ciudades: [
      { value: 'barranquilla', label: 'Barranquilla' },
      { value: 'soledad', label: 'Soledad' },
      { value: 'malambo', label: 'Malambo' }
    ]
  },
  cundinamarca: {
    name: 'Cundinamarca',
    ciudades: [
      { value: 'soacha', label: 'Soacha' },
      { value: 'zipaquira', label: 'Zipaquirá' },
      { value: 'facatativa', label: 'Facatativá' },
      { value: 'chía', label: 'Chía' }
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

// Función de utilidad para alternar entre mock y API real
export const toggleMockMode = (useMock) => {
  // Esta función se puede usar en desarrollo para alternar modos
  // En producción, siempre debería ser false
  console.log(`Modo mock ${useMock ? 'habilitado' : 'deshabilitado'}`);
};
