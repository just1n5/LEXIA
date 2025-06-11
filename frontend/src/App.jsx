import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeProvider'
import { ToastProvider } from './components/ui/Toast'

// Componentes de marca LEXIA
import LexiaLogo from './components/brand/LexiaLogo'
import HeroSection from './components/sections/HeroSection'

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
import AdvancedQueryPage from './pages/solicitudes/AdvancedQueryPageClean'
import BulkUploadPage from './pages/solicitudes/BulkUploadPage'
import BulkConfirmPage from './pages/solicitudes/BulkConfirmPage'
import SolicitudDetailPage from './pages/solicitudes/SolicitudDetailPage'

// Página de test (mantenemos acceso directo)
import TestSolicitudesPage from './pages/test/TestSolicitudesPage'

// Componente de prueba para SearchInput
import SearchInputTest from './components/test/SearchInputTest'

// Test page para la nueva implementación de detalles
import TestSolicitudDetailPage from './pages/test/TestSolicitudDetailPage'

// Nueva página unificada que crearemos
import NuevaSolicitudPage from './pages/solicitudes/NuevaSolicitudPage'

// Página de historial
import HistorialPage from './pages/dashboard/HistorialPage'

// Componentes de protección
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import Layout from './components/layout/Layout'

// ✅ CORREGIDO: QueryClient configurado para @tanstack/react-query v5
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
      // ✅ v5: gcTime reemplaza cacheTime
      gcTime: 10 * 60 * 1000, // 10 minutos
    },
    mutations: {
      retry: 1,
      // ✅ v5: gcTime también disponible para mutations
      gcTime: 5 * 60 * 1000,
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
                    <Layout>
                      <DashboardPage />
                    </Layout>
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
                
                <Route path="/solicitudes/bulk-upload" element={
                  <ProtectedRoute>
                    <Layout>
                      <BulkUploadPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/solicitudes/bulk-confirm" element={
                  <ProtectedRoute>
                    <Layout>
                      <BulkConfirmPage />
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
                    <Layout>
                      <HistorialPage />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* =================== RUTAS DE DESARROLLO/TEST =================== */}
                
                {/* Ruta de prueba para SearchInput */}
                <Route path="/test/search-input" element={
                  <Layout>
                    <SearchInputTest />
                  </Layout>
                } />
                
                {/* Ruta de prueba para la nueva implementación de detalles */}
                <Route path="/test/solicitud-detail" element={
                  <Layout>
                    <TestSolicitudDetailPage />
                  </Layout>
                } />
                
                {/* Página de inicio con enlaces de navegación */}
                <Route path="/" element={
                  <Layout>
                    <div className="container">
                      {/* Hero Section con nuevo diseño LEXIA */}
                      <HeroSection size="default" className="mb-2xl" />

                      {/* Cards de navegación principal */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
                        {/* Dashboard */}
                        <div className="card text-center hover:shadow-lexia transition-all duration-300 hover:scale-105">
                          <div className="text-4xl mb-md">📊</div>
                          <h3 className="text-heading-h3 font-heading mb-sm text-text-primary">
                            Dashboard Inteligente
                          </h3>
                          <p className="text-text-secondary mb-lg text-sm">
                            Gestiona todas tus consultas con IA avanzada
                          </p>
                          <a 
                            href="/dashboard" 
                            className="btn btn-primary inline-flex items-center gap-2"
                          >
                            Ir al Dashboard
                            <span>→</span>
                          </a>
                        </div>

                        {/* Nueva Solicitud */}
                        <div className="card text-center hover:shadow-lexia transition-all duration-300 hover:scale-105">
                          <div className="text-4xl mb-md">🚀</div>
                          <h3 className="text-heading-h3 font-heading mb-sm text-text-primary">
                            Nueva Consulta
                          </h3>
                          <p className="text-text-secondary mb-lg text-sm">
                            Automatización inteligente en tiempo real
                          </p>
                          <a 
                            href="/solicitudes/select-type" 
                            className="btn btn-primary inline-flex items-center gap-2"
                          >
                            Crear Consulta
                            <span>✨</span>
                          </a>
                        </div>

                        {/* Historial */}
                        <div className="card text-center hover:shadow-lexia transition-all duration-300 hover:scale-105">
                          <div className="text-4xl mb-md">📈</div>
                          <h3 className="text-heading-h3 font-heading mb-sm text-text-primary">
                            Analytics Avanzado
                          </h3>
                          <p className="text-text-secondary mb-lg text-sm">
                            Insights automáticos y reportes inteligentes
                          </p>
                          <a 
                            href="/historial" 
                            className="btn btn-primary inline-flex items-center gap-2"
                          >
                            Ver Analytics
                            <span>📊</span>
                          </a>
                        </div>
                      </div>

                      {/* Características destacadas de LEXIA */}
                      <div className="bg-gradient-to-r from-tech-accent/10 to-interactive-default/10 border border-tech-accent/20 rounded-xl p-xl mb-xl">
                        <h3 className="text-heading-h2 font-heading text-center mb-lg">
                          ¿Por qué LEXIA?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-interactive-default to-yellow-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-md">
                              🤖
                            </div>
                            <h4 className="font-heading font-semibold mb-sm">IA Avanzada</h4>
                            <p className="text-sm text-text-secondary">Algoritmos inteligentes para análisis automatizado</p>
                          </div>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-tech-accent to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-md">
                              ⚡
                            </div>
                            <h4 className="font-heading font-semibold mb-sm">Velocidad Superior</h4>
                            <p className="text-sm text-text-secondary">Consultas en tiempo real 24/7 sin límites</p>
                          </div>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-feedback-success to-green-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-md">
                              🛡️
                            </div>
                            <h4 className="font-heading font-semibold mb-sm">Seguridad Total</h4>
                            <p className="text-sm text-text-secondary">Encriptación y cumplimiento normativo</p>
                          </div>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-md">
                              📊
                            </div>
                            <h4 className="font-heading font-semibold mb-sm">Analytics Integrado</h4>
                            <p className="text-sm text-text-secondary">Insights automáticos y reportes inteligentes</p>
                          </div>
                        </div>
                      </div>

                      {/* Área de pruebas de desarrollo */}
                      <div className="bg-feedback-info-light border border-feedback-info rounded-lg p-lg mb-xl">
                        <h3 className="text-heading-h3 font-semibold text-feedback-info mb-md flex items-center justify-center gap-sm">
                          🧪 Área de Pruebas de Desarrollo
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-sm justify-center">
                          <a 
                            href="/test/search-input" 
                            className="btn btn-secondary"
                          >
                            🔍 Test SearchInput Component
                          </a>
                          <a 
                            href="/test/solicitud-detail" 
                            className="btn btn-secondary"
                          >
                            📋 Test Solicitud Detail (Nuevo)
                          </a>
                        </div>
                      </div>

                      {/* Estado del sistema mejorado */}
                      <div className="p-lg bg-gradient-to-r from-feedback-success/10 to-feedback-success/5 border border-feedback-success rounded-lg text-center">
                        <div className="flex items-center justify-center gap-3 mb-md">
                          <LexiaLogo size="sm" variant="default" />
                          <h3 className="text-heading-h3 font-heading text-feedback-success">
                            Sistema Completamente Operativo
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                          <div className="text-sm text-feedback-success">
                            ✅ IA + RPA integrado
                          </div>
                          <div className="text-sm text-feedback-success">
                            ✅ Dashboard avanzado
                          </div>
                          <div className="text-sm text-feedback-success">
                            ✅ Automatización inteligente
                          </div>
                          <div className="text-sm text-feedback-success">
                            ✅ Analytics en tiempo real
                          </div>
                        </div>
                      </div>

                      {/* Migración completada */}
                      <div className="mt-lg p-lg bg-gradient-to-r from-interactive-default/10 to-yellow-400/10 border border-interactive-default/30 rounded-lg">
                        <h3 className="text-heading-h3 font-heading text-interactive-default mb-md flex items-center justify-center gap-sm">
                          🎉 Bienvenido a LEXIA
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-md text-sm text-text-secondary">
                          <div>
                            <h4 className="font-medium text-text-primary mb-xs">Nueva Experiencia:</h4>
                            <ul className="space-y-xs">
                              <li>✅ Interfaz moderna y intuitiva</li>
                              <li>✅ IA avanzada para automatización</li>
                              <li>✅ Performance optimizado</li>
                              <li>✅ Design system actualizado</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-text-primary mb-xs">Tecnología:</h4>
                            <ul className="space-y-xs">
                              <li>✅ React Query v5</li>
                              <li>✅ Componentes optimizados</li>
                              <li>✅ Tipografía y colores renovados</li>
                              <li>✅ Experiencia de usuario mejorada</li>
                            </ul>
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