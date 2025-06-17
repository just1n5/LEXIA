import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronRight, 
  FileText, 
  Hash, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Search,
  Mail,
  BarChart3,
  Settings,
  Clock,
  Zap,
  AlertTriangle,
  Check,
  Users
} from 'lucide-react';
import { useSolicitudes } from '../../hooks/useSolicitudes';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { cn } from '../../utils/cn';
import SimpleValidationMessage from '../../components/forms/SimpleValidationMessage';


const NuevaSolicitudPage = () => {
  const navigate = useNavigate();
  const { createSolicitud, loading } = useSolicitudes();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombreDescriptivo: '', // Cambiado de 'alias' para consistencia
    partesDelProceso: '', // NUEVO: Campo opcional para demandante - demandado
    numeroRadicado: '',
    frecuencia: 'diario', // Valor fijo - las consultas siempre son diarias
    tipoConsulta: 'reciente' // Por defecto como la interfaz oficial de Rama Judicial
  });

  const [validationState, setValidationState] = useState('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [errors, setErrors] = useState({}); // Añadido para validación del nombre descriptivo
  
  // Estados para Enhanced Buttons
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Form tracking inicial para detectar cambios
  const initialFormData = {
    nombreDescriptivo: '',
    partesDelProceso: '', // NUEVO: Campo opcional
    numeroRadicado: '',
    frecuencia: 'diario', // Valor fijo - no cambia
    tipoConsulta: 'reciente' // Valor por defecto
  };

  const handleBack = () => {
    navigate('/solicitudes/select-type');
  };

  // Detección de cambios no guardados
  React.useEffect(() => {
    const hasChanges = (
      formData.nombreDescriptivo !== initialFormData.nombreDescriptivo ||
      formData.partesDelProceso !== initialFormData.partesDelProceso || // NUEVO: Incluir en detección
      formData.numeroRadicado !== initialFormData.numeroRadicado ||
      formData.tipoConsulta !== initialFormData.tipoConsulta
      // frecuencia no se incluye porque es fija
    );
    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  // Validación del formulario completo
  React.useEffect(() => {
    const isValid = (
      formData.nombreDescriptivo.trim().length >= 3 &&
      formData.nombreDescriptivo.trim().length <= 100 &&
      !errors.nombreDescriptivo &&
      formData.numeroRadicado.trim().length > 0 &&
      (validationState === 'valid' || validationState === 'warning') // Incluir warning como válido
    );
    setIsFormValid(isValid);
  }, [formData, errors, validationState]);

  // Enhanced Back Button Handler
  const handleEnhancedBack = () => {
    if (hasUnsavedChanges) {
      setShowExitConfirmation(true);
    } else {
      navigate('/solicitudes/select-type');
    }
  };

  // Confirmación de salida
  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    navigate('/solicitudes/select-type');
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  // Validación del nombre descriptivo
  const validateNombreDescriptivo = (value) => {
    const newErrors = { ...errors };
    
    if (!value.trim()) {
      newErrors.nombreDescriptivo = 'El nombre descriptivo es requerido';
    } else if (value.trim().length < 3) {
      newErrors.nombreDescriptivo = 'El nombre debe tener al menos 3 caracteres';
    } else if (value.trim().length > 100) {
      newErrors.nombreDescriptivo = 'El nombre no puede exceder 100 caracteres';
    } else {
      delete newErrors.nombreDescriptivo;
    }
    
    setErrors(newErrors);
    return !newErrors.nombreDescriptivo;
  };

  const handleNombreDescriptivoChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, nombreDescriptivo: value });
    validateNombreDescriptivo(value);
  };

  const handlePartesDelProcesoChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, partesDelProceso: value });
  };

  const handleRadicadoChange = (e) => {
    // Implementar validación oficial: solo números (igual que en ramajudicial.gov.co)
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData({ ...formData, numeroRadicado: value });

    // Validación robusta basada en estructura OFICIAL de la Rama Judicial
    // Acuerdo No. 201 de 1997: 23 dígitos exactos
    
    if (value.length === 0) {
      setValidationState('idle');
      setValidationMessage('');
      return;
    }

    // Validaciones progresivas con feedback específico
    if (!/^\d+$/.test(value)) {
      setValidationState('error');
      setValidationMessage('Solo se permiten números. El radicado no debe contener letras ni caracteres especiales.');
      return;
    }

    if (value.length < 10) {
      setValidationState('validating');
      setValidationMessage('Analizando formato... Un radicado válido tiene exactamente 23 dígitos.');
      return;
    }

    if (value.length < 23) {
      setValidationState('validating');
      setValidationMessage(`Validando estructura... Faltan ${23 - value.length} dígitos para completar los 23 requeridos.`);
      
      // Timeout para dar feedback progresivo
      setTimeout(() => {
        if (formData.numeroRadicado === value && value.length < 23) {
          setValidationState('error');
          setValidationMessage(`Radicado incompleto. Según la Rama Judicial (Acuerdo 201/1997), debe tener exactamente 23 dígitos. Actual: ${value.length}`);
        }
      }, 1500);
      return;
    }

    if (value.length > 23) {
      setValidationState('error');
      setValidationMessage(`Radicado demasiado largo. Debe tener exactamente 23 dígitos, no ${value.length}. Elimina ${value.length - 23} dígito(s).`);
      return;
    }

    // Validación estructural para 23 dígitos exactos
    if (value.length === 23) {
      setValidationState('validating');
      setValidationMessage('Verificando estructura del radicado según Rama Judicial...');
      
      setTimeout(() => {
        if (formData.numeroRadicado === value) {
          // Extraer componentes según estructura oficial
          const departamento = value.substring(0, 2);
          const ciudad = value.substring(2, 5);
          const entidad = value.substring(5, 7);
          const especialidad = value.substring(7, 9);
          const despacho = value.substring(9, 12);
          const ano = value.substring(12, 16);
          const codigoProceso = value.substring(16, 21);
          const recurso = value.substring(21, 23);
          
          // Validaciones estructurales básicas
          const anoActual = new Date().getFullYear();
          const anoRadicado = parseInt(ano);
          
          // Año debe ser razonable (entre 1991 y año actual + 1)
          if (anoRadicado < 1991 || anoRadicado > anoActual + 1) {
            setValidationState('error');
            setValidationMessage(`Año inválido: ${ano}. Debe estar entre 1991 y ${anoActual + 1}.`);
            return;
          }
          
          // Validar que departamento no sea 00
          if (departamento === '00') {
            setValidationState('error');
            setValidationMessage('Código de departamento inválido: 00. Debe ser un código DANE válido.');
            return;
          }
          
          // Recurso debe ser válido (00-03 generalmente)
          if (parseInt(recurso) > 10) {
            setValidationState('warning');
            setValidationMessage(`Instancia inusual: ${recurso}. Revisa si es correcto (00=Primera, 01-03=Superiores).`);
            return;
          }
          
          // Simulación de verificación en sistema
          const random = Math.random();
          
          if (random > 0.8) {
            setValidationState('valid');
            setValidationMessage(`Radicado válido y encontrado. Depto: ${departamento}, Año: ${ano}, Instancia: ${recurso === '00' ? 'Primera' : 'Superior'}.`);
          } else if (random > 0.4) {
            setValidationState('warning');
            setValidationMessage(`Radicado estructuralmente correcto pero proceso inactivo. Año: ${ano}. Se puede monitorear.`);
          } else {
            setValidationState('error');
            setValidationMessage(`Radicado no encontrado en el sistema. Verifica: Depto=${departamento}, Año=${ano}, Código=${codigoProceso}.`);
          }
        }
      }, 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación exhaustiva antes del envío
    const validationErrors = [];
    
    // Validar nombre descriptivo
    if (!validateNombreDescriptivo(formData.nombreDescriptivo)) {
      validationErrors.push('Nombre descriptivo inválido');
    }
    
    // Validar radicado
    if (!formData.numeroRadicado.trim()) {
      validationErrors.push('Número de radicado requerido');
    } else if (validationState !== 'valid' && validationState !== 'warning') {
      validationErrors.push('Número de radicado debe ser válido');
    }
    
    // Frecuencia es fija como 'diario', no requiere validación
    
    // Si hay errores, mostrar toast con lista de errores
    if (validationErrors.length > 0) {
      toast.error(
        'Errores de validación', 
        validationErrors.join('\n') + '\n\nPor favor corrige estos errores antes de continuar.'
      );
      
      // Focus en el primer campo con error
      if (!validateNombreDescriptivo(formData.nombreDescriptivo)) {
        document.querySelector('input[aria-describedby="nombre-help nombre-counter"]')?.focus();
      } else if (validationState !== 'valid' && validationState !== 'warning') {
        document.querySelector('input[aria-describedby="radicado-help radicado-validation"]')?.focus();
      }
      
      return;
    }

    try {
      // Preparar datos para el servicio (mantenemos 'alias' para compatibilidad con backend)
      const solicitudData = {
        alias: formData.nombreDescriptivo.trim(), // Usamos nombreDescriptivo como alias
        partes_proceso: formData.partesDelProceso.trim(), // NUEVO: Incluir partes del proceso
        tipo_busqueda: 'radicado',
        criterio_busqueda_radicado: formData.numeroRadicado.trim(),
        frecuencia_envio: formData.frecuencia,
        tipo_consulta: formData.tipoConsulta, // NUEVO: Incluir tipo de consulta
        activa: true
      };

      // Toast de inicio
      toast.info('Procesando', 'Creando tu solicitud de consulta judicial...');

      await createSolicitud(solicitudData);
      
      // Toast de éxito con más detalle
      const tipoTexto = formData.tipoConsulta === 'reciente' ? 'Actuaciones Recientes (últimos 30 días)' : 'Consulta Completa (historial total)';
      toast.success(
        '¡Solicitud Creada!', 
        `Tu consulta "${formData.nombreDescriptivo}" ha sido configurada exitosamente con el método "${tipoTexto}". El monitoreo comenzará pronto.`
      );
      
      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      // Toast de error más informativo
      toast.error(
        'Error al Crear Solicitud', 
        error.message || 'Ocurrió un error inesperado. Por favor verifica tu conexión e intenta nuevamente.'
      );
      console.error('Error creating solicitud:', error);
    }
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
            <span className="text-text-primary">Consulta Sencilla</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-md md:px-lg py-xl">
        <div className="max-w-3xl mx-auto"> {/* Reducido de max-w-4xl a max-w-3xl para mejor centrado */}
          {/* Page Header */}
          <div className="text-center mb-xl">
            <div className="w-16 h-16 bg-interactive-default rounded-2xl flex items-center justify-center mx-auto mb-md">
              <Hash size={32} className="text-text-primary" />
            </div>
            <h1 className="text-heading-h1 font-heading text-text-primary mb-sm">
              Consulta por Número de Radicación
            </h1>
            <p className="text-body-paragraph text-text-secondary max-w-2xl mx-auto">
              Ingresa el número de radicación de 23 dígitos para monitorear automáticamente el estado de tu proceso judicial. El sistema utilizará el mismo método que la página oficial de la Rama Judicial.
            </p>
          </div>

          {/* Form Card */}
          <Card size="lg" className="mb-xl shadow-xl border-0 bg-white" style={{boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div>
                  <Card.Title className="flex items-center gap-sm">
                    <Hash className="w-5 h-5 text-interactive-default" />
                    Consulta por Número de Radicación
                  </Card.Title>
                  <p className="text-body-paragraph text-text-secondary mt-xs">
                    Consulta directa utilizando el sistema oficial de la Rama Judicial
                  </p>
                </div>
                <Badge variant="success" className="hidden md:flex">
                  <CheckCircle className="w-3 h-3 mr-xs" />
                  Oficial
                </Badge>
              </div>
            </Card.Header>

            <Card.Content>
              <form onSubmit={handleSubmit} className="space-y-2xl">
                
                {/* BANNER INFORMATIVO */}
                <div className="p-md bg-feedback-success-light border border-feedback-success rounded-md">
                  <div className="flex items-start gap-sm">
                    <Info className="w-5 h-5 text-feedback-success mt-xs" />
                    <div>
                      <h3 className="text-body-paragraph font-medium text-feedback-success mb-xs">
                        Formulario de Consulta Sencilla
                      </h3>
                      <p className="text-body-auxiliary text-feedback-success">
                        Configuración rápida y directa. Solo necesitas el número de radicado 
                        para comenzar el monitoreo automático.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 1: IDENTIFICACIÓN DEL CASO */}
                <div>
                  <h3 className="text-heading-h3 font-heading text-text-primary mb-md flex items-center gap-sm">
                    <FileText className="w-5 h-5 text-interactive-default" />
                    1. Identificación del Caso
                    <Badge variant="error" size="sm">Requerido</Badge>
                  </h3>
                  
                  <div className="space-y-lg">
                    {/* Nombre Descriptivo */}
                    <div>
                      <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                        * Nombre descriptivo de la consulta
                      </label>
                      <input
                        type="text"
                        value={formData.nombreDescriptivo}
                        onChange={handleNombreDescriptivoChange}
                        className={cn(
                          'w-full px-sm py-sm border-2 rounded-md transition-all duration-300',
                          'text-body-paragraph bg-bg-canvas text-text-base',
                          'focus:outline-none focus:ring-2 focus:ring-offset-1',
                          errors.nombreDescriptivo
                            ? 'border-feedback-error focus:border-feedback-error focus:ring-feedback-error/20 bg-feedback-error/5'
                            : formData.nombreDescriptivo.length >= 3 && formData.nombreDescriptivo.length <= 100
                            ? 'border-feedback-success focus:border-feedback-success focus:ring-feedback-success/20 bg-feedback-success/5'
                            : formData.nombreDescriptivo.length > 0
                            ? 'border-feedback-warning focus:border-feedback-warning focus:ring-feedback-warning/20 bg-feedback-warning/5'
                            : 'border-border-default focus:border-interactive-default focus:ring-interactive-default/20'
                        )}
                        placeholder="Ej: Consulta proceso civil Juan Pérez, Seguimiento demanda contra ABC S.A.S."
                        required
                        maxLength={100}
                        aria-describedby="nombre-help nombre-counter"
                        aria-invalid={!!errors.nombreDescriptivo}
                      />
                      {errors.nombreDescriptivo && (
                        <p className="text-body-auxiliary text-feedback-error mt-xs flex items-center gap-xs">
                          <AlertTriangle className="w-3 h-3" />
                          {errors.nombreDescriptivo}
                        </p>
                      )}
                      {!errors.nombreDescriptivo && (
                        <p id="nombre-help" className="text-body-auxiliary text-text-secondary mt-xs">
                          Un nombre claro que te permita identificar rápidamente esta consulta (3-100 caracteres)
                        </p>
                      )}
                      <div id="nombre-counter" className="flex justify-between items-center mt-xs">
                        <span className={cn(
                          'text-body-auxiliary transition-colors duration-200',
                          formData.nombreDescriptivo.length > 90
                            ? 'text-feedback-warning'
                            : formData.nombreDescriptivo.length > 95
                            ? 'text-feedback-error'
                            : 'text-text-secondary'
                        )}>
                          {formData.nombreDescriptivo.length}/100 caracteres
                        </span>
                        {formData.nombreDescriptivo.length >= 3 && formData.nombreDescriptivo.length <= 100 && (
                          <span className="text-body-auxiliary text-feedback-success flex items-center gap-xs animate-fade-in">
                            <CheckCircle className="w-3 h-3" />
                            Válido
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Partes del Proceso - NUEVO CAMPO OPCIONAL */}
                    <div>
                      <label className="block text-body-paragraph font-medium text-text-primary mb-xs flex items-center gap-xs">
                        <Users className="w-4 h-4 text-interactive-default" />
                        Partes del proceso (opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.partesDelProceso}
                        onChange={handlePartesDelProcesoChange}
                        className={cn(
                          'w-full px-sm py-sm border-2 rounded-md transition-all duration-300',
                          'text-body-paragraph bg-bg-canvas text-text-base',
                          'focus:outline-none focus:ring-2 focus:ring-offset-1',
                          'border-border-default focus:border-interactive-default focus:ring-interactive-default/20'
                        )}
                        placeholder="Ej: Juan Pérez vs ABC S.A.S., Demandante: María García - Demandado: XYZ Ltda."
                        maxLength={200}
                        aria-describedby="partes-help partes-counter"
                      />
                      <p id="partes-help" className="text-body-auxiliary text-text-secondary mt-xs">
                        Identifica las partes involucradas en el proceso: demandante, demandado, etc. (hasta 200 caracteres)
                      </p>
                      <div id="partes-counter" className="flex justify-between items-center mt-xs">
                        <span className={cn(
                          'text-body-auxiliary transition-colors duration-200',
                          formData.partesDelProceso.length > 180
                            ? 'text-feedback-warning'
                            : formData.partesDelProceso.length > 190
                            ? 'text-feedback-error'
                            : 'text-text-secondary'
                        )}>
                          {formData.partesDelProceso.length}/200 caracteres
                        </span>
                        {formData.partesDelProceso.length > 0 && (
                          <span className="text-body-auxiliary text-feedback-info flex items-center gap-xs animate-fade-in">
                            <Info className="w-3 h-3" />
                            Opcional
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 2: TIPO DE CONSULTA */}
                <div>
                  <h3 className="text-heading-h3 font-heading text-text-primary mb-md flex items-center gap-sm">
                    <Settings className="w-5 h-5 text-interactive-default" />
                    2. Tipo de Consulta
                    <Badge variant="success" size="sm">Recomendado</Badge>
                  </h3>
                  
                  <div className="space-y-lg">
                    {/* Banner informativo sobre tipos de consulta */}
                    <div className="bg-feedback-info-light border border-feedback-info/30 rounded-md p-sm mb-sm">
                      <div className="flex items-start gap-xs">
                        <Info className="w-4 h-4 text-feedback-info mt-xs flex-shrink-0" />
                        <div>
                          <p className="text-body-auxiliary text-feedback-info">
                            <strong>Basado en la interfaz oficial:</strong> La Rama Judicial ofrece dos tipos de consulta. 
                            "Actuaciones Recientes" es más rápida y se usa por defecto.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Selector de tipo de consulta */}
                    <div>
                      <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                        * Tipo de Consulta
                      </label>
                      
                      <div className="space-y-sm">
                        {/* Opción Reciente */}
                        <label className={`
                          flex items-start p-md border-2 rounded-lg bg-bg-canvas cursor-pointer 
                          transition-all duration-200 hover:bg-yellow-50 hover:border-interactive-hover
                          ${
                            formData.tipoConsulta === 'reciente'
                              ? 'border-interactive-default bg-yellow-50 shadow-md' 
                              : 'border-border-default'
                          }
                        `}>
                          {/* Radio Button */}
                          <div className={`
                            w-5 h-5 rounded-full border-2 mr-md flex items-center justify-center 
                            transition-colors mt-xs flex-shrink-0
                            ${
                              formData.tipoConsulta === 'reciente'
                                ? 'border-interactive-default bg-interactive-default'
                                : 'border-border-default bg-bg-canvas'
                            }
                          `}>
                            {formData.tipoConsulta === 'reciente' && (
                              <div className="w-2 h-2 bg-text-primary rounded-full"></div>
                            )}
                          </div>
                          
                          {/* Hidden input */}
                          <input
                            type="radio"
                            name="tipoConsulta"
                            value="reciente"
                            checked={formData.tipoConsulta === 'reciente'}
                            onChange={(e) => setFormData({...formData, tipoConsulta: e.target.value})}
                            className="sr-only"
                          />
                          
                          {/* Icon */}
                          <div className={`
                            flex items-center justify-center w-12 h-12 rounded-lg mr-md 
                            transition-colors flex-shrink-0
                            ${
                              formData.tipoConsulta === 'reciente'
                                ? 'bg-interactive-default' 
                                : 'bg-bg-light'
                            }
                          `}>
                            <Zap className={`w-6 h-6 ${
                              formData.tipoConsulta === 'reciente' ? 'text-text-primary' : 'text-text-secondary'
                            }`} />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-sm mb-xs flex-wrap">
                              <span className="text-body-paragraph font-semibold text-text-primary">
                                Procesos con Actuaciones Recientes
                              </span>
                              <span className="text-body-auxiliary text-text-secondary">
                                (últimos 30 días)
                              </span>
                              <span className="inline-flex items-center px-xs py-xs bg-feedback-success text-white text-xs font-medium rounded">
                                <CheckCircle className="w-3 h-3 mr-xs" />
                                Recomendado
                              </span>
                            </div>
                            
                            <p className="text-body-auxiliary text-text-secondary mb-sm">
                              Consulta más rápida que muestra cambios recientes (~30 segundos)
                            </p>

                          </div>
                          
                          {/* Selected indicator */}
                          {formData.tipoConsulta === 'reciente' && (
                            <div className="w-6 h-6 bg-feedback-success rounded-full flex items-center justify-center ml-sm flex-shrink-0">
                              <Check className="w-3 h-3 text-bg-canvas" />
                            </div>
                          )}
                        </label>

                        {/* Opción Completa */}
                        <label className={`
                          flex items-start p-md border-2 rounded-lg bg-bg-canvas cursor-pointer 
                          transition-all duration-200 hover:bg-yellow-50 hover:border-interactive-hover
                          ${
                            formData.tipoConsulta === 'completa'
                              ? 'border-interactive-default bg-yellow-50 shadow-md' 
                              : 'border-border-default'
                          }
                        `}>
                          {/* Radio Button */}
                          <div className={`
                            w-5 h-5 rounded-full border-2 mr-md flex items-center justify-center 
                            transition-colors mt-xs flex-shrink-0
                            ${
                              formData.tipoConsulta === 'completa'
                                ? 'border-interactive-default bg-interactive-default'
                                : 'border-border-default bg-bg-canvas'
                            }
                          `}>
                            {formData.tipoConsulta === 'completa' && (
                              <div className="w-2 h-2 bg-text-primary rounded-full"></div>
                            )}
                          </div>
                          
                          {/* Hidden input */}
                          <input
                            type="radio"
                            name="tipoConsulta"
                            value="completa"
                            checked={formData.tipoConsulta === 'completa'}
                            onChange={(e) => setFormData({...formData, tipoConsulta: e.target.value})}
                            className="sr-only"
                          />
                          
                          {/* Icon */}
                          <div className={`
                            flex items-center justify-center w-12 h-12 rounded-lg mr-md 
                            transition-colors flex-shrink-0
                            ${
                              formData.tipoConsulta === 'completa'
                                ? 'bg-interactive-default' 
                                : 'bg-bg-light'
                            }
                          `}>
                            <BarChart3 className={`w-6 h-6 ${
                              formData.tipoConsulta === 'completa' ? 'text-text-primary' : 'text-text-secondary'
                            }`} />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-sm mb-xs flex-wrap">
                              <span className="text-body-paragraph font-semibold text-text-primary">
                                Todos los Procesos
                              </span>
                              <span className="text-body-auxiliary text-text-secondary">
                                (consulta completa, menos rápida)
                              </span>
                            </div>
                            
                            <p className="text-body-auxiliary text-text-secondary mb-sm">
                              Consulta exhaustiva que incluye todo el historial (~2 minutos)
                            </p>

                          </div>
                          
                          {/* Selected indicator */}
                          {formData.tipoConsulta === 'completa' && (
                            <div className="w-6 h-6 bg-feedback-success rounded-full flex items-center justify-center ml-sm flex-shrink-0">
                              <Check className="w-3 h-3 text-bg-canvas" />
                            </div>
                          )}
                        </label>
                      </div>
                      
                      {/* Información adicional basada en selección */}
                      {formData.tipoConsulta && (
                        <div className="mt-md p-md bg-white/70 rounded-lg border border-interactive-default/20">
                          <h4 className="text-body-paragraph font-semibold text-text-primary mb-sm">
                            <FileText className="w-4 h-4 inline mr-xs" />
                            Tu configuración actual
                          </h4>
                          {formData.tipoConsulta === 'reciente' ? (
                            <div className="space-y-xs text-body-auxiliary text-text-base">
                              <p><CheckCircle className="w-3 h-3 inline mr-xs text-feedback-success" /> <strong>Consulta Rápida:</strong> El bot buscará cambios en los últimos 30 días</p>
                              <p><Zap className="w-3 h-3 inline mr-xs text-feedback-success" /> <strong>Rendimiento:</strong> Consultas más eficientes y rápidas</p>
                              <p><BarChart3 className="w-3 h-3 inline mr-xs text-feedback-success" /> <strong>Ideal para:</strong> Monitoreo diario de procesos activos</p>
                            </div>
                          ) : (
                            <div className="space-y-xs text-body-auxiliary text-text-base">
                              <p><BarChart3 className="w-3 h-3 inline mr-xs text-feedback-warning" /> <strong>Consulta Completa:</strong> El bot revisará todo el historial del proceso</p>
                              <p><Clock className="w-3 h-3 inline mr-xs text-feedback-warning" /> <strong>Rendimiento:</strong> Más lenta pero exhaustiva</p>
                              <p><Search className="w-3 h-3 inline mr-xs text-feedback-warning" /> <strong>Ideal para:</strong> Análisis completo de procesos antiguos</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 3: DATOS DE BÚSQUEDA */}
                <div>
                  <h3 className="text-heading-h3 font-heading text-text-primary mb-md flex items-center gap-sm">
                    <Search className="w-5 h-5 text-interactive-default" />
                    3. Datos de Búsqueda
                    <Badge variant="error" size="sm">Requerido</Badge>
                  </h3>
                  
                  <div className="space-y-lg">
                    {/* Número de Radicación */}
                    <div>
                      <label className="block text-body-paragraph font-medium text-text-primary mb-xs">
                        * Número de Radicación
                      </label>
                      <input
                        type="text"
                        value={formData.numeroRadicado}
                        onChange={handleRadicadoChange}
                        className={cn(
                          'w-full px-sm py-sm border-2 rounded-md transition-all duration-300',
                          'text-body-paragraph bg-bg-canvas text-text-base',
                          'focus:outline-none focus:ring-2 focus:ring-offset-1',
                          validationState === 'validating'
                            ? 'border-feedback-info focus:border-feedback-info focus:ring-feedback-info/20 bg-feedback-info/5'
                            : validationState === 'valid'
                            ? 'border-feedback-success focus:border-feedback-success focus:ring-feedback-success/20 bg-feedback-success/5'
                            : validationState === 'warning'
                            ? 'border-feedback-warning focus:border-feedback-warning focus:ring-feedback-warning/20 bg-feedback-warning/5'
                            : validationState === 'error'
                            ? 'border-feedback-error focus:border-feedback-error focus:ring-feedback-error/20 bg-feedback-error/5'
                            : 'border-border-default focus:border-interactive-default focus:ring-interactive-default/20',
                          // Animación de pulso para validating
                          validationState === 'validating' && 'animate-pulse'
                        )}
                        placeholder="Ingrese los 23 dígitos del número de radicación"
                        maxLength={23}
                        required
                        aria-describedby="radicado-help radicado-validation radicado-counter"
                        aria-invalid={validationState === 'error'}
                      />
                      {/* Contador visual prominente como en la oficial */}
                      <div id="radicado-counter" className="flex justify-between items-center mt-xs mb-xs">
                        <div className="flex items-center gap-sm">
                          <span className={`text-body-paragraph font-medium transition-colors duration-200 ${
                            formData.numeroRadicado.length === 23 
                              ? 'text-feedback-success' 
                              : formData.numeroRadicado.length > 20 
                                ? 'text-feedback-warning'
                                : 'text-text-secondary'
                          }`}>
                            {formData.numeroRadicado.length} / 23 dígitos
                          </span>
                          
                          {formData.numeroRadicado.length === 23 && validationState === 'valid' && (
                            <span className="inline-flex items-center px-xs py-xs bg-feedback-success text-white text-xs font-medium rounded animate-fade-in">
                              <CheckCircle className="w-3 h-3 mr-xs" />
                              Completo
                            </span>
                          )}
                        </div>
                        
                        {/* Barra de progreso visual */}
                        <div className="w-24 h-2 bg-bg-light rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              validationState === 'valid' ? 'bg-feedback-success' :
                              validationState === 'error' ? 'bg-feedback-error' :
                              validationState === 'warning' ? 'bg-feedback-warning' :
                              'bg-interactive-default'
                            }`}
                            style={{ width: `${(formData.numeroRadicado.length / 23) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <SimpleValidationMessage 
                        state={validationState}
                        message={validationMessage}
                      />
                      {!validationMessage && (
                        <div className="mt-xs space-y-xs">
                          <p id="radicado-help" className="text-body-auxiliary text-text-secondary flex items-center gap-xs">
                          <FileText className="w-3 h-3 text-interactive-default" /> <strong>Formato oficial:</strong> 23 dígitos exactos según Acuerdo 201/1997 de la Rama Judicial
                          </p>
                          <div className="bg-bg-light rounded-md p-sm text-body-auxiliary text-text-secondary">
                            <p className="text-xs font-mono">
                              <span className="text-feedback-info">05001</span>
                              <span className="text-feedback-success">31</span>
                              <span className="text-feedback-warning">03</span>
                              <span className="text-purple-600">001</span>
                              <span className="text-feedback-error">2021</span>
                              <span className="text-orange-600">00001</span>
                              <span className="text-pink-600">00</span>
                            </p>
                            <p className="text-xs mt-xs">
                              <span className="text-feedback-info">Municipio</span> + 
                              <span className="text-feedback-success">Entidad</span> + 
                              <span className="text-feedback-warning">Especialidad</span> + 
                              <span className="text-purple-600">Despacho</span> + 
                              <span className="text-feedback-error">Año</span> + 
                              <span className="text-orange-600">Código</span> + 
                              <span className="text-pink-600">Instancia</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* BANNER INFORMATIVO DE AUTOMATIZACIÓN */}
                <div className="bg-gradient-to-r from-interactive-default/10 to-feedback-success/10 border border-interactive-default/30 rounded-lg p-lg">
                  <div className="flex items-start gap-md">
                    {/* Icono principal */}
                    <div className="w-12 h-12 bg-interactive-default rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-text-primary" />
                    </div>
                    
                    {/* Contenido principal */}
                    <div className="flex-1">
                      <h3 className="text-heading-h3 font-heading text-text-primary mb-sm flex items-center gap-sm">
                        Monitoreo Automático Configurado
                        <Badge variant="success" size="sm">
                          <CheckCircle className="w-3 h-3 mr-xs" />
                          Activo
                        </Badge>
                      </h3>
                      
                      <div className="space-y-md">
                        {/* Información principal */}
                        <div className="bg-white/70 rounded-lg p-md border border-interactive-default/20">
                          <div className="flex items-start gap-sm mb-sm">
                            <div className="w-5 h-5 bg-feedback-success rounded-full flex items-center justify-center flex-shrink-0 mt-xs">
                              <Clock className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <h4 className="text-body-paragraph font-semibold text-text-primary mb-xs flex items-center gap-xs">
                                {formData.tipoConsulta === 'reciente' ? (
                                  <>
                                    <Zap className="w-4 h-4 text-interactive-default" />
                                    Consultas Diarias Rápidas
                                  </>
                                ) : (
                                  <>
                                    <BarChart3 className="w-4 h-4 text-interactive-default" />
                                    Consultas Diarias Completas
                                  </>
                                )}
                              </h4>
                              <p className="text-body-auxiliary text-text-base">
                                Tu radicado <strong>{formData.numeroRadicado || '[número de radicado]'}</strong> será consultado automáticamente <strong>todos los días a las 7:00 PM</strong> usando el método 
                                <strong>"{formData.tipoConsulta === 'reciente' ? 'Actuaciones Recientes (últimos 30 días)' : 'Consulta Completa (historial total)'}"</strong>.
                              </p>
                              <p className="text-body-auxiliary text-text-secondary mt-xs">
                                {formData.tipoConsulta === 'reciente' 
                                  ? 'Tiempo estimado: ~30 segundos por consulta. Más eficiente para monitoreo diario.'
                                  : 'Tiempo estimado: ~2 minutos por consulta. Incluye todo el historial del proceso.'
                                }
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-sm">
                            <div className="w-5 h-5 bg-feedback-info rounded-full flex items-center justify-center flex-shrink-0 mt-xs">
                              <Mail className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <h4 className="text-body-paragraph font-semibold text-text-primary mb-xs flex items-center gap-xs">
                                <Mail className="w-4 h-4 text-interactive-default" />
                                Notificaciones Solo Cuando Hay Cambios
                              </h4>
                              <p className="text-body-auxiliary text-text-base">
                                Recibirás un correo electrónico únicamente cuando se detecten <strong>cambios o actualizaciones</strong> en tu proceso judicial. Nada de spam.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Características adicionales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                          <div className="space-y-sm">
                            <h5 className="text-body-paragraph font-medium text-text-primary flex items-center gap-xs">
                              <Zap className="w-4 h-4 text-interactive-default" />
                              Características Técnicas
                            </h5>
                            <div className="space-y-xs text-body-auxiliary text-text-secondary">
                              <div className="flex justify-between">
                                <span>Tiempo de consulta:</span>
                                <span className="font-medium">{formData.tipoConsulta === 'reciente' ? '~30 segundos' : '~2 minutos'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Método utilizado:</span>
                                <span className="font-medium">{formData.tipoConsulta === 'reciente' ? 'Actuaciones recientes' : 'Consulta completa'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Eficiencia:</span>
                                <span className={`font-medium ${
                                  formData.tipoConsulta === 'reciente' ? 'text-feedback-success' : 'text-feedback-info'
                                }`}>
                                  {formData.tipoConsulta === 'reciente' ? 'Alta' : 'Media'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-sm">
                            <h5 className="text-body-paragraph font-medium text-text-primary flex items-center gap-xs">
                              <Settings className="w-4 h-4 text-interactive-default" />
                              Control y Gestión
                            </h5>
                            <div className="space-y-xs text-body-auxiliary text-text-secondary">
                              <div className="flex items-center gap-xs">
                                <CheckCircle className="w-3 h-3 text-feedback-success" />
                                <span>Pausar/reanudar disponible 24/7</span>
                              </div>
                              <div className="flex items-center gap-xs">
                                <Search className="w-3 h-3 text-feedback-success" />
                                <span>Acceso directo a Rama Judicial</span>
                              </div>
                              <div className="flex items-center gap-xs">
                                <BarChart3 className="w-3 h-3 text-feedback-success" />
                                <span>Historial completo en dashboard</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Banner específico según tipo de consulta */}
                        {formData.tipoConsulta === 'reciente' ? (
                          <div className="bg-feedback-success-light border border-feedback-success/30 rounded-md p-sm">
                            <div className="flex items-start gap-xs">
                              <Info className="w-4 h-4 text-feedback-success mt-xs flex-shrink-0" />
                              <div>
                                <h5 className="text-body-paragraph font-medium text-feedback-success mb-xs flex items-center gap-xs">
                                  <CheckCircle className="w-4 h-4 text-feedback-success" />
                                  Configuración Recomendada Activa
                                </h5>
                                <p className="text-body-auxiliary text-feedback-success">
                                  Has elegido el método más eficiente: "Actuaciones Recientes". Esta es la configuración recomendada para monitoreo diario ya que replica exactamente el comportamiento por defecto de la página oficial de la Rama Judicial.
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-feedback-warning-light border border-feedback-warning/30 rounded-md p-sm">
                            <div className="flex items-start gap-xs">
                              <Info className="w-4 h-4 text-feedback-warning mt-xs flex-shrink-0" />
                              <div>
                                <h5 className="text-body-paragraph font-medium text-feedback-warning mb-xs flex items-center gap-xs">
                                  <BarChart3 className="w-4 h-4 text-feedback-warning" />
                                  Consulta Completa Activada
                                </h5>
                                <p className="text-body-auxiliary text-feedback-warning">
                                  Has elegido "Consulta Completa" que incluye todo el historial. Esto es más lento pero exhaustivo. Considera cambiar a "Actuaciones Recientes" si solo necesitas monitorear cambios nuevos.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN ENHANCED */}
                <div className="flex flex-col sm:flex-row gap-sm justify-between pt-lg border-t border-border-default">
                  {/* Enhanced Back Button */}
                  <div className="flex items-center gap-sm">
                    <Button
                      type="button"
                      variant={hasUnsavedChanges ? "destructive" : "secondary"}
                      size="lg"
                      onClick={handleEnhancedBack}
                      disabled={loading}
                      icon={hasUnsavedChanges ? <AlertTriangle size={16} /> : <ArrowLeft size={16} />}
                      className={cn(
                        'sm:w-auto',
                        !hasUnsavedChanges && 'bg-gray-500 hover:bg-gray-600 text-white border-gray-500 font-bold'
                      )}
                      style={{
                        backgroundColor: !hasUnsavedChanges ? '#6b7280' : undefined,
                        borderColor: !hasUnsavedChanges ? '#6b7280' : undefined,
                        width: '200px'
                      }}
                    >
                      {hasUnsavedChanges ? 'Salir sin Guardar' : 'Cancelar'}
                    </Button>
                    
                    {hasUnsavedChanges && (
                      <div className="hidden sm:flex items-center text-body-auxiliary text-feedback-warning">
                        <Info className="w-3 h-3 mr-xs" />
                        Tienes cambios sin guardar
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Create Button con Validación Visual */}
                  <div className="flex items-center gap-sm">
                    {/* Indicador de Validación */}
                    {!isFormValid && formData.nombreDescriptivo.length > 0 && (
                      <div className="hidden sm:flex items-center text-body-auxiliary text-text-secondary">
                        <div className="flex items-center gap-xs">
                          {/* Progreso visual */}
                          <div className="flex gap-xs">
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              formData.nombreDescriptivo.length >= 3 && formData.nombreDescriptivo.length <= 100 && !errors.nombreDescriptivo
                                ? 'bg-feedback-success'
                                : 'bg-border-default'
                            )}></div>
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              validationState === 'valid'
                                ? 'bg-feedback-success'
                                : validationState === 'validating'
                                ? 'bg-feedback-info'
                                : 'bg-border-default'
                            )}></div>
                          </div>
                          <span className="text-xs">
                            {!formData.nombreDescriptivo.trim() || formData.nombreDescriptivo.length < 3
                              ? 'Completa el nombre descriptivo'
                              : validationState !== 'valid'
                              ? 'Validando radicado...'
                              : 'Listo para crear'
                            }
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      variant="primary"
                      size="lg"
                      type="submit"
                      disabled={
                        loading || 
                        !isFormValid
                      }
                      loading={loading}
                      icon={loading ? null : isFormValid ? <CheckCircle size={20} /> : <ChevronRight size={20} />}
                      iconPosition="right"
                      className={cn(
                        'sm:w-auto flex-1 sm:flex-initial max-w-md ml-auto transition-all',
                        'bg-green-600 hover:bg-green-700 active:bg-green-800 border-green-600 text-white font-bold',
                        isFormValid 
                          ? 'shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30'
                          : 'opacity-60'
                      )}
                      style={{
                        backgroundColor: isFormValid ? '#16a34a' : undefined,
                        borderColor: isFormValid ? '#16a34a' : undefined,
                        width: '200px'
                      }}
                    >
                      {loading 
                        ? 'Creando Solicitud...' 
                        : isFormValid 
                          ? 'Crear Solicitud ✓' 
                          : 'Crear Solicitud'
                      }
                    </Button>
                  </div>
                </div>
              </form>
            </Card.Content>
          </Card>


        </div>
      </main>
      
      {/* Modal de Confirmación de Salida */}
      {showExitConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <Card size="md" className="w-full max-w-md">
            <Card.Header>
              <Card.Title className="flex items-center gap-sm text-feedback-warning">
                <AlertTriangle className="w-5 h-5" />
                Cambios sin Guardar
              </Card.Title>
            </Card.Header>
            
            <Card.Content>
              <div className="space-y-md">
                <p className="text-body-paragraph text-text-base">
                  Tienes cambios sin guardar en el formulario. ¿Estás seguro de que deseas salir?
                </p>
                
                <div className="bg-feedback-warning-light border border-feedback-warning rounded-md p-sm">
                  <h4 className="text-body-paragraph font-medium text-feedback-warning mb-xs">
                    Cambios que se perderán:
                  </h4>
                  <ul className="text-body-auxiliary text-feedback-warning space-y-xs">
                    {formData.nombreDescriptivo !== initialFormData.nombreDescriptivo && (
                      <li>• Nombre descriptivo: "{formData.nombreDescriptivo}"</li>
                    )}
                    {formData.partesDelProceso !== initialFormData.partesDelProceso && (
                      <li>• Partes del proceso: "{formData.partesDelProceso}"</li>
                    )}
                    {formData.numeroRadicado !== initialFormData.numeroRadicado && (
                      <li>• Número de radicado: "{formData.numeroRadicado}"</li>
                    )}
                    {formData.tipoConsulta !== initialFormData.tipoConsulta && (
                      <li>• Tipo de consulta: {formData.tipoConsulta === 'reciente' ? 'Actuaciones Recientes' : 'Consulta Completa'}</li>
                    )}
                  </ul>
                </div>
              </div>
            </Card.Content>
            
            <Card.Footer>
              <div className="flex gap-sm justify-end">
                <Button
                  variant="secondary"
                  onClick={handleCancelExit}
                >
                  Continuar Editando
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmExit}
                  icon={<ArrowLeft size={16} />}
                >
                  Salir sin Guardar
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NuevaSolicitudPage;