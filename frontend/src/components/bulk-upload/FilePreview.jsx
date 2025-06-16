import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import Badge from '../ui/Badge';
import { cn } from '../../utils/cn';

/**
 * Componente para mostrar vista previa de los datos del archivo Excel
 * Muestra las primeras filas con indicadores de validación
 */
const FilePreview = ({ 
  data = [], 
  validation = {},
  maxRows = 10,
  className = '',
  ...props 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-lg text-text-secondary">
        <Info size={32} className="mx-auto mb-sm opacity-50" />
        <p className="text-body-paragraph">No hay datos para mostrar</p>
      </div>
    );
  }

  const displayData = data.slice(0, maxRows);
  const hasMoreRows = data.length > maxRows;

  const getRowStatusBadge = (row) => {
    if (row.valid) {
      return <Badge.Success size="sm">Válido</Badge.Success>;
    } else {
      return <Badge.Error size="sm">Error</Badge.Error>;
    }
  };

  const getRowStatusIcon = (row) => {
    if (row.valid) {
      return <CheckCircle size={16} className="text-feedback-success" />;
    } else {
      return <AlertTriangle size={16} className="text-feedback-error" />;
    }
  };

  return (
    <div className={cn('space-y-md', className)} {...props}>
      {/* Header con estadísticas */}
      <div className="flex items-center justify-between pb-sm border-b border-border-default">
        <h4 className="text-heading-h4 font-heading text-text-primary">
          Primeras {displayData.length} filas
        </h4>
        <div className="flex items-center gap-sm text-body-auxiliary text-text-secondary">
          <span>{validation.validRows || 0} válidas</span>
          <span>•</span>
          <span>{validation.invalidRows || 0} con errores</span>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="overflow-x-auto rounded-lg border border-border-default">
        <table className="min-w-full">
          <thead className="bg-bg-light">
            <tr>
              <th className="px-sm py-sm text-left text-body-auxiliary font-medium text-text-secondary border-b border-border-default">
                Fila
              </th>
              <th className="px-sm py-sm text-left text-body-auxiliary font-medium text-text-secondary border-b border-border-default">
                Número de Radicado
              </th>
              <th className="px-sm py-sm text-left text-body-auxiliary font-medium text-text-secondary border-b border-border-default">
                Descripción
              </th>
              <th className="px-sm py-sm text-center text-body-auxiliary font-medium text-text-secondary border-b border-border-default">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-bg-canvas">
            {displayData.map((row, index) => (
              <tr 
                key={index}
                className={cn(
                  'border-b border-border-default transition-colors',
                  row.valid 
                    ? 'hover:bg-feedback-success-light hover:bg-opacity-30' 
                    : 'hover:bg-feedback-error-light hover:bg-opacity-30'
                )}
              >
                {/* Número de fila */}
                <td className="px-sm py-sm text-body-auxiliary text-text-secondary">
                  <div className="flex items-center gap-xs">
                    {getRowStatusIcon(row)}
                    <span>{row.rowNumber}</span>
                  </div>
                </td>
                
                {/* Número de radicado */}
                <td className="px-sm py-sm">
                  <div className="space-y-xs">
                    <span className={cn(
                      'text-body-paragraph font-mono',
                      row.valid ? 'text-text-primary' : 'text-feedback-error'
                    )}>
                      {row.radicado || (
                        <span className="italic text-text-secondary">Sin radicado</span>
                      )}
                    </span>
                    {!row.valid && row.error && (
                      <p className="text-body-auxiliary text-feedback-error">
                        {row.error}
                      </p>
                    )}
                  </div>
                </td>
                
                {/* Descripción */}
                <td className="px-sm py-sm text-body-paragraph text-text-base">
                  {row.descripcion ? (
                    <span className="line-clamp-2">{row.descripcion}</span>
                  ) : (
                    <span className="italic text-text-secondary">Sin descripción</span>
                  )}
                </td>
                
                {/* Estado */}
                <td className="px-sm py-sm text-center">
                  {getRowStatusBadge(row)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer con información adicional */}
      <div className="flex items-center justify-between pt-sm border-t border-border-default">
        <div className="text-body-auxiliary text-text-secondary">
          {hasMoreRows && (
            <span>
              Mostrando {displayData.length} de {data.length} registros
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-md text-body-auxiliary">
          <div className="flex items-center gap-xs">
            <CheckCircle size={14} className="text-feedback-success" />
            <span className="text-feedback-success">
              {displayData.filter(row => row.valid).length} válidas
            </span>
          </div>
          <div className="flex items-center gap-xs">
            <AlertTriangle size={14} className="text-feedback-error" />
            <span className="text-feedback-error">
              {displayData.filter(row => !row.valid).length} con errores
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;