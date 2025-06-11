// src/data/ramaJudicialData.js

/**
 * 🏛️ Datos Oficiales de la Rama Judicial de Colombia
 * 
 * Estructura que replica exactamente los criterios de búsqueda disponibles
 * en https://consultaprocesos.ramajudicial.gov.co/Procesos/NombreRazonSocial
 * 
 * Dependencias: Departamento → Ciudad → Entidad → Especialidad → Despacho
 */

// Departamentos (usar la misma estructura existente)
export { departamentos, ciudadesPorDepartamento } from './colombiaLocations'

/**
 * 🏢 ENTIDADES JUDICIALES POR CIUDAD
 * 
 * Cada ciudad tiene entidades específicas según su tamaño e importancia judicial
 */
export const entidadesPorCiudad = {
  // BOGOTÁ D.C. - Capital con mayor estructura judicial
  'Bogotá D.C.': [
    { id: 'csj', nombre: 'Corte Suprema de Justicia' },
    { id: 'ce', nombre: 'Consejo de Estado' },
    { id: 'csj_sala_penal', nombre: 'Corte Suprema de Justicia - Sala Penal' },
    { id: 'csj_sala_civil', nombre: 'Corte Suprema de Justicia - Sala Civil' },
    { id: 'tribunal_superior', nombre: 'Tribunal Superior del Distrito Judicial' },
    { id: 'tribunal_contencioso', nombre: 'Tribunal Administrativo de Cundinamarca' },
    { id: 'juzgados_circuito', nombre: 'Juzgados del Circuito' },
    { id: 'juzgados_municipales', nombre: 'Juzgados Municipales' },
    { id: 'centros_servicios', nombre: 'Centros de Servicios Judiciales' }
  ],

  // MEDELLÍN - Segunda ciudad más importante
  'Medellín': [
    { id: 'tribunal_superior_antioquia', nombre: 'Tribunal Superior de Antioquia' },
    { id: 'tribunal_contencioso_antioquia', nombre: 'Tribunal Contencioso Administrativo de Antioquia' },
    { id: 'juzgados_circuito_medellin', nombre: 'Juzgados del Circuito de Medellín' },
    { id: 'juzgados_municipales_medellin', nombre: 'Juzgados Municipales de Medellín' },
    { id: 'centro_servicios_medellin', nombre: 'Centro de Servicios Judiciales de Medellín' }
  ],

  // CALI - Valle del Cauca
  'Cali': [
    { id: 'tribunal_superior_valle', nombre: 'Tribunal Superior del Valle del Cauca' },
    { id: 'tribunal_contencioso_valle', nombre: 'Tribunal Contencioso Administrativo del Valle' },
    { id: 'juzgados_circuito_cali', nombre: 'Juzgados del Circuito de Cali' },
    { id: 'juzgados_municipales_cali', nombre: 'Juzgados Municipales de Cali' },
    { id: 'centro_servicios_cali', nombre: 'Centro de Servicios Judiciales de Cali' }
  ],

  // BARRANQUILLA - Atlántico  
  'Barranquilla': [
    { id: 'tribunal_superior_atlantico', nombre: 'Tribunal Superior del Atlántico' },
    { id: 'tribunal_contencioso_atlantico', nombre: 'Tribunal Contencioso Administrativo del Atlántico' },
    { id: 'juzgados_circuito_barranquilla', nombre: 'Juzgados del Circuito de Barranquilla' },
    { id: 'juzgados_municipales_barranquilla', nombre: 'Juzgados Municipales de Barranquilla' }
  ],

  // BUCARAMANGA - Santander
  'Bucaramanga': [
    { id: 'tribunal_superior_santander', nombre: 'Tribunal Superior de Santander' },
    { id: 'tribunal_contencioso_santander', nombre: 'Tribunal Contencioso Administrativo de Santander' },
    { id: 'juzgados_circuito_bucaramanga', nombre: 'Juzgados del Circuito de Bucaramanga' },
    { id: 'juzgados_municipales_bucaramanga', nombre: 'Juzgados Municipales de Bucaramanga' }
  ],

  // CARTAGENA - Bolívar
  'Cartagena': [
    { id: 'tribunal_superior_bolivar', nombre: 'Tribunal Superior de Bolívar' },
    { id: 'tribunal_contencioso_bolivar', nombre: 'Tribunal Contencioso Administrativo de Bolívar' },
    { id: 'juzgados_circuito_cartagena', nombre: 'Juzgados del Circuito de Cartagena' },
    { id: 'juzgados_municipales_cartagena', nombre: 'Juzgados Municipales de Cartagena' }
  ],

  // MANIZALES - Caldas
  'Manizales': [
    { id: 'tribunal_superior_caldas', nombre: 'Tribunal Superior de Caldas' },
    { id: 'juzgados_circuito_manizales', nombre: 'Juzgados del Circuito de Manizales' },
    { id: 'juzgados_municipales_manizales', nombre: 'Juzgados Municipales de Manizales' }
  ],

  // PEREIRA - Risaralda
  'Pereira': [
    { id: 'tribunal_superior_risaralda', nombre: 'Tribunal Superior de Risaralda' },
    { id: 'juzgados_circuito_pereira', nombre: 'Juzgados del Circuito de Pereira' },
    { id: 'juzgados_municipales_pereira', nombre: 'Juzgados Municipales de Pereira' }
  ],

  // ARMENIA - Quindío
  'Armenia': [
    { id: 'tribunal_superior_quindio', nombre: 'Tribunal Superior del Quindío' },
    { id: 'juzgados_circuito_armenia', nombre: 'Juzgados del Circuito de Armenia' },
    { id: 'juzgados_municipales_armenia', nombre: 'Juzgados Municipales de Armenia' }
  ],

  // IBAGUÉ - Tolima
  'Ibagué': [
    { id: 'tribunal_superior_tolima', nombre: 'Tribunal Superior del Tolima' },
    { id: 'juzgados_circuito_ibague', nombre: 'Juzgados del Circuito de Ibagué' },
    { id: 'juzgados_municipales_ibague', nombre: 'Juzgados Municipales de Ibagué' }
  ],

  // NEIVA - Huila
  'Neiva': [
    { id: 'tribunal_superior_huila', nombre: 'Tribunal Superior del Huila' },
    { id: 'juzgados_circuito_neiva', nombre: 'Juzgados del Circuito de Neiva' },
    { id: 'juzgados_municipales_neiva', nombre: 'Juzgados Municipales de Neiva' }
  ]
}

