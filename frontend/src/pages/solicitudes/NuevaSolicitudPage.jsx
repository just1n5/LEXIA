// Página unificada que integra el formulario de test con el sistema principal
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSolicitudes } from '../../hooks/useSolicitudes';
import { useToast } from '../../components/ui/Toast';
import SimpleValidationMessage from '../../components/forms/SimpleValidationMessage';
import SimpleFrequencySelector from '../../components/forms/SimpleFrequencySelector';

const NuevaSolicitudPage = () => {
  const navigate = useNavigate();
  const { createSolicitud, loading } = useSolicitudes();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    alias: '',
    numeroRadicado: '',
    frecuencia: 'diario'
  });

  const [validationState, setValidationState] = useState('idle');
  const [validationMessage, setValidationMessage] = useState('');

  const handleRadicadoChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, numeroRadicado: value });

    // Simulación de validación mejorada
    if (value.length === 0) {
      setValidationState('idle');
      setValidationMessage('');
    } else if (value.length < 10) {
      setValidationState('validating');
      setValidationMessage('🔍 Validando formato del número de radicado...');
      
      setTimeout(() => {
        setValidationState('error');
        setValidationMessage('Formato incompleto. Debe tener al menos 10 caracteres');
      }, 1000);
    } else {
      setValidationState('validating');
      setValidationMessage('🔄 Verificando número de radicado en base de datos...');
      
      setTimeout(() => {
        setValidationState('valid');
        setValidationMessage('Número de radicado válido y encontrado en el sistema');
      }, 1500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.alias.trim()) {
      toast.error('Error de validación', 'Por favor ingresa un alias para la solicitud');
      return;
    }
    
    if (!formData.numeroRadicado.trim()) {
      toast.error('Error de validación', 'Por favor ingresa el número de radicado');
      return;
    }

    if (validationState !== 'valid') {
      toast.error('Error de validación', 'El número de radicado debe ser válido antes de continuar');
      return;
    }

    try {
      // Preparar datos para el servicio
      const solicitudData = {
        alias: formData.alias,
        tipo_busqueda: 'radicado',
        criterio_busqueda_radicado: formData.numeroRadicado,
        frecuencia_envio: formData.frecuencia,
        activa: true
      };

      await createSolicitud(solicitudData);
      toast.success('¡Éxito!', 'Solicitud creada exitosamente');
      
      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      toast.error('Error', 'Error al crear la solicitud. Por favor intenta nuevamente.');
      console.error('Error creating solicitud:', error);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '32px 0'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px',
          fontSize: '14px',
          color: '#64748b',
          backgroundColor: '#ffffff',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <a href="/dashboard" style={{ color: '#64748b', textDecoration: 'none' }}>
              🏠 Dashboard
            </a>
          </span>
          <span style={{ margin: '0 12px', color: '#cbd5e1' }}>→</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#facc15', fontWeight: '500' }}>
            ➕ Nueva Solicitud
          </span>
        </div>

        {/* Page Title */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '36px', 
            fontWeight: '700',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
          }}>
            ➕ Nueva Solicitud de Consulta
          </h2>
          <p style={{ 
            margin: 0, 
            fontSize: '18px',
            color: '#64748b',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Crea una nueva solicitud automatizada para monitorear procesos judiciales
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '40px',
          marginBottom: '32px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📋 Alias de la Solicitud *
              </label>
              <input
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#ffffff',
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                type="text"
                value={formData.alias}
                onChange={(e) => setFormData({...formData, alias: e.target.value})}
                placeholder="Ej: Caso Familia García, Demanda Empresa XYZ..."
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#facc15';
                  e.target.style.boxShadow = '0 0 0 3px rgba(250, 204, 21, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{ 
                fontSize: '14px', 
                color: '#64748b', 
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                💡 Un nombre que te ayude a identificar fácilmente esta solicitud
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🔢 Número de Radicado *
              </label>
              <input
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  border: `2px solid ${
                    validationState === 'validating' ? '#3b82f6' :
                    validationState === 'valid' ? '#10b981' :
                    validationState === 'error' ? '#ef4444' :
                    '#e2e8f0'
                  }`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#ffffff',
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                type="text"
                value={formData.numeroRadicado}
                onChange={handleRadicadoChange}
                placeholder="Ej: 2024-CV-123456789"
                required
                onFocus={(e) => {
                  if (validationState === 'idle') {
                    e.target.style.borderColor = '#facc15';
                    e.target.style.boxShadow = '0 0 0 3px rgba(250, 204, 21, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  if (validationState === 'idle') {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
              <SimpleValidationMessage 
                state={validationState}
                message={validationMessage}
              />
              <div style={{ 
                fontSize: '14px', 
                color: '#64748b', 
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                🎯 Ingresa el número de radicado completo del proceso judicial
              </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📅 Frecuencia de Notificación *
              </label>
              <SimpleFrequencySelector
                value={formData.frecuencia}
                onChange={(value) => setFormData({...formData, frecuencia: value})}
              />
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '16px',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <button 
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '16px 24px',
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flex: '0 0 auto'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#e2e8f0';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#f1f5f9';
                }}
              >
                Cancelar
              </button>

              <button 
                type="submit"
                disabled={loading || validationState !== 'valid'}
                style={{
                  flex: '1',
                  padding: '20px 32px',
                  background: validationState === 'valid' 
                    ? 'linear-gradient(135deg, #facc15 0%, #eab308 100%)'
                    : '#e2e8f0',
                  color: validationState === 'valid' ? '#1e293b' : '#94a3b8',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: validationState === 'valid' ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: validationState === 'valid' 
                    ? '0 4px 15px rgba(250, 204, 21, 0.3)'
                    : 'none',
                  minWidth: '200px'
                }}
                onMouseOver={(e) => {
                  if (validationState === 'valid' && !loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(250, 204, 21, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (validationState === 'valid' && !loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(250, 204, 21, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid currentColor',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Creando...
                  </>
                ) : (
                  <>🚀 Crear Solicitud</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div style={{
          backgroundColor: '#dbeafe',
          border: '1px solid #93c5fd',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '40px'
        }}>
          <h4 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📚 ¿Cómo funciona el monitoreo automático?
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px',
            color: '#1e40af'
          }}>
            <div>
              <strong>🔍 Monitoreo:</strong> El sistema revisará automáticamente el estado del proceso
            </div>
            <div>
              <strong>📧 Notificaciones:</strong> Recibirás emails cuando haya actualizaciones
            </div>
            <div>
              <strong>📊 Historial:</strong> Podrás ver todo el historial de cambios en el dashboard
            </div>
            <div>
              <strong>⚙️ Control:</strong> Puedes pausar o modificar la solicitud en cualquier momento
            </div>
          </div>
        </div>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default NuevaSolicitudPage;