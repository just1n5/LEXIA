// Hook para gestión de solicitudes CRUD
import { useState, useCallback } from 'react';
import { solicitudesService } from '../services/solicitudes';

export const useSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSolicitudes = useCallback(async (skip = 0, limit = 100) => {
    setLoading(true);
    setError(null);
    try {
      const response = await solicitudesService.getSolicitudes(skip, limit);
      setSolicitudes(response);
      return response;
    } catch (err) {
      setError(err.message || 'Error cargando solicitudes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSolicitud = useCallback(async (solicitudData) => {
    setLoading(true);
    setError(null);
    try {
      const newSolicitud = await solicitudesService.createSolicitud(solicitudData);
      setSolicitudes(prev => [newSolicitud, ...prev]);
      return newSolicitud;
    } catch (err) {
      setError(err.message || 'Error creando solicitud');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSolicitud = useCallback(async (solicitudId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSolicitud = await solicitudesService.updateSolicitud(solicitudId, updateData);
      setSolicitudes(prev => 
        prev.map(s => s.id === solicitudId ? updatedSolicitud : s)
      );
      return updatedSolicitud;
    } catch (err) {
      setError(err.message || 'Error actualizando solicitud');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSolicitud = useCallback(async (solicitudId) => {
    setLoading(true);
    setError(null);
    try {
      await solicitudesService.deleteSolicitud(solicitudId);
      setSolicitudes(prev => prev.filter(s => s.id !== solicitudId));
    } catch (err) {
      setError(err.message || 'Error eliminando solicitud');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    solicitudes,
    loading,
    error,
    fetchSolicitudes,
    createSolicitud,
    updateSolicitud,
    deleteSolicitud
  };
};
