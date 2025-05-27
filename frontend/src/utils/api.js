import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Crear instancia de axios
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Servicios de API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
}

export const solicitudesAPI = {
  getAll: () => api.get('/solicitudes'),
  getById: (id) => api.get(`/solicitudes/${id}`),
  create: (data) => api.post('/solicitudes', data),
  update: (id, data) => api.put(`/solicitudes/${id}`, data),
  delete: (id) => api.delete(`/solicitudes/${id}`),
  getResultados: (id) => api.get(`/solicitudes/${id}/resultados`),
}

export const usuariosAPI = {
  getProfile: () => api.get('/usuarios/profile'),
  updateProfile: (data) => api.put('/usuarios/profile', data),
}

export default api
