import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSolicitudes as useSolicitudesOptimized } from '../../hooks/useSolicitudesOptimized';
import { useToast } from '../../components/ui/Toast';
import UltraSimpleAdvancedForm from '../../components/advanced-query/UltraSimpleAdvancedForm';

/**
 * 🎯 AdvancedQueryPage - ENFOQUE ULTRA-SIMPLE
 * 
 * Cambio radical de estrategia:
 * - ❌ ELIMINAMOS: Validaciones en tiempo real
 * - ❌ ELIMINAMOS: Debounce, timers, memoización compleja
 * - ❌ ELIMINAMOS: Optimizaciones prematuras
 * - ✅ SOLO: Lo esencial que funciona
 * - ✅ SOLO: Validación básica al submit
 * - ✅ SOLO: UX simple pero efectiva
 */
const AdvancedQueryPage = () => {
  // ✅ Hooks básicos - sin optimizaciones complejas
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createSolicitud, loading } = useSolicitudesOptimized();

  // ✅ Handlers simples
  const handleBack = useCallback(() => {
    navigate('/solicitudes/select-type');
  }, [navigate]);

  const handleComplete = useCallback(async (result) => {
    console.log('🎯 Ultra-simple form completed:', result);
    
    if (result.action === 'dashboard') {
      try {
        // Transformar datos al formato de la API
        const formData = {
          alias: result.data.alias || 'Consulta Avanzada',
          tipo_busqueda: result.data.numeroRadicado ? 'radicado' : 'nombre_razon_social',
          criterio_busqueda_radicado: result.data.numeroRadicado || null,
          criterio_busqueda_nombre: result.data.nombreDemandante || result.data.nombreDemandado || null,
          frecuencia_envio: result.data.ejecutarDiariamente ? 'diario' : 'manual',
          // Campos adicionales
          departamento: result.data.departamento,
          ciudad: result.data.ciudad,
          nombres_demandante: result.data.nombreDemandante,
          nombres_demandado: result.data.nombreDemandado,
          numero_radicacion: result.data.numeroRadicacion,
          notificar_cambios: result.data.notificarCambios
        };

        await createSolicitud(formData);
        toast.success('¡Éxito!', 'Consulta avanzada creada exitosamente');
        
        // Redirigir al dashboard
        setTimeout(() => {
          navigate('/dashboard', { 
            state: { 
              message: 'Consulta avanzada creada exitosamente',
              type: 'success' 
            }
          });
        }, 1500);
        
      } catch (error) {
        toast.error('Error', 'Error al crear la solicitud. Por favor intenta nuevamente.');
        console.error('Error creating solicitud:', error);
      }
    }
  }, [createSolicitud, toast, navigate]);

  return (
    <div className="min-h-screen bg-bg-light">
      <div className="container mx-auto px-md py-lg">
        
        {/* Header */}
        <div className="mb-lg text-center">
          <h1 className="text-heading-h1 font-heading text-text-primary mb-sm">
            Nueva Consulta Avanzada
          </h1>
          <p className="text-body-paragraph text-text-secondary">
            Enfoque ultra-simple - Sin validaciones en tiempo real, solo lo esencial
          </p>
          
          {/* Indicador de estrategia */}
          <div className="inline-flex items-center gap-xs mt-md px-md py-sm bg-blue-50 rounded-full border border-blue-200">
            <span className="text-body-auxiliary text-blue-700 font-medium">
              🎯 Estrategia: Simplicidad Radical
            </span>
          </div>
        </div>
        
        {/* ✅ Formulario Ultra-Simple - SIN complicaciones */}
        <UltraSimpleAdvancedForm
          onBack={handleBack}
          onComplete={handleComplete}
          loading={loading}
        />
        
      </div>
    </div>
  );
};

export default AdvancedQueryPage;