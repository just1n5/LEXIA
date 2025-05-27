import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { solicitudesService } from '../../services/solicitudes';
import ProcessInfo from '../../components/solicitudes/ProcessInfo';
import ExecutionHistory from '../../components/solicitudes/ExecutionHistory';

const SolicitudDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadSolicitud();
    }
  }, [id]);

  const loadSolicitud = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await solicitudesService.getSolicitudById(id);
      setSolicitud(data);
    } catch (err) {
      setError('Error cargando los detalles de la solicitud');
      console.error('Error loading solicitud:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando detalles de la solicitud...</p>
        </div>
      </main>
    );
  }

  if (error || !solicitud) {
    return (
      <main className="container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'Solicitud no encontrada'}</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            Volver al Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/dashboard">Mis solicitudes</a>
        <span className="breadcrumb-separator">/</span>
        <span>Detalles de la solicitud</span>
      </div>
      
      <h1 className="page-title">Detalles de la solicitud</h1>
      <p className="detail-description">
        Verifica los detalles de tu caso y su progreso.
      </p>
      
      {/* Banner Image */}
      <div className="banner-image"></div>
      
      {/* Process Information */}
      <ProcessInfo solicitud={solicitud} />
      
      {/* Execution History */}
      <ExecutionHistory solicitudId={id} />
      
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg, 1.25rem);
        }
        
        .breadcrumb {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-lg, 1.25rem);
          color: var(--color-text-secondary, #6b7280);
          font-size: var(--font-body-auxiliary, 0.875rem);
        }
        
        .breadcrumb a {
          color: var(--color-text-secondary, #6b7280);
          text-decoration: none;
        }
        
        .breadcrumb a:hover {
          color: var(--color-text-primary, #374151);
          text-decoration: underline;
        }
        
        .breadcrumb-separator {
          margin: 0 var(--spacing-xs, 0.25rem);
        }
        
        .page-title {
          font-size: var(--font-heading-h1, 2.25rem);
          font-weight: 700;
          margin-bottom: var(--spacing-xs, 0.25rem);
          color: var(--color-text-base, #111827);
        }
        
        .detail-description {
          color: var(--color-text-secondary, #6b7280);
          margin-top: var(--spacing-xs, 0.25rem);
          margin-bottom: var(--spacing-xl, 1.5rem);
          font-size: var(--font-body-paragraph, 1rem);
        }
        
        .banner-image {
          width: 100%;
          height: 220px;
          border-radius: var(--border-radius-md, 0.5rem);
          margin-bottom: var(--spacing-xl, 1.5rem);
          background-image: url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid var(--color-interactive-default, #facc15);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: var(--spacing-md, 1rem);
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }
        
        .error-container h2 {
          color: var(--color-feedback-error, #ef4444);
          margin-bottom: var(--spacing-md, 1rem);
        }
        
        .error-container p {
          color: var(--color-text-secondary, #6b7280);
          margin-bottom: var(--spacing-xl, 1.5rem);
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-sm, 0.5rem) var(--spacing-lg, 1.25rem);
          border-radius: var(--border-radius-sm, 0.375rem);
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition-default, all 0.2s ease-in-out);
          cursor: pointer;
          border: none;
        }
        
        .btn-primary {
          background-color: var(--color-interactive-default, #facc15);
          color: var(--color-text-base, #111827);
        }
        
        .btn-primary:hover {
          background-color: #eab308;
        }
      `}</style>
    </main>
  );
};

export default SolicitudDetailPage;
