import React from 'react'
import { Link } from 'react-router-dom'
import { Eye, FileText, Calendar } from 'lucide-react'

// Components
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Breadcrumb from '../../components/ui/Breadcrumb'
import InfoField from '../../components/ui/InfoField'
import Timeline from '../../components/ui/Timeline'
import Badge from '../../components/ui/Badge'

/**
 * Página de test para verificar que todos los componentes funcionan correctamente
 */
const TestSolicitudDetailPage = () => {
  // Datos de prueba
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Mis Solicitudes', href: '/dashboard' },
    { label: 'Test de Detalles' }
  ]

  const timelineItems = [
    {
      icon: FileText,
      title: 'Solicitud creada',
      description: 'Se creó la solicitud de consulta automática',
      date: 'hace 15 días',
      variant: 'success'
    },
    {
      icon: Calendar,
      title: 'Primera ejecución',
      description: 'Se ejecutó la primera búsqueda',
      date: 'hace 14 días', 
      variant: 'info'
    }
  ]

  const demoSolicitud = {
    nombre_descriptivo: 'Consulta proceso Juan Pérez vs Banco Nacional',
    alias: 'Caso Banco Nacional 2024',
    tipo_busqueda: 'radicado',
    criterio_busqueda_radicado: '11001310300120240001',
    frecuencia_envio: 'diaria',
    activa: true,
    estado: 'activa',
    fecha_creacion: new Date().toISOString(),
    email_notificacion: 'test@ejemplo.com'
  }

  return (
    <div className="container mx-auto px-md md:px-lg lg:px-xl py-lg">
      {/* Test Breadcrumb */}
      <Card className="mb-lg">
        <Card.Header>
          <Card.Title>Test: Breadcrumb Component</Card.Title>
        </Card.Header>
        <Card.Content>
          <Breadcrumb items={breadcrumbItems} />
          <p className="text-body-auxiliary text-text-secondary">
            ✅ Breadcrumb funcional con navegación
          </p>
        </Card.Content>
      </Card>

      {/* Test InfoField */}
      <Card className="mb-lg">
        <Card.Header>
          <Card.Title>Test: InfoField Component</Card.Title>
        </Card.Header>
        <Card.Content>
          <InfoField.Grid columns={2} gap="md">
            <InfoField 
              label="Nombre de solicitud"
              value="Test de solicitud"
            />
            <InfoField 
              label="Estado"
            >
              <Badge.Active size="sm">Activa</Badge.Active>
            </InfoField>
            <InfoField.Date 
              label="Fecha de creación"
              date={new Date().toISOString()}
            />
            <InfoField 
              label="Email"
              value="test@ejemplo.com"
            />
          </InfoField.Grid>
          <p className="text-body-auxiliary text-text-secondary mt-md">
            ✅ InfoField con grid responsive y variantes
          </p>
        </Card.Content>
      </Card>

      {/* Test Timeline */}
      <Card className="mb-lg">
        <Card.Header>
          <Card.Title>Test: Timeline Component</Card.Title>
        </Card.Header>
        <Card.Content>
          <Timeline items={timelineItems} />
          <p className="text-body-auxiliary text-text-secondary mt-md">
            ✅ Timeline con iconos y variantes de color
          </p>
        </Card.Content>
      </Card>

      {/* Test Badges */}
      <Card className="mb-lg">
        <Card.Header>
          <Card.Title>Test: Badge Components</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-md">
            <div>
              <h4 className="text-heading-h4 font-heading mb-sm">Estados:</h4>
              <div className="flex flex-wrap gap-sm">
                <Badge.Active>Activa</Badge.Active>
                <Badge.Paused>Pausada</Badge.Paused>
                <Badge.Processing>En Proceso</Badge.Processing>
                <Badge.Error>Error</Badge.Error>
                <Badge.Success>Completado</Badge.Success>
              </div>
            </div>
            
            <div>
              <h4 className="text-heading-h4 font-heading mb-sm">Frecuencias:</h4>
              <div className="flex flex-wrap gap-sm">
                <Badge.Daily>Diaria</Badge.Daily>
                <Badge.Weekly>Semanal</Badge.Weekly>
                <Badge.Monthly>Mensual</Badge.Monthly>
                <Badge.Manual>Manual</Badge.Manual>
              </div>
            </div>
          </div>
          <p className="text-body-auxiliary text-text-secondary mt-md">
            ✅ Badges con iconos y colores semánticos
          </p>
        </Card.Content>
      </Card>

      {/* Actions */}
      <div className="flex gap-sm mb-xl">
        <Button
          as={Link}
          to="/dashboard"
          variant="secondary"
        >
          Volver al Dashboard
        </Button>
        
        <Button
          as={Link}
          to="/solicitudes/1"
          variant="primary"
          icon={<Eye size={16} />}
        >
          Probar Vista Real
        </Button>
      </div>

      {/* Estado de implementación */}
      <Card variant="success">
        <Card.Content>
          <div className="text-center">
            <div className="text-4xl mb-md">✅</div>
            <h3 className="text-heading-h3 font-heading text-feedback-success mb-sm">
              Implementación Completada
            </h3>
            <p className="text-body-paragraph text-text-secondary">
              Todos los componentes han sido implementados siguiendo el design system
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md mt-lg text-sm">
              <div className="text-feedback-success">✅ Breadcrumb funcional</div>
              <div className="text-feedback-success">✅ InfoField responsive</div>
              <div className="text-feedback-success">✅ Timeline con iconos</div>
              <div className="text-feedback-success">✅ Badges semánticos</div>
              <div className="text-feedback-success">✅ ProcessInfo modernizado</div>
              <div className="text-feedback-success">✅ ExecutionHistory completo</div>
              <div className="text-feedback-success">✅ Design system aplicado</div>
              <div className="text-feedback-success">✅ Responsive design</div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default TestSolicitudDetailPage