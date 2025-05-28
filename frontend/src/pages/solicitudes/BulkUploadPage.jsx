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
  Info
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const BulkUploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [validationResults, setValidationResults] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/solicitudes/select-type');
  };

  const handleFileSelect = (file) => {
    // Validar tipo de archivo
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.ms-excel.sheet.macroEnabled.12' // .xlsm
    ];
    
    const allowedExtensions = ['.xlsx', '.xls', '.xlsm'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setUploadStatus('error');
      return;
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadStatus('error');
      return;
    }

    setUploadedFile(file);
    setUploadStatus('uploading');
    
    // Simular proceso de validación
    setTimeout(() => {
      setUploadStatus('success');
      setValidationResults({
        totalRows: 150,
        validRows: 145,
        invalidRows: 5,
        duplicates: 3,
        errors: [
          { row: 12, error: 'Numero de radicado invalido' },
          { row: 25, error: 'Formato incorrecto' },
          { row: 78, error: 'Campo requerido vacio' }
        ]
      });
    }, 2000);
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
    setUploadedFile(null);
    setUploadStatus('idle');
    setValidationResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProcessFile = () => {
    // Proceder con la creación de consultas masivas
    navigate('/solicitudes/bulk-confirm', { 
      state: { 
        file: uploadedFile, 
        validation: validationResults 
      }
    });
  };

  const downloadTemplate = () => {
    // Simular descarga de plantilla
    console.log('Descargando plantilla...');
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
            Volver a Seleccion
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
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-xl">
            <h1 className="text-heading-h1 font-heading text-text-primary mb-sm">
              Carga Masiva de Consultas
            </h1>
            <p className="text-body-paragraph text-text-secondary max-w-2xl mx-auto">
              Sube un archivo de Excel con los numeros de radicado para crear multiples consultas automaticamente.
            </p>
          </div>

          {/* Instructions Card */}
          <Card variant="info" size="lg" className="mb-xl">
            <Card.Header>
              <div className="flex items-center gap-sm">
                <Info size={20} className="text-feedback-info" />
                <Card.Title as="h2">Instrucciones de Carga</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div>
                  <h4 className="text-heading-h4 font-heading text-text-primary mb-sm">
                    Formatos Soportados
                  </h4>
                  <div className="space-y-xs">
                    <div className="flex items-center gap-sm text-body-paragraph">
                      <FileSpreadsheet size={16} className="text-feedback-success" />
                      <span>Libro de Excel (.xlsx)</span>
                    </div>
                    <div className="flex items-center gap-sm text-body-paragraph">
                      <FileSpreadsheet size={16} className="text-feedback-success" />
                      <span>Libro de Excel 97-2003 (.xls)</span>
                    </div>
                    <div className="flex items-center gap-sm text-body-paragraph">
                      <FileSpreadsheet size={16} className="text-feedback-success" />
                      <span>Hoja de calculo habilitada (.xlsm)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-heading-h4 font-heading text-text-primary mb-sm">
                    Estructura Requerida
                  </h4>
                  <div className="space-y-xs text-body-paragraph text-text-base">
                    <div>• Columna A: Numero de Radicado</div>
                    <div>• Columna B: Descripcion (opcional)</div>
                    <div>• Primera fila: Encabezados</div>
                    <div>• Maximo 1000 registros</div>
                    <div>• Tamaño maximo: 10MB</div>
                  </div>
                </div>
              </div>
            </Card.Content>
            <Card.Footer>
              <Button
                variant="secondary"
                icon={<Download size={16} />}
                onClick={downloadTemplate}
              >
                Descargar Plantilla
              </Button>
            </Card.Footer>
          </Card>

          {/* Upload Area */}
          <Card size="xl" className="mb-xl">
            <Card.Content>
              {!uploadedFile ? (
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-2xl text-center transition-default
                    ${dragActive 
                      ? 'border-interactive-default bg-yellow-50' 
                      : 'border-border-default hover:border-interactive-hover'
                    }
                  `}
                  onDrop={handleDrop}
                  onDragOver={handleDrag}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-bg-light rounded-lg flex items-center justify-center mb-md">
                      <Upload size={32} className="text-interactive-default" />
                    </div>
                    <h3 className="text-heading-h3 font-heading text-text-primary mb-sm">
                      Arrastra tu archivo aqui
                    </h3>
                    <p className="text-body-paragraph text-text-secondary mb-lg">
                      o haz clic para seleccionar un archivo de Excel
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Seleccionar Archivo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.xlsm"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-lg">
                  {/* File Info */}
                  <div className="flex items-center justify-between p-md bg-bg-light rounded-lg">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 bg-feedback-success rounded-lg flex items-center justify-center">
                        <File size={20} className="text-bg-canvas" />
                      </div>
                      <div>
                        <h4 className="text-body-paragraph font-medium text-text-primary">
                          {uploadedFile.name}
                        </h4>
                        <p className="text-body-auxiliary text-text-secondary">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<X size={16} />}
                      onClick={removeFile}
                    />
                  </div>

                  {/* Upload Status */}
                  {uploadStatus === 'uploading' && (
                    <div className="text-center py-lg">
                      <div className="w-8 h-8 border-2 border-interactive-default border-t-transparent rounded-full animate-spin mx-auto mb-md"></div>
                      <p className="text-body-paragraph text-text-base">Validando archivo...</p>
                    </div>
                  )}

                  {uploadStatus === 'success' && validationResults && (
                    <div className="space-y-md">
                      <div className="flex items-center gap-sm text-feedback-success">
                        <CheckCircle size={20} />
                        <span className="text-body-paragraph font-medium">Archivo validado correctamente</span>
                      </div>
                      
                      {/* Validation Results */}
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
                            Registros validos
                          </div>
                        </div>
                        <div className="bg-feedback-warning-light border border-feedback-warning rounded-lg p-md text-center">
                          <div className="text-heading-h2 font-heading text-feedback-warning">
                            {validationResults.invalidRows}
                          </div>
                          <div className="text-body-auxiliary text-text-secondary">
                            Registros con errores
                          </div>
                        </div>
                      </div>

                      {/* Errors */}
                      {validationResults.errors.length > 0 && (
                        <Card variant="warning">
                          <Card.Header>
                            <div className="flex items-center gap-sm">
                              <AlertCircle size={20} className="text-feedback-warning" />
                              <Card.Title as="h4">Errores Encontrados</Card.Title>
                            </div>
                          </Card.Header>
                          <Card.Content>
                            <div className="space-y-xs">
                              {validationResults.errors.map((error, index) => (
                                <div key={index} className="flex justify-between text-body-auxiliary">
                                  <span>Fila {error.row}:</span>
                                  <span className="text-feedback-warning">{error.error}</span>
                                </div>
                              ))}
                            </div>
                            <p className="text-body-auxiliary text-text-secondary mt-sm">
                              Los registros con errores seran omitidos del procesamiento.
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
                      <p className="text-body-paragraph text-text-secondary">
                        El archivo no cumple con los requisitos. Verifica el formato y tamaño.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-sm sm:justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleBack}
              className="sm:w-auto"
            >
              Volver
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleProcessFile}
              disabled={uploadStatus !== 'success'}
              icon={<ChevronRight size={20} />}
              iconPosition="right"
              className="sm:w-auto"
            >
              Procesar Archivo
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BulkUploadPage;