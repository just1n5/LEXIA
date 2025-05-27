import { useState, useCallback, useMemo, useEffect } from 'react'

/**
 * Hook avanzado para manejo de tablas con búsqueda, filtros, paginación y ordenamiento
 */
export function useTable(data = [], options = {}) {
  const {
    initialPageSize = 10,
    initialSortBy = null,
    initialSortOrder = 'asc',
    searchFields = [], // campos en los que buscar
    enableSearch = true,
    enableSort = true,
    enableFilter = true,
    enablePagination = true,
    debounceMs = 300,
    caseSensitiveSearch = false,
  } = options

  // Estados principales
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [sortOrder, setSortOrder] = useState(initialSortOrder)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [filters, setFilters] = useState({})
  const [selectedRows, setSelectedRows] = useState(new Set())

  // Debounce para búsqueda
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs)

  // Función de búsqueda
  const searchFunction = useCallback((item, term) => {
    if (!term || !enableSearch) return true
    
    const searchString = caseSensitiveSearch ? term : term.toLowerCase()
    
    // Si no se especifican campos, buscar en todos los valores del objeto
    if (searchFields.length === 0) {
      return Object.values(item).some(value => {
        if (value == null) return false
        const itemString = caseSensitiveSearch 
          ? String(value) 
          : String(value).toLowerCase()
        return itemString.includes(searchString)
      })
    }
    
    // Buscar solo en los campos especificados
    return searchFields.some(field => {
      const value = getNestedValue(item, field)
      if (value == null) return false
      const itemString = caseSensitiveSearch 
        ? String(value) 
        : String(value).toLowerCase()
      return itemString.includes(searchString)
    })
  }, [searchFields, enableSearch, caseSensitiveSearch])

  // Función de filtrado
  const filterFunction = useCallback((item) => {
    if (!enableFilter || Object.keys(filters).length === 0) return true
    
    return Object.entries(filters).every(([field, filterValue]) => {
      if (filterValue == null || filterValue === '') return true
      
      const itemValue = getNestedValue(item, field)
      
      // Si es un array, verificar si incluye el valor
      if (Array.isArray(filterValue)) {
        return filterValue.includes(itemValue)
      }
      
      // Si es un objeto con operadores
      if (typeof filterValue === 'object' && filterValue.operator) {
        const { operator, value } = filterValue
        switch (operator) {
          case 'equals':
            return itemValue === value
          case 'contains':
            return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
          case 'startsWith':
            return String(itemValue).toLowerCase().startsWith(String(value).toLowerCase())
          case 'endsWith':
            return String(itemValue).toLowerCase().endsWith(String(value).toLowerCase())
          case 'gt':
            return Number(itemValue) > Number(value)
          case 'gte':
            return Number(itemValue) >= Number(value)
          case 'lt':
            return Number(itemValue) < Number(value)
          case 'lte':
            return Number(itemValue) <= Number(value)
          case 'between':
            return Number(itemValue) >= Number(value[0]) && Number(itemValue) <= Number(value[1])
          default:
            return itemValue === value
        }
      }
      
      // Comparación simple
      return itemValue === filterValue
    })
  }, [filters, enableFilter])

  // Función de ordenamiento
  const sortFunction = useCallback((a, b) => {
    if (!enableSort || !sortBy) return 0
    
    const aValue = getNestedValue(a, sortBy)
    const bValue = getNestedValue(b, sortBy)
    
    // Manejar valores nulos/undefined
    if (aValue == null && bValue == null) return 0
    if (aValue == null) return sortOrder === 'asc' ? -1 : 1
    if (bValue == null) return sortOrder === 'asc' ? 1 : -1
    
    // Ordenamiento numérico
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    // Ordenamiento de fechas
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === 'asc' 
        ? aValue.getTime() - bValue.getTime() 
        : bValue.getTime() - aValue.getTime()
    }
    
    // Ordenamiento de strings
    const aStr = String(aValue).toLowerCase()
    const bStr = String(bValue).toLowerCase()
    
    if (sortOrder === 'asc') {
      return aStr.localeCompare(bStr)
    } else {
      return bStr.localeCompare(aStr)
    }
  }, [sortBy, sortOrder, enableSort])

  // Datos procesados
  const processedData = useMemo(() => {
    let filtered = [...data]
    
    // Aplicar búsqueda
    if (enableSearch && debouncedSearchTerm) {
      filtered = filtered.filter(item => searchFunction(item, debouncedSearchTerm))
    }
    
    // Aplicar filtros
    if (enableFilter) {
      filtered = filtered.filter(filterFunction)
    }
    
    // Aplicar ordenamiento
    if (enableSort && sortBy) {
      filtered.sort(sortFunction)
    }
    
    return filtered
  }, [data, debouncedSearchTerm, searchFunction, filterFunction, sortFunction, enableSearch, enableFilter, enableSort, sortBy])

  // Datos paginados
  const paginatedData = useMemo(() => {
    if (!enablePagination) return processedData
    
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return processedData.slice(startIndex, endIndex)
  }, [processedData, currentPage, pageSize, enablePagination])

  // Información de paginación
  const paginationInfo = useMemo(() => {
    const totalItems = processedData.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalItems)
    
    return {
      totalItems,
      totalPages,
      currentPage,
      pageSize,
      startItem,
      endItem,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    }
  }, [processedData.length, currentPage, pageSize])

  // Handlers
  const handleSearch = useCallback((term) => {
    setSearchTerm(term)
    setCurrentPage(1) // Resetear a la primera página
  }, [])

  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }, [sortBy])

  const handleFilter = useCallback((field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, paginationInfo.totalPages)))
  }, [paginationInfo.totalPages])

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
    setSearchTerm('')
    setCurrentPage(1)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
    setCurrentPage(1)
  }, [])

  // Selección de filas
  const handleRowSelect = useCallback((rowId, selected) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(rowId)
      } else {
        newSet.delete(rowId)
      }
      return newSet
    })
  }, [])

  const handleSelectAll = useCallback((selected) => {
    if (selected) {
      const allIds = paginatedData.map(item => item.id).filter(Boolean)
      setSelectedRows(new Set(allIds))
    } else {
      setSelectedRows(new Set())
    }
  }, [paginatedData])

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set())
  }, [])

  // Reset completo
  const reset = useCallback(() => {
    setSearchTerm('')
    setSortBy(initialSortBy)
    setSortOrder(initialSortOrder)
    setCurrentPage(1)
    setPageSize(initialPageSize)
    setFilters({})
    setSelectedRows(new Set())
  }, [initialSortBy, initialSortOrder, initialPageSize])

  return {
    // Datos
    data: paginatedData,
    processedData,
    originalData: data,
    
    // Estados de búsqueda y filtros
    searchTerm,
    debouncedSearchTerm,
    filters,
    
    // Estados de ordenamiento
    sortBy,
    sortOrder,
    
    // Estados de paginación
    currentPage,
    pageSize,
    paginationInfo,
    
    // Estados de selección
    selectedRows,
    selectedRowsArray: Array.from(selectedRows),
    isRowSelected: (rowId) => selectedRows.has(rowId),
    selectedCount: selectedRows.size,
    
    // Handlers
    handleSearch,
    handleSort,
    handleFilter,
    handlePageChange,
    handlePageSizeChange,
    handleRowSelect,
    handleSelectAll,
    
    // Utilidades
    clearFilters,
    clearSearch,
    clearSelection,
    reset,
    
    // Helpers para componentes
    getSortProps: (field) => ({
      sortBy: sortBy === field,
      sortOrder: sortBy === field ? sortOrder : null,
      onClick: () => handleSort(field),
    }),
    
    getSearchProps: () => ({
      value: searchTerm,
      onChange: (e) => handleSearch(e.target ? e.target.value : e),
      placeholder: `Buscar${searchFields.length > 0 ? ` en ${searchFields.join(', ')}` : ''}...`,
    }),
    
    getPaginationProps: () => ({
      ...paginationInfo,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
    }),
  }
}

// Función helper para obtener valores anidados
function getNestedValue(obj, path) {
  if (!path) return obj
  
  return path.split('.').reduce((current, key) => {
    return current?.[key]
  }, obj)
}

// Hook para debounce (si no existe)
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useTable
