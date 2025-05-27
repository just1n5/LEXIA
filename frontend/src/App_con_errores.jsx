import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './components/ui/Toast'

// Páginas
import LoginPage from './pages/auth/LoginPage'
import SelectAccountTypePage from './pages/auth/SelectAccountTypePage'
import RegisterPersonalPage from './pages/auth/RegisterPersonalPage'
import RegisterBusinessPage from './pages/auth/RegisterBusinessPage'
import DashboardPage from './pages/dashboard/DashboardPage'

// Componentes
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'

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
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Rutas públicas */}
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
              
              {/* Rutas protegidas */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              {/* Redirigir rutas no encontradas al login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
