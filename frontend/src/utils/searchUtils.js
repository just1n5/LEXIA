/**
 * Normaliza texto removiendo tildes, espacios extra y convirtiendo a minúsculas
 * para búsquedas más flexibles
 */
export function normalizeText(text) {
  if (!text || typeof text !== 'string') return ''
  
  return text
    .toLowerCase()
    .normalize('NFD') // Separa caracteres de sus acentos
    .replace(/[\u0300-\u036f]/g, '') // Remueve los acentos
    .replace(/\s+/g, ' ') // Normaliza espacios múltiples
    .trim()
}

/**
 * Verifica si el texto de búsqueda coincide con el texto objetivo
 * ignorando tildes, mayúsculas y espacios extra
 */
export function matchesSearch(searchText, targetText) {
  if (!searchText || !targetText) return false
  
  const normalizedSearch = normalizeText(searchText)
  const normalizedTarget = normalizeText(targetText)
  
  return normalizedTarget.includes(normalizedSearch)
}

/**
 * Filtra un array de objetos basado en múltiples campos de búsqueda
 * ignorando tildes y mayúsculas
 */
export function searchInFields(items, searchTerm, fields) {
  if (!searchTerm || !searchTerm.trim()) return items
  
  const normalizedSearch = normalizeText(searchTerm)
  
  return items.filter(item => {
    return fields.some(field => {
      const fieldValue = getNestedValue(item, field)
      return fieldValue && matchesSearch(normalizedSearch, fieldValue)
    })
  })
}

/**
 * Obtiene el valor de un campo anidado usando dot notation
 * ej: 'user.profile.name' -> item.user.profile.name
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null
  }, obj)
}

/**
 * Resalta el texto de búsqueda en el resultado
 * preservando las tildes originales
 */
export function highlightMatch(text, searchTerm) {
  if (!searchTerm || !searchTerm.trim() || !text) return text
  
  const normalizedSearch = normalizeText(searchTerm)
  const normalizedText = normalizeText(text)
  
  // Si no hay coincidencia, retornar texto original
  if (!normalizedText.includes(normalizedSearch)) return text
  
  // Encontrar todas las coincidencias ignorando tildes
  const regex = new RegExp(
    normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 
    'gi'
  )
  
  // Crear un mapeo de posiciones
  const originalText = text
  let result = originalText
  const matches = []
  
  // Buscar coincidencias en el texto normalizado
  let match
  const normalizedRegex = new RegExp(normalizedSearch, 'gi')
  while ((match = normalizedRegex.exec(normalizedText)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length
    })
  }
  
  // Aplicar highlights de atrás hacia adelante para no afectar índices
  matches.reverse().forEach(({ start, end }) => {
    const beforeMatch = originalText.substring(0, start)
    const matchText = originalText.substring(start, end)
    const afterMatch = originalText.substring(end)
    
    result = beforeMatch + `<mark>${matchText}</mark>` + afterMatch
  })
  
  return result
}

// Ejemplos de uso:
// normalizeText("García Pérez") → "garcia perez"
// matchesSearch("garcia", "García Pérez") → true
// matchesSearch("perez", "García Pérez") → true
// searchInFields(solicitudes, "garcia", ["alias", "criterio_busqueda_nombre"])
