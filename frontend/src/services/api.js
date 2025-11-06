import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores y refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: refreshToken,
          })

          const { access } = response.data
          localStorage.setItem('access_token', access)
          originalRequest.headers.Authorization = `Bearer ${access}`

          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    if (error.response?.status >= 500) {
      toast.error('Error del servidor. Por favor, intenta más tarde.')
    }

    return Promise.reject(error)
  }
)

// Servicios de autenticación
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login/', { email, password })
    // Obtener información del usuario del token o hacer una petición separada
    const userResponse = await api.get('/auth/usuarios/perfil/')
    return {
      access: response.data.access,
      refresh: response.data.refresh,
      user: userResponse.data,
    }
  },

  register: async (userData) => {
    return await api.post('/auth/usuarios/registro/', userData)
  },

  getProfile: async () => {
    const response = await api.get('/auth/usuarios/perfil/')
    return response.data
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },
}

// Servicios de carreras
export const carreraService = {
  getAll: async () => {
    const response = await api.get('/carreras/')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/carreras/${id}/`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/carreras/', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.patch(`/carreras/${id}/`, data)
    return response.data
  },

  delete: async (id) => {
    return await api.delete(`/carreras/${id}/`)
  },
}

// Servicios de anuncios
export const anuncioService = {
  getAll: async () => {
    const response = await api.get('/anuncios/')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/anuncios/${id}/`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/anuncios/', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.patch(`/anuncios/${id}/`, data)
    return response.data
  },

  delete: async (id) => {
    return await api.delete(`/anuncios/${id}/`)
  },

  registrarVista: async (id) => {
    return await api.post(`/anuncios/${id}/registrar_vista/`)
  },
}

export default api

