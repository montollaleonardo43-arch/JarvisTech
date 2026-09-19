import axios from 'axios'

// Detecta la variable de entorno de Vercel o usa directamente la URL de producción
const BASE_URL = (import.meta.env.VITE_API_URL || 'https://jarvis-tech-tan.vercel.app').replace(/\/$/, '')

export const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Manejo de desautenticación global (401)
let onUnauthorizedCallback: (() => void) | null = null

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorizedCallback = handler
}

// Interceptor para adjuntar automáticamente el JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para capturar respuestas con error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && onUnauthorizedCallback) {
      onUnauthorizedCallback()
    }
    return Promise.reject(error)
  }
)

export default api