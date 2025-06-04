import { 
  Home, 
  Activity, 
  BarChart3, 
  Settings, 
  Download,
  Eye,
  Zap,
  FileText,
  TrendingUp
} from 'lucide-react'

/**
 * Configuración optimizada de tabs - Reducido de 7 a 5 tabs estratégicos
 * Basado en análisis de UX y flujo de usuario principal
 */
export const TABS_CONFIG = {
  resumen: {
    id: 'resumen',
    label: 'Resumen',
    icon: Home,
    priority: 'primary',
    description: 'Vista general del proceso y estado actual',
    shortcut: 'Ctrl+1',
    components: [
      'ProcessInfoCompact',
      'StatusCurrent', 
      'MetricsTop3',
      'ActivityRecent'
    ],
    estimatedLoadTime: 'fast', // fast | medium | slow
    cacheStrategy: 'always',   // always | session | never
    preload: true,
    analytics: {
      category: 'tab_navigation',
      expected_time: 15 // segundos promedio
    }
  },
  
  monitoreo: {
    id: 'monitoreo',
    label: 'Monitoreo',
    icon: Activity,
    priority: 'primary',
    description: 'Ejecuciones en tiempo real y historial de actividad',
    shortcut: 'Ctrl+2',
    components: [
      'ExecutionHistory',
      'InteractiveTimeline',
      'RealTimeStatus',
      'ExecutionMetrics'
    ],
    estimatedLoadTime: 'medium',
    cacheStrategy: 'session',
    preload: false,
    analytics: {
      category: 'monitoring',
      expected_time: 45
    }
  },
  
  analisis: {
    id: 'analisis',
    label: 'Análisis',
    icon: BarChart3,
    priority: 'secondary',
    description: 'Métricas detalladas y análisis de rendimiento',
    shortcut: 'Ctrl+3',
    components: [
      'MetricsDetailed',
      'TemporalComparison',
      'PerformanceGraphs',
      'InsightsRecommendations'
    ],
    estimatedLoadTime: 'slow',
    cacheStrategy: 'session',
    preload: false,
    analytics: {
      category: 'analytics',
      expected_time: 60
    }
  },
  
  configuracion: {
    id: 'configuracion',
    label: 'Configuración',
    icon: Settings,
    priority: 'secondary',
    description: 'Parámetros del proceso y optimización automática',
    shortcut: 'Ctrl+4',
    components: [
      'ProcessSettings',
      'OptimizationWizard',
      'NotificationSettings',
      'AdvancedConfiguration'
    ],
    estimatedLoadTime: 'medium',
    cacheStrategy: 'always',
    preload: false,
    analytics: {
      category: 'configuration',
      expected_time: 90
    }
  },
  
  acciones: {
    id: 'acciones',
    label: 'Acciones',
    icon: Download,
    priority: 'utility',
    description: 'Exportación, compartir y herramientas de gestión',
    shortcut: 'Ctrl+5',
    components: [
      'SmartExport',
      'ShareCollaborate',
      'BulkActions',
      'ManagementTools'
    ],
    estimatedLoadTime: 'fast',
    cacheStrategy: 'never',
    preload: false,
    analytics: {
      category: 'actions',
      expected_time: 30
    }
  }
}

/**
 * Mapeo de tabs antiguos a nuevos para migración suave
 */
export const TAB_MIGRATION_MAP = {
  // Tabs antiguos -> nuevo tab
  'overview': 'resumen',
  'executions': 'monitoreo', 
  'timeline': 'monitoreo',    // Fusionado con monitoreo
  'settings': 'configuracion',
  'analytics': 'analisis',
  'export': 'acciones',
  'optimization': 'configuracion' // Fusionado con configuración
}

/**
 * Configuración de responsive behavior
 */
export const RESPONSIVE_CONFIG = {
  mobile: {
    maxVisibleTabs: 3,
    behavior: 'dropdown', // 'dropdown' | 'scroll' | 'accordion'
    primaryTabs: ['resumen', 'monitoreo'],
    collapsedLabel: 'Más'
  },
  tablet: {
    maxVisibleTabs: 5,
    behavior: 'scroll',
    showAllTabs: true
  },
  desktop: {
    maxVisibleTabs: 5,
    behavior: 'full',
    showAllTabs: true,
    enableKeyboardShortcuts: true
  }
}

/**
 * Configuración de estados y contadores dinámicos
 */
export const TAB_STATES_CONFIG = {
  resumen: {
    counter: (data) => null, // No counter para resumen
    badge: (data) => data?.hasAlerts ? 'alert' : null,
    loading: (data) => data?.isRefreshing
  },
  
  monitoreo: {
    counter: (data) => data?.totalExecutions || 0,
    badge: (data) => {
      if (data?.isExecuting) return 'active'
      if (data?.hasErrors) return 'error'
      if (data?.hasNewUpdates) return 'new'
      return null
    },
    loading: (data) => data?.isLoadingHistory
  },
  
  analisis: {
    counter: (data) => data?.availableReports || 0,
    badge: (data) => data?.hasInsights ? 'insights' : null,
    loading: (data) => data?.isCalculatingMetrics
  },
  
  configuracion: {
    counter: (data) => data?.pendingChanges || null,
    badge: (data) => {
      if (data?.hasUnsavedChanges) return 'unsaved'
      if (data?.needsOptimization) return 'optimize'
      return null
    },
    loading: (data) => data?.isSaving
  },
  
  acciones: {
    counter: (data) => data?.availableExports || null,
    badge: (data) => data?.hasScheduledExports ? 'scheduled' : null,
    loading: (data) => data?.isExporting
  }
}

/**
 * Helper para obtener orden de tabs según prioridad
 */
export const getTabOrder = (userPreferences = {}) => {
  const defaultOrder = ['resumen', 'monitoreo', 'analisis', 'configuracion', 'acciones']
  
  // Permitir personalización del orden por usuario
  if (userPreferences.customOrder) {
    return userPreferences.customOrder.filter(tab => 
      Object.keys(TABS_CONFIG).includes(tab)
    )
  }
  
  return defaultOrder
}

/**
 * Helper para obtener configuración de tab
 */
export const getTabConfig = (tabId) => {
  return TABS_CONFIG[tabId] || null
}

/**
 * Helper para validar si un tab está disponible
 */
export const isTabAvailable = (tabId, userPermissions = {}, dataState = {}) => {
  const config = getTabConfig(tabId)
  if (!config) return false
  
  // Validar permisos específicos
  if (tabId === 'configuracion' && !userPermissions.canEdit) return false
  if (tabId === 'acciones' && !userPermissions.canExport) return false
  
  // Validar estado de datos
  if (tabId === 'analisis' && !dataState.hasExecutions) return false
  
  return true
}

export default TABS_CONFIG