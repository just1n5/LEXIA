import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Componente de paginación completo y accesible
 */
const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange = () => {},
  showInfo = true,
  maxVisiblePages = 5,
  className = '',
  ...props
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  
  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  // Generar números de página visibles
  const getVisiblePages = () => {
    const delta = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - delta)
    let end = Math.min(totalPages, currentPage + delta)

    // Ajustar si estamos cerca del inicio o final
    if (end - start + 1 < maxVisiblePages) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisiblePages - 1)
      } else if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1)
      }
    }

    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={cn('flex flex-col sm:flex-row justify-between items-center gap-4 mt-6', className)} {...props}>
      {/* Información de resultados */}
      {showInfo && (
        <div className="text-sm text-gray-600">
          Mostrando <span className="font-medium">{startItem}</span> a{' '}
          <span className="font-medium">{endItem}</span> de{' '}
          <span className="font-medium">{totalItems}</span> resultados
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex items-center gap-1">
        {/* Botón anterior */}
        <button
          onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className={cn(
            'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
            hasPreviousPage
              ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
          )}
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Primera página si no está visible */}
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="px-2 py-2 text-sm text-gray-500">...</span>
            )}
          </>
        )}

        {/* Páginas visibles */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'px-3 py-2 text-sm font-medium rounded-md transition-colors',
              page === currentPage
                ? 'text-white bg-blue-600 border border-blue-600'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            )}
            aria-label={`Página ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {/* Última página si no está visible */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-2 py-2 text-sm text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Botón siguiente */}
        <button
          onClick={() => hasNextPage && onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className={cn(
            'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
            hasNextPage
              ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
          )}
          aria-label="Página siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

Pagination.displayName = 'Pagination'

export default Pagination
