// src/data/colombiaLocations.js

/**
 * 🇨🇴 Datos de Departamentos y Ciudades de Colombia
 * 
 * Datos organizados para formularios de consulta judicial
 */

export const departamentos = [
  { id: 'amazonas', nombre: 'Amazonas' },
  { id: 'antioquia', nombre: 'Antioquia' },
  { id: 'arauca', nombre: 'Arauca' },
  { id: 'atlantico', nombre: 'Atlántico' },
  { id: 'bolivar', nombre: 'Bolívar' },
  { id: 'boyaca', nombre: 'Boyacá' },
  { id: 'caldas', nombre: 'Caldas' },
  { id: 'caqueta', nombre: 'Caquetá' },
  { id: 'casanare', nombre: 'Casanare' },
  { id: 'cauca', nombre: 'Cauca' },
  { id: 'cesar', nombre: 'Cesar' },
  { id: 'choco', nombre: 'Chocó' },
  { id: 'cordoba', nombre: 'Córdoba' },
  { id: 'cundinamarca', nombre: 'Cundinamarca' },
  { id: 'guainia', nombre: 'Guainía' },
  { id: 'guaviare', nombre: 'Guaviare' },
  { id: 'huila', nombre: 'Huila' },
  { id: 'la_guajira', nombre: 'La Guajira' },
  { id: 'magdalena', nombre: 'Magdalena' },
  { id: 'meta', nombre: 'Meta' },
  { id: 'narino', nombre: 'Nariño' },
  { id: 'norte_de_santander', nombre: 'Norte de Santander' },
  { id: 'putumayo', nombre: 'Putumayo' },
  { id: 'quindio', nombre: 'Quindío' },
  { id: 'risaralda', nombre: 'Risaralda' },
  { id: 'san_andres', nombre: 'San Andrés y Providencia' },
  { id: 'santander', nombre: 'Santander' },
  { id: 'sucre', nombre: 'Sucre' },
  { id: 'tolima', nombre: 'Tolima' },
  { id: 'valle_del_cauca', nombre: 'Valle del Cauca' },
  { id: 'vaupes', nombre: 'Vaupés' },
  { id: 'vichada', nombre: 'Vichada' }
];

