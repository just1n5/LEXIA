import { useState, useCallback } from 'react';

/**
 * Hook para manejar el estado de la carga masiva con persistencia
 * Permite recuperar el progreso en caso de recargar la página
 */
export const useBulkUploadState = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [validationResults, setValidationResults] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const STORAGE_KEY = 'bulk_upload_state';

  /**
   * Persiste el estado actual en localStorage
   */
  const persistState = useCallback(() => {
    try {
      const stateToSave = {
        uploadStatus,
        validationResults,
        previewData,
        timestamp: Date.now(),
        fileInfo: uploadedFile ? {
          name: uploadedFile.name,
          size: uploadedFile.size,
          type: uploadedFile.type,
          lastModified: uploadedFile.lastModified
        } : null
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('No se pudo guardar el estado:', error);
    }
  }, [uploadStatus, validationResults, previewData, uploadedFile]);

  /**
   * Restaura el estado desde localStorage
   */
  const restoreState = useCallback(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (!savedState) return;

      const state = JSON.parse(savedState);
      
      // Verificar que el estado no sea muy antiguo (máximo 1 hora)
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - state.timestamp > oneHour) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      // Restaurar estado (excepto el archivo físico por seguridad)
      if (state.uploadStatus === 'success' && state.validationResults) {
        setUploadStatus('success');
        setValidationResults(state.validationResults);
        setPreviewData(state.previewData);
        
        // Crear un objeto file mock para mostrar info, pero sin contenido
        if (state.fileInfo) {
          const mockFile = {
            name: state.fileInfo.name,
            size: state.fileInfo.size,
            type: state.fileInfo.type,
            lastModified: state.fileInfo.lastModified,
            _isRestored: true // Flag para indicar que es un archivo restaurado
          };
          setUploadedFile(mockFile);
        }
      }
    } catch (error) {
      console.warn('Error restaurando estado:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  /**
   * Limpia el estado actual y localStorage
   */
  const clearState = useCallback(() => {
    setUploadedFile(null);
    setUploadStatus('idle');
    setValidationResults(null);
    setPreviewData(null);
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Error limpiando localStorage:', error);
    }
  }, []);

  /**
   * Actualiza el archivo subido
   */
  const handleSetUploadedFile = useCallback((file) => {
    setUploadedFile(file);
  }, []);

  /**
   * Actualiza el estado de upload
   */
  const handleSetUploadStatus = useCallback((status) => {
    setUploadStatus(status);
  }, []);

  /**
   * Actualiza los resultados de validación
   */
  const handleSetValidationResults = useCallback((results) => {
    setValidationResults(results);
  }, []);

  /**
   * Actualiza los datos de preview
   */
  const handleSetPreviewData = useCallback((data) => {
    setPreviewData(data);
  }, []);

  /**
   * Verifica si hay un archivo válido cargado
   */
  const hasValidFile = uploadedFile && uploadStatus === 'success' && validationResults;

  /**
   * Obtiene estadísticas del archivo actual
   */
  const getFileStats = useCallback(() => {
    if (!validationResults) return null;

    return {
      totalRows: validationResults.totalRows || 0,
      validRows: validationResults.validRows || 0,
      invalidRows: validationResults.invalidRows || 0,
      duplicates: validationResults.duplicates || 0,
      successRate: validationResults.totalRows > 0 
        ? Math.round((validationResults.validRows / validationResults.totalRows) * 100)
        : 0
    };
  }, [validationResults]);

  /**
   * Verifica si el estado actual puede proceder al siguiente paso
   */
  const canProceed = uploadStatus === 'success' && 
                     validationResults && 
                     validationResults.validRows > 0;

  return {
    // Estado
    uploadedFile,
    uploadStatus,
    validationResults,
    previewData,
    hasValidFile,
    canProceed,

    // Setters
    setUploadedFile: handleSetUploadedFile,
    setUploadStatus: handleSetUploadStatus,
    setValidationResults: handleSetValidationResults,
    setPreviewData: handleSetPreviewData,

    // Utilidades
    persistState,
    restoreState,
    clearState,
    getFileStats
  };
};