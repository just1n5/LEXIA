import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

/**
 * Hook para procesamiento real de archivos Excel
 * Maneja la lectura, parsing y validación de archivos .xlsx y .xls
 */
export const useExcelProcessor = () => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState(null);

  /**
   * Valida un número de radicado colombiano
   * Formato esperado: 23 dígitos (ej: 11001310300120240001234)
   */
  const validateRadicado = (radicado) => {
    if (!radicado) return { valid: false, error: 'Número de radicado requerido' };
    
    const radicadoStr = String(radicado).trim();
    
    // Verificar que solo contenga números
    if (!/^\d+$/.test(radicadoStr)) {
      return { valid: false, error: 'Solo se permiten números' };
    }
    
    // Verificar longitud (puede ser 23 o 20 dígitos dependiendo del tipo)
    if (radicadoStr.length < 20 || radicadoStr.length > 23) {
      return { valid: false, error: 'Longitud inválida (debe tener entre 20-23 dígitos)' };
    }
    
    // Validaciones básicas de formato
    const year = radicadoStr.substring(8, 12);
    const currentYear = new Date().getFullYear();
    const numYear = parseInt(year);
    
    if (numYear < 1990 || numYear > currentYear + 1) {
      return { valid: false, error: `Año inválido: ${year}` };
    }
    
    return { valid: true, error: null };
  };

  /**
   * Procesa y valida los datos del Excel
   */
  const validateExcelData = (jsonData) => {
    let validRows = 0;
    let invalidRows = 0;
    const errors = [];
    const duplicates = new Set();
    const seenRadicados = new Set();
    
    jsonData.forEach((row, index) => {
      const rowNumber = index + 2; // +2 porque índice 0 = fila 2 (después del header)
      const radicado = row['Numero_Radicado'] || row['Numero_De_Radicado'] || row['Radicado'] || row['numero_radicado'];
      
      if (!radicado) {
        invalidRows++;
        errors.push({
          row: rowNumber,
          error: 'Número de radicado faltante'
        });
        return;
      }
      
      // Verificar duplicados
      const radicadoStr = String(radicado).trim();
      if (seenRadicados.has(radicadoStr)) {
        duplicates.add(radicadoStr);
        invalidRows++;
        errors.push({
          row: rowNumber,
          error: 'Número de radicado duplicado'
        });
        return;
      }
      seenRadicados.add(radicadoStr);
      
      // Validar formato
      const validation = validateRadicado(radicado);
      if (!validation.valid) {
        invalidRows++;
        errors.push({
          row: rowNumber,
          error: validation.error
        });
        return;
      }
      
      validRows++;
    });
    
    return {
      totalRows: jsonData.length,
      validRows,
      invalidRows,
      duplicates: duplicates.size,
      errors: errors.slice(0, 50), // Limitar a 50 errores para performance
      hasMoreErrors: errors.length > 50
    };
  };

  /**
   * Genera datos de preview para mostrar al usuario
   */
  const generatePreviewData = (jsonData, maxRows = 10) => {
    return jsonData.slice(0, maxRows).map((row, index) => {
      const radicado = row['Numero_Radicado'] || row['Numero_De_Radicado'] || row['Radicado'] || row['numero_radicado'];
      const descripcion = row['Descripcion'] || row['descripcion'] || row['Descripción'] || '';
      const validation = validateRadicado(radicado);
      
      return {
        rowNumber: index + 2,
        radicado: radicado || '',
        descripcion: descripcion || '',
        valid: validation.valid,
        error: validation.error
      };
    });
  };

  /**
   * Procesa un archivo Excel completo
   */
  const processFile = useCallback(async (file) => {
    setProcessing(true);
    setProgress(0);
    setError(null);
    
    try {
      // Paso 1: Leer archivo
      setCurrentStep('Leyendo archivo...');
      setProgress(10);
      
      const buffer = await file.arrayBuffer();
      
      // Paso 2: Parsear con SheetJS
      setCurrentStep('Analizando estructura...');
      setProgress(30);
      
      const workbook = XLSX.read(buffer, { 
        type: 'buffer',
        cellStyles: true,
        cellDates: true,
        sheetStubs: false // Ignorar celdas vacías
      });
      
      if (workbook.SheetNames.length === 0) {
        throw new Error('El archivo no contiene hojas de cálculo válidas');
      }
      
      // Usar la primera hoja
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Paso 3: Convertir a JSON
      setCurrentStep('Extrayendo datos...');
      setProgress(50);
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1, // Obtener arrays en lugar de objetos primero
        raw: false, // Convertir todo a strings
        defval: '' // Valor por defecto para celdas vacías
      });
      
      if (jsonData.length < 2) {
        throw new Error('El archivo debe contener al menos una fila de encabezados y una fila de datos');
      }
      
      // Obtener encabezados y datos
      const headers = jsonData[0];
      const dataRows = jsonData.slice(1).filter(row => 
        row.some(cell => cell && String(cell).trim() !== '') // Filtrar filas completamente vacías
      );
      
      if (dataRows.length === 0) {
        throw new Error('No se encontraron datos válidos en el archivo');
      }
      
      // Verificar límite de registros
      if (dataRows.length > 1000) {
        throw new Error(`El archivo contiene ${dataRows.length} registros. El límite máximo es 1000.`);
      }
      
      // Convertir a objetos con encabezados
      const dataObjects = dataRows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
      
      // Paso 4: Validar datos
      setCurrentStep('Validando números de radicado...');
      setProgress(70);
      
      const validation = validateExcelData(dataObjects);
      
      // Paso 5: Generar preview
      setCurrentStep('Generando vista previa...');
      setProgress(90);
      
      const preview = generatePreviewData(dataObjects);
      
      // Finalizar
      setCurrentStep('Procesamiento completado');
      setProgress(100);
      
      // Pequeña pausa para que el usuario vea el 100%
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        validation,
        preview,
        rawData: dataObjects,
        headers
      };
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setProcessing(false);
      setCurrentStep('');
      setProgress(0);
    }
  }, []);

  /**
   * Resetea el estado del hook
   */
  const reset = useCallback(() => {
    setProcessing(false);
    setProgress(0);
    setCurrentStep('');
    setError(null);
  }, []);

  return {
    processFile,
    processing,
    progress,
    currentStep,
    error,
    reset,
    validateRadicado // Exportar para uso externo
  };
};