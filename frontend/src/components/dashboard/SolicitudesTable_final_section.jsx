              {/* 🆕 Nueva sección para accesos rápidos */}
              <div>
                <h5 className="font-medium text-text-primary mb-2">Accesos Rápidos:</h5>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-blue-600" />
                    <span className="text-text-secondary">Badge azul: Ver historial específico</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-3 h-3 text-gray-600" />
                    <span className="text-text-secondary">Iconos: Ver, editar, eliminar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-100 rounded text-xs flex items-center justify-center">H</span>
                    <span className="text-text-secondary">Botón historial en cada fila</span>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}

SolicitudesTable.displayName = 'SolicitudesTable'

export default SolicitudesTable