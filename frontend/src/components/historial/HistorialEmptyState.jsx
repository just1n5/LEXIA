import React from 'react'
import { Search, Filter, FileSearch, Clock, RefreshCw, Plus } from 'lucide-react'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'

/**
 * Componente de estados vacíos inteligentes para el historial
 * Maneja diferentes scenarios: sin historial, filtros sin resultados, etc.
 */
const HistorialEmptyState = ({
  type = 'empty',
  hasFilters = false,
  hasSearchTerm = false,
  searchTerm = '',
  onClearFilters = () => {},
  onCreateSolicitud = () => {},
  onRefresh = () => {},
  className = '',
  ...props
}) => {

  // Estados diferentes según el scenario
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'noHistorial':
        return {
          icon: <Clock className="w-16 h-16 text-gray-300" />,
          title: '¡Bienvenido al Historial!',
          description: 'Aún no tienes consultas registradas. Crea tu primera solicitud para comenzar a ver el historial de resultados.',
          actions: [
            {
              label: 'Crear Primera Solicitud',
              variant: 'primary',
              icon: <Plus className="w-4 h-4" />,
              onClick: onCreateSolicitud
            }
          ],
          tips: [
            'Las consultas automáticas aparecerán aquí según su frecuencia configurada',
            'Podrás ver detalles completos y descargar PDFs de cada resultado',
            'El historial mantiene un registro completo de todas tus consultas'
          ]
        }

      case 'filtrosEmpty':
        return {
          icon: <Filter className="w-16 h-16 text-gray-300" />,
          title: 'Sin resultados con los filtros aplicados',
          description: hasSearchTerm 
            ? `No se encontraron resultados para "${searchTerm}" con los filtros actuales.`
            : 'Los filtros aplicados no coinciden con ningún resultado en el historial.',
          actions: [
            {
              label: 'Limpiar Filtros',
              variant: 'primary',
              icon: <RefreshCw className="w-4 h-4" />,
              onClick: onClearFilters
            },
            {
              label: 'Actualizar Historial',
              variant: 'secondary',
              icon: <RefreshCw className="w-4 h-4" />,
              onClick: onRefresh
            }
          ],
          tips: [
            'Intenta ampliar el rango de fechas',
            'Selecciona "Todas las solicitudes" para ver más resultados',
            'Verifica que los términos de búsqueda estén escritos correctamente'
          ]
        }

      case 'searchEmpty':
        return {
          icon: <Search className="w-16 h-16 text-gray-300" />,
          title: 'Sin resultados de búsqueda',
          description: `No se encontraron resultados para "${searchTerm}". Intenta con otros términos o revisa la ortografía.`,
          actions: [
            {
              label: 'Limpiar Búsqueda',
              variant: 'primary',
              icon: <RefreshCw className="w-4 h-4" />,
              onClick: onClearFilters
            }
          ],
          tips: [
            'Puedes buscar por nombre de solicitud, número de radicado, despacho o partes',
            'La búsqueda no distingue entre mayúsculas y minúsculas',
            'Intenta con términos más generales'
          ]
        }

      case 'error':
        return {
          icon: <FileSearch className="w-16 h-16 text-red-300" />,
          title: 'Error al cargar el historial',
          description: 'Ocurrió un problema al cargar los datos del historial. Por favor, intenta nuevamente.',
          actions: [
            {
              label: 'Reintentar',
              variant: 'primary',
              icon: <RefreshCw className="w-4 h-4" />,
              onClick: onRefresh
            }
          ],
          tips: [
            'Verifica tu conexión a internet',
            'Si el problema persiste, contacta al soporte técnico'
          ]
        }

      case 'loading':
        return {
          icon: (
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          ),
          title: 'Cargando historial...',
          description: 'Obteniendo los resultados de tus consultas.',
          actions: [],
          tips: []
        }

      default: // 'empty'
        return {
          icon: <FileSearch className="w-16 h-16 text-gray-300" />,
          title: 'No hay resultados',
          description: 'No se encontraron resultados en el historial.',
          actions: [
            {
              label: 'Actualizar',
              variant: 'secondary',
              icon: <RefreshCw className="w-4 h-4" />,
              onClick: onRefresh
            }
          ],
          tips: []
        }
    }
  }

  const config = getEmptyStateConfig()

  return (
    <div className={cn('text-center py-12 px-6', className)} {...props}>
      {/* Icono */}
      <div className="flex justify-center mb-6">
        {config.icon}
      </div>

      {/* Título */}
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {config.title}
      </h3>

      {/* Descripción */}
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        {config.description}
      </p>

      {/* Acciones */}
      {config.actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          {config.actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              onClick={action.onClick}
              icon={action.icon}
              className="min-w-fit"
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Tips útiles */}
      {config.tips.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips útiles:</h4>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            {config.tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Preset components para casos comunes
HistorialEmptyState.NoHistorial = (props) => (
  <HistorialEmptyState type="noHistorial" {...props} />
)

HistorialEmptyState.FiltrosEmpty = (props) => (
  <HistorialEmptyState type="filtrosEmpty" hasFilters={true} {...props} />
)

HistorialEmptyState.SearchEmpty = (props) => (
  <HistorialEmptyState type="searchEmpty" hasSearchTerm={true} {...props} />
)

HistorialEmptyState.Error = (props) => (
  <HistorialEmptyState type="error" {...props} />
)

HistorialEmptyState.Loading = (props) => (
  <HistorialEmptyState type="loading" {...props} />
)

HistorialEmptyState.displayName = 'HistorialEmptyState'

export default HistorialEmptyState
