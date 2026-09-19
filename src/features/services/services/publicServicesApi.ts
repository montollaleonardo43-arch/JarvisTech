import axios, { InternalAxiosRequestConfig } from 'axios'

// Lectura segura de entorno compatible con TypeScript
const getEnvUrl = (): string => {
  try {
    return (import.meta as any).env?.VITE_API_URL || 'https://jarvis-tech-tan.vercel.app'
  } catch {
    return 'https://jarvis-tech-tan.vercel.app'
  }
}

const BASE_URL = getEnvUrl().replace(/\/$/, '')

export const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

let onUnauthorizedCallback: (() => void) | null = null

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorizedCallback = handler
}

// Interceptor de peticiones con tipado explícito
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error: unknown) => Promise.reject(error)
)

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (error?.response?.status === 401 && onUnauthorizedCallback) {
      onUnauthorizedCallback()
    }
    return Promise.reject(error)
  }
)

export default api