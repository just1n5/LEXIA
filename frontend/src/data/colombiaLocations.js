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
  ],
  
  // 🆕 COMPLETANDO TODOS LOS DEPARTAMENTOS FALTANTES
  
  amazonas: [
    { id: 'leticia', nombre: 'Leticia' },
    { id: 'puerto_narino', nombre: 'Puerto Nariño' },
    { id: 'la_chorrera', nombre: 'La Chorrera' },
    { id: 'la_pedrera', nombre: 'La Pedrera' },
    { id: 'miriti_parana', nombre: 'Miriti-Paraná' }
  ],
  
  arauca: [
    { id: 'arauca', nombre: 'Arauca' },
    { id: 'saravena', nombre: 'Saravena' },
    { id: 'tame', nombre: 'Tame' },
    { id: 'fortul', nombre: 'Fortul' },
    { id: 'puerto_rondon', nombre: 'Puerto Rondón' },
    { id: 'cravo_norte', nombre: 'Cravo Norte' },
    { id: 'arauquita', nombre: 'Arauquita' }
  ],
  
  boyaca: [
    { id: 'tunja', nombre: 'Tunja' },
    { id: 'duitama', nombre: 'Duitama' },
    { id: 'sogamoso', nombre: 'Sogamoso' },
    { id: 'chiquinquira', nombre: 'Chiquinquirá' },
    { id: 'puerto_boyaca', nombre: 'Puerto Boyacá' },
    { id: 'villa_de_leyva', nombre: 'Villa de Leyva' },
    { id: 'paipa', nombre: 'Paipa' },
    { id: 'nobsa', nombre: 'Nobsa' },
    { id: 'moniquira', nombre: 'Moniquirá' },
    { id: 'guateque', nombre: 'Guateque' }
  ],
  
  caqueta: [
    { id: 'florencia', nombre: 'Florencia' },
    { id: 'san_vicente_del_caguan', nombre: 'San Vicente del Caguán' },
    { id: 'la_montanita', nombre: 'La Montañita' },
    { id: 'puerto_rico', nombre: 'Puerto Rico' },
    { id: 'belen_de_los_andaquies', nombre: 'Belén de los Andaquíes' },
    { id: 'cartagena_del_chaira', nombre: 'Cartagena del Chairá' },
    { id: 'curillo', nombre: 'Curillo' },
    { id: 'el_doncello', nombre: 'El Doncello' }
  ],
  
  casanare: [
    { id: 'yopal', nombre: 'Yopal' },
    { id: 'aguazul', nombre: 'Aguazul' },
    { id: 'villanueva', nombre: 'Villanueva' },
    { id: 'tauramena', nombre: 'Tauramena' },
    { id: 'monterrey', nombre: 'Monterrey' },
    { id: 'paz_de_ariporo', nombre: 'Paz de Ariporo' },
    { id: 'trinidad', nombre: 'Trinidad' },
    { id: 'mani', nombre: 'Maní' }
  ],
  
  cauca: [
    { id: 'popayan', nombre: 'Popayán' },
    { id: 'santander_de_quilichao', nombre: 'Santander de Quilichao' },
    { id: 'puerto_tejada', nombre: 'Puerto Tejada' },
    { id: 'guapi', nombre: 'Guapi' },
    { id: 'silvia', nombre: 'Silvia' },
    { id: 'piendamo', nombre: 'Piendamó' },
    { id: 'miranda', nombre: 'Miranda' },
    { id: 'corinto', nombre: 'Corinto' },
    { id: 'caldono', nombre: 'Caldono' },
    { id: 'toribio', nombre: 'Toribío' }
  ],
  
  cesar: [
    { id: 'valledupar', nombre: 'Valledupar' },
    { id: 'aguachica', nombre: 'Aguachica' },
    { id: 'bosconia', nombre: 'Bosconia' },
    { id: 'codazzi', nombre: 'Codazzi' },
    { id: 'la_paz', nombre: 'La Paz' },
    { id: 'chimichagua', nombre: 'Chimichagua' },
    { id: 'el_copey', nombre: 'El Copey' },
    { id: 'astrea', nombre: 'Astrea' },
    { id: 'curumani', nombre: 'Curumaní' }
  ],
  
  choco: [
    { id: 'quibdo', nombre: 'Quibdó' },
    { id: 'istmina', nombre: 'Istmina' },
    { id: 'condoto', nombre: 'Condoto' },
    { id: 'riosucio_choco', nombre: 'Riosucio' },
    { id: 'acandi', nombre: 'Acandí' },
    { id: 'jurado', nombre: 'Juradó' },
    { id: 'nuqui', nombre: 'Nuquí' },
    { id: 'alto_baudo', nombre: 'Alto Baudó' },
    { id: 'bajo_baudo', nombre: 'Bajo Baudó' }
  ],
  
  cordoba: [
    { id: 'monteria', nombre: 'Montería' },
    { id: 'lorica', nombre: 'Lorica' },
    { id: 'cerete', nombre: 'Cereté' },
    { id: 'sahagun', nombre: 'Sahagún' },
    { id: 'planeta_rica', nombre: 'Planeta Rica' },
    { id: 'montelibano', nombre: 'Montelíbano' },
    { id: 'tierralta', nombre: 'Tierralta' },
    { id: 'ayapel', nombre: 'Ayapel' },
    { id: 'chinu', nombre: 'Chinú' },
    { id: 'san_pelayo', nombre: 'San Pelayo' }
  ],
  
  guainia: [
    { id: 'puerto_inirida', nombre: 'Puerto Inírida' },
    { id: 'barranco_minas', nombre: 'Barranco Minas' },
    { id: 'mapiripana', nombre: 'Mapiripana' },
    { id: 'san_felipe', nombre: 'San Felipe' },
    { id: 'la_guadalupe', nombre: 'La Guadalupe' }
  ],
  
  guaviare: [
    { id: 'san_jose_del_guaviare', nombre: 'San José del Guaviare' },
    { id: 'calamar', nombre: 'Calamar' },
    { id: 'el_retorno', nombre: 'El Retorno' },
    { id: 'miraflores', nombre: 'Miraflores' }
  ],
  
  la_guajira: [
    { id: 'riohacha', nombre: 'Riohacha' },
    { id: 'maicao', nombre: 'Maicao' },
    { id: 'uribia', nombre: 'Uribia' },
    { id: 'manaure', nombre: 'Manaure' },
    { id: 'villanueva_guajira', nombre: 'Villanueva' },
    { id: 'san_juan_del_cesar', nombre: 'San Juan del Cesar' },
    { id: 'fonseca', nombre: 'Fonseca' },
    { id: 'barrancas', nombre: 'Barrancas' },
    { id: 'hatonuevo', nombre: 'Hatonuevo' },
    { id: 'dibulla', nombre: 'Dibulla' }
  ],
  
  magdalena: [
    { id: 'santa_marta', nombre: 'Santa Marta' },
    { id: 'cienaga', nombre: 'Ciénaga' },
    { id: 'fundacion', nombre: 'Fundación' },
    { id: 'aracataca', nombre: 'Aracataca' },
    { id: 'el_banco', nombre: 'El Banco' },
    { id: 'plato', nombre: 'Plato' },
    { id: 'zona_bananera', nombre: 'Zona Bananera' },
    { id: 'pivijay', nombre: 'Pivijay' },
    { id: 'salamina_magdalena', nombre: 'Salamina' },
    { id: 'santa_ana', nombre: 'Santa Ana' }
  ],
  
  meta: [
    { id: 'villavicencio', nombre: 'Villavicencio' },
    { id: 'acacias', nombre: 'Acacias' },
    { id: 'granada_meta', nombre: 'Granada' },
    { id: 'puerto_lopez', nombre: 'Puerto López' },
    { id: 'san_martin', nombre: 'San Martín' },
    { id: 'puerto_gaitan', nombre: 'Puerto Gaitán' },
    { id: 'restrepo_meta', nombre: 'Restrepo' },
    { id: 'cumaral', nombre: 'Cumaral' },
    { id: 'fuente_de_oro', nombre: 'Fuente de Oro' },
    { id: 'la_macarena', nombre: 'La Macarena' }
  ],
  
  narino: [
    { id: 'pasto', nombre: 'Pasto' },
    { id: 'tumaco', nombre: 'Tumaco' },
    { id: 'ipiales', nombre: 'Ipiales' },
    { id: 'tuquerres', nombre: 'Túquerres' },
    { id: 'barbacoas', nombre: 'Barbacoas' },
    { id: 'la_union_narino', nombre: 'La Unión' },
    { id: 'sandona', nombre: 'Sandoná' },
    { id: 'samaniego', nombre: 'Samaniego' },
    { id: 'cumbal', nombre: 'Cumbal' },
    { id: 'ricaurte', nombre: 'Ricaurte' }
  ],
  
  norte_de_santander: [
    { id: 'cucuta', nombre: 'Cúcuta' },
    { id: 'villa_del_rosario', nombre: 'Villa del Rosario' },
    { id: 'los_patios', nombre: 'Los Patios' },
    { id: 'ocana', nombre: 'Ocaña' },
    { id: 'pamplona', nombre: 'Pamplona' },
    { id: 'tibu', nombre: 'Tibú' },
    { id: 'sardinata', nombre: 'Sardinata' },
    { id: 'chinacota', nombre: 'Chinácota' },
    { id: 'arboledas', nombre: 'Arboledas' },
    { id: 'zulia', nombre: 'Zulia' }
  ],
  
  putumayo: [
    { id: 'mocoa', nombre: 'Mocoa' },
    { id: 'puerto_asis', nombre: 'Puerto Asís' },
    { id: 'orito', nombre: 'Orito' },
    { id: 'valle_del_guamuez', nombre: 'Valle del Guamuez' },
    { id: 'puerto_caicedo', nombre: 'Puerto Caicedo' },
    { id: 'puerto_guzman', nombre: 'Puerto Guzmán' },
    { id: 'leguizamo', nombre: 'Leguízamo' },
    { id: 'sibundoy', nombre: 'Sibundoy' },
    { id: 'san_miguel', nombre: 'San Miguel' },
    { id: 'colon', nombre: 'Colón' }
  ],
  
  san_andres: [
    { id: 'san_andres', nombre: 'San Andrés' },
    { id: 'providencia', nombre: 'Providencia' },
    { id: 'santa_catalina', nombre: 'Santa Catalina' }
  ],
  
  sucre: [
    { id: 'sincelejo', nombre: 'Sincelejo' },
    { id: 'corozal', nombre: 'Corozal' },
    { id: 'sampues', nombre: 'Sampués' },
    { id: 'san_marcos', nombre: 'San Marcos' },
    { id: 'toluviejo', nombre: 'Toluviejo' },
    { id: 'santiago_de_tolu', nombre: 'Santiago de Tolú' },
    { id: 'covenas', nombre: 'Coveñas' },
    { id: 'galeras', nombre: 'Galeras' },
    { id: 'los_palmitos', nombre: 'Los Palmitos' },
    { id: 'ovejas', nombre: 'Ovejas' }
  ],
  
  vaupes: [
    { id: 'mitu', nombre: 'Mitú' },
    { id: 'caruru', nombre: 'Caruru' },
    { id: 'pacoa', nombre: 'Pacoa' },
    { id: 'taraira', nombre: 'Taraira' },
    { id: 'papunaua', nombre: 'Papunaua' },
    { id: 'yavarate', nombre: 'Yavaraté' }
  ],
  
  vichada: [
    { id: 'puerto_carreno', nombre: 'Puerto Carreño' },
    { id: 'la_primavera', nombre: 'La Primavera' },
    { id: 'santa_rosalia', nombre: 'Santa Rosalía' },
    { id: 'cumaribo', nombre: 'Cumaribo' },
    { id: 'puerto_colombia_vichada', nombre: 'Puerto Colombia' }
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