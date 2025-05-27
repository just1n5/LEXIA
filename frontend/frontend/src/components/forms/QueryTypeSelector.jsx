import React from 'react';
import { Search, Filter, Check } from 'lucide-react';

const QueryTypeSelector = ({ selectedType, onSelect }) => {
  const options = [
    {
      id: 'simple',
      title: 'Consulta Sencilla',
      description: 'Búsqueda rápida utilizando únicamente el número de radicado.',
      icon: Search,
      features: [
        'Búsqueda por número de radicado',
        'Configuración de frecuencia de notificación',
        'Notificaciones por correo electrónico'
      ]
    },
    {
      id: 'advanced',
      title: 'Consulta Avanzada',
      description: 'Búsqueda detallada con múltiples criterios de filtrado.',
      icon: Filter,
      features: [
        'Búsqueda por número de radicado o nombre/razón social',
        'Filtros por departamento, ciudad y especialidad',
        'Opciones avanzadas de configuración',
        'Notificaciones personalizadas'
      ]
    }
  ];

  const handleSelect = (optionId) => {
    onSelect(optionId);
  };

  return (
    <div className="option-cards">
      {options.map((option) => {
        const IconComponent = option.icon;
        const isSelected = selectedType === option.id;
        
        return (
          <div 
            key={option.id}
            className={`option-card ${isSelected ? 'selected' : ''}`}
            onClick={() => handleSelect(option.id)}
          >
            <div className="option-icon">
              <IconComponent size={32} />
            </div>
            
            <h3 className="option-title">{option.title}</h3>
            <p className="option-description">{option.description}</p>
            
            <div className="option-features">
              {option.features.map((feature, index) => (
                <div key={index} className="option-feature">
                  <Check size={16} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <button 
              className="btn btn-primary continue-button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option.id);
              }}
            >
              Seleccionar
            </button>
          </div>
        );
      })}
      
      <style jsx>{`
        .option-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-xl, 1.5rem);
          margin-bottom: var(--spacing-xl, 1.5rem);
        }
        
        .option-card {
          background-color: var(--color-bg-canvas, #ffffff);
          border-radius: var(--border-radius-md, 0.5rem);
          border: 2px solid var(--color-border-default, #e5e7eb);
          padding: var(--spacing-xl, 1.5rem);
          text-align: center;
          cursor: pointer;
          transition: var(--transition-default, all 0.2s ease-in-out);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .option-card:hover {
          border-color: var(--color-interactive-default, #facc15);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
          transform: translateY(-4px);
        }
        
        .option-card.selected {
          border-color: var(--color-interactive-default, #facc15);
          background-color: rgba(250, 204, 21, 0.1);
        }
        
        .option-icon {
          width: 64px;
          height: 64px;
          background-color: var(--color-bg-light, #f9fafb);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--spacing-lg, 1.25rem);
          color: var(--color-interactive-default, #facc15);
        }
        
        .option-title {
          font-size: var(--font-heading-h3, 1.5rem);
          font-weight: 600;
          margin-bottom: var(--spacing-md, 1rem);
          color: var(--color-text-base, #111827);
        }
        
        .option-description {
          color: var(--color-text-secondary, #6b7280);
          margin-bottom: var(--spacing-xl, 1.5rem);
        }
        
        .option-features {
          text-align: left;
          width: 100%;
          margin-bottom: var(--spacing-lg, 1.25rem);
        }
        
        .option-feature {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-sm, 0.5rem);
          color: var(--color-text-primary, #374151);
        }
        
        .option-feature svg {
          color: var(--color-interactive-default, #facc15);
          margin-right: var(--spacing-sm, 0.5rem);
          flex-shrink: 0;
        }
        
        .continue-button {
          margin-top: auto;
        }
        
        @media (max-width: 768px) {
          .option-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default QueryTypeSelector;
