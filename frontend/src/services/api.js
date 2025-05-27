// Servicio API corregido SIN process.env
const API_BASE_URL = 'http://localhost:8000'; // URL fija por ahora

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Obtener token de localStorage si existe
  let token = null;
  try {
    token = localStorage.getItem('authToken');
  } catch (error) {
    console.log('No se pudo acceder a localStorage');
  }
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Export por defecto también
export default {
  apiRequest
};
