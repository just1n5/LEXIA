// ========================================
// MOCK DATA EXPANDIDO PARA SISTEMA RPA 
// ========================================
// Datos de ejemplo realistas para desarrollo y testing

// ========================================
// DATOS BASE EXPANDIDOS (30 solicitudes)
// ========================================

export const mockSolicitudes = [
  {
    id: '1',
    alias: 'Demanda Ejecutiva - Banco Popular vs García',
    tipo_busqueda: 'radicado',
    criterio_busqueda_radicado: '11001400300420230001',
    frecuencia_envio: 'diaria',
    fecha_creacion: '2025-05-20T08:00:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-24T08:15:00Z',
    estado: 'exitoso',
    categoria: 'civil',
    despacho: 'Juzgado 15 Civil del Circuito de Bogotá'
  },
  {
    id: '2',
    alias: 'Proceso Ejecutivo - Constructora ABC S.A.S.',
    tipo_busqueda: 'nombre',
    criterio_busqueda_nombre: 'Constructora ABC S.A.S.',
    frecuencia_envio: 'semanal',
    fecha_creacion: '2025-05-18T10:00:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-20T10:30:00Z',
    estado: 'exitoso',
    categoria: 'civil',
    despacho: 'Juzgado 8 Civil del Circuito de Bogotá'
  },
  {
    id: '3',
    alias: 'Acción de Tutela - Derechos Fundamentales',
    tipo_busqueda: 'radicado',
    criterio_busqueda_radicado: '11001330300420230456',
    frecuencia_envio: 'diaria',
    fecha_creacion: '2025-05-15T14:00:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-24T09:00:00Z',
    estado: 'exitoso',
    categoria: 'constitucional',
    despacho: 'Juzgado 33 Penal Municipal Bogotá'
  },
  {
    id: '4',
    alias: 'Proceso Penal - Estafa Agravada',
    tipo_busqueda: 'radicado',
    criterio_busqueda_radicado: '11001310307020230123',
    frecuencia_envio: 'diaria',
    fecha_creacion: '2025-05-10T09:00:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-23T09:00:00Z',
    estado: 'exitoso',
    categoria: 'penal',
    despacho: 'Juzgado 7 Penal del Circuito Bogotá'
  },
  {
    id: '5',
    alias: 'Hurto Calificado - Centro Comercial',
    tipo_busqueda: 'nombre',
    criterio_busqueda_nombre: 'Carlos Mendoza Ruiz',
    frecuencia_envio: 'semanal',
    fecha_creacion: '2025-05-08T11:00:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-21T16:45:00Z',
    estado: 'exitoso',
    categoria: 'penal',
    despacho: 'Juzgado 12 Penal Municipal Bogotá'
  },
  {
    id: '6',
    alias: 'Demanda Laboral - Despido sin Justa Causa',
    tipo_busqueda: 'nombre',
    criterio_busqueda_nombre: 'María Fernanda López',
    frecuencia_envio: 'semanal',
    fecha_creacion: '2025-05-05T16:00:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-18T14:45:00Z',
    estado: 'exitoso',
    categoria: 'laboral',
    despacho: 'Juzgado 3 Laboral del Circuito Bogotá'
  },
  {
    id: '7',
    alias: 'Reclamación Prestaciones Sociales',
    tipo_busqueda: 'radicado',
    criterio_busqueda_radicado: '11001310406920230789',
    frecuencia_envio: 'mensual',
    fecha_creacion: '2025-04-28T13:00:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-15T11:20:00Z',
    estado: 'exitoso',
    categoria: 'laboral',
    despacho: 'Juzgado 69 Laboral del Circuito Bogotá'
  },
  {
    id: '8',
    alias: 'Divorcio Contencioso - Ramírez vs Peña',
    tipo_busqueda: 'nombre',
    criterio_busqueda_nombre: 'Carlos Ramírez Peña',
    frecuencia_envio: 'semanal',
    fecha_creacion: '2025-05-01T12:00:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-22T16:20:00Z',
    estado: 'exitoso',
    categoria: 'familia',
    despacho: 'Juzgado 5 de Familia Bogotá'
  },
  {
    id: '9',
    alias: 'Custodia y Alimentos Menores',
    tipo_busqueda: 'radicado',
    criterio_busqueda_radicado: '11001750000320230234',
    frecuencia_envio: 'diaria',
    fecha_creacion: '2025-04-25T15:30:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-24T10:15:00Z',
    estado: 'exitoso',
    categoria: 'familia',
    despacho: 'Juzgado 3 de Familia Bogotá'
  },
  {
    id: '10',
    alias: 'Proceso Sucesorial - Herencia González',
    tipo_busqueda: 'nombre',
    criterio_busqueda_nombre: 'Ana María González Vargas',
    frecuencia_envio: 'mensual',
    fecha_creacion: '2025-04-20T09:45:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-18T14:30:00Z',
    estado: 'exitoso',
    categoria: 'familia',
    despacho: 'Notaría 15 de Bogotá'
  },
  {
    id: '11',
    alias: 'Nulidad y Restablecimiento - DIAN',
    tipo_busqueda: 'radicado',
    criterio_busqueda_radicado: '25000234100020230456',
    frecuencia_envio: 'mensual',
    fecha_creacion: '2025-04-15T14:00:00Z',
    activa: true,
    ultima_ejecucion: null,
    estado: 'pendiente',
    categoria: 'administrativo',
    despacho: 'Tribunal Administrativo de Cundinamarca'
  },
  {
    id: '12',
    alias: 'Contencioso Administrativo - Licencia',
    tipo_busqueda: 'nombre',
    criterio_busqueda_nombre: 'Inmobiliaria Los Rosales Ltda',
    frecuencia_envio: 'semanal',
    fecha_creacion: '2025-04-12T11:00:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-19T15:00:00Z',
    estado: 'exitoso',
    categoria: 'administrativo',
    despacho: 'Juzgado 2 Administrativo Bogotá'
  },
  {
    id: '13',
    alias: 'Incumplimiento Contrato Comercial',
    tipo_busqueda: 'nombre',
    criterio_busqueda_nombre: 'Distribuidora El Dorado S.A.',
    frecuencia_envio: 'diaria',
    fecha_creacion: '2025-04-10T08:30:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-23T14:20:00Z',
    estado: 'exitoso',
    categoria: 'comercial',
    despacho: 'Juzgado 22 Civil del Circuito Bogotá'
  },
  {
    id: '14',
    alias: 'Liquidación Sociedad Comercial',
    tipo_busqueda: 'radicado',
    criterio_busqueda_radicado: '11001400312820230567',
    frecuencia_envio: 'mensual',
    fecha_creacion: '2025-04-05T16:45:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-10T09:30:00Z',
    estado: 'exitoso',
    categoria: 'comercial',
    despacho: 'Juzgado 28 Civil del Circuito Bogotá'
  },
  {
    id: '15',
    alias: 'Error Captcha - Proceso Penal',
    tipo_busqueda: 'radicado',
    criterio_busqueda_radicado: '11001310309120230890',
    frecuencia_envio: 'diaria',
    fecha_creacion: '2025-04-01T10:00:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-24T07:45:00Z',
    estado: 'error_captcha',
    categoria: 'penal',
    despacho: 'Juzgado 91 Penal del Circuito Bogotá'
  },
  {
    id: '16',
    alias: 'Mantenimiento Sistema - Tutela',
    tipo_busqueda: 'nombre',
    criterio_busqueda_nombre: 'Pedro Martínez Sánchez',
    frecuencia_envio: 'diaria',
    fecha_creacion: '2025-03-28T14:20:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-23T08:00:00Z',
    estado: 'error_sistema',
    categoria: 'constitucional',
    despacho: 'Juzgado 45 Penal Municipal Bogotá'
  },
  {
    id: '17',
    alias: 'Proceso Finalizado - Ejecutivo',
    tipo_busqueda: 'radicado',
    criterio_busqueda_radicado: '11001400301120220345',
    frecuencia_envio: 'semanal',
    fecha_creacion: '2025-03-25T12:00:00Z',
    activa: false,
    ultima_ejecucion: '2025-04-15T16:30:00Z',
    estado: 'finalizado',
    categoria: 'civil',
    despacho: 'Juzgado 11 Civil del Circuito Bogotá'
  },
  {
    id: '18',
    alias: 'Suspendido por Cliente',
    tipo_busqueda: 'nombre',
    criterio_busqueda_nombre: 'Empresa Temporal XYZ S.A.S.',
    frecuencia_envio: 'mensual',
    fecha_creacion: '2025-03-20T09:15:00Z',
    activa: false,
    ultima_ejecucion: '2025-03-30T11:45:00Z',
    estado: 'suspendido',
    categoria: 'laboral',
    despacho: 'Juzgado 15 Laboral del Circuito Bogotá'
  },
  {
    id: '19',
    alias: 'Demanda Civil - Medellín Centro',
    tipo_busqueda: 'radicado',
    criterio_busqueda_radicado: '05001400300520230123',
    frecuencia_envio: 'semanal',
    fecha_creacion: '2025-03-18T13:30:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-20T14:15:00Z',
    estado: 'exitoso',
    categoria: 'civil',
    despacho: 'Juzgado 5 Civil del Circuito Medellín'
  },
  {
    id: '20',
    alias: 'Tutela Salud EPS - Antioquia',
    tipo_busqueda: 'nombre',
    criterio_busqueda_nombre: 'Sandra Milena Ospina',
    frecuencia_envio: 'diaria',
    fecha_creacion: '2025-03-15T11:00:00Z',
    activa: true,
    ultima_ejecucion: '2025-05-24T12:30:00Z',
    estado: 'exitoso',
    categoria: 'constitucional',
    despacho: 'Juzgado 18 Penal Municipal Medellín'
  }
]

