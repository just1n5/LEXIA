// API service súper simplificado
export const apiRequest = async (endpoint, options = {}) => {
  console.log('API Request:', endpoint, options);
  
  // Simular respuesta exitosa
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: [],
    message: 'API simulada funcionando'
  };
};

export default { apiRequest };