export const ciudadesPorDepartamento = {
  cundinamarca: [
    { id: 'bogota', nombre: 'Bogotá D.C.' },
    { id: 'soacha', nombre: 'Soacha' },
    { id: 'fusagasuga', nombre: 'Fusagasugá' },
    { id: 'facatativa', nombre: 'Facatativá' },
    { id: 'zipaquira', nombre: 'Zipaquirá' },
    { id: 'chia', nombre: 'Chía' },
    { id: 'cajica', nombre: 'Cajicá' },
    { id: 'madrid', nombre: 'Madrid' },
    { id: 'mosquera', nombre: 'Mosquera' },
    { id: 'funza', nombre: 'Funza' }
  ],
  antioquia: [
    { id: 'medellin', nombre: 'Medellín' },
    { id: 'bello', nombre: 'Bello' },
    { id: 'itagui', nombre: 'Itagüí' },
    { id: 'envigado', nombre: 'Envigado' },
    { id: 'sabaneta', nombre: 'Sabaneta' },
    { id: 'apartado', nombre: 'Apartadó' },
    { id: 'turbo', nombre: 'Turbo' },
    { id: 'rionegro', nombre: 'Rionegro' },
    { id: 'caldas', nombre: 'Caldas' },
    { id: 'la_estrella', nombre: 'La Estrella' }
  ],
  valle_del_cauca: [
    { id: 'cali', nombre: 'Cali' },
    { id: 'palmira', nombre: 'Palmira' },
    { id: 'buenaventura', nombre: 'Buenaventura' },
    { id: 'tulua', nombre: 'Tuluá' },
    { id: 'cartago', nombre: 'Cartago' },
    { id: 'buga', nombre: 'Buga' },
    { id: 'jamundi', nombre: 'Jamundí' },
    { id: 'yumbo', nombre: 'Yumbo' },
    { id: 'candelaria', nombre: 'Candelaria' },
    { id: 'florida', nombre: 'Florida' }
  ],
  atlantico: [
    { id: 'barranquilla', nombre: 'Barranquilla' },
    { id: 'soledad', nombre: 'Soledad' },
    { id: 'malambo', nombre: 'Malambo' },
    { id: 'sabanagrande', nombre: 'Sabanagrande' },
    { id: 'puerto_colombia', nombre: 'Puerto Colombia' },
    { id: 'galapa', nombre: 'Galapa' },
    { id: 'baranoa', nombre: 'Baranoa' },
    { id: 'santo_tomas', nombre: 'Santo Tomás' },
    { id: 'palmar_de_varela', nombre: 'Palmar de Varela' },
    { id: 'polonuevo', nombre: 'Polonuevo' }
  ],
  santander: [
    { id: 'bucaramanga', nombre: 'Bucaramanga' },
    { id: 'floridablanca', nombre: 'Floridablanca' },
    { id: 'giron', nombre: 'Girón' },
    { id: 'piedecuesta', nombre: 'Piedecuesta' },
    { id: 'barrancabermeja', nombre: 'Barrancabermeja' },
    { id: 'san_gil', nombre: 'San Gil' },
    { id: 'socorro', nombre: 'Socorro' },
    { id: 'barbosa', nombre: 'Barbosa' },
    { id: 'velez', nombre: 'Vélez' },
    { id: 'malaga', nombre: 'Málaga' }
  ],
  bolivar: [
    { id: 'cartagena', nombre: 'Cartagena' },
    { id: 'magangue', nombre: 'Magangué' },
    { id: 'turbaco', nombre: 'Turbaco' },
    { id: 'arjona', nombre: 'Arjona' },
    { id: 'el_carmen_de_bolivar', nombre: 'El Carmen de Bolívar' },
    { id: 'san_juan_nepomuceno', nombre: 'San Juan Nepomuceno' },
    { id: 'san_jacinto', nombre: 'San Jacinto' },
    { id: 'mompox', nombre: 'Mompox' },
    { id: 'clemencia', nombre: 'Clemencia' },
    { id: 'santa_rosa', nombre: 'Santa Rosa' }
  ],
  // Agregar más departamentos según necesidad
  caldas: [
    { id: 'manizales', nombre: 'Manizales' },
    { id: 'la_dorada', nombre: 'La Dorada' },
    { id: 'chinchina', nombre: 'Chinchiná' },
    { id: 'villamaria', nombre: 'Villamaría' },
    { id: 'riosucio', nombre: 'Riosucio' }
  ],
  risaralda: [
    { id: 'pereira', nombre: 'Pereira' },
    { id: 'dosquebradas', nombre: 'Dosquebradas' },
    { id: 'santa_rosa_de_cabal', nombre: 'Santa Rosa de Cabal' },
    { id: 'la_virginia', nombre: 'La Virginia' },
    { id: 'marsella', nombre: 'Marsella' }
  ],
  quindio: [
    { id: 'armenia', nombre: 'Armenia' },
    { id: 'calarca', nombre: 'Calarcá' },
    { id: 'la_tebaida', nombre: 'La Tebaida' },
    { id: 'montenegro', nombre: 'Montenegro' },
    { id: 'quimbaya', nombre: 'Quimbaya' }
  ],
  tolima: [
    { id: 'ibague', nombre: 'Ibagué' },
    { id: 'espinal', nombre: 'Espinal' },
    { id: 'melgar', nombre: 'Melgar' },
    { id: 'girardot', nombre: 'Girardot' },
    { id: 'honda', nombre: 'Honda' }
  ],
  huila: [
    { id: 'neiva', nombre: 'Neiva' },
    { id: 'pitalito', nombre: 'Pitalito' },
    { id: 'garzon', nombre: 'Garzón' },
    { id: 'la_plata', nombre: 'La Plata' },
    { id: 'san_agustin', nombre: 'San Agustín' }
  ]
};

/**
 * Obtener ciudades por departamento
 */
export const getCiudadesByDepartamento = (departamentoId) => {
  return ciudadesPorDepartamento[departamentoId] || [];
};

/**
 * Buscar departamento por ID
 */
export const getDepartamentoById = (id) => {
  return departamentos.find(dep => dep.id === id);
};

/**
 * Buscar ciudad por ID en un departamento específico
 */
export const getCiudadById = (departamentoId, ciudadId) => {
  const ciudades = getCiudadesByDepartamento(departamentoId);
  return ciudades.find(ciudad => ciudad.id === ciudadId);
};