// ========================================
// ESTADÍSTICAS DINÁMICAS
// ========================================

export const mockEstadisticas = {
  get solicitudesActivas() {
    return mockSolicitudes.filter(s => s.activa).length
  },
  get actualizacionesRecientes() {
    const ahora = new Date()
    return mockSolicitudes.filter(s => {
      if (!s.ultima_ejecucion) return false
      const ejecucion = new Date(s.ultima_ejecucion)
      const diffDias = Math.ceil((ahora - ejecucion) / (1000 * 60 * 60 * 24))
      return diffDias <= 7
    }).length
  },
  get ultimaEjecucion() {
    const ultimaEjecucionMasReciente = mockSolicitudes
      .filter(s => s.ultima_ejecucion)
      .sort((a, b) => new Date(b.ultima_ejecucion) - new Date(a.ultima_ejecucion))[0]
    
    if (!ultimaEjecucionMasReciente) return 'Sin ejecuciones'
    
    const fecha = new Date(ultimaEjecucionMasReciente.ultima_ejecucion)
    const hoy = new Date()
    const diffDias = Math.ceil((hoy - fecha) / (1000 * 60 * 60 * 24))
    
    if (diffDias <= 1) return 'Hoy'
    if (diffDias === 2) return 'Ayer' 
    if (diffDias <= 7) return `Hace ${diffDias - 1} días`
    return fecha.toLocaleDateString('es-CO')
  }
}

