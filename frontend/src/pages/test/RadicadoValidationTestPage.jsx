// 🎯 pages/test/RadicadoValidationTestPage.jsx
// Página de prueba para el sistema de validación de radicados

import React from 'react';
import Layout from '../../components/layout/Layout';
import { RadicadoValidationDemo } from '../../components/demo/RadicadoValidationDemo';
import Button from '../../components/ui/Button';
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 🎯 Página de prueba para validación de radicados
 * 
 * Permite probar el sistema completo de validación con:
 * - Casos de prueba predefinidos
 * - Validación en tiempo real
 * - Información estructural
 * - Exportación de datos
 */
export const RadicadoValidationTestPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-bg-light">
        {/* 🎯 Header de la página */}
        <div className="bg-bg-canvas border-b border-border-default">
          <div className="max-w-7xl mx-auto px-lg py-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <ArrowLeft className="w-4 h-4 mr-sm" />
                  Volver
                </Button>
                
                <div>
                  <h1 className="text-heading-h2 font-heading text-text-primary">
                    Validación de Radicados - Test
                  </h1>
                  <p className="text-body-auxiliary font-sans text-text-secondary">
                    Prueba el sistema avanzado de validación de números de radicación
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://consultaprocesos.ramajudicial.gov.co/manual/consulta.html#construir-numero', '_blank')}
                  className="text-tech-accent hover:text-tech-accent/80"
                >
                  <ExternalLink className="w-4 h-4 mr-sm" />
                  Documentación Oficial
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/solicitudes/nueva')}
                >
                  <FileText className="w-4 h-4 mr-sm" />
                  Crear Solicitud Real
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 🎯 Contenido principal */}
        <div className="max-w-7xl mx-auto px-lg py-xl">
          <RadicadoValidationDemo />
        </div>

        {/* 🎯 Footer informativo */}
        <div className="bg-bg-canvas border-t border-border-default mt-2xl">
          <div className="max-w-7xl mx-auto px-lg py-lg">
            <div className="text-center space-y-sm">
              <h3 className="text-heading-h3 font-heading text-text-primary">
                ¿Listo para usar el sistema real?
              </h3>
              <p className="text-body-paragraph font-sans text-text-secondary max-w-2xl mx-auto">
                Una vez que hayas probado la validación, puedes crear solicitudes reales de consulta judicial
                que serán procesadas automáticamente por nuestro sistema RPA.
              </p>
              <div className="flex justify-center gap-sm pt-md">
                <Button
                  variant="primary"
                  onClick={() => navigate('/solicitudes/nueva')}
                >
                  Crear Solicitud Real
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Ir al Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RadicadoValidationTestPage;