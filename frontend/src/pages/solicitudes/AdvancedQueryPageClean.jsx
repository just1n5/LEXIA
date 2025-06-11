import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSolicitudes as useSolicitudesOptimized } from '../../hooks/useSolicitudesOptimized';
import { useToast } from '../../components/ui/Toast';
import UltraSimpleAdvancedForm from '../../components/advanced-query/UltraSimpleAdvancedForm';

/**
 * 🎯 AdvancedQueryPage - VERSIÓN ULTRA-SIMPLE
 * 
 * NUEVO ENFOQUE: Simplicidad radical que realmente funciona
 * - ❌ Sin validaciones en tiempo real (causaban re-renders)
 * - ❌ Sin debounce ni timers complejos
 * - ❌ Sin memoización prematura
 * - ✅ Solo validación básica al submit
 * - ✅ Solo estado esencial
 * - ✅ Solo <select> nativos (rápidos y confiables)
 */
const AdvancedQueryPage = () => {
  // ✅ Hooks básicos sin optimizaciones complejas
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createSolicitud, loading } = useSolicitudesOptimized();

  // ✅ Handlers simples y directos
  const handleBack = useCallback(() => {
    navigate('/solicitudes/select-type');
  }, [navigate]);

  const handleComplete = useCallback(async (result) => {
    console.log('Consulta avanzada completada:', result);
    
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
        
        {/* ✅ Formulario Ultra-Simple - NUEVO ENFOQUE */}
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