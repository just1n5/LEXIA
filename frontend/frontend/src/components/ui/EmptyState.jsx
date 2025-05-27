import React from 'react'
import { Folder, FolderOpen, Search, AlertTriangle, RefreshCw, Plus, FileText, Inbox, Rocket } from 'lucide-react'
import { cn } from '../../utils/cn'

const emptyStateIcons = {
  search: Search,
  folder: FolderOpen,
  error: AlertTriangle,
  empty: Inbox,
  firstTime: Rocket,
  loading: RefreshCw,
  documents: FileText,
}

const emptyStateVariants = {
  default: 'empty-state',
  minimal: 'empty-minimal',
  error: 'error-state',
  firstTime: 'first-time-state',
}

function EmptyState({
  variant = 'default',
  icon = 'empty',
  title,
  description,
  actions,
  className = '',
  illustration,
  badge,
  ...props
}) {
  const Icon = emptyStateIcons[icon]
  const baseClass = emptyStateVariants[variant]

  return (
    <div className={cn(baseClass, className)} {...props}>
      {badge && variant === 'firstTime' && (
        <span className="welcome-badge">{badge}</span>
      )}
      
      {illustration ? (
        <div className="empty-illustration">
          {illustration}
        </div>
      ) : (
        <Icon className="empty-icon" />
      )}

      {title && <h3 className="empty-title">{title}</h3>}
      
      {description && (
        <p className="empty-description">{description}</p>
      )}

      {actions && (
        <div className="empty-actions">
          {actions}
        </div>
      )}
    </div>
  )
}

// Ilustraciones SVG predefinidas
function FolderIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="empty-illustration">
      <defs>
        <linearGradient id="folderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#eab308" stopOpacity="0.2"/>
        </linearGradient>
      </defs>
      <rect x="20" y="60" width="160" height="80" rx="8" 
            fill="url(#folderGradient)" stroke="var(--color-border-default)" strokeWidth="2"/>
      <path d="M20 60 L20 50 Q20 45 25 45 L80 45 L90 55 L175 55 Q180 55 180 60" 
            fill="none" stroke="var(--color-border-default)" strokeWidth="2"/>
      <circle cx="100" cy="100" r="15" fill="var(--color-interactive-default)" opacity="0.3"/>
      <path d="M93 100 L98 105 L108 95" stroke="var(--color-interactive-default)" 
            strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SearchIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="empty-illustration">
      <circle cx="80" cy="80" r="30" fill="none" 
              stroke="var(--color-border-default)" strokeWidth="3"/>
      <line x1="105" y1="105" x2="130" y2="130" 
            stroke="var(--color-border-default)" strokeWidth="3" strokeLinecap="round"/>
      <text x="100" y="40" textAnchor="middle" 
            fontSize="12" fill="var(--color-text-secondary)">
        Sin resultados
      </text>
    </svg>
  )
}

function ErrorIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="empty-illustration">
      <circle cx="100" cy="80" r="40" fill="var(--color-feedback-error-light)" 
              stroke="var(--color-feedback-error)" strokeWidth="2"/>
      <line x1="85" y1="65" x2="115" y2="95" 
            stroke="var(--color-feedback-error)" strokeWidth="3" strokeLinecap="round"/>
      <line x1="115" y1="65" x2="85" y2="95" 
            stroke="var(--color-feedback-error)" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

// Presets comunes
const emptyStatePresets = {
  noSolicitudes: {
    icon: 'folder',
    title: 'No hay solicitudes',
    description: 'Aún no has creado ninguna solicitud de consulta judicial. Crea tu primera solicitud para comenzar.',
    actions: (
      <>
        <button className="btn btn-primary btn-with-icon">
          <Plus size={16} />
          Nueva Solicitud
        </button>
        <button className="btn btn-secondary btn-with-icon">
          <FileText size={16} />
          Ver Tutorial
        </button>
      </>
    )
  },
  
  searchEmpty: {
    variant: 'minimal',
    icon: 'search',
    title: 'No se encontraron resultados',
    description: 'Intenta con otros términos de búsqueda o ajusta los filtros.'
  },
  
  connectionError: {
    variant: 'error',
    icon: 'error',
    title: 'Error de conexión',
    description: 'No pudimos conectar con el servidor. Por favor, intenta nuevamente.',
    actions: (
      <button className="btn btn-primary btn-with-icon">
        <RefreshCw size={16} />
        Reintentar
      </button>
    )
  },
  
  firstTime: {
    variant: 'firstTime',
    icon: 'firstTime',
    badge: '¡Bienvenido!',
    title: 'Configura tu primera consulta',
    description: 'Te guiaremos paso a paso para crear tu primera consulta automatizada de procesos judiciales.',
    actions: (
      <button className="btn btn-primary btn-with-icon">
        <Rocket size={16} />
        Comenzar
      </button>
    )
  },
  
  loading: {
    variant: 'minimal',
    icon: 'loading',
    title: 'Cargando...',
    description: 'Por favor espera mientras procesamos tu solicitud.'
  }
}

// Componente con presets
function EmptyStatePreset({ preset, onAction, ...props }) {
  const presetConfig = emptyStatePresets[preset]
  
  if (!presetConfig) {
    console.warn(`EmptyState preset "${preset}" no encontrado`)
    return <EmptyState {...props} />
  }

  // Si hay acciones y onAction, las interceptamos para manejar eventos
  let actions = presetConfig.actions
  if (actions && onAction) {
    actions = React.cloneElement(actions, {
      onClick: (e) => {
        const buttonText = e.target.textContent || e.target.innerText
        onAction(buttonText, e)
      }
    })
  }

  return (
    <EmptyState
      {...presetConfig}
      {...props}
      actions={actions}
    />
  )
}

// Componentes de ilustraciones como exports
EmptyState.FolderIllustration = FolderIllustration
EmptyState.SearchIllustration = SearchIllustration
EmptyState.ErrorIllustration = ErrorIllustration
EmptyState.Preset = EmptyStatePreset

export default EmptyState
