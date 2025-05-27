import React, { useState, useEffect } from 'react';
import { FileText, Search, Mail, Eye } from 'lucide-react';
import { solicitudesService } from '../../services/solicitudes';

const ExecutionHistory = ({ solicitudId }) => {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (solicitudId) {
      loadResultados();
    }
  }, [solicitudId]);

  const loadResultados = async () => {
    setLoading(true);
    try {
      const data = await solicitudesService.getResultadosSolicitud(solicitudId, 0, 5);
      setResultados(data);
    } catch (error) {
      console.error('Error cargando resultados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreResultados = async () => {
    setLoading(true);
    try {
      const data = await solicitudesService.getResultadosSolicitud(solicitudId, resultados.length, 10);
      setResultados(prev => [...prev, ...data]);
      setShowMore(false);
    } catch (error) {
      console.error('Error cargando más resultados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHistoryEvents = () => [
    {
      icon: FileText,
      title: 'Solicitud creada',
      date: new Date().toISOString()
    },
    {
      icon: Search,
      title: 'Búsqueda Procesada',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      icon: Mail,
      title: 'Notificación Enviada',
      date: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
    }
  ];

  const getStatusBadge = (estado) => {
    const statusConfig = {
      'EXITOSA': { color: '#10b981', bg: '#dcfce7', text: 'Completado' },
      'FALLIDA': { color: '#ef4444', bg: '#fee2e2', text: 'Error' },
      'PENDIENTE': { color: '#f59e0b', bg: '#fef3c7', text: 'Pendiente' }
    };
    
    const config = statusConfig[estado] || statusConfig['PENDIENTE'];
    
    return (
      <span 
        className="execution-status"
        style={{ 
          backgroundColor: config.bg, 
          color: config.color 
        }}
      >
        {config.text}
      </span>
    );
  };

  return (
    <>
      {/* History Section */}
      <div className="detail-section">
        <h2 className="section-title">Historial</h2>
        
        <ul className="history-list">
          {getHistoryEvents().map((event, index) => {
            const IconComponent = event.icon;
            return (
              <li key={index} className="history-item">
                <div className="history-icon">
                  <IconComponent size={16} />
                </div>
                <div className="history-content">{event.title}</div>
                <div className="history-date">{formatDate(event.date)}</div>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Execution History */}
      <div className="detail-section">
        <h2 className="section-title">Historial de ejecución</h2>
        
        {loading && resultados.length === 0 ? (
          <div className="loading-state">Cargando historial...</div>
        ) : (
          <>
            <table className="execution-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Número de Radicado</th>
                  <th>Despacho</th>
                  <th>Resultados</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((resultado) => (
                  <tr key={resultado.id}>
                    <td>{formatDate(resultado.fecha_ejecucion)}</td>
                    <td>{getStatusBadge(resultado.estado_extraccion)}</td>
                    <td>{resultado.numero_radicado_completo}</td>
                    <td>{resultado.despacho_juzgado}</td>
                    <td>
                      <a href="#" className="view-results-btn">
                        <Eye size={16} className="mr-1" />
                        Ver Resultados
                      </a>
                    </td>
                  </tr>
                ))}
                {resultados.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#6b7280' }}>
                      No hay ejecuciones registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {resultados.length > 0 && (
              <button 
                className="see-more-btn"
                onClick={loadMoreResultados}
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Ver Más'}
              </button>
            )}
          </>
        )}
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
        
        .history-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .history-item {
          position: relative;
          padding-left: 36px;
          margin-bottom: var(--spacing-lg, 1.25rem);
        }
        
        .history-item::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 0;
          bottom: -20px;
          width: 2px;
          background-color: var(--color-border-default, #e5e7eb);
        }
        
        .history-item:last-child::before {
          display: none;
        }
        
        .history-icon {
          position: absolute;
          left: 0;
          top: 0;
          width: 22px;
          height: 22px;
          background-color: var(--color-bg-canvas, #ffffff);
          border: 2px solid var(--color-interactive-default, #facc15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
        
        .history-icon svg {
          color: var(--color-interactive-default, #facc15);
        }
        
        .history-content {
          margin-bottom: var(--spacing-xs, 0.25rem);
          font-weight: 500;
          color: var(--color-text-primary, #374151);
        }
        
        .history-date {
          font-size: var(--font-body-auxiliary, 0.875rem);
          color: var(--color-text-secondary, #6b7280);
        }
        
        .execution-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: var(--spacing-lg, 1.25rem);
        }
        
        .execution-table th {
          text-align: left;
          padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
          border-bottom: 1px solid var(--color-border-default, #e5e7eb);
          color: var(--color-text-secondary, #6b7280);
          font-weight: 500;
          font-size: var(--font-body-auxiliary, 0.875rem);
        }
        
        .execution-table td {
          padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
          border-bottom: 1px solid var(--color-border-default, #e5e7eb);
          color: var(--color-text-primary, #374151);
        }
        
        .execution-status {
          display: inline-block;
          padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
          border-radius: 4px;
          font-size: var(--font-body-auxiliary, 0.875rem);
          font-weight: 500;
        }
        
        .view-results-btn {
          display: inline-flex;
          align-items: center;
          color: var(--color-interactive-default, #facc15);
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition-default, all 0.2s ease-in-out);
        }
        
        .view-results-btn:hover {
          text-decoration: underline;
        }
        
        .see-more-btn {
          display: block;
          width: 100%;
          text-align: center;
          padding: var(--spacing-sm, 0.5rem) 0;
          background-color: var(--color-bg-light, #f9fafb);
          color: var(--color-text-secondary, #6b7280);
          border: none;
          border-radius: var(--border-radius-sm, 0.375rem);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition-default, all 0.2s ease-in-out);
          cursor: pointer;
        }
        
        .see-more-btn:hover:not(:disabled) {
          background-color: #e5e7eb;
        }
        
        .see-more-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .loading-state {
          text-align: center;
          padding: var(--spacing-xl, 1.5rem);
          color: var(--color-text-secondary, #6b7280);
        }
      `}</style>
    </>
  );
};

export default ExecutionHistory;
