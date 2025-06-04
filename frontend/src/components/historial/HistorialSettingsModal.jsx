import React, { useState, useEffect } from 'react'
import { X, Save, RefreshCw, Settings2, Eye, Download, Clock, Filter } from 'lucide-react'
import Button from '../ui/Button'

const HistorialSettingsModal = ({
  isOpen = false,
  onClose = () => {},
  settings = {},
  onSave = () => {}
}) => {
  const [localSettings, setLocalSettings] = useState({
    columnsVisible: {
      radicado: true,
      estado: true,
      fecha: true,
      demandante: true,
      demandado: true,
      juzgado: true,
      acciones: true
    },
    itemsPerPage: 10,
    autoRefresh: true,
    refreshInterval: 30,
    dateFormat: 'dd/mm/yyyy',
    exportFormat: 'excel',
    showAdvancedFilters: false,
    ...settings
  })

  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Detectar cambios en la configuración
  useEffect(() => {
    const currentSettings = JSON.stringify(localSettings)
    const originalSettings = JSON.stringify({ ...settings })
    setHasChanges(currentSettings !== originalSettings)
  }, [localSettings, settings])

  const handleClose = () => {
    if (hasChanges) {
      const confirm = window.confirm('¿Deseas guardar los cambios antes de cerrar?')
      if (confirm) {
        handleSave()
        return
      }
    }
    setLocalSettings({ ...settings })
    onClose()
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(localSettings)
      setHasChanges(false)
      onClose()
    } catch (error) {
      console.error('Error al guardar configuración:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const updateColumnVisibility = (column, visible) => {
    setLocalSettings(prev => ({
      ...prev,
      columnsVisible: {
        ...prev.columnsVisible,
        [column]: visible
      }
    }))
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
        <div
          className="bg-bg-canvas rounded-lg border border-border-default shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-lg border-b border-border-default">
            <div className="flex items-center gap-sm">
              <Settings2 className="w-5 h-5 text-interactive-default" />
              <h2 className="text-heading-h2 font-heading text-text-primary">
                Configuración del Historial
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              icon={<X className="w-4 h-4" />}
              aria-label="Cerrar modal"
            />
          </div>

          {/* Content */}
          <div className="p-lg space-y-xl overflow-y-auto max-h-[60vh]">
            {/* Columnas Visibles */}
            <section className="space-y-md">
              <h3 className="text-heading-h3 font-heading text-text-primary flex items-center gap-sm">
                <Eye className="w-4 h-4" />
                Columnas Visibles
              </h3>
              <div className="grid grid-cols-2 gap-sm">
                {Object.entries(localSettings.columnsVisible).map(([column, visible]) => (
                  <label
                    key={column}
                    className="flex items-center gap-xs cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={visible}
                      onChange={(e) => updateColumnVisibility(column, e.target.checked)}
                      className="w-4 h-4 text-interactive-default border border-border-default rounded focus:ring-2 focus:ring-interactive-default"
                    />
                    <span className="text-body-paragraph font-sans text-text-base capitalize">
                      {column}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Paginación */}
            <section className="space-y-md">
              <h3 className="text-heading-h3 font-heading text-text-primary">
                Paginación
              </h3>
              <div>
                <label className="block text-body-paragraph font-sans text-text-primary font-medium mb-xs">
                  Elementos por página
                </label>
                <select
                  value={localSettings.itemsPerPage}
                  onChange={(e) => updateSetting('itemsPerPage', parseInt(e.target.value))}
                  className="w-full px-sm py-sm border border-border-default rounded-md text-body-paragraph font-sans text-text-base focus:ring-2 focus:ring-interactive-default focus:border-interactive-default"
                >
                  <option value={5}>5 elementos</option>
                  <option value={10}>10 elementos</option>
                  <option value={25}>25 elementos</option>
                  <option value={50}>50 elementos</option>
                  <option value={100}>100 elementos</option>
                </select>
              </div>
            </section>

            {/* Actualización Automática */}
            <section className="space-y-md">
              <h3 className="text-heading-h3 font-heading text-text-primary flex items-center gap-sm">
                <RefreshCw className="w-4 h-4" />
                Actualización Automática
              </h3>
              <div className="space-y-sm">
                <label className="flex items-center gap-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.autoRefresh}
                    onChange={(e) => updateSetting('autoRefresh', e.target.checked)}
                    className="w-4 h-4 text-interactive-default border border-border-default rounded focus:ring-2 focus:ring-interactive-default"
                  />
                  <span className="text-body-paragraph font-sans text-text-base">
                    Habilitar actualización automática
                  </span>
                </label>

                {localSettings.autoRefresh && (
                  <div>
                    <label className="block text-body-paragraph font-sans text-text-primary font-medium mb-xs">
                      Intervalo (segundos)
                    </label>
                    <select
                      value={localSettings.refreshInterval}
                      onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value))}
                      className="w-full px-sm py-sm border border-border-default rounded-md text-body-paragraph font-sans text-text-base focus:ring-2 focus:ring-interactive-default focus:border-interactive-default"
                    >
                      <option value={15}>15 segundos</option>
                      <option value={30}>30 segundos</option>
                      <option value={60}>1 minuto</option>
                      <option value={300}>5 minutos</option>
                    </select>
                  </div>
                )}
              </div>
            </section>

            {/* Formato de Fecha */}
            <section className="space-y-md">
              <h3 className="text-heading-h3 font-heading text-text-primary flex items-center gap-sm">
                <Clock className="w-4 h-4" />
                Formato de Fecha
              </h3>
              <div>
                <select
                  value={localSettings.dateFormat}
                  onChange={(e) => updateSetting('dateFormat', e.target.value)}
                  className="w-full px-sm py-sm border border-border-default rounded-md text-body-paragraph font-sans text-text-base focus:ring-2 focus:ring-interactive-default focus:border-interactive-default"
                >
                  <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                  <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  <option value="dd-mm-yyyy">DD-MM-YYYY</option>
                </select>
              </div>
            </section>

            {/* Exportación */}
            <section className="space-y-md">
              <h3 className="text-heading-h3 font-heading text-text-primary flex items-center gap-sm">
                <Download className="w-4 h-4" />
                Formato de Exportación Predeterminado
              </h3>
              <div>
                <select
                  value={localSettings.exportFormat}
                  onChange={(e) => updateSetting('exportFormat', e.target.value)}
                  className="w-full px-sm py-sm border border-border-default rounded-md text-body-paragraph font-sans text-text-base focus:ring-2 focus:ring-interactive-default focus:border-interactive-default"
                >
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="csv">CSV (.csv)</option>
                  <option value="pdf">PDF (.pdf)</option>
                </select>
              </div>
            </section>

            {/* Filtros Avanzados */}
            <section className="space-y-md">
              <h3 className="text-heading-h3 font-heading text-text-primary flex items-center gap-sm">
                <Filter className="w-4 h-4" />
                Filtros
              </h3>
              <label className="flex items-center gap-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.showAdvancedFilters}
                  onChange={(e) => updateSetting('showAdvancedFilters', e.target.checked)}
                  className="w-4 h-4 text-interactive-default border border-border-default rounded focus:ring-2 focus:ring-interactive-default"
                />
                <span className="text-body-paragraph font-sans text-text-base">
                  Mostrar filtros avanzados por defecto
                </span>
              </label>
            </section>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-sm p-lg border-t border-border-default">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              icon={isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

HistorialSettingsModal.displayName = 'HistorialSettingsModal'

export default HistorialSettingsModal
