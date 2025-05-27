import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../ui/Button'
import { cn } from '../../utils/cn'

function TablePagination({ 
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  disabled = false
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !disabled) {
      onPageChange(page)
    }
  }

  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Mostrar páginas con ellipsis
      if (currentPage <= 3) {
        // Inicio: 1, 2, 3, 4, ..., última
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        if (totalPages > 4) {
          pages.push('...')
          pages.push(totalPages)
        }
      } else if (currentPage >= totalPages - 2) {
        // Final: 1, ..., n-3, n-2, n-1, n
        pages.push(1)
        if (totalPages > 4) {
          pages.push('...')
        }
        for (let i = Math.max(1, totalPages - 3); i <= totalPages; i++) {
          if (i > 1 || totalPages <= 4) {
            pages.push(i)
          }
        }
      } else {
        // Medio: 1, ..., current-1, current, current+1, ..., última
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalItems === 0) {
    return null
  }

  return (
    <div className="table-pagination">
      <div className="pagination-info">
        Mostrando {startItem}-{endItem} de {totalItems} solicitudes
      </div>
      
      <div className="pagination-controls">
        {/* Botón anterior */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          className="pagination-button"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </Button>

        {/* Números de página */}
        {generatePageNumbers().map((page, index) => (
          page === '...' ? (
            <span 
              key={`ellipsis-${index}`} 
              className="pagination-ellipsis"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(page)}
              disabled={disabled}
              className={cn(
                'pagination-button',
                page === currentPage && 'active'
              )}
            >
              {page}
            </Button>
          )
        ))}

        {/* Botón siguiente */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          className="pagination-button"
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}

export default TablePagination