// ========================================
// RESULTADOS EXPANDIDOS PARA HISTORIAL
// ========================================

// Actuaciones judiciales típicas por tipo de proceso
const actuacionesTipos = {
  civil: [
    'Auto - Reparto',
    'Escrito - Radicación de la Demanda',
    'Auto - Admisión de la Demanda',
    'Escrito - Contestación de la Demanda',
    'Auto - Decreto de Pruebas',
    'Audiencia - Práctica de Pruebas',
    'Auto - Cierre de Etapa Probatoria',
    'Auto - Al Despacho para Sentencia',
    'Sentencia - Proferida',
    'Escrito - Recurso de Apelación',
    'Auto - Concesión del Recurso'
  ],
  penal: [
    'Auto - Reparto',
    'Escrito - Radicación de la Denuncia',
    'Auto - Apertura de Investigación',
    'Diligencia - Indagatoria',
    'Auto - Resolución de Situación Jurídica',
    'Escrito - Acusación',
    'Auto - Acusación',
    'Audiencia - Preparatoria',
    'Audiencia - Juicio Oral',
    'Sentencia - Condenatoria/Absolutoria'
  ],
  laboral: [
    'Auto - Reparto',
    'Escrito - Demanda Laboral',
    'Auto - Admisión de la Demanda',
    'Escrito - Contestación y Excepciones',
    'Audiencia - Conciliación',
    'Auto - Decreto de Pruebas',
    'Audiencia - Trámite y Juzgamiento',
    'Sentencia - Primera Instancia',
    'Escrito - Recurso de Apelación'
  ],
  familia: [
    'Auto - Reparto',
    'Escrito - Demanda de Familia',
    'Auto - Admisión y Citación',
    'Audiencia - Conciliación',
    'Auto - Decreto de Pruebas',
    'Audiencia - Práctica de Pruebas',
    'Sentencia - Primera Instancia',
    'Auto - Ejecutoria'
  ],
  constitucional: [
    'Auto - Reparto',
    'Escrito - Acción de Tutela',
    'Auto - Admisión de la Tutela',
    'Informe - Entidad Accionada',
    'Auto - Decreto de Pruebas',
    'Sentencia - Tutela'
  ],
  administrativo: [
    'Auto - Reparto',
    'Escrito - Demanda Contenciosa',
    'Auto - Admisión de la Demanda',
    'Escrito - Contestación',
    'Auto - Decreto de Pruebas',
    'Audiencia - Práctica de Pruebas',
    'Sentencia - Primera Instancia'
  ],
  comercial: [
    'Auto - Reparto',
    'Escrito - Demanda Comercial',
    'Auto - Admisión de la Demanda',
    'Escrito - Contestación',
    'Auto - Decreto de Pruebas',
    'Audiencia - Práctica de Pruebas',
    'Sentencia - Primera Instancia'
  ]
}