/**
 * ⚖️ ESPECIALIDADES POR ENTIDAD
 * 
 * Cada entidad maneja especialidades específicas según su competencia
 */
export const especialidadesPorEntidad = {
  // CORTE SUPREMA DE JUSTICIA
  'csj': [
    { id: 'sala_civil', nombre: 'Sala de Casación Civil' },
    { id: 'sala_penal', nombre: 'Sala de Casación Penal' },
    { id: 'sala_laboral', nombre: 'Sala de Casación Laboral' }
  ],

  'csj_sala_penal': [
    { id: 'casacion_penal', nombre: 'Casación Penal' },
    { id: 'segunda_instancia_penal', nombre: 'Segunda Instancia Penal' }
  ],

  'csj_sala_civil': [
    { id: 'casacion_civil', nombre: 'Casación Civil' },
    { id: 'segunda_instancia_civil', nombre: 'Segunda Instancia Civil' }
  ],

  // CONSEJO DE ESTADO
  'ce': [
    { id: 'contencioso_administrativo', nombre: 'Contencioso Administrativo' },
    { id: 'consultiva_servicio_civil', nombre: 'Consultiva y de Servicio Civil' }
  ],

  // TRIBUNALES SUPERIORES
  'tribunal_superior': [
    { id: 'civil_familia', nombre: 'Civil y Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'tribunal_superior_antioquia': [
    { id: 'civil_familia', nombre: 'Civil y Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'tribunal_superior_valle': [
    { id: 'civil_familia', nombre: 'Civil y Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'tribunal_superior_atlantico': [
    { id: 'civil_familia', nombre: 'Civil y Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'tribunal_superior_santander': [
    { id: 'civil_familia', nombre: 'Civil y Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'tribunal_superior_bolivar': [
    { id: 'civil_familia', nombre: 'Civil y Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'tribunal_superior_caldas': [
    { id: 'civil_familia', nombre: 'Civil y Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'tribunal_superior_risaralda': [
    { id: 'civil_familia', nombre: 'Civil y Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'tribunal_superior_quindio': [
    { id: 'civil_familia', nombre: 'Civil y Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'tribunal_superior_tolima': [
    { id: 'civil_familia', nombre: 'Civil y Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'tribunal_superior_huila': [
    { id: 'civil_familia', nombre: 'Civil y Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  // TRIBUNALES CONTENCIOSOS
  'tribunal_contencioso': [
    { id: 'administrativa', nombre: 'Administrativa' },
    { id: 'fiscal', nombre: 'Fiscal' },
    { id: 'electoral', nombre: 'Electoral' }
  ],

  'tribunal_contencioso_antioquia': [
    { id: 'administrativa', nombre: 'Administrativa' },
    { id: 'fiscal', nombre: 'Fiscal' }
  ],

  'tribunal_contencioso_valle': [
    { id: 'administrativa', nombre: 'Administrativa' },
    { id: 'fiscal', nombre: 'Fiscal' }
  ],

  'tribunal_contencioso_atlantico': [
    { id: 'administrativa', nombre: 'Administrativa' },
    { id: 'fiscal', nombre: 'Fiscal' }
  ],

  'tribunal_contencioso_santander': [
    { id: 'administrativa', nombre: 'Administrativa' },
    { id: 'fiscal', nombre: 'Fiscal' }
  ],

  'tribunal_contencioso_bolivar': [
    { id: 'administrativa', nombre: 'Administrativa' },
    { id: 'fiscal', nombre: 'Fiscal' }
  ],

  // JUZGADOS DEL CIRCUITO
  'juzgados_circuito': [
    { id: 'civil', nombre: 'Civil' },
    { id: 'familia', nombre: 'Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'penal_especializado', nombre: 'Penal Especializado' },
    { id: 'laboral', nombre: 'Laboral' },
    { id: 'administrativo', nombre: 'Administrativo' },
    { id: 'ejecucion_penas', nombre: 'Ejecución de Penas y Medidas de Seguridad' }
  ],

  'juzgados_circuito_medellin': [
    { id: 'civil', nombre: 'Civil' },
    { id: 'familia', nombre: 'Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'penal_especializado', nombre: 'Penal Especializado' },
    { id: 'laboral', nombre: 'Laboral' },
    { id: 'administrativo', nombre: 'Administrativo' },
    { id: 'ejecucion_penas', nombre: 'Ejecución de Penas y Medidas de Seguridad' }
  ],

  'juzgados_circuito_cali': [
    { id: 'civil', nombre: 'Civil' },
    { id: 'familia', nombre: 'Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'penal_especializado', nombre: 'Penal Especializado' },
    { id: 'laboral', nombre: 'Laboral' },
    { id: 'administrativo', nombre: 'Administrativo' },
    { id: 'ejecucion_penas', nombre: 'Ejecución de Penas y Medidas de Seguridad' }
  ],

  'juzgados_circuito_barranquilla': [
    { id: 'civil', nombre: 'Civil' },
    { id: 'familia', nombre: 'Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' },
    { id: 'administrativo', nombre: 'Administrativo' }
  ],

  'juzgados_circuito_bucaramanga': [
    { id: 'civil', nombre: 'Civil' },
    { id: 'familia', nombre: 'Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' },
    { id: 'administrativo', nombre: 'Administrativo' }
  ],

  'juzgados_circuito_cartagena': [
    { id: 'civil', nombre: 'Civil' },
    { id: 'familia', nombre: 'Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'juzgados_circuito_manizales': [
    { id: 'civil', nombre: 'Civil' },
    { id: 'familia', nombre: 'Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'juzgados_circuito_pereira': [
    { id: 'civil', nombre: 'Civil' },
    { id: 'familia', nombre: 'Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'juzgados_circuito_armenia': [
    { id: 'civil', nombre: 'Civil' },
    { id: 'familia', nombre: 'Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'juzgados_circuito_ibague': [
    { id: 'civil', nombre: 'Civil' },
    { id: 'familia', nombre: 'Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  'juzgados_circuito_neiva': [
    { id: 'civil', nombre: 'Civil' },
    { id: 'familia', nombre: 'Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' }
  ],

  // JUZGADOS MUNICIPALES
  'juzgados_municipales': [
    { id: 'civil_municipal', nombre: 'Civil Municipal' },
    { id: 'penal_municipal', nombre: 'Penal Municipal' },
    { id: 'promiscuo_municipal', nombre: 'Promiscuo Municipal' },
    { id: 'pequenas_causas', nombre: 'Pequeñas Causas y Competencia Múltiple' }
  ],

  'juzgados_municipales_medellin': [
    { id: 'civil_municipal', nombre: 'Civil Municipal' },
    { id: 'penal_municipal', nombre: 'Penal Municipal' },
    { id: 'promiscuo_municipal', nombre: 'Promiscuo Municipal' },
    { id: 'pequenas_causas', nombre: 'Pequeñas Causas y Competencia Múltiple' }
  ],

  'juzgados_municipales_cali': [
    { id: 'civil_municipal', nombre: 'Civil Municipal' },
    { id: 'penal_municipal', nombre: 'Penal Municipal' },
    { id: 'promiscuo_municipal', nombre: 'Promiscuo Municipal' },
    { id: 'pequenas_causas', nombre: 'Pequeñas Causas y Competencia Múltiple' }
  ],

  'juzgados_municipales_barranquilla': [
    { id: 'civil_municipal', nombre: 'Civil Municipal' },
    { id: 'penal_municipal', nombre: 'Penal Municipal' },
    { id: 'promiscuo_municipal', nombre: 'Promiscuo Municipal' }
  ],

  'juzgados_municipales_bucaramanga': [
    { id: 'civil_municipal', nombre: 'Civil Municipal' },
    { id: 'penal_municipal', nombre: 'Penal Municipal' },
    { id: 'promiscuo_municipal', nombre: 'Promiscuo Municipal' }
  ],

  'juzgados_municipales_cartagena': [
    { id: 'civil_municipal', nombre: 'Civil Municipal' },
    { id: 'penal_municipal', nombre: 'Penal Municipal' },
    { id: 'promiscuo_municipal', nombre: 'Promiscuo Municipal' }
  ],

  'juzgados_municipales_manizales': [
    { id: 'civil_municipal', nombre: 'Civil Municipal' },
    { id: 'penal_municipal', nombre: 'Penal Municipal' },
    { id: 'promiscuo_municipal', nombre: 'Promiscuo Municipal' }
  ],

  'juzgados_municipales_pereira': [
    { id: 'civil_municipal', nombre: 'Civil Municipal' },
    { id: 'penal_municipal', nombre: 'Penal Municipal' },
    { id: 'promiscuo_municipal', nombre: 'Promiscuo Municipal' }
  ],

  'juzgados_municipales_armenia': [
    { id: 'civil_municipal', nombre: 'Civil Municipal' },
    { id: 'penal_municipal', nombre: 'Penal Municipal' },
    { id: 'promiscuo_municipal', nombre: 'Promiscuo Municipal' }
  ],

  'juzgados_municipales_ibague': [
    { id: 'civil_municipal', nombre: 'Civil Municipal' },
    { id: 'penal_municipal', nombre: 'Penal Municipal' },
    { id: 'promiscuo_municipal', nombre: 'Promiscuo Municipal' }
  ],

  'juzgados_municipales_neiva': [
    { id: 'civil_municipal', nombre: 'Civil Municipal' },
    { id: 'penal_municipal', nombre: 'Penal Municipal' },
    { id: 'promiscuo_municipal', nombre: 'Promiscuo Municipal' }
  ],

  // CENTROS DE SERVICIOS JUDICIALES
  'centros_servicios': [
    { id: 'civil_familia', nombre: 'Civil y Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' },
    { id: 'administrativo', nombre: 'Administrativo' }
  ],

  'centro_servicios_medellin': [
    { id: 'civil_familia', nombre: 'Civil y Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' },
    { id: 'administrativo', nombre: 'Administrativo' }
  ],

  'centro_servicios_cali': [
    { id: 'civil_familia', nombre: 'Civil y Familia' },
    { id: 'penal', nombre: 'Penal' },
    { id: 'laboral', nombre: 'Laboral' },
    { id: 'administrativo', nombre: 'Administrativo' }
  ]
}

/**
 * 🏛️ DESPACHOS POR ESPECIALIDAD
 * 
 * Cada especialidad tiene múltiples despachos numerados
 */
export const despachosPorEspecialidad = {
  // CIVIL
  'civil': [
    { id: 'civil_01', nombre: 'Juzgado 1 Civil del Circuito' },
    { id: 'civil_02', nombre: 'Juzgado 2 Civil del Circuito' },
    { id: 'civil_03', nombre: 'Juzgado 3 Civil del Circuito' },
    { id: 'civil_04', nombre: 'Juzgado 4 Civil del Circuito' },
    { id: 'civil_05', nombre: 'Juzgado 5 Civil del Circuito' },
    { id: 'civil_06', nombre: 'Juzgado 6 Civil del Circuito' },
    { id: 'civil_07', nombre: 'Juzgado 7 Civil del Circuito' },
    { id: 'civil_08', nombre: 'Juzgado 8 Civil del Circuito' },
    { id: 'civil_09', nombre: 'Juzgado 9 Civil del Circuito' },
    { id: 'civil_10', nombre: 'Juzgado 10 Civil del Circuito' }
  ],

  // FAMILIA
  'familia': [
    { id: 'familia_01', nombre: 'Juzgado 1 de Familia' },
    { id: 'familia_02', nombre: 'Juzgado 2 de Familia' },
    { id: 'familia_03', nombre: 'Juzgado 3 de Familia' },
    { id: 'familia_04', nombre: 'Juzgado 4 de Familia' },
    { id: 'familia_05', nombre: 'Juzgado 5 de Familia' },
    { id: 'familia_06', nombre: 'Juzgado 6 de Familia' }
  ],

  'civil_familia': [
    { id: 'civil_familia_sala01', nombre: 'Sala Civil y Familia 1' },
    { id: 'civil_familia_sala02', nombre: 'Sala Civil y Familia 2' },
    { id: 'civil_familia_sala03', nombre: 'Sala Civil y Familia 3' }
  ],

  // PENAL
  'penal': [
    { id: 'penal_01', nombre: 'Juzgado 1 Penal del Circuito' },
    { id: 'penal_02', nombre: 'Juzgado 2 Penal del Circuito' },
    { id: 'penal_03', nombre: 'Juzgado 3 Penal del Circuito' },
    { id: 'penal_04', nombre: 'Juzgado 4 Penal del Circuito' },
    { id: 'penal_05', nombre: 'Juzgado 5 Penal del Circuito' },
    { id: 'penal_06', nombre: 'Juzgado 6 Penal del Circuito' },
    { id: 'penal_07', nombre: 'Juzgado 7 Penal del Circuito' },
    { id: 'penal_08', nombre: 'Juzgado 8 Penal del Circuito' }
  ],

  'penal_especializado': [
    { id: 'penal_esp_01', nombre: 'Juzgado 1 Penal del Circuito Especializado' },
    { id: 'penal_esp_02', nombre: 'Juzgado 2 Penal del Circuito Especializado' },
    { id: 'penal_esp_03', nombre: 'Juzgado 3 Penal del Circuito Especializado' }
  ],

  // LABORAL
  'laboral': [
    { id: 'laboral_01', nombre: 'Juzgado 1 Laboral del Circuito' },
    { id: 'laboral_02', nombre: 'Juzgado 2 Laboral del Circuito' },
    { id: 'laboral_03', nombre: 'Juzgado 3 Laboral del Circuito' },
    { id: 'laboral_04', nombre: 'Juzgado 4 Laboral del Circuito' },
    { id: 'laboral_05', nombre: 'Juzgado 5 Laboral del Circuito' }
  ],

  // ADMINISTRATIVO
  'administrativo': [
    { id: 'admin_01', nombre: 'Juzgado 1 Administrativo' },
    { id: 'admin_02', nombre: 'Juzgado 2 Administrativo' },
    { id: 'admin_03', nombre: 'Juzgado 3 Administrativo' },
    { id: 'admin_04', nombre: 'Juzgado 4 Administrativo' }
  ],

  'administrativa': [
    { id: 'cont_admin_01', nombre: 'Sala 1 Contenciosa Administrativa' },
    { id: 'cont_admin_02', nombre: 'Sala 2 Contenciosa Administrativa' },
    { id: 'cont_admin_03', nombre: 'Sala 3 Contenciosa Administrativa' }
  ],

  // EJECUCIÓN DE PENAS
  'ejecucion_penas': [
    { id: 'ejecucion_01', nombre: 'Juzgado 1 de Ejecución de Penas y Medidas de Seguridad' },
    { id: 'ejecucion_02', nombre: 'Juzgado 2 de Ejecución de Penas y Medidas de Seguridad' },
    { id: 'ejecucion_03', nombre: 'Juzgado 3 de Ejecución de Penas y Medidas de Seguridad' }
  ],

  // MUNICIPALES
  'civil_municipal': [
    { id: 'municipal_civil_01', nombre: 'Juzgado 1 Civil Municipal' },
    { id: 'municipal_civil_02', nombre: 'Juzgado 2 Civil Municipal' },
    { id: 'municipal_civil_03', nombre: 'Juzgado 3 Civil Municipal' },
    { id: 'municipal_civil_04', nombre: 'Juzgado 4 Civil Municipal' }
  ],

  'penal_municipal': [
    { id: 'municipal_penal_01', nombre: 'Juzgado 1 Penal Municipal' },
    { id: 'municipal_penal_02', nombre: 'Juzgado 2 Penal Municipal' },
    { id: 'municipal_penal_03', nombre: 'Juzgado 3 Penal Municipal' }
  ],

  'promiscuo_municipal': [
    { id: 'promiscuo_01', nombre: 'Juzgado 1 Promiscuo Municipal' },
    { id: 'promiscuo_02', nombre: 'Juzgado 2 Promiscuo Municipal' },
    { id: 'promiscuo_03', nombre: 'Juzgado 3 Promiscuo Municipal' }
  ],

  'pequenas_causas': [
    { id: 'pequenas_01', nombre: 'Juzgado 1 de Pequeñas Causas y Competencia Múltiple' },
    { id: 'pequenas_02', nombre: 'Juzgado 2 de Pequeñas Causas y Competencia Múltiple' }
  ],

  // SALAS DE CASACIÓN
  'sala_civil': [
    { id: 'casacion_civil_sala', nombre: 'Sala de Casación Civil' }
  ],

  'sala_penal': [
    { id: 'casacion_penal_sala', nombre: 'Sala de Casación Penal' }
  ],

  'sala_laboral': [
    { id: 'casacion_laboral_sala', nombre: 'Sala de Casación Laboral' }
  ],

  'casacion_penal': [
    { id: 'casacion_penal_despacho', nombre: 'Despacho de Casación Penal' }
  ],

  'segunda_instancia_penal': [
    { id: 'segunda_penal_despacho', nombre: 'Despacho de Segunda Instancia Penal' }
  ],

  'casacion_civil': [
    { id: 'casacion_civil_despacho', nombre: 'Despacho de Casación Civil' }
  ],

  'segunda_instancia_civil': [
    { id: 'segunda_civil_despacho', nombre: 'Despacho de Segunda Instancia Civil' }
  ],

  // CONSEJO DE ESTADO
  'contencioso_administrativo': [
    { id: 'ce_primera_seccion', nombre: 'Primera Sección' },
    { id: 'ce_segunda_seccion', nombre: 'Segunda Sección' },
    { id: 'ce_tercera_seccion', nombre: 'Tercera Sección' },
    { id: 'ce_cuarta_seccion', nombre: 'Cuarta Sección' },
    { id: 'ce_quinta_seccion', nombre: 'Quinta Sección' }
  ],

  'consultiva_servicio_civil': [
    { id: 'ce_consultiva', nombre: 'Sala de Consulta y Servicio Civil' }
  ],

  // FISCALES
  'fiscal': [
    { id: 'fiscal_admin_01', nombre: 'Sala Fiscal Administrativa 1' },
    { id: 'fiscal_admin_02', nombre: 'Sala Fiscal Administrativa 2' }
  ],

  // ELECTORAL
  'electoral': [
    { id: 'electoral_sala', nombre: 'Sala Electoral' }
  ]
}

/**
 * 🔍 FUNCIONES HELPER PARA OBTENER DATOS EN CASCADA
 */

/**
 * Obtener entidades disponibles para una ciudad
 */
export const getEntidadesByCiudad = (ciudad) => {
  return entidadesPorCiudad[ciudad] || []
}

/**
 * Obtener especialidades disponibles para una entidad
 */
export const getEspecialidadesByEntidad = (entidadId) => {
  return especialidadesPorEntidad[entidadId] || []
}

/**
 * Obtener despachos disponibles para una especialidad
 */
export const getDespachosByEspecialidad = (especialidadId) => {
  return despachosPorEspecialidad[especialidadId] || []
}

/**
 * Validar si una selección es válida en la jerarquía
 */
export const validateHierarchy = ({ departamento, ciudad, entidad, especialidad, despacho }) => {
  const errors = []
  
  // Validar ciudad existe en departamento
  if (departamento && ciudad) {
    const ciudades = ciudadesPorDepartamento[departamento] || []
    if (!ciudades.find(c => c.nombre === ciudad)) {
      errors.push('Ciudad no válida para el departamento seleccionado')
    }
  }
  
  // Validar entidad existe en ciudad
  if (ciudad && entidad) {
    const entidades = getEntidadesByCiudad(ciudad)
    if (!entidades.find(e => e.id === entidad)) {
      errors.push('Entidad no válida para la ciudad seleccionada')
    }
  }
  
  // Validar especialidad existe en entidad
  if (entidad && especialidad) {
    const especialidades = getEspecialidadesByEntidad(entidad)
    if (!especialidades.find(e => e.id === especialidad)) {
      errors.push('Especialidad no válida para la entidad seleccionada')
    }
  }
  
  // Validar despacho existe en especialidad
  if (especialidad && despacho) {
    const despachos = getDespachosByEspecialidad(especialidad)
    if (!despachos.find(d => d.id === despacho)) {
      errors.push('Despacho no válido para la especialidad seleccionada')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Obtener el path completo de una selección
 */
export const getSelectionPath = ({ departamento, ciudad, entidad, especialidad, despacho }) => {
  const path = []
  
  if (departamento) path.push(`Departamento: ${departamento}`)
  if (ciudad) path.push(`Ciudad: ${ciudad}`)
  
  if (entidad) {
    const entidadObj = getEntidadesByCiudad(ciudad).find(e => e.id === entidad)
    if (entidadObj) path.push(`Entidad: ${entidadObj.nombre}`)
  }
  
  if (especialidad) {
    const especialidadObj = getEspecialidadesByEntidad(entidad).find(e => e.id === especialidad)
    if (especialidadObj) path.push(`Especialidad: ${especialidadObj.nombre}`)
  }
  
  if (despacho) {
    const despachoObj = getDespachosByEspecialidad(especialidad).find(d => d.id === despacho)
    if (despachoObj) path.push(`Despacho: ${despachoObj.nombre}`)
  }
  
  return path.join(' → ')
}

/**
 * 📊 TIPOS DE PERSONA VÁLIDOS
 */
export const tiposPersona = [
  { id: 'natural', nombre: 'Persona Natural' },
  { id: 'juridica', nombre: 'Persona Jurídica' }
]

/**
 * 🕐 OPCIONES DE SUJETO PROCESAL
 */
export const opcionesSujetoProcesal = [
  { 
    id: 'recientes', 
    nombre: 'Procesos con Actuaciones Recientes (últimos 30 días)',
    descripcion: 'Búsqueda más rápida, solo procesos con movimientos recientes'
  },
  { 
    id: 'todos', 
    nombre: 'Todos los Procesos (consulta completa, menos rápida)',
    descripcion: 'Búsqueda exhaustiva en toda la base de datos histórica'
  }
]