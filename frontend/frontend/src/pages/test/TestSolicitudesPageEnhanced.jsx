// Página de test mejorada con diseño consistente
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

    // Simulación de validación
    if (value.length === 0) {
      setValidationState('idle');
      setValidationMessage('');
    } else if (value.length < 10) {
      setValidationState('validating');
      setValidationMessage('Validando formato...');
      
      setTimeout(() => {
        setValidationState('error');
        setValidationMessage('Formato incompleto. Debe tener al menos 10 caracteres');
      }, 1000);
    } else {
      setValidationState('validating');
      setValidationMessage('Validando número de radicado...');
      
      setTimeout(() => {
        setValidationState('valid');
        setValidationMessage('✓ Número de radicado válido');
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
    
    // Simular creación exitosa
    alert(`✅ ¡Solicitud creada exitosamente!\n\n📋 Detalles:\n• Alias: ${formData.alias}\n• Radicado: ${formData.numeroRadicado}\n• Frecuencia: ${formData.frecuencia}\n\n🔄 Redirigiendo al dashboard...`);
    
    // Reset formulario
    setFormData({ alias: '', numeroRadicado: '', frecuencia: 'diario' });
    setValidationState('idle');
    setValidationMessage('');
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
        marginBottom: '32px'
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
              width: '32px',
              height: '32px',
              backgroundColor: '#facc15',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>⚡</span>
            </div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: '700',
              color: '#1e293b'
            }}>
              ConsultaJudicial RPA
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ 
              fontSize: '14px', 
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                backgroundColor: '#10b981', 
                borderRadius: '50%' 
              }}></span>
              Sistema funcionando
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          <span>🏠 Inicio</span>
          <span style={{ margin: '0 8px' }}>→</span>
          <span>🧪 Test de Solicitudes</span>
        </div>

        {/* Page Title */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '32px', 
            fontWeight: '700',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            🧪 Test de Solicitudes
          </h2>
          <p style={{ 
            margin: 0, 
            fontSize: '16px',
            color: '#64748b',
            lineHeight: '1.5'
          }}>
            Sistema básico funcionando sin dependencias externas. Prueba todas las funcionalidades del formulario.
          </p>
        </div>

        {/* Status Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>React Funcional</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Sistema cargado</div>
          </div>
          
          <div style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Validación Activa</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Tiempo real</div>
          </div>
          
          <div style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔄</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Estados Reactivos</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Live updates</div>
          </div>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              margin: '0 0 8px 0', 
              fontSize: '20px', 
              fontWeight: '600',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📝 Nueva Solicitud de Consulta
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '14px',
              color: '#64748b'
            }}>
              Complete los campos para crear una nueva solicitud de proceso judicial
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                📋 Alias de la Solicitud
              </label>
              <input
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#ffffff',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                type="text"
                value={formData.alias}
                onChange={(e) => setFormData({...formData, alias: e.target.value})}
                placeholder="Ej: Caso Familia García, Demanda Empresa XYZ..."
                onFocus={(e) => e.target.style.borderColor = '#facc15'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <div style={{ 
                fontSize: '12px', 
                color: '#64748b', 
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                💡 Un nombre que te ayude a identificar fácilmente esta solicitud
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                🔢 Número de Radicado
              </label>
              <input
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${
                    validationState === 'validating' ? '#3b82f6' :
                    validationState === 'valid' ? '#10b981' :
                    validationState === 'error' ? '#ef4444' :
                    '#e2e8f0'
                  }`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#ffffff',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                type="text"
                value={formData.numeroRadicado}
                onChange={handleRadicadoChange}
                placeholder="Ej: 2024-CV-123456"
                onFocus={(e) => {
                  if (validationState === 'idle') {
                    e.target.style.borderColor = '#facc15';
                  }
                }}
                onBlur={(e) => {
                  if (validationState === 'idle') {
                    e.target.style.borderColor = '#e2e8f0';
                  }
                }}
              />
              <SimpleValidationMessage 
                state={validationState}
                message={validationMessage}
              />
              <div style={{ 
                fontSize: '12px', 
                color: '#64748b', 
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                🎯 Ingresa el número de radicado completo del proceso judicial
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px'
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
                padding: '16px 24px',
                backgroundColor: '#facc15',
                color: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#eab308';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#facc15';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🚀 Crear Solicitud
            </button>
          </form>
        </div>

        {/* State Display */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px'
        }}>
          <h4 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🔍 Estado del formulario en tiempo real:
          </h4>
          <pre style={{ 
            fontSize: '13px',
            backgroundColor: '#1e293b',
            color: '#e2e8f0',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
            margin: 0,
            fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace'
          }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>

        {/* Instructions */}
        <div style={{
          backgroundColor: '#dbeafe',
          border: '1px solid #93c5fd',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px'
        }}>
          <h4 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📚 Instrucciones de Prueba:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e40af' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Alias:</strong> Escribe cualquier texto descriptivo
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Validación:</strong> Escribe menos de 10 caracteres para ver error, más de 10 para ver éxito
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Frecuencia:</strong> Haz clic en las opciones para ver cambios visuales
            </li>
            <li>
              <strong>Submit:</strong> Completa el formulario y envía para ver confirmación
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestSolicitudesPage;
