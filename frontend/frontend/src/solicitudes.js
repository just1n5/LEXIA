// Exportar todas las páginas de solicitudes
export { default as SelectQueryTypePage } from './pages/solicitudes/SelectQueryTypePage';
export { default as SimpleQueryPage } from './pages/solicitudes/SimpleQueryPage';
export { default as AdvancedQueryPage } from './pages/solicitudes/AdvancedQueryPage';
export { default as SolicitudDetailPage } from './pages/solicitudes/SolicitudDetailPage';

// Exportar componentes de formularios
export { default as QueryTypeSelector } from './components/forms/QueryTypeSelector';
export { default as SimpleQueryForm } from './components/forms/SimpleQueryForm';
export { default as AdvancedQueryForm } from './components/forms/AdvancedQueryForm';
export { default as FrequencySelector } from './components/forms/FrequencySelector';
export { default as ValidationMessage } from './components/forms/ValidationMessage';

// Exportar componentes específicos de solicitudes
export { default as ProcessInfo } from './components/solicitudes/ProcessInfo';
export { default as ExecutionHistory } from './components/solicitudes/ExecutionHistory';

// Exportar componentes comunes
export { default as ToastContainer } from './components/common/ToastContainer';

// Exportar hooks
export { useRadicadoValidation } from './hooks/useRadicadoValidation';
export { useDepartmentCities } from './hooks/useDepartmentCities';
export { useSolicitudes } from './hooks/useSolicitudes';
export { useToast } from './hooks/useToast';

// Exportar servicios
export { solicitudesService } from './services/solicitudes';

// Exportar rutas
export { default as SolicitudesRoutes } from './routes/SolicitudesRoutes';
