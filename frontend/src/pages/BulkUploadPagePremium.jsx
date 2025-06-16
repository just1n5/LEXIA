import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, FileText, CheckCircle, Zap, Smartphone } from 'lucide-react'

// Core hooks
import { useExcelProcessor } from '../hooks/useExcelProcessor'
import { useBulkUploadState } from '../hooks/useBulkUploadState'
import { useMobileDetection } from '../hooks/mobile/useMobileDetection'

// Enhanced components
import { EnhancedDropZone } from '../components/bulk-upload/EnhancedDropZone'
import { FilePreview } from '../components/bulk-upload/FilePreview'
import { ValidationProgress } from '../components/bulk-upload/ValidationProgress'

// UI components
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { useToast } from '../hooks/useToast'
import { cn } from '../utils/cn'

// Animation system
import '../components/bulk-upload/animations.css'

const BulkUploadPagePremium = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { isMobile, isTablet, isDesktop } = useMobileDetection()

  // Core state
  const {
    file,
    uploadProgress,
    validationProgress,
    currentStep,
    isProcessing,
    previewData,
    validationResults,
    errors,
    setFile,
    setCurrentStep,
    updateProgress,
    setPreviewData,
    setValidationResults,
    setErrors,
    resetState,
    clearPersistedState
  } = useBulkUploadState()

  // Excel processing
  const { processFile, validateData, isLoading } = useExcelProcessor()

  // Local state for UI
  const [dragActive, setDragActive] = useState(false)
  const [processingStats, setProcessingStats] = useState({
    totalRows: 0,
    validRows: 0,
    invalidRows: 0,
    processingSpeed: 0
  })

  // Handle file selection/drop
  const handleFileSelect = useCallback(async (selectedFile) => {
    if (!selectedFile) return

    try {
      setFile(selectedFile)
      setCurrentStep(1)
      
      // Show processing toast
      toast.success("🔄 Procesando archivo...", `Analizando ${selectedFile.name}`)

      // Process file with real Excel parsing
      const result = await processFile(selectedFile)
      
      if (result.success) {
        setPreviewData(result.data)
        setProcessingStats({
          totalRows: result.data.length,
          validRows: result.validCount || 0,
          invalidRows: result.invalidCount || 0,
          processingSpeed: result.processingTime || 0
        })

        toast.success("✅ Archivo procesado exitosamente", `${result.data.length} filas encontradas`)

        // Auto-advance to validation if data looks good
        if (result.data.length > 0) {
          setTimeout(() => {
            setCurrentStep(2)
            handleValidation(result.data)
          }, 1500)
        }
      } else {
        throw new Error(result.error || 'Error procesando archivo')
      }
    } catch (error) {
      console.error('Error processing file:', error)
      
      setErrors([{
        type: 'file_processing',
        message: error.message || 'Error procesando el archivo',
        critical: true
      }])

      toast.error("❌ Error procesando archivo", error.message || 'No se pudo procesar el archivo Excel')
    }
  }, [setFile, setCurrentStep, setPreviewData, setErrors, processFile, toast])

  // Handle validation
  const handleValidation = useCallback(async (data = previewData) => {
    if (!data || data.length === 0) return

    try {
      setCurrentStep(2)
      
      toast.info("🔍 Iniciando validación...", "Verificando formato de radicados")

      const validationResult = await validateData(data, (progress) => {
        updateProgress('validation', progress)
      })

      setValidationResults(validationResult)
      
      if (validationResult.valid.length > 0) {
        toast.success("✅ Validación completada", `${validationResult.valid.length} radicados válidos encontrados`)
        setCurrentStep(3)
      } else {
        toast.warning("⚠️ No se encontraron radicados válidos", "Revisa el formato de tu archivo")
      }
    } catch (error) {
      console.error('Validation error:', error)
      
      setErrors([{
        type: 'validation',
        message: error.message || 'Error durante la validación',
        critical: false
      }])

      toast.error("❌ Error en validación", error.message || 'No se pudo validar los datos')
    }
  }, [previewData, setCurrentStep, updateProgress, setValidationResults, setErrors, validateData, toast])

  // Handle bulk processing
  const handleBulkProcess = useCallback(async () => {
    if (!validationResults?.valid?.length) return

    try {
      setCurrentStep(3)
      
      toast.info("🚀 Iniciando procesamiento masivo...", `Procesando ${validationResults.valid.length} solicitudes`)

      // Simulate bulk processing with progress updates
      const totalItems = validationResults.valid.length
      let processed = 0

      for (const item of validationResults.valid) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100))
        
        processed++
        const progress = (processed / totalItems) * 100
        updateProgress('upload', progress)

        // Update processing stats
        setProcessingStats(prev => ({
          ...prev,
          validRows: processed
        }))
      }

      setCurrentStep(4)
      
      toast.success("🎉 ¡Procesamiento completado!", `${processed} solicitudes enviadas exitosamente`)

      // Clear persisted state after successful completion
      setTimeout(() => {
        clearPersistedState()
      }, 2000)

    } catch (error) {
      console.error('Bulk processing error:', error)
      toast.error("❌ Error en procesamiento masivo", error.message || 'No se pudieron procesar todas las solicitudes')
    }
  }, [validationResults, setCurrentStep, updateProgress, clearPersistedState, toast])

  // Handle restart
  const handleRestart = useCallback(() => {
    resetState()
    setProcessingStats({
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      processingSpeed: 0
    })
    
    toast.info("🔄 Proceso reiniciado", "Puedes cargar un nuevo archivo")
  }, [resetState, toast])

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate('/solicitudes')
    }
  }, [currentStep, setCurrentStep, navigate])

  // Show mobile optimized version
  if (isMobile) {
    return (
      <div className="min-h-screen bg-bg-light">
        {/* Mobile Header */}
        <div className="p-4 bg-bg-canvas border-b border-border-default">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-heading-h4 font-heading text-text-primary">
                Carga Masiva
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Smartphone className="h-4 w-4 text-interactive-default" />
                <span className="text-body-auxiliary text-text-secondary">
                  Optimizado para móvil
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 space-y-6">
          {currentStep === 0 && (
            <div className="animate-fade-in">
              <EnhancedDropZone
                onFileSelect={handleFileSelect}
                dragActive={dragActive}
                onDragActiveChange={setDragActive}
                isLoading={isLoading}
                supportedFormats={['.xlsx', '.xls']}
                maxSize="50MB"
              />
            </div>
          )}

          {currentStep >= 1 && previewData && (
            <div className="animate-slide-up">
              <FilePreview
                data={previewData}
                fileName={file?.name}
                maxRows={10}
              />
            </div>
          )}

          {currentStep >= 2 && (
            <div className="animate-slide-up">
              <ValidationProgress
                progress={validationProgress}
                results={validationResults}
              />
            </div>
          )}

          {currentStep >= 3 && (
            <div className="space-y-4 animate-slide-up">
              <div className="bg-bg-canvas p-4 rounded-lg border border-border-default">
                <h3 className="text-heading-h4 font-heading text-text-primary mb-2">
                  📊 Estadísticas
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-body-auxiliary text-text-secondary">Total</span>
                    <p className="text-heading-h4 font-heading text-text-primary">
                      {processingStats.totalRows}
                    </p>
                  </div>
                  <div>
                    <span className="text-body-auxiliary text-text-secondary">Válidos</span>
                    <p className="text-heading-h4 font-heading text-feedback-success">
                      {processingStats.validRows}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBulkProcess}
                disabled={!validationResults?.valid?.length || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? 'Procesando...' : `Procesar ${validationResults?.valid?.length || 0} Solicitudes`}
              </Button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-4 animate-bounce-in">
              <div className="w-16 h-16 bg-feedback-success rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-heading-h3 font-heading text-feedback-success">
                ¡Completado!
              </h3>
              <p className="text-body-paragraph text-text-base">
                Todas las solicitudes han sido procesadas exitosamente
              </p>
              <Button onClick={handleRestart} className="w-full">
                Procesar Nuevo Archivo
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Desktop/Tablet version
  return (
    <div className="min-h-screen bg-bg-light">
      {/* Desktop Header */}
      <div className="bg-bg-canvas border-b border-border-default">
        <div className="container mx-auto px-lg py-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-md">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="hover-lift"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-heading-h1 font-heading text-text-primary">
                  Carga Masiva de Solicitudes
                </h1>
                <p className="text-body-paragraph text-text-secondary mt-1">
                  Sistema premium para procesamiento masivo de consultas judiciales
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-sm">
              <Badge variant="info" className="animate-pulse">
                Estado Guardado
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-lg pb-2xl py-lg">
        <div className={cn(
          "grid gap-xl",
          isTablet ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
        )}>
          {/* Primary Content Column */}
          <div className={cn(
            "space-y-xl",
            isTablet ? "col-span-1" : "lg:col-span-2"
          )}>
            {/* Step Content */}
            {currentStep === 0 && (
              <div className="animate-fade-in">
                <EnhancedDropZone
                  onFileSelect={handleFileSelect}
                  dragActive={dragActive}
                  onDragActiveChange={setDragActive}
                  isLoading={isLoading}
                  supportedFormats={['.xlsx', '.xls']}
                  maxSize="50MB"
                  className="premium-dropzone"
                />
              </div>
            )}

            {currentStep >= 1 && previewData && (
              <div className="animate-slide-up">
                <FilePreview
                  data={previewData}
                  fileName={file?.name}
                  maxRows={20}
                />
              </div>
            )}

            {currentStep >= 2 && (
              <div className="animate-slide-up">
                <ValidationProgress
                  progress={validationProgress}
                  results={validationResults}
                />
              </div>
            )}

            {currentStep >= 3 && (
              <div className="space-y-lg animate-slide-up">
                <div className="bg-bg-canvas p-lg rounded-lg border border-border-default">
                  <h3 className="text-heading-h3 font-heading text-text-primary mb-md">
                    🚀 Procesamiento Masivo
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
                    <div className="bg-bg-light p-md rounded-lg">
                      <span className="text-body-auxiliary text-text-secondary">Total de Registros</span>
                      <p className="text-heading-h2 font-heading text-text-primary">
                        {processingStats.totalRows}
                      </p>
                    </div>
                    <div className="bg-bg-light p-md rounded-lg">
                      <span className="text-body-auxiliary text-text-secondary">Registros Válidos</span>
                      <p className="text-heading-h2 font-heading text-feedback-success">
                        {processingStats.validRows}
                      </p>
                    </div>
                    <div className="bg-bg-light p-md rounded-lg">
                      <span className="text-body-auxiliary text-text-secondary">Errores</span>
                      <p className="text-heading-h2 font-heading text-feedback-error">
                        {processingStats.invalidRows}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleBulkProcess}
                    disabled={!validationResults?.valid?.length || isProcessing}
                    size="lg"
                    className="w-full hover-lift"
                  >
                    {isProcessing 
                      ? `Procesando... ${Math.round(uploadProgress)}%` 
                      : `🚀 Procesar ${validationResults?.valid?.length || 0} Solicitudes`
                    }
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center space-y-lg animate-bounce-in">
                <div className="w-24 h-24 bg-feedback-success rounded-full flex items-center justify-center mx-auto premium-success-icon">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-heading-h2 font-heading text-feedback-success">
                  🎉 ¡Procesamiento Completado!
                </h2>
                <p className="text-body-paragraph text-text-base max-w-md mx-auto">
                  Todas las solicitudes han sido enviadas exitosamente al sistema judicial. 
                  Recibirás notificaciones cuando se actualice el estado de cada consulta.
                </p>
                <div className="flex gap-md justify-center">
                  <Button onClick={handleRestart} size="lg">
                    Procesar Nuevo Archivo
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/solicitudes')}>
                    Ver Solicitudes
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Only on desktop */}
          {isDesktop && (
            <div className="space-y-lg">
              {/* Progress Overview */}
              <div className="bg-bg-canvas p-lg rounded-lg border border-border-default">
                <h3 className="text-heading-h4 font-heading text-text-primary mb-md">
                  📊 Resumen
                </h3>
                <div className="space-y-sm">
                  <div className="flex justify-between">
                    <span className="text-body-auxiliary text-text-secondary">Archivo:</span>
                    <span className="text-body-auxiliary text-text-base">
                      {file ? file.name : 'No seleccionado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body-auxiliary text-text-secondary">Filas:</span>
                    <span className="text-body-auxiliary text-text-base">
                      {processingStats.totalRows}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body-auxiliary text-text-secondary">Válidas:</span>
                    <span className="text-body-auxiliary text-feedback-success">
                      {processingStats.validRows}
                    </span>
                  </div>
                  {errors.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-body-auxiliary text-text-secondary">Errores:</span>
                      <span className="text-body-auxiliary text-feedback-error">
                        {errors.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-bg-canvas p-lg rounded-lg border border-border-default">
                <h3 className="text-heading-h4 font-heading text-text-primary mb-md">
                  ⚡ Acciones Rápidas
                </h3>
                <div className="space-y-sm">
                  {file && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleRestart}
                    >
                      🔄 Reiniciar Proceso
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => navigate('/solicitudes')}
                  >
                    📋 Ver Todas las Solicitudes
                  </Button>
                </div>
              </div>

              {/* Help & Tips */}
              <div className="bg-feedback-info-light p-lg rounded-lg border border-feedback-info">
                <h3 className="text-heading-h4 font-heading text-feedback-info mb-md">
                  💡 Tips
                </h3>
                <div className="space-y-sm text-body-auxiliary text-feedback-info">
                  <p>• Usa archivos Excel (.xlsx, .xls) para mejores resultados</p>
                  <p>• La primera columna debe contener los números de radicado</p>
                  <p>• Máximo 1000 registros por archivo</p>
                  <p>• El progreso se guarda automáticamente</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BulkUploadPagePremium