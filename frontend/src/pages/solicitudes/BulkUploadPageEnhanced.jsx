import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  ChevronRight, 
  Download,
  FileSpreadsheet,
  Info,
  Eye,
  Zap,
  Clock
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useExcelProcessor } from '../../hooks/useExcelProcessor';
import { useBulkUploadState } from '../../hooks/useBulkUploadState';
import { useBulkUploadToast } from '../../components/ui/ToastEnhanced';
import FilePreview from '../../components/bulk-upload/FilePreview';
import ValidationProgress from '../../components/bulk-upload/ValidationProgress';
import EnhancedDropZone from '../../components/bulk-upload/EnhancedDropZone';

const BulkUploadPageEnhanced = () => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Custom hooks para manejo de estado y procesamiento
  const {
    uploadedFile,
    uploadStatus,
    validationResults,
    previewData,
    setUploadedFile,
    setUploadStatus,
    setValidationResults,
    setPreviewData,
    clearState,
    persistState,
    restoreState
  } = useBulkUploadState();

  const {
    processFile,
    processing,
    progress,
    currentStep,
    error: processingError
  } = useExcelProcessor();

  // 🆕 NUEVO: Hook para toasts especializados
  const bulkToast = useBulkUploadToast();

  // Restaurar estado al cargar la página
  React.useEffect(() => {
    restoreState();
  }, []);

  const handleBack = () => {
    navigate('/solicitudes/select-type');
  };

  const handleFileSelect = async (file) => {
    // Validar tipo de archivo - SOLO .xlsx y .xls (sin .xlsm por seguridad)
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel' // .xls
    ];
    
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setUploadStatus('error');
      setValidationResults({
        error: 'Formato de archivo no soportado. Solo se permiten archivos .xlsx y .xls'
      });
      // 🆕 NUEVO: Toast de error específico
      bulkToast.notifyFileError(file.name, 'Formato no soportado');
      return;
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadStatus('error');
      setValidationResults({
        error: 'El archivo es demasiado grande. El tamaño máximo permitido es 10MB.'
      });
      // 🆕 NUEVO: Toast de error específico
      bulkToast.notifyFileError(file.name, 'Archivo demasiado grande (máx. 10MB)');
      return;
    }

    setUploadedFile(file);
    setUploadStatus('uploading');
    
    // 🆕 NUEVO: Notificar carga exitosa
    bulkToast.notifyFileUploaded(file.name);
    
    // 🆕 NUEVO: Iniciar toast de procesamiento
    const processToastId = bulkToast.notifyFileProcessing(file.name);
    
    try {
      // Procesar archivo real con SheetJS
      const result = await processFile(file);
      
      setValidationResults(result.validation);
      setPreviewData(result.preview);
      setUploadStatus('success');
      
      // Persistir estado para recuperación
      persistState();
      
      // 🆕 NUEVO: Completar toast de procesamiento
      bulkToast.completeProgress(
        processToastId, 
        'Archivo procesado', 
        `${result.validation.validRows} registros válidos encontrados`
      );
      
      // 🆕 NUEVO: Toast de resultado final
      bulkToast.notifyFileProcessed(result.validation.validRows, result.validation.totalRows);
      
    } catch (error) {
      console.error('Error procesando archivo:', error);
      setUploadStatus('error');
      setValidationResults({
        error: error.message || 'Error desconocido al procesar el archivo'
      });
      
      // 🆕 NUEVO: Toast de error en procesamiento
      bulkToast.notifyFileError(file.name, error.message || 'Error en procesamiento');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    clearState();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProcessFile = () => {
    navigate('/solicitudes/bulk-confirm', { 
      state: { 
        file: uploadedFile, 
        validation: validationResults,
        preview: previewData
      }
    });
  };

  const downloadTemplate = () => {
    // Crear template Excel con SheetJS
    const templateData = [
      ['Numero_Radicado', 'Descripcion'],
      ['11001310300120240001', 'Consulta de estado procesal ejemplo'],
      ['11001310300120240002', 'Verificación de actuaciones'],
      ['', ''] // Fila vacía como ejemplo
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    
    // Configurar estilos para el header
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "FACC15" } },
      alignment: { horizontal: "center" }
    };
    
    ws['A1'].s = headerStyle;
    ws['B1'].s = headerStyle;
    
    XLSX.writeFile(wb, 'template-carga-masiva-consultas.xlsx');
    
    // 🆕 NUEVO: Toast de descarga exitosa
    bulkToast.notifyTemplateDownloaded();
  };

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header */}
      <header className="bg-bg-canvas border-b border-border-default">
        <div className="container mx-auto px-md md:px-lg py-md">
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<ArrowLeft size={16} />}
            onClick={handleBack}
            className="mb-sm"
          >
            Volver a Selección
          </Button>
          
          {/* Breadcrumb */}
          <nav className="flex items-center text-body-auxiliary text-text-secondary" aria-label="Breadcrumb">
            <Button.Link onClick={() => navigate('/dashboard')} className="text-body-auxiliary">
              Mis Solicitudes
            </Button.Link>
            <ChevronRight size={14} className="mx-xs text-border-default" />
            <Button.Link onClick={handleBack} className="text-body-auxiliary">
              Nueva Solicitud
            </Button.Link>
            <ChevronRight size={14} className="mx-xs text-border-default" />
            <span className="text-text-primary">Carga Masiva</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-md md:px-lg py-xl">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-xl">
            <div className="w-16 h-16 bg-interactive-default rounded-lg flex items-center justify-center mx-auto mb-md">
              <Upload size={32} className="text-text-primary" />
            </div>
            <h1 className="text-heading-h1 font-heading text-text-primary mb-sm">
              Carga Masiva de Consultas
            </h1>
            <p className="text-body-paragraph text-text-secondary max-w-2xl mx-auto">
              Sube un archivo de Excel con los números de radicado para crear múltiples consultas automáticamente.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
            {/* Sidebar - Instructions */}
            <div className="lg:col-span-1 space-y-lg">
              {/* Instructions Card */}
              <Card variant="info" size="lg">
                <Card.Header>
                  <div className="flex items-center gap-sm">
                    <Info size={20} className="text-feedback-info" />
                    <Card.Title as="h2">Requisitos del Archivo</Card.Title>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-md">
                    <div>
                      <h4 className="text-heading-h4 font-heading text-text-primary mb-sm">
                        Formatos Permitidos
                      </h4>
                      <div className="space-y-xs">
                        <div className="flex items-center gap-sm text-body-paragraph">
                          <FileSpreadsheet size={16} className="text-feedback-success" />
                          <span>Excel 2007+ (.xlsx)</span>
                        </div>
                        <div className="flex items-center gap-sm text-body-paragraph">
                          <FileSpreadsheet size={16} className="text-feedback-success" />
                          <span>Excel 97-2003 (.xls)</span>
                        </div>
                      </div>
                      <div className="mt-sm p-sm bg-feedback-warning-light border border-feedback-warning rounded-md">
                        <p className="text-body-auxiliary text-feedback-warning">
                          ⚠️ Por seguridad, no se permiten archivos con macros (.xlsm)
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-heading-h4 font-heading text-text-primary mb-sm">
                        Estructura Requerida
                      </h4>
                      <div className="space-y-xs text-body-paragraph text-text-base">
                        <div>• <strong>Columna A:</strong> Numero_Radicado</div>
                        <div>• <strong>Columna B:</strong> Descripcion (opcional)</div>
                        <div>• <strong>Primera fila:</strong> Encabezados</div>
                        <div>• <strong>Límites:</strong> Máximo 1000 registros</div>
                        <div>• <strong>Tamaño:</strong> Máximo 10MB</div>
                      </div>
                    </div>
                  </div>
                </Card.Content>
                <Card.Footer>
                  <Button
                    variant="secondary"
                    icon={<Download size={16} />}
                    onClick={downloadTemplate}
                    className="w-full"
                  >
                    Descargar Plantilla
                  </Button>
                </Card.Footer>
              </Card>

              {/* Progress Card - Solo mostrar durante procesamiento */}
              {processing && (
                <Card variant="info" size="lg">
                  <Card.Header>
                    <div className="flex items-center gap-sm">
                      <Zap size={20} className="text-feedback-info animate-pulse" />
                      <Card.Title as="h3">Procesando Archivo</Card.Title>
                    </div>
                  </Card.Header>
                  <Card.Content>
                    <ValidationProgress 
                      progress={progress}
                      currentStep={currentStep}
                    />
                  </Card.Content>
                </Card>
              )}
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-xl">
              {/* Upload Area */}
              <Card size="xl">
                <Card.Content>
                  {!uploadedFile ? (
                    <EnhancedDropZone
                      dragActive={dragActive}
                      onDrop={handleDrop}
                      onDrag={handleDrag}
                      onFileSelect={() => fileInputRef.current?.click()}
                    />
                  ) : (
                    <div className="space-y-lg">
                      {/* File Info */}
                      <div className="flex items-center justify-between p-md bg-bg-light rounded-lg border border-border-default">
                        <div className="flex items-center gap-md">
                          <div className="w-12 h-12 bg-feedback-success rounded-lg flex items-center justify-center">
                            <File size={24} className="text-bg-canvas" />
                          </div>
                          <div>
                            <h4 className="text-body-paragraph font-medium text-text-primary">
                              {uploadedFile.name}
                            </h4>
                            <div className="flex items-center gap-md text-body-auxiliary text-text-secondary">
                              <span>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                              <span>•</span>
                              <span>
                                {uploadedFile.name.toLowerCase().endsWith('.xlsx') ? 'Excel 2007+' : 'Excel 97-2003'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<X size={16} />}
                          onClick={removeFile}
                          disabled={processing}
                        />
                      </div>

                      {/* Upload Status */}
                      {uploadStatus === 'uploading' && (
                        <div className="text-center py-lg">
                          <div className="w-8 h-8 border-2 border-interactive-default border-t-transparent rounded-full animate-spin mx-auto mb-md"></div>
                          <p className="text-body-paragraph text-text-base">
                            {processing ? currentStep : 'Iniciando validación...'}
                          </p>
                        </div>
                      )}

                      {uploadStatus === 'success' && validationResults && (
                        <div className="space-y-lg">
                          <div className="flex items-center gap-sm text-feedback-success">
                            <CheckCircle size={20} />
                            <span className="text-body-paragraph font-medium">
                              Archivo procesado correctamente
                            </span>
                          </div>
                          
                          {/* Validation Results Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                            <div className="bg-feedback-success-light border border-feedback-success rounded-lg p-md text-center">
                              <div className="text-heading-h2 font-heading text-feedback-success">
                                {validationResults.totalRows}
                              </div>
                              <div className="text-body-auxiliary text-text-secondary">
                                Total de registros
                              </div>
                            </div>
                            <div className="bg-feedback-success-light border border-feedback-success rounded-lg p-md text-center">
                              <div className="text-heading-h2 font-heading text-feedback-success">
                                {validationResults.validRows}
                              </div>
                              <div className="text-body-auxiliary text-text-secondary">
                                Registros válidos
                              </div>
                            </div>
                            <div className="bg-feedback-warning-light border border-feedback-warning rounded-lg p-md text-center">
                              <div className="text-heading-h2 font-heading text-feedback-warning">
                                {validationResults.invalidRows || 0}
                              </div>
                              <div className="text-body-auxiliary text-text-secondary">
                                Con errores
                              </div>
                            </div>
                          </div>

                          {/* File Preview */}
                          {previewData && previewData.length > 0 && (
                            <Card variant="outlined" size="lg">
                              <Card.Header>
                                <div className="flex items-center gap-sm">
                                  <Eye size={20} className="text-interactive-default" />
                                  <Card.Title as="h3">Vista Previa de Datos</Card.Title>
                                </div>
                              </Card.Header>
                              <Card.Content>
                                <FilePreview data={previewData} validation={validationResults} />
                              </Card.Content>
                            </Card>
                          )}

                          {/* Errors Detail */}
                          {validationResults.errors && validationResults.errors.length > 0 && (
                            <Card variant="warning">
                              <Card.Header>
                                <div className="flex items-center gap-sm">
                                  <AlertCircle size={20} className="text-feedback-warning" />
                                  <Card.Title as="h4">Errores Encontrados</Card.Title>
                                </div>
                              </Card.Header>
                              <Card.Content>
                                <div className="space-y-xs max-h-48 overflow-y-auto">
                                  {validationResults.errors.slice(0, 10).map((error, index) => (
                                    <div key={index} className="flex justify-between text-body-auxiliary p-sm bg-feedback-warning-light rounded">
                                      <span>Fila {error.row}:</span>
                                      <span className="text-feedback-warning font-medium">{error.error}</span>
                                    </div>
                                  ))}
                                  {validationResults.errors.length > 10 && (
                                    <p className="text-body-auxiliary text-text-secondary text-center pt-sm">
                                      ... y {validationResults.errors.length - 10} errores más
                                    </p>
                                  )}
                                </div>
                                <p className="text-body-auxiliary text-text-secondary mt-sm">
                                  Los registros con errores serán omitidos del procesamiento.
                                </p>
                              </Card.Content>
                            </Card>
                          )}
                        </div>
                      )}

                      {uploadStatus === 'error' && (
                        <div className="text-center py-lg">
                          <div className="w-12 h-12 bg-feedback-error rounded-lg flex items-center justify-center mx-auto mb-md">
                            <AlertCircle size={24} className="text-bg-canvas" />
                          </div>
                          <h4 className="text-heading-h4 font-heading text-feedback-error mb-sm">
                            Error al procesar archivo
                          </h4>
                          <p className="text-body-paragraph text-text-secondary mb-md">
                            {validationResults?.error || processingError || 'Error desconocido'}
                          </p>
                          <Button
                            variant="secondary"
                            onClick={removeFile}
                            className="mx-auto"
                          >
                            Intentar de Nuevo
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </Card.Content>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-sm sm:justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleBack}
                  disabled={processing}
                  className="sm:w-auto"
                >
                  Volver
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleProcessFile}
                  disabled={uploadStatus !== 'success' || processing}
                  loading={processing}
                  icon={processing ? <Clock size={20} /> : <ChevronRight size={20} />}
                  iconPosition="right"
                  className="sm:w-auto"
                >
                  {processing 
                    ? 'Procesando...'
                    : validationResults?.validRows 
                      ? `Continuar con ${validationResults.validRows} consultas`
                      : 'Procesar Archivo'
                  }
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BulkUploadPageEnhanced;