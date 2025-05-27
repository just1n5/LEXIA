// Página de test actualizada con componentes mejorados
import React, { useState } from 'react';
import SimpleValidationMessage from '../../components/forms/SimpleValidationMessage';
import SimpleFrequencySelector from '../../components/forms/SimpleFrequencySelector';

const TestSolicitudesPage = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.alias.trim()) {
      alert('⚠️ Por favor ingresa un alias para la solicitud');
      return;
    }
    
    if (!formData.numeroRadicado.trim()) {
      alert('⚠️ Por favor ingresa el número de radicado');
      return;
    }
    
    // Simular creación exitosa con más detalle
    const confirmMsg = `✅ ¡Solicitud creada exitosamente!\n\n📋 Detalles de la solicitud:\n• Alias: ${formData.alias}\n• Número de Radicado: ${formData.numeroRadicado}\n• Frecuencia: ${formData.frecuencia}\n• ID Generado: SOL-${Date.now()}\n• Estado: Activa\n\n🔄 El sistema comenzará a monitorear este proceso según la frecuencia seleccionada.\n\n¿Deseas crear otra solicitud?`;
    
    const createAnother = confirm(confirmMsg);
    
    if (!createAnother) {
      // Reset formulario
      setFormData({ alias: '', numeroRadicado: '', frecuencia: 'diario' });
      setValidationState('idle');
      setValidationMessage('');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 0',
        marginBottom: '32px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              boxShadow: '0 4px 12px rgba(250, 204, 21, 0.3)'
            }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>⚡</span>
            </div>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '24px', 
                fontWeight: '700',
                color: '#1e293b'
              }}>
                ConsultaJudicial RPA
              </h1>
              <p style={{ 
                margin: 0, 
                fontSize: '12px',
                color: '#64748b'
              }}>
                Sistema de Automatización de Procesos
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#f0fdf4',
              borderRadius: '20px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                backgroundColor: '#10b981', 
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
              <span style={{ 
                fontSize: '14px', 
                color: '#16a34a',
                fontWeight: '500'
              }}>
                Sistema Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
            🏠 Inicio
          </span>
          <span style={{ margin: '0 12px', color: '#cbd5e1' }}>→</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#facc15', fontWeight: '500' }}>
            🧪 Test de Solicitudes
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
            🧪 Test de Solicitudes
          </h2>
          <p style={{ 
            margin: 0, 
            fontSize: '18px',
            color: '#64748b',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Sistema básico funcionando sin dependencias externas. Prueba todas las funcionalidades del formulario en tiempo real.
          </p>
        </div>

        {/* Status Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s ease'
          }}>
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>✅</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>React Funcional</div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Sistema cargado correctamente</div>
          </div>
          
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>🎯</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>Validación Activa</div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Verificación en tiempo real</div>
          </div>
          
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #facc15, #eab308)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>🔄</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>Estados Reactivos</div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Actualizaciones instantáneas</div>
          </div>
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
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '24px', 
              fontWeight: '600',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              📝 Nueva Solicitud de Consulta
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '16px',
              color: '#64748b',
              lineHeight: '1.5'
            }}>
              Complete los campos para crear una nueva solicitud de proceso judicial
            </p>
          </div>

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
                📋 Alias de la Solicitud
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
                🔢 Número de Radicado
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
                📅 Frecuencia de Notificación
              </label>
              <SimpleFrequencySelector
                value={formData.frecuencia}
                onChange={(value) => setFormData({...formData, frecuencia: value})}
              />
            </div>

            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '20px 32px',
                background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                color: '#1e293b',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 4px 15px rgba(250, 204, 21, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(250, 204, 21, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(250, 204, 21, 0.3)';
              }}
            >
              🚀 Crear Solicitud
            </button>
          </form>
        </div>

        {/* State Display */}
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h4 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            🔍 Estado del formulario en tiempo real:
          </h4>
          <pre style={{ 
            fontSize: '14px',
            backgroundColor: '#0f172a',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '12px',
            overflow: 'auto',
            margin: 0,
            fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
            border: '1px solid #334155'
          }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
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
            📚 Instrucciones de Prueba:
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '16px',
            color: '#1e40af'
          }}>
            <div>
              <strong>📝 Alias:</strong> Escribe cualquier texto descriptivo para identificar tu solicitud
            </div>
            <div>
              <strong>🎯 Validación:</strong> Escribe menos de 10 caracteres para ver error, más de 10 para ver éxito
            </div>
            <div>
              <strong>📅 Frecuencia:</strong> Haz clic en las opciones para ver cambios visuales inmediatos
            </div>
            <div>
              <strong>🚀 Submit:</strong> Completa el formulario y envía para ver confirmación detallada
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default TestSolicitudesPage;
