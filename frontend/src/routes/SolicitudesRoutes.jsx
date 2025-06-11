import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SelectQueryTypePage from '../pages/solicitudes/SelectQueryTypePage';
import SimpleQueryPage from '../pages/solicitudes/SimpleQueryPage';
import AdvancedQueryPage from '../pages/solicitudes/AdvancedQueryPage';
import SolicitudDetailPage from '../pages/solicitudes/SolicitudDetailPage';

const SolicitudesRoutes = () => {
  return (
    <Routes>
      {/* Ruta principal para seleccionar tipo de consulta */}
      <Route path="/select-type" element={<SelectQueryTypePage />} />
      
      {/* Rutas para formularios de consulta */}
      <Route path="/simple" element={<SimpleQueryPage />} />
      <Route path="/advanced" element={<AdvancedQueryPage />} />
      
      {/* Ruta adicional para probar la nueva versión mejorada 
          (opcional - puedes comentar o eliminar después) */}
      {/* <Route path="/advanced-improved" element={<NewAdvancedQueryImproved />} /> */}
      
      {/* Ruta para ver detalles de una solicitud específica */}
      <Route path="/:id" element={<SolicitudDetailPage />} />
    </Routes>
  );
};

export default SolicitudesRoutes;