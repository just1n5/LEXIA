import React from 'react';

const ProcessInfo = ({ solicitud }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (activa) => {
    return (
      <span className={`status-badge ${activa ? 'active' : 'inactive'}`}>
        {activa ? 'Activa' : 'Inactiva'}
      </span>
    );
  };

  return (
    <div className="detail-section">
      <h2 className="section-title">Información del proceso</h2>
      
      <div className="detail-grid">
        <div className="detail-item">
          <div className="detail-label">Número de radicado</div>
          <div className="detail-value">
            {solicitud.criterio_busqueda_radicado || 'No especificado'}
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Tipo de búsqueda</div>
          <div className="detail-value">
            {solicitud.tipo_busqueda === 'radicado' ? 'Por número de radicado' : 'Por nombre/razón social'}
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Nombre/Razón social</div>
          <div className="detail-value">
            {solicitud.criterio_busqueda_nombre || 'No especificado'}
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Frecuencia de Notificación</div>
          <div className="detail-value">
            {solicitud.frecuencia_envio?.charAt(0).toUpperCase() + solicitud.frecuencia_envio?.slice(1)}
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Fecha de creación</div>
          <div className="detail-value">
            {formatDate(solicitud.fecha_creacion)}
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Estado de la solicitud</div>
          <div className="detail-value">
            {getStatusBadge(solicitud.activa)}
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Última ejecución</div>
          <div className="detail-value">
            {formatDate(solicitud.ultima_ejecucion)}
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-label">Alias</div>
          <div className="detail-value">
            {solicitud.alias}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .detail-section {
          margin-bottom: var(--spacing-2xl, 2rem);
        }
        
        .section-title {
          font-size: var(--font-heading-h3, 1.5rem);
          font-weight: 600;
          margin-bottom: var(--spacing-lg, 1.25rem);
          color: var(--color-text-base, #111827);
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-lg, 1.25rem);
        }
        
        .detail-item {
          margin-bottom: var(--spacing-lg, 1.25rem);
        }
        
        .detail-label {
          font-size: var(--font-body-auxiliary, 0.875rem);
          color: var(--color-text-secondary, #6b7280);
          margin-bottom: var(--spacing-xs, 0.25rem);
        }
        
        .detail-value {
          font-size: var(--font-body-paragraph, 1rem);
          color: var(--color-text-primary, #374151);
          font-weight: 500;
        }
        
        .status-badge {
          display: inline-block;
          padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
          border-radius: 20px;
          font-weight: 500;
          font-size: var(--font-body-auxiliary, 0.875rem);
        }
        
        .status-badge.active {
          background-color: var(--color-feedback-success-light, #dcfce7);
          color: var(--color-feedback-success, #16a34a);
        }
        
        .status-badge.inactive {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProcessInfo;
