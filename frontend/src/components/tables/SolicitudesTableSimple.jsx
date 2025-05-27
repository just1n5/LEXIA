// Tabla de solicitudes simplificada SIN dependencias complejas
import React, { useState } from 'react';

const SolicitudesTableSimple = ({ solicitudes = [] }) => {
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const handleDeleteClick = (solicitud) => {
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar "${solicitud.alias}"?`);
    if (confirmDelete) {
      console.log('Eliminando solicitud:', solicitud.id);
      alert('Solicitud eliminada (simulación)');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return 'Fecha inválida';
    }
  };

  const getStatusBadge = (activa) => {
    return (
      <span 
        style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: activa ? '#dcfce7' : '#fef3c7',
          color: activa ? '#16a34a' : '#92400e'
        }}
      >
        {activa ? 'Activa' : 'Inactiva'}
      </span>
    );
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const thStyle = {
    backgroundColor: '#f9fafb',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '500',
    color: '#374151',
    borderBottom: '1px solid #e5e7eb'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    color: '#6b7280'
  };

  const buttonStyle = {
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    marginRight: '8px',
    fontSize: '14px'
  };

  const viewButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    color: '#ffffff'
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#facc15',
    color: '#111827'
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ef4444',
    color: '#ffffff'
  };

  // Datos mock si no hay solicitudes
  const displaySolicitudes = solicitudes.length > 0 ? solicitudes : [
    {
      id: '1',
      alias: 'Solicitud de Prueba',
      tipo_busqueda: 'radicado',
      criterio_busqueda_radicado: '2024-CV-123456',
      frecuencia_envio: 'diario',
      fecha_creacion: new Date().toISOString(),
      activa: true
    },
    {
      id: '2',
      alias: 'Caso Familia García',
      tipo_busqueda: 'nombre_razon_social',
      criterio_busqueda_nombre: 'García Pérez Juan Carlos',
      frecuencia_envio: 'semanal',
      fecha_creacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      activa: true
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#111827' }}>📋 Mis Solicitudes</h2>
        <p style={{ margin: 0, color: '#6b7280' }}>
          {displaySolicitudes.length} solicitud(es) encontrada(s)
        </p>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Alias</th>
            <th style={thStyle}>Tipo de Búsqueda</th>
            <th style={thStyle}>Criterio</th>
            <th style={thStyle}>Frecuencia</th>
            <th style={thStyle}>Fecha Creación</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {displaySolicitudes.map((solicitud) => (
            <tr key={solicitud.id}>
              <td style={{...tdStyle, fontWeight: '500', color: '#111827'}}>
                {solicitud.alias}
              </td>
              <td style={tdStyle}>
                {solicitud.tipo_busqueda === 'radicado' ? 'Por Radicado' : 'Por Nombre'}
              </td>
              <td style={tdStyle}>
                {solicitud.criterio_busqueda_radicado || solicitud.criterio_busqueda_nombre || 'N/A'}
              </td>
              <td style={tdStyle}>
                {solicitud.frecuencia_envio?.charAt(0).toUpperCase() + solicitud.frecuencia_envio?.slice(1)}
              </td>
              <td style={tdStyle}>
                {formatDate(solicitud.fecha_creacion)}
              </td>
              <td style={tdStyle}>
                {getStatusBadge(solicitud.activa)}
              </td>
              <td style={tdStyle}>
                <button 
                  style={viewButtonStyle}
                  onClick={() => alert(`Ver detalles de: ${solicitud.alias}`)}
                >
                  👁️ Ver
                </button>
                <button 
                  style={editButtonStyle}
                  onClick={() => alert(`Editar: ${solicitud.alias}`)}
                >
                  ✏️ Editar
                </button>
                <button 
                  style={deleteButtonStyle}
                  onClick={() => handleDeleteClick(solicitud)}
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {displaySolicitudes.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#6b7280'
        }}>
          <p>No hay solicitudes disponibles</p>
          <button
            style={{
              backgroundColor: '#facc15',
              color: '#111827',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => alert('Redirigir a crear nueva solicitud')}
          >
            ➕ Crear Primera Solicitud
          </button>
        </div>
      )}
    </div>
  );
};

export default SolicitudesTableSimple;
