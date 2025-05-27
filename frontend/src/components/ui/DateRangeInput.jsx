import React, { useState, useEffect } from 'react'
import { Calendar, AlertCircle } from 'lucide-react'
import { cn } from '../../utils/cn'
import Input from './Input'

/**
 * Componente reutilizable para rangos de fecha
 * Incluye validación automática y formateo
 */
const DateRangeInput = ({
  startDate = '',
  endDate = '',
  onStartDateChange = () => {},
  onEndDateChange = () => {},
  onRangeChange = () => {}, // Callback cuando cambia el rango completo
  startLabel = 'Desde',
  endLabel = 'Hasta',
  error = null,
  disabled = false,
  required = false,
  className = '',
  layout = 'horizontal', // 'horizontal' | 'vertical'
  ...props
}) => {
  const [internalStartDate, setInternalStartDate] = useState(startDate)
  const [internalEndDate, setInternalEndDate] = useState(endDate)
  const [validationError, setValidationError] = useState(null)

  // Sincronizar props con estado interno
  useEffect(() => {
    setInternalStartDate(startDate)
  }, [startDate])

  useEffect(() => {
    setInternalEndDate(endDate)
  }, [endDate])

  // Validar rango de fechas
  const validateDateRange = (start, end) => {
    if (!start || !end) {
      setValidationError(null)
      return true
    }

    const startDateObj = new Date(start)
    const endDateObj = new Date(end)

    if (startDateObj > endDateObj) {
      setValidationError('La fecha de inicio no puede ser posterior a la fecha final')
      return false
    }

    // Validar que no sean fechas futuras (opcional)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    
    if (startDateObj > today) {
      setValidationError('La fecha de inicio no puede ser futura')
      return false
    }

    if (endDateObj > today) {
      setValidationError('La fecha final no puede ser futura')
      return false
    }

    setValidationError(null)
    return true
  }

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value
    setInternalStartDate(newStartDate)
    onStartDateChange(newStartDate)
    
    // Validar y notificar cambio de rango
    if (validateDateRange(newStartDate, internalEndDate)) {
      onRangeChange({
        startDate: newStartDate,
        endDate: internalEndDate,
        isValid: true
      })
    } else {
      onRangeChange({
        startDate: newStartDate,
        endDate: internalEndDate,
        isValid: false
      })
    }
  }

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value
    setInternalEndDate(newEndDate)
    onEndDateChange(newEndDate)
    
    // Validar y notificar cambio de rango
    if (validateDateRange(internalStartDate, newEndDate)) {
      onRangeChange({
        startDate: internalStartDate,
        endDate: newEndDate,
        isValid: true
      })
    } else {
      onRangeChange({
        startDate: internalStartDate,
        endDate: newEndDate,
        isValid: false
      })
    }
  }

  // Limpiar ambas fechas
  const clearDates = () => {
    setInternalStartDate('')
    setInternalEndDate('')
    setValidationError(null)
    onStartDateChange('')
    onEndDateChange('')
    onRangeChange({
      startDate: '',
      endDate: '',
      isValid: true
    })
  }

  // Presets rápidos
  const applyPreset = (preset) => {
    const today = new Date()
    let startDate, endDate

    switch (preset) {
      case 'today':
        startDate = endDate = today.toISOString().split('T')[0]
        break
      case 'yesterday':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        startDate = endDate = yesterday.toISOString().split('T')[0]
        break
      case 'last7days':
        const last7 = new Date(today)
        last7.setDate(last7.getDate() - 7)
        startDate = last7.toISOString().split('T')[0]
        endDate = today.toISOString().split('T')[0]
        break
      case 'last30days':
        const last30 = new Date(today)
        last30.setDate(last30.getDate() - 30)
        startDate = last30.toISOString().split('T')[0]
        endDate = today.toISOString().split('T')[0]
        break
      case 'thisMonth':
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        startDate = firstDay.toISOString().split('T')[0]
        endDate = today.toISOString().split('T')[0]
        break
      default:
        return
    }

    setInternalStartDate(startDate)
    setInternalEndDate(endDate)
    onStartDateChange(startDate)
    onEndDateChange(endDate)
    validateDateRange(startDate, endDate)
    onRangeChange({
      startDate,
      endDate,
      isValid: true
    })
  }

  const containerClasses = cn(
    'date-range-input',
    layout === 'vertical' ? 'flex flex-col space-y-4' : 'flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0 space-y-4',
    className
  )

  const inputGroupClasses = cn(
    layout === 'vertical' ? 'w-full' : 'flex-1'
  )

  const currentError = error || validationError

  return (
    <div className={containerClasses} {...props}>
      {/* Inputs de fechas */}
      <div className={cn(
        layout === 'vertical' ? 'space-y-4' : 'flex space-x-4 flex-1'
      )}>
        <div className={inputGroupClasses}>
          <Input
            type="date"
            label={startLabel}
            value={internalStartDate}
            onChange={handleStartDateChange}
            disabled={disabled}
            required={required}
            icon={<Calendar className="w-5 h-5" />}
            error={currentError && internalStartDate ? currentError : null}
          />
        </div>

        <div className={inputGroupClasses}>
          <Input
            type="date"
            label={endLabel}
            value={internalEndDate}
            onChange={handleEndDateChange}
            disabled={disabled}
            required={required}
            icon={<Calendar className="w-5 h-5" />}
            error={currentError && internalEndDate ? currentError : null}
          />
        </div>
      </div>

      {/* Error global */}
      {currentError && (
        <div className="flex items-center space-x-2 text-sm text-red-600 mt-2">
          <AlertCircle className="w-4 h-4" />
          <span>{currentError}</span>
        </div>
      )}

      {/* Presets rápidos */}
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          type="button"
          onClick={() => applyPreset('today')}
          disabled={disabled}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
        >
          Hoy
        </button>
        <button
          type="button"
          onClick={() => applyPreset('yesterday')}
          disabled={disabled}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
        >
          Ayer
        </button>
        <button
          type="button"
          onClick={() => applyPreset('last7days')}
          disabled={disabled}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
        >
          Últimos 7 días
        </button>
        <button
          type="button"
          onClick={() => applyPreset('last30days')}
          disabled={disabled}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
        >
          Últimos 30 días
        </button>
        <button
          type="button"
          onClick={() => applyPreset('thisMonth')}
          disabled={disabled}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
        >
          Este mes
        </button>
        {(internalStartDate || internalEndDate) && (
          <button
            type="button"
            onClick={clearDates}
            disabled={disabled}
            className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors disabled:opacity-50"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}

DateRangeInput.displayName = 'DateRangeInput'

export default DateRangeInput
