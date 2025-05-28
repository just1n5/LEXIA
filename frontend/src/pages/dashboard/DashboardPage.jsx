import React, { useState } from 'react'
import { Plus, RefreshCw, FileText, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

// Componentes mejorados con el sistema de diseño
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import ButtonEnhanced from '../../components/enhanced/ButtonEnhanced'
import StatsCards from '../../components/dashboard/StatsCards'
import SolicitudesTable from '../../components/dashboard/SolicitudesTable'
import Badge, { getBadgeByStatus, getBadgeByFrequency } from '../../components/ui/Badge'

// Hooks y utilidades
import { useSolicitudes } from '../../hooks/useSolicitudes'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../utils/cn'

/**
 * Página principal del Dashboard
 * Implementa las especificaciones de la guía de estilo y mejores prácticas de UX
 */
function DashboardPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Calcular skip para paginación
  const skip = (currentPage - 1) * itemsPerPage

  // Obtener solicitudes del usuario con manejo de estados mejorado
  const { 
    solicitudes,
    isLoading, 
    error,
    refetch,
    isRefetching
  } = useSolicitudes({ 
    skip, 
    limit: itemsPerPage 
  })

  // 🆕 DATOS ENRIQUECIDOS CON INFORMACIÓN DE NOTIFICACIONES Y PAGINACIÓN
  const solicitudesEnriquecidas = React.useMemo(() => {
    // Datos de prueba más extensos para demostrar paginación
    const solicitudesBase = solicitudes.length > 0 ? solicitudes : [
      // Página 1
      {
        id: 1,
        nombre_descriptivo: 'Consulta proceso Juan Pérez vs Banco Nacional',
        tipo_busqueda: 'Número de Radicado',
        frecuencia: 'diaria',
        estado: 'activa',
        ultima_ejecucion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resultados_encontrados: 3,
        notificaciones_enviadas: 15,
        tiene_actualizaciones: true
      },
      {
        id: 2,
        nombre_descriptivo: 'Seguimiento demanda laboral - María García',
        tipo_busqueda: 'Nombre/Razón Social',
        frecuencia: 'semanal',
        estado: 'pausada',
        ultima_ejecucion: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        resultados_encontrados: 0,
        notificaciones_enviadas: 8,
        tiene_actualizaciones: false
      },
      {
        id: 3,
        nombre_descriptivo: 'Proceso comercial ABC S.A.S vs Distribuidora XYZ',
        tipo_busqueda: 'Número de Radicado',
        frecuencia: 'mensual',
        estado: 'en_proceso',
        ultima_ejecucion: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        resultados_encontrados: 1,
        notificaciones_enviadas: 5,
        tiene_actualizaciones: true
      },
      {
        id: 4,
        nombre_descriptivo: 'Consulta proceso familiar - Divorcio contentioso',
        tipo_busqueda: 'Nombre/Razón Social',
        frecuencia: 'manual',
        estado: 'activa',
        ultima_ejecucion: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        resultados_encontrados: 2,
        notificaciones_enviadas: 12,
        tiene_actualizaciones: false
      },
      {
        id: 5,
        nombre_descriptivo: 'Embargo vehicular - Resolución administrativa',
        tipo_busqueda: 'Número de Radicado',
        frecuencia: 'diaria',
        estado: 'error',
        ultima_ejecucion: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        resultados_encontrados: 0,
        notificaciones_enviadas: 20,
        tiene_actualizaciones: false,
        error_message: 'Error de conexión con el servidor judicial'
      },
      {
        id: 6,
        nombre_descriptivo: 'Consulta herencia testamentaria López',
        tipo_busqueda: 'Nombre/Razón Social',
        frecuencia: 'semanal',
        estado: 'activa',
        ultima_ejecucion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        resultados_encontrados: 1,
        notificaciones_enviadas: 7,
        tiene_actualizaciones: true
      },
      {
        id: 7,
        nombre_descriptivo: 'Proceso penal - Hurto calificado',
        tipo_busqueda: 'Número de Radicado',
        frecuencia: 'diaria',
        estado: 'activa',
        ultima_ejecucion: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        resultados_encontrados: 0,
        notificaciones_enviadas: 25,
        tiene_actualizaciones: false
      },
      {
        id: 8,
        nombre_descriptivo: 'Demanda civil responsabilidad extracontractual',
        tipo_busqueda: 'Nombre/Razón Social',
        frecuencia: 'mensual',
        estado: 'pausada',
        ultima_ejecucion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        resultados_encontrados: 2,
        notificaciones_enviadas: 3,
        tiene_actualizaciones: false
      },
      {
        id: 9,
        nombre_descriptivo: 'Proceso ejecutivo hipotecario Inmobiliaria XYZ',
        tipo_busqueda: 'Número de Radicado',
        frecuencia: 'semanal',
        estado: 'en_proceso',
        ultima_ejecucion: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        resultados_encontrados: 3,
        notificaciones_enviadas: 11,
        tiene_actualizaciones: true
      },
      {
        id: 10,
        nombre_descriptivo: 'Consulta tutela - Derecho fundamental a la salud',
        tipo_busqueda: 'Nombre/Razón Social',
        frecuencia: 'diaria',
        estado: 'activa',
        ultima_ejecucion: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        resultados_encontrados: 1,
        notificaciones_enviadas: 18,
        tiene_actualizaciones: true
      },
      // Datos adicionales para páginas siguientes (simulación)
      {
        id: 11,
        nombre_descriptivo: 'Proceso administrativo sancionatorio DIAN',
        tipo_busqueda: 'Número de Radicado',
        frecuencia: 'mensual',
        estado: 'activa',
        ultima_ejecucion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        resultados_encontrados: 0,
        notificaciones_enviadas: 4,
        tiene_actualizaciones: false
      },
      {
        id: 12,
        nombre_descriptivo: 'Demanda contractual incumplimiento de obra',
        tipo_busqueda: 'Nombre/Razón Social',
        frecuencia: 'semanal',
        estado: 'pausada',
        ultima_ejecucion: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        resultados_encontrados: 1,
        notificaciones_enviadas: 6,
        tiene_actualizaciones: false
      },
      {
        id: 13,
        nombre_descriptivo: 'Proceso disciplinario funcionario público',
        tipo_busqueda: 'Número de Radicado',
        frecuencia: 'diaria',
        estado: 'error',
        ultima_ejecucion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        resultados_encontrados: 0,
        notificaciones_enviadas: 12,
        tiene_actualizaciones: false,
        error_message: 'Error de autenticación'
      },
      {
        id: 14,
        nombre_descriptivo: 'Consulta proceso de nulidad matrimonial',
        tipo_busqueda: 'Nombre/Razón Social',
        frecuencia: 'manual',
        estado: 'activa',
        ultima_ejecucion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        resultados_encontrados: 2,
        notificaciones_enviadas: 2,
        tiene_actualizaciones: true
      },
      {
        id: 15,
        nombre_descriptivo: 'Proceso de restitución de tierras campesinas',
        tipo_busqueda: 'Número de Radicado',
        frecuencia: 'semanal',
        estado: 'en_proceso',
        ultima_ejecucion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        ultima_notificacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        resultados_encontrados: 1,
        notificaciones_enviadas: 9,
        tiene_actualizaciones: true
      }
    ]

    // Simular paginación: mostrar solo los elementos de la página actual
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const solicitudesPaginadas = solicitudesBase.slice(startIndex, endIndex)

    return solicitudesPaginadas.map((solicitud, index) => ({
      ...solicitud,
      // Mapear campos correctamente desde la API real
      nombre_descriptivo: solicitud.alias || solicitud.nombre_descriptivo || `Solicitud ${solicitud.id}`,
      tipo_busqueda: solicitud.tipo_busqueda === 'radicado' ? 'Número de Radicado' : 
                     solicitud.tipo_busqueda === 'nombre' ? 'Nombre/Razón Social' : 
                     solicitud.tipo_busqueda || 'N/A',
      frecuencia: solicitud.frecuencia_envio || solicitud.frecuencia || 'manual',
      estado: solicitud.estado || 'pausada',
      ultima_ejecucion: solicitud.ultima_ejecucion || solicitud.updated_at || new Date().toISOString(),
      ultima_notificacion: solicitud.ultima_notificacion || solicitud.updated_at || new Date().toISOString(),
      // Metadatos adicionales para la demo
      created_at: solicitud.created_at || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      resultados_encontrados: solicitud.resultados_encontrados ?? Math.floor(Math.random() * 5),
      notificaciones_enviadas: solicitud.notificaciones_enviadas ?? Math.floor(Math.random() * 25),
      tiene_actualizaciones: solicitud.tiene_actualizaciones ?? Math.random() > 0.5,
    }))
  }, [solicitudes, currentPage, itemsPerPage])

  // ===== HANDLERS DE EVENTOS =====

  const handleEdit = (solicitud) => {
    navigate(`/solicitudes/${solicitud.id}/editar`)
  }

  const handleView = (solicitud) => {
    navigate(`/solicitudes/${solicitud.id}`)
  }

  const handleDelete = async (solicitud) => {
    const confirmMessage = `¿Estás seguro de que deseas eliminar "${solicitud.nombre_descriptivo}"?
    
Esta acción no se puede deshacer y se perderán todos los datos asociados.`

    if (window.confirm(confirmMessage)) {
      try {
        // Simular eliminación (en producción sería una llamada a API)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        toast.success(
          'Solicitud eliminada', 
          `"${solicitud.nombre_descriptivo}" se eliminó correctamente`
        )
        refetch()
      } catch (error) {
        toast.error(
          'Error al eliminar', 
          'No se pudo eliminar la solicitud. Intenta nuevamente.'
        )
      }
    }
  }

  const handleToggleStatus = async (solicitud) => {
    try {
      const nuevoEstado = solicitud.estado === 'activa' ? 'pausada' : 'activa'
      const accion = nuevoEstado === 'activa' ? 'activada' : 'pausada'
      
      // Simular cambio de estado (en producción sería una llamada a API)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast.success(
        `Solicitud ${accion}`, 
        `"${solicitud.nombre_descriptivo}" ha sido ${accion} correctamente`
      )
      refetch()
    } catch (error) {
      toast.error(
        'Error al cambiar estado', 
        'No se pudo cambiar el estado de la solicitud'
      )
    }
  }

  const handleDownload = async (solicitud) => {
    try {
      toast.info(
        'Preparando descarga', 
        'Generando reporte de la solicitud...'
      )
      
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(
        'Reporte listo', 
        'El reporte se ha descargado correctamente'
      )
    } catch (error) {
      toast.error(
        'Error en descarga', 
        'No se pudo generar el reporte'
      )
    }
  }

  // 🆕 NUEVA FUNCIÓN: Ejecutar consulta manualmente
  const handleExecuteNow = async (solicitud) => {
    try {
      toast.loading('Ejecutando consulta...', { 
        id: 'execute-' + solicitud.id,
        duration: 0 // No auto-hide mientras se ejecuta
      })
      
      // Simular ejecución manual con progreso
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.loading('Consultando base de datos judicial...', { id: 'execute-' + solicitud.id })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.loading('Procesando resultados...', { id: 'execute-' + solicitud.id })
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simular resultados aleatorios
      const nuevosResultados = Math.floor(Math.random() * 3)
      const tieneNuevosResultados = nuevosResultados > 0
      
      if (tieneNuevosResultados) {
        toast.success(
          `Consulta completada - ${nuevosResultados} resultado${nuevosResultados > 1 ? 's' : ''} encontrado${nuevosResultados > 1 ? 's' : ''}`, 
          `La consulta de "${solicitud.nombre_descriptivo}" encontró nuevas actualizaciones. Se enviará una notificación por email.`
        )
      } else {
        toast.info(
          'Consulta completada - Sin cambios',
          `La consulta de "${solicitud.nombre_descriptivo}" se ejecutó correctamente pero no se encontraron cambios desde la última ejecución.`
        )
      }
      
      refetch()
    } catch (error) {
      console.error('Error en ejecución:', error)
      toast.error(
        'Error al ejecutar consulta', 
        'No se pudo ejecutar la consulta. Verifica la configuración de la solicitud e intenta nuevamente.'
      )
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll suave al cambiar página
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRefresh = async () => {
    try {
      await refetch()
      toast.success(
        'Datos actualizados', 
        'Se cargaron los últimos datos correctamente'
      )
    } catch (error) {
      toast.error(
        'Error al actualizar', 
        'No se pudieron cargar los últimos datos'
      )
    }
  }

  // Calcular total de items (en producción vendría del backend)
  const totalItems = solicitudes.length > 0 ? solicitudes.length : 15 // 15 solicitudes de prueba

  // ===== COMPONENTES AUXILIARES =====

  const DashboardHeader = () => (
    <div className="dashboard-header">
      {/* Contenedor principal con flexbox para alinear título a la izquierda y botones a la derecha */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Sección del título */}
        <div className="flex-1">
          <h1 className="page-title">Mis Solicitudes de Consulta</h1>
          <p className="page-subtitle">
            Gestiona tus solicitudes de consulta de procesos judiciales automáticos
          </p>
        </div>
        
        {/* Sección de botones - alineados a la derecha */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center lg:items-start">
          {/* Botón de actualizar */}
          <ButtonEnhanced
            variant="secondary"
            onClick={handleRefresh}
            disabled={isLoading}
            loading={isRefetching}
            loadingText="Actualizando..."
            icon={<RefreshCw size={16} />}
            title="Actualizar datos"
            ripple={true}
          >
            <span className="hidden sm:inline">Actualizar</span>
          </ButtonEnhanced>
          
          {/* Botón nueva solicitud */}
          <ButtonEnhanced
            as={Link}
            to="/solicitudes/select-type"
            variant="primary"
            icon={<Plus size={16} />}
            ripple={true}
          >
            Nueva Solicitud
          </ButtonEnhanced>
        </div>
      </div>
    </div>
  )

  const WelcomeMessage = () => (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="text-blue-500 text-3xl">🚀</div>
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            ¡Bienvenido a ConsultaJudicial!
          </h3>
          <p className="text-blue-800 mb-4">
            Aquí podrás crear y gestionar solicitudes automatizadas para consultar 
            procesos judiciales. El sistema monitoreará los casos según la frecuencia 
            que configures y te notificará por correo sobre cualquier novedad.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span className="text-green-500">✅</span>
              <span><strong>Consulta Simple:</strong> Búsqueda por número de radicado</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span className="text-green-500">✅</span>
              <span><strong>Consulta Avanzada:</strong> Búsqueda por nombre, despacho, etc.</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span className="text-green-500">✅</span>
              <span><strong>Notificaciones:</strong> Automáticas por email</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <ButtonEnhanced
              as={Link}
              to="/solicitudes/select-type"
              variant="primary"
              icon={<Plus size={16} />}
              ripple={true}
            >
              Crear Primera Solicitud
            </ButtonEnhanced>
            <ButtonEnhanced
              as={Link}
              to="/historial"
              variant="secondary"
              icon={<FileText size={16} />}
              ripple={true}
            >
              Ver Historial
            </ButtonEnhanced>
          </div>
        </div>
      </div>
    </div>
  )

  const ErrorMessage = () => (
    <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-2 text-red-800">
        <span className="text-red-500">❌</span>
        <span className="font-medium">Error al cargar las solicitudes</span>
      </div>
      <p className="text-red-700 mt-1">
        {error?.message || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.'}
      </p>
      <Button
        variant="secondary"
        onClick={handleRefresh}
        className="mt-3"
        icon={<RefreshCw size={16} />}
        loading={isRefetching}
      >
        Reintentar
      </Button>
    </div>
  )

  // ===== RENDER PRINCIPAL =====

  return (
    <Layout>
      <div className="container">
        {/* Header del Dashboard */}
        <DashboardHeader />

        {/* Tarjetas de estadísticas */}
        <StatsCards 
          solicitudes={solicitudesEnriquecidas}
          isLoading={isLoading}
          error={error}
        />

        {/* Contenido principal */}
        {error ? (
          <ErrorMessage />
        ) : !isLoading && solicitudesEnriquecidas.length === 0 ? (
          <WelcomeMessage />
        ) : (
          /* Tabla de solicitudes */
          <SolicitudesTable
            solicitudes={solicitudesEnriquecidas}
            isLoading={isLoading}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onDownload={handleDownload}
            onExecuteNow={handleExecuteNow}
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            className="animate-fade-in"
          />
        )}

        {/* Información adicional para usuarios con muchas solicitudes */}
        {!isLoading && !error && solicitudesEnriquecidas.length > 3 && (
          <div className="mt-xl p-lg bg-bg-light border border-border-default rounded-md">
            <div className="flex items-start gap-sm">
              <span className="text-interactive-default text-lg flex-shrink-0" aria-hidden="true">
                💡
              </span>
              <div>
                <h4 className="text-heading-h4 font-medium text-text-base mb-xs">
                  Consejo para usuarios avanzados
                </h4>
                <p className="text-text-secondary text-sm mb-sm">
                  Tienes muchas solicitudes activas. Considera usar filtros y la función de búsqueda 
                  para encontrar rápidamente lo que necesitas.
                </p>
                <Button 
                  as={Link}
                  to="/historial"
                  variant="ghost"
                  size="sm"
                  icon={<FileText size={14} />}
                >
                  Ver historial completo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default DashboardPage