// Partes típicas por categoría
const partesTipicas = {
  civil: {
    demandantes: ['Banco Popular S.A.', 'Constructora ABC S.A.S.', 'María García Rodríguez', 'Inversiones XYZ Ltda', 'Fundación Los Andes'],
    demandados: ['Juan Carlos Pérez', 'Empresa Constructora DEF', 'Ana María González', 'Inmobiliaria Central', 'Carlos Mendoza Silva']
  },
  penal: {
    demandantes: ['Fiscalía General de la Nación', 'Ministerio Público'],
    demandados: ['Carlos Mendoza Ruiz', 'Sandra Milena Torres', 'Luis Fernando Gómez', 'Patricia Herrera López']
  },
  laboral: {
    demandantes: ['María Fernanda López', 'Carlos Alberto Ruiz', 'Ana Sofía Martínez', 'Luis Eduardo Pérez'],
    demandados: ['Empresa Temporal XYZ S.A.S.', 'Constructora Los Alpes', 'Distribuidora Nacional', 'Servicios Integrales SA']
  },
  familia: {
    demandantes: ['María García Rodríguez', 'Ana María González Vargas', 'Patricia López Herrera'],
    demandados: ['Juan Carlos García Pérez', 'Carlos Ramírez Peña', 'Luis González Martínez']
  },
  constitucional: {
    demandantes: ['Pedro Martínez Sánchez', 'Sandra Milena Ospina', 'Carlos Alberto Ruiz'],
    demandados: ['EPS Sanitas S.A.S.', 'Secretaría de Educación', 'DIAN']
  },
  administrativo: {
    demandantes: ['Inmobiliaria Los Rosales Ltda', 'Constructora Valle S.A.', 'Ciudadano Anónimo'],
    demandados: ['Alcaldía Mayor de Bogotá', 'DIAN', 'Secretaría de Planeación']
  },
  comercial: {
    demandantes: ['Distribuidora El Dorado S.A.', 'Comercializadora ABC', 'Empresa Nacional Ltda'],
    demandados: ['Proveedores Unidos S.A.', 'Logística Central', 'Servicios Comerciales']
  }
}

// Generar actuaciones para una solicitud específica
const generarActuaciones = (categoria, fechaBase) => {
  const tiposActuacion = actuacionesTipos[categoria] || actuacionesTipos.civil
  const actuaciones = []
  const fechaInicio = new Date(fechaBase)
  fechaInicio.setMonth(fechaInicio.getMonth() - Math.floor(Math.random() * 12)) // Entre 0-12 meses atrás
  
  tiposActuacion.forEach((actuacion, index) => {
    const fechaActuacion = new Date(fechaInicio)
    fechaActuacion.setDate(fechaActuacion.getDate() + (index * Math.floor(Math.random() * 20 + 10))) // 10-30 días entre actuaciones
    
    actuaciones.push({
      fecha: fechaActuacion.toISOString(),
      actuacion,
      cuaderno: Math.random() > 0.8 ? 'Anexo' : 'Principal',
      observaciones: index === tiposActuacion.length - 1 ? 'Proceso en estado actual' : ''
    })
  })
  
  return actuaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Más reciente primero
}

