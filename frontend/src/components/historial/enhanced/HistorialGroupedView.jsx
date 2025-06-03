import React, { useState, useCallback } from 'react'
import { Calendar, ChevronDown, ChevronRight, Clock, Building, AlertCircle, CheckCircle, XCircle, Eye, Download, RefreshCw, MoreVertical } from 'lucide-react'
import { cn } from '../../../utils/cn'
import Button from '../../ui/Button'
import Badge from '../../ui/Badge'

/**
 * 📅 HISTORIAL GROUPED VIEW - Agrupación Temporal Inteligente
 * Organiza los datos por grupos temporales o categóricos para mejor navegación
 */
const HistorialGroupedView = ({
  groupedData = {},
  groupBy = 'date',
  onViewDetails = () => {},
  onDownload = () => {},
  onRerun = () => {},
  selectedItems = new Set(),
  onSelectionChange = () => {},
  onBulkAction = () => {},
  density = 'comfortable',
  isLoading = false,
  isFetching = false,
  className = '',
  ...props
}) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set(['hoy', 'ayer']))

  // 🏷️ Configuración de grupos por tipo
  const getGroupConfig = useCallback((groupKey, items) => {
    const itemCount = items?.length || 0

    switch (groupBy) {
      case 'date':
        const dateConfigs = {
          hoy: {
            title: 'Hoy',
            subtitle: `${itemCount} consulta${itemCount !== 1 ? 's' : ''}`,
            icon: Clock,
            color: 'text-interactive-default',
            priority: 1,
            defaultExpanded: true
          },
          ayer: {
            title: 'Ayer', 
            subtitle: `${itemCount} consulta${itemCount !== 1 ? 's' : ''}`,
            icon: Calendar,
            color: 'text-text-primary',
            priority: 2,
            defaultExpanded: true
          },
          esta_semana: {
            title: 'Esta semana',
            subtitle: `${itemCount} consulta${itemCount !== 1 ? 's' : ''}`,
            icon: Calendar,
            color: 'text-text-secondary',
            priority: 3,
            defaultExpanded: false
          },
          este_mes: {
            title: 'Este mes',
            subtitle: `${itemCount} consulta${itemCount !== 1 ? 's' : ''}`, 
            icon: Calendar,
            color: 'text-text-secondary',
            priority: 4,
            defaultExpanded: false
          },
          anterior: {
            title: 'Anteriores',
            subtitle: `${itemCount} consulta${itemCount !== 1 ? 's' : ''} más antigua${itemCount !== 1 ? 's' : ''}`,
            icon: Calendar,
            color: 'text-text-secondary',
            priority: 5,
            defaultExpanded: false
          }
        }
        return dateConfigs[groupKey] || dateConfigs.anterior

      case 'status':
        const statusConfigs = {
          exitoso: {
            title: 'Exitosas',
            subtitle: `${itemCount} consulta${itemCount !== 1 ? 's' : ''} exitosa${itemCount !== 1 ? 's' : ''}`,
            icon: CheckCircle,
            color: 'text-feedback-success',
            priority: 1,
            defaultExpanded: true
          },
          error_captcha: {
            title: 'Error de Captcha',
            subtitle: `${itemCount} consulta${itemCount !== 1 ? 's' : ''} con error de captcha`,
            icon: AlertCircle,
            color: 'text-feedback-warning',
            priority: 2,
            defaultExpanded: true
          },
          error_sistema: {
            title: 'Error de Sistema',
            subtitle: `${itemCount} consulta${itemCount !== 1 ? 's' : ''} con error del sistema`,
            icon: XCircle,
            color: 'text-feedback-error',
            priority: 3,
            defaultExpanded: true
          },
          pendiente: {
            title: 'Pendientes',
            subtitle: `${itemCount} consulta${itemCount !== 1 ? 's' : ''} pendiente${itemCount !== 1 ? 's' : ''}`,
            icon: Clock,
            color: 'text-feedback-info',
            priority: 4,
            defaultExpanded: false
          }
        }
        return statusConfigs[groupKey] || {
          title: 'Sin Estado',
          subtitle: `${itemCount} sin estado definido`,
          icon: AlertCircle,
          color: 'text-text-secondary',
          priority: 5,
          defaultExpanded: false
        }

      case 'despacho':
        return {
          title: groupKey === 'sin_despacho' ? 'Sin Despacho' : groupKey,
          subtitle: `${itemCount} consulta${itemCount !== 1 ? 's' : ''}`,
          icon: Building,
          color: 'text-text-primary',
          priority: 1,
          defaultExpanded: false
        }

      default:
        return {
          title: groupKey,
          subtitle: `${itemCount} elemento${itemCount !== 1 ? 's' : ''}`,
          icon: Calendar,
          color: 'text-text-primary',
          priority: 1,
          defaultExpanded: false
        }
    }
  }, [groupBy])

  // 🔄 Toggle de expansión de grupos
  const toggleGroup = useCallback((groupKey) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey)
    } else {
      newExpanded.add(groupKey)
    }
    setExpandedGroups(newExpanded)
  }, [expandedGroups])

  // ✅ Selección de items
  const toggleSelectItem = useCallback((itemId) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    onSelectionChange(newSelected)
  }, [selectedItems, onSelectionChange])

  // 🎯 Selección de grupo completo
  const toggleSelectGroup = useCallback((items) => {
    const groupItemIds = items.map(item => item.id)
    const allSelected = groupItemIds.every(id => selectedItems.has(id))
    
    const newSelected = new Set(selectedItems)
    if (allSelected) {
      // Deseleccionar todos del grupo
      groupItemIds.forEach(id => newSelected.delete(id))
    } else {
      // Seleccionar todos del grupo
      groupItemIds.forEach(id => newSelected.add(id))
    }
    onSelectionChange(newSelected)
  }, [selectedItems, onSelectionChange])

  // 📊 Estados de los elementos
  const getEstadoConfig = useCallback((estado) => {
    const configs = {
      exitoso: {
        icon: CheckCircle,
        text: 'Exitoso',
        variant: 'success'
      },
      error_captcha: {
        icon: AlertCircle,
        text: 'Error Captcha',
        variant: 'warning'
      },
      error_sistema: {
        icon: XCircle,
        text: 'Error Sistema',
        variant: 'error'
      },
      pendiente: {
        icon: Clock,
        text: 'Pendiente',
        variant: 'info'
      }
    }
    return configs[estado] || configs.pendiente
  }, [])

  // 📅 Formateo de fechas
  const formatFecha = useCallback((fecha) => {
    if (!fecha) return 'Sin fecha'
    
    try {
      const date = new Date(fecha)
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Fecha inválida'
    }
  }, [])

  // 🎨 Componente de Item Individual
  const HistorialGroupItem = ({ item, isSelected, onToggleSelect }) => {
    const estadoConfig = getEstadoConfig(item.estado_extraccion)
    const EstadoIcon = estadoConfig.icon

    return (
      <div 
        className={cn(
          'flex items-center space-x-sm p-sm rounded-lg border transition-all duration-200',
          isSelected 
            ? 'border-interactive-default bg-interactive-default bg-opacity-10 shadow-sm' 
            : 'border-border-default hover:border-border-default hover:bg-bg-light',
          density === 'compact' && 'p-xs',
          density === 'spacious' && 'p-md'
        )}
      >
        {/* Checkbox de selección */}
        <button
          onClick={() => onToggleSelect(item.id)}
          className={cn(
            'w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200',
            isSelected 
              ? 'bg-interactive-default border-interactive-default' 
              : 'border-border-default hover:border-text-secondary'
          )}
        >
          {isSelected && (
            <svg className="w-3 h-3 text-text-base" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Información principal del item */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-body-paragraph font-medium text-text-primary truncate">
                {item.solicitud_alias}
              </h4>
              <div className="flex items-center space-x-sm mt-xs">
                <EstadoIcon className="w-4 h-4" />
                <Badge variant={estadoConfig.variant} size="sm">
                  {estadoConfig.text}
                </Badge>
                <span className="text-body-auxiliary text-text-secondary">
                  {formatFecha(item.fecha_ejecucion)}
                </span>
              </div>
            </div>
            
            {/* Información adicional */}
            <div className="text-right ml-sm">
              <p className="text-body-auxiliary font-mono text-text-primary">
                {item.numero_radicado_completo?.substring(0, 12)}...
              </p>
              <p className="text-body-auxiliary text-text-secondary truncate max-w-32">
                {item.despacho_juzgado}
              </p>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="flex items-center space-x-xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(item)}
            icon={<Eye className="w-3 h-3" />}
            className="text-feedback-info hover:bg-feedback-info-light"
            title="Ver detalles"
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload(item)}
            icon={<Download className="w-3 h-3" />}
            className="text-feedback-success hover:bg-feedback-success-light"
            title="Descargar PDF"
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRerun(item)}
            icon={<RefreshCw className="w-3 h-3" />}
            className="text-text-secondary hover:bg-bg-light"
            title="Reejecutar consulta"
          />
        </div>
      </div>
    )
  }

  // 🏗️ Componente de Grupo
  const HistorialGroup = ({ groupKey, items, config }) => {
    const isExpanded = expandedGroups.has(groupKey)
    const GroupIcon = config.icon
    const selectedInGroup = items.filter(item => selectedItems.has(item.id)).length
    const allSelected = selectedInGroup === items.length && items.length > 0
    const partialSelected = selectedInGroup > 0 && selectedInGroup < items.length

    return (
      <div className="bg-bg-canvas rounded-lg border border-border-default overflow-hidden">
        {/* Header del grupo */}
        <div 
          className="flex items-center justify-between p-md bg-bg-light border-b border-border-default cursor-pointer hover:bg-bg-light transition-colors"
          onClick={() => toggleGroup(groupKey)}
        >
          <div className="flex items-center space-x-sm">
            {/* Toggle de expansión */}
            <button className="p-xs rounded hover:bg-bg-canvas transition-colors">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              ) : (
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              )}
            </button>

            {/* Icono y título del grupo */}
            <GroupIcon className={cn('w-5 h-5', config.color)} />
            <div>
              <h3 className="text-body-paragraph font-semibold text-text-primary">
                {config.title}
              </h3>
              <p className="text-body-auxiliary text-text-secondary">
                {config.subtitle}
              </p>
            </div>
          </div>

          {/* Controles del grupo */}
          <div className="flex items-center space-x-sm">
            {/* Checkbox de selección grupal */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleSelectGroup(items)
              }}
              className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
                allSelected 
                  ? 'bg-interactive-default border-interactive-default' 
                  : partialSelected
                  ? 'bg-interactive-default bg-opacity-50 border-interactive-default'
                  : 'border-border-default hover:border-text-secondary'
              )}
              title={allSelected ? 'Deseleccionar grupo' : 'Seleccionar grupo'}
            >
              {allSelected && (
                <svg className="w-3 h-3 text-text-base" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {partialSelected && !allSelected && (
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              )}
            </button>

            {/* Contador de seleccionados */}
            {selectedInGroup > 0 && (
              <span className="text-body-auxiliary text-interactive-default font-medium">
                {selectedInGroup}/{items.length}
              </span>
            )}

            {/* Menú de acciones del grupo */}
            <Button
              variant="ghost"
              size="sm"
              icon={<MoreVertical className="w-4 h-4" />}
              className="text-text-secondary hover:text-text-primary"
              onClick={(e) => {
                e.stopPropagation()
                // Implementar menú contextual
              }}
            />
          </div>
        </div>

        {/* Contenido del grupo (expandible) */}
        {isExpanded && (
          <div className={cn(
            'divide-y divide-border-default',
            density === 'compact' && 'p-xs',
            density === 'comfortable' && 'p-sm',
            density === 'spacious' && 'p-md'
          )}>
            {items.map((item) => (
              <div key={item.id} className="py-xs first:pt-0 last:pb-0">
                <HistorialGroupItem
                  item={item}
                  isSelected={selectedItems.has(item.id)}
                  onToggleSelect={toggleSelectItem}
                />
              </div>
            ))}
            
            {/* Footer del grupo con estadísticas */}
            <div className="pt-sm mt-sm border-t border-border-default">
              <div className="flex justify-between items-center text-body-auxiliary text-text-secondary">
                <span>{items.length} elemento{items.length !== 1 ? 's' : ''}</span>
                <div className="flex space-x-sm">
                  <span>{items.filter(item => item.estado_extraccion === 'exitoso').length} exitoso{items.filter(item => item.estado_extraccion === 'exitoso').length !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span>{items.filter(item => item.estado_extraccion?.includes('error')).length} error{items.filter(item => item.estado_extraccion?.includes('error')).length !== 1 ? 'es' : ''}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // 📊 Procesar y ordenar grupos
  const sortedGroups = Object.entries(groupedData)
    .map(([groupKey, items]) => ({
      groupKey,
      items,
      config: getGroupConfig(groupKey, items)
    }))
    .sort((a, b) => a.config.priority - b.config.priority)

  return (
    <div className={cn('space-y-md', className)} {...props}>
      
      {/* 📊 Resumen de grupos */}
      <div className="bg-bg-light rounded-lg p-md border border-border-default">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-body-paragraph font-medium text-text-primary">
              Vista Agrupada por {groupBy === 'date' ? 'Fecha' : groupBy === 'status' ? 'Estado' : 'Despacho'}
            </h3>
            <p className="text-body-auxiliary text-text-secondary">
              {sortedGroups.length} grupo{sortedGroups.length !== 1 ? 's' : ''} • 
              {Object.values(groupedData).flat().length} elemento{Object.values(groupedData).flat().length !== 1 ? 's' : ''} total
            </p>
          </div>

          {/* Controles globales */}
          <div className="flex items-center space-x-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedGroups(new Set(Object.keys(groupedData)))}
              className="text-text-secondary hover:text-text-primary"
            >
              Expandir todo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedGroups(new Set())}
              className="text-text-secondary hover:text-text-primary"
            >
              Contraer todo
            </Button>
          </div>
        </div>
      </div>

      {/* 🏗️ Lista de grupos */}
      <div className={cn(
        'space-y-md',
        density === 'compact' && 'space-y-sm',
        density === 'spacious' && 'space-y-lg'
      )}>
        {sortedGroups.map(({ groupKey, items, config }) => (
          <HistorialGroup
            key={groupKey}
            groupKey={groupKey}
            items={items}
            config={config}
          />
        ))}
      </div>

      {/* 📝 Información de desarrollo */}
      {sortedGroups.length === 0 && (
        <div className="text-center py-xl">
          <Calendar className="w-12 h-12 text-text-secondary mx-auto mb-md" />
          <h3 className="text-heading-h3 font-heading text-text-primary mb-sm">
            Sin datos para agrupar
          </h3>
          <p className="text-body-paragraph text-text-secondary">
            No hay elementos disponibles para mostrar en la vista agrupada.
          </p>
        </div>
      )}
    </div>
  )
}

HistorialGroupedView.displayName = 'HistorialGroupedView'

export default HistorialGroupedView