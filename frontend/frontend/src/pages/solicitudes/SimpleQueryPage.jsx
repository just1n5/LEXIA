import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSolicitudes } from '../../hooks/useSolicitudes';
import { useToast } from '../../hooks/useToast';
import SimpleQueryForm from '../../components/forms/SimpleQueryForm';

const SimpleQueryPage = () => {
  const navigate = useNavigate();
  const { createSolicitud, loading } = useSolicitudes();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (formData) => {
    try {
      await createSolicitud(formData);
      showSuccess('¡Solicitud creada exitosamente!');
      
      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      showError('Error al crear la solicitud. Por favor intenta nuevamente.');
      console.error('Error creating solicitud:', error);
    }
  };

  return (
    <main className="container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/dashboard">Mis solicitudes</a>
        <span className="breadcrumb-separator">/</span>
        <a href="/solicitudes/select-type">Nueva solicitud</a>
        <span className="breadcrumb-separator">/</span>
        <span>Consulta simple</span>
      </div>
      
      <h1 className="page-title">Configura tu consulta simple</h1>
      <p className="form-description">
        Ingresa el número de radicado y selecciona la frecuencia de notificación.
      </p>
      
      <SimpleQueryForm 
        onSubmit={handleSubmit}
        loading={loading}
      />
      
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
        
        .form-description {
          color: var(--color-text-secondary, #6b7280);
          margin-top: var(--spacing-xs, 0.25rem);
          margin-bottom: var(--spacing-xl, 1.5rem);
          font-size: var(--font-body-paragraph, 1rem);
        }
      `}</style>
    </main>
  );
};

export default SimpleQueryPage;
