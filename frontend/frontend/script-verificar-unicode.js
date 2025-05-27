// script-verificar-unicode.js
// Ejecutar con: node script-verificar-unicode.js

import fs from 'fs'
import path from 'path'

const srcDir = './src'

function hasUnicodeIssues(content) {
  // Buscar caracteres Unicode problemáticos o caracteres invisibles
  const unicodeRegex = /[\u2000-\u206F\u2070-\u209F\u20A0-\u20CF\uFEFF]/g
  const invisibleRegex = /[\u200B-\u200D\uFEFF]/g
  
  return unicodeRegex.test(content) || invisibleRegex.test(content)
}

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    
    // Verificar BOM
    const hasBOM = content.charCodeAt(0) === 0xFEFF
    
    // Verificar caracteres Unicode problemáticos
    const hasUnicode = hasUnicodeIssues(content)
    
    // Verificar primera línea específicamente
    const firstLine = content.split('\n')[0]
    const firstLineIssues = hasUnicodeIssues(firstLine)
    
    if (hasBOM || hasUnicode || firstLineIssues) {
      console.log(`⚠️  ${filePath}`)
      if (hasBOM) console.log('   - Tiene BOM')
      if (hasUnicode) console.log('   - Tiene caracteres Unicode problemáticos')
      if (firstLineIssues) console.log('   - Primera línea tiene caracteres invisibles')
      
      // Mostrar caracteres problemáticos en la primera línea
      if (firstLineIssues) {
        for (let i = 0; i < firstLine.length; i++) {
          const char = firstLine[i]
          const code = firstLine.charCodeAt(i)
          if (code > 127 && !/[áéíóúñüÁÉÍÓÚÑÜ]/.test(char)) {
            console.log(`   - Posición ${i}: U+${code.toString(16).toUpperCase().padStart(4, '0')} (${char})`)
          }
        }
      }
      return true
    }
    return false
  } catch (error) {
    console.log(`❌ Error leyendo ${filePath}: ${error.message}`)
    return false
  }
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  let issuesFound = 0
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name)
    
    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      issuesFound += scanDirectory(fullPath)
    } else if (file.name.endsWith('.jsx') || file.name.endsWith('.js') || file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
      if (checkFile(fullPath)) {
        issuesFound++
      }
    }
  })
  
  return issuesFound
}

console.log('🔍 Escaneando archivos en busca de problemas Unicode...\n')

const issues = scanDirectory(srcDir)

console.log(`\n📊 Escaneo completado:`)
console.log(`   ${issues} archivo(s) con problemas encontrados`)

if (issues === 0) {
  console.log('✅ ¡Todos los archivos están limpios!')
} else {
  console.log('\n💡 Para corregir estos archivos:')
  console.log('   1. Abre cada archivo en VS Code')
  console.log('   2. Guarda con "UTF-8 without BOM"')
  console.log('   3. O reescribe manualmente las primeras líneas')
}
