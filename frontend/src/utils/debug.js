// Script de debug para verificar configuración
console.log('🔧 DEBUG MODE - Verificando configuración...')
console.log('📍 Environment Variables:')
console.log('  VITE_USE_MOCK:', import.meta.env.VITE_USE_MOCK)
console.log('  VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('  DEV mode:', import.meta.env.DEV)

// Verificar mock
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV
console.log('✅ Using MOCK:', USE_MOCK)

// Test mock service
import { mockSolicitudesService } from './mockData.js'

if (USE_MOCK) {
  console.log('🧪 Testing mock service...')
  mockSolicitudesService.getSolicitudes()
    .then(data => {
      console.log('✅ Mock data loaded:', data.length, 'solicitudes')
      console.log('📋 Sample:', data[0])
    })
    .catch(error => {
      console.error('❌ Mock error:', error)
    })
}

export const debugInfo = {
  USE_MOCK,
  env: import.meta.env,
  test: () => {
    return mockSolicitudesService.getSolicitudes()
  }
}