// Generar partes para una solicitud
const generarPartes = (categoria) => {
  const partes = partesTipicas[categoria] || partesTipicas.civil
  return {
    demandante: partes.demandantes[Math.floor(Math.random() * partes.demandantes.length)],
    demandado: partes.demandados[Math.floor(Math.random() * partes.demandados.length)]
  }
}

// HISTORIAL EXPANDIDO - 60+ entradas distribuidas entre las 20 solicitudes
export const mockResultadosHistorial = []

// Generar múltiples consultas por solicitud
mockSolicitudes.forEach((solicitud, index) => {
  const numConsultas = Math.floor(Math.random() * 4) + 2 // 2-5 consultas por solicitud
  const partes = generarPartes(solicitud.categoria)
  
  for (let i = 0; i < numConsultas; i++) {
    const fechaConsulta = new Date(solicitud.ultima_ejecucion || '2025-05-24T08:00:00Z')
    fechaConsulta.setDate(fechaConsulta.getDate() - (i * Math.floor(Math.random() * 7 + 1))) // Consultas cada 1-7 días atrás
    
    const actuaciones = generarActuaciones(solicitud.categoria, fechaConsulta)
    const fechaUltimoAuto = actuaciones.length > 0 ? actuaciones[0].fecha : fechaConsulta.toISOString()
    
    mockResultadosHistorial.push({
      id: `hist_${String(index + 1).padStart(3, '0')}_${i + 1}`,
      solicitud_id: solicitud.id,
      solicitud_alias: solicitud.alias,
      fecha_ejecucion: fechaConsulta.toISOString(),
      numero_radicado_completo: solicitud.criterio_busqueda_radicado || `1100${String(Math.floor(Math.random() * 9000000000000000) + 1000000000000000)}`,
      despacho_juzgado: solicitud.despacho,
      fecha_ultimo_auto: fechaUltimoAuto,
      estado_extraccion: Math.random() > 0.05 ? 'exitoso' : (Math.random() > 0.5 ? 'error_captcha' : 'error_sistema'),
      demandante: partes.demandante,
      demandado: partes.demandado,
      categoria: solicitud.categoria,
      actuaciones: actuaciones.slice(0, Math.floor(Math.random() * 8) + 5) // 5-12 actuaciones por consulta
    })
  }
})

// Ordenar por fecha de ejecución más reciente primero
mockResultadosHistorial.sort((a, b) => new Date(b.fecha_ejecucion) - new Date(a.fecha_ejecucion))

export const mockResultados = [
  {
    id: '1',
    solicitud_id: '1',
    fecha_ejecucion: '2025-05-24T08:15:00Z',
    numero_radicado_completo: '11001400300420230001',
    despacho_juzgado: 'JUZGADO 15 CIVIL DEL CIRCUITO DE BOGOTÁ',
    fecha_ultimo_auto: '2025-05-23T00:00:00Z',
    estado_extraccion: 'exitoso'
  },
  {
    id: '2',
    solicitud_id: '2',
    fecha_ejecucion: '2025-05-20T10:30:00Z',
    numero_radicado_completo: '11001400300420230002',
    despacho_juzgado: 'JUZGADO 8 CIVIL DEL CIRCUITO DE BOGOTÁ',
    fecha_ultimo_auto: '2025-05-19T00:00:00Z',
    estado_extraccion: 'exitoso'
  }
]

// ========================================
// FUNCIÓN DE DELAY PARA SIMULACIÓN
// ========================================

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// ========================================
// SERVICIO MOCK MEJORADO
// ========================================

