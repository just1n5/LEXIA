import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Calendar, Clock } from 'lucide-react'

// Components del design system
import Card from '../../../ui/Card'
import Button from '../../../ui/Button'
import Badge from '../../../ui/Badge'
import ExecutionCard from './ExecutionCard'
import ExecutionTable from './ExecutionTable'
import { cn } from '../../../../utils/cn'

/**
 * Componente ExecutionGroups para agrupación temporal inteligente
 * Agrupa ejecuciones por períodos (hoy, ayer, esta semana, etc.)
 */
const ExecutionGroups = ({
  groupedExecutions = {},
  viewMode = 'auto',
  onViewDetails,
  onRerun,
  onExport,
  sortBy,
  onSort,
  loading = false,
  className = '',
  ...props
}) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set(['today', 'yesterday']))

  // Configuración de grupos con orden y metadata
  const groupConfig = {
    today: {
      title: 'Hoy',
      icon: <Clock className="w-4 h-4" />,
      defaultExpanded: true,
      priority: 1
    },
    yesterday: {
      title: 'Ayer',
      icon: <Calendar className="w-4 h-4" />,
      defaultExpanded: true,
      priority: 2
    },
    thisWeek: {
      title: 'Esta semana',
      icon: <Calendar className="w-4 h-4" />,
      defaultExpanded: false,
      priority: 3
    }
  }

  // Función para determinar si mostrar como cards o tabla
  const shouldShowAsCards = (groupKey, executions) => {
    if (viewMode === 'cards') return true
    if (viewMode === 'table') return false
    
    // Auto: Cards en móvil, tabla en desktop para grupos grandes
    const isMobile = window.innerWidth < 1024
    if (isMobile) return true
    
    // En desktop, usar cards para grupos pequeños, tabla para grandes
    return executions.length <= 3
  }

  // Toggle de expansión de grupo
  const toggleGroup = (groupKey) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey)
    } else {
      newExpanded.add(groupKey)
    }
    setExpandedGroups(newExpanded)
  }

  // Ordenar grupos por prioridad
  const sortedGroupKeys = Object.keys(groupedExecutions).sort((a, b) => {
    const priorityA = groupConfig[a]?.priority || 999
    const priorityB = groupConfig[b]?.priority || 999
    return priorityA - priorityB
  })

  // Si no hay grupos, mostrar estado vacío
  if (sortedGroupKeys.length === 0) {
    return (
      <div className={cn('text-center py-xl', className)} {...props}>
        <Calendar className="w-12 h-12 text-text-secondary mx-auto mb-md" />
        <h4 className="text-heading-h4 font-heading text-text-primary mb-sm">
          No hay ejecuciones disponibles
        </h4>
        <p className="text-body-paragraph text-text-secondary">
          Las ejecuciones aparecerán aquí una vez que se procesen.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-lg', className)} {...props}>
      {sortedGroupKeys.map((groupKey) => {
        const executions = groupedExecutions[groupKey] || []
        const config = groupConfig[groupKey] || {
          title: groupKey,
          icon: <Calendar className="w-4 h-4" />,
          defaultExpanded: false,
          priority: 999
        }
        
        const isExpanded = expandedGroups.has(groupKey)
        const showAsCards = shouldShowAsCards(groupKey, executions)
        
        if (executions.length === 0) return null

        return (
          <Card key={groupKey} className="overflow-hidden">
            {/* Header del grupo */}
            <Card.Header className="pb-sm">
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-bg-light -m-md p-md rounded transition-colors"
                onClick={() => toggleGroup(groupKey)}
              >
                <div className="flex items-center gap-sm">
                  <div className="flex items-center gap-xs">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-text-secondary" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-text-secondary" />
                    )}
                    {config.icon}
                  </div>
                  
                  <div>
                    <h3 className="text-heading-h3 font-heading text-text-primary">
                      {config.title}
                    </h3>
                    <p className="text-body-auxiliary text-text-secondary">
                      {executions.length} ejecuci{executions.length === 1 ? 'ón' : 'ones'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-sm">
                  {/* Métricas rápidas del grupo */}
                  <div className="flex items-center gap-xs">
                    {(() => {
                      const successCount = executions.filter(e => e.estado_extraccion === 'EXITOSA').length
                      const errorCount = executions.filter(e => e.estado_extraccion === 'FALLIDA').length
                      
                      return (
                        <>
                          {successCount > 0 && (
                            <Badge variant="success" size="sm">
                              {successCount} exitosa{successCount > 1 ? 's' : ''}
                            </Badge>
                          )}
                          {errorCount > 0 && (
                            <Badge variant="error" size="sm">
                              {errorCount} error{errorCount > 1 ? 'es' : ''}
                            </Badge>
                          )}
                        </>
                      )
                    })()} 
                  </div>
                  
                  <Badge variant="neutral" size="sm">
                    {executions.length}
                  </Badge>
                </div>
              </div>
            </Card.Header>
            
            {/* Contenido del grupo */}
            {isExpanded && (
              <Card.Content className="pt-0">
                {showAsCards ? (
                  <ExecutionCard.List
                    executions={executions}
                    onViewDetails={onViewDetails}
                    onRerun={onRerun}
                    onExport={onExport}
                    loading={loading}
                    compact={true}
                  />
                ) : (
                  <ExecutionTable
                    executions={executions}
                    sortBy={sortBy}
                    onSort={onSort}
                    onViewDetails={onViewDetails}
                    onRerun={onRerun}
                    onExport={onExport}
                    loading={loading}
                  />
                )}
                
                {/* Estadísticas del grupo */}
                {executions.length > 0 && (
                  <div className="mt-md pt-md border-t border-border-default">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-md text-center">
                      <div>
                        <div className="text-body-paragraph font-medium text-text-primary">
                          {executions.length}
                        </div>
                        <div className="text-body-auxiliary text-text-secondary">
                          Total
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-body-paragraph font-medium text-feedback-success">
                          {executions.filter(e => e.estado_extraccion === 'EXITOSA').length}
                        </div>
                        <div className="text-body-auxiliary text-text-secondary">
                          Exitosas
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-body-paragraph font-medium text-feedback-error">
                          {executions.filter(e => e.estado_extraccion === 'FALLIDA').length}
                        </div>
                        <div className="text-body-auxiliary text-text-secondary">
                          Con errores
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-body-paragraph font-medium text-text-primary">
                          {(() => {
                            const totalTime = executions.reduce((sum, e) => sum + (e.tiempo_ejecucion || 0), 0)
                            const avgTime = executions.length > 0 ? totalTime / executions.length : 0
                            
                            if (avgTime < 60) {
                              return `${Math.round(avgTime)}s`
                            } else {
                              const minutes = Math.floor(avgTime / 60)
                              return `${minutes}m`
                            }
                          })()} 
                        </div>
                        <div className="text-body-auxiliary text-text-secondary">
                          Tiempo prom.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card.Content>
            )}
          </Card>
        )
      })}
    </div>
  )
}

/**
 * Componente individual de grupo
 */
const ExecutionGroup = ({
  title,
  executions = [],
  icon,
  expanded = false,
  onToggle,
  showAsCards = true,
  onViewDetails,
  onRerun,
  onExport,
  sortBy,
  onSort,
  loading = false,
  className = '',
  ...props
}) => {
  if (executions.length === 0) return null

  const successCount = executions.filter(e => e.estado_extraccion === 'EXITOSA').length
  const errorCount = executions.filter(e => e.estado_extraccion === 'FALLIDA').length
  const successRate = executions.length > 0 ? (successCount / executions.length) * 100 : 0

  return (
    <Card className={cn('overflow-hidden', className)} {...props}>
      {/* Header */}
      <Card.Header className="pb-sm">
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-bg-light -m-md p-md rounded transition-colors"
          onClick={onToggle}
        >
          <div className="flex items-center gap-sm">
            <div className="flex items-center gap-xs">
              {expanded ? (
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              ) : (
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              )}
              {icon}
            </div>
            
            <div>
              <h3 className="text-heading-h3 font-heading text-text-primary">
                {title}
              </h3>
              <p className="text-body-auxiliary text-text-secondary">
                {executions.length} ejecución{executions.length === 1 ? '' : 'es'}
                {successRate > 0 && (
                  <span className="ml-xs">
                    • {Math.round(successRate)}% exitosas
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-xs">
            {successCount > 0 && (
              <Badge variant="success" size="sm">
                {successCount}
              </Badge>
            )}
            {errorCount > 0 && (
              <Badge variant="error" size="sm">
                {errorCount}
              </Badge>
            )}
          </div>
        </div>
      </Card.Header>
      
      {/* Contenido */}
      {expanded && (
        <Card.Content className="pt-0">
          {showAsCards ? (
            <ExecutionCard.List
              executions={executions}
              onViewDetails={onViewDetails}
              onRerun={onRerun}
              onExport={onExport}
              loading={loading}
              compact={true}
            />
          ) : (
            <ExecutionTable
              executions={executions}
              sortBy={sortBy}
              onSort={onSort}
              onViewDetails={onViewDetails}
              onRerun={onRerun}
              onExport={onExport}
              loading={loading}
            />
          )}
        </Card.Content>
      )}
    </Card>
  )
}

/**
 * Hook para manejar el estado de grupos expandidos
 */
export const useExpandedGroups = (defaultExpanded = ['today', 'yesterday']) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set(defaultExpanded))
  
  const toggleGroup = (groupKey) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey)
    } else {
      newExpanded.add(groupKey)
    }
    setExpandedGroups(newExpanded)
  }
  
  const expandAll = (groupKeys) => {
    setExpandedGroups(new Set(groupKeys))
  }
  
  const collapseAll = () => {
    setExpandedGroups(new Set())
  }
  
  const isExpanded = (groupKey) => expandedGroups.has(groupKey)
  
  return {
    expandedGroups,
    toggleGroup,
    expandAll,
    collapseAll,
    isExpanded
  }
}

/**
 * Utilidad para agrupar ejecuciones por fecha
 */
export const groupExecutionsByDate = (executions) => {
  const groups = {}
  const today = new Date()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  // Helper para verificar si es el mismo día
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }
  
  executions.forEach(execution => {
    const execDate = new Date(execution.fecha_ejecucion)
    
    if (isSameDay(execDate, today)) {
      if (!groups.today) groups.today = []
      groups.today.push(execution)
    } else if (isSameDay(execDate, yesterday)) {
      if (!groups.yesterday) groups.yesterday = []
      groups.yesterday.push(execution)
    } else if (execDate >= thisWeek) {
      if (!groups.thisWeek) groups.thisWeek = []
      groups.thisWeek.push(execution)
    } else {
      const monthKey = execDate.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      })
      if (!groups[monthKey]) groups[monthKey] = []
      groups[monthKey].push(execution)
    }
  })
  
  return groups
}

// Exportar componentes
ExecutionGroups.Group = ExecutionGroup
ExecutionGroups.displayName = 'ExecutionGroups'

export default ExecutionGroups