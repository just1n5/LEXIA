// ARCHIVO DE DIAGNÓSTICO TEMPORAL
// Para verificar qué está pasando con los datos

console.log('🔍 DIAGNÓSTICO: Iniciando verificación de mockData...')

// Importar directamente el mockData
import { mockSolicitudes, mockSolicitudesService } from './mockData.js'

console.log('📊 mockSolicitudes length:', mockSolicitudes.length)
console.log('📋 Primera solicitud:', mockSolicitudes[0])

// Probar el servicio
mockSolicitudesService.getSolicitudes().then(result => {
  console.log('✅ Resultado del servicio:', result)
  console.log('🔢 Cantidad devuelta:', result.length)
}).catch(error => {
  console.error('❌ Error en servicio:', error)
})

export const diagnostico = {
  totalSolicitudes: mockSolicitudes.length,
  primerasSolicitudes: mockSolicitudes.slice(0, 3),
  servicio: mockSolicitudesService
}