export const mockSolicitudesService = {
  getSolicitudes: async (params = {}) => {
    await delay(800) // Simular latencia de red
    
    const { skip = 0, limit = 10 } = params
    const start = skip
    const end = Math.min(start + limit, mockSolicitudes.length)
    
    return mockSolicitudes.slice(start, end)
  },

  getSolicitud: async (id) => {
    await delay(500)
    const solicitud = mockSolicitudes.find(s => s.id === id)
    if (!solicitud) {
      throw new Error('Solicitud no encontrada')
    }
    return solicitud
  },

  createSolicitud: async (data) => {
    await delay(1000)
    const newSolicitud = {
      id: (mockSolicitudes.length + 1).toString(),
      ...data,
      fecha_creacion: new Date().toISOString(),
      activa: true,
      ultima_ejecucion: null
    }
    mockSolicitudes.push(newSolicitud)
    return newSolicitud
  },

  updateSolicitud: async (id, data) => {
    await delay(800)
    const index = mockSolicitudes.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Solicitud no encontrada')
    }
    mockSolicitudes[index] = { ...mockSolicitudes[index], ...data }
    return mockSolicitudes[index]
  },

  deleteSolicitud: async (id) => {
    await delay(500)
    const index = mockSolicitudes.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Solicitud no encontrada')
    }
    mockSolicitudes.splice(index, 1)
    return { message: 'Solicitud eliminada exitosamente' }
  },

  getResultados: async (solicitudId, params = {}) => {
    await delay(600)
    return mockResultados.filter(r => r.solicitud_id === solicitudId)
  },

  // ========================================
  // NUEVOS MÉTODOS PARA HISTORIAL
  // ========================================

  getHistorial: async (params = {}) => {
    await delay(800)
    
    const { 
      skip = 0, 
      limit = 10, 
      solicitudId = '', 
      fechaDesde = '', 
      fechaHasta = '', 
      searchTerm = '' 
    } = params
    
    let resultados = [...mockResultadosHistorial]
    
    // Filtro por solicitud
    if (solicitudId) {
      resultados = resultados.filter(r => r.solicitud_id === solicitudId)
    }
    
    // Filtro por rango de fechas
    if (fechaDesde) {
      const fechaDesdeDate = new Date(fechaDesde)
      resultados = resultados.filter(r => new Date(r.fecha_ejecucion) >= fechaDesdeDate)
    }
    
    if (fechaHasta) {
      const fechaHastaDate = new Date(fechaHasta)
      fechaHastaDate.setHours(23, 59, 59, 999) // Incluir todo el día
      resultados = resultados.filter(r => new Date(r.fecha_ejecucion) <= fechaHastaDate)
    }
    
    // Búsqueda por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      resultados = resultados.filter(r => 
        r.solicitud_alias.toLowerCase().includes(term) ||
        r.numero_radicado_completo.toLowerCase().includes(term) ||
        r.despacho_juzgado.toLowerCase().includes(term) ||
        r.demandante.toLowerCase().includes(term) ||
        r.demandado.toLowerCase().includes(term) ||
        r.actuaciones.some(act => act.actuacion.toLowerCase().includes(term))
      )
    }
    
    const total = resultados.length
    const start = skip
    const end = Math.min(start + limit, total)
    const data = resultados.slice(start, end)
    
    return {
      data,
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
      hasMore: end < total
    }
  },

  getHistorialDetalle: async (historialId) => {
    await delay(600)
    const item = mockResultadosHistorial.find(r => r.id === historialId)
    if (!item) {
      throw new Error('Historial no encontrado')
    }
    return item
  },

  searchHistorial: async (searchTerm, params = {}) => {
    await delay(400)
    const { limit = 10 } = params
    
    if (!searchTerm.trim()) {
      return { data: [], total: 0 }
    }
    
    const term = searchTerm.toLowerCase()
    const resultados = mockResultadosHistorial.filter(r => 
      r.solicitud_alias.toLowerCase().includes(term) ||
      r.numero_radicado_completo.toLowerCase().includes(term) ||
      r.despacho_juzgado.toLowerCase().includes(term) ||
      r.demandante.toLowerCase().includes(term) ||
      r.demandado.toLowerCase().includes(term)
    )
    
    return {
      data: resultados.slice(0, limit),
      total: resultados.length,
      searchTerm
    }
  },

  // Obtener estadísticas del historial
  getHistorialStats: async () => {
    await delay(500)
    
    const totalConsultas = mockResultadosHistorial.length
    const consultasExitosas = mockResultadosHistorial.filter(r => r.estado_extraccion === 'exitoso').length
    const consultasConError = totalConsultas - consultasExitosas
    
    const solicitudesUnicas = new Set(mockResultadosHistorial.map(r => r.solicitud_id)).size
    
    // Últimos 30 días
    const hace30Dias = new Date()
    hace30Dias.setDate(hace30Dias.getDate() - 30)
    const consultasRecientes = mockResultadosHistorial.filter(
      r => new Date(r.fecha_ejecucion) >= hace30Dias
    ).length
    
    return {
      totalConsultas,
      consultasExitosas,
      consultasConError,
      solicitudesUnicas,
      consultasRecientes,
      tasaExito: Math.round((consultasExitosas / totalConsultas) * 100)
    }
  }
}
