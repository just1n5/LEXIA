import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeProvider'
import { ToastProvider } from './components/ui/Toast'

// Páginas de autenticación
import LoginPage from './pages/auth/LoginPage'
import SelectAccountTypePage from './pages/auth/SelectAccountTypePage'
import RegisterPersonalPage from './pages/auth/RegisterPersonalPage'
import RegisterBusinessPage from './pages/auth/RegisterBusinessPage'

// Dashboard y páginas principales
import DashboardPage from './pages/dashboard/DashboardPage'

// Páginas de solicitudes
import SelectQueryTypePage from './pages/solicitudes/SelectQueryTypePage'
import SimpleQueryPage from './pages/solicitudes/SimpleQueryPage'
import AdvancedQueryPage from './pages/solicitudes/AdvancedQueryPage'
import SolicitudDetailPage from './pages/solicitudes/SolicitudDetailPage'

// Página de test (mantenemos acceso directo)
import TestSolicitudesPage from './pages/test/TestSolicitudesPage'

// Componente de prueba para SearchInput
import SearchInputTest from './components/test/SearchInputTest'

// Nueva página unificada que crearemos
import NuevaSolicitudPage from './pages/solicitudes/NuevaSolicitudPage'

// Página de historial
import HistorialPage from './pages/dashboard/HistorialPage'

// Componentes de protección
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import Layout from './components/layout/Layout'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <AuthProvider>
          <ToastProvider>
            <Router>
              <Routes>
                {/* =================== RUTAS PÚBLICAS =================== */}
                <Route path="/login" element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } />
                <Route path="/auth/login" element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } />
                <Route path="/auth/select-account-type" element={
                  <PublicRoute>
                    <SelectAccountTypePage />
                  </PublicRoute>
                } />
                <Route path="/auth/register/personal" element={
                  <PublicRoute>
                    <RegisterPersonalPage />
                  </PublicRoute>
                } />
                <Route path="/auth/register/business" element={
                  <PublicRoute>
                    <RegisterBusinessPage />
                  </PublicRoute>
                } />

                {/* =================== RUTAS PROTEGIDAS =================== */}
                
                {/* Dashboard Principal */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />

                {/* Rutas de Solicitudes - FLUJO PRINCIPAL */}
                <Route path="/solicitudes/simple" element={
                  <ProtectedRoute>
                    <Layout>
                      <NuevaSolicitudPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/solicitudes/select-type" element={
                  <ProtectedRoute>
                    <Layout>
                      <SelectQueryTypePage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/solicitudes/advanced" element={
                  <ProtectedRoute>
                    <Layout>
                      <AdvancedQueryPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/solicitudes/:id" element={
                  <ProtectedRoute>
                    <Layout>
                      <SolicitudDetailPage />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Historial */}
                <Route path="/historial" element={
                  <ProtectedRoute>
                    <HistorialPage />
                  </ProtectedRoute>
                } />

                {/* =================== RUTAS DE DESARROLLO/TEST =================== */}
                
                {/* Ruta de prueba para SearchInput */}
                <Route path="/test/search-input" element={
                  <Layout>
                    <SearchInputTest />
                  </Layout>
                } />
                
                {/* Página de inicio con enlaces de navegación */}
                <Route path="/" element={
                  <Layout>
                    <div className="container">
                      {/* Header principal */}
                      <div className="text-center mb-2xl p-xl bg-gradient-to-r from-interactive-default to-yellow-400 rounded-lg text-text-base">
                        <h1 className="text-4xl font-bold mb-md flex items-center justify-center gap-md">
                          ⚡ ConsultaJudicial RPA
                        </h1>
                        <p className="text-xl opacity-90">
                          Sistema de Automatización de Procesos Judiciales
                        </p>
                      </div>

                      {/* Cards de navegación principal */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
                        {/* Dashboard */}
                        <div className="card text-center hover:shadow-lg transition-default">
                          <div className="text-4xl mb-md">📊</div>
                          <h3 className="text-heading-h3 font-semibold mb-sm">
                            Dashboard Principal
                          </h3>
                          <p className="text-text-secondary mb-lg text-sm">
                            Gestiona todas tus solicitudes de consulta judicial
                          </p>
                          <a 
                            href="/dashboard" 
                            className="btn btn-primary"
                          >
                            Ir al Dashboard
                          </a>
                        </div>

                        {/* Nueva Solicitud */}
                        <div className="card text-center hover:shadow-lg transition-default">
                          <div className="text-4xl mb-md">➕</div>
                          <h3 className="text-heading-h3 font-semibold mb-sm">
                            Nueva Solicitud
                          </h3>
                          <p className="text-text-secondary mb-lg text-sm">
                            Crea una nueva solicitud de consulta automatizada
                          </p>
                          <a 
                            href="/solicitudes/select-type" 
                            className="btn btn-primary"
                          >
                            Crear Solicitud
                          </a>
                        </div>

                        {/* Historial */}
                        <div className="card text-center hover:shadow-lg transition-default">
                          <div className="text-4xl mb-md">📚</div>
                          <h3 className="text-heading-h3 font-semibold mb-sm">
                            Historial de Consultas
                          </h3>
                          <p className="text-text-secondary mb-lg text-sm">
                            Revisa el historial completo de tus consultas
                          </p>
                          <a 
                            href="/historial" 
                            className="btn btn-primary"
                          >
                            Ver Historial
                          </a>
                        </div>
                      </div>

                      {/* Área de pruebas de desarrollo */}
                      <div className="bg-feedback-info-light border border-feedback-info rounded-lg p-lg mb-xl">
                        <h3 className="text-heading-h3 font-semibold text-feedback-info mb-md flex items-center justify-center gap-sm">
                          🧪 Área de Pruebas de Desarrollo
                        </h3>
                        <div className="flex justify-center">
                          <a 
                            href="/test/search-input" 
                            className="btn btn-secondary"
                          >
                            🔍 Test SearchInput Component
                          </a>
                        </div>
                      </div>

                      {/* Estado del sistema */}
                      <div className="p-lg bg-feedback-success-light border border-feedback-success rounded-lg text-center">
                        <h3 className="text-heading-h3 font-semibold text-feedback-success mb-md flex items-center justify-center gap-sm">
                          ✅ Sistema Completamente Funcional
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                          <div className="text-sm text-feedback-success">
                            ✅ Formularios con validación
                          </div>
                          <div className="text-sm text-feedback-success">
                            ✅ Dashboard integrado
                          </div>
                          <div className="text-sm text-feedback-success">
                            ✅ Navegación completa
                          </div>
                          <div className="text-sm text-feedback-success">
                            ✅ Sistema de notificaciones
                          </div>
                        </div>
                      </div>
                    </div>
                  </Layout>
                } />
                
                {/* Redirecciones útiles */}
                <Route path="/nueva-solicitud" element={<Navigate to="/solicitudes/select-type" replace />} />
                <Route path="/solicitudes/nueva" element={<Navigate to="/solicitudes/select-type" replace />} />
                <Route path="/solicitudes" element={<Navigate to="/dashboard" replace />} />
                
                {/* Redirigir rutas no encontradas */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App