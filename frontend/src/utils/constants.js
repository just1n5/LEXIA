// Constantes de la aplicación
export const APP_NAME = 'Consulta de Procesos Judiciales'
export const APP_VERSION = import.meta.env.VITE_VERSION || '1.0.0'

// Tipos de búsqueda
export const TIPOS_BUSQUEDA = {
  RADICADO: 'radicado',
  NOMBRE_RAZON_SOCIAL: 'nombre_razon_social',
}

// Frecuencias de envío
export const FRECUENCIAS_ENVIO = {
  DIARIA: 'diaria',
  SEMANAL: 'semanal',
  MENSUAL: 'mensual',
}

// Estados de solicitud
export const ESTADOS_SOLICITUD = {
  ACTIVA: 'activa',
  PAUSADA: 'pausada',
  ERROR: 'error',
  EN_PROCESO: 'en_proceso',
}

// Estados de ejecución
export const ESTADOS_EJECUCION = {
  EXITOSA: 'exitosa',
  FALLIDA: 'fallida',
  PENDIENTE: 'pendiente',
  EN_PROCESO: 'en_proceso',
}

// Tipos de documento
export const TIPOS_DOCUMENTO = {
  CC: 'CC',
  CE: 'CE',
  TI: 'TI',
  NIT: 'NIT',
  PASAPORTE: 'PASAPORTE',
}

// Tipos de cuenta
export const TIPOS_CUENTA = {
  PERSONA_NATURAL: 'persona_natural',
  EMPRESA: 'empresa',
}

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SOLICITUDES: '/solicitudes',
  HISTORIAL: '/historial',
  PROFILE: '/profile',
}

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
}

// Configuración de validación
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_ALIAS_LENGTH: 255,
  MAX_NOMBRE_LENGTH: 255,
}

// URLs externas
export const EXTERNAL_URLS = {
  RAMA_JUDICIAL: 'https://consultaprocesos.ramajudicial.gov.co/Procesos/NumeroRadicacion',
  SOPORTE: 'mailto:soporte@consultajudicial.com',
}

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, intenta nuevamente.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
  SERVER_ERROR: 'Error interno del servidor. Intenta más tarde.',
}

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  SOLICITUD_CREADA: 'Solicitud creada exitosamente.',
  SOLICITUD_ACTUALIZADA: 'Solicitud actualizada exitosamente.',
  SOLICITUD_ELIMINADA: 'Solicitud eliminada exitosamente.',
  PERFIL_ACTUALIZADO: 'Perfil actualizado exitosamente.',
  LOGIN_SUCCESS: '¡Bienvenido!',
}
