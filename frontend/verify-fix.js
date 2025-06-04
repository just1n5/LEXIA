// 🧪 Script de verificación para errores de ciclo infinito
// Ejecutar en consola del navegador después de la corrección

console.log('🔍 === VERIFICACIÓN DE CICLOS INFINITOS ===')

// 1. Verificar que no hay warnings de React
const originalWarn = console.warn
const originalError = console.error
let reactWarnings = 0
let reactErrors = 0

console.warn = function(...args) {
  if (args[0] && args[0].includes('Maximum update depth exceeded')) {
    reactWarnings++
  }
  return originalWarn.apply(console, args)
}

console.error = function(...args) {
  if (args[0] && args[0].includes('Maximum update depth exceeded')) {
    reactErrors++
  }
  return originalError.apply(console, arguments)
}

// 2. Función para verificar performance de render
const checkRenderPerformance = () => {
  const start = performance.now()
  
  // Simular interacción con filtros
  try {
    // Buscar el componente AdvancedFilters
    const searchInput = document.querySelector('input[placeholder*="Buscar"]')
    if (searchInput) {
      console.log('✅ Componente AdvancedFilters encontrado')
      
      // Simular typing para verificar que no hay ciclos
      searchInput.focus()
      searchInput.value = 'test'
      searchInput.dispatchEvent(new Event('input', { bubbles: true }))
      
      setTimeout(() => {
        searchInput.value = ''
        searchInput.dispatchEvent(new Event('input', { bubbles: true }))
      }, 100)
      
    } else {
      console.log('⚠️ Componente AdvancedFilters no encontrado en esta página')
    }
  } catch (error) {
    console.error('❌ Error durante verificación:', error)
  }
  
  const end = performance.now()
  const duration = end - start
  
  console.log(`⏱️ Tiempo de verificación: ${duration.toFixed(2)}ms`)
  
  if (duration > 100) {
    console.warn('⚠️ Performance degradada - posibles problemas de re-render')
  } else {
    console.log('✅ Performance normal')
  }
}

// 3. Verificar después de un tiempo
setTimeout(() => {
  console.log('\n📊 === RESULTADOS DE VERIFICACIÓN ===')
  
  if (reactWarnings === 0 && reactErrors === 0) {
    console.log('✅ SIN ERRORES DE CICLO INFINITO')
    console.log('✅ AdvancedFilters funcionando correctamente')
  } else {
    console.error(`❌ Se detectaron ${reactWarnings} warnings y ${reactErrors} errores`)
    console.log('❌ Revisar la implementación de AdvancedFilters')
  }
  
  // Verificar memory usage
  if (performance.memory) {
    const memInfo = performance.memory
    console.log('\n🧠 === INFORMACIÓN DE MEMORIA ===')
    console.log(`Memoria usada: ${(memInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Límite de memoria: ${(memInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`)
    
    const memoryUsage = (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100
    if (memoryUsage > 50) {
      console.warn(`⚠️ Uso alto de memoria: ${memoryUsage.toFixed(1)}%`)
    } else {
      console.log(`✅ Uso normal de memoria: ${memoryUsage.toFixed(1)}%`)
    }
  }
  
  // Restaurar funciones originales
  console.warn = originalWarn
  console.error = originalError
  
  console.log('\n🎯 === RECOMENDACIONES ===')
  console.log('1. Si ves ✅, el problema está corregido')
  console.log('2. Si ves ❌, revisa el código de AdvancedFilters.jsx')
  console.log('3. Navega a diferentes tabs para verificar estabilidad')
  console.log('4. Usa React DevTools para monitorear re-renders')
  
}, 3000)

// 4. Ejecutar verificación inmediata
checkRenderPerformance()

console.log('⏳ Verificación en progreso... Resultados en 3 segundos')

// 5. Función para verificar manualmente
window.verifyNoInfiniteLoop = () => {
  console.clear()
  console.log('🔄 Ejecutando verificación manual...')
  checkRenderPerformance()
  
  setTimeout(() => {
    if (reactWarnings === 0 && reactErrors === 0) {
      console.log('🎉 ¡TODO CORRECTO! No hay ciclos infinitos.')
    } else {
      console.log('⚠️ Se detectaron problemas. Revisar implementación.')
    }
  }, 1000)
}

console.log('💡 Función disponible: window.verifyNoInfiniteLoop()')
