// Página de prueba básica para solicitudes SIN dependencias externas
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

    // Simulación de validación simple
    if (value.length === 0) {
      setValidationState('idle');
      setValidationMessage('');
    } else if (value.length < 5) {
      setValidationState('error');
      setValidationMessage('Muy corto');
    } else {
      setValidationState('valid');
      setValidationMessage('Válido');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Datos: ${JSON.stringify(formData, null, 2)}`);
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const formCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    padding: '24px',
    marginBottom: '24px'
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    fontWeight: '500',
    marginBottom: '4px',
    color: '#374151'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '16px',
    transition: 'all 0.2s ease-in-out'
  };

  const buttonStyle = {
    backgroundColor: '#facc15',
    color: '#111827',
    padding: '8px 20px',
    borderRadius: '6px',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px'
  };

  return (
    <div style={containerStyle}>
      <h1>🧪 Test de Solicitudes</h1>
      <p>Sistema básico funcionando sin dependencias externas</p>
      
      <div style={formCardStyle}>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Alias</label>
            <input
              style={inputStyle}
              type="text"
              value={formData.alias}
              onChange={(e) => setFormData({...formData, alias: e.target.value})}
              placeholder="Nombre descriptivo"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Número de Radicado</label>
            <input
              style={inputStyle}
              type="text"
              value={formData.numeroRadicado}
              onChange={handleRadicadoChange}
              placeholder="Ej: 2024-CV-123456"
            />
            <SimpleValidationMessage 
              state={validationState}
              message={validationMessage}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Frecuencia</label>
            <SimpleFrequencySelector
              value={formData.frecuencia}
              onChange={(value) => setFormData({...formData, frecuencia: value})}
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Crear Solicitud
          </button>
        </form>
      </div>

      <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
        <h3>Estado del formulario:</h3>
        <pre style={{ fontSize: '12px' }}>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default TestSolicitudesPage;
