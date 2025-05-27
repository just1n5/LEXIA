import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../utils/api'

// Usar mock en desarrollo si no hay backend disponible
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV

// Mock auth para desarrollo
const mockAuth = {
  login: async (credentials) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Credenciales de prueba
    if (credentials.username === 'admin@test.com' && credentials.password === 'password') {
      const mockUser = {
        id: '1',
        email: 'admin@test.com',
        nombre: 'Juan Pérez',
        tipo_cuenta: 'personal'
      }
      
      return {
        data: {
          access_token: 'mock-token-12345',
          user: mockUser
        }
      }
    } else {
      throw new Error('Credenciales inválidas')
    }
  },
  
  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1200))
    return {
      data: {
        id: '2',
        email: userData.email,
        nombre: userData.nombre
      }
    }
  },
  
  me: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: {
        id: '1',
        email: 'admin@test.com',
        nombre: 'Juan Pérez',
        tipo_cuenta: 'personal'
      }
    }
  },
  
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { success: true }
  }
}

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Tipos de acciones
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER_START: 'LOAD_USER_START',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR',
}

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
    case AUTH_ACTIONS.LOAD_USER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
    case AUTH_ACTIONS.LOAD_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
    case AUTH_ACTIONS.LOAD_USER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }
    
    default:
      return state
  }
}

// Contexto
const AuthContext = createContext()

// Provider
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Cargar usuario al iniciar la aplicación
  useEffect(() => {
    loadUser()
  }, [])

  // Funciones de autenticación
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START })
      
      const api = USE_MOCK ? mockAuth : authAPI
      const response = await api.login(credentials)
      const { access_token, user } = response.data
      
      localStorage.setItem('accessToken', access_token)
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user })
      
      return { success: true }
    } catch (error) {
      const errorMessage = USE_MOCK 
        ? error.message 
        : (error.response?.data?.detail || 'Error al iniciar sesión')
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START })
      
      const api = USE_MOCK ? mockAuth : authAPI
      const response = await api.register(userData)
      const user = response.data
      
      // Después del registro exitoso, hacer login automático
      const loginResult = await login({
        username: userData.email,
        password: userData.password
      })
      
      if (loginResult.success) {
        return { success: true }
      } else {
        return { success: false, error: 'Error al iniciar sesión después del registro' }
      }
    } catch (error) {
      const errorMessage = USE_MOCK
        ? error.message
        : (error.response?.data?.detail || 'Error al crear la cuenta')
      dispatch({ type: AUTH_ACTIONS.REGISTER_FAILURE, payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      const api = USE_MOCK ? mockAuth : authAPI
      await api.logout()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      localStorage.removeItem('accessToken')
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
    }
  }

  const loadUser = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAILURE, payload: 'No token found' })
      return
    }

    try {
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_START })
      const api = USE_MOCK ? mockAuth : authAPI
      const response = await api.me()
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_SUCCESS, payload: response.data })
    } catch (error) {
      localStorage.removeItem('accessToken')
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAILURE, payload: 'Token inválido' })
    }
  }

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    loadUser,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export default AuthContext
