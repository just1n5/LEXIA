import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QueryTypeSelector from '../../components/forms/QueryTypeSelector';

const SelectQueryTypePage = () => {
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    
    // Navegar según el tipo seleccionado
    if (type === 'simple') {
      navigate('/solicitudes/simple');
    } else if (type === 'advanced') {
      navigate('/solicitudes/advanced');
    }
  };

  return (
    <main className="container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/dashboard">Mis solicitudes</a>
        <span className="breadcrumb-separator">/</span>
        <span>Nueva solicitud</span>
      </div>
      
      <h1 className="page-title">Selecciona el tipo de consulta</h1>
      <p className="page-description">
        Elige el tipo de consulta que deseas realizar según tus necesidades.
      </p>
      
      <QueryTypeSelector 
        selectedType={selectedType}
        onSelect={handleTypeSelect}
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
        
        .page-description {
          color: var(--color-text-secondary, #6b7280);
          margin-top: var(--spacing-xs, 0.25rem);
          margin-bottom: var(--spacing-xl, 1.5rem);
          font-size: var(--font-body-paragraph, 1rem);
        }
      `}</style>
    </main>
  );
};

export default SelectQueryTypePage;
